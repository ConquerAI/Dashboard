import axios from 'axios';
import { AIRTABLE_CONFIG } from '../config/airtable';
import { GeneratedPost } from '../types';

const airtableClient = axios.create({
    baseURL: 'https://api.airtable.com/v0',
    headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
    }
});

export async function fetchGeneratedPosts(offset?: string): Promise<{ posts: GeneratedPost[], offset?: string }> {
    try {
        const params: Record<string, any> = {
            pageSize: 6,
            fields: [
                AIRTABLE_CONFIG.fields.post,
                AIRTABLE_CONFIG.fields.style,
                'Image',
                'Platform'
            ]
        };

        if (offset) {
            params.offset = offset;
        }

        const { data } = await airtableClient.get(
            `/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tables['generated-posts']}`,
            { params }
        );

        const posts: GeneratedPost[] = (data.records || []).map((record: any) => ({
            id: record.id,
            post: record.fields[AIRTABLE_CONFIG.fields.post] || '',
            style: record.fields[AIRTABLE_CONFIG.fields.style] || '',
            createdTime: record.createdTime || new Date().toISOString(),
            imageUrl: record.fields.Image || undefined,
            platform: record.fields.Platform || undefined
        }));

        return {
            posts,
            offset: data.offset
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Airtable API Error:', {
                status: error.response?.status,
                message: error.message,
                data: error.response?.data
            });
        }
        throw error;
    }
}
export async function updatePost(postId: string, postText: string): Promise<void> {
    try {
         await airtableClient.patch(
             `/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tables['generated-posts']}/${postId}`,
            { fields: { [AIRTABLE_CONFIG.fields.post]: postText } }
         );
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Airtable API Error:', {
                status: error.response?.status,
                message: error.message,
                data: error.response?.data
            });
        }
        throw error;
    }
}