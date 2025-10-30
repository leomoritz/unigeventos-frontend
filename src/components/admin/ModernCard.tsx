"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function ModernCard({ 
  children, 
  className = "", 
  hover = false,
  gradient = false 
}: ModernCardProps) {
  const baseClasses = "backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-lg";
  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.01] transition-all duration-300" : "";
  const gradientClasses = gradient 
    ? "bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90" 
    : "bg-white/80 dark:bg-slate-800/80";

  return (
    <Card className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
}