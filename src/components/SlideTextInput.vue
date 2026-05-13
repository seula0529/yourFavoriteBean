<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <div class="input-wrap">
      <label class="input-label" for="user-name">이름</label>
      <input
        id="user-name"
        class="form-input"
        type="text"
        :value="formValue.name"
        placeholder="예) 홍길동"
        autocomplete="name"
        @input="updateField('name', $event.target.value)"
        @keydown.enter="focusNext"
      >
    </div>

    <div class="input-wrap">
      <label class="input-label" for="user-age">나이</label>
      <input
        id="user-age"
        ref="ageInput"
        class="form-input"
        type="number"
        :value="formValue.age"
        placeholder="예) 28"
        @input="updateField('age', $event.target.value)"
        @keydown.enter="focusMbti"
      >
    </div>

    <div class="input-wrap">
      <label class="input-label" for="user-mbti">MBTI</label>
      <input
        id="user-mbti"
        ref="mbtiInput"
        class="form-input"
        type="text"
        :value="formValue.mbti"
        placeholder="예) ENFP"
        maxlength="4"
        autocapitalize="characters"
        @input="updateField('mbti', $event.target.value.toUpperCase())"
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
import { computed, ref } from 'vue'

const props = defineProps({
  slideClass: String,
  question: Object,
  modelValue: {
    type: [Object, String],
    default: () => ({ name: '', age: '', mbti: '' }),
  },
})

const emit = defineEmits(['update:modelValue', 'next'])

const ageInput = ref(null)
const mbtiInput = ref(null)

const formValue = computed(() => {
  if (props.modelValue && typeof props.modelValue === 'object') {
    return {
      name: props.modelValue.name || '',
      age: props.modelValue.age || '',
      mbti: props.modelValue.mbti || '',
    }
  }

  return { name: '', age: '', mbti: '' }
})

function updateField(field, value) {
  emit('update:modelValue', {
    ...formValue.value,
    [field]: value,
  })
}

function focusNext() {
  ageInput.value?.focus()
}

function focusMbti() {
  mbtiInput.value?.focus()
}
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 440px;
  margin-bottom: 14px;
}

.input-label {
  flex: 0 0 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  font-family: var(--font-body);
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 600;
  color: var(--accent);
  opacity: 0.65;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  max-width: 240px;
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
