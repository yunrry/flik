// src/hooks/useNavigation.ts

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigationStore, NAVIGATION_TABS } from '../stores/navigationStore';
import { NavigationTabName } from '../types/navigation.types';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    activeTab, 
    isVisible, 
    previousTab, 
    tabs,
    setActiveTab, 
    hideNavigation, 
    showNavigation, 
    toggleNavigation 
  } = useNavigationStore();

  // URL 변경시 활성 탭 동기화
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab && currentTab.name !== activeTab) {
      setActiveTab(currentTab.name);
    }
  }, [location.pathname, activeTab, setActiveTab, tabs]);

  // 탭 클릭 핸들러
  const handleNavigationClick = (tabName: NavigationTabName) => {
    const tab = tabs.find(t => t.name === tabName);
    if (tab) {
      setActiveTab(tabName);
      navigate(tab.path);
    }
  };

  // 현재 탭 정보 가져오기
  const getCurrentTab = () => {
    return tabs.find(tab => tab.name === activeTab);
  };

  // 특정 탭으로 이동
  const navigateToTab = (tabName: NavigationTabName) => {
    handleNavigationClick(tabName);
  };

  // 이전 탭으로 돌아가기
  const goToPreviousTab = () => {
    if (previousTab) {
      handleNavigationClick(previousTab);
    }
  };

  // 현재 경로가 네비게이션 페이지인지 확인
  const isNavigationPage = () => {
    // 기본 네비게이션 탭 경로들
    const isMainNavigationPage = tabs.some(tab => tab.path === location.pathname);
    
    // 홈 페이지에서 접근 가능한 서브 페이지들 (네비게이션 유지)
    const homeSubPages = ['/nationwide'];
    const isHomeSubPage = homeSubPages.includes(location.pathname);

    const isSaveSubPage = location.pathname.startsWith('/save/');
    
    // 지역 페이지들 (네비게이션 유지)
    const isRegionPage = location.pathname.startsWith('/region/');
    
    return isMainNavigationPage || isHomeSubPage || isRegionPage || isSaveSubPage;
  };

  return {
    // State
    activeTab,
    isVisible,
    previousTab,
    tabs,
    
    // Computed
    currentTab: getCurrentTab(),
    isNavigationPage: isNavigationPage(),
    
    // Actions
    handleNavigationClick,
    navigateToTab,
    goToPreviousTab,
    hideNavigation,
    showNavigation,
    toggleNavigation,
    setActiveTab,
  };
};