import React from 'react';
import { Bug, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChatbotDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    articles?: any[];
    lastMessage?: any;
    apiResponse?: any;
    error?: any;
  };
}

export function ChatbotDebugPanel({ isOpen, onClose, data }: ChatbotDebugPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-700">Debug Panel</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {data.articles && (
          <DebugSection
            title="Available Articles"
            data={{
              count: data.articles.length,
              categories: [...new Set(data.articles.map((a: any) => a.category))],
              sample: data.articles.slice(0, 2)
            }}
          />
        )}

        {data.lastMessage && (
          <DebugSection
            title="Last Message"
            data={data.lastMessage}
          />
        )}

        {data.apiResponse && (
          <DebugSection
            title="API Response"
            data={data.apiResponse}
          />
        )}

        {data.error && (
          <DebugSection
            title="Error"
            data={data.error}
            isError
          />
        )}
      </div>
    </div>
  );
}

function DebugSection({ 
  title, 
  data, 
  isError = false 
}: { 
  title: string; 
  data: any; 
  isError?: boolean;
}) {
  return (
    <div className="space-y-1">
      <h4 className={cn(
        "text-xs font-medium",
        isError ? "text-red-600" : "text-gray-600"
      )}>
        {title}
      </h4>
      <pre className={cn(
        "text-xs p-2 rounded-md overflow-auto max-h-40",
        isError ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-700"
      )}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}