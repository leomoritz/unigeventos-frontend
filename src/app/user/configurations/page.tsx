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
  Loader2
} from "lucide-react";
import { useState } from "react";
import { changePassword, validatePassword } from "@/services/settingsService";
import { toast } from "react-toastify";

export default function ConfigurationsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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