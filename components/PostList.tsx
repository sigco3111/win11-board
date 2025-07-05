import React, { useState } from 'react';
import type { UIPost } from '../src/types';
import PostItem from './PostItem';
import { SearchIcon } from './icons';

interface PostListProps {
  posts: UIPost[];
  selectedPost: UIPost | null;
  onSelectPost: (post: UIPost) => void;
  loading?: boolean;
  error?: React.ReactNode;
  searchTerm?: string;
  onSearch?: (term: string) => void;
}

/**
 * 게시물 목록 컴포넌트
 * 게시물 목록을 표시하고 검색 기능을 제공
 * @param posts 표시할 게시물 배열
 * @param selectedPost 현재 선택된 게시물
 * @param onSelectPost 게시물 선택 시 호출되는 콜백 함수
 * @param loading 로딩 상태 표시 여부
 * @param error 에러 메시지
 * @param searchTerm 검색어
 * @param onSearch 검색 이벤트 핸들러
 */
const PostList: React.FC<PostListProps> = ({ 
  posts, 
  selectedPost, 
  onSelectPost, 
  loading, 
  error,
  searchTerm = '',
  onSearch 
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  /**
   * 검색어 입력 핸들러
   * 입력값이 변경될 때마다 검색 함수 호출
   * @param e 입력 이벤트 객체
   */
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex-shrink-0 bg-white flex flex-col h-full">
      {/* 검색창 */}
      <div className="p-3 border-b border-slate-200">
        <div className="relative flex items-center">
          <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={inputValue}
            onChange={handleSearchInputChange}
            placeholder="게시물 검색..."
            className="w-full py-2 pl-10 pr-4 bg-slate-100 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="게시물 검색"
          />
        </div>
      </div>
      
      {/* 로딩 상태 표시 */}
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        /* 에러 메시지 표시 */
        <div className="text-center text-red-500 p-8">
          {error}
        </div>
      ) : (
        /* 게시물 목록 */
        <ul className="overflow-y-auto flex-grow">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                isSelected={selectedPost && post.id === selectedPost.id}
                onClick={() => onSelectPost(post)}
              />
            ))
          ) : (
            /* 게시물이 없을 때 표시할 메시지 */
            <div className="text-center text-slate-500 p-8">
              {inputValue ? `'${inputValue}'에 대한 검색 결과가 없습니다.` : '게시물이 없습니다.'}
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default PostList;
