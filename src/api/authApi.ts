// src/services/apiClient.ts

import {
    ApiResponse,
    LoginResponse,
    OAuthUrlResponse,
    EmailLoginRequest,
    EmailSignupRequest,
    OAuthCallbackRequest,
    ProfileUpdateRequest,
    RefreshTokenRequest,
    OAuthSignupRequest,
    User,
    SignupResponse,
  } from '../types/auth';
  import { getApiBaseUrl } from '../utils/env';
  
  const API_BASE_URL = getApiBaseUrl();
  // const API_BASE_URL = 'http://localhost:8080/api';

  class AuthApi {
    private baseUrl: string;
    private accessToken: string | null = null;
  
    constructor(baseUrl: string = API_BASE_URL) {
      this.baseUrl = baseUrl;
      this.accessToken = localStorage.getItem('accessToken');
    }
  
    setAccessToken(token: string | null) {
      this.accessToken = token;
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  
    private async request<T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
      const url = `${this.baseUrl}${endpoint}`;
      
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };
  
      if (this.accessToken) {
        headers.Authorization = `Bearer ${this.accessToken}`;
      }
  
      console.log('Request headers:', headers);
  
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });
  
        console.log(`Response status: ${response.status} ${response.statusText}`);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
        if (!response.ok) {
          // 401 에러인 경우 토큰 만료로 간주
          if (response.status === 401) {
            this.setAccessToken(null);
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
          }
          
          let errorData;
          try {
            errorData = await response.json();
            console.log('Error response body:', errorData);
          } catch (e) {
            console.log('Could not parse error response as JSON');
            errorData = {};
          }
          
          throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }
  
        const result = await response.json();
        console.log('Response body:', result);
        return result;
      } catch (error) {
        console.error(`API Request failed for ${endpoint}:`, error);
        throw error;
      }
    }
  
    // OAuth URL 조회
    async getOAuthUrl(provider: 'google' | 'kakao', state: string): Promise<OAuthUrlResponse> {
      return this.request<{ authUrl: string }>(`/v1/auth/oauth/${provider}?state=${state}`);
    }
  
    // OAuth 콜백 처리
    async handleOAuthCallback(request: OAuthCallbackRequest): Promise<LoginResponse> {
      return this.request<LoginResponse['data']>('/v1/auth/oauth/callback', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }
  
    // 이메일 회원가입
    async signup(request: EmailSignupRequest): Promise<SignupResponse> {
      return this.request<LoginResponse['data']>('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }
  
    // 이메일 로그인
    async login(request: EmailLoginRequest): Promise<LoginResponse> {
      return this.request<LoginResponse['data']>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }
  
    // 내 정보 조회
    async getMe(): Promise<ApiResponse<User>> {
      return this.request<User>('/v1/users/me');
    }
  
    // 프로필 수정
    async updateProfile(request: ProfileUpdateRequest): Promise<ApiResponse<User>> {
      return this.request<User>('/v1/users/me', {
        method: 'PUT',
        body: JSON.stringify(request),
      });
    }
  
    // OAuth 회원가입 완료
    async completeOAuthSignup(request: OAuthSignupRequest): Promise<LoginResponse> {
      return this.request<LoginResponse['data']>('/v1/auth/oauth/signup', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }
    
  
    // 토큰 갱신
    async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
      return this.request<LoginResponse['data']>('/v1/auth/refresh', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }
  
    // 로그아웃
    async logout(): Promise<ApiResponse> {
      return this.request('/v1/auth/logout', {
        method: 'POST',
      });
    }

    async guestLogin(): Promise<LoginResponse> {
      return this.request<LoginResponse['data']>('/v1/auth/guest-login', {
        method: 'POST',
      });
    }

  }

  
  
  
  export const authApi = new AuthApi();