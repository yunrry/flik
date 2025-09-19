// src/pages/SpotDetailMapPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useKakaoMapReady } from '../contexts/KakaoMapProvider';
import { SpotDetail } from '../types/spot.types';

interface MapPageState {
  spots: SpotDetail[];
  returnPath?: string;
}

const SpotMapPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isReady, isLoading, error } = useKakaoMapReady();
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spots, setspots] = useState<SpotDetail[]>([]);

  // URL에서 전달받은 데이터
  const state = location.state as MapPageState;

  // 초기 데이터 설정
  useEffect(() => {
    console.log('state', state);
    if (state?.spots && state.spots.length > 0) {
      setspots(state.spots);
      setCurrentIndex(0);
    } else {


    }
  }, [state]);

  // 카카오맵 생성
  useEffect(() => {
    console.log('isReady', isReady);
    console.log('mapContainer.current', mapContainer.current);
    console.log('spots.length', spots.length);
    if (!isReady || !mapContainer.current || spots.length === 0) return;

    try {
      const { kakao } = window;
      const currentSpotDetail = spots[currentIndex];
      
      if (!currentSpotDetail.latitude || !currentSpotDetail.longitude) return;

      // 지도 생성
      const options = {
        center: new kakao.maps.LatLng(
          currentSpotDetail.latitude, 
          currentSpotDetail.longitude
        ),
        level: 3
      };

      const map = new kakao.maps.Map(mapContainer.current, options);
      mapInstance.current = map;

      // 마커 생성
      const markerPosition = new kakao.maps.LatLng(
        currentSpotDetail.latitude,
        currentSpotDetail.longitude
      );
      
      const marker = new kakao.maps.Marker({
        position: markerPosition
      });
      
      marker.setMap(map);

      // 인포윈도우
      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${currentSpotDetail.name}</div>`
      });
      
      kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });

    } catch (error) {
      console.error('지도 생성 실패:', error);
    }
  }, [isReady, spots, currentIndex]);

  // 이전/다음 맛집
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < spots.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 로딩/에러 처리
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-500 mb-4">지도를 불러올 수 없습니다</p>
        <button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded">
          돌아가기
        </button>
      </div>
    );
  }

  if (isLoading || spots.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentSpotDetail = spots[currentIndex];

  return (
    <div className="fixed inset-0 bg-white">
      {/* 지도 영역 */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* 상단 컨트롤 */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          ←
        </button>
      </div>

      {/* 페이지 인디케이터 */}
      {spots.length > 1 && (
        <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {spots.length}
        </div>
      )}

      {/* 바텀 시트 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl min-h-[20vh] max-h-[40vh]">
        {/* 드래그 핸들 */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-6 pb-6">
          {/* 맛집 정보 */}
          <div className="flex items-start space-x-4 mb-4">
            {currentSpotDetail.imageUrls?.[0] && (
              <img 
                src={currentSpotDetail.imageUrls?.[0]} 
                alt={currentSpotDetail.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {currentSpotDetail.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold">{currentSpotDetail.rating}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {currentSpotDetail.description}
              </p>
            </div>
          </div>

          {/* 주소와 영업시간 */}
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div>📍 {currentSpotDetail.address}</div>
          </div>

          {/* 네비게이션 버튼 */}
          {spots.length > 1 && (
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded disabled:opacity-50  absolute left-[1%] top-[40%]"
              >
                ←
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === spots.length - 1}
                className="px-4 py-2 rounded disabled:opacity-50 absolute right-[1%] top-[40%]"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotMapPage;