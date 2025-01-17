import React from 'react';
import { Article } from '../../../types';
import { motion } from 'framer-motion';
import { Network, ArrowRight, Gauge, Wand2, FileText, Calendar, ExternalLink } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { format } from 'date-fns';

interface ArticleRelationshipsProps {
  selectedArticle: Article | null;
  allArticles: Article[];
  onArticleSelect: (article: Article) => void;
  onStartCombining: () => void;
}

interface RelatedArticle {
  article: Article;
  matchingCategories: string[];
  matchScore: number;
}

export function findRelatedArticles(article: Article, allArticles: Article[]): RelatedArticle[] {
  if (!article) return [];

  const articleSubcategories = [
    article.subcategory1,
    article.subcategory2,
    article.subcategory3
  ].filter(Boolean);

  const maxPossibleMatches = articleSubcategories.length;
  return allArticles
    .filter(a => a.id !== article.id)
    .map(otherArticle => {
      const otherSubcategories = [
        otherArticle.subcategory1,
        otherArticle.subcategory2,
        otherArticle.subcategory3
      ].filter(Boolean);

      const matchingCategories = articleSubcategories.filter(cat => 
        otherSubcategories.includes(cat)
      );

      return {
        article: otherArticle,
        matchingCategories,
        matchScore: (matchingCategories.length / maxPossibleMatches) * 100
      };
    })
    .filter(({ matchingCategories }) => matchingCategories.length > 0)
    .sort((a, b) => b.matchingCategories.length - a.matchingCategories.length)
    .slice(0, 2); // Get top 2 related articles
}

export function ArticleRelationships({
  selectedArticle,
  allArticles,
  onArticleSelect,
  onStartCombining
}: ArticleRelationshipsProps) {
  if (!selectedArticle) return null;

  const relatedArticles = findRelatedArticles(selectedArticle, allArticles);

  if (relatedArticles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Selected Article
          </h3>
          <div className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
            <div className="space-y-3">
              <div className="text-xs text-gray-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(selectedArticle.createdAt), 'MMM d, yyyy')}
              </div>
              <h4 className="font-medium text-gray-900">
                {selectedArticle.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {[selectedArticle.subcategory1, selectedArticle.subcategory2, selectedArticle.subcategory3]
                  .filter(Boolean)
                  .map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium"
                    >
                      {category}
                    </span>
                  ))}
              </div>
              {selectedArticle.url && (
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Source
                </a>
              )}
            </div>
          </div>
        </div>
        <Network className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No related articles found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Selected Article
        </h3>
        <div className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
          <div className="space-y-3">
            <div className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(selectedArticle.createdAt), 'MMM d, yyyy')}
            </div>
            <h4 className="font-medium text-gray-900">
              {selectedArticle.title}
            </h4>
            <div className="flex flex-wrap gap-2">
              {[selectedArticle.subcategory1, selectedArticle.subcategory2, selectedArticle.subcategory3]
                .filter(Boolean)
                .map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium"
                  >
                    {category}
                  </span>
                ))}
            </div>
            {selectedArticle.url && (
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Source
              </a>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
        <Network className="w-5 h-5 text-blue-500" />
        Related Articles
      </h3>

      <div className="space-y-4">
        {relatedArticles.map(({ article, matchingCategories, matchScore }) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <button
              onClick={() => onArticleSelect(article)}
              className={cn(
                "w-full p-4 rounded-lg transition-all duration-200",
                "border border-gray-200 hover:border-blue-300",
                "bg-gradient-to-br from-blue-50/50 to-indigo-50/50",
                "hover:shadow-md text-left group"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-medium text-gray-900 line-clamp-2">
                    {article.title}
                  </h4>
                  <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {matchingCategories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Gauge className={cn(
                      "w-4 h-4",
                      matchScore === 100 ? "text-green-500" :
                      matchScore >= 66 ? "text-blue-500" :
                      "text-amber-500"
                    )} />
                    <span className={cn(
                      "font-medium",
                      matchScore === 100 ? "text-green-700" :
                      matchScore >= 66 ? "text-blue-700" :
                      "text-amber-700"
                    )}>
                      {matchScore === 100 ? "Perfect Match" :
                       matchScore >= 66 ? "Strong Match" :
                       "Partial Match"} ({Math.round(matchScore)}%)
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={onStartCombining}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
            "bg-gradient-to-r from-purple-500 to-indigo-500",
            "text-white font-medium",
            "hover:from-purple-600 hover:to-indigo-600",
            "transition-all duration-300 transform hover:scale-105",
            "shadow-md hover:shadow-lg"
          )}
        >
          <Wand2 className="w-5 h-5" />
          Combine Selected Articles
        </button>
      </div>
    </div>
  );
}