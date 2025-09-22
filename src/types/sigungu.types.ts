

export interface SigunguConfig {
  name: string;
  englishName: string;
  code: string;
}

export const getRegionName = (code: string): string | undefined => {
  if (code.length !== 5) return undefined;

  const regionCode = code.slice(0, 2); // 앞 2자리
  const sigunguCode = code.slice(2, 5); // 뒤 3자리

  const regionKorean = REGION_NAME_MAP[regionCode];
  if (!regionKorean) return undefined;

  const regionKey = REGION_CODE_TO_KEY[regionCode];
  if (!regionKey) return regionKorean;

  const configList: SigunguConfig[] = SIGUNGU_CONFIG[regionKey] || [];
  const sigungu = configList.find((s) => s.code === sigunguCode);

  if (!sigungu) return regionKorean;

  return `${regionKorean} ${sigungu.name}`;
};


export const getRegionCode = (name: string): string | undefined => {
  return Object.keys(REGION_CODE_TO_KEY).find((key) => REGION_CODE_TO_KEY[key] === name);
};



export const REGION_CODE_TO_KEY: Record<string, RegionName> = {
  '11': 'seoul',
  '26': 'busan',
  '27': 'daegu',
  '28': 'incheon',
  '29': 'gwangju',
  '30': 'daejeon',
  '31': 'ulsan',
  '36': 'gyeonggi',
  '41': 'gangwon',
  '43': 'chungbuk',
  '44': 'chungnam',
  '46': 'jeonbuk',
  '47': 'jeonnam',
  '48': 'gyeongbuk',
  '50': 'gyeongnam',
  '51': 'jeju',
};

export type SigunguCode = 
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
  | '46' 
  | '47' 
  | '48' 
  | '50'
  | '51';

export type RegionName = 
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

  export const REGION_NAME_MAP: Record<string, string> = {
    '11': '서울시',
    '26': '부산시',
    '27': '대구시',
    '28': '인천시',
    '29': '광주시',
    '30': '대전시',
    '31': '울산시',
    '36': '경기도',
    '41': '강원도',
    '43': '충청북도',
    '44': '충청남도',
    '46': '전라북도',
    '47': '전라남도',
    '48': '경상북도',
    '50': '경상남도',
    '51': '제주도',
  };
  
export const SIGUNGU_CONFIG: Record<RegionName, SigunguConfig[]> = {
  seoul:[
      { name: '종로구', code: '110', englishName: 'Jongno-gu' },
      { name: '중구', code: '140', englishName: 'Jung-gu' },
      { name: '용산구', code: '170', englishName: 'Yongsan-gu' },
      { name: '성동구', code: '200', englishName: 'Seongdong-gu' },
      { name: '광진구', code: '215', englishName: 'Gwangjin-gu' },
      { name: '동대문구', code: '230', englishName: 'Dongdaemun-gu' },
      { name: '중랑구', code: '260', englishName: 'Jungrang-gu' },
      { name: '성북구', code: '290', englishName: 'Seongbuk-gu' },
      { name: '강북구', code: '305', englishName: 'Gangbuk-gu' },
      { name: '도봉구', code: '320', englishName: 'Dobong-gu' },
      { name: '노원구', code: '350', englishName: 'Nowon-gu' },
      { name: '은평구', code: '380', englishName: 'Eunpyeong-gu' },
      { name: '서대문구', code: '410', englishName: 'Seodaemun-gu' },
      { name: '마포구', code: '440', englishName: 'Mapo-gu' },
      { name: '양천구', code: '470', englishName: 'Yangcheon-gu' },
      { name: '강서구', code: '500', englishName: 'Gangseo-gu' },
      { name: '구로구', code: '530', englishName: 'Guro-gu' },
      { name: '금천구', code: '545', englishName: 'Geumcheon-gu' },
      { name: '영등포구', code: '560', englishName: 'Yeongdeungpo-gu' },
      { name: '동작구', code: '590', englishName: 'Dongjak-gu' },
      { name: '관악구', code: '620', englishName: 'Gwangak-gu' },
      { name: '서초구', code: '650', englishName: 'Seocho-gu' },
      { name: '강남구', code: '680', englishName: 'Gangnam-gu' },
      { name: '송파구', code: '710', englishName: 'Songpa-gu' },
      { name: '강동구', code: '740', englishName: 'Gangdong-gu' }
  ],
  
  busan:[
    { name: '중구', code: '110', englishName: 'Jung-gu' },
    { name: '서구', code: '140', englishName: 'Seo-gu' },
    { name: '동구', code: '170', englishName: 'Dong-gu' },
    { name: '영도구', code: '200', englishName: 'Yeongdo-gu' },
    { name: '부산진구', code: '230', englishName: 'Busanjin-gu' },
    { name: '동래구', code: '260', englishName: 'Dongrae-gu' },
    { name: '남구', code: '290', englishName: 'Nam-gu' },
    { name: '북구', code: '320', englishName: 'Buk-gu' },
    { name: '해운대구', code: '350', englishName: 'Haeundae-gu' },
    { name: '사하구', code: '380', englishName: 'Saha-gu' },
    { name: '금정구', code: '410', englishName: 'Geumjeong-gu' },
    { name: '강서구', code: '440', englishName: 'Gangseo-gu' },
    { name: '연제구', code: '470', englishName: 'Yeonjeong-gu' },
    { name: '수영구', code: '500', englishName: 'Suyeong-gu' },
    { name: '사상구', code: '530', englishName: 'Sasang-gu' },
    { name: '기장군', code: '710', englishName: 'Gijang-gu' },
  ],

  daegu:[
    { name: '중구', code: '110', englishName: 'Jung-gu' },
    { name: '동구', code: '140', englishName: 'Dong-gu' },
    { name: '서구', code: '170', englishName: 'Seo-gu' },
    { name: '남구', code: '200', englishName: 'Nam-gu' },
    { name: '북구', code: '230', englishName: 'Buk-gu' },
    { name: '수성구', code: '260', englishName: 'Suseong-gu' },
    { name: '달서구', code: '290', englishName: 'Dalseo-gu' },
    { name: '달성군', code: '710', englishName: 'Dalseong-gun' },
    { name: '군위군', code: '720', englishName: 'Gunwi-gun' },
    ],
   
  incheon:[
    { name: '중구', code: '110', englishName: 'Jung-gu' },
    { name: '동구', code: '140', englishName: 'Dong-gu' },
    { name: '미추홀구', code: '177', englishName: 'Micheul-gu' },
    { name: '연수구', code: '185', englishName: 'Yeonsu-gu' },
    { name: '남동구', code: '200', englishName: 'Nam-gu' },
    { name: '부평구', code: '237', englishName: 'Bupyeong-gu' },
    { name: '계양구', code: '245', englishName: 'Gyeyang-gu' },
    { name: '서구', code: '260', englishName: 'Seo-gu' },
    { name: '강화군', code: '710', englishName: 'Gangwha-gun' },
    { name: '옹진군', code: '720', englishName: 'Ongjin-gun' },
    ],
    
  gwangju:[
    { name: '동구', code: '110', englishName: 'Dong-gu' },
    { name: '서구', code: '140', englishName: 'Seo-gu' },
    { name: '남구', code: '155', englishName: 'Nam-gu' },
    { name: '북구', code: '170', englishName: 'Buk-gu' },
    { name: '광산구', code: '200', englishName: 'Gwangsan-gu' },
    ],

  daejeon: [
    { name: '동구', code: '110', englishName: 'Dong-gu' },
    { name: '중구', code: '140', englishName: 'Jung-gu' },
    { name: '서구', code: '170', englishName: 'Seo-gu' },
    { name: '유성구', code: '200', englishName: 'Yuseong-gu' },
    { name: '대덕구', code: '230', englishName: 'Daedeok-gu' },
    ],
   
  ulsan:[
    { name: '중구', code: '110', englishName: 'Jung-gu' },
    { name: '남구', code: '140', englishName: 'Nam-gu' },
    { name: '동구', code: '170', englishName: 'Dong-gu' },
    { name: '북구', code: '200', englishName: 'Buk-gu' },
    { name: '울주군', code: '710', englishName: 'Ulju-gun' },
    ],

  sejong: [
    { name: '세종특별자치시', code: '110', englishName: 'Sejong-si' },
  ],

  gyeonggi: [
    { name: '수원시', code: '110', englishName: 'Suwon-si' },
    // { name: '수원시 장안구', code: '111', englishName: 'Jangan-gu' },
    // { name: '수원시 권선구', code: '113', englishName: 'Gwansun-gu' },
    // { name: '수원시 팔달구', code: '115', englishName: 'Paldal-gu' },
    // { name: '수원시 영통구', code: '117', englishName: 'Yeongtong-gu' },
    { name: '성남시', code: '130', englishName: 'Seongnam-si' },
    // { name: '성남시 수정구', code: '131', englishName: 'Sujung-gu' },
    // { name: '성남시 중원구', code: '133', englishName: 'Jungwon-gu' },
    // { name: '성남시 분당구', code: '135', englishName: 'Bundang-gu' },
    { name: '의정부시', code: '150', englishName: 'Uijeongbu-si' },
    { name: '안양시', code: '170', englishName: 'Anyang-si' },
    { name: '안양시 만안구', code: '171', englishName: 'Manan-gu' },
    { name: '안양시 동안구', code: '173', englishName: 'Dongan-gu' },
    { name: '부천시', code: '190', englishName: 'Bucheon-si' },
    // { name: '부천시 원미구', code: '192', englishName: 'Wonmi-gu' },
    // { name: '부천시 소사구', code: '194', englishName: 'Sosa-gu' },
    // { name: '부천시 오정구', code: '196', englishName: 'Ojeong-gu' },
    { name: '광명시', code: '210', englishName: 'Gwangmyeong-si' },
    { name: '평택시', code: '220', englishName: 'Pyeongtaek-si' },
    { name: '동두천시', code: '250', englishName: 'Dongducheon-si' },
    { name: '안산시', code: '270', englishName: 'Ansan-si' },
    // { name: '안산시\n상록구', code: '271', englishName: 'Sangrok-gu' },
    // { name: '안산시\n단원구', code: '273', englishName: 'Danchun-gu' },
    { name: '고양시', code: '280', englishName: 'Goyang-si' },
    // { name: '고양시\n덕양구', code: '281', englishName: 'Dongyang-gu' },
    // { name: '고양시\n일산동구', code: '285', englishName: 'Ilsandong-gu' },
    // { name: '고양시\n일산서구', code: '287', englishName: 'Ilsanseo-gu' },
    { name: '과천시', code: '290', englishName: 'Gocheon-si' },
    { name: '구리시', code: '310', englishName: 'Guri-si' },
    { name: '남양주시', code: '360', englishName: 'Yangju-si' },
    { name: '오산시', code: '370', englishName: 'Osan-si' },
    { name: '시흥시', code: '390', englishName: 'Sihyeong-si' },
    { name: '군포시', code: '410', englishName: 'Gunpo-si' },
    { name: '의왕시', code: '430', englishName: 'Uiwang-si' },
    { name: '하남시', code: '450', englishName: 'Hanam-si' },
    { name: '용인시', code: '460', englishName: 'Yongin-si' },
    // { name: '용인시\n처인구', code: '461', englishName: 'Cheon-gu' },
    // { name: '용인시\n기흥구', code: '463', englishName: 'Gicheong-gu' },
    // { name: '용인시\n수지구', code: '465', englishName: 'Suji-gu' },
    { name: '파주시', code: '480', englishName: 'Paju-si' },
    { name: '이천시', code: '500', englishName: 'Icheon-si' },
    { name: '안성시', code: '550', englishName: 'Anseong-si' },
    { name: '김포시', code: '570', englishName: 'Gimpo-si' },
    { name: '화성시', code: '590', englishName: 'Hwaseong-si' },
    { name: '광주시', code: '610', englishName: 'Gwangju-si' },
    { name: '양주시', code: '630', englishName: 'Yangju-si' },
    { name: '포천시', code: '650', englishName: 'Pocheon-si' },
    { name: '여주시', code: '670', englishName: 'Yeoju-si' },
    { name: '연천군', code: '800', englishName: 'Yeoncheon-gun' },
    { name: '가평군', code: '820', englishName: 'Gapyeong-gun' },
    { name: '양평군', code: '830', englishName: 'Yangpyeong-gun' },
    ],
  
  gangwon: [
    { name: '춘천시', code: '110', englishName: 'Chuncheon-si' },
    { name: '원주시', code: '130', englishName: 'Wonju-si' },
    { name: '강릉시', code: '150', englishName: 'Gangneung-si' },
    { name: '동해시', code: '170', englishName: 'Donghae-si' },
    { name: '태백시', code: '190', englishName: 'Taebaek-si' },
    { name: '속초시', code: '210', englishName: 'Sokcho-si' },
    { name: '삼척시', code: '230', englishName: 'Samcheok-si' },
    { name: '홍천군', code: '720', englishName: 'Hongcheon-gun' },
    { name: '횡성군', code: '730', englishName: 'Hyeongseong-gun' },
    { name: '영월군', code: '750', englishName: 'Yeongwol-gun' },
    { name: '평창군', code: '760', englishName: 'Pyeongchang-gun' },
    { name: '정선군', code: '770', englishName: 'Jeongseong-gun' },
    { name: '철원군', code: '780', englishName: 'Cheorwon-gun' },
    { name: '화천군', code: '790', englishName: 'Hwacheon-gun' },
    { name: '양구군', code: '800', englishName: 'Yanggu-gun' },
    { name: '인제군', code: '810', englishName: 'Inje-gun' },
    { name: '고성군', code: '820', englishName: 'Goseong-gun' },
    { name: '양양군', code: '830', englishName: 'Yangyang-gun'}, 
    ],
   
  chungbuk: [
    { name: '청주시', code: '110', englishName: 'Cheonju-si'},
    // { name: '청주시 상당구', code: '111' , englishName: 'Sangdang-gu'},
    // { name: '청주시 서원구', code: '112' , englishName: 'Seowon-gu'},
    // { name: '청주시 흥덕구', code: '113' , englishName: 'Heungdeok-gu'},
    // { name: '청주시 청원구', code: '114' , englishName: 'Cheongwon-gu'},
    { name: '충주시', code: '130' , englishName: 'Chunju-si'},
    { name: '제천시', code: '150' , englishName: 'Jecheon-si'},
    { name: '보은군', code: '720' , englishName: 'Boeun-gun'},
    { name: '옥천군', code: '730' , englishName: 'Okcheon-gun'},
    { name: '영동군', code: '740' , englishName: 'Yeongdong-gun'},
    { name: '증평군', code: '745', englishName: 'Jeungpyeong-gun'},
    { name: '진천군', code: '750' , englishName: 'Jincheon-gun '},
    { name: '괴산군', code: '760' , englishName: 'Goesan-gun'},
    { name: '음성군', code: '770' , englishName: 'Eumseong-gun'},
    { name: '단양군', code: '800' , englishName: 'Danyang-gun'},
    ],
    
  chungnam: [
    { name: '천안시', code: '110' , englishName: 'Chunan-si'},
    // { name: '천안시 동남구', code: '111' , englishName: 'Dongnam-gu'  },
    // { name: '천안시 서북구', code: '113' , englishName: 'Seobuk-gu'  },
    { name: '공주시', code: '150' , englishName: 'Gongju-si'},
    { name: '보령시', code: '180' , englishName: 'Boryeong-si'},
    { name: '아산시', code: '200' , englishName: 'Asan-si'},
    { name: '서산시', code: '210' , englishName: 'Seosan-si'},  
    { name: '논산시', code: '230' , englishName: 'Nonsan-si'},
    { name: '계룡시', code: '250' , englishName: 'Gyeryong-si'},
    { name: '당진시', code: '270' , englishName: 'Dangjin-si'},
    { name: '금산군', code: '710' , englishName: 'Geumsan-gun'},
    { name: '부여군', code: '760' , englishName: 'Buyeo-gun'},
    { name: '서천군', code: '770' , englishName: 'Seocheon-gun'},
    { name: '청양군', code: '790' , englishName: 'Cheongyang-gun'},
    { name: '홍성군', code: '800' , englishName: 'Hongseong-gun'},
    { name: '예산군', code: '810' , englishName: 'Yesan-gun'},
    { name: '태안군', code: '825' , englishName: 'Taean-gun'},
    ],  

  jeonbuk: [
    { name: '전주시', code: '110' , englishName: 'Jeonju-si'},
    // { name: '전주시 완산구', code: '111' , englishName: 'Wansan-gu'},
    // { name: '전주시 덕진구', code: '113' , englishName: 'Dukjin-gu'},
    { name: '군산시', code: '130' , englishName: 'Guncheon-si'},
    { name: '익산시', code: '140' , englishName: 'Iksan-si'},
    { name: '정읍시', code: '180' , englishName: 'Jeongeup-si'},
    { name: '남원시', code: '190' , englishName: 'Namwon-si'},
    { name: '김제시', code: '210' , englishName: 'Gimje-si'},
    { name: '완주군', code: '710' , englishName: 'Wanju-gun'},
    { name: '진안군', code: '720' , englishName: 'Jinan-gun'},
    { name: '무주군', code: '730' , englishName: 'Muju-gun'},
    { name: '장수군', code: '740' , englishName: 'Jangsu-gun'},
    { name: '임실군', code: '750' , englishName: 'Imsil-gun'},
    { name: '순창군', code: '770' , englishName: 'Sunchang-gun'},
    { name: '고창군', code: '790' , englishName: 'Gochang-gun'},
    { name: '부안군', code: '800' , englishName: 'Buan-gun'},
    ],

  jeonnam: [
    { name: '목포시', code: '110' , englishName: 'Mokpo-si'},
    { name: '여수시', code: '130' , englishName: 'Yeosu-si'},
    { name: '순천시', code: '150' , englishName: 'Suncheon-si'},
    { name: '나주시', code: '170' , englishName: 'Naju-si'},
    { name: '광양시', code: '230' , englishName: 'Gwangyang-si'},
    { name: '담양군', code: '710' , englishName: 'Damyang-gun'},
    { name: '곡성군', code: '720' , englishName: 'Gokseong-gun'},
    { name: '구례군', code: '730' , englishName: 'Gurye-gun'},
    { name: '고흥군', code: '770' , englishName: 'Goheung-gun'},
    { name: '보성군', code: '780' , englishName: 'Bosung-gun'},
    { name: '화순군', code: '790' , englishName: 'Hwasun-gun'},
    { name: '장흥군', code: '800' , englishName: 'Jangheung-gun'},
    { name: '강진군', code: '810' , englishName: 'Gangjin-gun'},
    { name: '해남군', code: '820' , englishName: 'Haenam-gun'},
    { name: '영암군', code: '830' , englishName: 'Yeongam-gun'  },
    { name: '무안군', code: '840' , englishName: 'Muan-gun'  },
    { name: '함평군', code: '860' , englishName: 'Hampyeong-gun'  },
    { name: '영광군', code: '870' , englishName: 'Yeonggwang-gun'  },
    { name: '장성군', code: '880' , englishName: 'Jangseong-gun'},
    { name: '완도군', code: '890' , englishName: 'Wando-gun'  },
    { name: '진도군', code: '900' , englishName: 'Jindo-gun'  },
    { name: '신안군', code: '910' , englishName: 'Sinan-gun'},
    ],
   
  gyeongbuk: [
    { name: '포항시', code: '110' , englishName: 'Pohang-si'},
    // { name: '포항시 남구', code: '111' , englishName: 'Nam-gu'},
    // { name: '포항시 북구', code: '113' , englishName: 'Buk-gu'},
    { name: '경주시', code: '130' , englishName: 'Gyeongju-si'},
    { name: '김천시', code: '150' , englishName: 'Gimcheon-si'},
    { name: '안동시', code: '170' , englishName: 'Andong-si'},
    { name: '구미시', code: '190' , englishName: 'Gumi-si'  },
    { name: '영주시', code: '210' , englishName: 'Yeongju-si'},
    { name: '영천시', code: '230' , englishName: 'Yeongcheon-si'},
    { name: '상주시', code: '250' , englishName: 'Sangju-si'},
    { name: '문경시', code: '280' , englishName: 'Mungyeong-si'},
    { name: '경산시', code: '290' , englishName: 'Gyeongseong-si'},
    { name: '의성군', code: '730' , englishName: 'Seong-gun'  },
    { name: '청송군', code: '750' , englishName: 'Chungseong-gun'},
    { name: '영양군', code: '760' , englishName: 'Yeongyang-gun'},
    { name: '영덕군', code: '770' , englishName: 'Yeongdeok-gun'},
    { name: '청도군', code: '820' , englishName: 'Chungdo-gun'},
    { name: '고령군', code: '830' , englishName: 'Goryeong-gun'},
    { name: '성주군', code: '840' , englishName: 'Sungju-gun'},
    { name: '칠곡군', code: '850' , englishName: 'Chilgok-gun'},
    { name: '예천군', code: '900' , englishName: 'Yecheon-gun'},
    { name: '봉화군', code: '920' , englishName: 'Bonghwa-gun'},
    { name: '울진군', code: '930' , englishName: 'Uljin-gun'},
    { name: '울릉군', code: '940' , englishName: 'Ulleung-gun'},
    ],
    
  gyeongnam: [
    { name: '창원시', code: '110' , englishName: 'Changwon-si'},
    // { name: '창원시 의창구', code: '111' , englishName: 'Uichang-gu'},
    // { name: '창원시 성산구', code: '113' , englishName: 'Seongsan-gu'},
    // { name: '창원시 마산합포구', code: '125' , englishName: 'Masanhappo-gu'},
    // { name: '창원시 마산회원구', code: '127' , englishName: 'Masanhoewon-gu'},
    // { name: '창원시 진해구', code: '129' , englishName: 'Jinhae-gu'},
    { name: '진주시', code: '170' , englishName: 'Jinju-si'},
    { name: '통영시', code: '220' , englishName: 'Tongyeong-si'},
    { name: '사천시', code: '240' , englishName: 'Sacheon-si'},
    { name: '김해시', code: '250' , englishName: 'Gimhae-si'},
    { name: '밀양시', code: '270' , englishName: 'Miryang-si'},
    { name: '거제시', code: '310' , englishName: 'Geoje-si'},
    { name: '양산시', code: '330' , englishName: 'Yangsan-si'},
    { name: '의령군', code: '720' , englishName: 'Uiryeong-gun'},
    { name: '함안군', code: '730' , englishName: 'Haman-gun'},
    { name: '창녕군', code: '740' , englishName: 'Changnyeong-gun'},
    { name: '고성군', code: '820' , englishName: 'Goseong-gun'},
    { name: '남해군', code: '840' , englishName: 'Namhae-gun'},
    { name: '하동군', code: '850' , englishName: 'Hadong-gun'},
    { name: '산청군', code: '860' , englishName: 'Sancheong-gun'},
    { name: '함양군', code: '870' , englishName: 'Hamyang-gun'},
    { name: '거창군', code: '880' , englishName: 'Geochang-gun'},
    ],
    
  jeju: [
    { name: '제주시', code: '110' , englishName: 'Jeju-si'},
    { name: '서귀포시', code: '130' , englishName: 'Seogwipo-si'},
    ],
};
