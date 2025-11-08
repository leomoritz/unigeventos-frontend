/* eslint-disable @typescript-eslint/no-explicit-any */

import { authApi } from '@/lib/apiClient';

export interface Batch {
  id: string;
  name: string;
  capacity: number;
  price: number;
  startDate: Date;
  endDate: Date;
}

export type EventType =
  | ""
  | "RETREAT"
  | "LEADERS_RETREAT"
  | "MEETING"
  | "CONFERENCE"
  | "WORKSHOP"
  | "SEMINARY"
  | "VIGIL"
  | "CULT"
  | "CORAL"
  | "CONCERT"
  | "THEATER"
  | "COURSE"
  | "EVANGELISM";

export interface EventData {
  id: string;
  name: string;
  description?: string;
  location: string;
  type: EventType;
  startDatetime: Date;
  endDatetime: Date;
  registrationStartDate: Date;
  registrationDeadline: Date;
  finalDatePayment: Date;
  capacity: number;
  isPublished: boolean;
  hasTransport: boolean;
  termIsRequired: boolean;
  isFree: boolean;
  organizerName?: string;
  organizerId: string;
  organizer?: {
    id: string;
  };
  batches?: Batch[];
}

export interface EventDataResponse extends EventData {
  organizer?: {
    id: string;
    name: string;
    contact: {
      email: string;
      phone?: string;
    };
  };
  numberOfSubscribers: number;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const getAllPage = async (
  searchTerm = "",
  onlyPublished = false,
  page: number = 0,
  size: number = 3,
): Promise<PageResponse<EventDataResponse>> => {
  try {
    const response = await authApi.get<PageResponse<EventDataResponse>>(
      `/events/entities/page-filter?page=${page}&size=${size}&search=${encodeURIComponent(searchTerm)}&onlyPublished=${onlyPublished}`
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao obter os eventos cadastrados!"
    );
  }
};

export const getEventById = async (
  id: string
): Promise<EventDataResponse> => {
  try {
    const response = await authApi.get<EventDataResponse>(`/events/entities/${id}`);

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar os dados do evento."
    );
  }
};

export const createEvent = async (
  data: Partial<EventData>
): Promise<void> => {
  try {
    await authApi.post(`/events/entities`, data);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao criar novo evento."
    );
  }
};

export const updateEvent = async (
  id: string,
  data: Partial<EventData>
): Promise<void> => {
  try {
    await authApi.put(`/events/entities/${id}`, data);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar evento."
    );
  }
};

export const publishEvent = async (
  eventId: string
): Promise<void> => {
  try {
    await authApi.put(`/events/actions/publish-event/${eventId}`, null);
  } catch (error: any) {
    if (error?.status === 401) {
      error.response.data.message = "Usuário não autorizado para realizar esta operação!";
    }
    throw error;
  }
};

/**
 * Busca os próximos eventos publicados
 */
export async function getUpcomingPublishedEvents(
  page: number = 0,
  size: number = 2
): Promise<EventDataResponse[]> {
  try {
    const response = await authApi.get<PageResponse<EventDataResponse>>(
      `/events/queries/get-next-events?page=${page}&size=${size}`
    );
    return response.data.content;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar os próximos eventos publicados"
    );
  }
}