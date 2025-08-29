import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingUploadButton: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/posting');
  };

  return (
    <button
      onClick={handleUploadClick}
      className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-main-1 hover:bg-orange-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="게시글 작성"
    >
      {/* 플러스 아이콘 */}
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
};

export default FloatingUploadButton;
