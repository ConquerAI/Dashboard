import React from 'react';
import { RefreshCw, Lock, Unlock, Check, RotateCcw, Calendar, ExternalLink } from 'lucide-react';
import { Article, Category } from '../../types';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

interface ArticleGridProps {
  articles: Article[];
  selectedArticles: string[];
  lockedArticles: string[];
  refreshingCategories: Category[];
  noMoreArticles: Record<Category, boolean>;
  onToggle: (id: string) => void;
  onLock: (id: string) => void;
  onRefreshCategory: (category: Category) => void;
  onResetCategory: (category: Category) => void;
  onStartMakingPost: () => void;
  isGenerating: boolean;
  isLoading: boolean;
}

export function ArticleGrid({
  articles,
  selectedArticles,
  lockedArticles,
  refreshingCategories,
  noMoreArticles,
  onToggle,
  onLock,
  onRefreshCategory,
  onResetCategory,
  onStartMakingPost,
  isGenerating,
  isLoading
}: ArticleGridProps) {
  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<Category, Article[]>);

  return (
    <div className="space-y-8">
      {Object.entries(articlesByCategory).map(([category, categoryArticles]) => (
        <div
          key={category}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="text-lg font-medium text-gray-900">
              {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h4>
            <div className="flex items-center space-x-4">
              {noMoreArticles[category as Category] ? (
                <button
                  onClick={() => onResetCategory(category as Category)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Available Articles
                </button>
              ) : (
                <button
                  onClick={() => onRefreshCategory(category as Category)}
                  disabled={refreshingCategories.includes(category as Category)}
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md',
                    'text-gray-700 bg-gray-100 hover:bg-gray-200',
                    refreshingCategories.includes(category as Category) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <RefreshCw 
                    className={cn(
                      'w-4 h-4 mr-2',
                      refreshingCategories.includes(category as Category) && 'animate-spin'
                    )}
                  />
                  Refresh Category
                </button>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryArticles.map((article) => (
              <div
                key={article.id}
                className={cn(
                  'relative h-auto p-4 rounded-lg border-2 transition-all duration-200',
                  'hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  selectedArticles.includes(article.id)
                    ? 'border-blue-500 bg-blue-50'
                    : lockedArticles.includes(article.id)
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white'
                )}
              >
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => onLock(article.id)}
                    className={cn(
                      'p-1 rounded-md transition-colors duration-200',
                      lockedArticles.includes(article.id)
                        ? 'text-amber-600 hover:text-amber-700 bg-amber-100'
                        : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    {lockedArticles.includes(article.id) ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </button>
                  {selectedArticles.includes(article.id) && (
                    <div className="p-1 text-blue-600 bg-blue-100 rounded-md">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col h-full">
                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(article.createdAt), 'MMM d, yyyy')}
                  </div>
                  
                  <button
                    onClick={() => onToggle(article.id)}
                    disabled={lockedArticles.includes(article.id)}
                    className="flex-grow text-left mb-3"
                  >
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-3">
                      {article.title}
                    </h4>
                  </button>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center px-2 py-1",
                      "text-xs font-medium rounded",
                      "text-blue-600 bg-blue-50 hover:bg-blue-100",
                      "transition-colors duration-200"
                    )}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Full Article
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}