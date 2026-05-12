<template>
  <div class="slide slide-cover" :class="slideClass">
    <p class="cover-eyebrow">☕&nbsp;Coffee Bean Survey</p>

    <h1 class="cover-title">
      Favorite
      <em>COFFEE BEAN</em>
    </h1>

    <div class="cover-divider" />

    <p class="cover-sub">나만의 커피 원두 취향을 알아봐요</p>

    <button class="btn-primary btn-start" @click="$emit('start')">
      시작하기 &nbsp;›
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,   // 'active' | 'above' | 'below'
})
defineEmits(['start'])
</script>

<style scoped>
.slide-cover { text-align: center; }

.cover-eyebrow {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 22px;
  opacity: 0.8;
}

.cover-title {
  font-family: var(--font-display);
  font-size: 80px;
  font-weight: 400;
  line-height: 0.85;
  color: var(--cream);
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}
.cover-title em {
  font-family: inherit;
  /* font-style: italic; */
  color: var(--brown);
  display: block;
  /* letter-spacing: 0.02em; */
}

.cover-divider {
  width: 36px;
  height: 1px;
  background: var(--accent);
  opacity: 0.4;
  margin: 20px auto;
}

.cover-sub {
  font-family: var(--font-body);
  color: var(--muted);
  font-size: 16px;
  margin-bottom: 44px;
  letter-spacing: 0.06em;
  line-height: 1.7;
}

.btn-start {
  padding: 15px 38px;
  font-size: 15px;
}
.btn-start:active { opacity: 0.85; transform: scale(0.98); }
</style>
