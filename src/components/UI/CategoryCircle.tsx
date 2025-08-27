// src/components/UI/CategoryCircle.tsx

import React from 'react';

interface CategoryCircleProps {
  id: string;
  name: string;
  icon: string;
  backgroundColor?: string;
  isActive?: boolean;
  onClick: (id: string) => void;
  className?: string;
}

const CategoryCircle: React.FC<CategoryCircleProps> = ({
  id,
  name,
  icon,
  backgroundColor = '#E5E7EB',
  isActive = false,
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    onClick(id);
  };

  // 더보기 버튼인지 확인
  const isMoreButton = id === 'more';
  // 이미지 URL인지 확인 (/ 또는 http로 시작)
  const isImageUrl = !isMoreButton && (icon.startsWith('/') || icon.startsWith('http'));

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <button
        onClick={handleClick}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center overflow-hidden
          transition-all duration-200 active:scale-95
          ${isActive 
            ? 'ring-2 ring-blue-500 ring-offset-2' 
            : 'hover:scale-105'
          }
          ${isMoreButton ? 'border-2 border-dashed border-gray-300 hover:border-gray-400' : ''}
        `}
        style={!isImageUrl ? { backgroundColor } : undefined}
        aria-label={`${name} 카테고리`}
      >
        {isMoreButton ? (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : isImageUrl ? (
          <img 
            src={icon} 
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <span className="text-2xl">{icon}</span>
        )}
        
        {/* 이미지 로드 실패시 fallback */}
        {isImageUrl && (
          <span className="text-sm font-bold text-gray-600 hidden">
            {name.charAt(0)}
          </span>
        )}
      </button>
      
      <span className={`
        text-xs font-medium text-center leading-tight
        ${isActive ? 'text-blue-600' : 'text-gray-700'}
        ${isMoreButton ? 'text-gray-500' : ''}
      `}>
        {name}
      </span>
    </div>
  );
};

export default CategoryCircle;