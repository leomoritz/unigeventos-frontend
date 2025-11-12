import { authApi } from "@/lib/apiClient";

export interface PublishedEventsCountResponse extends AnalyticsEventCountResponse{

}

export interface AnalyticsEventCountResponse {
  count: number;
  percentageChange: number;
  isIncrease: boolean;
}

export interface UserRegistrationCountResponse {
  count: number;
}

export interface UserPaymentCountResponse {
  count: number;
  totalAmount: number;
}

export interface UserEventsParticipationResponse {
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

/**
 * USER ANALYTICS - Funções específicas para o dashboard do usuário
 */

/**
 * Obtém a contagem de inscrições ativas do usuário logado
 */
export const getUserActiveRegistrationsCount = async (): Promise<number> => {
  try {
    const responseConfirmed = await authApi.get<UserRegistrationCountResponse>(
      `/user-analytics/registration/count-by-status?status=CONFIRMED`
    );
    const responsePending = await authApi.get<UserRegistrationCountResponse>(
      `/user-analytics/registration/count-by-status?status=PENDING`
    );
    const totalConfirmed = responseConfirmed.data.count;
    const totalPending = responsePending.data.count;
    return totalPending + totalConfirmed;
  } catch (error: any) {
    console.error("Erro ao buscar contagem de inscrições ativas:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao buscar inscrições ativas"
    );
  }
};

/**
 * Obtém a contagem e valor total de pagamentos pendentes do usuário logado
 */
export const getUserPendingPayments = async (): Promise<UserPaymentCountResponse> => {
  try {
    const response = await authApi.get<UserPaymentCountResponse>(
      `/user-analytics/payment/count-by-status?status=PENDING`
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar pagamentos pendentes:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao buscar pagamentos pendentes"
    );
  }
};

/**
 * Obtém o total de participações em eventos concluídos do usuário logado
 */
export const getUserEventsParticipationCount = async (): Promise<number> => {
  try {
    const response = await authApi.get<UserEventsParticipationResponse>(
      `/user-analytics/events/count-per-participation`
    );
    return response.data.count;
  } catch (error: any) {
    console.error("Erro ao buscar participações em eventos:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao buscar participações em eventos"
    );
  }
};

