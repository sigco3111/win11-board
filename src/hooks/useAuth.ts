/**
 * 인증 관련 커스텀 훅
 * 로그인, 로그아웃 등 인증 관련 기능과 상태를 제공합니다.
 */
import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { 
  signInWithGoogle as signInWithGoogleService, 
  signOut as signOutService,
  signInAnonymously as signInAnonymouslyService,
  mapFirebaseUserToUser,
  getCurrentUser,
  getAuthState
} from '../services/firebase/auth';
import type { User } from '../types';

// 인증 관련 상수
// const LOGOUT_FLAG_KEY = 'mac_board_force_logout'; // 이중 상태 관리 문제로 제거
const AUTH_ERROR_MESSAGES = {
  default: '인증 중 오류가 발생했습니다. 다시 시도해 주세요.',
  network: '네트워크 연결을 확인하고 다시 시도해 주세요.',
  popup_closed: '로그인 창이 닫혔습니다.',
  popup_blocked: '팝업이 차단되었습니다. 브라우저 설정에서 팝업 허용 후 다시 시도해 주세요.',
  timeout: '요청 시간이 초과되었습니다. 다시 시도해 주세요.',
  user_cancelled: '사용자가 로그인을 취소했습니다.',
};

/**
 * 인증 관련 상태와 기능을 제공하는 훅
 * @returns 인증 상태와 인증 관련 함수들
 */
export function useAuth() {
  // 초기 상태 설정
  const [user, setUser] = useState<User | null>(null);
  // 초기 로딩 상태는 true로 설정하여, onAuthStateChanged가 처음 실행될 때까지 로딩 화면을 표시하도록 함
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * 에러 메시지 포맷 함수
   * 에러 코드에 따라 적절한 에러 메시지를 반환합니다.
   */
  const formatErrorMessage = useCallback((error: any): string => {
    if (!error) return AUTH_ERROR_MESSAGES.default;
    
    const errorCode = error.code || '';
    
    if (errorCode.includes('network')) return AUTH_ERROR_MESSAGES.network;
    if (errorCode.includes('popup-closed')) return AUTH_ERROR_MESSAGES.popup_closed;
    if (errorCode.includes('popup-blocked')) return AUTH_ERROR_MESSAGES.popup_blocked;
    if (errorCode.includes('timeout')) return AUTH_ERROR_MESSAGES.timeout;
    if (errorCode.includes('cancelled') || errorCode.includes('cancel')) return AUTH_ERROR_MESSAGES.user_cancelled;
    
    return error.message || AUTH_ERROR_MESSAGES.default;
  }, []);
  
  // 인증 상태 변경 감지
  useEffect(() => {
    console.log('Auth 상태 감지 설정');
    
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        console.log('Firebase 인증 상태 변경 감지:', firebaseUser ? '로그인됨' : '로그아웃됨');
        
        // onAuthStateChanged는 비동기적으로 작동하므로, 여기서 로딩 상태를 직접 제어할 필요가 없음
        if (firebaseUser) {
          // 사용자 정보 매핑
          const mappedUser = mapFirebaseUserToUser(firebaseUser);
          setUser(mappedUser);
          console.log('사용자 정보 설정됨:', mappedUser.displayName);
        } else {
          console.log('사용자 정보 null로 설정');
          setUser(null);
        }
        // onAuthStateChanged가 한번 실행되면, 초기 인증 상태 확인이 완료된 것이므로 로딩 상태를 false로 변경
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        console.error('인증 상태 변경 오류:', error);
        setError(formatErrorMessage(error));
        setIsLoading(false);
      }
    );
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      console.log('Auth 상태 감지 해제');
      unsubscribe();
    };
  }, [formatErrorMessage]);

  /**
   * 구글 로그인 함수
   * @returns Promise<User | null> - 로그인 성공 시 사용자 정보, 실패 시 null
   */
  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      // 로그인 시도 시에는 로딩 상태를 true로 설정하여 UI 피드백을 줌
      setIsLoading(true);
      setError(null);
      const user = await signInWithGoogleService();
      // onAuthStateChanged가 user 상태를 설정하므로, 여기서 별도로 setUser를 호출할 필요가 없음
      // 로딩 상태는 onAuthStateChanged 콜백에서 관리
      return user;
    } catch (err: any) {
      console.error('구글 로그인 오류:', err);
      
      // 사용자가 취소한 경우 무시
      if (err.code === 'auth/popup-closed-by-user' || 
          err.message === '로그인 창이 닫혔습니다. 다시 시도해주세요.' || 
          err.message === '로그인 요청이 취소되었습니다.') {
        setError(null);
      } else {
        setError(formatErrorMessage(err));
      }
      
      setIsLoading(false);
      return null;
    }
  };

  /**
   * 익명 로그인 함수
   * @returns Promise<User | null> - 로그인 성공 시 사용자 정보, 실패 시 null
   */
  const signInAnonymously = async (): Promise<User | null> => {
    try {
      // 로그인 시도 시에는 로딩 상태를 true로 설정하여 UI 피드백을 줌
      setIsLoading(true);
      setError(null);
      const user = await signInAnonymouslyService();
      // onAuthStateChanged가 user 상태를 설정하므로, 여기서 별도로 setUser를 호출할 필요가 없음
      // 로딩 상태는 onAuthStateChanged 콜백에서 관리
      return user;
    } catch (err: any) {
      console.error('익명 로그인 오류:', err);
      setError(formatErrorMessage(err));
      setIsLoading(false);
      return null;
    }
  };

  /**
   * 로그아웃 함수
   */
  const signOut = async (): Promise<void> => {
    try {
      console.log('useAuth: 로그아웃 시작');
      // 로그아웃 시도 시에도 로딩 상태를 true로 설정
      setIsLoading(true);
      await signOutService();
      // onAuthStateChanged가 user를 null로 설정하지만, 즉각적인 UI 반응을 위해 여기서도 설정
      setUser(null);
      console.log('useAuth: 로그아웃 완료');
    } catch (err) {
      console.error('useAuth: 로그아웃 오류:', err);
      setError(formatErrorMessage(err));
      // 오류가 발생해도 강제로 로그아웃
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 에러 초기화 함수
   */
  const clearError = (): void => {
    setError(null);
  };

  return {
    user,
    isAuthenticated: !!user, // user 객체의 존재 여부로 인증 상태를 결정
    isLoading,
    error,
    signInWithGoogle,
    signInAnonymously,
    signOut,
    clearError
  };
} 