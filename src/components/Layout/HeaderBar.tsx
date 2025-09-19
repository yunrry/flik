import React, { useState, useEffect } from 'react';
import { HeaderProps } from '../../types/header.types';
import { useNavigate } from 'react-router-dom';
import { RegionCode, REGION_CONFIG } from '../../types/region.types';
import { LogoIcon, SettingIcon, BackArrowIcon, XIcon } from '../Icons/SvgIcons';
import SearchComponent from '../search/SearchComponent';
import FlikExploreButton from '../Buttons/FlikExploreButton';


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
  isAvailable = false,
  className = '',
  currentStep,
  totalSteps,
  stepTitle1,
  stepTitle2,
  stepSubtitle,
  onNext,
  onPrev,
  canProceed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  // 지역 정보 가져오기
  const currentRegion = REGION_CONFIG[region];

  // back-from-sido일 때 스크롤 이벤트 감지
  useEffect(() => {
    if (variant !== 'back-from-sido') return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // 50px 이상 스크롤 시 축소
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

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
          <div className="flex items-center ">
            <LogoIcon size='xxl' />
          </div>
        );

      case 'my':
        return (
          <div className="flex items-center pt-[20%]">
            <h1 className="text-gray-1 text-xl font-semibold font-['Pretendard']leading-normal">마이페이지</h1>
          </div>
        );
      

      case 'posting':
        return (
          <div className="flex items-center pt-[20%]">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="뒤로가기"
            >
              <XIcon size="lg" />
            </button>
          </div>
        );

        case 'travel-select':
          return (
            <div className="flex flex-col justify-start h-full py-1 pb-0">
              <div className="flex flex-col items-start">
              <button
                onClick={currentStep === 1 ? onBack : onPrev}
                className={`pl-2 -ml-2 transition-colors rounded-lg text-white hover:bg-white/20`}
                aria-label="뒤로가기"
              >
                <BackArrowIcon size="lg" color="white" />
              </button>
              </div>
              <div className="flex flex-col items-start pt-6 pl-0 pb-0 space-y-1 overflow-visible">
              <div className="justify-start text-white text-xl font-semibold font-['Pretendard'] leading-none whitespace-pre-line">{stepTitle1}</div>
              <div className="justify-start text-white text-xl font-semibold font-['Pretendard'] leading-none whitespace-pre-line">{stepTitle2}</div>
              <div className="justify-start text-white text-sm font-medium font-['Pretendard'] leading-loose overflow-visible whitespace-nowrap pt-2">{stepSubtitle}</div>
            </div>

            </div>
          );

      case 'back-from-nationwide':
        return (
          <div className="flex flex-col justify-start h-full py-1 pb-0">
            {/* 상단 행 - 뒤로가기 버튼 */}
            <div className="flex items-start">
              <button
                onClick={() => navigate('/')}
                className="p-2 -ml-2 transition-colors rounded-lg"
                aria-label="뒤로가기"
              >
                <BackArrowIcon size="lg" color="white" />
              </button>
            </div>
            
            {/* 하단 행 - 추가 컨텐츠 */}
            <div className="flex flex-col items-start pt-8 pl-0 pb-0 space-y-2">
              <div className="justify-start text-white text-xl font-semibold font-['Pretendard'] leading-tight">슥삭 넘기다 보면 전국이 내 맛집 리스트! <br /> 이제, 손끝으로 전국을 플릭하세요.</div>
              <div className="justify-start text-white text-sm font-medium font-['Pretendard'] leading-relaxed">스와이프 한 번에 내 취향에 딱 맞는 맛집을 발견할 수 있어요.</div>
            </div>
          </div>
        );

      case 'back-from-sido':
        return (
          <div className={`flex items-center relative z-10 transition-all duration-300 ${
            isScrolled ? 'py-0' : 'pt-8'
          }`}>
            <button
             onClick={() => navigate('/')}
             className="p-2 pl-0 ml-2 transition-colors rounded-lg"
              aria-label="뒤로가기"
            >
              <BackArrowIcon size={isScrolled ? "md" : "lg"} color="white" />
            </button>
            <div className={`text-white font-semibold font-['Pretendard'] leading-snug pl-1 transition-all duration-300 ${
              isScrolled ? 'text-base' : 'text-xl pt-2'
            }`}>
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-main-1 focus:ring-1 focus:ring-main-1 text-sm"
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
          <div className="flex items-center pr-1 space-x-2 pt-[30%]">
            <SettingIcon size='lg' />
          </div>
        );

        case 'posting':
          return (
            <div className="flex items-center pt-[40%] pr-2">
              {isAvailable ? (
              <button
                onClick={onRegister}
                className=""
                aria-label="등록"
              >
              <text className="text-main-1 text-lg font-medium font-['Pretendard'] leading-normal">등록</text>
              </button>
              ) : (
                <text className="text-gray-9 text-lg font-medium font-['Pretendard'] leading-normal">등록</text>
              )}
            </div>
          );
      
      case 'close':
        return showRegister ? (
          <button
            onClick={onRegister}
            className="px-4 py-1 text-main-1 font-medium hover:text-main-1 transition-colors"
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
      
        case 'travel-select':
          if (!currentStep || !totalSteps) return null;
          
          // 모든 단계 번호 생성
          const allSteps = [...Array(totalSteps-1)].map((_, i) => 
            (i + 1).toString().padStart(2, '0')
          );
          
          // currentStep에 따른 실제 진행 단계 계산
          let actualStep = currentStep;
          if (currentStep === 2) {
            actualStep = 1; // 2단계도 1단계와 같은 진행률
          }

          return (
            <div className="flex flex-col flex-1">
              {/* 진행률 표시 */}
              <div className="flex items-center justify-center space-x-2 text-white text-xs font-semibold font-['Pretendard'] mb-4">
                {allSteps.map((step, i) => {
                  const stepNum = i + 1;
                  
                  return (
                    <div key={step} className="flex items-center">
                      {actualStep === 1 ? (
                        <>
                        <span className="text-xs">{step}</span>
                        {stepNum === actualStep && (
                          <div className="w-9 h-[1px] bg-white ml-2 mr-1 mb-0.5"></div>
                        )}
                        
                        </>
                      ) : (
                        <>
                        <span className="text-xs">{step}</span>
                        {stepNum === actualStep-1 && (
                          <div className="w-9 h-[1px] bg-white ml-2 mr-1 mb-0.5"></div>
                        )}

                        </>
                      )}
                      
                    </div>
                  );
                })}
              </div>
              
            </div>
          );



      default:
        return null;
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        variant === 'back-from-nationwide' || variant === 'travel-select'
          ? 'bg-main-1 border-b border-main-1' 
          : variant === 'back-from-sido'
          ? `overflow-hidden pb-0 ${
              isScrolled ? 'backdrop-blur-md bg-black/80' : ''
            }`
          : 'bg-white'
      } ${className}`}
      style={{
        height: variant === 'back-from-sido'
          ? isScrolled 
            ? '4rem' // 스크롤 시 축소 높이 (64px)
            : 'var(--header-height-extended)' // 기본 확장 높이
          : (variant === 'back-from-nationwide' || variant === 'travel-select')
          ? 'var(--header-height-extended)' 
          : 'var(--header-height-default)',
        minHeight: variant === 'back-from-sido' ? '4rem' : 'auto' // 최소 높이 보장
      }}
    >
      {/* back-from-sido variant일 때 배경 이미지와 오버레이 */}
      {variant === 'back-from-sido' && (
        <>
          {/* 배경 이미지 */}
          <div 
            className={`absolute bg-cover bg-center bg-no-repeat transition-all duration-300 ${
              isScrolled ? 'inset-0 opacity-30' : 'inset-0'
            }`}
            style={{
              backgroundImage: `url(${currentRegion.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* 그라데이션 오버레이 */}
          <div className={`absolute inset-0 transition-all duration-300 ${
            isScrolled 
              ? 'bg-gradient-to-b from-black/50 to-black/70' 
              : 'bg-gradient-to-b from-black/20 via-black/30 to-black/50'
          }`} />
        </>
      )}

      <div className="max-w-7xl mx-auto px-0 lg:px-8 h-full relative z-10">
        <div className={`flex h-full transition-all duration-300 ${
          isScrolled ? 'flex-row items-center pt-2' : 'flex-col justify-between pt-4'
        }`}>
          {/* 상단 영역 - 기존 헤더 컨텐츠 */}
          <div className="flex items-center justify-between px-4 w-full h-full">
            {/* 왼쪽 영역 */}
            {variant === 'travel-select'?(
              <div className="flex items-center w-[63%] h-[80%]">
                {renderLeftContent()}
              </div>
            ):(
            <div className="flex items-center">
              {renderLeftContent()}
            </div>
            )}
            {/* 중앙 영역 */}
            <div className="flex items-center bg-red-500">
            {renderCenterContent()}
            </div>

            {/* 오른쪽 영역 */}
            {variant === 'travel-select'?(
              <div className="flex flex-col items-start w-[37%] h-[70%]">
                {renderRightContent()}
              </div>
            ):(
            <div className="flex items-center">
                {renderRightContent()}
                
              </div>
            )}
          </div>

          {/* 하단 영역 - FlikExploreButton (back-from-sido일 때만, 스크롤되지 않았을 때만) */}
          {variant === 'back-from-sido' && !isScrolled && (
            <div className="px-0 w-full pb-0">
              <FlikExploreButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
