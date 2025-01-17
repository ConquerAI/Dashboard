import Airtable from 'airtable';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LogEntry } from '../types/image-editor';

export const RECRAFT_API_KEY = 'Tj4PmS7geTzeQkcPn9xSGek2CXYGdGBObmyVnZixNxetWiQbSUh9kpMm0CRnfkEq';
export const RECRAFT_API_URL = 'https://external.api.recraft.ai/v1';

// Image size and style mappings
const imageSizeMap = {
  'instagram-square': '1024x1024',
  'instagram-story': '1024x1820',
  'facebook-post': '1280x1024',
  'twitter-post': '1280x1024',
  'linkedin-post': '1280x1024',
  'pinterest-pin': '1024x1536',
  'youtube-thumbnail': '1280x1024',
  'tiktok-video': '1024x1820',
};

const styleMap = {
  'natural': 'realistic_image',
  'digital': 'digital_illustration',
  'vector': 'vector_illustration',
};

// Generate Image Params Interface
interface GenerateImageParams {
  prompt: string;
  textContent?: string;
  textPosition?: string;
  textStyle?: string;
  textColor?: string;
  textSize?: string;
  textEmphasis?: string;
  imageSize: string;
  style?: string;
  colorScheme?: string;
  mood?: string;
  backgroundColor?: string;
  format?: string;
}

// Construct prompt for text styling
function constructTextPrompt(params: GenerateImageParams): string {
  if (!params.textContent) return '';

  const descriptors = [];
  if (params.textStyle) descriptors.push(params.textStyle);
  // Remove or modify the color handling
  if (params.textColor) {
    // Only include color names, not hex codes
    if (!params.textColor.startsWith('#')) {
      descriptors.push(params.textColor);
    }
  }
  if (params.textSize) descriptors.push(`${params.textSize}-sized`);
  if (params.textEmphasis && params.textEmphasis !== 'plain') descriptors.push(params.textEmphasis);

  const styleDescription = descriptors.length > 0 
    ? ` in ${descriptors.join(', ')} style`
    : '';

  return ` with text that says "${params.textContent}"${styleDescription} positioned at the ${params.textPosition || 'center'}`;
}

// Generate an Image
export async function generateImage(params: GenerateImageParams, onLog?: (entry: LogEntry) => void) {
  try {
    const size = imageSizeMap[params.imageSize as keyof typeof imageSizeMap] || '1024x1024';
    const recraftStyle = styleMap[params.style as keyof typeof styleMap] || 'realistic_image';

    // Construct the full prompt
    const fullPrompt = `${params.prompt}${constructTextPrompt(params)}`;
    const requestBody = {
      prompt: fullPrompt,
      style: recraftStyle,
      size: size,
      response_format: 'url',
      n: 1,
      model: 'recraftv3',
    };

    // Log request
    onLog?.({
      type: 'request',
      timestamp: new Date(),
      data: {
        url: `${RECRAFT_API_URL}/images/generations`,
        headers: {
          'Authorization': 'Bearer [REDACTED]',
          'Content-Type': 'application/json',
        },
        body: requestBody,
      },
    });

    // API Request
    const response = await axios.post(`${RECRAFT_API_URL}/images/generations`, requestBody, {
      headers: {
        'Authorization': `Bearer ${RECRAFT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data?.data?.[0]?.url) {
      throw new Error('No image URL received from API');
    }

    // Log response
    onLog?.({
      type: 'response',
      timestamp: new Date(),
      data: response.data,
    });

    return {
      id: Date.now().toString(),
      url: response.data.data[0].url,
      prompt: fullPrompt,
    };
  } catch (error) {
    handleError(error, onLog);
  }
}

export async function inpaintImage(
  imageBlob: Blob, 
  textContent: string, 
  textBounds: { left: number, top: number, width: number, height: number }
) {
  try {
    // Create the grayscale mask
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get canvas context');

    // Get image dimensions
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(imageBlob);
    });

    canvas.width = img.width;
    canvas.height = img.height;

    // Create pure black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add white rectangle for text
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(
      Math.round(textBounds.left),
      Math.round(textBounds.top),
      Math.round(textBounds.width),
      Math.round(textBounds.height)
    );

    // Convert to blob
    const maskBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create mask'));
      }, 'image/png');
    });

    // Create FormData exactly like Postman
    const formData = new FormData();
    formData.append('image', imageBlob);
    formData.append('mask', maskBlob);
    formData.append('prompt', textContent);
    formData.append('style', 'realistic_image');

    // Make the request
    const response = await axios.post(
      `${RECRAFT_API_URL}/images/inpaint`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${RECRAFT_API_KEY}`,
          // Let the browser set the correct Content-Type with boundary
          'Accept': 'application/json'
        }
      }
    );

    return response.data.data[0].url;
  } catch (error) {
    handleError(error);
  }
}

// Add this helper function right after the inpaintImage function
function createImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(blob);
  });
}

// Handle Errors
function handleError(error: unknown, onLog?: (entry: LogEntry) => void): never {
  const message = axios.isAxiosError(error)
    ? error.response?.data?.message || error.message
    : 'Unknown error occurred';

  console.error('Error:', error);

  if (onLog) {
    onLog({
      type: 'error',
      timestamp: new Date(),
      data: {
        error,
        message,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        data: axios.isAxiosError(error) ? error.response?.data : undefined,
      },
    });
  }

  toast.error(message);
  throw new Error(message);
}