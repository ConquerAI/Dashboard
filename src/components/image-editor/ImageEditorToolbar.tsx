import React from 'react';
import { 
  Pencil, 
  Type, 
  ImageIcon, 
  Crop, 
  RotateCcw, 
  Layers,
  Wand2
} from 'lucide-react';

export const ImageEditorToolbar = () => {
  return (
    <div className="border-b border-gray-100">
      <div className="flex items-center gap-4 p-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 text-purple-600">
          <Pencil className="w-5 h-5" />
          <span>Draw</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 text-purple-600">
          <Type className="w-5 h-5" />
          <span>Text</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 text-purple-600">
          <ImageIcon className="w-5 h-5" />
          <span>Images</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 text-purple-600">
          <Crop className="w-5 h-5" />
          <span>Crop</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 text-purple-600">
          <RotateCcw className="w-5 h-5" />
          <span>Transform</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 text-purple-600">
          <Layers className="w-5 h-5" />
          <span>Layers</span>
        </button>
        <div className="ml-auto">
          <button className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Wand2 className="w-5 h-5" />
            <span>AI Enhance</span>
          </button>
        </div>
      </div>
    </div>
  );
};