// src/components/Layout/NavigationLayout.tsx

import React from 'react';
import { BottomNavigation } from '../Navigation';
import { NavigationLayoutProps } from '../../types/navigation.types';
import { useNavigation } from '../../hooks/useNavigation';

const NavigationLayout: React.FC<NavigationLayoutProps> = ({
  children,
  showNavigation = true,
  disableScroll = false
}) => {
  const { isNavigationPage } = useNavigation();
  const shouldShowNavigation = showNavigation && isNavigationPage;

  return (
    <div className={`${
      disableScroll 
        ? 'h-screen-mobile bg-gray-50 flex flex-col overflow-hidden' 
        : 'min-h-screen bg-gray-50'
    }`}>
      {/* 메인 콘텐츠 영역 */}
      <div 
        className={`
          w-full flex-1
          ${shouldShowNavigation && !disableScroll ? 'pb-nav-safe' : ''}
          ${disableScroll ? 'overflow-hidden' : ''}
        `}
      >
        {children}
      </div>

      {/* 하단 네비게이션 */}
      {shouldShowNavigation && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white pb-safe-bottom">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
};

export default NavigationLayout;