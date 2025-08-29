// src/components/Navigation/NavigationTab.tsx

import React from 'react';
import { NavigationTabProps } from '../../types/navigation.types';
import { NavigationIcon } from '../Icons/NavigationIcon';

const NavigationTab: React.FC<NavigationTabProps> = ({
  tab,
  isActive,
  onClick
}) => {
  const handleClick = () => {
    onClick(tab.name);
  };

  return (
<button
  onClick={handleClick}
  className="!flex-1 !h-full !px-0.5 xs:!px-1 sm:!px-2 !py-1 !pt-0 !pb-4 !flex !flex-col !items-center !justify-center !bg-white !border-0 hover:!bg-gray-8 !min-w-0"
>
  <div className="relative p-1 xs:p-2">
    <NavigationIcon 
      name={tab.icon}
      size="xl"
      isActive={isActive}
    />
  </div>
</button>
  );
};

export default NavigationTab;