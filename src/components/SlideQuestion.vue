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

    <button class="btn-primary btn-next" @click="$emit('next')">
      {{ modelValue ? "다음 →" : "건너뛰기" }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
  question: Object,
  modelValue: String,
});
defineEmits(["update:modelValue", "next"]);
</script>

<style scoped>
.q-number {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--accent);
  opacity: 0.8;
  margin-bottom: 12px;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  .q-number {
    font-size: 18px;
  }
}

.q-text {
  font-family: var(--font-heading2);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.6;
  max-width: 340px;
  margin-bottom: 28px;
  letter-spacing: -0.01em;
  word-break: keep-all;
}
@media (min-width: 768px) {
  .q-text {
    font-size: 30px;
  }
}

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
  background: var(--choice-bg);
  border: 1px solid var(--choice-border);
  border-radius: 3px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  line-height: 1.5;
  word-break: keep-all;
  cursor: pointer;
  transition:
    background 0.22s,
    border-color 0.22s,
    transform 0.2s;
  -webkit-appearance: none;
}
@media (min-width: 768px) {
  .choice-btn {
    font-size: 15px;
  }
}
@media (hover: hover) {
  .choice-btn:hover {
    background: var(--brown-light);
    border-color: var(--brown);
    transform: translateX(3px);
  }
}
.choice-btn:active {
  transform: scale(0.985);
}
.choice-btn.selected {
  background: var(--brown-mid);
  border-color: var(--brown);
}

.choice-key {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--choice-border);
  border-radius: 3px;
  font-family: var(--font-heading1);
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  transition: all 0.22s;
}
@media (min-width: 768px) {
  .choice-key {
    font-size: 12px;
  }
}
.choice-btn.selected .choice-key {
  background: var(--brown);
  border-color: var(--brown);
  color: #fff;
}

.btn-next {
  margin-top: 24px;
}
</style>
