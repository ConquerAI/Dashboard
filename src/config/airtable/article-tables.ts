import { AIRTABLE_BASE_CONFIG } from './base';

export const ARTICLE_TABLES_CONFIG = {
  ...AIRTABLE_BASE_CONFIG,
  tables: {
    'ai-news': 'tblDRiF1e3aEY6Ms2',
    'ai-healthcare': 'tblbhV9EUtaUzEx0J',
    'domiciliary-care': 'tblV7JbQ6PedwgHu0',
    'healthcare': 'tblA9Ijl6nmuFeB35',
    'nhs-news': 'tbl7FEFdWkShthwmJ',
  },
  fields: {
    title: 'Title',
    content: 'Article',
    url: 'URL',
    date: 'Date',
    status: 'Status',
  },
  status: {
    locked: 'Locked',
    presented: 'Presented',
    selected: 'Selected'
  }
};