import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import { useStore } from '../store/useStore';
import { 
  FileText, 
  Newspaper,
  Clock, 
  Calendar, 
  List,
  Sparkles,
  Brain,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';

const tabs = [
  { 
    id: 'journalist', 
    label: 'Journalist', 
    icon: Newspaper,
    gradient: 'from-indigo-600 to-indigo-400'
  },
  { 
    id: 'scheduled-posts', 
    label: 'Scheduled Posts', 
    icon: Clock,
    gradient: 'from-purple-600 to-purple-400'
  },
  { 
    id: 'calendar', 
    label: 'Calendar Events', 
    icon: Calendar,
    gradient: 'from-green-600 to-green-400'
  },
  { 
    id: 'audit-log', 
    label: 'Audit Log', 
    icon: List,
    gradient: 'from-amber-600 to-amber-400'
  },
  { 
    id: 'premium', 
    label: 'Show me the good stuff', 
    icon: Sparkles,
    gradient: 'from-rose-600 to-pink-400'
  },
  {
    id: 'chatbot',
    label: 'AI Chatbot',
    icon: MessageSquare,
    gradient: 'from-violet-600 to-purple-400'
  },
  { 
    id: 'image-editor', 
    label: 'Image Editor', 
    icon: ImageIcon,
    gradient: 'from-cyan-600 to-blue-400'
  }
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { selectedTab, setSelectedTab } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const isNearSidebar = isExpanded 
        ? e.clientX <= sidebarRect.width // Use full width when expanded
        : e.clientX <= 80; // Use 80px when collapsed

      setIsExpanded(isNearSidebar);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isExpanded]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-200 ease-out flex-shrink-0",
          "flex flex-col z-10",
          "hover:shadow-lg h-screen",
          isExpanded ? "w-64" : "w-16"
        )}
      >
        <div className={cn(
          "h-16 flex items-center border-b border-gray-200 transition-all duration-200",
          isExpanded ? "px-4" : "px-2 justify-center"
        )}>
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className={cn(
              "text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
              "transition-all duration-200",
              isExpanded ? "opacity-100" : "opacity-0 w-0"
            )}>
              AI Journalist
            </h1>
          </div>
        </div>

        <nav className={cn(
          "transition-all duration-200",
          isExpanded ? "p-4" : "p-2 flex flex-col",
          "space-y-1"
        )}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  'relative w-full group px-3 py-2 rounded-lg transition-all duration-200',
                  'text-sm font-medium flex items-center gap-3',
                  isSelected
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {/* Background with gradient */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-lg transition-opacity duration-200',
                    'bg-gradient-to-r',
                    tab.gradient,
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'
                  )}
                />
                
                <div className="relative flex items-center gap-3">
                  <Icon className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isSelected ? 'scale-110' : 'group-hover:scale-110',
                    !isExpanded && 'mx-auto'
                  )} />
                  <span className={cn(
                    "transition-all duration-200",
                    isExpanded ? "opacity-100" : "opacity-0 w-0"
                  )}>
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 overflow-auto bg-gray-50 transition-all duration-200",
        "min-h-screen w-full"
      )}>
        {children}
      </div>
    </div>
  );
}