/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  ArrowRightCircle,
  ArrowLeftCircle,
  Plus,
  SearchX,
  Megaphone,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Tag,
  Eye,
  Filter,
  Search,
  Grid3X3,
  List,
  CheckCircle2,
  Clock,
  DollarSign,
  UserCheck,
  CalendarSearchIcon,
  RefreshCw
} from "lucide-react";
import {
  EventDataResponse,
  getAllPage,
  publishEvent,
} from "@/services/eventsService";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import PageHeader from "@/components/admin/PageHeader";
import ModernCard from "@/components/admin/ModernCard";
import { ModernCardLoading } from "@/components/admin/ModernCardLoading";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

const eventTypeLabels: Record<string, string> = {
  RETREAT: "Retiro",
  LEADERS_RETREAT: "Retiro de líderes",
  MEETING: "Reunião",
  CONFERENCE: "Conferência",
  WORKSHOP: "Workshop",
  SEMINARY: "Seminário",
  VIGIL: "Vigília",
  CULT: "Culto",
  CORAL: "Coral",
  CONCERT: "Concerto",
  THEATER: "Teatro",
  COURSE: "Curso",
  EVANGELISM: "Evangelismo",
};

export default function EventsListPage() {
  const [events, setEvents] = useState<EventDataResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [onlyPublished, setOnlyPublished] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);

        const response: PageResponse<EventDataResponse> = await getAllPage(
          debounceSearch,
          onlyPublished,
          currentPage
        );

        setEvents(response.content || []);
        setTotalPages(response.totalPages);

        // Mantém o foco no campo de busca
        setDataLoaded(true);
      } catch (error: any) {
        toast.error(error.message || "Erro ao buscar eventos.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [currentPage, debounceSearch, onlyPublished]);

  const publishEventById = async (id: string) => {
    setPublishingId(id);

    try {
      await publishEvent(id as string);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, isPublished: true } : event
        )
      );

      toast.success("Evento publicado com sucesso!");

      // Mantém o foco no campo de busca
      setDataLoaded(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Erro inesperado. Entre em contato com o administrador do sistema!";
      toast.error(`Erro ao publicar o evento. Causa: ${errorMessage}`);
    } finally {
      setPublishingId(null);
    }
  };

  useEffect(() => {
    if (dataLoaded && inputRef.current) {
      inputRef.current.focus();
      setDataLoaded(false); // impede foco repetido
    }
  }, [dataLoaded]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debounceSearch, onlyPublished]);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    setSearchTerm("");
    setDebouncedSearch("");
  };

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <PageHeader
        title="Gerenciar Eventos"
        description={events.length > 0 ? `${events.length} eventos encontrados` : 'Gerencie todos os eventos da plataforma'}
        icon={<Calendar size={24} />}
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 hover:border-orange-500 dark:hover:border-orange-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 hover:border-orange-500"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            <Link href="/admin/events/create">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
            </Link>
          </div>
        }
      />

      {/* Search and Filters */}
      <ModernCard className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Buscar eventos por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-slate-300 dark:border-slate-600 hover:border-orange-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={onlyPublished}
                    onChange={() => setOnlyPublished((prev) => !prev)}
                    className="rounded border-slate-300 dark:border-slate-600 text-orange-600 focus:ring-orange-500/20"
                  />
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Apenas eventos publicados
                </label>
              </div>
            </div>
          )}
        </div>
      </ModernCard>

      {/* Events Grid/List */}
      {loading ? (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          <ModernCardLoading count={viewMode === 'grid' ? 6 : 4} />
        </div>
      ) : events.length > 0 ? (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {events.map((event) => (
            <ModernCard key={event.id} className="group">
              <div className="p-6">
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-orange-300 line-clamp-2">
                          {event.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          {event.isFree && (
                            <span className="bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                              <DollarSign className="h-3 w-3 inline mr-1" />
                              Gratuito
                            </span>
                          )}
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            event.isPublished 
                              ? 'bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400' 
                              : 'bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30 text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {event.isPublished ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 inline mr-1" />
                                Publicado
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 inline mr-1" />
                                Rascunho
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                  {/* Event Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span>
                        {new Date(event.startDatetime).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric'
                        })} - {new Date(event.endDatetime).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Tag className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span>{eventTypeLabels[event.type] || event.type}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <UserCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span>{event?.organizer?.name}</span>
                    </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <Users className="h-4 w-4 text-orange-400" />
                        <span>{event?.numberOfSubscribers || 0} inscritos</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                    <Link href={`/admin/events/${event.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    {!event.isPublished && (
                      <Button
                        onClick={() => publishEventById(event.id)}
                        disabled={publishingId === event.id}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      >
                        {publishingId === event.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Megaphone className="h-4 w-4 mr-2" />
                            Publicar
                          </>
                        )}
                      </Button>
                    )}
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-orange-300">{event.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {event.isFree && (
                            <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded">
                              Gratuito
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded ${
                            event.isPublished 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {event.isPublished ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-neutral-300">
                        {new Date(event.startDatetime).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <div className="text-sm text-neutral-300 truncate">
                        {event.location}
                      </div>
                      
                      <div className="text-sm text-neutral-300">
                        {event?.organizer?.name}
                      </div>
                      
                      <div className="text-sm text-neutral-300 text-center">
                        {event?.numberOfSubscribers || 0}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Link href={`/admin/events/${event.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-orange-600/50 text-orange-400 hover:bg-orange-600/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      {!event.isPublished && (
                        <Button
                          onClick={() => publishEventById(event.id)}
                          disabled={publishingId === event.id}
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        >
                          {publishingId === event.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Megaphone className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ModernCard>
          ))}
        </div>
      ) : (
        <ModernCard className="text-center py-12">
          <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <SearchX className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">Nenhum evento encontrado</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? `Nenhum evento encontrado para "${searchTerm}". Tente ajustar os termos de busca.` 
              : onlyPublished 
              ? 'Nenhum evento publicado encontrado. Publique alguns eventos para vê-los aqui.'
              : 'Comece criando seu primeiro evento na plataforma.'
            }
          </p>
          {!searchTerm && (
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
              <Link href="/admin/events/create" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Evento
              </Link>
            </Button>
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
              <span className="text-xs text-slate-500 dark:text-slate-400">
                • {events.length} eventos exibidos
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
