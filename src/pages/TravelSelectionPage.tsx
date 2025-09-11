import React, { useEffect, useState } from 'react';
import { HeaderBar } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import CategoryCircle from '../components/UI/CategoryCircle';
import { Category } from '../types/category.types';
import { getAllCategoryData } from '../data/categoryData';
import { STEP_OPTIONS, getStepOptions } from '../types/stepOptions.types';
import { TravelData } from '../types/travelData.types';
import { RegionName } from '../types/sigungu.types';
import FlikCardLayout from '../components/Layout/FlikCardLayout';
import { Restaurant } from '../types/restaurant.types';
import { sampleRestaurants } from '../data/sampleRestaurants';

// 단계별 데이터 타입 정의
interface TravelStep {
  id: number;
  title1: string;
  title2: string;
  subtitle: string;
  minSelection?: number;
  maxSelection?: number;
}


// 단계별 설정
const TRAVEL_STEPS: TravelStep[] = [
  {
    id: 1,
    title1: "여행을 떠나고 싶은 지역을",
    title2: "선택해주세요",
    subtitle: "어떤 여행, 어디로 떠날까요?",
    maxSelection: 1, 
  },
  {
    id: 2,
    title1: "여행을 떠나고 싶은 지역을",
    title2: "선택해주세요",
    subtitle: "어떤 여행, 어디로 떠날까요?",
    maxSelection: 3,
  },
  {
    id: 3,
    title1: "여행 기간을",
    title2: "선택해주세요",
    subtitle: "이번 여행, 알마나 다녀올까요?",
    maxSelection: 1,
  },
  {
    id: 4,
    title1: "원하는 여행 테마를 2개 이상",
    title2: "선택해주세요",
    subtitle: "최대 4개 선택 가능",
    minSelection: 2,
    maxSelection: 4,
  },
  {
    id: 5,
    title1: "마음에 드는 장소를",
    title2: "왼쪽으로 스와이프 해주세요",
    subtitle: "스와이프된 장소를 기반으로 AI가 여행플랜을 짜드려요!",
    minSelection: 2,
    maxSelection: 4,
  }

];


const TravelSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [travelData, setTravelData] = useState<TravelData>({
    regions: [],
    sigungus: [],
    duration: [],
    themes: []
  });
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState<string>('');
  // 현재 단계 정보
  const currentStepInfo = TRAVEL_STEPS.find(step => step.id === currentStep);
  const currentOptions = getStepOptions(currentStep, travelData.regions[0] as RegionName) || [];
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);




  // 저장된 맛집 핸들러
  const handleSave = (restaurants: Restaurant[]) => {
    setSavedRestaurants(restaurants);
    console.log('저장된 맛집들:', restaurants);
  };

  // 블로그 리뷰 버튼 핸들러
  const handleBlogReview = (restaurant: Restaurant) => {
    console.log('블로그 리뷰 보기:', restaurant.name);
    // 블로그 리뷰 페이지로 이동하는 로직 추가
  };

  // 카카오맵 버튼 핸들러
  const handleKakaoMap = (restaurant: Restaurant) => {
    console.log('카카오맵 열기:', restaurant.name);
    // 카카오맵 앱이나 웹으로 이동하는 로직 추가
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(restaurant.name)}`;
    window.open(kakaoMapUrl, '_blank');
  };
  
  useEffect(() => {
    const loadAllCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCategoryData();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllCategories();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    console.log('Selected region:', categoryId);
    // 추후 해당 지역 상세 페이지로 이동하는 로직 추가
  };

  


  const handleBackClick = () => {
    navigate(-1);
  };

  // 현재 단계의 선택된 항목들
  const getCurrentSelections = (): string[] => {
    switch (currentStep) {
      case 1: return travelData.regions;
      case 2: return travelData.sigungus;
      case 3: return travelData.duration;
      case 4: return travelData.themes;
      default: return [];
    }
  };

  // 선택 핸들러
  const handleSelection = (optionId: string) => {
    const currentSelections = getCurrentSelections();
    const stepInfo = currentStepInfo;
    
    let newSelections: string[];
    
    if (stepInfo?.maxSelection === 1) {
      // 단일 선택
      newSelections = [optionId];
    } else {
      // 다중 선택
      if (currentSelections.includes(optionId)) {
        newSelections = currentSelections.filter(id => id !== optionId);
      } else {
        if (stepInfo?.maxSelection && currentSelections.length >= stepInfo.maxSelection) {
          return; // 최대 선택 수 초과 시 무시
        }
        newSelections = [...currentSelections, optionId];
      }
    }



    // 상태 업데이트
    setTravelData(prev => {
      switch (currentStep) {
        case 1: 
          // 지역이 변경되면 시군구 리셋
          return { ...prev, regions: newSelections, sigungus: [] };
        case 2: return { ...prev, sigungus: newSelections };
        case 3: return { ...prev, duration: newSelections };
        case 4: return { ...prev, themes: newSelections };
        default: return prev;
      }
    });
  };

  // 다음 단계 가능 여부 확인
  const canProceed = (): boolean => {
    const selections = getCurrentSelections();
    const stepInfo = currentStepInfo;
    
    if (stepInfo?.minSelection && selections.length < stepInfo.minSelection) {
      return false;
    }
    
    return selections.length > 0;
  };

  // 다음 단계로
  const handleNext = () => {
    if (canProceed()) {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
      } else {
        // 완료 처리
        console.log('여행 선택 완료:', travelData);
      }
    }
  };

  useEffect(() => {
    console.log('currentStep', currentStep);
    if (currentStep === 5) {
      console.log('여행 선택 완료:', travelData);
      setSearchLoading(true);
      setTimeout(() => {
        setSearchLoading(false);
        console.log('searchLoadingtime out');
      }, 5000);
    }
  }, [currentStep]);

  console.log('--travelData---');
  console.log('regions', travelData.regions);
  console.log('sigungus', travelData.sigungus);
  console.log('duration', travelData.duration);
  console.log('themes', travelData.themes);

  // 이전 단계로
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };



  return (
    <div className="h-screen-mobile flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex-shrink-0">
      {/* 헤더 */}
      <HeaderBar 
        onBack={handleBackClick}
        variant="travel-select"
        currentStep={currentStep}
        totalSteps={5}
        stepTitle1={currentStepInfo?.title1 || ''}
        stepTitle2={currentStepInfo?.title2 || ''}
        stepSubtitle={currentStepInfo?.subtitle || ''}
        onNext={handleNext}
        onPrev={handlePrev}
        canProceed={canProceed()}
      />
     </div>
      {/* 메인 콘텐츠 */}
    
    {currentStep !== 5?(
      <main className="pt-header-extended max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">

   


<div className="bg-white rounded-lg p-4 pt-10">
  {currentStep === 1 && (
    isLoading ? (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(16)].map((_, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-4 gap-x-12 gap-y-5">
        {categories.map((category) => (
          <CategoryCircle
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
            backgroundColor={category.backgroundColor}
            isActive={travelData.regions.includes(category.id)}
            onClick={() => handleSelection(category.id)}
            className="justify-self-center"
            variant="selected"
            size="lg"
          />
        ))}
      </div>
    )
  )}

  {currentStep === 2 && (
    <div className="grid grid-cols-4 gap-x-12 gap-y-5">
      {currentOptions.map((option) => (
        <CategoryCircle
          key={option.id}
          id={option.id}
          name={option.name}
          icon=""
          backgroundColor="white"
          isActive={getCurrentSelections().includes(option.id)}
          onClick={() => handleSelection(option.id)}
          className="justify-self-center"
          variant="text-only"
          size="lg"
        />
      ))}
    </div>
  )}

  {currentStep === 3 && (
    <div className="grid grid-cols-4 gap-x-12 gap-y-5">
      {currentOptions.map((option) => (
        <CategoryCircle
          key={option.id}
          id={option.id}
          name={option.name}
          icon=""
          backgroundColor="white"
          isActive={getCurrentSelections().includes(option.id)}
          onClick={() => handleSelection(option.id)}
          className="justify-self-center"
          variant="text-only"
          size="lg"
        />
      ))}
    </div>
  )}

  {currentStep === 4 && (
    <div className="grid grid-cols-4 gap-x-12 gap-y-5">
      {currentOptions.map((option) => (
        <CategoryCircle
          key={option.id}
          id={option.id}
          name={option.name}
          icon={option.icon}
          backgroundColor="white"
          isActive={getCurrentSelections().includes(option.id)}
          onClick={() => handleSelection(option.id)}
          className="justify-self-center"
          variant="selected"
          size="lg"
        />
      ))}
    </div>
  )}

    </div>


      </main>
    ):(
      
      <main className="pt-header-extended bg-white max-w-7xl sm:mx-[1%] xs:mx-[3%] px-2 lg:px-8 flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-1 pt-[3%]">
       <FlikCardLayout
         restaurants={sampleRestaurants}
         onSave={handleSave}
         onBlogReview={handleBlogReview}
         onKakaoMap={handleKakaoMap}
       />
      </div>
      </main>
    )}


      {/* 하단 버튼 */}

      {currentStep !== 5 && (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent">
        <div className={`flex gap-3 max-w-md mx-auto ${currentStep === 1 ? 'justify-center' : ''}`}>
          {currentStep !== 1 && (
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1 
                ? 'px-8' 
                : 'flex-1'
            } ${
              canProceed()
                ? 'bg-gray-800 text-white hover:bg-gray-900'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            확인
          </button>
        </div>
      </div>
      )}

      {/* 로딩 오버레이 */}
      {searchLoading && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
      
            {/* 로딩 스피너 */}
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            
            {/* 로딩 텍스트 */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                여행 정보를 분석하고 있어요
              </h3>
              <p className="text-sm text-gray-600">
                잠시만 기다려주세요...
              </p>
            </div>
        
        </div>
      )}

    </div>
  );
};

export default TravelSelectionPage;