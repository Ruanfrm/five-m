import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from 'framer-motion'
import { 
  PlaneIcon, 
  TrophyIcon, 
  StarIcon, 
  ClockIcon, 
  
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

interface CarouselImage {
  id: string
  url: string
  title: string
  description: string
  order: number
  createdAt: Date
}

interface Pilot {
  id: string
  name: string
  position: string
  photoURL: string
  order: number
  createdAt: Date
}

const presentationSchema = z.object({
  city: z.string().min(1, 'Cidade é obrigatória'),
  email: z.string().email('Email inválido'),
  time: z.string().min(1, 'Horário é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  discordId: z.string().min(1, 'ID do Discord é obrigatório')
})

type PresentationForm = z.infer<typeof presentationSchema>


export default function Home() {
  const [date, setDate] = useState<Date>()
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [upcomingPresentations, setUpcomingPresentations] = useState<Presentation[]>([])
  const [pastPresentations, setPastPresentations] = useState<Presentation[]>([])
  const [loadingPresentations, setLoadingPresentations] = useState(true)
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])
  const [loadingCarousel, setLoadingCarousel] = useState(true)
  const [pilots, setPilots] = useState<Pilot[]>([])
  const [loadingPilots, setLoadingPilots] = useState(true)

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
    
    // Carregar imagens do carrossel
    const carouselQuery = query(collection(db, 'carousel'), orderBy('order', 'asc'))
    const unsubscribeCarousel = onSnapshot(carouselQuery, (snapshot) => {
      const imagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as CarouselImage[]
      setCarouselImages(imagesData)
      setLoadingCarousel(false)
    }, (error) => {
      console.error('Erro ao carregar imagens do carrossel:', error)
      setLoadingCarousel(false)
    })

    // Carregar pilotos
    const pilotsQuery = query(collection(db, 'pilots'), orderBy('order', 'asc'))
    const unsubscribePilots = onSnapshot(pilotsQuery, (snapshot) => {
      const pilotsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Pilot[]
      setPilots(pilotsData)
      
      setLoadingPilots(false)
    }, (error) => {
      console.error('Erro ao carregar pilotos:', error)
      setLoadingPilots(false)
    })

    // Limpar o observador quando o componente for desmontado
    return () => {
      unsubscribe()
      unsubscribeCarousel()
      unsubscribePilots()
    }
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
      
      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://media.discordapp.net/attachments/1357412927551836370/1357855842069774436/image.png?ex=67f2620c&is=67f1108c&hm=f95ec559f4d33437e037df5348d85a0263a609ad2544f43531d6217646164300&=&format=webp&quality=lossless&width=974&height=789')",
            opacity: 0.2
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F] to-[#112240] opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 
              className="mb-10 text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white via-blue-300 to-[#0A192F] bg-clip-text text-transparent animate-gradient-y bg-[length:100%_400%]"
             
            >
              Esquadrilha da Fumaça
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in">
              Somos uma equipe de pilotos apaixonados por aviação, trazendo emoção e espetáculo aos céus do Brasil.
            </p>
            <Button 
              onClick={() => scrollToSection(aboutRef)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg animate-bounce-slow"
            >
              Conheça-nos
              <ChevronDownIcon className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      {/* Carousel Section */}
      <section className="py-10 bg-[#0A192F]" id='carousel'>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative w-full max-w-5xl mx-auto"
          >
            {loadingCarousel ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : carouselImages.length > 0 ? (
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {carouselImages.map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover aspect-video rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                          <h3 className="text-xl font-bold text-white">{image.title}</h3>
                          <p className="text-sm text-gray-200">{image.description}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Nenhuma imagem disponível no carrossel.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-20 bg-[#112240]">
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
              
            </div>
            <div className="relative">
              <img
                src="https://cdn.discordapp.com/attachments/1357412927551836370/1358222737423990954/1.png?ex=67f30eff&is=67f1bd7f&hm=de556c25c927e14f81b4983e28b4d2512c570668bcad389e6d599531059c3e24&"
                alt="Logo da Esquadrilha da Fumaça"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pilots Section */}
      <section id="pilots" className="py-20 bg-[#0A192F]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center">Nossos Pilotos</h2>
            
            <div className="relative w-full max-w-4xl mx-auto">
              {/* Formação dos A-29 */}
              <div className="relative h-[500px] ">
                {/* Líder */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 text-center">
                  <p className="text-sm font-semibold mb-1">#1 - Líder</p>
                  <p className="text-sm text-gray-400">
                    {pilots.find(p => p.position === "1")?.name || ""}
                  </p>
                  <img src="src/assets/a29.svg" alt="A-29" className="w-24 mb-1" />
                 
                </div>

                {/* Elementos 2 e 3 */}
                <div className="absolute right-[35%] top-[25%] text-center">
                  <p className="text-sm font-semibold mb-1">#2 - Ala Direito</p>
                  <p className="text-sm text-gray-400">
                    {pilots.find(p => p.position === "2")?.name || ""}
                  </p>
                  <img src="src/assets/a29.svg" alt="A-29" className="w-24 mb-1" />
                  
                </div>
                <div className="absolute left-[35%] top-[25%] text-center">
                  <p className="text-sm font-semibold mb-1">#3 - Ala Esquerdo</p>
                  <p className="text-sm text-gray-400">
                    {pilots.find(p => p.position === "3")?.name || ""}
                  </p>
                  <img src="src/assets/a29.svg" alt="A-29" className="w-24 mb-1" />
                 
                </div>

                {/* Elementos 4, 5 e 6 */}
                <div className="absolute left-[20%] top-[50%] text-center">
                  <p className="text-sm font-semibold mb-1">#5 - Ala Esquerdo Externo</p>
                  <p className="text-sm text-gray-400">
                    {pilots.find(p => p.position === "5")?.name || ""}
                  </p>
                  <img src="src/assets/a29.svg" alt="A-29" className="w-24 mb-1" />
                  
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-[50%] text-center">
                  <p className="text-sm font-semibold mb-1">#4 - Ferrolho</p>
                  <p className="text-sm text-gray-400">
                    {pilots.find(p => p.position === "4")?.name || ""}
                  </p>
                  <img src="src/assets/a29.svg" alt="A-29" className="w-24 mb-1" />
                  
                </div>
                <div className="absolute right-[20%] top-[50%] text-center">
                  <p className="text-sm font-semibold mb-1">#6 - Ala Direito Externo</p>
                  <p className="text-sm text-gray-400">
                    {pilots.find(p => p.position === "6")?.name || ""}
                  </p>
                  <img src="src/assets/a29.svg" alt="A-29" className="w-24 mb-1" />
                  
                </div>

                {/* Elemento 7 (base) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[75%] text-center">
                  <p className="text-sm font-semibold mb-1">#7 - Isolado</p>
                  <p className="text-sm text-gray-400">
                    {pilots.find(p => p.position === "7")?.name || ""}
                  </p>
                  <img src="src/assets/a29.svg" alt="A-29" className="w-24 mb-1" />
                  
                </div>
              </div>

              {/* Grid de pilotos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-24">
                {loadingPilots ? (
                  // Esqueleto de carregamento
                  Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="bg-[#112240] rounded-lg p-4 text-center animate-pulse">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
                    </div>
                  ))
                ) : pilots.length > 0 ? (
                  pilots.sort((a, b) => Number(a.position) - Number(b.position)).map((pilot) => (
                    <div key={pilot.id} className="bg-[#112240] rounded-lg p-4 text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full overflow-hidden">
                        <img 
                          src={pilot.photoURL} 
                          alt={pilot.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold">{pilot.name}</h3>
                      <p className="text-sm text-gray-400">
                        {(() => {
                          switch (pilot.position) {
                            case "1": return "1 - Líder"
                            case "2": return "2 - Ala Direito"
                            case "3": return "3 - Ala Esquerdo"
                            case "4": return "4 - Ferrolho"
                            case "5": return "5 - Ala Esquerdo Externo"
                            case "6": return "6 - Ala Direito Externo"
                            case "7": return "7 - Isolado"
                            default: return pilot.position
                          }
                        })()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    Nenhum piloto cadastrado.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Presentations Section */}
      <section id="presentations" ref={presentationsRef} className="py-20 bg-[#0A192F]">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-20 bg-[#112240]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Solicite uma Demonstração</h2>
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