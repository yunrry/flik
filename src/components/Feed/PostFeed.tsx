// src/components/Feed/PostFeed.tsx

import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  imageUrl: string;
  imageCount?: number;
  location: {
    name: string;
    region: string;
    imageUrl: string;
  };
  description: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface PostFeedProps {
  posts?: Post[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const PostFeed: React.FC<PostFeedProps> = ({
  posts = [],
  isLoading = false,
  onLoadMore,
  hasMore = true
}) => {
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts);

  useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  const handlePostLike = (postId: string) => {
    setFeedPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handlePostSave = (postId: string) => {
    setFeedPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  };

  const handlePostClick = (postId: string) => {
    console.log('Post clicked:', postId);
    // 추후 상세 페이지로 이동 로직 추가
  };

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight &&
        !isLoading &&
        hasMore &&
        onLoadMore
      ) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <div className="space-y-6">
      {feedPosts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          imageUrl={post.imageUrl}
          imageCount={post.imageCount}
          location={post.location}
          description={post.description}
          likes={post.likes}
          comments={post.comments}
          isLiked={post.isLiked}
          isSaved={post.isSaved}
          onLike={handlePostLike}
          onSave={handlePostSave}
          onClick={handlePostClick}
        />
      ))}

      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 더보기 버튼 */}
      {!isLoading && hasMore && onLoadMore && (
        <div className="text-center py-8">
          <button
            onClick={onLoadMore}
            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            더 많은 피드 보기
          </button>
        </div>
      )}

      {/* 마지막 메시지 */}
      {!hasMore && feedPosts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          모든 게시물을 확인했습니다.
        </div>
      )}
    </div>
  );
};

export default PostFeed;