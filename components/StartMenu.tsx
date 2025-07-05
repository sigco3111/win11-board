import React, { useRef, useEffect } from 'react';
import type { User } from '../types';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onOpenBoard: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenBookmarks: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onLogout,
  onOpenBoard,
  onOpenSettings,
  onOpenHelp,
  onOpenBookmarks
}) => {
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

  // 메뉴 항목 클릭 핸들러 - 기능 실행 후 시작 메뉴 닫기
  const handleMenuItemClick = (action: () => void) => {
    action();
    onClose();
  };

  // 시작 메뉴가 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 고정됨 앱 목록 (기능 있는 것만 유지)
  const pinnedApps = [
    { name: '게시판', icon: '📝', color: 'bg-blue-100', onClick: onOpenBoard },
    { name: '북마크', icon: '🔖', color: 'bg-yellow-100', onClick: onOpenBookmarks },
  ];

  // 추천 항목 목록 (기능 있는 것만 유지)
  const recommendedItems = [
    { name: '설정', icon: '⚙️', time: '1시간 전', onClick: onOpenSettings },
    { name: '도움말', icon: '❓', time: '어제', onClick: onOpenHelp },
  ];

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[640px] bg-win11-window backdrop-blur-win11 rounded-win11-lg shadow-win11-dropdown border border-win11-border z-50 overflow-hidden"
    >
      <div className="p-6">
        {/* 상단 영역: 사용자 정보 */}
        <div className="flex justify-end items-center mb-6">
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
        
        {/* 고정됨 앱 섹션 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">고정됨</h3>
          <div className="grid grid-cols-6 gap-2">
            {pinnedApps.map((app, index) => (
              <button 
                key={index} 
                onClick={() => handleMenuItemClick(app.onClick)}
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
                onClick={() => handleMenuItemClick(item.onClick)}
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