# WIN11-BOARD 개발 가이드라인

## 프로젝트 개요

### 목적 및 기술 스택
- Windows 11 인터페이스 디자인을 기반으로 한 게시판 시스템 구현
- React와 TypeScript를 사용한 프론트엔드 개발
- Tailwind CSS를 통한 스타일링 및 Windows 11 UI 요소 구현
- Firebase 서비스를 활용한 백엔드 구현 (Authentication, Firestore, Hosting)

### 핵심 기능
- Windows 11 스타일 인터페이스 (작업 표시줄, 시작 메뉴, 창 시스템)
- 게시판 시스템 (카테고리별 게시물, 댓글, 검색 기능)
- 사용자 인증 (Firebase Authentication 활용)
- 마크다운 지원 및 프리뷰 기능

## 프로젝트 구조

### 주요 디렉토리 구조
- `src/components/`: UI 컴포넌트
- `src/hooks/`: 커스텀 React 훅
- `src/services/`: Firebase 연동 서비스
- `src/utils/`: 유틸리티 함수
- `src/types/`: TypeScript 타입 정의
- `public/assets/`: 이미지, 아이콘, 배경화면 등 정적 자원

### 핵심 컴포넌트
- `Desktop.tsx` → Windows 11 데스크탑 환경 구현
- `Taskbar.tsx` (이전 MenuBar.tsx) → Windows 11 작업 표시줄 구현
- `WindowControls.tsx` (이전 TrafficLights.tsx) → 창 제어 버튼 구현
- `BulletinBoard.tsx` → 게시판 컴포넌트
- `StartMenu.tsx` (신규) → Windows 11 시작 메뉴 구현

## 디자인 표준

### Windows 11 디자인 언어 적용
- **필수** Windows 11 Fluent Design System 디자인 원칙 준수
- **금지** macOS 요소(트래픽 라이트, Dock 등) 사용
- **필수** 모든 UI 요소에 둥근 모서리(rounded corners) 적용 - 최소 `rounded-lg` (8px) 이상

### 색상 팔레트
- 주 색상: `#0078D4` (Windows 11 Blue)
- 보조 색상: `#FFFFFF`, `#F3F3F3`, `#E6E6E6`
- 강조 색상: `#60CDFF`, `#005FB8`
- 경고 색상: `#D13438`
- 성공 색상: `#107C10`

### 그림자 및 효과
- 창 그림자: `shadow-lg` (tailwind) 또는 `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);`
- 미카 효과: 반투명한 배경 효과로 `backdrop-filter: blur(20px);` 와 `background-color: rgba(255, 255, 255, 0.8);` 활용
- 아크릴 효과: 깊이감을 주는 반투명 효과로 `backdrop-filter: blur(30px);` 와 `background-color: rgba(255, 255, 255, 0.7);` 활용

### 아이콘 표준
- Fluent 디자인 시스템의 아이콘 사용
- 아이콘 크기: 16px, 20px, 24px, 32px으로 표준화
- 선 두께: 1.5px 권장
- 모서리 반경: 2px 최소

## 컴포넌트 변환 가이드

### macOS에서 Windows 11로의 컴포넌트 매핑
- `TrafficLights.tsx` → `WindowControls.tsx`
  - macOS의 빨강, 노랑, 녹색 버튼을 Windows 11의 최소화, 최대화, 닫기 버튼으로 대체
  - 버튼 위치를 좌측에서 우측으로 변경
  - 버튼 디자인을 Windows 11 스타일로 업데이트

- `MenuBar.tsx` → `Taskbar.tsx`
  - 상단 메뉴 바를 하단 작업 표시줄로 변경
  - 시작 버튼 추가
  - 작업 표시줄 아이콘 정렬 방식 변경 (중앙 정렬 옵션 제공)
  - 시스템 트레이 영역 구현

- `Desktop.tsx`
  - Windows 11 스타일의 데스크탑 환경으로 디자인 업데이트
  - 바탕화면 배경화면을 Windows 11 기본 배경으로 변경
  - 데스크탑 아이콘 스타일 변경

- 신규 컴포넌트: `StartMenu.tsx`
  - Windows 11 스타일의 시작 메뉴 구현
  - 고정됨 앱, 추천 항목, 검색 기능 등 포함
  - 투명 효과와 둥근 모서리 적용

### 모달 및 팝업 디자인
- 모든 모달에 Windows 11 디자인 언어 적용
- 헤더, 본문, 푸터 구조 유지
- 둥근 모서리와 그림자 효과 적용
- 창 제어 버튼(최소화, 최대화, 닫기)을 오른쪽 상단에 배치

## 코딩 표준

### 네이밍 규칙
- 컴포넌트: PascalCase (예: `WindowControls.tsx`)
- 함수 및 변수: camelCase (예: `handleStartMenuClick`)
- 상수: UPPER_SNAKE_CASE (예: `DEFAULT_WALLPAPER`)
- 불린 변수: is, has, can 등으로 시작 (예: `isStartMenuOpen`)

### 컴포넌트 구조
- 기능별로 폴더 분리 (예: `components/taskbar/`, `components/windows/`)
- 컴포넌트 당 하나의 파일
- 관련 컴포넌트 그룹화 (예: 창 관련 컴포넌트들)

### 주석 표준
- 모든 주요 함수와 컴포넌트에 JSDoc 형식의 주석 추가
- 복잡한 로직에 인라인 주석 추가
- 주석은 한국어로 작성하고 명확하게 기능 설명

## 구현 우선순위

### 1단계: 기본 인터페이스 변환
- Windows 11 스타일의 색상 팔레트 및 디자인 변수 설정
- 기본 컴포넌트 변환 (WindowControls, Taskbar)
- 데스크탑 UI 업데이트

### 2단계: 핵심 기능 컴포넌트 변환
- 시작 메뉴 구현
- 창 시스템 업데이트
- 모달 및 팝업 디자인 변경

### 3단계: 고급 기능 및 마무리
- 애니메이션 및 전환 효과 추가
- 반응형 디자인 최적화
- 접근성 개선

## 금지 사항

### 디자인 관련
- **금지** macOS 디자인 요소 사용 (트래픽 라이트, Dock 등)
- **금지** 비표준 색상 팔레트 사용
- **금지** 각진 모서리(sharp corners) 디자인 사용

### 개발 관련
- **금지** 기능 로직 변경 (UI만 변경)
- **금지** 프로젝트 구조 대규모 변경
- **금지** 불필요한 외부 라이브러리 추가

## 의사결정 기준

### 디자인 충돌 시
1. Windows 11 공식 디자인 가이드라인 참조
2. 사용자 경험을 우선시
3. 일관성 유지를 위해 기존 디자인 패턴 고려

### 컴포넌트 구현 우선순위
1. 핵심 UI 요소 (작업 표시줄, 창 제어)
2. 사용자 상호작용 빈도가 높은 컴포넌트
3. 시각적 영향이 큰 요소

## 예시 코드

### Windows 11 스타일 버튼 예시
```tsx
// Windows 11 스타일 버튼 컴포넌트
const Win11Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200";
  
  const variantClasses = {
    primary: "bg-[#0078D4] hover:bg-[#005FB8] text-white",
    secondary: "bg-[#E6E6E6] hover:bg-[#CCCCCC] text-black",
    accent: "bg-[#60CDFF] hover:bg-[#4DB8FF] text-black"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 작업 표시줄 구현 예시
```tsx
// Windows 11 작업 표시줄 컴포넌트
const Taskbar: React.FC<TaskbarProps> = ({ onStartClick, user }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-[rgba(255,255,255,0.8)] backdrop-blur-xl border-t border-[#E6E6E6] flex items-center px-2 z-50">
      {/* 시작 버튼 */}
      <button 
        onClick={onStartClick}
        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#E6E6E6] transition-colors"
      >
        <WindowsIcon className="w-6 h-6 text-[#0078D4]" />
      </button>
      
      {/* 작업 표시줄 앱 아이콘들 */}
      <div className="flex-1 flex items-center justify-center space-x-1">
        {/* 앱 아이콘들 */}
      </div>
      
      {/* 시스템 트레이 */}
      <div className="flex items-center space-x-2">
        {/* 알림, 시간, 날짜 등 */}
      </div>
    </div>
  );
};
```

## 참고 자료

### Windows 11 디자인 가이드
- [Microsoft Fluent Design System](https://www.microsoft.com/design/fluent/)
- [Windows 11 Design Documentation](https://docs.microsoft.com/en-us/windows/apps/design/)

### 유용한 디자인 리소스
- [Windows 11 UI Kit for Figma](https://www.figma.com/community/file/1159947797512072906/Windows-11-UI-Kit)
- [Windows 11 Icon Pack](https://www.figma.com/community/file/1054880700604978823/Windows-11-Icons-Pack) 