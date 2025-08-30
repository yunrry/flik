// src/components/Navigation/BottomNavigation.tsx

import React from 'react';
import NavigationTab from './NavigationTab';
import TabIndicator from './TabIndicator';
import { useNavigation } from '../../hooks/useNavigation';
import { BottomNavigationProps } from '../../types/navigation.types';

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  className = ''
}) => {
  const { activeTab, tabs, handleNavigationClick } = useNavigation();

  return (
    <nav
      className={`h-24 ${className}`} // 높이만 지정
      role="tablist"
      aria-label="메인 네비게이션"
    >
      <div className="flex h-full w-full bg-white px-1 xs:px-2 sm:px-6 md:px-8 lg:px-12">
        <div className="flex justify-between items-center w-full min-w-0">
          {tabs.map((tab) => (
            <NavigationTab
              key={tab.name}
              tab={tab}
              isActive={activeTab === tab.name}
              onClick={handleNavigationClick}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;