
/**
 * 확인 모달 컴포넌트
 * Windows 11 스타일의 확인 대화상자를 제공합니다.
 */
import React, { useState } from 'react';
import WindowControls from './WindowControls';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

/**
 * 확인 모달 컴포넌트
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = '확인',
  cancelButtonText = '취소',
}) => {
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
      aria-labelledby="confirmation-title"
    >
      <div 
        className={`bg-white/80 backdrop-blur-xl flex flex-col overflow-hidden
          ${isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-sm m-4 rounded-xl shadow-win11-window border border-slate-200/80'}`}
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
            <h3 id="confirmation-title" className="font-semibold text-slate-700 select-none">
              {title}
            </h3>
          </div>
          <div className="w-16"></div>
        </div>
        
        {/* 내용 */}
        <div className="flex-grow p-6 text-center flex items-center justify-center">
          <div className="text-sm text-slate-600 leading-relaxed">{message}</div>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200/80 flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-win11 hover:bg-slate-50 transition-colors focus:outline-none"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-win11 hover:bg-red-500 transition-colors focus:outline-none"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
