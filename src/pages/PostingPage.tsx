import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import LocationIcon from '../components/Icons/LocationIcon';

const PostingPage: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [title, setTitle] = useState('');


  const handleLocationClick = () => {
    // 장소 선택 모달 또는 페이지로 이동
    console.log('장소 추가 클릭');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    // 게시글 작성 로직
    console.log('게시글 작성:', { content, images });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <HeaderBar 
        variant="posting" 
        onBack={handleBackClick}
        onRegister={handleSubmit}
        isAvailable={isAvailable}
      />
      
      {/* 메인 콘텐츠 */}
      <main className="pt-header-default px-4 py-6">
        {/* 제목 입력 */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full text-lg font-medium text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-0"
          />
          <div className="h-px bg-gray-200 mt-2"></div>
        </div>
        
        {/* 장소 추가 */}
        <div className="mb-6">
          <button
            onClick={handleLocationClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LocationIcon size="sm" variant="blurred" />
            <span className="text-gray-6 text-sm font-medium font-['Pretendard'] leading-tight pt-1">장소 추가</span>
          </button>
        </div>
        
        {/* 내용 입력 */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요."
            className="w-full h-64 text-gray-6 text-sm font-normal font-['Pretendard'] leading-normal placeholder-gray-400 border-none outline-none focus:ring-0 resize-none"
          />
        </div>
      </main>
    </div>
  );
};

export default PostingPage;
