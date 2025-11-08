import { useState, useEffect } from 'react';
import { EventDataResponse } from '@/services/eventsService';
import * as eventsService from '@/services/eventsService';

export interface UseUpcomingEventsReturn {
  events: EventDataResponse[];
  loading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
}

export const useUpcomingEvents = (page: number = 0, size: number = 2): UseUpcomingEventsReturn => {
  const [events, setEvents] = useState<EventDataResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getUpcomingPublishedEvents(page, size);
      // Garantir que sempre tenhamos um array
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar próximos eventos');
      setEvents([]); // Definir array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    await fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [page, size]);

  return {
    events,
    loading,
    error,
    refreshEvents,
  };
};