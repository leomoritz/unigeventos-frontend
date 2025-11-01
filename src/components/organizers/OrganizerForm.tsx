/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizerSchema, OrganizerFormData } from "@/schemas/organizerSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2, User, Mail, Phone, FileText, Save, X } from "lucide-react";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.br";
import Link from "next/link";
import ModernCard from "@/components/admin/ModernCard";

interface OrganizerFormProps {
  onSubmit: (data: OrganizerFormData) => void;
  defaultValues?: OrganizerFormData;
  isSubmitting?: boolean;
}

export function OrganizerForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: OrganizerFormProps) {
  const {
    register,
    handleSubmit,
    control, // ✅ Adicione isso aqui!
    formState: { errors },
    reset,
  } = useForm<OrganizerFormData>({
    resolver: zodResolver(organizerSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <ModernCard className="p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-700/50">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <User className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Informações do Organizador
            </h2>
            <p className="text-slate-400 text-sm">
              Preencha os dados do organizador
            </p>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nome Field */}
          <div className="lg:col-span-2 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <User className="h-4 w-4 text-orange-500" />
              Nome Completo *
            </label>
            <Input
              placeholder="Digite o nome completo do organizador"
              {...register("name")}
              className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 h-12 px-4"
            />
            {errors.name && (
              <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                <X className="h-3 w-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Mail className="h-4 w-4 text-orange-500" />
              Email de Contato *
            </label>
            <Input
              type="email"
              placeholder="contato@empresa.com"
              {...register("contact.email")}
              className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 h-12 px-4"
            />
            {errors.contact?.email && (
              <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                <X className="h-3 w-3" />
                {errors.contact.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Phone className="h-4 w-4 text-orange-500" />
              Telefone de Contato *
            </label>
            <Controller
              name="contact.phoneNumber"
              control={control}
              render={({ field }) => (
                <Cleave
                  {...field}
                  placeholder="(11) 9 9999-9999"
                  options={{
                    delimiters: ["(", ") ", " ", "-"],
                    blocks: [0, 2, 1, 4, 4],
                    numericOnly: true,
                  }}
                  className="flex h-12 w-full rounded-md border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-white placeholder-slate-400 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              )}
            />
            {errors.contact?.phoneNumber && (
              <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                <X className="h-3 w-3" />
                {errors.contact.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Additional Details Field */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <FileText className="h-4 w-4 text-orange-500" />
            Detalhes Adicionais
          </label>
          <Textarea
            placeholder="Informações complementares sobre o organizador (opcional)..."
            {...register("additionalDetails")}
            className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 min-h-[120px] resize-none px-4 py-3"
          />
          {errors.additionalDetails && (
            <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
              <X className="h-3 w-3" />
              {errors.additionalDetails.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-700/50 sticky bottom-0 bg-slate-900/95 backdrop-blur-sm -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 pb-6 md:pb-8">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {defaultValues ? "Atualizar Organizador" : "Criar Organizador"}
                </span>
                <span className="sm:hidden">
                  {defaultValues ? "Atualizar" : "Criar"}
                </span>
              </div>
            )}
          </Button>
          
          <Link href="/admin/organizers/list" className="flex-1">
            <Button
              type="button"
              disabled={isSubmitting}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800/50 font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 h-12"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-center -mt-2">
          <p className="text-xs text-slate-400">
            * Campos obrigatórios. Todos os dados serão validados antes do salvamento.
          </p>
        </div>
      </form>
    </ModernCard>
  );
}
