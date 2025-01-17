import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { ImageIcon } from "lucide-react";
import { StyleSection } from './sections/StyleSection';
import { TextSection } from './sections/TextSection';
import { BasicSection } from './sections/BasicSection';
import { generateImage } from '../../../services/recraft';
import { saveGeneratedImage } from '../../../services/image-storage';
import { toast } from 'react-hot-toast';
import { Label } from "../../../ui/label";
import { Button } from "../../../ui/button";
import { LogEntry } from '../../../types/image-editor';

interface ImageGeneratorFormProps {
  onImageGenerated: (image: GeneratedImage) => void;
  onLog?: (entry: LogEntry) => void;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
  style: string;
  platform: string;
}

const initialFormState = {
  prompt: '',
  textContent: '',
  textPosition: 'center',
  textStyle: '',
  textColor: '#000000',
  textSize: 'medium',
  textEmphasis: 'plain',
  imageSize: 'instagram-square',
  style: 'natural',
  colorScheme: '',
  mood: 'neutral',
  backgroundColor: '#ffffff',
  format: 'png'
};

export function ImageGeneratorForm({ onImageGenerated, onLog }: ImageGeneratorFormProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt) {
      toast.error('Please provide an image description');
      return;
    }

    setIsGenerating(true);
    // Log the initial request
    onLog?.({
      type: 'request',
      timestamp: new Date(),
      data: {
        formData,
        timestamp: new Date().toISOString(),
        requestType: 'image_generation'
      }
    });

    try {
      const result = await generateImage(formData, onLog);
      
      // Save the generated image to Airtable
      await saveGeneratedImage({
        url: result.url,
        prompt: result.prompt,
        style: formData.style,
        platform: formData.imageSize
      });
      
      // Log successful generation
      onLog?.({
        type: 'response',
        timestamp: new Date(),
        data: {
          result,
          timestamp: new Date().toISOString(),
          status: 'success'
        }
      });
      
      const generatedImage: GeneratedImage = {
        id: result.id,
        url: result.url,
        prompt: result.prompt,
        createdAt: new Date(),
        style: formData.style,
        platform: formData.imageSize
      };
      
      onImageGenerated(generatedImage);
    } catch (error) {
      onLog?.({
        type: 'error',
        timestamp: new Date(),
        requestType: 'image_generation',
        data: error
      });
      toast.error(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFieldReset = (fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: initialFormState[fieldName as keyof typeof initialFormState]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Image Generator
                </h2>
                <p className="text-sm text-gray-500 mt-1">Create stunning visuals with AI</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <BasicSection 
                formData={formData}
                onChange={handleChange}
                onReset={handleFieldReset}
              />

              <TextSection 
                formData={formData}
                onChange={handleChange}
                onReset={handleFieldReset}
              />

              <StyleSection 
                formData={formData}
                onChange={handleChange}
                onReset={handleFieldReset}
              />

              <button 
                type="submit" 
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  'Generate Image'
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}