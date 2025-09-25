import React from 'react';
import { ChevronLeft, Settings } from 'lucide-react';
import { SettingIcon } from '../Icons/SvgIcons';

interface MyHeaderProps {
  handleSettings: () => void;
  profileImage?: string; // 프로필 이미지 URL (없으면 기본 이미지 표시)
  nickname: string;
  onProfileImageChange: () => void;
  onNicknameChange: () => void;
}

const MyHeader: React.FC<MyHeaderProps> = ({ 
  handleSettings,
  profileImage,
  nickname,
  onProfileImageChange,
  onNicknameChange,
}) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white w-full lg:w-[60%] sm:max-w-7xl sm:mx-auto  py-6 flex flex-col flex-1 "
      style={{ height: 'var(--header-height-extended)',  backgroundColor: '#FFFFFF'}} 
    >
      <div className="flex items-center justify-between px-4 pt-2 w-full ">
      
        {/* 타이틀 */}
        <h1 className="text-gray-1 text-xl font-semibold font-['Pretendard'] leading-normal ml-[3%]">마이페이지</h1>

        {/* 설정 버튼 */}
        <button onClick={handleSettings} className="p-2">
          <SettingIcon size='lg' />
        </button>
      </div>

 {/* 프로필 섹션 */}
 <div className="flex flex-row items-center justify-between mt-3 px-4 bg-white w-full">
        {/* 프로필 이미지 */}
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ml-[3%]">
          {profileImage ? (
            <img
              src={profileImage}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-3xl">👤</span>
          )}
        </div>

<div className="flex flex-col w-[75%] items-start mt-1 px-1 pl-2 bg-white" >
        {/* 닉네임 */}
        <p className="text-gray-1 text-base font-semibold font-['Pretendard'] leading-normal pl-0.5">{nickname}</p>

        {/* 버튼 영역 */}
        <div className="flex flex-row w-full h-7 space-x-3 mt-3">
          <button
            onClick={onProfileImageChange}
            className="w-full rounded-md border border-gray-8 pb-0.5"
          >
            <text className="text-gray-6 text-xs font-medium font-['Pretendard'] leading-normal">프로필 이미지 변경</text>
            
          </button>
          <button
            onClick={onNicknameChange}
            className="w-full rounded-md border border-gray-8 pb-0.5"
          >
            <text className="text-gray-6 text-xs font-medium font-['Pretendard'] leading-normal">닉네임 변경</text>
          </button>
        </div>
        </div>
        </div>
    </header>
  );
};

export default MyHeader;
