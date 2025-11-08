/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from '@/lib/apiClient';

export interface DataDeletionResponse {
  success: boolean;
  message: string;
  requestId?: string;
}

/**
 * Solicita a exclusão de dados pessoais do usuário (LGPD)
 * Este processo é irreversível e remove todos os dados associados à conta
 * @returns Resposta da API confirmando a solicitação
 */
export const requestDataDeletion = async (): Promise<DataDeletionResponse> => {
  try {
    const response = await authApi.post<DataDeletionResponse>(
      `/lgpd/data-deletion/request`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao solicitar exclusão de dados"
    );
  }
};

/**
 * Busca informações sobre políticas de privacidade e LGPD
 * @returns Informações sobre tratamento de dados
 */
export const getPrivacyInfo = async (): Promise<any> => {
  try {
    const response = await authApi.get(`/lgpd/privacy-info`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar informações de privacidade"
    );
  }
};

/**
 * Exporta dados pessoais do usuário (portabilidade de dados)
 * @returns Link ou dados para download
 */
export const exportUserData = async (): Promise<any> => {
  try {
    const response = await authApi.get(`/lgpd/data-export`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao exportar dados pessoais"
    );
  }
};