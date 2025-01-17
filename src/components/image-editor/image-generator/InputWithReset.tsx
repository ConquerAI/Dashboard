import React from 'react';
import { Input } from "../../ui/input";
import { X } from "lucide-react";

interface InputWithResetProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onReset: (name: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function InputWithReset({
  name,
  value,
  onChange,
  onReset,
  placeholder,
  type = "text",
  className
}: InputWithResetProps) {
  return (
    <div className="relative">
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`pr-8 bg-white border-gray-200 focus:border-violet-500 transition-all ${className}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onReset(name)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}