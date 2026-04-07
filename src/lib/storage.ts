/**
 * localStorage Helpers for Weather Animal
 *
 * Schema:
 * - discoveredCharacters: Record<string, { firstSeen, seenCount, lastWeather }>
 * - lastShown: { characterId, date, line }
 * - locationCache: { lat, lng, gridX, gridY, cityName, updatedAt }
 */

import type { WeatherTag } from '../data/types';

const STORAGE_KEY = 'weather-animal';

interface DiscoveredEntry {
  firstSeen: string;     // ISO date
  seenCount: number;
  lastWeather: WeatherTag;
}

interface LastShownEntry {
  characterId: string;
  date: string;          // YYYY-MM-DD
  line: string;
}

interface LocationCacheEntry {
  lat: number;
  lng: number;
  gridX: number;
  gridY: number;
  cityName: string;
  updatedAt: string;
}

interface StorageData {
  discoveredCharacters: Record<string, DiscoveredEntry>;
  lastShown: LastShownEntry | null;
  locationCache: LocationCacheEntry | null;
}

function getStorage(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StorageData;
    }
  } catch {
    // Corrupted data — reset
  }
  return {
    discoveredCharacters: {},
    lastShown: null,
    locationCache: null,
  };
}

function setStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}


// ── Discovered Characters ──

export function discoverCharacter(id: string, weatherTag: WeatherTag): void {
  const data = getStorage();
  const existing = data.discoveredCharacters[id];

  if (existing) {
    data.discoveredCharacters[id] = {
      ...existing,
      seenCount: existing.seenCount + 1,
      lastWeather: weatherTag,
    };
  } else {
    data.discoveredCharacters[id] = {
      firstSeen: new Date().toISOString(),
      seenCount: 1,
      lastWeather: weatherTag,
    };
  }

  setStorage(data);
}

export function getDiscoveredIds(): string[] {
  const data = getStorage();
  return Object.keys(data.discoveredCharacters);
}

export function getDiscoveredEntry(id: string): DiscoveredEntry | null {
  const data = getStorage();
  return data.discoveredCharacters[id] ?? null;
}

export function getDiscoveredCount(): number {
  return getDiscoveredIds().length;
}


// ── Last Shown ──

export function getLastShown(): LastShownEntry | null {
  const data = getStorage();
  return data.lastShown;
}

export function setLastShown(characterId: string, line: string): void {
  const data = getStorage();
  const today = new Date().toISOString().slice(0, 10);
  data.lastShown = { characterId, date: today, line };
  setStorage(data);
}

/**
 * Check if today's character has already been shown
 */
export function isTodayShown(): boolean {
  const last = getLastShown();
  if (!last) return false;
  const today = new Date().toISOString().slice(0, 10);
  return last.date === today;
}


// ── Location Cache ──

export function getLocationCache(): LocationCacheEntry | null {
  const data = getStorage();
  if (!data.locationCache) return null;

  // Check if cache is still fresh (< 1 hour)
  const updatedAt = new Date(data.locationCache.updatedAt).getTime();
  const oneHour = 60 * 60 * 1000;
  if (Date.now() - updatedAt > oneHour) return null;

  return data.locationCache;
}

export function setLocationCache(entry: LocationCacheEntry): void {
  const data = getStorage();
  data.locationCache = { ...entry, updatedAt: new Date().toISOString() };
  setStorage(data);
}
