// src/types/banner.types.ts

export interface BannerItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    buttonText?: string;
    link?: string;
    category?: string;
    location?: string;
  }
  
  export interface BannerProps {
    banners: BannerItem[];
    autoSlide?: boolean;
    slideInterval?: number;
    className?: string;
    onBannerClick?: (banner: BannerItem) => void;
  }
  
  export interface BannerSliderState {
    currentIndex: number;
    isPlaying: boolean;
    direction: 'next' | 'prev';
  }