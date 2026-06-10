<template>
  <div class="slide slide_result" :class="slideClass">
    <!-- 캡처 카드 -->
    <div class="area_capture" ref="captureRef">
      <div class="head_capture">
        <span class="icon_capture">☕</span>
        <div>
          <p class="label_capture">Coffee Survey Result</p>
          <h2 class="tit_capture">{{ result.title }}</h2>
        </div>
      </div>
      <div class="divider_capture" />
      <ul class="list_answer">
        <li v-for="(row, i) in answerSummary" :key="i">
          <span class="answer_num">{{ String(i + 1).padStart(2, "0") }}</span>
          <span class="answer_q">{{ row.q }}</span>
          <span class="answer_a">{{ row.a }}</span>
        </li>
      </ul>
      <div class="divider_capture" />
      <p class="txt_time_capture">{{ timestamp }}</p>
    </div>

    <!-- 액션 영역 -->
    <div class="area_action">
      <div class="wrap_input">
        <label class="label_phone">수신 번호</label>
        <input
          class="inp_phone"
          type="tel"
          inputmode="numeric"
          placeholder="010-0000-0000"
          v-model="phoneNumber"
          @input="formatPhone"
          maxlength="13"
        />
      </div>

      <button
        class="btn_action btn_save"
        :class="{ loading: isSaving }"
        @click="saveImage"
        :disabled="isSaving"
      >
        <span class="btn_icon">{{ isSaving ? "⏳" : "🖼️" }}</span>
        <span>{{ isSaving ? "저장 중..." : "이미지로 저장" }}</span>
      </button>

      <button
        class="btn_action btn_sms"
        :disabled="!phoneNumber"
        @click="sendSms"
      >
        <span class="btn_icon">💬</span>
        <span>{{ phoneNumber ? "문자로 보내기" : "번호를 입력해주세요" }}</span>
      </button>

      <p v-if="showIosHint" class="ios_hint">
        📱 열린 이미지를 길게 눌러 저장해주세요
      </p>

      <div class="divider_action" />

      <button class="btn_reset" @click="handleReset">다음 사람 →</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  slideClass: String,
  result: Object,
  answerSummary: Array,
});
const emit = defineEmits(["restart"]);

const captureRef = ref(null);
const isSaving = ref(false);
const showIosHint = ref(false);
const phoneNumber = ref("");

function formatPhone(e) {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length <= 3) v = v;
  else if (v.length <= 7) v = `${v.slice(0, 3)}-${v.slice(3)}`;
  else v = `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
  phoneNumber.value = v;
}

const timestamp = computed(() =>
  new Date().toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }),
);

async function saveImage() {
  if (isSaving.value) return;
  isSaving.value = true;
  showIosHint.value = false;
  try {
    if (!window.html2canvas) {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      );
    }
    // 현재 테마 배경색 감지
    const bg =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--dark")
        .trim() || "#f5ede0";
    const canvas = await window.html2canvas(captureRef.value, {
      backgroundColor: bg,
      scale: 3,
      useCORS: true,
      logging: false,
    });
    const dataUrl = canvas.toDataURL("image/png");
    const filename = `favorite-bean-${Date.now()}.png`;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos) {
      const win = window.open();
      win.document.write(
        `<img src="${dataUrl}" style="max-width:100%;display:block;margin:auto;">`,
      );
      showIosHint.value = true;
    } else {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    }
  } catch {
    alert("이미지 저장에 실패했어요. 스크린샷을 이용해주세요.");
  } finally {
    isSaving.value = false;
  }
}

function sendSms() {
  if (!phoneNumber.value) return;
  const rawPhone = phoneNumber.value.replace(/-/g, "");
  const lines = [
    `☕ 커피 취향 결과`,
    `유형: ${props.result.title}`,
    `─────────────────`,
    ...props.answerSummary.map((row, i) => `${i + 1}. ${row.q}\n   → ${row.a}`),
    `─────────────────`,
    timestamp.value,
  ];
  const body = encodeURIComponent(lines.join("\n"));
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const sep = isIos ? ";" : "?";
  window.location.href = `sms:${rawPhone}${sep}body=${body}`;
}

function handleReset() {
  phoneNumber.value = "";
  showIosHint.value = false;
  emit("restart");
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
</script>

<style scoped>
.slide_result {
  justify-content: flex-start;
  overflow-y: auto;
  padding-top: max(env(safe-area-inset-top), 52px);
  padding-bottom: max(env(safe-area-inset-bottom), 32px);
  -webkit-overflow-scrolling: touch;
}

/* ── 캡처 카드 ── */
.area_capture {
  width: 100%;
  max-width: 420px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 24px 22px 20px;
}
.head_capture {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.icon_capture {
  font-size: 32px;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .icon_capture {
    font-size: 36px;
  }
}

.label_capture {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 4px;
}
@media (min-width: 768px) {
  .label_capture {
    font-size: 11px;
  }
}

.tit_capture {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: var(--text-primary);
  line-height: 1.2;
}
@media (min-width: 768px) {
  .tit_capture {
    font-size: 24px;
  }
}

.divider_capture {
  height: 1px;
  background: var(--choice-border);
  margin: 16px 0;
}

.list_answer {
  list-style: none;
}
.list_answer li {
  display: grid;
  grid-template-columns: 22px 1fr auto;
  align-items: baseline;
  gap: 8px;
  padding: 9px 0;
  border-bottom: 1px solid var(--choice-border);
}
.list_answer li:last-child {
  border-bottom: none;
}

.answer_num {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 11px;
  color: var(--accent);
  opacity: 0.6;
}

.answer_q {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  word-break: keep-all;
}
@media (min-width: 768px) {
  .answer_q {
    font-size: 13px;
  }
}

.answer_a {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: right;
  word-break: keep-all;
  max-width: 110px;
}
@media (min-width: 768px) {
  .answer_a {
    font-size: 13px;
  }
}

.txt_time_capture {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 11px;
  color: var(--text-muted);
  text-align: right;
}

/* ── 액션 영역 ── */
.area_action {
  width: 100%;
  max-width: 420px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wrap_input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.label_phone {
  font-family: var(--font-heading1);
  font-style: italic;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--accent);
  opacity: 0.7;
  text-transform: uppercase;
}

.inp_phone {
  width: 100%;
  padding: 14px 16px;
  min-height: 52px;
  background: var(--choice-bg);
  border: 1px solid var(--choice-border);
  border-radius: 3px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  outline: none;
  caret-color: var(--accent);
  transition:
    border-color 0.22s,
    background 0.22s;
  -webkit-appearance: none;
}
@media (min-width: 768px) {
  .inp_phone {
    font-size: 17px;
  }
}
.inp_phone::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}
.inp_phone:focus {
  border-color: var(--brown);
  background: var(--card-bg);
}

.btn_action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 52px;
  border-radius: 3px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: none;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.15s;
  -webkit-appearance: none;
}
@media (min-width: 768px) {
  .btn_action {
    font-size: 15px;
  }
}
.btn_action:active:not(:disabled) {
  transform: scale(0.98);
  opacity: 0.85;
}
.btn_action:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.btn_icon {
  font-size: 16px;
}
@media (min-width: 768px) {
  .btn_icon {
    font-size: 18px;
  }
}

.btn_save {
  background: var(--brown);
  color: #fff;
}
.btn_save.loading {
  opacity: 0.6;
}

.btn_sms {
  background: var(--choice-bg);
  border: 1px solid var(--choice-border);
  color: var(--text-primary);
}

.ios_hint {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--accent);
  text-align: center;
  padding: 8px 12px;
  background: var(--brown-light);
  border-radius: 4px;
  word-break: keep-all;
  line-height: 1.5;
}

.divider_action {
  height: 1px;
  background: var(--choice-border);
  margin: 2px 0;
}

.btn_reset {
  width: 100%;
  min-height: 48px;
  background: transparent;
  border: 1px solid var(--choice-border);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.22s;
  -webkit-appearance: none;
}
@media (min-width: 768px) {
  .btn_reset {
    font-size: 14px;
  }
}
.btn_reset:active {
  border-color: var(--brown);
  color: var(--text-secondary);
}
</style>
