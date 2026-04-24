# 오운잘 (ohunjal)

AI 기반 개인 맞춤 운동 코칭 PWA. 웨이트 트레이닝·러닝·영양을 대화형으로 설계하고 기록·분석까지 연결합니다.

- **운영:** [ohunjal.com](https://ohunjal.com)
- **호스팅:** Firebase Hosting (`ohunjal` 프로젝트, `us-central1`)
- **플랫폼:** 웹 (폰 프레임 384×824px 데스크톱 / 풀 뷰포트 모바일)

## 기술 스택

- **프론트엔드:** Next.js 16 + React 19 + TypeScript(strict) + TailwindCSS 4
- **백엔드:** Firebase Cloud Functions (Node 22) — `functions/` 디렉토리
- **인증·DB·스토리지:** Firebase Auth (Google 로그인) + Firestore + Storage
- **AI:** Gemini 2.5 Flash (Cloud Functions 경유)
- **결제:** PortOne (KO, KakaoPay 빌링키) · Paddle (비한국어)
- **테스트:** Vitest

## 개발

```bash
npm run dev         # Next.js 개발 서버 (localhost:3000)
npm run build       # 프로덕션 빌드
npm run lint        # ESLint 검사
npm run test        # Vitest 실행
npm run test:watch  # watch 모드
```

**⚠ 로컬 개발 주의:** `npm run dev` 만 실행하면 플랜 생성·코치 메시지가 동작하지 않습니다. 별도 터미널에서 Cloud Functions 에뮬레이터를 띄우세요.

```bash
cd functions && npm run serve   # 빌드 + 에뮬레이터
```

`next.config.ts` 가 개발 모드에서 `/api/*` 를 로컬 에뮬레이터(포트 5001)로 프록시합니다.

## 배포

- **Hosting (클라이언트 변경):** `git push origin main` → GitHub Actions 자동 배포
- **Functions (서버 변경):** `firebase deploy --only functions` (수동)
- **둘 다 포함:** `git push` 먼저 후 `firebase deploy --only functions`

## 환경 변수 (`.env.local`)

모두 `NEXT_PUBLIC_*` (클라이언트 노출 가능):

- Firebase: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`
- Gemini: `GEMINI_API_KEY`
- PortOne: `PORTONE_STORE_ID`, `PORTONE_CHANNEL_KEY`
- Paddle: `PADDLE_ENV`, `PADDLE_CLIENT_TOKEN`, `PADDLE_PRICE_MONTHLY`, `PADDLE_ENABLED`

Cloud Functions 는 `GEMINI_API_KEY` 를 Firebase functions config 로 별도 관리합니다.

## 프로젝트 구조

```
src/
├── app/              # App Router 라우트 (/, /en, /app, /admin, /privacy, /terms)
├── components/       # 6개 도메인: layout/ plan/ workout/ report/ dashboard/ profile/
├── constants/        # 타입·운동 풀·테마·운동 영상 매핑
├── utils/            # Gemini 클라이언트·히스토리·지표·프로필·페이스
├── hooks/            # Safe area·i18n·GPS·알람 신디사이저
└── locales/          # ko.json + en.json (항상 동시 업데이트)

functions/src/        # Cloud Functions (별도 npm 프로젝트)
├── ai/               # coach·nutrition·workout (Gemini)
├── plan/             # session·runningProgram (룰엔진)
├── billing/          # PortOne·Paddle 구독/결제/환불
└── admin/            # 관리자 API
```

## 핵심 문서

- **[CLAUDE.md](./CLAUDE.md)** — 아키텍처·빌드 명령어·주요 패턴·배포 체크리스트
- **[.planning/CURRENT_STATE.md](./.planning/CURRENT_STATE.md)** — 앱 UI/기능 인벤토리 SSOT (화면별 구현 현황)
- **[.planning/MEETING_LOG.md](./.planning/MEETING_LOG.md)** — 회의·결정·버그 기록
- **[.claude/rules/](./.claude/rules/)** — 파일별 편집 규칙 (html2canvas 이슈, GPS 러닝, 러닝 프로그램 등)

## 라이선스

Private (all rights reserved). 문의: support@ohunjal.com
