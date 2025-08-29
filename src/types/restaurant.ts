// src/types/restaurant.ts

export interface Restaurant {
    id: string;
    name: string;
    images: string[];
    rating: number;
    description: string;
    address: string;
    distance?: number; // 미터 단위
    hours: string;
    // FlikCard와 호환성을 위한 추가 속성들
    category?: string;
    location?: string;
    priceRange?: string;
    image?: string; // 단일 이미지 (하위 호환성)
    coordinates?: {
      lat: number;
      lng: number;
    };
    // 저장 관련 정보
    savedAt?: string; // 저장된 시간
    userId?: string;  // 저장한 사용자 ID
  }
  
  // 저장된 맛집 목록 응답 타입
  export interface SavedRestaurantsResponse {
    success: boolean;
    data: Restaurant[];
    total: number;
    message?: string;
  }
  
  // 맛집 검색 필터 타입
  export interface RestaurantFilter {
    category?: string;
    location?: string;
    priceRange?: string;
    rating?: number;
    distance?: number;
    sortBy?: 'rating' | 'distance' | 'savedAt' | 'name';
    sortOrder?: 'asc' | 'desc';
  }
  
  // 맛집 카드에서 사용되는 액션 타입
  export interface RestaurantActions {
    onSave?: (restaurant: Restaurant) => void;
    onUnsave?: (restaurant: Restaurant) => void;
    onBlogReview?: (restaurant: Restaurant) => void;
    onKakaoMap?: (restaurant: Restaurant) => void;
    onClick?: (restaurant: Restaurant) => void;
  }
  
  // 네이버 플레이스/카카오맵에서 가져오는 원본 데이터 타입
  export interface PlaceData {
    // 네이버 플레이스
    naver?: {
      placeId: string;
      placeName: string;
      category: string;
      roadAddress: string;
      phoneNumber?: string;
      businessHours?: string;
      rating?: number;
      reviewCount?: number;
      images?: string[];
    };
    // 카카오맵
    kakao?: {
      id: string;
      place_name: string;
      category_name: string;
      category_group_code: string;
      category_group_name: string;
      phone: string;
      address_name: string;
      road_address_name: string;
      x: string; // longitude
      y: string; // latitude
      place_url: string;
    };
  }