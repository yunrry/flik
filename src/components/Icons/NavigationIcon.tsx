import React from 'react';
import { NavigationIconProps } from '../../../types/icon.types';
import { HomeIcon, MyIcon, SaveIcon, FlikIcon } from './SvgIcons';

export const NavigationIcon: React.FC<NavigationIconProps & { name: string; size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }> = (props) => {
  const { name, isActive = false, variant = 'default', className = '', size = 'md', ...rest } = props;
  
  // 디버깅 로그 추가
  console.log('NavigationIcon props:', { name, className, size, isActive });
  


  
  const renderIcon = () => {
    switch (name) {
      case 'home':
        return <HomeIcon className={className} isActive={isActive} size={size} />;
      case 'my':
        return <MyIcon className={className} isActive={isActive} size={size} />;
      case 'save':
        return <SaveIcon className={className} isActive={isActive} size={size} />;
      case 'flik':
        return <FlikIcon className={className} isActive={isActive} size={size} />;
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