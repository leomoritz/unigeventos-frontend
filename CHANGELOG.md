# 📋 Changelog - UniEventos Frontend

Todas as mudanças importantes deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### ✨ Adicionado
- Sistema de Analytics do usuário com métricas em tempo real
- Integração com endpoints de analytics `/user-analytics/*`
- Hook personalizado `useUserAnalytics` para métricas do dashboard
- Seção LGPD completa com funcionalidade de exclusão de conta
- Modal de confirmação para exclusão com todas as implicações legais
- Serviço `lgpdService` para gerenciamento de dados pessoais

### 🔧 Alterado
- Dashboard do usuário agora usa dados dinâmicos da API
- Cards de estatísticas conectados com backend real
- Melhorada a formatação de valores monetários
- Aprimorada a experiência de loading e error states

### 🐛 Corrigido
- Problema no interceptor de autenticação durante registro
- Conflito entre localStorage e cookies para tokens JWT
- Validação de confirmação no modal de exclusão de conta

## [0.3.0] - 2024-11-15

### ✨ Adicionado
- **Dashboard Administrativo** completo com analytics
- **Gerenciamento de Organizadores** com CRUD completo
- **Sistema de Cupons** de desconto para eventos
- **Check-in de Participantes** com QR Code
- **Relatórios e Métricas** avançadas
- **Configurações de Pagamento** flexíveis

### 🔧 Alterado
- Migração completa para Next.js 15 App Router
- Atualização do React para versão 19
- Reorganização da estrutura de componentes
- Melhoria significativa na performance de carregamento

### 🐛 Corrigido
- Problemas de hidratação no SSR
- Validações de formulário mais robustas
- Tratamento de erros de API aprimorado

## [0.2.0] - 2024-10-28

### ✨ Adicionado
- **Dashboard do Usuário** com métricas pessoais
- **Sistema de Inscrições** em eventos
- **Gerenciamento de Perfil** com validações completas
- **Histórico de Participações** e status
- **Sistema de Notificações** toast
- **Validação de CPF/RG** com máscaras

### 🔧 Alterado
- Layout responsivo otimizado para mobile
- Navegação aprimorada entre páginas
- Estados de loading mais informativos
- Mensagens de erro mais claras

### 🐛 Corrigido
- Problemas de validação em formulários
- Máscaras de entrada funcionando corretamente
- Redirecionamentos após ações do usuário

## [0.1.0] - 2024-10-10

### ✨ Adicionado
- **Autenticação completa** (Login/Registro/Logout)
- **Sistema de Roles** (Admin/User/Organizer)
- **Páginas públicas** para visualização de eventos
- **Estrutura base** do projeto com Next.js
- **Design System** com TailwindCSS
- **Componentes UI** reutilizáveis

### 🔧 Configurações Iniciais
- Configuração do ambiente de desenvolvimento
- Integração com API backend
- Sistema de cookies seguro para autenticação
- Middleware de proteção de rotas
- Interceptadores HTTP com Axios

---

## 📝 Tipos de Mudança

- **✨ Adicionado** para novas funcionalidades
- **🔧 Alterado** para mudanças em funcionalidades existentes
- **⚠️ Descontinuado** para funcionalidades que serão removidas
- **❌ Removido** para funcionalidades removidas
- **🐛 Corrigido** para correções de bugs
- **🔐 Segurança** para correções de vulnerabilidades

---

## 🚀 Roadmap Futuro

### v0.4.0 - Próxima Release
- [ ] Sistema de Pagamentos online (PIX/Cartão)
- [ ] Chat em tempo real para eventos
- [ ] Notificações push no navegador
- [ ] App mobile (React Native)

### v0.5.0 - Melhorias de Experiência
- [ ] Modo offline para eventos
- [ ] Sincronização com calendários externos
- [ ] Sistema de avaliações de eventos
- [ ] Gamificação e badges de participação

### v1.0.0 - Release de Produção
- [ ] Auditoria completa de segurança
- [ ] Testes automatizados E2E
- [ ] Monitoramento e alertas
- [ ] Documentação completa da API

---

**Mantenha este arquivo atualizado a cada release!**