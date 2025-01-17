import axios from 'axios';
import { JOURNALIST_TABLE_CONFIG } from '../config/airtable/journalist-table';
import { Article, Category, categoryMapping } from '../types';

interface JournalistResponse {
  articles: Article[];
}

export async function fetchJournalistArticles(category: Category | null): Promise<JournalistResponse> {
  try {
    console.log('Fetching articles for category:', category);

    const filterFormula = category 
      ? `{${JOURNALIST_TABLE_CONFIG.fields.category}} = '${categoryMapping[category]}'`
      : '';

    const requestConfig = {
      headers: {
        'Authorization': `Bearer ${JOURNALIST_TABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      params: {
        filterByFormula: filterFormula,
        view: JOURNALIST_TABLE_CONFIG.view,
        fields: [
          JOURNALIST_TABLE_CONFIG.fields.title,
          JOURNALIST_TABLE_CONFIG.fields.content,
          JOURNALIST_TABLE_CONFIG.fields.url,
          JOURNALIST_TABLE_CONFIG.fields.date,
          JOURNALIST_TABLE_CONFIG.fields.category,
          JOURNALIST_TABLE_CONFIG.fields.description,
          JOURNALIST_TABLE_CONFIG.fields.subcategory1,
          JOURNALIST_TABLE_CONFIG.fields.subcategory2,
          JOURNALIST_TABLE_CONFIG.fields.subcategory3,
          JOURNALIST_TABLE_CONFIG.fields.score
        ]
      }
    };

    console.log('Request config:', {
      url: `https://api.airtable.com/v0/${JOURNALIST_TABLE_CONFIG.baseId}/${JOURNALIST_TABLE_CONFIG.tableId}`,
      ...requestConfig
    });

    const response = await axios.get(
      `https://api.airtable.com/v0/${JOURNALIST_TABLE_CONFIG.baseId}/${JOURNALIST_TABLE_CONFIG.tableId}`,
      requestConfig
    );

    console.log('Response data:', {
      status: response.status,
      recordCount: response.data?.records?.length || 0
    });

    const articles = response.data.records.map((record: any) => ({
      id: record.id,
      title: record.fields[JOURNALIST_TABLE_CONFIG.fields.title],
      content: record.fields[JOURNALIST_TABLE_CONFIG.fields.content],
      url: record.fields[JOURNALIST_TABLE_CONFIG.fields.url],
      category: Object.entries(categoryMapping).find(
        ([_, value]) => value === record.fields[JOURNALIST_TABLE_CONFIG.fields.category]
      )?.[0] as Category || 'healthcare',
      createdAt: record.fields[JOURNALIST_TABLE_CONFIG.fields.date],
      description: record.fields[JOURNALIST_TABLE_CONFIG.fields.description],
      subcategory1: record.fields[JOURNALIST_TABLE_CONFIG.fields.subcategory1],
      subcategory2: record.fields[JOURNALIST_TABLE_CONFIG.fields.subcategory2],
      subcategory3: record.fields[JOURNALIST_TABLE_CONFIG.fields.subcategory3],
      score: record.fields[JOURNALIST_TABLE_CONFIG.fields.score]
    }));

    return { articles };
  } catch (error) {
    console.error('Failed to fetch journalist articles:', error);
    
    if (axios.isAxiosError(error)) {
      const errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.error?.message || error.message,
        category
      };
      console.error('Airtable API Error:', errorDetails);
      throw new Error(`Failed to fetch articles: ${errorDetails.message}`);
    }
    throw error;
  }
}