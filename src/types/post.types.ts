// src/types/post.ts
export interface UserActivityPostResponse {
    id: number;
    userId: number;
    type: string; // 'review', 'save', 'visit' 등
    visitCount: number | null;
    title: string;
    content: string | null;
    imageUrl: string | null;
    createdAt: string; // "2025-09-18 12:05:04"
  }


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
  authorId: string; //from userId
  authorName: string; //from userName
  authorProfileImage: string; //from userProfileImage
  type: string;
  title: string;
  regionCode: string;
  imageUrls: string[];
  imageCount?: number;
  spots: SpotMetadata[]|null;
  course: CourseMetadata|null;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface ApiPostResponse {
  id: string;
  userId: number;
  userName: string;
  userProfileImageUrl: string;
  type: string;
  visitCount: number;
  title: string;
  content: string;
  imageUrls: string[];
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

export const mapApiToPost = (apiPost: ApiPostResponse): Post => ({
  id: apiPost.id,
  authorId: apiPost.userId.toString(),
  authorName: apiPost.userName,
  authorProfileImage: apiPost.userProfileImageUrl,
  type: apiPost.type,
  title: apiPost.title,
  regionCode: apiPost.regionCode,
  imageUrls: apiPost.imageUrls || [],
  imageCount: apiPost.imageUrls?.length || 0,
  spots: apiPost.spotMetaResponses?.map(spot => ({
    spotId: spot.spotId,
    name: spot.name,
    category: spot.category,
    regionCode: spot.regionCode,
    imageUrl: spot.imageUrl
  })),
  course: apiPost.courseMetaResponse ? {
    courseId: apiPost.courseMetaResponse.courseId,
    spotIds: apiPost.courseMetaResponse.spotIds,
    name: apiPost.courseMetaResponse.name,
    spotCount: apiPost.courseMetaResponse.spotIds.length,
    dayCount: apiPost.courseMetaResponse.days,
    regionCode: apiPost.courseMetaResponse.regionCode,
    categories: apiPost.courseMetaResponse.categories
  } : null,
  content: apiPost.content,
  likes: 0,
  comments: 0,
  isLiked: false,
  isSaved: false,
  createdAt: apiPost.createdAt
});
  
export interface PostSearchResponse {
  content: ApiPostResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  hasNext: boolean;
  numberOfElements: number;
}
