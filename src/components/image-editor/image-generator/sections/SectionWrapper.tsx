import React from 'react';

interface SectionWrapperProps {
  icon: React.ReactNode;
  title: string;
  gradient: string;
  children: React.ReactNode;
}

export function SectionWrapper({ icon, title, gradient, children }: SectionWrapperProps) {
  return (
    <div className="rounded-xl p-6 bg-gradient-to-b from-white to-gray-50/50 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-gradient-to-tr ${gradient} shadow-lg`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}