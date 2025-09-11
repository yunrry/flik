// src/pages/FlikPage.tsx

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LocationPermissionModal } from '../components/Location';
import { LocationSelector } from '../components/Location';
import { CurrentLocationButton } from '../components/Location';
import { HeaderBar } from '../components/Layout';
import FlikCardLayout from '../components/Layout/FlikCardLayout';
import { Restaurant } from '../types/restaurant.types';
import { sampleRestaurants } from '../data/sampleRestaurants';

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



const FlikPage: React.FC = () => {
    const { user } = useAuthStore();
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
    const [selectedLocation, setSelectedLocation] = useState('성수역 1번 출구');
    const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);

  

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
      <div className="h-screen-mobile overflow-hidden bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <HeaderBar variant="logo" />

      {/* 메인 콘텐츠 - BottomNavigation 제외 */}
      <main className="pt-header-default bg-white max-w-7xl sm:mx-[1%] xs:mx-[3%] px-2 lg:px-8 flex flex-col flex-1 overflow-hidden">
        {/* 위치 선택 영역 - 높이 축소 */}
        <div className="flex items-center justify-between h-12 sm:mb-2 xs:mb-0 xs:pt-0 sm:pt-[3%] flex-shrink-0">
          <LocationSelector
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationChange}
            className="w-fit text-sm"
          />
          <CurrentLocationButton onLocationUpdate={handleLocationUpdate} />
        </div>

        {/* FlikCard 영역 - 남은 공간 모두 사용 */}
        <div className=" w-full flik-card-adaptive overflow-hidden flex-1 pb-[5%] flex items-center justify-center">
          <div className="sm:w-[98%] xs:w-[90%] h-full">
            <FlikCardLayout
              restaurants={sampleRestaurants}
              onSave={handleSave}
              onBlogReview={handleBlogReview}
              onKakaoMap={handleKakaoMap}
            />
          </div>
        </div>
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