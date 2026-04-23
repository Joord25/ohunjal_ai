#!/bin/bash
# 새 세션 시작 시 CURRENT_STATE.md 메타정보를 컨텍스트에 자동 주입.
# - 마지막 갱신 시점
# - 갱신 이후 커밋 누적 수
# - 위치 안내
#
# drift 5+커밋이면 추가 경고. 드리프트 미만이면 짧게 안내만.

set -e

[ -f ".planning/CURRENT_STATE.md" ] || exit 0
command -v git >/dev/null 2>&1 || exit 0
command -v jq >/dev/null 2>&1 || exit 0

# 마지막 수정 시점 (git 기준 — 디스크 mtime 보다 정확)
LAST_SHA=$(git log -1 --format=%H -- .planning/CURRENT_STATE.md 2>/dev/null || true)
[ -z "$LAST_SHA" ] && exit 0

LAST_DATE=$(git log -1 --format=%ad --date=format:'%Y-%m-%d %H:%M KST' "$LAST_SHA" 2>/dev/null || echo "unknown")
COUNT=$(git rev-list --count "${LAST_SHA}..HEAD" 2>/dev/null || echo 0)

if [ "$COUNT" -ge 5 ]; then
  STATUS="⚠ 드리프트 ${COUNT}커밋 — 갱신 검토 권장"
elif [ "$COUNT" -gt 0 ]; then
  STATUS="${COUNT}커밋 누적 (안전 범위)"
else
  STATUS="최신 상태"
fi

jq -n \
  --arg date "$LAST_DATE" \
  --arg status "$STATUS" \
  '{
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: ("[앱 상태 SSOT] .planning/CURRENT_STATE.md\n- 마지막 갱신: \($date)\n- 상태: \($status)\n\n규칙: 기능 동작·정책·UI 위치 관련 질문엔 이 문서 먼저 확인. 추측 금지.")
    }
  }'
