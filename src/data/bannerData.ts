// src/data/bannerData.ts

import { BannerItem } from '../types/banner.types';

export const mockBannerData: BannerItem[] = [
  {
    id: 1,
    title: "속초 낭만이 보던 찬국이가 맛짱 리스트!",
    subtitle: "이제, 즐겁으로 긴국을 플러해세요.",
    description: "속초의 그 맛과 리뷰어 맛있는 먹거리를 우리가 찾아 온다!!",
    imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop",
    buttonText: "자세히 보기",
    category: "맛집",
    location: "속초"
  },
  {
    id: 2,
    title: "제주도 숨은 맛집 탐방",
    subtitle: "현지인만 아는 진짜 맛집",
    description: "관광지가 아닌 진짜 제주의 맛을 경험해보세요",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
    buttonText: "탐방하기",
    category: "맛집",
    location: "제주"
  },
  {
    id: 3,
    title: "부산 야경 명소",
    subtitle: "낭만적인 부산의 밤",
    description: "해운대와 광안리의 아름다운 야경을 만나보세요",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    buttonText: "둘러보기",
    category: "관광",
    location: "부산"
  }
];

// 배너 데이터 가져오기 함수 (추후 API 연동 대비)
export const getBannerData = async (): Promise<BannerItem[]> => {
  // 실제 API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockBannerData;
};