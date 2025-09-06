import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    socialLogin,
    logout,
    updateProfile,
    loadUser,
    refreshToken,
    clearError,
  } = useAuthStore();

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && !user) {
      loadUser();
    }
  }, [user, loadUser]);

  // 토큰 만료 시 자동 갱신
  useEffect(() => {
    const setupTokenRefresh = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        // JWT 토큰의 만료 시간 확인
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const expirationTime = payload.exp * 1000; // 초를 밀리초로 변환
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        // 만료 5분 전에 토큰 갱신
        const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

        if (refreshTime > 0) {
          const timeoutId = setTimeout(() => {
            refreshToken();
          }, refreshTime);

          return () => clearTimeout(timeoutId);
        } else if (timeUntilExpiry <= 0) {
          // 이미 만료된 토큰인 경우
          refreshToken();
        }
      } catch (error) {
        console.error('Token parsing error:', error);
        // 토큰이 유효하지 않으면 로그아웃
        logout();
      }
    };

    if (isAuthenticated) {
      const cleanup = setupTokenRefresh();
      return cleanup;
    }
  }, [isAuthenticated, refreshToken, logout]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    signup,
    socialLogin,
    logout,
    updateProfile,
    clearError,
    
    // Computed
    isLoggedIn: isAuthenticated && !!user,
    hasNickname: user?.nickname && user.nickname.trim() !== '',
  };
};

// 인증이 필요한 페이지에서 사용하는 Hook
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

// 프로필 완성도 체크 Hook
export const useProfileCompletion = () => {
  const { user } = useAuth();

  const profileCompletion = {
    hasEmail: !!user?.email,
    hasNickname: !!(user?.nickname && user.nickname.trim() !== ''),
    hasProfileImage: !!user?.profileImageUrl,
    completionPercentage: 0,
  };

  // 완성도 계산
  const completedFields = Object.values(profileCompletion).filter(
    (value, index) => index < 3 && value
  ).length;
  profileCompletion.completionPercentage = Math.round((completedFields / 3) * 100);

  return {
    ...profileCompletion,
    isProfileComplete: profileCompletion.completionPercentage === 100,
    isProfileIncomplete: profileCompletion.completionPercentage < 100,
  };
};