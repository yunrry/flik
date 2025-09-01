// src/api/kakaoMapApi.ts

declare global {
  interface Window {
    kakao: any;
  }
}

export interface KakaoMapConfig {
  center: {
    lat: number;
    lng: number;
  };
  level: number; // 지도 확대 레벨 (1~14)
  mapTypeId?: string;
}

export interface MarkerConfig {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  content?: string;
  image?: {
    src: string;
    size: { width: number; height: number };
    offset: { x: number; y: number };
  };
}

export interface PlaceSearchResult {
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
  distance: string;
}

import { getKakaoJavaScriptKey } from '../utils/env';

// 카카오맵 SDK 로드
export const loadKakaoMapSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
      resolve();
      return;
    }

    // 기존 스크립트가 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      // 스크립트가 이미 있으면 로딩 완료를 기다림
      const checkKakao = () => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
          resolve();
        } else {
          setTimeout(checkKakao, 100);
        }
      };
      checkKakao();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${getKakaoJavaScriptKey()}&libraries=services,clusterer,drawing&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      // autoload=false이므로 수동으로 로드
      window.kakao.maps.load(() => {
        // 완전히 로드될 때까지 기다림
        const waitForKakao = () => {
          if (window.kakao.maps.LatLng) {
            console.log('카카오맵 SDK 로드 완료');
            resolve();
          } else {
            setTimeout(waitForKakao, 50);
          }
        };
        waitForKakao();
      });
    };
    
    script.onerror = () => {
      reject(new Error('카카오맵 SDK 로드 실패'));
    };
    
    document.head.appendChild(script);
  });
};

// 지도 생성
export const createKakaoMap = (
  container: HTMLElement, 
  config: KakaoMapConfig
) => {
  const { kakao } = window;
  
  const options = {
    center: new kakao.maps.LatLng(config.center.lat, config.center.lng),
    level: config.level,
    mapTypeId: config.mapTypeId || kakao.maps.MapTypeId.ROADMAP
  };

  const map = new kakao.maps.Map(container, options);
  
  // 지도 타입 컨트롤 추가
  const mapTypeControl = new kakao.maps.MapTypeControl();
  map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 줌 컨트롤 추가
  const zoomControl = new kakao.maps.ZoomControl();
  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

  return map;
};

// 마커 생성
export const createMarker = (
  map: any, 
  config: MarkerConfig
) => {
  const { kakao } = window;
  
  const markerPosition = new kakao.maps.LatLng(config.position.lat, config.position.lng);
  
  const markerOptions: any = {
    position: markerPosition,
    title: config.title
  };

  // 커스텀 마커 이미지가 있는 경우
  if (config.image) {
    const markerImage = new kakao.maps.MarkerImage(
      config.image.src,
      new kakao.maps.Size(config.image.size.width, config.image.size.height),
      {
        offset: new kakao.maps.Point(config.image.offset.x, config.image.offset.y)
      }
    );
    markerOptions.image = markerImage;
  }

  const marker = new kakao.maps.Marker(markerOptions);
  marker.setMap(map);

  // 인포윈도우 추가 (선택적)
  if (config.content) {
    const infoWindow = new kakao.maps.InfoWindow({
      content: config.content,
      removable: true
    });

    // 마커 클릭 시 인포윈도우 표시
    kakao.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    });
  }

  return marker;
};

// 장소 검색 (키워드 기반)
export const searchPlaces = (
  keyword: string,
  callback: (result: PlaceSearchResult[], status: string) => void,
  options?: {
    location?: { lat: number; lng: number };
    radius?: number;
    category?: string;
    page?: number;
    size?: number;
  }
): void => {
  const { kakao } = window;
  const places = new kakao.maps.services.Places();
  
  const searchOptions: any = {
    page: options?.page || 1,
    size: options?.size || 15
  };

  // 특정 위치 중심으로 검색
  if (options?.location) {
    searchOptions.location = new kakao.maps.LatLng(options.location.lat, options.location.lng);
    searchOptions.radius = options.radius || 1000; // 기본 1km
  }

  // 카테고리 필터
  if (options?.category) {
    searchOptions.category_group_code = options.category;
  }

  places.keywordSearch(keyword, callback, searchOptions);
};

// 주소로 좌표 검색
export const getCoordinatesFromAddress = (
  address: string
): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result: any, status: string) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = {
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x)
        };
        resolve(coords);
      } else {
        reject(new Error(`주소 검색 실패: ${status}`));
      }
    });
  });
};

// 좌표로 주소 검색 (역지오코딩)
export const getAddressFromCoordinates = (
  lat: number, 
  lng: number
): Promise<{
  address: string;
  roadAddress: string;
  region: string;
}> => {
  return new Promise((resolve, reject) => {
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();
    const coords = new kakao.maps.LatLng(lat, lng);

    geocoder.coord2Address(coords.getLng(), coords.getLat(), (result: any, status: string) => {
      if (status === kakao.maps.services.Status.OK) {
        const addressData = {
          address: result[0].address?.address_name || '',
          roadAddress: result[0].road_address?.address_name || '',
          region: result[0].address?.region_1depth_name || ''
        };
        resolve(addressData);
      } else {
        reject(new Error(`좌표 변환 실패: ${status}`));
      }
    });
  });
};

// 두 지점 간 거리 계산 (미터 단위)
export const calculateDistance = (
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number }
): number => {
  const { kakao } = window;
  const point1 = new kakao.maps.LatLng(pos1.lat, pos1.lng);
  const point2 = new kakao.maps.LatLng(pos2.lat, pos2.lng);
  
  // 직선거리 계산 (단위: 미터)
  const polyline = new kakao.maps.Polyline({
    path: [point1, point2]
  });
  
  return polyline.getLength();
};