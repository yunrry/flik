import React, { useState, useRef, useEffect } from 'react';
import { LocationIcon } from '../Icons';

interface LocationData {
  region: string;
  districts: string[];
}

interface LocationSelectorProps {
  selectedLocation?: string;
  onLocationSelect: (location: string) => void;
  className?: string;
}

const SEOUL_LOCATIONS: LocationData[] = [
  {
    region: '서울 북부',
    districts: ['전체', '성수', '이태원/한남', '홍대/연남/상수', '신촌/연희', '마포/공덕', '용산/삼각지', '시청/을지로', '서촌/광화문/종로', '안국/북촌/삼청동']
  },
  {
    region: '서울 남부', 
    districts: ['전체', '강남', '서초', '송파', '영등포', '여의도', '한강진', '압구정', '청담', '논현', '신사', '잠실']
  }
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation = '성수역 1번 출구',
  onLocationSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('서울 북부');
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleLocationClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDistrictSelect = (district: string) => {
    onLocationSelect(district);
    setIsOpen(false);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const handleClose = () => {
    setIsOpen(false);
    setDragOffset(0);
    setIsDragging(false);
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStart(touch.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || dragStart === null) return;
    
    const touch = e.touches[0];
    const currentY = touch.clientY;
    const deltaY = currentY - dragStart;
    
    // 아래쪽으로만 드래그 허용
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // 드래그 거리가 100px 이상이면 닫기
    if (dragOffset > 100) {
      handleClose();
    } else {
      // 원래 위치로 복원
      setDragOffset(0);
    }
    
    setDragStart(null);
    setIsDragging(false);
  };

  // 마우스 이벤트 핸들러 (데스크톱 지원)
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || dragStart === null) return;
    
    const currentY = e.clientY;
    const deltaY = currentY - dragStart;
    
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    if (dragOffset > 100) {
      handleClose();
    } else {
      setDragOffset(0);
    }
    
    setDragStart(null);
    setIsDragging(false);
  };

  // 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, dragOffset]);

  const currentRegionData = SEOUL_LOCATIONS.find(loc => loc.region === selectedRegion);

  return (
    <div className={`relative ${className}`}>
      {/* 위치 선택 버튼 */}
      <button
        onClick={handleLocationClick}
        className="flex items-center gap-1 px-1 py-1 bg-white rounded-lg hover:shadow-sm "
      >
        <LocationIcon 
          size="md" 
          color="#333333" 
          variant="pin"
        />
        <span className="text-gray-1 text-base font-medium font-['Pretendard'] leading-normal mt-1">
          {selectedLocation}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 팝업 모달 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={handleClose}
          />
          
          {/* 팝업 컨텐츠 */}
          <div 
            ref={modalRef}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-xl z-50 max-h-[95vh] overflow-hidden transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${dragOffset}px)`,
              opacity: Math.max(0.3, 1 - dragOffset / 300)
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            {/* 드래그 핸들 */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing" />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">지역 설정</h2>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="flex h-[75vh]">
              {/* 좌측 지역 목록 */}
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                {SEOUL_LOCATIONS.map((location) => (
                  <button
                    key={location.region}
                    onClick={() => handleRegionSelect(location.region)}
                    className={`w-full px-4 py-3 text-left text-sm border-b border-gray-200 transition-colors ${
                      selectedRegion === location.region 
                        ? 'bg-orange-50 text-orange-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {location.region}
                  </button>
                ))}
              </div>

              {/* 우측 세부 지역 목록 */}
              <div className="flex-1 overflow-y-auto">
                {currentRegionData?.districts.map((district) => (
                  <button
                    key={district}
                    onClick={() => handleDistrictSelect(district)}
                    className="w-full px-4 py-3 text-left text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {district}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationSelector;
