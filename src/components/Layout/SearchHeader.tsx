import React from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { BackArrowIcon } from '../Icons/SvgIcons';

interface SearchHeaderProps {
  handleBack: () => void;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  handleBack,
  searchTerm,
  handleSearchChange,
}) => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300"
      style={{
        height: 'var(--header-height-search)'
      }}
    >
      <div className="pt-header-default flex items-center justify-between p-4 border-b border-gray-100, space-x-[15%]">
        {/* 뒤로가기 버튼 */}
        <button 
          onClick={handleBack}
          className="mr-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <BackArrowIcon size="lg" color="outline-gray-1"  />
        </button>

        {/* 검색 입력창 */}
        <div className="flex-1">
          <div className="h-9 flex-row rounded-3xl border border-gray-8 flex items-center justify-start px-3">
            <Search size={16} className="text-gray-9 text-xs font-medium font-['Pretendard'] leading-normal mr-2" />
            <input
              type="text"
              placeholder="장소, 매장명을 입력해주세요"
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 bg-transparent outline-none text-gray-9 text-xs font-medium font-['Pretendard'] leading-normal placeholder:text-gray-9"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;