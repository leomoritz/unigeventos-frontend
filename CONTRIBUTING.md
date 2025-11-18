# 🤝 Guia de Contribuição - UniEventos Frontend

Obrigado por considerar contribuir com o projeto UniEventos! Este documento fornece diretrizes para contribuições efetivas e consistentes.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
- [Estrutura de Commits](#estrutura-de-commits)
- [Pull Requests](#pull-requests)
- [Relatando Bugs](#relatando-bugs)
- [Sugerindo Features](#sugerindo-features)

## 🤗 Código de Conduta

Este projeto segue os valores cristãos do Uni Movimento. Esperamos que todos os contribuidores:

- Sejam respeitosos e profissionais
- Mantenham comunicação construtiva
- Foquem no bem comum do projeto
- Respeitem diferentes pontos de vista
- Ajudem a criar um ambiente acolhedor

## 🚀 Como Contribuir

### 1. **Configuração do Ambiente**

```bash
# Fork o repositório
git clone https://github.com/SEU-USUARIO/unieventos-frontend.git
cd unieventos-frontend

# Adicione o repositório original como upstream
git remote add upstream https://github.com/leomoritz/unieventos-frontend.git

# Instale as dependências
npm install

# Crie o arquivo de ambiente
cp .env.example .env.local
```

### 2. **Fluxo de Desenvolvimento**

```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma nova branch para sua feature/correção
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug

# Faça suas alterações e commits
git add .
git commit -m "feat: adiciona nova funcionalidade X"

# Push para seu fork
git push origin feature/nome-da-feature

# Abra um Pull Request
```

## 📏 Padrões de Desenvolvimento

### **Estrutura de Arquivos**

```
src/
├── components/
│   ├── ui/              # Componentes base reutilizáveis
│   ├── feature/         # Componentes específicos por funcionalidade
│   └── layout/          # Componentes de layout
├── hooks/               # Custom hooks
├── services/            # Serviços de API
├── lib/                 # Utilitários e configurações
├── types/               # Definições TypeScript
└── schemas/             # Validações Zod
```

### **Nomenclatura**

#### **Arquivos e Pastas**
- **Componentes:** PascalCase (`UserProfile.tsx`)
- **Hooks:** camelCase com prefixo "use" (`useUserData.ts`)
- **Services:** camelCase com sufixo "Service" (`userService.ts`)
- **Tipos:** PascalCase com sufixo "Type" (`UserType.ts`)
- **Utilitários:** camelCase (`formatDate.ts`)

#### **Variáveis e Funções**
```typescript
// ✅ Bom
const userName = "João";
const getUserData = () => {};
const isLoading = false;

// ❌ Evitar
const user_name = "João";
const GetUserData = () => {};
const loading = false;
```

### **Componentes React**

#### **Estrutura Padrão**
```typescript
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/UserType";

interface UserProfileProps {
  user: UserType;
  onUpdate?: (user: UserType) => void;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      // Lógica de atualização
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <Button 
        onClick={handleUpdate}
        disabled={isLoading}
        className="bg-orange-600 hover:bg-orange-700"
      >
        {isLoading ? "Atualizando..." : "Atualizar"}
      </Button>
    </div>
  );
}

export default UserProfile;
```

#### **Hooks Customizados**
```typescript
import { useState, useEffect } from "react";
import { getUserData } from "@/services/userService";
import { UserType } from "@/types/UserType";

export function useUserData(userId: string) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserData(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const refreshUser = () => {
    if (userId) fetchUser();
  };

  return { user, loading, error, refreshUser };
}
```

### **Styling (TailwindCSS)**

#### **Classes Organizadas**
```typescript
// ✅ Bom - Organize por categoria
<div className="
  flex items-center justify-between 
  p-4 
  bg-white border border-gray-200 rounded-lg 
  hover:bg-gray-50 
  transition-colors duration-200
">

// ❌ Evitar - Classes desorganizadas
<div className="flex bg-white p-4 border-gray-200 items-center hover:bg-gray-50 justify-between border rounded-lg transition-colors duration-200">
```

#### **Variáveis CSS Customizadas**
```css
/* globals.css */
:root {
  --color-orange-primary: #EA580C;
  --color-orange-secondary: #FB923C;
  --color-gray-text: #6B7280;
  --spacing-section: 2rem;
}
```

### **TypeScript**

#### **Interfaces e Tipos**
```typescript
// Interfaces para objetos
interface UserProfileData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
}

// Types para uniões e primitivos
type UserStatus = "active" | "inactive" | "pending";
type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

// Enums para constantes
enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  ORGANIZER = "ORGANIZER"
}
```

#### **Props e Estado**
```typescript
// Props sempre tipadas
interface ComponentProps {
  title: string;
  isVisible?: boolean; // Opcional com ?
  onClick: () => void;
  children: React.ReactNode;
}

// Estado tipado
const [users, setUsers] = useState<UserType[]>([]);
const [status, setStatus] = useState<UserStatus>("active");
```

## 📝 Estrutura de Commits

Utilizamos **Conventional Commits** para manter um histórico claro:

### **Formato**
```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### **Tipos de Commit**
- **feat:** Nova funcionalidade
- **fix:** Correção de bug
- **docs:** Documentação
- **style:** Formatação (não afeta o código)
- **refactor:** Refatoração de código
- **test:** Adição ou correção de testes
- **chore:** Tarefas de manutenção

### **Exemplos**
```bash
# Feature
git commit -m "feat(auth): adiciona login com Google"

# Bug fix
git commit -m "fix(dashboard): corrige cálculo de métricas"

# Documentação
git commit -m "docs(readme): atualiza instruções de instalação"

# Refatoração
git commit -m "refactor(components): extrai lógica comum dos formulários"
```

## 🔄 Pull Requests

### **Checklist antes de abrir PR**
- [ ] Código segue os padrões estabelecidos
- [ ] Todos os testes passam (`npm run lint`)
- [ ] Funcionalidade foi testada manualmente
- [ ] Documentação foi atualizada (se necessário)
- [ ] Branch está atualizada com a main
- [ ] Commits seguem o padrão Conventional

### **Template de PR**
```markdown
## 📋 Descrição
Breve descrição das alterações implementadas.

## 🎯 Tipo de Mudança
- [ ] Bug fix (correção que resolve um problema)
- [ ] Nova feature (funcionalidade que adiciona algo novo)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## 🧪 Como Testar
1. Siga os passos de configuração
2. Execute `npm run dev`
3. Navegue para a página X
4. Teste a funcionalidade Y

## 📸 Screenshots (se aplicável)
Adicione capturas de tela das alterações visuais.

## ✅ Checklist
- [ ] Testei as alterações localmente
- [ ] Código segue os padrões do projeto
- [ ] Adicionei/atualizei testes se necessário
- [ ] Documentação foi atualizada
```

## 🐛 Relatando Bugs

### **Template de Issue de Bug**
```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do problema.

## 🔄 Passos para Reproduzir
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

## ✅ Comportamento Esperado
O que deveria acontecer.

## ❌ Comportamento Atual
O que realmente acontece.

## 📸 Screenshots
Se aplicável, adicione screenshots do problema.

## 🖥️ Ambiente
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão do Node: [ex: 18.0.0]
```

## 💡 Sugerindo Features

### **Template de Issue de Feature**
```markdown
## 🚀 Feature Request

## 📋 Descrição
Descrição clara da funcionalidade desejada.

## 🎯 Problema Atual
Que problema esta feature resolveria?

## 💡 Solução Proposta
Como você imagina que isso deveria funcionar?

## 🎨 Alternativas Consideradas
Outras soluções que você considerou?

## 📈 Benefícios
- Benefício 1
- Benefício 2
- Benefício 3
```

## 🏗️ Ambiente de Desenvolvimento

### **Extensões VS Code Recomendadas**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint

### **Configuração de Debug**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

## 🎯 Conclusão

Contribuir para o UniEventos é uma oportunidade de impactar positivamente a comunidade do Uni Movimento. Cada linha de código escrita com excelência contribui para conectar jovens através de eventos transformadores.

**Lembre-se:** "Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor" - Colossenses 3:23

---

**Dúvidas?** Abra uma issue ou entre em contato com a equipe de desenvolvimento.

**Desenvolvido com ❤️ para o Uni Movimento**