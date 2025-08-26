// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, type SocialProvider } from '../stores/authStore';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsLoading(true);
    clearError();
    
    try {
      await login({ provider });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialProviders = [
    {
      provider: 'google' as SocialProvider,
      name: 'Google',
      color: 'bg-red-500 hover:bg-red-600',
      icon: '🔍'
    },
    {
      provider: 'kakao' as SocialProvider,
      name: 'Kakao',
      color: 'bg-yellow-400 hover:bg-yellow-500',
      textColor: 'text-gray-800',
      icon: '💬'
    },
    {
      provider: 'naver' as SocialProvider,
      name: 'Naver',
      color: 'bg-green-500 hover:bg-green-600',
      icon: 'N'
    },
    {
      provider: 'apple' as SocialProvider,
      name: 'Apple',
      color: 'bg-black hover:bg-gray-800',
      icon: '🍎'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                FLIK
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                당신의 순간을 특별하게 만드세요
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

            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              🚀 빠른 체험하기 (Google 계정)
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