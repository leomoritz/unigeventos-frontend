import { authApi } from "@/lib/apiClient";

export interface PublishedEventsCountResponse extends AnalyticsEventCountResponse{

}

export interface AnalyticsEventCountResponse {
  count: number;
  percentageChange: number;
  isIncrease: boolean;
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

/**
 * Obtém apenas a contagem total de check-ins realizados no dia.
 */
export const getDailyCheckinsCount = async (): Promise<number> => {
  try {
    const response = await authApi.get<AnalyticsEventCountResponse>(
      "/analytics/events/checkins/today/count"
    );
    return response.data.count;
  } catch (error: any) {
    console.error("Erro ao buscar contagem de check-ins diários:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao buscar dados de analytics"
    );
  }
};

/**
 * Obtém a contagem total de inscritos no dia, o percentual de variação e se houve aumento ou diminuição.
 */
export const getDailyRegistrationsCount = async (): Promise<AnalyticsEventCountResponse> => {
  try {
    const response = await authApi.get<AnalyticsEventCountResponse>(
      "/analytics/events/subscribers/today/count"
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar contagem de inscritos diários:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao buscar dados de analytics"
    );
  }
};

/**
 * Obtém a contagem total de eventos finalizados no mês, o percentual de variação e se houve aumento ou diminuição em relação ao último mês.
 */
export const getMonthlyCompletedEventsCount = async (): Promise<AnalyticsEventCountResponse> => {
  try {
    const response = await authApi.get<AnalyticsEventCountResponse>(
      "/analytics/events/finished/monthly/count"
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar contagem de eventos finalizados no mês:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao buscar dados de analytics"
    );
  }
};

