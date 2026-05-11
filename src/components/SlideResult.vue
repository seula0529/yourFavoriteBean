<template>
  <div class="slide result-slide" :class="slideClass">
    <span class="result-icon">☕</span>
    <p class="result-label">Your Coffee Type</p>
    <h2 class="result-title">{{ result.title }}</h2>
    <p class="result-desc">{{ result.desc }}</p>

    <div class="result-answers">
      <h4>내 답변 요약</h4>
      <div
        v-for="(row, i) in answerSummary"
        :key="i"
        class="ans-row"
      >
        <span class="ans-q">{{ row.q }}</span>
        <span class="ans-a">{{ row.a }}</span>
      </div>
    </div>

    <button class="btn-restart" @click="$emit('restart')">
      ↺ &nbsp;다시 시작하기
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass:    String,
  result:        Object,  // { title, desc }
  answerSummary: Array,   // [{ q, a }]
})
defineEmits(['restart'])
</script>

<style scoped>
.result-slide {
  text-align: center;
  /* 결과가 길면 스크롤 */
  justify-content: flex-start;
  overflow-y: auto;
  padding-top: max(env(safe-area-inset-top), 80px);
}

.result-icon {
  font-size: 44px;
  margin-bottom: 18px;
  display: block;
}

.result-label {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 11px;
  letter-spacing: 0.38em;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0.65;
}

.result-title {
  font-family: var(--font-display);
  font-size: clamp(26px, 8vw, 44px);
  font-weight: 400;
  color: var(--cream);
  line-height: 1.15;
  margin-bottom: 14px;
}

.result-desc {
  font-family: var(--font-body);
  color: var(--muted);
  font-size: 14px;
  line-height: 1.75;
  max-width: 320px;
  margin: 0 auto 28px;
  word-break: keep-all;
}

/* ── 답변 요약 카드 ── */
.result-answers {
  background: rgba(255, 248, 240, 0.04);
  border: 1px solid rgba(255, 248, 240, 0.09);
  border-radius: 6px;
  padding: 18px 20px;
  max-width: 400px;
  width: 100%;
  margin: 0 auto 24px;
  text-align: left;
}

.result-answers h4 {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0.6;
}

.ans-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 248, 240, 0.055);
  font-family: var(--font-body);
  font-size: 13px;
}
.ans-row:last-child { border-bottom: none; }
.ans-q { color: rgba(255, 248, 240, 0.38); flex: 1; }
.ans-a { color: var(--cream); font-weight: 700; text-align: right; max-width: 55%; word-break: keep-all; }

/* ── 다시 시작 버튼 ── */
.btn-restart {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  min-height: 48px;
  background: transparent;
  border: 1px solid rgba(255, 248, 240, 0.16);
  color: rgba(255, 248, 240, 0.5);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  border-radius: 1px;
  cursor: pointer;
  transition: all 0.22s;
  margin-bottom: 32px;
  -webkit-appearance: none;
}
.btn-restart:active {
  border-color: var(--brown);
  color: var(--cream);
}
</style>
