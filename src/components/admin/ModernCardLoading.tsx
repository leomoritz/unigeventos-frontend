"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ModernLoadingProps {
  count?: number;
  className?: string;
}

export function ModernCardLoading({ count = 6, className = "" }: ModernLoadingProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-lg ${className}`}>
          <CardContent className="p-6">
            <div className="animate-pulse">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              </div>
              
              {/* Description */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
              
              {/* Button */}
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default ModernCardLoading;