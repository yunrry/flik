// src/components/Feed/FeaturedLocationCard.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCircle from '../UI/CategoryCircle';
import LocationExploreButton from '../Buttons/LocationExploreButton';
import { REGION_CONFIG } from '../../data/categoryData';
import { FeaturedLocation } from '../../data/featuredLocationData'; // 타입 import 추가


interface FeaturedLocationCardProps {
  location: FeaturedLocation;
  onExplore?: (locationId: string) => void;
  className?: string;
  defaultExpanded?: boolean; // 새로운 prop 추가
}

const FeaturedLocationCard: React.FC<FeaturedLocationCardProps> = ({
  location,
  onExplore,
  className = '',
  defaultExpanded = false
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };


  // region 코드를 기반으로 REGION_CONFIG에서 이미지 URL 찾기
  const getRegionImageUrl = (regionName: string) => {
    const regionEntry = Object.entries(REGION_CONFIG).find(
      ([_, config]) => config.name === regionName
    );
    return regionEntry ? regionEntry[1].imageUrl : location.imageUrl;
  };

  // 한국어 지역명을 영어 키로 변환하는 함수 추가
  const getRegionCode = (regionName: string): string => {
    const regionEntry = Object.entries(REGION_CONFIG).find(
      ([_, config]) => config.name === regionName
    );
    return regionEntry ? regionEntry[0] : regionName.toLowerCase();
  };

  const handleLocationClick = () => {
    // 한국어 지역명을 영어 키로 변환
    const regionCode = getRegionCode(location.region);
    navigate(`/region/${regionCode}`);
    console.log('Location clicked:', location.region, '-> regionCode:', regionCode);
  };

  return (
    <div className={`bg-white w-full rounded-md overflow-hidden shadow-sm ${className}`}>
      {/* 헤더 영역 */}
      <div className="w-full flex items-center justify-center gap-3 p-3 pl-0">

          <CategoryCircle
            id={getRegionCode(location.region)}
            name={location.region}
            icon={getRegionImageUrl(location.region)}
            onClick={(id) => {}} // 빈 함수 (상위 button에서 처리)
            className="flex-shrink-0"
            size="sm"
            variant="photo-only"
          />

        <button
           onClick={toggleExpanded}
           className="w-4/5 transition-colors p-0 flex-shrink-0 flex justify-between"
         >
          <div className="text-left w-full flex-grow">

            <p className="text-xs text-gray-6 font-normal font-['Pretendard'] leading-tight">
              {location.description}
            </p>
            <h3 className="text-gray-1 text-base font-medium font-['Pretendard'] leading-normal mt-0.5">
              {location.city}
            </h3>
          </div>
  

        {/* 오른쪽 영역 - 토글 버튼 */}
        <div className="pt-3">

           <svg 
             className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
               isExpanded ? 'transform rotate-180' : ''
             }`}
             fill="none" 
             stroke="currentColor" 
             viewBox="0 0 24 24"
           >

            
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
           </svg>
           </div>
         </button>
         
</div>

      {/* 확장된 콘텐츠 영역 */}
      {isExpanded && (
        <div className="rounded-sm">
          {/* 이미지 갤러리 */}
          <div className="grid grid-cols-2 gap-1 mb-0.5">
            {/* 메인 이미지 */}
            <div className="col-span-1">
              <img 
                src={location.imageUrl}
                alt={`${location.region} 메인`}
                className="w-full h-32 object-cover rounded-sm"
              />
            </div>
            
            {/* 서브 이미지들 */}
            <div className="col-span-1 grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="relative">
                  <img 
                    src={location.imageUrl}
                    alt={`${location.region} ${index + 1}`}
                    className="w-full h-[62px] object-cover rounded-sm"
                  />
                  {/* 마지막 이미지에 더보기 오버레이 */}
                  {index === 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">+더보기</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 하이라이트 */}
          {/* <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {location.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div> */}

          {/* 플릭하러 가기 버튼 */}
          <LocationExploreButton
            onClick={handleLocationClick}
          />
        </div>
      )}
    </div>
  );
};

export default FeaturedLocationCard;