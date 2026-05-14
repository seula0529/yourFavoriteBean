<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <div class="img-choices">
      <button
        v-for="opt in question.options"
        :key="opt.value"
        class="img-choice-btn"
        :class="{ selected: modelValue === opt.value }"
        @click="$emit('update:modelValue', opt.value)"
      >
        <img :src="opt.img" :alt="opt.label" loading="lazy" />
        <div class="img-label">{{ opt.label }}</div>
        <div class="check-badge">✓</div>
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
  question: Object, // { label, text, options: [{ label, value, img }] }
  modelValue: String,
});
defineEmits(["update:modelValue", "next"]);
</script>

<style scoped>
.q-number {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--accent);
  opacity: 0.55;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.q-text {
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 700;
  color: var(--cream);
  text-align: center;
  line-height: 1.6;
  max-width: 340px;
  margin-bottom: 28px;
  letter-spacing: -0.01em;
  word-break: keep-all;
}

/* ── 이미지 그리드 ── */
.img-choices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

.img-choice-btn {
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  background: rgba(255, 248, 240, 0.04);
  -webkit-appearance: none;
  padding: 0;
}

.img-choice-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}
.img-choice-btn:active img {
  transform: scale(0.97);
}

.img-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 12px 12px;
  background: linear-gradient(to top, rgba(24, 14, 9, 0.92), transparent);
  color: var(--cream);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.img-choice-btn.selected {
  border-color: var(--brown);
  box-shadow: 0 0 0 2px rgba(156, 68, 41, 0.45);
}

.check-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--brown);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.img-choice-btn.selected .check-badge {
  opacity: 1;
  transform: scale(1);
}

.btn-next {
  margin-top: 24px;
}
</style>
