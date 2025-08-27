export interface RegionConfig {
  name: string;
  englishName: string;
  imageUrl: string;
}

export type RegionCode = 
  | 'seoul' 
  | 'busan' 
  | 'daegu' 
  | 'incheon' 
  | 'gwangju' 
  | 'daejeon' 
  | 'ulsan' 
  | 'sejong'
  | 'gyeonggi' 
  | 'gangwon' 
  | 'chungbuk' 
  | 'chungnam' 
  | 'jeonbuk' 
  | 'jeonnam' 
  | 'gyeongbuk' 
  | 'gyeongnam' 
  | 'jeju';

export const REGION_CONFIG: Record<RegionCode, RegionConfig> = {
  seoul: {
    name: '서울',
    englishName: 'Seoul',
    imageUrl: '/src/assets/sidoImgaes/Seoul.jpg'
  },
  busan: {
    name: '부산',
    englishName: 'Busan', 
    imageUrl: '/src/assets/sidoImgaes/Busan.jpg'
  },
  daegu: {
    name: '대구',
    englishName: 'Daegu',
    imageUrl: '/src/assets/sidoImgaes/Deagu.jpeg'
  },
  incheon: {
    name: '인천',
    englishName: 'Incheon',
    imageUrl: '/src/assets/sidoImgaes/Incheon.jpeg'
  },
  gwangju: {
    name: '광주',
    englishName: 'Gwangju',
    imageUrl: '/src/assets/sidoImgaes/Gwangju.jpg'
  },
  daejeon: {
    name: '대전',
    englishName: 'Daejeon',
    imageUrl: '/src/assets/sidoImgaes/Deajeon.jpeg'
  },
  ulsan: {
    name: '울산',
    englishName: 'Ulsan',
    imageUrl: '/src/assets/sidoImgaes/Seoul.jpg' // 임시로 서울 이미지 사용
  },
  sejong: {
    name: '세종',
    englishName: 'Sejong',
    imageUrl: '/src/assets/sidoImgaes/Sejong.jpeg'
  },
  gyeonggi: {
    name: '경기',
    englishName: 'Gyeonggi',
    imageUrl: '/src/assets/sidoImgaes/Gyeonggi.jpeg'
  },
  gangwon: {
    name: '강원',
    englishName: 'Gangwon',
    imageUrl: '/src/assets/sidoImgaes/Gangwon.jpg'
  },
  chungbuk: {
    name: '충북',
    englishName: 'Chungbuk',
    imageUrl: '/src/assets/sidoImgaes/Chungbuk.jpeg'
  },
  chungnam: {
    name: '충남',
    englishName: 'Chungnam',
    imageUrl: '/src/assets/sidoImgaes/Chungnam.jpg'
  },
  jeonbuk: {
    name: '전북',
    englishName: 'Jeonbuk',
    imageUrl: '/src/assets/sidoImgaes/Geonbuk.jpeg'
  },
  jeonnam: {
    name: '전남',
    englishName: 'Jeonnam',
    imageUrl: '/src/assets/sidoImgaes/Geonnam.jpeg'
  },
  gyeongbuk: {
    name: '경북',
    englishName: 'Gyeongbuk',
    imageUrl: '/src/assets/sidoImgaes/Gyeongbuk.jpg'
  },
  gyeongnam: {
    name: '경남',
    englishName: 'Gyeongnam',
    imageUrl: '/src/assets/sidoImgaes/Gyeongnam.jpg'
  },
  jeju: {
    name: '제주',
    englishName: 'Jeju',
    imageUrl: '/src/assets/sidoImgaes/Jeju.jpg'
  }
};
