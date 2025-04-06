import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { AiOutlineDiscord } from "react-icons/ai"
import { 
  MailIcon, 
  MessageSquareIcon, 
  UserIcon, 
  SendIcon,
  MapPinIcon,
  ArrowRightIcon,
  GlobeIcon,
  ClockIcon
} from 'lucide-react'

// Esquema de validação do formulário
const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Assunto é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres')
})

type ContactForm = z.infer<typeof contactSchema>

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

export default function Contact() {
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  })

  const onSubmit = async (data: ContactForm) => {
    try {
      // Aqui você implementaria a lógica de envio do formulário
      console.log('Dados do formulário:', data)
      
      // Simulando envio
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      form.reset()
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente mais tarde.')
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
            <MessageSquareIcon className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Entre em Contato</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            Fale Conosco
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Estamos aqui para ajudar! Entre em contato conosco para tirar dúvidas, 
            fazer sugestões ou agendar uma apresentação.
          </motion.p>
        </div>
      </section>

      {/* Informações de Contato e Formulário */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Informações de Contato */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn}>
                <h2 className="text-3xl font-bold mb-8">Informações de Contato</h2>
                
                <div className="space-y-6">
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <GlobeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Discord</h3>
                          <p className="text-muted-foreground mb-4">
                            A maneira mais rápida de entrar em contato conosco é através do nosso servidor no Discord.
                          </p>
                          <Button asChild variant="outline" size="sm" className="group">
                            <a 
                              href="https://discord.gg/qEw6ScPVZD" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <AiOutlineDiscord size={18} />
                              <span>Entrar no Servidor</span>
                              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ClockIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Horário de Atendimento</h3>
                          <p className="text-muted-foreground">
                            Nossa equipe está disponível todos os dias das 14h às 22h (Horário de Brasília).
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPinIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Localização</h3>
                          <p className="text-muted-foreground">
                            Atuamos em todos os servidores de FiveM do Brasil.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>

            {/* Formulário de Contato */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn}>
                <Card className="border-2">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-8">Envie uma Mensagem</h2>
                    
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <UserIcon className="h-4 w-4 text-primary" />
                          Nome
                        </label>
                        <Input {...form.register('name')} className="border-2" />
                        {form.formState.errors.name && (
                          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <MailIcon className="h-4 w-4 text-primary" />
                          Email
                        </label>
                        <Input type="email" {...form.register('email')} className="border-2" />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <MessageSquareIcon className="h-4 w-4 text-primary" />
                          Assunto
                        </label>
                        <Input {...form.register('subject')} className="border-2" />
                        {form.formState.errors.subject && (
                          <p className="text-sm text-red-500">{form.formState.errors.subject.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <MessageSquareIcon className="h-4 w-4 text-primary" />
                          Mensagem
                        </label>
                        <Textarea 
                          {...form.register('message')} 
                          className="border-2 min-h-[150px]" 
                          placeholder="Digite sua mensagem aqui..."
                        />
                        {form.formState.errors.message && (
                          <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
                        )}
                      </div>

                      <Button type="submit" className="w-full group">
                        <span>Enviar Mensagem</span>
                        <SendIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
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
              e conhecer mais sobre nosso trabalho.
            </p>
            <Button size="lg" asChild className="group">
              <a 
                href="https://discord.gg/qEw6ScPVZD" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <AiOutlineDiscord size={20} className="group-hover:scale-110 transition-transform" />
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