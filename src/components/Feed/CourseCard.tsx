import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TravelCourse } from '../../types/travelCourse.type';
import { REGION_CONFIG } from '../../data/categoryData';
import { RegionCode } from '../../types/region.types';
import { REGION_CODE_TO_KEY } from '../../types/sigungu.types';
import { getRegionName } from '../../types/sigungu.types';
import { formatAddress } from '../../utils/formater';
import { formatCategories } from '../../utils/formater';

interface CourseCardProps {
  course: TravelCourse;
  onRemove?: (id: number) => void;
  onCourseSelect?: (course: TravelCourse) => void;
  fromMyCourse?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onRemove, fromMyCourse, onCourseSelect }) => {
  const navigate = useNavigate();

  // 디버깅: 받은 course 데이터 확인
  console.log('CourseCard에서 받은 course:', course);

  const handleCardClick = () => {
    console.log('카드 클릭됨, course ID:', course.id);
    
    // 코스 데이터에서 필요한 정보만 추출
    const courseData = course;
    const extractedData = {
      id: courseData.id,
      userId: courseData.userId,
      categories: courseData.selectedCategories, // 요청한 카테고리들
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

    // 변수들 디버깅
    const location = formatAddress(getRegionName(course.regionCode) || '');
    const categories = formatCategories(course.selectedCategories);
    
    console.log('location:', location);
    console.log('categories:', categories);
    console.log('regionCode:', course.regionCode);

// 코스 생성 성공 시 코스 페이지로 이동
navigate(`/course/${course.id}`, { 
 state: { 
   courseData: extractedData,
   locationString: location,
   categoriesString: categories
 } 
});

  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (onRemove) {
      onRemove(course.id);
    }
  };

  const handleCourseSelect = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (onCourseSelect) {
      onCourseSelect(course);
    }
  };



  const getRegionImageUrl = (regionCode: string): string | null => {
    if (!regionCode || regionCode.length !== 5) return null;
    
    const sidoCode = regionCode.substring(0, 2); // 앞 2자리 (시도 코드)
    
    // REGION_CODE_TO_KEY에서 키값 가져오기
    const regionKey = REGION_CODE_TO_KEY[sidoCode];
    if (!regionKey) return null;
    
    // REGION_CONFIG에서 해당 지역의 이미지 URL 가져오기
    const regionConfig = REGION_CONFIG[regionKey as RegionCode];
    return regionConfig?.imageUrl || null;
  };

  const regionImageUrl = getRegionImageUrl(course.regionCode);
  const duration = course.days-1 + '박' + course.days + '일';
  const location = formatAddress(getRegionName(course.regionCode) || '');
  const description = '총 ' + course.filledSlots + '개 여행지';
  const categories = formatCategories(course.selectedCategories);
  const parts = location?.split(' ') ?? [];
  const title = parts[0] + ' 여행코스';

  return (
    <div 
      className="bg-white border border-gray-200 rounded-sm p-1.5 mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        {/* 코스 이미지 */}
        <div className="w-24 h-20 bg-blue-500 rounded-sm flex-shrink-0 overflow-hidden">
          {regionImageUrl ? (
            <img 
              src={regionImageUrl} 
              alt={duration}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-medium">{duration}</span>
            </div>
          )}
        </div>

        {/* 코스 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">

            <div className="flex flex-row items-start justify-between">
                
              <div className="flex flex-col items-start justify-between">
              <p className="text-gray-3 text-sm font-semibold font-['Pretendard'] leading-normal mt-1.5">
                {title}
              </p>
              <p className="text-gray-5 text-xs font-normal font-['Pretendard'] leading-tight mt-1">
                {location}
              </p>
            </div>

            {/* 삭제 버튼 */}
            {onRemove && !fromMyCourse && (
              <button
                onClick={handleRemoveClick}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="코스 삭제"
              >
                <X size={18} />
              </button>
            )}

            {fromMyCourse && (
             <button
             onClick={handleCourseSelect}
             className="w-11 h-7 p-0.5 bg-gray-8 rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
           >
             <text className="text-center justify-start text-gray-3 text-xs font-semibold font-['Pretendard'] leading-normal">선택</text>
           </button>
            )}

            </div>


            <div className="flex flex-row items-center pt-3 w-full">
              <p className="text-gray-5 text-xs font-semibold font-['Pretendard'] leading-normal whitespace-nowrap">
                {description}
              </p>
              <p className="text-gray-5 text-xs font-normal font-['Pretendard'] leading-normal truncate ml-1 min-w-0">
                {' · '+categories}
              </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;