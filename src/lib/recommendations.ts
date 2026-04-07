/**
 * Recommendations Engine
 *
 * Generates character-voiced outfit, activity, and oracle messages
 * based on weather conditions. The character's personality and source
 * story color every recommendation.
 */

import type { Character, WeatherTag } from '../data/types';

// ── Outfit Recommendations ──

interface OutfitRec {
  emoji: string;
  items: string[];
  characterTip: string;
}

const OUTFIT_BY_TEMP: { min: number; max: number; emoji: string; items: string[] }[] = [
  { min: 33, max: 99, emoji: '\uD83E\uDD75', items: ['민소매/반팔', '반바지', '선크림', '모자'] },
  { min: 28, max: 32, emoji: '\u2600\uFE0F', items: ['반팔', '얇은 바지', '선글라스'] },
  { min: 23, max: 27, emoji: '\uD83C\uDF3B', items: ['얇은 긴팔', '면바지'] },
  { min: 17, max: 22, emoji: '\uD83C\uDF43', items: ['긴팔', '가디건', '얇은 겉옷'] },
  { min: 12, max: 16, emoji: '\uD83E\uDDE5', items: ['자켓/점퍼', '긴바지', '스카프'] },
  { min: 5, max: 11, emoji: '\uD83E\uDDE3', items: ['코트', '두꺼운 니트', '장갑'] },
  { min: -99, max: 4, emoji: '\u2744\uFE0F', items: ['패딩', '기모', '목도리', '핫팩'] },
];

const OUTFIT_TIPS_BY_SOURCE: Record<string, string[]> = {
  '이솝우화': [
    '준비된 자만이 추위를 이기지.',
    '겉모습보다 실용이야.',
    '현명한 선택이 오늘을 바꿔.',
  ],
  '그림동화': [
    '마법은 없어도, 옷차림은 마법 같을 수 있어.',
    '모험은 좋은 신발에서 시작돼.',
    '드레스코드? 날씨가 정해줘.',
  ],
  '한국 전래동화': [
    '옛 어른들은 날씨 보고 옷을 골랐대.',
    '호랑이도 추우면 굴에 들어가.',
    '지혜로운 차림이 하루를 좌우하지.',
  ],
  '고전 문학': [
    '위대한 모험도 제대로 된 복장에서 시작돼.',
    '바다도, 사막도, 옷이 달랐어.',
    '기후에 맞서는 건 인간의 오래된 기술이야.',
  ],
};

function getSourceCategory(source: string): string {
  if (source.includes('이솝')) return '이솝우화';
  if (source.includes('그림') || source.includes('안데르센')) return '그림동화';
  if (source.includes('한국') || source.includes('전래')) return '한국 전래동화';
  return '고전 문학';
}

export function getOutfitRecommendation(temp: number, character: Character): OutfitRec {
  const range = OUTFIT_BY_TEMP.find(r => temp >= r.min && temp <= r.max) ?? OUTFIT_BY_TEMP[3];
  const category = getSourceCategory(character.source);
  const tips = OUTFIT_TIPS_BY_SOURCE[category] ?? OUTFIT_TIPS_BY_SOURCE['고전 문학'];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return {
    emoji: range.emoji,
    items: range.items,
    characterTip: `${character.name}: "${tip}"`,
  };
}

// ── Activity Recommendations ──

interface ActivityRec {
  emoji: string;
  activity: string;
  reason: string;
}

const ACTIVITIES_BY_WEATHER: Record<WeatherTag, ActivityRec[]> = {
  clear: [
    { emoji: '\uD83C\uDFDE\uFE0F', activity: '산책', reason: '맑은 날 바깥 공기를 마시기 딱 좋은 날' },
    { emoji: '\uD83D\uDEB4', activity: '자전거', reason: '시야가 좋고 바람이 상쾌해' },
    { emoji: '\uD83D\uDCF8', activity: '사진 산책', reason: '자연광이 예쁜 날, 카메라 들고 나가봐' },
  ],
  partly_cloudy: [
    { emoji: '\u2615', activity: '카페 테라스', reason: '직사광선 없이 적당한 밝기' },
    { emoji: '\uD83C\uDFDE\uFE0F', activity: '공원 독서', reason: '그늘 아래 독서하기 좋은 날씨' },
    { emoji: '\uD83C\uDFA8', activity: '스케치', reason: '구름이 만드는 풍경이 영감을 줘' },
  ],
  cloudy: [
    { emoji: '\uD83C\uDFB5', activity: '뮤직 타임', reason: '몽글몽글한 날엔 음악이 더 잘 들려' },
    { emoji: '\uD83D\uDCDA', activity: '독서', reason: '흐린 날은 집중하기 좋아' },
    { emoji: '\uD83C\uDFA8', activity: '미술관', reason: '야외보단 실내 문화생활' },
  ],
  rain: [
    { emoji: '\u2615', activity: '빗소리 카페', reason: '비 오는 날 카페에서 창밖 보기' },
    { emoji: '\uD83C\uDFA7', activity: '팟캐스트', reason: '빗소리를 BGM 삼아 듣기' },
    { emoji: '\uD83C\uDF75', activity: '따뜻한 차', reason: '비 오는 날엔 따뜻한 게 최고' },
  ],
  snow: [
    { emoji: '\u2603\uFE0F', activity: '눈 구경', reason: '눈 내리는 풍경은 1년에 몇 번 없어' },
    { emoji: '\uD83C\uDF75', activity: '핫초코', reason: '눈 오는 날 따뜻한 음료 한 잔' },
    { emoji: '\uD83D\uDCF8', activity: '눈 사진', reason: '눈 쌓인 풍경을 남겨둬' },
  ],
  wind: [
    { emoji: '\uD83C\uDFE0', activity: '실내 운동', reason: '바람 세니까 실내가 나아' },
    { emoji: '\uD83C\uDF3F', activity: '스트레칭', reason: '바람에 긴장한 몸을 풀어줘' },
    { emoji: '\uD83C\uDFA7', activity: '음악 감상', reason: '바람 소리와 어울리는 음악' },
  ],
  hot: [
    { emoji: '\uD83C\uDF67', activity: '빙수', reason: '더운 날엔 시원한 게 최고' },
    { emoji: '\uD83C\uDFCA', activity: '수영', reason: '물속이 가장 시원해' },
    { emoji: '\uD83C\uDFE0', activity: '에어컨 독서', reason: '밖은 위험해, 시원한 실내에서' },
  ],
  cold: [
    { emoji: '\u2615', activity: '따뜻한 카페', reason: '추운 날엔 따뜻한 곳에서 충전' },
    { emoji: '\uD83C\uDF72', activity: '뜨끈한 국물', reason: '추위엔 국밥이 진리' },
    { emoji: '\uD83D\uDECC', activity: '이불 속 영화', reason: '추운 날 이불 밖은 위험해' },
  ],
};

export function getActivityRecommendation(weatherTag: WeatherTag): ActivityRec {
  const activities = ACTIVITIES_BY_WEATHER[weatherTag];
  return activities[Math.floor(Math.random() * activities.length)];
}

// ── Oracle Message (캐릭터의 깊은 한마디) ──

const ORACLE_TEMPLATES: Record<string, string[]> = {
  '이솝우화': [
    '오늘의 교훈: 서두르는 자보다 꾸준한 자가 이기는 법.',
    '똑똑한 척보다 현명한 선택이 하루를 바꿔.',
    '작은 준비가 큰 차이를 만들어.',
    '남을 탓하기 전에 내 발밑을 봐.',
  ],
  '그림동화': [
    '마법은 네가 만드는 거야. 오늘도 한 걸음.',
    '유리구두를 기다리지 말고, 걸어갈 신발을 골라.',
    '숲 속에서 길을 잃어도, 결국 집에 돌아오게 돼.',
    '오늘 심는 콩이 내일의 콩나무가 될 수 있어.',
  ],
  '한국 전래동화': [
    '은혜를 갚는 마음이 하루를 따뜻하게 해.',
    '호랑이도 제 말 하면 온다 — 오늘 말조심.',
    '느리더라도 멈추지 않으면 돼.',
    '작은 도움이 큰 복으로 돌아오는 법.',
  ],
  '고전 문학': [
    '모든 위대한 항해는 첫 발걸음에서 시작됐어.',
    '중요한 건 눈에 보이지 않아.',
    '폭풍 속에서도 별은 떠 있어.',
    '길들인다는 건 유대를 만드는 거야.',
  ],
};

export function getOracleMessage(character: Character): string {
  const category = getSourceCategory(character.source);
  const messages = ORACLE_TEMPLATES[category] ?? ORACLE_TEMPLATES['고전 문학'];
  return messages[Math.floor(Math.random() * messages.length)];
}
