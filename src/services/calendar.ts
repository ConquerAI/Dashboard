import axios from 'axios';
import { AIRTABLE_CONFIG } from '../config/airtable';
import { CalendarEvent } from '../types';
import { format } from 'date-fns';

const airtableClient = axios.create({
  baseURL: 'https://api.airtable.com/v0',
  headers: {
    'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
    'Content-Type': 'application/json'
  }
});

function formatAirtableDate(dateStr: string): string {
  // Airtable date field returns in YYYY-MM-DD format
  // Convert to DD/MM/YYYY format
  const date = new Date(dateStr);
  return format(date, 'dd/MM/yyyy');
}

function isEventInMonth(dateStr: string, targetMonth: number): boolean {
  // Parse YYYY-MM-DD format directly
  const date = new Date(dateStr);
  return date.getMonth() === targetMonth;
}

export async function fetchCalendarEvents(date: Date): Promise<CalendarEvent[]> {
  try {
    const response = await airtableClient.get(
      `/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tables.calendar}`,
      {
        params: {
          view: 'Grid view',
          fields: ['Name', 'Event', 'Date']
        }
      }
    );

    if (!response.data?.records) {
      return [];
    }

    const targetMonth = date.getMonth();

    return response.data.records
      .filter(record => isEventInMonth(record.fields.Date, targetMonth))
      .map(record => ({
        id: record.id,
        title: record.fields.Name || '',
        type: record.fields.Event?.toLowerCase() || 'custom',
        date: formatAirtableDate(record.fields.Date) || '',
        description: '',
        isRecurring: false,
        autoPost: false
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });
  } catch (error: any) {
    console.error('Calendar fetch error:', error);
    throw new Error('Failed to fetch calendar events');
  }
}