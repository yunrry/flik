// src/components/Feed/MainBanner.tsx

import React, { useState, useEffect, useRef } from 'react';

interface BannerItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
}

interface CourseBannerProps {
  totalDistance: number;
  totalSpot: number;
  LocationCode: string;
  duration: string;
  Categories: string;
}

const CourseBanner: React.FC<CourseBannerProps> = ({
    totalDistance,
    totalSpot,
    LocationCode,
    duration,
    Categories,
}) => {

  const totalDistanceString = totalDistance === 0 ? ' -- ' : totalDistance.toString();

  return (
    <div className="flex w-full h-full items-center bg-white rounded-md ">
     <div className="flex flex-row m-3 my-4">
        <div className="flex rounded-full bg-teal-1 w-[48px] h-[48px] items-center justify-center">
            <span className="text-white text-xs font-normal font-['Pretendard'] leading-normal">{duration}</span>
        </div>
      
      <div className="flex flex-col ml-4 gap-1">

            <div className="flex flex-row">
                <span className="text-gray-3 text-sm font-semibold font-['Pretendard'] leading-normal">총 이동거리</span>
                <span className="text-gray-9 text-sm font-normal font-['Pretendard'] leading-normal mx-1">·</span>
                <span className="text-gray-5 text-sm font-normal font-['Pretendard'] leading-normal">{totalDistanceString}km</span>
            </div>

            <div className="flex flex-row">
                <span className="text-gray-3 text-sm font-semibold font-['Pretendard'] leading-normal">여행지역</span>
                <span className="text-gray-9 text-sm font-normal font-['Pretendard'] leading-normal mx-1">·</span>
                <span className="text-gray-5 text-sm font-normal font-['Pretendard'] leading-normal">{LocationCode}</span>
            </div>

            <div className="flex flex-row">
                <span className="text-gray-3 text-sm font-semibold font-['Pretendard'] leading-normal">총 {totalSpot}개 여행지</span>
                <span className="text-gray-9 text-sm font-normal font-['Pretendard'] leading-normal mx-1">·</span>
                <span className="text-gray-5 text-sm font-normal font-['Pretendard'] leading-normal">{Categories}</span>
            </div>

     
     </div>
     </div>
    </div>
  );
};

export default CourseBanner;