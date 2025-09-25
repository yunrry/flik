// src/pages/RegionPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import PostFeed from '../components/Feed/PostFeed';
import { usePostFeed } from '../hooks/usePostFeed';
import { TravelCourse } from '../types/travelCourse.type';
import CourseCard from '../components/Feed/CourseCard';
import { getRegionCourses } from '../api/travelCourseApi';
import { getRegionCode } from '../types/sigungu.types';

// API 응답 매핑 함수
interface ApiTravelCourse {
  id: number;
  userId: number;
  days: number;
  totalDistance: number | null;
  courseSlots: any[][];
  createdAt: string;
  courseType: string;
  regionCode: string;
  selectedCategories: string[]; // ["[history_culture, cafe]"]
  filledSlots: number;
  totalSlots: number;
  isPublic: boolean;
  allRecommendedSpotIds?: number[];
}


const RegionPage: React.FC = () => {
  const { region } = useParams<{ region: string }>();
  const [activeTab, setActiveTab] = useState<'blog' | 'courses'>('blog');
  const [regionCourses, setRegionCourses] = useState<TravelCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { posts, isLoading: postsLoading, hasMore, loadMorePosts } = usePostFeed({ region });
  console.log('region', region);

  const mapApiToTravelCourse = (apiCourse: ApiTravelCourse): TravelCourse => {
    let categories: string[] = [];
    if (Array.isArray(apiCourse.selectedCategories) && apiCourse.selectedCategories.length > 0) {
      categories = apiCourse.selectedCategories
        .map(c => {
          // 대괄호 제거 후 쉼표로 분할
          const cleaned = c.replace(/[\[\]]/g, '').trim();
          return cleaned.split(',').map(s => s.trim()).filter(s => s);
        })
        .flat();
    }
  
    return {
      id: apiCourse.id,
      userId: apiCourse.userId,
      days: apiCourse.days,
      regionCode: apiCourse.regionCode,
      totalDistance: apiCourse.totalDistance,
      courseSlots: apiCourse.courseSlots,
      createdAt: apiCourse.createdAt,
      courseType: apiCourse.courseType,
      totalSlots: apiCourse.totalSlots,
      filledSlots: apiCourse.filledSlots,
      selectedCategories: categories,
      isPublic: apiCourse.isPublic
    };
  };


  const mapApiCoursesToTravelCourses = (apiCourses: ApiTravelCourse[]): TravelCourse[] => {
    return apiCourses.map(mapApiToTravelCourse);
  };
  // 지역 코스 조회
  useEffect(() => {
    if (!region || activeTab !== 'courses') return;

    const regionCode = getRegionCode(region); // 2자리 코드
    if (!regionCode) {
      setRegionCourses([]);
      return;
    }

    const fetchRegionCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getRegionCourses(regionCode);
        console.log('API 응답:', response);
        
        const normalizedData = Array.isArray(response) 
          ? mapApiCoursesToTravelCourses(response)
          : [];


        setRegionCourses(normalizedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '코스 조회 오류');
        setRegionCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionCourses();
  }, [region, activeTab]);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <HeaderBar variant="back-from-sido" region={region as any} />

      {/* 메인 콘텐츠 */}
      <main className="pt-header-extended w-full sm:max-w-7xl sm:mx-auto px-0 sm:px-2 lg:px-8 py-6">
        {/* 토글 버튼 */}
        <div className="mx-[5%] mb-2 pt-4">
          <div className="flex h-9 border items-center border-gray-5 overflow-hidden">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 py-3 px-4 mt-0.5 text-center text-xs font-medium leading-normal transition-colors ${
                activeTab === 'courses'
                  ? 'bg-gray-5 text-white'
                  : 'bg-white text-gray-5 hover:bg-gray-50'
              }`}
            >
              다른 사용자 플랜
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex-1 py-3 px-4 mt-0.5 text-center text-xs font-medium leading-normal transition-colors ${
                activeTab === 'blog'
                  ? 'bg-gray-5 text-white'
                  : 'bg-white text-gray-5 hover:bg-gray-50'
              }`}
            >
              블로그
            </button>
          </div>
        </div>

        {/* 콘텐츠 렌더링 */}
        {activeTab === 'blog' ? (
          <div className="flex-col items-start justify-between mb-2 lg:px-6 sm:px-4">
            <PostFeed
              posts={posts}
              isLoading={postsLoading}
              hasMore={hasMore}
              onLoadMore={loadMorePosts}
            />
          </div>
        ) : (
          <div className="px-[5%]">
            {loading && <p>코스를 불러오는 중...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && regionCourses.length === 0 && <p>등록된 코스가 없습니다.</p>}
            {regionCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RegionPage;
