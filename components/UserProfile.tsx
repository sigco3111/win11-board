/**
 * 사용자 프로필 컴포넌트
 * 사용자의 프로필 정보를 표시하고 관리하는 기능을 제공합니다.
 */
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import WindowControls from './WindowControls';
import { updateProfile } from 'firebase/auth';
import Toast from './Toast';

interface UserProfileProps {
  /** 사용자 정보 */
  user: User;
  /** 프로필 창 닫기 핸들러 */
  onClose: () => void;
  /** 프로필 업데이트 완료 핸들러 */
  onProfileUpdated?: () => void;
}

/**
 * 사용자 프로필 컴포넌트
 */
const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onProfileUpdated }) => {
  // 창 상태 관리
  const [isMaximized, setIsMaximized] = useState(false);
  
  // 프로필 편집 상태
  const [isEditing, setIsEditing] = useState(false);
  
  // 프로필 정보 상태
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  
  // 토스트 메시지 상태
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false
  });
  
  // 사용자 정보가 변경될 때 상태 업데이트
  useEffect(() => {
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
  }, [user]);
  
  // 토스트 메시지 표시 함수
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      message,
      type,
      visible: true
    });
    
    // 3초 후 토스트 메시지 자동 닫기
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // 프로필 업데이트 핸들러
  const handleUpdateProfile = async () => {
    try {
      // Firebase 사용자 객체가 있는지 확인
      if (!user.firebaseUser) {
        showToast('사용자 정보를 업데이트할 수 없습니다.', 'error');
        return;
      }
      
      // Firebase 프로필 업데이트
      await updateProfile(user.firebaseUser, {
        displayName,
        photoURL
      });
      
      showToast('프로필이 업데이트되었습니다.', 'success');
      setIsEditing(false);
      
      // 부모 컴포넌트에 업데이트 알림
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      showToast('프로필 업데이트 중 오류가 발생했습니다.', 'error');
    }
  };
  
  // 편집 취소 핸들러
  const handleCancelEdit = () => {
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    setIsEditing(false);
  };
  
  // 창 최대화/복원 핸들러
  const handleToggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };
  
  // 프로필 이미지 URL 검증 함수
  const isValidImageUrl = (url: string) => {
    if (!url) return true; // 빈 URL은 유효함
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null || url.startsWith('data:image/');
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isMaximized ? '' : 'p-4'}`}>
      <div 
        className={`bg-white/80 backdrop-blur-xl flex flex-col overflow-hidden 
          ${isMaximized ? 'w-full h-full rounded-none' : 'w-[500px] rounded-xl shadow-2xl border border-slate-300/80'}`}
      >
        {/* 헤더 */}
        <header className="flex-shrink-0 h-14 flex items-center px-4 border-b border-slate-200/80">
          <WindowControls 
            onClose={onClose} 
            onMaximize={handleToggleMaximize} 
            isMaximized={isMaximized} 
          />
          <div className="flex-grow text-center">
            <h1 className="font-semibold text-slate-700 select-none">
              사용자 프로필
            </h1>
          </div>
          <div className="w-16"></div>
        </header>
        
        {/* 프로필 내용 */}
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            {/* 프로필 이미지 */}
            <div className="mb-4 relative">
              {photoURL && isValidImageUrl(photoURL) ? (
                <img 
                  src={photoURL} 
                  alt={displayName || '사용자'} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-win11-blue"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 이미지로 대체
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"%3E%3C/path%3E%3Ccircle cx="12" cy="7" r="4"%3E%3C/circle%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-win11-blue flex items-center justify-center text-white text-4xl">
                  {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              
              {/* 편집 모드일 때 이미지 변경 버튼 */}
              {isEditing && (
                <button 
                  className="absolute bottom-0 right-0 bg-win11-blue text-white rounded-full w-8 h-8 flex items-center justify-center"
                  title="프로필 이미지 변경"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
            
            {/* 사용자 이름 */}
            <div className="text-center">
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-xl font-semibold text-center border-b border-win11-blue focus:outline-none px-2 py-1"
                  placeholder="이름을 입력하세요"
                />
              ) : (
                <h2 className="text-xl font-semibold">
                  {displayName || '이름 없음'}
                </h2>
              )}
              <p className="text-slate-500 text-sm mt-1">{user.email || '이메일 없음'}</p>
            </div>
          </div>
          
          {/* 프로필 정보 */}
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3 text-slate-700">프로필 정보</h3>
            
            <div className="space-y-3">
              {/* 이메일 정보 */}
              <div>
                <label className="block text-sm text-slate-500 mb-1">이메일</label>
                <p className="text-slate-700">{user.email || '이메일 없음'}</p>
              </div>
              
              {/* 계정 유형 */}
              <div>
                <label className="block text-sm text-slate-500 mb-1">계정 유형</label>
                <p className="text-slate-700">
                  {user.isAnonymous ? '게스트' : '등록 사용자'}
                  {user.isAnonymous && (
                    <span className="ml-2 text-xs text-red-500">
                      (제한된 기능)
                    </span>
                  )}
                </p>
              </div>
              
              {/* 프로필 사진 URL (편집 모드에서만 표시) */}
              {isEditing && (
                <div>
                  <label className="block text-sm text-slate-500 mb-1">프로필 사진 URL</label>
                  <input
                    type="text"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-win11-blue"
                    placeholder="이미지 URL을 입력하세요"
                  />
                  {photoURL && !isValidImageUrl(photoURL) && (
                    <p className="text-xs text-red-500 mt-1">
                      유효한 이미지 URL이 아닙니다. (jpg, jpeg, png, gif 형식만 지원)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* 계정 관리 */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium mb-3 text-slate-700">계정 관리</h3>
            
            <div className="space-y-2">
              {/* 계정 생성일 */}
              <div>
                <label className="block text-sm text-slate-500 mb-1">가입일</label>
                <p className="text-slate-700">
                  {user.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR')
                    : '정보 없음'}
                </p>
              </div>
              
              {/* 마지막 로그인 */}
              <div>
                <label className="block text-sm text-slate-500 mb-1">최근 로그인</label>
                <p className="text-slate-700">
                  {user.metadata?.lastSignInTime 
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('ko-KR')
                    : '정보 없음'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200/80 flex justify-end">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors mr-2"
              >
                취소
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-win11-blue text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                저장
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-win11-blue text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={user.isAnonymous}
              title={user.isAnonymous ? "게스트 계정은 프로필을 편집할 수 없습니다" : "프로필 편집"}
            >
              {user.isAnonymous ? "편집 불가 (게스트)" : "프로필 편집"}
            </button>
          )}
        </div>
      </div>
      
      {/* 토스트 메시지 */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
};

export default UserProfile; 