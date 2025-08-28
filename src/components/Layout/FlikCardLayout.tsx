import React, { useState, useEffect } from 'react';
import FlikCard from '../Feed/FlikCard';

// FlikCard와 동일한 Restaurant 타입 사용
interface Restaurant {
  id: string;
  name: string;
  images: string[];
  rating: number;
  description: string;
  address: string;
  hours: string;
  distance?: number; // 미터 단위
  // 호환성을 위한 선택적 속성들
  category?: string;
  location?: string;
  priceRange?: string;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Props 타입 정의
interface FlikCardLayoutProps {
  restaurants: Restaurant[];
  onSave?: (savedRestaurants: Restaurant[]) => void;
  onBlogReview?: (restaurant: Restaurant) => void;
  onKakaoMap?: (restaurant: Restaurant) => void;
}

const FlikCardLayout: React.FC<FlikCardLayoutProps> = ({ 
  restaurants, 
  onSave, 
  onBlogReview, 
  onKakaoMap 
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // 저장된 맛집이 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (savedRestaurants.length > 0) {
      onSave && onSave(savedRestaurants);
    }
  }, [savedRestaurants, onSave]);

  // 현재 카드와 다음 카드들
  const visibleCards = restaurants.slice(currentIndex, currentIndex + 3);

  // 왼쪽 스와이프 (저장) 핸들러 - onSave 호출 제거
  const handleSwipeLeft = (restaurant: Restaurant) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // 저장 목록에 추가
    setSavedRestaurants(prev => {
      const isAlreadySaved = prev.some(r => r.id === restaurant.id);
      if (!isAlreadySaved) {
        return [...prev, restaurant]; // useEffect에서 onSave 호출됨
      }
      return prev;
    });

    // 저장 애니메이션 표시
    showSaveAnimation();
    
    // 다음 카드로 이동
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  // 위로 스와이프 (다음 카드) 핸들러
  const handleSwipeUp = (restaurant: Restaurant) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // 패스 애니메이션 표시
    showPassAnimation();
    
    // 다음 카드로 이동
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  // 저장 애니메이션
  const showSaveAnimation = () => {
    // 하트 애니메이션이나 저장 표시
    const saveIndicator = document.createElement('div');
    saveIndicator.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg z-50 animate-bounce';
    saveIndicator.textContent = '❤️ 저장됨!';
    document.body.appendChild(saveIndicator);
    
    setTimeout(() => {
      document.body.removeChild(saveIndicator);
    }, 1500);
  };

  // 패스 애니메이션
  const showPassAnimation = () => {
    const passIndicator = document.createElement('div');
    passIndicator.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-500 text-white px-6 py-3 rounded-full font-bold text-lg z-50 animate-bounce';
    passIndicator.textContent = '👋 패스!';
    document.body.appendChild(passIndicator);
    
    setTimeout(() => {
      document.body.removeChild(passIndicator);
    }, 1500);
  };

  // 블로그 리뷰 버튼 핸들러
  const handleBlogClick = (restaurant: Restaurant) => {
    onBlogReview && onBlogReview(restaurant);
  };

  // 카카오맵 버튼 핸들러
  const handleMapClick = (restaurant: Restaurant) => {
    onKakaoMap && onKakaoMap(restaurant);
  };

  // 리셋 함수
  const resetCards = () => {
    setCurrentIndex(0);
    setIsAnimating(false);
  };

  // 더 이상 카드가 없을 때
  const hasMoreCards = currentIndex < restaurants.length;

  return (
    <div className="relative w-full h-full rounded-2xl flex items-center justify-center">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 rounded-2xl" />
      
      {/* 카드 스택 */}
      <div className="relative w-full max-w-sm h-full max-h-[600px] mx-auto">
        {hasMoreCards ? (
          visibleCards.map((restaurant: Restaurant, index: number) => {
            const isTop = index === 0;
            const zIndex = 10 - index;
            
            // 첫 번째와 두 번째 카드는 동일한 크기, 세 번째부터 작아짐
            const scale = isTop ? 1 : index === 1 ? 1 : 1 - (index * 0.03);
            const translateY = isTop ? 0 : index === 1 ? 0 : index * 8; // 두 번째 카드도 위치 동일
            const opacity = isTop ? 1 : index === 1 ? 1 : 0.8;
            
            return (
              <div
                key={`${restaurant.id}-${currentIndex + index}`}
                className="absolute inset-0"
                style={{
                  zIndex,
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  opacity: opacity,
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
              >
                {/* 첫 번째와 두 번째 카드는 실제 FlikCard 렌더링 */}
                {(index === 0 || index === 1) && (
                  <FlikCard
                    restaurant={restaurant}
                    onSwipeLeft={index === 0 ? handleSwipeLeft : undefined}
                    onSwipeUp={index === 0 ? handleSwipeUp : undefined}
                    onBlogClick={index === 0 ? handleBlogClick : undefined}
                    onMapClick={index === 0 ? handleMapClick : undefined}
                  />
                )}
                {/* 세 번째 카드 이후는 플레이스홀더 */}
                {index >= 2 && (
                  <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-8" />
                )}
              </div>
            );
          })
        ) : (
          // 모든 카드를 다 봤을 때
          <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              모든 맛집을 확인했어요!
            </h3>
            <p className="text-gray-600 text-center mb-6">
              저장된 맛집 {savedRestaurants.length}개를 확인해보세요
            </p>
            <button
              onClick={resetCards}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              다시 보기
            </button>
          </div>
        )}
      </div>

      {/* 하단 액션 힌트 */}
      {hasMoreCards && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <span className="text-white text-xl">❤️</span>
            </div>
            <span className="text-sm text-gray-600">← 저장</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <span className="text-white text-xl">👋</span>
            </div>
            <span className="text-sm text-gray-600">↑ 패스</span>
          </div>
        </div>
      )}

      {/* 상단 진행률 표시 */}
      {hasMoreCards && (
        <div className="absolute top-8  left-1/2 transform -translate-x-1/2 w-64">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{currentIndex + 1}</span>
            <span>{restaurants.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / restaurants.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* 저장된 맛집 수 표시 */}
      {savedRestaurants.length > 0 && (
        <div className="absolute top-8 right-8 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          ❤️ {savedRestaurants.length}
        </div>
      )}
    </div>
  );
};

export default FlikCardLayout;