/**
 * CharacterView — Full-bleed character display
 * Shows character image with name, source, and one-liner.
 * Gracefully handles missing images with colorful gradient placeholders.
 */

import { useState } from 'react';
import type { Character } from '../data/types';
import { getPlaceholderGradient } from '../data/design-tokens';

const CDN_BASE = 'https://res.cloudinary.com/dgb5fdcmb/image/upload/w_512,q_auto,f_webp/weather-animal';

interface CharacterViewProps {
  character: Character;
  line: string;
  className?: string;
  /** Whether to show the one-liner text */
  showLine?: boolean;
  /** Custom height style */
  height?: string;
}

export function CharacterView({
  character,
  line,
  className = '',
  showLine = true,
  height = '55vh',
}: CharacterViewProps) {
  const [imgError, setImgError] = useState(false);
  const gradient = getPlaceholderGradient(character.id);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        background: character.colors.bg,
        borderRadius: '0 0 28px 28px',
      }}
    >
      {/* Background gradient layer */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: gradient }}
      />

      {/* Character image */}
      <div className="relative flex items-center justify-center h-full">
        {!imgError ? (
          <img
            src={`${CDN_BASE}/${character.id}`}
            alt={character.name}
            className="animate-scale-in"
            style={{
              maxHeight: '70%',
              maxWidth: '70%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="animate-scale-in flex items-center justify-center"
            style={{
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              background: gradient,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: '64px' }}>{character.animal.slice(0, 1)}</span>
          </div>
        )}
      </div>

      {/* Bottom overlay with name + source + line */}
      <div
        className="absolute bottom-0 left-0 right-0 animate-slide-up"
        style={{
          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
          padding: '48px 20px 20px',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '4px' }}>
          {character.source}
        </div>
        <div style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 700, marginBottom: showLine ? '8px' : '0' }}>
          {character.name}
        </div>
        {showLine && (
          <div
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: 1.4,
              fontStyle: 'italic',
            }}
          >
            &ldquo;{line}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
