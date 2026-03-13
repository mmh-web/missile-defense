// ============================================================
// LocationPopup — Pause & Explore popup card
// ============================================================
// 260px card with photo, summary, and 2 facts.
// Dark or light variant controlled by `variant` prop.

import { LOCATION_DATA } from '../config/locationData.js';

// Accent colors by category — dark variant
const ACCENT_DARK = {
  city:           { border: 'rgba(34,197,94,0.5)',  bg: 'rgba(34,197,94,0.55)', glow: 'rgba(34,197,94,0.2)', text: '#22c55e', hebrew: 'rgba(34,197,94,0.65)' },
  infrastructure: { border: 'rgba(251,146,60,0.5)', bg: 'rgba(251,146,60,0.55)', glow: 'rgba(251,146,60,0.2)', text: '#fb923c', hebrew: 'rgba(251,146,60,0.65)' },
  base:           { border: 'rgba(234,179,8,0.5)',  bg: 'rgba(234,179,8,0.55)', glow: 'rgba(234,179,8,0.2)', text: '#eab308', hebrew: 'rgba(234,179,8,0.65)' },
};

// Accent colors by category — light variant
const ACCENT_LIGHT = {
  city:           { border: 'rgba(34,197,94,0.25)', bg: '#16a34a', glow: 'rgba(22,163,74,0.4)', text: '#166534', hebrew: '#166534', bullet: '#16a34a' },
  infrastructure: { border: 'rgba(251,146,60,0.25)', bg: '#ea580c', glow: 'rgba(234,88,12,0.4)', text: '#9a3412', hebrew: '#9a3412', bullet: '#ea580c' },
  base:           { border: 'rgba(234,179,8,0.25)', bg: '#ca8a04', glow: 'rgba(202,138,4,0.4)', text: '#854d0e', hebrew: '#854d0e', bullet: '#ca8a04' },
};

// Card shell styles
const DARK_CARD = {
  background: 'linear-gradient(170deg, rgba(30,40,65,0.97) 0%, rgba(14,20,36,0.98) 45%, rgba(6,10,20,0.99) 100%)',
  backdropFilter: 'blur(12px)',
  nameColor: '#fff',
  summaryColor: '#c9cdd4',
  factColor: '#b0b8c4',
  badgeColor: '#fff',
  dividerBg: (accent) => `linear-gradient(to right, ${accent.border}, transparent)`,
  photoFallback: 'linear-gradient(135deg, #1a2332 0%, #0d1117 100%)',
  shadowFn: (accent) => `0 12px 48px rgba(0,0,0,0.7), 0 -2px 12px ${accent.glow}, 0 0 20px ${accent.glow}33, inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)`,
  vignette: 'inset 0 3px 12px rgba(0,0,0,0.35)',
};

const LIGHT_CARD = {
  background: 'linear-gradient(170deg, #b8bfc9 0%, #8b95a5 50%, #7a8494 100%)',
  backdropFilter: 'none',
  nameColor: '#0f172a',
  summaryColor: '#1e293b',
  factColor: '#1e293b',
  badgeColor: '#fff',
  dividerBg: () => 'linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0.03))',
  photoFallback: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
  shadowFn: () => '0 12px 48px rgba(0,0,0,0.6), 0 0 30px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
  vignette: 'inset 0 3px 12px rgba(0,0,0,0.2)',
};

function getCategoryLabel(city) {
  if (city.isInfra) return 'INFRASTRUCTURE';
  if (city.isBase) return 'MILITARY BASE';
  return 'CITY' + (city.population ? ` · ${city.population}` : '');
}

function getCategoryKey(city) {
  if (city.isInfra) return 'infrastructure';
  if (city.isBase) return 'base';
  return 'city';
}

export default function LocationPopup({ name, city, style, onMouseEnter, onMouseLeave, variant = 'dark' }) {
  const data = LOCATION_DATA[name];
  if (!data) return null;

  const catKey = getCategoryKey(city);
  const isLight = variant === 'light';
  const accent = isLight ? ACCENT_LIGHT[catKey] : ACCENT_DARK[catKey];
  const card = isLight ? LIGHT_CARD : DARK_CARD;
  const label = getCategoryLabel(city);
  const basePath = import.meta.env.BASE_URL || '/missile-defense/';

  return (
    <div
      className="location-popup-enter"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        width: 260,
        zIndex: 50,
        pointerEvents: 'auto',
        ...style,
      }}
    >
      <div style={{
        background: card.background,
        backdropFilter: card.backdropFilter,
        border: `1px solid ${accent.border}`,
        borderTop: isLight ? `3px solid ${accent.bg}` : `3px solid ${accent.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: card.shadowFn(accent),
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      }}>
        {/* Header */}
        <div style={{ padding: '11px 13px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: 16, fontWeight: 800, color: card.nameColor,
              ...(isLight ? { textShadow: '0 1px 0 rgba(255,255,255,0.35)' } : {}),
            }}>{name}</div>
            {city.he && (
              <div style={{
                fontSize: 17, fontWeight: 700, marginTop: 1,
                color: accent.hebrew || accent.text,
                opacity: isLight ? 1 : 0.65,
                ...(isLight ? { textShadow: '0 1px 0 rgba(255,255,255,0.2)' } : {}),
              }}>{city.he}</div>
            )}
          </div>
          <div style={{
            fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: card.badgeColor, background: accent.bg,
            padding: '3px 8px', borderRadius: 4, marginTop: 2,
            boxShadow: `0 1px 4px ${accent.glow}`,
          }}>{label}</div>
        </div>

        {/* Summary */}
        <div style={{
          padding: '6px 13px 8px', fontSize: 12, color: card.summaryColor, lineHeight: 1.45,
          ...(isLight ? { fontWeight: 500 } : {}),
        }}>
          {data.summary}
        </div>

        {/* Divider */}
        <div style={{
          margin: '0 13px', height: 1,
          background: card.dividerBg(accent),
          ...(isLight ? { boxShadow: '0 1px 0 rgba(255,255,255,0.12)' } : {}),
        }} />

        {/* Facts */}
        <div style={{ padding: '6px 13px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {data.facts.map((fact, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <div style={{
                width: isLight ? 5 : 4, height: isLight ? 5 : 4, minWidth: isLight ? 5 : 4, marginTop: 5,
                background: accent.bullet || accent.text, borderRadius: '50%',
                boxShadow: `0 0 ${isLight ? 5 : 6}px ${accent.glow}`,
              }} />
              <div style={{ fontSize: 11, lineHeight: 1.55, color: card.factColor }}>{fact}</div>
            </div>
          ))}
        </div>

        {/* Photo */}
        <div style={{
          width: '100%', height: 100, overflow: 'hidden',
          position: 'relative',
          background: card.photoFallback,
          ...(isLight ? { borderTop: '1px solid rgba(0,0,0,0.1)' } : {}),
        }}>
          <img
            src={`${basePath}images/locations/${data.photo}`}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            boxShadow: card.vignette,
            pointerEvents: 'none',
          }} />
        </div>
      </div>
    </div>
  );
}
