
export const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      RESTAURANT: '음식점',
      ACCOMMODATION: '숙박',
      CAFE: '카페',
      ACTIVITY: '액티비티',
      HISTORY_CULTURE: '역사문화',
      NATURE: '자연',
      MARKET: '시장',
      THEMEPARK: '테마파크',
      FESTIVAL: '축제',
      INDOOR: '실내',
    };
    return categoryMap[category] || category;
  };