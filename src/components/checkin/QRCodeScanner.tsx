/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";

interface Props {
  onDetected: (registrationId: string) => Promise<void>;
}

export default function QRCodeScanner({ onDetected }: Props) {
  const qrCodeRegionId = "qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isBusyReading, setIsBusyReading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const isTransitioningRef = useRef(false);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScanner = async () => {
    // Previne múltiplas chamadas simultâneas
    if (isScanning || isTransitioningRef.current || isInitializing) {
      return;
    }

    isTransitioningRef.current = true;
    setIsInitializing(true);

    try {
      // Inicializa o scanner se não existir
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
      }

      // Verifica se já está escaneando
      if (html5QrCodeRef.current.isScanning) {
        console.warn("Scanner já está ativo");
        isTransitioningRef.current = false;
        setIsInitializing(false);
        return;
      }

      const cameras = await Html5Qrcode.getCameras();
      
      if (!cameras || cameras.length === 0) {
        toast.error("Nenhuma câmera encontrada no dispositivo");
        isTransitioningRef.current = false;
        setIsInitializing(false);
        return;
      }

      const cameraId = cameras[0].id;

      await html5QrCodeRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          disableFlip: false,
        },
        async (decodedText) => {
          // Previne leituras múltiplas simultâneas ou durante cooldown
          if (isBusyReading || cooldownSeconds > 0) return;

          setIsBusyReading(true);
          
          try {
            await onDetected(decodedText);
          } catch (err: any) {
            toast.error("Erro ao processar QR Code");
            console.error(err);
          } finally {
            // Inicia contador regressivo de 5 segundos
            setCooldownSeconds(5);
            
            if (cooldownIntervalRef.current) {
              clearInterval(cooldownIntervalRef.current);
            }
            
            cooldownIntervalRef.current = setInterval(() => {
              setCooldownSeconds((prev) => {
                if (prev <= 1) {
                  if (cooldownIntervalRef.current) {
                    clearInterval(cooldownIntervalRef.current);
                    cooldownIntervalRef.current = null;
                  }
                  setIsBusyReading(false);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        },
        (errorMessage) => {
          // Ignora erros de "não encontrado" que são normais
          if (!errorMessage.includes("NotFoundException")) {
            console.warn(errorMessage);
          }
        }
      );

      setIsScanning(true);
      toast.success("Câmera iniciada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao iniciar câmera:", err);
      toast.error("Erro ao iniciar câmera. Verifique as permissões.");
    } finally {
      isTransitioningRef.current = false;
      setIsInitializing(false);
    }
  };

  const stopScanner = async () => {
    // Previne múltiplas chamadas simultâneas
    if (!isScanning || isTransitioningRef.current) {
      return;
    }

    isTransitioningRef.current = true;

    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
        setIsBusyReading(false);
        toast.info("Câmera desligada");
      }
    } catch (err) {
      console.error("Erro ao parar câmera:", err);
      // Força reset do estado mesmo com erro
      setIsScanning(false);
      setIsBusyReading(false);
    } finally {
      isTransitioningRef.current = false;
    }
  };

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Área do Scanner */}
      <div className="relative w-full max-w-md mx-auto min-h-[300px]">
        <div 
          id={qrCodeRegionId} 
          className="w-full rounded-lg overflow-hidden border-2 border-neutral-700"
        />
        
        {/* Overlay quando câmera está desligada */}
        {!isScanning && !isInitializing && (
          <div className="absolute inset-0 bg-neutral-900/90 flex items-center justify-center rounded-lg pointer-events-none">
            <div className="text-center space-y-3">
              <div className="p-4 bg-neutral-800 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <CameraOff className="h-8 w-8 text-neutral-400" />
              </div>
              <p className="text-neutral-400 text-sm px-4">
                Clique em "Iniciar Leitura" para ativar a câmera
              </p>
            </div>
          </div>
        )}

        {/* Loading durante inicialização */}
        {isInitializing && (
          <div className="absolute inset-0 bg-neutral-900/90 flex items-center justify-center rounded-lg pointer-events-none">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 text-orange-400 animate-spin mx-auto" />
              <p className="text-neutral-400 text-sm">Iniciando câmera...</p>
            </div>
          </div>
        )}

        {/* Overlay quando está processando */}
        {isBusyReading && (
          <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center rounded-lg pointer-events-none z-10">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold animate-pulse">
              Processando...
            </div>
          </div>
        )}
      </div>

      {/* Botões de Controle */}
      <div className="flex justify-center gap-3">
        <Button
          onClick={startScanner}
          disabled={isScanning || isInitializing}
          className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="h-4 w-4 mr-2" />
          {isInitializing ? "Iniciando..." : "Iniciar Leitura"}
        </Button>
        
        <Button
          onClick={stopScanner}
          disabled={!isScanning || isInitializing}
          variant="outline"
          className="bg-red-600 hover:bg-red-700 text-white border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CameraOff className="h-4 w-4 mr-2" />
          Parar Câmera
        </Button>
      </div>

      {/* Status */}
      <div className="text-center">
        {isScanning && !isBusyReading && cooldownSeconds === 0 && (
          <p className="text-sm text-green-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Aguardando QR Code...
          </p>
        )}
        
        {isBusyReading && cooldownSeconds === 0 && (
          <p className="text-sm text-orange-400 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processando...
          </p>
        )}
        
        {cooldownSeconds > 0 && (
          <p className="text-sm text-orange-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Aguarde {cooldownSeconds}s para próxima leitura...
          </p>
        )}
      </div>
    </div>
  );
}
