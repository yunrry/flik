export interface CourseSlot {
    day: number;
    slot: number;
    slotType: string;
    mainCategory: string | null;
    slotName: string;
    recommendedSpotIds: number[];
    selectedSpotId: number | null;
    isContinue: boolean | null;
    hasRecommendations: boolean;
    hasSelectedSpot: boolean;
    empty: boolean; // 백엔드에서 isEmpty -> empty로 내려오도록 매핑 필요
  }
  
  export interface TravelCourse {
    id: number;
    userId: number;
    days: number;
    regionCode: string;
    totalDistance: number | null; // Double의 null 가능성 반영
    courseSlots: CourseSlot[][];
    createdAt: string; // ISO DateTime string
    courseType: string;
    totalSlots: number;
    filledSlots: number;
    selectedCategories: string[];
    isPublic: boolean;
  }
  