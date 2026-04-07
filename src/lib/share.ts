/**
 * Share Utilities
 *
 * - Generate share URL
 * - Web Share API with clipboard fallback
 * - html2canvas card capture
 */

/**
 * Generate a share URL for a character on a specific date
 */
export function generateShareUrl(characterId: string, date?: string): string {
  const baseUrl = window.location.origin;
  const dateParam = date ?? formatDateParam(new Date());
  return `${baseUrl}/${encodeURIComponent(characterId)}?date=${dateParam}`;
}

function formatDateParam(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/**
 * Share a card image via Web Share API
 * Falls back to clipboard copy of URL if Web Share is not available
 */
export async function shareCard(blob: Blob, text: string, url: string): Promise<boolean> {
  // Try Web Share API first
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'weather-animal.png', { type: 'image/png' });
    const shareData = { text, url, files: [file] };

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (err) {
        // User cancelled or share failed
        if (err instanceof Error && err.name === 'AbortError') {
          return false;
        }
      }
    }

    // Try without file
    try {
      await navigator.share({ text, url });
      return true;
    } catch {
      // Fall through to clipboard
    }
  }

  // Fallback: copy URL to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Capture a DOM element as a PNG blob using html2canvas
 */
export async function captureElement(element: HTMLElement): Promise<Blob | null> {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      width: 1080,
      height: 1080,
      scale: 1,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#FFFFFF',
    });

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        'image/png',
        1.0
      );
    });
  } catch {
    return null;
  }
}
