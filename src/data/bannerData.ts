// src/data/bannerData.ts

import { BannerItem } from '../types/banner.types';

export const mockBannerData: BannerItem[] = [
  {
    id: 1,
    title: "슥삭 넘기다 보면 전국이 내 맛집 리스트! \n이제, 손끝으로 전국을 플릭하세요.",
    description: "스와이프 한 번에 내 취향에 딱 맞는 맛집을 발견할 수 있어요.",
    imageUrl: "/assets/banners/banner-sample-1.png",
    buttonText: "자세히 보기",
    category: "맛집",
    location: "속초"
  },
  {
    id: 2,
    title: "제주도 숨은 맛집 탐방",
    description: "관광지가 아닌 진짜 제주의 맛을 경험해보세요",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
    buttonText: "탐방하기",
    category: "맛집",
    location: "제주"
  },
  {
    id: 3,
    title: "부산 야경 명소",
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