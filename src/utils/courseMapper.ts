// utils/courseMapper.ts (새 파일 생성)

export interface ApiCourseResponse {
    id: number;
    userId: number;
    days: number;
    regionCode: string;
    totalDistance: number;
    courseSlots: Array<{
      day: number;
      selectedSpotId: number | null;
    }[]>;
    categories?: string[];
  }
  
  export interface MappedCourseData {
    id: number;
    userId: number;
    categories: string[];
    totalDistance: number;
    days: number;
    daySlots: Array<{
      day: number;
      selectedSpotIds: number[];
    }>;
  }
  
  export const mapApiToCourseData = (
    apiResponse: ApiCourseResponse,
    requestCategories?: string[]
  ): MappedCourseData => {
    return {
      id: apiResponse.id,
      userId: apiResponse.userId,
      categories: requestCategories || apiResponse.categories || [],
      totalDistance: apiResponse.totalDistance,
      days: apiResponse.days,
      daySlots: apiResponse.courseSlots.map((daySlots, dayIndex) => ({
        day: dayIndex + 1,
        selectedSpotIds: daySlots
          .map(slot => slot.selectedSpotId)
          .filter((id): id is number => id !== null) // null이 아닌 것만 필터링 & 타입 가드
      }))
    };
  };