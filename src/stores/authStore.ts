// src/stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user.types';

export type SocialProvider = 'google' | 'kakao' | 'naver' | 'apple' | 'email';

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

// Mock 사용자 데이터 (user.types.ts 형식에 맞춰 조정)
const MOCK_USERS: Record<SocialProvider, User> = {
  google: {
    id: 'mock-google-user',
    email: 'hong@gmail.com',
    nickname: '삐이야악123',
    profileImage: 'https://res.cloudinary.com/deggvyhsw/image/upload/v1743397376/sbmakf34rszypdbhhhlk.jpg',
    provider: 'google',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    name: 'Hong Gil Dong',
    preferences: {
      notifications: true,
      marketing: false,
      locationTracking: true
    }
  },
  kakao: {
    id: 'mock-kakao-user',
    email: 'hong@kakao.com',
    nickname: '카카오친구',
    profileImage: 'https://res.cloudinary.com/deggvyhsw/image/upload/v1743397376/sbmakf34rszypdbhhhlk.jpg',
    provider: 'kakao',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    name: '홍길동',
    preferences: {
      notifications: true,
      marketing: false,
      locationTracking: true
    }
  },
  naver: {
    id: 'mock-naver-user',
    email: 'hong@naver.com',
    nickname: '네이버유저',
    profileImage: 'https://via.placeholder.com/100',
    provider: 'naver',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    name: '홍길동',
    preferences: {
      notifications: true,
      marketing: false,
      locationTracking: true
    }
  },
  apple: {
    id: 'mock-apple-user',
    email: 'hong@icloud.com',
    nickname: '애플유저',
    profileImage: 'https://via.placeholder.com/100',
    provider: 'apple',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    name: 'Hong Gil Dong',
    preferences: {
      notifications: true,
      marketing: false,
      locationTracking: true
    }
  },
  email: {
    id: 'mock-email-user',
    email: 'hong@example.com',
    nickname: '이메일유저',
    profileImage: 'https://via.placeholder.com/100',
    provider: 'email',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    name: '홍길동',
    preferences: {
      notifications: true,
      marketing: false,
      locationTracking: true
    }
  }
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
    updatedAt: new Date().toISOString(),
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
          // 토큰을 localStorage에 저장 (API 호출용)
          localStorage.setItem('auth_token', `mock_token_${mockUser.id}`);
          
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
        // localStorage에서 토큰 제거
        localStorage.removeItem('auth_token');
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...userData,
            updatedAt: new Date().toISOString()
          };
          
          set({ 
            user: updatedUser
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
      // 스토리지에서 복원 시 토큰도 복원
      onRehydrateStorage: () => (state) => {
        if (state && state.user) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            // 토큰이 있으면 인증된 상태로 유지
            state.isAuthenticated = true;
          } else {
            // 토큰이 없으면 로그아웃 상태로 설정
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      }
    }
  )
);

// 인증 상태 확인 헬퍼
export const useIsAuthenticated = () => {
  const { isAuthenticated, user } = useAuthStore();
  return isAuthenticated && user !== null;
};

// 현재 사용자 정보 헬퍼  
export const useCurrentUser = () => {
  const { user } = useAuthStore();
  return user;
};