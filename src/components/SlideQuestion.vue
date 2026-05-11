<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <div class="choices">
      <button
        v-for="(opt, i) in question.options"
        :key="opt.value"
        class="choice-btn"
        :class="{ selected: modelValue === opt.value }"
        @click="$emit('update:modelValue', opt.value)"
      >
        <span class="choice-key">{{ String.fromCharCode(65 + i) }}</span>
        {{ opt.label }}
      </button>
    </div>

    <button
      class="btn-primary btn-next"
      :disabled="!modelValue"
      @click="$emit('next')"
    >
      다음 →
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
  question:   Object,   // { label, text, options: [{ label, value }] }
  modelValue: String,   // 현재 선택된 값 (v-model 지원)
})
defineEmits(['update:modelValue', 'next'])
</script>

<style scoped>
.q-number {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 12px;
  letter-spacing: 0.28em;
  color: var(--accent);
  opacity: 0.55;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.q-text {
  font-family: var(--font-body);
  font-size: clamp(17px, 4.8vw, 24px);
  font-weight: 700;
  color: var(--cream);
  text-align: center;
  line-height: 1.6;
  max-width: 340px;
  margin-bottom: 28px;
  letter-spacing: -0.01em;
  word-break: keep-all;
}

/* ── 선택지 목록 ── */
.choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 440px;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  min-height: 52px;
  width: 100%;
  background: rgba(255, 248, 240, 0.045);
  border: 1px solid rgba(255, 248, 240, 0.1);
  border-radius: 3px;
  color: var(--cream);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  line-height: 1.5;
  word-break: keep-all;
  cursor: pointer;
  transition: background 0.22s ease, border-color 0.22s ease, transform 0.2s ease;
  backdrop-filter: blur(6px);
  -webkit-appearance: none;
}

/* 마우스 환경에서만 hover */
@media (hover: hover) {
  .choice-btn:hover {
    background: var(--brown-light);
    border-color: rgba(156, 68, 41, 0.5);
    transform: translateX(3px);
  }
}
.choice-btn:active          { transform: scale(0.985); }
.choice-btn.selected        { background: var(--brown-mid); border-color: var(--brown); }

.choice-key {
  flex-shrink: 0;
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 248, 240, 0.2);
  border-radius: 3px;
  font-family: var(--font-heading);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  transition: all 0.22s;
}
.choice-btn.selected .choice-key {
  background: var(--brown);
  border-color: var(--brown);
  color: white;
}

.btn-next { margin-top: 24px; }
</style>
