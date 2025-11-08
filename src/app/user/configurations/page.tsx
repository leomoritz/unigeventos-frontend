"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Mail, 
  Phone, 
  Shield,
  Eye,
  EyeOff,
  Save,
  Loader2,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Download,
  FileText
} from "lucide-react";
import { useState } from "react";
import { changePassword, validatePassword } from "@/services/settingsService";
import { requestDataDeletion } from "@/services/lgpdService";
import { toast } from "react-toastify";
// Dialog removido - usando modal customizado

export default function ConfigurationsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    events: true,
    payments: true,
    reminders: true
  });

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = async () => {
    // Validações
    if (!passwordForm.currentPassword) {
      toast.error("Digite a senha atual");
      return;
    }

    if (!passwordForm.newPassword) {
      toast.error("Digite a nova senha");
      return;
    }

    if (!passwordForm.confirmPassword) {
      toast.error("Confirme a nova senha");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    // Validar força da senha
    const passwordValidation = validatePassword(passwordForm.newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message);
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      toast.success("Senha alterada com sucesso!");
      
      // Limpar formulário
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    console.log("=== HANDLE DELETE ACCOUNT CHAMADO ===");
    console.log("Texto de confirmação:", confirmationText);
    
    if (confirmationText !== "EXCLUIR MINHA CONTA") {
      toast.error("Digite exatamente 'EXCLUIR MINHA CONTA' para confirmar");
      return;
    }

    setIsDeleting(true);
    try {
      console.log("=== CHAMANDO requestDataDeletion ===");
      await requestDataDeletion();
      
      console.log("=== EXCLUSÃO SOLICITADA COM SUCESSO ===");
      toast.success("Solicitação de exclusão enviada com sucesso! Você receberá um email de confirmação.");
      setShowDeleteModal(false);
      setConfirmationText("");
      
      // Opcional: redirecionar para página de logout após alguns segundos
      setTimeout(() => {
        window.location.href = "/logout";
      }, 3000);
    } catch (error) {
      console.error("=== ERRO NA EXCLUSÃO ===", error);
      toast.error(error instanceof Error ? error.message : "Erro ao solicitar exclusão da conta");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
        </div>
      </div>

      {/* Notification Settings
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} className="text-orange-600" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Notificações por Email</Label>
                <p className="text-sm text-gray-500">Receba atualizações por email</p>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, email: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Notificações SMS</Label>
                <p className="text-sm text-gray-500">Receba alertas por SMS</p>
              </div>
              <Switch 
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, sms: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Notificações Push</Label>
                <p className="text-sm text-gray-500">Notificações no navegador</p>
              </div>
              <Switch 
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, push: checked}))}
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Tipos de Notificação</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Novos Eventos</Label>
                <p className="text-sm text-gray-500">Alertas sobre novos eventos disponíveis</p>
              </div>
              <Switch 
                checked={notifications.events}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, events: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Pagamentos</Label>
                <p className="text-sm text-gray-500">Confirmações e lembretes de pagamento</p>
              </div>
              <Switch 
                checked={notifications.payments}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, payments: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Lembretes</Label>
                <p className="text-sm text-gray-500">Lembretes de eventos próximos</p>
              </div>
              <Switch 
                checked={notifications.reminders}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, reminders: checked}))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      */}

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} className="text-orange-600" />
            Segurança
          </CardTitle>
          <CardDescription>
            Configurações de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Senha Atual</Label>
              <div className="relative mt-1">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Digite sua senha atual"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Mínimo 8 caracteres, com pelo menos uma letra maiúscula, minúscula e um número
              </p>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  As senhas não coincidem
                </p>
              )}
            </div>

            <Button 
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              onClick={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Alterando...
                </>
              ) : (
                "Alterar Senha"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LGPD Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-orange-600" />
            Privacidade e Proteção de Dados (LGPD)
          </CardTitle>
          <CardDescription>
            Gerencie seus dados pessoais e direitos de privacidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-2">
                <FileText size={16} />
                Seus Direitos de Privacidade
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Acesso:</strong> Visualizar todos os dados que temos sobre você</li>
                <li>• <strong>Portabilidade:</strong> Exportar seus dados em formato legível</li>
                <li>• <strong>Correção:</strong> Atualizar informações incorretas</li>
                <li>• <strong>Exclusão:</strong> Solicitar a remoção completa de seus dados</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                className="flex items-center gap-2 h-auto py-3"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                <Download size={16} />
                <div className="text-left">
                  <div className="font-medium">Exportar Dados</div>
                  <div className="text-xs text-gray-500">Download dos seus dados pessoais</div>
                </div>
              </Button>

              <Button 
                variant="destructive"
                className="flex items-center gap-2 h-auto py-3 bg-red-600 hover:bg-red-700"
                onClick={() => {
                  console.log("=== BOTÃO EXCLUIR CONTA CLICADO ===");
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 size={16} />
                <div className="text-left">
                  <div className="font-medium">Excluir Conta</div>
                  <div className="text-xs text-red-100">Ação irreversível</div>
                </div>
              </Button>
            </div>

            {/* Modal de Exclusão de Conta */}
            {showDeleteModal && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={(e) => {
                  // Fechar modal apenas se clicar no backdrop, não no conteúdo
                  if (e.target === e.currentTarget) {
                    setShowDeleteModal(false);
                    setConfirmationText("");
                  }
                }}
              >
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-2 text-red-600 mb-6">
                      <AlertTriangle size={20} />
                      <h2 className="text-xl font-bold">Confirmar Exclusão de Conta</h2>
                    </div>
                    
                    {/* Content */}
                    <div className="text-left space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="font-semibold text-red-800 mb-2">⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL</p>
                        <p className="text-red-700">
                          Ao confirmar a exclusão da sua conta, todos os seus dados serão permanentemente removidos 
                          do nosso sistema em até 30 dias úteis.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">O que será excluído:</h4>
                        <ul className="text-sm space-y-1 ml-4 text-gray-700">
                          <li>• Todos os seus dados pessoais e de perfil</li>
                          <li>• Histórico de inscrições em eventos</li>
                          <li>• Dados de pagamento (mantendo apenas registros fiscais obrigatórios)</li>
                          <li>• Preferências e configurações da conta</li>
                          <li>• Mensagens e comunicações</li>
                        </ul>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-amber-800 mb-2">📋 Importante sobre dependentes:</h4>
                        <p className="text-amber-700 text-sm">
                          Se você possui inscrições com dependentes cadastrados, eles também serão excluídos 
                          <strong> apenas se não possuírem conta própria no sistema</strong>. 
                          Dependentes que já criaram conta de usuário não serão afetados.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">📄 Registros mantidos por lei:</h4>
                        <p className="text-gray-700 text-sm">
                          Conforme legislação fiscal e contábil, manteremos apenas os dados mínimos 
                          necessários para comprovação de transações financeiras pelo prazo legal de 5 anos.
                        </p>
                      </div>

                      <div className="space-y-3 mt-6">
                        <Label htmlFor="confirmation" className="text-base font-semibold text-gray-900">
                          Para confirmar, digite exatamente: <span className="text-red-600 font-mono">EXCLUIR MINHA CONTA</span>
                        </Label>
                        <Input
                          id="confirmation"
                          type="text"
                          placeholder="Digite: EXCLUIR MINHA CONTA"
                          value={confirmationText}
                          onChange={(e) => setConfirmationText(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowDeleteModal(false);
                          setConfirmationText("");
                        }}
                        disabled={isDeleting}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || confirmationText !== "EXCLUIR MINHA CONTA"}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} className="mr-2" />
                            Confirmar Exclusão
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <p>
                <strong>Dúvidas sobre seus dados?</strong> Entre em contato conosco através do email: 
                <a href="mailto:privacidade@unieventos.com" className="text-orange-600 hover:underline ml-1">
                  privacidade@unieventos.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Preferences
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail size={20} className="text-orange-600" />
            Preferências de Contato
          </CardTitle>
          <CardDescription>
            Como você prefere ser contatado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Principal</Label>
            <Input
              id="email"
              type="email"
              defaultValue="usuario@exemplo.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              defaultValue="(11) 99999-9999"
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="email-primary" defaultChecked />
            <Label htmlFor="email-primary">
              Email como método principal de contato
            </Label>
          </div>
        </CardContent>
      </Card>
      */}

      {/* Save Button 
      <div className="flex justify-end">
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Save size={16} className="mr-2" />
          Salvar Configurações
        </Button>
      </div>
      */}
    </div>
  );
}