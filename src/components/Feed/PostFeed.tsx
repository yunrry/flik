// src/components/Feed/PostFeed.tsx
import React, { useEffect, useRef, useState } from 'react';
import PostCard from './PostCard';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types/post.types';
import { getMyPostIds } from '../../api/postApi';

interface PostFeedProps {
  posts: Post[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  isLoading,
  onLoadMore,
  hasMore
}) => {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const MY_POST_IDS_CACHE_KEY = 'myPostIdsCache';
  const MY_POST_IDS_CACHE_TTL_MS = 5 * 60 * 1000; // 5분
  const [myPostIdSet, setMyPostIdSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    // 비로그인 시 스킵
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // 캐시 확인
    try {
      const cachedRaw = localStorage.getItem(MY_POST_IDS_CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw) as { ids: number[]; ts: number };
        const isValid = Date.now() - cached.ts < MY_POST_IDS_CACHE_TTL_MS;
        if (isValid) {
         setMyPostIdSet(new Set<number>(cached.ids));
         return; // 유효 캐시 존재 시 호출 생략
        }
      }
    } catch {
      // 캐시 파싱 실패 시 무시
    }

    // 최초 접속 시 조회 후 캐시
    (async () => {
      try {
        const res = await getMyPostIds();
        if (res?.success && Array.isArray(res.data?.ids)) {
          localStorage.setItem(
            MY_POST_IDS_CACHE_KEY,
            JSON.stringify({ ids: res.data.ids, ts: Date.now() })
          );
          setMyPostIdSet(new Set<number>(res.data.ids));
        }
      } catch {
        // 인증 만료/네트워크 오류 등은 홈 로딩에 영향 주지 않음
      }
    })();
  }, []);


  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    if (isLoading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, onLoadMore]);

  const handlePostClick = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const isMy = myPostIdSet.has(Number(postId));
      navigate(`/post/${postId}`, { state: { postData: post, isMyPost: isMy } });
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          imageUrl={post.imageUrls[0]}
          imageCount={post.imageCount}
          regionCode={post.regionCode || ''}
          content={post.content}
          likes={post.likes}
          comments={post.comments}
          isLiked={post.isLiked}
          isSaved={post.isSaved}
          onLike={() => {}}
          onSave={() => {}}
          onClick={handlePostClick}
        />
      ))}

      {/* Intersection Observer 타겟 */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          )}
        </div>
      )}

      {/* 마지막 메시지 */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          모든 게시물을 확인했습니다.
        </div>
      )}
    </div>
  );
};

export default PostFeed;