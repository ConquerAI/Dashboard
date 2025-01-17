export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
  style: string;
  platform: string;
}

export interface LogEntry {
  type: 'request' | 'response' | 'error';
  timestamp: Date;
  data: any;
}

export interface ImageEditorState {
  currentTool: 'draw' | 'text' | 'image' | 'crop' | 'transform' | 'layers';
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
}

export interface FabricEditorProps {
  imageUrl: string;
  onClose: () => void;
  onSave?: (dataUrl: string) => void;
}

type ShapeType = 'rectangle' | 'circle' | 'line';
type TextAlignment = 'left' | 'center' | 'right';
type TextStyle = 'bold' | 'italic' | TextAlignment;