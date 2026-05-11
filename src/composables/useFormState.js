// composables/useFormState.js
// 폼 전체 상태·로직을 담당하는 composable
// App.vue에서 한 번 호출하고 각 슬라이드 컴포넌트에 props/emit으로 전달

import { ref, computed } from 'vue'

// ── 질문 데이터 ──────────────────────────────────────────────────────────────
// 질문을 추가하려면 이 배열에만 항목을 추가하면 됩니다.
export const QUESTIONS = [
  {
    type: 'choice',                                  // 텍스트 선택형
    label: 'Question 01',
    text: '아메리카노를 마신다면 샷은 몇 개 넣어 드시나요?',
    options: [
      { label: '싫어요 (없이도 괜찮아요)', value: '없음' },
      { label: '1~2샷',                   value: '1-2샷' },
      { label: '3~4샷',                   value: '3-4샷' },
      { label: '5샷 이상 (진한 맛!)',      value: '5샷+' },
    ],
  },
  {
    type: 'choice',
    label: 'Question 02',
    text: '좋아하는 카페 분위기는?',
    options: [
      { label: '조용하고 아늑한 북카페',  value: '북카페' },
      { label: '루프탑/뷰가 좋은 카페',   value: '루프탑' },
      { label: '감성 인테리어 카페',      value: '감성카페' },
    ],
  },
  {
    type: 'choice',
    label: 'Question 03',
    text: '카페인에 민감한 편인가요?',
    options: [
      { label: '민감해요 (오후엔 디카페인!)', value: '민감' },
      { label: '보통이에요',                 value: '보통' },
      { label: '전혀 안 민감해요',           value: '강함' },
    ],
  },
  {
    type: 'image',                                   // 이미지 선택형
    label: 'Question 04',
    text: '지금 가장 마시고 싶은 커피는?',
    options: [
      { label: '아메리카노',    value: '아메리카노', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop&q=70' },
      { label: '라떼 (우유계열)', value: '라떼',    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop&q=70' },
      { label: '달달한 스무디류', value: '스무디',  img: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=300&h=300&fit=crop&q=70' },
      { label: '차, 허브티',    value: '차',        img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop&q=70' },
    ],
  },
  {
    type: 'input',                                   // 텍스트 입력형
    label: 'Question 05',
    text: '이름 / 닉네임 / MBTI',
    placeholder: '자유롭게 입력해주세요.',
  },
]

// ── 결과 계산 ────────────────────────────────────────────────────────────────
function calcResult(answers) {
  const drink    = answers[3]
  const caffeine = answers[2]

  const titleMap = {
    '아메리카노': caffeine === '강함' ? '블랙 커피 마스터 ☕' : '아메리카노 러버 ☕',
    '라떼':       '밀키 러버 🥛',
    '스무디':     '달콤한 하루 🍓',
    '차':         '여유로운 티 러버 🍵',
  }
  const descMap = {
    '아메리카노': '커피 본연의 맛을 사랑하는 당신. 블랙으로 마셔야 진짜 커피죠.',
    '라떼':       '부드럽고 고소한 밀크 커피가 잘 어울리는 당신. 하루의 위안 같은 존재예요.',
    '스무디':     '달달하고 시원한 음료가 취향인 당신. 카페는 즐거운 공간이에요!',
    '차':         '차 한 잔의 여유를 아는 당신. 커피 대신 차 한 잔으로 하루를 시작해요.',
  }

  return {
    title: titleMap[drink] ?? '커피 탐험가 🗺️',
    desc:  descMap[drink]  ?? '다양한 커피를 즐기는 탐험가형이에요!',
  }
}

// ── Composable ───────────────────────────────────────────────────────────────
export function useFormState() {
  // 슬라이드 인덱스 구조:
  //  0          → Cover
  //  1 ~ Q수    → 질문 슬라이드 (QUESTIONS 배열 길이만큼 자동 생성)
  //  Q수 + 1    → Loading
  //  Q수 + 2    → Result
  const LOADING_STEP = QUESTIONS.length + 1
  const RESULT_STEP  = QUESTIONS.length + 2
  const TOTAL_STEPS  = QUESTIONS.length + 3   // cover + questions + loading + result

  const currentStep = ref(0)
  const answers     = ref(Array(QUESTIONS.length).fill(''))

  // 진행률 (cover=0%, result=100%)
  const progressPercent = computed(() => {
    if (currentStep.value === 0) return 0
    if (currentStep.value >= RESULT_STEP) return 100
    return Math.round((currentStep.value / (TOTAL_STEPS - 2)) * 100)
  })

  // 슬라이드 위치 클래스
  const slideClass = (index) => {
    if (index === currentStep.value) return 'active'
    return index < currentStep.value ? 'above' : 'below'
  }

  // 현재 질문 인덱스 (슬라이드 1 → 질문 0)
  const currentQuestionIndex = computed(() => currentStep.value - 1)

  function startForm() { currentStep.value = 1 }

  function selectAnswer(qIndex, value) {
    answers.value[qIndex] = value
  }

  function goNext() {
    if (currentStep.value >= TOTAL_STEPS - 1) return
    currentStep.value++
    if (currentStep.value === LOADING_STEP) {
      setTimeout(() => { currentStep.value = RESULT_STEP }, 1800)
    }
  }

  function goBack() {
    if (currentStep.value > 0) currentStep.value--
  }

  function restart() {
    answers.value  = Array(QUESTIONS.length).fill('')
    currentStep.value = 0
  }

  // 결과
  const result = computed(() => calcResult(answers.value))

  const answerSummary = computed(() =>
    QUESTIONS.map((q, i) => ({
      q: q.text.length > 16 ? q.text.slice(0, 16) + '…' : q.text,
      a: answers.value[i] || '—',
    }))
  )

  return {
    // 상태
    currentStep,
    answers,
    progressPercent,
    // 상수
    QUESTIONS,
    LOADING_STEP,
    RESULT_STEP,
    TOTAL_STEPS,
    // 메서드
    slideClass,
    currentQuestionIndex,
    startForm,
    selectAnswer,
    goNext,
    goBack,
    restart,
    // 결과
    result,
    answerSummary,
  }
}
