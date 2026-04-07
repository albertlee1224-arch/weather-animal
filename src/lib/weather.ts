/**
 * 기상청 단기예보 API Integration
 *
 * - LCC coordinate conversion (lat/lng -> nx/ny grid)
 * - base_time calculation (nearest 3-hour slot, with 10-min delay)
 * - API response parsing (TMP, SKY, PTY, POP, WSD, REH, TMN, TMX)
 * - Geolocation wrapper with Seoul fallback
 * - Demo mode when API key is not available
 */

// ── Types ──

export interface WeatherData {
  /** Current temperature (°C) */
  temperature: number;
  /** Feels-like temperature (°C) — approximated from wind chill */
  feelsLike: number;
  /** Sky condition: 1=맑음, 3=구름많음, 4=흐림 */
  sky: number;
  /** Precipitation type: 0=없음, 1=비, 2=비/눈, 3=눈, 4=소나기 */
  pty: number;
  /** Precipitation probability (%) */
  pop: number;
  /** Wind speed (m/s) */
  windSpeed: number;
  /** Humidity (%) */
  humidity: number;
  /** Min temperature (°C) — may be null if not in today's data */
  tempMin: number | null;
  /** Max temperature (°C) — may be null if not in today's data */
  tempMax: number | null;
  /** 1-hour precipitation (mm) */
  rn1: number;
  /** 1-hour snowfall (cm) */
  sno: number;
  /** Forecast time (HHmm format) */
  fcstTime: string;
  /** Forecast date (YYYYMMDD) */
  fcstDate: string;
  /** Location info */
  location: {
    nx: number;
    ny: number;
    cityName: string;
  };
  /** Hourly forecast items for next 6 hours */
  hourlyForecast: HourlyForecast[];
  /** Whether this is demo/mock data */
  isDemo: boolean;
}

export interface HourlyForecast {
  time: string; // "HHmm"
  temperature: number;
  sky: number;
  pty: number;
  pop: number;
}

export interface LocationData {
  lat: number;
  lng: number;
  nx: number;
  ny: number;
  cityName: string;
}


// ── LCC Coordinate Conversion ──
// Lambert Conformal Conic projection for KMA grid

interface LCCParams {
  Re: number;
  grid: number;
  slat1: number;
  slat2: number;
  olon: number;
  olat: number;
  xo: number;
  yo: number;
}

const LCC: LCCParams = {
  Re: 6371.00877, // Earth radius (km)
  grid: 5.0,      // Grid spacing (km)
  slat1: 30.0,    // Standard latitude 1
  slat2: 60.0,    // Standard latitude 2
  olon: 126.0,    // Origin longitude
  olat: 38.0,     // Origin latitude
  xo: 43,         // X offset
  yo: 136,        // Y offset
};

/**
 * Convert lat/lng to KMA grid coordinates (nx, ny)
 */
export function latLngToGrid(lat: number, lng: number): { nx: number; ny: number } {
  const { Re, grid, slat1, slat2, olon, olat, xo, yo } = LCC;
  const DEGRAD = Math.PI / 180.0;

  const re = Re / grid;
  const slat1R = slat1 * DEGRAD;
  const slat2R = slat2 * DEGRAD;
  const olatR = olat * DEGRAD;
  const olonR = olon * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2R * 0.5) / Math.tan(Math.PI * 0.25 + slat1R * 0.5);
  sn = Math.log(Math.cos(slat1R) / Math.cos(slat2R)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1R * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1R)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olatR * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lng * DEGRAD - olonR;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + xo + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + yo + 0.5);

  return { nx, ny };
}


// ── Base Time Calculation ──

const BASE_TIMES = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];

/**
 * Calculate the nearest base_time for KMA API
 * Accounts for ~10 min publishing delay
 */
export function getBaseDateTime(): { baseDate: string; baseTime: string } {
  const now = new Date();
  // Subtract 10 minutes for API publishing delay
  const adjusted = new Date(now.getTime() - 10 * 60 * 1000);

  const currentHHMM = adjusted.getHours() * 100 + adjusted.getMinutes();

  let baseTime = BASE_TIMES[0];
  let baseDate = formatDate(adjusted);

  // Find the most recent base_time
  for (let i = BASE_TIMES.length - 1; i >= 0; i--) {
    if (currentHHMM >= parseInt(BASE_TIMES[i], 10)) {
      baseTime = BASE_TIMES[i];
      break;
    }
  }

  // If current time is before 0200 (with delay), use yesterday's 2300
  if (currentHHMM < 200) {
    const yesterday = new Date(adjusted.getTime() - 24 * 60 * 60 * 1000);
    baseDate = formatDate(yesterday);
    baseTime = '2300';
  }

  return { baseDate, baseTime };
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}


// ── Geolocation ──

const SEOUL_DEFAULT: LocationData = {
  lat: 37.5665,
  lng: 126.978,
  nx: 60,
  ny: 127,
  cityName: '서울',
};

export function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(SEOUL_DEFAULT);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const { nx, ny } = latLngToGrid(latitude, longitude);
        resolve({
          lat: latitude,
          lng: longitude,
          nx,
          ny,
          cityName: '현재 위치',
        });
      },
      () => {
        // Permission denied or error — fallback to Seoul
        resolve(SEOUL_DEFAULT);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 600000, // 10 min cache
      }
    );
  });
}


// ── API Fetching ──

interface KMAItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

/**
 * Fetch weather data from KMA API
 * Falls back to demo data if API key is missing or call fails
 */
export async function fetchWeather(location?: LocationData): Promise<WeatherData> {
  const loc = location ?? await getCurrentLocation();
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // If no API key, return demo data
  if (!apiKey || apiKey === 'your_api_key_here') {
    return getDemoWeatherData(loc);
  }

  try {
    const { baseDate, baseTime } = getBaseDateTime();
    const params = new URLSearchParams({
      serviceKey: apiKey,
      numOfRows: '300',
      pageNo: '1',
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: String(loc.nx),
      ny: String(loc.ny),
    });

    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?${params.toString()}`;

    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      throw new Error(`KMA API error: ${response.status}`);
    }

    const data = await response.json();
    const items: KMAItem[] = data?.response?.body?.items?.item;

    if (!items || items.length === 0) {
      throw new Error('No weather data items returned');
    }

    return parseKMAResponse(items, loc);
  } catch {
    // API failure — return demo data
    return getDemoWeatherData(loc);
  }
}

/**
 * Parse KMA API response items into WeatherData
 */
function parseKMAResponse(items: KMAItem[], location: LocationData): WeatherData {
  const now = new Date();
  const todayStr = formatDate(now);
  const currentHour = now.getHours();

  // Find the nearest forecast time
  const nearestTime = `${String(currentHour).padStart(2, '0')}00`;

  // Group by forecast time
  const timeGroups = new Map<string, Map<string, string>>();
  for (const item of items) {
    const key = `${item.fcstDate}-${item.fcstTime}`;
    if (!timeGroups.has(key)) {
      timeGroups.set(key, new Map());
    }
    timeGroups.get(key)!.set(item.category, item.fcstValue);
  }

  // Find current time slot
  let currentSlotKey = '';
  let minDiff = Infinity;
  for (const key of timeGroups.keys()) {
    const [date, time] = key.split('-');
    if (date === todayStr) {
      const timeNum = parseInt(time, 10);
      const diff = Math.abs(timeNum - parseInt(nearestTime, 10));
      if (diff < minDiff) {
        minDiff = diff;
        currentSlotKey = key;
      }
    }
  }

  // Fallback to first available slot
  if (!currentSlotKey) {
    currentSlotKey = Array.from(timeGroups.keys())[0] ?? '';
  }

  const currentData = timeGroups.get(currentSlotKey) ?? new Map<string, string>();
  const [fcstDate, fcstTime] = currentSlotKey.split('-');

  const tmp = parseFloat(currentData.get('TMP') ?? '20');
  const wsd = parseFloat(currentData.get('WSD') ?? '2');

  // Build hourly forecast (next 6 hours)
  const hourlyForecast: HourlyForecast[] = [];
  const sortedKeys = Array.from(timeGroups.keys()).sort();
  const currentIdx = sortedKeys.indexOf(currentSlotKey);
  for (let i = currentIdx + 1; i < sortedKeys.length && hourlyForecast.length < 6; i++) {
    const slotData = timeGroups.get(sortedKeys[i])!;
    const [, slotTime] = sortedKeys[i].split('-');
    hourlyForecast.push({
      time: slotTime,
      temperature: parseFloat(slotData.get('TMP') ?? '20'),
      sky: parseInt(slotData.get('SKY') ?? '1', 10),
      pty: parseInt(slotData.get('PTY') ?? '0', 10),
      pop: parseInt(slotData.get('POP') ?? '0', 10),
    });
  }

  // Find TMN/TMX across all time slots
  let tempMin: number | null = null;
  let tempMax: number | null = null;
  for (const [, data] of timeGroups) {
    const tmn = data.get('TMN');
    const tmx = data.get('TMX');
    if (tmn) tempMin = parseFloat(tmn);
    if (tmx) tempMax = parseFloat(tmx);
  }

  return {
    temperature: tmp,
    feelsLike: calculateFeelsLike(tmp, wsd),
    sky: parseInt(currentData.get('SKY') ?? '1', 10),
    pty: parseInt(currentData.get('PTY') ?? '0', 10),
    pop: parseInt(currentData.get('POP') ?? '0', 10),
    windSpeed: wsd,
    humidity: parseInt(currentData.get('REH') ?? '50', 10),
    tempMin,
    tempMax,
    rn1: parseFloat(currentData.get('RN1') ?? '0'),
    sno: parseFloat(currentData.get('SNO') ?? '0'),
    fcstTime: fcstTime ?? nearestTime,
    fcstDate: fcstDate ?? todayStr,
    location: {
      nx: location.nx,
      ny: location.ny,
      cityName: location.cityName,
    },
    hourlyForecast,
    isDemo: false,
  };
}

/**
 * Approximate feels-like temperature (wind chill)
 */
function calculateFeelsLike(temp: number, windSpeed: number): number {
  if (temp > 10 || windSpeed < 1.3) return temp;
  // Wind chill formula
  const wc = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed * 3.6, 0.16) + 0.3965 * temp * Math.pow(windSpeed * 3.6, 0.16);
  return Math.round(wc);
}


// ── Demo Mode ──

/**
 * Generate realistic demo weather data based on current time
 */
function getDemoWeatherData(location: LocationData): WeatherData {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;

  // Seasonal temperature ranges
  let baseTemp: number;
  if (month >= 6 && month <= 8) baseTemp = 25 + Math.floor(Math.random() * 8);
  else if (month >= 12 || month <= 2) baseTemp = -2 + Math.floor(Math.random() * 8);
  else if (month >= 3 && month <= 5) baseTemp = 10 + Math.floor(Math.random() * 10);
  else baseTemp = 12 + Math.floor(Math.random() * 10);

  // Time-of-day adjustment
  if (hour < 6) baseTemp -= 3;
  else if (hour > 18) baseTemp -= 2;
  else if (hour >= 12 && hour <= 15) baseTemp += 2;

  // Random weather conditions
  const skyOptions = [1, 1, 3, 3, 4]; // weighted toward clear/partly cloudy
  const sky = skyOptions[Math.floor(Math.random() * skyOptions.length)];
  const ptyChance = Math.random();
  const pty = ptyChance > 0.8 ? 1 : ptyChance > 0.95 ? 3 : 0;
  const windSpeed = 1 + Math.round(Math.random() * 6 * 10) / 10;
  const humidity = 40 + Math.floor(Math.random() * 40);
  const pop = pty > 0 ? 60 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 30);

  // Build 6-hour forecast
  const hourlyForecast: HourlyForecast[] = [];
  for (let i = 1; i <= 6; i++) {
    const fHour = (hour + i) % 24;
    hourlyForecast.push({
      time: `${String(fHour).padStart(2, '0')}00`,
      temperature: baseTemp + Math.floor(Math.random() * 4 - 2),
      sky: skyOptions[Math.floor(Math.random() * skyOptions.length)],
      pty: Math.random() > 0.85 ? 1 : 0,
      pop: Math.floor(Math.random() * 40),
    });
  }

  return {
    temperature: baseTemp,
    feelsLike: calculateFeelsLike(baseTemp, windSpeed),
    sky,
    pty,
    pop,
    windSpeed,
    humidity,
    tempMin: baseTemp - 5,
    tempMax: baseTemp + 4,
    rn1: pty > 0 ? Math.round(Math.random() * 10 * 10) / 10 : 0,
    sno: 0,
    fcstTime: `${String(hour).padStart(2, '0')}00`,
    fcstDate: formatDate(now),
    location: {
      nx: location.nx,
      ny: location.ny,
      cityName: location.cityName,
    },
    hourlyForecast,
    isDemo: true,
  };
}
