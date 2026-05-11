<template>
  <div class="slide loading-slide" :class="slideClass">
    <div class="loader-ring" />
    <p class="loader-text">분석 중...</p>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
})
</script>

<style scoped>
.loading-slide { pointer-events: none; }

.loader-ring {
  width: 46px; height: 46px;
  border: 1.5px solid rgba(255, 248, 240, 0.09);
  border-top-color: var(--brown);
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
  margin: 0 auto 22px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.loader-text {
  font-family: var(--font-body);
  color: rgba(255, 248, 240, 0.4);
  font-size: 14px;
  letter-spacing: 0.18em;
}
</style>
