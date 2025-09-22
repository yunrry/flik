import { ApiResponse } from '../types/response.types';
import { TravelCourse, CourseSlot } from '../types/travelCourse.type';
import { getApiBaseUrl } from '../utils/env';

  // API 기본 설정

  const API_BASE_URL = getApiBaseUrl();
  
  // 인증 토큰 가져오기 (useAuth와 연동)
  const getAuthToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };


  // API 응답 타입 정의
interface ApiTravelCourseResponse {
  id: number; // Long에서 number로 변환됨
  userId: number;
  days: number;
  regionCode: string;
  totalDistance: number | null;
  courseSlots: ApiCourseSlot[][];
  createdAt: string;
  courseType: string;
  totalSlots: number;
  filledSlots: number;
  selectedCategories: string[];
  isPublic: boolean;
}

interface ApiCourseSlot {
  day: number;
  slot: number;
  slotType: string;
  mainCategory: string | null;
  slotName: string;
  recommendedSpotIds: number[]; // Long[]에서 number[]로 변환됨
  selectedSpotId: number | null; // Long에서 number로 변환됨
  isContinue: boolean | null;
  isEmpty: boolean; // 백엔드 필드명
  hasRecommendations: boolean;
  hasSelectedSpot: boolean;
}

// 매핑 함수 추가
const mapApiToTravelCourse = (apiCourse: ApiTravelCourseResponse): TravelCourse => {
  return {
    id: apiCourse.id,
    userId: apiCourse.userId,
    days: apiCourse.days,
    regionCode: apiCourse.regionCode,
    totalDistance: apiCourse.totalDistance,
    courseSlots: apiCourse.courseSlots.map(daySlots =>
      daySlots.map(slot => ({
        ...slot,
        empty: slot.isEmpty // isEmpty를 empty로 매핑
      }))
    ),
    createdAt: apiCourse.createdAt,
    courseType: apiCourse.courseType,
    totalSlots: apiCourse.totalSlots,
    filledSlots: apiCourse.filledSlots,
    selectedCategories: apiCourse.selectedCategories,
    isPublic: apiCourse.isPublic
  };
};


  export const createCourse = async (
    categories: string[], 
    regionCode: string, 
    tripDuration: number
  ): Promise<ApiResponse<TravelCourse>> => {
    const accessToken = getAuthToken();
    
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    
    try {
      // 쿼리 파라미터 생성
      const queryParams = new URLSearchParams();
      categories.forEach(category => {
        queryParams.append('categories', category.toLowerCase());
      });
      queryParams.append('regionCode', regionCode);
      queryParams.append('tripDuration', tripDuration.toString());
  
      const url = `${API_BASE_URL}/v1/travel-courses/generate?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'POST',
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
  
      const rawData: ApiResponse<ApiTravelCourseResponse> = await response.json();
      return {
        ...rawData,
        data: mapApiToTravelCourse(rawData.data)
      };
    } catch (error) {
      console.error('코스 생성 API 요청 중 오류 발생:', error);
      throw error;
    }
  };


  export const getUserSavedCourses = async (): Promise<ApiResponse<TravelCourse[]>> => {
    const accessToken = getAuthToken();
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    try {
      const response = await fetch(`${API_BASE_URL}/v1/travel-courses`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse<TravelCourse[]> = await response.json();
    return data;
    } catch (error) {
      console.error('코스 조회 API 요청 중 오류 발생:', error);
      throw error;
    }
  };
  

  export const deleteUserSavedCourse = async (courseId: number): Promise<ApiResponse<void>> => {
    const accessToken = getAuthToken();
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    try {
      const response = await fetch(`${API_BASE_URL}/v1/travel-courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse<void> = await response.json();
    return data;
    } catch (error) {
      console.error('코스 삭제 API 요청 중 오류 발생:', error);
      throw error;
    }
  };

  export const getCourse = async (courseId: string): Promise<ApiResponse<TravelCourse>> => {
    const accessToken = getAuthToken();
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    try {
    const response = await fetch(`${API_BASE_URL}/v1/travel-courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse<TravelCourse> = await response.json();
    return data;
    } catch (error) {
      console.error('코스 조회 API 요청 중 오류 발생:', error);
      throw error;
    }
  };


  export interface RegionCoursesResponse {
    data: TravelCourse[];
    message?: string;
  }
  
  export const getRegionCourses = async (regionCode: string): Promise<RegionCoursesResponse> => {
    const url = `${API_BASE_URL}/v1/travel-courses/region/${regionCode}`;
    const token = getAuthToken();
  
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
  
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }
  
      const data: RegionCoursesResponse = await response.json();
      console.log('지역 코스 조회 응답', data);
      return data;
    } catch (error) {
      console.error('지역 코스 API 호출 오류:', error);
      throw error;
    }
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