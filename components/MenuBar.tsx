import React, { useState, useEffect, useRef } from 'react';
import { AppleIcon, WifiIcon, BatteryIcon, SearchIcon } from './icons';
import type { User } from '../types';

interface MenuBarProps {
  onOpenHelp: () => void;
  onLogout: () => void;
  user: User;
}

/**
 * 상단 메뉴바 컴포넌트
 * macOS 스타일의 메뉴바를 제공하며 시간, 사용자 정보, 도움말 등의 기능을 포함
 * @param onOpenHelp 도움말 모달을 열기 위한 콜백 함수
 * @param onLogout 로그아웃 처리를 위한 콜백 함수
 * @param user 현재 로그인한 사용자 정보
 */
const MenuBar: React.FC<MenuBarProps> = ({ onOpenHelp, onLogout, user }) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 시간 업데이트를 위한 타이머 설정 (1초마다 갱신)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 메뉴 외부 클릭 감지를 위한 이벤트 리스너
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * 메뉴 토글 처리 함수
   * 같은 메뉴를 클릭하면 닫히고, 다른 메뉴를 클릭하면 해당 메뉴가 열림
   * @param menu 토글할 메뉴 이름
   */
  const handleMenuToggle = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };
  
  /**
   * 메뉴 항목 클릭 처리 함수
   * 지정된 액션을 실행하고 메뉴를 닫음
   * @param action 실행할 액션 함수
   */
  const handleMenuAction = (action?: (() => void) | undefined) => {
    if (action) {
      console.log('MenuBar: 메뉴 액션 호출됨');
      action();
    }
    setActiveMenu(null);
  };

  /**
   * 로그아웃 처리 함수
   * 로그아웃 이벤트를 상위 컴포넌트로 전달
   */
  const handleLogout = () => {
    console.log('MenuBar: 로그아웃 함수 호출됨');
    onLogout();
  };

  // 메뉴 항목 정의
  const menuItems = [
    { 
      name: '이동', 
      items: [
        { label: 'AI 테크 허브', action: () => window.open('https://tech-toolkit-hub.vercel.app/', '_blank', 'noopener,noreferrer'), disabled: false },
        { label: '데브캔버스', action: () => window.open('https://dev-canvas-pi.vercel.app/', '_blank', 'noopener,noreferrer'), disabled: false }
      ] 
    },
    { 
      name: '도움말', 
      items: [{ label: '사용법 보기', action: onOpenHelp, disabled: false }] 
    },
  ];

  // Apple 메뉴 항목 정의
  const appleMenuItems = [
    { label: '이 Mac에 관하여', action: () => {}, disabled: true },
    { isSeparator: true },
    { label: '로그아웃...', action: handleLogout, disabled: false }
  ];

  // 사용자 상태에 따른 표시 이름 설정
  const displayName = user.isAnonymous ? '게스트' : user.displayName;

  return (
    <div 
        ref={menuRef}
        className="fixed top-0 left-0 right-0 h-7 bg-white/20 backdrop-blur-lg z-50 flex items-center justify-between px-4 text-sm font-semibold text-white"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
    >
      {/* 왼쪽 메뉴 영역 */}
      <div className="flex items-center space-x-4">
        {/* Apple 메뉴 */}
        <div className="relative">
          <button onClick={() => handleMenuToggle('apple')} className="transition-opacity hover:opacity-80">
            <AppleIcon className="w-5 h-5 text-white fill-current" />
          </button>
          {activeMenu === 'apple' && (
            <div className="absolute left-0 mt-1.5 w-56 bg-white/80 backdrop-blur-xl rounded-md shadow-2xl ring-1 ring-black/5 py-1">
              {appleMenuItems.map((item, index) => (
                item.isSeparator ? <div key={`sep-${index}`} className="h-px bg-gray-900/10 my-1 mx-1" /> :
                 <button
                  key={item.label}
                  onClick={() => handleMenuAction(item.action)}
                  disabled={item.disabled}
                  className={`w-full text-left px-3 py-1 text-black text-sm ${item.disabled ? 'text-gray-400' : 'hover:bg-blue-500 hover:text-white'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* 앱 이름 */}
        <b className="font-bold">Finder</b>
        
        {/* 동적 메뉴 항목들 */}
        {menuItems.map(menu => (
          <div key={menu.name} className="relative">
            <button onClick={() => handleMenuToggle(menu.name)} className={`px-2 py-0.5 rounded ${activeMenu === menu.name ? 'bg-white/30' : 'hover:bg-white/20'}`}>
              {menu.name}
            </button>
            {activeMenu === menu.name && menu.items.length > 0 && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white/80 backdrop-blur-xl rounded-md shadow-2xl ring-1 ring-black/5 py-1">
                {menu.items.map(item => (
                   <button
                    key={item.label}
                    onClick={() => handleMenuAction(item.action)}
                    disabled={item.disabled}
                    className={`w-full text-left px-3 py-1 text-black text-sm ${item.disabled ? 'text-gray-400' : 'hover:bg-blue-500 hover:text-white'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 오른쪽 상태 표시 영역 */}
      <div className="flex items-center space-x-4">
        {/* 사용자 정보 및 로그아웃 버튼 */}
        <div className="flex items-center space-x-2">
          <span className="font-medium">{displayName}</span>
          <button 
            onClick={handleLogout} 
            className="bg-red-500/20 hover:bg-red-500/40 text-white rounded px-2 py-0.5 text-xs"
            title="로그아웃"
          >
            로그아웃
          </button>
        </div>
        
        {/* 시스템 아이콘 */}
        <BatteryIcon className="w-5 h-5"/>
        <WifiIcon className="w-4 h-4" />
        <SearchIcon className="w-4 h-4" />
        
        {/* 날짜 및 시간 */}
        <span>{time.toLocaleDateString('ko-KR', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
        <span>{time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default MenuBar;
