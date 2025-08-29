import { getApiBaseUrl } from '../utils/env';

const API_BASE_URL = getApiBaseUrl();

export interface SaveRestaurantRequest {
  restaurantId: string;
  userId?: string;
  timestamp?: string;
  source?: 'flik_card';
}

export interface SaveRestaurantResponse {
  success: boolean;
  message: string;
  savedAt: string;
  restaurantId: string;
}

// 맛집 저장 API
export const saveRestaurant = async (
  restaurantId: string, 
  userId?: string
): Promise<SaveRestaurantResponse> => {
  try {
    const requestBody: SaveRestaurantRequest = {
      restaurantId,
      userId,
      timestamp: new Date().toISOString(),
      source: 'flik_card'
    };

    const response = await fetch(`${API_BASE_URL}/restaurants/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 인증 토큰이 있다면 추가
        ...(localStorage.getItem('auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        })
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SaveRestaurantResponse = await response.json();
    
    console.log('맛집 저장 성공:', data);
    return data;

  } catch (error) {
    console.error('맛집 저장 실패:', error);
    throw new Error(
      error instanceof Error 
        ? `맛집 저장에 실패했습니다: ${error.message}`
        : '맛집 저장에 실패했습니다.'
    );
  }
};

// 저장된 맛집 목록 조회 API
export const getSavedRestaurants = async (userId?: string) => {
  try {
    const url = userId 
      ? `${API_BASE_URL}/restaurants/saved?userId=${userId}`
      : `${API_BASE_URL}/restaurants/saved`;

    const response = await fetch(url, {
      headers: {
        ...(localStorage.getItem('auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('저장된 맛집 조회 실패:', error);
    throw error;
  }
};

// 맛집 저장 취소 API
export const unsaveRestaurant = async (restaurantId: string, userId?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/unsave`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        })
      },
      body: JSON.stringify({ restaurantId, userId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('맛집 저장 취소 실패:', error);
    throw error;
  }
};