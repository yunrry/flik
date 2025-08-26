// src/pages/FlikPage.tsx

import React, { useState } from 'react';

type FlikSection = 'featured' | 'community' | 'events' | 'brand';

const FlikPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<FlikSection>('featured');

  const sections = [
    { key: 'featured' as FlikSection, label: '추천', icon: '⭐' },
    { key: 'community' as FlikSection, label: '커뮤니티', icon: '👥' },
    { key: 'events' as FlikSection, label: '이벤트', icon: '🎉' },
    { key: 'brand' as FlikSection, label: '브랜드', icon: '🏷️' },
  ];

  // 임시 더미 데이터
  const featuredContent = [
    { id: 1, title: 'FLIK과 함께하는 순간들', subtitle: '특별한 순간을 담아보세요', image: '🌅' },
    { id: 2, title: '이주의 베스트 FLIK', subtitle: '사용자들이 선택한 최고의 사진들', image: '🏆' },
    { id: 3, title: '새로운 필터 출시', subtitle: '더욱 아름다운 사진을 만들어보세요', image: '🎨' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'featured':
        return (
          <div className="space-y-6">
            {featuredContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-6xl">{item.image}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.subtitle}
                  </p>
                  <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'community':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              커뮤니티 준비 중
            </h3>
            <p className="text-gray-500">
              곧 다양한 사용자들과 소통할 수 있는 공간이 열립니다
            </p>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-4">
            {[
              { title: '봄 사진 콘테스트', period: '2024.03.01 - 2024.03.31', status: '진행중' },
              { title: 'FLIK 1주년 기념 이벤트', period: '2024.04.01 - 2024.04.07', status: '예정' },
            ].map((event, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {event.title}
                  </h3>
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${event.status === '진행중' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                    }
                  `}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {event.period}
                </p>
              </div>
            ))}
          </div>
        );

      case 'brand':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                FLIK
              </h2>
              <p className="text-gray-600">
                당신의 순간을 특별하게 만드는 플랫폼
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">우리의 미션</h3>
                <p className="text-gray-600 text-sm">
                  일상의 소중한 순간들을 아름답게 담고, 사람들과 공유하며, 
                  추억을 더욱 특별하게 만드는 것입니다.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">핵심 가치</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• 창의적인 표현의 자유</li>
                  <li>• 진정한 순간의 공유</li>
                  <li>• 커뮤니티와의 연결</li>
                  <li>• 개인정보 보호</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <a href="#" className="hover:text-gray-700">이용약관</a>
                  <span>|</span>
                  <a href="#" className="hover:text-gray-700">개인정보처리방침</a>
                  <span>|</span>
                  <a href="#" className="hover:text-gray-700">고객지원</a>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-blue-600">
              FLIK
            </h1>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 17h5l-5 5v-5zM6 2v16a2 2 0 002 2h5v-4a1 1 0 011-1h4V4a2 2 0 00-2-2H8a2 2 0 00-2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 섹션 네비게이션 */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex space-x-1 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap
                  transition-colors duration-200
                  ${activeSection === section.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        {renderContent()}
      </div>
    </div>
  );
};

export default FlikPage;