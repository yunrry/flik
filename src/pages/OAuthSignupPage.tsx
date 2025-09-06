// src/pages/OAuthSignupPage.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const OAuthSignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  
  const { completeOAuthSignup, isLoading, error: authError, clearError } = useAuthStore();
  
  // URL 파라미터에서 OAuth 정보 추출
  const provider = searchParams.get('provider');
  const tempKey = searchParams.get('temp_key');

  useEffect(() => {
    // 필수 파라미터 확인
    if (!provider || !tempKey) {
      navigate('/login?error=invalid_signup_data', { replace: true });
    }
  }, [provider, tempKey, navigate]);

  const validateNickname = (value: string): string | null => {
    if (!value.trim()) {
      return '닉네임을 입력해주세요.';
    }
    if (value.length < 2) {
      return '닉네임은 2글자 이상이어야 합니다.';
    }
    if (value.length > 10) {
      return '닉네임은 10글자 이하여야 합니다.';
    }
    if (!/^[가-힣a-zA-Z0-9_-]+$/.test(value)) {
      return '닉네임은 한글, 영문, 숫자, _, - 만 사용할 수 있습니다.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateNickname(nickname);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!tempKey) {
      setError('OAuth 인증 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    setError('');
    clearError();

    try {
      await completeOAuthSignup({
        provider: provider || '',
        tempKey,
        nickname: nickname.trim(),
      });

      console.log('OAuth signup successful');

      // 홈페이지로 리다이렉트
      navigate(window.location.href = '/', { replace: true });
      
    } catch (error) {
      console.error('OAuth signup error:', error);
      // authStore의 에러는 자동으로 표시됨
    }
  };

  const handleInputChange = (value: string) => {
    setNickname(value);
    setError('');
    clearError();
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'kakao': return '카카오';
      case 'google': return '구글';
      default: return provider;
    }
  };

  const displayError = error || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">

          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getProviderName(provider || '')} 회원가입
          </h2>
          <p className="text-gray-600">
            마지막 단계입니다! 닉네임을 설정해주세요.
          </p>
    
        </div>

        {displayError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm">{displayError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="2-10글자로 입력해주세요"
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${displayError ? 'border-red-300' : 'border-gray-300'}
              `}
              maxLength={10}
              autoFocus
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-gray-500">
              한글, 영문, 숫자, _, - 사용 가능 (2-10글자)
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !nickname.trim() || !tempKey}
            className={`
              w-full py-3 px-4 rounded-lg font-medium text-white
              transition-all duration-200
              ${isLoading || !nickname.trim() || !tempKey
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>회원가입 중...</span>
              </div>
            ) : (
              '회원가입 완료'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            닉네임은 언제든지 마이페이지에서 변경할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthSignupPage;