/**
 * 도움말 모달 컴포넌트
 * Windows 11 스타일의 도움말 창을 제공합니다.
 */
import React, { useState } from 'react';
import WindowControls from './WindowControls';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 도움말 섹션 컴포넌트
 */
const HelpSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-slate-800 mb-3">{title}</h3>
    <ul className="space-y-2 list-disc list-inside text-slate-600">
      {children}
    </ul>
  </div>
);

/**
 * 도움말 모달 컴포넌트
 */
const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  // 창 상태 관리
  const [isMaximized, setIsMaximized] = useState(false);
  
  if (!isOpen) return null;
  
  // 창 최대화/복원 핸들러
  const handleToggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div 
        className={`bg-white/80 backdrop-blur-xl flex flex-col overflow-hidden
          ${isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-lg m-4 rounded-xl shadow-win11-window border border-slate-200/80'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex-shrink-0 h-14 flex items-center px-4 border-b border-slate-200/80">
          <WindowControls 
            onClose={onClose} 
            onMaximize={handleToggleMaximize} 
            isMaximized={isMaximized} 
          />
          <div className="flex-grow text-center">
            <h2 id="help-title" className="font-semibold text-slate-700 select-none">
              사용법 안내
            </h2>
          </div>
          <div className="w-16"></div>
        </div>
        
        {/* 내용 */}
        <div className="flex-grow p-6 space-y-6 overflow-y-auto">
          <HelpSection title="Windows 11 스타일 게시판 사용법">
            <li><strong className="font-semibold text-slate-700">열기:</strong> 바탕화면의 '게시판' 아이콘을 클릭하여 앱을 실행합니다.</li>
            <li><strong className="font-semibold text-slate-700">새 글 작성:</strong> 게시판 좌측 하단의 '새 게시물 작성' 버튼을 누르거나, 상단 메뉴에서 '파일 &gt; 새 게시물...'을 선택하세요.</li>
            <li><strong className="font-semibold text-slate-700">글 선택:</strong> 중앙 목록에서 게시물을 클릭하여 내용을 확인합니다.</li>
            <li><strong className="font-semibold text-slate-700">글 수정/삭제:</strong> 게시물을 선택한 후, 상단 메뉴에서 '편집 &gt; 수정...' 또는 '편집 &gt; 삭제'를 선택하세요.</li>
            <li><strong className="font-semibold text-slate-700">글 이동:</strong> 게시물을 선택한 후, '편집 &gt; 게시물 이동' 메뉴를 통해 다른 카테고리로 옮길 수 있습니다.</li>
            <li><strong className="font-semibold text-slate-700">글 필터링:</strong> 상단의 필터 바를 사용하여 게시물을 검색하거나 정렬할 수 있습니다.</li>
          </HelpSection>
          
          <HelpSection title="Windows 11 바탕화면 사용법">
            <li><strong className="font-semibold text-slate-700">시작 메뉴:</strong> 작업 표시줄 왼쪽의 Windows 아이콘을 클릭하여 시작 메뉴를 엽니다.</li>
            <li><strong className="font-semibold text-slate-700">아이콘 선택:</strong> 바탕화면의 아이콘을 클릭하여 선택합니다.</li>
            <li><strong className="font-semibold text-slate-700">게시판 열기:</strong> '게시판' 아이콘을 클릭하면 게시판 앱이 열립니다.</li>
            <li><strong className="font-semibold text-slate-700">북마크 열기:</strong> '북마크' 아이콘을 클릭하면 북마크된 게시물 목록이 열립니다.</li>
            <li><strong className="font-semibold text-slate-700">프로필 관리:</strong> '프로필' 아이콘을 클릭하여 사용자 프로필을 확인하고 관리할 수 있습니다.</li>
            <li><strong className="font-semibold text-slate-700">설정:</strong> '설정' 아이콘을 클릭하여 앱 설정을 변경할 수 있습니다.</li>
          </HelpSection>
          
          <HelpSection title="단축키">
            <li><strong className="font-semibold text-slate-700">Esc:</strong> 현재 창 닫기</li>
            <li><strong className="font-semibold text-slate-700">Ctrl+N:</strong> 새 게시물 작성</li>
            <li><strong className="font-semibold text-slate-700">Ctrl+F:</strong> 게시물 검색</li>
            <li><strong className="font-semibold text-slate-700">Ctrl+S:</strong> 게시물 저장 (작성/편집 시)</li>
          </HelpSection>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-win11-blue rounded-win11 hover:bg-blue-600 transition-colors focus:outline-none"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;