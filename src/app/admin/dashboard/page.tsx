'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, UserPlus, CalendarPlus, Activity, Clock, Users, Loader2, ScanQrCodeIcon } from "lucide-react";
import { getPublishedEventsCount } from "@/services/analyticsService";

export default function AdminDashboard() {
  const [publishedEventsCount, setPublishedEventsCount] = useState<number | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchPublishedEventsCount = async () => {
      try {
        setIsLoadingEvents(true);
        const count = await getPublishedEventsCount();
        setPublishedEventsCount(count);
      } catch (error) {
        console.error("Erro ao carregar contagem de eventos:", error);
        setPublishedEventsCount(0);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchPublishedEventsCount();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Visão geral dos seus eventos e métricas importantes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<CalendarPlus size={24} />}
          title="Eventos Ativos"
          value={isLoadingEvents ? <Loader2 className="h-6 w-6 animate-spin" /> : publishedEventsCount?.toString() || "0"}
          subtitle="Eventos publicados"
          color="orange"
          isLoading={isLoadingEvents}
        />
        <StatCard
          icon={<UserPlus size={24} />}
          title="Inscritos Hoje"
          value="87"
          subtitle="Meta: 100 inscrições"
          color="blue"
        />
        <StatCard
          icon={<Activity size={24} />}
          title="Check-ins Realizados"
          value="53"
          subtitle="Taxa de 85%"
          color="green"
        />
        <StatCard
          icon={<BarChart3 size={24} />}
          title="Eventos Concluídos"
          value="34"
          subtitle="Este mês"
          color="purple"
        />
      </div>

      {/* Recent Activity and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <BarChart3 className="text-orange-600 dark:text-orange-400" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Resumo Geral</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Aqui você pode visualizar os principais indicadores dos eventos em andamento, número de inscritos,
                check-ins e progresso geral da plataforma.
              </p>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 rounded-lg p-4 border border-orange-200/50 dark:border-orange-500/20">
                <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                  💡 Em breve, gráficos interativos e análises avançadas serão exibidos aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Clock className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ações Rápidas</h3>
            </div>
            <div className="space-y-3">
              <QuickActionItem 
                icon={<CalendarPlus size={16} />}
                href="/admin/events/create"
                label="Criar Evento"
                description="Novo evento"
              />
              <QuickActionItem 
                icon={<Users size={16} />}
                href="/admin/subscriptions/list"
                label="Gerenciar Inscrições"
                description="Ver inscritos"
              />
              <QuickActionItem 
                icon={<ScanQrCodeIcon size={16} />}
                href="/admin/checkins/list"
                label="Realizar Check-ins"
                description="Leitor de QRCode para realizar checkins"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color,
  isLoading = false
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | React.ReactNode;
  subtitle?: string;
  color?: string;
  isLoading?: boolean;
}) {
  const colorClasses = {
    orange: "from-orange-500/20 to-red-500/20 text-orange-600 dark:text-orange-400",
    blue: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400",
    green: "from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400",
    purple: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
  };

  const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.orange;

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedColor.split(' ').slice(0, 2).join(' ')}`}>
            <span className={selectedColor.split(' ').slice(2).join(' ')}>
              {icon}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  {value}
                </div>
              ) : (
                value
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionItem({ 
  icon, 
  href,
  label, 
  description 
}: { 
  icon: React.ReactNode;
  href?: string;
  label: string; 
  description: string; 
}) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
    >
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
        <span className="text-slate-600 dark:text-slate-400">
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500">{description}</p>
      </div>
    </div>
  );
}
