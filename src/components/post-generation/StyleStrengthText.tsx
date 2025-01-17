import React from 'react';
import { cn } from '../../utils/cn';

interface StyleStrengthTextProps {
  value: number;
  isSelected: boolean;
}

const strengthLabels = ['Subtle', 'Balanced', 'Strong', 'Dominant'];

export function StyleStrengthText({ value, isSelected }: StyleStrengthTextProps) {
  return (
    <div className="flex justify-between text-xs">
      {strengthLabels.map((label, index) => (
        <span
          key={label}
          className={cn(
            'transition-colors duration-200 px-1.5 py-0.5 rounded',
            value === index + 1 && isSelected && 'bg-white/20 text-white font-medium',
            value === index + 1 && !isSelected && 'bg-blue-100 text-blue-700 font-medium',
            value !== index + 1 && isSelected && 'text-white/70',
            value !== index + 1 && !isSelected && 'text-gray-600'
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
}