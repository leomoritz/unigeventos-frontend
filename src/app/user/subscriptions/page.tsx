"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  getAllUserRegistrations, 
  RegistrationSummaryResponse, 
  SubscriptionStatus,
  getTransportationTypeLabel,
  GetRegistrationsPageResponse
} from "@/services/registrationService";
import { toast } from "react-toastify";

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState<RegistrationSummaryResponse[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const PAGE_SIZE = 3;

  // Carregar primeira página de inscrições
  useEffect(() => {
    const loadInitialRegistrations = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUserRegistrations(0, PAGE_SIZE);
        setRegistrations(response.content);
        setFilteredRegistrations(response.content);
        setTotalElements(response.totalElements);
        setHasMoreData(!response.last);
        setCurrentPage(0);
      } catch (error) {
        console.error('Erro ao carregar inscrições:', error);
        toast.error('Erro ao carregar suas inscrições');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialRegistrations();
  }, []);

  // Função para carregar mais inscrições
  const loadMoreRegistrations = async () => {
    if (isLoadingMore || !hasMoreData) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await getAllUserRegistrations(nextPage, PAGE_SIZE);
      
      const newRegistrations = [...registrations, ...response.content];
      setRegistrations(newRegistrations);
      setFilteredRegistrations(searchTerm ? 
        newRegistrations.filter(registration =>
          registration.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registration.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registration.location.toLowerCase().includes(searchTerm.toLowerCase())
        ) : newRegistrations
      );
      
      setCurrentPage(nextPage);
      setHasMoreData(!response.last);
    } catch (error) {
      console.error('Erro ao carregar mais inscrições:', error);
      toast.error('Erro ao carregar mais inscrições');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Filtrar inscrições baseado na busca
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRegistrations(registrations);
    } else {
      const filtered = registrations.filter(registration =>
        registration.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRegistrations(filtered);
    }
  }, [searchTerm, registrations]);

  // Função para obter o badge do status
  const getStatusBadge = (status: SubscriptionStatus) => {
    const statusConfig = {
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      CONFIRMED: { label: "Confirmado", className: "bg-green-100 text-green-800 border-green-200" },
      CANCELED: { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-200" },
      WAITLIST: { label: "Lista de Espera", className: "bg-blue-100 text-blue-800 border-blue-200" },
      REFUNDED: { label: "Reembolsado", className: "bg-gray-100 text-gray-800 border-gray-200" }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Função para formatar data
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para formatar data e hora
  const formatDateTime = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Função para formatar período do evento
  const formatEventPeriod = (startDate: Date | string, endDate: Date | string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Se for o mesmo dia
    if (start.toDateString() === end.toDateString()) {
      return formatDateTime(start);
    }
    
    // Se for dias diferentes
    const startFormatted = start.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
    const endFormatted = end.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  // Função para verificar se pagamento está vencendo
  const isPaymentDueSoon = (registration: RegistrationSummaryResponse) => {
    if (!registration.finalDatePayment || registration.status !== 'PENDING') return false;
    
    const now = new Date();
    const dueDate = new Date(registration.finalDatePayment);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 3 && diffDays > 0;
  };

  // Função para calcular dias restantes para pagamento
  const getDaysUntilPayment = (registration: RegistrationSummaryResponse) => {
    if (!registration.finalDatePayment) return 0;
    
    const now = new Date();
    const dueDate = new Date(registration.finalDatePayment);
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Inscrições</h1>
          <p className="text-gray-600">
            {isLoading ? (
              "Carregando inscrições..."
            ) : (
              `${filteredRegistrations?.length || 0} de ${totalElements} inscrição${totalElements !== 1 ? 'ões' : ''}`
            )}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar por nome do evento, organizador ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {searchTerm && hasMoreData && (
              <div className="text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle size={14} />
                Busca limitada aos {registrations.length} itens carregados
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Carregando suas inscrições...</p>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions List */}
      {!isLoading && (
        <div className="space-y-4">
          {(filteredRegistrations || []).map((registration) => (
            <Card key={registration.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {registration.eventName}
                      </h3>
                      {getStatusBadge(registration.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{formatEventPeriod(registration.startDatetime, registration.endDatetime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{registration.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span>{registration.numberOfSubscribers} participante(s)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm mb-2">
                      <span className="text-gray-500">
                        Inscrito em: <strong>{formatDate(registration.registrationDate)}</strong>
                      </span>
                      <span className="text-gray-500">
                        Organizador: <strong>{registration.organizerName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm mb-2">
                      {registration.free ? (
                        <span className="text-green-600 font-medium">
                          Evento Gratuito
                        </span>
                      ) : (
                        <>
                          <span className="text-gray-500">
                            Valor Pago: <strong>R$ {registration.amountPaid?.toFixed(2) || '0,00'}</strong>
                          </span>
                          {registration.totalDiscount > 0 && (
                            <span className="text-green-600">
                              Desconto: <strong>R$ {registration.totalDiscount.toFixed(2)}</strong>
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Informações adicionais */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Transporte: <strong>{getTransportationTypeLabel(registration.transportationType)}</strong>
                      </span>
                      {registration.checkedIn && (
                        <span className="text-green-600 font-medium">
                          ✓ Check-in Realizado
                        </span>
                      )}
                    </div>

                    {/* Alerta de pagamento vencendo */}
                    {isPaymentDueSoon(registration) && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-orange-600">
                        <AlertCircle size={16} />
                        <span>Pagamento vence em {getDaysUntilPayment(registration)} dias</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye size={16} className="mr-1" />
                      Detalhes
                    </Button>
                    {registration.status === 'PENDING' && !registration.free ? (
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Pagar Agora
                      </Button>
                    ) : (
                      <Button size="sm">
                        <Download size={16} className="mr-1" />
                        Comprovante
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Load More Button */}
          {!searchTerm && hasMoreData && (filteredRegistrations?.length || 0) > 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <Button
                  onClick={loadMoreRegistrations}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Carregando mais...
                    </>
                  ) : (
                    `Carregar Mais (${totalElements - (filteredRegistrations?.length || 0)} restantes)`
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (filteredRegistrations?.length || 0) === 0 && (
        <Card className="text-center p-12">
          <div className="space-y-4">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              {searchTerm ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Nenhuma inscrição encontrada</h3>
                  <p className="text-gray-600">Nenhuma inscrição corresponde aos critérios de busca "{searchTerm}".</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Nenhuma inscrição encontrada</h3>
                  <p className="text-gray-600">Você ainda não se inscreveu em nenhum evento.</p>
                </>
              )}
            </div>
            {!searchTerm && (
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => window.location.href = '/events'}
              >
                Explorar Eventos
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}