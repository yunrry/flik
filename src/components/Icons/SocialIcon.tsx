import React from 'react';
import { SocialIconProps } from '../../types/icon.types';
import { Icon } from './Icon';

export const SocialIcon: React.FC<SocialIconProps> = (props) => {
  const { platform, variant = 'default', className = '', ...rest } = props;
  
  const platformColors = {
    kakao: 'text-yellow-400 hover:text-yellow-500',
    naver: 'text-green-500 hover:text-green-600',
    google: 'text-red-500 hover:text-red-600',
    facebook: 'text-blue-600 hover:text-blue-700',
    twitter: 'text-blue-400 hover:text-blue-500',
    instagram: 'text-pink-500 hover:text-pink-600',
  };
  
  return (
    <Icon
      {...rest}
      name={platform}
      className={`${platformColors[platform]} ${className}`}
    />
  );
};
