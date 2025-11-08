"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Search,
  Loader2,
  DollarSign,
  Receipt,
  ChevronDown,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  getAllUserRegistrations, 
  RegistrationSummaryResponse, 
  SubscriptionStatus,
  PaymentSummaryResponse 
} from "@/services/registrationService";
import { toast } from "react-toastify";
import jsPDF from 'jspdf';

export default function PaymentsPage() {
  const router = useRouter();
   const searchParams = useSearchParams();
   const pendingFilter = searchParams.get('pending') === 'true';

  const [searchTerm, setSearchTerm] = useState("");
  const [allRegistrations, setAllRegistrations] = useState<RegistrationSummaryResponse[]>([]);
  const [paymentRegistrations, setPaymentRegistrations] = useState<RegistrationSummaryResponse[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [expandedPayments, setExpandedPayments] = useState<Set<string>>(new Set());

  const PAGE_SIZE = 3; // Maior para histórico de pagamentos

  // Carregar inscrições com paginação adequada
  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        setIsLoading(true);
        
        // Carregar primeira página com ordenação por status de pagamento (pendentes primeiro)
        // Fallback: se API não suportar paymentStatus, usa registrationDate DESC
        let response;
        const searchTerm = pendingFilter ? 'PENDING' : null;
        try {
          response = await getAllUserRegistrations(0, PAGE_SIZE, 'status', 'ASC', searchTerm);
        } catch (error) {
          console.warn('Ordenação por status não suportada, usando registrationDate');
          response = await getAllUserRegistrations(0, PAGE_SIZE, 'registrationDate', 'DESC');
        }
        
        // Filtrar apenas inscrições que envolvem pagamento (não gratuitas)
        const paymentOnly = response.content.filter(reg => !reg.free);
        
        setAllRegistrations(response.content);
        setPaymentRegistrations(paymentOnly);
        setFilteredRegistrations(paymentOnly);
        setTotalElements(response.totalElements || paymentOnly.length);
        setHasMoreData(!response.last);
        
      } catch (error) {
        console.error('Erro ao carregar dados de pagamento:', error);
        toast.error('Erro ao carregar histórico de pagamentos');
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentData();
  }, []);

  // Filtrar por busca e aplicar ordenação local se necessário
  useEffect(() => {
    let registrationsToProcess = [...paymentRegistrations];
    
    // Filtrar por termo de busca
    if (searchTerm.trim() !== "") {
      registrationsToProcess = registrationsToProcess.filter(registration =>
        registration.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.organizerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar ordenação local como fallback (caso API não ordene por paymentStatus)
    // Verificar se já está ordenado pela API comparando os primeiros registros
    const needsLocalSorting = registrationsToProcess.length > 1 && 
      getConsolidatedPaymentStatus(registrationsToProcess[0]) === 'FULLY_PAID' &&
      registrationsToProcess.some(reg => getConsolidatedPaymentStatus(reg) === 'PENDING');
    
    if (needsLocalSorting) {
      registrationsToProcess.sort((a, b) => {
        const statusA = getConsolidatedPaymentStatus(a);
        const statusB = getConsolidatedPaymentStatus(b);
        
        const priorityOrder = {
          'PENDING': 1,
          'PARTIAL_PAID': 2,
          'FULLY_PAID': 3,
          'FAILED': 4
        };
        
        const priorityA = priorityOrder[statusA as keyof typeof priorityOrder] || 5;
        const priorityB = priorityOrder[statusB as keyof typeof priorityOrder] || 5;
        
        return priorityA - priorityB;
      });
    }
    
    setFilteredRegistrations(registrationsToProcess);
  }, [searchTerm, paymentRegistrations]);

  // Função para carregar mais registros
  const loadMoreRegistrations = async () => {
    if (!hasMoreData || isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      
      // Usar mesmo padrão de ordenação da carga inicial
      let response;
      try {
        response = await getAllUserRegistrations(nextPage, PAGE_SIZE, 'status', 'ASC');
      } catch (error) {
        response = await getAllUserRegistrations(nextPage, PAGE_SIZE, 'registrationDate', 'DESC');
      }
      
      // Filtrar apenas inscrições que envolvem pagamento (não gratuitas)
      const newPaymentOnly = response.content.filter(reg => !reg.free);
      
      setAllRegistrations(prev => [...prev, ...response.content]);
      setPaymentRegistrations(prev => [...prev, ...newPaymentOnly]);
      setFilteredRegistrations(prev => [...prev, ...newPaymentOnly]);
      setCurrentPage(nextPage);
      setHasMoreData(!response.last);
      
    } catch (error) {
      console.error('Erro ao carregar mais registros:', error);
      toast.error('Erro ao carregar mais registros');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Funções utilitárias para pagamentos
  const getPaymentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'PIX': 'PIX',
      'INVOICE': 'Boleto',
      'CREDIT_CARD': 'Cartão de Crédito'
    };
    return types[type] || type;
  };

  const getPaymentStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      'PENDING': 'Pendente',
      'INPROCESS': 'Processando',
      'APPROVED': 'Aprovado',
      'REJECTED': 'Rejeitado',
      'FAILED': 'Falhou',
      'CANCELLED': 'Cancelado',
      'REFUNDED': 'Reembolsado',
      'EXPIRED': 'Expirado',
      'CHARGEBACK': 'Estornado'
    };
    return statuses[status] || status;
  };

  // Função para verificar status consolidado de uma inscrição
  const getConsolidatedPaymentStatus = (registration: RegistrationSummaryResponse) => {
    // Se já tem amountPaid definido e > 0, significa que está confirmado
    if (registration.amountPaid && registration.amountPaid > 0) {
      return 'FULLY_PAID';
    }

    const payments = registration.paymentsOfRegistration || [];
    
    if (payments.length === 0) {
      return 'PENDING';
    }

    const approvedPayments = payments.filter(p => p.status === 'APPROVED');
    const totalPaid = approvedPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Se tem pagamentos aprovados, verificar se cobre o valor total esperado
    if (totalPaid > 0) {
      // Para eventos com desconto, o valor esperado já está no amountPaid
      // Para eventos sem pagamento confirmado ainda, usar valor do lote com desconto
      const totalPrice = registration.batch?.price || 0;
      const discountPercentage = registration.totalDiscount || 0;
      const expectedAmount = totalPrice - (totalPrice * discountPercentage / 100);
      
      if (totalPaid >= expectedAmount) {
        return 'FULLY_PAID';
      } else {
        return 'PARTIAL_PAID';
      }
    } else {
      const hasPending = payments.some(p => ['PENDING', 'INPROCESS'].includes(p.status));
      return hasPending ? 'PENDING' : 'FAILED';
    }
  };

  // Calcular estatísticas de pagamento usando dados detalhados
  const calculateStats = () => {
    let totalPaid = 0;
    let totalPending = 0;
    let thisMonthTotal = 0;
    let confirmedCount = 0;
    let pendingCount = 0;
    let thisMonthCount = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    paymentRegistrations.forEach(reg => {
      // Se amountPaid está definido, usar esse valor (já com desconto aplicado)
      if (reg.amountPaid && reg.amountPaid > 0) {
        totalPaid += reg.amountPaid;
        confirmedCount++;
      } else {
        // Caso contrário, verificar pagamentos individuais
        const payments = reg.paymentsOfRegistration || [];
        const approvedPayments = payments.filter(p => p.status === 'APPROVED');
        const paidAmount = approvedPayments.reduce((sum, p) => sum + p.amount, 0);
        
        const totalPrice = reg.batch?.price || 0;
        const discountPercentage = reg.totalDiscount || 0;
        const expectedAmount = totalPrice - (totalPrice * discountPercentage / 100);
        
        totalPaid += paidAmount;
        
        const remainingAmount = Math.max(0, expectedAmount - paidAmount);
        if (remainingAmount > 0) {
          totalPending += remainingAmount;
          pendingCount++;
        } else if (paidAmount > 0) {
          confirmedCount++;
        }
      }

      // Pagamentos deste mês - verificar todos os pagamentos da inscrição
      const payments = reg.paymentsOfRegistration || [];
      const approvedPaymentsThisReg = payments.filter(p => p.status === 'APPROVED');
      approvedPaymentsThisReg.forEach(payment => {
        if (payment.paymentDate) {
          const paymentDate = new Date(payment.paymentDate);
          if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
            thisMonthTotal += payment.amount;
            thisMonthCount++;
          }
        }
      });
    });
    
    return {
      totalPaid,
      totalPending,
      thisMonthTotal,
      confirmedCount,
      pendingCount,
      thisMonthCount
    };
  };

  const stats = calculateStats();

  // Função para formatar data
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para calcular dias até vencimento
  const getDaysUntilPayment = (registration: RegistrationSummaryResponse) => {
    if (!registration.finalDatePayment || registration.status !== 'PENDING') return 0;
    
    const now = new Date();
    const dueDate = new Date(registration.finalDatePayment);
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Função para obter status badge baseado no status consolidado
  const getPaymentStatusBadge = (registration: RegistrationSummaryResponse) => {
    const status = getConsolidatedPaymentStatus(registration);
    
    switch (status) {
      case 'FULLY_PAID':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pago</Badge>;
      case 'PARTIAL_PAID':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Parcial</Badge>;
      case 'PENDING':
        const daysLeft = getDaysUntilPayment(registration);
        if (daysLeft <= 0) {
          return <Badge className="bg-red-100 text-red-800 border-red-200">Vencido</Badge>;
        } else if (daysLeft <= 3) {
          return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Vencendo</Badge>;
        }
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Falhou</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Indefinido</Badge>;
    }
  };

  // Função para alternar expansão de pagamentos
  const togglePaymentExpansion = (registrationId: string) => {
    const newExpanded = new Set(expandedPayments);
    if (newExpanded.has(registrationId)) {
      newExpanded.delete(registrationId);
    } else {
      newExpanded.add(registrationId);
    }
    setExpandedPayments(newExpanded);
  };

  // Navegação para detalhes
  const handleViewDetails = (registration: RegistrationSummaryResponse) => {
    const eventId = registration.eventId;
    const registrationId = registration.id;
    const isPaid = registration.status === 'CONFIRMED';
    
    router.push(`/user/events/${eventId}/registration-confirmation?registrationId=${registrationId}&paid=${isPaid}`);
  };

  // Navegação para pagamento
  const handlePayNow = (registration: RegistrationSummaryResponse) => {
    const eventId = registration.eventId;
    const registrationId = registration.id;
    
    router.push(`/user/events/${eventId}/registration-payment?registrationId=${registrationId}`);
  };

  // Download do comprovante de pagamento em PDF
  const handleDownloadReceipt = (registration: RegistrationSummaryResponse) => {
    try {
      const doc = new jsPDF();
      const consolidatedStatus = getConsolidatedPaymentStatus(registration);
      const payments = registration.paymentsOfRegistration || [];
      
      // Header
      doc.setFillColor(255, 102, 0); // Orange
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('COMPROVANTE DE PAGAMENTO', 20, 25);
      
      // Informações do evento
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(14);
      doc.text('DADOS DO EVENTO', 20, 55);
      
      doc.setFontSize(11);
      doc.text(`Evento: ${registration.eventName}`, 20, 70);
      doc.text(`Organizador: ${registration.organizerName}`, 20, 80);
      doc.text(`Data de Inscricao: ${formatDate(registration.registrationDate)}`, 20, 90);
      
      // Status do pagamento
      doc.setFontSize(14);
      doc.text('STATUS DO PAGAMENTO', 20, 110);
      
      // Badge do status
      const statusLabels = {
        'FULLY_PAID': 'PAGO',
        'PARTIAL_PAID': 'PAGAMENTO PARCIAL',
        'PENDING': 'PENDENTE',
        'FAILED': 'FALHA NO PAGAMENTO'
      };
      
      const statusLabel = statusLabels[consolidatedStatus as keyof typeof statusLabels] || consolidatedStatus;
      
      if (consolidatedStatus === 'FULLY_PAID') {
        doc.setFillColor(34, 197, 94); // Green
      } else if (consolidatedStatus === 'PARTIAL_PAID') {
        doc.setFillColor(59, 130, 246); // Blue
      } else if (consolidatedStatus === 'PENDING') {
        doc.setFillColor(251, 191, 36); // Yellow
      } else {
        doc.setFillColor(239, 68, 68); // Red
      }
      
      doc.rect(20, 120, 80, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(statusLabel, 25, 128);
      
      // Valores
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(14);
      doc.text('VALORES', 20, 150);
      
      const totalAmount = registration.batch?.price || 0;
      const discountPercentage = registration.totalDiscount || 0;
      const discountAmount = (totalAmount * discountPercentage) / 100;
      const finalAmount = totalAmount - discountAmount;
      const displayAmount = (consolidatedStatus === 'FULLY_PAID' && registration.amountPaid) 
        ? registration.amountPaid 
        : finalAmount;
      
      doc.setFontSize(11);
      doc.text(`Valor do Evento: R$ ${totalAmount.toFixed(2).replace('.', ',')}`, 20, 165);
      
      if (discountPercentage > 0) {
        doc.text(`Desconto (${discountPercentage}%): R$ ${discountAmount.toFixed(2).replace('.', ',')}`, 20, 175);
      }
      
      doc.setFontSize(12);
      const amountLabel = consolidatedStatus === 'FULLY_PAID' ? 'Valor Pago:' : 'Valor Total:';
      doc.text(`${amountLabel} R$ ${displayAmount.toFixed(2).replace('.', ',')}`, 20, discountPercentage > 0 ? 190 : 180);
      
      // Detalhes dos pagamentos (se houver)
      if (payments.length > 0) {
        let yPosition = discountPercentage > 0 ? 210 : 200;
        
        doc.setFontSize(14);
        doc.text('DETALHES DOS PAGAMENTOS', 20, yPosition);
        yPosition += 15;
        
        payments.forEach((payment, index) => {
          if (yPosition > 260) {
            (doc as any).addPage();
            yPosition = 30;
          }
          
          doc.setFontSize(10);
          doc.text(`#${index + 1} - ${getPaymentTypeLabel(payment.paymentType)}`, 20, yPosition);
          doc.text(`Status: ${getPaymentStatusLabel(payment.status)}`, 20, yPosition + 8);
          doc.text(`Valor: R$ ${payment.amount.toFixed(2).replace('.', ',')}`, 20, yPosition + 16);
          
          if (payment.paymentDate) {
            doc.text(`Data: ${formatDate(payment.paymentDate)}`, 20, yPosition + 24);
          }
          
          if (payment.installments > 1) {
            doc.text(`Parcelas: ${payment.installments}x`, 20, yPosition + 32);
            yPosition += 40;
          } else {
            yPosition += 32;
          }
          
          yPosition += 10; // Espaço entre pagamentos
        });
      }
      
      // Footer
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(10);
      doc.text('Documento gerado automaticamente pelo sistema UniEventos', 105, 280);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 285);
      
      // Download
      const fileName = `comprovante-pagamento-${registration.eventName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      doc.save(fileName);
      
      toast.success('Comprovante baixado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar o comprovante');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Pagamentos</h1>
          <p className="text-gray-600">
            {isLoading ? (
              "Carregando histórico..."
            ) : (
              `${filteredRegistrations?.length || 0} de ${totalElements} pagamento${totalElements !== 1 ? 's' : ''}`
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar por nome do evento ou organizador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalPaid.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-gray-500">
              {stats.confirmedCount} pagamento{stats.confirmedCount !== 1 ? 's' : ''} confirmado{stats.confirmedCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalPending.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-gray-500">
              {stats.pendingCount} pagamento{stats.pendingCount !== 1 ? 's' : ''} pendente{stats.pendingCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.thisMonthTotal.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-gray-500">
              {stats.thisMonthCount} pagamento{stats.thisMonthCount !== 1 ? 's' : ''} este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Carregando histórico de pagamentos...</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Payments */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>
              {filteredRegistrations.length > 0 
                ? `${filteredRegistrations.length} pagamento${filteredRegistrations.length !== 1 ? 's' : ''} encontrado${filteredRegistrations.length !== 1 ? 's' : ''}`
                : 'Nenhum pagamento encontrado'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredRegistrations.map((registration) => {
              const consolidatedStatus = getConsolidatedPaymentStatus(registration);
              const payments = registration.paymentsOfRegistration || [];
              const hasMultiplePayments = payments.length > 1;
              const isExpanded = expandedPayments.has(registration.id);
              
              // Calcular valores
              const totalAmount = registration.batch?.price || 0;
              const discountPercentage = registration.totalDiscount || 0;
              const discountAmount = (totalAmount * discountPercentage) / 100;
              const finalAmount = totalAmount - discountAmount;
              
              // Para pagamentos confirmados, usar amountPaid (que já vem com desconto do backend)
              // Para pendentes, usar valor calculado
              const displayAmount = (consolidatedStatus === 'FULLY_PAID' && registration.amountPaid) 
                ? registration.amountPaid 
                : finalAmount;
              
              // Cores baseadas no status consolidado
              const getStatusColors = (status: string) => {
                switch (status) {
                  case 'FULLY_PAID':
                    return {
                      border: 'border-green-200',
                      bg: 'bg-green-50',
                      icon: 'bg-green-100',
                      text: 'text-green-600'
                    };
                  case 'PARTIAL_PAID':
                    return {
                      border: 'border-blue-200',
                      bg: 'bg-blue-50',
                      icon: 'bg-blue-100',
                      text: 'text-blue-600'
                    };
                  case 'PENDING':
                    return {
                      border: 'border-yellow-200',
                      bg: 'bg-yellow-50',
                      icon: 'bg-yellow-100',
                      text: 'text-yellow-600'
                    };
                  case 'FAILED':
                    return {
                      border: 'border-red-200',
                      bg: 'bg-red-50',
                      icon: 'bg-red-100',
                      text: 'text-red-600'
                    };
                  default:
                    return {
                      border: 'border-gray-200',
                      bg: 'bg-white',
                      icon: 'bg-gray-100',
                      text: 'text-gray-600'
                    };
                }
              };

              const colors = getStatusColors(consolidatedStatus);
              
              return (
                <div 
                  key={registration.id}
                  className={`border rounded-lg ${colors.border} ${colors.bg}`}
                >
                  {/* Header principal */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-2 rounded-full ${colors.icon}`}>
                        {consolidatedStatus === 'FULLY_PAID' ? (
                          <CheckCircle className={`h-4 w-4 ${colors.text}`} />
                        ) : consolidatedStatus === 'PARTIAL_PAID' ? (
                          <Clock className={`h-4 w-4 ${colors.text}`} />
                        ) : consolidatedStatus === 'FAILED' ? (
                          <AlertCircle className={`h-4 w-4 ${colors.text}`} />
                        ) : (
                          <Clock className={`h-4 w-4 ${colors.text}`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{registration.eventName}</h4>
                          {hasMultiplePayments && (
                            <button
                              onClick={() => togglePaymentExpansion(registration.id)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          Inscrito em: {formatDate(registration.registrationDate)}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {getPaymentStatusBadge(registration)}
                          
                          {hasMultiplePayments && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {payments.length} pagamento{payments.length !== 1 ? 's' : ''}
                            </span>
                          )}
                          
                          {discountPercentage > 0 && (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              Desconto: {discountPercentage}%
                            </span>
                          )}
                        </div>
                        
                        {/* Informações de pagamento para pagamento único */}
                        {!hasMultiplePayments && payments.length > 0 && (
                          <div className="mt-2 text-xs text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {getPaymentTypeLabel(payments[0].paymentType)}
                              </span>
                              {payments[0].paymentDate && (
                                <span>• {formatDate(payments[0].paymentDate)}</span>
                              )}
                              {payments[0].installments > 1 && (
                                <span>• {payments[0].installments} parcela{payments[0].installments !== 1 ? 's' : ''}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        R$ {displayAmount.toFixed(2).replace('.', ',')}
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(registration)}
                        >
                          <Eye size={14} className="mr-1" />
                          Ver
                        </Button>
                        
                        {consolidatedStatus === 'PENDING' || consolidatedStatus === 'PARTIAL_PAID' ? (
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => handlePayNow(registration)}
                          >
                            {consolidatedStatus === 'PARTIAL_PAID' ? 'Completar' : 'Pagar'}
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadReceipt(registration)}
                          >
                            <Download size={14} className="mr-1" />
                            Comprovante
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes expandidos para múltiplos pagamentos */}
                  {hasMultiplePayments && isExpanded && (
                    <div className="border-t border-gray-200 bg-white/50">
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                          <Info className="h-4 w-4" />
                          Detalhamento dos Pagamentos
                        </div>
                        
                        {payments.map((payment, index) => (
                          <div 
                            key={`${registration.id}-payment-${index}`}
                            className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-sm font-medium text-gray-600">
                                #{index + 1}
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {getPaymentTypeLabel(payment.paymentType)}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    payment.status === 'APPROVED' 
                                      ? 'bg-green-100 text-green-700'
                                      : payment.status === 'PENDING' || payment.status === 'INPROCESS'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {getPaymentStatusLabel(payment.status)}
                                  </span>
                                </div>
                                
                                <div className="text-xs text-gray-500 mt-1">
                                  {payment.paymentDate && formatDate(payment.paymentDate)}
                                  {payment.installments > 1 && (
                                    <span className="ml-2">
                                      ({payment.installments}x)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">
                                R$ {payment.amount.toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Resumo do valor total */}
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Valor do evento:</span>
                            <span className="font-medium">R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
                          </div>
                          {discountPercentage > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Desconto ({discountPercentage}%):</span>
                              <span className="font-medium text-green-600">- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-sm font-semibold border-t pt-2 mt-2">
                            <span className="text-gray-900">
                              {consolidatedStatus === 'FULLY_PAID' ? 'Valor pago:' : 'Total final:'}
                            </span>
                            <span className="text-gray-900">R$ {displayAmount.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Load More Button */}
      {!isLoading && filteredRegistrations.length > 0 && hasMoreData && !searchTerm && (
        <Card>
          <CardContent className="p-6 text-center">
            <Button 
              onClick={loadMoreRegistrations}
              disabled={isLoadingMore}
              variant="outline"
              className="w-full"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Carregando...
                </>
              ) : (
                'Carregar Mais Pagamentos'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && filteredRegistrations.length === 0 && (
        <Card className="text-center p-12">
          <div className="space-y-4">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              {searchTerm ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Nenhum pagamento encontrado</h3>
                  <p className="text-gray-600">Nenhum pagamento corresponde aos critérios de busca "{searchTerm}".</p>
                </>
              ) : paymentRegistrations.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Nenhum pagamento encontrado</h3>
                  <p className="text-gray-600">Você ainda não possui pagamentos de eventos.</p>
                </>
              ) : null}
            </div>
            {!searchTerm && paymentRegistrations.length === 0 && (
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => router.push('/events')}
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