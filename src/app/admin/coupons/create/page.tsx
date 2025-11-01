/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DiscountCouponForm } from "@/components/coupons/DiscountCouponForm";
import { DiscountCouponFormData } from "@/schemas/discountCouponSchema";
import { createDiscountCoupon } from "@/services/couponsService";
import PageHeader from "@/components/admin/PageHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tag } from "lucide-react";
import { toast } from "react-toastify";

export default function CreateDiscountCouponPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: DiscountCouponFormData) => {
    try {
      setIsSubmitting(true);

      await createDiscountCoupon(data);
      toast.success("Cupom de desconto criado com sucesso!");
      router.push("/admin/coupons/list");
    } catch (err: any) {
      toast.error(`Erro ao cadastrar o cupom de desconto. Causa: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10">
      <PageHeader
        icon={<Tag />}
        title="Novo Cupom de Desconto"
        description="Cadastre um novo cupom promocional para seus eventos"
        backHref="/admin/coupons/list"
      />

      <div className="mt-8">
        <DiscountCouponForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}