/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from '@/lib/apiClient';

export const genderTypeLabels: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Feminino",
};

export const roleTypeLabels: Record<string, string> = {
  ROLE_ADMIN: "ADMIN",
  ROLE_LEADER: "LÍDER",
  ROLE_USER: "USUÁRIO",
};


export const maritalStatusTypeLabels: Record<string, string> = {
  MARRIED: "Casado(a)",
  SINGLE: "Solteiro(a)",
  DIVORCED: "Divorciado(a)",
  NOT_INFORMED: "Não Informado",
};

export const choralVoiceTypeLabels: Record<string, string> = {
  TENOR: "Tenor",
  BASS: "Baixo",
  CONTRALTO: "Contralto",
  SOPRANO: "Soprano",
  NOT_INFORMED: "Não Informado",
};

export const documentTypeLabels: Record<string, string> = {
  CPF: "CPF",
  RG: "RG",
};

// Função para formatar documentos baseado no tipo
export const formatDocumentByType = (documentNumber: string, documentType: string): string => {
  if (!documentNumber || !documentType) return '***.***.***-**';
  
  const numbers = documentNumber.replace(/\D/g, '');
  
  switch (documentType.toUpperCase()) {
    case 'CPF':
      if (numbers.length !== 11) return documentNumber;
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    
    case 'RG':
      if (numbers.length < 7 || numbers.length > 9) return documentNumber;
      if (numbers.length === 7) {
        return numbers.replace(/(\d{1})(\d{3})(\d{3})/, '$1.$2.$3');
      } else if (numbers.length === 8) {
        return numbers.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
      } else if (numbers.length === 9) {
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
      }
      return documentNumber;
    
    default:
      return documentNumber;
  }
};


export interface Role {
  role: string;
}

export interface PersonResponse {
  id: string;
  name: string;
  birthdate: Date;
  gender: string;
  maritalStatus: string;
  photo: string;
  church: string;
  clothingSize: string;
  choralVoiceType: string;
  isLeader: boolean;
  contact: {
    phoneNumber: string;
    email: string;
  };
  document: {
    number: string;
    documentType: string;
  };
  login: {
    id: string;
    username: string;
    lastLogin: Date;
    roles: Role[];
    createdDate: Date;
  };
  personalContactEmail: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const getPersonsPage = async (
  page: number = 0,
  size: number = 5
): Promise<PageResponse<PersonResponse>> => {
  try {
    const response = await authApi.get<PageResponse<PersonResponse>>(
      `/persons/entities/page?page=${page}&size=${size}`
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao obter os usuários do sistema!"
    );
  }
};
