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
  CalendarSearchIcon
} from "lucide-react";
import {
  EventDataResponse,
  getAllPage,
  publishEvent,
} from "@/services/eventsService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

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

  const renderSkeleton = () => {
    return Array.from({ length: viewMode === 'grid' ? 6 : 4 }).map((_, index) => (
      <Card
        key={index}
        className={`bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 ${
          viewMode === 'list' ? 'p-6' : 'p-5'
        }`}
      >
        {viewMode === 'grid' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton height={24} width="70%" className="bg-neutral-600" />
              <Skeleton height={20} width={60} className="bg-neutral-600" />
            </div>
            <div className="space-y-2">
              <Skeleton height={16} width="80%" className="bg-neutral-600" />
              <Skeleton height={16} width="60%" className="bg-neutral-600" />
              <Skeleton height={16} width="90%" className="bg-neutral-600" />
            </div>
            <div className="flex gap-2">
              <Skeleton height={36} width="50%" className="bg-neutral-600" />
              <Skeleton height={36} width="40%" className="bg-neutral-600" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex-1 grid grid-cols-6 gap-4 items-center">
              <div className="col-span-2">
                <Skeleton height={20} width="80%" className="bg-neutral-600" />
                <Skeleton height={16} width="40%" className="bg-neutral-600 mt-1" />
              </div>
              <Skeleton height={16} width="70%" className="bg-neutral-600" />
              <Skeleton height={16} width="60%" className="bg-neutral-600" />
              <Skeleton height={16} width="80%" className="bg-neutral-600" />
              <Skeleton height={16} width="30%" className="bg-neutral-600" />
            </div>
            <div className="flex gap-2 ml-4">
              <Skeleton height={36} width={36} className="bg-neutral-600" />
              <Skeleton height={36} width={36} className="bg-neutral-600" />
            </div>
          </div>
        )}
      </Card>
    ));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-400">Gerenciar Eventos</h1>
              <p className="text-neutral-400 text-sm">
                {events.length > 0 ? `${events.length} eventos encontrados` : 'Gerencie todos os eventos da plataforma'}
              </p>
            </div>
          </div>
          <Link href="/admin/events/create">
            <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-xl">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar eventos por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 h-10 rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="bg-transparent border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="border-t border-neutral-700 pt-4 mt-4">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      type="checkbox"
                      checked={onlyPublished}
                      onChange={() => setOnlyPublished((prev) => !prev)}
                      className="rounded border-neutral-600 text-orange-600 focus:ring-orange-500/20"
                    />
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Apenas eventos publicados
                  </label>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Events Grid/List */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {renderSkeleton()}
          </div>
        ) : events.length > 0 ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {events.map((event) => (
              <Card
                key={event.id}
                className={`bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-200 ${
                  viewMode === 'list' ? 'p-6' : 'p-5 hover:border-orange-500/50 transform hover:-translate-y-1'
                }`}
              >
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
                            <span className="bg-green-600/20 border border-green-600/30 text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                              <DollarSign className="h-3 w-3 inline mr-1" />
                              Gratuito
                            </span>
                          )}
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            event.isPublished 
                              ? 'bg-green-600/20 border border-green-600/30 text-green-400' 
                              : 'bg-yellow-600/20 border border-yellow-600/30 text-yellow-400'
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
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <Calendar className="h-4 w-4 text-orange-400" />
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

                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <MapPin className="h-4 w-4 text-orange-400" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <Tag className="h-4 w-4 text-orange-400" />
                        <span>{eventTypeLabels[event.type] || event.type}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <UserCheck className="h-4 w-4 text-orange-400" />
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
                          className="w-full bg-transparent border-orange-600/50 text-orange-400 hover:bg-orange-600/10 hover:border-orange-500"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                      {!event.isPublished && (
                        <Button
                          onClick={() => publishEventById(event.id)}
                          disabled={publishingId === event.id}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
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
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
            <SearchX className="mx-auto h-16 w-16 text-neutral-500 mb-4" />
            <h3 className="text-xl font-medium text-neutral-300 mb-2">Nenhum evento encontrado</h3>
            <p className="text-neutral-400 mb-6">
              {searchTerm 
                ? `Nenhum evento encontrado para "${searchTerm}". Tente ajustar os termos de busca.` 
                : onlyPublished 
                ? 'Nenhum evento publicado encontrado. Publique alguns eventos para vê-los aqui.'
                : 'Comece criando seu primeiro evento na plataforma.'
              }
            </p>
            {!searchTerm && (
              <Link href="/admin/events/create">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </Link>
            )}
          </Card>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Card className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                variant="outline"
                className={`${
                  currentPage === 0
                    ? "bg-transparent border-neutral-600 text-neutral-500 cursor-not-allowed"
                    : "bg-transparent border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700 hover:border-neutral-500"
                }`}
              >
                <ArrowLeftCircle className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-neutral-300 text-sm">
                  Página <strong className="text-orange-400">{currentPage + 1}</strong> de{" "}
                  <strong className="text-orange-400">{totalPages}</strong>
                </span>
                <span className="text-neutral-500 text-sm">
                  • {events.length} eventos
                </span>
              </div>

              <Button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                variant="outline"
                className={`${
                  currentPage >= totalPages - 1
                    ? "bg-transparent border-neutral-600 text-neutral-500 cursor-not-allowed"
                    : "bg-transparent border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700 hover:border-neutral-500"
                }`}
              >
                Próxima
                <ArrowRightCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
