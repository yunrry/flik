import { getNaverClientId, getNaverClientSecret, getApiBaseUrl } from '../utils/env';

const NAVER_CLIENT_ID = getNaverClientId();
const NAVER_CLIENT_SECRET = getNaverClientSecret();
const API_BASE_URL = getApiBaseUrl();

export interface NaverBlogItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

export interface NaverBlogResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverBlogItem[];
}

export interface BlogSearchRequest {
  restaurantName: string;
  address?: string;
  location?: string;
  display?: number; // 검색 결과 개수 (기본 10, 최대 100)
  start?: number;   // 검색 시작 위치 (기본 1, 최대 1000)
  sort?: 'sim' | 'date'; // 정렬 옵션 (sim: 정확도, date: 날짜)
}

// 네이버 블로그 검색 API 호출 (백엔드 경유)
export const searchNaverBlog = async ({
  restaurantName,
  address,
  location,
  display = 20,
  start = 1,
  sort = 'sim'
}: BlogSearchRequest): Promise<NaverBlogResponse> => {
  try {
    // 검색 쿼리 생성 - 음식점 이름 + 지역명/주소로 더 정확한 검색
    const locationKeyword = location || address?.split(' ').slice(0, 2).join(' ') || '';
    const query = `${restaurantName} ${locationKeyword} 맛집 블로그 리뷰`.trim();
    
    const params = new URLSearchParams({
      query: encodeURIComponent(query),
      display: display.toString(),
      start: start.toString(),
      sort
    });

    const response = await fetch(`${API_BASE_URL}/naver/blog?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 인증이 필요한 경우
        ...(localStorage.getItem('auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NaverBlogResponse = await response.json();
    
    console.log('네이버 블로그 검색 결과:', data);
    return data;

  } catch (error) {
    console.error('네이버 블로그 검색 실패:', error);
    throw new Error(
      error instanceof Error 
        ? `블로그 검색에 실패했습니다: ${error.message}`
        : '블로그 검색에 실패했습니다.'
    );
  }
};

// 블로그 제목에서 HTML 태그 제거
export const cleanBlogTitle = (title: string): string => {
  return title
    .replace(/<b>/g, '')
    .replace(/<\/b>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'");
};

// 블로그 설명에서 HTML 태그 제거
export const cleanBlogDescription = (description: string): string => {
  return description
    .replace(/<[^>]*>/g, '') // 모든 HTML 태그 제거
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .trim();
};

// 날짜 포맷팅 (YYYYMMDD -> YYYY.MM.DD)
export const formatBlogDate = (dateString: string): string => {
  if (dateString.length === 8) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}.${month}.${day}`;
  }
  return dateString;
};

// 백엔드 API 엔드포인트 예시 (참고용)
/*
백엔드에서 구현해야 할 API:

GET /api/naver/blog
Query Parameters:
- query: 검색어
- display: 결과 개수
- start: 시작 위치
- sort: 정렬 방식

백엔드에서 네이버 API 호출:
- X-Naver-Client-Id: NAVER_CLIENT_ID
- X-Naver-Client-Secret: NAVER_CLIENT_SECRET
- URL: https://openapi.naver.com/v1/search/blog.json

이유: CORS 정책으로 인해 프론트엔드에서 직접 네이버 API 호출 불가
*/