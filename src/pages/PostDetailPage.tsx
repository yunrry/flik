import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Post } from '../types/post.types';
import { SpotDetail } from '../types/spot.types';
import { translateCategory } from '../utils/categoryMapper';
import { formatAddress } from '../utils/formater';
import { getPostById } from '../api/postApi';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const response = await getPostById(postId);
        console.log('response', response);
        setPost(response as unknown as Post);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

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
      <main className="px-4 py-6">
        {/* 제목 */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
        </div>

        {/* 작성자 정보 */}
        {/* <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
            {post.userId?.profileImageUrl ? (
              <img
                src={post.author.profileImageUrl}
                alt={post.author.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {post.author?.nickname || '사용자'}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </div>
          </div>
        </div> */}

        {/* 장소 카드 */}
        {/* {post.spot && (
          <div className="mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center mr-3">
                {post.spot.imageUrls && post.spot.imageUrls.length > 0 ? (
                  <img 
                    src={post.spot.imageUrls[0]} 
                    alt={post.spot.name}
                    className="w-full h-full object-cover rounded-sm"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="text-gray-600 text-xs mb-1">
                  {translateCategory(post.spot.category)} · {formatAddress(post.spot.address || '')}
                </div>
                <div className="text-gray-900 font-medium">
                  {post.spot.name}
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* 코스 카드 */}
        {/* {post.course && (
          <div className="mb-6">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-200 rounded-sm flex items-center justify-center mr-3">
                {post.course.imageUrl ? (
                  <img 
                    src={post.course.imageUrl} 
                    alt={post.course.title}
                    className="w-full h-full object-cover rounded-sm"
                  />
                ) : (
                  <div className="w-6 h-6 bg-blue-300 rounded"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="text-blue-600 text-xs mb-1">
                  코스 · {post.course.region}
                </div>
                <div className="text-gray-900 font-medium">
                  {post.course.title}
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* 이미지 */}
        {post.imageUrl && post.imageUrl.length > 0 && (
          <div className="mb-6">
            <div className="space-y-2">
              {post.imageUrl.map((url, index) => (
                <div key={index} className="w-full">
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