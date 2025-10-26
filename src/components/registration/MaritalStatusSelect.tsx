import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MaritalStatusOption {
  value: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'NOT_INFORMED';
  label: string;
  icon: string;
  description: string;
}

interface MaritalStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const maritalStatusOptions: MaritalStatusOption[] = [
  { value: 'SINGLE', label: 'Solteiro(a)', icon: '💙', description: 'Não casado(a)' },
  { value: 'MARRIED', label: 'Casado(a)', icon: '💕', description: 'Casado(a) civilmente ou religiosamente' },
  { value: 'DIVORCED', label: 'Divorciado(a)', icon: '💔', description: 'Divorciado(a) ou separado(a)' },
  { value: 'NOT_INFORMED', label: 'Prefiro não informar', icon: '🤐', description: 'Não desejo compartilhar' }
];

export function MaritalStatusSelect({ value, onChange, error, disabled }: MaritalStatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = maritalStatusOptions.find(option => option.value === value);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Estado Civil
      </label>
      
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-12 px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-between ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 focus:outline-none focus:ring-2'}`}
        >
          <div className="flex items-center space-x-2">
            {selectedOption ? (
              <>
                <span className="text-lg">{selectedOption.icon}</span>
                <span className="text-gray-900">{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-gray-500">Selecione seu estado civil</span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {maritalStatusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full p-3 text-left hover:bg-orange-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                  value === option.value ? 'bg-orange-50 text-orange-700' : 'text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-0.5">{option.icon}</span>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}