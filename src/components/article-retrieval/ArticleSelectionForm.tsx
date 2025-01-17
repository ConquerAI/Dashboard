import React from 'react';
import { Loader2, PenLine } from 'lucide-react';
import { Category } from '../../types';
import { cn } from '../../utils/cn';

interface ArticleSelectionFormProps {
  selectedCategories: Category[];
  articlesPerCategory: number;
  isLoading: boolean;
  onCategoryChange: (categories: Category[]) => void;
  onArticlesPerCategoryChange: (quantity: number) => void;
  onFetch: () => void;
  onCustomContent: () => void;
}

const categories = [
  { value: 'ai-news', label: 'AI News' },
  { value: 'ai-healthcare', label: 'AI Within Healthcare' },
  { value: 'domiciliary-care', label: 'Domiciliary Care News' },
  { value: 'healthcare', label: 'Healthcare News' },
  { value: 'nhs-news', label: 'NHS News' },
] as const;

export function ArticleSelectionForm({
  selectedCategories,
  articlesPerCategory,
  isLoading,
  onCategoryChange,
  onArticlesPerCategoryChange,
  onFetch,
  onCustomContent,
}: ArticleSelectionFormProps) {
  const toggleCategory = (category: Category) => {
    onCategoryChange(
      selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category]
    );
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      onArticlesPerCategoryChange(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Categories
            </label>
            <button
              onClick={onCustomContent}
              className={cn(
                'inline-flex items-center px-4 py-2 border border-gray-300',
                'text-sm font-medium rounded-md shadow-sm',
                'text-gray-700 bg-white hover:bg-gray-50',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              )}
            >
              <PenLine className="w-4 h-4 mr-2" />
              Custom Content
            </button>
          </div>
          
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {categories.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleCategory(value)}
                  disabled={isLoading}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-t-lg -mb-px',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    'transition-colors duration-200',
                    selectedCategories.includes(value)
                      ? 'bg-blue-50 text-blue-700 border-2 border-b-0 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700 border-2 border-transparent hover:border-gray-300'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {selectedCategories.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              Please select at least one category
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Articles per Category
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={articlesPerCategory}
              onChange={handleQuantityChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum: 10 articles per category
            </p>
          </div>

          <div className="flex items-end">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">
                Total articles to fetch: {selectedCategories.length * articlesPerCategory}
              </div>
              <button
                onClick={onFetch}
                disabled={isLoading || selectedCategories.length === 0 || articlesPerCategory < 1 || articlesPerCategory > 10}
                className={cn(
                  'w-full inline-flex items-center justify-center px-4 py-2 border border-transparent',
                  'text-sm font-medium rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  !isLoading && selectedCategories.length > 0 && articlesPerCategory >= 1 && articlesPerCategory <= 10
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching Articles...
                  </>
                ) : (
                  'Fetch Articles'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}