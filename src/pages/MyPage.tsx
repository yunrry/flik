// src/pages/MyPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { User, UserActivity } from '../types/user.types';
import { updateUserProfile } from '../api/userApi';
import ActivityItem from '../components/Profile/ActivityItem';
import FloatingUploadButton from '../components/UI/FloatingUploadButton';
import MyHeader from '../components/Layout/MyHeader';
import { getUserPosts } from '../api/postApi';
import { mapToUserActivity } from '../utils/mapUserActivity';
import { mapApiToPost } from '../types/post.types';
import { Post } from '../types/post.types';

const MyPage: React.FC = () => {
  const location = useLocation();
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [reviewActivities, setReviewActivities] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // location.state에서 업데이트된 데이터 가져오기
  const updatedNickname = location.state?.updatedNickname;
  const updatedProfileImage = location.state?.updatedProfileImage;

  // 업데이트된 데이터가 있으면 사용자 정보 즉시 업데이트
  useEffect(() => {
    if (user && (updatedNickname || updatedProfileImage)) {
      setUser({
        ...user,
        nickname: updatedNickname || user.nickname,
        profileImageUrl: updatedProfileImage || user.profileImageUrl,
      });
      
      // location.state 클리어 (뒤로가기 시 중복 적용 방지)
      navigate(location.pathname, { replace: true });
    }
  }, [updatedNickname, updatedProfileImage, user, setUser, navigate, location.pathname]);

  const handleUserUpdate = (updatedUser: User) => {
    updateUserProfile(updatedUser);
  };

  // 리뷰 활동 데이터 불러오기
  useEffect(() => {
    const fetchReviewActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getUserPosts();
        console.log('response', response);


        if (response.data.content && Array.isArray(response.data.content)) {
        const mappedData = response.data.content.map(mapApiToPost);
        setReviewActivities(mappedData);
        console.log('mappedData', mappedData);
        }
      } catch (err) {
        console.error('리뷰 활동 조회 실패:', err);
        setError('리뷰 내역을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewActivities();
  }, []);

  const handleActivityClick = (activity: Post) => {
    navigate(`/post/${activity.id}`);
    console.log('활동 클릭:', activity);
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

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleProfileImageChange = () => {
    navigate('/profile/image');
  };

  const handleNicknameChange = () => {
    navigate('/profile/nickname');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <MyHeader
        handleSettings={() => console.log('설정 이동')}
        profileImage={user?.profileImageUrl || '/assets/profile/defaultProfileImage.png'}
        nickname={user?.nickname || '사용자'}
        onProfileImageChange={handleProfileImageChange}
        onNicknameChange={handleNicknameChange}
      />

      {/* 메인 콘텐츠 */}
      <main className="pt-header-extended w-full px-0 lg:px-8 py-6">
        {/* 리뷰 활동 목록 */}
        <div className="space-y-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-1"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-gray-500">{error}</p>
            </div>
          ) : reviewActivities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">맛집을 방문하고 리뷰를 남겨보세요!</p>
            </div>
          ) : (
            reviewActivities.map((activity) => (
              <ActivityItem 
                key={activity.id} 
                activity={{
                  ...activity,
                  content: activity.content ?? '',
                  imageUrls: activity.imageUrls ?? [],
                  authorId: activity.authorId,
                  type: activity.type
                }}
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