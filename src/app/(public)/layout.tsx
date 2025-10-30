"use client";

import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, LogOut, Calendar, Home, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/useLogout';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const { hasRole } = useAuth();
  const { performLogout } = useLogout();
  

  const handleGoToDashboard = () => {
    router.push('/admin/dashboard');
  };

  const handleGoToUserArea = () => {
    router.push('/user/dashboard');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden max-w-full">
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/servinho.png"
                alt="Servinho"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">UniEventos</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Conectando Gerações
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('events-grid');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 text-sm sm:text-base"
              >
                Eventos
              </button>

              {/* Loading State */}
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                /* Authenticated User Navigation */
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button
                    onClick={handleGoToUserArea}
                    variant="outline"
                    size="sm"
                    className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 text-xs sm:text-sm"
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Minha Área</span>
                  </Button>

                  {hasRole("ROLE_ADMIN") && (
                    <Button
                      onClick={handleGoToDashboard}
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 text-xs sm:text-sm"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Painel Admin</span>
                    </Button>
                  )}

                  <Button
                    onClick={performLogout}
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-xs sm:text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Sair</span>
                  </Button>
                </div>
              ) : (
                /* Unauthenticated User Navigation */
                <>
                  <a
                    href="/login"
                    className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 text-sm sm:text-base"
                  >
                    Entrar
                  </a>
                  <a
                    href="/register"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                  >
                    Cadastrar
                  </a>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 w-full max-w-full overflow-x-hidden">
        <div id="main-content" className="max-w-7xl mx-auto w-full">{children}</div>
      </main>

      {/* Clean Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-1 text-sm sm:text-base">
              © 2025 UniEventos - Conectando pessoas através de eventos
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Feito com ❤️ para nossa comunidade
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}