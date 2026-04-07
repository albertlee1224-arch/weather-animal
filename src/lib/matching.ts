/**
 * Weather-to-Character Matching Logic
 *
 * 1. Check hidden triggers first (extreme weather)
 * 2. Map weather data to WeatherTag
 * 3. Filter characters by tag
 * 4. Random selection with duplicate avoidance
 */

import type { Character, WeatherTag } from '../data/types';
import { characters, standardCharacters, hiddenCharacters, fallbackCharacter } from '../data/characters';
import type { WeatherData } from './weather';
import { getLastShown } from './storage';

/**
 * Derive a WeatherTag from weather conditions
 */
export function getWeatherTag(sky: number, pty: number, tmp: number, wsd: number): WeatherTag {
  if (pty === 3 || pty === 2) return 'snow';
  if (pty === 1 || pty === 4) return 'rain';
  if (wsd >= 14) return 'wind';
  if (sky === 1 && tmp >= 33) return 'hot';
  if (sky === 1 && tmp <= -5) return 'cold';
  if (sky === 1) return 'clear';
  if (sky === 3) return 'partly_cloudy';
  if (sky === 4) return 'cloudy';
  return 'clear'; // fallback
}

/**
 * Check if any hidden character should be triggered
 * Hidden characters require extreme weather conditions
 */
export function checkHiddenTrigger(weatherData: WeatherData): Character | null {
  const currentHour = new Date().getHours();

  for (const ch of hiddenCharacters) {
    if (!ch.hiddenTrigger) continue;
    const cond = ch.hiddenTrigger.condition;
    let match = true;

    if (cond.PTY !== undefined && weatherData.pty !== cond.PTY) match = false;
    if (cond.RN1_gte !== undefined && weatherData.rn1 < cond.RN1_gte) match = false;
    if (cond.SNO_gte !== undefined && weatherData.sno < cond.SNO_gte) match = false;
    if (cond.TMP_lte !== undefined && weatherData.temperature > cond.TMP_lte) match = false;
    if (cond.TMP_gte !== undefined && weatherData.temperature < cond.TMP_gte) match = false;
    if (cond.WSD_gte !== undefined && weatherData.windSpeed < cond.WSD_gte) match = false;
    if (cond.SKY !== undefined && weatherData.sky !== cond.SKY) match = false;
    if (cond.hour_lt !== undefined && currentHour >= cond.hour_lt) match = false;

    if (match) return ch;
  }

  return null;
}

/**
 * Full matching pipeline:
 * 1. Check hidden triggers
 * 2. Get weather tag
 * 3. Filter standard characters by tag
 * 4. Avoid showing same character as yesterday
 * 5. Random pick (or fallback)
 */
export function matchCharacter(weatherData: WeatherData, lastShownId?: string): {
  character: Character;
  weatherTag: WeatherTag;
  isHidden: boolean;
} {
  // 1. Check hidden triggers first
  const hiddenMatch = checkHiddenTrigger(weatherData);
  if (hiddenMatch) {
    const tag = getWeatherTag(weatherData.sky, weatherData.pty, weatherData.temperature, weatherData.windSpeed);
    return { character: hiddenMatch, weatherTag: tag, isHidden: true };
  }

  // 2. Get weather tag
  const tag = getWeatherTag(
    weatherData.sky,
    weatherData.pty,
    weatherData.temperature,
    weatherData.windSpeed
  );

  // 3. Filter standard characters by tag
  let candidates = standardCharacters.filter(c => c.weatherTags.includes(tag));

  // 4. Avoid yesterday's character
  const effectiveLastId = lastShownId ?? getLastShown()?.characterId;
  if (effectiveLastId && candidates.length > 1) {
    candidates = candidates.filter(c => c.id !== effectiveLastId);
  }

  // 5. Pick random or fallback
  if (candidates.length === 0) {
    return { character: fallbackCharacter, weatherTag: tag, isHidden: false };
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  return { character: picked, weatherTag: tag, isHidden: false };
}

/**
 * Select a random line from a character's lines array
 */
export function selectLine(character: Character): string {
  const lines = character.lines;
  return lines[Math.floor(Math.random() * lines.length)];
}

/**
 * Get character by ID (for shared links)
 */
export function getCharacterById(id: string): Character | null {
  return characters[id] ?? null;
}
