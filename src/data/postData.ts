// src/data/postData.ts

import { REGION_CONFIG } from './categoryData';
import { REGION_CONFIG_FOR_POST, RegionCodeForPost } from '../types/region.types';

export interface SpotMetadata {
  spotId: number;
  name: string;
  regionCode: string;
  imageUrl: string;
  category: string;
}

export interface CourseMetadata {
  courseId: number
  spotIds: number[],
  name: string,
  spotCount: number,
  dayCount: number,
  regionCode: string,
  categories: string[]
}

export interface Post {
  id: string; //from postId
  author: string; //from userId
  title: string;
  regionCode: string;
  imageUrls: string[];
  imageCount?: number;
  spots: SpotMetadata[];
  course: CourseMetadata;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

interface ApiPostResponse {
  id: string;
  userId: number;
  type: string;
  visitCount: number;
  title: string;
  content: string;
  imageUrl: string[];
  regionCode: string;
  createdAt: string;
  courseMetaResponse: {
    courseId: number,
    spotIds: number[],
    name: string,
    days: number,
    regionCode: string,
    categories: string[]
  };
  spotMetaResponses: {
    spotId: number;
    name: string;
    regionCode: string;
    imageUrl: string;
    category: string;
  }[];
}

const mapApiToPost = (apiPost: ApiPostResponse): Post => ({
  id: apiPost.id,
  author: apiPost.userId.toString(),
  title: apiPost.title,
  regionCode: apiPost.regionCode,
  imageUrls: apiPost.imageUrl,
  imageCount: apiPost.imageUrl.length,
  spots: apiPost.spotMetaResponses.map(spot => ({
    spotId: spot.spotId,
    name: spot.name,
    category: spot.category,
    regionCode: spot.regionCode,
    imageUrl: spot.imageUrl
  })),
  course: {
    courseId: apiPost.courseMetaResponse.courseId,
    spotIds: apiPost.courseMetaResponse.spotIds,
    name: apiPost.courseMetaResponse.name,
    spotCount: apiPost.courseMetaResponse.spotIds.length,
    dayCount: apiPost.courseMetaResponse.days,
    regionCode: apiPost.courseMetaResponse.regionCode,
    categories: apiPost.courseMetaResponse.categories
  },
  content: apiPost.content,
  likes: 0, // API에서 제공되지 않음
  comments: 0, // API에서 제공되지 않음
  isLiked: false, // API에서 제공되지 않음
  isSaved: false, // API에서 제공되지 않음
  createdAt: apiPost.createdAt
});



export const mockPostData: Post[] = [
  {
    id: '1',
    author: 'user123',
    title: '강릉 해변',
    regionCode: '51110',
    imageUrls: ['https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    imageCount: 13,
    spots: [{
      spotId: 1,
      name: '강릉 해변',
      category: '자연',
      regionCode: '51110',
      imageUrl: REGION_CONFIG.gangwon.imageUrl
    }],
    course: {
      courseId: 1,
      spotIds: [2, 4],      
      name: '강릉 1박 2일',
      regionCode: '51110',
      spotCount: 5,
      dayCount: 2,
      categories: ['자연', '맛집']
    },
    content: '오후 반차 쓰고 떠난 강릉 1박 2일 여행오후 반차 쓰고 떠난 강릉 1박 2일 여행오 반차 쓰고 떠난 강릉 1박 2일 여행오후 반차 쓰고 떠난 강릉 1박 2일 여행오후...',
    likes: 234,
    comments: 45,
    isLiked: false,
    isSaved: false,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '2',
    author: 'user456',
    title: '해운대 맛집',
    regionCode: '26100',
    imageUrls: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop'],
    imageCount: 8,
    spots: [{
      spotId: 2,
      name: '해운대 맛집',
      category: '맛집',
      regionCode: '26100',
      imageUrl: REGION_CONFIG.busan.imageUrl
    }],
    course: {
      courseId: 2,
      spotIds: [2, 4],
      name: '부산 해운대 코스',
      regionCode: '26100',
      spotCount: 6,
      dayCount: 1,
      categories: ['맛집', '해변']
    },
    content: '부산 해운대에서 찾은 숨겨진 맛집! 현지인만 아는 진짜 맛집을 발견했어요. 신선한 해산물과 완벽한 조리법으로 만든 요리가 일품입니다.',
    likes: 156,
    comments: 23,
    isLiked: true,
    isSaved: false,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '10',
    title: '남산타워',
    author: 'user789',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 10,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 10,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '11100',
    title: '남산타워',
    author: 'user101',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 11,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 11,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '12',
    title: '남산타워',
    author: 'user202',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 12,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 12,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '13',
    title: '남산타워',
    author: 'user303',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 13,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 13,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '14',
    title: '남산타워',
    author: 'user404',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 14,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 14,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '15',
    title: '남산타워',
    author: 'user505',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 15,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 15,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '16',
    title: '남산타워',
    author: 'user606',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 16,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 16,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '17',
    title: '남산타워',
    author: 'user707',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 17,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 17,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '서울 용산구',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '18',
    title: '남산타워',
    author: 'user808',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 18,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 18,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '19',
    title: '남산타워',
    author: 'user909',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    imageCount: 5,
    spots: [{
      spotId: 19,
      name: '남산타워',
      category: '관광지',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 19,
      spotIds: [2, 4],
      name: '서울 야경 코스',
      regionCode: '11100',
      spotCount: 4,
      dayCount: 1,
      categories: ['관광지', '야경']
    },
    content: '서울의 야경을 한눈에 볼 수 있는 남산타워. 특히 저녁 시간대에 올라가면 황금빛으로 물든 도시의 모습을 감상할 수 있어요.',
    likes: 89,
    comments: 12,
    isLiked: false,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '4',
    title: '제주 흑돼지 맛집',
    author: 'user100',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    imageCount: 15,
    spots: [{
      spotId: 4,
      name: '제주 흑돼지 맛집',
      category: '맛집',
      regionCode: '50100',
      imageUrl: REGION_CONFIG.jeju.imageUrl
    }],
    course: {
      courseId: 4,

spotIds: [2, 4],      name: '제주 맛집 투어',
      regionCode: '50100',
      spotCount: 8,
      dayCount: 3,
      categories: ['맛집', '흑돼지']
    },
    content: '제주도에 왔다면 꼭 먹어야 할 흑돼지 구이! 고소하고 담백한 맛이 일품이에요. 함께 나오는 된장찌개도 맛있습니다.',
    likes: 312,
    comments: 78,
    isLiked: true,
    isSaved: true,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '5',
    title: '경복궁 카페',
    author: 'user200',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'],
    imageCount: 6,
    spots: [{
      spotId: 5,
      name: '경복궁 카페',
      category: '카페',
      regionCode: '11100',
      imageUrl: REGION_CONFIG.seoul.imageUrl
    }],
    course: {
      courseId: 5,

spotIds: [2, 4],      name: '한옥 카페 투어',
      regionCode: '11100',
      spotCount: 3,
      dayCount: 1,
      categories: ['카페', '한옥', '전통']
    },
    content: '경복궁 근처 한옥 카페에서 즐기는 전통차 한잔. 고즈넉한 분위기 속에서 마시는 차는 정말 특별해요.',
    likes: 67,
    comments: 9,
    isLiked: false,
    isSaved: false,
    createdAt: '2025-09-23 12:00:00'
  },
  {
    id: '6',
    title: '광안리 해변',
    author: 'user300',
    regionCode: '11100',
    imageUrls: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop'],
    imageCount: 12,
    spots: [{
      spotId: 6,
      name: '광안리 해변',
      category: '해변',
      regionCode: '26100',
      imageUrl: REGION_CONFIG.busan.imageUrl
    }],
    course: {
      courseId: 6,

spotIds: [2, 4],      name: '부산 해변 코스',
      regionCode: '26100',
      spotCount: 5,
      dayCount: 2,
      categories: ['해변', '노을', '야경']
    },
    content: '부산 광안리 해변의 아름다운 석양. 광안대교와 함께 보는 노을은 정말 환상적이에요. 연인과 함께 오기 좋은 곳이네요.',
    likes: 198,
    comments: 34,
    isLiked: false,
    isSaved: false,
    createdAt: '2025-09-23 12:00:00'
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

interface GetFilteredPostsParams {
  limit?: number;
  region?: string;
}

export const getFilteredPosts = async ({ 
  limit = 10, 
  region 
}: GetFilteredPostsParams = {}): Promise<Post[]> => {
  // 실제 환경에서는 API 호출
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredPosts = [...mockPostData];
  
// 지역 필터링
if (region) {
  // region에서 앞 2글자만 추출 (예: "서울 마포구" -> "서울")
  const regionName = region;
  
  filteredPosts = filteredPosts.filter(post => 
    REGION_CONFIG_FOR_POST[post.regionCode.substring(0, 2) as RegionCodeForPost].englishName.toLowerCase() === regionName.toLowerCase()
  );
}
  
  return filteredPosts.slice(0, limit);
};