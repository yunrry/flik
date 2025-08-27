// src/pages/MyPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { HeaderBar } from '../components/Layout';

const MyPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <HeaderBar variant="my" />

      {/* 메인 콘텐츠 - 헤더 높이만큼 패딩 추가 */}
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

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
            onClick={handleLogoutClick}
            className="w-full p-4 text-red-600 hover:bg-red-50 transition-colors rounded-lg font-medium"
          >
            로그아웃
          </button>
        </div>

        {/* 로그아웃 확인 모달 */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                로그아웃 하시겠습니까?
              </h3>
              <p className="text-gray-600 mb-6">
                로그아웃하면 다시 로그인이 필요합니다.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 앱 정보 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            FLIK v1.0.0
          </p>
        </div>
      </main>
    </div>
  );
};

export default MyPage;