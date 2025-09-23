// src/components/Feed/PostFeed.tsx
import React, { useEffect, useRef } from 'react';
import PostCard from './PostCard';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types/post.types';

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
      navigate(`/post/${postId}`, { state: { postData: post } });
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