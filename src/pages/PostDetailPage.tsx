import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Post } from '../types/post.types';  // data/postData가 아닌 types에서 import
import { getPostById } from '../api/postApi';
import { mapApiToPost } from '../types/post.types';  // 매핑 함수 추가
import CourseCard from '../components/Feed/CourseCard';
import { REGION_CONFIG_FOR_POST, RegionCodeForPost } from '../types/region.types';
import { translateCategory } from '../utils/categoryMapper';
import { getRegionName } from '../types/sigungu.types';
import { getUserProfile } from '../api/userApi';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postData = location.state?.postData;

  useEffect(() => {
    const fetchPost = async () => {
      // location.state에 postData가 있으면 그것을 사용
      if (postData) {
        setPost(postData);
        setIsLoading(false);
        return;
      }
      
      // postId가 없으면 리턴
      if (!postId) {
        setError('게시글 ID가 없습니다.');
        setIsLoading(false);
        return;
      }
      
      // postId가 있으면 API 호출
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getPostById(postId);
        console.log('게시글 상세 조회 응답:', response);
        
        // API 응답을 Post 타입으로 매핑
        if (response.data) {
          const mappedPost = mapApiToPost(response.data);
          setPost(mappedPost);
        } else {
          setError('게시글 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('게시글 조회 실패:', err);
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }

    };
  
    fetchPost();
  }, [postId, postData]);

  const handleBackClick = () => {
    navigate(-1);
  };

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
          <button
            onClick={handleBackClick}
            className="text-blue-500 hover:text-blue-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 지역 정보 가져오기
  const regionConfig = post.spots?.[0]?.regionCode 
    ? REGION_CONFIG_FOR_POST[post.spots[0].regionCode.slice(0, 2) as RegionCodeForPost]
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={handleBackClick}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="w-full lg:w-[60%] sm:max-w-7xl sm:mx-auto px-4 sm:px-4 lg:px-8 py-6 flex flex-col flex-1">
        {/* 제목 */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
        </div>

        {/* 작성자 정보 */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            {post.authorProfileImage ? (
              <img
                src={post.authorProfileImage}
                alt={post.authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {post.authorName || '사용자'}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </div>
          </div>
        </div>

        {/* 코스 카드 */}
        {post.course?.courseId && (
          <div className="mb-4">
            <CourseCard 
              course={{
                id: post.course.courseId,
                userId: 0,
                days: post.course.dayCount,
                regionCode: post.course.regionCode,
                totalDistance: 0,
                courseSlots: [],
                createdAt: '',
                courseType: '',
                totalSlots: post.course.spotCount,
                filledSlots: post.course.spotCount,
                selectedCategories: post.course.categories,
                isPublic: true
              }}
            />
          </div>
        )}

        {/* 장소 목록 */}
        {post.spots && post.spots.length > 0 && (
          <div className="mb-4 space-y-2">
            {post.spots.map((spot, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center mr-3">
                  {spot.imageUrl ? (
                    <img 
                      src={spot.imageUrl} 
                      alt={spot.name}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  )}
                </div>
                
                <div className="flex-1">
                <div className="text-gray-500 text-xs">
                    {translateCategory(spot.category)} • {getRegionName(spot.regionCode)}
                  </div>
                  <div className="text-gray-900 font-medium text-sm">
                    {spot.name}
                  </div>
                 
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 이미지 */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="mb-6">
            <div className="space-y-2">
              {post.imageUrls.map((url, index) => (
                <div key={index} className="w-full lg:w-[80%]">
                  <img
                    src={url}
                    alt={`게시글 이미지 ${index + 1}`}
                    className="w-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 내용 */}
        <div className="mb-8">
          <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetailPage;