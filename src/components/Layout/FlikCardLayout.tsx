import React, { useState, useEffect, useMemo } from 'react';
import FlikCard from '../Feed/FlikCard';
import { useAuthStore } from '../../stores/authStore';
import { Spot } from '@/types/spot.types';
import { saveSpot } from '../../api/flikCardsApi';

interface FlikCardLayoutProps {
  spots: Spot[];
  onSave?: (savedSpots: Spot[]) => void;
  onFinished?: () => void;
}

const FlikCardLayout: React.FC<FlikCardLayoutProps> = ({ spots, onSave, onFinished }) => {
  const { user } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [finishedCalled, setFinishedCalled] = useState(false);

  useEffect(() => {
    if (savedSpots.length > 0) {
      onSave && onSave(savedSpots);
    }
  }, [savedSpots, onSave]);
  
  /** 
   * 더 이상 카드가 있는지 여부 (렌더링 최적화)
   */
  const hasMoreCards = useMemo(() => currentIndex < spots.length, [currentIndex, spots.length]);

  /**
   * spots가 변경되면 finishedCalled를 초기화
   */
  useEffect(() => {
    setFinishedCalled(false);
  }, [spots]);

  /**
   * 카드가 없을 때 onFinished 한 번만 실행
   */
  useEffect(() => {
    if (!hasMoreCards && !finishedCalled) {
      console.log('카드 없음 → onFinished 실행');
      onFinished?.();
      setFinishedCalled(true);
    }
  }, [hasMoreCards, finishedCalled, onFinished]);

  // 현재 보여줄 카드 3장
  const visibleCards = useMemo(() => spots.slice(currentIndex, currentIndex + 3), [spots, currentIndex]);

  /**
   * 왼쪽 스와이프 → 저장
   */
  const handleSwipeLeft = async (spot: Spot) => {
    if (isAnimating) return;
    setIsAnimating(true);

    try {
      await saveSpot(spot.id);

      setSavedSpots(prev => {
        if (!prev.some(r => r.id === spot.id)) {
          return [...prev, spot];
        }
        return prev;
      });

      showSaveAnimation();
    } catch (error) {
      console.error('저장 실패:', error);
      showErrorAnimation('저장에 실패했습니다');
    } finally {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  /**
   * 위로 스와이프 → 패스
   */
  const handleSwipeUp = (spot: Spot) => {
    if (isAnimating) return;
    setIsAnimating(true);

    showPassAnimation();

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  /**
   * 애니메이션 관련 함수
   */
  const showErrorAnimation = (message: string) => {
    const el = document.createElement('div');
    el.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg z-50 animate-bounce';
    el.textContent = `❌ ${message}`;
    document.body.appendChild(el);

    setTimeout(() => {
      if (document.body.contains(el)) document.body.removeChild(el);
    }, 2000);
  };

  const showSaveAnimation = () => {
    const el = document.createElement('div');
    el.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg z-50 animate-bounce';
    el.textContent = '❤️ 저장됨!';
    document.body.appendChild(el);

    setTimeout(() => {
      if (document.body.contains(el)) document.body.removeChild(el);
    }, 1500);
  };

  const showPassAnimation = () => {
    const el = document.createElement('div');
    el.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-500 text-white px-6 py-3 rounded-full font-bold text-lg z-50 animate-bounce';
    el.textContent = '👋 패스!';
    document.body.appendChild(el);

    setTimeout(() => {
      if (document.body.contains(el)) document.body.removeChild(el);
    }, 1500);
  };

  /**
   * 카드 리셋
   */
  const resetCards = () => {
    setCurrentIndex(0);
    setIsAnimating(false);
  };

  return (
    <div className="relative w-full h-full rounded-xl flex items-center justify-center">
      {/* 카드 스택 */}
      <div className="relative w-full h-full mx-auto px-2 xs:px-4">
        {hasMoreCards ? (
          visibleCards.map((spot, index) => {
            const isTop = index === 0;
            const zIndex = 10 - index;

            return (
              <div
                key={`${spot.id}-${currentIndex + index}`}
                className="absolute inset-0"
                style={{
                  zIndex,
                  transform: `translateY(${index * 8}px)`,
                  opacity: isTop ? 1 : 0.9,
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
              >
                <FlikCard
                  spot={spot}
                  onSwipeLeft={isTop ? handleSwipeLeft : undefined}
                  onSwipeUp={isTop ? handleSwipeUp : undefined}
                />
              </div>
            );
          })
        ) : (
          // 모든 카드를 다 봤을 때
          <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">모든 장소를 확인했어요!</h3>
            <p className="text-sm text-gray-600 mb-4">저장된 장소 {savedSpots.length}개를 확인해보세요</p>
            <button
              onClick={resetCards}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              다시 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlikCardLayout;
