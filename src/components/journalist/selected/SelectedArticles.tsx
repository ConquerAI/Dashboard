import React from 'react';
import { motion } from 'framer-motion';
import { Article } from '../../../types';
import { X, ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../utils/cn';

interface SelectedArticlesProps {
  articles: Article[];
  onArticleDeselect: (article: Article) => void;
}

export function SelectedArticles({ articles, onArticleDeselect }: SelectedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-4">
        {articles.map((article) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative"
          >
            <div className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <button
                onClick={() => onArticleDeselect(article)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(article.createdAt), 'MMM d, yyyy')}
                </div>

                <h4 className="font-medium text-gray-900">
                  {article.title}
                </h4>

                <div className="flex flex-wrap gap-2">
                  {[article.subcategory1, article.subcategory2, article.subcategory3]
                    .filter(Boolean)
                    .map((subcategory, index) => (
                      <span
                        key={index}
                        className={cn(
                          "px-2 py-0.5 text-xs rounded-full",
                          "bg-blue-50 text-blue-700"
                        )}
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
                    className={cn(
                      "inline-flex items-center gap-1 text-xs",
                      "text-blue-600 hover:text-blue-700",
                      "transition-colors"
                    )}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Source
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}