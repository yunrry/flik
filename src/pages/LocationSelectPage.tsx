import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import { SearchIcon } from '../components/Icons/SvgIcons';
import { Restaurant } from '../types/restaurant.types';

const LocationSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // PostingPage에서 전달받은 현재 선택된 장소
  const currentLocation = location.state?.currentLocation as Restaurant | null;
  const images = location.state?.images as File[];
  const content = location.state?.content as string;
  const title = location.state?.title as string;
  const returnPath = location.state?.returnPath || '/posting';




  const handleBackClick = () => {
    navigate(returnPath);
  };

  const handleLocationSelect = (selectedLocation: Restaurant) => {
    // 선택된 장소를 PostingPage로 전달
    navigate(returnPath, {
      state: { selectedLocation, images, content, title }
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // 실제 API 호출 대신 임시 데이터 사용
      // const response = await fetch(`/api/restaurants/search?q=${searchQuery}`);
      // const data = await response.json();
      
      // 임시 검색 결과 (Restaurant 타입 사용)
      const mockResults: Restaurant[] = [
        {
          id: '1',
          name: '마리오네',
          images: ['/cardImages/marione.png'],
          rating: 4.7,
          description: '세계 챔피언 마리오가 선보이는 전통 나폴리 피자와 파스타를 맛볼 수 있는 곳',
          address: '서울 성동구 성수동2가 299-50',
          location: '서울 성동구 성수동2가 299-50',
          category: '이탈리아 음식',
          hours: '12:00 ~ 18:00',
          coordinates: { lat: 37.5665, lng: 126.9780 }
        },
        {
          id: '2',
          name: '카페 로스터리',
          images: ['/cardImages/marione.png'],
          rating: 4.5,
          description: '직접 로스팅한 원두로 만드는 스페셜티 커피 전문점',
          address: '서울 성동구 성수동2가 277-44',
          location: '서울 성동구 성수동2가 277-44',
          category: '카페',
          hours: '09:00 ~ 22:00',
          coordinates: { lat: 37.5665, lng: 126.9780 }
        },
        {
          id: '3',
          name: '성수동 맛집',
          images: ['/cardImages/marione.png'],
          rating: 4.3,
          description: '현지인이 사랑하는 숨은 맛집, 정통 한식을 맛볼 수 있습니다',
          address: '서울 성동구 성수동1가 685-142',
          location: '서울 성동구 성수동1가 685-142',
          category: '한식',
          hours: '11:00 ~ 21:00',
          coordinates: { lat: 37.5665, lng: 126.9780 }
        }
      ].filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.address && restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (restaurant.location && restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('장소 검색 실패:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <HeaderBar 
        variant="back" 
        onBack={handleBackClick}
        title="장소 선택"
      />
      
      {/* 메인 콘텐츠 */}
      <main className="pt-header-default px-4 py-6">
        {/* 검색 바 */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="장소를 검색하세요"
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-1 focus:border-transparent"
              />
              <SearchIcon 
                size="sm" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="px-4 py-3 bg-main-1 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSearching ? '검색중...' : '검색'}
            </button>
          </div>
        </div>

        {/* 현재 선택된 장소 (있는 경우) */}
        {currentLocation && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">현재 선택된 장소</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{currentLocation.name}</p>
                <p className="text-sm text-gray-600">
                  {currentLocation.address || currentLocation.location}
                </p>
              </div>
              <button
                onClick={() => handleLocationSelect(currentLocation)}
                className="px-3 py-1 text-sm bg-main-1 text-white rounded-lg"
              >
                선택
              </button>
            </div>
          </div>
        )}

        {/* 검색 결과 */}
        <div className="space-y-3">
          {searchResults.map((restaurant) => (
            <div
              key={restaurant.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-main-1 cursor-pointer transition-colors"
              onClick={() => handleLocationSelect(restaurant)}
            >
              <h4 className="font-medium text-gray-800 mb-1">{restaurant.name}</h4>
              <p className="text-sm text-gray-600">
                {restaurant.address || restaurant.location}
              </p>
              {restaurant.category && (
                <p className="text-xs text-gray-500 mt-1">{restaurant.category}</p>
              )}
            </div>
          ))}
          
          {searchResults.length === 0 && searchQuery && !isSearching && (
            <div className="text-center py-8 text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LocationSelectPage;
