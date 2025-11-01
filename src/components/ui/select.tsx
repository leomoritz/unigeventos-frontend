/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/select.tsx
import React, { createContext, useContext, useState } from "react";

// ========== SELECT ORIGINAL ==========
interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ options, value, defaultValue, onChange, placeholder, className }) => {
  const isPlaceholderSelected = !value;

  return (
    <select
      value={value ?? defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className={`
        flex h-12 w-full rounded-xl border border-slate-600 bg-slate-800/50 px-4 py-3 text-sm text-white 
        placeholder-slate-400 ring-offset-background file:border-0 file:bg-transparent file:text-sm 
        file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 
        focus-visible:ring-offset-2 focus-visible:border-orange-500 hover:border-slate-500
        disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-no-repeat bg-right pr-10
        transition-all duration-200 font-medium
        ${isPlaceholderSelected ? "text-slate-400" : "text-white"} 
        ${className}
      `}
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'/%3e%3c/svg%3e")`,
        backgroundSize: '18px',
        backgroundPosition: 'right 12px center'
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-slate-800 text-white py-2">
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;

// ========== SUBCOMPONENTES OPCIONAIS ==========
interface SelectContextType {
  selected: string;
  setSelected: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Select components must be used inside <SelectRoot>");
  return context;
}

export const SelectRoot = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ selected, setSelected, isOpen, setIsOpen }}>
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ placeholder }: { placeholder?: string }) => {
  const { selected, isOpen, setIsOpen } = useSelectContext();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:ring-offset-2 focus-visible:border-orange-500"
    >
      <span className={selected ? "text-white" : "text-neutral-400"}>
        {selected || placeholder || "Selecione..."}
      </span>
      <svg 
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <polyline points="6,9 12,15 18,9" />
      </svg>
    </button>
  );
};

export const SelectContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSelectContext();

  if (!isOpen) return null;

  return (
    <ul className="absolute z-50 mt-1 w-full bg-neutral-800 border border-neutral-600 rounded-md shadow-lg max-h-60 overflow-auto">
      {children}
    </ul>
  );
};

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const { setSelected, setIsOpen } = useSelectContext();

  const handleSelect = () => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <li
      onClick={handleSelect}
      className="px-3 py-2 cursor-pointer hover:bg-neutral-700 text-white text-sm transition-colors"
    >
      {children}
    </li>
  );
};

export const SelectValue = () => {
  const { selected } = useSelectContext();
  return <span>{selected}</span>;
};
