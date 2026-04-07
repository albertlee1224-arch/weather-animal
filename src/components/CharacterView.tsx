/**
 * CharacterView — Full-bleed character hero
 *
 * The "쓸데없는 고퀄" moment. Even without real images,
 * the placeholder is a rich, layered visual experience.
 */

import { useState } from 'react';
import type { Character } from '../data/types';
import { getPlaceholderGradient, WEATHER_TAG_INFO } from '../data/design-tokens';
import type { WeatherTag } from '../data/types';

const CDN_BASE = 'https://res.cloudinary.com/dgb5fdcmb/image/upload/w_512,q_auto,f_webp/weather-animal';

interface CharacterViewProps {
  character: Character;
  line: string;
  weatherTag?: WeatherTag;
  className?: string;
  showLine?: boolean;
  height?: string;
}

export function CharacterView({
  character,
  line,
  weatherTag,
  className = '',
  showLine = true,
  height = '58vh',
}: CharacterViewProps) {
  const [imgError, setImgError] = useState(false);
  const gradient = getPlaceholderGradient(character.id);
  const tagInfo = weatherTag ? WEATHER_TAG_INFO[weatherTag] : null;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        borderRadius: '0 0 32px 32px',
        boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
      }}
    >
      {/* Layered background — gradient + pattern */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(145deg, ${character.colors.primary}22 0%, ${character.colors.bg} 40%, ${character.colors.secondary}15 100%)`,
      }} />
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at 80% 20%, ${character.colors.primary}18 0%, transparent 50%),
                     radial-gradient(circle at 20% 80%, ${character.colors.secondary}12 0%, transparent 50%)`,
      }} />

      {/* Decorative weather particles */}
      {tagInfo && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute animate-float"
              style={{
                fontSize: `${16 + i * 4}px`,
                opacity: 0.12 + i * 0.03,
                left: `${10 + i * 18}%`,
                top: `${8 + (i * 17) % 40}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            >
              {tagInfo.emoji}
            </span>
          ))}
        </div>
      )}

      {/* Character image / rich placeholder */}
      <div className="relative flex items-center justify-center h-full" style={{ paddingBottom: '100px' }}>
        {!imgError ? (
          <img
            src={`${CDN_BASE}/${character.id}`}
            alt={character.name}
            className="animate-scale-in"
            style={{
              maxHeight: '65%',
              maxWidth: '65%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.18))',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Rich placeholder — layered rings + emoji + glow */
          <div className="animate-scale-in flex items-center justify-center" style={{ position: 'relative' }}>
            {/* Outer glow ring */}
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, ${character.colors.primary}30, ${character.colors.secondary}20, ${character.colors.primary}30)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 60px ${character.colors.primary}25, inset 0 0 30px ${character.colors.primary}10`,
              animation: 'spin 12s linear infinite',
            }}>
              {/* Inner solid circle */}
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${character.colors.primary}30`,
                animation: 'none',
              }}>
                <span style={{
                  fontSize: '72px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                }}>
                  {character.animal.slice(0, 2)}
                </span>
              </div>
            </div>

            {/* Floating name tag */}
            <div
              className="absolute animate-float"
              style={{
                bottom: '-16px',
                background: character.colors.primary,
                color: '#FFFFFF',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: `0 4px 16px ${character.colors.primary}40`,
                letterSpacing: '-0.01em',
              }}
            >
              {character.animal}
            </div>
          </div>
        )}
      </div>

      {/* Bottom overlay — glassmorphism card */}
      <div
        className="absolute bottom-0 left-0 right-0 animate-slide-up"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          padding: '60px 24px 24px',
        }}
      >
        {/* Source tag */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          padding: '4px 12px',
          borderRadius: '12px',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '8px',
        }}>
          {character.source}
        </div>

        {/* Character name */}
        <div style={{
          color: '#FFFFFF',
          fontSize: '26px',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          marginBottom: showLine ? '10px' : '0',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {character.name}
        </div>

        {/* One-liner in quote bubble */}
        {showLine && (
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.5,
              fontStyle: 'italic',
              margin: 0,
            }}>
              &ldquo;{line}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
