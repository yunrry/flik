
import { ApiResponse } from './response.types';


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

  export interface RandomSpotsApiResponse {
    page: number;
    pageSize: number;
    spots: Spot[];
    hasNext: boolean;
  }
  
  // 이미지 URL 문자열을 파싱하는 함수
  export const parseImageUrls = (
    imageUrlsInput: string | string[] | null | undefined
  ): string[] => {
    try {
      // 1. 값이 없으면 빈 배열
      if (!imageUrlsInput) return [];
  
      // 2. 이미 배열일 경우
      if (Array.isArray(imageUrlsInput)) {
        const allUrls: string[] = [];
        
        imageUrlsInput.forEach(item => {
          if (!item || typeof item !== 'string') return;
          
          const trimmed = item.trim();
          if (!trimmed) return;
          
          // 각 배열 요소가 JSON 문자열일 가능성 체크
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              allUrls.push(...parsed.filter(url => url && url.trim()));
            } else if (typeof parsed === 'string' && parsed.trim()) {
              allUrls.push(parsed.trim());
            }
          } catch {
            // JSON이 아닌 경우 - 부분적 JSON이나 일반 문자열 처리
            if (trimmed.startsWith('["') || trimmed.startsWith('[\'')) {
              // 부분적 JSON 배열 시작
              let combined = trimmed;
              
              // 다음 요소들과 결합하여 완전한 JSON 만들기
              for (let i = imageUrlsInput.indexOf(item) + 1; i < imageUrlsInput.length; i++) {
                const nextItem = imageUrlsInput[i];
                if (typeof nextItem === 'string') {
                  combined += ',' + nextItem.trim();
                  if (nextItem.trim().endsWith('"]') || nextItem.trim().endsWith('\']')) {
                    break;
                  }
                }
              }
              
              try {
                const parsed = JSON.parse(combined);
                if (Array.isArray(parsed)) {
                  allUrls.push(...parsed.filter(url => url && url.trim()));
                }
              } catch {
                // 여전히 실패하면 콤마로 분할해서 처리
                allUrls.push(...trimmed.split(',').map(url => 
                  url.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '')
                ).filter(url => url && url.startsWith('http')));
              }
            } else if (trimmed.includes(',')) {
              // 콤마로 구분된 URL들
              allUrls.push(...trimmed.split(',').map(url => url.trim()).filter(url => url));
            } else {
              // 단일 URL
              allUrls.push(trimmed);
            }
          }
        });
        
        return allUrls.filter(url => url && url.trim() !== '');
      }
  
      // 3. 문자열인 경우
      if (typeof imageUrlsInput === 'string') {
        const trimmed = imageUrlsInput.trim();
        
        // JSON 배열 문자열 시도
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed.filter(url => url && url.trim() !== '');
          }
        } catch {
          // JSON 파싱 실패 시 다른 방법들 시도
          
          // 콤마로 구분된 URL들
          if (trimmed.includes(',')) {
            return trimmed
              .split(',')
              .map(url => url.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, ''))
              .filter(url => url && url.startsWith('http'));
          }
          
          // 단일 URL
          if (trimmed.startsWith('http')) {
            return [trimmed];
          }
        }
      }
  
      return [];
    } catch (error) {
      console.warn('이미지 URL 파싱 실패:', error, imageUrlsInput);
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
      regnCd: '',
      signguCd: '',
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
