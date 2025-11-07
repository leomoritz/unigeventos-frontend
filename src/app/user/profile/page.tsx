"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Edit3,
  Shield,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { genderTypeLabels, maritalStatusTypeLabels, choralVoiceTypeLabels } from "@/services/personService";
import { formatDate } from "date-fns";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading, error } = useProfile();
  const { roles: contextRoles } = useAuth(); // Roles do contexto/middleware

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-600" />
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
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
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Perfil não encontrado</h2>
          <p className="mt-2 text-gray-600">Não foi possível encontrar os dados do seu perfil.</p>
        </div>
      </div>
    );
  }

  // Função para formatar datas de nascimento (evita problemas de timezone)
  const formatBirthDate = (date: Date | string) => {
    if (!date) return 'Não informado';
    
    // Solução mais simples: adicionar horário para evitar interpretação UTC
    let dateToFormat;
    if (typeof date === 'string') {
      // Se a string não tem horário, adicionar meio-dia para evitar problemas de timezone
      const dateString = date.includes('T') ? date : date + 'T12:00:00';
      dateToFormat = new Date(dateString);
    } else {
      dateToFormat = date;
    }

    return dateToFormat.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Função para formatar timestamps de login (formato Instant do backend)
  const formatLastLoginDate = (date: Date | string) => {
    if (!date) return 'Não disponível';
    
    // Para timestamps, usar diretamente o construtor Date
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }) + ' às ' + dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return '***.***.***-**';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return 'Não informado';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Visualize suas informações pessoais</p>
        </div>
        <Button 
        className="bg-orange-600 hover:bg-orange-700"
        onClick={() => router.push('/user/edit-profile')}>
          <Edit3 size={16} className="mr-2" />
          Editar Perfil
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center overflow-hidden">
              {profile.photo ? (
                <img 
                  src={profile.photo} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600">
                Membro desde {profile.login?.createdDate ? formatLastLoginDate(profile.login.createdDate) : 'Data não informada'}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Perfil Ativo
                </Badge>
                {profile.isLeader && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Líder
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-orange-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome Completo</label>
              <p className="text-gray-900 font-medium">{profile.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
              <p className="text-gray-900">
                {profile.birthdate ? formatBirthDate(profile.birthdate) : 'Não informado'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">CPF</label>
              <p className="text-gray-900">
                {profile.document?.number ? formatCPF(profile.document.number) : '***.***.***-**'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Gênero</label>
              <p className="text-gray-900">
                {genderTypeLabels[profile.gender] || 'Não informado'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Estado Civil</label>
              <p className="text-gray-900">
                {maritalStatusTypeLabels[profile.maritalStatus] || 'Não informado'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Igreja</label>
              <p className="text-gray-900">{profile.church || 'Não informado'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} className="text-orange-600" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email do Sistema</label>
              <p className="text-gray-900">{profile.login?.username || 'Não informado'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email Pessoal</label>
              <p className="text-gray-900">{profile.contact?.email || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              <p className="text-gray-900">
                {profile.contact?.phoneNumber ? formatPhone(profile.contact.phoneNumber) : 'Não informado'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} className="text-orange-600" />
            Informações Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Tamanho da Roupa</label>
              <p className="text-gray-900">{profile.clothingSize || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Tipo de Voz Coral</label>
              <p className="text-gray-900">
                {choralVoiceTypeLabels[profile.choralVoiceType] || 'Não informado'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tipo de Documento</label>
              <p className="text-gray-900">{profile.document?.documentType || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} className="text-orange-600" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">ID do Usuário</label>
              <p className="text-gray-900 font-mono text-sm">{profile.id}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Último Acesso</label>
              <p className="text-gray-900">
                {profile.login?.lastLogin ? formatLastLoginDate(profile.login.lastLogin) : 'Não disponível'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status da Conta</label>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Ativa
                </Badge>
                {profile.isLeader && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Líder
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Perfis de Acesso</label>
              <div className="flex flex-wrap gap-1">
                {contextRoles && contextRoles.length > 0 ? (
                  contextRoles.map((role, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {role.replace('ROLE_', '')}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-900">Nenhum perfil definido</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                * Perfis mapeados pelo middleware de autenticação
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} className="text-orange-600" />
            Resumo de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">-</div>
              <div className="text-sm text-gray-500">Eventos Inscritos</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">-</div>
              <div className="text-sm text-gray-500">Eventos Participados</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-500">Pagamentos Realizados</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {profile.isLeader ? 'Sim' : 'Não'}
              </div>
              <div className="text-sm text-gray-500">É Líder</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              * Estatísticas de atividades serão implementadas em versões futuras
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}