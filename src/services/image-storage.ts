import axios from 'axios';
import { AIRTABLE_CONFIG } from '../config/airtable';
import { GeneratedImage } from '../types/image-editor';
import { format } from 'date-fns';

const IMAGES_TABLE = {
  id: 'tblyrfX4bI9YYWR57',
  fields: {
    imageUrl: 'Image URL',
    prompt: 'Prompt',
    style: 'Style',
    platform: 'Platform',
    createdAt: 'Created At'
  }
};

const airtableClient = axios.create({
  baseURL: 'https://api.airtable.com/v0',
  headers: {
    'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
    'Content-Type': 'application/json'
  }
});

export async function saveGeneratedImage(image: {
  url: string;
  prompt: string;
  style: string;
  platform: string;
}) {
  try {
    // Create a proper Date object
    const today = new Date();
    
    const response = await airtableClient.post(
      `/${AIRTABLE_CONFIG.baseId}/${IMAGES_TABLE.id}`,
      {
        records: [{
          fields: {
            'Image URL': image.url,
            'Prompt': image.prompt,
            'Style': image.style,
            'Platform': image.platform,
            'Created At': today.toISOString().split('T')[0] // Format as YYYY-MM-DD for Airtable date field
          }
        }]
      }
    );

    if (!response.data?.records?.[0]) {
      throw new Error('Failed to save image to Airtable');
    }
    
    return response.data.records[0];
  } catch (error) {
    console.error('Failed to save image:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Airtable error details:', error.response.data);
    }
    throw error;
  }
}

export async function fetchStoredImages(): Promise<GeneratedImage[]> {
  try {
    const response = await airtableClient.get(
      `/${AIRTABLE_CONFIG.baseId}/${IMAGES_TABLE.id}`,
      {
        params: {
          sort: [{ field: 'Created At', direction: 'desc' }]
        }
      }
    );

    if (!response.data?.records) {
      return [];
    }

    return response.data.records.map((record: any) => ({
      id: record.id,
      url: record.fields['Image URL'],
      prompt: record.fields['Prompt'] || 'AI Generated Image',
      createdAt: record.fields['Created At'] 
        ? new Date(record.fields['Created At'].split('/').reverse().join('-')) 
        : new Date(record.createdTime),
      style: record.fields['Style'] || 'AI Generated',
      platform: record.fields['Platform'] || 'Generated'
    }));
  } catch (error) {
    console.error('Failed to fetch images:', error);
    throw error;
  }
}