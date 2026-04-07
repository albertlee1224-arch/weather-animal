// 날씨 동물 — Design Tokens
// Weather-themed palette: bright, playful, nature-inspired

import type { WeatherTag } from './types';

/** Weather tag → display info */
export const WEATHER_TAG_INFO: Record<WeatherTag, {
  label: string;
  emoji: string;
  color: string;
  gradient: string;
}> = {
  clear: {
    label: '맑음',
    emoji: '\u2600\uFE0F',
    color: '#FFB830',
    gradient: 'linear-gradient(135deg, #FFE066 0%, #FFB830 100%)',
  },
  partly_cloudy: {
    label: '구름많음',
    emoji: '\u26C5',
    color: '#7CB3F0',
    gradient: 'linear-gradient(135deg, #B8D4F0 0%, #7CB3F0 100%)',
  },
  cloudy: {
    label: '흐림',
    emoji: '\u2601\uFE0F',
    color: '#94A3B8',
    gradient: 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)',
  },
  rain: {
    label: '비',
    emoji: '\uD83C\uDF27\uFE0F',
    color: '#4A90D9',
    gradient: 'linear-gradient(135deg, #7CB3F0 0%, #4A90D9 100%)',
  },
  snow: {
    label: '눈',
    emoji: '\u2744\uFE0F',
    color: '#B8D4F0',
    gradient: 'linear-gradient(135deg, #E8F0FE 0%, #B8D4F0 100%)',
  },
  wind: {
    label: '바람',
    emoji: '\uD83D\uDCA8',
    color: '#64B5A0',
    gradient: 'linear-gradient(135deg, #A0D8C8 0%, #64B5A0 100%)',
  },
  hot: {
    label: '더움',
    emoji: '\uD83D\uDD25',
    color: '#F06040',
    gradient: 'linear-gradient(135deg, #FFB830 0%, #F06040 100%)',
  },
  cold: {
    label: '추움',
    emoji: '\uD83E\uDD76',
    color: '#60A0D0',
    gradient: 'linear-gradient(135deg, #B8D4F0 0%, #60A0D0 100%)',
  },
};

/** PTY code → weather icon for forecast */
export function getWeatherEmoji(sky: number, pty: number): string {
  if (pty === 3 || pty === 2) return '\u2744\uFE0F';
  if (pty === 1 || pty === 4) return '\uD83C\uDF27\uFE0F';
  if (sky === 1) return '\u2600\uFE0F';
  if (sky === 3) return '\u26C5';
  if (sky === 4) return '\u2601\uFE0F';
  return '\u2600\uFE0F';
}

/** Temperature → color */
export function getTempColor(temp: number): string {
  if (temp >= 33) return '#F06040';
  if (temp >= 25) return '#FFB830';
  if (temp >= 15) return '#4ADE80';
  if (temp >= 5) return '#7CB3F0';
  return '#60A0D0';
}

/** Gradient placeholders for characters without images */
export const CHARACTER_PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #FFE066 0%, #FFB830 50%, #F06040 100%)',
  'linear-gradient(135deg, #7CB3F0 0%, #4A90D9 50%, #3060A0 100%)',
  'linear-gradient(135deg, #A0D8C8 0%, #64B5A0 50%, #408070 100%)',
  'linear-gradient(135deg, #C084FC 0%, #9B59B6 50%, #6C3483 100%)',
  'linear-gradient(135deg, #FB7185 0%, #EC4899 50%, #BE185D 100%)',
  'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)',
];

/** Get a consistent placeholder gradient for a character id */
export function getPlaceholderGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return CHARACTER_PLACEHOLDER_GRADIENTS[Math.abs(hash) % CHARACTER_PLACEHOLDER_GRADIENTS.length];
}
