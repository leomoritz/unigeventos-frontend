"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CreditCard, 
  User, 
  Bell, 
  TicketIcon,
  TrendingUp,
  Clock,
  CheckCircle,
  LockIcon,
  Loader2,
  AlertTriangle,
  CalendarX
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
export default function UserDashboard() {
  const router = useRouter();
  const { events, loading, error, refreshEvents } = useUpcomingEvents();

  // Função para calcular quantos dias faltam para o evento
  const calculateDaysUntilEvent = (eventDate: Date) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Função para formatar a data do evento
  const formatEventDate = (startDate: Date, endDate?: Date) => {
    const start = new Date(startDate);
    const startFormatted = start.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long'
    });

    if (endDate) {
      const end = new Date(endDate);
      const endFormatted = end.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long'
      });
      
      // Se for no mesmo mês
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()}-${end.getDate()} de ${start.toLocaleDateString('pt-BR', { month: 'long' })}`;
      }
      return `${startFormatted} - ${endFormatted}`;
    }

    return startFormatted;
  };

  // Função para obter o dia do evento (para o ícone)
  const getEventDay = (eventDate: Date) => {
    return new Date(eventDate).getDate();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bem-vindo ao seu painel!
            </h1>
            <p className="text-orange-100">
              Gerencie suas inscrições, pagamentos e perfil de forma simples e rápida.
            </p>
          </div>
          <div className="hidden md:block">
            <User size={64} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Inscrições Ativas
            </CardTitle>
            <TicketIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500">
              +1 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Próximos Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                Array.isArray(events) ? events.filter(event => calculateDaysUntilEvent(event.startDatetime) >= 0).length : 0
              )}
            </div>
            <p className="text-xs text-gray-500">
              Publicados e disponíveis
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pagamentos Pendentes
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1</div>
            <p className="text-xs text-gray-500">
              R$ 150,00 em aberto
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Eventos Concluídos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500">
              Total de participações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TicketIcon size={20} className="text-orange-600" />
              <span>Minhas Inscrições Recentes</span>
            </CardTitle>
            <CardDescription>
              Suas últimas inscrições em eventos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Retiro de Jovens 2025</h4>
                <p className="text-sm text-gray-500">Inscrito em 15/10/2025</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Confirmado
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Congresso de Louvor</h4>
                <p className="text-sm text-gray-500">Inscrito em 10/10/2025</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pendente Pagamento
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Workshop de Música</h4>
                <p className="text-sm text-gray-500">Inscrito em 05/10/2025</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Confirmado
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Ver Todas as Inscrições
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-orange-600" />
              <span>Ações Rápidas</span>
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push('/events/')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white justify-start"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Buscar Novos Eventos
            </Button>

            <Button 
              variant="outline"
              onClick={() => router.push('/user/payments?pending=true')}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Ver Pagamentos Pendentes
            </Button>

            <Button 
              variant="outline" 
              onClick={() => router.push('/user/edit-profile')}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Atualizar Meu Perfil
            </Button>

            <Button 
              variant="outline"
              onClick={() => router.push('/user/configurations')}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
            >
              <LockIcon className="mr-2 h-4 w-4" />
              Alterar Senha
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock size={20} className="text-orange-600" />
            <span>Próximos Eventos</span>
          </CardTitle>
          <CardDescription>
            Próximos eventos publicados disponíveis para inscrição
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600" />
                <p className="mt-2 text-gray-600">Carregando próximos eventos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
                <p className="mt-2 text-red-600">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshEvents}
                  className="mt-2"
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          ) : !Array.isArray(events) || events.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <CalendarX className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-gray-600">Nenhum evento próximo encontrado</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/events')}
                  className="mt-2"
                >
                  Buscar Eventos
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(events) && events.map((event, index) => {
                const daysUntilEvent = calculateDaysUntilEvent(event.startDatetime);
                const isUpcoming = daysUntilEvent >= 0;
                const eventDay = getEventDay(event.startDatetime);
                
                return (
                  <div 
                    key={event.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg ${
                      index === 0 && isUpcoming
                        ? 'bg-orange-50 border border-orange-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                        index === 0 && isUpcoming ? 'bg-orange-600' : 'bg-gray-600'
                      }`}>
                        {eventDay}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatEventDate(event.startDatetime, event.endDatetime)} • {event.location}
                      </p>
                      {isUpcoming ? (
                        <p className={`text-xs font-medium ${
                          index === 0 ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {daysUntilEvent === 0 ? 'Hoje!' : 
                           daysUntilEvent === 1 ? 'Amanhã' : 
                           `Faltam ${daysUntilEvent} dias`}
                        </p>
                      ) : (
                        <p className="text-xs text-red-500">
                          Evento já realizado
                        </p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => router.push(`/events/${event.id}`)}
                      className={
                        index === 0 && isUpcoming
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : ''
                      }
                      variant={index === 0 && isUpcoming ? 'default' : 'outline'}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                  onClick={() => router.push('/events')}
                >
                  Ver Todos os Eventos
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}