// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { HeaderBar } from '../components/Layout';
import MainBanner from '../components/Feed/MainBanner';
import CategoryList from '../components/Feed/CategoryList';
import PostFeed from '../components/Feed/PostFeed';
import FeaturedLocationCard from '../components/Feed/FeaturedLocationCard';
import { useBanner } from '../hooks/useBanner';
import { useCategory } from '../hooks/useCategory';
import { usePostFeed } from '../hooks/usePostFeed';
import { useFeaturedLocation } from '../hooks/useFeaturedLocation';



const RegionPage: React.FC = () => {
  const { posts, isLoading: postsLoading, hasMore, loadMorePosts } = usePostFeed();
  


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <HeaderBar variant="back-from-sido" />
      {/* 메인 콘텐츠 - 헤더 높이만큼 패딩 추가 */}
      <main className="pt-header-default w-full sm:max-w-7xl sm:mx-auto px-0 sm:px-6 lg:px-8 py-6">



            <PostFeed
            posts={posts}
            isLoading={postsLoading}
            hasMore={hasMore}
            onLoadMore={loadMorePosts}
          />




      </main>

    
    </div>
  );
};

export default RegionPage;