<template>
  <div class="slide slide-cover" :class="slideClass">
    <p class="cover-eyebrow">☕ &nbsp;Favorite Bean</p>

    <h1 class="cover-title">
      Favorite
      <em>COFFEE</em>
    </h1>

    <div class="cover-divider" />

    <p class="cover-sub">나에게 어울리는 원두를 찾아드려요</p>

    <button class="btn-primary btn-start" @click="$emit('start')">
      시작하기 &nbsp;›
    </button>
  </div>
</template>

<script setup>
defineProps({ slideClass: String });
defineEmits(["start"]);
</script>

<style scoped>
.slide-cover {
  text-align: center;
}

.cover-eyebrow {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0.8;
}
@media (min-width: 768px) {
  .cover-eyebrow {
    font-size: 24px;
  }
}

.cover-title {
  font-family: var(--font-display);
  font-size: 80px;
  font-weight: 400;
  line-height: 0.88;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}
.cover-title em {
  font-style: italic;
  color: var(--brown);
  display: block;
  font-size: 0.88em;
}
@media (min-width: 768px) {
  .cover-title {
    font-size: 100px;
  }
}

.cover-divider {
  width: 36px;
  height: 1px;
  background: var(--accent);
  opacity: 0.4;
  margin: 18px auto;
}

.cover-sub {
  font-family: var(--font-body);
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 44px;
  letter-spacing: 0.06em;
  line-height: 1.7;
}
@media (min-width: 768px) {
  .cover-sub {
    font-size: 14px;
  }
}

.btn-start {
  font-size: 14px;
  padding: 15px 40px;
}
@media (min-width: 768px) {
  .btn-start {
    font-size: 15px;
  }
}
.btn-start:active {
  opacity: 0.85;
  transform: scale(0.98);
}
</style>
