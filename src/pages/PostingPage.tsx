import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import LocationIcon from '../components/Icons/LocationIcon';
import { Restaurant } from '../types/restaurant.types';

const PostingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [title, setTitle] = useState('');
    
  // location-select에서 전달받은 장소 정보
  const [selectedLocation, setSelectedLocation] = useState<Restaurant | null>(
    location.state?.selectedLocation || null
  );

  const handleLocationClick = () => {
    // 장소 선택 페이지로 이동하면서 현재 선택된 장소 정보 전달
    navigate('/location-select', {
      state: { 
        currentLocation: selectedLocation, images, content, title,
        returnPath: '/posting'
      }
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    // 게시글 작성 로직
    console.log('게시글 작성:', { title, content, selectedLocation, images });
    navigate('/my');
  };


  useEffect(() => {
    if (selectedLocation && title.trim() && content.trim()) {
      setIsSubmitEnabled(true);
    } 
  }, [selectedLocation, title, content]);



  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <HeaderBar 
        variant="posting" 
        onBack={handleBackClick}
        onRegister={handleSubmit}
        isAvailable={isSubmitEnabled}
      />
      
      {/* 메인 콘텐츠 */}
      <main className="pt-header-default px-4 py-6 mt-[5%]">
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
          {selectedLocation ? (
            // 선택된 장소가 있을 때: 이미지와 같은 레이아웃
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <LocationIcon size="sm" variant="filled" className="text-white" />
                <div className="flex-1">
                  <p className="text-sm text-gray-300 font-medium">
                    {selectedLocation.category || '음식점'} · {selectedLocation.location || selectedLocation.address}
                  </p>
                  <p className="text-lg font-semibold text-white mt-1">
                    {selectedLocation.name}
                  </p>
                </div>
                <button
                  onClick={handleLocationClick}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  변경
                </button>
              </div>
            </div>
          ) : (
            // 선택된 장소가 없을 때: 기존 장소 추가 버튼
            <button
              onClick={handleLocationClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LocationIcon size="sm" variant="blurred" />
              <span className="text-gray-6 text-sm font-medium font-['Pretendard'] leading-tight pt-1">
                장소 추가
              </span>
            </button>
          )}
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
