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
        className="flex-1 w-full overflow-auto"
        style={{
          height: shouldShowNavigation ? 'calc(100vh - 5rem)' : '100vh'
        }}
      >
        {children}
      </div>

      {/* 하단 네비게이션 */}
      {shouldShowNavigation && (
        <div className="h-20 flex-shrink-0 bg-white border-t border-gray-200">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
};


export default NavigationLayout;