import { useState } from 'react';
import { updateCourseVisibility } from '../../api/travelCourseApi';

const CoursePublicButton: React.FC<{
  courseId: number;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
}> = ({ courseId, isPublic, setIsPublic }) => {

  const [isUpdating, setIsUpdating] = useState(false);

  const handleCoursePublic = async () => {
    try {
      setIsUpdating(true);
      const newIsPublic = !isPublic;
      
      const response = await updateCourseVisibility(courseId, newIsPublic);
      
      if (response.success) {
        setIsPublic(newIsPublic);
        console.log('공개 여부 업데이트 성공:', newIsPublic);
      }
    } catch (error) {
      console.error('공개 여부 업데이트 실패:', error);
      alert('공개 여부 변경에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-1 transition-colors p-1">
      {isPublic ? (
        <div className="flex flex-row w-24 bg-neutral-900/10 rounded-3xl inline-flex justify-between items-center">
          <button
            onClick={handleCoursePublic}
            disabled={isUpdating}
            aria-label="비공개"
            className="inline-flex justify-center items-center w-12 pl-1.5 disabled:opacity-50"
          >
            <div className="text-center text-white text-[10px] font-normal font-['Pretendard'] leading-3">
              비공개
            </div>
          </button>

          <div className="w-12 h-6 bg-neutral-900/10 rounded-3xl inline-flex justify-center items-center">
            <div className="text-center justify-start text-white text-[10px] font-normal font-['Pretendard'] leading-3">
              공개
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row rounded-3xl inline-flex justify-center items-center gap-2.5">
          <button
            onClick={handleCoursePublic}
            disabled={isUpdating}
            aria-label="공개"
            className="w-12 h-6 bg-neutral-900/10 rounded-3xl inline-flex flex-col justify-center items-center disabled:opacity-50"
          >
            <div className="text-center justify-start text-white text-[10px] font-normal font-['Pretendard'] leading-3">
              공개
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePublicButton;