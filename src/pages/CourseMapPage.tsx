// src/pages/CourseMapPage.tsx
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import DaySpots from '../components/Layout/DaySpots';
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import SpotCard from '../components/Feed/SpotCard';


const CourseMapPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // CoursePage에서 넘어온 데이터
  const courseData = location.state?.courseData;
  const dayDetails = location.state?.dayDetails || [];
  const isEditing = location.state?.isEditing || false; // 편집 상태 받기
  const courseId = location.state?.courseId; // courseId 받기

  const mapRefs = useRef<(HTMLDivElement | null)[]>([]); // Day별 지도 Ref
  const kakaoMapRefs = useRef<any[]>([]); // Day별 카카오맵 객체 Ref

  console.log('CourseMapPage isEditing:', isEditing);

    const handleDragEnd = (result: any) => {
      console.log(result);
      // 위치 변경 로직 추가 가능
    };

  // 카카오맵 초기화
  useEffect(() => {
    if (!window.kakao) return;

    dayDetails.forEach((dayData: any, idx: number) => {
      if (!mapRefs.current[idx] || !dayData.spots?.length) return;

      const firstSpot = dayData.spots[0];
      const mapCenter = new window.kakao.maps.LatLng(firstSpot.latitude, firstSpot.longitude);

      const map = new window.kakao.maps.Map(mapRefs.current[idx], {
        center: mapCenter,
        level: 7
      });

      kakaoMapRefs.current[idx] = map;

      // 마커와 경로 추가
      const bounds = new window.kakao.maps.LatLngBounds();
      const linePath: any[] = [];

      dayData.spots.forEach((spot: any, index: number) => {
        const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);

        // 마커 생성 (Day + 순번)
        const marker = new window.kakao.maps.Marker({
          position,
          map,
        });

        // 커스텀 오버레이 (Day + index)
        const content = `
          <div style="background:#38b2ac;color:white;padding:5px 8px;border-radius:50%;font-size:12px;text-align:center;">
            ${index + 1}
          </div>
        `;
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1
        });
        customOverlay.setMap(map);
        marker.setMap(null);
        bounds.extend(position);
        linePath.push(position);
      });

      // Polyline (스팟들을 연결)
      if (linePath.length > 1) {
        const polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 3,
          strokeColor: '#555555',
          strokeOpacity: 0.9,
          strokeStyle: 'shortdash'
        });
        polyline.setMap(map);
      }

      // 모든 마커가 보이도록 지도 범위 조정
      map.setBounds(bounds);
    });
  }, [dayDetails]);

  const handleBackClick = () => {
    navigate(`/course/${courseId}`, {
      state: {
        courseId: courseId,
        courseData: courseData,
        dayDetails: dayDetails,
        keepEditing: isEditing, // 편집 상태를 keepEditing으로 전달
      }
    });
  };


  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <div className="h-screen bg-white flex flex-col items-center"> 
        <main className="flex flex-col w-full lg:w-[60%]">
      {/* 헤더 */}
        {/* 닫기(X) 버튼 */}
        <button
                onClick={() => handleBackClick()}
                className="absolute  z-50 top-[3%] left-[3%] lg:left-[22%] w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700 text-lg font-bold">X</span>
              </button>
      {/* 본문 */}
      <div className="flex-1 overflow-y-auto">
        {dayDetails.map((dayData: any, idx: number) => (
          <div key={dayData.day} className="mb-8">
 

            {/* 카카오맵 */}
            <div
              ref={(el) => {
                mapRefs.current[idx] = el; // void 처리
              }}
              className="w-full h-80"
            />

              <div className="px-4 pt-4">
                <h3 className="font-medium text-gray-800">Day {dayData.day}</h3>

                {/* 스팟 목록 */}
                <DaySpots
                  dayData={dayData}
                  isEditing={false}
                  onDeleteSpot={() => {}}
                />

                </div>
          </div>
        ))}
      </div>
      </main>
    </div>
    </DragDropContext>
  );
};

export default CourseMapPage;
