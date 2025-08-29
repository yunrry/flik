// 개별 맛집 카드 컴포넌트
import { Restaurant } from '../../types/restaurant';
import { SaveMarkIcon } from '../Icons/SvgIcons';

const SavedFlikCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => {
    const getImage = (restaurant: Restaurant): string => {
      if (restaurant.images && restaurant.images.length > 0) {
        return restaurant.images[0];
      }
      if (restaurant.image) {
        return restaurant.image;
      }
      return '/cardImages/marione.png';
    };
  
    return (
      <div className="bg-white overflow-hidden h-28 w-full">
        <div className="flex items-center w-full h-full px-[3%]">
          {/* 이미지 섹션 */}
          <div className="w-[20%] h-[80%] border border-gray-8 rounded-lg flex-shrink-0">
            <img
              src={getImage(restaurant)}
              alt={restaurant.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          {/* 정보 섹션 */}
          <div className="flex-1 p-[3%] flex justify-between items-start">
            <div className="flex-1 p-0">
              {/* 카테고리 */}
              <p className="text-gray-9 text-[10px] font-normal font-['Pretendard'] leading-3 ">
                {restaurant.category || '이탈리아 음식'} · {restaurant.location || restaurant.address}
              </p>
              
              {/* 맛집 이름 */}
              <h3 className="text-gray-3 text-xl font-semibold font-['Pretendard'] leading-normal ">
                {restaurant.name}
              </h3>
              
              {/* 설명 */}
              <p className="text-gray-5 text-[10px] font-normal font-['Pretendard'] leading-3 line-clamp-2 ">
                {restaurant.description}
              </p>
              
              {/* 별점 */}
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-sm mb-0.5 mr-1">★</span>
                <span className="text-gray-3 text-sm font-semibold font-['Pretendard'] leading-normal">{restaurant.rating}</span>
              </div>
            </div>
            
            {/* 북마크 아이콘 */}
            <button className="ml-2">
              <SaveMarkIcon isActive={true} size="lg" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default SavedFlikCard;