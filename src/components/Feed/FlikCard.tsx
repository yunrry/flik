import React, { useState, useRef, useEffect } from 'react';

interface Restaurant {
  id: string;
  name: string;
  images: string[];
  rating: number;
  description: string;
  address: string;
  distance?: number; // 미터 단위
  hours: string;
  // FlikCardLayout과 호환성을 위해 추가
  category?: string;
  location?: string;
  priceRange?: string;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface FlikCardProps {
  restaurant: Restaurant;
  onSwipeLeft?: (restaurant: Restaurant) => void; // 저장 액션
  onSwipeUp?: (restaurant: Restaurant) => void;   // 다음 카드 액션
  onBlogClick?: (restaurant: Restaurant) => void;
  onMapClick?: (restaurant: Restaurant) => void;
}

interface DragOffset {
  x: number;
  y: number;
}

interface DragStart {
  x: number;
  y: number;
}

const FlikCard: React.FC<FlikCardProps> = ({ 
  restaurant,
  onSwipeLeft,
  onSwipeUp,
  onBlogClick,
  onMapClick 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false); // 카드 사라지는 애니메이션 상태
  const [dragStart, setDragStart] = useState<DragStart>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 터치/마우스 이벤트 핸들러
  const handleDragStart = (clientX: number, clientY: number): void => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number): void => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = (): void => {
    if (!isDragging) return;
    
    const { x, y } = dragOffset;
    const threshold = 130;
    
    // 왼쪽 스와이프 (저장)
    if (x < -threshold) {
      setIsExiting(true);
      // 카드가 완전히 사라진 후 콜백 호출
      setTimeout(() => {
        onSwipeLeft && onSwipeLeft(restaurant);
      }, 300);
    }
    // 위로 스와이프 (다음 카드)
    else if (y < -threshold) {
      setIsExiting(true);
      // 카드가 완전히 사라진 후 콜백 호출
      setTimeout(() => {
        onSwipeUp && onSwipeUp(restaurant);
      }, 300);
    }
    else {
      // 임계값에 도달하지 않으면 원래 위치로 복귀
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = (): void => {
    handleDragEnd();
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (): void => {
    handleDragEnd();
  };

  // 이미지 배열 처리 (단일 이미지일 경우 배열로 변환)
  const getImages = (): string[] => {
    if (restaurant.images && restaurant.images.length > 0) {
      return restaurant.images;
    }
    if (restaurant.image) {
      return [restaurant.image];
    }
    return ['/cardImages/marione.png']; // 기본 이미지
  };

  const images = getImages();

  // 이미지 터치로 넘기기
  const handleImageTouch = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>): void => {
    // 드래그 중이면 처리하지 않음
    if (isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    
    let clientX: number;
    if ('clientX' in e) {
      clientX = e.clientX;
    } else if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
    } else {
      return;
    }
    
    const centerX = rect.left + rect.width / 2;
    
    if (clientX > centerX) {
      setCurrentImageIndex((prev) => 
        prev < images.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : images.length - 1
      );
    }
  };

  // 거리 표시 (1km 이하일 때만) - JSX.Element 대신 React.ReactElement 사용
  const renderDistance = (): React.ReactElement | null => {
    if (restaurant.distance && restaurant.distance <= 1000) {
      const distanceKm = (restaurant.distance);
      return (
        <span>
          {distanceKm}m
        </span>
      );
    }
    return null;
  };

  // 별점 렌더링 - JSX.Element 대신 React.ReactElement 사용
  const renderStars = (rating: number): React.ReactElement => {
    return (
      <div className="flex items-center space-x-1 ">
        <span className="text-yellow-400 text-base font-semibold font-['Pretendard'] leading-normal ">★</span>
        <span className="text-gray-3 text-base font-semibold font-['Pretendard'] leading-normal ">{rating}</span>
      </div>
    );
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const cardStyle: React.CSSProperties = {
    transform: isExiting 
      ? dragOffset.x < 0 
        ? 'translateX(-100vw) rotate(-30deg)' // 왼쪽으로 완전히 사라짐
        : dragOffset.y < 0 
        ? 'translateY(-100vh) rotate(0deg)' // 위로 완전히 사라짐
        : `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`
      : `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
    transition: isExiting ? 'transform 0.3s ease-out' : isDragging ? 'none' : 'transform 0.3s ease-out',
    opacity: isExiting ? 0 : 1,
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={cardStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 이미지 섹션 - 소형 디바이스 최적화 */}
      <div className="relative h-[55%] sm:h-[53%] xs:h-[50%]">
        <img
          src={images[currentImageIndex]}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onClick={handleImageTouch}
        />
        
        {/* 이미지 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute xs: bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex xs:space-x-1 sm:space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* 스와이프 힌트 - 소형 디바이스 최적화 */}
        <div className="absolute xs:top-2 sm:top-4 xs:left-2 sm:left-4 bg-black/20 rounded-full xs:px-2 sm:px-3 xs:py-1 sm:py-2">
          <span className="text-white text-xs">← 저장 | ↑ 다음</span>
        </div>
      </div>

      {/* 정보 섹션 - 소형 디바이스 최적화 */}
      <div className="h-[45%] sm:h-[47%] xs:h-[50%] p-3 xs:pt-1 flex flex-col justify-between">
        <div className="space-y-1 xs:py-0 xs:pt-1">
          {/* 카테고리 */}
          <p className="text-neutral-400 text-xs font-normal font-['Pretendard'] leading-tight">
            이탈리아 음식
          </p>
          
          {/* 가게 이름과 별점 - 반응형 레이아웃 */}
          <div className="flex sm:flex-col xs:flex-row items-start xs:justify-start sm:justify-between sm:space-y-1 xs:space-y-0 sm:space-x-0 xs:space-x-1 xs:pt-0">
            {/* 가게 이름 */}
            <h3 className="text-gray-800 text-lg xs:text-xl font-semibold font-['Pretendard'] leading-tight flex-none xs:flex-1">
              {restaurant.name}
            </h3>
            
            {/* 별점 */}
            <div className="sm:flex-shrink xs:flex-shrink-0">
              {renderStars(restaurant.rating)}
            </div>
          </div>

          {/* 소개 - 소형 디바이스에서 줄 수 제한 */}
          <p className="text-gray-5 xs:text-xs sm:text-sm font-normal font-['Pretendard'] leading-tight xs:line-clamp-2 sm:line-clamp-3">
            {restaurant.description}
          </p>

          {/* 구분선 */}
          <div className="xs:h-1 sm:h-2 border-b border-gray-200 xs:my-1 sm:my-2"></div>

          {/* 주소와 거리 */}
          <div className="flex items-center justify-start xs:text-xs sm:text-sm pt-1 text-gray-5 font-normal font-['Pretendard'] leading-normal">
            <span className="truncate pr-2">
              {restaurant.address || restaurant.location} 
            </span>
            {renderDistance()}
          </div>

          {/* 영업시간 */}
          <div className="text-gray-5 xs:text-xs sm:text-sm font-normal font-['Pretendard'] leading-normal">
            <span>영업시간:</span> {restaurant.hours}
          </div>
        </div>

        {/* 버튼들 - 소형 디바이스 최적화 */}
        <div className="flex sm:space-x-2 xs:space-x-3 sm:px-2 xs:px-1 mt-1 sm:mb-1 xs:mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBlogClick && onBlogClick(restaurant);
            }}
            className="flex-1 bg-white text-gray-6 border border-gray-8 sm:py-1.5 xs:py-2 sm:px-4 xs:px-3 rounded-lg font-medium xs:text-xs sm:text-sm  transition-colors flex items-center justify-center space-x-1"
          >
            <span>📝</span>
            <span className="hidden text-sm font-medium font-['Pretendard'] leading-normal xs:inline sm:inline">블로그 리뷰</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMapClick && onMapClick(restaurant);
            }}
            className="flex-1 bg-white text-gray-6 border border-gray-8 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm  transition-colors flex items-center justify-center space-x-1"
          >
            <span>📍</span>
            <span className="hidden text-sm font-medium font-['Pretendard'] leading-normal xs:inline sm:inline">카카오맵</span>
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlikCard;