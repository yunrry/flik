
import { ApiResponse } from './response.types';
import { parseImageUrls } from '../utils/imageUrlParser';

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

  export interface SpotDetail {
    id: number;
    name: string;
    category: string;
    rating?: number;
    description?: string;
    address?: string;
    regionCode?: string;
    longitude?: number;
    latitude?: number;
    imageUrls?: string[] | string;
  }
  
  export interface SpotsData {
    spots: Spot[];
    cacheKey: string;
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

  export interface SpotsRequestParamsPaged {
    categories: string[];
    regionCode: string;
    page: number;
    limitPerCategory?: number;
  }

  export interface RandomSpotsApiResponse {
    page: number;
    pageSize: number;
    spots: Spot[];
    hasNext: boolean;
  }
  

  
  
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


  export const convertToSpot = (detail: SpotDetail): Spot => {
    return {
      id: detail.id,
      name: detail.name,
      category: detail.category || '',
      description: detail.description || '',
      address: detail.address || '',
      latitude: detail.latitude || 0,
      longitude: detail.longitude || 0,
      rating: detail.rating || 0,
      imageUrls: Array.isArray(detail.imageUrls) 
        ? detail.imageUrls.join(',') 
        : detail.imageUrls || '',
      
      // 기본값으로 채우는 필드들
      contentTypeId: '',
      contentId: '',
      regnCd: detail.regionCode?.substring(0, 2) || '',
      signguCd: detail.regionCode?.substring(2, 5) || '',
      info: '',
      googlePlaceId: '',
      reviewCount: 0,
      tag1: '',
      tag2: '',
      tag3: '',
      tags: '',
      labelDepth1: '',
      labelDepth2: '',
      labelDepth3: '',
      parking: '',
      petCarriage: '',
      babyCarriage: '',
      openTime: { hour: 0, minute: 0 },
      closeTime: { hour: 0, minute: 0 },
      time: '',
      dayOff: ''
    } as Spot;
  };
