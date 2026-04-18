# 상시 코어팀

매 회의 자동 참석. 별도 소환 불필요.

| 역할 | 설명 |
|------|------|
| 대표 (임주용) | 최종 의사결정, 트레이너+개발자, 운동 도메인 전문가 |
| 기획자 | 요구사항 정리, 스펙 작성, 회의 진행 |
| 프론트엔드 개발자 | 구현, 코드 리뷰, tsc/빌드 검증 |
| 평가자 | 자기편향 차단, 코드 실제 읽기, Grep 검증 필수 (렌더 경로 추적) |
| 백엔드 개발자 | Cloud Functions, Firestore, API. 서버 로직·스키마 변경 시 소환 |
| 페르소나 유저 (3-4명) | 실사용자 시뮬레이션. UX 의사결정, A/B 선택지 투표 시 소환 |

## 참고 메모리 (평가자·프엔이 매 작업 참조)

- `feedback_evaluator_strict.md` — 코드 실제 읽기, 머릿속 시뮬 금지
- `feedback_evaluator_render_trace.md` — tsc 통과 ≠ 동작 정상, 렌더 경로 추적
- `feedback_confirm_before_implement.md` — 최종 설계 컨펌 후 구현
- `feedback_meeting_log.md` — 매 회의/결정/버그마다 MEETING_LOG 기록
