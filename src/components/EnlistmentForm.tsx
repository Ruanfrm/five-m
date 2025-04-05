import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { sendDiscordNotification } from '@/lib/discord'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { HelpCircle } from 'lucide-react'

interface FormData {
  nome: string
  sobrenome: string
  email: string
  discordNick: string
  motivoEntrada: string
  conhecimentoAviao: string
  idade: string
  vooFivem: string
  conheceEsquadrilha: string
  turno: string[]
}

export function EnlistmentForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    sobrenome: '',
    email: '',
    discordNick: '',
    motivoEntrada: '',
    conhecimentoAviao: '',
    idade: '',
    vooFivem: '',
    conheceEsquadrilha: '',
    turno: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userIP, setUserIP] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDiscordHelpOpen, setIsDiscordHelpOpen] = useState(false)

  // Obter o IP do usuário
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        setUserIP(data.ip)
      } catch (error) {
        console.error('Erro ao obter IP:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIP()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, turno: [...prev.turno, value] }
      } else {
        return { ...prev, turno: prev.turno.filter(item => item !== value) }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar campos obrigatórios
      if (!formData.nome || !formData.sobrenome || !formData.email || !formData.discordNick || 
          !formData.motivoEntrada || !formData.idade || !formData.vooFivem || 
          !formData.conheceEsquadrilha || formData.turno.length === 0) {
        toast.error('Por favor, preencha todos os campos obrigatórios')
        setIsSubmitting(false)
        return
      }

      // Verificar se o e-mail já existe
      const emailQuery = query(collection(db, 'alistamentos'), where('email', '==', formData.email))
      const emailSnapshot = await getDocs(emailQuery)
      
      if (!emailSnapshot.empty) {
        toast.error('Este e-mail já foi utilizado em uma solicitação anterior')
        setIsSubmitting(false)
        return
      }

      // Verificar se o IP já foi usado
      if (userIP) {
        const ipQuery = query(collection(db, 'alistamentos'), where('userIP', '==', userIP))
        const ipSnapshot = await getDocs(ipQuery)
        
        if (!ipSnapshot.empty) {
          toast.error('Já existe uma solicitação enviada deste dispositivo. Por favor, aguarde a análise.')
          setIsSubmitting(false)
          return
        }
      }

      // Salvar no Firebase
      await addDoc(collection(db, 'alistamentos'), {
        ...formData,
        userIP,
        createdAt: new Date()
      })

      // Enviar notificação para o Discord
      await sendDiscordNotification({
        city: 'N/A',
        email: formData.email,
        date: new Date(),
        time: 'N/A',
        discordId: formData.discordNick,
        description: `Nome: ${formData.nome} ${formData.sobrenome}\nEmail: ${formData.email}\nIdade: ${formData.idade}\nMotivo: ${formData.motivoEntrada}\nConhecimento: ${formData.conhecimentoAviao}\nVoo FIVEM: ${formData.vooFivem}\nConhece Esquadrilha: ${formData.conheceEsquadrilha}\nTurno: ${formData.turno.join(', ')}`,
        status: 'pending',
        createdAt: new Date(),
        title: '🛩️ Nova Solicitação de Alistamento'
      })

      toast.success('Formulário enviado com sucesso!')
      setFormData({
        nome: '',
        sobrenome: '',
        email: '',
        discordNick: '',
        motivoEntrada: '',
        conhecimentoAviao: '',
        idade: '',
        vooFivem: '',
        conheceEsquadrilha: '',
        turno: []
      })
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      toast.error('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Formulário de Alistamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome *</Label>
                <Input
                  id="sobrenome"
                  name="sobrenome"
                  value={formData.sobrenome}
                  onChange={handleInputChange}
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Seu e-mail"
                required
              />
            </div>

            {/* Discord Nick */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="discordNick">Digite seu nick do discord *</Label>
                <Dialog open={isDiscordHelpOpen} onOpenChange={setIsDiscordHelpOpen}>
                  <DialogTrigger asChild>
                    <Badge variant="outline" className="cursor-pointer flex items-center gap-1">
                      <HelpCircle size={14} />
                      Como obter o seu Nick?
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Como obter seu Nick do Discord</DialogTitle>
                      <DialogDescription>
                        Siga o passo a passo abaixo para encontrar seu Nick do Discord
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Passo 1: Abra o Discord</h3>
                        <p className="text-sm text-muted-foreground">
                          Abra o aplicativo do Discord no seu computador ou dispositivo móvel.
                        </p>
                        {/* Aqui você pode adicionar uma imagem do Discord */}
                        <div className="bg-muted p-4 rounded-md text-center text-sm text-muted-foreground overflow-hidden">
                          <img src="/src/assets/abra-o-discord.png" alt="Abra o discord" className="w-full h-auto max-h-[300px] object-contain" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Passo 2: Clique no seu nome de usuário</h3>
                        <p className="text-sm text-muted-foreground">
                          Clique no seu nome de usuário no canto inferior esquerdo da tela.
                        </p>
                        {/* Aqui você pode adicionar uma imagem do nome de usuário */}
                        <div className="bg-muted p-4 rounded-md text-center text-sm text-muted-foreground overflow-hidden">
                        <img src="/src/assets/nome-usuario-discord.jpeg" alt="Abra o discord" className="w-full h-auto max-h-[300px] object-contain" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Passo 3: Copie seu nome de usuário</h3>
                        <p className="text-sm text-muted-foreground">
                          Seu nome de usuário é o texto que aparece acima do seu avatar. Copie esse texto exatamente como está.
                        </p>
                        {/* Aqui você pode adicionar uma imagem do nome de usuário destacado */}
                        <div className="bg-muted p-4 rounded-md text-center text-sm text-muted-foreground overflow-hidden">
                        <img src="/src/assets/usuario.jpeg" alt="Abra o discord" className="w-full h-auto max-h-[300px] object-contain" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Passo 4: Cole no formulário</h3>
                        <p className="text-sm text-muted-foreground">
                          Cole o nome de usuário copiado no campo "Digite seu nick do discord" no formulário.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Input
                id="discordNick"
                name="discordNick"
                value={formData.discordNick}
                onChange={handleInputChange}
                placeholder="Seu nick no Discord"
                required
              />
            </div>

            {/* Motivo de entrada */}
            <div className="space-y-2">
              <Label htmlFor="motivoEntrada">Por que deseja entrar na Esquadrilha da Fumaça FIVEM? *</Label>
              <Textarea
                id="motivoEntrada"
                name="motivoEntrada"
                value={formData.motivoEntrada}
                onChange={handleInputChange}
                placeholder="Explique por que você deseja se juntar à nossa equipe"
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Conhecimento em aviação */}
            <div className="space-y-2">
              <Label>Você tem algum conhecimento em aviação? Gosta da atividade aeronáutica? *</Label>
              <RadioGroup 
                value={formData.conhecimentoAviao} 
                onValueChange={(value: string) => handleRadioChange('conhecimentoAviao', value)}
                className="flex flex-col space-y-2"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sem_conhecimento" id="sem_conhecimento" />
                  <Label htmlFor="sem_conhecimento">Não tenho conhecimento, mas estou disposto a aprender.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="com_conhecimento" id="com_conhecimento" />
                  <Label htmlFor="com_conhecimento">Sim, tenho conhecimento e gosto de aviação</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Idade */}
            <div className="space-y-2">
              <Label htmlFor="idade">Qual a sua idade? *</Label>
              <Input
                id="idade"
                name="idade"
                type="number"
                min="16"
                value={formData.idade}
                onChange={handleInputChange}
                placeholder="Sua idade"
                required
              />
            </div>

            {/* Voo FIVEM */}
            <div className="space-y-2">
              <Label>Você já fez algum VOO no FIVEM? *</Label>
              <RadioGroup 
                value={formData.vooFivem} 
                onValueChange={(value: string) => handleRadioChange('vooFivem', value)}
                className="flex flex-col space-y-2"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="voo_sim" />
                  <Label htmlFor="voo_sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="voo_nao" />
                  <Label htmlFor="voo_nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conhece Esquadrilha */}
            <div className="space-y-2">
              <Label>Conhece a Esquadrilha da Fumaça na vida real? *</Label>
              <RadioGroup 
                value={formData.conheceEsquadrilha} 
                onValueChange={(value: string) => handleRadioChange('conheceEsquadrilha', value)}
                className="flex flex-col space-y-2"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="conhece_sim" />
                  <Label htmlFor="conhece_sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="conhece_nao" />
                  <Label htmlFor="conhece_nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Turno */}
            <div className="space-y-2">
              <Label>Em qual turno você pode logar para os treinos? *</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="turno_manha" 
                    checked={formData.turno.includes('manha')}
                    onCheckedChange={(checked: boolean) => handleCheckboxChange('manha', checked)}
                  />
                  <Label htmlFor="turno_manha">Manhã</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="turno_tarde" 
                    checked={formData.turno.includes('tarde')}
                    onCheckedChange={(checked: boolean) => handleCheckboxChange('tarde', checked)}
                  />
                  <Label htmlFor="turno_tarde">Tarde</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="turno_noite" 
                    checked={formData.turno.includes('noite')}
                    onCheckedChange={(checked: boolean) => handleCheckboxChange('noite', checked)}
                  />
                  <Label htmlFor="turno_noite">Noite</Label>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Formulário'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>Campos marcados com * são obrigatórios</p>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 