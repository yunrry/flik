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




        {/* 액션 버튼들 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 좋아요 버튼 */}
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
            >
              <svg 
                className={`w-5 h-5 ${liked ? 'text-red-500 fill-current' : ''}`} 
                fill={liked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likes > 0 && <span className="text-sm">{likes}</span>}
            </button>

            {/* 댓글 버튼 */}
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {comments > 0 && <span className="text-sm">{comments}</span>}
            </button>

            {/* 공유 버튼 */}
            <button className="text-gray-600 hover:text-green-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>


          {/* 더보기 버튼 */}
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;