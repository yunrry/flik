import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore'; // 실제 경로에 맞게 수정
import { uploadToCloudinary } from '../utils/cloudinary';

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<'depth_1' | 'depth_2_withdraw' | 'depth_2_info'>('depth_1'); // 기본값 설정
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  
  // State for image
  const [selectedImage, setSelectedImage] = useState<File | null>(null);


  const maxNicknameLength = 8;

  // useEffect 제거 - window.location.href 직접 사용

  const handleGoBack = () => {
    navigate(-1);
  };



  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (isLoading) return;
  
  
    setIsLoading(true);
    console.log('isLoading', isLoading);

    try {
     
      
    } catch (error) {
      alert(error instanceof Error ? error.message : '업데이트에 실패했습니다.');
      setIsLoading(false);
    }
  };

  const getPageTitle = () => {
    switch (type) {
      case 'depth_1':
        return '설정';
      case 'depth_2_withdraw':
        return '탈퇴하기';
      default:
        return '프로필 변경';
    }
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
         
            </div>
          )}

          {type === 'depth_1' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
                
                </div>
              </div>
            
            </div>
          )}
        
      

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        {/* <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            isSubmitDisabled()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-main-1 hover:bg-main-1 active:bg-main-1'
          }`}
        >
          {isLoading ? '변경하는 중...' : '변경하기'}
        </button> */}
      </div>
      
</div>
    
  );
};

export default SettingsPage;