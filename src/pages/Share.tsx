/**
 * Share Page — Generate and share a weather card
 *
 * Receives character + weather data via route state
 * Renders ShareCard preview and share button
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { ShareCard } from '../components/ShareCard';
import { Button } from '../components/ui';
import { getCharacterById } from '../lib/matching';
import { generateShareUrl } from '../lib/share';
import type { WeatherTag } from '../data/types';

interface ShareState {
  characterId: string;
  line: string;
  weatherTag: WeatherTag;
  temperature: number;
  locationName: string;
}

export default function Share() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const state = location.state as ShareState | null;

  if (!state) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          공유할 캐릭터 정보가 없어요
        </p>
        <Button variant="ghost" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  const character = getCharacterById(state.characterId);
  if (!character) {
    navigate('/');
    return null;
  }

  const shareUrl = generateShareUrl(character.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `날씨 동물 — ${character.name}`,
          text: `"${state.line}" — ${character.name}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="container-app" style={{ paddingTop: '16px', paddingBottom: '8px' }}>
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
      </div>

      {/* Share card preview */}
      <div className="container-app flex-1 flex flex-col items-center" style={{ paddingTop: '8px' }}>
        <div style={{
          width: '100%',
          maxWidth: '320px',
          aspectRatio: '1',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          <ShareCard
            character={character}
            line={state.line}
            weatherTag={state.weatherTag}
            temperature={state.temperature}
            locationName={state.locationName}
          />
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3" style={{ marginTop: '24px', maxWidth: '320px' }}>
          <Button
            variant="primary"
            color={character.colors.primary}
            onClick={handleShare}
          >
            <Share2 size={18} style={{ marginRight: '8px' }} />
            공유하기
          </Button>

          <Button
            variant="secondary"
            onClick={handleCopy}
          >
            {copied
              ? <><Check size={18} style={{ marginRight: '8px' }} /> 복사됨!</>
              : <><Copy size={18} style={{ marginRight: '8px' }} /> 링크 복사</>
            }
          </Button>

          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              fontSize: '14px',
              padding: '12px',
              textAlign: 'center',
            }}
          >
            다시 보기 &rarr;
          </button>
        </div>
      </div>

      <div className="safe-bottom" />
    </div>
  );
}
