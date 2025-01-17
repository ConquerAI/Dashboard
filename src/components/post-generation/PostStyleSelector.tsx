import React from 'react';
import { 
  ArrowLeft, 
  Zap, 
  Stethoscope, 
  Heart, 
  Crown, 
  Users, 
  Bell,
  Sparkles,
  Wand2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { PostStyle, Article, StyleStrength } from '../../types';
import { cn } from '../../utils/cn';
import { StyleStrengthSlider } from './StyleStrengthSlider';
import { CombinedStyleBar } from './CombinedStyleBar';

interface PostStyleSelectorProps {
  selectedStyles: StyleStrength[];
  onStyleSelect: (style: StyleStrength) => void;
  onStyleRemove: (style: PostStyle) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isCompact?: boolean;
  selectedArticles: Article[];
  customContent?: string;
  generateImage: boolean;
  onGenerateImageChange: (enabled: boolean) => void;
}

const styles = [
  {
    id: 'tech-enthusiast' as PostStyle,
    title: 'Tech Enthusiast',
    description: 'Exciting, innovative content focusing on technological advancement',
    voice: ['Excited', 'Innovative', 'Forward-looking'],
    bestFor: ['AI News', 'Healthcare Tech'],
    icon: <Zap className="w-8 h-8" />,
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
    icon: <Stethoscope className="w-8 h-8" />,
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
    bestFor: ['Domiciliary Care News', 'Patient Stories'],
    icon: <Heart className="w-8 h-8" />,
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
    bestFor: ['Company Achievements', 'Industry Trends'],
    icon: <Crown className="w-8 h-8" />,
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
    bestFor: ['Local Healthcare News', 'Community Events'],
    icon: <Users className="w-8 h-8" />,
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
    icon: <Bell className="w-8 h-8" />,
    bgClass: 'from-red-500/20 to-orange-500/20',
    hoverClass: 'hover:from-red-500/30 hover:to-orange-500/30',
    selectedClass: 'from-red-600 to-orange-600',
    shimmerClass: 'before:from-red-500/0 before:via-red-500/25 before:to-red-500/0'
  }
];

export function PostStyleSelector({
  selectedStyles,
  onStyleSelect,
  onStyleRemove,
  onBack,
  onGenerate,
  isGenerating,
  isCompact = false,
  selectedArticles,
  customContent,
  generateImage,
  onGenerateImageChange
}: PostStyleSelectorProps) {
  const handleStyleStrengthChange = (styleId: PostStyle, strength: number) => {
    onStyleSelect({ style: styleId, strength });
  };

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
        
        <button
          onClick={() => onGenerateImageChange(!generateImage)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles.map((style) => {
          const isSelected = selectedStyles.some(s => s.style === style.id);
          const selectedStyle = selectedStyles.find(s => s.style === style.id);

          return (
            <div
              key={style.id}
              onClick={() => !isSelected && onStyleSelect({ style: style.id, strength: 1 })}
              className={cn(
                'relative rounded-xl transition-all duration-300 cursor-pointer',
                'bg-gradient-to-br shadow-sm overflow-hidden',
                'before:absolute before:inset-0 before:w-[200%] before:h-full',
                'before:bg-gradient-to-r before:animate-[shimmer_2s_infinite]',
                'before:transition-opacity before:duration-300 before:opacity-0',
                'hover:before:opacity-100',
                style.shimmerClass,
                isSelected
                  ? cn('bg-gradient-to-br shadow-lg', style.selectedClass)
                  : cn(style.bgClass, style.hoverClass)
              )}
            >
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'transform transition-all duration-300',
                      isSelected ? 'text-white' : 'text-gray-900'
                    )}>
                      {style.icon}
                    </div>
                    <h3 className={cn(
                      'text-lg font-semibold tracking-wide',
                      isSelected ? 'text-white' : 'text-gray-900'
                    )}>
                      {style.title}
                    </h3>
                  </div>
                  
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStyleRemove(style.id);
                      }}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>

                {isSelected && (
                  <div className="mb-4">
                    <StyleStrengthSlider
                      value={selectedStyle?.strength ?? 1}
                      onChange={(value) => handleStyleStrengthChange(style.id, value)}
                      isSelected={true}
                    />
                  </div>
                )}

                <p className={cn(
                  "text-sm mb-4",
                  isSelected ? 'text-white/90' : 'text-gray-600'
                )}>
                  {style.description}
                </p>

                <div className="space-y-2">
                  <div>
                    <p className={cn(
                      "text-xs uppercase tracking-wider font-semibold mb-1",
                      isSelected ? 'text-white/70' : 'text-gray-500'
                    )}>
                      Voice
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {style.voice.map((trait) => (
                        <span
                          key={trait}
                          className={cn(
                            'px-2 py-0.5 text-xs rounded-full font-medium',
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-black/5 text-gray-700'
                          )}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStyles.length > 0 && (
        <>
          <div className="px-4">
            <CombinedStyleBar styles={selectedStyles} />
          </div>

          <div className="flex justify-center">
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={cn(
                'inline-flex items-center px-6 py-3 text-base font-medium rounded-lg',
                'bg-gradient-to-r from-purple-500 to-purple-600',
                'hover:from-purple-600 hover:to-purple-700',
                'text-white shadow-lg',
                'transition-all duration-200 transform hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              )}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Post'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}