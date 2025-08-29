import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';

const PostingPage: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);

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
      />
      
      {/* 메인 콘텐츠 */}
      <main className="pt-header-default px-4 py-6">
        {/* 텍스트 입력 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="맛집에 대한 이야기를 작성해보세요..."
          className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-main-1"
        />
        
        {/* 이미지 업로드 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 추가
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              이미지를 클릭하여 업로드하세요
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostingPage;
