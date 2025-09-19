// cacheKey에서 파싱된 데이터 타입 정의
export interface ParsedCacheKey {
    categories: string[];
    regionCode: string;
    tripDuration: number;
  }
  
  // cacheKey에서 모든 정보를 파싱하는 함수
  export const parseCacheKey = (cacheKey: string): ParsedCacheKey => {
    try {
      // cacheKey 형태: "NATURE_HISTORY_CULTURE:11110:21:2"
      // 콜론(:)으로 분리: [categories, regionCode, limitPerCategory, tripDuration]
      const parts = cacheKey.split(':');
      if (parts.length < 4) {
        throw new Error('Invalid cacheKey format');
      }
      
      const categoriesString = parts[0]; // "NATURE_HISTORY_CULTURE"
      const regionCode = parts[1]; // "11110"
      const limitPerCategory = parseInt(parts[2]); // "21"
      const tripDuration = parseInt(parts[3]); // "2"
      
      // 카테고리 파싱
      const categories = parseCategoriesFromString(categoriesString);
      
      console.log('파싱된 cacheKey 데이터:', {
        categories,
        regionCode,
        limitPerCategory,
        tripDuration
      });
      
      return {
        categories,
        regionCode,
        tripDuration
      };
    } catch (error) {
      console.error('cacheKey 파싱 오류:', error);
      return {
        categories: [],
        regionCode: '',
        tripDuration: 1
      };
    }
  };
  
  // 카테고리 문자열에서 카테고리 배열을 파싱하는 함수
  const parseCategoriesFromString = (categoriesString: string): string[] => {
    // HISTORY_CULTURE만 복합 카테고리로 처리
    const compoundCategory = 'HISTORY_CULTURE';
    
    let categories: string[] = [];
    let remainingString = categoriesString;
    
    // HISTORY_CULTURE가 포함되어 있으면 먼저 추출
    if (remainingString.includes(compoundCategory)) {
      categories.push(compoundCategory);
      remainingString = remainingString.replace(compoundCategory, '').replace(/^_+|_+$/g, '');
    }
    
    // 남은 문자열에서 언더스코어로 분리하여 단일 카테고리들 추출
    if (remainingString) {
      const remainingCategories = remainingString.split('_').filter(cat => cat.trim() !== '');
      categories = categories.concat(remainingCategories);
    }
    
    return categories;
  };
  
  // 기존 함수는 호환성을 위해 유지
  export const parseCategoriesFromCacheKey = (cacheKey: string): string[] => {
    const parsed = parseCacheKey(cacheKey);
    return parsed.categories;
  };