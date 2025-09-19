import React from 'react';
import { MapCustomIcon } from '../Icons/SvgIcons';

const FloatingMapButton: React.FC<{ handleMapClick: () => void }> = ({ handleMapClick }) => {
  

  return (
    <button
      onClick={handleMapClick} 
      className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-main-1 hover:bg-main-1 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="게시글 작성"
    >
      {/* 플러스 아이콘 */}
      <MapCustomIcon 
        size={20}
        color="white"
      />
      
    </button>
  );
};

export default FloatingMapButton;
