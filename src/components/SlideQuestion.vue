<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>
 
    <!-- 복수선택 안내 -->
    <p v-if="isMulti" class="multi-hint">중복 선택 가능해요</p>
 
    <div class="choices">
      <button
        v-for="(opt, i) in question.options"
        :key="opt.value"
        class="choice-btn"
        :class="{ selected: isSelected(opt.value) }"
        @click="handleClick(opt.value)"
      >
        <span class="choice-key">
          <!-- 단일선택: 알파벳 / 복수선택: 체크 여부 -->
          <template v-if="isMulti">
            {{ isSelected(opt.value) ? '✓' : String.fromCharCode(65 + i) }}
          </template>
          <template v-else>
            {{ String.fromCharCode(65 + i) }}
          </template>
        </span>
        {{ opt.label }}
      </button>
    </div>
 
    <button class="btn-primary btn-next" @click="$emit('next')">
      {{ hasAnswer ? '다음 →' : '건너뛰기' }}
    </button>
  </div>
</template>
 
<script setup>
import { computed } from 'vue'
 
const props = defineProps({
  slideClass: String,
  question:   Object,   // type: 'choice' | 'multi-choice'
  modelValue: [String, Array],
})
const emit = defineEmits(['update:modelValue', 'next'])
 
const isMulti = computed(() => props.question.type === 'multi-choice')
 
// 선택 여부 확인
function isSelected(value) {
  if (isMulti.value) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value)
  }
  return props.modelValue === value
}
 
// 클릭 처리
function handleClick(value) {
  if (isMulti.value) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = current.indexOf(value)
    if (idx === -1) current.push(value)
    else            current.splice(idx, 1)
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', value)
  }
}
 
const hasAnswer = computed(() => {
  if (isMulti.value) return Array.isArray(props.modelValue) && props.modelValue.length > 0
  return !!props.modelValue
})
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
 
/* 복수선택 안내 */
.multi-hint {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--accent);
  opacity: 0.7;
  margin-bottom: 20px;
  letter-spacing: 0.06em;
}
@media (min-width: 768px) { .multi-hint { font-size: 12px; } }
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
