// src/components/Feed/CategoryList.tsx

import React from 'react';
import CategoryCircle from '../UI/CategoryCircle';
import { CategoryListProps } from '../../types/category.types';

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
  className = '',
  showScrollIndicator = false
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* 스크롤 영역 */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2.5 px-4 py-2 min-w-max">
          {categories.map((category) => (
            <CategoryCircle
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              backgroundColor={category.backgroundColor}
              isActive={activeCategory === category.id}
              onClick={onCategorySelect}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      {showScrollIndicator && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        
        </div>
      )}
    </div>
  );
};

export default CategoryList;