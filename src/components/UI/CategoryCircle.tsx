// src/components/UI/CategoryCircle.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackArrowIcon } from '../Icons';

interface CategoryCircleProps {
  id: string;
  name: string;
  icon: string;
  backgroundColor?: string;
  isActive?: boolean;
  onClick: (id: string) => void;
  className?: string;
  variant?: 'default' | 'overlay' | 'photo-only'; // photo-only 추가
  size?: 'sm' | 'md' | 'lg';
}

const CategoryCircle: React.FC<CategoryCircleProps> = ({
  id,
  name,
  icon,
  backgroundColor = '#E5E7EB',
  isActive = false,
  onClick,
  className = '',
  variant = 'default',
  size = 'md'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 더보기 버튼일 때 NationwidePage로 이동
    if (id === 'more') {
      navigate('/nationwide');
    } else {
      // 지역 카테고리일 때 RegionPage로 이동
      const regionCode = id.toLowerCase();
      navigate(`/region/${regionCode}`);
      // onClick 콜백도 실행 (기존 로직 유지)
      onClick(id);
    }
  };

  // 더보기 버튼인지 확인
  const isMoreButton = id === 'more';
  // 이미지 URL인지 확인 (/ 또는 http로 시작)
  const isImageUrl = !isMoreButton && (icon.startsWith('/') || icon.startsWith('http'));
  // 오버레이 모드인지 확인
  const isOverlayMode = variant === 'overlay';
  // 사진만 모드인지 확인
  const isPhotoOnlyMode = variant === 'photo-only';

  // 크기별 스타일 정의
  const sizeClasses = {
    sm: 'w-[3rem] h-[3em]',
    md: 'w-[4.5rem] h-[4.5rem]',
    lg: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm'
  };

  const iconSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  // photo-only 모드일 때는 라벨을 표시하지 않음
  const shouldShowLabel = !isPhotoOnlyMode && (!isOverlayMode || !isImageUrl);

  return (
    <div className={`flex flex-col items-center ${isPhotoOnlyMode ? '' : 'space-y-2'} ${className}`}>
      <button
        onClick={handleClick}
        className={`
          ${isOverlayMode ? 'relative group' : ''} ${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden
          transition-all duration-200 active:scale-95
          ${isActive 
            ? 'ring-2 ring-blue-500 ring-offset-2' 
            : 'hover:scale-105'
          }
          ${isMoreButton ? 'border border-dashed border-gray-300 hover:border-gray-400' : ''}
        `}
        style={!isImageUrl ? { backgroundColor } : undefined}
        aria-label={`${name} 카테고리`}
      >
        {isMoreButton ? (
          <div className="scale-x-[-1]">
            <BackArrowIcon size="md" color="default" />
          </div>
        ) : isImageUrl ? (
          <>
            <img 
              src={icon} 
              alt={name}
              className={`w-full h-full object-cover ${
                isOverlayMode ? 'transition-transform duration-200 group-hover:scale-110' : ''
              }`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            
            {/* 오버레이 모드일 때만 오버레이와 텍스트 표시 */}
            {isOverlayMode && (
              <>
                {/* 어두운 오버레이 */}
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-200" />
                
                {/* 지역명 텍스트 */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-white text-xs font-medium font-['Pretendard'] leading-normal text-center px-1 drop-shadow-lg">
                    {name}
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <span className={iconSizeClasses[size]}>{icon}</span>
        )}
        
        {/* 이미지 로드 실패시 fallback */}
        {isImageUrl && (
          <span className="text-sm font-bold text-gray-600 hidden">
            {name.charAt(0)}
          </span>
        )}
      </button>
      
      {/* 라벨 표시 조건 */}
      {shouldShowLabel && (
        <span className={`
          ${textSizeClasses[size]} font-medium text-center leading-tight
          ${isActive ? 'text-blue-600' : 'text-gray-700'}
          ${isMoreButton ? 'text-gray-500' : ''}
        `}>
          {name}
        </span>
      )}
    </div>
  );
};

export default CategoryCircle;