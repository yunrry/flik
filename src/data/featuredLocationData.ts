// src/data/featuredLocationData.ts

import { REGION_CONFIG } from './categoryData';

export interface FeaturedLocation {
  id: string;
  description: string;
  city: string;
  imageUrl: string;
  region: string;
  rating?: number;
  highlights: string[];
}

export const featuredLocationData: FeaturedLocation[] = [
  {
    id: 'gangneung-hot',
    description: '지금 가장 핫한 도시',
    city: '강릉',
    imageUrl: REGION_CONFIG.gangwon.imageUrl,
    region: '강원',
    rating: 4.7,
    highlights: ['강릉 커피거리', '안목해변', '정동진', '도깨비 촬영지']
  },
  {
    id: 'gangneung-current',
    description: '지금 가장 핫한 도시',
    city: '공주시', // name을 city로 변경
    imageUrl: REGION_CONFIG.gangwon.imageUrl,
    region: '충남',
    rating: 4.8,
    highlights: ['해변 맛집', '커피 거리', '바다 뷰', '힐링 여행']
  },
  {
    id: 'jeju-trending',
    description: '지금 가장 핫한 도시',
    city: '제주시', // 이미 올바르게 설정됨
    imageUrl: REGION_CONFIG.jeju.imageUrl,
    region: '제주',
    rating: 4.9,
    highlights: ['자연 경관', '흑돼지', '카페 투어', '드라이브']
  },
  {
    id: 'busan-hot',
    description: '지금 가장 핫한 도시',
    city: '해운대', // 이미 올바르게 설정됨
    imageUrl: REGION_CONFIG.busan.imageUrl,
    region: '부산',
    rating: 4.7,
    highlights: ['해운대', '광안리', '자갈치 시장', '야경 명소']
  },
  {
    id: 'seoul-featured',
    description: '지금 가장 핫한 도시',
    city: '서울', // name을 city로 변경
    imageUrl: REGION_CONFIG.seoul.imageUrl,
    region: '서울',
    rating: 4.6,
    highlights: ['한강 공원', '홍대 거리', '명동 쇼핑', '궁궐 투어']
  }
];

export const getCurrentFeaturedLocation = (): FeaturedLocation => {
  // 현재 시점에서 가장 추천하는 지역 (강릉이 기본)
  return featuredLocationData[0];
};

export const getRandomFeaturedLocation = (): FeaturedLocation => {
  const randomIndex = Math.floor(Math.random() * featuredLocationData.length);
  return featuredLocationData[randomIndex];
};