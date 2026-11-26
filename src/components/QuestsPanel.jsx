import React, { useState } from 'react';
import {
  Map,
  CheckCircle2,
  Circle,
  Sparkles,
  Award,
  ShieldAlert,
  Skull,
  Wand2,
  Play,
  GitBranch,
  Flame,
  Trash2,
} from 'lucide-react';
import { CAMPAIGNS, QUESTS } from '../data/quests';
import {
  PROCEDURAL_BIOMES,
  QUEST_PLOTS,
  generateProceduralQuest,
  generateCampaignArc,
} from '../data/proceduralEngine';

export default function QuestsPanel({
  completedQuests = [],
  onToggleQuest,
  partyLevel,
  partySize = 4,
  setPartySize = null,
  onAwardQuestRewards,
  proceduralQuests = [],
  setProceduralQuests,
  activeArcs = [],
  setActiveArcs,
  nemeses = [],
  setNemeses,
  onLaunchProceduralQuest,
  onLaunchOfficialQuest,
}) {
  const [section, setSection] = useState('architect'); // 'architect' | 'official'
  const [selectedCampaign, setSelectedCampaign] = useState('base');
  const [selectedQuestId, setSelectedQuestId] = useState('q1');

  // Controles de El Arquitecto del Abismo
  const [biomeId, setBiomeId] = useState('random');
  const [plotId, setPlotId] = useState('random');
  const [selectedProcQuest, setSelectedProcQuest] = useState(proceduralQuests[0] || null);

  const campaign = CAMPAIGNS.find((c) => c.id === selectedCampaign);
  const campaignQuests = QUESTS.filter((q) => q.campaignId === selectedCampaign);
  const activeQuest =
    campaignQuests.find((q) => q.id === selectedQuestId) || campaignQuests[0];
  const isDone = activeQuest && completedQuests.includes(activeQuest.id);

  const handleGenerateOneShot = () => {
    const q = generateProceduralQuest({
      mode: 'oneshot',
      biomeId,
      plotId,
      partyLevel,
      partySize,
    });
    setProceduralQuests?.((prev) => [q, ...prev].slice(0, 12));
    setSelectedProcQuest(q);
  };

  const handleGenerateArc = () => {
    const arc = generateCampaignArc({ biomeId, partyLevel, partySize });
    setActiveArcs?.((prev) => [arc, ...prev].slice(0, 6));
    setSelectedProcQuest(arc.quests[0]);
  };

  const toggleNemesisDefeated = (id) => {
    setNemeses?.((prev) =>
      prev.map((n) => (n.id === id ? { ...n, defeated: !n.defeated } : n))
    );
  };

  return (
    <div className="space-y-6">
      {/* Selector Principal: Arquitecto Procedural vs Campañas Oficiales + Selector de Jugadores */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSection('architect')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer transition ${
              section === 'architect'
                ? 'bg-gradient-to-r from-amber-600/30 to-red-900/40 border-amber-400 text-amber-200 shadow-lg'
                : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-400" /> El Arquitecto del Abismo (Procedurales y Arcos)
          </button>
          <button
            onClick={() => setSection('official')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer transition ${
              section === 'official'
                ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Map className="w-4 h-4 text-sky-400" /> Campañas Oficiales (Base + Reina + Luna)
          </button>
        </div>

        {/* Selector Global de Número de Aventureros (1 Solo a 4 Máximo; el DM no cuenta) */}
        {setPartySize && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs">
            <span className="font-bold text-slate-300 mr-1">👥 Héroes:</span>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setPartySize(n)}
                className={`px-2.5 py-1 rounded-lg font-extrabold cursor-pointer transition ${
                  partySize === n
                    ? n === 1
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {n === 1 ? '1 Solo' : n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Aviso de Reglas Activas en Modo 1 Jugador Solitario */}
      {partySize === 1 && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/35 border border-emerald-500/50 text-xs text-emerald-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong className="text-emerald-300">🛡️ Modo Solitario (1 Jugador) Activo:</strong>{' '}
            El tablero reduce automáticamente a <strong>1 monstruo por sala</strong>, el Jefe lucha <strong>sin escoltas</strong>, los monstruos bajan su vida/ataque en 40%, las puertas cerradas bajan <strong>-2 CD</strong> y tu héroe <strong>recupera +1 PC al limpiar cada sala con combate</strong>.
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODO 1: EL ARQUITECTO DEL ABISMO (ONE-SHOTS + ARCOS + NÉMESIS)      */}
      {/* ==================================================================== */}
      {section === 'architect' && (
        <div className="space-y-6">
          {/* Panel Generador */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-black text-amber-300 flex items-center gap-2">
                  <Wand2 className="w-6 h-6" /> El Arquitecto del Abismo
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Crea misiones temáticas independientes (One-Shot) o Arcos Conectados de 3 partes con continuidad real, Salas de Peligro, Giros y Mapa 26×19 listo para el Tablero.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleGenerateOneShot}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4" /> Generar Misión Única (One-Shot)
                </button>
                <button
                  onClick={handleGenerateArc}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-red-700 hover:from-purple-600 hover:to-red-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <GitBranch className="w-4 h-4" /> Crear Arco Conectado (3 Partes)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-800">
              <label className="text-xs space-y-1">
                <span className="text-stone-400 font-bold">Bioma Temático (cambia reglas y materiales):</span>
                <select
                  value={biomeId}
                  onChange={(e) => setBiomeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold"
                >
                  <option value="random">🎲 Bioma Aleatorio</option>
                  {PROCEDURAL_BIOMES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.icon} {b.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs space-y-1">
                <span className="text-stone-400 font-bold">Trama Principal (para One-Shot):</span>
                <select
                  value={plotId}
                  onChange={(e) => setPlotId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold"
                >
                  <option value="random">🎲 Trama Aleatoria</option>
                  {QUEST_PLOTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.icon} {p.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Lista de Arcos Conectados + Némesis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              {/* Arcos de Campaña */}
              <div className="grimoire-panel rounded-2xl p-4 space-y-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4" /> Arcos Conectados Activos ({activeArcs.length})
                </h3>
                {activeArcs.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">
                    Aún no creas un arco conectado. Pulsa "Crear Arco Conectado (3 Partes)" arriba.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeArcs.map((arc) => (
                      <div key={arc.id} className="p-3 rounded-xl bg-stone-950/80 border border-purple-800/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-display font-bold text-sm text-amber-200">{arc.title}</div>
                          <button
                            onClick={() => setActiveArcs?.((prev) => prev.filter((a) => a.id !== arc.id))}
                            className="text-stone-500 hover:text-red-400 cursor-pointer"
                            title="Eliminar arco"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {arc.biome.icon} {arc.biome.name} · Villano: <strong className="text-red-300">{arc.villainName}</strong>
                        </div>
                        <div className="space-y-1.5">
                          {arc.quests.map((q) => {
                            const done = completedQuests.includes(q.id);
                            return (
                              <button
                                key={q.id}
                                onClick={() => setSelectedProcQuest(q)}
                                className={`w-full p-2 rounded-lg border text-left text-xs flex items-center justify-between cursor-pointer ${
                                  selectedProcQuest?.id === q.id
                                    ? 'bg-purple-900/40 border-purple-400 text-white'
                                    : 'bg-stone-900/70 border-stone-800 text-stone-300'
                                }`}
                              >
                                <span>
                                  <strong>Parte {q.arcInfo.partNumber}:</strong> {q.plot.icon} {q.plot.name} (Nv.{q.partyLevel})
                                </span>
                                {done ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-stone-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Misiones One-Shot Recientes */}
              <div className="grimoire-panel rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">
                    📜 Misiones Creadas ({proceduralQuests.length})
                  </h3>
                  {proceduralQuests.length >= 2 && (
                    <button
                      onClick={() => {
                        setProceduralQuests?.([]);
                        setSelectedProcQuest(null);
                      }}
                      className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-800 border border-rose-700/60 text-rose-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Eliminar todas las misiones procedurales guardadas"
                    >
                      <Trash2 className="w-3 h-3" /> Borrar todas
                    </button>
                  )}
                </div>
                {proceduralQuests.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">Genera una misión One-Shot arriba o acepta una en la Taberna.</p>
                ) : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {proceduralQuests.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => setSelectedProcQuest(q)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                          selectedProcQuest?.id === q.id
                            ? 'bg-amber-600/20 border-amber-400 text-amber-100'
                            : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-600'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">{q.title}</div>
                          <div className="text-[11px] text-stone-400 truncate">
                            {q.biome.icon} {q.biome.name} · Nv.{q.partyLevel}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {completedQuests.includes(q.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProceduralQuests?.((prev) => {
                                const next = prev.filter((item) => item.id !== q.id);
                                if (selectedProcQuest?.id === q.id) {
                                  setSelectedProcQuest(next[0] || null);
                                }
                                return next;
                              });
                            }}
                            className="p-1.5 rounded-lg bg-stone-950/80 hover:bg-rose-900/80 text-stone-400 hover:text-rose-200 border border-stone-800 cursor-pointer transition"
                            title="Borrar esta misión creada"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Registro de Némesis Recurrentes */}
              <div className="grimoire-panel rounded-2xl p-4 space-y-2.5">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Skull className="w-4 h-4" /> Némesis Escapados ({nemeses.length})
                </h3>
                {nemeses.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">
                    Si un Jefe escapa usando un Contador de Escape en el Tablero, aparecerá aquí y volverá más fuerte en futuras misiones.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {nemeses.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-red-950/30 border border-red-800/50 text-xs flex items-center justify-between gap-2">
                        <div>
                          <div className={`font-bold ${n.defeated ? 'line-through text-stone-500' : 'text-red-200'}`}>
                            {n.name} (Rango {n.rank})
                          </div>
                          <div className="text-[11px] text-stone-400">Última vez: {n.lastSeen}</div>
                        </div>
                        <button
                          onClick={() => toggleNemesisDefeated(n.id)}
                          className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700 text-[11px] font-bold text-amber-300 cursor-pointer"
                        >
                          {n.defeated ? 'Reactivar' : 'Marcar Caído'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detalle Completo de la Misión Procedural Seleccionada */}
            <div className="lg:col-span-7">
              {selectedProcQuest ? (
                <div className="grimoire-panel rounded-2xl p-6 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-800 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded border font-bold ${selectedProcQuest.biome.badgeColor}`}>
                          {selectedProcQuest.biome.icon} {selectedProcQuest.biome.name}
                        </span>
                        <span className="text-amber-400 font-bold">Nivel {selectedProcQuest.partyLevel}</span>
                      </div>
                      <h3 className="font-display text-2xl font-black text-amber-100 mt-1.5">
                        {selectedProcQuest.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => onLaunchProceduralQuest && onLaunchProceduralQuest(selectedProcQuest)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-500 hover:to-red-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Play className="w-4 h-4" /> Lanzar al Tablero 2D
                    </button>
                  </div>

                  {selectedProcQuest.arcInfo && (
                    <div className="p-3.5 rounded-xl bg-purple-950/35 border border-purple-700/60 text-xs text-purple-100">
                      <strong>🔗 Continuidad del Arco (Solo DM):</strong> {selectedProcQuest.arcInfo.continuityNote}
                    </div>
                  )}

                  {/* HISTORIA PARA LEER EN VOZ ALTA A LOS AVENTUREROS (100% SIN SPOILERS) */}
                  <div className="p-5 rounded-xl bg-amber-950/25 border-l-4 border-amber-400 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                        📜 Historia para Leer en Voz Alta a los Aventureros (Sin Spoilers)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold">
                        Seguro para jugadores
                      </span>
                    </div>
                    <p className="font-lore text-base italic text-amber-100 leading-relaxed">
                      “{selectedProcQuest.readAloudIntro || selectedProcQuest.mapData?.intro || selectedProcQuest.biome.ambientFlavor}”
                    </p>
                    <div className="text-xs text-slate-300 pt-2 border-t border-amber-500/20">
                      <strong className="text-amber-300">Regla del Bioma ({selectedProcQuest.biome.name}):</strong>{' '}
                      {selectedProcQuest.biome.globalRule}
                    </div>
                  </div>

                  {/* Escenas Progresivas Conectadas al Mapa */}
                  {selectedProcQuest.storyBeats && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
                        🎬 Escenas Progresivas (Solo se activan al llegar a cada sala en el Tablero)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {Object.entries(selectedProcQuest.storyBeats).map(([roomId, beat]) => (
                          <div key={roomId} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-amber-300">{roomId} · {beat.title}</span>
                              <span className="text-[10px] text-sky-300 font-semibold">{beat.stage}</span>
                            </div>
                            <p className="text-[11px] italic text-slate-300 line-clamp-2">“{beat.readAloud}”</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1.5">
                      <div className="font-bold text-amber-300 uppercase">
                        {selectedProcQuest.plot.icon} Objetivo Principal ({selectedProcQuest.plot.name})
                      </div>
                      <p className="text-stone-200">{selectedProcQuest.plot.objective}</p>
                      <p className="text-red-300"><strong>Clímax:</strong> {selectedProcQuest.plot.climaxRule}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1.5">
                      <div className="font-bold text-emerald-300 uppercase">
                        🏅 Objetivo Secundario (Reputación)
                      </div>
                      <p className="text-stone-100 font-bold">{selectedProcQuest.sideObjective.title}</p>
                      <p className="text-stone-300">{selectedProcQuest.sideObjective.desc}</p>
                      <p className="text-emerald-300"><strong>Premio:</strong> {selectedProcQuest.sideObjective.reward}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/50 text-xs space-y-1.5">
                    <div className="font-bold text-red-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4" /> Jefe, Fase 2 y Giro Sorpresa
                    </div>
                    <p className="text-stone-200"><strong>Jefe:</strong> {selectedProcQuest.bossName}</p>
                    <p className="text-amber-200">{selectedProcQuest.bossPhase2}</p>
                    <p className="text-purple-200"><strong>⚡ Giro de Misión:</strong> {selectedProcQuest.twist}</p>
                  </div>

                  {/* Salas de Peligro Asignadas */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      ⚠️ Salas de Peligro Activas en este Mapa (Hazard Rooms)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {Object.entries(selectedProcQuest.hazardRooms || {}).map(([rId, haz]) => (
                        <div key={rId} className="p-3 rounded-xl bg-stone-900/90 border border-amber-800/40 space-y-1">
                          <div className="font-bold text-amber-200">
                            {rId} · {haz.icon} {haz.name}
                          </div>
                          <p className="text-[11px] text-stone-300">{haz.rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recompensas */}
                  <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-emerald-300 uppercase">Recompensa al Completar</div>
                      <div className="text-stone-200 mt-0.5">
                        <strong>+{selectedProcQuest.rewards.xp} XP</strong> · <strong>+{selectedProcQuest.rewards.gold} MO</strong> · +{selectedProcQuest.rewards.fame} Fama · +{selectedProcQuest.rewards.reputation} Reputación
                      </div>
                    </div>
                    <button
                      onClick={() => onAwardQuestRewards(selectedProcQuest)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold cursor-pointer"
                    >
                      Otorgar Recompensas al Grupo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grimoire-panel rounded-2xl p-10 text-center text-stone-400 text-sm">
                  Pulsa <strong>"Generar Misión Única"</strong> o <strong>"Crear Arco Conectado"</strong> para diseñar tu próxima aventura al instante.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODO 2: CAMPAÑAS OFICIALES (Preservadas limpiamente)                 */}
      {/* ==================================================================== */}
      {section === 'official' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CAMPAIGNS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCampaign(c.id);
                  const first = QUESTS.find((q) => q.campaignId === c.id);
                  if (first) setSelectedQuestId(first.id);
                }}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  selectedCampaign === c.id
                    ? 'bg-amber-950/40 border-amber-500 shadow-lg'
                    : 'grimoire-panel border-stone-800 hover:border-stone-600'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Niveles {c.levelRange}
                </div>
                <div className="font-display font-bold text-stone-100 mt-1">{c.name}</div>
                <div className="text-xs text-stone-400 mt-1">{c.subtitle}</div>
              </button>
            ))}
          </div>

          {campaign && (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-700/50 text-sm text-purple-100 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Regla de Campaña ({campaign.name}):</strong>{' '}
                {campaign.specialRule}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 grimoire-panel rounded-2xl p-4 space-y-2 max-h-[600px] overflow-y-auto">
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-amber-300 px-2 pb-2 border-b border-stone-800 flex items-center gap-2">
                <Map className="w-4 h-4" /> Misiones ({campaignQuests.length})
              </h4>
              {campaignQuests.map((q) => {
                const done = completedQuests.includes(q.id);
                const active = activeQuest?.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestId(q.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition cursor-pointer ${
                      active
                        ? 'bg-amber-600/20 border-amber-500 text-amber-100'
                        : 'bg-stone-900/60 border-stone-800/80 text-stone-300 hover:border-stone-600'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] text-amber-400 font-bold">
                        Misión {q.number} · Nv. Rec. {q.recLevel}
                      </div>
                      <div className="font-semibold text-sm">{q.title}</div>
                    </div>
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {activeQuest && (() => {
              const questBiome = PROCEDURAL_BIOMES.find((b) => b.id === activeQuest.biomeId);
              return (
              <div className="lg:col-span-8 grimoire-panel rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold uppercase tracking-widest text-amber-400">
                        Misión {activeQuest.number} · Nv. Rec. {activeQuest.recLevel} (Grupo: Nv. {partyLevel})
                      </span>
                      {questBiome && (
                        <span className={`px-2 py-0.5 rounded-md border font-bold text-[11px] ${questBiome.badgeColor}`}>
                          {questBiome.icon} {questBiome.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-slate-100">
                      {activeQuest.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onLaunchOfficialQuest && onLaunchOfficialQuest(activeQuest)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition"
                    >
                      <Play className="w-4 h-4" />
                      {activeQuest.officialMapId ? 'Lanzar Mapa Oficial 2D' : 'Generar y Lanzar al Tablero 2D'}
                    </button>
                    <button
                      onClick={() => onToggleQuest(activeQuest.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition ${
                        isDone
                          ? 'bg-emerald-700 border-emerald-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> {isDone ? 'Completada' : 'Marcar Hecha'}
                    </button>
                  </div>
                </div>

                {/* Narrativa y Regla del Bioma */}
                <div className="p-4 rounded-xl bg-amber-950/20 border-l-4 border-amber-500 space-y-2">
                  <p className="font-lore text-base italic text-amber-100/95 leading-relaxed">
                    “{activeQuest.intro}”
                  </p>
                  {questBiome && (
                    <div className="text-xs text-slate-300 pt-2 border-t border-amber-500/20">
                      <strong className="text-amber-300">Regla de Bioma ({questBiome.name}):</strong>{' '}
                      {questBiome.globalRule}
                    </div>
                  )}
                </div>

                {/* Giro HQ-D20 v2 */}
                <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-500/35 text-sm text-slate-200 leading-relaxed">
                  {activeQuest.hqD20Twist}
                </div>

                {/* Objetivos + Jefe y Fase 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      🎯 Objetivos (Principal + Secundarios de Reputación)
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-200">
                      {activeQuest.objectives.map((o, i) => (
                        <li
                          key={i}
                          className={`p-2 rounded-lg border ${
                            i === 0
                              ? 'bg-amber-950/25 border-amber-500/30 text-amber-100 font-semibold'
                              : 'bg-emerald-950/20 border-emerald-500/25 text-emerald-100'
                          }`}
                        >
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <Skull className="w-4 h-4" /> Jefe, Fase 2 y Balanceo Dinámico
                    </h4>
                    <p className="text-slate-200">
                      <strong className="text-white">Jefe:</strong> {activeQuest.boss}
                    </p>
                    {activeQuest.bossPhase2 && (
                      <p className="text-amber-200 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/30">
                        <strong className="text-rose-300">🔥 {activeQuest.bossPhase2}</strong>
                      </p>
                    )}
                    <p className="text-slate-300">
                      <strong className="text-white">Monstruo Errante:</strong> {activeQuest.wanderingMonster}
                    </p>
                    <p className="text-amber-200/90 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/30 flex gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{activeQuest.scalingTip}</span>
                    </p>
                  </div>
                </div>

                {/* Briefing Táctico HQ-D20 v2 (Puertas, Alerta, Negociación, Salas de Peligro, Pistas) */}
                {activeQuest.tacticalSetup && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                      🧭 Preparación Táctica del DM (Reglas HQ-D20 v2 + AHQ)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/75 border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-300">🚪 Puertas y Secretos</div>
                        <p className="text-slate-300 leading-relaxed">{activeQuest.tacticalSetup.doors}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/75 border border-slate-800 space-y-1">
                        <div className="font-bold text-rose-300">👁️ Estados de Alerta</div>
                        <p className="text-slate-300 leading-relaxed">{activeQuest.tacticalSetup.alertness}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/75 border border-slate-800 space-y-1">
                        <div className="font-bold text-emerald-300">💬 Negociación / Interacción</div>
                        <p className="text-slate-300 leading-relaxed">{activeQuest.tacticalSetup.negotiation}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/75 border border-slate-800 space-y-1">
                        <div className="font-bold text-orange-300">⚠️ Salas de Peligro (Hazards)</div>
                        <p className="text-slate-300 leading-relaxed">{activeQuest.tacticalSetup.hazardRoom}</p>
                      </div>
                      <div className="md:col-span-2 p-3 rounded-xl bg-sky-950/25 border border-sky-500/30 space-y-1">
                        <div className="font-bold text-sky-300">🔍 Pista de Bifurcación (Hint Deck)</div>
                        <p className="text-sky-100 leading-relaxed">{activeQuest.tacticalSetup.hintClue}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Materiales de Crafteo */}
                {activeQuest.materialsLoot && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
                    <div className="font-bold text-emerald-300 uppercase tracking-wider">
                      ⚒️ Materiales de Crafteo en esta Misión
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeQuest.materialsLoot.map((mat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-200 font-semibold"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recompensas */}
                <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/35 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 text-sm">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Recompensa de Misión
                    </div>
                    <div className="text-slate-200 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                      <strong className="text-amber-300">+{activeQuest.rewards.xp} XP</strong>
                      <span>·</span>
                      <strong className="text-amber-300">+{activeQuest.rewards.gold} MO</strong>
                      {activeQuest.rewards.fame ? (
                        <>
                          <span>·</span>
                          <strong className="text-sky-300">+{activeQuest.rewards.fame} ⭐ Fama</strong>
                        </>
                      ) : null}
                      {activeQuest.rewards.reputation ? (
                        <>
                          <span>·</span>
                          <strong className="text-emerald-300">+{activeQuest.rewards.reputation} 🏅 Reputación</strong>
                        </>
                      ) : null}
                    </div>
                    <div className="text-xs text-slate-300">{activeQuest.rewards.loot}</div>
                  </div>
                  <button
                    onClick={() => onAwardQuestRewards(activeQuest)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer transition shadow-sm"
                  >
                    Otorgar Recompensas al Grupo
                  </button>
                </div>
              </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
