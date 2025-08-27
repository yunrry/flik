// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { HeaderBar } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

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
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
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
      <main className="pt-header-extended max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 웰컴 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                안녕하세요, {user?.nickname}님! 👋
              </h2>
              <p className="text-gray-600 text-sm">
    
        
              'FLIK에서 특별한 순간들을 공유해보세요'
        
              </p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              📷 사진 올리기
            </button>
          </div>
        </div>

      
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

    
    </div>
  );
};

export default HomePage;