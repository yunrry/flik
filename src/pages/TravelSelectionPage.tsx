import React, { useCallback, useEffect, useState } from 'react';
import { HeaderBar } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import CategoryCircle from '../components/UI/CategoryCircle';
import { Category } from '../types/category.types';
import { getAllCategoryData } from '../data/categoryData';
import { getStepOptions } from '../types/stepOptions.types';
import { TravelData } from '../types/travelData.types';
import { RegionName } from '../types/sigungu.types';
import FlikCardLayout from '../components/Layout/FlikCardLayout';
import { getSpotsByCategories} from '../api/flikCardsApi';
import { createCourse } from '../api/travelCourseApi';
import { Spot } from '../types/spot.types';
import { convertRegionToCode } from '../utils/regionUtils';
import LoadingScreen from '../components/UI/LoadingScreen';


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
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const [spotResponse, setSpotResponse] = useState<Spot[]>([]);
  const [cacheKey, setCacheKey] = useState<string>('');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [regionCode, setRegionCode] = useState<string>('');
  const [tripDuration, setTripDuration] = useState<number>(1);
  const [requestCategories, setRequestCategories] = useState<string[]>([]);
  const [nextStepButtonCondition, setNextStepButtonCondition] = useState<boolean>(false);

  // API 호출 함수
  const fetchSpots = async () => {
    try {
      // 기본 카테고리 설정

      const tripDuration = parseInt(travelData.duration[0] || '1');
      setTripDuration(tripDuration);
      const categories: string[] = ["RESTAURANT"];
      // duration이 1이 아니면 ACCOMMODATION 추가
      if (travelData.duration[0] == '2' || travelData.duration[0] == '3') {
        categories.push('ACCOMMODATION');
      }
      
      
      // themes에서 선택된 카테고리 추가
      travelData.themes.forEach(theme => {
        if (!categories.includes(theme)) {
          categories.push(theme);
        }
      });
      setRequestCategories(categories);
      console.log('requestCategories', requestCategories);

      const regionCode = convertRegionToCode(travelData.regions[0]) + travelData.sigungus[0];
      setRegionCode(regionCode);
      // API 요청 파라미터
      const params = {
        categories,
        regionCode: regionCode, // 첫 번째 선택된 지역
        tripDuration: parseInt(travelData.duration[0] || '1'),
        limitPerCategory: 21 // 기본값
      };

      console.log('API 요청 파라미터:', params);
      
      const response = await getSpotsByCategories(params);
      
      if (response.success) {
        console.log('스팟 데이터 조회 성공:', response.data.spots);
        // TODO: 스팟 데이터를 FlikCardLayout에 전달
        setSpotResponse(response.data.spots);
        setCacheKey(response.data.cacheKey);
      } else {
        console.error('스팟 데이터 조회 실패:', response.message);
      }
    } catch (error) {
      console.error('스팟 데이터 조회 중 오류:', error);
    }
  };

  // 저장된 장소 핸들러
  const handleSave = useCallback((spots: Spot[]) => {
    setSavedSpots(spots);
    console.log('저장된 장소들:', spots);
    // 카테고리별 카운트 업데이트
    const newCategoryCounts: Record<string, number> = {};
    
    spots.forEach(spot => {
      const category = spot.category;
      if (category) {
        newCategoryCounts[category] = (newCategoryCounts[category] || 0) + 1;
      }
    });
    
    setCategoryCounts(newCategoryCounts);
    console.log('카테고리별 카운트:', newCategoryCounts);

        // 추천경로 조건 확인
        checkRecommendationCondition(newCategoryCounts);

      }, []);



// useEffect(() => {
//   checkNextStepButtonCondition(savedSpots.length);
// }, [savedSpots]);

// const checkNextStepButtonCondition = (spotsLength: number) => {
//   if (spotsLength >= 2) {
//     setNextStepButtonCondition(true);
//   } else {
//     setNextStepButtonCondition(false);
//   }
// };


// 추천경로 조건 확인 함수
const checkRecommendationCondition = (counts: Record<string, number>) => {
  const restaurantCount = counts['RESTAURANT'] || 0;
  const otherCategories = Object.entries(counts).filter(([category]) => category !== 'RESTAURANT');
  
  // RESTAURANT가 10개 이상이고, 다른 카테고리들이 각각 5개 이상인지 확인
  const hasEnoughRestaurants = restaurantCount >= 5;
  const hasEnoughOtherCategories = otherCategories.every(([_, count]) => count >= 3);
  
  if (hasEnoughRestaurants && hasEnoughOtherCategories && otherCategories.length > 0) {
    setShowRecommendationModal(true);
  }
};

// 추천경로 확인하기 핸들러
const handleRecommendationConfirm = async () => {
  if (isLoading) return; // 이미 로딩 중이면 무시
  
  setShowRecommendationModal(false);
  setIsLoading(true);
  
  try {
  
  
    console.log('코스 생성 파라미터:', { requestCategories, regionCode, tripDuration });
    
    const response = await createCourse(requestCategories, regionCode, tripDuration);
    
    if (response.success) {
      console.log('코스 생성 성공:', response.data);
      
        // 코스 데이터에서 필요한 정보만 추출
        const courseData = response.data;
        const extractedData = {
          id: courseData.id,
          userId: courseData.userId,
          categories: requestCategories, // 요청한 카테고리들
          totalDistance: courseData.totalDistance,
          days: courseData.days,
          // 동적으로 각 day별 selectedSpotId 추출 (null이 아닌 것만)
          daySlots: courseData.courseSlots.map((daySlots, dayIndex) => ({
            day: dayIndex + 1,
            selectedSpotIds: daySlots
              .map(slot => slot.selectedSpotId)
              .filter(id => id !== null) // null이 아닌 것만 필터링
          })),
          isPublic: courseData.isPublic
        };
      
      console.log('추출된 코스 데이터:', extractedData);
      
      // 코스 생성 성공 시 코스 페이지로 이동
      navigate(`/course/${extractedData.id}`, { 
        state: { 
          courseData: extractedData,
          savedSpots: savedSpots,
          regionCode: regionCode
        } 
      });
    } else {
      console.error('코스 생성 실패:', response.message);
      alert('코스 생성에 실패했습니다. 다시 시도해주세요.');
      setShowRecommendationModal(true); // 실패 시 모달 다시 표시
    }
  } catch (error) {
    console.error('코스 생성 중 오류:', error);
    alert('코스 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    setShowRecommendationModal(true); // 실패 시 모달 다시 표시
  } finally {
    setIsLoading(false);
  }
};

// 추천경로 모달 닫기 핸들러
const handleRecommendationCancel = () => {
  setShowRecommendationModal(false);
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
      
      // API 호출
      fetchSpots().finally(() => {
        setTimeout(() => {
          setSearchLoading(false);
          console.log('searchLoading timeout');
        }, 5000);
      });
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

  if (isLoading) {
    return <LoadingScreen />;
  }
  

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
         spots={spotResponse}
         onSave={handleSave}
       />
      </div>
      </main>
    )}


      {/* 하단 버튼 */}

      {currentStep !== 5 && (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90">
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


 {/* 추천경로 확인하기 모달 */}
 {showRecommendationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              {/* 아이콘 */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">��</span>
              </div>
              
              {/* 제목 */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                추천경로 확인하기
              </h3>
              
              {/* 설명 */}
              <p className="text-gray-600 mb-6">
                충분한 장소를 선택하셨네요!<br/>
                AI가 최적의 여행경로를 추천해드릴까요?
              </p>
              
              {/* 현재 선택된 카테고리 개수 표시 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">선택된 장소</h4>
                <div className="space-y-1">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category === 'RESTAURANT' 
                          ? count >= 10 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          : count >= 5
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {count}개
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 버튼들 */}
              <div className="flex gap-3">
                <button
                  onClick={handleRecommendationCancel}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  더 선택하기
                </button>
                <button
                  onClick={handleRecommendationConfirm}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  추천받기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelSelectionPage;