import { authApi } from "@/lib/apiClient";

export interface PublishedEventsCountResponse {
  count: number;
}

/**
 * Serviço para buscar analytics e métricas do sistema
 */

/**
 * Obtém a contagem total de eventos publicados (ativos)
 */
export const getPublishedEventsCount = async (): Promise<number> => {
  try {
    const response = await authApi.get<PublishedEventsCountResponse>(
      "/analytics/events/published/count"
    );
    return response.data.count;
  } catch (error: any) {
    console.error("Erro ao buscar contagem de eventos publicados:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao buscar dados de analytics"
    );
  }
};