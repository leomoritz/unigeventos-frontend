#!/bin/bash

# ===========================================
# SCRIPT DE DESENVOLVIMENTO - UNIEVENTOS
# ===========================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker não está instalado!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose não está instalado!"
        exit 1
    fi
    
    log_success "Docker e Docker Compose encontrados"
}

# Build da aplicação
build() {
    log_info "Building Docker image..."
    docker-compose build
    log_success "Build concluído!"
}

# Iniciar aplicação
start() {
    log_info "Iniciando UniEventos Frontend..."
    docker-compose up -d
    log_success "Aplicação iniciada!"
    log_info "Acesse: http://localhost:3000"
}

# Parar aplicação
stop() {
    log_info "Parando aplicação..."
    docker-compose down
    log_success "Aplicação parada!"
}

# Ver logs
logs() {
    docker-compose logs -f unieventos-frontend
}

# Menu de ajuda
help() {
    echo "===========================================
UniEventos Frontend - Script de Desenvolvimento
===========================================

Uso: $0 [COMANDO]

COMANDOS:
    build       Build da imagem Docker
    start       Iniciar aplicação
    stop        Parar aplicação
    logs        Ver logs da aplicação
    help        Mostrar esta ajuda"
}

# Verificar dependências
check_docker

# Processar comando
case "${1:-help}" in
    "build")
        build
        ;;
    "start")
        start
        ;;
    "stop")
        stop
        ;;
    "logs")
        logs
        ;;
    "help"|*)
        help
        ;;
esac
