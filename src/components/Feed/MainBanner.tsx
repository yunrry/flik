// src/components/Feed/MainBanner.tsx

import React, { useState, useEffect, useRef } from 'react';

interface BannerItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
}

interface MainBannerProps {
  banners: BannerItem[];
  autoSlide?: boolean;
  slideInterval?: number;
  className?: string;
  onBannerClick?: (banner: BannerItem) => void;
}

const MainBanner: React.FC<MainBannerProps> = ({
  banners,
  autoSlide = true,
  slideInterval = 5000,
  className = '',
  onBannerClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [preloadNextImage, setPreloadNextImage] = useState(false);

  // 슬라이드 이동 함수
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    // 애니메이션 완료 후 상태 리셋
    setTimeout(() => {
      setIsAnimating(false);
      setPreloadNextImage(false); // 다음 이미지 프리로드 리셋
    }, 500);
  };

  // 자동 슬라이드 기능
  useEffect(() => {
    if (!autoSlide || banners.length <= 1 || isAnimating) return;

    const timer = setInterval(() => {
      // 슬라이드 1초 전에 다음 이미지 프리로드
      const preloadTimer = setTimeout(() => {
        setPreloadNextImage(true);
      }, slideInterval - 1000);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex === banners.length - 1 ? 0 : prevIndex + 1;
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 500);
          return nextIndex;
        });
      }, slideInterval);

      return () => clearTimeout(preloadTimer);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, slideInterval, banners.length, isAnimating]);

  // 이전/다음 슬라이드
  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
    setPreloadNextImage(true); // 수동 슬라이드 시 즉시 프리로드
    goToSlide(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = currentIndex === banners.length - 1 ? 0 : currentIndex + 1;
    setPreloadNextImage(true); // 수동 슬라이드 시 즉시 프리로드
    goToSlide(nextIndex);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  const nextIndex = currentIndex === banners.length - 1 ? 0 : currentIndex + 1;
  const prevIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;

  return (
    <div className={`relative w-full h-52 overflow-hidden ${className}`}>
      {/* 양옆 회색 배너들 (10%씩 보이도록) */}
      <div className="absolute inset-0 flex items-center">
        {/* 왼쪽 회색 배너 (10% 보임) */}
        <div 
          className="w-[5%] h-full bg-gray-300 cursor-pointer relative overflow-hidden rounded-lg shadow-md"
          style={{ transform: 'translateX(-40%)' }}
          onClick={goToPrevious}
        >
          {preloadNextImage && (
            <div 
              className="w-full h-full bg-cover bg-center opacity-60"
              style={{ 
                backgroundImage: `url(${banners[prevIndex].imageUrl})` 
              }}
            />
          )}
        </div>

        {/* 오른쪽 회색 배너 (10% 보임) */}
        <div 
          className="w-[5%] h-full bg-gray-300 cursor-pointer relative overflow-hidden ml-auto rounded-lg shadow-md"
          style={{ transform: 'translateX(40%)' }}
          onClick={goToNext}
        >
          {preloadNextImage && (
            <div 
              className="w-full h-full bg-cover bg-center opacity-60"
              style={{ 
                backgroundImage: `url(${banners[nextIndex].imageUrl})` 
              }}
            />
          )}
        </div>
      </div>

      {/* 메인 배너 (중앙 80%) */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
          <div
            className="w-full h-full bg-cover bg-center relative cursor-pointer"
            style={{ 
              backgroundImage: `url(${banners[currentIndex].imageUrl})` 
            }}
            onClick={() => onBannerClick?.(banners[currentIndex])}
          >
            {/* 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            
            {/* 컨텐츠 오버레이 */}
            <div className="absolute inset-0 flex items-end justify-start p-6">
              <div className="text-left text-white">
                <h2 className="text-white text-base font-semibold font-['Pretendard'] leading-tight mb-2">
                  {banners[currentIndex].title}
                </h2>
                <p className="text-white text-xs font-medium font-['Pretendard'] leading-normal">
                  {banners[currentIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default MainBanner;