/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { useRouter } from "next/navigation";
import { registerUser } from "@services/authService";
import { registerPerson } from "@/services/registerPersonService";
import Toggle from "@components/ui/toggle";
import { Loader2 } from "lucide-react";
import { InputMask } from "@react-input/mask";
import { GenderSelect } from "@/components/registration/GenderSelect";
import { MaritalStatusSelect } from "@/components/registration/MaritalStatusSelect";
import { VoiceTypeSelect } from "@/components/registration/VoiceTypeSelect";
import { DocumentTypeSelect } from "@/components/registration/DocumentTypeSelect";
import { MathCaptcha } from "@/components/ui/math-captcha";
import { usePhoneMask, useEmailValidation, useDocumentMask } from "@/hooks/useFieldMasks";
import { FormField } from "@/components/ui/form-field";
import { PasswordField } from "@/components/ui/password-field";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthdateInput, setBirthdateInput] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [church, setChurch] = useState("");
  const [clothingSize, setClothingSize] = useState("");
  const [choralVoiceType, setChoralVoiceType] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [contact, setContact] = useState({ phoneNumber: "", email: "" });
  const [document, setDocument] = useState({ documentType: "", number: "" });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  // Hooks for field formatting and validation
  const { formatPhone, validatePhone } = usePhoneMask();
  const { validateEmail, normalizeEmail } = useEmailValidation();
  const { formatDocument, validateDocument, getDocumentPlaceholder } = useDocumentMask();

  // Handler para pressionar Enter no último step
  const handleKeyPressOnLastStep = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step === 4) {
      e.preventDefault();
      
      // Só permite finalizar cadastro se não estiver carregando e captcha estiver válido
      const canFinish = !isLoading && isCaptchaValid;
      
      if (canFinish) {
        handleFinalStep();
      }
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleCancelRegister = async () => {
    // Limpar tokens do localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    // Limpar tokens dos cookies
    const { default: CookieManager } = await import('@/lib/cookieManager');
    CookieManager.remove('accessToken');
    CookieManager.remove('refreshToken');
    
    console.log("=== REGISTRO CANCELADO - Tokens limpos ===");
    
    const targetUrl = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login";
    router.push(targetUrl);
    setIsLoading(false);
  };

  const handleStepOne = async () => {
    setIsLoading(true);

    if (!username || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(username, password);
      
      // Salvar tokens tanto no localStorage quanto nos cookies para compatibilidade
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      
      // Importar o CookieManager dinamicamente para evitar problemas de SSR
      const { default: CookieManager } = await import('@/lib/cookieManager');
      CookieManager.set('accessToken', response.accessToken);
      CookieManager.set('refreshToken', response.refreshToken);
      
      console.log("=== DEBUG STEP 1 ===");
      console.log("Tokens salvos com sucesso");
      console.log("AccessToken no localStorage:", !!localStorage.getItem("accessToken"));
      console.log("AccessToken nos cookies:", !!CookieManager.get('accessToken'));
      
      setError("");
      setStep(2);
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalStep = async () => {
    setError("");
    setIsLoading(true);

    // Validações dos campos obrigatórios
    if (
      !name ||
      !birthdateInput ||
      !gender ||
      !contact.email ||
      !document.documentType ||
      !document.number
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    // Validações específicas dos campos
    if (!validateEmail(contact.email)) {
      setError("Por favor, digite um e-mail válido.");
      setIsLoading(false);
      return;
    }

    if (contact.phoneNumber && !validatePhone(contact.phoneNumber)) {
      setError("Por favor, digite um telefone válido.");
      setIsLoading(false);
      return;
    }

    if (!validateDocument(document.number, document.documentType as 'CPF' | 'RG')) {
      setError(`Por favor, digite um ${document.documentType} válido.`);
      setIsLoading(false);
      return;
    }

    // Validação do captcha
    if (!isCaptchaValid) {
      setError("Por favor, resolva a operação matemática de verificação.");
      setIsLoading(false);
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    
    // Importar dinamicamente para verificar cookies também
    const { default: CookieManager } = await import('@/lib/cookieManager');
    const cookieToken = CookieManager.get('accessToken');

    console.log("=== DEBUG TOKEN VALIDATION ===");
    console.log("Token localStorage:", !!accessToken);
    console.log("Token cookies:", !!cookieToken);

    if (!accessToken && !cookieToken) {
      setError(
        "Acesso negado! Token não encontrado. Entre em contato com o administrador do sistema!"
      );
      setIsLoading(false);
      return;
    }

    const [day, month, year] = birthdateInput.split("/");
    const dateFormatted = `${year}-${month}-${day}`;

    const personData = {
      name,
      birthdate: dateFormatted,
      gender,
      maritalStatus,
      church,
      clothingSize,
      choralVoiceType,
      isLeader,
      contact: {
        phoneNumber: contact.phoneNumber || "",
        email: contact.email,
      },
      document: {
        documentType: document.documentType,
        number: document.number,
      },
    };

    console.log("=== DEBUG REGISTRO PESSOA ===");
    console.log("Token disponível:", !!accessToken);
    console.log("Dados sendo enviados:", JSON.stringify(personData, null, 2));

    try {
      await registerPerson(personData);
      
      toast.success("🎉 Cadastro finalizado com sucesso! Um e-mail de boas-vindas foi enviado.", {
        position: "top-right",
        autoClose: 5000,
      });
      
      console.log("=== REGISTRO PESSOA CONCLUÍDO ===");
      
      // Aguarda um pouco para o toast aparecer antes de redirecionar
      setTimeout(() => {
        const targetUrl = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login";
        router.push(targetUrl);
      }, 1500);
    } catch (err: any) {
      console.error("Erro no registro da pessoa:", err);
      setError(`Erro: ${err.message}`);
    } finally {
      // Limpar tokens de ambos os locais
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Importar dinamicamente para limpar cookies também
      import('@/lib/cookieManager').then(({ default: CookieManager }) => {
        CookieManager.remove('accessToken');
        CookieManager.remove('refreshToken');
      });
      
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {{
              1: "Criar Conta",
              2: "Dados Pessoais",
              3: "Dados Ministeriais",
              4: "Documento e Contato",
            }[step] || "Cadastro"}
          </h1>
          <p className="text-gray-600">
            {{
              1: "Vamos começar criando seu usuário",
              2: "Agora precisamos de algumas informações básicas",
              3: "Informações sobre seu ministério",
              4: "Finalize com seus dados de contato",
            }[step] || "Preencha os dados solicitados"}
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  stepNumber === step
                    ? "bg-orange-600"
                    : stepNumber < step
                    ? "bg-orange-300"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Register Card */}
        <Card className="w-full shadow-xl border-0 bg-white">
          <CardContent className="p-8 space-y-6 overflow-auto max-h-[70vh]">
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-sm text-center">{successMessage}</p>
        )}

        {step === 1 && (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuário
                </label>
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <PasswordField
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Mínimo de 6 caracteres"
                required
              />
            </div>

            <Button
              onClick={handleStepOne}
              disabled={isLoading}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registrando usuário...
                </div>
              ) : (
                "Continuar"
              )}
            </Button>
            
            <div className="text-center">
              <a 
                href="/login" 
                className="text-orange-600 hover:text-orange-700 hover:underline font-medium text-sm"
              >
                Já tem uma conta? Faça login
              </a>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <InputMask
                  mask="__/__/____"
                  replacement={{ _: /\d/ }}
                  value={birthdateInput}
                  onChange={(e) => setBirthdateInput(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="border border-gray-300 rounded-lg px-3 py-3 w-full h-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <GenderSelect
                value={gender}
                onChange={setGender}
              />
              
              <MaritalStatusSelect
                value={maritalStatus}
                onChange={setMaritalStatus}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCancelRegister}
                variant="outline"
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
              >
                Próximo
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="church" className="block text-sm font-medium text-gray-700 mb-2">
                  Igreja
                </label>
                <Input
                  id="church"
                  placeholder="Nome da sua igreja"
                  value={church}
                  onChange={(e) => setChurch(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="clothingSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho da Vestimenta (Coral)
                </label>
                <Input
                  id="clothingSize"
                  placeholder="P, M, G, GG, etc."
                  value={clothingSize}
                  onChange={(e) => setClothingSize(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <VoiceTypeSelect
                value={choralVoiceType}
                onChange={setChoralVoiceType}
              />
              
              <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
                <div>
                  <span className="text-gray-700 font-medium">
                    Exerce liderança?
                  </span>
                  <p className="text-sm text-gray-500">
                    Você tem algum papel de liderança na igreja?
                  </p>
                </div>
                <Toggle checked={isLeader} onChange={setIsLeader} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
              >
                Próximo
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="space-y-4">
              <FormField
                label="Telefone"
                placeholder="(11) 99999-9999"
                value={formatPhone(contact.phoneNumber)}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setContact({ ...contact, phoneNumber: formatted });
                }}
                helperText="Digite seu telefone com DDD"
                error={contact.phoneNumber && !validatePhone(contact.phoneNumber) ? "Telefone inválido" : undefined}
              />
              
              <FormField
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={contact.email}
                onChange={(e) => {
                  const normalized = normalizeEmail(e.target.value);
                  setContact({ ...contact, email: normalized });
                }}
                required
                error={contact.email && !validateEmail(contact.email) ? "E-mail inválido" : undefined}
              />
              
              <DocumentTypeSelect
                value={document.documentType}
                onChange={(value) => {
                  setDocument({ ...document, documentType: value, number: "" });
                }}
              />
              
              <FormField
                label="Número do Documento"
                placeholder={getDocumentPlaceholder(document.documentType as 'CPF' | 'RG')}
                value={document.documentType ? formatDocument(document.number, document.documentType as 'CPF' | 'RG') : document.number}
                disabled={!document.documentType}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  setDocument({
                    ...document,
                    number: rawValue,
                  });
                }}
                onKeyDown={handleKeyPressOnLastStep}
                required
                error={document.number && document.documentType && !validateDocument(document.number, document.documentType as 'CPF' | 'RG') ? 
                  `${document.documentType} inválido` : undefined}
              />

              {/* Captcha de Segurança */}
              <MathCaptcha
                onValidationChange={setIsCaptchaValid}
                error={!isCaptchaValid && step === 4 ? "Resolva a operação matemática para continuar" : undefined}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </Button>
              <Button
                onClick={handleFinalStep}
                disabled={isLoading || !isCaptchaValid}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Finalizando...
                  </div>
                ) : (
                  "Finalizar Cadastro"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
      </div>
    </div>
  );
}
