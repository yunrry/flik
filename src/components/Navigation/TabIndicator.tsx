// src/components/Navigation/TabIndicator.tsx

import React from 'react';
import { NavigationTabName } from '../../types/navigation.types';

interface TabIndicatorProps {
  activeTab: NavigationTabName;
  tabCount: number;
  className?: string;
}

const TabIndicator: React.FC<TabIndicatorProps> = ({
  activeTab,
  tabCount,
  className = ''
}) => {
  // 활성 탭의 인덱스 계산
  const getActiveTabIndex = (): number => {
    const tabOrder: NavigationTabName[] = ['home', 'my', 'save', 'flik'];
    return tabOrder.indexOf(activeTab);
  };

  const activeIndex = getActiveTabIndex();
  const indicatorWidth = 100 / tabCount; // 각 탭의 너비 비율
  const translateX = activeIndex * indicatorWidth; // 인디케이터 위치

  return (
    <div className={`
      absolute bottom-0 left-0 right-0
      h-0.5 bg-transparent
      overflow-hidden
      ${className}
    `}>
      {/* 배경 라인 */}
      <div className="absolute inset-0 bg-gray-200" />
      
      {/* 활성 탭 인디케이터 */}
      <div
        className="
          absolute top-0 h-full
          bg-blue-600 
          transition-transform duration-300 ease-out
          rounded-full
        "
        style={{
          width: `${indicatorWidth}%`,
          transform: `translateX(${translateX}%)`,
        }}
      />
      
      {/* 글로우 효과 (선택사항) */}
      <div
        className="
          absolute top-0 h-full
          bg-blue-400 opacity-50 blur-sm
          transition-transform duration-300 ease-out
          rounded-full
        "
        style={{
          width: `${indicatorWidth * 0.8}%`,
          transform: `translateX(${translateX + indicatorWidth * 0.1}%)`,
        }}
      />
    </div>
  );
};

export default TabIndicator;