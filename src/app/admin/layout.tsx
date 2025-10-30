"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Calendar,
  Users,
  Settings,
  CreditCard,
  TicketPercent,
  Church,
  CalendarClock,
  Menu,
  CheckCircleIcon,
  SubscriptIcon,
  LucideCalendarCheck,
  UserIcon,
  CalendarSearchIcon,
  X,
  LogOut,
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
import WeatherWidget from "@/components/ui/weather-widget";
import { useLogout } from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { performLogout } = useLogout();
  const { hasRole } = useAuth();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-neutral-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-72 h-screen bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo and Title */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 p-1 shadow-lg">
              <Image
                src="/servinho.png"
                alt="Servinho Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-slate-400">UniEventos</p>
            </div>
          </div>
          
          {/* Weather Widget */}
          <div className="mt-3">
            <WeatherWidget />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
          <NavItem href="/admin" icon={<Home size={18} />}>
            Dashboard
          </NavItem>
          <NavItem href="/admin/organizers" icon={<Church size={18} />}>
            Organizadores
          </NavItem>
          <NavItem href="/admin/events" icon={<Calendar size={18} />}>
            Eventos
          </NavItem>
          <NavItem href="/admin/payments" icon={<CreditCard size={18} />}>
            Pagamentos
          </NavItem>
          <NavItem href="/admin/coupons" icon={<TicketPercent size={18} />}>
            Cupons
          </NavItem>
          <NavItem href="/admin/schedulings" icon={<CalendarClock size={18} />}>
            Agendamentos
          </NavItem>
          <NavItem href="/admin/persons" icon={<Users size={18} />}>
            Pessoas
          </NavItem>
          <NavItem href="/admin/checkins" icon={<CheckCircleIcon size={18} />}>
            Checkins
          </NavItem>
          <NavItem
            href="/admin/subscriptions"
            icon={<LucideCalendarCheck size={18} />}
          >
            Inscrições por Evento
          </NavItem>
          <NavItem href="/admin/configurations" icon={<Settings size={18} />}>
            Configurações
          </NavItem>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            {/* Left Side - Mobile menu + Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
              >
                <Menu size={20} className="text-slate-300" />
              </button>
              
              <Link
                href="/events"
                target="_blank"
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 hover:scale-105"
              >
                <CalendarSearchIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Eventos Publicados</span>
                <span className="sm:hidden">Eventos</span>
              </Link>
            </div>

            {/* Right Side - User Menu */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/30">
                    <Avatar
                      className="h-8 w-8 border-2 border-orange-500/30 shadow-lg"
                      src="{user?.imageUrl}"
                      alt="{user?.name}"
                    />
                    <span className="hidden sm:block text-sm font-medium text-slate-300">Admin</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800/95 backdrop-blur-xl text-slate-100 border border-slate-700/50 shadow-2xl">
                  <DropdownMenuLabel className="text-slate-300">Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile" className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50">
                      <UserIcon size={16} />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/edit-profile" className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50">
                      <Settings size={16} />
                      Editar Dados
                    </Link>
                  </DropdownMenuItem>
                  {(hasRole("ROLE_USER") || hasRole("ROLE_LEADER")) && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user/dashboard"
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50 text-blue-400 hover:text-blue-300"
                      >
                        <UserIcon size={16} />
                        Painel do Usuário
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    onClick={performLogout}
                  >
                    <LogOut size={16} />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-200 font-medium border border-transparent hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/10"
    >
      <span className="group-hover:scale-110 transition-transform duration-200">
        {icon}
      </span>
      {children}
    </Link>
  );
}
