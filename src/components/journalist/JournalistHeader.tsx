import React from 'react';
import { Newspaper, Sparkles, Brain, Lightbulb, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function JournalistHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-32">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:16px_16px] animate-[flow_20s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-indigo-600/50 to-blue-600/50 animate-[shimmer_6s_ease-in-out_infinite]" />
      </div>
      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Newspaper className="w-6 h-6" />
              <span className="text-2xl font-bold">×</span>
              <Brain className="w-6 h-6" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                AI Journalist
              </h1>
              <p className="text-sm text-white/80">
                Intelligent content curation and generation
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Selection</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm"
            >
              <Lightbulb className="w-4 h-4 text-yellow-300" />
              <span>Analysis</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm"
            >
              <Zap className="w-4 h-4 text-blue-300" />
              <span>Insights</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}