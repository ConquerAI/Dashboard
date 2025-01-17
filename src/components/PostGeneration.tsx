import React, { useState } from 'react';
import { Check, Edit2, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Platform, Category } from '../types';
import { useStore } from '../store/useStore';
import { ArticleSelection } from './ArticleSelection';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'nhs-news', label: 'NHS News' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'domiciliary-care', label: 'Domiciliary Care' },
  { value: 'ai-healthcare', label: 'AI in Healthcare' },
];

const platforms: { value: Platform; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
];

export function PostGeneration() {
  const [category, setCategory] = useState<Category>('all');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { addPost, addAuditEntry } = useStore();

  const handleArticleToggle = (id: string) => {
    setSelectedArticles(prev =>
      prev.includes(id)
        ? prev.filter(articleId => articleId !== id)
        : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedArticles.length === 0) return;

    setIsGenerating(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Generating post...',
        success: `Post generated from ${selectedArticles.length} articles!`,
        error: 'Failed to generate post',
      }
    ).finally(() => setIsGenerating(false));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as Category);
                    setSelectedArticles([]);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {platforms.map((plat) => (
                    <option key={plat.value} value={plat.value}>
                      {plat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ArticleSelection
              category={category}
              selectedArticles={selectedArticles}
              onArticleToggle={handleArticleToggle}
            />

            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={selectedArticles.length === 0 || isGenerating}
                className={cn(
                  'inline-flex items-center px-6 py-3 border border-transparent',
                  'text-base font-medium rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  selectedArticles.length > 0 && !isGenerating
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                )}
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  `Generate Post from ${selectedArticles.length} Article${selectedArticles.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>

        {content && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Generated Post</h3>
              <textarea
                rows={6}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {content.length} characters
                </div>
                <div className="space-x-3">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Check className="w-4 h-4 mr-2" />
                    Request Approval
                  </button>
                  <button
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}