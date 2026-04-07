/**
 * ShareCard — 1080x1080 share card layout
 * Used by html2canvas for image export
 * Character + weather + one-liner + branding
 */

import { useState } from 'react';
import type { Character, WeatherTag } from '../data/types';
import { WEATHER_TAG_INFO, getPlaceholderGradient, getTempColor } from '../data/design-tokens';

const CDN_BASE = 'https://res.cloudinary.com/dgb5fdcmb/image/upload/w_512,q_auto,f_webp/weather-animal';

interface ShareCardProps {
  character: Character;
  line: string;
  temperature: number;
  weatherTag: WeatherTag;
  locationName?: string;
  date?: string;
}

export function ShareCard({
  character,
  line,
  temperature,
  weatherTag,
  locationName = '서울',
  date,
}: ShareCardProps) {
  const [imgError, setImgError] = useState(false);
  const tagInfo = WEATHER_TAG_INFO[weatherTag];
  const gradient = getPlaceholderGradient(character.id);
  const tempColor = getTempColor(temperature);
  const displayDate = date ?? new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      id="share-card"
      style={{
        width: '1080px',
        height: '1080px',
        background: `linear-gradient(180deg, ${character.colors.bg} 0%, #FFFFFF 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 80px',
        fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: gradient,
          opacity: 0.1,
        }}
      />

      {/* Top: Date + Weather */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '28px', color: '#8899AA', marginBottom: '8px' }}>
          {displayDate}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ fontSize: '48px' }}>{tagInfo.emoji}</span>
          <span style={{ fontSize: '48px', fontWeight: 800, color: tempColor }}>
            {temperature}°C
          </span>
        </div>
        <div style={{ fontSize: '24px', color: '#8899AA', marginTop: '4px' }}>
          {locationName} · {tagInfo.label}
        </div>
      </div>

      {/* Middle: Character */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {!imgError ? (
          <img
            src={`${CDN_BASE}/${character.id}`}
            alt={character.name}
            style={{
              maxHeight: '400px',
              maxWidth: '400px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.15))',
            }}
            onError={() => setImgError(true)}
            crossOrigin="anonymous"
          />
        ) : (
          <div
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: '120px' }}>{character.animal.slice(0, 1)}</span>
          </div>
        )}
      </div>

      {/* Bottom: Name + Line + Branding */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '20px', color: '#8899AA', marginBottom: '4px' }}>
          {character.source}
        </div>
        <div style={{ fontSize: '36px', fontWeight: 800, color: '#1A2332', marginBottom: '16px' }}>
          {character.name}
        </div>
        <div
          style={{
            fontSize: '28px',
            fontWeight: 500,
            color: '#5A6B80',
            fontStyle: 'italic',
            lineHeight: 1.4,
            marginBottom: '24px',
          }}
        >
          &ldquo;{line}&rdquo;
        </div>
        <div
          style={{
            fontSize: '20px',
            color: '#B0B8C4',
            letterSpacing: '1px',
          }}
        >
          weather-animal.vercel.app
        </div>
      </div>
    </div>
  );
}
