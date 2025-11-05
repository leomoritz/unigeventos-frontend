"use client";

import { Lock, Bell, Shield, Database, Settings, CreditCard, Loader2, Trash2 } from "lucide-react";
import ModernCard from "@/components/admin/ModernCard";
import PageHeader from "@/components/admin/PageHeader";
import PasswordResetSection from "@/components/settings/PasswordResetSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { savePaymentConfigurations, getPaymentConfigurations, PaymentConfiguration, deleteAllPaymentConfigurations, deletePaymentConfigurationById } from "@/services/settingsService";

export default function ConfigurationsPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);
  const [paymentSettings, setPaymentSettings] = useState({
    creditCard: { id: "", enabled: false, maxInstallments: 0, interestRate: 0.0 },
    invoice: { id: "", enabled: false, maxInstallments: 0, interestRate: 0 },
    pix: { id: "", enabled: false, maxInstallments: 0, interestRate: 0 }
  });

  // Função para carregar configurações
  const loadPaymentConfigurations = async () => {
    try {
      setIsLoadingConfigs(true);
      const configs = await getPaymentConfigurations();
      
      // Converter array de configurações em objeto estruturado
      const newSettings = {
        creditCard: { id: "", enabled: false, maxInstallments: 0, interestRate: 0.0 },
        invoice: { id: "", enabled: false, maxInstallments: 0, interestRate: 0 },
        pix: { id: "", enabled: false, maxInstallments: 0, interestRate: 0 }
      };

      configs.forEach((config: PaymentConfiguration) => {
        switch (config.paymentType) {
          case "CREDIT_CARD":
            newSettings.creditCard = {
              id: config.id ? config.id : "",
              enabled: true,
              maxInstallments: config.maxInstallments,
              interestRate: config.interestRate
            };
            break;
          case "INVOICE":
            newSettings.invoice = {
              id: config.id ? config.id : "",
              enabled: true,
              maxInstallments: config.maxInstallments,
              interestRate: config.interestRate
            };
            break;
          case "PIX":
            newSettings.pix = {
              id: config.id ? config.id : "",
              enabled: true,
              maxInstallments: config.maxInstallments,
              interestRate: config.interestRate
            };
            break;
        }
      });

      setPaymentSettings(newSettings);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações de pagamento");
    } finally {
      setIsLoadingConfigs(false);
    }
  };

  // Carregar configurações ao montar o componente
  useEffect(() => {
    loadPaymentConfigurations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      // Validações
      if (paymentSettings.creditCard.enabled && paymentSettings.creditCard.maxInstallments === 0) {
        toast.error("O máximo de parcelas para cartão de crédito deve ser maior que zero.");
        return;
      }

      if (paymentSettings.creditCard.enabled && paymentSettings.creditCard.interestRate < 0) {
        toast.error("A taxa de juros não pode ser negativa.");
        return;
      }
  
      setIsLoading(true);
  
      try {
        const inputPaymentConfigurations = [];
        
        if (paymentSettings.creditCard.enabled) {
          inputPaymentConfigurations.push({
            id: paymentSettings.creditCard.id ? paymentSettings.creditCard.id : "",
            paymentType: "CREDIT_CARD",
            maxInstallments: paymentSettings.creditCard.maxInstallments,
            interestRate: paymentSettings.creditCard.interestRate
          });
        }
        if (paymentSettings.invoice.enabled) {
          inputPaymentConfigurations.push({
            id: paymentSettings.invoice.id ? paymentSettings.invoice.id : "",
            paymentType: "INVOICE",
            maxInstallments: paymentSettings.invoice.maxInstallments,
            interestRate: paymentSettings.invoice.interestRate
          });
        }
        if (paymentSettings.pix.enabled) {
          inputPaymentConfigurations.push({
            id: paymentSettings.pix.id ? paymentSettings.pix.id : "",
            paymentType: "PIX",
            maxInstallments: paymentSettings.pix.maxInstallments,
            interestRate: paymentSettings.pix.interestRate
          });
        }

        await savePaymentConfigurations(inputPaymentConfigurations);
        
        // Recarregar configurações para obter os IDs atualizados
        await loadPaymentConfigurations();
        
        toast.success("Configurações de pagamento salvas com sucesso!");
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao salvar configurações";
        toast.error(`Erro: ${errorMessage}`);
        console.error("Erro ao salvar configurações:", err);
      } finally {
        setIsLoading(false);
      }
    };

  // Função para deletar todas as configurações
  const handleDeleteAllConfigurations = async () => {
    const hasAnyConfiguration = paymentSettings.creditCard.enabled || 
                               paymentSettings.invoice.enabled || 
                               paymentSettings.pix.enabled;
                               
    if (!hasAnyConfiguration) {
      toast.warning("Não há configurações ativas para remover.");
      return;
    }

    const confirmDelete = window.confirm(
      "Tem certeza que deseja remover TODAS as configurações de pagamento? Esta ação não pode ser desfeita."
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteAllPaymentConfigurations();
      
      // Recarregar configurações do servidor
      await loadPaymentConfigurations();
      
      toast.success("Todas as configurações foram removidas com sucesso!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao remover configurações";
      toast.error(`Erro: ${errorMessage}`);
      console.error("Erro ao remover configurações:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Função para handle mudança de toggle (desativar configuração)
  const handleToggleChange = async (type: 'creditCard' | 'invoice' | 'pix', enabled: boolean) => {
    // Se está desabilitando e tem ID, deletar do backend
    if (!enabled && paymentSettings[type].id) {
      try {
        await deletePaymentConfigurationById(paymentSettings[type].id);
        toast.success(`Configuração de ${type === 'creditCard' ? 'Cartão de Crédito' : type === 'invoice' ? 'Boleto' : 'PIX'} removida com sucesso!`);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao remover configuração";
        toast.error(`Erro: ${errorMessage}`);
        console.error("Erro ao remover configuração:", err);
        return; // Não atualiza o estado se deu erro
      }
    }

    // Atualizar estado local
    setPaymentSettings(prev => ({
      ...prev,
      [type]: { 
        ...prev[type], 
        enabled,
        // Se desabilitando, limpar o ID
        id: enabled ? prev[type].id : ""
      }
    }));
  };

  // Seção de Pagamentos
  const PaymentSection = () => (
    <ModernCard className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-orange-400 mb-2">Configurações de Pagamento</h3>
          <p className="text-slate-400 text-sm">Configure os métodos de pagamento e suas condições</p>
        </div>

        {isLoadingConfigs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-400 mr-3" />
            <span className="text-slate-400">Carregando configurações...</span>
          </div>
        ) : (
        <>
        <div className="space-y-4">
          {/* Cartão de Crédito */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-orange-400" />
                <h4 className="font-medium text-white">Cartão de Crédito</h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={paymentSettings.creditCard.enabled}
                  onChange={(e) => handleToggleChange('creditCard', e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            
            {paymentSettings.creditCard.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Máximo de Parcelas
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={paymentSettings.creditCard.maxInstallments}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev,
                      creditCard: { ...prev.creditCard, maxInstallments: parseInt(e.target.value) }
                    }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Taxa de Juros (% a.m.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={paymentSettings.creditCard.interestRate}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev,
                      creditCard: { ...prev.creditCard, interestRate: parseFloat(e.target.value) }
                    }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Boleto */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-orange-400" />
                <h4 className="font-medium text-white">Boleto Bancário</h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={paymentSettings.invoice.enabled}
                  onChange={(e) => handleToggleChange('invoice', e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <p className="text-sm text-slate-400">Pagamento à vista via boleto bancário</p>
          </div>

          {/* PIX */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-orange-400" />
                <h4 className="font-medium text-white">PIX</h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={paymentSettings.pix.enabled}
                  onChange={(e) => handleToggleChange('pix', e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <p className="text-sm text-slate-400">Pagamento instantâneo via PIX</p>
          </div>
        </div>

        <div className="flex justify-between">
          {/* Botão de Remover - só mostra se houver configurações ativas */}
          {(paymentSettings.creditCard.enabled || paymentSettings.invoice.enabled || paymentSettings.pix.enabled) && (
            <Button 
              onClick={handleDeleteAllConfigurations}
              disabled={isDeleting || isLoading || isLoadingConfigs}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Removendo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Configurações
                </>
              )}
            </Button>
          )}
          
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || isLoadingConfigs || isDeleting}
            className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </Button>
        </div>
        </>
        )}
      </div>
    </ModernCard>
  );

  // Seção de Notificações
  const NotificationsSection = () => (
    <ModernCard className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-orange-400 mb-2">Notificações</h3>
          <p className="text-slate-400 text-sm">Configure suas preferências de notificações</p>
        </div>
        <div className="p-8 text-center">
          <Bell className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Em breve você poderá configurar suas notificações aqui.</p>
        </div>
      </div>
    </ModernCard>
  );

  // Seção de Segurança
  const SecuritySection = () => (
    <ModernCard className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-orange-400 mb-2">Segurança</h3>
          <p className="text-slate-400 text-sm">Configurações avançadas de segurança</p>
        </div>
        <div className="p-8 text-center">
          <Shield className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Em breve você poderá configurar opções de segurança adicionais aqui.</p>
        </div>
      </div>
    </ModernCard>
  );

  // Seção do Sistema
  const SystemSection = () => (
    <ModernCard className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-orange-400 mb-2">Sistema</h3>
          <p className="text-slate-400 text-sm">Configurações do sistema (exclusivo para administradores)</p>
        </div>
        <div className="p-8 text-center">
          <Database className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Em breve você poderá configurar opções do sistema aqui.</p>
        </div>
      </div>
    </ModernCard>
  );

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader
          icon={<Settings className="h-6 w-6 sm:h-8 sm:w-8" />}
          title="Configurações do Administrador"
          description="Gerencie suas configurações pessoais e do sistema"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger 
              value="payments" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="password" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Senha</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Sistema</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="mt-6">
            <PaymentSection />
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <ModernCard className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-orange-400 mb-2">Alterar Senha</h3>
                  <p className="text-slate-400 text-sm">Atualize sua senha de acesso</p>
                </div>
                <PasswordResetSection theme="dark" />
              </div>
            </ModernCard>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsSection />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SecuritySection />
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <SystemSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
