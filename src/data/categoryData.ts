// src/data/categoryData.ts

import { Category } from '../types/category.types';

export interface RegionConfig {
  name: string;
  englishName: string;
  imageUrl: string;
}

export type RegionCode = 
  | 'seoul' 
  | 'busan' 
  | 'daegu' 
  | 'incheon' 
  | 'gwangju' 
  | 'daejeon' 
  | 'ulsan' 
  | 'sejong'
  | 'gyeonggi' 
  | 'gangwon' 
  | 'chungbuk' 
  | 'chungnam' 
  | 'jeonbuk' 
  | 'jeonnam' 
  | 'gyeongbuk' 
  | 'gyeongnam' 
  | 'jeju';

export const REGION_CONFIG: Record<RegionCode, RegionConfig> = {
  seoul: {
    name: '서울',
    englishName: 'Seoul',
    imageUrl: '/assets/sidoImgaes/Seoul.jpg'
  },
  busan: {
    name: '부산',
    englishName: 'Busan', 
    imageUrl: '/assets/sidoImgaes/Busan.jpg'
  },
  daegu: {
    name: '대구',
    englishName: 'Daegu',
    imageUrl: '/assets/sidoImgaes/Deagu.jpeg'
  },
  incheon: {
    name: '인천',
    englishName: 'Incheon',
    imageUrl: '/assets/sidoImgaes/Incheon.jpeg'
  },
  gwangju: {
    name: '광주',
    englishName: 'Gwangju',
    imageUrl: '/assets/sidoImgaes/Gwangju.jpg'
  },
  daejeon: {
    name: '대전',
    englishName: 'Daejeon',
    imageUrl: '/assets/sidoImgaes/Deajeon.jpeg'
  },
  sejong: {
    name: '세종',
    englishName: 'Sejong',
    imageUrl: '/assets/sidoImgaes/Sejong.jpeg'
  },
  ulsan: {
    name: '울산',
    englishName: 'Ulsan',
    imageUrl: '/assets/sidoImgaes/Ulsan.jpeg'
  },
  gyeonggi: {
    name: '경기',
    englishName: 'Gyeonggi',
    imageUrl: '/assets/sidoImgaes/Gyeonggi.jpeg'
  },
  gangwon: {
    name: '강원',
    englishName: 'Gangwon',
    imageUrl: '/assets/sidoImgaes/Gangwon.jpg'
  },
  chungbuk: {
    name: '충북',
    englishName: 'Chungbuk',
    imageUrl: '/assets/sidoImgaes/Chungbuk.jpeg'
  },
  chungnam: {
    name: '충남',
    englishName: 'Chungnam',
    imageUrl: '/assets/sidoImgaes/Chungnam.jpg'
  },
  jeonbuk: {
    name: '전북',
    englishName: 'Jeonbuk',
    imageUrl: '/assets/sidoImgaes/Geonbuk.jpeg'
  },
  jeonnam: {
    name: '전남',
    englishName: 'Jeonnam',
    imageUrl: '/assets/sidoImgaes/Geonnam.jpeg'
  },
  gyeongbuk: {
    name: '경북',
    englishName: 'Gyeongbuk',
    imageUrl: '/assets/sidoImgaes/Gyeongbuk.jpg'
  },
  gyeongnam: {
    name: '경남',
    englishName: 'Gyeongnam',
    imageUrl: '/assets/sidoImgaes/Gyeongnam.jpg'
  },
  jeju: {
    name: '제주',
    englishName: 'Jeju',
    imageUrl: '/assets/sidoImgaes/Jeju.jpg'
  }
};

// 홈 화면용 주요 지역 (5개 + 더보기)
export const mainCategoryData: Category[] = [
  {
    id: 'seoul',
    name: '서울',
    icon: REGION_CONFIG.seoul.imageUrl,
    backgroundColor: '#FFFFFF',
    description: '서울 지역',
    itemCount: 245
  },
  {
    id: 'busan',
    name: '부산',
    icon: REGION_CONFIG.busan.imageUrl,
    backgroundColor: '#FFFFFF',
    description: '부산 지역',
    itemCount: 132
  },
  {
    id: 'gangwon',
    name: '강원',
    icon: REGION_CONFIG.gangwon.imageUrl,
    backgroundColor: '#FFFFFF',
    description: '강원 지역',
    itemCount: 89
  },
  {
    id: 'gwangju',
    name: '광주',
    icon: REGION_CONFIG.gwangju.imageUrl,
    backgroundColor: '#FFFFFF',
    description: '광주 지역',
    itemCount: 67
  },
  {
    id: 'daejeon',
    name: '대전',
    icon: REGION_CONFIG.daejeon.imageUrl,
    backgroundColor: '#FFFFFF',
    description: '대전 지역',
    itemCount: 78
  },
  {
    id: 'more',
    name: '더보기',
    icon: 'more', // 특별한 아이콘 식별자
    backgroundColor: '#FFFFFF',
    description: '전체 지역 보기',
    itemCount: 0
  }
];

export const mockCategoryData: Category[] = Object.entries(REGION_CONFIG).map(([code, config]) => ({
  id: code,
  name: config.name,
  icon: config.imageUrl,
  backgroundColor: '#FFFFFF',
  description: `${config.name} 지역`,
  itemCount: Math.floor(Math.random() * 200) + 50
}));

export const getCategoryData = async (): Promise<Category[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mainCategoryData; // 홈 화면에서는 주요 카테고리만 반환
};

export const getAllCategoryData = async (): Promise<Category[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCategoryData; // 전체 지역 데이터 반환
};

export const findCategoryById = (id: string): Category | undefined => {
  return mockCategoryData.find(category => category.id === id);
};