import React from 'react';
import { StatusIconProps } from '../../../types/icon.types';
import { Icon } from './Icon';

export const StatusIcon: React.FC<StatusIconProps> = (props) => {
  const { status, variant = 'default', className = '', ...rest } = props;
  
  const statusColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    loading: 'text-gray-600',
  };
  
  const animationClass = variant === 'animated' && status === 'loading' ? 'animate-spin' : '';
  
  return (
    <Icon
      {...rest}
      name={status}
      className={`${statusColors[status]} ${animationClass} ${className}`}
    />
  );
};
