/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ModernCard from "@/components/admin/ModernCard";
import { useEffect } from "react";
import { Loader2, Tag, Percent, Calendar, Save, X } from "lucide-react";
import Link from "next/link";
import {
  DiscountCouponFormData,
  discountCouponSchema,
} from "@/schemas/discountCouponSchema";
import { CustomDatePicker } from "../ui/CustomDatePicker";

interface DiscountCouponFormProps {
  onSubmit: (data: DiscountCouponFormData) => void;
  defaultValues?: DiscountCouponFormData;
  isSubmitting?: boolean;
}

export function DiscountCouponForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: DiscountCouponFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<DiscountCouponFormData>({
    resolver: zodResolver(discountCouponSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informações Básicas */}
        <ModernCard className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg">
              <Tag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
                Informações do Cupom
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Configure os detalhes do seu cupom promocional
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Código do Cupom */}
            <div className="space-y-3">
              <Label htmlFor="code" className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-orange-500" />
                Código do Cupom *
              </Label>
              <Input
                id="code"
                placeholder="Ex: DESCONTO10, PROMO2025"
                {...register("code")}
                className="h-12 rounded-xl bg-slate-800/50 dark:bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 hover:border-slate-600 transition-all duration-200 uppercase"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.code && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <span className="text-red-400">⚠</span> {errors.code.message}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use apenas letras maiúsculas e números, sem espaços
              </p>
            </div>

            {/* Grid de campos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Percentual de Desconto */}
              <div className="space-y-3">
                <Label htmlFor="discount" className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <Percent className="h-4 w-4 text-orange-500" />
                  Percentual de Desconto *
                </Label>
                <div className="relative">
                  <Input
                    id="discount"
                    type="number"
                    placeholder="Ex: 10, 15, 20"
                    {...register("discountPercentage", { valueAsNumber: true })}
                    className="h-12 rounded-xl bg-slate-800/50 dark:bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 hover:border-slate-600 transition-all duration-200 pr-12"
                    min="1"
                    max="100"
                    step="1"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 text-lg font-semibold pointer-events-none">
                    %
                  </span>
                </div>
                {errors.discountPercentage && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <span className="text-red-400">⚠</span> {errors.discountPercentage.message}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Digite um valor entre 1% e 100%
                </p>
              </div>

              {/* Data de Expiração */}
              <div className="space-y-3">
                <Label htmlFor="expiration" className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  Data de Expiração *
                </Label>
                <CustomDatePicker
                  name="expirationDate"
                  control={control}
                  placeholder="Selecione a data de expiração"
                  withTime={false}
                />
                {errors.expirationDate && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <span className="text-red-400">⚠</span> {errors.expirationDate.message}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  O cupom ficará ativo até a data selecionada
                </p>
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Botões de Ação */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 p-6 -mx-6 sm:-mx-8 lg:-mx-10 mt-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto sm:max-w-none">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando cupom...
                </div>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Salvar Cupom
                </>
              )}
            </Button>
            
            <Link href="/admin/coupons/list" className="flex-1">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="w-full h-12 font-medium transition-all duration-200 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border-slate-600 hover:border-slate-500"
              >
                <X className="h-5 w-5 mr-2" />
                Cancelar
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
