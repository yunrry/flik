import { REGION_CONFIG, RegionCode } from '../types/region.types';

// 지역 ID를 지역 코드로 변환하는 함수
export const convertRegionToCode = (regionId: string): string => {
  const regionConfig = REGION_CONFIG[regionId as RegionCode];
  if (!regionConfig) {
    console.warn(`Unknown region ID: ${regionId}`);
    return '';
  }
  return regionConfig.code;
};

// 지역 코드를 지역 ID로 변환하는 함수 (역변환)
export const convertCodeToRegion = (code: string): string => {
  const regionEntry = Object.entries(REGION_CONFIG).find(
    ([, config]) => config.code === code
  );
  return regionEntry ? regionEntry[0] : '';
};

// 모든 지역 코드 목록 가져오기
export const getAllRegionCodes = (): string[] => {
  return Object.values(REGION_CONFIG).map(config => config.code);
};

// 지역 이름으로 지역 코드 찾기
export const findRegionCodeByName = (name: string): string => {
  const regionEntry = Object.entries(REGION_CONFIG).find(
    ([, config]) => config.name === name
  );
  return regionEntry ? regionEntry[1].code : '';
};