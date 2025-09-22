// src/hooks/usePostFeed.ts

import { useState, useEffect, useCallback } from 'react';
import { Post, getFilteredPosts } from '../data/postData';

interface UsePostFeedProps {
  region?: string; // 지역 필터 추가
  initialLimit?: number;
}

export const usePostFeed = ({ region, initialLimit = 6 }: UsePostFeedProps = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);

  console.log('usePostFeed - region 파라미터:', region);

  // 초기 로드 및 지역 변경 시 재로드
  useEffect(() => {
    console.log('usePostFeed - useEffect 실행됨, region:', region);
    
    const loadPosts = async () => {
      console.log('usePostFeed - loadPosts 호출됨, region:', region, 'limit:', initialLimit);
      setIsLoading(true);
      setPosts([]);
      setCurrentLimit(initialLimit);
      setHasMore(true);
      
      try {
        // 지역 필터와 함께 포스트 로드
        const newPosts = await getFilteredPosts({ 
          limit: initialLimit, 
          region: region || undefined 
        });
        
        console.log('usePostFeed - getFilteredPosts 결과:', newPosts);
        
        setPosts(newPosts);
        setHasMore(newPosts.length >= initialLimit);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [region]);

  const loadMorePosts = useCallback(async () => {
    if (!isLoading && hasMore) {
      console.log('usePostFeed - loadMorePosts 호출됨');
      setIsLoading(true);
      
      try {
        const newLimit = currentLimit + 6;
        const allPosts = await getFilteredPosts({ 
          limit: newLimit, 
          region: region || undefined 
        });
        
        setPosts(allPosts);
        setCurrentLimit(newLimit);
        setHasMore(allPosts.length >= newLimit);
      } catch (error) {
        console.error('Failed to load more posts:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentLimit, isLoading, hasMore, region]);

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