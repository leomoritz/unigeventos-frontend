/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { EventDataResponse } from "./eventsService";

const API_URL = "http://localhost:8001/rest/v1/events";

export const getPublicEvents = async (
  searchTerm = "",
  page: number = 0,
  size: number = 9,
): Promise<EventDataResponse[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/queries/public/published-events?page=${page}&size=${size}&searchTerms=${encodeURIComponent(searchTerm)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Garantir que sempre retorne um array
    const data = response.data;
    let events: EventDataResponse[] = [];
    
    if (Array.isArray(data)) {
      events = data;
    } else if (data && Array.isArray(data.content)) {
      // Se a API retornar um objeto com paginação
      events = data.content;
    } else {
      // Se não for array, retornar array vazio
      return [];
    }

    // Garantir que cada evento tenha propriedades seguras
    return events.map(event => ({
      ...event,
      organizer: event.organizer || { id: 'unknown', name: 'Organizador não informado' },
      batches: event.batches || [],
      description: event.description || '',
      numberOfSubscribers: event.numberOfSubscribers || 0,
      // Sanitizar datas
      startDatetime: event.startDatetime ? new Date(event.startDatetime) : new Date(),
      endDatetime: event.endDatetime ? new Date(event.endDatetime) : new Date(),
      registrationStartDate: event.registrationStartDate ? new Date(event.registrationStartDate) : new Date(),
      registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : new Date(),
      finalDatePayment: event.finalDatePayment ? new Date(event.finalDatePayment) : new Date()
    }));
  } catch (error: any) {
    console.error('Erro ao buscar eventos públicos:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao obter os eventos disponíveis!"
    );
  }
};

export const getEventById = async (
  id: string
): Promise<EventDataResponse> => {
  try {
    const response = await axios.get(`${API_URL}/queries/public/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const event = response.data;
    
    // Garantir que o evento tenha propriedades seguras
    return {
      ...event,
      organizer: event.organizer || { id: 'unknown', name: 'Organizador não informado' },
      batches: event.batches ? event.batches.map((batch: any) => ({
        ...batch,
        startDate: batch.startDate ? new Date(batch.startDate) : new Date(),
        endDate: batch.endDate ? new Date(batch.endDate) : new Date()
      })) : [],
      description: event.description || '',
      numberOfSubscribers: event.numberOfSubscribers || 0,
      // Sanitizar datas
      startDatetime: event.startDatetime ? new Date(event.startDatetime) : new Date(),
      endDatetime: event.endDatetime ? new Date(event.endDatetime) : new Date(),
      registrationStartDate: event.registrationStartDate ? new Date(event.registrationStartDate) : new Date(),
      registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : new Date(),
      finalDatePayment: event.finalDatePayment ? new Date(event.finalDatePayment) : new Date()
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar os dados do evento."
    );
  }
};