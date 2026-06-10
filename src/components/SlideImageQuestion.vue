<template>
  <div class="slide" :class="slideClass">
    <p class="q_num">{{ question.label }}</p>
    <p class="q_txt">{{ question.text }}</p>

    <div class="choice_img">
      <button
        v-for="opt in question.options"
        :key="opt.value"
        class="btn_choice_img"
        :class="{ selected: modelValue === opt.value }"
        @click="$emit('update:modelValue', opt.value)"
      >
        <img :src="opt.img" :alt="opt.label" loading="lazy" />
        <div class="label_img">{{ opt.label }}</div>
        <div class="ico_check">✓</div>
      </button>
    </div>

    <button class="btn_primary btn_next" @click="$emit('next')">
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
.q_num {
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
  .q_num {
    font-size: 18px;
  }
}

.q_txt {
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
  .q_txt {
    font-size: 30px;
  }
}

.choice_img {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}
@media (min-width: 768px) {
  .choice_img {
    max-width: 480px;
    gap: 12px;
  }
}

.btn_choice_img {
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  transition:
    border-color 0.25s,
    box-shadow 0.25s;
  background: var(--choice-bg);
  -webkit-appearance: none;
  padding: 0;
}
.btn_choice_img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s;
}
.btn_choice_img:active img {
  transform: scale(0.97);
}

.label_img {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 12px 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
  color: #fff;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
@media (min-width: 768px) {
  .label_img {
    font-size: 13px;
  }
}

.btn_choice_img.selected {
  border-color: var(--brown);
  box-shadow: 0 0 0 2px var(--brown-mid);
}

.ico_check {
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
  color: #fff;
  font-size: 12px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn_choice_img.selected .ico_check {
  opacity: 1;
  transform: scale(1);
}

.btn_next {
  margin-top: 24px;
}
</style>
