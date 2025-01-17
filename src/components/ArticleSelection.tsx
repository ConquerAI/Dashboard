import React from 'react';
import { Check } from 'lucide-react';
import { Category } from '../types';
import { cn } from '../utils/cn';

interface Article {
  id: string;
  title: string;
  category: Category;
  createdAt: Date;
}

interface ArticleSelectionProps {
  category: Category;
  selectedArticles: string[];
  onArticleToggle: (id: string) => void;
}

export function ArticleSelection({ category, selectedArticles, onArticleToggle }: ArticleSelectionProps) {
  // Temporary mock data - replace with actual API call
  const articles: Article[] = Array.from({ length: 10 }, (_, i) => ({
    id: `article-${i + 1}`,
    title: `Healthcare Article ${i + 1}: ${category === 'all' ? 'Various Topics' : category.replace('-', ' ')}`,
    category: category === 'all' ? ['healthcare', 'nhs-news', 'domiciliary-care', 'ai-healthcare'][i % 4] as Category : category,
    createdAt: new Date(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Articles
        </h3>
        <span className="text-sm text-gray-500">
          {selectedArticles.length} selected
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={() => onArticleToggle(article.id)}
            className={cn(
              'relative h-32 p-4 rounded-lg border-2 transition-all duration-200',
              'hover:border-blue-400 hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'flex flex-col items-start justify-between text-left',
              selectedArticles.includes(article.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            )}
          >
            {selectedArticles.includes(article.id) && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-blue-500" />
              </div>
            )}
            
            <div className="w-full">
              <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                {article.title}
              </h4>
              {category === 'all' && (
                <span className="mt-1 inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                  {article.category.replace('-', ' ')}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}