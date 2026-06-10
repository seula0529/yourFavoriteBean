<template>
  <div class="slide slide_int" :class="slideClass" @click="$emit('next')">
    <!-- 배경 이미지 -->
    <div
      class="bg_int"
      :style="{ backgroundImage: `url(${slide.img})` }"
    />
    <div class="dimed_int" />

    <!-- 콘텐츠 -->
    <div class="content_int">
      <p class="tag_int">{{ slide.tag }}</p>
      <h2 class="txt_int">{{ slide.text }}</h2>
      <p class="subtxt_int" v-if="slide.sub">{{ slide.sub }}</p>
    </div>

    <!-- 탭 유도 -->
    <div class="tap_int">
      <span class="tap_dot" />
      <span class="tap_dot" />
      <span class="tap_dot" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
  slide: Object, // { tag, text, sub, img }
});
defineEmits(["next"]);
</script>

<style scoped>
.slide_int {
  cursor: pointer;
  padding: 0;
  overflow: hidden;
}

.bg_int {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.04);
  transition: transform 8s ease;
  filter: brightness(0.45) saturate(0.8);
}
.slide_int.active .bg_int {
  transform: scale(1);
}

.dimed_int {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(10, 5, 2, 0.88) 0%, transparent 50%),
    linear-gradient(to bottom, rgba(10, 5, 2, 0.55) 0%, transparent 40%);
}

.content_int {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 28px;
  max-width: 480px;
}

.tag_int {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 14px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  margin-bottom: 20px;
}
@media (min-width: 768px) {
  .tag_int {
    font-size: 18px;
  }
}

.txt_int {
  font-family: var(--font-heading2);
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  line-height: 1.45;
  word-break: keep-all;
  margin-bottom: 16px;
  white-space: pre-line;
}
@media (min-width: 768px) {
  .txt_int {
    font-size: 36px;
  }
}

.subtxt_int {
  font-family: var(--font-body);
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  word-break: keep-all;
  white-space: pre-line;
}
@media (min-width: 768px) {
  .subtxt_int {
    font-size: 20px;
  }
}

.tap_int {
  position: absolute;
  bottom: max(env(safe-area-inset-bottom), 36px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}
.tap_dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  animation: pulse 1.6s ease-in-out infinite;
}
.tap_dot:nth-child(2) {
  animation-delay: 0.2s;
}
.tap_dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}
</style>
