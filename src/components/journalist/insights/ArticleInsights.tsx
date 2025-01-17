import React from 'react';
import { Lightbulb, Sparkles, Network } from 'lucide-react';
import { Article } from '../../../types';
import { motion } from 'framer-motion';

interface ArticleInsightsProps {
  insights?: string[];
  selectedArticles: Article[];
}

export function ArticleInsights({ insights = [], selectedArticles }: ArticleInsightsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Content Insights
        </h3>
        <span className="text-sm text-gray-500">
          {selectedArticles.length} selected
        </span>
      </div>

      {selectedArticles.length > 0 ? (
        <div className="space-y-4">
          {selectedArticles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
            >
              <h4 className="font-medium text-gray-900 mb-2">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Network className="w-4 h-4" />
                <span>
                  {article.subcategory1 || 'General Healthcare'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            Select an article to see insights
          </p>
        </div>
      )}

      {insights.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Quick Insights
          </h4>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}