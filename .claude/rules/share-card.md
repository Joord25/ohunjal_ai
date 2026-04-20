## 공유카드 (ShareCard) — html2canvas 캡처 4대 gotcha

**해당 파일:** [src/components/report/ShareCard.tsx](src/components/report/ShareCard.tsx), [src/components/plan/PlanShareCard.tsx](src/components/plan/PlanShareCard.tsx)

편집 전 반드시 이 규칙 확인. 미리보기는 멀쩡해도 **다운로드/공유 PNG에서만 깨지는 버그**가 반복 발생.

### 1. `flex gap` 미지원 → `marginBottom`/`marginRight` 명시

html2canvas-pro는 flexbox의 `gap` 속성을 캡처 시 반영하지 않음. 미리보기에선 정상, 캡처하면 갭이 0 또는 과도하게 벌어짐.

```tsx
// ❌ 금지
<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
  <p>A</p><p>B</p>
</div>

// ✅ 권장
<div>
  <p style={{ margin: 0, marginBottom: 20 }}>A</p>
  <p style={{ margin: 0 }}>B</p>
</div>
```

### 2. `<p>` 태그 브라우저 디폴트 margin 제거 필수

`<p>`는 User Agent stylesheet 상 `margin: 1em 0` 기본값. html2canvas는 이를 그대로 반영해 의도치 않은 간격 추가.

→ 공유카드 내부 모든 `<p>`에 `margin: 0` 명시. 필요한 간격은 `marginBottom`/`marginTop` 명시.

### 3. iOS Safari `linear-gradient` 누락 → `backgroundColor` solid fallback 병용

iOS Safari에서 html2canvas가 `linear-gradient` backgroundImage를 캡처 못 하는 경우 있음. transparent 폴백 시 흰 배경으로 나옴.

```tsx
// ✅ solid + gradient 동시 지정
style={{
  backgroundColor: mode === "filled" ? "#1B4332" : "transparent",
  backgroundImage: mode === "filled" ? "linear-gradient(...)" : "none",
}}
```

그리고 `html2canvas(el, { backgroundColor: mode === "filled" ? "#1B4332" : null })` 로 캡처 옵션에도 solid 지정.

### 4. 커스텀 폰트 → `document.fonts.ready` 대기 필수

Rubik 등 Google Fonts(`next/font/google`)는 비동기 로드. 폰트 준비 전 캡처하면 폰트 바뀐 채로 저장.

```tsx
if ("fonts" in document) {
  await (document as any).fonts.ready;
}
const canvas = await html2canvas(el, { ... });
```

### 추가 규칙

- **scale: 3** 이상으로 캡처 (Retina 해상도). scale 1이면 트위터/인스타 업로드 시 흐릿
- **useCORS: true** + 외부 이미지는 crossOrigin 속성 명시
- **폰트 일관성**: 웨이트 카드와 러닝 카드 폰트·letterSpacing 통일 (`var(--font-rubik)` 기반)
- **날짜 헤더 제거됨** (회의 2026-04-19/21 대표 지시): 상단 `YY.MM.DD` 삭제, 스탯 중심 깔끔 레이아웃

### 회의 레퍼런스

- 회의 39: 러닝 공유카드 Strava 세로 3스탯 확정
- 회의 64-α: html2canvas gap/p/폰트 로딩 이슈 수정
- 회의 64-η (2026-04-21): 웨이트 카드 Rubik 통일 + gap → marginBottom 마이그레이션
