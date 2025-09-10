// src/contexts/KakaoMapProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getKakaoJavaScriptKey } from '../utils/env';

interface KakaoMapContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  kakao: any; // window.kakao
}

const KakaoMapContext = createContext<KakaoMapContextType | null>(null);

interface KakaoMapProviderProps {
  children: React.ReactNode;
}

export const KakaoMapProvider: React.FC<KakaoMapProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kakao, setKakao] = useState<any>(null);

  useEffect(() => {
    const loadSDK = async () => {
      // 이미 로드된 경우
      if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
        setKakao(window.kakao);
        setIsLoaded(true);
        return;
      }

      // 이미 로딩 중인 경우
      if (isLoading) return;

      try {
        setIsLoading(true);
        setError(null);

        const kakaoKey = getKakaoJavaScriptKey();
        if (!kakaoKey) {
          throw new Error('카카오맵 API 키가 설정되지 않았습니다');
        }

        // 기존 스크립트 확인
        const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
        
        if (!existingScript) {
          // 스크립트 로드
          await loadKakaoScript(kakaoKey);
        }

        // SDK 초기화 대기
        await waitForKakaoMaps();
        
        setKakao(window.kakao);
        setIsLoaded(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '카카오맵 SDK 로드에 실패했습니다';
        setError(errorMessage);
        console.error('카카오맵 SDK 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSDK();
  }, [isLoading]);

  return (
    <KakaoMapContext.Provider value={{ isLoaded, isLoading, error, kakao }}>
      {children}
    </KakaoMapContext.Provider>
  );
};

// 스크립트 로드 함수
const loadKakaoScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing&autoload=false`;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('카카오맵 스크립트 로드 실패'));
    
    document.head.appendChild(script);
  });
};

// 카카오맵 초기화 대기 함수
const waitForKakaoMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('카카오맵 SDK 초기화 시간 초과'));
    }, 10000); // 10초 타임아웃

    const checkKakao = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          if (window.kakao.maps.LatLng) {
            clearTimeout(timeout);
            resolve();
          } else {
            setTimeout(checkKakao, 50);
          }
        });
      } else {
        setTimeout(checkKakao, 100);
      }
    };

    checkKakao();
  });
};

// Hook
export const useKakaoMap = () => {
  const context = useContext(KakaoMapContext);
  if (!context) {
    throw new Error('useKakaoMap must be used within KakaoMapProvider');
  }
  return context;
};

// 편의 Hook - 로드 완료까지 대기
export const useKakaoMapReady = () => {
  const { isLoaded, isLoading, error, kakao } = useKakaoMap();
  
  return {
    isReady: isLoaded && !isLoading && !error,
    isLoading,
    error,
    kakao
  };
};