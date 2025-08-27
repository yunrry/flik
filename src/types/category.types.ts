// src/types/category.types.ts

export interface Category {
    id: string;
    name: string;
    icon: string;
    backgroundColor: string;
    description?: string;
    itemCount?: number;
  }
  
  export interface CategoryListProps {
    categories: Category[];
    activeCategory?: string;
    onCategorySelect: (categoryId: string) => void;
    className?: string;
    showScrollIndicator?: boolean;
  }
  
  export interface CategoryCircleProps {
    id: string;
    name: string;
    icon: string;
    backgroundColor?: string;
    isActive?: boolean;
    onClick: (id: string) => void;
    className?: string;
  }