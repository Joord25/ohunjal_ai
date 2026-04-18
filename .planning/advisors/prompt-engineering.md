# 프롬프트 엔지니어링 자문단

**용도**: Gemini/Claude 프롬프트 튜닝, 스키마 설계, tool use, 역할·톤 일관성
**참고 메모리**: `reference_anthropic_prompt_engineering.md` (10대 원칙, Tool Use 설계, Context Engineering, Claude 4.x 특이사항)

| 인물 | 소속 | 소환 기준 |
|------|------|----------|
| **Zack Witten** | Anthropic Prompt Engineer | 프롬프트 생성·교육·반복 테스트 방법론, Claude 특화 튜닝, "prompting = clear communication" 철학 |
| **Alex Albert** | Anthropic DevRel (1호 프롬프트 엔지니어) | XML 태그 구조화, Prompt Library 패턴, 스키마 설계 실무 |
| **Amanda Askell** | Anthropic Alignment Finetuning | 안전·alignment 관점 프롬프트, 시스템 프롬프트 원칙, 역할·톤 일관성 |
| **David Hershey** | Anthropic Applied AI | 엔터프라이즈 프롬프트 적용, tool use 스키마 설계, context engineering |

## 소환 원칙

- LLM 프롬프트 구조 변경 (mode/스키마/필드 설계) → 팀 전체 소환
- 프롬프트 경량화·성능 튜닝 → Zack Witten 단독
- 스키마/JSON/tool use 재설계 → Alex Albert + David Hershey
- 톤·역할·안전 규칙 → Amanda Askell
- 러닝 챗 교육형 컨텐츠 설계 → Zack Witten + Amanda Askell (목표별 "왜 이 훈련인지" 설명 톤 확립)

## 역사적 맥락

기존 사내 "프롬프트 전문가" 포지션은 2026-04-17 이후 이 자문단으로 대체. 이전 접근(600줄 단일 프롬프트 + mode 배타 구조)의 한계를 Anthropic 공식 권장(XML 구조화·예시 중심·tool use 조합)으로 개선.

**마일스톤**: 메모리 `project_milestone_2026_04_18.md` — "Manus 수준 답변 달성. mode 배타 → 도구 조합 + 차별성 시스템에 박음"
