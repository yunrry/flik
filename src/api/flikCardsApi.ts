import { 
    Spot, 
    SpotDetail,
    SpotsResponse, 
    SpotsRequestParams,
  
  } from '../types/spot.types';
import { ApiResponse } from '../types/response.types';
  


  // API 기본 설정
  const API_BASE_URL = 'http://localhost:8080/api/v1';
  
  // 인증 토큰 가져오기 (useAuth와 연동)
  const getAuthToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };


// 스팟 상세 조회 (ids 쿼리 파라미터로 다중 조회)
export const getSpotsByIds = async (ids: number[]): Promise<ApiResponse<SpotDetail[]>> => {
  const accessToken = getAuthToken();
  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
  }
  if (!ids.length) {
    return { success: true, data: [], message: '' };
  }

  const params = new URLSearchParams();
  ids.forEach(id => params.append('ids', id.toString()));

  const url = `${API_BASE_URL}/spots/by-ids?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse<SpotDetail[]> = await response.json();
  return data;
};



  // 스팟 저장 API
  export const saveSpot = async (spotId: number): Promise<ApiResponse<{ saved: boolean }>> => {
    const accessToken = getAuthToken();
    
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/swipe`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spotId })
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          // 토큰 만료 또는 인증 실패
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: ApiResponse<{ saved: boolean }> = await response.json();
      return data;
    } catch (error) {
      console.error('스팟 저장 API 요청 중 오류 발생:', error);
      throw error;
    }
  };



  
  // 스팟 카테고리별 조회 API
  export const getSpotsByCategories = async (params: SpotsRequestParams): Promise<SpotsResponse> => {
    const { categories, regionCode, tripDuration, limitPerCategory = 21 } = params;
    
    // 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();
    categories.forEach(category => {
      queryParams.append('categories', category);
    });
    queryParams.append('regionCode', regionCode);
    queryParams.append('tripDuration', tripDuration.toString());
    // queryParams.append('page', '0');
    queryParams.append('limitPerCategory', limitPerCategory.toString());
  
    const url = `${API_BASE_URL}/spots/categories?${queryParams.toString()}`;
    const accessToken = getAuthToken();
  
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          // 토큰 만료 또는 인증 실패
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: SpotsResponse = await response.json();
      console.log('스팟 데이터 조회 성공:', data);
      return data;
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      throw error;
    }
  };



  export const getSpotsUserSaved = async (): Promise<ApiResponse<SpotDetail[]>> => {
    const url = `${API_BASE_URL}/spots/saved`;
    const accessToken = getAuthToken();

    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<SpotDetail[]> = await response.json();
      return data;
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      throw error;
    }
    }
  
  // 사용 예시 함수들
  export const getAccommodationSpots = async (regionCode: string, tripDuration: number) => {
    return getSpotsByCategories({
      categories: ['ACCOMMODATION'],
      regionCode,
      tripDuration,
    });
  };
  
  export const getRestaurantSpots = async (regionCode: string, tripDuration: number) => {
    return getSpotsByCategories({
      categories: ['RESTAURANT'],
      regionCode,
      tripDuration,
    });
  };
  
  export const getAllSpots = async (regionCode: string, tripDuration: number) => {
    return getSpotsByCategories({
      categories: ['ACCOMMODATION', 'RESTAURANT', 'ACTIVITY', 'CAFE'],
      regionCode,
      tripDuration,
    });
  };
  
  // 에러 타입 정의
  export interface ApiError {
    message: string;
    status?: number;
    code?: string;
  }
  
  // 에러 핸들링 유틸리티
  export const handleApiError = (error: unknown): ApiError => {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
    
    return {
      message: '알 수 없는 오류가 발생했습니다.',
    };
  };