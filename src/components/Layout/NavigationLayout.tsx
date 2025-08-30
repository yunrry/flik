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
          ${shouldShowNavigation && !disableScroll ? 'pb-nav-dynamic' : ''}
          ${disableScroll ? 'overflow-hidden' : ''}
        `}
      >
        {children}
      </div>

      {/* 하단 네비게이션 */}
      {shouldShowNavigation && (
        <div className="bottom-navigation-dynamic bg-green-500">
          {/* 실제 네비게이션 콘텐츠 */}
          <div className="nav-content-dynamic bg-blue-500 ">
            <BottomNavigation />
          </div>
          {/* 안전 영역 */}
          <div className="nav-safe-area"></div>
        </div>
      )}
    </div>
  );
};

export default NavigationLayout;