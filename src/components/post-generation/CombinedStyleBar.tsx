import React from 'react';
import { StyleStrength } from '../../types';
import { cn } from '../../utils/cn';

interface CombinedStyleBarProps {
  styles: StyleStrength[];
}

const styleColors = {
  'tech-enthusiast': 'bg-gradient-to-r from-blue-500 to-cyan-500',
  'healthcare-professional': 'bg-gradient-to-r from-emerald-500 to-green-500',
  'warm-personal': 'bg-gradient-to-r from-rose-500 to-pink-500',
  'industry-leader': 'bg-gradient-to-r from-purple-500 to-indigo-500',
  'community-voice': 'bg-gradient-to-r from-amber-500 to-yellow-500',
  'quick-update': 'bg-gradient-to-r from-red-500 to-orange-500'
};

export function CombinedStyleBar({ styles }: CombinedStyleBarProps) {
  if (styles.length === 0) return null;

  // Calculate total strength
  const totalStrength = styles.reduce((sum, style) => sum + style.strength + 1, 0);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-1">Combined Style Mix</div>
      <div className="h-4 rounded-full overflow-hidden flex">
        {styles.map((style, index) => {
          const percentage = ((style.strength + 1) / totalStrength) * 100;
          
          return (
            <div
              key={style.style}
              className={cn(
                'h-full transition-all duration-300',
                styleColors[style.style]
              )}
              style={{ width: `${percentage}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}