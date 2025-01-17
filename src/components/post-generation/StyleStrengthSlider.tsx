import React from 'react';
import { cn } from '../../utils/cn';
import { StyleStrengthText } from './StyleStrengthText';

interface StyleStrengthSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  isSelected?: boolean;
}

export function StyleStrengthSlider({ 
  value, 
  onChange, 
  className,
  isSelected = false 
}: StyleStrengthSliderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <input
        type="range"
        min="1"
        max="4"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-2 rounded-lg appearance-none cursor-pointer',
          'bg-gradient-to-r from-gray-200 via-blue-400 to-blue-600',
          'accent-blue-500'
        )}
      />
      <StyleStrengthText value={value} isSelected={isSelected} />
    </div>
  );
}