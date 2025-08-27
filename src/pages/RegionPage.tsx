// src/pages/RegionPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import PostFeed from '../components/Feed/PostFeed';
import { usePostFeed } from '../hooks/usePostFeed';
import { REGION_CONFIG } from '../data/categoryData';

const RegionPage: React.FC = () => {
  const { region } = useParams<{ region: string }>();
  
  const handleExplore = () => {
    console.log('handleExplore');
  };

  const { posts, isLoading: postsLoading, hasMore, loadMorePosts } = usePostFeed({ 
    region: region 
  });

  // 지역 정보 가져오기
  const getRegionInfo = (regionCode: string) => {
    const regionEntry = Object.entries(REGION_CONFIG).find(
      ([code, config]) => code === regionCode || config.name === regionCode
    );
    return regionEntry ? regionEntry[1] : null;
  };

  const regionInfo = region ? getRegionInfo(region) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <HeaderBar 
        variant="back-from-sido" 
        region={region as any}
      />

      {/* 메인 콘텐츠 - 고정된 패딩 사용 */}
      <main className="pt-header-extended w-full sm:max-w-7xl sm:mx-auto px-0 sm:px-6 lg:px-8 py-6">
        <div className="flex-col items-start justify-between mb-2 px-4 sm:px-0">
          <PostFeed
            posts={posts}
            isLoading={postsLoading}
            hasMore={hasMore}
            onLoadMore={loadMorePosts}
          />
        </div>
      </main>
    </div>
  );
};

export default RegionPage;