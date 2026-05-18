<template>
  <div id="app" :data-theme="theme" :data-direction="direction">

    <div class="bg-layer" />
    <div class="bg-noise" />
    <div class="deco-ring deco-ring-1" />
    <div class="deco-ring deco-ring-2" />
    <div class="deco-ring deco-ring-3" />

    <!-- 우측 상단 토글 (항상 표시) -->
    <button
      class="theme-toggle"
      @click="toggleTheme"
      :title="theme === 'outdoor' ? '실내 모드로 전환' : '실외 모드로 전환'"
    >
      {{ theme === "outdoor" ? "🌙" : "☀️" }}
    </button>

    <!-- 뒤로가기 -->
    <button v-if="currentQuestionNumber" class="btn-back" @click="goBack">
      ←
    </button>

    <!-- 진행 단계 -->
    <div v-if="currentQuestionNumber" class="step-counter">
      {{ currentQuestionNumber }} / {{ questionTotal }}
    </div>

    <!-- 진행 바 -->
    <div class="progress-bar" :style="{ width: progressPercent + '%' }" />

    <div class="slides-wrapper">
      
      <SlideCover
        :slide-class="slideClass(0)"
        @start="startForm"
        @jump="jumpToQ6"
      />


      <template v-for="(slide, i) in SLIDES" :key="i">
        <SlideInterlude
          v-if="slide.type === 'interlude'"
          :slide-class="slideClass(i + 1)"
          :slide="slide"
          @next="goNext"
        />
        <SlideQuestion
          v-else-if="slide.type === 'choice'"
          :slide-class="slideClass(i + 1)"
          :question="slide"
          v-model="answers[i]"
          @next="goNext"
        />
        <SlideImageQuestion
          v-else-if="slide.type === 'image'"
          :slide-class="slideClass(i + 1)"
          :question="slide"
          v-model="answers[i]"
          @next="goNext"
        />
        <SlideTextInput
          v-else-if="slide.type === 'input'"
          :slide-class="slideClass(i + 1)"
          :question="slide"
          v-model="answers[i]"
          @next="goNext"
        />
      </template>

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
import { ref } from "vue";
import SlideCover from "./components/SlideCover.vue";
import SlideInterlude from "./components/SlideInterlude.vue";
import SlideQuestion from "./components/SlideQuestion.vue";
import SlideImageQuestion from "./components/SlideImageQuestion.vue";
import SlideTextInput from "./components/SlideTextInput.vue";
import SlideResult from "./components/SlideResult.vue";
import { useFormState } from "./composables/useFormState.js";

// 기본값: 실외 (밝은 배경)
const theme = ref("outdoor");
function toggleTheme() {
  theme.value = theme.value === "outdoor" ? "indoor" : "outdoor";
}

const {  answers, progressPercent,
  SLIDES, RESULT_STEP, slideClass,
  currentQuestionNumber, questionTotal,
  startForm, goNext, goBack, restart,
  result, userInfo, answerSummary,
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
  background: var(--bg-gradient);
  z-index: 0;
  transition: background 0.4s ease;
}
.bg-noise {
  position: fixed;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
  z-index: 0;
  pointer-events: none;
}
.deco-ring {
  position: fixed;
  border-radius: 50%;
  border: 1px solid var(--deco-color);
  pointer-events: none;
  z-index: 0;
  transition: border-color 0.4s ease;
}
.deco-ring-1 {
  width: 280px;
  height: 280px;
  bottom: -90px;
  right: -70px;
}
.deco-ring-2 {
  width: 180px;
  height: 180px;
  bottom: -50px;
  right: -30px;
  border-color: var(--deco-color2);
}
.deco-ring-3 {
  width: 240px;
  height: 240px;
  top: -100px;
  left: -70px;
}

.slides-wrapper {
  position: relative;
  z-index: 1;
  height: 100dvh;
  width: 100vw;
}

/* ── 토글 버튼 ── */
.theme-toggle {
  position: fixed;
  top: max(env(safe-area-inset-top), 14px);
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--back-bg);
  border: 1px solid var(--back-border);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  -webkit-appearance: none;
  transition:
    background 0.22s,
    transform 0.15s;
}
.theme-toggle:active {
  transform: scale(0.92);
}

/* ── 뒤로가기 ── */
.btn-back {
  position: fixed;
  top: max(env(safe-area-inset-top), 14px);
  left: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--back-bg);
  border: 1px solid var(--back-border);
  color: var(--back-color);
  font-size: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  -webkit-appearance: none;
  transition: background 0.22s;
}
.btn-back:active {
  opacity: 0.7;
}

/* ── 진행 단계: 토글이 우측 차지하므로 가운데로 ── */
.step-counter {
  position: fixed;
  top: max(env(safe-area-inset-top), 14px);
  left: 50%;
  transform: translateX(-50%);
  height: 44px;
  display: flex;
  align-items: center;
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 14px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  z-index: 50;
  transition: color 0.3s;
}

.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 2.5px;
  background: linear-gradient(to right, var(--brown), #e07a50);
  transition: width 0.55s cubic-bezier(0.77, 0, 0.175, 1);
  z-index: 100;
}
</style>
