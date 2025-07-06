import React, { useState, useEffect } from 'react';
import { GoogleIcon, UserIcon } from './icons';
import { useAuth } from '../src/hooks/useAuth';
import type { User } from '../types';

/**
 * 로그인 화면 컴포넌트
 * Google 로그인 및 게스트 로그인 기능을 제공
 */
const LoginScreen: React.FC = () => {
  const [time, setTime] = useState(new Date());
  // onLogin 콜백이 제거되었으므로, user 객체는 더 이상 여기서 직접 사용하지 않습니다.
  const { signInWithGoogle, signInAnonymously, isLoading, error } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  // 시계 업데이트를 위한 타이머 설정
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000); // 30초마다 업데이트
    return () => clearInterval(timer);
  }, []);

  // 에러 메시지 표시 및 자동 제거 처리
  useEffect(() => {
    if (error) {
      setLoginError(error);
      const timer = setTimeout(() => setLoginError(null), 5000); // 5초 후 에러 메시지 제거
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Google 로그인 처리 함수
   * Google 계정을 통한 인증을 수행
   */
  const handleGoogleLogin = async () => {
    try {
      // signInWithGoogle 호출. App.tsx가 useAuth 훅을 통해 상태 변경을 감지.
      await signInWithGoogle();
    } catch (err) {
      console.error('구글 로그인 처리 중 오류:', err);
      // 에러 처리는 useAuth 훅 내부 및 이 컴포넌트의 useEffect에서 처리됩니다.
    }
  };
  
  /**
   * 게스트 로그인 처리 함수
   * 익명 인증을 통한 게스트 로그인을 수행
   * 게스트 사용자는 제한된 기능만 사용 가능
   */
  const handleGuestLogin = async () => {
    try {
      if (signInAnonymously) {
        // Firebase 익명 인증 사용. App.tsx가 useAuth 훅을 통해 상태 변경을 감지.
        await signInAnonymously();
      } else {
        // Firebase가 없는 대체 로직은 현재 아키텍처에서 사용되지 않으므로,
        // 이 부분은 향후 검토 후 제거하거나 수정할 수 있습니다.
        console.warn('Firebase 익명 인증을 사용할 수 없습니다.');
        setLoginError('게스트 로그인을 현재 사용할 수 없습니다.');
      }
    } catch (err) {
      console.error('게스트 로그인 처리 중 오류:', err);
      setLoginError(err instanceof Error ? err.message : '게스트 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black/10 backdrop-blur-2xl">
      {/* 상단 시계 */}
      <div className="fixed top-0 left-0 right-0 h-7 flex items-center justify-end px-4 text-sm font-semibold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
        <span>{time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <div className="flex flex-col items-center space-y-10 text-center">
        <div className="flex items-center space-x-12">
          {/* Google 로그인 버튼 */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleGoogleLogin} 
              className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-transform transform hover:scale-105"
              aria-label="Login with Google"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <GoogleIcon className="w-12 h-12" />
              )}
            </button>
            <span className="text-white font-semibold text-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>Google</span>
          </div>
          
          {/* 게스트 로그인 버튼 */}
          <div className="flex flex-col items-center">
             <button 
              onClick={handleGuestLogin} 
              className="w-24 h-24 rounded-full bg-slate-300 shadow-lg flex items-center justify-center mb-3 focus:outline-none focus:ring-4 focus:ring-slate-400/50 transition-transform transform hover:scale-105"
              aria-label="Login as Guest"
              disabled={isLoading}
              title="게스트는 댓글 작성, 게시물 작성 등 일부 기능이 제한됩니다."
            >
              {isLoading ? (
                <div className="w-12 h-12 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <UserIcon className="w-16 h-16 text-slate-600" />
              )}
            </button>
            <span className="text-white font-semibold text-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>게스트</span>
            <span className="text-white/80 text-xs mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              (기능 제한)
            </span>
          </div>
        </div>
        
        {/* 에러 메시지 */}
        {loginError && (
          <div className="bg-red-500/80 text-white px-6 py-3 rounded-lg shadow-lg">
            <p>{loginError}</p>
          </div>
        )}
      </div>
      
      {/* 안내 메시지 */}
      <div className="absolute bottom-10 text-center text-white font-medium text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
        <p>프로필을 선택하여 로그인하세요.</p>
      </div>
    </div>
  );
};

export default LoginScreen;
