// 시간 정보 타입 정의
export interface TimeInfo {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  }
  
  // 스팟 정보 타입 정의
  export interface Spot {
    id: number;
    name: string;
    contentTypeId: string;
    contentId: string;
    category: string;
    description: string;
    address: string;
    regnCd: string;
    signguCd: string;
    latitude: number;
    longitude: number;
    imageUrls: string; // API에서는 문자열로 받음
    info: string;
    rating: number;
    googlePlaceId: string;
    reviewCount: number;
    tag1: string;
    tag2: string;
    tag3: string;
    tags: string;
    labelDepth1: string;
    labelDepth2: string;
    labelDepth3: string;
    parking: string;
    petCarriage: string;
    babyCarriage: string;
    openTime: TimeInfo;
    closeTime: TimeInfo;
    time: string;
    dayOff: string;
  }
  
  // API 응답 데이터 타입 정의
  export interface SpotsData {
    spots: Spot[];
    cacheKey: string;
  }
  
  // API 응답 타입 정의
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
  }
  
  // 스팟 조회 API 응답 타입
  export type SpotsResponse = ApiResponse<SpotsData>;
  
  // 요청 파라미터 타입 정의
  export interface SpotsRequestParams {
    categories: string[];
    regionCode: string;
    tripDuration: number;
    limitPerCategory?: number;
  }
  
  // 이미지 URL 문자열을 파싱하는 함수
  export const parseImageUrls = (imageUrlsString: string): string[] => {
    try {
      // JSON 문자열을 파싱
      const parsed = JSON.parse(imageUrlsString);
      
      // 배열인지 확인하고 반환
      if (Array.isArray(parsed)) {
        return parsed.filter(url => url && url.trim() !== '');
      }
      
      // 배열이 아니면 빈 배열 반환
      return [];
    } catch (error) {
      console.error('이미지 URL 파싱 오류:', error);
      return [];
    }
  };
  
  // Spot을 Restaurant 타입으로 변환하는 유틸리티 함수들
  export const formatTime = (time: TimeInfo): string => {
    return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
  };
  
  export const getMainImageUrl = (spot: Spot): string => {
    const imageUrls = parseImageUrls(spot.imageUrls);
    return imageUrls.length > 0 ? imageUrls[0] : '/cardImages/marione.png'; // 기본 이미지
  };
  
  export const getAllImageUrls = (spot: Spot): string[] => {
    return parseImageUrls(spot.imageUrls);
  };
  
  export const formatAddress = (spot: Spot): string => {
    return `${spot.labelDepth1} ${spot.labelDepth2} ${spot.labelDepth3}`;
  };
  
  export const getSpotTags = (spot: Spot): string[] => {
    return [spot.tag1, spot.tag2, spot.tag3].filter(tag => tag && tag.trim() !== '');
  };