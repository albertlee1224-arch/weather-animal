// 날씨 동물 — 캐릭터 레지스트리
// 30종 (24 표준 + 6 히든)
// "레퍼런스 오버로드" — 동화, 우화, 전래동화, 고전문학, 현대 오마주

import type { Character, CharacterRegistry } from './types';

// ──────────────────────────────────────────────
// 표준 캐릭터 24종
// ──────────────────────────────────────────────

// ─── 이솝우화 (6종) ───

const aesopFox: Character = {
  id: 'aesop-fox',
  name: '이솝의 여우',
  source: '이솝우화 — 여우와 포도',
  animal: '여우',
  weatherTags: ['clear', 'partly_cloudy', 'hot'],
  rarity: 'standard',
  personality: '신포도 정신의 달관한 현실주의자',
  lines: [
    '저 햇살? 어차피 신 햇살이었을 거야.',
    '맑은 날엔 포도밭 산책이 최고지.',
    '선크림 안 바르면 포도처럼 쪼글해져.',
    '더운 날의 포도는 확실히 시큼해.',
    '구름이 좀 끼면 포도 따기 딱 좋아.',
  ],
  colors: { primary: '#E07B39', secondary: '#9C4A1A', bg: 'rgba(224,123,57,0.10)' },
  fallback: true, // 폴백 캐릭터
  recraftPrompt: 'red fox character, sly and relaxed expression, sitting with crossed legs, holding a small grape, soft watercolor style, warm palette, white background, full body, cute but detailed, high quality illustration',
};

const aesopAnt: Character = {
  id: 'aesop-ant',
  name: '부지런한 개미',
  source: '이솝우화 — 개미와 베짱이',
  animal: '개미',
  weatherTags: ['clear', 'hot', 'partly_cloudy'],
  rarity: 'standard',
  personality: '준비성 철저한 현실주의 일꾼',
  lines: [
    '맑은 날에 일해야 겨울이 편하지.',
    '더울수록 양산은 기본이야, 기본.',
    '베짱이는 지금쯤 에어컨 밑이겠지?',
    '오늘 해 좋다! 식량 비축 가즈아.',
    '구름 조금 끼니까 일할 맛 나네.',
  ],
  colors: { primary: '#5C3D2E', secondary: '#3A2518', bg: 'rgba(92,61,46,0.10)' },
  fallback: false,
  recraftPrompt: 'ant character standing upright, wearing tiny hard hat, carrying food on back, determined expression, soft watercolor style, warm palette, white background, full body, cute but detailed, high quality illustration',
};

const aesopTortoise: Character = {
  id: 'aesop-tortoise',
  name: '느림보 거북이',
  source: '이솝우화 — 토끼와 거북이',
  animal: '거북이',
  weatherTags: ['cloudy', 'rain', 'partly_cloudy'],
  rarity: 'standard',
  personality: '느리지만 확실한, 묵묵한 완주자',
  lines: [
    '비 와도 꾸준히 걸으면 도착해.',
    '흐린 날이라도 한 걸음씩, 결국 이겨.',
    '우산 하나면 충분해, 천천히 가면 돼.',
    '서두를 필요 없어, 비는 결국 그쳐.',
    '구름 많아도 괜찮아, 느긋하게 가자.',
  ],
  colors: { primary: '#5B8C5A', secondary: '#3D6B3C', bg: 'rgba(91,140,90,0.10)' },
  fallback: false,
  recraftPrompt: 'tortoise character walking steadily, gentle smile, carrying small flag on shell, soft watercolor style, earthy palette, white background, full body, cute but detailed, high quality illustration',
};

const aesopCrow: Character = {
  id: 'aesop-crow',
  name: '영리한 까마귀',
  source: '이솝우화 — 까마귀와 물병',
  animal: '까마귀',
  weatherTags: ['cloudy', 'wind', 'rain'],
  rarity: 'standard',
  personality: '관찰력 뛰어난 문제 해결사',
  lines: [
    '비 오면 물이 차오르지, 돌 안 넣어도.',
    '바람 부는 날엔 날개를 접고 기다려.',
    '흐린 하늘도 잘 보면 답이 있어.',
    '장화 신어, 돌멩이보다 효율적이야.',
    '바람에 날리는 건 깃털뿐이면 돼.',
  ],
  colors: { primary: '#2C2C3A', secondary: '#1A1A24', bg: 'rgba(44,44,58,0.10)' },
  fallback: false,
  recraftPrompt: 'crow character perched upright, intelligent sharp eyes, holding a small pebble, soft watercolor style, dark cool palette, white background, full body, cute but detailed, high quality illustration',
};

const aesopLion: Character = {
  id: 'aesop-lion',
  name: '초원의 사자',
  source: '이솝우화 — 사자와 쥐',
  animal: '사자',
  weatherTags: ['clear', 'hot', 'wind'],
  rarity: 'standard',
  personality: '위엄 있지만 은혜를 아는 왕',
  lines: [
    '맑은 하늘 아래가 왕의 무대지.',
    '이 더위에 갈기가 없으면 좋겠다만.',
    '바람이 갈기를 날려주니 시원하군.',
    '모자 챙겨, 왕도 자외선은 못 이겨.',
    '뜨거운 날엔 그늘이 진정한 왕좌야.',
  ],
  colors: { primary: '#D4A843', secondary: '#A07B24', bg: 'rgba(212,168,67,0.10)' },
  fallback: false,
  recraftPrompt: 'lion character sitting majestically, golden mane flowing, regal but kind expression, soft watercolor style, golden warm palette, white background, full body, cute but detailed, high quality illustration',
};

const aesopGrasshopper: Character = {
  id: 'aesop-grasshopper',
  name: '한량 베짱이',
  source: '이솝우화 — 개미와 베짱이',
  animal: '베짱이',
  weatherTags: ['clear', 'hot', 'partly_cloudy'],
  rarity: 'standard',
  personality: '오늘을 즐기는 낙천적 음유시인',
  lines: [
    '맑은 날엔 노래하고 봐야지, 안 그래?',
    '더워도 한 곡 부르면 기분은 시원해.',
    '개미가 일하든 말든 나는 연주 중~',
    '양산 아래 기타 치는 게 여름 정석.',
    '구름 조금 끼면 공연 조명 완벽!',
  ],
  colors: { primary: '#7EC850', secondary: '#4E8B2B', bg: 'rgba(126,200,80,0.10)' },
  fallback: false,
  recraftPrompt: 'grasshopper character playing tiny guitar, cheerful carefree expression, sitting on a leaf, soft watercolor style, bright green palette, white background, full body, cute but detailed, high quality illustration',
};

// ─── 그림동화 / 안데르센 (5종) ───

const thirdPig: Character = {
  id: 'third-pig',
  name: '벽돌집 돼지',
  source: '그림동화 — 아기돼지 삼형제',
  animal: '돼지',
  weatherTags: ['wind', 'rain', 'cloudy'],
  rarity: 'standard',
  personality: '신중하고 든든한 준비형 리더',
  lines: [
    '바람 불어? 벽돌집이라 걱정 없어.',
    '비 와도 지붕 튼튼하면 마음이 편해.',
    '우산보다 확실한 건 좋은 집이야.',
    '흐린 날엔 벽난로에 코코아 한잔.',
    '바람 센 날 외출은 자제, 집이 최고.',
  ],
  colors: { primary: '#E88B8B', secondary: '#B85C5C', bg: 'rgba(232,139,139,0.10)' },
  fallback: false,
  recraftPrompt: 'pig character wearing overalls and hard hat, proud stance next to tiny brick house, soft watercolor style, warm rosy palette, white background, full body, cute but detailed, high quality illustration',
};

const uglyDuckling: Character = {
  id: 'ugly-duckling',
  name: '못난이 오리',
  source: '안데르센 — 미운 오리 새끼',
  animal: '오리',
  weatherTags: ['rain', 'cloudy', 'cold'],
  rarity: 'standard',
  personality: '자기 가치를 모르는 순수한 영혼',
  lines: [
    '비 맞아도 괜찮아, 언젠가 날개 펴.',
    '흐린 날이 지나면 백조가 될 거야.',
    '추울수록 깃털이 더 아름다워진대.',
    '우비 입으면 나도 꽤 괜찮아 보여.',
    '오늘도 조금 못났지만, 내일은 달라.',
  ],
  colors: { primary: '#B0C4DE', secondary: '#6A89A7', bg: 'rgba(176,196,222,0.10)' },
  fallback: false,
  recraftPrompt: 'duckling character looking hopeful, slightly fluffy and messy feathers, standing by a puddle, soft watercolor style, pastel blue palette, white background, full body, cute but detailed, high quality illustration',
};

const matchGirl: Character = {
  id: 'match-girl',
  name: '성냥불 소녀의 고양이',
  source: '안데르센 — 성냥팔이 소녀',
  animal: '고양이',
  weatherTags: ['cold', 'snow', 'cloudy'],
  rarity: 'standard',
  personality: '추위 속 따뜻함을 찾는 감성파',
  lines: [
    '추운 날엔 따뜻한 음료가 성냥 대신.',
    '눈 오는 밤, 핫초코 한 잔이면 충분해.',
    '패딩 입어, 성냥 한 개비론 부족해.',
    '흐린 하늘에도 작은 불빛은 있어.',
    '추위는 마음까지 얼리니 따뜻하게.',
  ],
  colors: { primary: '#F4A460', secondary: '#CD7F32', bg: 'rgba(244,164,96,0.10)' },
  fallback: false,
  recraftPrompt: 'cat character curled by a tiny flickering candle, warm glow on face, soft fur, gentle expression, soft watercolor style, warm amber palette, white background, full body, cute but detailed, high quality illustration',
};

const bremenDonkey: Character = {
  id: 'bremen-donkey',
  name: '브레멘 당나귀',
  source: '그림동화 — 브레멘 음악대',
  animal: '당나귀',
  weatherTags: ['partly_cloudy', 'wind', 'clear'],
  rarity: 'standard',
  personality: '은퇴 후 새 출발을 꿈꾸는 낙천가',
  lines: [
    '바람이 불어도 음악은 멈추지 않아.',
    '구름 사이로 브레멘이 보이는 것 같아.',
    '맑은 날엔 길 떠나기 딱 좋은 날씨.',
    '바람 부는 날엔 귀를 세워봐, 음악이야.',
    '모자 꼭 잡아, 바람에 날아갈라.',
  ],
  colors: { primary: '#8B7D6B', secondary: '#6B5D4B', bg: 'rgba(139,125,107,0.10)' },
  fallback: false,
  recraftPrompt: 'donkey character walking happily on a path, carrying a small guitar on back, optimistic expression, soft watercolor style, earthy warm palette, white background, full body, cute but detailed, high quality illustration',
};

const snowQueen: Character = {
  id: 'snow-queen',
  name: '눈의 여왕 올빼미',
  source: '안데르센 — 눈의 여왕',
  animal: '올빼미',
  weatherTags: ['snow', 'cold', 'cloudy'],
  rarity: 'standard',
  personality: '차갑지만 지혜로운 겨울의 수호자',
  lines: [
    '눈이 내려야 세상이 깨끗해지지.',
    '추울수록 정신이 맑아져, 목도리 해.',
    '겨울왕국은 패딩 없이 못 버텨.',
    '눈 위를 걸을 땐 장갑 필수야.',
    '흐린 하늘이 눈을 품고 있구나.',
  ],
  colors: { primary: '#A8C8E8', secondary: '#6A8DB8', bg: 'rgba(168,200,232,0.10)' },
  fallback: false,
  recraftPrompt: 'snowy owl character with icy blue eyes, elegant and wise, perched on a snow-covered branch, soft watercolor style, icy blue white palette, white background, full body, cute but detailed, high quality illustration',
};

// ─── 한국 전래동화 / 속담 (5종) ───

const koreanTiger: Character = {
  id: 'korean-tiger',
  name: '옛날옛적 호랑이',
  source: '한국 전래동화 — 해님달님',
  animal: '호랑이',
  weatherTags: ['cloudy', 'cold', 'wind'],
  rarity: 'standard',
  personality: '무섭지만 어딘가 허당인 산중의 왕',
  lines: [
    '흐린 날엔 떡 하나 주면 안 잡아먹지.',
    '추운 날 호랑이도 핫팩은 챙겨.',
    '바람 세면 산에서 내려오기 힘들어.',
    '두꺼운 외투 입어, 호랑이도 추워.',
    '흐린 하늘 아래 으르렁 한번 해본다.',
  ],
  colors: { primary: '#D97706', secondary: '#92400E', bg: 'rgba(217,119,6,0.10)' },
  fallback: false,
  recraftPrompt: 'Korean tiger character, traditional folk art style, striped orange fur, slightly goofy but fierce expression, sitting on mountain, soft watercolor style, warm palette, white background, full body, cute but detailed, high quality illustration',
};

const koreanRabbit: Character = {
  id: 'korean-rabbit',
  name: '꾀보 토끼',
  source: '한국 전래동화 — 토끼와 자라',
  animal: '토끼',
  weatherTags: ['clear', 'partly_cloudy', 'rain'],
  rarity: 'standard',
  personality: '위기에 강한 임기응변의 달인',
  lines: [
    '맑은 날엔 간을 꺼내놓고 일광욕!',
    '비 오면 용궁 갈 일 없어서 다행이야.',
    '우산 챙겨, 자라가 또 올 수도 있어.',
    '구름 사이로 달이 보이면 힘이 나.',
    '맑은 날의 당근은 확실히 맛있어.',
  ],
  colors: { primary: '#F5F5DC', secondary: '#C4A77D', bg: 'rgba(196,167,125,0.10)' },
  fallback: false,
  recraftPrompt: 'rabbit character, clever expression, Korean folk style, white fur, sitting on a hilltop looking at the sky, soft watercolor style, light warm palette, white background, full body, cute but detailed, high quality illustration',
};

const koreanMagpie: Character = {
  id: 'korean-magpie',
  name: '반가운 까치',
  source: '한국 속담 — 아침 까치가 울면 반가운 손님',
  animal: '까치',
  weatherTags: ['clear', 'partly_cloudy', 'wind'],
  rarity: 'standard',
  personality: '낙관적 소식통, 좋은 소식 전달자',
  lines: [
    '까치가 울었으니 오늘 좋은 일 생겨!',
    '맑은 날 까치 소리는 행운의 신호.',
    '바람 타고 좋은 소식 전하러 왔어.',
    '구름 사이로 햇살, 반가운 날이야.',
    '외출할 때 모자 챙겨, 바람에 날려.',
  ],
  colors: { primary: '#1A1A2E', secondary: '#0F0F1A', bg: 'rgba(26,26,46,0.08)' },
  fallback: false,
  recraftPrompt: 'magpie character with black and white plumage, cheerful expression, perched on a branch singing, Korean folk art influence, soft watercolor style, white background, full body, cute but detailed, high quality illustration',
};

const koreanToad: Character = {
  id: 'korean-toad',
  name: '우물 안 두꺼비',
  source: '한국 전래동화 — 두꺼비와 지네',
  animal: '두꺼비',
  weatherTags: ['rain', 'cloudy', 'partly_cloudy'],
  rarity: 'standard',
  personality: '소박하지만 용감한 수호자',
  lines: [
    '비가 오면 우물 밖 세상이 궁금해.',
    '흐린 날엔 뛰어다닐 맛이 나지.',
    '우산? 난 비 맞는 게 더 좋은데.',
    '비 오는 날 장화 신으면 나도 멋져.',
    '구름 많은 날이 두꺼비의 무대야.',
  ],
  colors: { primary: '#6B7B3A', secondary: '#4A5628', bg: 'rgba(107,123,58,0.10)' },
  fallback: false,
  recraftPrompt: 'toad character sitting proudly, small but brave expression, slightly warty skin, Korean folk style, soft watercolor style, olive green palette, white background, full body, cute but detailed, high quality illustration',
};

const koreanDeer: Character = {
  id: 'korean-deer',
  name: '은혜 갚은 사슴',
  source: '한국 전래동화 — 은혜 갚은 사슴',
  animal: '사슴',
  weatherTags: ['snow', 'cold', 'clear'],
  rarity: 'standard',
  personality: '은혜를 아는 순수하고 고귀한 영혼',
  lines: [
    '눈 오는 날 은혜를 갚으러 왔어.',
    '추운 날엔 따뜻한 마음이 제일이야.',
    '목도리 선물할게, 은혜를 갚는 거야.',
    '맑은 겨울 하늘은 마음을 비추지.',
    '눈길 조심해, 은혜보다 건강이 먼저.',
  ],
  colors: { primary: '#C1946A', secondary: '#8B6B4A', bg: 'rgba(193,148,106,0.10)' },
  fallback: false,
  recraftPrompt: 'deer character with gentle eyes, elegant antlers with tiny bells, graceful posture, soft watercolor style, warm brown palette, white background, full body, cute but detailed, high quality illustration',
};

// ─── 고전 문학 (4종) ───

const mobyWhale: Character = {
  id: 'moby-whale',
  name: '하얀 고래',
  source: '허먼 멜빌 — 모비 딕',
  animal: '고래',
  weatherTags: ['rain', 'wind', 'cloudy'],
  rarity: 'standard',
  personality: '깊은 바다의 침묵하는 거인',
  lines: [
    '비 오는 바다는 고래에겐 별거 아냐.',
    '바람이 거센 날엔 항해를 쉬어.',
    '우산 하나로 폭풍은 못 막지만 시작이야.',
    '흐린 바다 위, 깊이 숨 쉬어봐.',
    '바람 부는 날 마음의 닻을 내려봐.',
  ],
  colors: { primary: '#4A6FA5', secondary: '#2E4A75', bg: 'rgba(74,111,165,0.10)' },
  fallback: false,
  recraftPrompt: 'white whale character, massive but gentle, floating in ocean, wise ancient eyes, soft watercolor style, deep blue palette, white background, full body, cute but detailed, high quality illustration',
};

const littlePrinceFox: Character = {
  id: 'little-prince-fox',
  name: '길들여진 여우',
  source: '생텍쥐페리 — 어린 왕자',
  animal: '여우',
  weatherTags: ['clear', 'partly_cloudy', 'wind'],
  rarity: 'standard',
  personality: '관계의 본질을 아는 섬세한 사색가',
  lines: [
    '맑은 하늘 아래 네 장미가 보여.',
    '바람에 밀밭이 흔들리면 네 생각나.',
    '중요한 건 눈에 보이지 않아, 햇살처럼.',
    '구름 사이로 별이 웃고 있을 거야.',
    '바람 부는 날엔 스카프 하나, 충분해.',
  ],
  colors: { primary: '#E8A87C', secondary: '#C17B50', bg: 'rgba(232,168,124,0.10)' },
  fallback: false,
  recraftPrompt: 'fox character sitting in golden wheat field, gentle knowing smile, warm sunset tones, soft watercolor style, amber golden palette, white background, full body, cute but detailed, high quality illustration',
};

const jungleBookBear: Character = {
  id: 'jungle-bear',
  name: '정글의 곰',
  source: '러디어드 키플링 — 정글북',
  animal: '곰',
  weatherTags: ['hot', 'clear', 'partly_cloudy'],
  rarity: 'standard',
  personality: '느긋하고 즐거운 삶의 철학자',
  lines: [
    '더운 날엔 꿀 한 스푼이면 행복해.',
    '맑은 날은 꼭 필요한 것만 챙기는 날.',
    '인생에 필요한 건 그늘과 과일뿐.',
    '선크림은 필수! 꿀만큼 중요해.',
    '구름 아래 낮잠, 이보다 좋을 순 없어.',
  ],
  colors: { primary: '#8B6F47', secondary: '#5E4B30', bg: 'rgba(139,111,71,0.10)' },
  fallback: false,
  recraftPrompt: 'bear character lounging happily under a tree, holding a pot of honey, carefree relaxed expression, soft watercolor style, earthy warm palette, white background, full body, cute but detailed, high quality illustration',
};

const aliceCheshire: Character = {
  id: 'cheshire-cat',
  name: '어디선가 본 고양이',
  source: '루이스 캐롤 — 이상한 나라의 앨리스',
  animal: '고양이',
  weatherTags: ['cloudy', 'partly_cloudy', 'rain'],
  rarity: 'standard',
  personality: '수수께끼를 좋아하는 철학적 장난꾸러기',
  lines: [
    '어디로 가든 어딘가엔 도착하지.',
    '비 오는 날, 모든 고양이는 사라져.',
    '흐린 하늘? 우리 모두 여긴 좀 이상해.',
    '우산 안 쓰면 이상한 나라에 빠져.',
    '구름 속에 미소만 남기고 갈게.',
  ],
  colors: { primary: '#9B59B6', secondary: '#6C3483', bg: 'rgba(155,89,182,0.10)' },
  fallback: false,
  recraftPrompt: 'mysterious cat character with wide enigmatic grin, partially transparent body, floating in air, soft watercolor style, purple misty palette, white background, full body, cute but detailed, high quality illustration',
};

// ─── 현대 오마주 트윅 (4종) ───
// 이름 변경, 비주얼 독립, 원작 고유 시각 요소 사용 금지

const forestBear: Character = {
  id: 'forest-bear',
  name: '숲지기 곰',
  source: '숲의 수호자 오마주',
  animal: '곰',
  weatherTags: ['rain', 'cloudy', 'wind'],
  rarity: 'standard',
  personality: '크고 포근한 숲의 보호자',
  lines: [
    '비 오면 숲이 기뻐해, 우산 챙겨.',
    '흐린 날엔 숲속 산책이 제격이야.',
    '바람이 나뭇잎 편지를 가져왔어.',
    '비 맞으며 걸으면 마음이 깨끗해져.',
    '방수 재킷 입어, 숲은 젖어도 돼.',
  ],
  colors: { primary: '#6B8E6B', secondary: '#4A6B4A', bg: 'rgba(107,142,107,0.10)' },
  fallback: false,
  recraftPrompt: 'large gentle bear character, forest guardian appearance, holding a small leaf umbrella, kind protective expression, soft watercolor style, forest green palette, white background, full body, cute but detailed, high quality illustration',
};

const lightningSqu: Character = {
  id: 'lightning-squirrel',
  name: '번개 다람쥐',
  source: '전기를 품은 숲의 다람쥐 오마주',
  animal: '다람쥐',
  weatherTags: ['rain', 'wind', 'partly_cloudy'],
  rarity: 'standard',
  personality: '빠르고 에너지 넘치는 호기심 덩어리',
  lines: [
    '비 올 때 전기 조심! 나만 괜찮아.',
    '바람 타고 도토리 찾으러 가즈아!',
    '번개 칠 때 나무 밑은 위험해!',
    '구름 많은 날, 도토리 비축 찬스.',
    '우산보다 빠르게 뛰는 게 내 방식.',
  ],
  colors: { primary: '#F7DC6F', secondary: '#D4AC0D', bg: 'rgba(247,220,111,0.10)' },
  fallback: false,
  recraftPrompt: 'squirrel character with bright energetic expression, cheeks stuffed with acorns, dynamic action pose, tiny spark effects around, soft watercolor style, bright yellow palette, white background, full body, cute but detailed, high quality illustration',
};

const oceanTurtle: Character = {
  id: 'ocean-turtle',
  name: '파도타기 바다거북',
  source: '대양을 건너는 거북이 오마주',
  animal: '바다거북',
  weatherTags: ['hot', 'clear', 'wind'],
  rarity: 'standard',
  personality: '느긋하고 쿨한 서퍼 마인드',
  lines: [
    '더운 날엔 바다로 가면 답이야.',
    '맑은 날 파도 위가 내 사무실.',
    '바람이 불면 서핑하기 딱이지.',
    '선크림 필수! 등딱지도 탄다고.',
    '쿨한 거 좋아하면 물 많이 마셔.',
  ],
  colors: { primary: '#2EC4B6', secondary: '#1A8B80', bg: 'rgba(46,196,182,0.10)' },
  fallback: false,
  recraftPrompt: 'sea turtle character riding a small wave, relaxed surfer expression, wearing tiny sunglasses, soft watercolor style, turquoise ocean palette, white background, full body, cute but detailed, high quality illustration',
};

const nightOwl: Character = {
  id: 'night-owl',
  name: '달빛 부엉이',
  source: '밤의 학자 오마주',
  animal: '부엉이',
  weatherTags: ['cloudy', 'cold', 'partly_cloudy'],
  rarity: 'standard',
  personality: '밤을 사랑하는 지식의 수호자',
  lines: [
    '흐린 날이 독서하기엔 최고야.',
    '추운 밤엔 차 한잔과 책 한 권.',
    '구름 뒤에 달이 숨어도 난 알아.',
    '두꺼운 담요 준비해, 밤이 길어.',
    '흐린 하늘도 지혜의 눈엔 맑아.',
  ],
  colors: { primary: '#5C4B8A', secondary: '#3D3160', bg: 'rgba(92,75,138,0.10)' },
  fallback: false,
  recraftPrompt: 'owl character wearing tiny round glasses, reading a book under moonlight, scholarly wise expression, soft watercolor style, midnight purple palette, white background, full body, cute but detailed, high quality illustration',
};

// ──────────────────────────────────────────────
// 히든 캐릭터 6종
// ──────────────────────────────────────────────

const dragonKing: Character = {
  id: 'dragon-king',
  name: '용왕의 잉어',
  source: '한국 전래동화 — 용궁',
  animal: '잉어',
  weatherTags: ['rain'],
  rarity: 'hidden',
  hiddenTrigger: {
    label: '폭우',
    description: '시간당 30mm 이상의 폭우가 쏟아질 때',
    condition: { PTY: 1, RN1_gte: 30 },
  },
  personality: '폭우 속에서만 등장하는 전설의 물고기',
  lines: [
    '폭우다! 용궁으로 가는 길이 열렸어.',
    '이 비면 잉어가 용이 될 수 있지.',
    '밖에 나가지 마, 용궁 초대장 아니면.',
    '폭우엔 우산 말고 잠수복이 필요해.',
    '비가 이렇게 오면 세상이 바다가 돼.',
  ],
  colors: { primary: '#1E90FF', secondary: '#0A5EB5', bg: 'rgba(30,144,255,0.12)' },
  fallback: false,
  recraftPrompt: 'golden koi fish character leaping through heavy rain, transforming into dragon, mythical Korean style, dynamic upward motion, soft watercolor style, deep blue and gold palette, white background, full body, cute but detailed, high quality illustration',
};

const snowFox: Character = {
  id: 'snow-fox',
  name: '설원의 은여우',
  source: '북방 설화 — 눈의 정령',
  animal: '북극여우',
  weatherTags: ['snow'],
  rarity: 'hidden',
  hiddenTrigger: {
    label: '폭설',
    description: '시간당 5cm 이상의 눈이 쌓일 때',
    condition: { PTY: 3, SNO_gte: 5 },
  },
  personality: '폭설이 와야만 모습을 드러내는 은빛 정령',
  lines: [
    '폭설이야! 은빛 세상이 펼쳐졌어.',
    '이 정도 눈이면 밖에 나가면 안 돼.',
    '눈 속에 숨은 발자국을 따라가봐.',
    '방한 장비 풀세트 필수, 귀까지 덮어.',
    '세상이 하얘지면 내가 나타나지.',
  ],
  colors: { primary: '#E8E8E8', secondary: '#B0B0B0', bg: 'rgba(232,232,232,0.12)' },
  fallback: false,
  recraftPrompt: 'arctic fox character with silver white fur, ethereal glowing appearance, sitting in heavy snowfall, mystical spirit-like, soft watercolor style, silver white palette, white background, full body, cute but detailed, high quality illustration',
};

const frozenMammoth: Character = {
  id: 'frozen-mammoth',
  name: '얼음 시대 매머드',
  source: '빙하기 전설',
  animal: '매머드',
  weatherTags: ['cold'],
  rarity: 'hidden',
  hiddenTrigger: {
    label: '극한 추위',
    description: '기온이 영하 10도 이하로 떨어질 때',
    condition: { TMP_lte: -10 },
  },
  personality: '빙하기를 살아낸 극한 추위의 왕',
  lines: [
    '영하 10도? 빙하기에 비하면 봄이야.',
    '이 추위엔 외출 자체가 모험이야.',
    '핫팩 열 개로도 부족한 날이구나.',
    '내복 위에 패딩 위에 담요, 그게 답.',
    '빙하기 생존자가 말해, 집에 있어.',
  ],
  colors: { primary: '#7CB9E8', secondary: '#4A8BBF', bg: 'rgba(124,185,232,0.12)' },
  fallback: false,
  recraftPrompt: 'woolly mammoth character with thick shaggy fur, ancient wise eyes, frost on tusks, standing in blizzard, soft watercolor style, icy blue brown palette, white background, full body, cute but detailed, high quality illustration',
};

const sunSalamander: Character = {
  id: 'sun-salamander',
  name: '태양의 도롱뇽',
  source: '불의 정령 전설',
  animal: '도롱뇽',
  weatherTags: ['hot'],
  rarity: 'hidden',
  hiddenTrigger: {
    label: '극한 더위',
    description: '기온이 35도 이상으로 올라갈 때',
    condition: { TMP_gte: 35 },
  },
  personality: '극한 더위에서만 나타나는 불의 정령',
  lines: [
    '35도 넘었어! 드디어 내 계절이야.',
    '이 더위에 나가면 도롱뇽도 녹아.',
    '물 2리터는 기본, 3리터를 마셔.',
    '에어컨 없으면 진짜 위험한 날이야.',
    '불의 정령도 선크림은 바른다고.',
  ],
  colors: { primary: '#FF6347', secondary: '#CC3722', bg: 'rgba(255,99,71,0.12)' },
  fallback: false,
  recraftPrompt: 'fire salamander character glowing with heat shimmer, fiery orange red pattern on skin, standing on hot cracked ground, soft watercolor style, fire red orange palette, white background, full body, cute but detailed, high quality illustration',
};

const stormAlbatross: Character = {
  id: 'storm-albatross',
  name: '폭풍의 알바트로스',
  source: '콜리지 — 늙은 수부의 노래',
  animal: '알바트로스',
  weatherTags: ['wind'],
  rarity: 'hidden',
  hiddenTrigger: {
    label: '강풍',
    description: '풍속이 21m/s 이상일 때 (강풍주의보)',
    condition: { WSD_gte: 21 },
  },
  personality: '폭풍 속에서만 날 수 있는 전설의 새',
  lines: [
    '강풍이야! 이 바람에만 날 수 있어.',
    '밖에 나가면 날아갈 수 있으니 조심.',
    '간판 떨어질 수 있어, 건물 옆 주의.',
    '폭풍 속의 자유는 아무나 못 느껴.',
    '창문 닫고 고정해, 바람이 무섭다.',
  ],
  colors: { primary: '#708090', secondary: '#4A5568', bg: 'rgba(112,128,144,0.12)' },
  fallback: false,
  recraftPrompt: 'albatross character with enormous wingspan spread wide, soaring through storm clouds, majestic and powerful, soft watercolor style, stormy grey palette, white background, full body, cute but detailed, high quality illustration',
};

const dawnCrane: Character = {
  id: 'dawn-crane',
  name: '새벽안개 두루미',
  source: '한국 전래 — 학의 보은',
  animal: '두루미',
  weatherTags: ['cloudy', 'cold'],
  rarity: 'hidden',
  hiddenTrigger: {
    label: '새벽흐림',
    description: '새벽 6시 이전, 흐리고 기온 5도 이하일 때',
    condition: { hour_lt: 6, SKY: 4, TMP_lte: 5 },
  },
  personality: '새벽녘에만 날아오는 은은한 보은의 새',
  lines: [
    '새벽안개 속에서 찾아왔어, 고마워.',
    '이 이른 시간에 나를 만나다니.',
    '따뜻한 차 한잔이면 새벽도 괜찮아.',
    '겉옷 꼭 챙겨, 새벽 공기는 차가워.',
    '안개가 걷히면 좋은 하루가 올 거야.',
  ],
  colors: { primary: '#C9B1FF', secondary: '#9B7FDB', bg: 'rgba(201,177,255,0.12)' },
  fallback: false,
  recraftPrompt: 'Korean crane character emerging from dawn mist, elegant long neck, ethereal and graceful, soft morning light, soft watercolor style, misty lavender palette, white background, full body, cute but detailed, high quality illustration',
};

// ──────────────────────────────────────────────
// 캐릭터 레지스트리 (Record<string, Character>)
// ──────────────────────────────────────────────

export const characters: CharacterRegistry = {
  // 이솝우화 (6)
  [aesopFox.id]: aesopFox,
  [aesopAnt.id]: aesopAnt,
  [aesopTortoise.id]: aesopTortoise,
  [aesopCrow.id]: aesopCrow,
  [aesopLion.id]: aesopLion,
  [aesopGrasshopper.id]: aesopGrasshopper,

  // 그림동화/안데르센 (5)
  [thirdPig.id]: thirdPig,
  [uglyDuckling.id]: uglyDuckling,
  [matchGirl.id]: matchGirl,
  [bremenDonkey.id]: bremenDonkey,
  [snowQueen.id]: snowQueen,

  // 한국 전래동화/속담 (5)
  [koreanTiger.id]: koreanTiger,
  [koreanRabbit.id]: koreanRabbit,
  [koreanMagpie.id]: koreanMagpie,
  [koreanToad.id]: koreanToad,
  [koreanDeer.id]: koreanDeer,

  // 고전 문학 (4)
  [mobyWhale.id]: mobyWhale,
  [littlePrinceFox.id]: littlePrinceFox,
  [jungleBookBear.id]: jungleBookBear,
  [aliceCheshire.id]: aliceCheshire,

  // 현대 오마주 트윅 (4)
  [forestBear.id]: forestBear,
  [lightningSqu.id]: lightningSqu,
  [oceanTurtle.id]: oceanTurtle,
  [nightOwl.id]: nightOwl,

  // 히든 캐릭터 (6)
  [dragonKing.id]: dragonKing,
  [snowFox.id]: snowFox,
  [frozenMammoth.id]: frozenMammoth,
  [sunSalamander.id]: sunSalamander,
  [stormAlbatross.id]: stormAlbatross,
  [dawnCrane.id]: dawnCrane,
};

// ──────────────────────────────────────────────
// 유틸리티: 표준 캐릭터만 / 히든 캐릭터만
// ──────────────────────────────────────────────

export const standardCharacters = Object.values(characters).filter(
  (c) => c.rarity === 'standard'
);

export const hiddenCharacters = Object.values(characters).filter(
  (c) => c.rarity === 'hidden'
);

/** 폴백 캐릭터 (매칭 실패 시 사용) */
export const fallbackCharacter = Object.values(characters).find(
  (c) => c.fallback
)!;
