// src/hooks/useCategory.ts

import { useState, useEffect } from 'react';
import { Category } from '../types/category.types';
import { getCategoryData, findCategoryById } from '../data/categoryData';

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategoryData();
        setCategories(data);
        // 첫 번째 카테고리를 기본 활성 카테고리로 설정
        if (data.length > 0) {
          setActiveCategory(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '카테고리 데이터 로딩 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'more') {
      // 더보기 버튼 클릭시 전체 지역 페이지로 이동
      console.log('Navigate to all regions page');
      // 추후 React Router 네비게이션 추가
      // navigate('/regions/all');
      return;
    }
    
    setActiveCategory(categoryId);
    console.log('Category selected:', categoryId);
    // 추후 필터링 로직 추가
  };

  const getActiveCategory = (): Category | undefined => {
    return findCategoryById(activeCategory);
  };

  return {
    categories,
    activeCategory,
    isLoading,
    error,
    handleCategorySelect,
    getActiveCategory
  };
};