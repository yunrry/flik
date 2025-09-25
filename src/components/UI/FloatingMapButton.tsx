import React from 'react';
import { MapCustomIcon } from '../Icons/SvgIcons';

interface FloatingMapButtonProps {
  handleMapClick: () => void;
  bgColor: string; // Tailwind 색상 클래스명 예: 'bg-main-1', 'bg-blue-500'
}

const FloatingMapButton: React.FC<FloatingMapButtonProps> = ({ handleMapClick, bgColor }) => {
  return (
    <button
      onClick={handleMapClick}
      className={`fixed bottom-24 lg:bottom-[5%] right-6 lg:right-[24%] z-50 w-12 h-12 ${bgColor} hover:${bgColor} rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
      aria-label="게시글 작성"
    >
      <MapCustomIcon size={20} color="white" />
    </button>
  );
};

export default FloatingMapButton;
