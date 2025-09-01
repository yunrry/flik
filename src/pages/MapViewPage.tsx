import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import { Restaurant } from '../types/restaurant.types';
import { MapIcon } from '../components/Icons/SvgIcons';

const MapViewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  
  // SavePage/FlikCard에서 전달받은 데이터
  const restaurants = location.state?.restaurants as Restaurant[] | null;
  const returnPath = location.state?.returnPath || '/';
  
  // 상태 관리
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [displayRestaurants, setDisplayRestaurants] = useState<Restaurant[]>([]);

  // 카카오맵 초기화
  useEffect(() => {
    const initializeMap = () => {
      if (window.kakao && mapRef.current) {
        // 서울 시청을 기본 중심점으로 설정
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 8
        };
        
        const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
        setMap(kakaoMap);
        
        // 지도 클릭 시 바텀시트 닫기
        window.kakao.maps.event.addListener(kakaoMap, 'click', () => {
          setIsBottomSheetOpen(false);
        });
      }
    };

    // 카카오맵 SDK 로드 확인 및 초기화
    if (window.kakao) {
      initializeMap();
    } else {
      const timer = setInterval(() => {
        if (window.kakao) {
          clearInterval(timer);
          initializeMap();
        }
      }, 100);
    }
  }, []);

  // 전달받은 restaurants 데이터 설정
  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      setDisplayRestaurants(restaurants);
      setCurrentRestaurantIndex(0);
    }
  }, [restaurants]);

  // 마커 생성 및 표시
  useEffect(() => {
    if (!map || displayRestaurants.length === 0) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers: any[] = [];
    
    displayRestaurants.forEach((restaurant, index) => {
      if (restaurant.coordinates) {
        const position = new window.kakao.maps.LatLng(
          restaurant.coordinates.lat,
          restaurant.coordinates.lng
        );
        
        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map
        });
        
        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', () => {
          setCurrentRestaurantIndex(index);
          setIsBottomSheetOpen(true);
          
          // 지도 중심을 해당 위치로 이동
          map.setCenter(position);
          map.setLevel(3);
        });
        
        newMarkers.push(marker);
      }
    });
    
    setMarkers(newMarkers);
    
    // 모든 마커가 보이도록 지도 범위 조정
    if (newMarkers.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.setBounds(bounds);
    }
  }, [map, displayRestaurants]);

  // 스와이프로 다음/이전 식당 넘기기
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentRestaurantIndex < displayRestaurants.length - 1) {
      setCurrentRestaurantIndex(prev => prev + 1);
    } else if (direction === 'right' && currentRestaurantIndex > 0) {
      setCurrentRestaurantIndex(prev => prev - 1);
    }
  };

  // 현재 식당 정보
  const currentRestaurant = displayRestaurants[currentRestaurantIndex];

  const handleBackClick = () => {
    navigate(returnPath);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <HeaderBar 
        variant="back" 
        onBack={handleBackClick}
        title="지도"
      />
      
      {/* 지도 영역 - 전체 화면 */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
        
        {/* 저장된 식당이 없을 경우 안내 메시지 */}
        {(!displayRestaurants || displayRestaurants.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="text-center">
              <MapIcon size="lg" className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-medium">음식점 정보가 없습니다</p>
              <p className="text-sm text-gray-500 mt-2">
                음식점을 선택하면 지도에서 위치를 확인할 수 있습니다
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 바텀업 팝업 */}
      {isBottomSheetOpen && currentRestaurant && (
        <div className="absolute bottom-0 left-0 right-0 z-50">
          {/* 스와이프 영역 */}
          <div className="h-20 flex items-center justify-center">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* 식당 정보 영역 */}
          <div className="bg-white rounded-t-3xl shadow-2xl min-h-[40vh]">
            {/* 스와이프 네비게이션 */}
            {displayRestaurants.length > 1 && (
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <button
                  onClick={() => handleSwipe('right')}
                  disabled={currentRestaurantIndex === 0}
                  className={`p-2 rounded-full ${
                    currentRestaurantIndex === 0 
                      ? 'text-gray-300' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ←
                </button>
                
                <span className="text-sm text-gray-500">
                  {currentRestaurantIndex + 1} / {displayRestaurants.length}
                </span>
                
                <button
                  onClick={() => handleSwipe('left')}
                  disabled={currentRestaurantIndex === displayRestaurants.length - 1}
                  className={`p-2 rounded-full ${
                    currentRestaurantIndex === displayRestaurants.length - 1 
                      ? 'text-gray-300' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  →
                </button>
              </div>
            )}
            
            {/* 식당 정보 */}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                {/* 식당 이미지 */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                  {currentRestaurant.images && currentRestaurant.images.length > 0 ? (
                    <img
                      src={currentRestaurant.images[0]}
                      alt={currentRestaurant.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      🍽️
                    </div>
                  )}
                </div>
                
                {/* 식당 정보 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {currentRestaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {currentRestaurant.category || '음식점'} · {currentRestaurant.location || currentRestaurant.address}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-700">{currentRestaurant.rating}</span>
                    {currentRestaurant.distance && (
                      <span className="text-sm text-gray-500">
                        {currentRestaurant.distance <= 1000 
                          ? `${currentRestaurant.distance}m` 
                          : `${(currentRestaurant.distance / 1000).toFixed(1)}km`
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 설명 */}
              {currentRestaurant.description && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {currentRestaurant.description}
                </p>
              )}
              
              {/* 액션 버튼들 */}
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={() => navigate(`/save/${currentRestaurant.id}`)}
                  className="flex-1 py-2 px-4 bg-main-1 text-white rounded-lg text-sm font-medium"
                >
                  상세보기
                </button>
                <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
                  길찾기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewPage;