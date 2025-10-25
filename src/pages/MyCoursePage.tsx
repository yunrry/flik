import React, { useState, useEffect } from 'react';
import CourseCard from '../components/Feed/CourseCard';
import { getUserSavedCourses } from '../api/travelCourseApi';
import { TravelCourse } from '../types/travelCourse.type';
import { BackArrowIcon } from '../components/Icons/SvgIcons';
import { useNavigate, useLocation } from 'react-router-dom';
import { SpotDetail } from '../types/spot.types';


const MyCoursePage: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCourses, setSavedCourses] = useState<TravelCourse[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { currentLocations, currentCourse, title, content, images, returnPath } = location.state as {
    currentLocations: SpotDetail[];
    currentCourse: TravelCourse;
    title: string;
    content: string;
    images: string[];
    returnPath: string;
  };

  const handleCourseSelect = (selectedCourse: TravelCourse) => {
  
      // 기존 PostingPage 요청
      navigate(returnPath, {
        state: { 
          selectedLocations: currentLocations,
          selectedCourse, // ✅ 수정 완료
          images, 
          content, 
          title 
        }
      });

  };

  const handleRemoveCourse = (courseId: number): void => {
    setSavedCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const handleBack = () => {
    navigate(returnPath, {
      state: { 
        selectedLocations: currentLocations,
        selectedCourse: currentCourse, // ✅ 수정 완료
        images, 
        content, 
        title 
      }
    });
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

      fetchSavedCourses();

  }, []);


  
  return (
    <div className="min-h-screen bg-white">

    <header className="flex items-end justify-between px-4 w-full h-[4rem]">
      <button onClick={handleBack}>
      <BackArrowIcon 
      size='xl2'
      />
      </button>
    </header>
 
      <main className="pt-6 w-full px-0 lg:px-8 py-6">
       

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
          ) : savedCourses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">
                제작한 플랜이 없습니다.
              </p>

            </div>
          ) : (
            <div className="px-[5%]">
              {savedCourses.map((course) => (
                <div key={course.id}>
                <CourseCard 
                  key={course.id}
                  course={course}
                  onRemove={handleRemoveCourse}
                  onCourseSelect={handleCourseSelect}
                  fromPath={"/my-course"}
                />
                
              </div>
              ))}
        
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
};

export default MyCoursePage;