<template>
  <div id="app">
    <div class="bg-layer" />
    <div class="bg-noise" />
    <div class="deco-ring deco-ring-1" />
    <div class="deco-ring deco-ring-2" />
    <div class="deco-ring deco-ring-3" />

    <!-- 뒤로 가기 (질문 화면에서만) -->
    <button
      v-if="currentStep > 0 && currentStep < RESULT_STEP"
      class="btn-back"
      @click="goBack"
    >
      ←
    </button>

    <!-- 진행 단계 표시 -->
    <div
      v-if="currentStep > 0 && currentStep < RESULT_STEP"
      class="step-counter"
    >
      {{ currentStep }} / {{ QUESTIONS.length }}
    </div>

    <!-- 진행 바 -->
    <div class="progress-bar" :style="{ width: progressPercent + '%' }" />

    <div class="slides-wrapper">

      <!-- 0. 커버 -->
      <SlideCover
        :slide-class="slideClass(0)"
        @start="startForm"
      />

      <!-- 1 ~ N. 질문 슬라이드 -->
      <template v-for="(q, i) in QUESTIONS" :key="i">
        <SlideQuestion
          v-if="q.type === 'choice'"
          :slide-class="slideClass(i + 1)"
          :question="q"
          v-model="answers[i]"
          @next="goNext"
        />
        <SlideImageQuestion
          v-else-if="q.type === 'image'"
          :slide-class="slideClass(i + 1)"
          :question="q"
          v-model="answers[i]"
          @next="goNext"
        />
        <SlideTextInput
          v-else-if="q.type === 'input'"
          :slide-class="slideClass(i + 1)"
          :question="q"
          v-model="answers[i]"
          @next="goNext"
        />
      </template>

      <!-- N+1. 결과 (스크린샷 화면) -->
      <SlideResult
        :slide-class="slideClass(RESULT_STEP)"
        :result="result"
        :answer-summary="answerSummary"
        @restart="restart"
      />

    </div>
  </div>
</template>

<script setup>
import SlideCover         from './components/SlideCover.vue'
import SlideQuestion      from './components/SlideQuestion.vue'
import SlideImageQuestion from './components/SlideImageQuestion.vue'
import SlideTextInput     from './components/SlideTextInput.vue'
import SlideResult        from './components/SlideResult.vue'

import { useFormState } from './composables/useFormState.js'

const {
  currentStep,
  answers,
  progressPercent,
  QUESTIONS,
  RESULT_STEP,
  slideClass,
  startForm,
  goNext,
  goBack,
  restart,
  result,
  answerSummary,
} = useFormState()
</script>

<style scoped>
#app {
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.bg-layer {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 90% 55% at 15% 90%, rgba(156, 68, 41, 0.32) 0%, transparent 58%),
    radial-gradient(ellipse 55% 70% at 85% 10%, rgba(180, 110, 70, 0.16) 0%, transparent 52%),
    linear-gradient(168deg, #180e09 0%, #241208 45%, #180e09 100%);
  z-index: 0;
}
.bg-noise {
  position: fixed;
  inset: 0;
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
  z-index: 0;
  pointer-events: none;
}
.deco-ring {
  position: fixed;
  border-radius: 50%;
  border: 1px solid rgba(156, 68, 41, 0.1);
  pointer-events: none;
  z-index: 0;
}
.deco-ring-1 { width: 280px; height: 280px; bottom: -90px;  right: -70px; }
.deco-ring-2 { width: 180px; height: 180px; bottom: -50px;  right: -30px; border-color: rgba(156, 68, 41, 0.07); }
.deco-ring-3 { width: 240px; height: 240px; top:   -100px;  left:  -70px; }

.slides-wrapper {
  position: relative;
  z-index: 1;
  height: 100dvh;
  width: 100vw;
}

.btn-back {
  position: fixed;
  top: max(env(safe-area-inset-top), 14px);
  left: 16px;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(255, 248, 240, 0.07);
  border: 1px solid rgba(255, 248, 240, 0.1);
  color: rgba(255, 248, 240, 0.55);
  font-size: 17px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  -webkit-appearance: none;
  transition: background 0.22s;
}
.btn-back:active { background: rgba(255, 248, 240, 0.14); }

.step-counter {
  position: fixed;
  top: max(env(safe-area-inset-top), 14px);
  right: 16px;
  height: 44px;
  display: flex; align-items: center;
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 13px;
  color: rgba(255, 248, 240, 0.28);
  letter-spacing: 0.08em;
  z-index: 50;
}

.progress-bar {
  position: fixed;
  bottom: 0; left: 0;
  height: 2.5px;
  background: linear-gradient(to right, var(--brown), #e07a50);
  transition: width 0.55s cubic-bezier(0.77, 0, 0.175, 1);
  z-index: 100;
}
</style>