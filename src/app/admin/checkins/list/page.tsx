/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import QRCodeScanner from "@/components/checkin/QRCodeScanner";
import { toast } from "react-toastify";
import { checkin } from "@/services/registrationService";
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User,
  TrendingUp,
  Calendar,
  Trash2
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import ModernCard from "@/components/admin/ModernCard";
import { Button } from "@/components/ui/button";

interface CheckinRecord {
  id: string;
  registrationId: string;
  timestamp: Date;
  status: "success" | "error";
  message: string;
}

export default function CheckinsPage() {
  const [checkinHistory, setCheckinHistory] = useState<CheckinRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    error: 0,
  });

  const handleQRCheckin = async (registrationId: string) => {
    try {
      await checkin(registrationId);
      
      const successRecord: CheckinRecord = {
        id: Date.now().toString(),
        registrationId,
        timestamp: new Date(),
        status: "success",
        message: "Check-in realizado com sucesso",
      };
      
      setCheckinHistory((prev) => [successRecord, ...prev]);
      setStats((prev) => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }));
      toast.success("Check-in realizado com sucesso!");
    } catch (error: any) {
      const errorMessage = error.message || "Erro desconhecido";
      const errorRecord: CheckinRecord = {
        id: Date.now().toString(),
        registrationId,
        timestamp: new Date(),
        status: "error",
        message: errorMessage,
      };
      
      setCheckinHistory((prev) => [errorRecord, ...prev]);
      setStats((prev) => ({ ...prev, total: prev.total + 1, error: prev.error + 1 }));
      toast.error(`Erro ao fazer check-in: ${errorMessage}`);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const clearHistory = () => {
    setCheckinHistory([]);
    setStats({ total: 0, success: 0, error: 0 });
    toast.info("Histórico limpo");
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <PageHeader
          icon={<QrCode className="h-8 w-8" />}
          title="Check-in de Participantes"
          description="Leia o QR Code para realizar o check-in automaticamente"
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ModernCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </ModernCard>

          <ModernCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Sucesso</p>
                <p className="text-2xl font-bold text-green-400">{stats.success}</p>
              </div>
            </div>
          </ModernCard>

          <ModernCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-lg backdrop-blur-sm">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Erros</p>
                <p className="text-2xl font-bold text-red-400">{stats.error}</p>
              </div>
            </div>
          </ModernCard>
        </div>

        {/* QR Code Scanner */}
        <ModernCard className="text-white">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-600/20 rounded-lg backdrop-blur-sm">
                <QrCode className="text-orange-400" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-orange-300">
                Scanner de QR Code
              </h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Aponte a câmera para o QR Code do participante. O check-in será processado automaticamente.
            </p>
            <QRCodeScanner onDetected={handleQRCheckin} />
          </div>
        </ModernCard>

        {/* Check-in History */}
        <ModernCard className="text-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/20 rounded-lg backdrop-blur-sm">
                  <Clock className="text-orange-400" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-orange-300">
                  Histórico da Sessão
                </h2>
              </div>
              {checkinHistory.length > 0 && (
                <Button
                  onClick={clearHistory}
                  variant="outline"
                  size="sm"
                  className="text-sm bg-slate-800/30 border-slate-600 text-slate-400 hover:text-orange-400 hover:border-orange-500/50 backdrop-blur-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              )}
            </div>

            {checkinHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-slate-800/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm">
                  Nenhum check-in realizado nesta sessão
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {checkinHistory.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border backdrop-blur-sm ${
                      record.status === "success"
                        ? "bg-green-600/10 border-green-600/30"
                        : "bg-red-600/10 border-red-600/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {record.status === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-white truncate flex items-center gap-2">
                            <User className="h-3 w-3" />
                            ID: {record.registrationId}
                          </p>
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {formatTime(record.timestamp)}
                          </span>
                        </div>
                        <p
                          className={`text-xs ${
                            record.status === "success"
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {record.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ModernCard>
      </div>
    </div>
  );
}