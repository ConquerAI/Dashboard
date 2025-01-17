import React from 'react';
import { JournalistHeader } from './JournalistHeader';
import { CategoryGrid } from './category-grid/CategoryGrid';
import { CategorySelector } from './category-selector/CategorySelector';
import { ArticleList } from './article-list/ArticleList';
import { ArticleInsights } from './insights/ArticleInsights';
import { SelectedArticles } from './selected/SelectedArticles';
import { useJournalist } from '../../hooks/useJournalist';

export function JournalistView() {
  const {
    articles,
    selectedCategory,
    selectedArticles,
    relationships,
    insights,
    isLoading,
    error,
    handleCategorySelect,
    handleArticleSelect,
    handleArticleDeselect,
  } = useJournalist();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JournalistHeader />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Article Grid */}
          <div className="lg:col-span-2">
            <CategoryGrid
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              isLoading={isLoading}
            />
            <ArticleGrid
              articles={articles}
              relationships={relationships}
              selectedArticles={selectedArticles}
              onArticleSelect={handleArticleSelect}
              isLoading={isLoading}
            />
          </div>

          {/* Sidebar with Insights and Selected Articles */}
          <div className="space-y-6">
            <ArticleInsights 
              selectedArticles={selectedArticles}
            />
            <SelectedArticles
              articles={selectedArticles}
              onArticleDeselect={handleArticleDeselect}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  isCompact?: boolean;
}

export function ArticleCard({
  article,
  isSelected,
  onSelect,
  isCompact = false
}: ArticleCardProps) {
  const score = article.score || 0;
}