import React from 'react';

interface LocationIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: string;
  className?: string;
  onClick?: () => void;
  variant?: 'filled' | 'outline' | 'pin';
}

const getSizeStyles = (size: string = 'md') => {
  const sizeStyles = {
    xs: { width: '12px', height: '12px' },
    sm: { width: '16px', height: '16px' },
    md: { width: '20px', height: '20px' },
    lg: { width: '24px', height: '24px' },
    xl: { width: '32px', height: '32px' },
    '2xl': { width: '40px', height: '40px' },
  };
  return sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.md;
};

export const LocationIcon: React.FC<LocationIconProps> = ({ 
  size = 'md', 
  color = '#333333', 
  className = '', 
  onClick,
  variant = 'outline'
}) => {
  const sizeStyles = getSizeStyles(size);

  const renderLocationIcon = () => {
    switch (variant) {
      case 'filled':
        return (
          <>
            <path 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              fill={color}
              stroke={color}
              strokeWidth="1"
            />
            <circle cx="12" cy="11" r="3" fill="white" />
          </>
        );
      
      case 'pin':
        return (
          <>
            <path 
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
              fill={color}
              stroke={color}
              strokeWidth="1"
            />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </>
        );
      
      default: // outline
        return (
          <>
            <path 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <circle 
              cx="12" 
              cy="11" 
              r="3" 
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
          </>
        );
    }
  };

  return (
    <svg 
      className={`location-icon ${className}`}
      style={sizeStyles}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      role={onClick ? "button" : "img"}
      aria-label="위치 아이콘"
    >
      {renderLocationIcon()}
    </svg>
  );
};

export default LocationIcon;
