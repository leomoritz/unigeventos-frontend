"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import {
  User,
  CreditCard,
  Settings,
  Menu,
  X,
  SubscriptIcon,
  UserCircle,
  Edit3,
  LogOut,
  Subscript,
  Bookmark,
  BookmarkCheckIcon,
  RssIcon,
  LayoutIcon,
  UserCheck2Icon,
  UserCheckIcon,
  Shield,
  CalendarIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import { useAuth } from "@/hooks/useAuth";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  target?: string;
}

const NavItem = ({ href, icon, children, isActive, target }: NavItemProps) => (
  <Link
    href={href}
    target={target}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-orange-100 text-orange-700 font-medium shadow-sm"
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
    }`}
  >
    <span className={isActive ? "text-orange-700" : "text-gray-500"}>{icon}</span>
    <span>{children}</span>
  </Link>
);

export default function UserLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { performLogout } = useLogout();
  const { hasRole } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Menu Mobile */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <Menu size={20} />
              </button>
              
              <div className="flex items-center space-x-3">
                <Image
                  src="/servinho.png"
                  alt="Servinho"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    UniEventos
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Painel do Usuário</p>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar 
                      className="w-8 h-8 bg-orange-500 text-white"
                      fallbackText="U"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      Meu Perfil
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/user/profile" className="flex items-center space-x-2">
                      <UserCircle size={16} />
                      <span>Ver Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/edit-profile" className="flex items-center space-x-2">
                      <Edit3 size={16} />
                      <span>Editar Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  {hasRole('ROLE_ADMIN') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 focus:text-blue-700">
                        <Shield size={16} />
                        <span>Painel de Administrador</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={performLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 focus:text-red-700"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16 
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:pt-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Close button for mobile */}
            <div className="flex justify-end p-4 md:hidden">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 pb-4 space-y-2">
              <div className="mb-6 mt-4">
                <div className="space-y-1">
                  <NavItem href="/user/dashboard" icon={<LayoutIcon size={20} />}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/events" target="_blank" icon={<CalendarIcon size={20} />}>
                    Eventos
                  </NavItem>
                  <NavItem href="/user/subscriptions" icon={<UserCheckIcon size={20} />}>
                    Minhas Inscrições
                  </NavItem>
                  <NavItem href="/user/payments" icon={<CreditCard size={20} />}>
                    Meus Pagamentos
                  </NavItem>
                  <NavItem href="/user/configurations" icon={<Settings size={20} />}>
                    Configurações
                  </NavItem>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}