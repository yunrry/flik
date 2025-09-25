import React, { useState, useEffect } from 'react';
import CourseBanner from '../Feed/CourseBanner';
import { BackArrowIcon } from '../Icons/SvgIcons';
import CoursePublicButton from '../Buttons/CoursePublicButton';
import { useNavigate } from 'react-router-dom';

interface CourseHeaderProps {
    totalDistance: number;
    totalSpot: number;
    LocationCode: string;
    duration: string;
    Categories: string;
    isOwner: boolean;
    courseId: number;
    isPublic: boolean;
    setIsPublic: (isPublic: boolean) => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
    totalDistance,
    totalSpot,
    LocationCode,
    duration,
    Categories,
    isOwner,
    courseId,
    isPublic,
    setIsPublic,
}) => {
  
  const navigate = useNavigate();
  const onBack = () => {
    navigate('/save');
  };

    
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-teal-1"
      style={{
        height: 'var(--header-height-extended)'
      }}
    >
    
        <div className="flex flex-col items-center">
            
        <div className="flex flex-row items-center justify-between w-full lg:w-[60%] mb-2 mt-5 px-4 lg:px-[3%]">
         
         <button onClick={onBack}>
          <BackArrowIcon size="lg" color="white" />
          </button>
        {isOwner?(
            
                <CoursePublicButton 
                courseId={courseId}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
                />
            
        ):(
            <text className="text-white text-lg font-medium font-['Pretendard'] leading-normal">-- 님의 여행코스</text>
        )}

          </div>
          <div className="w-full lg:w-[60%] px-[3%]">
        <CourseBanner
        totalDistance={totalDistance}
        totalSpot={totalSpot}
        LocationCode={LocationCode}
        duration={duration}
        Categories={Categories}
      />
      </div>
    </div>
    </header>
  );
};

export default CourseHeader;
