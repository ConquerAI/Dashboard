import React from 'react';
import { cn } from '../utils/cn';

interface RockerSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export function RockerSwitch({
  label,
  checked,
  onChange,
  leftLabel = 'No',
  rightLabel = 'Yes',
  className
}: RockerSwitchProps) {
  return (
    <div className={cn('rocker-switch', className)}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className="rocker-switch__button"
        onClick={() => onChange(!checked)}
      >
        <span className="rocker-switch__button-wrap">
          <span className="rocker-switch__inner">
            <span className="rocker-switch__options">
              <span className="rocker-switch__option-label">{leftLabel}</span>
              <span className="rocker-switch__option-sep"></span>
              <span className="rocker-switch__option-label">{rightLabel}</span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}