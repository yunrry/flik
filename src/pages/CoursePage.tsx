// src/pages/CoursePage.tsx
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DaySpots from '../components/Layout/DaySpots';
import CourseHeader from '../components/Layout/CourseHeader';
import { getSpotsByIds } from '../api/flikCardsApi';
import { SpotDetail } from '../types/spot.types';
import { formatCategories } from '../utils/formater';
import { translateCategory } from '../utils/categoryMapper';
import { getRegionName } from '../types/sigungu.types';
import { getCourse } from '../api/travelCourseApi';
import { mapApiToCourseData, ApiCourseResponse } from '../utils/courseMapper';
import { TravelCourseUpdateRequest } from '../api/travelCourseApi';
import { updateCourse } from '../api/travelCourseApi';
import { CourseSlot } from '../types/travelCourse.type';

interface DayDetails {
  day: number;
  spots: SpotDetail[];
  selectedSpotIds: number[];
  loading: boolean;
  error?: string;
}

const CoursePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = useParams();

  // 상태 관리
  const [courseData, setCourseData] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [dayDetails, setDayDetails] = useState<DayDetails[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseVersion, setCourseVersion] = useState(0);
  const [isPublic, setIsPublic] = useState(false);


  // courseId로 코스 데이터 불러오기
  useEffect(() => {
    const fetchCourseData = async () => {
      // location.state에 courseData가 있으면 그것을 사용
      if (location.state?.courseData) {
        setCourseData(location.state.courseData);
        setCategories(location.state.courseData.categories || []);
        setIsPublic(location.state.courseData.isPublic);
        setIsLoading(false);
        return;
      }

      // courseId가 없으면 에러
      if (!courseId) {
        setError('코스 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getCourse(courseId);
        
        const mappedData = mapApiToCourseData(response.data as ApiCourseResponse);
        setCategories(mappedData.categories);
        setCourseData(mappedData);
        console.log('API로 불러온 코스 데이터:', mappedData);
        setIsPublic(response.data.isPublic);
      } catch (error) {
        console.error('코스 조회 실패:', error);
        setError('코스 정보를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    // courseData가 이미 있으면 스킵
    if (!courseData) {  
      fetchCourseData();
    }
  }, [courseId]); // courseData는 의존성에서 제외

  // SearchPage에서 추가된 스팟 처리
useEffect(() => {
  const { addedSpot, selectedDay, source, isEditing } = location.state || {};
  setIsEditing(isEditing);
  console.log('isEditing', isEditing);
  if (source === 'course' && addedSpot && selectedDay) {
    console.log('스팟 추가 처리:', addedSpot);
    
    // courseData 업데이트 (새 객체로 생성)
    setCourseData((prev: any) => {
      if (!prev) return prev;
      
      const newDaySlots = prev.daySlots.map((slot: any) =>
        slot.day === selectedDay
          ? {
              ...slot,
              selectedSpotIds: [...slot.selectedSpotIds, addedSpot.id]
            }
          : slot
      );
      
      return {
        ...prev,
        daySlots: newDaySlots // 완전히 새 배열
      };
    });

    // 버전 증가로 스팟 재로드 트리거
    setCourseVersion(v => v + 1);

    // location.state 클리어
    const { source: _, addedSpot: __, selectedDay: ___, ...restState } = location.state;
    navigate(location.pathname, { 
      replace: true,
      state: restState
    });
  }
}, [location.state?.source, location.state?.addedSpot, location.state?.selectedDay, location.state?.isEditing]);

  // 각 Day의 스팟 정보 불러오기
  useEffect(() => {
    if (!courseData?.daySlots) return;

    let cancelled = false;

    const fetchSpotsForAllDays = async () => {
      await Promise.all(
        courseData.daySlots.map(async (daySlot: any, idx: number) => {
          const ids: number[] = daySlot.selectedSpotIds || [];
          
          try {
            const res = await getSpotsByIds(ids);
            if (cancelled) return;

            const list = res.data || [];
            const byId = new Map(list.map(s => [s.id, s]));

            const ordered = ids.map(id => byId.get(id)).filter(Boolean) as SpotDetail[];
            const extras = list.filter(s => !ids.includes(s.id));
            const finalList = [...ordered, ...extras];

            setDayDetails(prev => {
              const next = [...prev];
              next[idx] = {
                day: daySlot.day,
                spots: finalList,
                selectedSpotIds: ids,
                loading: false,
              };
              return next;
            });
          } catch (error) {
            if (!cancelled) {
              setDayDetails(prev => {
                const next = [...prev];
                next[idx] = {
                  day: daySlot.day,
                  spots: [],
                  selectedSpotIds: ids,
                  loading: false,
                  error: '스팟 정보를 불러오지 못했습니다.',
                };
                return next;
              });
            }
          }
        })
      );
    };

    fetchSpotsForAllDays();

    return () => {
      cancelled = true;
    };
  }, [courseData?.daySlots, courseVersion]);

  // Location state에서 데이터 추출
  const regionCode = location.state?.regionCode || courseData?.regionCode || '11110';
  const categoriesString = formatCategories(categories) || location.state?.categoriesString;
  const locationString = location.state?.locationString;
  const regionName = locationString || getRegionName(regionCode) || '';

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 에러 또는 코스 데이터가 없는 경우  
  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || '코스 데이터를 찾을 수 없습니다'}
          </h2>
          <p className="text-gray-600">이전 페이지로 돌아가서 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  // 편집 모드 토글
  const toggleEditAll = () => setIsEditing(prev => !prev);

  // SearchPage로 이동 (장소 추가)
  const goToSearchPage = (day: number) => {
    navigate('/search', {
      state: {
        returnPath: `/course/${courseId}`,
        selectedDay: day,
        isEditing: isEditing,
        source: 'course',
        courseData: courseData, // 현재 courseData 전달
      },
    });
  };

  // 드래그 앤 드롭 처리
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
  
    const sourceDay = parseInt(source.droppableId);
    const destDay = parseInt(destination.droppableId);
  
    // 1. dayDetails 업데이트 (화면 표시용)
    setDayDetails(prev => {
      const newDetails = prev.map(d => ({ ...d, spots: [...d.spots] }));
  
      const sourceDayData = newDetails.find(d => d.day === sourceDay);
      const destDayData = newDetails.find(d => d.day === destDay);
      
      if (!sourceDayData || !destDayData) return prev;
  
      const [movedSpot] = sourceDayData.spots.splice(source.index, 1);
      destDayData.spots.splice(destination.index, 0, movedSpot);
  
      return newDetails;
    });



// 2. courseData의 daySlots도 동일하게 업데이트
setCourseData((prev: any) => {
  if (!prev) return prev;

  const newDaySlots = prev.daySlots.map((slot: any) => {
    // 같은 day가 아니면 그대로 반환
    if (slot.day !== sourceDay && slot.day !== destDay) {
      return slot;
    }

    // source day인 경우
    if (slot.day === sourceDay) {
      const newIds = [...slot.selectedSpotIds];
      const [movedId] = newIds.splice(source.index, 1);
      
      // 같은 day 내 이동이면 destination에 삽입
      if (sourceDay === destDay) {
        newIds.splice(destination.index, 0, movedId);
      }
      
      return { ...slot, selectedSpotIds: newIds };
    }

    // destination day인 경우 (다른 day로 이동)
    if (slot.day === destDay && sourceDay !== destDay) {
      const sourceDayData = prev.daySlots.find((s: any) => s.day === sourceDay);
      const movedId = sourceDayData.selectedSpotIds[source.index];
      const newIds = [...slot.selectedSpotIds];
      newIds.splice(destination.index, 0, movedId);
      
      return { ...slot, selectedSpotIds: newIds };
    }

    return slot;
  });

  return {
    ...prev,
    daySlots: newDaySlots
  };
});
};




  // 스팟 삭제
  const removeSpotFromDay = (day: number, index: number) => {
    // 1. dayDetails 업데이트 (화면용)
    setDayDetails((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, spots: d.spots.filter((_, i) => i !== index) }
          : d
      )
    );
  
    // 2. courseData의 selectedSpotIds도 업데이트
    setCourseData((prev: any) => {
      if (!prev) return prev;
  
      const newDaySlots = prev.daySlots.map((slot: any) =>
        slot.day === day
          ? {
              ...slot,
              selectedSpotIds: slot.selectedSpotIds.filter((_: any, i: number) => i !== index)
            }
          : slot
      );
  
      return {
        ...prev,
        daySlots: newDaySlots
      };
    });
  };

  // 코스 저장
  const handleSaveCourse = async () => {
    if (!courseId) return;
  
    try {

      const mapCategoryToSlotType = (category: string): string => {
        const categoryUpper = category.toUpperCase();
        
        // 카테고리에 따라 SlotType 매핑
        if (categoryUpper.includes('RESTAURANT') || categoryUpper.includes('음식')) {
          return 'RESTAURANT';
        }
        if (categoryUpper.includes('CAFE') || categoryUpper.includes('카페')) {
          return 'CAFE';
        }
        if (categoryUpper.includes('ACCOMMODATION') || categoryUpper.includes('숙박')) {
          return 'ACCOMMODATION';
        }
        if (categoryUpper.includes('TOURISM') || categoryUpper.includes('HISTORY_CULTURE') || categoryUpper.includes('NATURE') || categoryUpper.includes('THEMEPARK') || categoryUpper.includes('ACTIVITY') || categoryUpper.includes('MARKET') || categoryUpper.includes('FESTIVAL') || categoryUpper.includes('INDOOR')) {
          return 'TOURISM';
        }        
        // 기본값
        return 'TOURISM';
      };


      // dayDetails를 CourseSlot[][] 형태로 변환
      const courseSlots: CourseSlot[][] = dayDetails.map(dayData => 
        dayData.spots.map((spot, slotIndex) => ({
          day: dayData.day,
          slot: slotIndex + 1,
          slotType: mapCategoryToSlotType(spot.category || ''),
          mainCategory: spot.category || null,
          slotName: spot.name,
          recommendedSpotIds: [],
          selectedSpotId: spot.id,
          isContinue: null,
          empty: false,
          hasRecommendations: false,
          hasSelectedSpot: true,
        }))
      );

      const selectedCategories = Array.from(
        new Set(
          courseSlots
            .flat()
            .map(slot => slot.mainCategory)
            .filter((category): category is string => category !== null)
        )
      );

      setCategories(selectedCategories);
  
      const updateData: TravelCourseUpdateRequest = {
        totalDistance: courseData.totalDistance,
        courseSlots: courseSlots,
        regionCode: courseData.regionCode,
        selectedCategories: selectedCategories.map(category => category.toLowerCase()),
      };
  
      const response = await updateCourse(Number(courseId), updateData);
      console.log('코스 저장 응답:', response);
      if (response.success) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      alert('코스 저장 중 오류가 발생했습니다.');
    }
  };

  // 여행 기간 포맷
  const formatDuration = (days: number) => {
    if (days === 1) return '당일치기';
    if (days === 2) return '1박2일';
    if (days === 3) return '2박3일';
    return `${days - 1}박${days}일`;
  };

  // 총 스팟 수 계산
  const totalSpots = courseData.daySlots?.reduce(
    (total: number, daySlot: any) => total + (daySlot.selectedSpotIds?.length || 0),
    0
  ) || 0;

  // 카테고리 문자열 생성
  const categoryText = categoriesString || 
    courseData.categories?.map(translateCategory).join('/') || '';

  return (
    <div className="pt-header-extended min-h-screen bg-white flex flex-col items-center">
  
      {/* 헤더 */}
      <CourseHeader
        courseId={Number(courseId)}
        totalDistance={parseFloat(courseData.totalDistance?.toFixed(1)) || 0}
        totalSpot={totalSpots}
        LocationCode={regionName}
        duration={formatDuration(courseData.days)}
        Categories={categoryText}
        isOwner={true}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
      />

      {/* 메인 콘텐츠 */}
    
      <main className="pt-5 w-full lg:w-[55%] flex flex-col flex-1 px-4 lg:px-8 py-6 bg-white overflow-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            {dayDetails.map((dayData, idx) => (
              <div key={dayData.day}>
                {/* Day 헤더 */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">Day {dayData.day}</h3>
                  {idx === 0 && (
                    <button
                      onClick={isEditing ? handleSaveCourse : toggleEditAll}
                      className="px-3 py-1 text-gray-500 text-sm font-medium"
                    >
                      {isEditing ? "저장" : "일정편집"}
                    </button>
                  )}
                </div>

                {/* 스팟 목록 */}
                <DaySpots
                  dayData={dayData}
                  isEditing={isEditing}
                  onDeleteSpot={removeSpotFromDay}
                />

                {/* 장소 추가 버튼 (편집 모드일 때만) */}
                {isEditing && (
                 <div className="mt-2">
                 <button
                   onClick={() => goToSearchPage(dayData.day)}
                   className="w-full py-2 text-xs border border-gray-400  bg-white text-gray-5 hover:bg-gray-50 font-medium font-['Pretendard'] leading-normal transition-colors font-medium"
                 >
                   장소추가 +
                 </button>
               </div>
                )}
              </div>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
};

export default CoursePage;