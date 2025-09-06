// src/pages/OAuthSuccessPage.tsx

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/authApi';

const OAuthSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  useEffect(() => {
    const processSuccess = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        console.error('Missing required OAuth success parameters');
        navigate('/login?error=invalid_oauth_response', { replace: true });
        return;
      }

      try {
        // 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        authApi.setAccessToken(accessToken);

        // 사용자 정보 로드
        const response = await authApi.getMe();
        
        if (response.success && response.data) {
          // Zustand store에 사용자 정보 설정
          useAuthStore.setState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('OAuth login successful, user:', response.data);
          
          // 홈페이지로 리다이렉트
          navigate('/', { replace: true });
        } else {
          throw new Error('사용자 정보를 가져올 수 없습니다.');
        }

      } catch (error) {
        console.error('OAuth success processing error:', error);
        
        // 토큰 정리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        authApi.setAccessToken(null);
        
        navigate('/login?error=oauth_processing_failed', { replace: true });
      }
    };

    // 잠시 대기 후 처리
    const timer = setTimeout(processSuccess, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            로그인 성공!
          </h2>
          <p className="text-gray-600 mb-4">
            잠시만 기다려주세요.
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;