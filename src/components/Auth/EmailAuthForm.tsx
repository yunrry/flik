import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

interface EmailAuthFormProps {
  onSuccess: () => void;
}

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ onSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup, error: authError, clearError } = useAuthStore();

  const validateEmail = (email: string): string | null => {
    if (!email) return '이메일을 입력해주세요.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '올바른 이메일 형식을 입력해주세요.';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return '비밀번호는 대소문자와 숫자를 포함해야 합니다.';
    }
    return null;
  };

  const validateNickname = (nickname: string): string | null => {
    if (!nickname) return '닉네임을 입력해주세요.';
    if (nickname.length < 2) return '닉네임은 2글자 이상이어야 합니다.';
    if (nickname.length > 10) return '닉네임은 10글자 이하여야 합니다.';
    if (!/^[가-힣a-zA-Z0-9_-]+$/.test(nickname)) {
      return '닉네임은 한글, 영문, 숫자, _, - 만 사용할 수 있습니다.';
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }

      const nicknameError = validateNickname(formData.nickname);
      if (nicknameError) newErrors.nickname = nicknameError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isSignup) {
        await signup({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    });
    setErrors({});
    clearError();
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isSignup ? '회원가입' : '로그인'}
        </h2>
        <p className="text-gray-600">
          {isSignup ? '새 계정을 만들어보세요' : '기존 계정으로 로그인하세요'}
        </p>
      </div>

      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{authError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="example@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={isSignup ? '8자 이상, 대소문자+숫자 포함' : '비밀번호를 입력하세요'}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password (회원가입 시에만) */}
        {isSignup && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {/* Nickname (회원가입 시에만) */}
        {isSignup && (
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nickname ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="2-10글자로 입력해주세요"
              maxLength={10}
              disabled={isLoading}
            />
            {errors.nickname && (
              <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isSignup ? '가입 중...' : '로그인 중...'}</span>
            </div>
          ) : (
            isSignup ? '회원가입' : '로그인'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={toggleMode}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {isSignup 
            ? '이미 계정이 있으신가요? 로그인하기' 
            : '계정이 없으신가요? 회원가입하기'
          }
        </button>
      </div>
    </div>
  );
};

export default EmailAuthForm;