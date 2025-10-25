// src/pages/LoginPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore, type SocialProvider } from '../stores/authStore';
import { LogoIcon } from '../components/Icons';
import EmailAuthForm from '../components/Auth/EmailAuthForm';
import OAuthCallback from '../components/Auth/OAuthCallback';
import NicknameSetup from '../components/Auth/NicknameSetup';

const LoginPage: React.FC = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showNicknameSetup, setShowNicknameSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { socialLogin, user, isAuthenticated, error, clearError, guestLogin} = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // OAuth 콜백 처리 확인
  const isOAuthCallback = searchParams.has('code');
  const hasError = searchParams.has('error');

  useEffect(() => {
    // 이미 로그인된 경우 홈으로 리다이렉트
    if (isAuthenticated && user) {
      // 닉네임이 없거나 기본값인 경우 닉네임 설정 화면으로
      if (!user.nickname || user.nickname.trim() === '') {
        setShowNicknameSetup(true);
      } else {
        navigate('/', { replace: true });
      }
    }

    // URL 에러 파라미터 처리
    if (hasError) {
      const errorType = searchParams.get('error');
      const errorMessage = searchParams.get('message');
      
      console.log('OAuth Error Details:', { errorType, errorMessage });
      
      switch (errorType) {
        case 'oauth_error':
          console.error('OAuth 인증 오류가 발생했습니다.', errorMessage);
          break;
        case 'invalid_callback':
          console.error('잘못된 콜백 요청입니다.');
          break;
        case 'invalid_session':
          console.error('세션이 유효하지 않습니다.');
          break;
        case 'state_mismatch':
          console.error('보안 검증에 실패했습니다.');
          break;
        case 'callback_failed':
          console.error('로그인 처리 중 오류가 발생했습니다.');
          break;
        default:
          console.error('알 수 없는 오류:', errorType, errorMessage);
      }
      // 에러 파라미터 제거
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, hasError, searchParams, navigate]);

  // OAuth 콜백 처리 중인 경우
  if (isOAuthCallback) {
    return <OAuthCallback />;
  }

  // 닉네임 설정 화면
  if (showNicknameSetup) {
    return (
      <NicknameSetup
        onComplete={() => {
          setShowNicknameSetup(false);
          navigate('/', { replace: true });
        }}
        isRequired={true}
      />
    );
  }

  // 이메일 로그인 폼
  if (showEmailForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="mb-6">
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  뒤로 가기
                </button>
              </div>
              
              <EmailAuthForm
                onSuccess={() => {
                  // 이메일 로그인/회원가입 성공 후 처리
                  setShowEmailForm(false);
                  navigate('/', { replace: true });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsLoading(true);
    clearError();
    
    try {
      await socialLogin(provider);
    } catch (error) {
      console.error('Social login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialProviders = [
    {
      provider: 'google' as SocialProvider,
      name: 'Google',
      color: 'bg-blue-1 hover:bg-blue-1',
      icon: '🔍'
    },
    {
      provider: 'kakao' as SocialProvider,
      name: 'Kakao',
      color: 'bg-yellow-400 hover:bg-yellow-500',
      textColor: 'text-gray-800',
      icon: '💬'
    }
  ];

  return (
    <div className="min-h-screen bg-white ">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            
            <div className="text-center items-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                <LogoIcon size="xxl" className="mx-auto" />
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                관광지 맛집 고르는 고민, 스와이프로 끝
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {socialProviders.map((social) => (
                <button
                  key={social.provider}
                  onClick={() => handleSocialLogin(social.provider)}
                  disabled={isLoading}
                  className={`
                    w-full p-4 rounded-lg font-medium
                    flex items-center justify-center gap-3
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${social.color}
                    ${social.textColor || 'text-white'}
                    transform active:scale-95
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>로그인 중...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">{social.icon}</span>
                      <span>{social.name}로 시작하기</span>
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">또는</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* 게스트 로그인 버튼 */}
            <button
              onClick={async () => {
                setIsLoading(true);
                clearError();
                try {
                  await guestLogin();
                  // 로그인 후 홈으로 이동
                  navigate('/', { replace: true });
                } catch (error) {
                  console.error('Guest login failed:', error);
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full p-4 rounded-lg font-medium bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                  <span>로그인 중...</span>
                </>
              ) : (
                <span>👤 게스트로 로그인하기</span>
              )}
            </button>


            <button
              onClick={() => setShowEmailForm(true)}
              disabled={isLoading}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors gap-2 mt-3"
            >
               {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>로그인 중...</span>
                    </>
                  ) : (
                    <>
                      <span>📧 이메일로 로그인/회원가입</span>
                    </>
                  )}
              
            </button>


            {/* 개발자 사이트 바로가기 버튼 */}
            <button
              onClick={() => window.open('https://yunrry.github.io/', '_blank')}
              className="w-full p-3 border border-gray-300 rounded-lg font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 mt-3"
            >
              <span>🔧</span>
              <span>개발자 사이트</span>
            </button>


            <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
              로그인 시{' '}
              <a href="#" className="text-blue-600 hover:underline">이용약관</a>
              {' '}및{' '}
              <a href="#" className="text-blue-600 hover:underline">개인정보처리방침</a>
              에<br />동의한 것으로 간주됩니다.
            </p>

            <div className="text-center mt-8 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                FLIK v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default LoginPage;