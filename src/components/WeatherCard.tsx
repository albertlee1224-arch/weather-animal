/**
 * WeatherCard — Shows current weather data overlay
 * Temperature, feels-like, humidity, condition icon, precipitation probability
 */

import type { WeatherTag } from '../data/types';
import { WEATHER_TAG_INFO, getTempColor } from '../data/design-tokens';
import { Droplets, Wind, Thermometer } from 'lucide-react';

interface WeatherCardProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitationProb: number;
  weatherTag: WeatherTag;
  locationName?: string;
  className?: string;
}

export function WeatherCard({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  precipitationProb,
  weatherTag,
  locationName = '서울',
  className = '',
}: WeatherCardProps) {
  const tagInfo = WEATHER_TAG_INFO[weatherTag];
  const tempColor = getTempColor(temperature);

  return (
    <div className={`card animate-fade-in ${className}`}>
      {/* Top row: location + condition */}
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <div>
          <div className="text-caption" style={{ color: 'var(--text-dim)' }}>
            {locationName}
          </div>
          <div className="flex items-baseline gap-1" style={{ marginTop: '2px' }}>
            <span style={{ fontSize: '36px', fontWeight: 800, color: tempColor, lineHeight: 1 }}>
              {temperature}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-dim)' }}>
              °C
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span style={{ fontSize: '40px', lineHeight: 1 }}>{tagInfo.emoji}</span>
          <span className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            {tagInfo.label}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="flex justify-between"
        style={{
          padding: '12px 0',
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <div className="weather-stat">
          <Thermometer size={16} color="var(--text-dim)" />
          <span className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            체감 {feelsLike}°
          </span>
        </div>
        <div className="weather-stat">
          <Droplets size={16} color="var(--weather-rain)" />
          <span className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            습도 {humidity}%
          </span>
        </div>
        <div className="weather-stat">
          <Wind size={16} color="var(--weather-wind)" />
          <span className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            {windSpeed}m/s
          </span>
        </div>
        <div className="weather-stat">
          <Droplets size={16} color="var(--main-accent)" />
          <span className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            강수 {precipitationProb}%
          </span>
        </div>
      </div>
    </div>
  );
}
