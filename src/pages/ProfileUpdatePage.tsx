import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore'; // 실제 경로에 맞게 수정
import { uploadToCloudinary } from '../utils/cloudinary';

interface ProfileUpdatePageProps {}

const ProfileUpdatePage: React.FC<ProfileUpdatePageProps> = () => {
  const { type } = useParams<{ type: 'image' | 'nickname' }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProfile, user } = useAuthStore();

  // State for nickname
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  
  // State for image
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user?.profileImageUrl || '');

  const maxNicknameLength = 8;

  // useEffect 제거 - window.location.href 직접 사용

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxNicknameLength) {
      setNickname(value);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    
    if (type === 'nickname' && nickname.trim() === '') {
      alert('닉네임을 입력해주세요.');
      return;
    }
    
    if (type === 'image' && !selectedImage) {
      alert('이미지를 선택해주세요.');
      return;
    }
  
    setIsLoading(true);
    console.log('isLoading', isLoading);

    try {
      let profileImageUrl = user?.profileImageUrl;
      
      if (type === 'image' && selectedImage) {
        console.log('이미지 업로드 시작...');
        const uploadedUrls = await uploadToCloudinary([selectedImage]);
        profileImageUrl = uploadedUrls[0];
        console.log('이미지 업로드 완료:', profileImageUrl);
      }
      
      await updateProfile({
        nickname: type === 'nickname' ? nickname : user?.nickname || '',
        profileImageUrl: type === 'image' ? profileImageUrl : user?.profileImageUrl,
      });
      
      window.location.href = '/my';
      
      
    } catch (error) {
      alert(error instanceof Error ? error.message : '업데이트에 실패했습니다.');
      setIsLoading(false);
    }
  };

  const getPageTitle = () => {
    switch (type) {
      case 'nickname':
        return '닉네임 변경';
      case 'image':
        return '프로필 이미지 변경';
      default:
        return '프로필 변경';
    }
  };

  const isSubmitDisabled = () => {
    if (type === 'nickname') {
      if(nickname.trim() === user?.nickname) {
        return true;
      }
      return nickname.trim() === '' || isLoading;
    }
    if (type === 'image') {
      return !selectedImage || isLoading;
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">
            {getPageTitle()}
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-1"></div>
        </div>
      ) : (
        <div className="px-4 py-6">
          {type === 'nickname' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임 입력(최대 {maxNicknameLength}자)
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-1 focus:border-transparent"
                  maxLength={maxNicknameLength}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    {nickname.length}/{maxNicknameLength}
                  </span>
                </div>
              </div>
            </div>
          )}

          {type === 'image' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CameraIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                <button
                  onClick={triggerFileInput}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-main-1"
                >
                  <CameraIcon className="w-4 h-4 mr-2" />
                  이미지 선택
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              
              {selectedImage && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    선택된 파일: {selectedImage.name}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            isSubmitDisabled()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-main-1 hover:bg-main-1 active:bg-main-1'
          }`}
        >
          {isLoading ? '변경하는 중...' : '변경하기'}
        </button>
      </div>
    </div>
  );
};

export default ProfileUpdatePage;