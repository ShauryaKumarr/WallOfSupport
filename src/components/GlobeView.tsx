'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { subscribeToMessages } from '@/lib/db';
import { COUNTRY_COORDS } from '@/lib/countryCoords';
import { countries } from '@/lib/countries';
import type { Message } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false }) as any;

interface CountryData {
  lat: number;
  lng: number;
  count: number;
  code: string;
  name: string;
  topMessages: Message[];
}

function heatColor(ratio: number): string {
  if (ratio > 0.75) return '#FF3D00';
  if (ratio > 0.50) return '#FF6D00';
  if (ratio > 0.25) return '#FF9100';
  return '#FFCA28';
}

function ringColor(ratio: number): string {
  if (ratio > 0.6) return 'rgba(255,61,0,0.7)';
  if (ratio > 0.3) return 'rgba(255,109,0,0.65)';
  return 'rgba(255,160,0,0.55)';
}

export default function GlobeView() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<CountryData | null>(null);
  const [hovered, setHovered] = useState<CountryData | null>(null);
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 520 });
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => subscribeToMessages(setMessages), []);

  useEffect(() => {
    function update() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const h = Math.min(600, Math.max(320, Math.round(w * 0.62)));
      setGlobeSize({ width: w, height: h });
    }
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handleGlobeReady = useCallback(() => {
    if (!globeRef.current) return;
    const ctrl = globeRef.current.controls();
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.55;
    ctrl.enableDamping = true;
    ctrl.dampingFactor = 0.08;
    ctrl.minDistance = 200;
    ctrl.maxDistance = 600;
    globeRef.current.pointOfView({ altitude: 2.2 }, 0);
    setGlobeReady(true);
  }, []);

  const countryData = useMemo<CountryData[]>(() => {
    const grouped: Record<string, Message[]> = {};
    for (const m of messages) {
      if (m.location && COUNTRY_COORDS[m.location]) {
        (grouped[m.location] ??= []).push(m);
      }
    }
    return Object.entries(grouped)
      .map(([code, msgs]) => {
        const [lat, lng] = COUNTRY_COORDS[code];
        const name = countries.find(c => c.code.toLowerCase() === code)?.name ?? code.toUpperCase();
        return {
          lat, lng, code, name,
          count: msgs.length,
          topMessages: [...msgs].sort((a, b) => b.likes - a.likes).slice(0, 5),
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [messages]);

  const maxCount = Math.max(1, ...countryData.map(d => d.count));
  const totalMapped = useMemo(
    () => messages.filter(m => m.location && COUNTRY_COORDS[m.location]).length,
    [messages]
  );

  // Arcs: connect the top countries to each other for a dramatic network effect
  const arcsData = useMemo(() => {
    const top = countryData.slice(0, Math.min(6, countryData.length));
    const arcs = [];
    for (let i = 0; i < top.length - 1; i++) {
      arcs.push({
        startLat: top[i].lat, startLng: top[i].lng,
        endLat: top[i + 1].lat, endLng: top[i + 1].lng,
        color: ['rgba(255,160,0,0.6)', 'rgba(255,100,0,0.4)'],
      });
    }
    return arcs;
  }, [countryData]);

  function handlePointClick(point: unknown) {
    const p = point as CountryData;
    setSelected(prev => prev?.code === p.code ? null : p);
  }

  function handlePointHover(point: unknown) {
    setHovered(point as CountryData | null);
  }

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      {/* ── Globe ───────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 45% 45%, #0d1b3e 0%, #040810 100%)',
            boxShadow: '0 0 80px rgba(217,119,6,0.18), inset 0 0 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,160,0,0.12)',
          }}
        >
          <Globe
            ref={globeRef}
            width={globeSize.width}
            height={globeSize.height}
            onGlobeReady={handleGlobeReady}

            // Background
            backgroundColor="rgba(0,0,0,0)"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

            // Earth surface — night-side texture shows city lights
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

            // Atmosphere — amber glow to match the site palette
            showAtmosphere
            atmosphereColor="#C2410C"
            atmosphereAltitude={0.18}

            // ── Glowing spike columns ──────────────────────────
            pointsData={countryData}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={(d: unknown) => {
              const c = d as CountryData;
              return Math.max(0.025, (c.count / maxCount) * 0.55);
            }}
            pointColor={(d: unknown) => heatColor((d as CountryData).count / maxCount)}
            pointRadius={(d: unknown) => {
              const c = d as CountryData;
              return 0.22 + (c.count / maxCount) * 0.9;
            }}
            pointResolution={16}
            pointsMerge={false}
            onPointClick={handlePointClick}
            onPointHover={handlePointHover}

            // ── Pulsing rings ──────────────────────────────────
            ringsData={countryData}
            ringLat="lat"
            ringLng="lng"
            ringColor={(d: unknown) => ringColor((d as CountryData).count / maxCount)}
            ringMaxRadius={(d: unknown) => 3.5 + ((d as CountryData).count / maxCount) * 5.5}
            ringPropagationSpeed={1.8}
            ringRepeatPeriod={(d: unknown) =>
              Math.max(600, 2000 - ((d as CountryData).count / maxCount) * 1400)
            }
            ringAltitude={0.001}

            // ── Animated arcs between top countries ───────────
            arcsData={arcsData}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcAltitude={0.3}
            arcStroke={0.4}
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={3000}

            // ── Floating label on hover ────────────────────────
            labelsData={hovered ? [hovered] : []}
            labelLat="lat"
            labelLng="lng"
            labelText={(d: unknown) => {
              const c = d as CountryData;
              return `${c.name}  ·  ${c.count} message${c.count !== 1 ? 's' : ''}`;
            }}
            labelSize={1.6}
            labelColor={() => '#FFF9C4'}
            labelResolution={3}
            labelAltitude={0.07}
            labelIncludeDot={false}
          />

          {/* ── Stats overlay ─────────────────────────────────── */}
          {globeReady && (
            <div className="absolute top-4 left-4 pointer-events-none select-none">
              <div
                className="rounded-xl px-4 py-3 space-y-0.5"
                style={{
                  background: 'rgba(4,8,16,0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,160,0,0.2)',
                }}
              >
                <p className="text-amber-300 font-bold text-sm tabular-nums">
                  {countryData.length} {countryData.length === 1 ? 'country' : 'countries'}
                </p>
                <p className="text-white/50 text-xs tabular-nums">
                  {totalMapped} of {messages.length} messages mapped
                </p>
              </div>
            </div>
          )}

          {/* ── Heat legend ───────────────────────────────────── */}
          {globeReady && countryData.length > 0 && (
            <div className="absolute bottom-4 left-4 pointer-events-none select-none">
              <div
                className="rounded-xl px-3 py-2"
                style={{
                  background: 'rgba(4,8,16,0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,160,0,0.15)',
                }}
              >
                <p className="text-white/40 text-xs mb-1.5">Message density</p>
                <div className="flex items-center gap-1">
                  {['#FFCA28', '#FF9100', '#FF6D00', '#FF3D00'].map((c) => (
                    <div key={c} className="w-5 h-2.5 rounded-sm" style={{ background: c }} />
                  ))}
                  <span className="text-white/35 text-xs ml-1.5">more →</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Interaction hint ──────────────────────────────── */}
          {globeReady && countryData.length > 0 && !selected && (
            <div className="absolute bottom-4 right-4 pointer-events-none select-none">
              <p className="text-white/25 text-xs">Drag to rotate  ·  Click a point to explore</p>
            </div>
          )}

          {/* ── Empty state ───────────────────────────────────── */}
          {globeReady && countryData.length === 0 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <p className="text-white/40 text-lg font-semibold">No location data yet</p>
              <p className="text-white/25 text-sm mt-1">
                Post a message and choose your country to appear on the globe!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Country detail panel ──────────────────────────────── */}
      {selected && (
        <div
          className="xl:w-72 rounded-2xl overflow-hidden shadow-xl flex-shrink-0"
          style={{ background: 'linear-gradient(150deg, #FFFDE7 0%, #FFF8E1 100%)' }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #D97706, #C2410C)' }}
          >
            <img
              src={`https://flagcdn.com/48x36/${selected.code}.png`}
              alt={selected.name}
              className="rounded shadow-md"
              width={48}
              height={36}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate text-base leading-tight">
                {selected.name}
              </h3>
              <p className="text-amber-200 text-xs mt-0.5">
                {selected.count} message{selected.count !== 1 ? 's' : ''} of support
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-amber-200 hover:bg-white/20 transition-colors text-xl leading-none flex-shrink-0"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '420px' }}>
            {selected.topMessages.length === 0 ? (
              <p className="text-amber-500 text-sm text-center py-6 italic">No messages yet.</p>
            ) : (
              selected.topMessages.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl p-3.5 shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(217,119,6,0.12)' }}
                >
                  <p className="text-amber-950 text-sm leading-relaxed">{m.message}</p>
                  <div className="flex items-center justify-between mt-2.5 gap-2">
                    <p className="text-amber-600 text-xs font-semibold truncate">— {m.username}</p>
                    {m.likes > 0 && (
                      <span className="text-red-400 text-xs flex-shrink-0 flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {m.likes}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {selected.count > 5 && (
            <p className="text-center text-amber-500 text-xs pb-4 opacity-70">
              Showing top {selected.topMessages.length} of {selected.count}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
