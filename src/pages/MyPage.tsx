// src/pages/MyPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { HeaderBar } from '../components/Layout';
import ProfileSection from '../components/Profile/ProfileSection';
import { User, UserActivity } from '../types/user.types';
import { updateUserProfile, getUserReviews } from '../api/userApi';
import ActivityItem from '../components/Profile/ActivityItem';
import FloatingUploadButton from '../components/UI/FloatingUploadButton';


const MyPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [reviewActivities, setReviewActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MOCK_REVIEW_ACTIVITIES: UserActivity[] = [
    {
      id: 'review-1',
      userId: 'mock-user-id',
      type: 'review',
      title: '여름에 먹으러 가면 정말 좋은 강원도 마곡수',
      description: '분위기도 좋고 음식도 맛있었어요. 특히 피자가 정말 맛있었습니다.',
      imageUrl: '/cardImages/marione.png',
      relatedId: 'restaurant-1',
      createdAt: '2025.07.26',
      metadata: {
        restaurantName: '마리오네',
        location: '서울 성동구',
        rating: 4.7
      }
    },
    {
      id: 'review-2', 
      userId: 'mock-user-id',
      type: 'review',
      title: '도강원도강원도강원도강원',
      description: '재방문 의사 100%! 친구들과 함께 가기 좋은 곳이에요.',
      imageUrl: '/cardImages/marione.png', 
      relatedId: 'restaurant-2',
      createdAt: '2025.07.20',
      metadata: {
        restaurantName: '성수 브런치',
        location: '서울 성동구',
        rating: 4.3
      }
    },
    {
      id: 'review-3',
      userId: 'mock-user-id', 
      type: 'review',
      title: '홍대 맛집 발견! 가성비 최고의 이탈리안 레스토랑',
      description: '가격 대비 정말 만족스러웠어요. 파스타와 리조또 모두 맛있었습니다.',
      imageUrl: '/cardImages/marione.png',
      relatedId: 'restaurant-3',
      createdAt: '2025.07.15',
      metadata: {
        restaurantName: '홍대 파스타',
        location: '서울 마포구',
        rating: 4.5
      }
    },
    {
      id: 'review-4',
      userId: 'mock-user-id',
      type: 'review', 
      title: '강남 숨은 맛집, 현지인만 아는 그 곳',
      description: '관광객은 잘 모르는 로컬 맛집이에요. 사장님도 친절하시고 음식도 정말 맛있어요.',
      relatedId: 'restaurant-4',
      createdAt: '2025.07.10',
      metadata: {
        restaurantName: '강남 한식당',
        location: '서울 강남구', 
        rating: 4.8
      }
    },
    {
      id: 'review-5',
      userId: 'mock-user-id',
      type: 'review',
      title: '데이트 코스로 완벽한 분위기 좋은 레스토랑',
      description: '연인과 함께 가기 좋은 로맨틱한 분위기의 레스토랑입니다.',
      imageUrl: '/cardImages/marione.png',
      relatedId: 'restaurant-5', 
      createdAt: '2025.07.05',
      metadata: {
        restaurantName: '청담 레스토랑',
        location: '서울 강남구',
        rating: 4.6
      }
    }
  ];


  const handleUserUpdate = (updatedUser: User) => {
    updateUserProfile(updatedUser);
  };

  // 리뷰 활동 데이터 불러오기
  useEffect(() => {
    const fetchReviewActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 리뷰 타입 활동만 조회
        // const response = await getUserReviews(1, 20);
        // setReviewActivities(response.data);
        setReviewActivities(MOCK_REVIEW_ACTIVITIES);
      } catch (err) {
        console.error('리뷰 활동 조회 실패:', err);
        setError('리뷰 내역을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewActivities();
  }, []);


  // 활동 아이템 클릭 핸들러
  const handleActivityClick = (activity: UserActivity) => {
    console.log('활동 클릭:', activity);
    // 상세 페이지로 이동 등의 로직
  };

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
      <main className="pt-header-default w-full px-0 lg:px-8 py-6">

      <ProfileSection user={user!} onUserUpdate={handleUserUpdate} />

 {/* 리뷰 활동 목록 */}
      <div className="space-y-1">
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
          ) : reviewActivities.length === 0 ? (
            // 빈 상태
            <div className="text-center py-20">
              <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">맛집을 방문하고 리뷰를 남겨보세요!</p>
            </div>
          ) : (
            // 리뷰 활동 목록
            reviewActivities.map((activity) => (
              <ActivityItem 
                key={activity.id} 
                activity={activity}
                onClick={handleActivityClick}
              />
            ))
          )}
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

      {/* FloatingUploadButton */}
      <FloatingUploadButton />
    </div>
  );
};

export default MyPage;