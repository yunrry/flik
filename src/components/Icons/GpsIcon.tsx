import React from 'react';

interface GpsIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: string;
  className?: string;
  onClick?: () => void;
  variant?: 'outline' | 'filled';
  isActive?: boolean;
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

export const GpsIcon: React.FC<GpsIconProps> = ({ 
  size = 'md', 
  color = '#555555', 
  className = '', 
  onClick,
  variant = 'outline',
  isActive = false
}) => {
  const sizeStyles = getSizeStyles(size);

  return (
    <svg 
      className={`gps-icon ${className}`}
      style={sizeStyles}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      role={onClick ? "button" : "img"}
      aria-label="GPS 아이콘"
    >
      <path 
        d="M12.6364 5V6.94855C13.7579 7.09019 14.8004 7.6009 15.5998 8.40024C16.3991 9.19958 16.9098 10.2421 17.0515 11.3636H19V12.6364H17.0515C16.9098 13.7579 16.3991 14.8004 15.5998 15.5998C14.8004 16.3991 13.7579 16.9098 12.6364 17.0515V19H11.3636V17.0515C10.2421 16.9098 9.19958 16.3991 8.40024 15.5998C7.6009 14.8004 7.09019 13.7579 6.94855 12.6364H5V11.3636H6.94855C7.09019 10.2421 7.6009 9.19958 8.40024 8.40024C9.19958 7.6009 10.2421 7.09019 11.3636 6.94855V5H12.6364ZM12 8.18182C10.9874 8.18182 10.0162 8.58409 9.30014 9.30014C8.58409 10.0162 8.18182 10.9874 8.18182 12C8.18182 13.0126 8.58409 13.9838 9.30014 14.6999C10.0162 15.4159 10.9874 15.8182 12 15.8182C13.0126 15.8182 13.9838 15.4159 14.6999 14.6999C15.4159 13.9838 15.8182 13.0126 15.8182 12C15.8182 10.9874 15.4159 10.0162 14.6999 9.30014C13.9838 8.58409 13.0126 8.18182 12 8.18182ZM10.7273 12C10.7273 11.6625 10.8614 11.3387 11.1 11.1C11.3387 10.8614 11.6625 10.7273 12 10.7273C12.3375 10.7273 12.6613 10.8614 12.9 11.1C13.1386 11.3387 13.2727 11.6625 13.2727 12C13.2727 12.3375 13.1386 12.6613 12.9 12.9C12.6613 13.1386 12.3375 13.2727 12 13.2727C11.6625 13.2727 11.3387 13.1386 11.1 12.9C10.8614 12.6613 10.7273 12.3375 10.7273 12Z" 
        fill="#555555"
      />
    </svg>
  );
};

export default GpsIcon;
