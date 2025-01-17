import React from 'react';
import { motion } from 'framer-motion';
import { Article, ArticleRelationship } from '../../../types';
import { cn } from '../../../utils/cn';

interface ArticleNodeProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  relationships: ArticleRelationship[];
}

export function ArticleNode({
  article,
  isSelected,
  onSelect,
  relationships
}: ArticleNodeProps) {
  const strengthSum = relationships.reduce((sum, rel) => sum + rel.strength, 0);
  const averageStrength = relationships.length > 0 ? strengthSum / relationships.length : 0;

  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-500",
        "backdrop-blur-sm hover:backdrop-blur-md",
        "border-2 hover:shadow-xl",
        isSelected
          ? "border-blue-500 bg-blue-50/95 scale-105 z-10"
          : "border-gray-200 bg-white/95 hover:border-gray-300",
        averageStrength >= 7 ? "border-green-200" :
        averageStrength >= 4 ? "border-yellow-200" :
        "border-gray-200"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Strength Indicator */}
      <div className="absolute -top-2 -right-2">
        <div 
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
            "border-2 border-white",
            averageStrength >= 7 ? "bg-green-500 text-white" :
            averageStrength >= 4 ? "bg-yellow-500 text-white" :
            "bg-gray-500 text-white"
          )}
        >
          {Math.round(averageStrength)}
        </div>
      </div>

      <div className="w-48 space-y-2">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {article.category}
        </div>
        
        <h3 className="font-medium text-gray-900 line-clamp-2 text-left">
          {article.title}
        </h3>

        {/* Topic Tags */}
        <div className="flex flex-wrap gap-1">
          {article.topics?.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
            >
              {topic}
            </span>
          ))}
          {(article.topics?.length ?? 0) > 2 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
              +{(article.topics?.length ?? 0) - 2}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}