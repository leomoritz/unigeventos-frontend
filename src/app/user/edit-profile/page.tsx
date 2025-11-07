"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone,
  Save,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { UpdatePersonPayload } from "@/services/profileService";
import { choralVoiceTypeLabels } from "@/services/personService";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, loading, error, updateProfile, updating } = useProfile();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<UpdatePersonPayload>({
    name: "",
    birthdate: "",
    gender: "",
    maritalStatus: "",
    church: "",
    clothingSize: "",
    choralVoiceType: "",
    phoneNumber: "",
    documentNumber: "",
    personalContactEmail: ""
  });

  useEffect(() => {
    if (profile) {
      // Função para formatar data evitando problemas de timezone
      const formatDateForInput = (date: Date | string) => {
        if (!date) return "";
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      setFormData({
        name: profile.name || "",
        birthdate: profile.birthdate ? formatDateForInput(profile.birthdate) : "",
        gender: profile.gender || "",
        maritalStatus: profile.maritalStatus || "",
        church: profile.church || "",
        clothingSize: profile.clothingSize || "",
        choralVoiceType: profile.choralVoiceType || "",
        phoneNumber: profile.contact?.phoneNumber || "",
        documentNumber: profile.document?.number || "",
        personalContactEmail: profile.contact?.email || ""
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UpdatePersonPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/user/profile');
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-600" />
          <p className="mt-4 text-gray-600">Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Erro ao carregar perfil</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link href="/user/profile">
            <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
              Voltar ao perfil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/user/profile">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
            <p className="text-gray-600">Atualize suas informações pessoais</p>
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800">Perfil atualizado com sucesso! Redirecionando...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-orange-600" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Mantenha seus dados pessoais atualizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="birthdate">Data de Nascimento</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleInputChange("birthdate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gênero</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Selecione...</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                </select>
              </div>

              <div>
                <Label htmlFor="maritalStatus">Estado Civil</Label>
                <select
                  id="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Selecione...</option>
                  <option value="SINGLE">Solteiro(a)</option>
                  <option value="MARRIED">Casado(a)</option>
                  <option value="DIVORCED">Divorciado(a)</option>
                  <option value="NOT_INFORMED">Não Informado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="church">Igreja</Label>
                <Input
                  id="church"
                  value={formData.church}
                  onChange={(e) => handleInputChange("church", e.target.value)}
                  placeholder="Nome da sua igreja"
                />
              </div>

              <div>
                <Label htmlFor="documentNumber">CPF</Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} className="text-orange-600" />
              Informações de Contato
            </CardTitle>
            <CardDescription>
              Como podemos entrar em contato com você
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="personalContactEmail">Email Pessoal</Label>
              <Input
                id="personalContactEmail"
                type="email"
                value={formData.personalContactEmail}
                onChange={(e) => handleInputChange("personalContactEmail", e.target.value)}
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Telefone</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-orange-600" />
              Informações Adicionais
            </CardTitle>
            <CardDescription>
              Informações específicas para eventos e atividades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clothingSize">Tamanho da Roupa</Label>
                <select
                  id="clothingSize"
                  value={formData.clothingSize}
                  onChange={(e) => handleInputChange("clothingSize", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Selecione...</option>
                  <option value="PP">PP</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                  <option value="XG">XG</option>
                  <option value="XXG">XXG</option>
                </select>
              </div>

              <div>
                <Label htmlFor="choralVoiceType">Tipo de Voz Coral</Label>
                <select
                  id="choralVoiceType"
                  value={formData.choralVoiceType}
                  onChange={(e) => handleInputChange("choralVoiceType", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Selecione...</option>
                  {Object.entries(choralVoiceTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/user/profile">
            <Button variant="outline" disabled={updating}>
              Cancelar
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700"
            disabled={updating}
          >
            {updating ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}