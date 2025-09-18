// src/pages/CoursePage.tsx
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import React, { useState, useEffect } from 'react';
import DaySpots from '../components/Layout/DaySpots';
import { useLocation } from 'react-router-dom';
import CourseHeader from '../components/Layout/CourseHeader';
import { getSpotsByIds } from '../api/flikCardsApi';
import { SpotDetail, parseImageUrls } from '../types/spot.types';
import { translateCategory } from '../utils/categoryMapper';
import { getRegionName } from '../types/sigungu.types';

interface Spot {
    id: number;
    name: string;
    category: string;
    address?: string;
    imageUrls?: string[];
  }
  
  interface DayData {
    day: number;
    spots: Spot[];
    selectedSpotIds: number[];
  }

const CoursePage: React.FC = () => {
  const location = useLocation();
  const courseData = location.state?.courseData;
  const savedSpots = location.state?.savedSpots || [];
//   const regionCode = location.state?.regionCode;
  const regionCode = '11110';
  const categoriesString = location.state?.categoriesString;
  const locationString = location.state?.locationString;
  const regionName: string = locationString? locationString: getRegionName(regionCode) || '';

  const courseDataMock = {
    id: 12345,
    days: 3,
    totalDistance: 42.7,
    categories: ["RESTAURANT", "NATURE", "HISTORY_CULTURE"],
    daySlots: [
      {
        day: 1,
        selectedSpotIds: [1651, 1632, 1636, 1879, 1772],
      },
      {
        day: 2,
        selectedSpotIds: [1621, 970, 1657],
      }
    ],
  };
  

  if (!courseData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">코스 데이터를 찾을 수 없습니다</h2>
          <p className="text-gray-600">이전 페이지로 돌아가서 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  /** 타입 정의 */
  type DayDetails = {
    day: number;
    spots: SpotDetail[];
    selectedSpotIds: number[];
    loading: boolean;
    error?: string;
  };

  /** 상태 관리 */
  const [dayDetails, setDayDetails] = useState<DayDetails[]>(
    courseData.daySlots.map((d: any) => ({
      day: d.day,
      selectedSpotIds: d.selectedSpotIds,
      spots: [],
      loading: true,
      error: undefined,
    }))
  );

  const [isEditing, setIsEditing] = useState(false);
  const [dragState, setDragState] = useState<{ day: number | null; from: number | null }>({
    day: null,
    from: null,
  });
  const [dragHandle, setDragHandle] = useState<{ day: number | null; index: number | null }>({
    day: null,
    index: null,
  });
  const [isDragging, setIsDragging] = useState(false);

  /** 일정 편집 모드 토글 */
  const toggleEditAll = () => setIsEditing(prev => !prev);


  // 장소추가 함수
  const addSpotToDay = (day: number) => {
    setDayDetails((prev) =>
      prev.map((d) => {
        if (d.day === day) {
          // 새 Spot 예시: id는 timestamp, 이름은 임시
          const newSpot: Spot = {
            id: Date.now(), 
            name: "새 장소",
            category: "ACTIVITY", // 기본 카테고리
          };
  
          return {
            ...d,
            spots: [...d.spots, newSpot],
            selectedSpotIds: [...d.selectedSpotIds, newSpot.id],
          };
        }
        return d;
      })
    );
  };

  // **드래그 종료 시 실행되는 함수**
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
  
    setDayDetails(prev => {
      const newDetails = prev.map(d => ({ ...d, spots: [...d.spots] })); // 깊은 복사
  
      const sourceDayData = newDetails.find(d => d.day === parseInt(source.droppableId));
      const destDayData = newDetails.find(d => d.day === parseInt(destination.droppableId));
      if (!sourceDayData || !destDayData) return prev;
  
      // 드래그한 아이템 제거
      const [movedSpot] = sourceDayData.spots.splice(source.index, 1);
  
      // 이동
      destDayData.spots.splice(destination.index, 0, movedSpot);
  
      return newDetails;
    });
  };
  

  // 스팟 삭제
  const removeSpotFromDay = (day: number, index: number) => {
    setDayDetails((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, spots: d.spots.filter((_, i) => i !== index) }
          : d
      )
    );
  };


  /** 특정 Day의 스팟 순서 변경 */
  const reorderDaySpots = (day: number, fromIndex: number, toIndex: number) => {
    setDayDetails(prev => {
      const next = prev.map(d => ({ ...d }));
      const target = next.find(d => d.day === day);
      if (!target || fromIndex === toIndex) return prev;

      // spots 배열에서 순서 변경
      const arr = [...target.spots];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      target.spots = arr;

      // daySlots.selectedSpotIds 배열도 동일하게 순서 변경
      const slot = courseData.daySlots.find((s: any) => s.day === day);
      if (slot && Array.isArray(slot.selectedSpotIds)) {
        const ids = [...slot.selectedSpotIds];
        const [movedId] = ids.splice(fromIndex, 1);
        ids.splice(toIndex, 0, movedId);
        slot.selectedSpotIds = ids;
      }

      return next;
    });
  };

  

  /** 각 Day의 스팟 정보 불러오기 */
  useEffect(() => {
    let cancelled = false;

    const fetchPerDay = async () => {
      await Promise.all(
        courseDataMock.daySlots.map(async (d: any, idx: number) => {
          const ids: number[] = d.selectedSpotIds || [];
          try {
            const res = await getSpotsByIds(ids);
            if (cancelled) return;

            const list = res.data || [];
            const byId = new Map(list.map(s => [s.id, s]));

            // selectedSpotIds 순서에 맞춰 재정렬
            const ordered = ids.map(id => byId.get(id)).filter(Boolean) as SpotDetail[];
            const extras = list.filter(s => !ids.includes(s.id));
            const finalList = [...ordered, ...extras];

            setDayDetails(prev => {
              const next = [...prev];
              next[idx] = { day: d.day, spots: finalList, loading: false, selectedSpotIds: ids };
              return next;
            });
          } catch {
            if (!cancelled) {
              setDayDetails(prev => {
                const next = [...prev];
                next[idx] = {
                  day: d.day,
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

    fetchPerDay();
    return () => {
      cancelled = true;
    };
  }, [courseData.daySlots]);

  /** 여행 기간 포맷 */
  const formatDuration = (days: number) => {
    if (days === 1) return '당일치기';
    if (days === 2) return '1박2일';
    if (days === 3) return '2박3일';
    return `${days - 1}박${days}일`;
  };



  /** 스팟의 첫 번째 이미지 URL 반환 */
  const getFirstImage = (spot: SpotDetail) => {
    const collected: string[] = [];
    if (!spot.imageUrls) return undefined;

    if (typeof spot.imageUrls === 'string') {
      collected.push(...parseImageUrls(spot.imageUrls));
    } else {
      for (const entry of spot.imageUrls) {
        if (typeof entry !== 'string') continue;
        const trimmed = entry.trim();
        collected.push(...(trimmed.startsWith('[') ? parseImageUrls(trimmed) : [trimmed]));
      }
    }

    return collected.find(u => /^https?:\/\//i.test(u));
  };

  return (
    <div className="pt-header-extended min-h-screen bg-white">
      {/* 헤더 */}
      <CourseHeader
        totalDistance={parseFloat(courseData.totalDistance.toFixed(1))}
        totalSpot={
          courseData.daySlots?.reduce((total: number, daySlot: any) => total + daySlot.selectedSpotIds.length, 0) || 0
        }
        LocationCode={regionName} // TODO: 실제 지역명으로 변경
        duration={formatDuration(courseData.days)}
        Categories= {categoriesString? categoriesString: courseData.categories?.map(translateCategory).join('/') || []}
        isOwner={true}
      />

      <main className="pt-5 w-full flex-1 px-4 lg:px-8 py-6 bg-white">


      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
        {dayDetails.map((dayData, idx) => (
  <div key={dayData.day}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-medium text-gray-800">Day {dayData.day}</h3>
      {idx === 0 && (
        <button
          onClick={toggleEditAll}
          className="px-3 py-1 text-gray-5 text-sm font-medium font-['Pretendard'] leading-normal "
        >
          {isEditing ? "완료" : "일정편집"}
        </button>
      )}
    </div>
    <DaySpots
      dayData={dayData}
      isEditing={isEditing}
      onDeleteSpot={removeSpotFromDay}
    />
    {/* 장소추가 버튼: isEditing일 때만 */}
    {isEditing && (
          <div className="mt-2">
            <button
              onClick={() => addSpotToDay(dayData.day)} // 함수 구현 필요
              className="px-3 py-1 text-sm border rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              장소 추가
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
