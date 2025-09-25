// 개별 맛집 카드 컴포넌트
import { SaveMarkIcon } from '../Icons/SvgIcons';
import { useNavigate } from 'react-router-dom';
import { SpotDetail } from '../../types/spot.types';
import { translateCategory } from '../../utils/categoryMapper';
import { formatAddress } from '../../utils/formater';

const SavedFlikCard: React.FC<{ spot: SpotDetail }> = ({ spot }) => {
    const navigate = useNavigate();

    const getImage = (spot: SpotDetail): string => {
      if (spot.imageUrls && spot.imageUrls.length > 0) {
        return spot.imageUrls[0];
      }
      return '/cardImages/marione.png';
    };

    const handleCardClick = () => {
        // navigate 시 spot 정보를 state로 전달
        console.log('네비게이션 시도:', spot); //
        navigate(`/save/${spot.id}`, {
          state: { spotDetail: spot }
        });
      };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 이벤트 전파 방지
        console.log('삭제 버튼 클릭:', spot.id);
      };
  
    return (
      <div className="flex bg-white overflow-hidden h-28 ">
        <div className="flex items-center w-full h-full">
        <div className="flex items-center w-full h-full px-[3%] relative cursor-pointer"
            onClick={handleCardClick} // onClick 핸들러 변경
        >
          {/* 이미지 섹션 */}
          <div className="w-[20%] h-[80%] border border-gray-8 rounded-lg flex-shrink-0">
            <img
              src={getImage(spot)}
              alt={spot.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          {/* 정보 섹션 */}
          <div className="flex-1 w-[80%] p-[3%] flex justify-between items-start">
            <div className="flex-1 p-0">
              {/* 카테고리 */}
              <p className="text-gray-9 text-[10px] font-normal font-['Pretendard'] leading-3 ">
              {translateCategory(spot.category)} · {formatAddress(spot.address || '')}
              </p>
              
              {/* 맛집 이름 */}
              <h3 className="text-gray-3 text-xl font-semibold font-['Pretendard'] leading-normal ">
                {spot.name}
              </h3>
              
              {/* 설명 */}
              <p className="text-gray-5 text-[10px] font-normal font-['Pretendard'] leading-3 line-clamp-2 pr-[10%]">
                {spot.description}
              </p>
              
              {/* 별점 */}
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-sm mb-0.5 mr-1">★</span>
                <span className="text-gray-3 text-sm font-semibold font-['Pretendard'] leading-normal">{spot.rating}</span>
              </div>
            </div>
            
            {/* 북마크 아이콘 */}
            </div>
          </div>
          <button className="absolute right-[5%] lg:right-[25%] translate-y-[-130%]"
          onClick={handleDeleteClick}>
              <SaveMarkIcon isActive={true} size="lg" />
            </button>
        </div>
        
      </div>
    );
  };

  export default SavedFlikCard;