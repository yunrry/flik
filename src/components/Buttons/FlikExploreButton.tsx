// src/components/Buttons/FlikExploreButton.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FlikExploreButtonProps {
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const FlikExploreButton: React.FC<FlikExploreButtonProps> = ({
  disabled = false,
  loading = false,
  className = '',
  children = '플릭하러 가기'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/flik');
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        w-full bg-main-1 text-white font-medium py-3
        hover:bg-main-1 active:bg-orange-700
        disabled:bg-gray-300 disabled:cursor-not-allowed
        transition-all duration-200
        flex items-center justify-center
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          로딩 중...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default FlikExploreButton;
