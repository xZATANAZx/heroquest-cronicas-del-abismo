import React, { useState } from 'react';
import { Compass, Shuffle, X, Building2, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { pickRandomTravelEncounter } from '../data/travelEncounters';
import { getMaterialById } from '../data/craftingSystem';

export default function TravelModal({
  isOpen,
  onClose,
  heroes = [],
  onApplyTravelOutcome,
  onArriveCity,
}) {
  const [encounter, setEncounter] = useState(() => pickRandomTravelEncounter());
  const [resolved, setResolved] = useState(null);

  if (!isOpen || !encounter) return null;

  const rerollEncounter = () => {
    setEncounter(pickRandomTravelEncounter(encounter.id));
    setResolved(null);
  };

  const applyOutcome = (choiceLabel, outcome, isSuccess) => {
    setResolved({ choiceLabel, outcome, isSuccess });
    if (onApplyTravelOutcome) {
      onApplyTravelOutcome(outcome);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto grimoire-panel rounded-3xl p-6 border-amber-500/60 space-y-5 shadow-2xl">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
              <span className="text-amber-400 flex items-center gap-1">
                <Compass className="w-4 h-4" /> Viaje hacia la Ciudad
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-200">
                {encounter.tag}
              </span>
              <span className="text-slate-400">{encounter.biome}</span>
            </div>
            <h2 className="font-display text-2xl font-black text-white mt-1">
              {encounter.icon} {encounter.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={rerollEncounter}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1 cursor-pointer"
              title="Sacar otro encuentro de viaje"
            >
              <Shuffle className="w-3.5 h-3.5" /> Otro
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Texto de Rol para Leer en Voz Alta (Sin Spoilers) */}
        <div className="p-5 rounded-2xl bg-amber-950/25 border-l-4 border-amber-400 space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Leer en Voz Alta a los Aventureros (Solo Rol — Sin tablero)
          </div>
          <p className="font-lore text-base italic text-amber-100 leading-relaxed">
            “{encounter.readAloud}”
          </p>
        </div>

        {/* Decisiones del Grupo */}
        {!resolved ? (
          <div className="space-y-2.5">
            <div className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
              🧭 ¿Qué deciden hacer los aventureros? (Tiran su d20 físico en mesa)
            </div>
            {encounter.choices.map((ch) => (
              <div
                key={ch.id}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="space-y-0.5 flex-1 min-w-[200px]">
                  <div className="font-bold text-sm text-slate-100">{ch.label}</div>
                  <div className="text-[11px] text-slate-400">
                    {ch.skillCheck ? `Tirada física requerida: ${ch.skillCheck}` : 'Decisión directa (sin tirada de dado)'}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {ch.skillCheck ? (
                    <>
                      <button
                        onClick={() => applyOutcome(ch.label, ch.success, true)}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Superaron
                      </button>
                      <button
                        onClick={() => applyOutcome(ch.label, ch.fail, false)}
                        className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" /> Fallaron
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => applyOutcome(ch.label, ch.success, true)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                    >
                      Elegir →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Resultado Aplicado Automáticamente a los Héroes */
          <div
            className={`p-5 rounded-2xl border-2 space-y-3 ${
              resolved.isSuccess
                ? 'bg-emerald-950/35 border-emerald-500/70'
                : 'bg-rose-950/35 border-rose-500/70'
            }`}
          >
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
              {resolved.isSuccess ? '✨ Resultado del Viaje (Aplicado al Grupo)' : '⚠️ Complicación en el Camino (Aplicado al Grupo)'}
            </div>
            <p className="text-sm text-slate-100 leading-relaxed">{resolved.outcome.text}</p>

            {/* Resumen de efectos aplicados */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {resolved.outcome.goldPerHero ? (
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-500/40 text-amber-300 font-bold">
                  {resolved.outcome.goldPerHero > 0 ? `+${resolved.outcome.goldPerHero}` : resolved.outcome.goldPerHero} MO/héroe
                </span>
              ) : null}
              {resolved.outcome.pcDelta ? (
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-rose-500/40 text-rose-200 font-bold">
                  {resolved.outcome.pcDelta > 0 ? `+${resolved.outcome.pcDelta}` : resolved.outcome.pcDelta} PC
                </span>
              ) : null}
              {resolved.outcome.pmDelta ? (
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-500/40 text-cyan-200 font-bold">
                  {resolved.outcome.pmDelta > 0 ? `+${resolved.outcome.pmDelta}` : resolved.outcome.pmDelta} PM
                </span>
              ) : null}
              {resolved.outcome.fameDelta ? (
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-sky-500/40 text-sky-200 font-bold">
                  +{resolved.outcome.fameDelta} ⭐ Fama
                </span>
              ) : null}
              {resolved.outcome.repDelta ? (
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-200 font-bold">
                  +{resolved.outcome.repDelta} 🏅 Reputación
                </span>
              ) : null}
              {resolved.outcome.materialId ? (() => {
                const m = getMaterialById(resolved.outcome.materialId);
                return (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-purple-500/40 text-purple-200 font-bold">
                    +1 {m.icon} {m.name} a cada héroe
                  </span>
                );
              })() : null}
            </div>

            <div className="pt-2 flex flex-wrap justify-end gap-2">
              <button
                onClick={rerollEncounter}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
              >
                🎲 Otro Evento en el Camino
              </button>
              <button
                onClick={() => {
                  setResolved(null);
                  onArriveCity?.();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Building2 className="w-4 h-4" /> Llegar a la Ciudad (Abrir a Celulares)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
