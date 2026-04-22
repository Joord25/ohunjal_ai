#!/bin/bash
# CURRENT_STATE.md 드리프트 알림 훅
# .planning/CURRENT_STATE.md가 마지막 갱신된 이후 5+커밋 쌓였으면
# 다음 대화 컨텍스트에 리마인더 주입.
# 미만이면 조용히 종료.

set -e

[ -f ".planning/CURRENT_STATE.md" ] || exit 0
command -v git >/dev/null 2>&1 || exit 0
command -v jq >/dev/null 2>&1 || exit 0

LAST_SHA=$(git log -1 --format=%H -- .planning/CURRENT_STATE.md 2>/dev/null || true)
[ -z "$LAST_SHA" ] && exit 0

COUNT=$(git rev-list --count "${LAST_SHA}..HEAD" 2>/dev/null || echo 0)
if [ -z "$COUNT" ] || [ "$COUNT" -lt 5 ]; then
  exit 0
fi

COMMITS=$(git log "${LAST_SHA}..HEAD" --pretty=format:"- %s" 2>/dev/null || echo "")

jq -n \
  --arg count "$COUNT" \
  --arg commits "$COMMITS" \
  '{
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: ("[CURRENT_STATE 드리프트] .planning/CURRENT_STATE.md가 마지막 갱신 이후 \($count)개 커밋 누적됨.\n\n누적 커밋:\n\($commits)\n\n규칙: 기능 상태 질문이면 CURRENT_STATE.md 먼저 검증. 주요 변경이면 섹션 갱신 제안. 무관한 요청이면 무시.")
    }
  }'
