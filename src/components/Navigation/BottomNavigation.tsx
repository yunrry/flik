// src/components/Navigation/BottomNavigation.tsx

import React from 'react';
import NavigationTab from './NavigationTab';
import TabIndicator from './TabIndicator';
import { useNavigation } from '../../hooks/useNavigation';
import { BottomNavigationProps } from '../../types/navigation.types';

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  className = ''
}) => {
  const { activeTab, tabs, handleNavigationClick, isVisible } = useNavigation();

  if (!isVisible) {
    return null;
  }

  return (
  <nav
    className={`bottom-navigation-fixed pb-safe-bottom ${className}`}
    aria-label="메인 네비게이션"
    >      {/* 탭 인디케이터 */}
      <div className="flex w-full bg-white h-nav-safe pb-safe-bottom px-1 xs:px-2 sm:px-6 md:px-8 lg:px-12">
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