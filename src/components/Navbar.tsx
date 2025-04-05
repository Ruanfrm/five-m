import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ModeToggle } from './mode-toggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                EDA FIVEM
              </span>
            </Link>
          </div>

          {/* Menu para desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/about" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Sobre
            </Link>
            <Link 
              to="/#schedule" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Agenda
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contato
            </Link>
            <Link 
              to="/alistamento" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Alistamento
            </Link>
            <ModeToggle />
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => logout()}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login" className='hidden'>
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
              <Link 
                to="/about" 
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={closeMenu}
              >
                Sobre
              </Link>
              <Link 
                to="/#schedule" 
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={closeMenu}
              >
                Agenda
              </Link>
              <Link 
                to="/contact" 
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={closeMenu}
              >
                Contato
              </Link>
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