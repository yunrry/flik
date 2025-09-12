import React, { useEffect, useState } from 'react';
import { HeaderBar } from '../components/Layout';
import CategoryCircle from '../components/UI/CategoryCircle';
import { Category } from '../types/category.types';
import { getAllCategoryData } from '../data/categoryData';



const NationwidePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    const loadAllCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCategoryData();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllCategories();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    console.log('Selected region:', categoryId);
    // 추후 해당 지역 상세 페이지로 이동하는 로직 추가
  };

  

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex-shrink-0">
        <HeaderBar variant="back-from-nationwide" />
      </div>

      {/* 메인 콘텐츠 - 헤더 높이만큼 패딩 추가 */}
      <main className="pt-header-extended max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
     {/* 전체 지역 그리드 */}
     <div className="bg-white rounded-lg p-4">
          {isLoading ? (
            <div className="grid grid-cols-4 gap-4">
              {[...Array(16)].map((_, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-x-12 gap-y-5">
              {categories.map((category) => (
                <CategoryCircle
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  icon={category.icon}
                  backgroundColor={category.backgroundColor}
                  isActive={activeCategory === category.id}
                  onClick={handleCategorySelect}
                  className="justify-self-center"
                  variant="overlay"
                  size="lg"
                />
              ))}
            </div>
          )}
        </div>
  
      </main>

    
    </div>
  );
};

export default NationwidePage;

