// src/pages/FlikPage.tsx

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LocationPermissionModal } from '../components/Location';
import { LocationSelector } from '../components/Location';
import { CurrentLocationButton } from '../components/Location';

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

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    console.log('선택된 지역:', location);
  };
  
    // 위치 권한 상태 관리
    const [isFirstVisit, setIsFirstVisit] = useState(true);
  
    const handleLocationUpdate = (location: any) => {
      console.log('위치 업데이트:', location);
    };
  
    const handleLocationSelect = (location: string) => {
      console.log('선택된 지역:', location);
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
  
    // 임시 피드 데이터
    const feedItems = [
      {
        id: 1,
        user: { name: '사진작가', avatar: '📸' },
        location: '한강공원',
        time: '2시간 전',
        image: '🌅',
        likes: 24,
        comments: 8,
        description: '아름다운 한강 석양을 담았습니다'
      },
      {
        id: 2,
        user: { name: '여행러버', avatar: '✈️' },
        location: '제주도',
        time: '5시간 전',
        image: '🌴',
        likes: 156,
        comments: 23,
        description: '제주도의 푸른 바다와 하늘'
      },
      {
        id: 3,
        user: { name: '카페탐방', avatar: '☕' },
        location: '홍대입구',
        time: '1일 전',
        image: '🏪',
        likes: 89,
        comments: 12,
        description: '숨겨진 보석같은 카페 발견!'
      }
    ];
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-blue-600">
                  FLIK
                </h1>
                {currentLocation && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    📍 위치 활성화
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 17h5l-5 5v-5zM6 2v16a2 2 0 002 2h5v-4a1 1 0 011-1h4V4a2 2 0 00-2-2H8a2 2 0 00-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
  
        {/* 메인 콘텐츠 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
        <LocationSelector
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationChange}
        className="w-fit"
      />
          <CurrentLocationButton onLocationUpdate={handleLocationUpdate} />
      </div>
   
          {/* 웰컴 섹션 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  안녕하세요, {user?.nickname}님! 👋
                </h2>
                <p className="text-gray-600 text-sm">
                  {currentLocation 
                    ? '주변의 멋진 순간들을 발견해보세요'
                    : 'FLIK에서 특별한 순간들을 공유해보세요'
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                {!currentLocation && (
                  <button 
                    onClick={requestLocationAgain}
                    className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    📍 위치 허용
                  </button>
                )}
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  📷 사진 올리기
                </button>
              </div>
            </div>
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
  
          {/* 피드 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              추천 피드
            </h3>
            
            {feedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* 피드 헤더 */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span>{item.user.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.user.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">📍</span>
                        <span className="mr-2">{item.location}</span>
                        <span>•</span>
                        <span className="ml-2">{item.time}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
  
                {/* 피드 이미지 */}
                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">{item.image}</span>
                </div>
  
                {/* 피드 액션 */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">{item.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">{item.comments}</span>
                      </button>
                    </div>
                    <button className="text-gray-600 hover:text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
  
                  <p className="text-gray-700 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
  
          {/* 더보기 */}
          <div className="text-center py-8">
            <button className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              더 많은 피드 보기
            </button>
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