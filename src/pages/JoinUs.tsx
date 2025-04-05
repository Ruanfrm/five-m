import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  PlaneIcon, 
  UsersIcon, 
  ArrowRightIcon,
  ShieldIcon,
  AwardIcon,
  ClockIcon,
  MapPinIcon
} from 'lucide-react'
import { EnlistmentForm } from '@/components/EnlistmentForm'

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

export default function JoinUs() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-24">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 bg-[url('https://th.bing.com/th/id/OIP.5aqbB7vnaUaePynkIZmnZwHaFC?rs=1&pid=ImgDetMain')] opacity-10"></div>
        
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
            <span className="text-primary font-medium">Junte-se à Nossa Equipe</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            Seja um Piloto EDA
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Estamos sempre em busca de pilotos talentosos e dedicados para se juntarem à nossa equipe.
            Preencha o formulário abaixo para iniciar seu processo de alistamento.
          </motion.p>
        </div>
      </section>

      {/* Requisitos e Benefícios */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Requisitos */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn}>
                <h2 className="text-3xl font-bold mb-8">Requisitos para Alistamento</h2>
                
                <div className="space-y-6">
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ShieldIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Idade Mínima</h3>
                          <p className="text-muted-foreground">
                            Ter pelo menos 16 anos de idade.
                          </p>
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
                          <h3 className="font-medium mb-2">Disponibilidade</h3>
                          <p className="text-muted-foreground">
                            Ter disponibilidade para participar de treinamentos e apresentações.
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
                            Residir no Brasil e ter acesso a servidores FiveM.
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
                          <h3 className="font-medium mb-2">Trabalho em Equipe</h3>
                          <p className="text-muted-foreground">
                            Ter espírito de equipe e disposição para colaborar com outros pilotos.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>

            {/* Benefícios */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn}>
                <h2 className="text-3xl font-bold mb-8">Benefícios de Ser um Piloto EDA</h2>
                
                <div className="space-y-6">
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <AwardIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Treinamento Especializado</h3>
                          <p className="text-muted-foreground">
                            Acesso a treinamentos exclusivos para melhorar suas habilidades de pilotagem.
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
                          <h3 className="font-medium mb-2">Comunidade Ativa</h3>
                          <p className="text-muted-foreground">
                            Fazer parte de uma comunidade de pilotos apaixonados e experientes.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <PlaneIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Experiência Prática</h3>
                          <p className="text-muted-foreground">
                            Oportunidade de participar de apresentações e eventos em servidores FiveM.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ShieldIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Reconhecimento</h3>
                          <p className="text-muted-foreground">
                            Ser reconhecido como parte de uma das equipes de demonstração aérea mais respeitadas do Brasil.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Processo de Alistamento */}
      <section className="py-24 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Processo de Alistamento</h2>
            <p className="text-xl text-muted-foreground">
              Nosso processo de alistamento é simples e transparente. Siga os passos abaixo para se tornar um piloto EDA.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
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
                  <h3 className="text-xl font-bold mb-4">Preencha o Formulário</h3>
                  <p className="text-muted-foreground">
                    Preencha o formulário de alistamento com suas informações pessoais e experiência.
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
                  <h3 className="text-xl font-bold mb-4">Entrevista</h3>
                  <p className="text-muted-foreground">
                    Após análise do formulário, você será convocado para uma entrevista com nossa equipe.
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
                  <h3 className="text-xl font-bold mb-4">Treinamento</h3>
                  <p className="text-muted-foreground">
                    Se aprovado, você iniciará o treinamento para se tornar um piloto EDA oficial.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de Alistamento */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Formulário de Alistamento</h2>
            <p className="text-xl text-muted-foreground">
              Preencha o formulário abaixo para iniciar seu processo de alistamento como piloto EDA.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <EnlistmentForm />
          </motion.div>
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
              e tirar suas dúvidas sobre o processo de alistamento.
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