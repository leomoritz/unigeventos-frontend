import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePhoneMask } from '@/hooks/useFieldMasks';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  showIcon?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  label = "Telefone",
  placeholder = "(11) 99999-9999",
  disabled = false,
  required = false,
  error,
  showIcon = true
}: PhoneInputProps) {
  const { formatPhone, validatePhone } = usePhoneMask();

  const isPhoneValid = value ? validatePhone(value) : true;
  const displayError = error || (value && !isPhoneValid ? 'Telefone inválido (deve ter 10 ou 11 dígitos)' : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover formatação para armazenar apenas números
    const rawValue = e.target.value.replace(/\D/g, '');
    onChange(rawValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phoneInput" className="flex items-center gap-2">
        {showIcon && <Phone className="h-4 w-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Input
        id="phoneInput"
        type="tel"
        value={formatPhone(value)}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={
          displayError
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : ''
        }
      />
      
      {displayError && (
        <p className="text-red-500 text-sm">
          {displayError}
        </p>
      )}
      
      <p className="text-gray-500 text-xs">
        Formato: (11) 99999-9999 ou (11) 9999-9999
      </p>
    </div>
  );
}