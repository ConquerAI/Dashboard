import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PostStyle, StyleStrength } from '../../types';
import { cn } from '../../utils/cn';
import { PostStyleSelector } from './PostStyleSelector';

interface CustomContentInputProps {
  onBack: () => void;
  onSubmit: (content: string) => void;
  isGenerating: boolean;
  selectedStyles: StyleStrength[];
  onStyleSelect: (style: StyleStrength) => void;
  onStyleRemove: (style: PostStyle) => void;
  generateImage: boolean;
  onGenerateImageChange: (enabled: boolean) => void;
}

export function CustomContentInput({
  onBack,
  onSubmit,
  isGenerating,
  selectedStyles,
  onStyleSelect,
  onStyleRemove,
  generateImage,
  onGenerateImageChange
}: CustomContentInputProps) {
  const [content, setContent] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Custom Content
            </h2>
            <div className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your custom content here..."
                className="w-full min-h-[200px] p-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-y"
                disabled={isGenerating}
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {content.length} characters
                </span>
                <span>
                  {content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Post Style
            </h2>
            <PostStyleSelector
              selectedStyles={selectedStyles}
              onStyleSelect={onStyleSelect}
              onStyleRemove={onStyleRemove}
              onBack={onBack}
              onGenerate={() => onSubmit(content)}
              isGenerating={isGenerating}
              isCompact={true}
              selectedArticles={[]}
              customContent={content}
              generateImage={generateImage}
              onGenerateImageChange={onGenerateImageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}