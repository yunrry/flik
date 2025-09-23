import { Post, ApiPostResponse } from '../types/post.types';
import { ApiResponse } from '../types/response.types';
import { TravelCourse, CourseSlot } from '../types/travelCourse.type';
import { getApiBaseUrl } from '../utils/env';
import { PostSearchResponse } from '../types/post.types';

  // API 기본 설정

  const API_BASE_URL = getApiBaseUrl();
  
  // 인증 토큰 가져오기 (useAuth와 연동)
  const getAuthToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };

  interface CreatePostRequest {
    title: string;
    content: string;
    type: string; // 서버에서 사용하는 PostType 코드 (예: "TRAVEL_COURSE" 등)
    imageUrl: string[]; // 이미지 URL 배열
    regionCode: string;
    relatedSpotIds?: number[];
    spotIds?: number[];
    courseId?: number;
  }
  
  export interface CreatePostResponse {
    id: number;
    title: string;
    content: string;
    type: string;
    imageUrls: string[];
    createdAt: string;
    userId: number;
  }

  export interface GetPostsParams {
    page?: number;
    size?: number;
    type?: string;
    regionCode?: string; // 커서 기반 페이지네이션용
  }
  
  export const createPost = async (postData: CreatePostRequest): Promise<CreatePostResponse> => {
    const accessToken = getAuthToken();
  
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/v1/posts`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      // 인증 만료
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
  
      // 기타 에러
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.warn('서버 에러 응답을 JSON으로 파싱할 수 없습니다.');
        }
        throw new Error(errorMessage);
      }
  
      // 성공 응답
      const data = await response.json();
      return data as CreatePostResponse;
    } catch (error) {
      console.error('게시글 작성 API 요청 중 오류 발생:', error);
      throw error;
    }
  };

  export const getUserPosts = async (): Promise<ApiResponse<PostSearchResponse>> => {
    const accessToken = getAuthToken();
  
    // const response = await fetch(
    //   `${API_BASE_URL}/v1/posts?page=${page}&size=${size}&type=review`,
    //   {
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );

    const response = await fetch(
      `${API_BASE_URL}/v1/posts?type=review`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`게시글 조회 실패: ${response.status}`);
    }
    const result: ApiResponse<PostSearchResponse> = await response.json();
    return result;
  };


  export const getPostById = async (postId: string): Promise<ApiResponse<ApiPostResponse>> => {
    const accessToken = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/v1/posts/get/${postId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`게시글 조회 실패: ${response.status}`);
    }
    const result: ApiResponse<ApiPostResponse> = await response.json();
    return result;
  };


  // 지역 필터링 포함 게시글 조회
  export const getAllPosts = async (params: GetPostsParams = {}): Promise<ApiResponse<PostSearchResponse>> => {
    console.log('regionCode', params.regionCode);
    const accessToken = getAuthToken();
    
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
  
    const { page = 0, size = 10, type = 'review', regionCode } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      type,
    });
  
    if (regionCode) {
      queryParams.append('regionCode', regionCode);
    }
  
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/posts/search?${queryParams.toString()}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
  
      if (!response.ok) {
        throw new Error(`게시글 조회 실패: ${response.status}`);
      }
      const result: ApiResponse<PostSearchResponse> = await response.json();
      
      
      return result;
    } catch (error) {
      console.error('게시글 목록 조회 중 오류:', error);
      throw error;
    }
  };

// // 커서 기반 페이지네이션 (옵션)
// export const getPostsWithCursor = async (params: GetPostsParams = {}): Promise<PostSearchResponse> => {
//   const accessToken = getAuthToken();
  
//   if (!accessToken) {
//     throw new Error('인증 토큰이 없습니다.');
//   }

//   const { cursor, size = 10, type = 'review' } = params;
  
//   const queryParams = new URLSearchParams({
//     size: size.toString(),
//     type,
//   });

//   if (cursor) {
//     queryParams.append('cursor', cursor);
//   }

//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/v1/posts?${queryParams.toString()}`,
//       {
//         headers: {
//           Accept: 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`게시글 조회 실패: ${response.status}`);
//     }

//     return response.json();
//   } catch (error) {
//     console.error('게시글 목록 조회 중 오류:', error);
//     throw error;
//   }
// };