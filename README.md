# AI Tutor - Frontend

AI Tutor는 영어 회화 연습을 위해 개발된 음성 기반의 튜터 서비스로 다음 페이지별 테스트 기능을 제공합니다.

## 주요 기능

### 메인 페이지 (`/`)

- 유저 정보 및 보유 멤버십 조회

- 튜터 기능 및 멤버십 구매 기능 접근 가능

- - 튜터 기능 접근 전, 보유한 멤버십 선택 후 입장

- - 무제한 멤버십이 아닌 경우, 보유한 채팅 횟수 차감

### 멤버십 구매 페이지 (`/membership`)

- 개인용(`B2C`) 멤버십: 기본 제공

- 기업용 멤버십: 기업 코드 인증 필요 (모달만 구현된 상태며, 요구사항 밖인 인증 구현은 미제공)

- 사용중인 멤버십 사용중 처리

### GPT 기반 AI 튜터 기능 (`/tutor`)

#### 시작하기 모달 기능

- 입장 시, 시작하기 모달 제공

- - 페이지 마운트 시, 음성 자동 재생은 브라우저 정책에 어긋나기 때문에 사용자 인터랙션 유도를 위해 구현

- 시작하기 모달 언마운트 시, AI 튜터 시작 음성 재생

#### 음성 대화 기능

- 사용자 음성 녹음 및 마이크 Waveform 시각화

- - 음성 녹음 후 취소 + 전송 기능 제공

- 음성 전송 후 사용자 말풍선 및 AI 튜터 응답 말풍선 생성

- 말풍선별 음성 재생

#### 멤버십 소진 안내 기능

- 멤버십 채팅 횟수 소진시 모달 안내 + 마이크 Disabled

### 그 외

- Light/Dark 테마 지원

<br />

## 기술 스택

- **Framework**: Next.js 15+ (App Router)

- **UI**: Chakra UI

- **State**: Zustand

- **Networking**: Axios

- **Etc**: TypeScript, Yarn

<br />

## 설치 및 실행

```bash
# 설치
yarn install

# 빌드
yarn build

# 실행
yarn dev
```

## 환경변수(`.env`)

```bash
# 루트 경로로, 백엔드가 제공하는 정적 파일(url) 접근 시 사용됩니다.
NEXT_PUBLIC_ROOT_URL=http://localhost:3001

# 기본 API 요청 경로입니다.
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 개발 환경에서 로그인 없이 API를 호출하기 위한 테스트용 (만료 8월 17일)JWT 토큰입니다.
NEXT_PUBLIC_TEST_BEARER_TOKEN=eyJhbGc...8Rk
```

<br />

## 디렉토리 구조

```bash
src
├── app
│   ├── layout.tsx
│   ├── membership
│   │   └── page.tsx
│   ├── page.tsx
│   └── tutor
│       └── page.tsx
├── components # 공통 및 페이지 UI 컴포넌트 모음
│   ├── index.ts
│   ├── home
│   │   ├── HomeContainer.tsx
│   │   ├── ...
│   ├── layout
│   │   ├── ThemeToggle.tsx
│   │   ├── ...
│   ├── membership
│   │   ├── MembershipContainer.tsx
│   │   ├── ...
│   └── tutor
│       ├── TutorContainer.tsx
│       ├── ...
├── hooks # 커스텀 훅 모음
│   ├── index.ts
│   ├── useOpenModal.tsx
│   ├── ...
├── lib # API 호출, Axios 인스턴스, 유틸 함수
│   ├── apis
│   │   ├── membership.ts
│   │   ├── tutor.ts
│   │   └── user.ts
│   ├── axios.ts
│   ├── endpoints.ts
│   └── utils.tsx
├── providers
│   ├── index.ts
│   └── Chakra.tsx
├── store
│   └── useUserStore.tsx
├── styles
│   ├── globals.css
│   └── theme.ts
└── types # 공통 타입 및 enum
    ├── chat.ts
    ├── enums.ts
    ├── index.ts
    └── user.ts
17 directories, 43 files
```

<br />

## 데모 자료

### 메인 페이지

![](/public/demo/demo1.png)

### 멤버십 구매

![](/public/demo/demo2.png)

### B2C 고객이 B2B 멤버십 조회 시

![](/public/demo/demo3.png)

### B2B 멤버십 조회

![](/public/demo/demo4.png)

### AI 튜터 입장 전 멤버십 선택

![](/public/demo/demo5.png)

### AI 튜터 기능

![](/public/demo/demo6.png)

### 멤버십 채팅 횟수 소진 시

![](/public/demo/demo7.png)
