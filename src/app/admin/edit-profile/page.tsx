"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft, Loader2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import ModernCard from "@/components/admin/ModernCard";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { getCurrentUserPerson } from "@/services/profileService";
import { PersonResponse } from "@/services/personService";

export default function EditProfilePage() {
  const router = useRouter();
  const [person, setPerson] = useState<PersonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCurrentUserPerson();
        setPerson(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar perfil";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSuccess = () => {
    router.push("/admin/profile");
  };

  const handleCancel = () => {
    router.push("/admin/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ModernCard className="p-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-slate-400">Carregando perfil...</p>
            </div>
          </ModernCard>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ModernCard className="p-8">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => router.push("/admin")} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Voltar ao Dashboard
              </Button>
            </div>
          </ModernCard>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ModernCard className="p-8">
            <div className="text-center">
              <p className="text-orange-400 mb-4">Este usuário não possui uma pessoa associada.</p>
              <Button onClick={() => router.push("/admin")} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Voltar ao Dashboard
              </Button>
            </div>
          </ModernCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader
          icon={<Edit className="h-6 w-6 sm:h-8 sm:w-8" />}
          title="Editar Perfil"
          description="Atualize suas informações pessoais"
          actions={
            <Button
              onClick={() => router.push("/admin/profile")}
              variant="outline"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          }
        />

        {/* Edit Form */}
        <ProfileEditForm 
          person={person} 
          theme="dark" 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
