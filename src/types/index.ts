export const categoryMapping = {
  'ai-news': 'AI News',
  'ai-healthcare': 'AI News Within Healthcare',
  'domiciliary-care': 'Domiciliary Care News',
  'healthcare': 'General Healthcare News',
  'nhs-news': 'NHS News'
} as const;

export type Category = keyof typeof categoryMapping;

export interface Article {
  id: string;
  title: string;
  content: string;
  url: string;
  category: Category;
  createdAt: string;
  description?: string;
  subcategory1?: string;
  subcategory2?: string;
  subcategory3?: string;
  score?: number;
  position?: {
    x: number;
    y: number;
  };
}

export interface ArticleRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number;
  isSecondary?: boolean;
}

export interface Post {
  id: string;
  content: string;
  platform: Platform;
  scheduledDate?: Date;
  status: PostStatus;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  type: EventType;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
}

export type Platform = 'linkedin' | 'twitter' | 'facebook';
export type PostStatus = 'draft' | 'pending' | 'approved' | 'scheduled' | 'published';
export type EventType = 'post' | 'approval' | 'system';
export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'blog';
export type PostStyle = 'tech-enthusiast' | 'healthcare-professional' | 'warm-personal' | 
                       'industry-leader' | 'community-voice' | 'quick-update' | 'national-holiday';

export interface StyleStrength {
  style: PostStyle;
  strength: number;
  position?: 'start' | 'middle' | 'end' | 'full';
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  isRecurring: boolean;
  autoPost: boolean;
}

export interface GeneratedPost {
  id: string;
  post: string;
  style: string;
  createdTime: string;
  imageUrl?: string;
  platform?: string;
}