import axios from 'axios';
import { RECRAFT_API_KEY, RECRAFT_API_URL } from './recraft';

export async function generativeUpscale(imageUrl: string) {
  try {
    // First, fetch the image data
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'blob'
    });
    const imageBlob = imageResponse.data;

    // Create FormData
    const formData = new FormData();
    formData.append('file', imageBlob, 'image.png');

    // Make request to Recraft API
    const response = await axios.post(
      `${RECRAFT_API_URL}/images/generativeUpscale`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${RECRAFT_API_KEY}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.image.url;
  } catch (error) {
    console.error('Error upscaling image:', error);
    throw new Error('Failed to upscale image');
  }
}