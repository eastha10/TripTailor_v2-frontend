# TripTailor v2 Frontend

React, TypeScript, Vite 기반의 TripTailor 프론트엔드입니다.

## 실행

```bash
npm install
npm run dev
```

개발 서버는 `/api` 요청을 Vite 프록시를 통해 아래 Cloud Run 백엔드로 전달합니다. 운영 빌드에서는 같은 주소를 Axios의 기본 URL로 직접 사용합니다.

```dotenv
VITE_API_BASE_URL=https://triptailor-backend-206035909634.asia-northeast3.run.app
```

다른 백엔드를 사용할 때만 `.env.local`에서 `VITE_API_BASE_URL`을 덮어쓰면 됩니다. 값에는 `/api/v1` 앞부분까지만 입력합니다. API 요청에 실패하면 데모 데이터로 대체하지 않고 오류를 표시합니다.

## 주요 경로

- `/`: 홈 및 여행 생성
- `/login`, `/signup`: 로그인과 회원가입
- `/mypage`: 내 여행 목록
- `/trips/:tripId`: 여행 상세와 일정 관리
- `/trip/:inviteCode`: 공개 초대 조회 → 로그인/회원가입 → 초대 수락 → 선호도 제출

라우트 정의는 `src/router.tsx`, Axios 공통 설정과 인증 갱신은 `src/services/http.ts`에서 관리합니다. 각 API는 `src/services`의 도메인별 모듈로 분리되어 있습니다.

## 인증과 배포

- v2 명세에 따라 Access/Refresh Token은 브라우저 탭의 `sessionStorage`에만 보관합니다.
- Axios가 Bearer 헤더를 붙이고, 401 응답 시 한 번만 토큰 갱신을 수행합니다.
- 로그아웃 및 갱신 요청은 v2 명세대로 `refreshToken`을 요청 본문에 전달합니다.
- 운영 환경에서는 HTTPS와 서버 측 CSP, `X-Content-Type-Options`, 클릭재킹 방지 헤더를 적용해야 합니다.
- 백엔드 배포 시 명세에 적힌 `config/setting.py`의 `FRONTEND_BASE_URL`을 실제 프론트엔드 주소로 변경해야 초대 URL이 올바르게 생성됩니다.

여행 생성 화면은 인증 없이 `GET /api/v1/regions/`에서 지역 목록을 받아 선택합니다. 목록을 불러오지 못했거나 비어 있으면 여행 생성 버튼이 비활성화되고 오류를 표시합니다. 선호도 폼과 응답 타입은 v2 OpenAPI 명세의 예산·숙소 선택값 및 응답 구조를 따릅니다.

## 확인

```bash
npm run lint
npm run build
```
