import React from 'react';
import { Palette } from "lucide-react";
import { InputWithReset } from '../InputWithReset';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Label } from "../../../ui/label";
import { SectionWrapper } from './SectionWrapper';

interface StyleSectionProps {
  formData: any;
  onChange: (name: string, value: string) => void;
  onReset: (name: string) => void;
}

export function StyleSection({ formData, onChange, onReset }: StyleSectionProps) {
  return (
    <SectionWrapper
      icon={<Palette className="w-5 h-5 text-white" />}
      title="Style Options"
      gradient="from-emerald-500 to-teal-500"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Art Style</Label>
          <Select value={formData.style} onValueChange={(value) => onChange('style', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="natural">Natural</SelectItem>
              <SelectItem value="cartoon">Cartoon</SelectItem>
              <SelectItem value="watercolor">Watercolor</SelectItem>
              <SelectItem value="oil-painting">Oil Painting</SelectItem>
              <SelectItem value="digital-art">Digital Art</SelectItem>
              <SelectItem value="sketch">Sketch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Image Mood</Label>
          <Select value={formData.mood} onValueChange={(value) => onChange('mood', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cheerful">Cheerful</SelectItem>
              <SelectItem value="dramatic">Dramatic</SelectItem>
              <SelectItem value="peaceful">Peaceful</SelectItem>
              <SelectItem value="mysterious">Mysterious</SelectItem>
              <SelectItem value="energetic">Energetic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <InputWithReset
            name="colorScheme"
            value={formData.colorScheme}
            onChange={onChange}
            onReset={onReset}
            placeholder="e.g., warm, cool, monochrome..."
          />
        </div>

        <div className="space-y-2">
          <Label>Background Color</Label>
          <InputWithReset
            name="backgroundColor"
            type="color"
            value={formData.backgroundColor}
            onChange={onChange}
            onReset={onReset}
            className="h-10"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}