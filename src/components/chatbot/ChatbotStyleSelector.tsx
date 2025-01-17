import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PostStyle, StyleStrength, SocialPlatform } from '../../types';
import { cn } from '../../utils/cn';
import { ArrowLeft, Zap, Stethoscope, Heart, Crown, Users, Bell, 
         Sparkles, Wand2, X, Image as ImageIcon, Facebook, Twitter, 
         Linkedin, Globe, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface ChatbotStyleSelectorProps {
  onBack: () => void;
  content: string;
}

interface ArticleMatch {
  title: string;
  url: string;
  description?: string;
}

const styles = [
  {
    id: 'tech-enthusiast' as PostStyle,
    title: 'Tech Enthusiast',
    description: 'Exciting, innovative content focusing on technological advancement',
    voice: ['Excited', 'Innovative', 'Forward-looking'],
    bestFor: ['AI News', 'Healthcare Tech'],
    icon: Zap,
    bgClass: 'from-blue-500/20 to-cyan-500/20',
    hoverClass: 'hover:from-blue-500/30 hover:to-cyan-500/30',
    selectedClass: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'healthcare-professional' as PostStyle,
    title: 'Healthcare Professional',
    description: 'Authoritative, evidence-based healthcare insights',
    voice: ['Evidence-based', 'Authoritative', 'Clinical'],
    bestFor: ['NHS News', 'Clinical Updates'],
    icon: Stethoscope,
    bgClass: 'from-emerald-500/20 to-green-500/20',
    hoverClass: 'hover:from-emerald-500/30 hover:to-green-500/30',
    selectedClass: 'from-emerald-600 to-green-600'
  },
  {
    id: 'warm-personal' as PostStyle,
    title: 'Warm & Personal',
    description: 'Empathetic, story-driven care perspectives',
    voice: ['Empathetic', 'Caring', 'Human-centered'],
    bestFor: ['Patient Stories', 'Care Services'],
    icon: Heart,
    bgClass: 'from-rose-500/20 to-pink-500/20',
    hoverClass: 'hover:from-rose-500/30 hover:to-pink-500/30',
    selectedClass: 'from-rose-600 to-pink-600'
  },
  {
    id: 'industry-leader' as PostStyle,
    title: 'Industry Leader',
    description: 'Professional thought leadership content',
    voice: ['Authoritative', 'Strategic', 'Visionary'],
    bestFor: ['Company Updates', 'Industry Trends'],
    icon: Crown,
    bgClass: 'from-purple-500/20 to-indigo-500/20',
    hoverClass: 'hover:from-purple-500/30 hover:to-indigo-500/30',
    selectedClass: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'community-voice' as PostStyle,
    title: 'Community Voice',
    description: 'Friendly, community-focused updates',
    voice: ['Local', 'Accessible', 'Inclusive'],
    bestFor: ['Local Healthcare', 'Community Events'],
    icon: Users,
    bgClass: 'from-amber-500/20 to-yellow-500/20',
    hoverClass: 'hover:from-amber-500/30 hover:to-yellow-500/30',
    selectedClass: 'from-amber-600 to-yellow-600'
  },
  {
    id: 'quick-update' as PostStyle,
    title: 'Quick Update',
    description: 'Concise, time-sensitive announcements',
    voice: ['Clear', 'Concise', 'Action-oriented'],
    bestFor: ['Urgent Updates', 'Brief Announcements'],
    icon: Bell,
    bgClass: 'from-red-500/20 to-orange-500/20',
    hoverClass: 'hover:from-red-500/30 hover:to-orange-500/30',
    selectedClass: 'from-red-600 to-orange-600'
  }
];

const platforms: { id: SocialPlatform; icon: typeof Facebook; label: string; color: string }[] = [
  { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'twitter', icon: Twitter, label: 'X (Twitter)', color: 'bg-black hover:bg-gray-900' },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
  { id: 'blog', icon: Globe, label: 'Blog Post', color: 'bg-emerald-600 hover:bg-emerald-700' }
];

export function ChatbotStyleSelector({ onBack, content }: ChatbotStyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [generateImage, setGenerateImage] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const extractArticles = (content: string): ArticleMatch[] => {
    const articles: ArticleMatch[] = [];
    const regex = /'([^']+)'\s*\(([^)]+)\)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      articles.push({ url: match[2] });
    }

    return articles;
  };

  const handleGenerate = async () => {
    if (!selectedStyle || !selectedPlatform) return;

    setIsGenerating(true);
    try {
      const articles = extractArticles(content);
      const urls = articles.map(article => article.url);
      
      const webhookData = {
        urls,
        style: selectedStyle,
        platform: selectedPlatform,
        generateImage,
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(
        'https://hook.eu2.make.com/0psbndqlldqfmn24rlh08mttflizh1zg',
        webhookData
      );

      if (response.status !== 200) {
        throw new Error('Failed to send data to webhook');
      }

      toast.success('Post generated successfully!');
      onBack();
    } catch (error) {
      console.error('Failed to generate post:', error);
      toast.error('Failed to generate post');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chat
        </button>
        
        <button
          onClick={() => setGenerateImage(!generateImage)}
          className={cn(
            'inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200',
            'text-sm font-medium',
            generateImage ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
          )}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Generate Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;
          
          return (
            <motion.button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={cn(
                "relative rounded-xl h-52 text-left transition-all duration-300 group",
                "bg-gradient-to-br shadow-sm overflow-hidden",
                isSelected
                  ? cn("bg-gradient-to-br shadow-lg", style.selectedClass)
                  : cn(style.bgClass)
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={cn(
                "absolute inset-0 p-6",
                "flex flex-col items-center justify-center gap-4",
                "transition-opacity duration-200",
                "group-hover:opacity-0"
              )}>
                <Icon className={cn(
                  "w-10 h-10",
                  isSelected ? "text-white" : "text-gray-900"
                )} />
                <h3 className={cn(
                  "text-lg font-semibold text-center",
                  isSelected ? "text-white" : "text-gray-900"
                )}>
                  {style.title}
                </h3>
              </div>

              <div className={cn(
                "absolute inset-0 p-6 bg-white/95",
                "transition-all duration-200 text-center",
                "opacity-0 group-hover:opacity-100",
                "flex flex-col items-center justify-center"
              )}>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {style.title}
                  </h3>
                  <p className="text-sm text-gray-600 max-w-[80%] mx-auto">
                    {style.description}
                  </p>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-4">
                    VOICE
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {style.voice.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedStyle && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatform === platform.id;
              
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={cn(
                    "relative p-4 rounded-xl transition-all duration-300",
                    "text-white flex items-center justify-center gap-3",
                    platform.color,
                    isSelected && "ring-2 ring-offset-2 ring-blue-500 scale-105"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{platform.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedPlatform}
              className={cn(
                "inline-flex items-center px-6 py-3 text-base font-medium rounded-lg",
                "bg-gradient-to-r from-purple-500 to-purple-600",
                "hover:from-purple-600 hover:to-purple-700",
                "text-white shadow-lg",
                "transition-all duration-200 transform hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                !selectedPlatform && "opacity-50 cursor-not-allowed"
              )}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Post'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}