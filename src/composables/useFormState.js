import { ref, computed } from "vue";

// ── 슬라이드 정의 ─────────────────────────────────────────────────────────────
// type: 'interlude' | 'choice' | 'image' | 'input'
// 설문 흐름: 커버 → 설명 → Q → 설명 → Q → ... → 결과
export const SLIDES = [
  // ── 설명 1: 커피는 소통의 언어 ──
  {
    type: "interlude",
    tag: "What is Coffee?",
    text: '"커피 한 잔 하자"는\n이제 소통의 언어예요.',
    sub: "단순한 음용을 넘어, 커피는 사람과 사람을 잇는 매개가 되었어요.",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=70&fit=crop",
  },

  // ── Q1. 커피를 좋아하는 이유 ──
  {
    type: "choice",
    label: "Question 01",
    text: "커피, 왜 마시게 됐나요?",
    options: [
      { label: "☀️  눈 뜨려고 (각성 효과)", value: "각성" },
      { label: "💬  누군가와 함께하는 시간에", value: "소통" },
      { label: "☕  그냥 맛이 좋아서", value: "맛" },
      { label: "😌  혼자만의 여유가 필요해서", value: "여유" },
      { label: "🚫  커피는 잘 안 마셔요", value: "비음용" },
    ],
  },

  // ── 설명 2: 원두마다 매력이 달라요 ──
  {
    type: "interlude",
    tag: "Bean and I",
    text: "사람마다 매력이 다르듯\n원두마다 향도 다 달라요.",
    sub: "나에게 맞는 원두를 찾으면, 커피가 완전히 다르게 느껴져요.",
    img: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=70&fit=crop",
  },

  // ── Q2. 좋아하는 원두 향 ──
  {
    type: "choice",
    label: "Question 02",
    text: "어떤 향의 커피가 끌리나요?",
    options: [
      { label: "🍋  상큼하고 과일향 나는 커피", value: "과일향" },
      {
        label: "🌸  은은한 꽃향기가 마치 차를 마시는 것같은 커피",
        value: "플로럴",
      },
      {
        label: "🌰  구수하고 묵직한 견과류·다크 초콜릿향 커피",
        value: "견과류향",
      },
      { label: "🤷  잘 모르겠고 그냥 탄 맛만 아니면 되요", value: "모름" },
    ],
  },

  // ── Q3. 나의 카페 최애 음료는? (이미지 선택) ──
  {
    type: "image",
    label: "Question 03",
    text: "나의 카페 최애 음료는?",
    options: [
      {
        label: "커피",
        value: "커피",
        img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=300&h=300&auto=format&fit=crop",
      },
      {
        label: "논카페인 라떼",
        value: "논카페인 라떼",
        img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        label: "프라페, 스무디",
        value: "프라페, 스무디",
        img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        label: "아이스티, 에이드",
        value: "아이스티, 에이드",
        img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300&h=300",
      },
    ],
  },

  // ── 설명 3: 카페 트렌드 ──
  {
    type: "interlude",
    tag: "Cafe Trend",
    text: "요즘 카페, 단순히\n커피만 마시는 곳이 아니에요.",
    sub: "공방·드로잉·오마카세·홈카페까지, 취향을 찾아가는 게 트렌드예요.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=70&fit=crop",
  },

  // ── Q4. 어떤 컨셉의 카페 ──
  {
    type: "choice",
    label: "Question 04",
    text: "어떤 컨셉의 카페를 찾아가나요?",
    options: [
      { label: "🍽️  카페 오마카세·취향 큐레이션", value: "오마카세" },
      { label: "🎨  체험·공방형 (드로잉, 베이킹 등)", value: "체험형" },
      { label: "🐾  테마형 (애견, 식물, 보드게임 등)", value: "테마형" },
      { label: "📚  조용한 작업·독서 카페", value: "작업형" },
      { label: "✨  분위기·인테리어 감성 카페", value: "감성형" },
    ],
  },

  // ── Q5. 누구와 함께 ──
  {
    type: "choice",
    label: "Question 05",
    text: "카페는 주로 누구와 함께 가나요?",
    options: [
      { label: "🧍  혼자", value: "혼자" },
      { label: "👫  연인과", value: "연인" },
      { label: "👯  친구와", value: "친구" },
      { label: "💼  동료·비즈니스", value: "동료" },
      { label: "👨‍👩‍👧  가족과", value: "가족" },
    ],
  },

  // ── 설명 4: 나에게 맞는 원두를 찾아드려요 ──
  {
    type: "interlude",
    tag: "What is your Bean",
    text: "나에게 어울리는 원두를\n찾아드릴게요.",
    sub: "소중한 자료로 쓸 수 있도록 도와주신 베타테스터께\n드립백 또는 커피쿠폰을 드려요 ☕",
    img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=70&fit=crop",
  },

  // ── Q6. 이름 / 나이 / MBTI ──
  {
    type: "input",
    label: "Question 06",
    text: "이름 · 나이 · MBTI를 알려주세요",
    fields: [
      {
        key: "name",
        label: "이름",
        placeholder: "홍길동",
        type: "text",
        inputmode: "text",
      },
      {
        key: "age",
        label: "나이",
        placeholder: "28",
        type: "number",
        inputmode: "numeric",
        maxlength: 3,
      },
      {
        key: "mbti",
        label: "MBTI",
        placeholder: "ENFP",
        type: "text",
        inputmode: "text",
        maxlength: 4,
      },
    ],
  },
];

// ── 결과 계산 ─────────────────────────────────────────────────────────────────
function calcResult(answers) {
  // answers 인덱스: 설명 슬라이드는 건너뜀 → 질문만 추출
  const qAnswers = getQuestionAnswers(answers);
  const drink = qAnswers[2]; // Q3
  const aroma = qAnswers[1]; // Q2

  const titleMap = {
    아메리카노: "블랙 커피 마스터 ☕",
    라떼: "밀키 러버 🥛",
    스무디: "달콤한 하루 🍓",
    차: "여유로운 티 러버 🍵",
  };
  const beanMap = {
    과일향: "에티오피아 예가체프",
    플로럴: "케냐 AA",
    견과류향: "브라질 세하도",
    모름: "나에게 맞는 원두를 한번 찾아보시는건 어떨까요?",
  };

  return {
    title: titleMap[drink] ?? "커피 탐험가 🗺️",
    bean: beanMap[aroma] ?? "다양한 원두",
    drinkValue: drink,
    aromaValue: aroma,
  };
}

// 설명 슬라이드를 제외한 질문 답변만 추출
function getQuestionAnswers(answers) {
  return SLIDES.map((s, i) => ({ type: s.type, answer: answers[i] }))
    .filter((s) => s.type !== "interlude")
    .map((s) => s.answer);
}

// ── Composable ────────────────────────────────────────────────────────────────
export function useFormState() {
  // 슬라이드 인덱스:
  //  0            → Cover
  //  1 ~ SLIDES수 → SLIDES 배열 순서대로 (interlude + question 혼합)
  //  SLIDES수 + 1 → Result
  const RESULT_STEP = SLIDES.length + 1;
  const TOTAL_STEPS = SLIDES.length + 2; // cover + slides + result

  const currentStep = ref(0);
  const direction = ref('forward')  // 'forward' | 'reverse'
  // answers 길이 = SLIDES 길이 (interlude는 빈 문자열로 유지)
  // input 중 fields가 있는 경우(멀티필드)는 객체 {}, 나머지는 빈 문자열
  const answers = ref(SLIDES.map((s) => (s.fields ? {} : "")));

  // 진행률: 질문 슬라이드 기준으로 계산
  const questionTotal = SLIDES.filter((s) => s.type !== "interlude").length;
  const progressPercent = computed(() => {
    if (currentStep.value === 0) return 0;
    if (currentStep.value >= RESULT_STEP) return 100;
    // 현재까지 나온 질문 수
    const answeredQ = SLIDES.slice(0, currentStep.value).filter(
      (s) => s.type !== "interlude",
    ).length;
    return Math.round((answeredQ / questionTotal) * 100);
  });

  const slideClass = (index) => {
    if (index === currentStep.value) return "active";
    return index < currentStep.value ? "above" : "below";
  };

  // 현재 슬라이드 정의 (cover=null, result=null)
  const currentSlide = computed(() => {
    const i = currentStep.value - 1;
    return i >= 0 && i < SLIDES.length ? SLIDES[i] : null;
  });

  // 현재 질문이 몇 번째 질문인지 (설명 슬라이드 제외 카운트)
  const currentQuestionNumber = computed(() => {
    if (!currentSlide.value || currentSlide.value.type === "interlude")
      return null;
    return SLIDES.slice(0, currentStep.value).filter(
      (s) => s.type !== "interlude",
    ).length;
  });

  function startForm() {
    currentStep.value = 1;
     direction.value = 'forward';
  }

  function setAnswer(slideIndex, value) {
    answers.value[slideIndex] = value;
  }

  function goNext() {
    if (currentStep.value >= TOTAL_STEPS - 1) return;
    direction.value = 'forward';
    currentStep.value++;
  }

  function goBack() {
    if (currentStep.value > 0) {
      direction.value = 'reverse'
      currentStep.value--
    }
  }

  // 커버에서 Q6로 바로 점프 (역방향 효과)
  function jumpToQ6() {
    direction.value = 'reverse'
    currentStep.value = Q6_STEP
  }

  function restart() {
    answers.value = SLIDES.map(s => s.fields ? {} : '')
    direction.value = 'forward'
    currentStep.value = 0
  }

  const result = computed(() => calcResult(answers.value));

  function formatAnswer(answer) {
    if (!answer || typeof answer !== "object") return answer || "—";

    const rows = [answer.name, answer.age, answer.mbti].filter(Boolean);

    return rows.length ? rows.join(" / ") : "—";
  }

  // 스크린샷용 요약: 질문 슬라이드만
  const answerSummary = computed(() =>
    SLIDES.map((s, i) => ({ slide: s, answer: answers.value[i] }))
      .filter(({ slide }) => slide.type !== "interlude")
      .map(({ slide, answer }) => ({
        q: slide.text,
        a: formatAnswer(answer),
      })),
  );

   return {
    currentStep,
    answers,
    progressPercent,
    SLIDES,
    RESULT_STEP,
    TOTAL_STEPS,
    slideClass,
    currentSlide,
    currentQuestionNumber,
    questionTotal,
    direction,
    // Q6_STEP,
    startForm,
    setAnswer,
    goNext,
    goBack,
    jumpToQ6,
    restart,
    result,
    // userInfo,
    answerSummary,
  }
}
