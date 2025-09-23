// src/hooks/usePostFeed.ts
import { useState, useEffect, useCallback } from 'react';
import { mapApiToPost, Post } from '../types/post.types';
import { getAllPosts } from '../api/postApi';
import { getRegionCode } from '../types/sigungu.types';

interface UsePostFeedProps {
  region?: string;
  initialLimit?: number;
}

export const usePostFeed = ({ region, initialLimit = 6 }: UsePostFeedProps = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 초기 로드 및 지역 변경 시 재로드
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setPosts([]);
      setCurrentPage(0);
      setHasMore(true);
      setError(null);
      
      try {
        const response = await getAllPosts({ 
          page: 0,
          size: initialLimit,
          type: 'review',
          regionCode: region ? getRegionCode(region) : undefined
        });
        
        console.log('전체 응답:', response);
        
        if (response.data.content && Array.isArray(response.data.content)) {
          const mappedPosts = response.data.content.map(mapApiToPost);
          setPosts(mappedPosts);
          setHasMore(response.data.hasNext);
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
        setError(err instanceof Error ? err.message : '게시글 로드 실패');
        setHasMore(false);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadPosts();
  }, [region, initialLimit]);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore || error) return; // error 체크 추가
    
    setIsLoading(true);
    
    try {
      const nextPage = currentPage + 1;
      const response = await getAllPosts({ 
        page: nextPage,
        size: initialLimit,
        type: 'review'
      });
      
      setPosts(prev => [...prev, ...(response.data.content.map(mapApiToPost) as Post[] || [])]);
      setCurrentPage(nextPage);
      setHasMore(!response.data.hasNext);
    } catch (error) {
      console.error('Failed to load more posts:', error);
      setError(error instanceof Error ? error.message : '추가 게시글 로드 실패');
      setHasMore(false); // 에러 시 더 이상 로드하지 않음
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, hasMore, initialLimit]);

  const handleLike = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  };

  return {
    posts,
    isLoading,
    hasMore,
    loadMorePosts,
    handleLike,
    handleSave
  };
};