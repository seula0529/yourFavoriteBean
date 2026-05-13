<template>
  <div class="slide slide-interlude" :class="slideClass" @click="$emit('next')">

    <!-- 배경 이미지 -->
    <div class="interlude-bg" :style="{ backgroundImage: `url(${slide.img})` }" />
    <div class="interlude-overlay" />

    <!-- 콘텐츠 -->
    <div class="interlude-content">
      <p class="interlude-tag">{{ slide.tag }}</p>
      <h2 class="interlude-text">{{ slide.text }}</h2>
      <p class="interlude-sub" v-if="slide.sub">{{ slide.sub }}</p>
    </div>

    <!-- 탭 유도 -->
    <div class="interlude-tap">
      <span class="tap-dot" />
      <span class="tap-dot" />
      <span class="tap-dot" />
    </div>

  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
  slide: Object,  // { tag, text, sub, img }
})
defineEmits(['next'])
</script>

<style scoped>
.slide-interlude {
  cursor: pointer;
  padding: 0;
  overflow: hidden;
}

/* 배경 이미지 */
.interlude-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.04);
  transition: transform 8s ease;
  filter: brightness(0.45) saturate(0.8);
}
.slide-interlude.active .interlude-bg {
  transform: scale(1);
}

/* 그라디언트 오버레이 */
.interlude-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(24, 14, 9, 0.85) 0%, transparent 50%),
    linear-gradient(to bottom, rgba(24, 14, 9, 0.5) 0%, transparent 40%);
}

/* 텍스트 콘텐츠 */
.interlude-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 28px;
  max-width: 480px;
}

.interlude-tag {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0.8;
}

.interlude-text {
  font-family: var(--font-heading2);
  font-size: 30px;
  font-weight: 700;
  color: var(--cream);
  line-height: 1.45;
  word-break: keep-all;
  margin-bottom: 16px;
}

.interlude-sub {
  font-family: var(--font-body);
  font-size: 16px;
  color: rgba(255, 248, 240, 0.5);
  line-height: 1.7;
  word-break: keep-all;
}

/* 탭 유도 점 */
.interlude-tap {
  position: absolute;
  bottom: max(env(safe-area-inset-bottom), 36px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}
.tap-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(255, 248, 240, 0.35);
  animation: pulse 1.6s ease-in-out infinite;
}
.tap-dot:nth-child(2) { animation-delay: 0.2s; }
.tap-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%       { opacity: 1;    transform: scale(1.3); }
}
</style>