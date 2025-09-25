import React, { useEffect, useState } from 'react';
import { HeaderBar } from '../components/Layout';
import FlikCardLayout from '../components/Layout/FlikCardLayout';
import { Spot } from '../types/spot.types';
import { getRandomSpots } from '../api/flikCardsApi';

const FlikPage: React.FC = () => {
  const [spots, setSpots] = useState<Spot[]>([]); // FlikCardLayout에 전달할 전체 스팟 목록
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const [page, setPage] = useState<number>(1); // 현재 페이지
  const [hasNext, setHasNext] = useState<boolean>(true); // 다음 페이지 존재 여부
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태

  // 첫 로드 시 1페이지 데이터 가져오기
  useEffect(() => {
    fetchRandomSpots(page);
  }, []);

  // 랜덤 스팟 조회 함수
  const fetchRandomSpots = async (pageToFetch: number) => {
    if (isLoading || !hasNext) return; // 중복 요청 방지
    setIsLoading(true);
    console.log('API 호출 시작: page', pageToFetch);
    try {
      const data = await getRandomSpots(pageToFetch);
      console.log('API 응답:', data); // ✅ 응답 확인
      setSpots(prev => [...prev, ...data.spots]); // 기존 + 신규 데이터 합치기
      setHasNext(data.hasNext); // 다음 페이지 존재 여부 업데이트
    } catch (error) {
      console.error('랜덤 스팟 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 카드 저장 시 부모 state 업데이트
  const handleSave = (spots: Spot[]) => {
    setSavedSpots(spots);
    console.log('저장된 장소들:', spots);
  };

  // 모든 카드를 다 본 경우 -> 다음 페이지 호출
  const handleFinished = () => {
    console.log('모든 맛집을 확인했습니다.');
    if (hasNext && !isLoading) {
      setPage(prev => prev + 1); // 여기서만 페이지 증가
    }
  };

  return (
    <div className="h-screen-mobile overflow-hidden bg-gray-50  flex flex-col">
      {/* 헤더 */}
      <HeaderBar variant="logo" />

      {/* 메인 콘텐츠 */}
      <main className="pt-header-light w-full sm:max-w-7xl sm:mx-auto px-0 sm:px-2 lg:px-8 flex flex-col flex-1 overflow-hidden">
        {/* 위치 선택 영역 */}
        {/* <div className="flex items-center justify-between h-12 sm:mb-2 xs:mb-0 xs:pt-0 sm:pt-[1%] flex-shrink-0"> */}
          {/* 위치 선택 UI 필요시 추가 */}
        {/* </div> */}

        {/* FlikCardLayout 영역 */}
        <div className="w-full flik-card-adaptive overflow-hidden flex-1 pt-[10%] pb-[5%] flex items-center justify-center">
          <div className="xs:w-[80%] sm:w-[98%] smTomd:w-[60%] lg:w-[40%]     h-full">
            <FlikCardLayout
              spots={spots}
              onSave={handleSave}
              onFinished={handleFinished}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlikPage;
