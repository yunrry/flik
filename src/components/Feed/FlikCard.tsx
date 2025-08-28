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
    const threshold = 40;
    
    // 왼쪽 스와이프 (저장)
    if (x < -threshold) {
      onSwipeLeft && onSwipeLeft(restaurant);
    }
    // 위로 스와이프 (다음 카드)
    else if (y < -threshold) {
      onSwipeUp && onSwipeUp(restaurant);
    }
    
    // 리셋
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
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
    e.stopPropagation();
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
      // 오른쪽 터치 - 다음 이미지
      setCurrentImageIndex((prev) => 
        prev < images.length - 1 ? prev + 1 : 0
      );
    } else {
      // 왼쪽 터치 - 이전 이미지
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : images.length - 1
      );
    }
  };

  // 거리 표시 (1km 이하일 때만) - JSX.Element 대신 React.ReactElement 사용
  const renderDistance = (): React.ReactElement | null => {
    if (restaurant.distance && restaurant.distance <= 1000) {
      const distanceKm = (restaurant.distance / 1000).toFixed(1);
      return (
        <span className="text-blue-500 text-sm font-medium">
          {distanceKm}km
        </span>
      );
    }
    return null;
  };

  // 별점 렌더링 - JSX.Element 대신 React.ReactElement 사용
  const renderStars = (rating: number): React.ReactElement => {
    return (
      <div className="flex items-center space-x-1">
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
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full bg-white rounded-xl border border-gray-8 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={cardStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 이미지 섹션 */}
      <div className="relative h-[53%]">
        <img
          src={images[currentImageIndex]}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onClick={handleImageTouch}
          onTouchEnd={handleImageTouch}
        />
        
        {/* 이미지 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* 스와이프 힌트 */}
        <div className="absolute top-4 left-4 bg-black/20 rounded-full px-3 py-1">
          <span className="text-white text-xs">← 저장 | ↑ 다음</span>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="h-[47%] p-4 flex flex-col justify-between">
        <div className="space-y-1">
          {/* 가게 이름과 별점 */}
          <p className="text-neutral-400 text-xs font-normal font-['Pretendard'] leading-normal">
              이탈리아 음식
            </p>
           <p className="text-gray-3 text-xl font-semibold font-['Pretendard']leading-normal">
              {restaurant.name}
          </p>
           
          {renderStars(restaurant.rating)}

          {/* 소개 */}
          <p className="text-gray-5 text-sm font-normal font-['Pretendard'] leading-tight">
            {restaurant.description}
          </p>

          {/* 구분선 */}
          <div className="h-2 border-b border-gray-200 my-2"></div>


          {/* 주소와 거리 */}
          <div className="flex items-center justify-between text-sm pt-1">
            <span className="text-gray-5 font-normal font-['Pretendard'] leading-normal">
              {restaurant.address || restaurant.location}
            </span>
            {renderDistance()}
          </div>

          {/* 영업시간 */}
          <div className="text-gray-5 text-sm font-normal font-['Pretendard'] leading-normal">
            <span className="font-medium">영업시간:</span> {restaurant.hours}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex space-x-3 mt-1 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBlogClick && onBlogClick(restaurant);
            }}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
          >
            <span>📝</span>
            <span>블로그리뷰</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMapClick && onMapClick(restaurant);
            }}
            className="flex-1 bg-yellow-400 text-gray-800 py-2 px-4 rounded-lg font-medium text-sm hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-1"
          >
            <span>📍</span>
            <span>카카오맵</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlikCard;