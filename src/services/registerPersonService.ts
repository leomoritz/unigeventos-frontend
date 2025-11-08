/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/registerPersonService.ts

import { authApi } from '@/lib/apiClient';

interface PersonRegistrationData {
  name: string;
  birthdate: string;
  gender: string;
  maritalStatus: string;
  church: string;
  clothingSize: string;
  choralVoiceType: string;
  isLeader: boolean;
  contact: {
    phoneNumber: string;
    email: string;
  };
  document: {
    documentType: string;
    number: string;
  };
}

// Função para registrar os dados pessoais do usuário
export const registerPerson = async (personData: PersonRegistrationData): Promise<void> => {
  try {
    console.log("=== REGISTERSERVICE DEBUG ===");
    console.log("Endpoint:", `/persons/actions/register`);
    console.log("Dados enviados:", JSON.stringify(personData, null, 2));
    
    const response = await authApi.post(`/persons/actions/register`, personData);
    
    console.log("Resposta do backend:", response.status, response.data);
    console.log("=== REGISTRO PESSOA SUCESSO ===");
  } catch (error: any) {
    console.error("=== ERRO NO REGISTRO PESSOA ===");
    console.error("Status:", error.response?.status);
    console.error("Dados do erro:", error.response?.data);
    console.error("Mensagem:", error.response?.data?.message);
    console.error("Headers:", error.response?.headers);
    console.error("Erro completo:", error);
    
    throw new Error(error.response?.data?.message || 'Erro ao registrar dados pessoais');
  }
};