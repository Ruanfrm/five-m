export default function Footer() {
  return (
    <footer className="border-t w-full bg-[#112240]">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">Esquadrilha da Fumaça</h3>
            <p className="text-muted-foreground">
              A mais tradicional equipe de acrobacias aéreas do FiveM
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground">
                  Sobre
                </a>
              </li>
              <li>
                <a href="/#schedule" className="text-muted-foreground hover:text-foreground">
                  Agenda
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Redes Sociais</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.gg/seu-discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/seu-instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Esquadrilha da Fumaça FiveM. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}