import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback, error } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      
      // 에러가 있는 경우
      if (error) {
        console.error('OAuth Error:', error);
        navigate('/login?error=oauth_error', { replace: true });
        return;
      }

      // 코드가 없는 경우
      if (!code) {
        console.error('Authorization code not found');
        navigate('/login?error=invalid_callback', { replace: true });
        return;
      }

      // 저장된 provider와 state 확인
      const savedProvider = sessionStorage.getItem('oauth_provider') as 'google' | 'kakao';
      const savedState = sessionStorage.getItem('oauth_state');

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
        await handleOAuthCallback({
          provider: savedProvider,
          code,
          state: state || undefined,
        });
        
        // 성공시 홈으로 리다이렉트
        navigate('/', { replace: true });
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=callback_failed', { replace: true });
      }
    };

    handleCallback();
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
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;