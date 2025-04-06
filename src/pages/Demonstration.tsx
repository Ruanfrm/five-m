import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  PlaneIcon, 
  MapPinIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  CheckIcon
} from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { sendDiscordNotification } from '@/lib/discord'

// Componentes de animação
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const presentationSchema = z.object({
  city: z.string().min(1, 'Cidade é obrigatória'),
  email: z.string().email('Email inválido'),
  time: z.string().min(1, 'Horário é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  discordId: z.string().min(1, 'ID do Discord é obrigatório')
})

type PresentationForm = z.infer<typeof presentationSchema>

export default function Demonstration() {
  const [date, setDate] = useState<Date>()
  const [loading, setLoading] = useState(false)

  const form = useForm<PresentationForm>({
    resolver: zodResolver(presentationSchema),
    defaultValues: {
      city: '',
      email: '',
      time: '',
      description: '',
      discordId: ''
    }
  })

  const onSubmit = async (data: PresentationForm) => {
    if (!date) {
      toast.error('Selecione uma data para a apresentação')
      return
    }

    try {
      setLoading(true)
      
      const presentationData = {
        city: data.city,
        email: data.email,
        date: date,
        time: data.time,
        discordId: data.discordId,
        description: data.description,
        status: 'pending',
        createdAt: new Date()
      }
      
      // Salvar no Firestore
      const docRef = await addDoc(collection(db, 'presentations'), presentationData)
      
      // Enviar notificação para o Discord
      try {
        await sendDiscordNotification({
          ...presentationData,
          id: docRef.id,
          title: '🆕 Nova Solicitação de Demonstração'
        })
      } catch (discordError) {
        console.error("Erro ao enviar notificação para o Discord:", discordError)
      }
      
      toast.success('Solicitação enviada! Entraremos em contato em breve.')
      form.reset()
      setDate(undefined)
    } catch (error) {
      console.error("Erro ao enviar:", error)
      toast.error('Erro ao enviar solicitação. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-24">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 bg-[url('https://media.discordapp.net/attachments/1357412927551836370/1357855842069774436/image.png?ex=67f2620c&is=67f1108c&hm=f95ec559f4d33437e037df5348d85a0263a609ad2544f43531d6217646164300&=&format=webp&quality=lossless&width=974&height=789')] opacity-10"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full"
          >
            <PlaneIcon className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Agende uma Demonstração</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            Solicite uma Apresentação
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Traga a emoção da Esquadrilha da Fumaça para sua cidade. Preencha o formulário abaixo para solicitar uma demonstração.
          </motion.p>
        </div>
      </section>

      {/* Informações e Requisitos */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Informações */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn}>
                <h2 className="text-3xl font-bold mb-8">Informações Importantes</h2>
                
                <div className="space-y-6">
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CalendarIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Agendamento Antecipado</h3>
                          <p className="text-muted-foreground">
                            Solicite com pelo menos 30 dias de antecedência.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                

                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <UsersIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Público Mínimo</h3>
                          <p className="text-muted-foreground">
                            Recomendamos um público mínimo de 50 pessoas.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>

            {/* Formulário */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn}>
                <h2 className="text-3xl font-bold mb-8">Solicite Agora</h2>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    <Input
                      {...form.register('city')}
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...form.register('email')}
                      type="email"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data</label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="border rounded-md p-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Horário</label>
                    <Input
                      {...form.register('time')}
                      type="time"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">ID do Discord</label>
                    <Input
                      {...form.register('discordId')}
                      placeholder="Seu ID do Discord"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição do Evento</label>
                    <Textarea
                      {...form.register('description')}
                      placeholder="Descreva o evento e suas expectativas"
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Solicitação'}
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Processo de Solicitação */}
      <section className="py-24 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">
              Entenda o processo de solicitação e aprovação de uma demonstração.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10">
                  1
                </div>
                <Card className="border-2 pt-16 pb-8 px-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Solicitação</h3>
                  <p className="text-muted-foreground">
                    Preencha o formulário com todas as informações necessárias.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10">
                  2
                </div>
                <Card className="border-2 pt-16 pb-8 px-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Análise</h3>
                  <p className="text-muted-foreground">
                    Nossa equipe avaliará a viabilidade da demonstração.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10">
                  3
                </div>
                <Card className="border-2 pt-16 pb-8 px-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Confirmação</h3>
                  <p className="text-muted-foreground">
                    Você receberá a confirmação com todos os detalhes.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10">
                  4
                </div>
                <Card className="border-2 pt-16 pb-8 px-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Demonstração</h3>
                  <p className="text-muted-foreground">
                    Realização da apresentação no dia e horário marcados.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-blue-500/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ainda tem dúvidas?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Entre em nosso servidor do Discord para conversar diretamente com nossa equipe 
              e tirar suas dúvidas sobre o processo de solicitação.
            </p>
            <Button size="lg" asChild className="group">
              <a 
                href="https://discord.gg/qEw6ScPVZD" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span>Entrar no Discord</span>
                <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 