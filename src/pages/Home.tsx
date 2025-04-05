import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { useState, useEffect, useRef } from 'react'
import { ptBR } from 'date-fns/locale'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { toast } from 'sonner'
import { sendDiscordNotification } from '@/lib/discord'
import { format, isBefore, isToday } from 'date-fns'
import { AiOutlineDiscord } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from 'framer-motion'
import { 
  PlaneIcon, 
  CalendarIcon, 
  TrophyIcon, 
  StarIcon, 
  ClockIcon, 
  MapPinIcon, 
  MailIcon, 
  MessageSquareIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon
} from 'lucide-react'

// Adicionando a interface para as apresentações
interface Presentation {
  id: string;
  city: string;
  date: Date;
  time: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const presentationSchema = z.object({
  city: z.string().min(1, 'Cidade é obrigatória'),
  email: z.string().email('Email inválido'),
  time: z.string().min(1, 'Horário é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  discordId: z.string().min(1, 'ID do Discord é obrigatório')
})

type PresentationForm = z.infer<typeof presentationSchema>

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

export default function Home() {
  const [date, setDate] = useState<Date>()
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [upcomingPresentations, setUpcomingPresentations] = useState<Presentation[]>([])
  const [pastPresentations, setPastPresentations] = useState<Presentation[]>([])
  const [loadingPresentations, setLoadingPresentations] = useState(true)

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

  // Referências para as seções
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const presentationsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Função para rolagem suave
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Função para buscar as apresentações aprovadas
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    const fetchPresentations = async () => {
      try {
        setLoadingPresentations(true)
        
        // Buscar apresentações aprovadas
        const presentationsQuery = query(
          collection(db, 'presentations'),
          where('status', '==', 'approved'),
          orderBy('date')
        )
        
        // Usar onSnapshot para obter atualizações em tempo real
        unsubscribe = onSnapshot(presentationsQuery, (snapshot) => {
          const presentations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate(),
            createdAt: doc.data().createdAt.toDate(),
            city: doc.data().city || '',
            time: doc.data().time || '',
            description: doc.data().description || '',
            status: doc.data().status as 'pending' | 'approved' | 'rejected'
          })) as Presentation[]
          
          const today = new Date()
          today.setHours(0, 0, 0, 0) // Normalizar para início do dia
          
          // Separar em próximas e anteriores
          const upcoming = presentations
            .filter(p => isToday(p.date) || isBefore(today, p.date))
            .sort((a, b) => a.date.getTime() - b.date.getTime()) // Ordenar da mais próxima para a mais distante
          
          const past = presentations
            .filter(p => !isToday(p.date) && isBefore(p.date, today))
            .sort((a, b) => b.date.getTime() - a.date.getTime()) // Ordenar da mais recente para a mais antiga
          
          setUpcomingPresentations(upcoming)
          setPastPresentations(past)
          setLoadingPresentations(false)
        }, (error) => {
          console.error('Erro ao observar apresentações:', error)
          setLoadingPresentations(false)
        })
      } catch (error) {
        console.error('Erro ao configurar observador de apresentações:', error)
        setLoadingPresentations(false)
      }
    }
    
    fetchPresentations()
    
    // Limpar o observador quando o componente for desmontado
    return () => unsubscribe()
  }, [])

  const onSubmit = async (data: PresentationForm) => {
    console.log("Função onSubmit chamada", data);
    
    if (!date) {
      toast.error('Selecione uma data para a apresentação')
      return
    }

    try {
      setLoading(true)
      console.log("Enviando dados...", { ...data, date })
      
      // Converter a data para Timestamp do Firestore
      const presentationData = {
        city: data.city,
        email: data.email,
        date: date,
        time: data.time,
        discordId: data.discordId,
        description: data.description,
        status: 'pending',
        createdAt: new Date()
      };
      
      console.log("Dados formatados:", presentationData);
      
      // Salvar no Firestore
      const docRef = await addDoc(collection(db, 'presentations'), presentationData);
      console.log("Documento criado com ID:", docRef.id);
      
      // Enviar notificação para o Discord
      try {
        const notificationSent = await sendDiscordNotification({
          ...presentationData,
          id: docRef.id
        });
        
        if (notificationSent) {
          console.log("Notificação enviada com sucesso para o Discord");
        } else {
          console.warn("Falha ao enviar notificação para o Discord");
        }
      } catch (discordError) {
        console.error("Erro ao enviar notificação para o Discord:", discordError);
        // Não interromper o fluxo se a notificação falhar
      }
      
      toast.success('Solicitação enviada! Entraremos em contato em breve.')
      form.reset()
      setDate(undefined)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao enviar:", error)
      toast.error('Erro ao enviar solicitação. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  // Função para calcular dias restantes
  const getDaysRemaining = (date: Date): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const presentationDate = new Date(date)
    presentationDate.setHours(0, 0, 0, 0)
    
    // Diferença em milissegundos
    const diffTime = presentationDate.getTime() - today.getTime()
    
    // Converter para dias
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Retorna o texto para o badge de tempo
  const getTimeText = (date: Date): { text: string, color: string } => {
    if (isToday(date)) {
      return { text: 'Hoje', color: 'bg-blue-500' }
    }
    
    const daysRemaining = getDaysRemaining(date)
    
    if (daysRemaining === 1) {
      return { text: 'Amanhã', color: 'bg-green-500' }
    } else if (daysRemaining <= 7) {
      return { text: `${daysRemaining} dias`, color: 'bg-green-500' }
    } else if (daysRemaining <= 30) {
      return { text: `${daysRemaining} dias`, color: 'bg-yellow-500' }
    } else {
      return { text: `${daysRemaining} dias`, color: 'bg-purple-500' }
    }
  }

  return (
    <div className="min-h-screen bg-[#0A192F] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A192F]/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a href="#" className="text-xl font-bold">EDA</a>
              <div className="hidden md:flex space-x-6">
                <button onClick={() => scrollToSection(heroRef)} className="hover:text-blue-400 transition-colors">Início</button>
                <button onClick={() => scrollToSection(aboutRef)} className="hover:text-blue-400 transition-colors">Sobre</button>
                <button onClick={() => scrollToSection(presentationsRef)} className="hover:text-blue-400 transition-colors">Apresentações</button>
                <button onClick={() => scrollToSection(contactRef)} className="hover:text-blue-400 transition-colors">Contato</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F] to-[#112240] opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Esquadrilha da Ajuda</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">Sua jornada na aviação começa aqui</p>
            <Button 
              onClick={() => scrollToSection(aboutRef)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              Conheça-nos
              <ChevronDownIcon className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-[#112240]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold mb-6">Sobre a EDA</h2>
              <p className="text-gray-300 mb-6">
                A Esquadrilha da Ajuda é uma organização dedicada a promover a aviação e formar novos pilotos.
                Nossa missão é proporcionar uma experiência única no mundo da aviação, combinando conhecimento
                técnico com práticas realistas.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <TrophyIcon className="h-6 w-6 text-blue-400" />
                  <span>Experiência</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="h-6 w-6 text-blue-400" />
                  <span>Qualidade</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-6 w-6 text-blue-400" />
                  <span>Dedicação</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PlaneIcon className="h-6 w-6 text-blue-400" />
                  <span>Paixão</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-[#0A192F] rounded-lg shadow-xl"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Presentations Section */}
      <section ref={presentationsRef} className="py-20 bg-[#0A192F]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center">Próximas Apresentações</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingPresentations.map((presentation) => (
                <Card key={presentation.id} className="bg-[#112240] border-none">
                  <CardHeader>
                    <CardTitle className="text-xl">{presentation.city}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {format(presentation.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-blue-400" />
                        <span>{presentation.time}</span>
                      </div>
                      <p className="text-gray-300">{presentation.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 bg-[#112240]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Entre em Contato</h2>
            <p className="text-gray-300 mb-8">
              Estamos aqui para ajudar. Entre em contato conosco através do Discord ou solicite uma apresentação.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6"
              >
                Solicitar Apresentação
              </Button>
              <Button
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-400/10 px-8 py-6"
              >
                <AiOutlineDiscord className="mr-2 h-5 w-5" />
                Discord
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dialog para solicitação de apresentação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#112240] text-white border-none">
          <DialogHeader>
            <DialogTitle>Solicitar Apresentação</DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha o formulário abaixo para solicitar uma apresentação.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade</label>
              <Input
                {...form.register('city')}
                className="bg-[#0A192F] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                {...form.register('email')}
                type="email"
                className="bg-[#0A192F] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="bg-[#0A192F] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Horário</label>
              <Input
                {...form.register('time')}
                type="time"
                className="bg-[#0A192F] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ID do Discord</label>
              <Input
                {...form.register('discordId')}
                className="bg-[#0A192F] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                {...form.register('description')}
                className="bg-[#0A192F] border-gray-700 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 