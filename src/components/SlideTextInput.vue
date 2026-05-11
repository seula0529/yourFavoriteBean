<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <div class="input-wrap">
      <input
        class="form-input"
        type="text"
        :value="modelValue"
        :placeholder="question.placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter="$emit('next')"
      >
    </div>

    <button
      class="btn-primary btn-next"
      @click="$emit('next')"
    >
      다음 →
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
  question:   Object,   // { label, text, placeholder }
  modelValue: String,
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

.input-wrap {
  width: 100%;
  max-width: 440px;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 16px 4px;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(255, 248, 240, 0.18);
  color: var(--cream);
  font-family: var(--font-body);
  /* iOS zoom 방지: 16px 미만이면 자동 zoom 됨 */
  font-size: max(16px, 18px);
  font-weight: 400;
  outline: none;
  caret-color: var(--accent);
  border-radius: 0;
  transition: border-color 0.3s;
  -webkit-appearance: none;
}
.form-input::placeholder {
  font-family: var(--font-body);
  color: rgba(255, 248, 240, 0.25);
  font-style: italic;
}
.form-input:focus { border-bottom-color: var(--brown); }

.btn-next { margin-top: 24px; }
</style>
