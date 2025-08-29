import { Restaurant } from "../types/restaurant.types";
import { useNavigate } from "react-router-dom";
import { loadKakaoMapSDK, getCoordinatesFromAddress } from '../api/kakaoMapApi';
import { searchNaverBlog, cleanBlogTitle, cleanBlogDescription, formatBlogDate } from '../api/naverBlogApi';

export const useThridParty = () => {

  const navigate = useNavigate();

  const handleMapClick = async (restaurant: Restaurant) => {
    try {
      console.log('지도 검색 시작:', restaurant.name);
      
      let coordinates = restaurant.coordinates;
      
      // 좌표가 없으면 주소로 검색
      if (!coordinates && restaurant.address) {
        try {
          await loadKakaoMapSDK(); // SDK 로드
          const coords = await getCoordinatesFromAddress(restaurant.address);
          coordinates = { lat: coords.lat, lng: coords.lng };
        } catch (error) {
          console.log('주소 좌표 변환 실패, 기본 검색으로 진행');
        }
      }
  
      // 지도 페이지로 이동하면서 데이터 전달
      navigate('/restaurant-map', {
        state: {
          restaurant: restaurant,
          coordinates: coordinates,
          searchQuery: restaurant.name,
          address: restaurant.address || restaurant.location
        }
      });
  
      // 부모 컴포넌트에 알림 (선택적)
      // onKakaoMap && onKakaoMap(restaurant);
  
    } catch (error) {
      console.error('지도 처리 실패:', error);
      
      // 에러 발생 시에도 페이지 이동 (검색 기능으로 처리)
      navigate('/restaurant-map', {
        state: {
          restaurant: restaurant,
          coordinates: null,
          error: '위치 정보를 불러오는데 실패했습니다.',
          searchQuery: restaurant.name,
          address: restaurant.address || restaurant.location
        }
      });
    }
  };


  // 블로그 리뷰 버튼 핸들러 - 네이버 블로그 검색 후 페이지 이동
const handleBlogClick = async (restaurant: Restaurant) => {
    try {
      console.log('블로그 검색 시작:', restaurant.name);
      
      const blogData = JSON.parse(localStorage.getItem('blogData') || '{}');
  
      // // 네이버 블로그 검색 API 호출
      // const blogData = await searchNaverBlog({
      //   restaurantName: restaurant.name,
      //   address: restaurant.address,
      //   location: restaurant.location,
      //   display: 20,
      //   sort: 'date' // 최신순으로 정렬
      // });
  
      // 블로그 데이터 전처리
      const cleanedBlogData = {
        ...blogData,
        items: blogData.items.map((item: any) => ({
          ...item,
          title: cleanBlogTitle(item.title),
          description: cleanBlogDescription(item.description),
          postdate: formatBlogDate(item.postdate)
        }))
      };
  
      // 블로그 리뷰 페이지로 이동하면서 데이터 전달
      navigate('/blog-reviews', {
        state: {
          restaurant: restaurant,
          blogData: cleanedBlogData,
          searchQuery: `${restaurant.name} 맛집 리뷰`
        }
      });
  
  
    } catch (error) {
      console.error('블로그 검색 실패:', error);
      
      // 에러 발생 시 기본 검색어로 페이지 이동
      navigate('/blog-reviews', {
        state: {
          restaurant: restaurant,
          blogData: null,
          error: '블로그 검색에 실패했습니다. 다시 시도해주세요.',
          searchQuery: `${restaurant.name} 맛집 리뷰`
        }
      });
    }
  };




  return { handleMapClick, handleBlogClick };
};