/**
 * 게시물 필터링 및 정렬 컴포넌트
 * 게시물 목록을 다양한 기준으로 정렬하고 필터링하는 기능을 제공합니다.
 */
import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface PostFilterBarProps {
  /** 검색어 입력 핸들러 */
  onSearch: (term: string) => void;
  /** 정렬 기준 변경 핸들러 */
  onSort: (sortBy: string) => void;
  /** 필터 변경 핸들러 */
  onFilter: (filter: string) => void;
  /** 현재 검색어 */
  searchTerm: string;
  /** 현재 정렬 기준 */
  currentSort: string;
  /** 현재 필터 */
  currentFilter: string;
}

/**
 * 게시물 필터링 및 정렬 컴포넌트
 */
const PostFilterBar: React.FC<PostFilterBarProps> = ({
  onSearch,
  onSort,
  onFilter,
  searchTerm,
  currentSort = 'newest',
  currentFilter = 'all'
}) => {
  // 검색어 입력 상태
  const [inputValue, setInputValue] = useState(searchTerm);
  
  // 검색어 입력 핸들러
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // 검색어 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };
  
  // 정렬 옵션
  const sortOptions = [
    { value: 'newest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'popular', label: '인기순' },
    { value: 'comments', label: '댓글순' }
  ];
  
  // 필터 옵션
  const filterOptions = [
    { value: 'all', label: '전체' },
    { value: 'today', label: '오늘' },
    { value: 'week', label: '이번 주' },
    { value: 'month', label: '이번 달' }
  ];

  return (
    <div className="flex flex-col p-2 bg-white/50 border-b border-slate-200">
      {/* 검색 폼 */}
      <form onSubmit={handleSearchSubmit} className="flex mb-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="게시물 검색..."
            value={inputValue}
            onChange={handleSearchInput}
            className="w-full h-9 pl-9 pr-4 rounded-win11 bg-white/80 border border-win11-border focus:outline-none focus:border-win11-blue"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        <button
          type="submit"
          className="ml-2 px-3 h-9 bg-win11-blue text-white rounded-win11 hover:bg-win11-blue-dark transition-colors"
        >
          검색
        </button>
      </form>
      
      {/* 정렬 및 필터 옵션 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="text-sm text-slate-600 mr-2">정렬:</label>
          <select
            value={currentSort}
            onChange={(e) => onSort(e.target.value)}
            className="text-sm bg-white/80 border border-slate-200 rounded-win11 py-1 px-2 focus:outline-none focus:border-win11-blue"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <label className="text-sm text-slate-600 mr-2">기간:</label>
          <select
            value={currentFilter}
            onChange={(e) => onFilter(e.target.value)}
            className="text-sm bg-white/80 border border-slate-200 rounded-win11 py-1 px-2 focus:outline-none focus:border-win11-blue"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PostFilterBar; 