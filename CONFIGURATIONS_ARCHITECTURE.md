# Arquitetura da Tela de Configurações

## 🏛️ Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    ConfigurationLayout                          │
│  (Componente Genérico - Reutilizável)                           │
│                                                                  │
│  Props:                                                          │
│  - tabs: ConfigurationTab[]                                      │
│  - theme: "dark" | "light"                                       │
│  - userRole: "admin" | "user"                                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Header (Título + Descrição)                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Tabs Component                       │    │
│  │                                                          │    │
│  │  ┌──────────┬──────────┬──────────┬──────────┐        │    │
│  │  │  Aba 1   │  Aba 2   │  Aba 3   │  Aba 4   │        │    │
│  │  │  (Icon)  │  (Icon)  │  (Icon)  │  (Icon)  │        │    │
│  │  └──────────┴──────────┴──────────┴──────────┘        │    │
│  │                                                          │    │
│  │  ┌────────────────────────────────────────────┐        │    │
│  │  │        Conteúdo da Aba Selecionada         │        │    │
│  │  │                                              │        │    │
│  │  │  • PasswordResetSection                    │        │    │
│  │  │  • NotificationsSection                    │        │    │
│  │  │  • SecuritySection                         │        │    │
│  │  │  • Ou qualquer componente customizado      │        │    │
│  │  │                                              │        │    │
│  │  └────────────────────────────────────────────┘        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN                                    │
│                                                                  │
│  /configurations                                                 │
│       │                                                           │
│       ├─> ConfigurationLayout                                    │
│       │     - theme: "dark"                                       │
│       │     - userRole: "admin"                                   │
│       │                                                           │
│       └─> Tabs:                                                   │
│            ├─ Senha (PasswordResetSection - theme: dark)         │
│            ├─ Notificações (NotificationsSection)                │
│            ├─ Segurança (SecuritySection)                        │
│            └─ Sistema (SystemSection) [adminOnly]                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    USUÁRIO COMUM (Futuro)                        │
│                                                                  │
│  /configurations                                                 │
│       │                                                           │
│       ├─> ConfigurationLayout                                    │
│       │     - theme: "light"                                      │
│       │     - userRole: "user"                                    │
│       │                                                           │
│       └─> Tabs:                                                   │
│            ├─ Perfil (ProfileSection)                            │
│            ├─ Senha (PasswordResetSection - theme: light)        │
│            └─ Notificações (NotificationsSection)                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Fluxo de Alteração de Senha

```
┌─────────────────────────────────────────────────────────────────┐
│                  PasswordResetSection                            │
│                                                                  │
│  1. Usuário preenche formulário:                                 │
│     ├─ Senha atual                                               │
│     ├─ Nova senha                                                │
│     └─ Confirmação da nova senha                                 │
│                                                                  │
│  2. Validações Frontend:                                         │
│     ├─ Campos obrigatórios                                       │
│     ├─ Senhas coincidem                                          │
│     ├─ Nova senha ≠ senha atual                                  │
│     └─ validatePassword() → settingsService.ts                   │
│         ├─ Mínimo 8 caracteres                                   │
│         ├─ Letra maiúscula                                       │
│         ├─ Letra minúscula                                       │
│         └─ Número                                                │
│                                                                  │
│  3. Requisição para API:                                         │
│     └─ changePassword() → settingsService.ts                     │
│         ├─ Headers: Authorization: Bearer <token>               │
│         ├─ Body: { currentPassword, newPassword }               │
│         └─ URL: POST /rest/v1/auth/change-password              │
│                                                                  │
│  4. Resposta:                                                    │
│     ├─ Sucesso: Mensagem de confirmação + limpar campos         │
│     └─ Erro: Mensagem de erro                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Estrutura de Dependências

```
app/(admin)/configurations/page.tsx
    │
    ├─> ConfigurationLayout.tsx
    │   └─> Tabs.tsx
    │       └─> TabsList, TabsTrigger, TabsContent
    │
    ├─> PasswordResetSection.tsx
    │   ├─> Card.tsx (CardHeader, CardTitle, CardDescription, CardContent)
    │   ├─> Input.tsx
    │   ├─> Label.tsx
    │   ├─> Button.tsx
    │   └─> settingsService.ts
    │       ├─> changePassword()
    │       └─> validatePassword()
    │
    └─> Outras Seções (Notificações, Segurança, Sistema)
        └─> Card.tsx
```

## 🎨 Sistema de Temas

```
┌──────────────────────────────────────────────────────────────┐
│                       Theme System                            │
│                                                               │
│  theme prop → "dark" | "light"                                │
│                                                               │
│  ┌─────────────────────┐  ┌──────────────────────┐          │
│  │   DARK THEME        │  │   LIGHT THEME        │          │
│  │   (Admin)           │  │   (User - Futuro)    │          │
│  ├─────────────────────┤  ├──────────────────────┤          │
│  │ Background:         │  │ Background:          │          │
│  │  • #1e1e1e          │  │  • white             │          │
│  │  • #2b2b2b          │  │  • gray-50           │          │
│  │                     │  │                      │          │
│  │ Borders:            │  │ Borders:             │          │
│  │  • #333             │  │  • gray-200          │          │
│  │  • #444             │  │  • gray-300          │          │
│  │                     │  │                      │          │
│  │ Text:               │  │ Text:                │          │
│  │  • neutral-200      │  │  • gray-900          │          │
│  │  • neutral-400      │  │  • gray-600          │          │
│  │                     │  │                      │          │
│  │ Accent:             │  │ Accent:              │          │
│  │  • orange-500       │  │  • orange-500        │          │
│  └─────────────────────┘  └──────────────────────┘          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## 🚦 Controle de Acesso (Role-Based)

```
┌──────────────────────────────────────────────────────────────┐
│                  Tab Visibility Control                       │
│                                                               │
│  ConfigurationTab {                                           │
│    adminOnly?: boolean;                                       │
│    userOnly?: boolean;                                        │
│  }                                                            │
│                                                               │
│  ┌─────────────────────┐                                     │
│  │  Filtro de Abas     │                                     │
│  ├─────────────────────┤                                     │
│  │                     │                                     │
│  │  if (adminOnly &&   │                                     │
│  │      role !== admin)│                                     │
│  │    ↓ OCULTAR        │                                     │
│  │                     │                                     │
│  │  if (userOnly &&    │                                     │
│  │      role !== user) │                                     │
│  │    ↓ OCULTAR        │                                     │
│  │                     │                                     │
│  └─────────────────────┘                                     │
│                                                               │
│  Exemplo:                                                     │
│  • "Sistema" tab → adminOnly: true                           │
│    └─> Visível apenas para admin                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## 🔌 API Integration

```
┌──────────────────────────────────────────────────────────────┐
│                    settingsService.ts                         │
│                                                               │
│  changePassword(payload, token)                               │
│    ├─> Endpoint: POST /rest/v1/auth/change-password         │
│    ├─> Headers: Authorization: Bearer <token>               │
│    ├─> Body: { currentPassword, newPassword }               │
│    └─> Returns: { success, message }                        │
│                                                               │
│  validatePassword(password)                                   │
│    ├─> Verifica comprimento (min 8)                         │
│    ├─> Verifica maiúscula                                    │
│    ├─> Verifica minúscula                                    │
│    ├─> Verifica número                                       │
│    └─> Returns: { isValid, message? }                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Estado do Componente

```
PasswordResetSection State:
├─ currentPassword: string
├─ newPassword: string
├─ confirmPassword: string
├─ isLoading: boolean
├─ error: string
├─ success: string
├─ showCurrentPassword: boolean
├─ showNewPassword: boolean
└─ showConfirmPassword: boolean

ConfigurationLayout State:
└─ selectedTab: string (gerenciado pelo Tabs component)
```

## 📱 Responsividade

```
┌──────────────────────────────────────────────────────────────┐
│                    Responsive Design                          │
│                                                               │
│  Mobile (< 640px):                                            │
│  ├─ Tabs em stack vertical                                   │
│  ├─ Cards em largura total                                   │
│  └─ Padding reduzido                                         │
│                                                               │
│  Tablet (640px - 1024px):                                     │
│  ├─ Tabs horizontais com scroll                              │
│  ├─ Cards com padding médio                                  │
│  └─ Layout adaptativo                                        │
│                                                               │
│  Desktop (> 1024px):                                          │
│  ├─ Tabs horizontais fixas                                   │
│  ├─ Cards com largura máxima                                 │
│  └─ Layout completo                                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

**Nota:** Este diagrama representa a arquitetura completa do sistema de configurações, incluindo tanto a implementação atual (Admin) quanto a estrutura planejada para futuras expansões (Usuário Comum).
