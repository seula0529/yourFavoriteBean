<template>
  <div class="slide" :class="slideClass">
    <p class="q_num">{{ question.label }}</p>
    <p class="q_txt">{{ question.text }}</p>

    <div class="wrap_input">
      <!-- 필드 여러 개 (multi-input) -->
      <template v-if="question.fields">
        <div
          v-for="field in question.fields"
          :key="field.key"
          class="wrap_field"
        >
          <label class="label_field">{{ field.label }}</label>
          <input
            class="inp_form"
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
        class="inp_form"
        type="text"
        :value="modelValue"
        :placeholder="question.placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter="$emit('next')"
      />
    </div>

    <button class="btn_primary btn_next" @click="$emit('next')">다음 →</button>
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
      .closest(".wrap_input")
      .querySelectorAll(".inp_form");
    inputs[idx + 1]?.focus();
  } else {
    emit("next");
  }
}
</script>

<style scoped>
.q_num {
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
  .q_num {
    font-size: 12px;
  }
}

.q_txt {
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
  .q_txt {
    font-size: 22px;
  }
}

.wrap_input {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.wrap_field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label_field {
  font-family: var(--font-heading1), var(----font-heading2);
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 600;
  color: var(--accent);
  opacity: 0.9;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  .label_field {
    font-size: 18px;
  }
}

.inp_form {
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
  .inp_form {
    font-size: 20px;
  }
}
.inp_form::placeholder {
  color: var(--text-muted);
  font-style: italic;
}
.inp_form:focus {
  border-bottom-color: var(--brown);
}

.btn_next {
  margin-top: 28px;
}
</style>
