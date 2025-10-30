"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
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
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Controle do estado do menu lateral
  const { performLogout } = useLogout();
  const { hasRole } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#1e1e1e] text-neutral-200">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-[#2b2b2b] border-r border-[#333] shadow-sm p-6 hidden md:block ${
          isSidebarOpen ? "block" : "hidden md:block"
        }`}
      >
        <h2 className="text-2xl font-bold text-orange-500 mb-8">
          Painel Admin
        </h2>
        <nav className="space-y-4">
          <NavItem href="/admin" icon={<Home size={18} />}>
            Dashboard
          </NavItem>
          <NavItem href="/admin/organizers" icon={<Church size={18} />}>
            Organizadores
          </NavItem>
          <NavItem href="/admin/events" icon={<Calendar size={18} />}>
            Eventos
          </NavItem>
          <NavItem href="/events" icon={<CalendarSearchIcon size={18} />}>
            Eventos Publicados
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
      <div className="flex-1 flex flex-col">
        <header className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between border-b border-[#333]">
          <WeatherWidget />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full hover:opacity-90 transition">
                <Avatar
                  className="h-9 w-9 border border-neutral-600"
                  src="{user?.imageUrl}"
                  alt="{user?.name}"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[#2b2b2b] text-neutral-200 border border-[#444]">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#444]" />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/edit-profile">Editar Dados</Link>
              </DropdownMenuItem>
              {(hasRole("ROLE_USER") || hasRole("ROLE_LEADER")) && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/user/dashboard"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 focus:text-blue-700"
                  >
                    <UserIcon size={16} />
                    <span>Painel do Usuário</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-[#444]" />
              <DropdownMenuItem
                className="text-red-500 hover:text-red-600 cursor-pointer"
                onClick={performLogout}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hamburger Menu for Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="md:hidden text-white"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="ml-2" size={16} /> {/* Ícone de hambúrguer */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[#2b2b2b] text-neutral-200 border border-[#444]">
              <DropdownMenuLabel className="font-bold text-orange-500 mb-8">
                Painel Admin
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#444]" />
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin"
                >
                  {<Home size={14} />} Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin/organizers"
                >
                  {<Church size={14} />} Organizadores
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin/events"
                >
                  {<Calendar size={14} />} Eventos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin/payments"
                >
                  {<CreditCard size={14} />} Pagamentos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin/coupons"
                >
                  {<TicketPercent size={14} />} Cupons
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin/schedulings"
                >
                  {<CalendarClock size={14} />} Agendamentos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin/persons"
                >
                  {<Users size={14} />} Pessoas
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin/checkins"
                >
                  {<CheckCircleIcon size={14} />} Checkins
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/admin/configurations"
                >
                  {<Settings size={14} />} Configurações
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Area */}
        <main className="flex-1 p-6 bg-gradient-to-br bg-[#2b2b2b] overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
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
      className="flex items-center gap-3 text-neutral-300 hover:text-orange-400 transition-colors font-medium"
    >
      {icon}
      {children}
    </Link>
  );
}
