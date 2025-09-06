// src/types/auth.ts

export interface User {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl?: string;
    provider?: 'email' | 'google' | 'kakao';
  }
  
  export interface LoginResponse extends ApiResponse {
    data?: {
      accessToken: string;
      refreshToken: string;
      user: User;
    };
  }
  
  export interface OAuthUrlResponse extends ApiResponse {
    data?: {
      authUrl: string;
    };
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  }
  
  // 로그인 요청 타입들
  export interface EmailLoginRequest {
    email: string;
    password: string;
  }
  
  
  export interface EmailSignupRequest {
    email: string;
    password: string;
    nickname: string;
    profileImageUrl?: string;
  }
  
  export interface OAuthSignupRequest {
    provider: string;
    tempKey: string;
    nickname: string;
  }

  export interface OAuthCallbackRequest {
    provider: 'google' | 'kakao';
    code: string;
    state?: string;
  }
  
  export interface ProfileUpdateRequest {
    nickname: string;
    profileImageUrl?: string;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  // OAuth 상태 관리용
  export interface OAuthState {
    provider: 'google' | 'kakao';
    redirectUrl: string;
    state: string;
  }