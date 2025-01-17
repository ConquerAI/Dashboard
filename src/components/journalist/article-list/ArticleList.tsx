import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, Category } from '../../../types';
import { ArticleCard } from '../article-card/ArticleCard';
import { cn } from '../../../utils/cn';
import { Loader2, Network, Sparkles, Wand2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface ArticleListProps {
  articles: Article[];
  selectedArticles: Article[];
  selectedCategory: Category | null;
  onArticleSelect: (article: Article) => void;
  isLoading: boolean;
}

export function ArticleList({
  articles,
  selectedArticles,
  selectedCategory,
  onArticleSelect,
  isLoading
}: ArticleListProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const newPosition = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    setScrollPosition(newPosition);
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  const handleAIChoice = useCallback(() => {
    if (!selectedCategory || articles.length === 0) return;
    
    const availableArticles = articles.filter(a => a.category === selectedCategory);
    
    const articleGroups = availableArticles.reduce((groups, article) => {
      const subcategories = [article.subcategory1, article.subcategory2, article.subcategory3].filter(Boolean);
      
      subcategories.forEach(subcategory => {
        if (!subcategory) return;
        if (!groups[subcategory]) {
          groups[subcategory] = [];
        }
        groups[subcategory].push(article);
      });
      
      return groups;
    }, {} as Record<string, Article[]>);
    
    const [largestGroup] = Object.entries(articleGroups)
      .sort(([, a], [, b]) => b.length - a.length);
    
    if (!largestGroup) return;
    
    // Get articles with high scores (score >= 7)
    const highScoredArticles = largestGroup[1]
      .filter(article => (article.score || 0) >= 7);

    // If no high-scored articles, use all articles from the group
    const eligibleArticles = highScoredArticles.length > 0 ? highScoredArticles : largestGroup[1];
    
    // Select one random article from the eligible articles
    const randomIndex = Math.floor(Math.random() * eligibleArticles.length);
    const selectedArticle = eligibleArticles[randomIndex];

    // Select the article
    onArticleSelect(selectedArticle);
    toast.success(
      <div className="flex flex-col gap-1">
        <div className="font-medium">AI's Choice</div>
        <div className="text-sm">{selectedArticle.title.slice(0, 50)}...</div>
      </div>
    );
  }, [selectedCategory, articles, onArticleSelect]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Category</h3>
          <p className="text-gray-500">Choose a category to view relevant articles</p>
        </div>
      </div>
    );
  }

  const filteredArticles = articles.filter(article => article.category === selectedCategory);
  const sortedArticles = [...filteredArticles].sort((a, b) => (b.score || 0) - (a.score || 0));

  if (sortedArticles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
          <p className="text-gray-500">No articles available in this category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {selectedCategory ? `${sortedArticles.length} Articles Found` : 'Select a Category'}
        </h3>
        
        {selectedCategory && (
          <button
            onClick={handleAIChoice}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-gradient-to-r from-purple-500 to-indigo-500",
              "text-white text-sm font-medium",
              "hover:from-purple-600 hover:to-indigo-600",
              "transition-all duration-300 transform hover:scale-105",
              "shadow-md hover:shadow-lg"
            )}
          >
            <Sparkles className="w-4 h-4" />
            AI's Choice
          </button>
        )}
      </div>
      
      <div className="relative" onScroll={handleScroll}>
        <div
          className={cn(
            "overflow-y-auto scrollbar-modern",
            selectedCategory ? `scrollbar-${selectedCategory}` : '',
            "pr-4 -mr-4",
            "max-h-[calc(100vh-24rem)]",
            "space-y-4"
          )}
          ref={scrollContainerRef}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sortedArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ArticleCard
                    article={article}
                    isSelected={selectedArticles.some(a => a.id === article.id)}
                    onSelect={() => onArticleSelect(article)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}