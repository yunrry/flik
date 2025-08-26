// src/pages/MyPage.tsx

import React from 'react';
import { useAuthStore } from '../stores/authStore';

const MyPage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">
              마이페이지
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 프로필 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            {/* 프로필 이미지 */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="프로필" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-blue-600">
                  {user?.nickname?.charAt(0) || '👤'}
                </span>
              )}
            </div>

            {/* 사용자 정보 */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.nickname || '사용자'}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {user?.provider} 계정
              </p>
              {user?.providerName && (
                <p className="text-xs text-gray-400">
                  {user.providerName}
                </p>
              )}
            </div>

            {/* 설정 버튼 */}
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 메뉴 섹션 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="divide-y divide-gray-200">
            {[
              { title: '내 활동', icon: '📊', badge: null },
              { title: '즐겨찾기', icon: '❤️', badge: null },
              { title: '설정', icon: '⚙️', badge: null },
              { title: '고객지원', icon: '💬', badge: null },
              { title: '약관 및 정책', icon: '📄', badge: null },
            ].map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-gray-900">{item.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={handleLogout}
            className="w-full p-4 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
          >
            로그아웃
          </button>
        </div>

        {/* 앱 정보 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            FLIK v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;