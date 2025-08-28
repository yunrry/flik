// src/components/Layout/NavigationLayout.tsx

import React from 'react';
import { BottomNavigation } from '../Navigation';
import { NavigationLayoutProps } from '../../types/navigation.types';
import { useNavigation } from '../../hooks/useNavigation';

const NavigationLayout: React.FC<NavigationLayoutProps> = ({
  children,
  showNavigation = true,
  disableScroll = false // 새로운 prop 추가
}) => {
  const { isNavigationPage } = useNavigation();

  // 네비게이션 표시 여부 결정
  const shouldShowNavigation = showNavigation && isNavigationPage;

  return (
    <div className={` ${disableScroll ? 'h-screen bg-gray-50 flex flex-col overflow-hidden ' : 'min-h-screen bg-gray-50'}`}>
          
      {/* 메인 콘텐츠 영역 - 네비게이션이 있으면 그만큼 공간 제외 */}
      <div 
        className={`
          min-h-screen w-full
          ${shouldShowNavigation ? 'main-content-with-nav' : ''}
        `}
      >
        {children}
      </div>

      {/* 하단 네비게이션 */}
      {shouldShowNavigation && (
            <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
};




export default NavigationLayout;