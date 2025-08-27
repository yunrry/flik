// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { HeaderBar } from '../components/Layout';
import MainBanner from '../components/Feed/MainBanner';
import CategoryList from '../components/Feed/CategoryList';
import PostFeed from '../components/Feed/PostFeed';
import { useBanner } from '../hooks/useBanner';
import { useCategory } from '../hooks/useCategory';
import { usePostFeed } from '../hooks/usePostFeed';

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

const HomePage: React.FC = () => {
  const { banners, isLoading: bannersLoading, handleBannerClick } = useBanner();
  const { categories, activeCategory, isLoading: categoriesLoading, handleCategorySelect } = useCategory();
  const { posts, isLoading: postsLoading, hasMore, loadMorePosts } = usePostFeed();

  


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
      <HeaderBar variant="logo" />
      {/* 메인 콘텐츠 - 헤더 높이만큼 패딩 추가 */}
      <main className="pt-header-default w-full sm:max-w-7xl sm:mx-auto px-0 sm:px-6 lg:px-8 py-6">


     {/* 메인 배너 섹션 */}
        <div className="w-full mx-auto mb-8">
          {bannersLoading ? (
            <div className="w-full h-52 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-gray-500">배너 로딩 중...</span>
            </div>
          ) : (
            <MainBanner 
              banners={banners} 
              onBannerClick={handleBannerClick}
              autoSlide={true}
              slideInterval={5000}
            />
          )}
        </div>


        {/* 지역별 장소 카테고리 섹션 */}
        <div className="mb-8 px-2 sm:px-0">
          <div className="flex items-start justify-between mb-2 px-2 sm:px-0">
            <h3 className="text-base font-semibold font-['Pretendard'] leading-normal text-gray-1">
              지역별 플릭 장소
            </h3>
          </div>

          {categoriesLoading ? (
            <div className="flex gap-4 px-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <CategoryList
              categories={categories}
              activeCategory={activeCategory}
              onCategorySelect={handleCategorySelect}
              showScrollIndicator={categories.length > 5}
      
            />
          )}
        </div>


      
        {/* 피드 */}
        <div className="space-y-6 px-2 sm:px-0">
        <div className="flex items-start justify-between mb-2 px-2 sm:px-0">
            <h3 className="text-base font-semibold font-['Pretendard'] leading-normal text-gray-1">
              지금 주목할 만한 도시
            </h3>
          </div>
          


          <div className="flex-col items-start justify-between mb-2 px-2 sm:px-0">

            <h3 className="text-base font-semibold font-['Pretendard'] leading-normal text-gray-1 mb-2">
              인기 블로그/여행기
            </h3>

            <PostFeed
            posts={posts}
            isLoading={postsLoading}
            hasMore={hasMore}
            onLoadMore={loadMorePosts}
          />
          </div>



              
        </div>
 



      </main>

    
    </div>
  );
};

export default HomePage;