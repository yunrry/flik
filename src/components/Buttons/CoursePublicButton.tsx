import { useState } from 'react';










const CoursePublicButton: React.FC = () => {

    const [isPublic, setIsPublic] = useState(false);

    const handleCoursePublic = () => {
        console.log('CoursePublicButton clicked');
        setIsPublic(!isPublic);
    };


    return (
        <div className="flex items-center space-x-1 transition-colors p-1">
        {isPublic ? (
            <div className="flex flex-row w-24 bg-neutral-900/10 rounded-3xl inline-flex justify-between items-center">
            <button
            onClick={handleCoursePublic}
            aria-label="비공개"
            className="inline-flex justify-center items-center w-12 pl-1.5">
                <div className="text-center text-white text-[10px] font-normal font-['Pretendard'] leading-3">비공개</div>
                </button>

        <div className="w-12 h-6 bg-neutral-900/10 rounded-3xl inline-flex  justify-center items-center">
            <div className="text-center justify-start text-white text-[10px] font-normal font-['Pretendard'] leading-3">공개</div> 

        </div>
        </div>
        ) : (
            <div className="flex flex-row rounded-3xl inline-flex justify-center items-center gap-2.5">
            <button
            onClick={handleCoursePublic}
            aria-label="공개"
            className="w-12 h-6 bg-neutral-900/10 rounded-3xl inline-flex flex-col justify-center items-center"
            >
                <div className="text-center justify-start text-white text-[10px] font-normal font-['Pretendard'] leading-3">공개</div>
            </button>
            </div>
        )}
        </div>
    );
};

export default CoursePublicButton;