"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  backHref?: string;
  gradient?: boolean;
}

export default function PageHeader({
  title,
  description,
  icon,
  actions,
  backHref,
  gradient = true,
}: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Back Navigation */}
      {backHref && (
        <Link href={backHref} className="inline-flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <ArrowLeft size={16} />
          Voltar
        </Link>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-200/20 dark:border-orange-500/20">
              <span className="text-orange-600 dark:text-orange-400">
                {icon}
              </span>
            </div>
          )}
          <div>
            <h1 className={`text-3xl font-bold ${
              gradient 
                ? "bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent" 
                : "text-slate-900 dark:text-slate-100"
            }`}>
              {title}
            </h1>
            {description && (
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}