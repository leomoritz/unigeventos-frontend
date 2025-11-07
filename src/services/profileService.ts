/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from '@/lib/apiClient';
import { PersonResponse } from "./personService";

export interface UpdatePersonPayload {
  name: string;
  birthdate: string;
  gender: string;
  maritalStatus: string;
  church: string;
  clothingSize: string;
  choralVoiceType: string;
  phoneNumber: string;
  documentNumber: string;
  documentType: string;
  personalContactEmail: string;
}

/**
 * Busca os dados da pessoa do usuário logado
 */
export const getCurrentUserPerson = async (): Promise<PersonResponse> => {
  try {
    const response = await authApi.get<PersonResponse>(`/persons/queries/get-my-profile`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar dados do perfil"
    );
  }
};

/**
 * Atualiza os dados da pessoa do usuário logado
 */
export const updateCurrentUserPerson = async (
  payload: UpdatePersonPayload
): Promise<PersonResponse> => {
  try {
    const response = await authApi.post<PersonResponse>(`/persons/actions/update-profile`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar perfil"
    );
  }
};

/**
 * Upload de foto de perfil
 */
export const uploadProfilePhoto = async (
  file: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("photoData", file); // Corrigido: mudou de "file" para "photoData"

    const response = await authApi.post(`/persons/actions/upload-photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // O backend retorna { filePath: string }
    return response.data.filePath;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao fazer upload da foto"
    );
  }
};
