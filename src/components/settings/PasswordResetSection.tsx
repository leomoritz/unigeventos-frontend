"use client";

import { useState } from "react";
import ModernCard from "@/components/admin/ModernCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle, Lock, Shield } from "lucide-react";
import { changePassword, validatePassword } from "@/services/settingsService";

interface PasswordResetSectionProps {
  theme?: "dark" | "light";
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PasswordResetSection({
  theme = "dark",
  onSuccess,
  onError,
}: PasswordResetSectionProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDark = theme === "dark";
  
  const inputClass = isDark
    ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      onError?.("Todos os campos são obrigatórios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      onError?.("As senhas não coincidem");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.message || "Senha inválida");
      onError?.(validation.message || "Senha inválida");
      return;
    }

    if (currentPassword === newPassword) {
      setError("A nova senha deve ser diferente da senha atual");
      onError?.("A nova senha deve ser diferente da senha atual");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess("Senha alterada com sucesso!");
      onSuccess?.();
      
      // Limpar os campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Remover mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao alterar senha";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg">
            <Lock className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-orange-400 mb-1">Alterar Senha</h3>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Atualize sua senha para manter sua conta segura
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 backdrop-blur-sm">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 backdrop-blur-sm">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="currentPassword" className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              Senha Atual
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                className={inputClass}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                  isDark 
                    ? "text-slate-400 hover:text-slate-200" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                disabled={isLoading}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="newPassword" className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                className={inputClass}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                  isDark 
                    ? "text-slate-400 hover:text-slate-200" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                disabled={isLoading}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className={`flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20`}>
              <Shield className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className={`text-xs ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                Mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              Confirmar Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                className={inputClass}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                  isDark 
                    ? "text-slate-400 hover:text-slate-200" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Alterando senha...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Alterar Senha</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ModernCard>
  );
}
