import React, { useState } from 'react';
import { Compass, Dices, Shield, X, MapPin, CheckCircle2, AlertTriangle, Swords } from 'lucide-react';
import {
  TRAVEL_MODES,
  TRAVEL_TERRAINS,
  TRAVEL_MAP_LANDMARKS,
  rollKemoTravelEvent,
} from '../data/travelEncounters';

// ============================================================================
// MODAL DE VIAJES: EL VIEJO MUNDO (Kemo & Heval)
// Se usa ANTES de llegar a cada misión desde la Gran Ciudad hasta la Mazmorra.
// ============================================================================
export default function TravelModal({
  isOpen,
  onClose,
  heroes = [],
  onApplyTravelOutcome,
  onArriveCity,
}) {
  const [modeId, setModeId] = useState('intemperie');
  const [terrainId, setTerrainId] = useState('camino');
  const [totalDistance, setTotalDistance] = useState(10);
  const [progress, setProgress] = useState(0);
  const [protectionsLeft, setProtectionsLeft] = useState(0);
  const [stepLog, setStepLog] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null); // { roll, event }
  const [selectedHeroId, setSelectedHeroId] = useState(heroes[0]?.id || 'ALL');
  const [resolvedMsg, setResolvedMsg] = useState('');

  if (!isOpen) return null;

  const mode = TRAVEL_MODES.find((m) => m.id === modeId) || TRAVEL_MODES[0];
  const terrain = TRAVEL_TERRAINS.find((t) => t.id === terrainId) || TRAVEL_TERRAINS[0];
  const arrived = progress >= totalDistance;

  const handleSelectMode = (m) => {
    setModeId(m.id);
    setProtectionsLeft(m.protections);
    setProgress(0);
    setStepLog([]);
    setActiveEvent(null);
    setResolvedMsg('');
  };

  const handleRollDisplacement = () => {
    if (arrived) return;
    const rawRoll = Math.floor(Math.random() * mode.dieSides) + 1;
    const effectiveMove = Math.max(1, rawRoll + terrain.mod);
    const nextProgress = Math.min(totalDistance, progress + effectiveMove);
    const triggeredEvent = rawRoll === mode.triggerRoll;

    setProgress(nextProgress);
    setResolvedMsg('');
    setStepLog((prev) => [
      {
        id: Date.now(),
        rawRoll,
        effectiveMove,
        terrain: terrain.label,
        triggeredEvent,
        pos: nextProgress,
      },
      ...prev.slice(0, 8),
    ]);

    if (triggeredEvent) {
      setActiveEvent(rollKemoTravelEvent());
    } else {
      setActiveEvent(null);
    }
  };

  const handleManualEventRoll = () => {
    setResolvedMsg('');
    setActiveEvent(rollKemoTravelEvent());
  };

  const handleUseProtection = () => {
    if (protectionsLeft <= 0 || !activeEvent) return;
    setProtectionsLeft((p) => p - 1);
    setResolvedMsg(
      `🛡️ ¡Usaste 1 Protección (${mode.name})! Eludiste el evento "${activeEvent.event.title}" sin consecuencias.`
    );
    setActiveEvent(null);
  };

  const handleApplyOutcome = (out) => {
    if (!activeEvent) return;
    const target = out.target === 'ALL' ? 'ALL' : selectedHeroId || heroes[0]?.id || 'ALL';
    onApplyTravelOutcome?.(
      {
        ...out,
        icon: activeEvent.event.icon,
        title: activeEvent.event.title,
        badge: `Viaje 1D100 = ${activeEvent.roll} · ${activeEvent.event.tag}`,
      },
      target
    );
    const who =
      target === 'ALL'
        ? 'Todo el grupo'
        : heroes.find((h) => h.id === target)?.name || 'Héroe seleccionado';
    setResolvedMsg(`✓ Aplicado y enviado al celular (${who}): ${out.text}`);
    setActiveEvent(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-4xl max-h-[93vh] overflow-y-auto grimoire-panel rounded-3xl p-5 sm:p-6 border-amber-500/60 space-y-5 shadow-2xl">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Viajes: El Viejo Mundo (Kemo & Heval)
            </div>
            <h2 className="font-display text-2xl font-black text-white mt-0.5">
              🗺️ Travesía hacia la Misión
            </h2>
            <p className="text-xs text-slate-400">
              Se juega antes de llegar a la mazmorra. Tira el dado de desplazamiento: si sacas el máximo (4/6/8), salta un Evento 1D100 (puedes evitarlo con Protecciones).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paso 1: Elegir Modo de Viaje (Intemperie / Caravana / Montura) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {TRAVEL_MODES.map((m) => {
            const active = m.id === modeId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMode(m)}
                className={`text-left p-3.5 rounded-2xl border transition cursor-pointer space-y-1 ${
                  active
                    ? 'bg-amber-500/20 border-amber-400 text-amber-50 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm">
                    {m.icon} {m.name}
                  </strong>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-black">
                    1D{m.dieSides} (ev: {m.triggerRoll})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 text-emerald-300">
                    {m.costPerHero === 0 ? 'Gratis' : `${m.costPerHero} MO c/u`}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 text-sky-300">
                    🛡️ {m.protections} Protecc.
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                    {m.capacity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug pt-0.5">{m.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Paso 2: Barra de Ruta + Terreno + Controles de Desplazamiento */}
        <div className="p-4 rounded-2xl bg-slate-950/85 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <strong className="text-amber-200">
                Progreso del Viaje: {progress} / {totalDistance} casillas
              </strong>
              <div className="flex items-center gap-1 ml-2">
                <span className="text-[10px] text-slate-400">Distancia:</span>
                {[6, 10, 14, 18].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setTotalDistance(d);
                      setProgress((p) => Math.min(p, d));
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      totalDistance === d ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-sky-950 border border-sky-600/60 text-sky-200 font-black">
                🛡️ Protecciones: {protectionsLeft}
              </span>
              <button
                type="button"
                onClick={() => {
                  setProgress(0);
                  setProtectionsLeft(mode.protections);
                  setStepLog([]);
                  setActiveEvent(null);
                  setResolvedMsg('');
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-[11px] font-bold cursor-pointer"
              >
                ↺ Reiniciar
              </button>
            </div>
          </div>

          {/* Barra visual */}
          <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                arrived ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((progress / totalDistance) * 100))}%` }}
            />
          </div>

          {/* Selector de Terreno + Botones de Tirada */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {TRAVEL_TERRAINS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTerrainId(t.id)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold cursor-pointer border ${
                    terrainId === t.id
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {t.label} {t.mod !== 0 ? `(${t.mod})` : ''}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={arrived || !!activeEvent}
                onClick={handleRollDisplacement}
                className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow ${
                  arrived || activeEvent
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                <Dices className="w-4 h-4" /> Avanzar (1D{mode.dieSides})
              </button>
              <button
                type="button"
                onClick={handleManualEventRoll}
                className="px-3.5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs cursor-pointer"
              >
                🎲 Tirar Evento 1D100
              </button>
            </div>
          </div>

          {stepLog.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
              {stepLog.map((s) => (
                <span
                  key={s.id}
                  className={`px-2 py-0.5 rounded-lg border font-bold ${
                    s.triggeredEvent
                      ? 'bg-rose-950/70 border-rose-500/60 text-rose-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  Dado {s.rawRoll} → +{s.effectiveMove} cas. {s.triggeredEvent ? '⚠️ EVENTO' : ''}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Resultado recién aplicado */}
        {resolvedMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/45 border border-emerald-500/60 text-xs text-emerald-100 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resolvedMsg}</span>
          </div>
        )}

        {/* EVENTO 1D100 ACTIVO (Con selector de héroe + Protección + botones Qué Da / Qué Quita) */}
        {activeEvent && (
          <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/60 to-slate-950 border-2 border-amber-400/80 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  🎲 Tabla de Eventos Viaje y Noche (1D100 = {activeEvent.roll}) · {activeEvent.event.tag}
                </div>
                <h3 className="font-display text-xl font-black text-white mt-0.5">
                  {activeEvent.event.icon} {activeEvent.event.title}
                </h3>
              </div>
              {protectionsLeft > 0 && (
                <button
                  type="button"
                  onClick={handleUseProtection}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Shield className="w-4 h-4" /> Usar Protección ({protectionsLeft}) — Evitar
                </button>
              )}
            </div>

            <p className="text-sm text-amber-50 leading-relaxed bg-black/35 p-3.5 rounded-xl border border-white/10">
              {activeEvent.event.text}
            </p>

            {/* Selector de Héroe objetivo si el evento afecta a un héroe específico */}
            {heroes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-300">🎯 Héroe afectado (si aplica a 1 héroe):</span>
                <select
                  value={selectedHeroId}
                  onChange={(e) => setSelectedHeroId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-100 font-bold"
                >
                  {heroes.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.className})
                    </option>
                  ))}
                  <option value="ALL">Todo el Grupo</option>
                </select>
              </div>
            )}

            {/* Botones de Resolución (Aplican y mandan al celular con narrativa) */}
            <div className="flex flex-wrap gap-2">
              {activeEvent.event.outcomes.map((out, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyOutcome(out)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow"
                >
                  {out.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Elementos del Mapa Hexagonal (Referencia Rápida Kemo & Heval) */}
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            📍 Elementos del Mapa de Viajes (Si cruzan alguno durante la ruta):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {TRAVEL_MAP_LANDMARKS.map((lm) => (
              <div key={lm.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                <strong className="text-amber-200">
                  {lm.icon} {lm.name}
                </strong>
                <p className="text-[11px] text-slate-300 leading-snug">{lm.rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pie: Llegar a la Misión o Ir a la Ciudad */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Swords className="w-4 h-4" /> {arrived ? '¡Llegaron! Entrar a la Mazmorra' : 'Cerrar y Volver al Tablero'}
          </button>
          {onArriveCity && (
            <button
              type="button"
              onClick={onArriveCity}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-200 font-bold text-xs cursor-pointer"
            >
              🏛️ Entrar a La Ciudad (Abrir a Celulares)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
