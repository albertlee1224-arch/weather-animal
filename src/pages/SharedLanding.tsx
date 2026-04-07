/**
 * SharedLanding — Destination for shared links
 *
 * URL: /c/:characterId
 * Shows character card + CTA to open app
 */

import { useParams, useNavigate } from 'react-router-dom';
import { getCharacterById } from '../lib/matching';
import { Button } from '../components/ui';
import { getPlaceholderGradient, WEATHER_TAG_INFO } from '../data/design-tokens';
import { useState } from 'react';

const CDN_BASE = 'https://res.cloudinary.com/dgb5fdcmb/image/upload/w_512,q_auto,f_webp/weather-animal';

export default function SharedLanding() {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const character = characterId ? getCharacterById(characterId) : null;

  if (!character) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>{'\uD83D\uDC3E'}</p>
        <p className="text-title" style={{ textAlign: 'center' }}>
          이 캐릭터를 찾을 수 없어요
        </p>
        <Button variant="primary" onClick={() => navigate('/')} style={{ marginTop: '20px', maxWidth: '240px' }}>
          나도 날씨 동물 만나기
        </Button>
      </div>
    );
  }

  const gradient = getPlaceholderGradient(character.id);
  const randomLine = character.lines[Math.floor(Math.random() * character.lines.length)];

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Character hero */}
      <div
        style={{
          height: '50vh',
          background: character.colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!imgError ? (
          <img
            src={`${CDN_BASE}/${character.id}`}
            alt={character.name}
            style={{
              maxHeight: '70%',
              maxWidth: '70%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '64px' }}>{character.animal.slice(0, 1)}</span>
          </div>
        )}

        {/* Rarity badge */}
        {character.rarity === 'hidden' && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'var(--rarity-hidden)',
              color: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {'\u2728'} 히든 캐릭터
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container-app flex-1 flex flex-col" style={{ paddingTop: '24px', paddingBottom: '32px' }}>
        {/* Character info */}
        <div style={{ textAlign: 'center' }}>
          <h1 className="text-display" style={{ color: character.colors.primary }}>
            {character.name}
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-dim)', marginTop: '4px' }}>
            {character.source}
          </p>
        </div>

        {/* One-liner */}
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            background: character.colors.bg,
            borderRadius: '16px',
            border: `1px solid ${character.colors.primary}20`,
            textAlign: 'center',
          }}
        >
          <p
            className="text-title"
            style={{
              color: 'var(--text)',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            &ldquo;{randomLine}&rdquo;
          </p>
        </div>

        {/* Weather tags */}
        <div className="flex flex-wrap justify-center gap-2" style={{ marginTop: '16px' }}>
          {character.weatherTags.map(tag => (
            <span
              key={tag}
              className="badge"
              style={{
                background: `${WEATHER_TAG_INFO[tag].color}15`,
                color: WEATHER_TAG_INFO[tag].color,
              }}
            >
              {WEATHER_TAG_INFO[tag].emoji} {WEATHER_TAG_INFO[tag].label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex-1" />
        <div style={{ marginTop: '32px' }}>
          <Button variant="primary" color={character.colors.primary} onClick={() => navigate('/')}>
            {'\uD83D\uDC3E'} 나도 오늘의 날씨 동물 만나기
          </Button>
          <p
            className="text-caption"
            style={{
              textAlign: 'center',
              color: 'var(--text-dim)',
              marginTop: '12px',
            }}
          >
            30종 캐릭터를 수집하고 공유하세요
          </p>
        </div>
      </div>
    </div>
  );
}
