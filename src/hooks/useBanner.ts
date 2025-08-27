// src/hooks/useBanner.ts

import { useState, useEffect } from 'react';
import { BannerItem } from '../types/banner.types';
import { getBannerData } from '../data/bannerData';

export const useBanner = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setIsLoading(true);
        const data = await getBannerData();
        setBanners(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '배너 데이터 로딩 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, []);

  const handleBannerClick = (banner: BannerItem) => {
    console.log('Banner clicked:', banner);
    // 추후 네비게이션 로직 추가
  };

  return {
    banners,
    isLoading,
    error,
    handleBannerClick
  };
};