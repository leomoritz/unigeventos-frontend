'use client';

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, UserPlus, CalendarPlus, Activity, TrendingUp, Clock, Users } from "lucide-react";

export default function AdminDashboard() {
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
          value="12"
          subtitle="3 novos esta semana"
          trend={"+15%"}
          color="orange"
        />
        <StatCard
          icon={<UserPlus size={24} />}
          title="Inscritos Hoje"
          value="87"
          subtitle="Meta: 100 inscrições"
          trend={"+23%"}
          color="blue"
        />
        <StatCard
          icon={<Activity size={24} />}
          title="Check-ins Realizados"
          value="53"
          subtitle="Taxa de 85%"
          trend={"+8%"}
          color="green"
        />
        <StatCard
          icon={<BarChart3 size={24} />}
          title="Eventos Concluídos"
          value="34"
          subtitle="Este mês"
          trend={"+12%"}
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
                  <TrendingUp className="text-orange-600 dark:text-orange-400" size={20} />
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
                label="Criar Evento"
                description="Novo evento"
              />
              <QuickActionItem 
                icon={<Users size={16} />}
                label="Gerenciar Inscrições"
                description="Ver inscritos"
              />
              <QuickActionItem 
                icon={<Activity size={16} />}
                label="Check-ins Pendentes"
                description="3 eventos hoje"
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
  trend, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string;
  subtitle?: string;
  trend?: string;
  color?: string;
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
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedColor.split(' ').slice(0, 2).join(' ')}`}>
              <span className={selectedColor.split(' ').slice(2).join(' ')}>
                {icon}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/20">
              <TrendingUp size={12} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionItem({ 
  icon, 
  label, 
  description 
}: { 
  icon: React.ReactNode; 
  label: string; 
  description: string; 
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
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
