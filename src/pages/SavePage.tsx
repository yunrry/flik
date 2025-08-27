// src/pages/SavePage.tsx

import React, { useState } from 'react';
import { HeaderBar } from '../components/Layout';

type SaveCategory = 'all' | 'photos' | 'places' | 'favorites';

const SavePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SaveCategory>('all');

  const categories = [
    { key: 'all' as SaveCategory, label: '전체', count: 24 },
    { key: 'photos' as SaveCategory, label: '사진', count: 12 },
    { key: 'places' as SaveCategory, label: '장소', count: 8 },
    { key: 'favorites' as SaveCategory, label: '즐겨찾기', count: 4 },
  ];

  // 임시 더미 데이터
  const savedItems = [
    { id: 1, type: 'photo', title: '아름다운 석양', location: '한강공원', date: '2024-03-15' },
    { id: 2, type: 'place', title: '맛있는 카페', location: '강남구', date: '2024-03-14' },
    { id: 3, type: 'photo', title: '봄 벚꽃', location: '여의도', date: '2024-03-13' },
    { id: 4, type: 'favorite', title: '좋아한 사진', location: '홍대', date: '2024-03-12' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? savedItems 
    : savedItems.filter(item => item.type === activeCategory.slice(0, -1));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <HeaderBar variant="logo" />

{/* 메인 콘텐츠 - 헤더 높이만큼 패딩 추가 */}
<main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 카테고리 탭 */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex space-x-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap
                  transition-colors duration-200
                  ${activeCategory === category.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <span>{category.label}</span>
                <span className={`
                  px-2 py-0.5 text-xs rounded-full
                  ${activeCategory === category.key
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 저장된 아이템 목록 */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* 썸네일 */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.type === 'photo' && <span className="text-2xl">📷</span>}
                    {item.type === 'place' && <span className="text-2xl">📍</span>}
                    {item.type === 'favorite' && <span className="text-2xl">❤️</span>}
                  </div>

                  {/* 컨텐츠 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-medium truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.date}
                    </p>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 빈 상태 */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💾</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              저장된 항목이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              마음에 드는 사진이나 장소를 저장해보세요
            </p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              탐색하기
            </button>
          </div>
        )}
      </div>
      </main>
  
    </div>

  );
};

export default SavePage;