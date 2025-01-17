import { useState, useCallback, useEffect } from 'react';
import { Article, Category, ArticleRelationship } from '../types';
import { fetchJournalistArticles } from '../services/journalist';
import { toast } from 'react-hot-toast';

export function useJournalist() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [relationships, setRelationships] = useState<ArticleRelationship[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles(selectedCategory);
  }, [selectedCategory]);

  const loadArticles = async (category: Category | null) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading articles for category:', category || 'all');
      
      const data = await fetchJournalistArticles(category);
      
      if (!data.articles || data.articles.length === 0) {
        console.log('No articles found for category:', category || 'all');
      }

      // Add random positions for visualization
      const articlesWithPositions = data.articles.map(article => ({
        ...article,
        x: Math.random() * 800,
        y: Math.random() * 600
      }));

      setArticles(articlesWithPositions);

      console.log('Articles loaded:', {
        category: category || 'all',
        count: articlesWithPositions.length,
        timestamp: new Date().toISOString()
      });

      if (category) {
        toast.success(`Loaded ${data.articles.length} articles for ${category}`);
      }
    } catch (error) {
      console.error('Failed to load articles:', {
        error,
        category,
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      const message = error instanceof Error ? error.message : 'Failed to load articles';
      setError(message);
      toast.error(message);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(prev => prev === category ? null : category);
    setSelectedArticles([]);
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticles(prev => {
      // Only allow one selection
      return prev.some(a => a.id === article.id) ? [] : [article];
    });
  };

  const handleArticleDeselect = (article: Article) => {
    setSelectedArticles(prev => prev.filter(a => a.id !== article.id));
  };

  return {
    articles,
    selectedArticles,
    selectedCategory,
    relationships,
    insights,
    isLoading,
    error,
    handleCategorySelect,
    handleArticleSelect,
    handleArticleDeselect,
  };
}