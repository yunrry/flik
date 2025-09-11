import { Restaurant } from "../types/restaurant.types";


export const sampleRestaurants: Restaurant[] = [
    {
      id: '1',
      name: '마리오네',
      images: [
        '/cardImages/marione.png',
        '/api/placeholder/400/600',
        '/api/placeholder/400/600'
      ],
      rating: 4.7,
      description: '세계 챔피언 마리오가 선보이는 전통 나폴리 피자와 파스타를 맛볼 수 있는 곳',
      address: '서울 성동구 성수동2가 299-50',
      distance: 326,
      hours: '12:00 ~ 18:00',
      coordinates: {
        lat: 37.5447,
        lng: 127.0557
      }
    },
    {
      id: '2',
      name: '성수동 맛집',
      images: [
        '/cardImages/marione.png',
        '/api/placeholder/400/600',
        '/api/placeholder/400/600'
      ],
      rating: 4.3,
      description: '현지인이 사랑하는 숨은 맛집, 정통 한식을 맛볼 수 있습니다',
      address: '서울 성동구 성수동1가 685-142',
      distance: 520,
      hours: '11:00 ~ 21:00',
      coordinates: {
        lat: 37.5447,
        lng: 127.0557
      }

    },
    {
      id: '3',
      name: '카페 로스터리',
      images: [
        '/cardImages/marione.png',
        '/api/placeholder/400/600'
      ],
      rating: 4.5,
      description: '직접 로스팅한 원두로 만드는 스페셜티 커피 전문점',
      address: '서울 성동구 성수동2가 277-44',
      distance: 890,
      hours: '08:00 ~ 20:00',
      coordinates: {
        lat: 37.5447,
        lng: 127.0557
      }
    }
  ];