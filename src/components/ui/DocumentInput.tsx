import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDocumentMask } from '@/hooks/useFieldMasks';
import { documentTypeLabels } from '@/services/personService';

interface DocumentInputProps {
  documentType: string;
  documentNumber: string;
  onDocumentTypeChange: (type: string) => void;
  onDocumentNumberChange: (number: string) => void;
  disabled?: boolean;
  showTypeSelector?: boolean;
  required?: boolean;
  error?: string;
}

export function DocumentInput({
  documentType,
  documentNumber,
  onDocumentTypeChange,
  onDocumentNumberChange,
  disabled = false,
  showTypeSelector = true,
  required = false,
  error
}: DocumentInputProps) {
  const { formatDocument, validateDocument, getDocumentPlaceholder } = useDocumentMask();

  const isDocumentValid = documentNumber && documentType ? 
    validateDocument(documentNumber, documentType as 'CPF' | 'RG') : true;

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    onDocumentNumberChange(rawValue);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDocumentTypeChange(e.target.value);
    // Limpar o número quando mudar o tipo
    if (e.target.value !== documentType) {
      onDocumentNumberChange('');
    }
  };

  return (
    <div className="space-y-4">
      {showTypeSelector && (
        <div>
          <Label htmlFor="documentType">
            Tipo de Documento {required && <span className="text-red-500">*</span>}
          </Label>
          <select
            id="documentType"
            value={documentType}
            onChange={handleTypeChange}
            disabled={disabled}
            className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${error ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="">Selecione o tipo...</option>
            {Object.entries(documentTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="documentNumber">
          {documentTypeLabels[documentType] || 'Número do Documento'}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="documentNumber"
          value={documentType ? 
            formatDocument(documentNumber, documentType as 'CPF' | 'RG') : 
            documentNumber
          }
          onChange={handleNumberChange}
          placeholder={documentType ? 
            getDocumentPlaceholder(documentType as 'CPF' | 'RG') : 
            'Selecione o tipo primeiro'
          }
          disabled={disabled || !documentType}
          className={
            !isDocumentValid || error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : ''
          }
        />
        {documentNumber && documentType && !isDocumentValid && (
          <p className="text-red-500 text-sm mt-1">
            {documentType} inválido
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}