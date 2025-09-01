// src/pages/SavePage.tsx

import React, { useState, useEffect } from 'react';
import { HeaderBar } from '../components/Layout';
import SavedFlikCard from '../components/Feed/SavedFlikCard';
import { useThridParty } from '../hooks/useThridParty';
import { useAuthStore } from '../stores/authStore';
import { MapIcon } from '../components/Icons/SvgIcons';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
  id: string;
  name: string;
  images: string[];
  rating: number;
  description: string;
  address: string;
  distance?: number;
  hours: string;
  category?: string;
  location?: string;
  priceRange?: string;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const SavePage: React.FC = () => {
  const { user } = useAuthStore();
  const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleMapClick } = useThridParty();
  const navigate = useNavigate();





  // 저장된 맛집 데이터 불러오기
  useEffect(() => {
    const fetchSavedRestaurants = async () => {
      try {
        setIsLoading(true);
        // API 호출 대신 임시 데이터 사용
        const mockData: Restaurant[] = [
          {
            id: '1',
            name: '마리오네',
            images: ['/cardImages/marione.png'],
            rating: 4.7,
            description: '세계 챔피언 마리오가 선보이는 전통 나폴리 피자와 파스타를 맛볼 수 있는 곳',
            address: '서울 성동구',
            distance: 1200,
            category: '이탈리아 음식',
            location: '서울 성동구',
            hours: '12:00 ~ 18:00',
            coordinates: {
              lat: 37.5665,
              lng: 126.9780
            }

          },
          {
            id: '2',
            name: '성수동 맛집',
            images: [
              '/cardImages/marione.png',
              
            ],
            rating: 4.3,
            description: '현지인이 사랑하는 숨은 맛집, 정통 한식을 맛볼 수 있습니다',
            address: '서울 성동구 성수동1가 685-142',
            distance: 520,
            location: '서울 성동구',
            hours: '11:00 ~ 21:00',
            coordinates: {
              lat: 37.5665,
              lng: 126.9780
            }

          },
          {
            id: '3',
            name: '마리오네',
            images: ['/cardImages/marione.png'],
            rating: 4.7,
            description: '세계 챔피언 마리오가 선보이는 전통 나폴리 피자와 파스타를 맛볼 수 있는 곳',
            address: '서울 성동구',
            distance: 160,
            category: '이탈리아 음식',
            location: '서울 성동구',
            hours: '12:00 ~ 18:00',
            coordinates: {
              lat: 37.5665,
              lng: 126.9780
            }
          },
          {
            id: '4',
            name: '마리오네',
            images: ['/cardImages/marione.png'],
            rating: 4.7,
            description: '세계 챔피언 마리오가 선보이는 전통 나폴리 피자와 파스타를 맛볼 수 있는 곳',
            address: '서울 성동구',
            distance: 450,
            category: '이탈리아 음식',
            location: '서울 성동구',
            hours: '12:00 ~ 18:00',
            coordinates: {
              lat: 37.5665,
              lng: 126.9780
            }
          }
        ];
        
        setSavedRestaurants(mockData);
      } catch (err) {
        console.error('저장된 맛집 불러오기 실패:', err);
        setError('저장된 맛집을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedRestaurants();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <HeaderBar variant="logo" />
      
      {/* 메인 콘텐츠 - 헤더 높이만큼 패딩 추가 */}
      <main className="pt-header-default w-full px-0 lg:px-8 py-6">
        {/* 페이지 제목 */}
        <div className="px-[5%] py-[3%]">
          <div className="flex items-center justify-between"
          onClick={() => handleMapClick(savedRestaurants, '/save')}
          >
            <MapIcon size="md"/>

            <span className="text-sm text-gray-500">총 {savedRestaurants.length}개의 매장</span>
          </div>
        </div>

        {/* 저장된 맛집 목록 */}
        <div className="flex flex-col gap-0 justify-start">
          {isLoading ? (
            // 로딩 상태
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            // 에러 상태
            <div className="text-center py-20">
              <p className="text-gray-500">{error}</p>
            </div>
          ) : savedRestaurants.length === 0 ? (
            // 빈 상태
            <div className="text-center py-20">
              <p className="text-gray-500">저장된 맛집이 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">플릭 카드에서 맛집을 저장해보세요!</p>
            </div>
          ) : (
            // 맛집 카드들
            savedRestaurants.map((restaurant, index) => (
              <div key={restaurant.id}>
                <SavedFlikCard restaurant={restaurant} />
                {(savedRestaurants.length > 1 && index !== savedRestaurants.length - 1) && (
                  <div className="h-[1px] bg-gray-10 my-0 mx-[3%]"></div>
                )}
              </div>
             ))
          )}
        </div>
      </main>
    </div>
  );
};



export default SavePage;