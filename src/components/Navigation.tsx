import React from 'react';
import { 
  FileText,
  Clock, 
  Calendar, 
  List,
  Sparkles,
  ArrowRight,
  Newspaper,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

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
    id: 'image-editor',  // Changed from 'name' to 'id'
    label: 'Image Editor', // Changed from just 'name'
    icon: ImageIcon,
    gradient: 'from-cyan-600 to-blue-400' // Added gradient
  }
];

export function Navigation() {
  const { selectedTab, setSelectedTab } = useStore();

  return (
    <nav className="bg-white border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex space-x-1 sm:space-x-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={cn(
                      'relative group px-3 py-2 rounded-lg transition-all duration-200',
                      'text-sm font-medium flex items-center gap-2',
                      isSelected
                        ? 'text-white shadow-lg scale-105'
                        : 'text-gray-500 hover:text-gray-900'
                    )}
                  >
                    {/* Background with gradient */}
                    <div
                      className={cn(
                        'absolute inset-0 rounded-lg transition-opacity duration-200',
                        'bg-gradient-to-r opacity-0 group-hover:opacity-10',
                        tab.gradient,
                        isSelected && 'opacity-100'
                      )}
                    />
                    
                    {/* Shimmer effect */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={cn(
                          'absolute inset-0 rounded-lg bg-gradient-to-r',
                          tab.gradient
                        )} />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </motion.div>
                    )}

                    {/* Content */}
                    <div className="relative flex items-center gap-2">
                      <Icon className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        isSelected ? 'scale-110' : 'group-hover:scale-110'
                      )} />
                      <span className="hidden sm:block">{tab.label}</span>
                      {tab.id === 'premium' && (
                        <ArrowRight className={cn(
                          'w-4 h-4 transition-all duration-200',
                          'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                        )} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}