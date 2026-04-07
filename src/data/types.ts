// 날씨 동물 — 타입 정의
// "레퍼런스 오버로드" 캐릭터 레지스트리 타입 시스템

/** 기상청 API 날씨 코드에서 파생되는 날씨 태그 */
export type WeatherTag =
  | 'clear'          // 맑음 (SKY=1)
  | 'partly_cloudy'  // 구름많음 (SKY=3)
  | 'cloudy'         // 흐림 (SKY=4)
  | 'rain'           // 비 (PTY=1,4)
  | 'snow'           // 눈 (PTY=2,3)
  | 'wind'           // 바람 (WSD>=14)
  | 'hot'            // 폭염 (TMP>=33)
  | 'cold';          // 한파 (TMP<=-5)

/** 캐릭터 등급 */
export type Rarity = 'standard' | 'hidden';

/** 히든 캐릭터 트리거 조건 */
export interface HiddenTrigger {
  /** 트리거 이름 (한글) */
  label: string;
  /** 트리거 조건 설명 */
  description: string;
  /**
   * 트리거 판별 함수에서 사용할 조건
   * - 기상청 API 원시 필드 기반
   */
  condition: {
    /** PTY 강수형태 (1=비, 2=비/눈, 3=눈, 4=소나기) */
    PTY?: number;
    /** RN1 1시간 강수량 (mm) — 이상 */
    RN1_gte?: number;
    /** SNO 1시간 신적설 (cm) — 이상 */
    SNO_gte?: number;
    /** TMP 기온 (°C) — 이하 */
    TMP_lte?: number;
    /** TMP 기온 (°C) — 이상 */
    TMP_gte?: number;
    /** WSD 풍속 (m/s) — 이상 */
    WSD_gte?: number;
    /** SKY 하늘상태 (1=맑음, 3=구름많음, 4=흐림) */
    SKY?: number;
    /** 시간 조건 — 미만 (0~23) */
    hour_lt?: number;
  };
}

/** 캐릭터 색상 세트 */
export interface CharacterColors {
  /** 메인 강조 색상 (HEX) */
  primary: string;
  /** 보조 어두운 색상 (HEX) */
  secondary: string;
  /** 배경 색상 (rgba, alpha 0.08-0.12) */
  bg: string;
}

/** 캐릭터 정의 */
export interface Character {
  /** 고유 식별자 (kebab-case) */
  id: string;
  /** 캐릭터 이름 (한국어, 저작권 안전 트윅) */
  name: string;
  /** 원작/출처 (한국어) */
  source: string;
  /** 동물 종류 */
  animal: string;
  /** 등장 가능한 날씨 태그 (2-4개) */
  weatherTags: WeatherTag[];
  /** 등급: standard(24종) | hidden(6종) */
  rarity: Rarity;
  /** 히든 캐릭터 트리거 조건 (hidden일 때만) */
  hiddenTrigger?: HiddenTrigger;
  /** 한줄 성격 설명 */
  personality: string;
  /** 위트 있는 한마디 5개 (20-40자) */
  lines: string[];
  /** 캐릭터 색상 세트 */
  colors: CharacterColors;
  /** 폴백 캐릭터 여부 — 모든 날씨에 등장 가능 (전체 중 1종만 true) */
  fallback: boolean;
  /** Recraft 이미지 생성용 프롬프트 */
  recraftPrompt: string;
}

/** 캐릭터 레지스트리 (id → Character) */
export type CharacterRegistry = Record<string, Character>;

/** 날씨 태그별 최소 캐릭터 수 요구사항 */
export const WEATHER_TAG_MIN_CHARACTERS: Record<WeatherTag, number> = {
  clear: 3,
  partly_cloudy: 3,
  cloudy: 3,
  rain: 4,
  snow: 3,
  wind: 3,
  hot: 3,
  cold: 3,
};

/** 도감 힌트 — 히든 캐릭터용 */
export const HIDDEN_HINTS: Record<string, string> = {
  'downpour': '하늘이 무너질 듯 비가 쏟아지는 날 나타나요',
  'blizzard': '세상이 하얗게 뒤덮이는 날 나타나요',
  'extreme-cold': '숨이 얼어붙을 만큼 추운 날 나타나요',
  'extreme-heat': '아스팔트가 녹을 듯 뜨거운 날 나타나요',
  'gale': '나무가 뿌리째 뽑힐 듯한 바람이 부는 날 나타나요',
  'dawn-fog': '새벽녘 차가운 안개가 내려앉은 날 나타나요',
};
