// src/components/Feed/MainBanner.tsx

import React, { useState, useEffect } from 'react';

interface BannerItem {
  id: number;
  title: string;
  subtitle: string;
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

  // 자동 슬라이드 기능
  useEffect(() => {
    if (!autoSlide || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, slideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, slideInterval, banners.length]);

  // 인디케이터 클릭 핸들러
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 이전/다음 슬라이드
  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className={`relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg ${className}`}>
      {/* 배너 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ 
          backgroundImage: `url(${currentBanner.imageUrl})` 
        }}
      >
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* 컨텐츠 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="text-center text-white max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
            {currentBanner.title}
          </h2>
          <p className="text-lg sm:text-xl mb-3 opacity-90">
            {currentBanner.subtitle}
          </p>
          <p className="text-sm sm:text-base mb-6 opacity-80 leading-relaxed">
            {currentBanner.description}
          </p>
          
          {currentBanner.buttonText && (
            <button 
              onClick={() => onBannerClick?.(currentBanner)}
              className="bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              {currentBanner.buttonText}
            </button>
          )}
        </div>
      </div>

      {/* 네비게이션 화살표 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainBanner;