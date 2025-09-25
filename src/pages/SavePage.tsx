import React, { useState, useEffect } from 'react';
import { HeaderBar } from '../components/Layout';
import SavedFlikCard from '../components/Feed/SavedFlikCard';
import CourseCard from '../components/Feed/CourseCard';
import { useThirdParty } from '../hooks/useThirdParty';
import { useAuthStore } from '../stores/authStore';
import { MapIcon } from '../components/Icons/SvgIcons';
import { SpotDetail } from '../types/spot.types';
import { getSpotsUserSaved } from '../api/flikCardsApi';
import { getUserSavedCourses } from '../api/travelCourseApi';
import { TravelCourse } from '../types/travelCourse.type';
import FloatingMapButton from '../components/UI/FloatingMapButton';


const SavePage: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSpots, setSavedSpots] = useState<SpotDetail[]>([]);
  const [savedCourses, setSavedCourses] = useState<TravelCourse[]>([]);
  const [activeTab, setActiveTab] = useState<'places' | 'courses'>('places');
  const { handleMapClick } = useThirdParty();

  const handleRemoveCourse = (courseId: number): void => {
    setSavedCourses(prev => prev.filter(course => course.id !== courseId));
  };


  const fetchSavedSpots = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getSpotsUserSaved();
      setSavedSpots(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('저장한 곳 조회 오류:', err);
      
      setSavedSpots([
        {
          id: 1,
          name: '마리오네',
          category: '이탈리아 음식',
          address: '서울 성동구'
        } as SpotDetail,
        {
          id: 2,
          name: '블루보틀 코피',
          category: '카페',
          address: '서울 강남구'
        } as SpotDetail,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCourses = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
  
      const result = await getUserSavedCourses();
  
      // 응답이 배열인지 확인
      if (Array.isArray(result.data)) {
        setSavedCourses(result.data);
      } else {
        console.warn('Unexpected API response:', result.data);
        setSavedCourses([]);
      }
  
    } catch (err) {
      setError(err instanceof Error ? err.message : '코스 조회 오류');
      console.error('코스 조회 오류:', err);
      setSavedCourses([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (activeTab === 'places') {
      fetchSavedSpots();
    } else {
      fetchSavedCourses();
    }
  }, [activeTab]);

  const currentCount = activeTab === 'places' 
  ? (savedSpots?.length ?? 0) 
  : (savedCourses?.length ?? 0);
  const currentData = activeTab === 'places' 
  ? (savedSpots ?? []) 
  : (savedCourses ?? []);
  
  return (
    <div className="min-h-screen bg-white">
      <HeaderBar variant="logo" />
      
      <main className="pt-header-default w-full lg:w-[60%] sm:max-w-7xl sm:mx-auto px-0 sm:px-2 lg:px-8 py-6 flex flex-col flex-1">
        {/* 토글 버튼 */}
        <div className="mx-[5%] mb-2 pt-4">
          <div className="flex h-9 border items-center border-gray-5 overflow-hidden">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 py-3 px-4 mt-0.5 text-center text-xs font-medium font-['Pretendard'] leading-normal transition-colors ${
                activeTab === 'courses'
                  ? 'bg-gray-5 text-white'
                  : 'bg-white text-gray-5 hover:bg-gray-50'
              }`}
            >
              저장한 플랜
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`flex-1 py-3 px-4 mt-0.5 text-center text-xs font-medium font-['Pretendard'] leading-normal transition-colors ${
                activeTab === 'places'
                  ? 'bg-gray-5 text-white'
                  : 'bg-white text-gray-5 hover:bg-gray-50'
              }`}
            >
              저장한 장소
            </button>
          </div>
        </div>

        {/* 카운트 및 지도 버튼 */}
        <div className="px-[5%] py-[3%]">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => activeTab === 'places' && handleMapClick(savedSpots, '/save')}
          >
  
            <span className="text-sm text-gray-500 ml-auto">
           {activeTab === 'places' ? '총 ' + currentCount + '곳' : ''}
            </span>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex flex-col gap-0 justify-start">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-1"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-gray-500">{error}</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">
                저장된 {activeTab === 'places' ? '맛집이' : '플랜이'} 없습니다.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {activeTab === 'places' 
                  ? '플릭 카드에서 맛집을 저장해보세요!' 
                  : '여행 플랜을 저장해보세요!'
                }
              </p>
            </div>
          ) : activeTab === 'places' ? (
            // 저장한 장소 렌더링
            savedSpots.map((spot, index) => (
              <div key={spot.id}>
                <SavedFlikCard spot={spot} />
                {index !== savedSpots.length - 1 && (
                  <div className="h-[1px] bg-gray-10 my-0 mx-[3%]"></div>
                )}
              </div>
            ))
          ) : (
            // 저장한 플랜 렌더링
            <div className="px-[5%]">
              {savedCourses.map((course) => (
                <CourseCard 
                  key={course.id}
                  course={course}
                  onRemove={handleRemoveCourse}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      {activeTab === 'places' && (
      <FloatingMapButton 
        handleMapClick={() => handleMapClick(savedSpots, '/save')}
        bgColor='bg-main-1'
        />
      )}
    </div>
  );
};

export default SavePage;