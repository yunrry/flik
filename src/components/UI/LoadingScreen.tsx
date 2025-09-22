import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "AI가 당신만의 히든 플레이스를 수집하는 중\n잠시만 기다려주세요!" 
}) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      {/* 로딩 이미지/일러스트 */}
      <div className="mb-8">
        <div className="w-64 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* 차트/그래프 일러스트 */}
          <div className="absolute inset-4 bg-white rounded opacity-90">
            <div className="p-4 h-full relative">
              {/* 인물 */}
              <div className="absolute bottom-4 left-8 w-8 h-12 bg-orange-500 rounded-t-full"></div>
              <div className="absolute bottom-12 left-9 w-6 h-6 bg-orange-400 rounded-full"></div>
              
              {/* 차트 바들 */}
              <div className="absolute right-8 bottom-4 flex items-end space-x-1">
                <div className="w-3 h-8 bg-gray-300 rounded-t"></div>
                <div className="w-3 h-12 bg-blue-400 rounded-t"></div>
                <div className="w-3 h-6 bg-gray-300 rounded-t"></div>
                <div className="w-3 h-16 bg-blue-500 rounded-t"></div>
              </div>
              
              {/* 연결선 */}
              <div className="absolute top-8 left-12 w-16 h-px bg-orange-400"></div>
              <div className="absolute top-8 left-12 w-px h-8 bg-orange-400"></div>
              
              {/* 포인트들 */}
              <div className="absolute top-6 left-16 w-4 h-4 bg-orange-500 rounded-full"></div>
              <div className="absolute top-12 right-16 w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 로딩 스피너 */}
      <div className="mb-6">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      
      {/* 메시지 */}
      <div className="text-center px-8">
        <p className="text-gray-800 text-lg font-medium whitespace-pre-line leading-relaxed">
          {message}
        </p>
      </div>
      
      {/* 하단 홈 인디케이터 (iOS 스타일) */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;