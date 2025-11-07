"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { EventDataResponse } from '@/services/eventsService';
import { getEventById } from '@/services/publicEventsService';
import { getRegistrationById, getTransportationTypeLabel } from '@/services/registrationService';
import { Registration } from '@/types/registration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  Receipt,
  Mail,
  QrCode,
  CreditCard,
  Clock,
  Home,
  Share2,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getSubscriptionPaymentStatus, PaymentStatus, SubscriptionPaymentInfo } from '@/services/paymentService';

const paymentStatusLabel: Record<string, string> = {
  PENDING: 'Pendente',
  INPROCESS: 'Em Processamento',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
  EXPIRED: 'Expirado',
  CHARGEBACK: 'Estornado'
};

const registrationStatusLabel: Record<string, string> = {
  CONFIRMED: 'Confirmada',
  PENDING: 'Pendente',
  CANCELLED: 'Cancelada',
  PAID: 'Paga',
  WAITLIST: 'Lista de Espera',
  REFUNDED: 'Reembolsada'
};

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const registrationId = searchParams.get('registrationId');
  const paid = searchParams.get('paid') === 'true';
  
  const [event, setEvent] = useState<EventDataResponse | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<SubscriptionPaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!registrationId) {
          setError('ID da inscrição não fornecido.');
          return;
        }
        
        // Buscar dados completos da inscrição
        const registrationData = await getRegistrationById(registrationId);
        setRegistration(registrationData);
        
        // Definir o evento a partir dos dados da inscrição (conversão de tipos)
        const eventData = registrationData.event as any as EventDataResponse;
        setEvent(eventData);
        
        // Buscar status do pagamento
        const paymentStatus = await getSubscriptionPaymentStatus(registrationId);
        setPaymentInfo(paymentStatus);
        
      } catch (err) {
        console.error('Erro ao carregar detalhes da inscrição:', err);
        setError('Não foi possível carregar os detalhes da inscrição.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId && registrationId) {
      fetchRegistrationDetails();
    }
  }, [eventId, registrationId]);

  const formatDateTime = (date: Date | string | null | undefined) => {
    if (!date) return 'Data não informada';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Data não informada';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };

  const getCurrentBatch = () => {
    if (!registration) return null;
    
    // Retornar o lote específico da inscrição
    return registration.batch;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handlePayNow = async () => {
    // Redirecionar para página de pagamento
    router.push(`/user/events/${eventId}/registration-payment?registrationId=${registrationId}`);
  };

  const handlePayLater = () => {
    router.push(`/user/dashboard`);
  };

  const handleContactOrganizers = () => {
    if (!event) return;
    const subject = `Dúvida sobre a inscrição no evento: ${event.name}`;
    const mailtoLink = `mailto:${event.organizer?.contact?.email}?subject=${encodeURIComponent(subject)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = '5547988284292';
    const message = `Olá! Tenho uma dúvida sobre minha inscrição no evento "${event?.name}". Minha inscrição é #${registrationId?.slice(-8)}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Inscrição confirmada: ${event?.name}`,
          text: `Acabei de me inscrever no evento ${event?.name}!`,
          url: window.location.origin + `/user/events/${eventId}`
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.origin + `/user/events/${eventId}`);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handlePrintRegistration = () => {
    if (!registration) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dados da Inscrição - ${event?.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.4;
            }
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              color: #ea580c;
            }
            .header h1 {
              margin: 0;
              font-size: 20px;
              font-weight: bold;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              background-color: #fed7aa;
              padding: 8px 12px;
              border-radius: 8px;
              font-weight: bold;
              color: #9a3412;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
            }
            .section-content {
              background-color: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .field-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            }
            .field {
              margin-bottom: 8px;
            }
            .field-label {
              font-weight: bold;
              color: #111827;
            }
            .field-value {
              color: #374151;
            }
            .qr-section {
              text-align: center;
              margin-top: 20px;
            }
            .qr-code {
              max-width: 200px;
              height: auto;
              margin: 12px auto;
            }
            .qr-description {
              font-size: 14px;
              color: #6b7280;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🧾 Dados da Inscrição</h1>
          </div>

          <div class="section">
            <div class="section-title">
              👤 Informações Pessoais
            </div>
            <div class="section-content">
              <div class="field-grid">
                <div class="field">
                  <div class="field-label">Nome:</div>
                  <div class="field-value">${registration.person?.name || 'Nome não informado'}</div>
                </div>
                <div class="field">
                  <div class="field-label">E-mail:</div>
                  <div class="field-value">${registration.person?.contact?.email || 'E-mail não informado'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Telefone:</div>
                  <div class="field-value">${registration.person?.contact?.phoneNumber || 'Telefone não informado'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Igreja:</div>
                  <div class="field-value">${registration.person?.church || 'Igreja não informada'}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              📋 Detalhes da Inscrição
            </div>
            <div class="section-content">
              <div class="field-grid">
                <div class="field">
                  <div class="field-label">Lote:</div>
                  <div class="field-value">${registration.batch?.name || 'Lote não informado'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Valor:</div>
                  <div class="field-value">R$ ${registration.batch?.price?.toFixed(2).replace('.', ',') || '0,00'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Transporte:</div>
                  <div class="field-value">${registration.transportationType ? getTransportationTypeLabel(registration.transportationType as any) : 'Não informado'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Data da Inscrição:</div>
                  <div class="field-value">${formatDate(registration.registrationDate)}</div>
                </div>
              </div>
            </div>
          </div>

          ${registration.discountCouponApplied ? `
          <div class="section">
            <div class="section-title">
              💰 Cupom de Desconto Aplicado
            </div>
            <div class="section-content">
              <div class="field-grid">
                <div class="field">
                  <div class="field-label">Código do Cupom:</div>
                  <div class="field-value" style="font-family: monospace; background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px; display: inline-block;">${registration.discountCouponApplied.code}</div>
                </div>
                <div class="field">
                  <div class="field-label">Desconto:</div>
                  <div class="field-value" style="color: #059669; font-weight: bold;">${registration.discountCouponApplied.discountPercentage}%</div>
                </div>
                ${registration.discountCouponApplied.description ? `
                <div class="field" style="grid-column: 1/-1;">
                  <div class="field-label">Descrição:</div>
                  <div class="field-value">${registration.discountCouponApplied.description}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="field-label">Valor Original:</div>
                  <div class="field-value" style="text-decoration: line-through; color: #6b7280;">R$ ${registration.batch?.price?.toFixed(2).replace('.', ',') || '0,00'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Valor com Desconto:</div>
                  <div class="field-value" style="color: #059669; font-weight: bold; font-size: 16px;">R$ ${registration.batch ? (registration.batch.price * (1 - registration.discountCouponApplied.discountPercentage / 100)).toFixed(2).replace('.', ',') : '0,00'}</div>
                </div>
                <div class="field" style="grid-column: 1/-1; text-align: center; background-color: #d1fae5; padding: 8px; border-radius: 8px; margin-top: 8px;">
                  <div class="field-value" style="color: #059669; font-weight: bold;">
                    Você economizou R$ ${registration.batch ? (registration.batch.price * (registration.discountCouponApplied.discountPercentage / 100)).toFixed(2).replace('.', ',') : '0,00'}!
                  </div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          ${(registration.ministries || registration.additionalInfo) ? `
          <div class="section">
            <div class="section-title">
              🏠 Informações Adicionais
            </div>
            <div class="section-content">
              ${registration.ministries ? `
                <div class="field">
                  <div class="field-label">Ministérios:</div>
                  <div class="field-value">${registration.ministries}</div>
                </div>
              ` : ''}
              ${registration.additionalInfo ? `
                <div class="field">
                  <div class="field-label">Observações:</div>
                  <div class="field-value">${registration.additionalInfo}</div>
                </div>
              ` : ''}
            </div>
          </div>
          ` : ''}

          ${registration.qrCodeBase64 ? `
          <div class="section">
            <div class="section-title">
              🔲 QR Code de Acesso
            </div>
            <div class="qr-section">
              <img src="data:image/png;base64,${registration.qrCodeBase64}" alt="QR Code de Acesso" class="qr-code" />
              <p class="qr-description">Apresente este código no dia do evento</p>
            </div>
          </div>
          ` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Aguardar um pouco para garantir que o conteúdo foi carregado antes de imprimir
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 sm:py-16 lg:py-20">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 animate-spin text-orange-600 mb-4" />
        <span className="text-gray-600 font-medium text-sm sm:text-base">Carregando confirmação...</span>
      </div>
    );
  }

  if (error || !event || !registration) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-4">Erro ao Carregar Confirmação</h2>
        <p className="text-red-600 mb-6">{error || 'Inscrição não encontrada'}</p>
        <Button 
          onClick={() => router.push('/events')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
        >
          Voltar aos Eventos
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Success Header */}
      <motion.div 
        className="text-center py-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {paid ? 'Pagamento Confirmado!' : 'Inscrição Confirmada!'}
        </h1>
        <p className="text-lg text-gray-600">
          {paid 
            ? 'Sua vaga está garantida no evento'
            : 'Sua vaga foi reservada com sucesso'
          }
        </p>
      </motion.div>

      {/* Status Card */}
      <Card className={`border-2 ${registration?.status === 'CONFIRMED' ? 'border-green-200 bg-green-50' : registration?.status === 'PENDING' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            {registration?.status === 'CONFIRMED' ? (
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            ) : registration?.status === 'PENDING' ? (
              <Clock className="h-6 w-6 text-yellow-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-6 w-6 text-gray-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${registration?.status === 'CONFIRMED' ? 'text-green-800' : registration?.status === 'PENDING' ? 'text-yellow-800' : 'text-gray-800'}`}>
                {registrationStatusLabel[registration?.status || ''] || 'Status Desconhecido'}
              </h3>
              <p className={`${registration?.status === 'CONFIRMED' ? 'text-green-700' : registration?.status === 'PENDING' ? 'text-yellow-700' : 'text-gray-700'} mb-4`}>
                {registration?.status === 'CONFIRMED'
                  ? 'Sua inscrição está confirmada! Você receberá o QR Code de acesso por e-mail.'
                  : registration?.status === 'PENDING'
                  ? event.isFree 
                    ? 'Sua inscrição no evento gratuito será processada em breve.'
                    : `Lembre-se de efetuar o pagamento até ${formatDate(event.finalDatePayment)} para garantir sua vaga.`
                  : 'Consulte os organizadores para mais informações.'}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`font-medium ${registration?.status === 'CONFIRMED' ? 'text-green-800' : registration?.status === 'PENDING' ? 'text-yellow-800' : 'text-gray-800'}`}>
                    Status:
                  </span>
                  <Badge className={`ml-2 ${registration?.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border-green-200' : registration?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {registrationStatusLabel[registration?.status || ''] || registration?.status}
                  </Badge>
                </div>
                <div>
                  <span className={`font-medium ${registration?.status === 'CONFIRMED' ? 'text-green-800' : registration?.status === 'PENDING' ? 'text-yellow-800' : 'text-gray-800'}`}>
                    Inscrição:
                  </span>
                  <span className={`ml-2 font-mono ${registration?.status === 'CONFIRMED' ? 'text-green-700' : registration?.status === 'PENDING' ? 'text-yellow-700' : 'text-gray-700'}`}>
                    #{registrationId?.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Details */}
      {paymentInfo && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <span>Status do Pagamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Status:</span>
                <Badge className="ml-2">
                  {paymentStatusLabel[paymentInfo.status] || paymentInfo.status}
                </Badge>
              </div>
              {paymentInfo.amount !== undefined && (
                <div>
                  <span className="font-medium text-gray-900">Valor Pago:</span>
                  <span className="ml-2 font-semibold text-orange-600">
                    {formatPrice(paymentInfo.amount)}
                  </span>
                </div>
              )}
              {paymentInfo.installments !== undefined && (
                <div>
                  <span className="font-medium text-gray-900">Parcelas:</span>
                  <span className="ml-2">{paymentInfo.installments}</span>
                </div>
              )}

            </div>
          </CardContent>
        </Card>
      )}

      {/* Discount Coupon Applied */}
      {registration?.discountCouponApplied && (
        <Card className="border-green-200 bg-green-50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <div className="text-green-600 font-bold text-lg">%</div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center space-x-2">
                  <span>Cupom de Desconto Aplicado!</span>
                  <Badge className="bg-green-600 text-white border-green-600">
                    -{registration.discountCouponApplied.discountPercentage}%
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-800">Código:</span>
                    <div className="mt-1 font-mono bg-white px-3 py-1 rounded border border-green-200 text-green-700 inline-block">
                      {registration.discountCouponApplied.code}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Desconto:</span>
                    <div className="mt-1 text-green-700 font-semibold">
                      {registration.discountCouponApplied.discountPercentage}% de desconto
                    </div>
                  </div>
                  {registration.discountCouponApplied.description && (
                    <div className="sm:col-span-2">
                      <span className="font-medium text-green-800">Descrição:</span>
                      <p className="mt-1 text-green-700">
                        {registration.discountCouponApplied.description}
                      </p>
                    </div>
                  )}
                  {registration.batch && (
                    <div className="sm:col-span-2">
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Valor original:</span>
                          <span className="line-through text-gray-500">
                            {formatPrice(registration.batch.price)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center font-semibold text-lg mt-1">
                          <span className="text-green-800">Valor com desconto:</span>
                          <span className="text-green-700">
                            {formatPrice(registration.batch.price * (1 - registration.discountCouponApplied.discountPercentage / 100))}
                          </span>
                        </div>
                        <div className="text-center mt-2 text-sm text-green-600">
                          Você economizou {formatPrice(registration.batch.price * (registration.discountCouponApplied.discountPercentage / 100))}!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registration Details */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
            <User className="h-5 w-5 text-orange-600" />
            <span>Dados da Inscrição</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <User className="h-4 w-4 text-orange-600" />
                <span>Informações Pessoais</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Nome:</span>
                  <p className="text-gray-700">{registration?.person?.name || 'Nome não informado'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">E-mail:</span>
                  <p className="text-gray-700">{registration?.person?.contact?.email || 'E-mail não informado'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Telefone:</span>
                  <p className="text-gray-700">{registration?.person?.contact?.phoneNumber || 'Telefone não informado'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Igreja:</span>
                  <p className="text-gray-700">{registration?.person?.church || 'Igreja não informada'}</p>
                </div>
              </div>
            </div>

            {/* Registration Specific Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-orange-600" />
                <span>Detalhes da Inscrição</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Lote:</span>
                  <p className="text-gray-700">{registration?.batch?.name || 'Lote não informado'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Valor:</span>
                  <p className="text-gray-700 font-semibold text-orange-600">
                    {formatPrice(registration?.batch?.price || 0)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Transporte:</span>
                  <p className="text-gray-700">
                    {registration?.transportationType ? getTransportationTypeLabel(registration.transportationType as any) : 'Não informado'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Data da Inscrição:</span>
                  <p className="text-gray-700">{formatDate(registration?.registrationDate)}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(registration?.ministries || registration?.additionalInfo) && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Home className="h-4 w-4 text-orange-600" />
                  <span>Informações Adicionais</span>
                </h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  {registration?.ministries && (
                    <div>
                      <span className="font-medium text-gray-900">Ministérios:</span>
                      <p className="text-gray-700 mt-1">{registration.ministries}</p>
                    </div>
                  )}
                  {registration?.additionalInfo && (
                    <div>
                      <span className="font-medium text-gray-900">Observações:</span>
                      <p className="text-gray-700 mt-1">{registration.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QR Code Section */}
            {(paid || event.isFree) && registration?.qrCodeBase64 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <QrCode className="h-4 w-4 text-orange-600" />
                  <span>QR Code de Acesso</span>
                </h4>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <img 
                    src={`data:image/png;base64,${registration.qrCodeBase64}`}
                    alt="QR Code de Acesso"
                    className="mx-auto mb-2"
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                  <p className="text-sm text-gray-600">
                    Apresente este código no dia do evento
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-orange-600" />
            <span>Detalhes do Evento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-orange-600 mb-2">
                {event.name}
              </h3>
              <p className="text-gray-700 text-sm">
                {event.description?.substring(0, 200)}...
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Data e Hora:</span>
                  <p className="text-gray-700">{formatDateTime(event.startDatetime)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Local:</span>
                  <p className="text-gray-700">{event.location?.split('\n')[0] || 'Local a definir'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Organizador:</span>
                  <p className="text-gray-700">{event.organizer?.name || 'Organizador não informado'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Capacidade:</span>
                  <p className="text-gray-700">{event.capacity} participantes</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Próximos Passos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-blue-800">Verificar E-mail</p>
                <p className="text-blue-700">Um e-mail de confirmação foi enviado com todos os detalhes.</p>
              </div>
            </div>
            
            {!paid && !event.isFree && (
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-blue-800">Efetuar Pagamento</p>
                  <p className="text-blue-700">
                    Complete o pagamento até {formatDate(event.finalDatePayment)} para garantir sua vaga.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {paid || event.isFree ? '2' : '3'}
              </div>
              <div>
                <p className="font-medium text-blue-800">QR Code de Acesso</p>
                <p className="text-blue-700">
                  {paid || event.isFree
                    ? 'Seu QR Code será enviado por e-mail em breve.'
                    : 'Após o pagamento, você receberá o QR Code para acesso ao evento.'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {paid || event.isFree ? '3' : '4'}
              </div>
              <div>
                <p className="font-medium text-blue-800">Comparecer ao Evento</p>
                <p className="text-blue-700">
                  Apresente seu QR Code na entrada do evento para realizar o check-in.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de pagamento - apenas se evento não for gratuito */}
      {registration?.status !== 'CONFIRMED' && !event.isFree && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pay Now */}
          <Card className="border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-green-700 flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Pagar Agora</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">
                Garanta sua vaga realizando o pagamento agora mesmo.
              </p>
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl font-bold text-green-700 mb-1">
                  {getCurrentBatch()?.price ? formatPrice(getCurrentBatch()!.price) : 'Valor não informado'}
                </div>
                <div className="text-sm text-green-600">
                  {getCurrentBatch()?.name || 'Lote não informado'}
                </div>
              </div>
              <Button
                onClick={handlePayNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar Agora
              </Button>
            </CardContent>
          </Card>

          {/* Pay Later */}
          <Card className="border-yellow-200 hover:border-yellow-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-700 flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pagar Depois</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">
                Mantenha sua vaga reservada e pague até a data limite.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Lembre-se:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Pague até {formatDate(event.finalDatePayment)}</li>
                  <li>• Risco de perder a vaga se não pagar</li>
                  <li>• Receberá lembretes por e-mail</li>
                </ul>
              </div>
              <Button
                onClick={handlePayLater}
                variant="outline"
                className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-50 py-3"
              >
                <Clock className="h-4 w-4 mr-2" />
                Entendi, vou pagar depois
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mensagem para evento gratuito */}
      {event.isFree && registration?.status !== 'CONFIRMED' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Evento Gratuito</h3>
              <p className="text-blue-700 mb-4">
                Este é um evento gratuito! Sua inscrição será confirmada automaticamente.
              </p>
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">Próximos Passos:</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Aguarde o e-mail de confirmação</li>
                  <li>• Você receberá o QR Code de acesso em breve</li>
                  <li>• Compareça no local e horário do evento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push('/events')}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3"
        >
          <Home className="h-4 w-4 mr-2" />
          Ver Mais Eventos
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 py-3"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar Evento
        </Button>
      </div>

      {/* Imprimir inscrição e QRCode */}
      <div className="flex flex-col sm:flex-row gap-4 my-4">
        <Button
          onClick={handlePrintRegistration}
          variant="outline"
          className="flex-1 border-green-600 text-green-600 hover:bg-green-50 py-3"
        >
          <QrCode className="h-4 w-4 mr-2" />
          Imprimir inscrição e QRCode
        </Button>
      </div>

      {/* Support */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">Precisa de Ajuda?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Entre em contato com os organizadores do evento para qualquer dúvida ou suporte.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleContactOrganizers}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contatar por E-mail
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleWhatsAppContact}
                className="border-green-600 text-green-600 hover:bg-green-50 py-2 px-4"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contatar via WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}