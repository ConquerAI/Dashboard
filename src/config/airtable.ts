import { AIRTABLE_BASE_CONFIG } from './airtable/base';
import { ARTICLE_TABLES_CONFIG } from './airtable/article-tables';
import { CALENDAR_TABLE_CONFIG } from './airtable/calendar-table';
import { GENERATED_POSTS_TABLE_CONFIG } from './airtable/generated-posts-table';
import { JOURNALIST_TABLE_CONFIG } from './airtable/journalist-table';

export const AIRTABLE_CONFIG = {
  ...AIRTABLE_BASE_CONFIG,
  tables: {
    ...ARTICLE_TABLES_CONFIG.tables,
    'calendar': CALENDAR_TABLE_CONFIG.tableId,
    'generated-posts': GENERATED_POSTS_TABLE_CONFIG.tableId,
    'journalist': JOURNALIST_TABLE_CONFIG.tableId
  },
  fields: {
    // Article fields
    title: 'Title',
    content: 'Article',
    url: 'URL',
    date: 'Date',
    status: 'Status',
    
    // Generated Posts fields
    post: 'Post',
    style: 'Style',
    
    // Calendar fields
    eventTitle: 'Event Title',
    eventDate: 'Date',
    eventType: 'Type',
    eventDescription: 'Description',
    isRecurring: 'Is Recurring',
    autoPost: 'Auto Post'
  },
  status: ARTICLE_TABLES_CONFIG.status
};