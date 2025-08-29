// src/components/Profile/ActivityItem.tsx

import React from 'react';
import { UserActivity } from '../../types/user.types';

interface ActivityItemProps {
  activity: UserActivity;
  onClick?: (activity: UserActivity) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onClick }) => {
  // 활동 타입별 아이콘 반환
  const getActivityIcon = (type: UserActivity['type']) => {
    switch (type) {
      case 'save':
        return '📑';
      case 'review':
        return '✍️';
      case 'visit':
        return '📍';
      case 'like':
        return '❤️';
      case 'share':
        return '📤';
      default:
        return '📝';
    }
  };

  // 날짜 포맷팅 (YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 제목 길이 제한 (줄바꿈 처리)
  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handleClick = () => {
    if (onClick) {
      onClick(activity);
    }
  };

  return (
    <div 
      className="bg-white px-[5%] py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        {/* 이미지 또는 아이콘 */}
        <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
          {activity.imageUrl ? (
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-2xl">
                {getActivityIcon(activity.type)}
              </span>
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="text-base font-medium text-gray-900 leading-tight mb-1">
            {truncateTitle(activity.title)}
          </h3>

          {/* 설명 (있는 경우) */}
          {activity.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {activity.description}
            </p>
          )}

          {/* 메타데이터 (맛집 이름, 위치 등) */}
          {/* {activity.metadata && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
              {activity.metadata.restaurantName && (
                <span>{activity.metadata.restaurantName}</span>
              )}
              {activity.metadata.location && (
                <>
                  {activity.metadata.restaurantName && <span>•</span>}
                  <span>{activity.metadata.location}</span>
                </>
              )}
              {activity.metadata.rating && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    {activity.metadata.rating}
                  </span>
                </>
              )}
            </div>
          )} */}

          {/* 날짜 */}
          <p className="text-sm text-gray-400">
            {formatDate(activity.createdAt)}
          </p>
        </div>

        {/* 오른쪽 화살표 (선택사항) */}
        {/* <div className="flex-shrink-0 self-center">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div> */}
      </div>
    </div>
  );
};

export default ActivityItem;