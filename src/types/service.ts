export type ServiceCategory =
  | 'all'
  | 'maintenance'
  | 'tech'
  | 'design'
  | 'moving'
  | 'cleaning'
  | 'consulting'
  | 'events';

export type SortOption = 'rating' | 'price-asc' | 'fast';

export type PaymentMethod = 'cash' | 'card' | 'd17' | 'bank';

export type PaymentStatus =
  | 'الخلاص وقت الإنجاز'
  | 'تخلّصت أونلاين'
  | 'يستنّى في التحويل';

export interface ServiceReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabel: string;
  providerName: string;
  city: string;
  priceFrom: number;
  priceUnit: string;
  responseTime: string;
  responseMinutes: number;
  availability: string;
  rating: number;
  reviewCount: number;
  description: string;
  deliverables: string[];
  imageUrl: string;
  verified: boolean;
  reviews: ServiceReview[];
}

export interface BookingRequest {
  id: string;
  referenceCode: string;
  serviceId: string;
  serviceTitle: string;
  providerName: string;
  priceFrom: number;
  customerName: string;
  customerPhone: string;
  city: string;
  preferredDate: string;
  notes: string;
  createdAt: string;
  status: 'في المراجعة' | 'تأكّد الموعد' | 'كملت الخدمة';
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
  paymentStatus: PaymentStatus;
  paymentRef?: string;
  userRating?: number;
  userReview?: string;
  reviewedAt?: string;
}

export interface RecentSearchItem {
  id: string;
  query: string;
  category: ServiceCategory;
  city: string;
  label: string;
}
