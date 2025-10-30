/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Bell, Gift, BarChart3 } from "lucide-react";
import { toast } from "react-toastify";
import { getUserNotifications, subscribeToNotification, unsubscribeFromNotification } from "@/services/schedulingService";
import PageHeader from "@/components/admin/PageHeader";
import ModernCard from "@/components/admin/ModernCard";
import ModernCardLoading from "@/components/admin/ModernCardLoading";

const NOTIFICATIONS = [
  {
    type: "BIRTHDAY_REMINDER",
    name: "Lembrete de Aniversários",
    description: "Receba lembretes do(s) aniversariante(s) do dia por e-mail.",
  },
  {
    type: "EVENT_STATISTICS",
    name: "Estatísticas de Eventos",
    description: "Receba um resumo do(s) evento(s) realizado(s) no dia seguinte após a conclusão.",
  },
];

interface NotificationStatus {
  notificationType: "BIRTHDAY_REMINDER" | "EVENT_STATISTICS";
  isActive: boolean;
}

export default function ScheduledPage() {
  const [subscriptions, setSubscriptions] = useState<NotificationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserNotifications();
        setSubscriptions(data);
      } catch (err: any) {
        toast.error(`Erro ao buscar os agendamentos. Causa: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);

  const isSubscribed = (type: string) =>
    subscriptions.find((s) => s.notificationType === type)?.isActive ?? false;

  const handleSubscribe = async (type: string) => {
    setUpdating(type);
    try {
      await subscribeToNotification(type);
      toast.success("Inscrição realizada com sucesso.");
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.notificationType === type ? { ...s, isActive: true } : s
        )
      );
    } catch {
      toast.error("Erro ao inscrever-se.");
    } finally {
      setUpdating(null);
    }
  };
  

  const handleUnsubscribe = async (type: string) => {
    setUpdating(type);
    try {
      await unsubscribeFromNotification(type);
      toast.success("Inscrição removida.");
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.notificationType === type ? { ...s, isActive: false } : s
        )
      );
    } catch {
      toast.error("Erro ao remover inscrição.");
    } finally {
      setUpdating(null);
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <PageHeader
            icon={<Calendar className="h-8 w-8" />}
            title="Agendamentos"
            description="Carregando agendamentos disponíveis..."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModernCardLoading count={2} />
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BIRTHDAY_REMINDER":
        return <Gift className="h-6 w-6 text-orange-400" />;
      case "EVENT_STATISTICS":
        return <BarChart3 className="h-6 w-6 text-orange-400" />;
      default:
        return <Bell className="h-6 w-6 text-orange-400" />;
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <PageHeader
          icon={<Calendar className="h-8 w-8" />}
          title="Agendamentos"
          description="Configure suas notificações automáticas e lembretes personalizados"
        />

        {/* Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {NOTIFICATIONS.map((notif) => {
            const subscribed = isSubscribed(notif.type);

            return (
              <ModernCard
                key={notif.type}
                className="group p-6 text-white hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Header with Icon and Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg backdrop-blur-sm">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-semibold text-orange-300 group-hover:text-orange-400 transition-colors">
                          {notif.name}
                        </h2>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                      subscribed 
                        ? "bg-green-600/20 text-green-400 border border-green-600/50" 
                        : "bg-slate-600/20 text-slate-400 border border-slate-600/50"
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${subscribed ? "bg-green-400" : "bg-slate-400"}`} />
                      {subscribed ? "Ativo" : "Inativo"}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {notif.description}
                  </p>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-slate-600/50">
                    <Button
                      onClick={() =>
                        subscribed
                          ? handleUnsubscribe(notif.type)
                          : handleSubscribe(notif.type)
                      }
                      disabled={updating === notif.type}
                      className={`w-full font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-lg ${
                        subscribed
                          ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 border border-slate-600/50 hover:border-slate-500"
                          : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                      }`}
                    >
                      {updating === notif.type ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processando...</span>
                        </div>
                      ) : subscribed ? (
                        <div className="flex items-center justify-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>Desativar Notificações</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>Ativar Notificações</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </ModernCard>
            );
          })}
        </div>

        {/* Info Card */}
        <ModernCard className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-blue-600/20 rounded-lg backdrop-blur-sm">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-300">
                Sobre os Agendamentos
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Os agendamentos permitem que você receba notificações automáticas por e-mail sobre eventos importantes. 
                Você pode ativar ou desativar cada tipo de notificação conforme sua necessidade.
              </p>
              <div className="pt-2 text-xs text-slate-400">
                <p>• <strong>Lembrete de Aniversários:</strong> Receba lembretes diários sobre aniversariantes</p>
                <p>• <strong>Estatísticas de Eventos:</strong> Receba resumos automáticos após eventos concluídos</p>
              </div>
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
}