// src/stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';
import {
  User,
  EmailLoginRequest,
  EmailSignupRequest,
  OAuthCallbackRequest,
  ProfileUpdateRequest,
  OAuthSignupRequest,
} from '../types/auth';

export type SocialProvider = 'google' | 'kakao';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: EmailLoginRequest) => Promise<void>;
  signup: (signupData: EmailSignupRequest) => Promise<void>;
  socialLogin: (provider: SocialProvider) => Promise<void>;
  handleOAuthCallback: (request: OAuthCallbackRequest) => Promise<void>;
  completeOAuthSignup: (signupData: OAuthSignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
  loadUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;

}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: EmailLoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          
          if (response.success && response.data) {
            const { accessToken, refreshToken, user } = response.data;
            
            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            authApi.setAccessToken(accessToken);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || '로그인에 실패했습니다.');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (signupData: EmailSignupRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.signup(signupData);
          
          if (response.success && response.data) {
            const { accessToken, refreshToken, user } = response.data;
            
            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            authApi.setAccessToken(accessToken);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || '회원가입에 실패했습니다.');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      socialLogin: async (provider: SocialProvider) => {
        set({ isLoading: true, error: null });
        try {
          // OAuth state 생성 및 저장
          const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem('oauth_state', state);
          sessionStorage.setItem('oauth_provider', provider);
          
          // 현재 페이지 위치 저장 (OAuth 완료 후 돌아올 위치)
          sessionStorage.setItem('oauth_return_url', window.location.pathname + window.location.search);
          
          console.log(`Requesting OAuth URL for ${provider} with state: ${state}`);
          
          const response = await authApi.getOAuthUrl(provider, state);
          
          console.log('OAuth URL response:', response);
          
          if (response.success && response.data?.authUrl) {
            console.log('Redirecting to OAuth page:', response.data.authUrl);
            // 현재 탭에서 OAuth URL로 리다이렉트
            window.location.href = response.data.authUrl;
          } else {
            const errorMessage = response.message || response.error || '소셜 로그인 URL을 가져올 수 없습니다.';
            console.error('OAuth URL request failed:', errorMessage);
            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error('Social login error:', error);
          set({
            error: error instanceof Error ? error.message : '소셜 로그인 중 오류가 발생했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      handleOAuthCallback: async (request: OAuthCallbackRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.handleOAuthCallback(request);
          
          if (response.success && response.data) {
            const { accessToken, refreshToken, user } = response.data;
            
            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            authApi.setAccessToken(accessToken);
            
            // Clear OAuth state
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('oauth_provider');
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || '소셜 로그인에 실패했습니다.');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '소셜 로그인 처리 중 오류가 발생했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      completeOAuthSignup: async (signupData: {
        provider: string;
        tempKey: string;
        nickname: string;
      }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.completeOAuthSignup(signupData);
          
          if (response.success && response.data) {
            const { accessToken, refreshToken, user } = response.data;
            
            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            authApi.setAccessToken(accessToken);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || '회원가입에 실패했습니다.');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (error) {
          console.error('로그아웃 API 호출 실패:', error);
        } finally {
          // Clear all auth data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          authApi.setAccessToken(null);
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateProfile: async (data: ProfileUpdateRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.updateProfile(data);
          
          if (response.success && response.data) {
            set({
              user: response.data,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || '프로필 업데이트에 실패했습니다.');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '프로필 업데이트 중 오류가 발생했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      loadUser: async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        set({ isLoading: true });
        try {
          authApi.setAccessToken(accessToken);
          const response = await authApi.getMe();
          
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error('사용자 정보를 가져올 수 없습니다.');
          }
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
          // 토큰이 유효하지 않으면 로그아웃 처리
          get().logout();
        }
      },

      refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          const response = await authApi.refreshToken({ refreshToken });
          
          if (response.success && response.data) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = response.data;
            
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            authApi.setAccessToken(newAccessToken);
            
            set({
              user,
              isAuthenticated: true,
            });
          } else {
            throw new Error('토큰 갱신에 실패했습니다.');
          }
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);