import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Newspaper, 
  Clock, 
  Calendar as CalendarIcon, 
  List,
  Sparkles,
  Brain,
  Zap,
  Clock3,
  CalendarCheck,
  ClipboardList,
  Crown,
  MessageSquare,
  Bot
  BarChart2,
  TrendingUp,
  Users
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface Feature {
  icon: React.ElementType;
  label: string;
  color: string;
}

interface TabHeaderProps {
  tab: string;
}

const tabFeatures: Record<string, Feature[]> = {
  'journalist': [
    { icon: Brain, label: 'AI Analysis', color: 'text-indigo-500' },
    { icon: Newspaper, label: 'Smart Curation', color: 'text-blue-500' },
    { icon: Sparkles, label: 'Content Insights', color: 'text-purple-500' }
  ],
  'scheduled-posts': [
    { icon: Clock3, label: 'Auto Scheduling', color: 'text-amber-500' },
    { icon: CalendarCheck, label: 'Smart Timing', color: 'text-green-500' },
    { icon: List, label: 'Queue Management', color: 'text-blue-500' }
  ],
  'metrics': [
    { icon: BarChart2, label: 'Engagement Analytics', color: 'text-emerald-500' },
    { icon: TrendingUp, label: 'Growth Tracking', color: 'text-teal-500' },
    { icon: Users, label: 'Audience Insights', color: 'text-blue-500' }
  ],
  'premium': [
    { icon: Crown, label: 'Advanced Features', color: 'text-amber-500' },
    { icon: Sparkles, label: 'Premium Content', color: 'text-purple-500' },
    { icon: Brain, label: 'Enhanced AI', color: 'text-blue-500' }
  ],
  'chatbot': [
    { icon: Bot, label: 'AI Powered', color: 'text-violet-500' },
    { icon: MessageSquare, label: 'Real-time Chat', color: 'text-purple-500' },
    { icon: Brain, label: 'Healthcare Expert', color: 'text-indigo-500' }
  ]
};

const tabGradients: Record<string, string> = {
  'journalist': 'from-indigo-600 to-purple-600',
  'scheduled-posts': 'from-purple-600 to-pink-600',
  'metrics': 'from-emerald-600 to-teal-600',
  'premium': 'from-rose-600 to-pink-600',
  'chatbot': 'from-violet-600 to-purple-600'
};

const tabTitles: Record<string, string> = {
  'journalist': 'AI Journalist',
  'scheduled-posts': 'Scheduled Posts',
  'metrics': 'Social Media Metrics',
  'premium': 'Show me the good stuff',
  'chatbot': 'AI Chatbot'
};

export function TabHeader({ tab }: TabHeaderProps) {
  const features = tabFeatures[tab] || [];
  const gradient = tabGradients[tab] || 'from-gray-600 to-gray-600';
  const title = tabTitles[tab] || 'Unknown Tab';

  return (
    <div className="relative overflow-hidden bg-white border-b border-gray-200">
      <div className="absolute inset-0">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-10",
          gradient
        )} />
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:16px_16px] animate-[flow_20s_linear_infinite]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <h1 className={cn(
            "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            gradient
          )}>
            {title}
          </h1>

          <div className="flex flex-wrap gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full",
                  "bg-white/80 backdrop-blur-sm shadow-sm",
                  "border border-gray-200"
                )}
              >
                <feature.icon className={cn("w-4 h-4", feature.color)} />
                <span className="text-sm font-medium text-gray-700">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}