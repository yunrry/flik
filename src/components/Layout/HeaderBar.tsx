import React, { useState } from 'react';
import { HeaderProps } from '../../types/header.types';
import { RegionCode, REGION_CONFIG } from '../../types/region.types';
import { LogoIcon, SettingIcon, BackArrowIcon } from '../Icons';
import SearchComponent from '../search/SearchComponent';

const HeaderBar: React.FC<HeaderProps> = ({
  variant,
  title = '',
  region = 'seoul', // 기본값을 서울로 설정
  onBack,
  onClose,
  onRegister,
  onSearch,
  onMore,
  searchPlaceholder = '매장명을 입력해주세요',
  showRegister = false,
  registerText = '등록',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 지역 정보 가져오기
  const currentRegion = REGION_CONFIG[region];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const renderLeftContent = () => {
    switch (variant) {
      case 'logo':
        return (
          <div className="flex items-center">
            <LogoIcon size='xxl' />
          </div>
        );

      case 'my':
        return (
          <div className="flex items-center">
            <h1 className="text-sb3 font-semibold text-gray-900">마이페이지</h1>
          </div>
        );
      
      case 'back-from-nationwide':
        return (
          <div className="flex flex-col justify-start h-full py-1 pb-0">
            {/* 상단 행 - 뒤로가기 버튼 */}
            <div className="flex items-start">
              <button
                onClick={onBack}
                className="p-2 pb-8 -ml-2 hover:bg-white/10 transition-colors rounded-lg"
                aria-label="뒤로가기"
              >
                <BackArrowIcon size="lg" color="white" />
              </button>
            </div>
            
            {/* 하단 행 - 추가 컨텐츠 */}
            <div className="flex flex-col items-start pl-0 pb-0 space-y-2">
              <div className="justify-start text-white text-xl font-semibold font-['Pretendard'] leading-tight">슥삭 넘기다 보면 전국이 내 맛집 리스트! <br /> 이제, 손끝으로 전국을 플릭하세요.</div>
              <div className="justify-start text-white text-sm font-medium font-['Pretendard'] leading-relaxed">스와이프 한 번에 내 취향에 딱 맞는 맛집을 발견할 수 있어요.</div>
            </div>
          </div>
        );

      case 'back-from-sido':
        return (
          <div className="flex items-start relative z-10">
            <button
              onClick={onBack}
              className="p-2 pb-8 -ml-2 hover:bg-black/20 transition-colors rounded-lg backdrop-blur-sm"
              aria-label="뒤로가기"
            >
              <BackArrowIcon size="lg" color="white" />
            </button>
            <div className="text-sb3 font-semibold text-white drop-shadow-lg leading-loose pl-1">
              {currentRegion.name}
            </div>
          </div>
        );

      case 'back':
        return (
          <div className="flex items-start relative z-10">
            <button
              onClick={onBack}
              className="p-2 pb-8 -ml-2 hover:bg-black/20 transition-colors rounded-lg backdrop-blur-sm"
              aria-label="뒤로가기"
            >
              <BackArrowIcon size="lg" color="default" />
            </button>
          </div>
        );
        
      case 'backWithMore':
        return (
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="뒤로가기"
          >
            <BackArrowIcon size="md" color="default" />
          </button>
        );

      case 'backWithSearch':
        return (
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="뒤로가기"
          >
            <BackArrowIcon size="md" color="default" />
          </button>
        );
      
      case 'close':
        return (
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        );
      
      case 'search':
        return (
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="뒤로가기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        );
      
      default:
        return null;
    }
  };

  const renderCenterContent = () => {
    switch (variant) {
      case 'logo':
        return null;
      
      case 'back':
      case 'close':
      case 'backWithMore':
        return title ? (
          <h1 className="text-lg font-semibold text-gray-900 text-center flex-1">
            {title}
          </h1>
        ) : null;
      
      case 'search':
        return (
          <form onSubmit={handleSearchSubmit} className="flex-1 mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
              />
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };

  const renderRightContent = () => {
    switch (variant) {
      case 'logo':
        return (
          <div className="flex items-center space-x-2">
           
          </div>
        );

      case 'my':
        return (
          <div className="flex items-center pr-1 space-x-2">
            <SettingIcon size='lg' />
          </div>
        );
      
      case 'close':
        return showRegister ? (
          <button
            onClick={onRegister}
            className="px-4 py-1 text-orange-500 font-medium hover:text-orange-600 transition-colors"
          >
            {registerText}
          </button>
        ) : null;
      
      case 'backWithMore':
        return (
          <button
            onClick={onMore}
            className="p-2 -mr-2 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="더보기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        );
      
      case 'backWithSearch':
        return (
          <button
            onClick={onBack}
            className="p-2 -mr-2 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="검색"
          >
            <div className="p-2 -mr-2 text-gray-700 hover:text-gray-900 transition-colors"> search </div>
            <SearchComponent/>
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 ${
        variant === 'back-from-nationwide'
          ? 'bg-main-1 border-b border-main-1' 
          : variant === 'back-from-sido'
          ? 'border-b border-gray-200 relative overflow-hidden'
          : 'bg-white border-b border-gray-200'
      } ${className}`}
      style={{
        height: (variant === 'back-from-nationwide' || variant === 'back-from-sido')
          ? 'var(--header-height-extended)' 
          : 'var(--header-height-default)'
      }}
    >
      {/* back-from-sido variant일 때 배경 이미지와 오버레이 */}
      {variant === 'back-from-sido' && (
        <>
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentRegion.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
        <div className="flex items-center justify-between h-full pt-4">
          {/* 왼쪽 영역 */}
          <div className="flex items-center">
            {renderLeftContent()}
          </div>

          {/* 중앙 영역 */}
          {renderCenterContent()}

          {/* 오른쪽 영역 */}
          <div className="flex items-center">
            {renderRightContent()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
