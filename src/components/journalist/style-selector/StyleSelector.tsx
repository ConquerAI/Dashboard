import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PostStyle, Article, StyleStrength, SocialPlatform } from '../../../types';
import { cn } from '../../../utils/cn';
import { 
  ArrowLeft, 
  Brain,
  Stethoscope, 
  Heart, 
  Crown, 
  Users, 
  Bell, 
  Sparkles, 
  Wand2, 
  X, 
  Image as ImageIcon, 
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  Loader2
} from 'lucide-react';
import { AIRTABLE_CONFIG } from '../../../config/airtable';
import { toast } from 'react-hot-toast';
import { findRelatedArticles } from '../article-relationships/ArticleRelationships';

interface StyleSelectorProps {
  selectedArticles: Article[];
  onBack: () => void;
  allArticles: Article[];
}

const styles = [
  {
    id: 'tech-enthusiast' as PostStyle,
    title: 'Tech Enthusiast',
    description: 'Exciting, innovative content focusing on technological advancement',
    voice: ['Excited', 'Innovative', 'Forward-looking'],
    bestFor: ['AI News', 'Healthcare Tech'],
    icon: Brain,
    bgClass: 'from-blue-500/20 to-cyan-500/20',
    hoverClass: 'hover:from-blue-500/30 hover:to-cyan-500/30',
    selectedClass: 'from-blue-600 to-cyan-600',
    shimmerClass: 'before:from-blue-500/0 before:via-blue-500/25 before:to-blue-500/0'
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
    selectedClass: 'from-emerald-600 to-green-600',
    shimmerClass: 'before:from-emerald-500/0 before:via-emerald-500/25 before:to-emerald-500/0'
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
    selectedClass: 'from-rose-600 to-pink-600',
    shimmerClass: 'before:from-rose-500/0 before:via-rose-500/25 before:to-rose-500/0'
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
    selectedClass: 'from-purple-600 to-indigo-600',
    shimmerClass: 'before:from-purple-500/0 before:via-purple-500/25 before:to-purple-500/0'
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
    selectedClass: 'from-amber-600 to-yellow-600',
    shimmerClass: 'before:from-amber-500/0 before:via-amber-500/25 before:to-amber-500/0'
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
    selectedClass: 'from-red-600 to-orange-600',
    shimmerClass: 'before:from-red-500/0 before:via-red-500/25 before:to-red-500/0'
  }
];

const platforms: { id: SocialPlatform; icon: typeof Facebook; label: string; color: string }[] = [
  { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'twitter', icon: Twitter, label: 'X (Twitter)', color: 'bg-black hover:bg-gray-900' },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
  { id: 'blog', icon: Globe, label: 'Blog Post', color: 'bg-emerald-600 hover:bg-emerald-700' }
];

export function StyleSelector({ selectedArticles, onBack, allArticles }: StyleSelectorProps) {
  const [selectedStyles, setSelectedStyles] = useState<StyleStrength[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [generateImage, setGenerateImage] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [styleMode, setStyleMode] = useState<'single' | 'multi'>('single');
  const [activePosition, setActivePosition] = useState<'start' | 'middle' | 'end' | 'full'>('full');

  const handleStyleSelect = (styleId: string) => {
    if (styleMode === 'single') {
      setSelectedStyles([{ style: styleId as PostStyle, strength: 1, position: 'full' }]);
    } else {
      setSelectedStyles(prev => {
        const filtered = prev.filter(s => s.position !== activePosition);
        return [...filtered, { style: styleId as PostStyle, strength: 1, position: activePosition }];
      });
    }
  };

  const handleGenerate = async () => {
    if (!selectedStyles.length || !selectedPlatform) return;

    setIsGenerating(true);
    try {
      // Get related articles for the selected article
      const relatedArticles = findRelatedArticles(selectedArticles[0], allArticles)
        .map(related => related.article);

      // Combine selected and related articles
      const allSelectedArticles = [
        ...selectedArticles,
        ...relatedArticles
      ];

      // Prepare webhook data
      const webhookData = {
        selectedArticles: allSelectedArticles.map(article => ({
          id: article.id,
          category: article.category,
          title: article.title,
          content: article.content,
          url: article.url,
          subcategory1: article.subcategory1,
          subcategory2: article.subcategory2,
          subcategory3: article.subcategory3,
          score: article.score
        })),
        styles: styleMode === 'multi' 
          ? selectedStyles.map(s => `${s.position}-${s.style}`).join(', ')
          : selectedStyles[0].style,
        generateImage,
        platform: selectedPlatform,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(AIRTABLE_CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`);
      }

      toast.success('Content generation started!');
      onBack();
    } catch (error) {
      console.error('Failed to generate content:', error);
      toast.error('Failed to generate content');
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
          Back to Articles
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

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setStyleMode('single');
              setSelectedStyles([]);
              setActivePosition('full');
            }}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
              'text-sm font-medium',
              styleMode === 'single'
                ? 'bg-violet-100 text-violet-700'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            <Wand2 className="w-4 h-4" />
            Single Style
          </button>
          <button
            onClick={() => {
              setStyleMode('multi');
              setSelectedStyles([]);
            }}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
              'text-sm font-medium',
              styleMode === 'multi'
                ? 'bg-violet-100 text-violet-700'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            <Sparkles className="w-4 h-4" />
            Multi-Part Style
          </button>
        </div>
      </div>

      {styleMode === 'multi' && (
        <div className="flex items-center gap-2">
          {(['start', 'middle', 'end'] as const).map((position) => (
            <button
              key={position}
              onClick={() => setActivePosition(position)}
              className={cn(
                'px-4 py-2 rounded-lg transition-all duration-200',
                'text-sm font-medium',
                activePosition === position
                  ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-500 ring-offset-2'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                selectedStyles.some(s => s.position === position) && 
                  'border-2 border-green-500'
              )}
            >
              {position.charAt(0).toUpperCase() + position.slice(1)}
              {selectedStyles.some(s => s.position === position) && (
                <span className="ml-2 text-green-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyles.some(s => 
            s.style === style.id && 
            (styleMode === 'single' ? s.position === 'full' : s.position === activePosition)
          );
          
          return (
            <motion.button
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              className={cn(
                "relative rounded-xl transition-all duration-300 cursor-pointer",
                "bg-gradient-to-br shadow-sm overflow-hidden",
                "before:absolute before:inset-0 before:w-[200%] before:h-full",
                "before:bg-gradient-to-r before:animate-[shimmer_2s_infinite]",
                "before:transition-opacity before:duration-300 before:opacity-0",
                "hover:before:opacity-100",
                style.shimmerClass,
                isSelected
                  ? cn("bg-gradient-to-br shadow-lg", style.selectedClass)
                  : cn(style.bgClass, style.hoverClass)
              )}
            >
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "transform transition-all duration-300",
                      isSelected ? "text-white" : "text-gray-900"
                    )}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className={cn(
                      "text-lg font-semibold tracking-wide",
                      isSelected ? "text-white" : "text-gray-900"
                    )}>
                      {style.title}
                    </h3>
                  </div>
                  
                  {isSelected && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStyles(prev => 
                          prev.filter(s => s.style !== style.id || s.position !== activePosition)
                        );
                      }}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <p className={cn(
                  "text-sm mb-4",
                  isSelected ? "text-white/90" : "text-gray-600"
                )}>
                  {style.description}
                </p>

                <div className="space-y-2">
                  <div>
                    <p className={cn(
                      "text-xs uppercase tracking-wider font-semibold mb-1",
                      isSelected ? "text-white/70" : "text-gray-500"
                    )}>
                      Voice
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {style.voice.map((trait) => (
                        <span
                          key={trait}
                          className={cn(
                            "px-2 py-0.5 text-xs rounded-full font-medium",
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-black/5 text-gray-700"
                          )}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedStyles.length > 0 && (
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
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Post
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}