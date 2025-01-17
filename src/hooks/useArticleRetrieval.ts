import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Article, Category, PostStyle, StyleStrength } from '../types';
import { 
  fetchArticles as fetchArticlesFromAirtable, 
  fetchUnlockedArticles,
  markArticleLocked,
  markArticleUnlocked,
  resetPresentedArticles,
  markArticlesSelected
} from '../services/airtable';
import { clearCache } from '../services/article-cache';

export function useArticleRetrieval() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [articlesPerCategory, setArticlesPerCategory] = useState(5);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [lockedArticles, setLockedArticles] = useState<string[]>([]);
  const [refreshingCategories, setRefreshingCategories] = useState<Category[]>([]);
  const [noMoreArticles, setNoMoreArticles] = useState<Record<Category, boolean>>({} as Record<Category, boolean>);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showCustomContent, setShowCustomContent] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<StyleStrength[]>([]);
  const [generateImage, setGenerateImage] = useState(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleError = (error: any) => {
    console.error('Article retrieval error:', error);
    setError(error?.message || 'An error occurred');
    toast.error(error?.message || 'An error occurred');
  };

  const onStyleSelect = useCallback((newStyle: StyleStrength) => {
    setSelectedStyles(prev => {
      const existing = prev.findIndex(s => s.style === newStyle.style);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newStyle;
        return updated;
      }
      return [...prev, newStyle];
    });
  }, []);

  const onStyleRemove = useCallback((styleId: PostStyle) => {
    setSelectedStyles(prev => prev.filter(s => s.style !== styleId));
  }, []);

  const retrieveArticles = async () => {
    if (selectedCategories.length === 0) return;

    setIsLoading(true);
    setError(null);

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    try {
      clearCache();
      
      await Promise.all(
        selectedCategories.map(category => resetPresentedArticles(category))
      );

      const fetchedArticles = await fetchArticlesFromAirtable(
        selectedCategories,
        articlesPerCategory
      );

      setArticles(fetchedArticles);
      setSelectedArticle(null);
      setLockedArticles([]);
      setNoMoreArticles({} as Record<Category, boolean>);

      fetchTimeoutRef.current = setTimeout(retrieveArticles, 5 * 60 * 1000);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCategory = async (category: Category) => {
    setRefreshingCategories(prev => [...prev, category]);
    try {
      const currentCategoryArticles = articles.filter(a => a.category === category);
      const lockedCategoryArticles = currentCategoryArticles.filter(a => lockedArticles.includes(a.id));
      const newArticlesNeeded = articlesPerCategory - lockedCategoryArticles.length;

      const newArticles = await fetchUnlockedArticles(category, newArticlesNeeded);
      
      if (newArticles.length === 0) {
        setNoMoreArticles(prev => ({ ...prev, [category]: true }));
        toast('All articles have been shown');
      } else {
        setArticles(prev => {
          const filteredArticles = prev.filter(article => 
            article.category !== category || lockedArticles.includes(article.id)
          );
          return [...filteredArticles, ...newArticles];
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setRefreshingCategories(prev => prev.filter(c => c !== category));
    }
  };

  const resetCategory = async (category: Category) => {
    try {
      await resetPresentedArticles(category);
      setNoMoreArticles(prev => ({ ...prev, [category]: false }));
      await refreshCategory(category);
      toast.success(`Reset articles for ${category}`);
    } catch (error) {
      handleError(error);
    }
  };

  const toggleArticle = (id: string) => {
    setSelectedArticle(prev => prev === id ? null : id);
  };

  const toggleArticleLock = async (id: string) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    try {
      if (lockedArticles.includes(id)) {
        await markArticleUnlocked(article);
        setLockedArticles(prev => prev.filter(articleId => articleId !== id));
        await refreshCategory(article.category);
      } else {
        await markArticleLocked(article);
        setLockedArticles(prev => [...prev, id]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const startMakingPost = () => {
    if (!selectedArticle) return;
    setShowStyleSelector(true);
  };

  const startCustomContent = () => {
    setShowCustomContent(true);
  };

  const generatePost = async () => {
    if (!selectedArticle || selectedStyles.length === 0) return;
    
    setIsGenerating(true);
    try {
      const selectedArticleData = articles.find(article => article.id === selectedArticle);
      if (!selectedArticleData) throw new Error('Selected article not found');
      
      await markArticlesSelected([selectedArticleData], selectedStyles, generateImage);
      toast.success('Post generation initiated!');
      setShowStyleSelector(false);
      setSelectedStyles([]);
      setSelectedArticle(null);
      setGenerateImage(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCustomPost = async (content: string) => {
    if (!content || selectedStyles.length === 0) return;
    
    setIsGenerating(true);
    try {
      await markArticlesSelected([], selectedStyles, generateImage, content);
      toast.success('Custom post generation initiated!');
      setShowCustomContent(false);
      setSelectedStyles([]);
      setGenerateImage(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    selectedCategories,
    articlesPerCategory,
    articles,
    selectedArticle,
    lockedArticles,
    refreshingCategories,
    noMoreArticles,
    isLoading,
    isGenerating,
    error,
    showStyleSelector,
    showCustomContent,
    selectedStyles,
    generateImage,
    setSelectedCategories,
    setArticlesPerCategory,
    toggleArticle,
    toggleArticleLock,
    fetchArticles: retrieveArticles,
    refreshCategory,
    resetCategory,
    startMakingPost,
    startCustomContent,
    generatePost,
    generateCustomPost,
    setShowStyleSelector,
    setShowCustomContent,
    onStyleSelect,
    onStyleRemove,
    setGenerateImage,
  };
}