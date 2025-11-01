/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import PageHeader from "@/components/admin/PageHeader";
import { DiscountCouponFormData } from "@/schemas/discountCouponSchema";
import { getCouponById, updateDiscountCoupon } from "@/services/couponsService";
import { DiscountCouponForm } from "@/components/coupons/DiscountCouponForm";

export default function EditDiscountCouponPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [coupon, setCoupon] = useState<DiscountCouponFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getCouponById(id)
        .then(setCoupon)
        .catch((err: any) => {
          toast.error(`Erro ao carregar cupom de desconto: ${err.message}`);
          router.push("/admin/coupons/list");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, router]);

  const handleSubmit = async (data: DiscountCouponFormData) => {
    try {
      setIsSubmitting(true);

      await updateDiscountCoupon(id!, data);
      toast.success("Cupom de Desconto atualizado com sucesso!");
      router.push("/admin/coupons/list");
    } catch (err: any) {
      toast.error(`Erro ao atualizar cupom de desconto. Causa: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Carregando cupom..." />
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Cupom não encontrado</p>
          <Link href="/admin/coupons/list">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Voltar para a lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10">
      <PageHeader
        icon={<Tag />}
        title="Editar Cupom de Desconto"
        description="Atualize as informações do cupom promocional"
        backHref="/admin/coupons/list"
      />

      <div className="mt-8">
        <DiscountCouponForm 
          onSubmit={handleSubmit} 
          defaultValues={coupon}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
