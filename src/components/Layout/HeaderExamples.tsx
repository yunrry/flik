import React from 'react';
import HeaderBar from './HeaderBar';    

export const HeaderExamples: React.FC = () => {
  const handleBack = () => console.log('뒤로가기');
  const handleClose = () => console.log('닫기');
  const handleRegister = () => console.log('등록');
  const handleSearch = (query: string) => console.log('검색:', query);
  const handleMore = () => console.log('더보기');

  return (
    <div className="space-y-4">
      {/* 로고 헤더 (메인 페이지) */}
      <HeaderBar
        variant="logo"
      />

      {/* 뒤로가기 헤더 (일반 페이지) */}
      <HeaderBar
        variant="back"
        title="페이지 제목"
        onBack={handleBack}
      />

      {/* 닫기 헤더 (모달/팝업) */}
      <HeaderBar
        variant="close"
        title="모달 제목"
        onClose={handleClose}
        showRegister={true}
        registerText="등록"
        onRegister={handleRegister}
      />

      {/* 검색 헤더 (검색 페이지) */}
      <HeaderBar
        variant="search"
        onBack={handleBack}
        onSearch={handleSearch}
        searchPlaceholder="매장명을 입력해주세요"
      />

      {/* 뒤로가기 + 더보기 헤더 (상세 페이지) */}
      <HeaderBar
        variant="backWithMore"
        title="상세 정보"
        onBack={handleBack}
        onMore={handleMore}
      />
    </div>
  );
};
