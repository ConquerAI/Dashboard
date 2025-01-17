import React, { useState } from 'react';
import { CategoryGrid } from './category-grid/CategoryGrid';
import { ArticleList } from './article-list/ArticleList';
import { ArticleRelationships } from './article-relationships/ArticleRelationships';
import { StyleSelector } from './style-selector/StyleSelector';
import { categoryMapping } from '../../types';
import { useJournalist } from '../../hooks/useJournalist';

export function JournalistView() {
  const {
    articles,
    selectedCategory,
    selectedArticles,
    relationships,
    isLoading,
    error,
    handleCategorySelect,
    handleArticleSelect,
    handleArticleDeselect,
  } = useJournalist();

  const [showStyleSelector, setShowStyleSelector] = useState(false);

  const handleStartCombining = () => {
    setShowStyleSelector(true);
  };

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

  if (showStyleSelector) {
    return (
      <StyleSelector
        selectedArticles={selectedArticles}
        allArticles={articles}
        onBack={() => setShowStyleSelector(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <CategoryGrid
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          isLoading={isLoading}
        />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm">
          <ArticleList
            articles={articles}
            selectedArticles={selectedArticles}
            selectedCategory={selectedCategory}
            onArticleSelect={handleArticleSelect}
            onStartCombining={handleStartCombining}
            isLoading={isLoading}
          />
        </div>
        
        {selectedArticles.length > 0 && (
          <ArticleRelationships
            selectedArticle={selectedArticles[0] || null}
            allArticles={articles}
            onArticleSelect={handleArticleSelect}
            onStartCombining={handleStartCombining}
          />
        )}
      </div>
    </div>
  );
}