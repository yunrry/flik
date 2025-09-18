import React, { useState, useEffect } from 'react';
import FlikCard from '../Feed/FlikCard';
import { useAuthStore } from '../../stores/authStore';
import { Spot } from '@/types/spot.types';
import { saveSpot } from '../../api/flikCardsApi';


// Props 타입 정의
interface FlikCardLayoutProps {
  spots: Spot[];
  onSave?: (savedSpots: Spot[]) => void;
  onBlogReview?: (spot: Spot) => void;
  onKakaoMap?: (spot: Spot) => void;
}

const FlikCardLayout: React.FC<FlikCardLayoutProps> = ({ 
  spots, 
  onSave, 
}) => {
  const { user } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);


  // 저장된 맛집이 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (savedSpots.length > 0) {
      onSave && onSave(savedSpots);
    }
  }, [savedSpots, onSave]);

  // 현재 카드와 다음 카드들
  const visibleCards = spots.slice(currentIndex, currentIndex + 3);

  // 왼쪽 스와이프 (저장) 핸들러
  const handleSwipeLeft = async (Spot: Spot) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      // API 호출로 서버에 저장
      await saveSpot(Spot.id);
      
      // 성공하면 로컬 state 업데이트
      setSavedSpots(prev => {
        const isAlreadySaved = prev.some(r => r.id === Spot.id);
        if (!isAlreadySaved) {
          return [...prev, Spot];
        }
        return prev;
      });

      // 저장 성공 애니메이션 표시
      showSaveAnimation();
      
    } catch (error) {
      // API 호출 실패 시 에러 처리
      console.error('저장 실패:', error);
      showErrorAnimation('저장에 실패했습니다');
      
      // 실패해도 다음 카드로 넘어가도록 처리 (선택사항)
      // return; // 이 줄을 주석 해제하면 실패시 카드가 넘어가지 않음
    }
    
    // 다음 카드로 이동
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  // 위로 스와이프 (다음 카드) 핸들러
  const handleSwipeUp = (Spot: Spot) => {
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


  // 에러 애니메이션 함수 추가
  const showErrorAnimation = (message: string) => {
    const errorIndicator = document.createElement('div');
    errorIndicator.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg z-50 animate-bounce';
    errorIndicator.textContent = `❌ ${message}`;
    document.body.appendChild(errorIndicator);
    
    setTimeout(() => {
      if (document.body.contains(errorIndicator)) {
        document.body.removeChild(errorIndicator);
      }
    }, 2000);
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

  // 리셋 함수
  const resetCards = () => {
    setCurrentIndex(0);
    setIsAnimating(false);
  };

  // 더 이상 카드가 없을 때
  const hasMoreCards = currentIndex < spots.length;

  return (
    <div className="relative w-full h-full rounded-xl flex items-center justify-center pb-[10%] ">
      {/* 배경 */}
      <div className="absolute rounded-xl inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100" />
      
      {/* 카드 스택 - 소형 디바이스 최적화 */}
      <div className="relative w-full h-full mx-auto px-2 xs:px-4">
        {hasMoreCards ? (
          visibleCards.map((Spot: Spot, index: number) => {
            const isTop = index === 0;
            const zIndex = 10 - index;
            
            // 모든 카드를 같은 크기로 유지 (스케일 1로 고정)
            const scale = 1; // 항상 동일한 크기
            const translateY = isTop ? 0 : index === 1 ? 4 : index * 8;
            const opacity = isTop ? 1 : index === 1 ? 0.9 : 0.8;
            
            return (
              <div
                key={`${Spot.id}-${currentIndex + index}`}
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
                    spot={Spot}
                    onSwipeLeft={index === 0 ? handleSwipeLeft : undefined}
                    onSwipeUp={index === 0 ? handleSwipeUp : undefined}
                  />
                )}
                {/* 세 번째 카드 이후는 플레이스홀더 */}
                {index >= 2 && (
                  <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-200" />
                )}
              </div>
            );
          })
        ) : (
          // 모든 카드를 다 봤을 때 - 소형 디바이스 최적화
          <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl xs:p-4 sm:p-8">
            <div className="sm:text-4xl xs:text-6xl sm:mb-2 xs:mb-4">🎉</div>
            <h3 className="sm:text-lg xs:text-2xl font-bold text-gray-800 sm:mb-1 xs:mb-2 text-center">
              모든 장소를 확인했어요!
            </h3>
            <p className="sm:text-sm xs:text-base text-gray-600 text-center sm:mb-6 xs:mb-4">
              저장된 맛집 {savedSpots.length}개를 확인해보세요
            </p>
            <button
              onClick={resetCards}
              className="bg-blue-500 text-white sm:px-4 xs:px-6 sm:py-2 xs:py-3 rounded-lg font-medium xs:text-sm sm:text-base hover:bg-blue-600 transition-colors"
            >
              다시 보기
            </button>
          </div>
        )}
      </div>

      {/* 하단 액션 힌트 - 소형 디바이스 최적화 */}
      {hasMoreCards && (
        <div className="absolute bottom-4 xs:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-6 xs:space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-pink-500 rounded-full flex items-center justify-center mb-1 xs:mb-2 shadow-lg">
              <span className="text-white text-lg xs:text-xl">❤️</span>
            </div>
            <span className="text-xs xs:text-sm text-gray-600">← 저장</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gray-500 rounded-full flex items-center justify-center mb-1 xs:mb-2 shadow-lg">
              <span className="text-white text-lg xs:text-xl">👋</span>
            </div>
            <span className="text-xs xs:text-sm text-gray-600">↑ 패스</span>
          </div>
        </div>
      )}
    

      {/* 상단 진행률 표시 - 소형 디바이스 최적화 */}
      {hasMoreCards && (
        <div className="absolute top-4 xs:top-8 left-1/2 transform -translate-x-1/2 w-48 xs:w-64">
          <div className="flex justify-between text-xs xs:text-sm text-gray-600 mb-1 xs:mb-2">
            <span>{currentIndex + 1}</span>
            <span>{spots.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 xs:h-2">
            <div
              className="bg-blue-500 h-1.5 xs:h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / spots.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* 저장된 맛집 수 표시 - 소형 디바이스 최적화 */}
      {savedSpots.length > 0 && (
        <div className="absolute top-4 xs:top-8 right-4 xs:right-8 bg-pink-500 text-white px-2 xs:px-3 py-1 rounded-full text-xs xs:text-sm font-medium shadow-lg">
          ❤️ {savedSpots.length}
        </div>
      )}
    </div>
  );
};

export default FlikCardLayout;