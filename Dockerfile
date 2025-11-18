# ===========================================
# DOCKERFILE - UNIEVENTOS FRONTEND
# ===========================================

# Estágio 1: Build da aplicação
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

# Build da aplicação
RUN npm run build

# ===========================================
# Estágio 2: Produção
FROM node:18-alpine AS runner

# Instalar dumb-init para proper signal handling
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários do estágio de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Definir proprietário dos arquivos
RUN chown -R nextjs:nodejs /app

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

# ===========================================
# LABELS PARA METADADOS
# ===========================================
LABEL maintainer="UniEventos Team <dev@unieventos.com>"
LABEL version="0.3.0"
LABEL description="Frontend do sistema UniEventos - Plataforma de Gerenciamento de Eventos"
LABEL org.opencontainers.image.source="https://github.com/leomoritz/unieventos-frontend"
LABEL org.opencontainers.image.documentation="https://github.com/leomoritz/unieventos-frontend/blob/main/README.md"