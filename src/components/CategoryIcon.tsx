import {
  BookOpen,
  Camera,
  Code2,
  LayoutGrid,
  Palette,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react';
import { ServiceCategory } from '../types/service';

interface CategoryIconProps {
  category: ServiceCategory;
  className?: string;
}

export function CategoryIcon({
  category,
  className = 'w-4 h-4 shrink-0',
}: CategoryIconProps) {
  switch (category) {
    case 'maintenance':
      return <Wrench className={className} aria-hidden="true" />;
    case 'tech':
      return <Code2 className={className} aria-hidden="true" />;
    case 'design':
      return <Palette className={className} aria-hidden="true" />;
    case 'moving':
      return <Truck className={className} aria-hidden="true" />;
    case 'cleaning':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'consulting':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'events':
      return <Camera className={className} aria-hidden="true" />;
    default:
      return <LayoutGrid className={className} aria-hidden="true" />;
  }
}
