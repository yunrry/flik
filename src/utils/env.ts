// src/utils/env.ts

// Vite 환경변수 접근을 위한 유틸 함수들
export const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = (import.meta as any).env[key];
    return value || defaultValue || '';
  };
  
  // 각 환경변수별 getter 함수들
  export const getApiBaseUrl = (): string => {
    return getEnvVar('VITE_API_BASE_URL');
  };
  
  export const getNaverClientId = (): string => {
    return getEnvVar('VITE_NAVER_CLIENT_ID');
  };
  
  export const getNaverClientSecret = (): string => {
    return getEnvVar('VITE_NAVER_CLIENT_SECRET');
  };
  
  export const getKakaoJavaScriptKey = (): string => {
    return getEnvVar('VITE_KAKAO_JAVASCRIPT_KEY');
  };
  
  export const getCloudinaryCloudName = (): string => {
    return getEnvVar('VITE_CLOUDINARY_CLOUD_NAME');
  };
  
  export const getCloudinaryUploadPreset = (): string => {
    return getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET');
  };


  // 개발 환경 체크
  export const isDevelopment = (): boolean => {
    return getEnvVar('MODE') === 'development';
  };
  
  export const isProduction = (): boolean => {
    return getEnvVar('MODE') === 'production';
  };