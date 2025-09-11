import { SIGUNGU_CONFIG } from './sigungu.types';
import { RegionName } from './sigungu.types';

export const getStepOptions = (step: number, selectedRegion?: RegionName): StepOption[] => {
    if (step === 2 && selectedRegion) {
      return SIGUNGU_CONFIG[selectedRegion]?.map(config => ({
        id: config.code,
        name: config.name,
        icon: '', // 2단계는 빈 아이콘
        code: config.code,
        englishName: config.englishName
      })) || [];
    }
    return STEP_OPTIONS[step] || [];
  };

export interface StepOption {
    id: string;
    name: string;
    icon: string;
    code?: string; // SigunguConfig와 호환되도록 추가
    englishName?: string;
  }
  
  
export const STEP_OPTIONS: Record<number, StepOption[]> = {
    1: [
      { id: 'seoul', name: '서울', icon: '' },
      { id: 'busan', name: '부산', icon: '' },
      { id: 'daegu', name: '대구', icon: '' },
      { id: 'incheon', name: '인천', icon: '' },
      { id: 'gwangju', name: '광주', icon: '' },
      { id: 'daejeon', name: '대전', icon: '' },
      { id: 'ulsan', name: '울산', icon: '' },
      { id: 'sejong', name: '세종', icon: '' },
      { id: 'gyeonggi', name: '경기', icon: '' },
      { id: 'gangwon', name: '강원', icon: '' },
      { id: 'chungbuk', name: '충북', icon: '' },
      { id: 'chungnam', name: '충남', icon: '' },
      { id: 'jeonbuk', name: '전북', icon: '' },
      { id: 'jeonnam', name: '전남', icon: '' },
      { id: 'gyeongbuk', name: '경북', icon: '' },
      { id: 'gyeongnam', name: '경남', icon: '' },
      { id: 'jeju', name: '제주', icon: '' },
    ],
    2: [
      
    ],
    3: [
      { id: 'day', name: '당일치기', icon: '☀️' },
      { id: '1night', name: '1박2일', icon: '🌙' },
      { id: '2night', name: '2박3일', icon: '🌟' },
    ],
    4: [
        { id: 'nature', name: '자연', icon: '/assets/theme/nature.jpg' },
        { id: 'indoor', name: '실내여행지', icon: '/assets/theme/indoor.jpg' },
        { id: 'history', name: '문화역사', icon: '/assets/theme/history.jpg' },
        { id: 'cafe', name: '카페', icon: '/assets/theme/cafe.jpg' },
        { id: 'activity', name: '액티비티', icon: '/assets/theme/activity.jpg' },
        { id: 'festival', name: '축제', icon: '/assets/theme/festival.jpg' },
        { id: 'market', name: '전통시장', icon: '/assets/theme/market.jpg' },
        { id: 'themePark', name: '테마파크', icon: '/assets/theme/themePark.jpeg' },
    ]
  };