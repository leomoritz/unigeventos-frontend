/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Pencil, 
  ArrowRightCircle, 
  Plus, 
  ArrowLeftCircle, 
  Search,
  Users,
  Mail,
  Phone,
  Filter,
  RefreshCw,
  Church
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useOrganizers } from "@/hooks/useOrganizers";
import PageHeader from "@/components/admin/PageHeader";
import ModernCard from "@/components/admin/ModernCard";
import { ModernCardLoading } from "@/components/admin/ModernCardLoading";

export default function OrganizerListPage() {
  const {
    organizers,
    loading,
    currentPage,
    totalPages,
    totalElements,
    refreshOrganizers,
    nextPage,
    prevPage,
  } = useOrganizers();

  const [filteredOrganizers, setFilteredOrganizers] = useState<typeof organizers>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial load
  useEffect(() => {
    refreshOrganizers();
  }, []);

  // Search filter effect
  useEffect(() => {
    const filtered = organizers.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.additionalDetails?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrganizers(filtered);
  }, [searchTerm, organizers]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshOrganizers();
    setIsRefreshing(false);
  };

  const handlePrevPage = () => {
    prevPage();
  };

  const handleNextPage = () => {
    nextPage();
  };



  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <PageHeader
        title="Organizadores"
        description={loading ? "Carregando..." : `${totalElements} organizadores encontrados`}
        icon={<Church size={24} />}
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 hover:border-orange-500 dark:hover:border-orange-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Link href="/admin/organizers/create">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Novo Organizador
              </Button>
            </Link>
          </div>
        }
      />

      {/* Search and Filters */}
      <ModernCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
            <Input
              placeholder="Buscar por nome, email ou detalhes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-orange-500 focus:ring-orange-500/20"
            />
          </div>
          <Button 
            variant="outline"
            className="border-slate-300 dark:border-slate-600 hover:border-orange-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </ModernCard>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModernCardLoading count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizers.map((org) => (
            <ModernCard key={org.id} className="group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {org.name}
                  </h3>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                
                {org.additionalDetails && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {org.additionalDetails}
                  </p>
                )}
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span className="truncate">{org.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span>{org.contact.phoneNumber}</span>
                  </div>
                </div>
                
                <Link href={`/admin/organizers/${org.id}`} className="block w-full">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar Organizador
                  </Button>
                </Link>
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredOrganizers.length === 0 && (
        <ModernCard className="text-center py-12">
          <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Church className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {searchTerm ? "Nenhum organizador encontrado" : "Nenhum organizador cadastrado"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? "Tente ajustar os termos de busca" 
              : "Comece criando seu primeiro organizador"
            }
          </p>
          {!searchTerm && (
            <Link href="/admin/organizers/create">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Organizador
              </Button>
            </Link>
          )}
        </ModernCard>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <ModernCard className="p-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              variant="outline"
              className="w-full lg:w-auto border-slate-300 dark:border-slate-600 hover:border-orange-500 disabled:opacity-50"
            >
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-slate-600 dark:text-slate-300 text-center">
              <span className="text-sm">
                Página <strong className="text-orange-600 dark:text-orange-400">{currentPage + 1}</strong> de{" "}
                <strong className="text-orange-600 dark:text-orange-400">{totalPages}</strong>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                ({Math.min((currentPage * 6) + 1, totalElements)}-{Math.min((currentPage + 1) * 6, totalElements)} de {totalElements} itens)
              </span>
            </div>

            <Button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              variant="outline"
              className="w-full lg:w-auto border-slate-300 dark:border-slate-600 hover:border-orange-500 disabled:opacity-50"
            >
              Próxima
              <ArrowRightCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </ModernCard>
      )}
    </div>
  );
}
