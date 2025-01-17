import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImageGeneratorForm } from './image-generator/ImageGeneratorForm';
import { ApiLogWindow } from './ApiLogWindow';
import { Search, Filter, Upload, Wand2, Edit2, Sparkles, Star, Clock, Grid, Loader2, ImageIcon } from 'lucide-react';
import { GeneratedImage, LogEntry } from '../../types/image-editor';
import { toast } from 'react-hot-toast';
import { FabricEditor } from './fabric-editor/FabricEditor';
import { fetchStoredImages } from '../../services/image-storage';
import { useEffect } from 'react';

export function ImageEditor() {
  const [mainView, setMainView] = useState('browse');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(true);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const fetchedImages = await fetchStoredImages();
      setImages(fetchedImages);
    } catch (error) {
      console.error('Failed to load images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLog = (entry: LogEntry) => {
    setLogs(prev => [...prev, entry]);
  };

  const handleImageGenerated = (newImage: GeneratedImage) => {
    setImages(prev => [newImage, ...prev]);
    setMainView('browse');
    toast.success('Image generated successfully!');
  };
  
  if (mainView === 'create') {
    return (
      <>
        <ImageGeneratorForm 
          onImageGenerated={handleImageGenerated}
          onLog={handleLog}
        />
        <ApiLogWindow 
          logs={logs}
          isOpen={isLogOpen}
          onClose={() => setIsLogOpen(false)}
          onToggle={() => setIsLogOpen(!isLogOpen)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative overflow-hidden bg-white border-b border-gray-200">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:16px_16px] animate-[flow_20s_linear_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-violet-600/10" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Images
              </h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200">
                  <Wand2 className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium text-gray-700">AI Generation</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200">
                  <Edit2 className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Smart Editing</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">Auto Enhancement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              {/* Top Action Bar */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                  <Button 
                    variant={mainView === 'browse' ? 'default' : 'ghost'}
                    onClick={() => setMainView('browse')}
                    className="font-medium gap-2"
                  >
                    <Grid className="w-4 h-4" />
                    Browse Images
                  </Button>
                  <Button 
                    variant={mainView === 'recent' ? 'default' : 'ghost'}
                    onClick={() => setMainView('recent')}
                    className="font-medium gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Recent
                  </Button>
                  <Button 
                    variant={mainView === 'favorites' ? 'default' : 'ghost'}
                    onClick={() => setMainView('favorites')}
                    className="font-medium gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Favorites
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      type="search"
                      placeholder="Find an image" 
                      className="w-[300px] bg-white pl-10 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>
                  <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50 gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setMainView('upload')}
                    className="bg-white border-gray-200 hover:bg-gray-50 gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200 gap-2"
                    onClick={() => setMainView('create')}
                  >
                    <Wand2 className="w-4 h-4" />
                    Create with AI
                  </Button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <Tabs defaultValue="all" className="w-full mb-8">
                <TabsList className="bg-gray-50/50 p-1 rounded-lg border border-gray-200">
                  <TabsTrigger value="all" className="rounded-md">All Images</TabsTrigger>
                  <TabsTrigger value="ai-generated" className="rounded-md">AI Generated</TabsTrigger>
                  <TabsTrigger value="uploaded" className="rounded-md">Uploaded</TabsTrigger>
                  <TabsTrigger value="edited" className="rounded-md">Edited</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Image Grid */}
              <div className="grid grid-cols-3 gap-8">
                {isLoading ? (
                  <div className="col-span-3 flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                      <p className="text-gray-500">Loading images...</p>
                    </div>
                  </div>
                ) : images.length === 0 ? (
                  <div className="col-span-3 text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-violet-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">No images yet</h3>
                        <p className="text-gray-500 mt-1">Start by creating an image with AI</p>
                      </div>
                      <Button
                        onClick={() => setMainView('create')}
                        className="mt-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Create with AI
                      </Button>
                    </div>
                  </div>
                ) : (
                  images.map((image) => (
                    <Card
                      key={image.id}
                      className="group relative bg-white overflow-hidden rounded-lg border border-gray-200 hover:border-violet-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 bg-gradient-to-t from-gray-50/80 backdrop-blur-sm relative">
                        <button
                          onClick={() => setSelectedImageForEdit(image)}
                          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                        >
                          <Edit2 className="w-4 h-4 text-gray-700" />
                        </button>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                            {image.style}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(image.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 line-clamp-2">{image.prompt}</h3>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {selectedImageForEdit && (
                <FabricEditor
                  imageUrl={selectedImageForEdit.url}
                  onClose={() => {
                    setSelectedImageForEdit(null);
                    // Refresh images after closing editor
                    loadImages();
                  }}
                  onSave={(dataUrl) => {
                    // Handle saving the edited image
                    console.log('Saving edited image:', dataUrl);
                    setSelectedImageForEdit(null);
                    // Refresh images after saving
                    loadImages();
                    toast.success('Image edited successfully!');
                  }}
                />
              )}

              {/* Floating Action Buttons */}
              <div className="fixed bottom-6 right-6 flex gap-2">
                <Button 
                  variant="outline"
                  className="bg-white border-gray-200 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200 gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Quick Edit
                </Button>
                <Button 
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200 gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Enhance with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <ApiLogWindow 
          logs={logs}
          isOpen={isLogOpen}
          onClose={() => setIsLogOpen(false)}
          onToggle={() => setIsLogOpen(!isLogOpen)}
        />
      </div>
    </div>
  );
}