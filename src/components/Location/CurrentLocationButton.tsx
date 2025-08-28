import React, { useState, useEffect } from 'react';
import { GpsIcon } from '../Icons';
import { LocationPermissionModal } from '../Location';

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

interface CurrentLocationButtonProps {
  onLocationUpdate?: (location: UserLocation) => void;
  className?: string;
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onLocationUpdate,
  className = ''
}) => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [error, setError] = useState<string>('');

  // 컴포넌트 마운트 시 위치 권한 상태 확인
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'granted') {
        setIsPermissionGranted(true);
        getCurrentLocation();
      } else if (permission.state === 'denied') {
        setIsPermissionGranted(false);
        setError('위치 접근이 거부되었습니다.');
      }
    } catch (error) {
      console.log('권한 확인 중 오류:', error);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        const locationData: UserLocation = {
          coordinates: { latitude, longitude, accuracy },
          timestamp: position.timestamp
        };

        try {
          // 실제 주소 변환 (여기서는 예시 구현)
          const address = await reverseGeocode(latitude, longitude);
          locationData.address = address;
          setCurrentAddress(formatAddress(address));
          setIsPermissionGranted(true);
          
          if (onLocationUpdate) {
            onLocationUpdate(locationData);
          }
        } catch (error) {
          console.error('주소 변환 실패:', error);
          setCurrentAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setIsPermissionGranted(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('위치 접근이 거부되었습니다.');
            setShowPermissionModal(true);
            break;
          case error.POSITION_UNAVAILABLE:
            setError('위치 정보를 사용할 수 없습니다.');
            break;
          case error.TIMEOUT:
            setError('위치 요청 시간이 초과되었습니다.');
            break;
          default:
            setError('위치를 가져오는 중 오류가 발생했습니다.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // 실제 프로젝트에서는 Google Maps API나 다른 지오코딩 서비스 사용
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ko`
      );
      
      if (response.ok) {
        const addressData = await response.json();
        return {
          country: addressData.countryName || '대한민국',
          region: addressData.principalSubdivision || '',
          city: addressData.city || addressData.locality || '',
          district: addressData.localityInfo?.administrative?.[3]?.name || ''
        };
      } else {
        throw new Error('주소 정보를 가져올 수 없습니다.');
      }
    } catch (error) {
      console.warn('주소 정보를 가져올 수 없습니다:', error);
      throw new Error('지오코딩 API 호출 실패');
    }
  };

  const formatAddress = (address: {country: string, region: string, city: string, district?: string}) => {
    return `${address.region} ${address.city} ${address.district || ''}`.trim();
  };

  const handleButtonClick = () => {
    if (!isPermissionGranted) {
      setShowPermissionModal(true);
    } else {
      getCurrentLocation();
    }
  };

  const handlePermissionSuccess = (location: UserLocation) => {
    setIsPermissionGranted(true);
    setShowPermissionModal(false);
    if (location.address) {
      setCurrentAddress(formatAddress(location.address));
    }
    if (onLocationUpdate) {
      onLocationUpdate(location);
    }
  };

  const handlePermissionSkip = () => {
    setShowPermissionModal(false);
  };

  const getButtonText = () => {
    if (isLoading) return '위치 찾는 중...';
    if (error) return '위치 오류';
    if (currentAddress) return currentAddress;
    return '현재위치로';
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className={`
          flex items-center gap-0.5 px-2 py-1 
          bg-white rounded-lg hover:shadow-md transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-200 text-red-600' : 'text-gray-800'}
          ${className}
        `}
      >
        <GpsIcon 
          size="lg" 
          color={error ? "#DC2626" : isPermissionGranted ? "#FF6B35" : "#333333"}
          variant={isPermissionGranted ? "filled" : "outline"}
          isActive={isPermissionGranted}
        />
        <span className="text-gray-5 sm:text-sm xs:text-xs pt-1 font-medium font-['Pretendard'] leading-normal">
          {getButtonText()}
        </span>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        )}
      </button>

      {/* 위치 권한 모달 */}
      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onSuccess={handlePermissionSuccess}
        onSkip={handlePermissionSkip}
      />
    </>
  );
};

export default CurrentLocationButton;
