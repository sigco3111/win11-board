import React from 'react';

interface TrafficLightsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

/**
 * macOS 스타일의 창 제어 버튼 (빨강, 노랑, 초록 버튼) 컴포넌트
 * @param onClose 창 닫기 버튼 클릭 시 호출되는 콜백 함수
 * @param onMinimize 창 최소화 버튼 클릭 시 호출되는 콜백 함수
 * @param onMaximize 창 최대화 버튼 클릭 시 호출되는 콜백 함수
 */
const TrafficLights: React.FC<TrafficLightsProps> = ({ onClose, onMinimize, onMaximize }) => {
  return (
    <div className="flex space-x-2">
      {/* 닫기 버튼 (빨간색) */}
      <button 
        aria-label="Close window"
        onClick={onClose} 
        className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50">
      </button>
      
      {/* 최소화 버튼 (노란색) */}
      <button 
        aria-label="Minimize window"
        onClick={onMinimize}
        className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500/50">
      </button>
      
      {/* 최대화 버튼 (초록색) */}
      <button 
        aria-label="Maximize window"
        onClick={onMaximize}
        className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500/50">
      </button>
    </div>
  );
};

export default TrafficLights;
