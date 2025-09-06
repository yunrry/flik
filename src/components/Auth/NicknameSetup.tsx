import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface NicknameSetupProps {
  onComplete: () => void;
  isRequired?: boolean;
}

const NicknameSetup: React.FC<NicknameSetupProps> = ({ 
  onComplete, 
  isRequired = true 
}) => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateProfile, user } = useAuthStore();
  const navigate = useNavigate();

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

    setIsLoading(true);
    setError('');

    try {
      await updateProfile({ 
        nickname: nickname.trim(),
        profileImageUrl: user?.profileImageUrl 
      });
      onComplete();
    } catch (error) {
      setError(error instanceof Error ? error.message : '닉네임 설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (!isRequired) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            닉네임을 설정해주세요
          </h2>
          <p className="text-gray-600">
            다른 사용자들에게 표시될 닉네임입니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임 {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="2-10글자로 입력해주세요"
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${error ? 'border-red-300' : 'border-gray-300'}
              `}
              maxLength={10}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              한글, 영문, 숫자, _, - 사용 가능 (2-10글자)
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || !nickname.trim()}
              className={`
                w-full py-3 px-4 rounded-lg font-medium text-white
                transition-all duration-200
                ${isLoading || !nickname.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>설정 중...</span>
                </div>
              ) : (
                '완료'
              )}
            </button>

            {!isRequired && (
              <button
                type="button"
                onClick={handleSkip}
                disabled={isLoading}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                나중에 설정하기
              </button>
            )}
          </div>
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

export default NicknameSetup;