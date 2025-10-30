"use client";

import { useState, useEffect } from 'react';
import { EventDataResponse } from '@/services/eventsService';
import { getPublicEvents } from '@/services/publicEventsService';
import { EventCard } from '@/components/public/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Filter, Loader2, Sparkles, User, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function EventsPage() {
  const [events, setEvents] = useState<EventDataResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // usado para buscar
  const [searchInput, setSearchInput] = useState(''); // usado para digitação
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { hasRole } = useAuth();
  const { redirectToRegister, isAuthenticated, isLoading: authLoading, isCheckingRegistration } = useAuth();

  const pageSize = 9; // 3x3 grid

  // Utility function to safely get events array
  const safeEvents = Array.isArray(events) ? events : [];

  const fetchEvents = async (page: number = 0, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar eventos públicos sem necessidade de autenticação
      const response = await getPublicEvents(
        search,
        page,
        pageSize
      );
      
      // Garantir que response seja sempre um array
      const eventsArray = Array.isArray(response) ? response : [];
      setEvents(eventsArray);
      setTotalElements(eventsArray.length);
      setTotalPages(Math.ceil(eventsArray.length / pageSize));
      setCurrentPage(page);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError('Não foi possível carregar os eventos. Tente novamente mais tarde.');
      
      // Mock data para demonstração quando a API não estiver disponível
      const mockEvents: EventDataResponse[] = [
        {
          id: '1',
          name: 'Conferência de Jovens 2025',
          description: 'Uma conferência especial voltada para jovens e adolescentes, com pregações inspiradoras, louvores e momentos de comunhão.',
          location: 'Centro de Convenções UniMovimento',
          type: 'CONFERENCE',
          startDatetime: new Date('2025-02-15T09:00:00'),
          endDatetime: new Date('2025-02-16T18:00:00'),
          registrationStartDate: new Date('2025-01-01T00:00:00'),
          registrationDeadline: new Date('2025-02-10T23:59:59'),
          finalDatePayment: new Date('2025-02-12T23:59:59'),
          capacity: 500,
          isPublished: true,
          hasTransport: true,
          termIsRequired: false,
          isFree: false,
          organizerId: '1',
          organizer: {
            id: '1',
            name: 'Ministério de Jovens',
            contact: {
              email: 'jovens@igreja.com'
            }
          },
          numberOfSubscribers: 127,
          batches: [
            {
              id: '1',
              name: 'Lote Promocional',
              capacity: 200,
              price: 89.90,
              startDate: new Date('2025-01-01T00:00:00'),
              endDate: new Date('2025-01-31T23:59:59')
            },
            {
              id: '2',
              name: 'Lote Regular',
              capacity: 300,
              price: 119.90,
              startDate: new Date('2025-02-01T00:00:00'),
              endDate: new Date('2025-02-10T23:59:59')
            }
          ]
        },
        {
          id: '2',
          name: 'Retiro de Casais',
          description: 'Um fim de semana especial para fortalecer os relacionamentos matrimoniais através da Palavra de Deus.',
          location: 'Sítio Águas Cristalinas - Serra da Mantiqueira',
          type: 'RETREAT',
          startDatetime: new Date('2025-03-07T18:00:00'),
          endDatetime: new Date('2025-03-09T16:00:00'),
          registrationStartDate: new Date('2025-01-15T00:00:00'),
          registrationDeadline: new Date('2025-03-01T23:59:59'),
          finalDatePayment: new Date('2025-03-05T23:59:59'),
          capacity: 40,
          isPublished: true,
          hasTransport: false,
          termIsRequired: true,
          isFree: false,
          organizerId: '2',
          organizer: {
            id: '2',
            name: 'Ministério de Casais',
            contact: {
              email: 'casais@igreja.com'
            }
          },
          numberOfSubscribers: 24,
          batches: [
            {
              id: '3',
              name: 'Pacote Completo',
              capacity: 40,
              price: 250.00,
              startDate: new Date('2025-01-15T00:00:00'),
              endDate: new Date('2025-03-01T23:59:59')
            }
          ]
        },
        {
          id: '3',
          name: 'Seminário de Liderança',
          description: 'Capacitação para líderes e futuros líderes da igreja, abordando temas como gestão, discipulado e desenvolvimento pessoal.',
          location: 'Auditório Central - Igreja UniMovimento',
          type: 'SEMINARY',
          startDatetime: new Date('2025-02-22T08:00:00'),
          endDatetime: new Date('2025-02-22T17:00:00'),
          registrationStartDate: new Date('2025-01-20T00:00:00'),
          registrationDeadline: new Date('2025-02-20T23:59:59'),
          finalDatePayment: new Date('2025-02-20T23:59:59'),
          capacity: 100,
          isPublished: true,
          hasTransport: false,
          termIsRequired: false,
          isFree: true,
          organizerId: '3',
          organizer: {
            id: '3',
            name: 'Escola de Líderes',
            contact: {
              email: 'lideres@igreja.com'
            }
          },
          numberOfSubscribers: 67,
          batches: []
        }
      ];
      
      const filteredEvents = search 
        ? mockEvents.filter(event => 
            event.name.toLowerCase().includes(search.toLowerCase()) ||
            event.description?.toLowerCase().includes(search.toLowerCase())
          )
        : mockEvents;
      
      setEvents(filteredEvents);
      setTotalElements(filteredEvents.length);
      setTotalPages(Math.ceil(filteredEvents.length / pageSize));
      setCurrentPage(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(0, '');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(0, searchInput);
    setSearchTerm(searchInput); // opcional, apenas para exibir o termo atual
  };

  const handleRegister = (eventId: string) => {
    // Usar o hook de autenticação para redirecionamento inteligente
    redirectToRegister(eventId, true);
  };

  const handlePageChange = (newPage: number) => {
    fetchEvents(newPage, searchInput);
  };

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6 lg:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <motion.div 
        className="text-center py-6 sm:py-8 md:py-12 lg:py-16 bg-gradient-to-br from-orange-50 via-orange-25 to-orange-50 rounded-lg sm:rounded-xl lg:rounded-2xl border border-orange-100 relative overflow-hidden"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full opacity-20"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full opacity-10"
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-gray-900 bg-clip-text text-transparent">
              Descubra Eventos Incríveis
            </h1>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 leading-relaxed px-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Conecte-se com experiências transformadoras e momentos especiais de nossa comunidade
          </motion.p>

          {/* Welcome Message for Authenticated Users 
          {!authLoading && isAuthenticated && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mb-4 sm:mb-6 max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Bem-vindo de volta! 👋
                  </h3>
                </div>
                <p className="text-green-700 text-sm sm:text-base mb-4">
                  Você está conectado e pode se inscrever diretamente nos eventos. 
                  <span className="font-medium"> Suas inscrições ficaram mais rápidas e práticas!</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full text-xs text-green-700">
                    <Calendar className="h-3 w-3" />
                    Inscrição instantânea
                  </div>
                  <div className="flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full text-xs text-green-700">
                    <User className="h-3 w-3" />
                    Dados salvos
                  </div>
                  <div className="flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full text-xs text-green-700">
                    <Receipt className="h-3 w-3" />
                    Histórico completo
                  </div>
                </div>
              </div>
            </motion.div>
          )}*/}
          
          {/* Status de Autenticação */}
          {!authLoading && (
            <motion.div 
              className="mb-6 sm:mb-8"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              {isAuthenticated ? (
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm border border-green-200 font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  ✨ Você Está Conectado - Pronto para se inscrever!
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  💡 Faça login para inscrições mais rápidas
                </div>
              )}
            </motion.div>
          )}
          
          {/* Search Bar */}
          <motion.form 
            onSubmit={handleSearch} 
            className="max-w-lg mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div 
              className="flex items-center group relative"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-gray-400 absolute left-3 pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <Input
                type="text"
                placeholder="Buscar eventos..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-16 sm:pr-20 py-2.5 sm:py-3 w-full bg-white/80 backdrop-blur-sm border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-lg text-sm sm:text-base transition-all duration-300 hover:bg-white focus:bg-white group-hover:shadow-lg"
                style={{ minHeight: '44px' }}
              />
              <div
                className="absolute right-2"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              >
                <Button
                  // ao clicar, rola para o evento encontrado
                  onClick={() => {
                    document.getElementById('events-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  type="submit"
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-2.5 sm:px-3 md:px-4 py-1.5 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                  style={{ minHeight: '36px' }}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {[
          { 
            icon: Calendar, 
            value: totalElements, 
            label: "Eventos Disponíveis", 
            color: "orange",
            delay: 0.1
          },
          { 
            icon: Filter, 
            value: safeEvents.filter(e => !e.isFree).length, 
            label: "Eventos Pagos", 
            color: "purple",
            delay: 0.2
          },
          { 
            icon: Calendar, 
            value: safeEvents.filter(e => e.isFree).length, 
            label: "Eventos Gratuitos", 
            color: "green",
            delay: 0.3
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + stat.delay }}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className={`bg-${stat.color}-100 rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 group-hover:shadow-md transition-shadow duration-300`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <stat.icon className={`h-6 w-6 text-${stat.color}-600 mx-auto`} />
            </motion.div>
            <motion.div 
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + stat.delay, type: "spring", stiffness: 200 }}
            >
              {stat.value}
            </motion.div>
            <div className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="flex flex-col justify-center items-center py-12 sm:py-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Loader2 className="h-8 w-8 text-orange-600 mb-4" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-orange-200"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.span 
              className="text-gray-600 font-medium text-sm sm:text-base"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Carregando eventos...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <Button 
            onClick={() => fetchEvents(currentPage, searchTerm)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Quick Actions for Authenticated Users */}
      {!authLoading && isAuthenticated && !loading && !error && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-1">
                Ações Rápidas
              </h3>
              <p className="text-blue-600 text-sm">
                Acesse rapidamente suas áreas favoritas
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                onClick={() => router.push('/user/subscriptions')}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
              >
                <User className="h-4 w-4 mr-2" />
                Minhas Inscrições
              </Button>
              {hasRole('ROLE_ADMIN') && (
              <Button
                onClick={() => router.push('/admin/dashboard')}
                variant="outline"
                size="sm"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Dashboard Admin
              </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Events Grid */}
      <AnimatePresence>
        {!loading && !error && safeEvents.length > 0 && (
          <motion.div 
            id="events-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full max-w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {safeEvents.map((event, index) => (
              <motion.div 
                key={event.id} 
                className="w-full max-w-full"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <EventCard
                  event={event}
                  onRegister={handleRegister}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && !error && safeEvents.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-gray-400 mb-6">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a4 4 0 118 0v4m-4 8v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Nenhum evento encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `Não encontramos eventos para "${searchTerm}". Tente outro termo de busca.`
              : "Não há eventos disponíveis no momento. Volte em breve para conferir as novidades!"
            }
          </p>
          {searchTerm && (
            <Button
              onClick={() => {
                setSearchInput('');
                setSearchTerm('');
                fetchEvents(0, '');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Ver Todos os Eventos
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      <AnimatePresence>
        {!loading && !error && totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 sm:mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200"
              >
                <span className="hidden sm:inline">Anterior</span>
                <span className="sm:hidden">‹</span>
              </Button>
            </motion.div>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                >
                  <Button
                    onClick={() => handlePageChange(i)}
                    className={
                      currentPage === i
                        ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white px-3 py-2 rounded-lg text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200"
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 px-3 py-2 rounded-lg text-sm sm:text-base transition-all duration-200"
                    }
                  >
                    {i + 1}
                  </Button>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200"
              >
                <span className="hidden sm:inline">Próxima</span>
                <span className="sm:hidden">›</span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}