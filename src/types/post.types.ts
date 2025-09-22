// src/types/post.ts
export interface UserActivityPostResponse {
    id: number;
    userId: number;
    type: string; // 'review', 'save', 'visit' 등
    visitCount: number | null;
    title: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: string; // "2025-09-18 12:05:04"
  }
  
  export interface PostSearchResponse {
    data: any;
    content: UserActivityPostResponse[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    hasNext: boolean;
    numberOfElements: number;
  }
  
