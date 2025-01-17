import React from 'react';
import { Image } from 'lucide-react';

interface ImageGenerationToggleProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export function ImageGenerationToggle({ enabled, setEnabled }: ImageGenerationToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <Image 
        className={`w-5 h-5 transition-colors duration-500 ${enabled ? 'text-amber-500' : 'text-gray-400'}`}
      />

      <span className={`font-medium transition-colors duration-500 ${enabled ? 'text-amber-500' : 'text-gray-500'}`}>
        Generate Image
      </span>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`
          relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full 
          transition-all duration-700 ease-out
          focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2
          overflow-hidden backdrop-blur-xl
          bg-gradient-to-r from-gray-100 to-gray-50
          border border-gray-200
        `}
      >
        <span className="sr-only">Toggle image generation</span>

        <div 
          className={`
            absolute inset-0 transition-all duration-700
            bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]
            from-amber-200 via-amber-400 to-amber-500
            opacity-0 ${enabled ? 'opacity-100' : ''}
          `}
        />
        
        <div 
          className={`
            absolute inset-0 transition-transform duration-1000
            bg-gradient-to-r from-transparent via-white/10 to-transparent
            -skew-x-12 -translate-x-full
            ${enabled ? 'translate-x-full' : ''}
          `}
        />

        <div 
          className={`
            absolute inset-0 transition-opacity duration-700
            bg-gradient-to-tr from-amber-500/20 via-amber-300/10 to-transparent
            opacity-0 ${enabled ? 'opacity-100' : ''}
          `}
        />

        <span
          className={`
            pointer-events-none inline-block h-7 w-7 transform rounded-full 
            transition-all duration-700 ease-out
            relative z-10 flex items-center justify-center
            ${enabled 
              ? 'translate-x-8 bg-gradient-to-r from-amber-200 to-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]' 
              : 'translate-x-0 bg-gradient-to-b from-gray-200 to-gray-300'
            }
          `}
        >
          <span 
            className={`
              absolute w-5 h-5 rounded-full
              transition-all duration-700
              border
              ${enabled 
                ? 'border-amber-400/50 scale-100' 
                : 'border-gray-400/30 scale-90'
              }
            `}
          />
          
          <span 
            className={`
              absolute w-2 h-2 rounded-full
              transition-all duration-700
              ${enabled 
                ? 'bg-amber-500 scale-100' 
                : 'bg-gray-500 scale-75'
              }
            `}
          />

          <span 
            className={`
              absolute w-full h-full rounded-full
              transition-all duration-1000
              border-2 border-dashed
              ${enabled 
                ? 'border-amber-400/30 rotate-90 scale-90' 
                : 'border-gray-400/20 rotate-0 scale-75'
              }
            `}
          />
        </span>

        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className={`
              absolute w-1 h-1 rounded-full
              transition-all duration-700
              ${enabled ? 'bg-amber-200' : 'bg-gray-400'}
              ${enabled ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              left: `${25 + i * 20}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              transitionDelay: `${i * 100}ms`
            }}
          />
        ))}
      </button>
    </div>
  );
}