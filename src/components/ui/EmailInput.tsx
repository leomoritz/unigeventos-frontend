import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEmailValidation } from '@/hooks/useFieldMasks';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  showIcon?: boolean;
  autoNormalize?: boolean;
}

export function EmailInput({
  value,
  onChange,
  label = "E-mail",
  placeholder = "seu.email@exemplo.com",
  disabled = false,
  required = false,
  error,
  showIcon = true,
  autoNormalize = true
}: EmailInputProps) {
  const { validateEmail, normalizeEmail } = useEmailValidation();

  const isEmailValid = value ? validateEmail(value) : true;
  const displayError = error || (value && !isEmailValid ? 'E-mail inválido' : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Normalizar e-mail ao sair do campo
    if (autoNormalize && e.target.value) {
      const normalized = normalizeEmail(e.target.value);
      onChange(normalized);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="emailInput" className="flex items-center gap-2">
        {showIcon && <Mail className="h-4 w-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Input
        id="emailInput"
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
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
        O e-mail será automaticamente convertido para minúsculas
      </p>
    </div>
  );
}