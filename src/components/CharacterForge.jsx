import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  UserPlus,
  Printer,
  Trash2,
  TrendingUp,
  Backpack,
  Sparkles,
  Heart,
  Brain,
  Shield,
  Swords,
  Dices,
  Coins,
  Plus,
  X,
  QrCode,
  Gift,
  Smartphone,
} from 'lucide-react';
import {
  ATTRIBUTES,
  RACES,
  CLASSES,
  QUIRKS,
  LEVEL_TABLE,
  SPELLS_CATALOG,
  STATUS_CATALOG,
  buildStartingInventory,
  computeClassRacePillars,
  getHeroPillars,
  formatMod,
} from '../data/characterSystem';
import { PROFESSIONS } from '../data/citySystem';
import { getRarityMeta } from '../data/lootCatalog';
import { KeywordChip, RichRuleText, KeywordModal } from './KeywordTooltip';

export default function CharacterForge({
  heroes,
  setHeroes,
  mobileCreateOnly = false,
  onHeroCreatedMobile,
}) {
  const [mode, setMode] = useState(mobileCreateOnly ? 'create' : heroes.length > 0 ? 'sheet' : 'create');
  const [selectedHeroId, setSelectedHeroId] = useState(heroes[0]?.id || null);

  // Estado del Creador de Personajes (Simplificado: 4 Pilares automáticos según Clase + Raza)
  const [name, setName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [raceId, setRaceId] = useState('humano');
  const [dragonElement, setDragonElement] = useState('Fuego');
  const [classId, setClassId] = useState('barbaro');
  const level = 1; // Todos los héroes nuevos inician en Nivel 1; solo el DM los sube de nivel
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [professionId, setProfessionId] = useState('herrero');
  const [quirkId, setQuirkId] = useState('corazon_de_hierro');
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const race = RACES.find((r) => r.id === raceId) || RACES[0];
  const cls = CLASSES.find((c) => c.id === classId) || CLASSES[0];
  const finalAttrs = computeClassRacePillars(cls, race);

  const calcMaxPC = () => {
    const fueBonus = Math.max(0, Math.floor((finalAttrs.FUE || 0) / 2));
    const raceBonus = raceId === 'enano' ? 1 : 0;
    const quirkBonus = quirkId === 'corazon_de_hierro' ? 1 : 0;
    return cls.basePC + fueBonus + raceBonus + quirkBonus + (level - 1) * cls.pcPerLevel;
  };

  const calcMaxPM = () => {
    const menBonus = Math.max(0, Math.floor((finalAttrs.MEN || 0) / 2));
    const raceBonus = raceId === 'alto_elfo' ? 1 : 0;
    const quirkBonus = quirkId === 'sangre_arcana' ? 1 : 0;
    return cls.basePM + menBonus + raceBonus + quirkBonus + (level - 1) * cls.pmPerLevel;
  };

  const randomizeHero = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const firstNames = [
      'Kaelen', 'Lyra', 'Thorin', 'Valeria', 'Draven', 'Elowen', 'Garrick', 'Nyx',
      'Rowan', 'Seraphina', 'Brom', 'Isolde', 'Aldric', 'Freya', 'Kragor', 'Morrigan',
      'Talia', 'Ronan', 'Vesper', 'Darian', 'Astrid', 'Balthazar', 'Caelum', 'Soren',
    ];
    const epithets = [
      'del Norte', 'Puño de Hierro', 'de Elethorn', 'Sombra Gris', 'Rompeescudos',
      'Fuego Lunar', 'el Errante', 'la Audaz', 'Colmillo de Plata', 'del Abismo',
      'Guardia del Alba', 'Paso Silencioso',
    ];

    const rRace = pick(RACES);
    const rCls = pick(CLASSES);

    setName(`${pick(firstNames)} ${pick(epithets)}`);
    setRaceId(rRace.id);
    setClassId(rCls.id);
    setProfessionId(pick(PROFESSIONS).id);
    setQuirkId(pick(QUIRKS).id);
    setDragonElement(Math.random() < 0.5 ? 'Fuego' : 'Hielo');
  };

  const createHero = () => {
    const heroName = name.trim() || `${cls.name} de ${race.name.split(' ')[0]}`;
    const levelInfo = LEVEL_TABLE.find((l) => l.level === level) || LEVEL_TABLE[0];
    const maxPC = calcMaxPC();
    const maxPM = calcMaxPM();
    const speedBase = 8 + (race.speedMod || 0);
    const initMod = finalAttrs.AGI || 1;
    const chosenSub = null; // La subclase se desbloquea cuando el DM sube al héroe a Nivel 3

    const finalSkills = Array.from(new Set([...cls.proficientSkills]));
    const raceTraitFull =
      raceId === 'draconido'
        ? `${race.traitName} (${dragonElement}): ${race.traitDesc}`
        : `${race.traitName}: ${race.traitDesc}`;

    const newHero = {
      id: `h-${Date.now()}`,
      name: heroName,
      playerName: playerName.trim() || 'Jugador',
      raceId: race.id,
      raceName: raceId === 'draconido' ? `${race.name} (${dragonElement})` : race.name,
      dragonElement: raceId === 'draconido' ? dragonElement : null,
      raceTrait: raceTraitFull,
      usedSpells: [],
      activeEffects: [],
      classId: cls.id,
      className: cls.name,
      role: cls.role,
      miniature: cls.miniature,
      subclass: chosenSub,
      level,
      xp: levelInfo.xp,
      profBonus: levelInfo.prof,
      gold: 25,
      attributes: finalAttrs,
      maxPC,
      currentPC: maxPC,
      maxPM,
      currentPM: maxPM,
      attackDice: cls.baseAttackDice,
      defendDice: cls.baseDefendDice,
      speed: speedBase,
      initMod,
      resourceName: cls.resourceName,
      coreAbility: cls.coreAbility,
      proficientSkills: finalSkills,
      alignment: null,
      motivation: null,
      perks: [],
      flaws: [],
      inventory: buildStartingInventory(cls),
      professionId,
      professionName: PROFESSIONS.find((p) => p.id === professionId)?.name || 'Herrero de Batalla',
      quirk: QUIRKS.find((q) => q.id === quirkId) || null,
      materials: {
        racion_mazmorra: 1,
        ...(professionId === 'herbolario' || raceId === 'gnomo' ? { hierba_lunar: 1 } : {}),
        ...(professionId === 'herrero' ? { chatarra_acero: 1 } : {}),
        ...(professionId === 'escriba' || raceId === 'gnomo' ? { polvo_runico: 1 } : {}),
        ...(professionId === 'cazador' ? { colmillos_hueso: 1 } : {}),
      },
      bankedGold: 0,
      debt: 0,
      fame: 0,
      reputation: 0,
      titles: [],
      notes: '',
    };

    if (mobileCreateOnly && onHeroCreatedMobile) {
      onHeroCreatedMobile(newHero);
      return;
    }

    setHeroes((prev) => [...prev, newHero]);
    setSelectedHeroId(newHero.id);
    setName('');
    setMode('sheet');
  };

  const activeHero = heroes.find((h) => h.id === selectedHeroId) || heroes[0] || null;

  const updateActiveHero = (updater) => {
    if (!activeHero) return;
    setHeroes((prev) => prev.map((h) => (h.id === activeHero.id ? updater(h) : h)));
  };

  const toggleStatusOnHero = (statusObj) => {
    if (!activeHero) return;
    updateActiveHero((h) => {
      const curr = Array.isArray(h.activeEffects) ? h.activeEffects : [];
      const exists = curr.some((e) => e.id === statusObj.id);
      if (exists) {
        return { ...h, activeEffects: curr.filter((e) => e.id !== statusObj.id) };
      }
      return {
        ...h,
        activeEffects: [
          ...curr,
          {
            id: statusObj.id,
            label: `${statusObj.icon} ${statusObj.name}`,
            type: statusObj.type,
            duration: statusObj.type === 'buff' ? 3 : 99,
            note: statusObj.effect,
          },
        ],
      };
    });
  };

  const levelUpHero = () => {
    if (!activeHero || activeHero.level >= 10) return;
    const hCls = CLASSES.find((c) => c.id === activeHero.classId) || CLASSES[0];
    const nextLvl = activeHero.level + 1;
    const lvlInfo = LEVEL_TABLE.find((l) => l.level === nextLvl);
    updateActiveHero((h) => ({
      ...h,
      level: nextLvl,
      xp: Math.max(h.xp, lvlInfo?.xp || h.xp),
      profBonus: lvlInfo?.prof || h.profBonus,
      maxPC: h.maxPC + hCls.pcPerLevel,
      currentPC: h.maxPC + hCls.pcPerLevel,
      maxPM: h.maxPM + hCls.pmPerLevel,
      currentPM: h.maxPM + hCls.pmPerLevel,
      subclass: nextLvl === 3 && !h.subclass ? hCls.subclasses[0] : h.subclass,
    }));
  };

  const removeItemFromHero = (itemId) => {
    updateActiveHero((h) => ({
      ...h,
      inventory: (h.inventory || []).filter((i) => i.id !== itemId),
    }));
  };

  const deleteHero = (id) => {
    const next = heroes.filter((h) => h.id !== id);
    setHeroes(next);
    setSelectedHeroId(next[0]?.id || null);
    if (next.length === 0) setMode('create');
  };

  const nextLevelInfo = activeHero
    ? LEVEL_TABLE.find((l) => l.level === activeHero.level + 1)
    : null;

  return (
    <div className="space-y-6">
      {/* Barra superior (Oculta al imprimir y en modo creación móvil) */}
      {!mobileCreateOnly && (
        <div className="no-print space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMode('create')}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer transition ${
                  mode === 'create'
                    ? 'bg-amber-600 text-black border-amber-400'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Forjar Nuevo Héroe
              </button>
              <button
                onClick={() => setMode('sheet')}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer transition ${
                  mode === 'sheet'
                    ? 'bg-amber-600 text-black border-amber-400'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500'
                }`}
              >
                <Backpack className="w-4 h-4" /> Hojas de Héroes ({heroes.length})
              </button>
            </div>

            {mode === 'sheet' && activeHero && (
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" /> Imprimir Hoja A4
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Interactivo de Palabras Clave para Jugadores Nuevos */}
      <KeywordModal keyword={activeKeyword} onClose={() => setActiveKeyword(null)} />

      {/* ==================== MODO CREACIÓN DE PERSONAJE ==================== */}
      {mode === 'create' && (
        <div className="space-y-6 no-print">
          {/* Guía Rápida de Palabras Clave Tocables */}
          <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-700/50 space-y-2">
            <div className="text-xs font-bold text-sky-300">
              💡 ¿Eres nuevo? Toca cualquier palabra resaltada en azul para ver qué significa y para qué sirve:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['PC', 'PM', 'DC', 'CD', 'Ventaja', 'Shock'].map((kw) => (
                <KeywordChip key={kw} word={kw} onSelect={setActiveKeyword} />
              ))}
            </div>
          </div>

          {/* Paso 1: Identidad (Todos inician en Nivel 1) */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-amber-300">1. Identidad del Héroe</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={randomizeHero}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Dices className="w-4 h-4" /> 🎲 Generar Personaje Random
                </button>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/50 text-amber-300 font-bold">
                  Nivel Inicial: 1
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Nombre del Personaje</label>
                <input
                  type="text"
                  placeholder="Ej. Kragor Puño de Hierro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 block mb-1">Tu Nombre (Jugador)</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Paso 2: Raza / Linaje */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-amber-300">2. Raza / Linaje</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RACES.map((r) => {
                const active = r.id === raceId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRaceId(r.id)}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      active
                        ? 'bg-amber-950/50 border-amber-400 shadow-lg'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{r.icon}</span>
                      <span className="text-[11px] font-bold text-emerald-300">
                        {Object.entries(r.bonuses)
                          .map(([k, v]) => `+${v} ${k}`)
                          .join(', ')}
                      </span>
                    </div>
                    <div className="font-display font-bold text-stone-100 mt-2">{r.name}</div>
                    <div className="text-xs text-amber-300/90 font-semibold mt-1">{r.traitName}</div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                      <RichRuleText text={r.traitDesc} onSelectKeyword={setActiveKeyword} />
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Opción Especial de Raza: Sangre de Dragón (Elemento) */}
            {raceId === 'draconido' && (
              <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-700/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-amber-300">🐉 Linaje de Sangre de Dragón — Elige tu Elemento de Aliento:</div>
                  <div className="text-stone-300">Se lanza 1 vez por misión en línea recta (3 casillas frente a ti) con 2 DC de daño mágico.</div>
                </div>
                <div className="flex gap-2">
                  {['Fuego', 'Hielo'].map((el) => (
                    <button
                      key={el}
                      type="button"
                      onClick={() => setDragonElement(el)}
                      className={`px-4 py-2 rounded-lg font-bold border cursor-pointer ${
                        dragonElement === el
                          ? 'bg-amber-600 text-black border-amber-300'
                          : 'bg-stone-900 border-stone-700 text-stone-300'
                      }`}
                    >
                      {el === 'Fuego' ? '🔥 Fuego (corta regeneración)' : '❄️ Hielo (escarcha mágica)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Paso 3: Clase / Arquetipo */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-amber-300">3. Clase / Arquetipo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CLASSES.map((c) => {
                const active = c.id === classId;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setClassId(c.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      active
                        ? 'bg-red-950/40 border-amber-400 shadow-lg'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{c.icon}</span>
                      <span className="text-[11px] font-bold text-amber-300">
                        PC {c.basePC} · PM {c.basePM}
                      </span>
                    </div>
                    <div className="font-display font-bold text-stone-100 mt-2">{c.name}</div>
                    <div className="text-[11px] text-stone-400">{c.role}</div>
                    <div className="text-[10px] text-sky-300 mt-1">Mini: {c.miniature}</div>
                    <p className="text-[11px] text-stone-300 mt-2 leading-snug">
                      <RichRuleText text={c.coreAbility} onSelectKeyword={setActiveKeyword} />
                    </p>
                    {Array.isArray(c.startingGear) && c.startingGear.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-stone-800/80 space-y-0.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                          🎒 Equipo Inicial:
                        </div>
                        {c.startingGear.map((g, gi) => (
                          <div key={gi} className="text-[10px] text-stone-300 leading-tight">
                            • {g}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paso 4: Los 4 Pilares Simplificados (Fuerza, Agilidad, Mente, Suerte) */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-amber-300">4. Los 4 Pilares de {cls.name}</h3>
              <p className="text-xs text-stone-400">
                Sin tablas complicadas: tus bonos directos (<strong>+0 a +4</strong>) se asignan automáticamente según tu <strong>Clase + Raza</strong> y se suman directo a tus tiradas de d20.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ATTRIBUTES.map((a) => {
                const val = finalAttrs[a.id] ?? 1;
                const isStrong = val >= 3;
                return (
                  <div
                    key={a.id}
                    className={`p-4 rounded-xl border text-left space-y-1.5 ${
                      isStrong
                        ? 'bg-amber-950/30 border-amber-500/70'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-black ${a.color || 'text-amber-300'}`}>
                        {a.icon} {a.name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-200 font-black text-sm">
                        {formatMod(val)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{a.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Paso 5: Profesión (Ciudad + Mazmorra) y Rasgo de Personalidad (Quirk con Alertas al DM) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="text-xl font-bold text-amber-300">5. Profesión del Héroe</h3>
              <p className="text-xs text-stone-400">
                Otorga <strong>-20% de descuento</strong> en su distrito de la Ciudad y un <strong>bono único dentro de la mazmorra</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {PROFESSIONS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProfessionId(p.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer transition ${
                      professionId === p.id
                        ? 'bg-emerald-950/50 border-emerald-400 text-emerald-100'
                        : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-600'
                    }`}
                  >
                    <div className="font-bold">{p.icon} {p.name}</div>
                    <div className="text-[11px] text-emerald-300 mt-0.5">{p.cityBonus}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{p.dungeonBonus}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="text-xl font-bold text-purple-300">6. Rasgo de Personalidad (Quirk)</h3>
              <p className="text-xs text-stone-400">
                Elige 1 rasgo equilibrado (1 ventaja táctica + 1 manía divertida). <strong>¡El DM recibirá alertas en vivo en el Tablero</strong> cuando tu manía pueda activarse en la sala!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {QUIRKS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuirkId(q.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer transition ${
                      quirkId === q.id
                        ? 'bg-purple-950/50 border-purple-400 text-purple-100'
                        : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-600'
                    }`}
                  >
                    <div className="font-bold">{q.icon} {q.name}</div>
                    <div className="text-[11px] text-emerald-300 mt-0.5">+ {q.bonus}</div>
                    <div className="text-[10px] text-red-300 mt-0.5">- {q.drawback}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen y Botón Final */}
          <div className="grimoire-panel rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 border-amber-500/50">
            <div className="flex flex-wrap gap-4 text-sm">
              <div><span className="text-stone-400">PC Máx:</span> <strong className="text-emerald-300 text-lg">{calcMaxPC()}</strong></div>
              <div><span className="text-stone-400">PM Máx:</span> <strong className="text-cyan-300 text-lg">{calcMaxPM()}</strong></div>
              <div><span className="text-stone-400">Ataque:</span> <strong className="text-red-300 text-lg">{cls.baseAttackDice} DC</strong></div>
              <div><span className="text-stone-400">Defensa:</span> <strong className="text-amber-300 text-lg">{cls.baseDefendDice} DC</strong></div>
              <div><span className="text-stone-400">Movimiento:</span> <strong className="text-purple-300 text-lg">{8 + (race.speedMod || 0)} cas</strong></div>
            </div>
            <button
              onClick={createHero}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-display font-bold text-base shadow-xl cursor-pointer transition flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />{' '}
              {mobileCreateOnly ? 'Finalizar y Entrar a mi Hoja' : 'Forjar Héroe y Abrir Hoja'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODO HOJA DE PERSONAJE (IMPRIMIBLE) ==================== */}
      {mode === 'sheet' && (
        <div className="space-y-6">
          {/* Selector de Héroes del Grupo (no-print) */}
          <div className="no-print flex flex-wrap gap-2">
            {heroes.length === 0 ? (
              <p className="text-stone-400 text-sm">Aún no hay héroes creados. Pulsa "Forjar Nuevo Héroe".</p>
            ) : (
              heroes.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHeroId(h.id)}
                  className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
                    activeHero?.id === h.id
                      ? 'bg-amber-600/20 border-amber-400 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span>{h.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                    Nv.{h.level}
                  </span>
                </button>
              ))
            )}
          </div>

          {activeHero && (() => {
            const heroPillars = getHeroPillars(activeHero);
            const activeEffects = Array.isArray(activeHero.activeEffects) ? activeHero.activeEffects : [];
            const activeEffectIds = new Set(activeEffects.map((e) => e.id));
            const curPC = activeHero.currentPC ?? activeHero.maxPC;
            const curPM = activeHero.currentPM ?? activeHero.maxPM;
            const totalRep = Number(activeHero.reputation || 0) + Number(activeHero.fame || 0);

            return (
              <div className="rounded-3xl bg-gradient-to-b from-slate-900/95 via-[#111827] to-slate-950 border border-slate-700/80 p-5 sm:p-6 shadow-2xl space-y-5">
                {/* Encabezado Moderno del Monitor DM */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                      Monitor DM en Vivo · Sincronizado con Celular
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-0.5">
                      {activeHero.name}
                    </h2>
                    <p className="text-sm font-semibold text-slate-300">
                      {activeHero.raceName} · {activeHero.className}
                      {activeHero.subclass ? ` (${activeHero.subclass.name})` : ''}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Jugador: <strong className="text-slate-200">{activeHero.playerName}</strong> · Miniatura: {activeHero.miniature}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-3.5 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-center">
                      <div className="text-[10px] font-bold uppercase text-amber-300">Nivel</div>
                      <div className="font-display text-xl font-black text-white leading-none mt-0.5">
                        Nv.{activeHero.level}
                      </div>
                    </div>
                    <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                      <div className="text-[10px] font-bold uppercase text-slate-400">XP</div>
                      <div className="font-bold text-sm text-sky-300 mt-0.5">
                        {activeHero.xp}{nextLevelInfo ? ` / ${nextLevelInfo.xp}` : ' (MÁX)'}
                      </div>
                    </div>
                    <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/50 border border-emerald-700/50 text-center">
                      <div className="text-[10px] font-bold uppercase text-emerald-300">Reputación</div>
                      <div className="font-black text-base text-emerald-200 mt-0.5">🏅 {totalRep}</div>
                    </div>

                    <div className="no-print flex flex-col gap-1.5">
                      {activeHero.level < 10 && (
                        <button
                          onClick={levelUpHero}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 cursor-pointer shadow"
                        >
                          <TrendingUp className="w-3.5 h-3.5" /> Subir Nivel
                        </button>
                      )}
                      <button
                        onClick={() => deleteHero(activeHero.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-800 border border-rose-700/70 text-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Barras de Vida, Mente, Combate y Oro (Interactivas para el DM) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-700/50 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-rose-300 flex items-center justify-center gap-1">
                      <Heart className="w-3.5 h-3.5" /> Cuerpo (PC)
                    </div>
                    <div className="text-2xl font-black text-white">{curPC}/{activeHero.maxPC}</div>
                    <div className="no-print flex justify-center gap-1">
                      <button
                        onClick={() => updateActiveHero((h) => ({ ...h, currentPC: Math.max(0, (h.currentPC ?? h.maxPC) - 1) }))}
                        className="px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-white text-xs font-black cursor-pointer"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateActiveHero((h) => ({ ...h, currentPC: Math.min(h.maxPC, (h.currentPC ?? h.maxPC) + 1) }))}
                        className="px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-700/50 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-cyan-300 flex items-center justify-center gap-1">
                      <Brain className="w-3.5 h-3.5" /> Mente (PM)
                    </div>
                    <div className="text-2xl font-black text-white">{curPM}/{activeHero.maxPM}</div>
                    <div className="no-print flex justify-center gap-1">
                      <button
                        onClick={() => updateActiveHero((h) => ({ ...h, currentPM: Math.max(0, (h.currentPM ?? h.maxPM) - 1) }))}
                        className="px-2 py-0.5 rounded bg-cyan-900 hover:bg-cyan-800 text-white text-xs font-black cursor-pointer"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateActiveHero((h) => ({ ...h, currentPM: Math.min(h.maxPM, (h.currentPM ?? h.maxPM) + 1) }))}
                        className="px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col justify-center">
                    <div className="text-[10px] font-bold uppercase text-amber-300 flex items-center justify-center gap-1">
                      <Swords className="w-3.5 h-3.5" /> Ataque
                    </div>
                    <div className="text-2xl font-black text-white mt-1">{activeHero.attackDice} DC</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col justify-center">
                    <div className="text-[10px] font-bold uppercase text-sky-300 flex items-center justify-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Defensa
                    </div>
                    <div className="text-2xl font-black text-white mt-1">{activeHero.defendDice} DC</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col justify-center">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Movimiento</div>
                    <div className="text-xl font-black text-slate-100 mt-1">
                      {activeHero.speed} cas
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-950/35 border border-amber-600/50 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-amber-300 flex items-center justify-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> Oro
                    </div>
                    <div className="text-xl font-black text-amber-200">{activeHero.gold} MO</div>
                    <div className="no-print flex justify-center gap-1">
                      <button
                        onClick={() => updateActiveHero((h) => ({ ...h, gold: Math.max(0, (h.gold || 0) - 25) }))}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-200 text-[10px] font-bold cursor-pointer"
                      >
                        -25
                      </button>
                      <button
                        onClick={() => updateActiveHero((h) => ({ ...h, gold: (h.gold || 0) + 25 }))}
                        className="px-1.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 text-[10px] font-black cursor-pointer"
                      >
                        +25
                      </button>
                    </div>
                  </div>
                </div>

                {/* Los 4 Pilares + Estados Activos */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-5 space-y-4">
                    {/* 4 Pilares */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-300">
                        ⚡ 4 Pilares del Héroe (Bono directo al d20)
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        {ATTRIBUTES.map((a) => (
                          <div key={a.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div>
                              <div className={`text-xs font-black ${a.color || 'text-amber-300'}`}>
                                {a.icon} {a.name}
                              </div>
                              <div className="text-[10px] text-slate-400">{a.short}</div>
                            </div>
                            <div className="text-xl font-black text-white">
                              {formatMod(heroPillars[a.id] ?? 1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Estados Activos (Completo e Ilustrado con Selector DM) */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-purple-300">
                          Estados Activos ({activeEffects.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowStatusPicker((v) => !v)}
                          className="no-print px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold cursor-pointer"
                        >
                          {showStatusPicker ? 'Ocultar Catálogo' : '+ Aplicar / Quitar Estado'}
                        </button>
                      </div>

                      {activeEffects.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          Sin estados activos en este momento.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {activeEffects.map((ef) => {
                            const meta = STATUS_CATALOG.find((s) => s.id === ef.id);
                            return (
                              <div
                                key={ef.id}
                                className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                                  meta?.color ||
                                  (ef.type === 'debuff'
                                    ? 'bg-rose-950/60 border-rose-600/70 text-rose-100'
                                    : 'bg-emerald-950/60 border-emerald-600/70 text-emerald-100')
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="font-black">{ef.label}</div>
                                  <div className="text-[11px] opacity-90">{ef.note || meta?.effect}</div>
                                  {meta?.cure && (
                                    <div className="text-[10px] opacity-75">Cura: {meta.cure}</div>
                                  )}
                                </div>
                                <button
                                  onClick={() =>
                                    updateActiveHero((h) => ({
                                      ...h,
                                      activeEffects: (h.activeEffects || []).filter((x) => x.id !== ef.id),
                                    }))
                                  }
                                  className="no-print p-1 rounded bg-black/40 hover:bg-black/70 text-white cursor-pointer shrink-0"
                                  title="Quitar estado"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {showStatusPicker && (
                        <div className="no-print pt-2 border-t border-slate-800 space-y-2">
                          <div className="text-[10px] font-bold uppercase text-rose-300">Estados Negativos</div>
                          <div className="flex flex-wrap gap-1.5">
                            {STATUS_CATALOG.filter((s) => s.type === 'debuff').map((s) => {
                              const on = activeEffectIds.has(s.id);
                              return (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => toggleStatusOnHero(s)}
                                  title={`${s.effect} · Cura: ${s.cure}`}
                                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition ${
                                    on ? `${s.color} ring-2 ring-white/50` : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-400'
                                  }`}
                                >
                                  {s.icon} {s.name}
                                </button>
                              );
                            })}
                          </div>
                          <div className="text-[10px] font-bold uppercase text-emerald-300 pt-1">Estados Positivos (Buffs)</div>
                          <div className="flex flex-wrap gap-1.5">
                            {STATUS_CATALOG.filter((s) => s.type === 'buff').map((s) => {
                              const on = activeEffectIds.has(s.id);
                              return (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => toggleStatusOnHero(s)}
                                  title={`${s.effect} · ${s.cure}`}
                                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition ${
                                    on ? `${s.color} ring-2 ring-white/50` : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-400'
                                  }`}
                                >
                                  {s.icon} {s.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha: Rasgos, Profesión e Inventario Limpio (SIN panel feo de envío de loot) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-200">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-300">
                        🛡️ Identidad, Profesión y Rasgos
                      </h4>
                      <p><strong className="text-slate-400">Recurso:</strong> {activeHero.resourceName}</p>
                      <p><strong className="text-slate-400">Habilidad de Clase:</strong> {activeHero.coreAbility}</p>
                      <p><strong className="text-slate-400">Rasgo Racial:</strong> {activeHero.raceTrait}</p>
                      {activeHero.subclass && (
                        <p><strong className="text-amber-300">Subclase ({activeHero.subclass.name}):</strong> {activeHero.subclass.desc}</p>
                      )}
                      {activeHero.professionName && (
                        <p><strong className="text-emerald-300">Profesión:</strong> {activeHero.professionName}</p>
                      )}
                      {activeHero.quirk && (
                        <p>
                          <strong className="text-purple-300">{activeHero.quirk.icon} Rasgo ({activeHero.quirk.name}):</strong>{' '}
                          <span className="text-emerald-300">+ {activeHero.quirk.bonus}</span> ·{' '}
                          <span className="text-rose-300">- {activeHero.quirk.drawback}</span>
                        </p>
                      )}
                    </div>

                    {/* Inventario del Héroe (Vista limpia de inspección DM) */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-300">
                          🎒 Equipo e Inventario ({(activeHero.inventory || []).length} objetos)
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          El botín se entrega desde Cofres, Cuerpos y Eventos del Tablero
                        </span>
                      </div>

                      {(activeHero.inventory || []).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Inventario vacío.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(activeHero.inventory || []).map((it) => {
                            const rMeta = getRarityMeta(it.rarity || 'comun');
                            return (
                              <div
                                key={it.id}
                                className={`p-2.5 rounded-xl bg-slate-900/90 border ${rMeta.border} text-xs flex items-start justify-between gap-2`}
                              >
                                <div className="min-w-0 space-y-0.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${rMeta.badge}`}>
                                      {rMeta.name}
                                    </span>
                                    {it.equipped && (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-600/30 border border-emerald-500/50 text-emerald-200 text-[9px] font-black">
                                        EQUIPADO
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-bold text-white truncate">
                                    {it.name} {it.dice ? `(${it.dice})` : ''}
                                  </div>
                                  {(it.special || it.traits) && (
                                    <div className="text-[11px] text-slate-400 leading-snug">
                                      {it.special || it.traits}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeItemFromHero(it.id)}
                                  className="no-print text-rose-400 hover:text-rose-200 p-1 cursor-pointer shrink-0"
                                  title="Quitar objeto"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Referencia rápida de Hechizos si es lanzador */}
                    {['mago', 'explorador', 'bardo', 'brujo', 'druida', 'clerigo', 'exorcista', 'chaman', 'nigromante', 'mago_batalla'].includes(activeHero.classId) && (
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-purple-300">
                          🔮 Grimorio de {activeHero.className}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {SPELLS_CATALOG.filter((sp) =>
                            activeHero.classId === 'bardo' || activeHero.classId === 'exorcista' || activeHero.classId === 'chaman'
                              ? sp.school === 'Espíritu'
                              : activeHero.classId === 'brujo' || activeHero.classId === 'nigromante'
                              ? sp.school === 'Sombras'
                              : ['Fuego', 'Agua', 'Tierra', 'Aire'].includes(sp.school)
                          )
                            .slice(0, 6)
                            .map((sp) => (
                              <div key={sp.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                                <div className="font-bold text-purple-200">
                                  [{sp.school}] {sp.name}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{sp.desc}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
