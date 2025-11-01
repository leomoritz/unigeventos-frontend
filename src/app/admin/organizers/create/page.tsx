/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { OrganizerForm } from "@/components/organizers/OrganizerForm";
import { OrganizerFormData } from "@/schemas/organizerSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useOrganizer } from "@/hooks/useOrganizers";
import PageHeader from "@/components/admin/PageHeader";

export default function CreateOrganizerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createOrganizerMutation } = useOrganizer();

  const handleSubmit = async (data: OrganizerFormData) => {
    try {
      setIsSubmitting(true);
      await createOrganizerMutation(data);
      router.push("/admin/organizers/list");
    } catch (err: any) {
      console.error("Error creating organizer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <PageHeader
          title="Novo Organizador"
          description="Cadastre um novo organizador de eventos"
          icon={<UserPlus className="h-6 w-6" />}
          backHref="/admin/organizers/list"
        />

        {/* Form Section */}
        <div className="mt-6 md:mt-8">
          <OrganizerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
