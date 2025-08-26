// src/components/Layout/NavigationLayout.tsx

import React, { useState } from 'react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (location: UserLocation) => void;
  onSkip: () => void;
}

interface UserLocation {
  coordinates: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
  address?: {
    country: string;
    region: string;
    city: string;
    district?: string;
  };
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSkip
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLocationPermission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Geolocation API 지원 확인
      if (!navigator.geolocation) {
        throw new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      }

      // 위치 권한 요청
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const location: UserLocation = {
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        timestamp: Date.now()
      };

      // 역지오코딩 (선택사항)
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=ko`
        );
        
        if (response.ok) {
          const addressData = await response.json();
          location.address = {
            country: addressData.countryName || '대한민국',
            region: addressData.principalSubdivision || '',
            city: addressData.city || addressData.locality || '',
            district: addressData.localityInfo?.administrative?.[3]?.name || ''
          };
        }
      } catch (addressError) {
        console.warn('주소 정보를 가져올 수 없습니다:', addressError);
      }

      onSuccess(location);
      onClose();
    } catch (error: any) {
      let errorMessage = '위치 정보를 가져올 수 없습니다.';
      
      if (error.code === 1) {
        errorMessage = '위치 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
      } else if (error.code === 2) {
        errorMessage = '위치 정보를 사용할 수 없습니다.';
      } else if (error.code === 3) {
        errorMessage = '위치 요청 시간이 초과되었습니다.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">

          <p className="text-gray-600">
            서비스 사용을 위해 <br />
            위치 접근을 허용해주세요.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleLocationPermission}
            disabled={isLoading}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-colors
              ${isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-500 text-white hover:bg-orange-600'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                위치 확인 중...
              </div>
            ) : (
              '위치 접근 허용하기'
            )}
          </button>

          <button
            onClick={handleSkip}
            disabled={isLoading}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            나중에 하기
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          위치 정보는 주변 맛집을 추천하는 데만 사용됩니다.
        </p>
      </div>
    </div>
  );
};

export default LocationPermissionModal;