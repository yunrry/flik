import React from 'react';
import { NavigationIconProps } from '../../../types/icon.types';
import { HomeIcon, MyIcon, SaveIcon, FlikIcon } from './SvgIcons';

export const NavigationIcon: React.FC<NavigationIconProps & { name: string }> = (props) => {
  const { name, isActive = false, variant = 'default', className = '', size = 'md', ...rest } = props;
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12',
  };
  
  const baseClasses = `${sizeClasses[size]} transition-all duration-200 cursor-pointer`;
  const iconClasses = `${baseClasses} ${className}`;
  
  const renderIcon = () => {
    switch (name) {
      case 'home':
        return <HomeIcon className={iconClasses} isActive={isActive} />;
      case 'my':
        return <MyIcon className={iconClasses} isActive={isActive} />;
      case 'save':
        return <SaveIcon className={iconClasses} isActive={isActive} />;
      case 'flik':
        return <FlikIcon className={iconClasses} isActive={isActive} />;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className="inline-block"
      onClick={rest.onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          rest.onClick?.();
        }
      }}
    >
      {renderIcon()}
    </div>
  );
};