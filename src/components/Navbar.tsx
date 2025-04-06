import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Função para rolagem suave
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    closeMenu()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[#112240] ">
      <div className="container mx-auto px-8 max-w-[1400px]">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://cdn.discordapp.com/attachments/1357412927551836370/1358222737423990954/1.png?ex=67f30eff&is=67f1bd7f&hm=de556c25c927e14f81b4983e28b4d2512c570668bcad389e6d599531059c3e24&" 
                alt="Logo da Esquadrilha da Fumaça" 
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
              />
            </Link>
          </div>

          {/* Menu para desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary uppercase"
            >
              Início
            </button>
           
            <span className="text-muted-foreground">|</span>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary uppercase"
            >
              Sobre
            </button>
            
            <span className="text-muted-foreground">|</span>
            <button 
              onClick={() => scrollToSection('presentations')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary uppercase"
            >
              Apresentações
            </button>
            <span className="text-muted-foreground">|</span>
            <button 
              onClick={() => navigate('/demonstracao')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary uppercase"
            >
              Solicitar Demonstração
            </button>
            <span className="text-muted-foreground">|</span>
            <Link 
              to="/alistamento" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary uppercase"
            >
              Alistamento
            </Link>
            {user && (
              <span className="text-muted-foreground ">|</span>
            )}
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="uppercase">
                    Dashboard
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => logout()}
                  className="uppercase"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login" className='hidden '>
                <Button size="sm" >Login</Button>
              </Link>
            )}
          </div>

          {/* Botão do menu mobile */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="block w-full text-left py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('presentations')}
                className="block w-full text-left py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Apresentações
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Contato
              </button>
              <Link 
                to="/alistamento" 
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={closeMenu}
              >
                Alistamento
              </Link>
              {user ? (
                <div className="pt-2 space-y-2">
                  <Link to="/dashboard" onClick={closeMenu}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full justify-start"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <Link to="/login" onClick={closeMenu}>
                  <Button size="sm" className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
} 