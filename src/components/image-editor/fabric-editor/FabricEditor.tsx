import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '../../ui/button';
import {
  X, Type, Pencil, Download, RotateCcw, Bold, Italic, 
  AlignLeft, AlignCenter, AlignRight, Circle, Square, Minus, Palette,
  Layers, Wand2
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Slider } from '../../ui/slider';
import { toast } from 'react-hot-toast';
import { inpaintImage } from '../../../services/recraft';
import { RECRAFT_API_URL, RECRAFT_API_KEY } from '../../../services/recraft.ts';
import axios from 'axios';
import { saveGeneratedImage } from '../../../services/image-storage';

// Constants for font options
const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];
const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana'
];

interface FabricEditorProps {
  imageUrl: string;
  imageId?: string;  // Add this to track which image we're editing
  prompt?: string;   // Add this to keep the original prompt
  style?: string;    // Add this to keep the original style
  platform?: string; // Add this to keep the original platform
  onClose: () => void;
  onSave?: (dataUrl: string) => void;
}

export function FabricEditor({ imageUrl, onClose, onSave }: FabricEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load the image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  // Initialize canvas
  useEffect(() => {
    if (!imageLoaded || !imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const containerWidth = window.innerWidth * 0.7;
    const containerHeight = window.innerHeight * 0.6;

    const scale = Math.min(
      containerWidth / img.width,
      containerHeight / img.height
    );

    const scaledWidth = Math.floor(img.width * scale);
    const scaledHeight = Math.floor(img.height * scale);

    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: scaledWidth,
      height: scaledHeight,
      backgroundColor: '#f3f4f6',
      preserveObjectStacking: true
    });

    const fabricImage = new fabric.Image(img, {
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false
    });

    fabricRef.current.setBackgroundImage(
      fabricImage,
      fabricRef.current.renderAll.bind(fabricRef.current)
    );

    saveToHistory();

    fabricRef.current.on('object:modified', saveToHistory);
    fabricRef.current.on('object:added', saveToHistory);
    fabricRef.current.on('object:removed', saveToHistory);

    return () => {
      if (fabricRef.current) {
        fabricRef.current.off('object:modified', saveToHistory);
        fabricRef.current.off('object:added', saveToHistory);
        fabricRef.current.off('object:removed', saveToHistory);
        fabricRef.current.dispose();
      }
    };
  }, [imageLoaded]);

  // Existing handlers remain the same...
  const handleAddText = () => {
    // ... your existing handleAddText code ...
  };

  const handleAddShape = (shape: 'rectangle' | 'circle' | 'line') => {
    // ... your existing handleAddShape code ...
  };

  const toggleDrawingMode = () => {
    // ... your existing toggleDrawingMode code ...
  };

  const updateTextStyle = (style: 'bold' | 'italic' | 'left' | 'center' | 'right') => {
    // ... your existing updateTextStyle code ...
  };

  const handleSave = () => {
    // ... your existing handleSave code ...
  };

  const saveToHistory = () => {
    // ... your existing saveToHistory code ...
  };

  const handleUndo = () => {
    // ... your existing handleUndo code ...
  };

  const handleBlendText = async () => {
    // ... your existing handleBlendText code ...
  };

  // New upscale handler
  const handleUpscale = async () => {
  if (!fabricRef.current) return;

  try {
    toast.loading('Enhancing image...', { id: 'upscale' });

    // Get current canvas state
    const imageDataUrl = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1
    });

    // Convert to blob
    const imageResponse = await fetch(imageDataUrl);
    const imageBlob = await imageResponse.blob();

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

    const enhancedImageUrl = response.data.image.url;

    // Save the enhanced image URL to Airtable
    await saveGeneratedImage({
      url: enhancedImageUrl,
      prompt: props.prompt || 'Enhanced image',
      style: props.style || 'natural',
      platform: props.platform || 'instagram-square'
    });

    // Update canvas with enhanced image
    fabric.Image.fromURL(enhancedImageUrl, (img) => {
      if (!fabricRef.current) return;
      fabricRef.current.setBackgroundImage(img, fabricRef.current.renderAll.bind(fabricRef.current));
      toast.success('Image enhanced and saved!', { id: 'upscale' });
    }, { crossOrigin: 'anonymous' });

  } catch (error) {
    console.error('Error upscaling image:', error);
    toast.error('Failed to enhance image', { id: 'upscale' });
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Edit Image
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap gap-2">
            {/* ... other toolbar buttons ... */}

            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50"
                onClick={handleUndo}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Undo
              </Button>

              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50"
                onClick={handleBlendText}
              >
                <Layers className="w-4 h-4 mr-2" />
                Blend Text
              </Button>

              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50"
                onClick={handleUpscale}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Fix Faces
              </Button>

              <Button
                variant="default"
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                onClick={handleSave}
              >
                <Download className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Canvas Container */}
          <div className={cn(
            "relative rounded-lg border border-gray-200 overflow-hidden",
            "flex items-center justify-center bg-gray-50 min-h-[500px]"
          )}>
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading image...</p>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <canvas ref={canvasRef} className="max-w-full max-h-[70vh] shadow-lg" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}