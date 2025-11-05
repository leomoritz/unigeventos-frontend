/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from '@/lib/apiClient';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface PaymentConfiguration {
  id?: string;
  paymentType: string;
  maxInstallments: number;
  interestRate: number;
}

/**
 * Serviço para alterar a senha do usuário logado
 * Requer autenticação (token JWT)
 */
export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  try {
    const response = await authApi.post(
      `/auth/change-password`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao alterar senha"
    );
  }
};

/**
 * Salva as configurações de pagamento
 * @param configs Configurações de pagamento a serem salvas
 * @returns Resposta da API
 */
export const savePaymentConfigurations = async (
  configs: PaymentConfiguration[]
): Promise<any> => {
  try {
  
    const response = await authApi.post(
      `/payments-configuration/entities/batch`,
      configs
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao salvar configurações de pagamento"
    );
  }
};

/**
 * Busca as configurações de pagamento atuais
 * @returns Configurações de pagamento
 */
export const getPaymentConfigurations = async (): Promise<PaymentConfiguration[]> => {
  try {
    const response = await authApi.get<PaymentConfiguration[]>(
      `/payments-configuration/entities`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar configurações de pagamento"
    );
  }
};

/**
  * Deleta todas as configurações de pagamento
  */
export const deleteAllPaymentConfigurations = async (): Promise<void> => {
  try {
    await authApi.delete(`/payments-configuration/entities/batch`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao deletar configurações de pagamento"
    );
  }
};

/**
 * Deleta uma configuração de pagamento pelo ID
 * @param id ID da configuração a ser deletada
 */
export const deletePaymentConfigurationById = async (id: string): Promise<void> => {
  try {
    await authApi.delete(`/payments-configuration/entities/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao deletar configuração de pagamento"
    );
  }
};

/**
 * Validação de senha forte
 * Requisitos: mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  message?: string;
} => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "A senha deve ter no mínimo 8 caracteres",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra maiúscula",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra minúscula",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos um número",
    };
  }

  return { isValid: true };
};
