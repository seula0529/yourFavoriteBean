<template>
  <div class="slide result-slide" :class="slideClass">

    <!-- 캡처 카드 -->
    <div class="capture-area" ref="captureRef">
      <div class="capture-header">
        <span class="capture-icon">☕</span>
        <div>
          <p class="capture-label">Coffee Survey Result</p>
          <h2 class="capture-title">{{ result.title }}</h2>
        </div>
      </div>
      <div class="capture-divider" />
      <ul class="ans-list">
        <li v-for="(row, i) in answerSummary" :key="i" class="ans-row">
          <span class="ans-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="ans-q">{{ row.q }}</span>
          <span class="ans-a">{{ row.a }}</span>
        </li>
      </ul>
      <div class="capture-divider" />
      <p class="capture-time">{{ timestamp }}</p>
    </div>

    <!-- 액션 영역 -->
    <div class="action-area">

      <!-- 전화번호 입력 -->
      <div class="phone-input-wrap">
        <label class="phone-label">수신 번호</label>
        <input
          class="phone-input"
          type="tel"
          inputmode="numeric"
          placeholder="010-0000-0000"
          v-model="phoneNumber"
          @input="formatPhone"
          maxlength="13"
        >
      </div>

      <!-- 이미지 저장 -->
      <button class="btn-action btn-save" :class="{ loading: isSaving }" @click="saveImage" :disabled="isSaving">
        <span class="btn-icon">{{ isSaving ? '⏳' : '🖼️' }}</span>
        <span>{{ isSaving ? '저장 중...' : '이미지로 저장' }}</span>
      </button>

      <!-- 문자로 보내기 (번호 있을 때만 활성) -->
      <button
        class="btn-action btn-sms"
        :class="{ disabled: !phoneNumber }"
        :disabled="!phoneNumber"
        @click="sendSms"
      >
        <span class="btn-icon">💬</span>
        <span>{{ phoneNumber ? '문자로 보내기' : '번호를 입력해주세요' }}</span>
      </button>

      <!-- 이미지 저장 안내 -->
      <div v-if="capturedImage" class="ios-preview">
        <p class="ios-hint">이미지를 길게 눌러 저장하세요</p>
        <img :src="capturedImage" class="preview-img">
        <button @click="capturedImage = null">닫기</button>
      </div>

      <div class="action-divider" />

      <button class="btn-reset" @click="handleReset">
        다음 사람 →
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas' 

const props = defineProps({
  slideClass:    String,
  result:        Object,
  answerSummary: Array,
  userName:      String,
})
const emit = defineEmits(['restart'])

const capturedImage  = ref(null)
const isSaving    = ref(false)
const showIosHint = ref(false)
const phoneNumber = ref('')

// 전화번호 자동 하이픈 포맷
function formatPhone(e) {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length <= 3)        v = v
  else if (v.length <= 7)   v = `${v.slice(0,3)}-${v.slice(3)}`
  else                      v = `${v.slice(0,3)}-${v.slice(3,7)}-${v.slice(7,11)}`
  phoneNumber.value = v
}

const timestamp = computed(() =>
  new Date().toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
)

// ── 이미지 저장 ──────────────────────────────────────────────────────────────
async function saveImage() {
  if (isSaving.value) return
  isSaving.value = true
  
  try {
    // 캡처 전 레이아웃 깨짐 방지를 위해 약간의 대기
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(captureRef.value, {
      backgroundColor: '#1e0f08',
      scale: 2, // 3은 모바일에서 무거울 수 있음
      useCORS: true,
      allowTaint: true,
    });

    const dataUrl = canvas.toDataURL('image/png');
    
    // iOS/Android 가리지 않고 안전하게 이미지 객체로 변환해서 보여주기
    capturedImage.value = dataUrl;
    
    // PC라면 즉시 다운로드 실행
    if (!/iphone|ipad|ipod|android/i.test(navigator.userAgent)) {
      const link = document.createElement('a');
      link.download = `coffee-result.png`;
      link.href = dataUrl;
      link.click();
    }
  } catch (err) {
    console.error(err);
    alert('이미지 생성 실패: ' + err.message);
  } finally {
    isSaving.value = false;
  }
}

// ── 문자 보내기 ──────────────────────────────────────────────────────────────
const visitorName = computed(() => {
  if (!props.userName) return '예약자'
  return props.userName.split('/')[0].trim()
})

function sendSms() {
  if (!phoneNumber.value) return
  
  // 숫자만 추출
  const rawPhone = phoneNumber.value.replace(/-/g, '')
  
  // 요청하신 양식 구성
  const messageLines = [
    `[페이버릿]`,
    `- 예약자명 : ${visitorName.value}`,
    `- 일시 : `,
    `- 장소 : `, // 장소는 고정값이 아니면 변수로 처리 가능합니다.
    ``,
    `[선호하는 기프트]`,
    `1. 드립백`,
    `2. 커피쿠폰`,
    `원하는 항목의 숫자를 문자로 보내주세요!`,
    ``,
    `문자 확인 시 회신 부탁드립니다.`,
    `회신 시 예약이 확정됩니다.`
  ]
  
  const body = encodeURIComponent(messageLines.join('\n'))
  
  // 기기별 구분자 처리 (iOS는 ; 안드로이드는 ?)
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const sep = isIos ? '&' : '?' 
  
  /** * 중요: 일부 최신 기기에서는 번호 뒤에 바로 구분자가 와야 합니다.
   * 주소 형식: sms:01012345678?body=메시지내용
   */
  window.location.href = `sms:${rawPhone}${sep}body=${body}`
}

// ── 리셋 (번호도 초기화) ──────────────────────────────────────────────────────
function handleReset() {
  phoneNumber.value  = ''
  showIosHint.value  = false
  emit('restart')
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src; s.onload = resolve; s.onerror = reject
    document.head.appendChild(s)
  })
}
</script>

<style scoped>
.result-slide {
  justify-content: flex-start;
  overflow-y: auto;
  padding-top: max(env(safe-area-inset-top), 52px);
  padding-bottom: max(env(safe-area-inset-bottom), 32px);
  -webkit-overflow-scrolling: touch;
}

/* ── 캡처 카드 ── */
.capture-area {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 248, 240, 0.07);
  border: 1px solid rgba(255, 248, 240, 0.15);
  border-radius: 12px;
  padding: 24px 22px 20px;
}
.capture-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.capture-icon { font-size: 36px; flex-shrink: 0; }
.capture-label {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  text-transform: uppercase;
  opacity: 0.65;
  margin-bottom: 4px;
}
.capture-title {
  font-family: var(--font-display);
  font-size: clamp(18px, 5vw, 26px);
  font-weight: 400;
  color: var(--cream);
  line-height: 1.2;
}
.capture-divider {
  height: 1px;
  background: rgba(255, 248, 240, 0.1);
  margin: 16px 0;
}
.ans-list { list-style: none; }
.ans-row {
  display: grid;
  grid-template-columns: 22px 1fr auto;
  align-items: baseline;
  gap: 8px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 248, 240, 0.06);
}
.ans-row:last-child { border-bottom: none; }
.ans-num {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 11px;
  color: var(--accent);
  opacity: 0.5;
}
.ans-q {
  font-family: var(--font-body);
  font-size: 12px;
  color: rgba(255, 248, 240, 0.45);
  line-height: 1.4;
  word-break: keep-all;
}
.ans-a {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  color: var(--cream);
  text-align: right;
  word-break: keep-all;
  max-width: 110px;
}
.capture-time {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 11px;
  color: rgba(255, 248, 240, 0.28);
  text-align: right;
}

/* ── 액션 영역 ── */
.action-area {
  width: 100%;
  max-width: 420px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── 전화번호 입력 ── */
.phone-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 2px;
}
.phone-label {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--accent);
  opacity: 0.65;
  text-transform: uppercase;
}
.phone-input {
  width: 100%;
  padding: 14px 16px;
  min-height: 52px;
  background: rgba(255, 248, 240, 0.05);
  border: 1px solid rgba(255, 248, 240, 0.15);
  border-radius: 3px;
  color: var(--cream);
  font-family: var(--font-body);
  font-size: max(16px, 17px); /* iOS zoom 방지 */
  font-weight: 700;
  letter-spacing: 0.08em;
  outline: none;
  caret-color: var(--accent);
  transition: border-color 0.22s;
  -webkit-appearance: none;
}
.phone-input::placeholder {
  color: rgba(255, 248, 240, 0.2);
  font-weight: 400;
  letter-spacing: 0.04em;
}
.phone-input:focus {
  border-color: var(--brown);
  background: rgba(255, 248, 240, 0.07);
}

/* ── 버튼 공통 ── */
.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 52px;
  border-radius: 3px;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  -webkit-appearance: none;
}
.btn-action:active:not(:disabled) { transform: scale(0.98); opacity: 0.85; }
.btn-action:disabled { cursor: not-allowed; }
.btn-icon { font-size: 18px; }

.btn-save { background: var(--brown); color: var(--cream); }
.btn-save.loading { opacity: 0.6; }

.btn-sms {
  background: transparent;
  border: 1px solid rgba(255, 248, 240, 0.18);
  color: var(--cream);
}
/* 번호 미입력 시 흐리게 */
.btn-sms.disabled {
  opacity: 0.3;
  border-color: rgba(255, 248, 240, 0.08);
}

.ios-hint {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--accent);
  text-align: center;
  padding: 8px 12px;
  background: rgba(200, 144, 106, 0.1);
  border-radius: 4px;
  word-break: keep-all;
  line-height: 1.5;
}

.action-divider {
  height: 1px;
  background: rgba(255, 248, 240, 0.07);
  margin: 2px 0;
}

.btn-reset {
  width: 100%;
  min-height: 48px;
  background: transparent;
  border: 1px solid rgba(255, 248, 240, 0.1);
  color: rgba(255, 248, 240, 0.35);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.22s;
  -webkit-appearance: none;
}
.btn-reset:active {
  border-color: rgba(255, 248, 240, 0.25);
  color: rgba(255, 248, 240, 0.7);
}
</style>