/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EventForm } from "@/components/events/EventForm";
import { EventFormData } from "@/schemas/eventSchema";
import { createEvent } from "@/services/eventsService";
import { getAll, OrganizerResponse } from "@/services/organizersService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Loader2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

export default function CreateEventPage() {
  const router = useRouter();
  const [organizers, setOrganizers] = useState<OrganizerResponse[] | []>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      async function fetchOrganizers() {
        try {
          const organizersResponse = await getAll();
          setOrganizers(organizersResponse);
        } catch (error: any) {
          toast.error(`Erro ao carregar os organizadores. Causa: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }

      fetchOrganizers();
    }, []);

  const handleSubmit = async (data: EventFormData) => {
    try {
      // Transformar dados para o formato esperado pelo serviço
      const eventData = {
        ...data,
        organizerId: data.organizer.id,
        batches: data.batches?.map(batch => ({
          ...batch,
          id: "" // Para criação, o ID será gerado pelo backend
        })) || []
      };

      await createEvent(eventData);
      toast.success("Evento criado com sucesso!");
      router.push("/admin/events/list");
    } catch (err: any) {
      toast.error(`Erro ao criar evento. Causa: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2 text-orange-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Carregando organizadores...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <PageHeader
          title="Novo Evento"
          description="Crie um novo evento preenchendo as informações em etapas"
          icon={<Calendar className="h-6 w-6" />}
          backHref="/admin/events/list"
        />

        {/* Form */}
        <div className="mt-6 md:mt-8">
          <EventForm onSubmit={handleSubmit} organizers={organizers} />
        </div>
      </div>
    </div>
  );
}