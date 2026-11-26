import React, { useState, useEffect } from 'react';
import { Zap, Dices, X, Shield, Skull, Heart } from 'lucide-react';
import { MONSTERS, scaleMonster } from '../data/bestiary';
import { PROCEDURAL_BIOMES } from '../data/proceduralEngine';

const HQ_FACES = ['skull', 'skull', 'skull', 'white', 'white', 'black'];
const rollHQ = (n) => Array.from({ length: n }, () => HQ_FACES[Math.floor(Math.random() * 6)]);

export default function ActionResolverBanner({
  partyLevel = 1,
  partySize = 4,
  heroes = [],
  onApplySupport,
  activeMissionContext = null,
}) {
  const [actions, setActions] = useState([]);
  const [targetMonsterId, setTargetMonsterId] = useState('orco');
  const [supportHeroId, setSupportHeroId] = useState('');
  const [manualSkulls, setManualSkulls] = useState('');
  const [resolution, setResolution] = useState(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await fetch('/api/actions', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setActions(data.actions || []);
      } catch {
        // ignore
      }
    };
    fetchActions();
    const timer = setInterval(fetchActions, 2000);
    return () => clearInterval(timer);
  }, []);

  const dismissAction = async (id) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
    setResolution(null);
    setManualSkulls('');
    try {
      await fetch('/api/actions/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch {
      // ignore
    }
  };

  if (actions.length === 0) return null;
  const active = actions[0];

  const resolveDefense = (useAutoAttack) => {
    const rawMon = MONSTERS.find((m) => m.id === targetMonsterId) || MONSTERS[0];
    const mon = scaleMonster(rawMon, partyLevel, partySize, false, false);

    // 1. Ataque del Héroe (automático o calaveras físicas ingresadas)
    let hits = 0;
    let attackRollSummary = '';
    const isEthereal = mon.id === 'espectro' || mon.id === 'espectro_terror';

    if (useAutoAttack || manualSkulls === '') {
      const atkFaces = rollHQ(active.attackDice || 2);
      if (isEthereal && !active.isMagic) {
        hits = atkFaces.filter((f) => f === 'black').length;
        attackRollSummary = `${atkFaces.length} DC (vs Etéreo sin magia → solo 🖤 Escudos Negros hieren): ${hits} impacto(s)`;
      } else {
        hits = atkFaces.filter((f) => f === 'skull').length;
        attackRollSummary = `${atkFaces.length} DC lanzados → 💀 ${hits} Calavera(s)`;
      }
    } else {
      hits = Math.max(0, Number(manualSkulls) || 0);
      attackRollSummary = `Tirada física en mesa: 💀 ${hits} Calavera(s)`;
    }

    // 2. Defensa Automática del Monstruo (aplicando reglas especiales según arma/tipo)
    const defFaces = rollHQ(mon.scaledDef);
    const skeletonVsBow = mon.id === 'esqueleto' && active.isRanged;
    const blocks = skeletonVsBow
      ? defFaces.filter((f) => f === 'white').length
      : defFaces.filter((f) => f === 'black').length;

    let netDamage = Math.max(0, hits - blocks);
    const notes = [];

    if (isEthereal && !active.isMagic) {
      notes.push('👻 Etéreo: Las armas físicas normales solo hieren sacando Escudos Negros.');
    }
    if (skeletonVsBow) {
      notes.push('💀 Esqueleto vs Proyectil: Defendió con Escudos Blancos en lugar de Negros.');
    }
    if (mon.id === 'gargola' && !active.isMagic && netDamage > 0) {
      netDamage = Math.max(0, netDamage - 1);
      notes.push('🪨 Piel de Piedra (Gárgola): Redujo 1 punto de daño físico no mágico.');
    }
    if ((mon.id === 'momia' || mon.id === 'troll') && active.isFire && netDamage > 0) {
      netDamage += 1;
      notes.push('🔥 Vulnerable al Fuego: +1 daño adicional y bloquea regeneración este turno.');
    }
    // Reglas dinámicas del Bioma de la misión activa
    if (activeMissionContext?.biomeId === 'cavernas_hielo' && active.isFire && netDamage > 0) {
      netDamage += 1;
      notes.push('❄️ Bioma (Cavernas de Hielo): El daño de Fuego causa +1 daño extra en este bioma.');
    }
    if (activeMissionContext?.biomeId === 'laboratorio_alquimico' && active.isFire) {
      notes.push('⚗️ Bioma (Laboratorio Volátil): Si están junto a un Banco de Alquimista, provoca chispa extra (+1 DC en 2×2).');
    }
    if (activeMissionContext?.biomeId === 'catacumbas' && ['esqueleto', 'zombi', 'momia', 'espectro'].includes(mon.id) && !active.isFire && !active.isMagic) {
      notes.push('⚰️ Bioma (Catacumbas): Recuerda que los No Muertos junto a Tumbas ganan +1 DC de Defensa.');
    }

    setResolution({
      monsterName: mon.name,
      monsterMaxPC: mon.scaledPC,
      defDiceCount: mon.scaledDef,
      blocks,
      skeletonVsBow,
      attackRollSummary,
      netDamage,
      notes,
    });
  };

  return (
    <div className="no-print max-w-7xl w-full mx-auto px-4 pt-4">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-red-950/80 to-stone-950 border-2 border-amber-500 shadow-2xl space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300 flex flex-wrap items-center gap-2">
                <span>⚡ Acción Activada desde Celular ({actions.length} pendiente{actions.length > 1 ? 's' : ''})</span>
                {activeMissionContext?.biomeId && (() => {
                  const bm = PROCEDURAL_BIOMES.find((b) => b.id === activeMissionContext.biomeId);
                  return bm ? (
                    <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-amber-500/40 text-[10px] text-amber-200 normal-case">
                      {bm.icon} {activeMissionContext.title}
                    </span>
                  ) : null;
                })()}
              </div>
              <h4 className="font-display text-lg font-black text-white">
                {active.heroName} ({active.heroClass}) → {active.abilityName}
              </h4>
              <p className="text-xs text-amber-100/90">
                <strong>{active.attackDice} DC · {active.damageType}</strong> — {active.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => dismissAction(active.id)}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Resuelto / Cerrar
          </button>
        </div>

        {/* Si es una acción de Curación / Apoyo hacia un Aliado (ej: Manos Sanadoras, Imposición de Manos) */}
        {active.supportEffect ? (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-800/50 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1">
              <Heart className="w-4 h-4" /> Aplicar apoyo al Héroe:
            </span>
            {heroes.length > 0 ? (
              <>
                <select
                  value={supportHeroId || active.supportEffect.targetHeroId || heroes[0]?.id || ''}
                  onChange={(e) => setSupportHeroId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-stone-950 border border-emerald-700/70 text-stone-100 font-semibold"
                >
                  {heroes.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.currentPC ?? h.maxPC}/{h.maxPC} PC · {h.currentPM ?? h.maxPM}/{h.maxPM} PM)
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const targetId = supportHeroId || active.supportEffect.targetHeroId || heroes[0]?.id;
                    if (onApplySupport && targetId) {
                      onApplySupport(targetId, {
                        healPC: active.supportEffect.healPC || 0,
                        healPM: active.supportEffect.healPM || 0,
                      });
                    }
                    setSupportHeroId('');
                    dismissAction(active.id);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-1 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  Aplicar{' '}
                  {[
                    active.supportEffect.healPC ? `+${active.supportEffect.healPC} PC` : '',
                    active.supportEffect.healPM ? `+${active.supportEffect.healPM} PM` : '',
                  ]
                    .filter(Boolean)
                    .join(' y ')}
                </button>
              </>
            ) : (
              <span className="text-stone-400">Sin héroes en la mesa.</span>
            )}
          </div>
        ) : active.attackDice > 0 ? (
          /* Selector de Monstruo Atacado + Resolución Automática */
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-800/40 text-xs">
            <span className="font-bold text-amber-300">Monstruo atacado:</span>
            <select
              value={targetMonsterId}
              onChange={(e) => {
                setTargetMonsterId(e.target.value);
                setResolution(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-stone-950 border border-amber-700/60 text-stone-100 font-semibold"
            >
              {MONSTERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.tier})
                </option>
              ))}
            </select>

            <input
              type="number"
              min={0}
              max={10}
              placeholder="Calaveras físicas (opcional)"
              value={manualSkulls}
              onChange={(e) => setManualSkulls(e.target.value)}
              className="w-44 px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100"
            />

            <button
              onClick={() => resolveDefense(false)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" /> Tirar Defensa del Monstruo
            </button>

            <button
              onClick={() => resolveDefense(true)}
              className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" /> Tirar Ataque + Defensa Auto
            </button>
          </div>
        ) : null}

        {resolution && (
          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/60 text-xs space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-stone-200">
                <span className="text-amber-300 font-bold">{resolution.attackRollSummary}</span>
                {' · '}
                <span>
                  Defensa de <strong>{resolution.monsterName}</strong> ({resolution.defDiceCount} DC):{' '}
                  <strong>
                    {resolution.skeletonVsBow ? '🛡️' : '🖤'} {resolution.blocks} bloqueo(s)
                  </strong>
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-lg font-display font-black text-sm flex items-center gap-1 ${
                  resolution.netDamage > 0
                    ? 'bg-red-700 text-white'
                    : 'bg-stone-800 text-stone-300'
                }`}
              >
                <Skull className="w-4 h-4" />
                {resolution.netDamage > 0
                  ? `¡${resolution.netDamage} PC DE DAÑO!`
                  : 'BLOQUEADO (0 daño)'}
              </span>
            </div>
            {resolution.notes.map((n, i) => (
              <div key={i} className="text-amber-300 font-semibold">
                {n}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
