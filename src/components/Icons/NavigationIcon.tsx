import React from 'react';
import { NavigationIconProps } from '../../types/icon.types';
import { HomeIcon, MyIcon, SaveIcon, FlikIcon } from './SvgIcons';

export const NavigationIcon: React.FC<NavigationIconProps & { name: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }> = (props) => {
  const { name, isActive = false, variant = 'default', className = '', size = 'xl', ...rest } = props;
  
  const renderIcon = () => {
    switch (name) {
      case 'home':
        return <HomeIcon isActive={isActive} size={size} />;
      case 'my':
        return <MyIcon isActive={isActive} size={size} />;
      case 'save':
        return <SaveIcon isActive={isActive} size={size} />;
      case 'flik':
        return <FlikIcon isActive={isActive} size={size} />;
      default:
        return null;
    }
  };
  
  return (
    <div 
    className={`inline-block  ${className}`}
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