// src/types/user.ts

export interface User {
    id: string;
    email: string;
    nickname: string;
    profileImage?: string;
    provider: 'google' | 'kakao' | 'naver' | 'apple' | 'email'; // 로그인 제공자 추가
    createdAt: string;
    updatedAt: string;
    // 선택적 필드들
    name?: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: 'male' | 'female' | 'other';
    location?: {
      city: string;
      district?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    preferences?: {
      notifications: boolean;
      marketing: boolean;
      locationTracking: boolean;
    };
  }
  
  export interface UserActivity {
    id: string;
    userId: string;
    type: 'save' | 'review' | 'visit' | 'like' | 'share';
    title: string;
    description?: string;
    imageUrl?: string;
    relatedId?: string; // 관련된 맛집 ID 등
    createdAt: string;
    metadata?: {
      restaurantName?: string;
      location?: string;
      rating?: number;
    };
  }
  
  export interface UserProfile {
    user: User;
    stats: {
      savedRestaurants: number;
      reviews: number;
      visits: number;
      likes: number;
    };
    recentActivities: UserActivity[];
  }
  
  // API 요청/응답 타입들
  export interface UpdateUserProfileRequest {
    nickname?: string;
    name?: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: 'male' | 'female' | 'other';
    profileImage?: string; // 프로필 이미지 URL 추가
    location?: {
      city: string;
      district?: string;
    };
    preferences?: {
      notifications: boolean;
      marketing: boolean;
      locationTracking: boolean;
    };
  }
  
  export interface UpdateProfileImageRequest {
    image: File;
  }
  
  export interface UserActivitiesResponse {
    success: boolean;
    data: UserActivity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }
  
  export interface UserProfileResponse {
    success: boolean;
    data: UserProfile;
    message?: string;
  }