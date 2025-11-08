import { useState, useEffect } from 'react';
import { getAllUserRegistrations, RegistrationSummaryPageResponse, RegistrationSummaryResponse } from '@/services/registrationService';

export interface UseRecentRegistrationsReturn {
  registrations: RegistrationSummaryResponse[];
  loading: boolean;
  error: string | null;
  refreshRegistrations: () => Promise<void>;
}

export const useRecentRegistrations = (
  page: number = 0,
  size: number = 3,
  sortBy: string = 'registrationDate'
): UseRecentRegistrationsReturn => {
  const [registrations, setRegistrations] = useState<RegistrationSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUserRegistrations(page, size, sortBy, 'DESC');
      // Garantir que sempre tenhamos um array
      setRegistrations(Array.isArray(response.content) ? response.content : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar inscrições recentes');
      setRegistrations([]); // Definir array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const refreshRegistrations = async () => {
    await fetchRegistrations();
  };

  useEffect(() => {
    fetchRegistrations();
  }, [page, size, sortBy]);

  return {
    registrations,
    loading,
    error,
    refreshRegistrations,
  };
};