import { Article, Category } from '../types';

interface CacheEntry {
  articles: Article[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<Category, CacheEntry>();

export function getCachedArticles(category: Category): Article[] | null {
  const entry = cache.get(category);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(category);
    return null;
  }

  return entry.articles;
}

export function setCachedArticles(category: Category, articles: Article[]): void {
  cache.set(category, {
    articles,
    timestamp: Date.now()
  });
}

export function clearCache(): void {
  cache.clear();
}