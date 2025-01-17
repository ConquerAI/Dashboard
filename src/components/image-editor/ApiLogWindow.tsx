import React from 'react';
import { Terminal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../utils/cn';
import { LogEntry } from '../../types/image-editor';

interface ApiLogWindowProps {
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function ApiLogWindow({ logs, isOpen, onClose, onToggle }: ApiLogWindowProps) {
  return (
    <div className={cn(
      "fixed bottom-0 right-6 w-[600px] bg-gray-900 text-gray-100 rounded-t-xl shadow-2xl transition-all duration-300 ease-in-out",
      "border border-gray-700",
      isOpen ? "h-[400px]" : "h-10"
    )}>
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 h-10 bg-gray-800 rounded-t-xl cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium">API Log</span>
          <span className="text-xs text-gray-400">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Log Content */}
      {isOpen && (
        <div className="h-[calc(400px-2.5rem)] overflow-auto p-4 space-y-4 font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  log.type === 'request' && "bg-blue-500/20 text-blue-400",
                  log.type === 'response' && "bg-green-500/20 text-green-400",
                  log.type === 'error' && "bg-red-500/20 text-red-400"
                )}>
                  {log.type.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <pre className="bg-gray-800/50 rounded-lg p-3 overflow-x-auto">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No API logs yet. Generate an image to see the requests and responses.
            </div>
          )}
        </div>
      )}
    </div>
  );
}