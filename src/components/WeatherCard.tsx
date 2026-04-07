/**
 * WeatherCard — Shows current weather data overlay
 * Temperature, feels-like, humidity, condition icon, precipitation probability
 */

import type { ReactNode } from 'react';
import type { WeatherTag } from '../data/types';
import { WEATHER_TAG_INFO, getTempColor } from '../data/design-tokens';
import { Droplets, Wind, Thermometer } from 'lucide-react';

function StatPill({ icon, label, value, highlight = false }: {
  icon: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '10px 4px',
      borderRadius: '12px',
      background: highlight ? 'var(--main-accent-dim)' : 'rgba(0,0,0,0.03)',
      border: highlight ? '1px solid var(--main-accent)30' : '1px solid transparent',
    }}>
      {icon}
      <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>{label}</span>
      <span style={{
        fontSize: '14px',
        fontWeight: 700,
        color: highlight ? 'var(--main-accent)' : 'var(--text)',
      }}>{value}</span>
    </div>
  );
}

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
    <div
      className={`animate-fade-in ${className}`}
      style={{
        background: `linear-gradient(135deg, ${tagInfo.color}08, var(--surface) 30%, ${tagInfo.color}05)`,
        borderRadius: 'var(--card-radius)',
        padding: '20px',
        boxShadow: 'var(--card-shadow)',
        border: `1px solid ${tagInfo.color}15`,
      }}
    >
      {/* Top row: location + big temp + condition */}
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <div>
          <div className="flex items-center gap-1" style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{'\uD83D\uDCCD'}</span>
            <span className="text-caption" style={{ color: 'var(--text-dim)', fontWeight: 600 }}>
              {locationName}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span style={{
              fontSize: '44px',
              fontWeight: 800,
              color: tempColor,
              lineHeight: 1,
              letterSpacing: '-2px',
            }}>
              {temperature}
            </span>
            <span style={{ fontSize: '20px', fontWeight: 600, color: `${tempColor}90` }}>
              °C
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center" style={{
          background: `${tagInfo.color}12`,
          borderRadius: '16px',
          padding: '12px 16px',
          minWidth: '80px',
        }}>
          <span style={{ fontSize: '36px', lineHeight: 1 }}>{tagInfo.emoji}</span>
          <span style={{
            color: tagInfo.color,
            marginTop: '6px',
            fontSize: '13px',
            fontWeight: 700,
          }}>
            {tagInfo.label}
          </span>
        </div>
      </div>

      {/* Stats grid — pill style */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        <StatPill
          icon={<Thermometer size={14} color="var(--weather-hot)" />}
          label="체감"
          value={`${feelsLike}°`}
        />
        <StatPill
          icon={<Droplets size={14} color="var(--weather-rain)" />}
          label="습도"
          value={`${humidity}%`}
        />
        <StatPill
          icon={<Wind size={14} color="var(--weather-wind)" />}
          label="바람"
          value={`${windSpeed}`}
        />
        <StatPill
          icon={<Droplets size={14} color="var(--main-accent)" />}
          label="강수"
          value={`${precipitationProb}%`}
          highlight={precipitationProb >= 50}
        />
      </div>
    </div>
  );
}
