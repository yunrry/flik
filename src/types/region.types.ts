export interface RegionConfig {
  name: string;
  code: string;
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

  export type RegionCodeForPost = 
  | '11' 
  | '26' 
  | '27' 
  | '28' 
  | '29' 
  | '30' 
  | '31' 
  | '36'
  | '41' 
  | '51' 
  | '43' 
  | '44' 
  | '52' 
  | '46' 
  | '47' 
  | '48' 
  | '50';
  



  export const REGION_NAME_MAP: Record<string, string> = {
    '11': '서울시',
    '26': '부산시',
    '27': '대구시',
    '28': '인천시',
    '29': '광주시',
    '30': '대전시',
    '31': '울산시',
    '36': '세종시',
    '41': '경기도',
    '51': '강원도',
    '43': '충청북도',
    '44': '충청남도',
    '52': '전라북도',
    '46': '전라남도',
    '47': '경상북도',
    '48': '경상남도',
    '50': '제주도',
  };

  
export const REGION_CONFIG: Record<RegionCode, RegionConfig> = {
  seoul: {
    name: '서울',
    code: '11',
    englishName: 'Seoul',
    imageUrl: '/assets/sidoImgaes/Seoul.jpg'
  },
  busan: {
    name: '부산',
    code: '26',
    englishName: 'Busan', 
    imageUrl: '/assets/sidoImgaes/Busan.jpg'
  },
  daegu: {
    name: '대구',
    code: '27',
    englishName: 'Daegu',
    imageUrl: '/assets/sidoImgaes/Deagu.jpeg'
  },
  incheon: {
    name: '인천',
    code: '28',
    englishName: 'Incheon',
    imageUrl: '/assets/sidoImgaes/Incheon.jpeg'
  },
  gwangju: {
    name: '광주',
    code: '29',
    englishName: 'Gwangju',
    imageUrl: '/assets/sidoImgaes/Gwangju.jpg'
  },
  daejeon: {
    name: '대전',
    code: '30',
    englishName: 'Daejeon',
    imageUrl: '/assets/sidoImgaes/Deajeon.jpeg'
  },
  ulsan: {
    name: '울산',
    code: '31',
    englishName: 'Ulsan',
    imageUrl: '/assets/sidoImgaes/Seoul.jpg' // 임시로 서울 이미지 사용
  },
  sejong: {
    name: '세종',
    code: '36',
    englishName: 'Sejong',
    imageUrl: '/assets/sidoImgaes/Sejong.jpeg'
  },
  gyeonggi: {
    name: '경기',
    code: '41',
    englishName: 'Gyeonggi',
    imageUrl: '/assets/sidoImgaes/Gyeonggi.jpeg'
  },
  gangwon: {
    name: '강원',
    code: '51',
    englishName: 'Gangwon',
    imageUrl: '/assets/sidoImgaes/Gangwon.jpg'
  },
  chungbuk: {
    name: '충북',
    code: '43',
    englishName: 'Chungbuk',
    imageUrl: '/assets/sidoImgaes/Chungbuk.jpeg'
  },
  chungnam: {
    name: '충남',
    code: '44',
    englishName: 'Chungnam',
    imageUrl: '/assets/sidoImgaes/Chungnam.jpg'
  },
  jeonbuk: {
    name: '전북',
    code: '52',
    englishName: 'Jeonbuk',
    imageUrl: '/assets/sidoImgaes/Geonbuk.jpeg'
  },
  jeonnam: {
    name: '전남',
    code: '46',
    englishName: 'Jeonnam',
    imageUrl: '/assets/sidoImgaes/Geonnam.jpeg'
  },
  gyeongbuk: {
    name: '경북',
    code: '47',
    englishName: 'Gyeongbuk',
    imageUrl: '/assets/sidoImgaes/Gyeongbuk.jpg'
  },
  gyeongnam: {
    name: '경남',
    code: '48',
    englishName: 'Gyeongnam',
    imageUrl: '/assets/sidoImgaes/Gyeongnam.jpg'
  },
  jeju: {
    name: '제주',
    code: '50',
    englishName: 'Jeju',
    imageUrl: '/assets/sidoImgaes/Jeju.jpg'
  }
};

export const REGION_CONFIG_FOR_POST: Record<RegionCodeForPost, RegionConfig> = {
  '11': {
    name: '서울',
    code: '11',
    englishName: 'Seoul',
    imageUrl: '/assets/sidoImgaes/Seoul.jpg'
  },
  '26': {
    name: '부산',
    code: '26',
    englishName: 'Busan', 
    imageUrl: '/assets/sidoImgaes/Busan.jpg'
  },
  '27': {
    name: '대구',
    code: '27',
    englishName: 'Daegu',
    imageUrl: '/assets/sidoImgaes/Deagu.jpeg'
  },
  '28': {
    name: '인천',
    code: '28',
    englishName: 'Incheon',
    imageUrl: '/assets/sidoImgaes/Incheon.jpeg'
  },
  '29': {
    name: '광주',
    code: '29',
    englishName: 'Gwangju',
    imageUrl: '/assets/sidoImgaes/Gwangju.jpg'
  },
  '30': {
    name: '대전',
    code: '30',
    englishName: 'Daejeon',
    imageUrl: '/assets/sidoImgaes/Deajeon.jpeg'
  },
  '31': {
    name: '울산',
    code: '31',
    englishName: 'Ulsan',
    imageUrl: '/assets/sidoImgaes/Seoul.jpg' // 임시로 서울 이미지 사용
  },
  '36': {
    name: '세종',
    code: '36',
    englishName: 'Sejong',
    imageUrl: '/assets/sidoImgaes/Sejong.jpeg'
  },
  '41': {
    name: '경기',
    code: '41',
    englishName: 'Gyeonggi',
    imageUrl: '/assets/sidoImgaes/Gyeonggi.jpeg'
  },
  '51': {
    name: '강원',
    code: '51',
    englishName: 'Gangwon',
    imageUrl: '/assets/sidoImgaes/Gangwon.jpg'
  },
  '43': {
    name: '충북',
    code: '43',
    englishName: 'Chungbuk',
    imageUrl: '/assets/sidoImgaes/Chungbuk.jpeg'
  },
  '44': {
    name: '충남',
    code: '44',
    englishName: 'Chungnam',
    imageUrl: '/assets/sidoImgaes/Chungnam.jpg'
  },
  '52': {
    name: '전북',
    code: '52',
    englishName: 'Jeonbuk',
    imageUrl: '/assets/sidoImgaes/Geonbuk.jpeg'
  },
  '46': {
    name: '전남',
    code: '46',
    englishName: 'Jeonnam',
    imageUrl: '/assets/sidoImgaes/Geonnam.jpeg'
  },
  '47': {
    name: '경북',
    code: '47',
    englishName: 'Gyeongbuk',
    imageUrl: '/assets/sidoImgaes/Gyeongbuk.jpg'
  },
  '48': {
    name: '경남',
    code: '48',
    englishName: 'Gyeongnam',
    imageUrl: '/assets/sidoImgaes/Gyeongnam.jpg'
  },
  '50': {
    name: '제주',
    code: '50',
    englishName: 'Jeju',
    imageUrl: '/assets/sidoImgaes/Jeju.jpg'
  }
};