import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import { AuthProvider } from '@/contexts/AuthContext'
import PrivateRoute from '@/components/PrivateRoute'
import { Toaster } from 'sonner'
import { retryPendingNotifications } from '@/lib/discord'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import JoinUs from './pages/JoinUs'

function AppContent() {
  useEffect(() => {
    // Verificar notificações pendentes ao iniciar o app
    const checkPendingNotifications = async () => {
      try {
        const count = await retryPendingNotifications();
        if (count > 0) {
          console.log(`Reenviadas ${count} notificações pendentes para o Discord.`);
        }
      } catch (error) {
        console.error("Erro ao verificar notificações pendentes:", error);
      }
    };
    
    // Aguardar o carregamento completo do app antes de tentar reenviar
    const timer = setTimeout(() => {
      checkPendingNotifications();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/alistamento" element={<JoinUs />} />

        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
