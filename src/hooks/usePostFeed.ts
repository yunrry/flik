// src/hooks/usePostFeed.ts

import { useState, useEffect, useCallback } from 'react';
import { Post, getPostsPage } from '../data/postData';

export const usePostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 첫 페이지 로드
  useEffect(() => {
    loadInitialPosts();
  }, []);

  const loadInitialPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const initialPosts = await getPostsPage(1);
      setPosts(initialPosts);
      setCurrentPage(1);
      setHasMore(initialPosts.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : '포스트 로딩 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 추가 포스트 로드
  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const newPosts = await getPostsPage(nextPage);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setCurrentPage(nextPage);
        
        // 5페이지까지만 로드하도록 제한 (데모용)
        if (nextPage >= 5) {
          setHasMore(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '추가 포스트 로딩 실패');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, hasMore]);

  // 포스트 새로고침
  const refreshPosts = useCallback(async () => {
    setPosts([]);
    setCurrentPage(1);
    setHasMore(true);
    await loadInitialPosts();
  }, []);

  // 특정 포스트 업데이트
  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  }, []);

  // 포스트 제거
  const removePost = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, []);

  return {
    posts,
    isLoading,
    hasMore,
    error,
    loadMorePosts,
    refreshPosts,
    updatePost,
    removePost
  };
};