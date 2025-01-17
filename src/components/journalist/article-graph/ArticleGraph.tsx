import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Network } from 'lucide-react';
import { Article, ArticleRelationship } from '../../../types';
import { ArticleNode } from './ArticleNode';
import { RelationshipLine } from './RelationshipLine';
import { cn } from '../../../utils/cn';

interface ArticleGraphProps {
  articles: Article[];
  relationships: ArticleRelationship[];
  selectedArticles: Article[];
  onArticleSelect: (article: Article) => void;
  isLoading: boolean;
}

export function ArticleGraph({
  articles,
  relationships,
  selectedArticles,
  onArticleSelect,
  isLoading
}: ArticleGraphProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading article relationships...</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-[800px] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative h-full">
        {/* Relationship Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {relationships.map((relationship) => (
            <RelationshipLine
              key={`${relationship.sourceId}-${relationship.targetId}`}
              relationship={relationship}
              articles={articles}
            />
          ))}
        </svg>

        {/* Article Nodes */}
        <div className="relative h-full">
          <AnimatePresence>
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2",
                  "transition-all duration-300 ease-out z-10"
                )}
                style={{
                  left: `${article.position?.x ?? 0}%`,
                  top: `${article.position?.y ?? 0}%`,
                }}
              >
                <ArticleNode
                  article={article}
                  isSelected={selectedArticles.some(a => a.id === article.id)}
                  onSelect={() => onArticleSelect(article)}
                  relationships={relationships.filter(r => 
                    r.sourceId === article.id || r.targetId === article.id
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}