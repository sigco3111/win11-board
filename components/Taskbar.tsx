import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import { SearchIcon } from './icons';

interface TaskbarProps {
  onOpenHelp: () => void;
  onLogout: () => void;
  user: User;
  onStartMenuToggle: () => void;
  isStartMenuOpen: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  onOpenHelp, 
  onLogout, 
  user, 
  onStartMenuToggle,
  isStartMenuOpen
}) => {
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState('');
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const taskbarRef = useRef<HTMLDivElement>(null);

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      setDate(now.toLocaleDateString('ko-KR', { weekday: 'short', month: 'long', day: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (taskbarRef.current && !taskbarRef.current.contains(event.target as Node)) {
        setShowNotificationPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 앱 아이콘 목록
  const appIcons = [
    { name: '파일 탐색기', icon: '📁' },
    { name: '게시판', icon: '📝' },
    { name: '설정', icon: '⚙️' },
    { name: '브라우저', icon: '🌐' },
    { name: '메일', icon: '✉️' },
    { name: '사진', icon: '🖼️' },
  ];

  return (
    <div 
      ref={taskbarRef}
      className="fixed bottom-0 left-0 right-0 h-12 bg-win11-taskbar backdrop-blur-win11 z-50 shadow-win11-taskbar flex items-center justify-between px-2"
    >
      {/* 시작 버튼 및 앱 아이콘 영역 - 중앙 정렬 */}
      <div className="flex-1 flex items-center justify-center space-x-1">
        {/* 시작 버튼 */}
        <button 
          onClick={onStartMenuToggle}
          className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${isStartMenuOpen ? 'bg-white/20' : ''}`}
          aria-label="시작 메뉴"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H8.5V8.5H0V0Z" fill="#0078D4" />
            <path d="M9.5 0H18V8.5H9.5V0Z" fill="#0078D4" />
            <path d="M0 9.5H8.5V18H0V9.5Z" fill="#0078D4" />
            <path d="M9.5 9.5H18V18H9.5V9.5Z" fill="#0078D4" />
          </svg>
        </button>

        {/* 검색 버튼 */}
        <button 
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
          aria-label="검색"
        >
          <SearchIcon className="w-5 h-5 text-white" />
        </button>

        {/* 앱 아이콘들 */}
        {appIcons.map((app, index) => (
          <button 
            key={index}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-xl"
            aria-label={app.name}
          >
            {app.icon}
          </button>
        ))}
      </div>

      {/* 시스템 트레이 영역 - 우측 정렬 */}
      <div className="flex items-center space-x-2 text-white text-sm">
        {/* 알림 패널 버튼 */}
        <button 
          onClick={() => setShowNotificationPanel(!showNotificationPanel)}
          className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${showNotificationPanel ? 'bg-white/20' : ''}`}
          aria-label="알림"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16C9.1 16 10 15.1 10 14H6C6 15.1 6.9 16 8 16ZM14 11V6.5C14 4.01 12.42 1.92 10 1.18V0.5C10 0.22 9.78 0 9.5 0H6.5C6.22 0 6 0.22 6 0.5V1.18C3.58 1.92 2 4.01 2 6.5V11L0 13V14H16V13L14 11Z" fill="currentColor"/>
          </svg>
        </button>

        {/* 사용자 정보 */}
        <div className="flex items-center space-x-1 px-2">
          <button 
            className="w-6 h-6 rounded-full bg-win11-blue flex items-center justify-center text-xs text-white hover:bg-blue-600 transition-colors"
            title="사용자 정보"
          >
            {user.displayName.charAt(0).toUpperCase()}
          </button>
        </div>

        {/* 날짜/시간 */}
        <div className="flex flex-col items-end pr-2">
          <span className="text-xs">{time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="text-xs">{date}</span>
        </div>
      </div>

      {/* 알림 패널 */}
      {showNotificationPanel && (
        <div className="absolute bottom-14 right-2 w-80 bg-win11-window backdrop-blur-win11 rounded-win11-lg shadow-win11-dropdown p-4 border border-win11-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">알림</h3>
            <button 
              onClick={() => setShowNotificationPanel(false)}
              className="text-sm text-win11-blue"
            >
              모두 지우기
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="p-3 bg-white/50 rounded-win11 hover:bg-white/80 transition-colors">
              <div className="font-medium">시스템</div>
              <p className="text-sm">Windows 11 스타일 UI로 업데이트되었습니다.</p>
            </div>
            
            <div className="p-3 bg-white/50 rounded-win11 hover:bg-white/80 transition-colors">
              <div className="font-medium">사용자</div>
              <p className="text-sm">{user.displayName}님, 환영합니다!</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <button 
              onClick={onLogout}
              className="text-sm text-red-500 hover:underline"
            >
              로그아웃
            </button>
            <button 
              onClick={onOpenHelp}
              className="text-sm text-win11-blue hover:underline"
            >
              도움말
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Taskbar; 