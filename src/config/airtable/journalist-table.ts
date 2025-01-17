import { AIRTABLE_BASE_CONFIG } from './base';

export const JOURNALIST_TABLE_CONFIG = {
  ...AIRTABLE_BASE_CONFIG,
  tableId: 'tblPjkmCfS1AS5AcQ',
  view: 'Grid view',
  fields: {
    title: 'Title',
    content: 'Article',
    url: 'URL',
    date: 'Date',
    category: 'Category',
    description: 'Description',
    subcategory1: 'Subcategory 1',
    subcategory2: 'Subcategory 2',
    subcategory3: 'Subcategory 3',
    score: 'Score'
  }
};