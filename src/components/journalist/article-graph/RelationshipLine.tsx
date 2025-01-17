import React from 'react';
import { Article, ArticleRelationship } from '../../../types';

interface RelationshipLineProps {
  relationship: ArticleRelationship;
  articles: Article[];
}

export function RelationshipLine({ relationship, articles }: RelationshipLineProps) {
  const source = articles.find(a => a.id === relationship.sourceId);
  const target = articles.find(a => a.id === relationship.targetId);

  if (!source?.position || !target?.position) return null;

  const strokeWidth = Math.max(1, Math.min(relationship.strength / 2, 3));
  const opacity = Math.max(0.2, Math.min(relationship.strength / 10, 0.5));

  return (
    <line
      x1={`${source.position.x}%`}
      y1={`${source.position.y}%`}
      x2={`${target.position.x}%`}
      y2={`${target.position.y}%`}
      stroke={relationship.isSecondary ? "#9CA3AF" : "#4B5563"}
      strokeWidth={strokeWidth}
      opacity={0.3}
      strokeDasharray={relationship.isSecondary ? "4 2" : undefined}
      className="transition-all duration-300 pointer-events-none"
    />
  );
}