# TripTailor v2 Frontend

React, TypeScript, Vite 기반의 TripTailor 프론트엔드입니다.

## 실행

```bash
npm install
copy .env.example .env.local
npm run dev
```

`.env.local`의 `VITE_API_BASE_URL`에는 `/api/v1` 앞부분에 해당하는 백엔드 주소를 입력합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

API 주소가 비어 있으면 주요 화면은 데모 데이터로 동작합니다.

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

현재 v2 문서에는 지역 목록 조회 API가 없고 강릉시의 `regionId`만 예시로 공개되어 있어, 여행 생성 화면은 강릉시만 제공합니다. 선호도 API 4개의 상세 요청/응답도 문서가 비어 있어 해당 서비스는 이전 명세와 호환되는 임시 타입으로 분리했습니다.

## 확인

```bash
npm run lint
npm run build
```
