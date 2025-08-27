// src/data/postData.ts

import { REGION_CONFIG } from './categoryData';

export interface Post {
  id: string;
  imageUrl: string;
  imageCount?: number;
  location: {
    name: string;
    region: string;
    imageUrl: string;
  };
  description: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

export const mockPostData: Post[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
    imageCount: 13,
    location: {
      name: '제목',
      region: '강릉',
      imageUrl: REGION_CONFIG.gangwon.imageUrl
    },
    description: '오후 반차 쓰고 떠난 강릉 1박 2일 여행오후 반차 쓰고 떠난 강릉 1박 2일 여행오 반차 쓰고 떠난 강릉 1박 2일 여행오후 반차 쓰고 떠난 강릉 1박 2일 여행오후...',
    likes: 234,
    comments: 45,
    isLiked: false,
    isSaved: false
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
    imageCount: 8,
    location: {
      name: '해운대 맛집',
      region: '부산',
      imageUrl: REGION_CONFIG.busan.imageUrl
    },
    description: '부산 해운대에서 찾은 숨겨진 맛집! 현지인만 아는 진짜 맛집을 발견했어요. 신선한 해산물과 완벽한 조리법으로 만든 요리가 일품입니다.',
    likes: 156,
    comments: 23,
    isLiked: true,
    isSaved: false
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    imageCount: 5,
    location: {
      name: '남산타워 야경',
      region: '서울',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    },
    description: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    imageCount: 15,
    location: {
      name: '제주 흑돼지 맛집',
      region: '제주',
      imageUrl: REGION_CONFIG.jeju.imageUrl
    },
    description: '제주도에 왔다면 꼭 먹어야 할 흑돼지 구이! 고소하고 담백한 맛이 일품이에요. 함께 나오는 된장찌개도 맛있습니다.',
    likes: 312,
    comments: 78,
    isLiked: true,
    isSaved: true
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    imageCount: 6,
    location: {
      name: '경복궁 카페',
      region: '서울',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    },
    description: '경복궁 근처 한옥 카페에서 즐기는 전통차 한잔. 고즈넉한 분위기 속에서 마시는 차는 정말 특별해요.',
    likes: 67,
    comments: 9,
    isLiked: false,
    isSaved: false
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    imageCount: 12,
    location: {
      name: '광안리 해변',
      region: '부산',
      imageUrl: REGION_CONFIG.busan.imageUrl
    },
    description: '부산 광안리 해변의 아름다운 석양. 광안대교와 함께 보는 노을은 정말 환상적이에요. 연인과 함께 오기 좋은 곳이네요.',
    likes: 198,
    comments: 34,
    isLiked: false,
    isSaved: false
  }
];

// 추가 포스트 로딩을 위한 함수
export const getPostsPage = async (page: number = 1, pageSize: number = 6): Promise<Post[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // 실제로는 서버에서 더 많은 데이터를 받아올 것
  if (page === 1) {
    return mockPostData.slice(0, pageSize);
  }
  
  // 두 번째 페이지부터는 동일한 데이터를 다른 ID로 복사하여 반환 (데모용)
  return mockPostData.slice(0, pageSize).map((post, index) => ({
    ...post,
    id: `${post.id}_p${page}_${index}`,
    likes: Math.floor(Math.random() * 500) + 10,
    comments: Math.floor(Math.random() * 100) + 1
  }));
};