// src/hooks/useFeaturedLocation.ts

import { useState, useEffect } from 'react';
import { FeaturedLocation, featuredLocationData } from '../data/featuredLocationData';

export const useFeaturedLocation = () => {
  const [featuredLocations, setFeaturedLocations] = useState<FeaturedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 현재 추천 지역들 로드
    const loadFeaturedLocations = () => {
      setIsLoading(true);
      // 실제 환경에서는 API 호출
      setTimeout(() => {
        // 처음 3개 지역 반환
        setFeaturedLocations(featuredLocationData.slice(0, 3));
        setIsLoading(false);
      }, 300);
    };

    loadFeaturedLocations();
  }, []);

  const handleExploreLocation = (locationId: string) => {
    console.log('Exploring location:', locationId);
    // 추후 해당 지역 상세 페이지로 이동
    // navigate(`/explore/${locationId}`);
  };

  return {
    featuredLocations,
    isLoading,
    handleExploreLocation
  };
};