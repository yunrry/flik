import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import LocationIcon from '../components/Icons/LocationIcon';
import { ImageIcon } from '../components/Icons/SvgIcons';
import { SpotDetail } from '../types/spot.types';
import { translateCategory } from '../utils/categoryMapper';
import { formatAddress } from '../utils/formater';
import { createPost } from '../api/postApi';
import { uploadToCloudinary } from '../utils/cloudinary';

const PostingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // 이미지 미리보기용 URL
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [title, setTitle] = useState('');
    
  // location-select에서 전달받은 장소 정보
  const [selectedLocation, setSelectedLocation] = useState<SpotDetail | null>(
    location.state?.selectedLocation || null
  );

  // location-select에서 돌아올 때 편집 내용 복원
  useEffect(() => {
    if (location.state) {
      // 장소 정보 복원
      if (location.state.selectedLocation) {
        setSelectedLocation(location.state.selectedLocation);
      }
      
      // 편집 내용 복원
      if (location.state.title !== undefined) {
        setTitle(location.state.title);
      }
      if (location.state.content !== undefined) {
        setContent(location.state.content);
      }
      if (location.state.images !== undefined) {
        setImages(location.state.images);
        // 이미지 URL도 복원
        const urls = location.state.images.map((file: File) => URL.createObjectURL(file));
        setImageUrls(urls);
      }
    }
  }, [location.state]);

  // 이미지 업로드 처리
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: File[] = [];
    const newImageUrls: string[] = [];

    // 최대 5개 이미지 제한
    const maxImages = 5;
    const currentCount = images.length;
    
    for (let i = 0; i < Math.min(files.length, maxImages - currentCount); i++) {
      const file = files[i];
      
      // 이미지 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        continue;
      }
      
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        continue;
      }

      newImages.push(file);
      newImageUrls.push(URL.createObjectURL(file));
    }

    setImages(prev => [...prev, ...newImages]);
    setImageUrls(prev => [...prev, ...newImageUrls]);

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 삭제
  const handleImageDelete = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]); // 메모리 누수 방지
      return newUrls.filter((_, i) => i !== index);
    });
  };

  // 이미지 업로드 버튼 클릭
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLocationClick = () => {
    // 장소 선택 페이지로 이동하면서 현재 편집 내용 전달
    navigate('/search', {
      state: { 
        currentLocation: selectedLocation,
        title: title,
        content: content,
        images: images,
        returnPath: '/posting'
      }
    });
  };

  const handleBackClick = () => {
    navigate('/my');
  };


  const handleSubmit = async () => {
    try {
      // 1) Cloudinary에 이미지 업로드
      console.log('Cloudinary 업로드 시작...');
      const uploadedImageUrls = await uploadToCloudinary(images);
      console.log('Cloudinary 업로드 완료:', uploadedImageUrls);
  
      // 2) 서버에 전달할 데이터 생성
      const requestData = {
        title,
        content,
        type: 'review', // 서버에서 정의한 타입 코드
        imageUrl: uploadedImageUrls, // 변환된 URL 배열
        spotId: selectedLocation?.id ?? undefined,
        courseId: undefined, // 코스가 있을 때만 값 설정
      };
  
      console.log('게시글 작성 요청 데이터:', requestData);
  
      // 3) 게시글 생성 API 호출
      const response = await createPost(requestData);
      console.log('게시글 작성 완료:', response);
  
      // 4) 성공 시 이동
      navigate('/my');
    } catch (error) {
      console.error('게시글 작성 중 오류 발생:', error);
    }
  };

  // 제출 버튼 활성화 여부 체크
  useEffect(() => {
    if (selectedLocation && title.trim() && content.trim()) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [selectedLocation, title, content]);

  // 컴포넌트 언마운트 시 이미지 URL 정리
  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
      <main className="pt-header-default px-4 py-6 mt-[5%] flex flex-col min-h-screen">
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
        <div className="mb-2">
          {selectedLocation ? (
            // 선택된 장소가 있을 때: 이미지와 같은 레이아웃
            <div 
        
            className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {/* 왼쪽: 이미지 + 정보 */}
            <div className="flex items-center space-x-3">
              {/* 플레이스홀더 이미지 */}
              <div className="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center">
                {selectedLocation.imageUrls ? (
                  <img 
                    src={selectedLocation.imageUrls[0]} 
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover rounded-sm"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                )}
              </div>
              
              {/* 매장 정보 */}
              <div>
              <div className="text-gray-9 text-[10px] font-normal font-['Pretendard'] leading-3">
                  {translateCategory(selectedLocation.category)} · {formatAddress(selectedLocation.address || '')}
                </div>
                <div className="text-gray-3 text-base font-semibold font-['Pretendard'] leading-normal pt-1.5">
                  {selectedLocation.name}
                </div>
    
              </div>
            </div>

            {/* 오른쪽: 선택 버튼 */}
            <button
              onClick={() => handleLocationClick()}
              className="w-11 h-7 p-0.5 inline-flex flex-col justify-center items-center gap-2.5"
            >
              <text className="text-center justify-start text-gray-6 text-xs font-semibold font-['Pretendard'] leading-normal">변경</text>
            </button>
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
        
        <div className="mb-6">
          {/* 이미지 미리보기 */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-1 gap-2 mb-4 p-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`이미지 ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleImageDelete(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          </div>

        {/* 내용 입력 */}
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요."
            className="w-full h-48 text-gray-6 text-sm font-normal font-['Pretendard'] leading-normal placeholder-gray-400 border-none outline-none focus:ring-0 resize-none"
          />
        </div>

        {/* 이미지 업로드 영역 */}
        
        <div className="mb-6 flex items-end bottom-0">
          {/* 이미지 업로드 버튼 */}
          {images.length < 5 && (
            <button
              onClick={handleImageUploadClick}
             className="fixed bottom-[5%] left-4 z-40 w-12 h-12 bg-white flex items-center justify-center text-gray-500 hover:border-main-1 hover:text-main-1 transition-colors"
            >
              <ImageIcon size="xl" />
              
            </button>
          )}
        </div>
      </main>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default PostingPage;
