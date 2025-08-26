import React from 'react';
import { IconProps } from '../../types/icon.types';
import { getIconSize, getIconColor } from '../../utils/iconTheme';
import { getIconComponent } from '../../utils/iconRegistry';

export interface BaseIconProps extends IconProps {
  name: string;
}

export const Icon: React.FC<BaseIconProps> = ({ 
  name, 
  size = 'md', 
  color = 'primary', 
  className = '', 
  onClick, 
  disabled 
}) => {
  const IconComponent = getIconComponent(name as any);
  
  if (!IconComponent) {
    console.warn(`Icon component not found: ${name}`);
    return null;
  }
  
  const iconClasses = `${getIconSize(size)} ${getIconColor('auto', color as any)} ${className}`;
  
  return (
    <IconComponent
      className={iconClasses}
      onClick={onClick}
      aria-label={name}
      role="img"
    />
  );
};
