/**
 * Home Page — Main weather + character display
 *
 * Flow: get location -> fetch weather -> match character -> display
 * Full-bleed CharacterView + WeatherCard + forecast strip
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Share2, RefreshCw, AlertTriangle } from 'lucide-react';
import { CharacterView } from '../components/CharacterView';
import { WeatherCard } from '../components/WeatherCard';
import { Button } from '../components/ui';
import { fetchWeather, type WeatherData } from '../lib/weather';
import { matchCharacter, selectLine, getWeatherTag } from '../lib/matching';
import { discoverCharacter, setLastShown, isTodayShown, getLastShown } from '../lib/storage';
import { getCharacterById } from '../lib/matching';
import { getWeatherEmoji } from '../data/design-tokens';
import type { Character, WeatherTag } from '../data/types';

type PageState = 'loading' | 'ready' | 'error';

export default function Home() {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('loading');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [line, setLine] = useState('');
  const [weatherTag, setWeatherTag] = useState<WeatherTag>('clear');
  const [isHidden, setIsHidden] = useState(false);

  const loadWeather = useCallback(async () => {
    setState('loading');
    try {
      const weatherData = await fetchWeather();
      setWeather(weatherData);

      // Check if today's character was already shown
      if (isTodayShown()) {
        const last = getLastShown()!;
        const existingChar = getCharacterById(last.characterId);
        if (existingChar) {
          setCharacter(existingChar);
          setLine(last.line);
          const tag = getWeatherTag(weatherData.sky, weatherData.pty, weatherData.temperature, weatherData.windSpeed);
          setWeatherTag(tag);
          setState('ready');
          return;
        }
      }

      // Match a new character
      const result = matchCharacter(weatherData);
      const selectedLine = selectLine(result.character);

      setCharacter(result.character);
      setLine(selectedLine);
      setWeatherTag(result.weatherTag);
      setIsHidden(result.isHidden);

      // Save to storage
      discoverCharacter(result.character.id, result.weatherTag);
      setLastShown(result.character.id, selectedLine);

      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // ── Loading State ──
  if (state === 'loading') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div
          className="animate-bounce"
          style={{ fontSize: '64px', marginBottom: '16px' }}
        >
          {'\uD83D\uDC3E'}
        </div>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          오늘의 날씨 동물을 찾고 있어요...
        </p>
      </div>
    );
  }

  // ── Error State ──
  if (state === 'error') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-5" style={{ background: 'var(--bg)' }}>
        <AlertTriangle size={48} color="var(--warning)" />
        <p className="text-title" style={{ textAlign: 'center' }}>
          날씨 정보를 불러오지 못했어요
        </p>
        <p className="text-body" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          인터넷 연결을 확인하고 다시 시도해주세요
        </p>
        <Button
          variant="primary"
          onClick={loadWeather}
          style={{ maxWidth: '200px' }}
        >
          <RefreshCw size={18} style={{ marginRight: '8px' }} />
          다시 시도
        </Button>
      </div>
    );
  }

  if (!character || !weather) return null;

  // ── Weather tips ──
  const tipText = getTipText(weather, character);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Character full-bleed hero */}
      <CharacterView
        character={character}
        line={line}
        height="55vh"
      />

      {/* Hidden character badge */}
      {isHidden && (
        <div className="animate-fade-in" style={{
          margin: '-12px 20px 0',
          position: 'relative',
          zIndex: 10,
        }}>
          <div
            className="badge"
            style={{
              background: 'var(--rarity-hidden)',
              color: '#FFFFFF',
              padding: '6px 14px',
              fontSize: '13px',
              boxShadow: '0 2px 12px rgba(192,132,252,0.3)',
            }}
          >
            {'\u2728'} 히든 캐릭터 발견!
          </div>
        </div>
      )}

      {/* Demo mode indicator */}
      {weather.isDemo && (
        <div
          className="text-caption animate-fade-in"
          style={{
            textAlign: 'center',
            color: 'var(--text-dim)',
            padding: '8px',
            background: 'rgba(251,191,36,0.08)',
            margin: '0 20px',
            borderRadius: '8px',
            marginTop: '8px',
          }}
        >
          {'\uD83D\uDCA1'} 데모 모드 — 실제 날씨 API 키를 등록하면 현재 날씨가 표시됩니다
        </div>
      )}

      {/* Content area */}
      <div className="container-app flex-1" style={{ paddingTop: '16px', paddingBottom: '24px' }}>
        {/* Weather card */}
        <WeatherCard
          temperature={weather.temperature}
          feelsLike={weather.feelsLike}
          humidity={weather.humidity}
          windSpeed={weather.windSpeed}
          precipitationProb={weather.pop}
          weatherTag={weatherTag}
          locationName={weather.location.cityName}
        />

        {/* Weather tip */}
        {tipText && (
          <div
            className="card animate-fade-in stagger-2"
            style={{
              marginTop: '12px',
              padding: '14px 18px',
              background: character.colors.bg,
              border: `1px solid ${character.colors.primary}20`,
            }}
          >
            <p className="text-body" style={{ color: character.colors.secondary, fontWeight: 500 }}>
              {tipText}
            </p>
          </div>
        )}

        {/* 6-hour forecast strip */}
        {weather.hourlyForecast.length > 0 && (
          <div className="animate-fade-in stagger-3" style={{ marginTop: '16px' }}>
            <p className="text-caption" style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>
              시간별 예보
            </p>
            <div className="forecast-strip">
              {weather.hourlyForecast.map((fc) => (
                <div key={fc.time} className="forecast-item">
                  <span className="text-caption" style={{ color: 'var(--text-dim)' }}>
                    {formatForecastTime(fc.time)}
                  </span>
                  <span style={{ fontSize: '20px' }}>
                    {getWeatherEmoji(fc.sky, fc.pty)}
                  </span>
                  <span className="text-caption" style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {fc.temperature}°
                  </span>
                  {fc.pop > 0 && (
                    <span className="text-caption" style={{ color: 'var(--weather-rain)', fontSize: '11px' }}>
                      {fc.pop}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 animate-fade-in stagger-4" style={{ marginTop: '20px' }}>
          <Button
            variant="secondary"
            onClick={() => navigate('/pokedex')}
            style={{ flex: 1 }}
          >
            <BookOpen size={18} style={{ marginRight: '8px' }} />
            도감
          </Button>
          <Button
            variant="primary"
            color={character.colors.primary}
            onClick={() => navigate('/share', {
              state: {
                characterId: character.id,
                line,
                weatherTag,
                temperature: weather.temperature,
                locationName: weather.location.cityName,
              },
            })}
            style={{ flex: 1 }}
          >
            <Share2 size={18} style={{ marginRight: '8px' }} />
            공유하기
          </Button>
        </div>
      </div>
    </div>
  );
}


// ── Helpers ──

function getTipText(weather: WeatherData, character: Character): string | null {
  const { pop, temperature, windSpeed } = weather;

  // Umbrella reminder
  if (pop >= 50) {
    return `${character.name}: "${'\u2602\uFE0F'} 우산 챙겨! 강수 확률 ${pop}%야."`;
  }

  // Cold weather tip
  if (temperature <= 0) {
    return `${character.name}: "${'\uD83E\uDDE5'} 패딩 입고 나가! 밖에 ${temperature}°C야."`;
  }

  // Hot weather tip
  if (temperature >= 30) {
    return `${character.name}: "${'\uD83E\uDDD4'} 선크림 필수! ${temperature}°C면 자외선 조심."`;
  }

  // Windy day
  if (windSpeed >= 10) {
    return `${character.name}: "${'\uD83D\uDCA8'} 바람 세니까 모자 꽉 잡아!"`;
  }

  return null;
}

function formatForecastTime(time: string): string {
  const hour = parseInt(time.slice(0, 2), 10);
  if (hour === 0) return '자정';
  if (hour === 12) return '정오';
  if (hour < 12) return `오전 ${hour}시`;
  return `오후 ${hour - 12}시`;
}
