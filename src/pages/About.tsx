import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfoIcon, UsersIcon, CalendarIcon, TrophyIcon, PlaneIcon, StarIcon, AwardIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://th.bing.com/th/id/OIP.5aqbB7vnaUaePynkIZmnZwHaFC?rs=1&pid=ImgDetMain')] opacity-10"></div>
      <div className="container mx-auto px-4 py-24 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
              <PlaneIcon className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Esquadrilha da Fumaça</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Sobre a Esquadrilha da Fumaça
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A mais tradicional equipe de acrobacias aéreas do FiveM, 
              trazendo espetáculos de precisão e beleza para servidores de todo o Brasil.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-primary" />
                    Nossa História
                  </CardTitle>
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">Desde 2020</Badge>
                </div>
                <CardDescription className="text-base">
                  Como tudo começou e nossa evolução
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Fundada em 2020 por um grupo de entusiastas de aviação no FiveM, a Esquadrilha da Fumaça 
                  rapidamente se tornou referência em espetáculos aéreos virtuais, com mais de 200 apresentações 
                  realizadas em diversos servidores.
                </p>
                <p className="text-muted-foreground">
                  Nossa missão é proporcionar momentos únicos e inesquecíveis, combinando precisão, 
                  técnica e criatividade em cada apresentação.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-primary" />
                    Nossa Equipe
                  </CardTitle>
                  <Badge className="bg-blue-500/15 text-blue-500 ml-2 border-blue-500/20">12 Pilotos</Badge>
                </div>
                <CardDescription className="text-base">
                  Conheça os talentos por trás dos espetáculos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Nossa equipe é formada por pilotos experientes, cada um com habilidades específicas 
                  que complementam o grupo. Todos passam por treinamento rigoroso para garantir a 
                  segurança e qualidade de nossas performances.
                </p>
                <p className="text-muted-foreground">
                  Os membros da equipe são selecionados não apenas por suas habilidades técnicas, mas 
                  também pelo compromisso com a excelência e trabalho em equipe.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <AwardIcon className="h-5 w-5 text-primary" />
                    Apresentações
                  </CardTitle>
                  <Badge className="bg-green-500/15 text-green-500 ml-2 border-green-500/20">200+ Shows</Badge>
                </div>
                <CardDescription className="text-base">
                  O que esperar de nossos espetáculos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Cada apresentação da Esquadrilha da Fumaça é única, adaptada ao servidor e evento. 
                  Utilizamos técnicas avançadas de voo em formação, manobras sincronizadas e efeitos 
                  visuais espetaculares.
                </p>
                <p className="text-muted-foreground">
                  Nosso repertório inclui mais de 30 manobras diferentes, desde formações clássicas 
                  até figuras exclusivas desenvolvidas por nossa equipe.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">Conheça Mais Sobre Nossa Equipe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore nossa história, conheça nossos pilotos e descubra respostas para as perguntas mais frequentes
            </p>
          </motion.div>

          <Tabs defaultValue="achievements" className="mb-16">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 h-auto p-1 bg-muted/50 rounded-lg">
              <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <TrophyIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Conquistas</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <UsersIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Nosso Time</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <InfoIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Perguntas Frequentes</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="achievements" className="mt-8">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrophyIcon className="h-5 w-5 text-primary" />
                    Conquistas e Marcos
                  </CardTitle>
                  <CardDescription className="text-base">
                    Nossa trajetória de sucesso ao longo dos anos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge className="mt-1 bg-blue-500/15 text-blue-500 border-blue-500/20">2020</Badge>
                    <div>
                      <h3 className="text-lg font-medium">Fundação da Esquadrilha</h3>
                      <p className="text-muted-foreground">Primeira apresentação oficial com 5 pilotos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge className="mt-1 bg-blue-500/15 text-blue-500 border-blue-500/20">2021</Badge>
                    <div>
                      <h3 className="text-lg font-medium">Expansão da Equipe</h3>
                      <p className="text-muted-foreground">Crescimento para 8 pilotos e criação de novas manobras</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge className="mt-1 bg-blue-500/15 text-blue-500 border-blue-500/20">2022</Badge>
                    <div>
                      <h3 className="text-lg font-medium">Reconhecimento Nacional</h3>
                      <p className="text-muted-foreground">Participação nos maiores eventos de FiveM do Brasil</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge className="mt-1 bg-blue-500/15 text-blue-500 border-blue-500/20">2023</Badge>
                    <div>
                      <h3 className="text-lg font-medium">Internacionalização</h3>
                      <p className="text-muted-foreground">Primeiras apresentações em servidores internacionais</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="team" className="mt-8">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-primary" />
                    Conheça Nossa Equipe
                  </CardTitle>
                  <CardDescription className="text-base">
                    Os pilotos que tornam possível cada apresentação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UsersIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Comandante Silva</h3>
                      <p className="text-sm text-muted-foreground mb-2">Líder de Esquadrilha</p>
                      <p className="text-sm">Piloto desde o início da equipe, responsável pela coordenação geral e segurança dos voos.</p>
                    </div>
                    <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UsersIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Tenente Oliveira</h3>
                      <p className="text-sm text-muted-foreground mb-2">Piloto de Manobras</p>
                      <p className="text-sm">Especialista em manobras de alta dificuldade e precisão.</p>
                    </div>
                    <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UsersIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Sargento Costa</h3>
                      <p className="text-sm text-muted-foreground mb-2">Piloto de Formação</p>
                      <p className="text-sm">Responsável pelo posicionamento perfeito nas formações em voo.</p>
                    </div>
                    <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UsersIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Capitão Santos</h3>
                      <p className="text-sm text-muted-foreground mb-2">Coordenador Técnico</p>
                      <p className="text-sm">Desenvolve novas manobras e aprimora a técnica do grupo.</p>
                    </div>
                    <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UsersIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Tenente Ferreira</h3>
                      <p className="text-sm text-muted-foreground mb-2">Piloto de Show</p>
                      <p className="text-sm">Especialista em efeitos visuais e sincronização com música.</p>
                    </div>
                    <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UsersIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Sargento Ribeiro</h3>
                      <p className="text-sm text-muted-foreground mb-2">Piloto Novato</p>
                      <p className="text-sm">Mais recente adição à equipe, trazendo novas perspectivas.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="faq" className="mt-8">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <InfoIcon className="h-5 w-5 text-primary" />
                    Perguntas Frequentes
                  </CardTitle>
                  <CardDescription className="text-base">
                    Tire suas dúvidas sobre a Esquadrilha da Fumaça
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">1</span>
                      Como solicitar uma apresentação?
                    </h3>
                    <p className="text-muted-foreground pl-10">
                      Você pode solicitar uma apresentação através do formulário na página inicial ou entrando 
                      em contato pelo Discord. Recomendamos agendar com pelo menos 2 semanas de antecedência.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">2</span>
                      Qual o custo de uma apresentação?
                    </h3>
                    <p className="text-muted-foreground pl-10">
                      Nossas apresentações são gratuitas! Trabalhamos para promover a aviação virtual e trazer 
                      experiências únicas para a comunidade FiveM.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">3</span>
                      Quais são os requisitos técnicos?
                    </h3>
                    <p className="text-muted-foreground pl-10">
                      O servidor precisa ter suporte a aeronaves e capacidade para suportar as manobras. 
                      Nossa equipe fará uma avaliação técnica antes de confirmar a apresentação.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">4</span>
                      Como posso me juntar à equipe?
                    </h3>
                    <p className="text-muted-foreground pl-10">
                      Periodicamente abrimos processo seletivo para novos pilotos. Os requisitos incluem 
                      experiência com voo no FiveM, disponibilidade para treinamentos e comprometimento 
                      com a equipe.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-8 mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Quer agendar uma apresentação?</h2>
            <p className="text-muted-foreground mb-6">
              Entre em contato conosco pelo Discord ou através do formulário na página inicial para 
              obter mais informações sobre nossos serviços, apresentações ou para agendar um show em seu servidor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://discord.gg/seu-discord" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-discord"><path d="M18 6a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h1v3.93c0 .47-.25.9-.66 1.15l-.09.06c-.42.25-.95.25-1.37 0l-.09-.06a1.34 1.34 0 0 1-.66-1.15V16H9a3 3 0 0 0-3-3V6a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3v7a3 3 0 0 0-3 3v3.93c0 .47.25.9.66 1.15l.09.06c.42.25.95.25 1.37 0l.09-.06a1.34 1.34 0 0 0 .66-1.15V16h1a3 3 0 0 0 3-3V6Z"/></svg>
                Entrar no Discord
              </a>
              <a 
                href="/#contact" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-background border border-input rounded-lg font-medium hover:bg-muted transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Formulário de Contato
              </a>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full"
          >
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Próximas apresentações</span>
          </motion.div>
          <h2 className="text-3xl font-bold mb-6">Confira nossa agenda e não perca os próximos shows!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Acompanhe nossas redes sociais para ficar por dentro das datas e locais das próximas apresentações 
            da Esquadrilha da Fumaça no mundo do FiveM.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">15 de Maio</h3>
              <p className="text-muted-foreground">Apresentação especial no servidor RP Brasil</p>
            </div>
            <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">22 de Junho</h3>
              <p className="text-muted-foreground">Show de manobras no evento de verão FiveM</p>
            </div>
            <div className="bg-card/50 p-6 rounded-lg border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">10 de Julho</h3>
              <p className="text-muted-foreground">Apresentação internacional no servidor Global RP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 