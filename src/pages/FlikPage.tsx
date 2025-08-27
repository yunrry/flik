// src/pages/FlikPage.tsx

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LocationPermissionModal } from '../components/Location';
import { LocationSelector } from '../components/Location';
import { CurrentLocationButton } from '../components/Location';
import { HeaderBar } from '../components/Layout';
import FlikCardLayout from '../components/Layout/FlikCardLayout';

interface UserLocation {
  coordinates: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
  address?: {
    country: string;
    region: string;
    city: string;
    district?: string;
  };
}

interface Restaurant {
  id: string;
  name: string;
  images: string[];
  rating: number;
  description: string;
  address: string;
  distance?: number; // 미터 단위
  hours: string;
}

const FlikPage: React.FC = () => {
    const { user } = useAuthStore();
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
    const [selectedLocation, setSelectedLocation] = useState('성수역 1번 출구');
    const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);

  // 샘플 맛집 데이터 (실제로는 API에서 가져올 데이터)
  const sampleRestaurants: Restaurant[] = [
    {
      id: '1',
      name: '마리오네',
      images: [
        '/api/placeholder/400/600',
        '/api/placeholder/400/600',
        '/api/placeholder/400/600'
      ],
      rating: 4.7,
      description: '세계 챔피언 마리오가 선보이는 전통 나폴리 피자와 파스타를 맛볼 수 있는 곳',
      address: '서울 성동구 성수동2가 299-50',
      distance: 326,
      hours: '12:00 ~ 18:00'
    },
    {
      id: '2',
      name: '성수동 맛집',
      images: [
        '/api/placeholder/400/600',
        '/api/placeholder/400/600'
      ],
      rating: 4.3,
      description: '현지인이 사랑하는 숨은 맛집, 정통 한식을 맛볼 수 있습니다',
      address: '서울 성동구 성수동1가 685-142',
      distance: 520,
      hours: '11:00 ~ 21:00'
    },
    {
      id: '3',
      name: '카페 로스터리',
      images: [
        '/api/placeholder/400/600'
      ],
      rating: 4.5,
      description: '직접 로스팅한 원두로 만드는 스페셜티 커피 전문점',
      address: '서울 성동구 성수동2가 277-44',
      distance: 890,
      hours: '08:00 ~ 20:00'
    }
  ];

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    console.log('선택된 지역:', location);
  };
  
    // 위치 권한 상태 관리
    const [isFirstVisit, setIsFirstVisit] = useState(true);
  
    const handleLocationUpdate = (location: any) => {
      console.log('위치 업데이트:', location);
    };

    // 저장된 맛집 핸들러
    const handleSave = (restaurants: Restaurant[]) => {
      setSavedRestaurants(restaurants);
      console.log('저장된 맛집들:', restaurants);
    };

    // 블로그 리뷰 버튼 핸들러
    const handleBlogReview = (restaurant: Restaurant) => {
      console.log('블로그 리뷰 보기:', restaurant.name);
      // 블로그 리뷰 페이지로 이동하는 로직 추가
    };

    // 카카오맵 버튼 핸들러
    const handleKakaoMap = (restaurant: Restaurant) => {
      console.log('카카오맵 열기:', restaurant.name);
      // 카카오맵 앱이나 웹으로 이동하는 로직 추가
      const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(restaurant.name)}`;
      window.open(kakaoMapUrl, '_blank');
    };
  

    // 첫 방문 시 위치 권한 모달 표시
    useEffect(() => {
      // localStorage에서 위치 권한 상태 확인
      const hasLocationPermission = localStorage.getItem('location_permission_granted');
      
      if (!hasLocationPermission && isFirstVisit) {
        const timer = setTimeout(() => {
          setShowLocationModal(true);
        }, 1500); // 1.5초 후 모달 표시
        
        return () => clearTimeout(timer);
      } else if (hasLocationPermission) {
        setIsFirstVisit(false);
      }
    }, [isFirstVisit]);
  
    const handleLocationSuccess = (location: UserLocation) => {
      console.log('위치 허용됨:', location);
      setCurrentLocation(location);
      setIsFirstVisit(false);
      setShowLocationModal(false);
      
      // localStorage에 권한 상태 저장
      localStorage.setItem('location_permission_granted', 'true');
      localStorage.setItem('user_location', JSON.stringify(location));
    };
  
    const handleLocationSkip = () => {
      console.log('위치 권한 스킵됨');
      setIsFirstVisit(false);
      setShowLocationModal(false);
      
      // 스킵 상태도 저장 (다음에 다시 묻지 않음)
      localStorage.setItem('location_permission_skipped', 'true');
    };
  
    // 위치 권한 다시 요청하는 함수
    const requestLocationAgain = () => {
      setShowLocationModal(true);
    };
  
    
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <HeaderBar variant="logo" />

        {/* 메인 콘텐츠 - 헤더 높이만큼 패딩 추가 */}
        <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationChange}
              className="w-fit"
            />
            <CurrentLocationButton onLocationUpdate={handleLocationUpdate} />
          </div>

          {/* 위치 미허용 시 안내 메시지 */}
          {!currentLocation && !showLocationModal && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <div className="flex-1">
                  <p className="text-yellow-800 font-medium">위치 서비스가 비활성화되어 있습니다</p>
                  <p className="text-yellow-600 text-sm">
                    주변 맛집과 명소를 추천받으려면 위치를 허용해주세요.
                  </p>
                </div>
                <button 
                  onClick={requestLocationAgain}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                >
                  허용하기
                </button>
              </div>
            </div>
          )}

          {/* 현재 위치 정보 */}
          {currentLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">📍</span>
                <div>
                  <p className="text-blue-800 font-medium">현재 위치</p>
                  <p className="text-blue-600 text-sm">
                    위도: {currentLocation.coordinates.latitude.toFixed(4)}, 
                    경도: {currentLocation.coordinates.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FlikCard 영역 */}
          <div className="h-[600px] w-full">
            <FlikCardLayout
              restaurants={sampleRestaurants}
              onSave={handleSave}
              onBlogReview={handleBlogReview}
              onKakaoMap={handleKakaoMap}
            />
          </div>

          {/* 저장된 맛집 목록 (간단한 표시) */}
          {savedRestaurants.length > 0 && (
            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">❤️</span>
                저장된 맛집 ({savedRestaurants.length}개)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">★ {restaurant.rating}</p>
                    <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* 위치 권한 모달 */}
        <LocationPermissionModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onSuccess={handleLocationSuccess}
          onSkip={handleLocationSkip}
        />
      </div>
    );
  };

export default FlikPage;