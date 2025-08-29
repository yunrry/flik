// src/components/Profile/ProfileSection.tsx

import React, { useState, useRef } from 'react';
import { User } from '../../types/user.types';
import { updateUserProfile } from '../../api/userApi';

interface ProfileSectionProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onUserUpdate }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(user.nickname);
  const [isNicknameUpdating, setIsNicknameUpdating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하만 가능합니다.');
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setIsImageUploading(true);
      
      // 파일을 URL로 변환 (임시 URL 사용)
      const imageUrl = URL.createObjectURL(file);
      
      // 실제 프로덕션에서는 클라우드 스토리지 업로드 후 URL 받아오는 로직
      // const uploadedUrl = await uploadToCloudStorage(file);
      // const finalUrl = await uploadProfileImageByUrl(uploadedUrl);
      
      // 현재는 임시로 로컬 URL 사용
      const updatedProfile = await updateUserProfile({
        profileImage: imageUrl
      });
      
      onUserUpdate({
        ...user,
        profileImage: imageUrl
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsImageUploading(false);
      // input 값 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  // 닉네임 변경 핸들러
  const handleNicknameUpdate = async () => {
    if (newNickname.trim() === '' || newNickname === user.nickname) {
      setIsNicknameEditing(false);
      setNewNickname(user.nickname);
      return;
    }

    if (newNickname.length < 2 || newNickname.length > 20) {
      alert('닉네임은 2-20자 사이로 입력해주세요.');
      return;
    }

    try {
      setIsNicknameUpdating(true);
      const updatedProfile = await updateUserProfile({
        nickname: newNickname.trim()
      });
      
      onUserUpdate(updatedProfile.user);
      setIsNicknameEditing(false);
    } catch (error) {
      console.error('닉네임 업데이트 실패:', error);
      alert('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
      setNewNickname(user.nickname);
    } finally {
      setIsNicknameUpdating(false);
    }
  };

  // 닉네임 편집 취소
  const handleNicknameCancel = () => {
    setNewNickname(user.nickname);
    setIsNicknameEditing(false);
  };

  return (
    <div className="bg-white px-[5%] py-[2%]">
      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* 프로필 섹션 */}
      <div className="flex items-center space-x-4">
        {/* 프로필 이미지 */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* 이미지 업로드 로딩 오버레이 */}
          {isImageUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* 닉네임 섹션 */}
        <div className="flex-1">
          {isNicknameEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="text-xl font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded px-3 py-1 w-full focus:outline-none focus:border-blue-500"
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                disabled={isNicknameUpdating}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleNicknameUpdate}
                  disabled={isNicknameUpdating}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isNicknameUpdating ? '저장중...' : '저장'}
                </button>
                <button
                  onClick={handleNicknameCancel}
                  disabled={isNicknameUpdating}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 disabled:cursor-not-allowed"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <h2 className="text-xl font-semibold text-gray-900">
              {user.nickname}
            </h2>
          )}
        </div>
      </div>

      {/* 변경 버튼들 */}
      {!isNicknameEditing && (
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImageUploading}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            {isImageUploading ? '업로드 중...' : '프로필 이미지 변경'}
          </button>
          <button
            onClick={() => setIsNicknameEditing(true)}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            닉네임 변경
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;