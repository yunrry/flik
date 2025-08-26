import React from 'react';
import { ActionIconProps } from '../../../types/icon.types';
import { Icon } from './Icon';

export const ActionIcon: React.FC<ActionIconProps> = (props) => {
  const { action, variant = 'default', className = '', ...rest } = props;
  
  const actionColors = {
    save: 'text-blue-600 hover:text-blue-700',
    share: 'text-green-600 hover:text-green-700',
    like: 'text-red-500 hover:text-red-600',
    delete: 'text-red-600 hover:text-red-700',
    edit: 'text-yellow-600 hover:text-yellow-700',
    search: 'text-gray-600 hover:text-gray-800',
    filter: 'text-purple-600 hover:text-purple-700',
  };
  
  return (
    <Icon
      {...rest}
      name={action}
      className={`${actionColors[action]} ${className}`}
    />
  );
};
