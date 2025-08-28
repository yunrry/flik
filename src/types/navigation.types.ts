// src/types/navigation.types.ts

export type NavigationTabName = 'home' | 'flik' | 'save' | 'my';

export interface NavigationTab {
  name: NavigationTabName;
  path: string;
  icon: string;
  activeIcon: string;
}

export interface NavigationState {
  activeTab: NavigationTabName;
  isVisible: boolean;
  previousTab: NavigationTabName | null;
}

export interface NavigationActions {
  setActiveTab: (tab: NavigationTabName) => void;
  hideNavigation: () => void;
  showNavigation: () => void;
  toggleNavigation: () => void;
}

export interface NavigationTabProps {
  tab: NavigationTab;
  isActive: boolean;
  onClick: (tabName: NavigationTabName) => void;
}

export interface BottomNavigationProps {
  className?: string;
}

export interface NavigationLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  disableScroll?: boolean; // 새로운 prop 추가
}