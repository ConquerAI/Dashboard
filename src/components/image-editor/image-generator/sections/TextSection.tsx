import React from 'react';
import { Type } from "lucide-react";
import { InputWithReset } from '../InputWithReset';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Label } from "../../../ui/label";
import { SectionWrapper } from './SectionWrapper';
import { Input } from "../../../ui/input";

interface TextSectionProps {
  formData: any;
  onChange: (name: string, value: string) => void;
  onReset: (name: string) => void;
}

const textStyles = [
  { value: 'bold', label: 'Bold' },
  { value: 'handwritten', label: 'Handwritten' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'modern', label: 'Modern' },
  { value: 'retro', label: 'Retro' },
  { value: 'neon', label: 'Neon' },
  { value: 'graffiti', label: 'Graffiti' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'comic', label: 'Comic' },
];

const textEffects = [
  { value: 'plain', label: 'Plain' },
  { value: 'outlined', label: 'Outlined' },
  { value: 'glowing', label: 'Glowing' },
  { value: 'shadowed', label: 'Shadowed' },
  { value: '3d', label: '3D' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'metallic', label: 'Metallic' },
  { value: 'sparkly', label: 'Sparkly' },
];

const textSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'extra-large', label: 'Extra Large' },
];

export function TextSection({ formData, onChange, onReset }: TextSectionProps) {
  return (
    <SectionWrapper
      icon={<Type className="w-5 h-5 text-white" />}
      title="Text Options"
      gradient="from-purple-500 to-pink-500"
    >
      <div className="space-y-5">
        {/* Text Content */}
        <div className="space-y-2">
          <Label>Text Content</Label>
          <InputWithReset
            name="textContent"
            value={formData.textContent}
            onChange={onChange}
            onReset={onReset}
            placeholder="Enter text to overlay..."
          />
        </div>

        {/* Text Position */}
        <div className="space-y-2">
          <Label>Text Position</Label>
          <Select value={formData.textPosition} onValueChange={(value) => onChange('textPosition', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Text Style */}
        <div className="space-y-2">
          <Label>Text Style</Label>
          <Select value={formData.textStyle} onValueChange={(value) => onChange('textStyle', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {textStyles.map(style => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Effect */}
        <div className="space-y-2">
          <Label>Text Effect</Label>
          <Select value={formData.textEmphasis} onValueChange={(value) => onChange('textEmphasis', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select effect" />
            </SelectTrigger>
            <SelectContent>
              {textEffects.map(effect => (
                <SelectItem key={effect.value} value={effect.value}>
                  {effect.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Size */}
        <div className="space-y-2">
          <Label>Text Size</Label>
          <Select value={formData.textSize} onValueChange={(value) => onChange('textSize', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {textSizes.map(size => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label>Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.textColor || '#000000'}
              onChange={(e) => onChange('textColor', e.target.value)}
              className="h-10 w-20"
            />
            <Input
              type="text"
              value={formData.textColor || '#000000'}
              onChange={(e) => onChange('textColor', e.target.value)}
              className="flex-1"
              placeholder="Enter color hex code"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}