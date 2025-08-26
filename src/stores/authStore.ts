// src/stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SocialProvider = 'google' | 'kakao' | 'naver' | 'apple';

export interface User {
  id: string;
  nickname: string;
  provider: SocialProvider;
  providerName: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  provider: SocialProvider;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

interface AuthStore extends AuthState, AuthActions {}

// Mock 사용자 데이터
const MOCK_USERS: Record<SocialProvider, User> = {
  google: {
    id: 'mock-google-user',
    nickname: '구글유저',
    provider: 'google',
    providerName: 'Hong Gil Dong',
    email: 'hong@gmail.com',
    avatar: 'https://via.placeholder.com/100',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
  },
  kakao: {
    id: 'mock-kakao-user',
    nickname: '카카오친구',
    provider: 'kakao',
    providerName: '홍길동',
    email: 'hong@kakao.com',
    avatar: 'https://via.placeholder.com/100',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
  },
  naver: {
    id: 'mock-naver-user',
    nickname: '네이버유저',
    provider: 'naver',
    providerName: '홍길동',
    email: 'hong@naver.com',
    avatar: 'https://via.placeholder.com/100',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
  },
  apple: {
    id: 'mock-apple-user',
    nickname: '애플유저',
    provider: 'apple',
    providerName: 'Hong Gil Dong',
    email: 'hong@icloud.com',
    avatar: 'https://via.placeholder.com/100',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
  },
};

// Mock 로그인 함수
const mockLogin = async (provider: SocialProvider): Promise<User> => {
  // 실제 API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 10% 확률로 실패 시뮬레이션
  if (Math.random() < 0.1) {
    throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
  }
  
  const user = MOCK_USERS[provider];
  return {
    ...user,
    lastLoginAt: new Date(),
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const mockUser = await mockLogin(credentials.provider);
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...userData } 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'flik-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);