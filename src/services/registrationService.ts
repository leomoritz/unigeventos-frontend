/* eslint-disable @typescript-eslint/no-explicit-any */

import { authApi } from '@/lib/apiClient';
import { Batch } from "./eventsService";
import { Registration, RegistrationExistsResponse, RegistrationStatus } from "../types/registration";
import { PaymentStatus } from './paymentService';

export type SubscriptionStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "WAITLIST"
  | "REFUNDED";

export type TransportationType =
  | "PERSONAL"
  | "EVENT_TRANSPORT"
  | "NOT_APPLICABLE";

export interface SubscriptionsByEventResponse {
  id: string;
  personId: string;
  personName: string;
  eventId: string;
  registrationDate: Date;
  status: SubscriptionStatus;
  amountPaid: number;
  totalDiscount: number;
  transportationType: TransportationType;
  ministries: string;
  additionalInfo: string;
  qrCodeBase64: string;
  checkedIn: boolean;
  batch: Batch;
}

export interface SubscriptionsByEventPageResponse {
  content: SubscriptionsByEventResponse[];
  number: number;
  totalPages: number;
  totalElements: number;
}

export interface RegistrationSummaryResponse extends SubscriptionsByEventResponse {
    eventName: string;
    organizerName: string;
    free: boolean;
    startDatetime: Date;
    endDatetime: Date;
    location: string;
    numberOfSubscribers: number;
    finalDatePayment: Date;
    paymentsOfRegistration: PaymentSummaryResponse[];
}

export interface PaymentSummaryResponse {
    status: string;
    paymentType: string;
    paymentDate: Date;
    amount: number;
    installments: number;
}

export interface RegistrationSummaryPageResponse {
    content: RegistrationSummaryResponse[];
    number: number;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    first: boolean;
    numberOfElements: number;
}


export const checkin = async (
  registrationId: string
): Promise<void> => {
  try {
    await authApi.post(`/registrations/actions/checkin/${registrationId}`, null);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao realizar checkin"
    );
  }
};

export const cancelRegistration = async (
  registrationId: string
): Promise<void> => {
  try {
    await authApi.post(`/registrations/actions/cancel/${registrationId}`, null);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao realizar o cancelamento da inscrição"
    );
  }
};

export const repay = async (
  registrationId: string
): Promise<void> => {
  try {
    await authApi.post(`/registrations/actions/repay/${registrationId}`, null);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao realizar o reembolso da inscrição"
    );
  }
};

export const putOnWaitingList = async (
  registrationId: string
): Promise<void> => {
  try {
    await authApi.post(`/registrations/actions/put-waiting-list/${registrationId}`, null);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao colocar a inscrição na lista de espera"
    );
  }
};

export const changeBatch = async (
  registrationId: string,
  newBatchId: string,
): Promise<void> => {
  try {
    await authApi.post(
      `/registrations/actions/change-batch/${registrationId}`,
      null,
      {
        params: {
          batchId: newBatchId
        }
      }
    );
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao alterar o lote da inscrição"
    );
  }
};

export const attachTerm = async (
  registrationId: string
): Promise<void> => {
  try {
    await authApi.post(`/registrations/actions/attach-term/${registrationId}`, null);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao alterar o lote da inscrição"
    );
  }
};

export const getSubscriptionsByEvent = async (
  id: string,
  searchTerm = "",
  page: number = 0,
  size: number = 10
): Promise<SubscriptionsByEventPageResponse> => {
  try {
    const response = await authApi.get<SubscriptionsByEventPageResponse>(
      `/registrations/queries/subscriptions-by-event?page=${page}&size=${size}&searchTerms=${encodeURIComponent(searchTerm)}`,
      {
        params: {
          "eventId": id
        }
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar os dados do evento."
    );
  }
};

export interface GetRegistrationsPageResponse {
  registrations: RegistrationSummaryPageResponse;
}

export const getAllUserRegistrations = async (
  page: number = 0,
  size: number = 3,
  sortBy: string = 'status',
  sortDirection: string = 'ASC',
  registrationStatus: RegistrationStatus | null = null,
): Promise<RegistrationSummaryPageResponse> => {
  try {

    if (registrationStatus === null) {
      const response = await authApi.get<GetRegistrationsPageResponse>(
        `/registrations/queries/get-registrations-from-current-user?page=${page}&size=${size}&sort=${sortBy}&direction=${sortDirection}`
      );
      
      return response.data.registrations;
    }

    const response = await authApi.get(
      `/registrations/queries/get-registrations-from-current-user?registrationStatus=${encodeURIComponent(registrationStatus)}&page=${page}&size=${size}&sort=${sortBy}&direction=${sortDirection}`
    );
    
    return response.data.registrations;
  } catch (error: any) {
    console.error('Erro ao buscar inscrições do usuário:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao buscar inscrições do usuário!"
    );
  }
};

// Interfaces para registro de evento
export interface RegistrationData {
  eventId: string;
  transportationType: TransportationType;
  ministries: string;
  additionalInfo: string;
}

export interface RegistrationResponse {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  registrationDate: string;
  transportationType: TransportationType;
  ministries: string;
  additionalInfo: string;
  requiresPayment: boolean;
  paymentDeadline?: string;
  amount?: number;
}

export const registerForEvent = async (
  registrationData: RegistrationData
): Promise<RegistrationResponse> => {
  try {
    const response = await authApi.post<RegistrationResponse>(
      `/registrations/actions/register`,
      registrationData
    );

    return response.data;
  } catch (error: any) {
    console.error('Erro ao realizar inscrição:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao realizar inscrição no evento!"
    );
  }
};

export const getTransportationTypeLabel = (type: TransportationType): string => {
  const labels = {
    PERSONAL: 'Transporte Próprio',
    EVENT_TRANSPORT: 'Transporte do Evento',
    NOT_APPLICABLE: 'Não se Aplica'
  };
  
  return labels[type];
};

// Buscar dados completos de uma inscrição específica
export const getRegistrationById = async (
  registrationId: string
): Promise<Registration> => {
  try {
    const response = await authApi.get<Registration>(
      `/registrations/entities/${registrationId}`
    );

    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar dados da inscrição:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao buscar dados da inscrição!"
    );
  }
};

// Verificar se uma inscrição existe para um evento específico
export const checkRegistrationExists = async (
  eventId: string
): Promise<RegistrationExistsResponse> => {
  try {
    const response = await authApi.get(
      `/registrations/queries/get-from-current-user-by-event/${eventId}`
    );

    return {
      exists: response?.data?.id ? true : false,
      id: response?.data?.id
    }
  } catch (error: any) {
    // Se não encontrar inscrição, retornar que não existe
    if (error?.response?.status === 404) {
      return { exists: false };
    }
    
    console.error('Erro ao verificar existência da inscrição:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao verificar inscrição!"
    );
  }
};
