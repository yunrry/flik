// src/stores/navigationStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NavigationState, NavigationActions, NavigationTabName, NavigationTab } from '../types/navigation.types';

interface NavigationStore extends NavigationState, NavigationActions {
  tabs: NavigationTab[];
}

export const NAVIGATION_TABS: NavigationTab[] = [
  {
    name: 'home',
    path: '/',
    icon: 'home',
    activeIcon: 'home'
  },
  {
    name: 'flik',
    path: '/flik',
    icon: 'flik',
    activeIcon: 'flik'
  },
  {
    name: 'save',
    path: '/save',
    icon: 'save',
    activeIcon: 'save'
  },
  {
    name: 'my',
    path: '/my',
    icon: 'my',
    activeIcon: 'my'
  }
];

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // State
      activeTab: 'home',
      isVisible: true,
      previousTab: null,
      tabs: NAVIGATION_TABS,

      // Actions
      setActiveTab: (tab: NavigationTabName) => {
        const currentTab = get().activeTab;
        set({ 
          activeTab: tab, 
          previousTab: currentTab !== tab ? currentTab : get().previousTab 
        });
      },

      hideNavigation: () => {
        set({ isVisible: false });
      },

      showNavigation: () => {
        set({ isVisible: true });
      },

      toggleNavigation: () => {
        const { isVisible } = get();
        set({ isVisible: !isVisible });
      },
    }),
    {
      name: 'flik-navigation-storage',
      partialize: (state) => ({
        activeTab: state.activeTab,
        isVisible: state.isVisible,
      }),
    }
  )
);