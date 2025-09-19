// src/api/userApi.ts

import { getApiBaseUrl } from '../utils/env';
import { 
  UserProfile, 
  UserProfileResponse, 
  UpdateUserProfileRequest, 
  UpdateProfileImageRequest, 
  UserActivitiesResponse 
} from '../types/user.types';

const API_BASE_URL = getApiBaseUrl();

// 사용자 프로필 조회
export const getUserProfile = async (userId?: string): Promise<UserProfile> => {
  try {
    const url = userId 
      ? `${API_BASE_URL}/v1/user/profile/${userId}`
      : `${API_BASE_URL}/v1/user/profile`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserProfileResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || '프로필 조회에 실패했습니다.');
    }

    console.log('사용자 프로필 조회 성공:', data.data);
    return data.data;

  } catch (error) {
    console.error('사용자 프로필 조회 실패:', error);
    throw new Error(
      error instanceof Error 
        ? `프로필 조회에 실패했습니다: ${error.message}`
        : '프로필 조회에 실패했습니다.'
    );
  }
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (
  profileData: UpdateUserProfileRequest
): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        })
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserProfileResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || '프로필 업데이트에 실패했습니다.');
    }

    console.log('사용자 프로필 업데이트 성공:', data.data);
    return data.data;

  } catch (error) {
    console.error('사용자 프로필 업데이트 실패:', error);
    throw new Error(
      error instanceof Error 
        ? `프로필 업데이트에 실패했습니다: ${error.message}`
        : '프로필 업데이트에 실패했습니다.'
    );
  }
};

// 프로필 이미지 URL로 업로드
export const uploadProfileImageByUrl = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/user/profile/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        })
      },
      body: JSON.stringify({ imageUrl })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || '이미지 업로드에 실패했습니다.');
    }

    console.log('프로필 이미지 업로드 성공:', data.imageUrl);
    return data.imageUrl;

  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error);
    throw new Error(
      error instanceof Error 
        ? `이미지 업로드에 실패했습니다: ${error.message}`
        : '이미지 업로드에 실패했습니다.'
    );
  }
};

// 사용자 활동 내역 조회
export const getUserActivities = async (
    page: number = 1,
    limit: number = 20,
    type?: 'save' | 'review' | 'visit' | 'like' | 'share'
  ): Promise<UserActivitiesResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
  
      // 타입 필터 추가
      if (type) {
        params.append('type', type);
      }
  
      const response = await fetch(`${API_BASE_URL}/v1/user/activities?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('auth_token') && {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          })
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: UserActivitiesResponse = await response.json();
      
      if (!data.success) {
        throw new Error('활동 내역 조회에 실패했습니다.');
      }
  
      console.log('사용자 활동 내역 조회 성공:', data);
      return data;
  
    } catch (error) {
      console.error('사용자 활동 내역 조회 실패:', error);
      throw new Error(
        error instanceof Error 
          ? `활동 내역 조회에 실패했습니다: ${error.message}`
          : '활동 내역 조회에 실패했습니다.'
      );
    }
  };
  
  // 리뷰 활동만 조회하는 편의 함수
  export const getUserReviews = async (
    page: number = 1,
    limit: number = 20
  ): Promise<UserActivitiesResponse> => {
    return getUserActivities(page, limit, 'review');
  };

// 닉네임 중복 확인
export const checkNicknameAvailability = async (nickname: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/user/check-nickname?nickname=${encodeURIComponent(nickname)}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.available;

  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error);
    throw new Error('닉네임 중복 확인에 실패했습니다.');
  }
};