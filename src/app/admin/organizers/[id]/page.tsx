/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { OrganizerForm } from "@/components/organizers/OrganizerForm";
import { OrganizerFormData } from "@/schemas/organizerSchema";
import { UserCheck, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { useOrganizer } from "@/hooks/useOrganizers";
import PageHeader from "@/components/admin/PageHeader";
import ModernCard from "@/components/admin/ModernCard";
import Link from "next/link";

export default function EditOrganizerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    organizer, 
    loading, 
    error, 
    updateOrganizerMutation,
    fetchOrganizer
  } = useOrganizer(id);

  const handleSubmit = async (data: OrganizerFormData) => {
    try {
      setIsSubmitting(true);
      await updateOrganizerMutation(data);
      router.push("/admin/organizers/list");
    } catch (err: any) {
      console.error("Error updating organizer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    fetchOrganizer();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Carregando organizador..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <PageHeader
            title="Editar Organizador"
            description="Erro ao carregar organizador"
            icon={<UserCheck className="h-6 w-6" />}
            backHref="/admin/organizers/list"
          />

          <div className="mt-8">
            <ModernCard className="text-center border-red-500/20">
              <div className="p-4 bg-red-600/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-red-400 mb-2">
                Erro ao Carregar Organizador
              </h2>
              <p className="text-slate-400 mb-6">{error}</p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                >
                  <Loader2 className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Link href="/admin/organizers/list">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white">
                    Voltar à Lista
                  </Button>
                </Link>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <PageHeader
          title="Editar Organizador"
          description={`Atualize as informações do organizador${organizer?.name ? `: ${organizer.name}` : ''}`}
          icon={<UserCheck className="h-6 w-6" />}
          backHref="/admin/organizers/list"
        />

        {/* Form Section */}
        <div className="mt-6 md:mt-8">
          {organizer && (
            <OrganizerForm 
              onSubmit={handleSubmit} 
              defaultValues={organizer} 
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
