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
import { TravelCourse } from '../types/travelCourse.type';


const PostingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // 이미지 미리보기용 URL
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가
    
  // location-select에서 전달받은 장소 정보
  const [selectedLocations, setSelectedLocations] = useState<SpotDetail[]>(
    location.state?.selectedLocations || []
  );

  const [selectedCourse, setSelectedCourse] = useState<TravelCourse | null>(
    location.state?.selectedCourse || null
  );

  // location-select에서 돌아올 때 편집 내용 복원
  useEffect(() => {
    if (location.state) {
      // 장소 정보 복원
      if (location.state.selectedLocation) {
        setSelectedLocations(location.state.selectedLocations);
      }
      if (location.state.selectedCourse) {
        setSelectedCourse(location.state.selectedCourse);
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
        currentLocations: selectedLocations, 
        title: title,
        content: content,
        images: images,
        returnPath: '/posting'
      }
    });
  };

    // 장소 삭제 함수 추가
    const handleLocationDelete = (index: number) => {
      setSelectedLocations(prev => prev.filter((_, i) => i !== index));
    };

  // 코스 선택 페이지로 이동
  const handleCourseClick = () => {
    navigate('/savedCourses', { // 또는 코스 목록 페이지 경로
      state: { 
        currentLocations: selectedLocations,
        currentCourse: selectedCourse,
        title,
        content,
        images,
        returnPath: '/posting',
      }
    });
  };

  // 코스 삭제
  const handleCourseDelete = () => {
    setSelectedCourse(null);
  };

  const handleBackClick = () => {
    navigate('/my');
  };

  // relatedSpotIds 생성 로직
const getRelatedSpotIds = (): number[] => {
  const spotIds = selectedLocations?.map(location => location.id) || [];
  
  if (selectedCourse) {
    // 코스의 모든 슬롯에서 selectedSpotId 추출 (null 제외)
    const courseSpotIds = selectedCourse.courseSlots
      .flat() // 2차원 배열을 1차원으로 변환
      .map(slot => slot.selectedSpotId)
      .filter((id): id is number => id !== null); // null 제거 및 타입 가드
    
    return [...spotIds, ...courseSpotIds];
  }
  
  return spotIds;
};

  // 게시글 등록
  const handleSubmit = async () => {
    if (isLoading) return; // ✅ 중복 클릭 방지
    setIsLoading(true);

    try {
      // 1) Cloudinary에 이미지 업로드
      console.log('Cloudinary 업로드 시작...');
      const uploadedImageUrls = await uploadToCloudinary(images);
      console.log('Cloudinary 업로드 완료:', uploadedImageUrls);
  
      // 2) 서버에 전달할 데이터 생성
      const requestData = {
        title,
        content,
        type: 'review',
        imageUrl: uploadedImageUrls,
        spotIds: selectedLocations?.map(location => location.id) ?? undefined,
        relatedSpotIds: getRelatedSpotIds(),
        regionCode: selectedLocations?.[0]?.regionCode || selectedCourse?.regionCode || '', // 수정
        courseId: selectedCourse?.id ?? undefined,
      };
  
      console.log('게시글 작성 요청 데이터:', requestData);
  
      // 3) 게시글 생성 API 호출
      const response = await createPost(requestData);
      console.log('게시글 작성 완료:', response);
  
      // 4) 성공 시 이동
      navigate('/my');
    } catch (error) {
      console.error('게시글 작성 중 오류 발생:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 제출 버튼 활성화 여부 체크
// 제출 버튼 활성화 (장소 또는 코스 중 하나는 필수)
useEffect(() => {
  if ((selectedLocations.length > 0 || selectedCourse) && title.trim() && content.trim()) {
    setIsSubmitEnabled(true);
  } else {
    setIsSubmitEnabled(false);
  }
}, [selectedLocations, selectedCourse, title, content]);

  // 컴포넌트 언마운트 시 이미지 URL 정리
  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      {/* 헤더 */}
      <HeaderBar 
        variant="posting" 
        onBack={handleBackClick}
        onRegister={handleSubmit}
        isAvailable={isSubmitEnabled && !isLoading} // ✅ 로딩 중엔 비활성화
      />
      
      {/* 메인 콘텐츠 */}
      <main className={`pt-header-default px-4 py-6 mt-[5%] flex flex-col min-h-screen ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
        {/* 제목 입력 */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            disabled={isLoading}
            className="w-full text-lg font-medium text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-0"
          />
          <div className="h-px bg-gray-200 mt-2"></div>
        </div>
        
        {/* 장소 추가 */}
        <div className="mb-2 space-y-2">
          {selectedLocations.length > 0 ? (
            <>
              {selectedLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center">
                      {location.imageUrls?.[0] ? (
                        <img 
                          src={location.imageUrls[0]} 
                          alt={location.name}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-gray-9 text-[10px] font-normal">
                        {translateCategory(location.category)} · {formatAddress(location.address || '')}
                      </div>
                      <div className="text-gray-3 text-base font-semibold pt-1.5">
                        {location.name}
                      </div>
                    </div>
                  </div>

                  {!isLoading && (
                    <button
                      onClick={() => handleLocationDelete(index)}
                      className="text-red-500 text-xs px-2"
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))}
              
              {/* 장소 추가 버튼 */}
              <button
                onClick={handleLocationClick}
                disabled={isLoading}
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 py-2"
              >
                <span className="text-sm">+ 장소 추가</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLocationClick}
              disabled={isLoading}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <LocationIcon size="sm" variant="blurred" />
              <span className="text-gray-6 text-sm font-medium pt-1">
                장소 추가
              </span>
            </button>
          )}
        </div>


        {/* 코스 선택 */}
        <div className="mb-4">
          {selectedCourse ? (
            <div className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-200 rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 text-xs">{selectedCourse.days-1}박{selectedCourse.days}일</span>
                </div>
                
                <div>
                  <div className="text-blue-600 text-[10px] font-normal">
                    코스 · {selectedCourse.filledSlots}개 장소
                  </div>
                  <div className="text-gray-3 text-base font-semibold pt-1.5">
                    {selectedCourse.selectedCategories.join('/')} 코스
                  </div>
                </div>
              </div>

              {!isLoading && (
                <button
                  onClick={handleCourseDelete}
                  className="text-red-500 text-xs px-2"
                >
                  삭제
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleCourseClick}
              disabled={isLoading}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <span className="text-gray-6 text-sm font-medium">+ 코스 추가</span>
            </button>
          )}
        </div>
        
        {/* 이미지 미리보기 */}
        <div className="mb-6">
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-1 gap-2 mb-4 p-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`이미지 ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {!isLoading && (
                    <button
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  )}
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
            disabled={isLoading}
            className="w-full h-48 text-gray-6 text-sm font-normal leading-normal placeholder-gray-400 border-none outline-none focus:ring-0 resize-none"
          />
        </div>

        {/* 이미지 업로드 버튼 */}
        <div className="mb-6 flex items-end bottom-0">
          {images.length < 5 && !isLoading && (
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

      {/* ✅ 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default PostingPage;
