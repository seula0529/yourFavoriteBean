<template>
  <div class="slide result-slide" :class="slideClass">
    <div class="capture-area" ref="captureRef">
      <div class="capture-header">
        <span class="capture-icon">☕</span>
        <div>
          <p class="capture-label">Coffee Survey Result</p>
          <h2 class="capture-title">{{ result.title }}</h2>
        </div>
      </div>

      <p v-if="result.bean" class="capture-bean">{{ result.bean }}</p>

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

    <div class="action-area">
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

      <button
        class="btn-action btn-save"
        :class="{ loading: isSaving }"
        :disabled="isSaving"
        @click="saveImage"
      >
        <span class="btn-icon">{{ isSaving ? '...' : '↓' }}</span>
        <span>{{ isSaving ? '저장 중...' : '이미지로 저장' }}</span>
      </button>

      <button
        class="btn-action btn-sms"
        :class="{ disabled: !phoneNumber }"
        :disabled="!phoneNumber"
        @click="sendSms"
      >
        <span class="btn-icon">✉</span>
        <span>{{ phoneNumber ? '문자로 보내기' : '번호를 입력해주세요' }}</span>
      </button>

      <div v-if="capturedImage" class="ios-preview">
        <p class="ios-hint">이미지를 길게 눌러 저장하거나 공유하세요.</p>
        <img :src="capturedImage" class="preview-img" alt="저장된 결과 이미지">
        <button class="btn-preview-close" @click="capturedImage = null">닫기</button>
      </div>

      <div class="action-divider" />

      <button class="btn-reset" @click="handleReset">
        다음 사람
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  slideClass: String,
  result: {
    type: Object,
    default: () => ({}),
  },
  answerSummary: {
    type: Array,
    default: () => [],
  },
  userName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['restart'])

const captureRef = ref(null)
const capturedImage = ref(null)
const isSaving = ref(false)
const phoneNumber = ref('')

const timestamp = computed(() =>
  new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
)

const visitorName = computed(() => {
  if (!props.userName) return '예약자'
  return props.userName.split('/')[0].trim()
})

function formatPhone(e) {
  let value = e.target.value.replace(/\D/g, '')

  if (value.length <= 3) {
    value = value
  } else if (value.length <= 7) {
    value = `${value.slice(0, 3)}-${value.slice(3)}`
  } else {
    value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
  }

  phoneNumber.value = value
}

function downloadDataUrl(dataUrl) {
  const link = document.createElement('a')
  link.download = 'coffee-result.png'
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  link.remove()
}

async function saveImage() {
  if (isSaving.value) return

  if (!captureRef.value) {
    alert('저장할 결과 영역을 찾을 수 없습니다.')
    return
  }

  isSaving.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 100))

    const canvas = await html2canvas(captureRef.value, {
      backgroundColor: '#1e0f08',
      scale: Math.min(window.devicePixelRatio || 2, 2),
      useCORS: true,
    })

    const dataUrl = canvas.toDataURL('image/png')
    capturedImage.value = dataUrl

    const isMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent)
    if (!isMobile) downloadDataUrl(dataUrl)
  } catch (err) {
    console.error(err)
    alert(`이미지 생성 실패: ${err.message}`)
  } finally {
    isSaving.value = false
  }
}

function openSmsUrl(url) {
  const link = document.createElement('a')
  link.href = url
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function sendSms() {
  if (!phoneNumber.value) return

  const rawPhone = phoneNumber.value.replace(/\D/g, '')
  const message = [
    '[페이버릿빈]',
    `- 예약자명 : ${visitorName.value}`,
    '- 일시 : ',
    '- 장소 : ',
    '',
    '[선호하는 기프트]',
    '1. 드립백',
    '2. 커피쿠폰',
    '원하시는 항목의 숫자를 문자로 보내주세요.',
    '',
    '문자 확인 후 회신 드리겠습니다.',
  ].join('\n')

  const body = encodeURIComponent(message)
  const userAgent = navigator.userAgent.toLowerCase()
  const isIos = /iphone|ipad|ipod/.test(userAgent)
  const isAndroid = /android/.test(userAgent)

  if (isIos) {
    openSmsUrl(`sms:${rawPhone}&body=${body}`)
    return
  }

  if (isAndroid) {
    openSmsUrl(`smsto:${rawPhone}?body=${body}`)

    window.setTimeout(() => {
      if (!document.hidden) {
        openSmsUrl(`sms:${rawPhone}?body=${body}`)
      }
    }, 700)
    return
  }

  openSmsUrl(`sms:${rawPhone}?body=${body}`)
}

function handleReset() {
  phoneNumber.value = ''
  capturedImage.value = null
  emit('restart')
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

.capture-icon {
  font-size: 36px;
  flex-shrink: 0;
}

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

.capture-bean {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--cream);
  line-height: 1.5;
  opacity: 0.85;
}

.capture-divider {
  height: 1px;
  background: rgba(255, 248, 240, 0.1);
  margin: 16px 0;
}

.ans-list {
  list-style: none;
}

.ans-row {
  display: grid;
  grid-template-columns: 22px 1fr auto;
  align-items: baseline;
  gap: 8px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 248, 240, 0.06);
}

.ans-row:last-child {
  border-bottom: none;
}

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

.action-area {
  width: 100%;
  max-width: 420px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.phone-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 2px;
}

.phone-label {
  font-family: var(--font-body);
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--accent);
  opacity: 0.8;
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
  font-size: max(16px, 17px);
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

.btn-action:active:not(:disabled) {
  transform: scale(0.98);
  opacity: 0.85;
}

.btn-action:disabled {
  cursor: not-allowed;
}

.btn-icon {
  font-size: 18px;
}

.btn-save {
  background: var(--brown);
  color: var(--cream);
}

.btn-save.loading {
  opacity: 0.6;
}

.btn-sms {
  background: transparent;
  border: 1px solid rgba(255, 248, 240, 0.18);
  color: var(--cream);
}

.btn-sms.disabled {
  opacity: 0.3;
  border-color: rgba(255, 248, 240, 0.08);
}

.ios-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 248, 240, 0.05);
  border: 1px solid rgba(255, 248, 240, 0.1);
  border-radius: 6px;
}

.ios-hint {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--accent);
  text-align: center;
  word-break: keep-all;
  line-height: 1.5;
}

.preview-img {
  width: 100%;
  display: block;
  border-radius: 4px;
}

.btn-preview-close {
  min-height: 40px;
  border: 1px solid rgba(255, 248, 240, 0.12);
  border-radius: 3px;
  background: transparent;
  color: rgba(255, 248, 240, 0.65);
  font-family: var(--font-body);
  cursor: pointer;
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
  border: 1px solid rgba(255, 248, 240, 0.5);
  color: rgba(255, 248, 240, 0.8);
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
