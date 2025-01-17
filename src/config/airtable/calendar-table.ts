import { AIRTABLE_BASE_CONFIG } from './base';

export const CALENDAR_TABLE_CONFIG = {
  ...AIRTABLE_BASE_CONFIG,
  tableId: 'tblKAVfunNfe2dC8T',
  fields: {
    eventTitle: 'Event Title',
    eventDate: 'Date',
    eventType: 'Type',
    eventDescription: 'Description',
    isRecurring: 'Is Recurring',
    autoPost: 'Auto Post'
  }
};