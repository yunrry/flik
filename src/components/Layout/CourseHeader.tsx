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
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
    totalDistance,
    totalSpot,
    LocationCode,
    duration,
    Categories,
    isOwner,
}) => {
  
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };

    
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-teal-1"
      style={{
        height: 'var(--header-height-extended)'
      }}
    >
    
        <div className="flex flex-col items-center p-[3%]">
            
        <div className="flex flex-row items-center justify-between w-full mb-2 mt-5">
         
         <button onClick={onBack}>
          <BackArrowIcon size="lg" color="white" />
          </button>
        {isOwner?(
            
                <CoursePublicButton />
            
        ):(
            <text className="text-white text-lg font-medium font-['Pretendard'] leading-normal">-- 님의 여행코스</text>
        )}

          </div>
        <CourseBanner
        totalDistance={totalDistance}
        totalSpot={totalSpot}
        LocationCode={LocationCode}
        duration={duration}
        Categories={Categories}
      />
  
    </div>
    </header>
  );
};

export default CourseHeader;
