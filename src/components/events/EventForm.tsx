"use client";

import React from "react";
import { Controller, FormProvider, useForm, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  FileText, 
  Tag, 
  Users, 
  Clock, 
  DollarSign, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Save,
  X,
  Info,
  Smile
} from "lucide-react";
import { EventFormData, eventSchema } from "@/schemas/eventSchema";
import Select from "../ui/select";
import { CustomToggle } from "../ui/customToggle";
import { CustomDateTimePicker } from "../ui/CustomDateTimePicker";
import { CustomDatePicker } from "../ui/CustomDatePicker";
import { BatchList } from "./BatchList";
import Link from "next/link";
import { OrganizerResponse } from "@/services/organizersService";
import ModernCard from "@/components/admin/ModernCard";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import "../../styles/datepicker.css";
import "../../styles/rich-text-editor.css";

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  defaultValues?: EventFormData;
  isSubmitting?: boolean;
  organizers: OrganizerResponse[];
}

interface OrganizerOption {
  value: string;
  label: string;
}

const eventTypes = [
  { label: "Retiro", value: "RETREAT" },
  { label: "Retiro de Líderes", value: "LEADERS_RETREAT" },
  { label: "Reunião", value: "MEETING" },
  { label: "Conferência", value: "CONFERENCE" },
  { label: "Workshop", value: "WORKSHOP" },
  { label: "Seminário", value: "SEMINARY" },
  { label: "Vigília", value: "VIGIL" },
  { label: "Culto", value: "CULT" },
  { label: "Coral", value: "CORAL" },
  { label: "Concerto", value: "CONCERT" },
  { label: "Teatro", value: "THEATER" },
  { label: "Curso", value: "COURSE" },
  { label: "Evangelismo", value: "EVANGELISM" },
];

const steps = [
  { title: "Informações Básicas", icon: Info, description: "Nome, descrição e tipo do evento" },
  { title: "Datas e Capacidade", icon: Calendar, description: "Cronograma e limites do evento" },
  { title: "Lotes", icon: DollarSign, description: "Configuração de preços e lotes" },
  { title: "Opções Finais", icon: Settings, description: "Configurações adicionais" },
];

export function EventForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  organizers,
}: EventFormProps) {
  const [step, setStep] = useState(0);

  // Função para salvar apenas quando explicitamente solicitado
  const handleSave = async () => {
    const isValid = await trigger(); // Valida todos os campos
    if (isValid) {
      const formData = methods.getValues();
      onSubmit(formData);
    }
  };

  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...defaultValues,
      isPublished: defaultValues?.isPublished ?? false,
      hasTransport: defaultValues?.hasTransport ?? false,
      termIsRequired: defaultValues?.termIsRequired ?? false,
      isFree: defaultValues?.isFree ?? true,
      type: defaultValues?.type ?? "",
      organizer: defaultValues?.organizer ?? undefined,
      batches: defaultValues?.batches ?? [],
    },
    mode: "onTouched",
  });

  const organizerOptions: OrganizerOption[] = organizers.map((org) => ({
    value: org.id,
    label: org.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues });
    }
  }, [defaultValues, reset]);

  const nextStep = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Previne qualquer submissão do formulário
    event.preventDefault();
    event.stopPropagation();

    // Verificação adicional - não fazer nada se já estiver no último step
    if (step >= 3) {
      return;
    }

    let fieldsToValidate: (keyof EventFormData)[] = [];

    if (step === 0) {
      fieldsToValidate = ["name", "description", "location", "type", "organizer"];
    } else if (step === 1) {
      fieldsToValidate = [
        "startDatetime",
        "endDatetime",
        "registrationStartDate",
        "registrationDeadline",
        "capacity",
      ];
    } else if (step === 2) {
      // Para lotes, só validar se não for gratuito
      const isFree = methods.watch("isFree");
      if (!isFree) {
        await trigger("batches");
        fieldsToValidate = ["batches"];
      }
    }

    const valid = await trigger(fieldsToValidate);
    
    if (valid && step < 3) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Previne qualquer submissão do formulário
    event.preventDefault();
    event.stopPropagation();
    setStep((s) => s - 1);
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((stepInfo, index) => {
            const StepIcon = stepInfo.icon;
            return (
              <div key={index} className="flex items-center flex-1">
                <div className={`flex items-center gap-3 ${index <= step ? 'text-orange-400' : 'text-neutral-500'}`}>
                  <div className={`p-2 rounded-full border-2 ${
                    index < step 
                      ? 'bg-orange-600 border-orange-600 text-white' 
                      : index === step 
                      ? 'bg-orange-600/20 border-orange-400 text-orange-400'
                      : 'bg-transparent border-neutral-600 text-neutral-500'
                  }`}>
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{stepInfo.title}</p>
                    <p className="text-xs text-neutral-400">{stepInfo.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < step ? 'bg-orange-600' : 'bg-neutral-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <ModernCard className="p-6 md:p-8">
            <div className="space-y-8">
              {/* Header do Step */}
              <div className="flex items-center gap-3 pb-6 border-b border-slate-700/50">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  {React.createElement(steps[step].icon, { className: "h-5 w-5 text-orange-500" })}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {steps[step].title}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {steps[step].description}
                  </p>
                </div>
              </div>

              {step === 0 && (
                <div className="space-y-6">
                  {/* Grid para campos do step 1 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Nome do Evento */}
                    <div className="lg:col-span-2 space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Tag className="h-4 w-4 text-orange-500" />
                        Nome do Evento *
                      </label>
                      <Input 
                        placeholder="Digite o nome do evento..."
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

                    {/* Local */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        Local do Evento *
                      </label>
                      <Input 
                        placeholder="Informe o local do evento..."
                        {...register("location")}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 h-12 px-4"
                      />
                      {errors.location && (
                        <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                          <X className="h-3 w-3" />
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    {/* Tipo de Evento */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Tag className="h-4 w-4 text-orange-500" />
                        Tipo de Evento *
                      </label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }: { field: any }) => (
                          <Select
                            {...field}
                            options={eventTypes}
                            placeholder="Selecione o tipo de evento"
                            value={field.value}
                          />
                        )}
                      />
                      {errors.type && (
                        <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                          <X className="h-3 w-3" />
                          {errors.type.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Organizador - ocupando linha completa */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <Users className="h-4 w-4 text-orange-500" />
                      Organizador Responsável *
                    </label>
                    <Controller
                      name="organizer.id"
                      control={control}
                      render={({ field }: { field: any }) => (
                        <Select
                          {...field}
                          options={organizerOptions}
                          placeholder="Selecione um organizador"
                          value={
                            organizerOptions.find(
                              (option) => option.value === field?.value
                            )?.value || ""
                          }
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                    {errors.organizer && (
                      <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                        <X className="h-3 w-3" />
                        {errors.organizer.message}
                      </p>
                    )}
                  </div>

                  {/* Descrição - ocupando linha completa */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <FileText className="h-4 w-4 text-orange-500" />
                      Descrição do Evento *
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }: { field: any }) => (
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="📝 Descreva seu evento de forma atrativa! Use emojis e formatação para tornar mais interessante...

🎯 Exemplo: 
**Prepare-se para uma experiência transformadora!** 
🙏 Momento de *adoração* e comunhão
🎵 Louvor especial com convidados
🍽️ Coffee break incluído
📍 **Local**: Auditório Principal"
                          maxLength={500}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                        <X className="h-3 w-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-8">
                  {/* Seção: Cronograma do Evento */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                      <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Cronograma do Evento</h3>
                        <p className="text-sm text-slate-400">Defina as datas e horários do evento</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Data e Hora de Início */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <Clock className="h-4 w-4 text-orange-500" />
                          Data e Hora de Início *
                        </label>
                        <CustomDateTimePicker
                          name="startDatetime"
                          control={control}
                          placeholder="Selecione data e hora de início"
                        />
                        {errors.startDatetime && (
                          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                            <X className="h-3 w-3" />
                            {errors.startDatetime.message}
                          </p>
                        )}
                      </div>

                      {/* Data e Hora de Término */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <Clock className="h-4 w-4 text-orange-500" />
                          Data e Hora de Término *
                        </label>
                        <CustomDateTimePicker
                          name="endDatetime"
                          control={control}
                          placeholder="Selecione data e hora de término"
                        />
                        {errors.endDatetime && (
                          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                            <X className="h-3 w-3" />
                            {errors.endDatetime.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seção: Período de Inscrições */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                      <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Período de Inscrições</h3>
                        <p className="text-sm text-slate-400">Configure quando as inscrições estarão abertas</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Início das Inscrições */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          Início das Inscrições *
                        </label>
                        <CustomDatePicker
                          name="registrationStartDate"
                          control={control}
                          placeholder="Data de início das inscrições"
                          withTime={false}
                        />
                        {errors.registrationStartDate && (
                          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                            <X className="h-3 w-3" />
                            {errors.registrationStartDate.message}
                          </p>
                        )}
                      </div>

                      {/* Término das Inscrições */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          Término das Inscrições *
                        </label>
                        <CustomDatePicker
                          name="registrationDeadline"
                          control={control}
                          placeholder="Data limite para inscrições"
                          withTime={false}
                        />
                        {errors.registrationDeadline && (
                          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                            <X className="h-3 w-3" />
                            {errors.registrationDeadline.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seção: Configurações Avançadas */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                      <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Settings className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Configurações Avançadas</h3>
                        <p className="text-sm text-slate-400">Capacidade e opções de pagamento</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Capacidade */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <Users className="h-4 w-4 text-orange-500" />
                          Capacidade do Evento *
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Ex: 100"
                            min="1"
                            max="10000"
                            {...register("capacity", { 
                              valueAsNumber: true,
                              required: "Capacidade é obrigatória",
                              min: { value: 1, message: "Capacidade deve ser pelo menos 1" },
                              max: { value: 10000, message: "Capacidade não pode exceder 10.000" }
                            })}
                            className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 h-12 px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                            pessoas
                          </div>
                        </div>
                        {errors.capacity && (
                          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                            <X className="h-3 w-3" />
                            {errors.capacity.message}
                          </p>
                        )}
                      </div>

                      {/* Data Limite para Pagamento */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <DollarSign className="h-4 w-4 text-orange-500" />
                          Limite para Pagamento
                          <span className="text-xs text-slate-500 ml-1">(opcional)</span>
                        </label>
                        <CustomDatePicker
                          name="finalDatePayment"
                          control={control}
                          placeholder="Data limite para pagamento (opcional)"
                          withTime={false}
                        />
                        {errors.finalDatePayment && (
                          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                            <X className="h-3 w-3" />
                            {errors.finalDatePayment.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  {/* Seção: Configuração de Preço */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                      <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <DollarSign className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Configuração de Preço</h3>
                        <p className="text-sm text-slate-400">Defina se o evento é gratuito ou pago</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                      <Controller
                        name="isFree"
                        control={control}
                        render={({ field }: { field: any }) => (
                          <CustomToggle
                            id="isFree"
                            label="Evento é gratuito?"
                            checked={!!field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <p className="text-xs text-slate-400 mt-3">
                        💡 Marque esta opção se o evento não cobra inscrição dos participantes
                      </p>
                    </div>
                  </div>

                  {/* Seção: Lotes de Pagamento - apenas se evento for pago */}
                  {!methods.watch("isFree") && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                        <div className="p-1.5 bg-orange-500/10 rounded-lg">
                          <Tag className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">Lotes de Pagamento</h3>
                          <p className="text-sm text-slate-400">Configure os preços e períodos dos lotes</p>
                        </div>
                      </div>

                      <div className="bg-slate-800/20 rounded-xl border border-slate-700/50 p-6">
                        <div className="max-h-[500px] overflow-y-auto">
                          <BatchList />
                        </div>
                        {errors.batches && (
                          <p className="text-red-400 text-sm flex items-center gap-1 mt-4">
                            <X className="h-3 w-3" />
                            {errors.batches.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Informação sobre evento gratuito */}
                  {methods.watch("isFree") && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-green-500/10 rounded-lg flex-shrink-0">
                          <Info className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-green-400 font-medium mb-1">Evento Gratuito</h4>
                          <p className="text-green-400/80 text-sm">
                            Este evento será gratuito. Não é necessário configurar lotes de pagamento.
                            Os participantes poderão se inscrever sem custos.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  {/* Seção: Opções de Transporte */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                      <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Settings className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Opções de Transporte</h3>
                        <p className="text-sm text-slate-400">Configure se o evento oferece transporte</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                      <Controller
                        name="hasTransport"
                        control={control}
                        render={({ field }: { field: any }) => (
                          <CustomToggle
                            id="hasTransport"
                            label="Fornecer transporte para o evento?"
                            checked={!!field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <p className="text-xs text-slate-400 mt-3">
                        � Marque esta opção se o evento incluir transporte para os participantes
                      </p>
                    </div>
                  </div>

                  {/* Seção: Requisitos de Inscrição */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                      <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <FileText className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Requisitos de Inscrição</h3>
                        <p className="text-sm text-slate-400">Defina documentos necessários para inscrição</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                      <Controller
                        name="termIsRequired"
                        control={control}
                        render={({ field }: { field: any }) => (
                          <CustomToggle
                            id="termIsRequired"
                            label="Exigir termo pastoral para inscrição?"
                            checked={!!field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <p className="text-xs text-slate-400 mt-3">
                        📋 Marque para exigir um termo pastoral assinado durante a inscrição
                      </p>
                    </div>
                  </div>

                  {/* Seção: Status de Publicação */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                      <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Settings className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Status de Publicação</h3>
                        <p className="text-sm text-slate-400">Controle a visibilidade do evento</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                      <Controller
                        name="isPublished"
                        control={control}
                        render={({ field }: { field: any }) => (
                          <CustomToggle
                            id="isPublished"
                            label="Publicar evento imediatamente?"
                            checked={!!field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <div className={`text-xs mt-3 transition-colors ${
                        methods.watch("isPublished") ? "text-green-400" : "text-yellow-400"
                      }`}>
                        {methods.watch("isPublished") 
                          ? "✅ O evento ficará visível e disponível para inscrições públicas"
                          : "⏸️ O evento será salvo como rascunho e não ficará visível publicamente"
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </ModernCard>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => prevStep(e)}
                className="flex-1 border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800/50 font-medium py-3 px-6 rounded-lg transition-all duration-200 h-12"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={(e) => nextStep(e)}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 h-12"
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
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
                    Salvar Evento
                  </div>
                )}
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-400">
              * Campos obrigatórios. Todos os dados serão validados antes do salvamento.
            </p>
            <Link 
              href="/admin/events/list" 
              className="text-orange-400 hover:text-orange-300 underline text-sm mt-2 inline-block"
            >
              Cancelar e voltar para a lista
            </Link>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
