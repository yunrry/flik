// src/components/Feed/PostCard.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCircle from '../UI/CategoryCircle';
import { REGION_CONFIG } from '../../data/categoryData';
import { REGION_CONFIG_FOR_POST, RegionCodeForPost } from '../../types/region.types';

interface PostCardProps {
  id: string;
  title: string;
  imageUrl: string;
  imageCount?: number;
  regionCode: string;
  content: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onClick?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  imageUrl,
  imageCount = 1,
  regionCode,
  content,
  likes = 0,
  comments = 0,
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  onClick
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    onLike?.(id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    onSave?.(id);
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleLocationClick = (categoryId: string) => {
    // 지역 페이지로 이동
    const regionCode = categoryId.toLowerCase();
    navigate(`/region/${regionCode}`);
    console.log('Location clicked:', categoryId);
  };

  // region 코드를 기반으로 REGION_CONFIG에서 이미지 URL 찾기
  const getRegionImageUrl = (regionName: string) => {
    const regionEntry = Object.entries(REGION_CONFIG).find(
      ([_, config]) => config.name === regionName
    );
    return regionEntry ? regionEntry[1].imageUrl : '';
  };

  return (
    <div 
      className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 메인 이미지 */}
      <div className="relative">
        <img 
          src={imageUrl}
          alt="음식 사진"
          className="w-full h-48 sm:h-56 object-cover"
        />
        
        {/* 이미지 개수 표시 */}
        {imageCount > 1 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full">
            {imageCount}
          </div>
        )}
      </div>

      {/* 하단 정보 영역 */}
      <div className="p-2 pl-1">
        {/* 위치 정보 */}
        <div className="flex items-center space-x-3 mb-3">
          <CategoryCircle
            id={REGION_CONFIG_FOR_POST[regionCode.substring(0, 2) as RegionCodeForPost].englishName.toLowerCase()}
            name={REGION_CONFIG_FOR_POST[regionCode.substring(0, 2) as RegionCodeForPost].name}
            icon={REGION_CONFIG_FOR_POST[regionCode.substring(0, 2) as RegionCodeForPost].imageUrl}
            onClick={handleLocationClick}
            className="flex-shrink-0"
            size="sm"
            variant="photo-only"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              {title}
            </h3>
            <p className="text-gray-500 text-sm">
              {REGION_CONFIG_FOR_POST[regionCode.substring(0, 2) as RegionCodeForPost].name}
            </p>
          </div>
        </div>

        {/* 설명 텍스트 */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
          {content}
        </p>



      </div>
    </div>
  );
};

export default PostCard;