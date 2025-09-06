// src/pages/OAuthCallbackPage.tsx

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback, isLoading } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // 저장된 provider와 state 확인
      const savedProvider = sessionStorage.getItem('oauth_provider') as 'google' | 'kakao';
      const savedState = sessionStorage.getItem('oauth_state');
      const returnUrl = sessionStorage.getItem('oauth_return_url') || '/';

      if (error) {
        console.error('OAuth Error:', error, errorDescription);
        // 에러 발생 시 원래 페이지로 돌아가면서 에러 표시
        navigate(`/login?error=oauth_error&message=${encodeURIComponent(errorDescription || error)}`, { replace: true });
        return;
      }

      if (!code) {
        console.error('Authorization code not found');
        navigate('/login?error=invalid_callback', { replace: true });
        return;
      }

      if (!savedProvider) {
        console.error('OAuth provider not found in session');
        navigate('/login?error=invalid_session', { replace: true });
        return;
      }

      // state 검증 (CSRF 공격 방지)
      if (savedState && state !== savedState) {
        console.error('OAuth state mismatch');
        navigate('/login?error=state_mismatch', { replace: true });
        return;
      }

      try {
        console.log('Processing OAuth callback with code:', code);
        
        await handleOAuthCallback({
          provider: savedProvider,
          code,
          state: state || undefined,
        });
        
        // OAuth 관련 세션 데이터 정리
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_provider');
        sessionStorage.removeItem('oauth_return_url');
        
        console.log('OAuth success, redirecting to:', returnUrl);
        
        // 성공시 원래 페이지로 리다이렉트
        navigate(returnUrl, { replace: true });
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate(`/login?error=callback_failed&message=${encodeURIComponent(error instanceof Error ? error.message : '로그인 처리 실패')}`, { replace: true });
      }
    };

    // 잠시 대기 후 처리 (UI 표시를 위해)
    const timer = setTimeout(processCallback, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate, handleOAuthCallback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            로그인 처리 중...
          </h2>
          <p className="text-gray-600">
            잠시만 기다려주세요.
          </p>
          
          {isLoading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;