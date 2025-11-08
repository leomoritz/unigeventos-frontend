/**
 * Configuração centralizada do Axios com interceptores para autenticação
 * Utiliza cookies em vez de localStorage para maior segurança
 */

import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import CookieManager from '@/lib/cookieManager';

// URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/rest/v1';

/**
 * Instância do Axios configurada com interceptores de autenticação
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  withCredentials: true, // Para enviar cookies automaticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de requisição: adiciona token de autenticação automaticamente
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obter token dos cookies primeiro, depois localStorage como fallback
    let token = CookieManager.get('accessToken');
    
    // Fallback para localStorage (útil durante processo de registro)
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    }
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token,
        tokenSource: CookieManager.get('accessToken') ? 'cookies' : 'localStorage'
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta: trata erros de autenticação automaticamente
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    
    return response;
  },
  (error) => {
    // Tratar erros de autenticação
    if (error.response?.status === 401) {
      console.warn('Token expirado ou inválido, limpando cookies');
      CookieManager.clearAuthCookies();
      
      // Redirecionar para login apenas se não estivermos já na página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Log de erro
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    
    return Promise.reject(error);
  }
);

/**
 * Funções utilitárias para requisições autenticadas
 */
export const authApi = {
  /**
   * GET com autenticação automática
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config),

  /**
   * POST com autenticação automática
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config),

  /**
   * PUT com autenticação automática
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config),

  /**
   * PATCH com autenticação automática
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config),

  /**
   * DELETE com autenticação automática
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config),
};

/**
 * Função para verificar se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!CookieManager.get('accessToken');
};

/**
 * Função para obter o token atual
 */
export const getCurrentToken = (): string | null => {
  return CookieManager.get('accessToken');
};

/**
 * Função para obter as roles do usuário atual
 */
export const getCurrentUserRoles = (): string[] => {
  const { roles } = CookieManager.getAuthInfo();
  return roles;
};

/**
 * Função para verificar se o usuário tem uma role específica
 */
export const hasRole = (role: string): boolean => {
  const roles = getCurrentUserRoles();
  return roles.includes(role);
};

/**
 * Função para verificar se o usuário tem qualquer uma das roles especificadas
 */
export const hasAnyRole = (roleList: string[]): boolean => {
  const userRoles = getCurrentUserRoles();
  return roleList.some(role => userRoles.includes(role));
};

export default apiClient;