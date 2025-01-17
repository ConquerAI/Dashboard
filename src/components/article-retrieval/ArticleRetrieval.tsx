import React, { useState } from 'react';
import { CategoryGrid } from '../journalist/category-grid/CategoryGrid';
import { ArticleList } from '../journalist/article-list/ArticleList';
import { SimilarArticles } from './SimilarArticles';
import { StyleSelector } from '../journalist/style-selector/StyleSelector';
import { CustomContentInput } from '../post-generation/CustomContentInput';
import { useJournalist } from '../../hooks/useJournalist';

export function ArticleRetrieval() {
  const {
    articles,
    selectedCategory,
    selectedArticles,
    isLoading,
    error,
    handleCategorySelect,
    handleArticleSelect,
    handleArticleDeselect,
  } = useJournalist();

  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showCustomContent, setShowCustomContent] = useState(false);

  const handleStartGenerating = () => {
    setShowStyleSelector(true);
  };

  const handleCustomContent = () => {
    setShowCustomContent(true);
  };

  if (showCustomContent) {
    return (
      <CustomContentInput
        onBack={() => setShowCustomContent(false)}
        onSubmit={() => {}}
        isGenerating={false}
        selectedStyles={[]}
        onStyleSelect={() => {}}
        onStyleRemove={() => {}}
        generateImage={true}
        onGenerateImageChange={() => {}}
      />
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
            isLoading={isLoading}
          />
        </div>

        {selectedArticles.length > 0 && (
          <SimilarArticles
            selectedArticle={selectedArticles[0]}
            allArticles={articles}
            onStartGenerating={handleStartGenerating}
          />
        )}

        <div className="flex justify-end">
          <button
            onClick={handleCustomContent}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Custom Content
          </button>
        </div>
      </div>
    </div>
  );
}