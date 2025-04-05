# Landing Page - Esquadrilha da Fumaça

Landing page para a Esquadrilha da Fumaça, uma equipe de acrobacias aéreas do FiveM.

## Funcionalidades

- Página inicial com informações sobre a equipe
- Formulário de agendamento de apresentações
- Dashboard para gerenciamento de apresentações
- Sistema de autenticação
- Integração com Firebase
- Interface moderna e responsiva

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- Firebase
- React Router
- React Hook Form
- Zod
- Date-fns

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Firebase

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/landing-page-eda.git
cd landing-page-eda
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais do Firebase.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative a autenticação por email/senha
3. Crie um banco de dados Firestore
4. Configure as regras de segurança do Firestore
5. Copie as credenciais do projeto para o arquivo `.env`

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Contextos React
  ├── lib/           # Configurações e utilitários
  ├── pages/         # Páginas da aplicação
  └── App.tsx        # Componente principal
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
