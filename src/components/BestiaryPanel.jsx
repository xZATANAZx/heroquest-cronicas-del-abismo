import React, { useState } from 'react';
import { Skull, Shield, Zap, Search, Ghost, Crown, Sparkles, Plus, Trash2, MessageSquare } from 'lucide-react';
import {
  EXPANSIONS,
  MONSTERS,
  MONSTER_TEMPLATES,
  MONSTER_ALERTNESS,
  MONSTER_NEGOTIATION_GUIDE,
  scaleMonster,
  applyMonsterTemplate,
  calculateEncounterThreat,
} from '../data/bestiary';

export default function BestiaryPanel({
  partyLevel,
  setPartyLevel,
  partySize,
  setPartySize,
}) {
  const [expansionFilter, setExpansionFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [eliteMode, setEliteMode] = useState(false);
  const [spiritMode, setSpiritMode] = useState(false);
  const [templateId, setTemplateId] = useState('normal');
  const [encounterList, setEncounterList] = useState([]);
  const [showTactics, setShowTactics] = useState(false);

  const filtered = MONSTERS.filter((m) => {
    const matchExp = expansionFilter === 'all' || m.expansion === expansionFilter;
    const matchText =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.family.toLowerCase().includes(search.toLowerCase());
    return matchExp && matchText;
  });

  const threat = calculateEncounterThreat(encounterList, partyLevel, partySize);

  return (
    <div className="space-y-6">
      {/* Barra de Auto-Escalado Inteligente */}
      <div className="grimoire-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-amber-300">Bestiario Dinámico Escalable</h3>
            <p className="text-sm text-stone-400">
              Ajusta el Nivel del Grupo para recalcular automáticamente PC, Ataque, Defensa, CD y XP balanceados para HQ-D20 v2.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 bg-stone-900 border border-amber-700/50 rounded-xl px-3 py-2 text-sm">
              <span className="text-stone-400">Nivel Grupo:</span>
              <select
                value={partyLevel}
                onChange={(e) => setPartyLevel(Number(e.target.value))}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => (
                  <option key={l} value={l} className="bg-stone-900 text-amber-200">
                    Nivel {l}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={() => setEliteMode(!eliteMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition ${
                eliteMode
                  ? 'bg-amber-600 text-black border-amber-400'
                  : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500/60'
              }`}
            >
              <Crown className="w-3.5 h-3.5" /> Forzar Élite
            </button>

            <button
              onClick={() => setSpiritMode(!spiritMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition ${
                spiritMode
                  ? 'bg-cyan-600 text-black border-cyan-300'
                  : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-cyan-500/60'
              }`}
              title="Regla de El Tormento de la Reina de los Espíritus: los ataques dañan PM"
            >
              <Ghost className="w-3.5 h-3.5" /> Modo Espíritu (PM)
            </button>
          </div>
        </div>

        {/* Plantillas de Monstruos en 1 Clic + Tácticas de Alerta/Negociación */}
        <div className="space-y-2.5 pt-3 border-t border-stone-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Plantilla de Monstruo (1 Clic — Multiplica tus Miniaturas):
            </span>
            <button
              onClick={() => setShowTactics((s) => !s)}
              className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-700 hover:border-amber-500 text-[11px] font-bold text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> {showTactics ? 'Ocultar' : 'Ver'} Estados de Alerta y Negociación
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MONSTER_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setTemplateId(tpl.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition ${
                  templateId === tpl.id
                    ? 'bg-purple-700 text-white border-purple-400'
                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-purple-500/60'
                }`}
              >
                {tpl.icon} {tpl.name}
              </button>
            ))}
          </div>

          {showTactics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5 text-xs">
                <div className="font-bold text-amber-300">Estados de Alerta de Monstruos</div>
                {MONSTER_ALERTNESS.map((a) => (
                  <div key={a.id} className="text-stone-300">
                    <strong className={a.color}>{a.icon} {a.id}:</strong> {a.rule}
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5 text-xs">
                <div className="font-bold text-emerald-300">Guía de Negociación / Soborno / Rendición</div>
                {MONSTER_NEGOTIATION_GUIDE.map((txt, i) => (
                  <div key={i} className="text-stone-300">• {txt}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Calculadora de Amenaza del Encuentro (Prowess) */}
        {encounterList.length > 0 && (
          <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${threat.color}`}>
            <div>
              <div className="font-bold text-sm">
                Calculadora de Amenaza (Prowess): {threat.rating}
              </div>
              <div className="opacity-90">
                Amenaza Sala: <strong>{threat.totalProwess}</strong> vs Poder Grupo ({partySize} Héroes Nv.{partyLevel}): <strong>{threat.partyPower}</strong> (Ratio {threat.ratio}x) — {encounterList.map((e) => e.name).join(', ')}
              </div>
            </div>
            <button
              onClick={() => setEncounterList([])}
              className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpiar Sala
            </button>
          </div>
        )}

        {/* Filtros por Expansión y Búsqueda */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setExpansionFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                expansionFilter === 'all'
                  ? 'bg-amber-600 text-black'
                  : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
              }`}
            >
              Todas las Cajas ({MONSTERS.length})
            </button>
            {EXPANSIONS.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setExpansionFilter(exp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  expansionFilter === exp.id
                    ? 'bg-amber-600 text-black'
                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
                }`}
              >
                {exp.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar monstruo o familia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-sm text-stone-100 focus:border-amber-500 focus:outline-none w-56"
            />
          </div>
        </div>
      </div>

      {/* Tarjetas de Monstruos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((raw) => {
          const baseScaled = scaleMonster(raw, partyLevel, partySize, eliteMode, spiritMode);
          const m = applyMonsterTemplate(baseScaled, templateId);
          return (
            <div
              key={m.id}
              className="grimoire-panel rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-amber-500/50 transition overflow-hidden"
            >
              <div>
                {m.image && (
                  <div className="-mx-5 -mt-5 mb-4 h-44 overflow-hidden relative border-b border-amber-800/40">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140f12] via-transparent to-transparent" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-stone-800 text-amber-300">
                      {m.family} · {m.tier}
                    </span>
                    <h4 className="font-display text-lg font-bold text-stone-100 mt-1">{m.name}</h4>
                    <div className="text-[11px] text-stone-400">Miniatura: {m.miniature}</div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 whitespace-nowrap">
                    {m.scaledXP} XP
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-5 gap-1.5 my-3 text-center">
                  <div className="p-1.5 rounded-lg bg-stone-900/90 border border-stone-800">
                    <div className="text-[10px] text-stone-400">MOV</div>
                    <div className="font-bold text-sm text-sky-300">{m.mov}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/50">
                    <div className="text-[10px] text-stone-400 flex items-center justify-center gap-0.5">
                      <Skull className="w-2.5 h-2.5 text-red-400" /> AT
                    </div>
                    <div className="font-bold text-sm text-red-300">{m.scaledAt} DC</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-900/50">
                    <div className="text-[10px] text-stone-400 flex items-center justify-center gap-0.5">
                      <Shield className="w-2.5 h-2.5 text-amber-400" /> DEF
                    </div>
                    <div className="font-bold text-sm text-amber-200">{m.scaledDef} DC</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50">
                    <div className="text-[10px] text-stone-400">PC</div>
                    <div className="font-bold text-sm text-emerald-300">{m.scaledPC}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-900/50">
                    <div className="text-[10px] text-stone-400">PM</div>
                    <div className="font-bold text-sm text-purple-300">{m.pm}</div>
                  </div>
                </div>

                {/* Resistencia a hechizos (y aviso de Empuje SOLO si el monstruo es inmune a empuje) */}
                <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-0.5">
                  <div>
                    <strong className="text-purple-300">🧠 Resistencia a Hechizos:</strong> {m.mindResistLabel}
                  </div>
                  {m.physResistLabel && (
                    <div>
                      <strong className="text-amber-300">🗿 Especial:</strong> {m.physResistLabel}
                    </div>
                  )}
                </div>

                <ul className="space-y-1.5 text-xs text-stone-300">
                  {m.activeAbilities.map((ab, idx) => (
                    <li key={idx} className="leading-snug flex gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{ab}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-stone-800/70 flex items-center justify-between gap-2 text-[11px] text-stone-400">
                <span className="italic">{m.lore}</span>
                <button
                  onClick={() => setEncounterList((prev) => [...prev, m])}
                  className="px-2.5 py-1 rounded-lg bg-amber-600/20 border border-amber-500/60 hover:bg-amber-600 hover:text-black text-amber-200 font-bold flex items-center gap-1 whitespace-nowrap cursor-pointer shrink-0"
                  title="Añadir a la Calculadora de Amenaza (Prowess)"
                >
                  <Plus className="w-3 h-3" /> Evaluar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
