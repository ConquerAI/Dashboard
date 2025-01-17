import React from 'react';
import { motion } from 'framer-motion';
import { Article } from '../../../types';
import { cn } from '../../../utils/cn';
import { Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleCardProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
}

export function ArticleCard({
  article,
  isSelected,
  onSelect
}: ArticleCardProps) {
  const score = article.score || 0;

  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        "w-full p-4 rounded-xl transition-all duration-300",
        "border-2 hover:shadow-lg text-left",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {format(new Date(article.createdAt), 'MMM d, yyyy')}
          </div>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            score >= 7 ? "bg-green-100 text-green-700" :
            score >= 4 ? "bg-yellow-100 text-yellow-700" :
            "bg-gray-100 text-gray-700"
          )}>
            Score: {score}
          </div>
        </div>

        <h3 className="font-medium text-gray-900 line-clamp-2">
          {article.title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {[article.subcategory1, article.subcategory2, article.subcategory3]
            .filter(Boolean)
            .map((subcategory, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700"
              >
                {subcategory}
              </span>
            ))}
        </div>

        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            View Source
          </a>
        )}
      </div>
    </motion.button>
  );
}