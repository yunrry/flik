// src/pages/PostEditPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import { ImageIcon } from '../components/Icons/SvgIcons';
import CourseCard from '../components/Feed/CourseCard';
import { translateCategory } from '../utils/categoryMapper';
import { getRegionName } from '../types/sigungu.types';
import { getPostById, updatePost } from '../api/postApi';
import { mapApiToPost, Post } from '../types/post.types';
import { uploadToCloudinary } from '../utils/cloudinary';

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams<{ postId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postMeta, setPostMeta] = useState<{
   spots: Post['spots'];
   course: Post['course'];
    }>({ spots: null, course: null });

  // 기존 이미지 URL들(서버에 이미 존재)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  // 새로 추가한 파일들(Cloudinary 업로드 대상)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  // 미리보기용 URL(기존+새로 추가)
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // 초기 데이터 로드 (location.state.postData 우선, 없으면 API)
  useEffect(() => {
    const init = async () => {
      if (!postId) return;
      // location.state?.postData 가 있으면 그걸로 초기화
      const statePost: Post | undefined = location.state?.postData;
      if (statePost) {
        hydrateFromPost(statePost);
        return;
      }
      // 없으면 API 조회
      try {
        setIsLoading(true);
        const res = await getPostById(postId);
        if (res?.data) {
          const mapped = mapApiToPost(res.data);
          hydrateFromPost(mapped);
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
    // cleanup: 새로 추가한 파일 미리보기 revoke
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const hydrateFromPost = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setExistingImageUrls(post.imageUrls || []);
    setPreviewUrls(post.imageUrls || []);
    + setPostMeta({ spots: post.spots, course: post.course });
  };

  // 이미지 추가
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const appendedFiles: File[] = [];
    const appendedPreview: string[] = [];

    // 최대 5장 제한: 기존 + 신규 합산
    const maxImages = 5;
    const currentCount = existingImageUrls.length + newFiles.length;

    for (let i = 0; i < files.length && currentCount + appendedFiles.length < maxImages; i++) {
      const f = files[i];
      if (!f.type.startsWith('image/')) continue;
      if (f.size > 5 * 1024 * 1024) continue; // 5MB 제한
      appendedFiles.push(f);
      appendedPreview.push(URL.createObjectURL(f));
    }

    setNewFiles((prev) => [...prev, ...appendedFiles]);
    setPreviewUrls((prev) => [...prev, ...appendedPreview]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 이미지 삭제 (인덱스 기준으로 기존/신규 구분)
  const handleImageDelete = (index: number) => {
    const totalExisting = existingImageUrls.length;

    // 기존 이미지 제거
    if (index < totalExisting) {
      const nextExisting = existingImageUrls.filter((_, i) => i !== index);
      setExistingImageUrls(nextExisting);
    } else {
      // 신규 이미지 제거
      const newIndex = index - totalExisting;
      const nextFiles = newFiles.filter((_, i) => i !== newIndex);
      const removedUrl = previewUrls[index];
      if (removedUrl?.startsWith('blob:')) URL.revokeObjectURL(removedUrl);
      setNewFiles(nextFiles);
    }

    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // 등록(수정 저장)
  const handleSubmit = async () => {
    if (!postId) return;
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 새 파일이 있으면 업로드 → URL 병합
      let finalImageUrls = existingImageUrls;
      if (newFiles.length > 0) {
        const uploaded = await uploadToCloudinary(newFiles);
        finalImageUrls = [...existingImageUrls, ...uploaded];
      }

      await updatePost(Number(postId), {
        title,
        content,
        imageUrl: finalImageUrls,
      });

      navigate(`/post/${postId}`, { replace: true });
    } catch {
      alert('수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitEnabled = !!title.trim() && !!content.trim() && !isLoading;

  return (
    <div className="min-h-screen bg-white relative">
      <HeaderBar
        variant="posting"
        onBack={handleBackClick}
        onRegister={handleSubmit}
        isAvailable={isSubmitEnabled}
      />

      <main className={`pt-header-default px-4 py-6 mt-[5%] flex flex-col min-h-screen ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
        {/* 제목 */}
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

       {/* 코스 카드 (읽기전용 표시) */}
     {postMeta.course?.courseId && (
       <div className="mb-4">
         <CourseCard
           course={{
             id: postMeta.course.courseId,
             userId: 0,
             days: postMeta.course.dayCount,
             regionCode: postMeta.course.regionCode,
             totalDistance: 0,
             courseSlots: [],
             createdAt: '',
             courseType: '',
             totalSlots: postMeta.course.spotCount,
             filledSlots: postMeta.course.spotCount,
             selectedCategories: postMeta.course.categories,
             isPublic: true
           }}
         />
       </div>
     )}

     {/* 장소 목록 (읽기전용 표시) */}
     {postMeta.spots && postMeta.spots.length > 0 && (
       <div className="mb-4 space-y-2">
         {postMeta.spots.map((spot, index) => (
           <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
             <div className="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center mr-3">
               {spot.imageUrl ? (
                 <img
                   src={spot.imageUrl}
                   alt={spot.name}
                   className="w-full h-full object-cover rounded-sm"
                 />
               ) : (
                 <div className="w-6 h-6 bg-gray-300 rounded"></div>
               )}
             </div>
             <div className="flex-1">
               <div className="text-gray-500 text-xs">
                 {translateCategory(spot.category)} • {getRegionName(spot.regionCode)}
               </div>
               <div className="text-gray-900 font-medium text-sm">
                 {spot.name}
               </div>
             </div>
           </div>
         ))}
       </div>
     )}

        {/* 이미지 프리뷰 */}
        {previewUrls.length > 0 && (
          <div className="mb-1">
            <div className="grid grid-cols-1 gap-2 mb-4 p-4">
              {previewUrls.map((url, index) => (
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
          </div>
        )}

        {/* 내용 */}
        <div className="mt-4 mb-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요."
            disabled={isLoading}
            className="w-full h-48 text-gray-6 text-sm font-normal leading-normal placeholder-gray-400 border-none outline-none focus:ring-0 resize-none"
          />
        </div>

        {/* 하단 툴바 */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-safe-bottom flex items-center justify-start space-x-4 pb-8 z-50">
          <button
            onClick={handleImageUploadClick}
            disabled={isLoading || existingImageUrls.length + newFiles.length >= 5}
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-gray-800"
          >
            <ImageIcon size="lg" />
          </button>
        </footer>
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

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default PostEditPage;