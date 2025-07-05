import React, { useRef, useEffect } from 'react';
import { SearchIcon } from './icons';
import type { User } from '../types';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, user, onLogout }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 시작 메뉴가 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 핀된 앱 목록
  const pinnedApps = [
    { name: '게시판', icon: '📝', color: 'bg-blue-100' },
    { name: '파일 탐색기', icon: '📁', color: 'bg-yellow-100' },
    { name: '설정', icon: '⚙️', color: 'bg-gray-100' },
    { name: '사진', icon: '🖼️', color: 'bg-green-100' },
    { name: '메일', icon: '✉️', color: 'bg-purple-100' },
    { name: '계산기', icon: '🧮', color: 'bg-red-100' },
    { name: '캘린더', icon: '📅', color: 'bg-orange-100' },
    { name: '메모장', icon: '📓', color: 'bg-teal-100' },
    { name: '날씨', icon: '🌤️', color: 'bg-cyan-100' },
    { name: '음악', icon: '🎵', color: 'bg-pink-100' },
    { name: '스토어', icon: '🛒', color: 'bg-indigo-100' },
    { name: '알람', icon: '⏰', color: 'bg-amber-100' },
  ];

  // 추천 항목 목록
  const recommendedItems = [
    { name: '최근 게시물', icon: '📄', time: '방금 전' },
    { name: '설정', icon: '⚙️', time: '1시간 전' },
    { name: '알림 센터', icon: '🔔', time: '3시간 전' },
    { name: '도움말', icon: '❓', time: '어제' },
  ];

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[640px] bg-win11-window backdrop-blur-win11 rounded-win11-lg shadow-win11-dropdown border border-win11-border z-50 overflow-hidden"
    >
      <div className="p-6">
        {/* 상단 영역: 검색 및 사용자 정보 */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="검색" 
              className="w-full h-10 pl-10 pr-4 rounded-win11 bg-white/80 border border-win11-border focus:outline-none focus:border-win11-blue"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full bg-win11-blue flex items-center justify-center text-white mr-2"
            >
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">
                {user.displayName}
              </div>
              <button 
                onClick={onLogout}
                className="text-xs text-win11-blue hover:underline"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
        
        {/* 핀된 앱 섹션 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">핀된 앱</h3>
          <div className="grid grid-cols-6 gap-2">
            {pinnedApps.map((app, index) => (
              <button 
                key={index} 
                className="flex flex-col items-center p-2 rounded-win11 hover:bg-white/50 transition-colors"
              >
                <div className={`w-10 h-10 ${app.color} rounded-win11 flex items-center justify-center text-2xl mb-1`}>
                  {app.icon}
                </div>
                <span className="text-xs">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* 추천 항목 섹션 */}
        <div>
          <h3 className="text-sm font-medium mb-2">추천 항목</h3>
          <div className="grid grid-cols-2 gap-2">
            {recommendedItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center p-2 rounded-win11 hover:bg-white/50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-win11 flex items-center justify-center text-xl mr-3">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 하단 전원 옵션 */}
      <div className="bg-white/30 p-4 flex justify-end">
        <button 
          onClick={onLogout}
          className="flex items-center text-sm hover:bg-white/50 p-2 rounded-win11 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1ZM8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0ZM4 7.5V8.5H10.5V11L14 8L10.5 5V7.5H4Z" fill="#0078D4"/>
          </svg>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default StartMenu; 