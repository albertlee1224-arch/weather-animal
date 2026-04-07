/**
 * Pokedex Page — Character collection grid
 *
 * - 3-column grid of all 30 characters (smaller screen friendly)
 * - Discovered: show image + name
 * - Undiscovered: silhouette + hint
 * - Tap to expand details
 * - Hidden characters section at bottom
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { Button } from '../components/ui';
import { characters, standardCharacters, hiddenCharacters } from '../data/characters';
import { HIDDEN_HINTS } from '../data/types';
import { getDiscoveredIds, getDiscoveredEntry, getDiscoveredCount } from '../lib/storage';
import { getPlaceholderGradient, WEATHER_TAG_INFO } from '../data/design-tokens';
import type { Character } from '../data/types';

const CDN_BASE = 'https://res.cloudinary.com/dgb5fdcmb/image/upload/w_256,q_auto,f_webp/weather-animal';
const TOTAL_CHARACTERS = Object.keys(characters).length;

export default function Pokedex() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const discovered = new Set(getDiscoveredIds());
  const discoveredCount = getDiscoveredCount();

  const handleImgError = (id: string) => {
    setImgErrors(prev => new Set(prev).add(id));
  };

  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="container-app" style={{ paddingTop: '16px', paddingBottom: '8px' }}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowLeft size={20} />
            <span className="text-body" style={{ fontWeight: 500 }}>홈</span>
          </button>
          <div
            className="badge"
            style={{
              background: 'var(--main-accent-dim)',
              color: 'var(--main-accent)',
              fontSize: '14px',
              padding: '6px 12px',
            }}
          >
            {discoveredCount}/{TOTAL_CHARACTERS} 발견
          </div>
        </div>

        <h1 className="text-heading" style={{ marginTop: '12px' }}>
          {'\uD83D\uDCD6'} 날씨 동물 도감
        </h1>
        <p className="text-caption" style={{ color: 'var(--text-dim)', marginTop: '4px' }}>
          다양한 날씨에 나타나는 캐릭터를 수집해보세요
        </p>

        {/* Progress bar */}
        <div style={{ marginTop: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'var(--border-light)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(discoveredCount / TOTAL_CHARACTERS) * 100}%`,
              height: '100%',
              background: 'var(--main-accent)',
              borderRadius: '4px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Standard Characters Grid */}
      <div className="container-app" style={{ paddingTop: '8px' }}>
        <p className="text-overline" style={{ color: 'var(--text-dim)', marginBottom: '12px' }}>
          표준 캐릭터 ({standardCharacters.length})
        </p>
        <div className="pokedex-grid">
          {standardCharacters.map((ch) => (
            <PokedexCell
              key={ch.id}
              character={ch}
              isDiscovered={discovered.has(ch.id)}
              isExpanded={expandedId === ch.id}
              imgError={imgErrors.has(ch.id)}
              onImgError={() => handleImgError(ch.id)}
              onClick={() => setExpandedId(expandedId === ch.id ? null : ch.id)}
            />
          ))}
        </div>
      </div>

      {/* Hidden Characters Section */}
      <div className="container-app" style={{ paddingTop: '24px', paddingBottom: '32px' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
          <Sparkles size={16} color="var(--rarity-hidden)" />
          <p className="text-overline" style={{ color: 'var(--rarity-hidden)' }}>
            히든 캐릭터 ({hiddenCharacters.length})
          </p>
        </div>
        <div className="pokedex-grid">
          {hiddenCharacters.map((ch) => (
            <PokedexCell
              key={ch.id}
              character={ch}
              isDiscovered={discovered.has(ch.id)}
              isExpanded={expandedId === ch.id}
              imgError={imgErrors.has(ch.id)}
              onImgError={() => handleImgError(ch.id)}
              onClick={() => setExpandedId(expandedId === ch.id ? null : ch.id)}
              isHidden
            />
          ))}
        </div>
      </div>

      {/* Expanded detail overlay */}
      {expandedId && (
        <CharacterDetail
          character={characters[expandedId]}
          isDiscovered={discovered.has(expandedId)}
          onClose={() => setExpandedId(null)}
        />
      )}

      {/* Bottom safe area */}
      <div className="safe-bottom" />
    </div>
  );
}


// ── Pokedex Cell ──

interface PokedexCellProps {
  character: Character;
  isDiscovered: boolean;
  isExpanded: boolean;
  imgError: boolean;
  onImgError: () => void;
  onClick: () => void;
  isHidden?: boolean;
}

function PokedexCell({
  character,
  isDiscovered,
  isExpanded: _isExpanded,
  imgError,
  onImgError,
  onClick,
  isHidden = false,
}: PokedexCellProps) {
  const gradient = getPlaceholderGradient(character.id);

  if (!isDiscovered) {
    return (
      <div
        className="pokedex-cell pokedex-cell-undiscovered"
        onClick={onClick}
        style={{
          border: isHidden ? '1.5px dashed var(--rarity-hidden)' : '1.5px solid var(--border-light)',
        }}
      >
        <div className="flex flex-col items-center gap-1" style={{ padding: '8px' }}>
          <Lock size={20} color={isHidden ? 'var(--rarity-hidden)' : 'var(--text-dim)'} />
          <span
            className="text-caption"
            style={{
              color: 'var(--text-dim)',
              textAlign: 'center',
              fontSize: '10px',
              lineHeight: 1.3,
            }}
          >
            {isHidden && character.id in HIDDEN_HINTS
              ? HIDDEN_HINTS[character.id]
              : `${character.weatherTags.map(t => WEATHER_TAG_INFO[t].emoji).join('')}`
            }
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pokedex-cell"
      onClick={onClick}
      style={{
        background: character.colors.bg,
        border: isHidden
          ? '2px solid var(--rarity-hidden)'
          : '1.5px solid var(--border-light)',
      }}
    >
      {!imgError ? (
        <img
          src={`${CDN_BASE}/${character.id}`}
          alt={character.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            padding: '8px',
          }}
          onError={onImgError}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
          }}
        >
          <span style={{ fontSize: '28px' }}>{character.animal.slice(0, 1)}</span>
        </div>
      )}

      {/* Name overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
          padding: '16px 6px 6px',
          borderRadius: '0 0 14px 14px',
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            display: 'block',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {character.name}
        </span>
      </div>

      {/* Hidden badge */}
      {isHidden && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'var(--rarity-hidden)',
            color: '#FFFFFF',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '6px',
            fontWeight: 600,
          }}
        >
          H
        </div>
      )}
    </div>
  );
}


// ── Character Detail Modal ──

interface CharacterDetailProps {
  character: Character;
  isDiscovered: boolean;
  onClose: () => void;
}

function CharacterDetail({ character, isDiscovered, onClose }: CharacterDetailProps) {
  const [imgError, setImgError] = useState(false);
  const entry = isDiscovered ? getDiscoveredEntry(character.id) : null;
  const gradient = getPlaceholderGradient(character.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up w-full"
        style={{
          maxWidth: '420px',
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
        </div>

        <div style={{ padding: '0 24px 32px' }}>
          {/* Character image */}
          <div
            className="flex justify-center"
            style={{
              height: '200px',
              margin: '0 -24px',
              background: character.colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDiscovered ? (
              !imgError ? (
                <img
                  src={`${CDN_BASE}/${character.id}`}
                  alt={character.name}
                  style={{
                    maxHeight: '160px',
                    maxWidth: '160px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                  }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '48px' }}>{character.animal.slice(0, 1)}</span>
                </div>
              )
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lock size={40} color="var(--text-dim)" />
                <span className="text-caption" style={{ color: 'var(--text-dim)' }}>아직 발견하지 못했어요</span>
              </div>
            )}
          </div>

          {/* Name & source */}
          <div style={{ marginTop: '16px' }}>
            <div className="flex items-center gap-2">
              <h2 className="text-heading">{character.name}</h2>
              {character.rarity === 'hidden' && (
                <span
                  className="badge"
                  style={{
                    background: 'var(--rarity-hidden-dim)',
                    color: 'var(--rarity-hidden)',
                    fontSize: '11px',
                  }}
                >
                  히든
                </span>
              )}
            </div>
            <p className="text-caption" style={{ color: 'var(--text-dim)', marginTop: '2px' }}>
              {character.source}
            </p>
          </div>

          {/* Personality */}
          <div style={{ marginTop: '12px' }}>
            <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
              {character.personality}
            </p>
          </div>

          {/* Weather tags */}
          <div className="flex flex-wrap gap-2" style={{ marginTop: '12px' }}>
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

          {/* Lines (only if discovered) */}
          {isDiscovered && (
            <div style={{ marginTop: '16px' }}>
              <p className="text-overline" style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>
                한마디 모음
              </p>
              <div className="flex flex-col gap-2">
                {character.lines.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      background: character.colors.bg,
                      borderRadius: '12px',
                      fontSize: '14px',
                      color: 'var(--text)',
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{l}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discovery info */}
          {entry && (
            <div
              className="text-caption"
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                background: 'var(--success-dim)',
                borderRadius: '10px',
                color: 'var(--text-secondary)',
              }}
            >
              {'\u2705'} 첫 발견: {new Date(entry.firstSeen).toLocaleDateString('ko-KR')} ·
              {' '}만남 횟수: {entry.seenCount}회
            </div>
          )}

          {/* Hidden trigger hint */}
          {character.rarity === 'hidden' && character.hiddenTrigger && (
            <div
              className="text-caption"
              style={{
                marginTop: '8px',
                padding: '10px 14px',
                background: 'var(--rarity-hidden-dim)',
                borderRadius: '10px',
                color: 'var(--rarity-hidden)',
              }}
            >
              {'\u2728'} 등장 조건: {character.hiddenTrigger.description}
            </div>
          )}

          {/* Close button */}
          <Button
            variant="ghost"
            onClick={onClose}
            style={{ marginTop: '16px' }}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
