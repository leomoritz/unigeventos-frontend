# 🎯 UniEventos Frontend

<div align="center">

![UniEventos Logo](public/favicon.ico)

**Plataforma de Gerenciamento de Eventos para o Uni Movimento**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)

</div>

## 📋 Sobre o Projeto

O **UniEventos** é uma plataforma moderna e intuitiva desenvolvida para o **Uni Movimento** (ministério de jovens de igreja cristã), permitindo o gerenciamento completo de eventos, inscrições e participantes. A aplicação oferece uma experiência fluida tanto para administradores quanto para usuários finais.

### 🎯 Funcionalidades Principais

#### 👤 **Para Usuários**
- ✅ **Cadastro e Autenticação** com validação completa
- ✅ **Dashboard Personalizado** com métricas em tempo real
- ✅ **Inscrições em Eventos** com sistema de pagamento integrado
- ✅ **Gerenciamento de Perfil** com validações CPF/RG, telefone e email
- ✅ **Histórico de Participações** e status de inscrições
- ✅ **Configurações de Privacidade** conforme LGPD
- ✅ **Sistema de Notificações** para atualizações importantes

#### 👨‍💼 **Para Administradores**
- ✅ **Gerenciamento de Eventos** (criação, edição, publicação)
- ✅ **Controle de Organizadores** e permissões
- ✅ **Dashboard Analytics** com métricas avançadas
- ✅ **Gestão de Inscrições** e check-ins
- ✅ **Sistema de Cupons** de desconto
- ✅ **Relatórios Detalhados** e exportação de dados
- ✅ **Configurações de Pagamento** flexíveis

## 🚀 Tecnologias Utilizadas

### **Core**
- **[Next.js 15.2.4](https://nextjs.org/)** - Framework React para produção
- **[React 19](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript 5](https://www.typescriptlang.org/)** - Superset tipado do JavaScript

### **Styling & UI**
- **[TailwindCSS 3.4](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não-estilizados
- **[Lucide React](https://lucide.dev/)** - Ícones modernos e consistentes
- **[Framer Motion](https://www.framer.com/motion/)** - Animações fluidas

### **Formulários & Validação**
- **[React Hook Form](https://react-hook-form.com/)** - Formulários performáticos
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[React Input Mask](https://github.com/sanniassin/react-input-mask)** - Máscaras de entrada

### **HTTP & Estado**
- **[Axios](https://axios-http.com/)** - Cliente HTTP com interceptadores
- **[JWT Decode](https://github.com/auth0/jwt-decode)** - Decodificação de tokens
- **[React Toastify](https://fkhadra.github.io/react-toastify/)** - Notificações elegantes

### **Utilitários**
- **[Date-fns](https://date-fns.org/)** - Manipulação moderna de datas
- **[Lodash](https://lodash.com/)** - Utilitários JavaScript
- **[HTML2Canvas](https://html2canvas.hertzen.com/)** - Capturas de tela
- **[jsPDF](https://github.com/parallax/jsPDF)** - Geração de PDFs

## 🛠️ Setup do Ambiente de Desenvolvimento

### **Pré-requisitos**

Certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))

### **Clonando o Repositório**

```bash
# Clone o repositório
git clone https://github.com/leomoritz/unieventos-frontend.git

# Navegue para o diretório
cd unieventos-frontend
```

### **Instalação de Dependências**

```bash
# Instale as dependências
npm install

# Ou usando yarn
yarn install
```

### **Configuração de Ambiente**

1. **Crie o arquivo de ambiente:**
```bash
cp .env.example .env.local
```

2. **Configure as variáveis de ambiente:**
```bash
# .env.local

# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:8001/rest/v1

# Configurações do Cloudflare Turnstile (opcional)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here

# Outras configurações específicas do ambiente
NEXT_PUBLIC_APP_ENV=development
```

### **Executando o Projeto**

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm run start

# Linting
npm run lint
```

A aplicação estará disponível em: **http://localhost:3000**

## 📁 Estrutura do Projeto

```
unieventos-frontend/
├── 📁 public/                  # Arquivos estáticos
├── 📁 src/
│   ├── 📁 app/                # App Router do Next.js
│   │   ├── 📁 (public)/       # Rotas públicas (login, registro)
│   │   ├── 📁 admin/          # Dashboard administrativo
│   │   ├── 📁 user/           # Dashboard do usuário
│   │   └── 📄 layout.tsx      # Layout raiz da aplicação
│   ├── 📁 components/         # Componentes reutilizáveis
│   │   ├── 📁 ui/            # Componentes base (botões, inputs)
│   │   ├── 📁 auth/          # Componentes de autenticação
│   │   ├── 📁 events/        # Componentes específicos de eventos
│   │   └── 📁 admin/         # Componentes administrativos
│   ├── 📁 hooks/             # Custom hooks
│   ├── 📁 lib/               # Configurações e utilitários
│   │   ├── 📄 apiClient.ts   # Cliente HTTP configurado
│   │   ├── 📄 cookieManager.ts # Gerenciamento de cookies
│   │   └── 📄 utils.ts       # Funções utilitárias
│   ├── 📁 services/          # Serviços de API
│   ├── 📁 schemas/           # Schemas de validação (Zod)
│   ├── 📁 types/             # Definições de tipos TypeScript
│   └── 📁 styles/            # Estilos globais e específicos
├── 📄 package.json           # Dependências e scripts
├── 📄 tailwind.config.js     # Configuração do TailwindCSS
├── 📄 tsconfig.json          # Configuração do TypeScript
└── 📄 next.config.ts         # Configuração do Next.js
```

## 🔗 Integração com Backend

A aplicação frontend se comunica com o backend através de uma API REST bem estruturada:

### **Endpoints Principais**
- **Autenticação:** `/auth/*`
- **Eventos:** `/events/*`
- **Usuários:** `/persons/*`
- **Analytics:** `/analytics/*` e `/user-analytics/*`
- **Pagamentos:** `/payments/*`
- **LGPD:** `/lgpd/*`

### **Configuração de API**
O cliente HTTP está configurado em `src/lib/apiClient.ts` com:
- ✅ Interceptadores de autenticação automática
- ✅ Refresh token handling
- ✅ Tratamento centralizado de erros
- ✅ Timeout configurável (30s)
- ✅ Suporte a cookies HttpOnly

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

### **Cores Principais**
- **Primary:** Orange (#EA580C) - Identidade visual do Uni Movimento
- **Secondary:** Gray (#6B7280) - Textos secundários e elementos neutros
- **Success:** Green (#10B981) - Ações positivas e confirmações
- **Error:** Red (#EF4444) - Alertas e mensagens de erro
- **Warning:** Yellow (#F59E0B) - Avisos e informações importantes

### **Tipografia**
- **Font Family:** Inter (Google Fonts)
- **Tamanhos:** Scale responsiva (text-sm → text-4xl)
- **Pesos:** Regular (400), Medium (500), Semibold (600), Bold (700)

## 🔐 Segurança e Compliance

### **Autenticação & Autorização**
- ✅ **JWT Tokens** com refresh automático
- ✅ **Cookies HttpOnly** para produção
- ✅ **Role-based Access Control** (Admin, User, Organizer)
- ✅ **Session Management** seguro

### **LGPD Compliance**
- ✅ **Consentimento explícito** para uso de dados
- ✅ **Direito ao esquecimento** (exclusão de conta)
- ✅ **Portabilidade de dados** (exportação)
- ✅ **Transparência** sobre uso dos dados

### **Validações Client-side**
- ✅ **CPF/CNPJ** com algoritmo de validação
- ✅ **E-mail** com regex robusta
- ✅ **Telefone** com máscara e validação
- ✅ **Senhas fortes** com critérios específicos

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:

- 📱 **Mobile First** - Design otimizado para dispositivos móveis
- 📲 **Tablets** - Layouts adaptados para telas médias
- 🖥️ **Desktop** - Experiência completa para telas grandes
- ⌚ **Smart Watches** - Elementos essenciais acessíveis

## 🚀 Deploy e Produção

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Build Manual**
```bash
# Build de produção
npm run build

# Servir arquivos estáticos
npm run start
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Guidelines de Desenvolvimento**
- ✅ Siga os padrões de código existentes
- ✅ Adicione testes quando apropriado
- ✅ Documente funções complexas
- ✅ Use TypeScript rigorosamente
- ✅ Mantenha componentes pequenos e reutilizáveis

## 📄 Licença

Este projeto é propriedade do **Uni Movimento** e está licenciado para uso interno da organização.

## 👥 Time de Desenvolvimento

- **Frontend Lead:** [Seu Nome]
- **Backend Integration:** [Nome do Dev Backend]
- **UI/UX Design:** [Nome do Designer]
- **Product Owner:** [Nome do PO]

---

<div align="center">

**Desenvolvido com ❤️ para o Uni Movimento**

*Conectando jovens através de eventos transformadores*

</div>
