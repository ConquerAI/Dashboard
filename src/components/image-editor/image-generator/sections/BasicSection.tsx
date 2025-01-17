import React from 'react';
import { ImageIcon, Wand2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { InputWithReset } from '../InputWithReset';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Label } from "../../../ui/label";
import { SectionWrapper } from './SectionWrapper';

interface BasicSectionProps {
  formData: any;
  onChange: (name: string, value: string) => void;
  onReset: (name: string) => void;
}

export function BasicSection({ formData, onChange, onReset }: BasicSectionProps) {
  return (
    <SectionWrapper
      icon={<ImageIcon className="w-5 h-5 text-white" />}
      title="Basic Settings"
      gradient="from-blue-500 to-indigo-500"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Image Description/Prompt</Label>
          <div className="flex gap-3">
            <InputWithReset
              name="prompt"
              value={formData.prompt}
              onChange={onChange}
              onReset={onReset}
              placeholder="Describe the image you want to generate..."
            />
            <Button 
              type="button"
              onClick={() => console.log('AI Autofill clicked')}
              className="whitespace-nowrap bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={!formData.prompt}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              AI Autofill
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Platform Size</Label>
            <Select value={formData.imageSize} onValueChange={(value) => onChange('imageSize', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram-square">Instagram Post (1:1)</SelectItem>
                <SelectItem value="instagram-story">Instagram Story (9:16)</SelectItem>
                <SelectItem value="facebook-post">Facebook Post (1.91:1)</SelectItem>
                <SelectItem value="twitter-post">Twitter Post (16:9)</SelectItem>
                <SelectItem value="linkedin-post">LinkedIn Post (1.91:1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={formData.format} onValueChange={(value) => onChange('format', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}