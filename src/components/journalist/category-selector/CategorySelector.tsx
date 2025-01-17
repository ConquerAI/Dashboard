import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../../../types';
import { cn } from '../../../utils/cn';
import { 
  Brain, 
  Heart, 
  Building2, 
  Activity,
  Stethoscope
} from 'lucide-react';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
  isLoading: boolean;
}

const categories = [
  {
    id: 'ai-news' as Category,
    label: 'AI News',
    icon: Brain,
    description: 'Latest in artificial intelligence',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ai-healthcare' as Category,
    label: 'AI Healthcare',
    icon: Activity,
    description: 'AI applications in healthcare',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'domiciliary-care' as Category,
    label: 'Domiciliary Care',
    icon: Heart,
    description: 'Home care services',
    gradient: 'from-rose-500 to-orange-500'
  },
  {
    id: 'healthcare' as Category,
    label: 'Healthcare',
    icon: Stethoscope,
    description: 'General healthcare news',
    gradient: 'from-emerald-500 to-green-500'
  },
  {
    id: 'nhs-news' as Category,
    label: 'NHS News',
    icon: Building2,
    description: 'Updates from the NHS',
    gradient: 'from-amber-500 to-yellow-500'
  }
];

export function CategorySelector({
  selectedCategory,
  onCategorySelect,
  isLoading
}: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            disabled={isLoading}
            className={cn(
              "relative p-4 rounded-xl transition-all duration-300",
              "border-2 hover:shadow-lg",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="space-y-3">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                "bg-gradient-to-br",
                category.gradient,
                "bg-opacity-10"
              )}>
                <Icon className={cn(
                  "w-6 h-6 transition-colors",
                  isSelected ? "text-blue-600" : "text-gray-600"
                )} />
              </div>
              
              <div className="text-left">
                <h3 className={cn(
                  "font-medium transition-colors",
                  isSelected ? "text-blue-600" : "text-gray-900"
                )}>
                  {category.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.description}
                </p>
              </div>
            </div>

            {isSelected && (
              <motion.div
                layoutId="category-selection"
                className="absolute inset-0 border-2 border-blue-500 rounded-xl"
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}