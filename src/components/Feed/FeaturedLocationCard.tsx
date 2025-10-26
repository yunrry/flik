// src/components/Feed/FeaturedLocationCard.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCircle from '../UI/CategoryCircle';
import LocationExploreButton from '../Buttons/LocationExploreButton';
import { REGION_CONFIG } from '../../data/categoryData';
import { FeaturedLocation } from '../../data/featuredLocationData';
import { usePostFeed } from '../../hooks/usePostFeed';

interface FeaturedLocationCardProps {
  location: FeaturedLocation;
  onExplore?: (locationId: string) => void;
  className?: string;
  defaultExpanded?: boolean;
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

  // 한국어 지역명을 영어 키로 변환하는 함수
  const getRegionCode = (regionName: string): string => {
    const regionEntry = Object.entries(REGION_CONFIG).find(
      ([_, config]) => config.name === regionName
    );
    return regionEntry ? regionEntry[0] : regionName.toLowerCase();
  };

  // region 코드를 기반으로 REGION_CONFIG에서 이미지 URL 찾기
  const getRegionImageUrl = (regionName: string) => {
    const regionEntry = Object.entries(REGION_CONFIG).find(
      ([_, config]) => config.name === regionName
    );
    return regionEntry ? regionEntry[1].imageUrl : location.imageUrl;
  };

  // posts에서 이미지 URL 추출
  const region = getRegionCode(location.region);
  const { posts } = usePostFeed({ region });
  
  const getPostImages = () => {
    const imageUrls = posts
      .filter((post) => post.imageUrls && post.imageUrls.length > 0)
      .map((post) => post.imageUrls[0]);
    
    // 최대 5개 이미지만 반환 (메인 1개 + 서브 4개)
    return imageUrls.slice(0, 5);
  };

  const postImages = getPostImages();
  const mainImage = postImages[0] || location.imageUrl;
  const subImages = postImages.slice(1, 5);

  const handleLocationClick = () => {
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
          onClick={(id) => {}}
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

          {/* 토글 버튼 */}
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
                src={mainImage}
                alt={`${location.region} 메인`}
                className="w-full h-32 object-cover rounded-sm"
              />
            </div>
            
            {/* 서브 이미지들 */}
            <div className="col-span-1 grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, index) => {
                const imageUrl = subImages[index] || location.imageUrl;
                return (
                  <div key={index} className="relative">
                    <img 
                      src={imageUrl}
                      alt={`${location.region} ${index + 1}`}
                      className="w-full h-[62px] object-cover rounded-sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>

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