import { AIRTABLE_BASE_CONFIG } from './base';

export const GENERATED_POSTS_TABLE_CONFIG = {
  ...AIRTABLE_BASE_CONFIG,
  tableId: 'tblpznVYgjTETnYh0',
  fields: {
    post: 'Post',
    style: 'Style',
    image: 'Image'
  }
};