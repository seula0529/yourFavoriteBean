<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <div class="input-wrap">
      <!-- 필드 여러 개 (multi-input) -->
      <template v-if="question.fields">
        <div
          v-for="field in question.fields"
          :key="field.key"
          class="field-wrap"
        >
          <label class="field-label">{{ field.label }}</label>
          <input
            class="form-input"
            :type="field.type || 'text'"
            :inputmode="field.inputmode || 'text'"
            :placeholder="field.placeholder"
            :maxlength="field.maxlength"
            :value="modelValue?.[field.key] || ''"
            @input="handleMulti(field.key, $event.target.value)"
            @keydown.enter="focusNext($event, field.key)"
          />
        </div>
      </template>

      <!-- 단일 input (기존 방식) -->
      <input
        v-else
        class="form-input"
        type="text"
        :value="modelValue"
        :placeholder="question.placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter="$emit('next')"
      />
    </div>

    <button class="btn-primary btn-next" @click="$emit('next')">다음 →</button>
  </div>
</template>

<script setup>
const props = defineProps({
  slideClass: String,
  question: Object,
  modelValue: [String, Object], // 단일이면 String, 멀티면 Object
});
const emit = defineEmits(["update:modelValue", "next"]);

function handleMulti(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

function focusNext(e, currentKey) {
  const fields = props.question.fields;
  const idx = fields.findIndex((f) => f.key === currentKey);
  if (idx < fields.length - 1) {
    const inputs = e.target
      .closest(".input-wrap")
      .querySelectorAll(".form-input");
    inputs[idx + 1]?.focus();
  } else {
    emit("next");
  }
}
</script>

<style scoped>
.q-number {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 11px;
  letter-spacing: 0.28em;
  color: var(--accent);
  opacity: 0.7;
  margin-bottom: 16px;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  .q-number {
    font-size: 12px;
  }
}

.q-text {
  font-family: var(--font-heading2);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.6;
  max-width: 340px;
  margin-bottom: 32px;
  letter-spacing: -0.01em;
  word-break: keep-all;
}
@media (min-width: 768px) {
  .q-text {
    font-size: 22px;
  }
}

.input-wrap {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.field-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-family: var(--font-heading1), var(----font-heading2);
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 600;
  color: var(--accent);
  opacity: 0.9;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  .field-label {
    font-size: 18px;
  }
}

.form-input {
  width: 100%;
  padding: 14px 4px;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid var(--choice-border);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 18px; /* iOS zoom 방지 최솟값 */
  font-weight: 400;
  outline: none;
  caret-color: var(--accent);
  border-radius: 0;
  transition: border-color 0.3s;
  -webkit-appearance: none;
}
@media (min-width: 768px) {
  .form-input {
    font-size: 20px;
  }
}
.form-input::placeholder {
  color: var(--text-muted);
  font-style: italic;
}
.form-input:focus {
  border-bottom-color: var(--brown);
}

.btn-next {
  margin-top: 28px;
}
</style>
