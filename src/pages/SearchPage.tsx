import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSpotsUserSaved } from '../api/flikCardsApi';
import { SpotDetail } from '../types/spot.types';
import { translateCategory } from '../utils/categoryMapper';
import { formatAddress } from '../utils/formater';
import SearchHeader from '../components/Layout/SearchHeader';
import { searchSpots } from '../api/flikCardsApi';

// 타입 정의
interface spot {
  id: number;
  name: string;
  category: string;
  location: string;
  imageUrl?: string;
}

interface SavedspotsResponse {
  data: spot[];
}

interface SearchResponse {
  data: spot[];
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [savedSpots, setSavedSpots] = useState<SpotDetail[]>([]);
  const [searchResults, setSearchResults] = useState<SpotDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // PostingPage에서 전달받은 현재 선택된 장소
  const currentLocations = location.state?.currentLocations as SpotDetail[];
  const images = location.state?.images as File[];
  const content = location.state?.content as string;
  const title = location.state?.title as string;
  const selectedDay = location.state?.selectedDay;
  const isEditing = location.state?.isEditing;
  const courseData = location.state?.courseData;
  const returnPath = location.state?.returnPath || '/search';
  const currentCourse = location.state?.currentCourse;
  const source = location.state?.source; // 어디서 왔는지 확인
  const from = location.state?.from;

  const handleBack = () => {
    navigate(returnPath);
  };

  const handleLocationSelect = (selectedLocation: SpotDetail) => {
    const updatedLocations = [...(currentLocations || []), selectedLocation];
  
    if (source === 'course') {
      // CoursePage에서 온 요청
      navigate(returnPath, {
        state: {
          addedSpot: selectedLocation,
          selectedDay: selectedDay,
          source: 'course',
          isEditing: isEditing,
          courseData: courseData,
          from: from
        },
      });
    } else {
      // 기존 PostingPage 요청
      navigate(returnPath, {
        state: { 
          selectedLocations: updatedLocations,
          selectedCourse: currentCourse,
          images, 
          content, 
          title 
        }
      });
    }
  };

  // 저장한 곳 데이터 가져오기
  const fetchSavedspots = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // API 요청 (실제 엔드포인트로 변경 필요)
      const result = await getSpotsUserSaved();
      
 
      setSavedSpots(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('저장한 곳 조회 오류:', err);
      
      // 개발용 더미 데이터 (실제 배포시 제거)
      setSavedSpots([
        {
          id: 1,
          name: '마리오네',
          category: '이탈리아 음식',
          address: '서울 성동구'
        },
        {
          id: 2,
          name: '블루보틀 코피',
          category: '카페',
          address: '서울 강남구'
        },
        {
          id: 3,
          name: '스시 하나미',
          category: '일식',
          address: '서울 중구'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 검색 API 요청
  const searchspots = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
  
      const result = await searchSpots(query);
  
      if (result.success) {
        // 백엔드 응답에서 SpotDetail 리스트 추출
        setSearchResults(result.data.spots);
      } else {
        throw new Error(result.message || '검색에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
      console.error('검색 오류:', err);
  
      // // 개발용 더미 데이터
      // setSearchResults([
      //   {
      //     id: 101,
      //     name: `${query} 관련 장소 1`,
      //     category: '음식점',
      //     location: '서울시'
      //   },
      //   {
      //     id: 102,
      //     name: `${query} 관련 장소 2`,
      //     category: '카페',
      //     location: '서울시'
      //   }
      // ]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트시 저장한 곳 데이터 가져오기
  useEffect(() => {
    fetchSavedspots();
  }, []);

  // 검색어 변경시 검색 실행 (디바운싱)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        searchspots(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);




  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // 현재 보여줄 데이터 결정
  const currentSpots: SpotDetail[] = searchTerm.trim() ? searchResults : savedSpots;
  const currentTitle: string = searchTerm.trim() ? '검색 결과' : '저장한 곳';

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 */}
      <SearchHeader
        handleBack={handleBack}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <main className="pt-header-search w-full flex-1 px-4 lg:px-8 py-6 bg-white">

      {/* 검색 결과/저장한 곳 섹션 */}
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-gray-1 text-base font-semibold font-['Pretendard'] leading-normal">{currentTitle}</h2>
          {searchTerm.trim() && (
            <span className="text-sm text-gray-500">
              {searchResults.length}개 결과
            </span>
          )}
        </div>
        
        {/* 에러 메시지 */}
        {/* {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )} */}
        
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {/* 결과 리스트 */}
        {!loading && currentSpots.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm.trim() ? '검색 결과가 없습니다.' : '저장한 곳이 없습니다.'}
            </p>
          </div>
        )}
        
        {!loading && currentSpots.length > 0 && (
          <div className="space-y-3">
            {currentSpots.map((spot) => (
              <div 
                key={spot.id}
                className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {/* 왼쪽: 이미지 + 정보 */}
                <div className="flex items-center space-x-3">
                  {/* 플레이스홀더 이미지 */}
                  <div className="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center">
                    {spot.imageUrls ? (
                      <img 
                        src={spot.imageUrls[0]} 
                        alt={spot.name}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    )}
                  </div>
                  
                  {/* 매장 정보 */}
                  <div>
                  <div className="text-gray-9 text-[10px] font-normal font-['Pretendard'] leading-3">
                      {translateCategory(spot.category)} · {formatAddress(spot.address || '')}
                    </div>
                    <div className="text-gray-3 text-base font-semibold font-['Pretendard'] leading-normal pt-1.5">
                      {spot.name}
                    </div>
        
                  </div>
                </div>

                {/* 오른쪽: 선택 버튼 */}
                <button
                  onClick={() => handleLocationSelect(spot)}
                  className="w-11 h-7 p-0.5 bg-gray-8 rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
                >
                  <text className="text-center justify-start text-gray-3 text-xs font-semibold font-['Pretendard'] leading-normal">선택</text>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 홈 인디케이터 (iOS 스타일) */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
      </div>

    </main>
    </div>
  );
};

export default SearchPage;