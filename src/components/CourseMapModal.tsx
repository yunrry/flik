import React, { useEffect, useRef } from 'react';
import DaySpots from './Layout/DaySpots';
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

interface CourseMapModalProps {
  dayDetails: any[];
  isOpen: boolean;
  onClose: () => void;
}

const CourseMapModal: React.FC<CourseMapModalProps> = ({ dayDetails, isOpen, onClose }) => {
  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const kakaoMapRefs = useRef<any[]>([]);
  const handleDragEnd = (result: any) => {
    console.log(result);
    // 위치 변경 로직 추가 가능
  };
  // 카카오맵 초기화 로직 (CourseMapPage에서 복사)
  useEffect(() => {
    if (!isOpen || !window.kakao) return;

    dayDetails.forEach((dayData: any, idx: number) => {
      if (!mapRefs.current[idx] || !dayData.spots?.length) return;

      const firstSpot = dayData.spots[0];
      const mapCenter = new window.kakao.maps.LatLng(firstSpot.latitude, firstSpot.longitude);

      const map = new window.kakao.maps.Map(mapRefs.current[idx], {
        center: mapCenter,
        level: 7
      });

      kakaoMapRefs.current[idx] = map;

      // 마커와 경로 추가 로직...
      const bounds = new window.kakao.maps.LatLngBounds();
      const linePath: any[] = [];

      dayData.spots.forEach((spot: any, index: number) => {
        const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);
        
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
        bounds.extend(position);
        linePath.push(position);
      });

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

      map.setBounds(bounds);
    });

    return () => {
      // cleanup
    };
  }, [dayDetails, isOpen]);

  if (!isOpen) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full h-full bg-white">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100"
        >
          <span className="text-gray-700 text-xl">✕</span>
        </button>
        
        <div className="w-full h-full overflow-y-auto">
          {dayDetails.map((dayData: any, idx: number) => (
            <div key={dayData.day} className="mb-8">
              <div ref={(el) => { mapRefs.current[idx] = el; }} className="w-full h-80" />
              <div className="px-4 pt-4">
                <h3 className="font-medium text-gray-800">Day {dayData.day}</h3>
                <DaySpots dayData={dayData} isEditing={false} onDeleteSpot={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>    
    </DragDropContext>
  );
};

export default CourseMapModal;
