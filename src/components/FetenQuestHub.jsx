import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Skull,
  Sparkles,
  Dices,
  Plus,
  Minus,
  RotateCcw,
  X,
  Shield,
  ScrollText,
  Layers,
  Trash2,
  Search,
  HeartPulse,
  Crown,
  Users,
} from 'lucide-react';
import {
  FQ_HEROES,
  FQ_DARK_SPELLS,
  FQ_DUNGEON_ENCHANTMENTS,
  FQ_WINDS_OF_MAGIC,
  FQ_WINDS_OF_CHAOS,
  FQ_FURNITURE_TABLE,
  FQ_POTIONS_TABLE,
  FQ_CHAOS_SPELLS_D20,
  FQ_BATTLE_SCARS,
  FQ_TREASURE_DECK,
  FQ_EVENTS_DECK,
  FQ_SCREEN_MONSTERS,
} from '../data/fetenquestData';
import {
  FQ_RULES_GUIDE,
  FQ_WEAPON_PROPERTIES_GLOSSARY,
  FQ_ARMORY_CATALOG,
  FQ_SPELL_SCHOOLS,
  FQ_SCROLLS_DETAILED,
  FQ_RANK_PROGRESSION,
  FQ_HERO_RANKS,
  FQ_DECKS_GUIDE,
  FQ_CITY_EVENTS,
  FQ_HERO_SHOWCASE_META,
} from '../data/fetenquestExtendedData';

const MB_STORAGE_KEY = 'hq_fetenquest_mb_v41';

function shuffle(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function getUsageBadgeClass(usageType) {
  switch (usageType) {
    case 'passive':
      return 'bg-emerald-950/90 border-emerald-600/60 text-emerald-200';
    case 'unlimited':
      return 'bg-sky-950/90 border-sky-600/60 text-sky-200';
    case 'per_turn':
      return 'bg-cyan-950/90 border-cyan-600/60 text-cyan-200';
    case 'per_quest_recharge':
      return 'bg-amber-950/90 border-amber-500/60 text-amber-200';
    case 'per_quest':
      return 'bg-rose-950/90 border-rose-500/60 text-rose-200';
    case 'resource':
      return 'bg-purple-950/90 border-purple-500/60 text-purple-200';
    default:
      return 'bg-indigo-950/90 border-indigo-500/60 text-indigo-200';
  }
}

export default function FetenQuestHub({ showToast = null }) {
  // 6 Pestañas principales ultra-organizadas (empieza en Galería de los 25 Héroes)
  const [subTab, setSubTab] = useState('heroes'); // 'heroes' | 'rules' | 'abilities_spells' | 'city' | 'mb_screen' | 'decks'

  // ==================== ESTADO: GALERÍA DE PRESENTACIÓN DE LOS 25 HÉROES ====================
  const [heroFilter, setHeroFilter] = useState('Todos'); // 'Todos' | 'Clásico' | 'Extra'
  const [activeHeroId, setActiveHeroId] = useState(FQ_HEROES[0].id);
  const activeHero = FQ_HEROES.find((h) => h.id === activeHeroId) || FQ_HEROES[0];

  // ==================== ESTADO: HABILIDADES, HECHIZOS Y PERGAMINOS ====================
  const [catalogTab, setCatalogTab] = useState('abilities'); // 'abilities' | 'spells' | 'scrolls'
  const [catalogSearch, setCatalogSearch] = useState('');

  // ==================== ESTADO: LA CIUDAD ====================
  const [cityTab, setCityTab] = useState('events'); // 'events' | 'armory' | 'alchemy' | 'ranks' | 'temple'
  const [rankHeroId, setRankHeroId] = useState(FQ_HEROES[0].id);
  const [useHasbroHalfPrice, setUseHasbroHalfPrice] = useState(false);
  const [armoryCat, setArmoryCat] = useState('Todas');
  const [cityEventRoll, setCityEventRoll] = useState(null);
  const [templeNegPC, setTempleNegPC] = useState(0);
  const [templeRollRes, setTempleRollRes] = useState(null);

  const fmtPrice = (p) => (useHasbroHalfPrice ? Math.ceil(p / 2) : p);

  // ==================== ESTADO: GRIMORIO & PANTALLA DEL MB SUPREMO ====================
  const loadMB = () => {
    try {
      const raw = localStorage.getItem(MB_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const savedMB = loadMB();
  const [heroCount, setHeroCount] = useState(savedMB?.heroCount || 4);
  const [mbHand, setMbHand] = useState(savedMB?.mbHand || []);
  const [enchantCounters, setEnchantCounters] = useState(savedMB?.enchantCounters || 0);
  const [activeEnchantments, setActiveEnchantments] = useState(savedMB?.activeEnchantments || []);
  const [darkUpgradesNote, setDarkUpgradesNote] = useState(savedMB?.darkUpgradesNote || '');
  const [completedQuestsCount, setCompletedQuestsCount] = useState(savedMB?.completedQuestsCount || 0);
  const [screenTab, setScreenTab] = useState('winds');
  const [windsRoll, setWindsRoll] = useState(null);
  const [chaosWindsRoll, setChaosWindsRoll] = useState(null);
  const [furnitureRollResult, setFurnitureRollResult] = useState(null);
  const [tableRollPopup, setTableRollPopup] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        MB_STORAGE_KEY,
        JSON.stringify({
          heroCount,
          mbHand,
          enchantCounters,
          activeEnchantments,
          darkUpgradesNote,
          completedQuestsCount,
        })
      );
    } catch {
      // ignore
    }
  }, [heroCount, mbHand, enchantCounters, activeEnchantments, darkUpgradesNote, completedQuestsCount]);

  const maxHandSize = heroCount + 1;
  const enchantmentCost = Math.max(2, 10 - heroCount);
  const negCardsInHand = mbHand.filter((c) => c.isNegative).length;

  const addCardToMBHand = (isNegative, label) => {
    setMbHand((prev) => {
      const next = [...prev, { id: `mbc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, isNegative, label }];
      if (next.length > maxHandSize) {
        showToast?.(`⚠️ Mano del MB llena (máx. ${maxHandSize}). Descarta el exceso al mazo.`);
      }
      return next;
    });
  };

  const castDarkSpell = (spell) => {
    const totalNeeded = spell.costAny + spell.costNeg;
    if (mbHand.length < totalNeeded || negCardsInHand < spell.costNeg) {
      showToast?.(`❌ Necesitas ${spell.costLabel} en tu mano del MB para lanzar ${spell.name}.`);
      return;
    }
    let remNeg = spell.costNeg;
    let remAny = spell.costAny;
    const afterNeg = [];
    for (const c of mbHand) {
      if (c.isNegative && remNeg > 0) remNeg -= 1;
      else afterNeg.push(c);
    }
    const afterPos = [];
    for (const c of afterNeg) {
      if (!c.isNegative && remAny > 0) remAny -= 1;
      else afterPos.push(c);
    }
    const finalHand = [];
    for (const c of afterPos) {
      if (remAny > 0) remAny -= 1;
      else finalHand.push(c);
    }
    setMbHand(finalHand);
    if (spell.addsCounter) setEnchantCounters((v) => v + 1);
    setTableRollPopup({
      title: `💀 Hechizo Oscuro: ${spell.name}`,
      badge: `Coste pagado: ${spell.costLabel}`,
      text: spell.effect,
    });
  };

  const rollDungeonEnchantment = () => {
    const r = Math.floor(Math.random() * 20) + 1;
    const picked = FQ_DUNGEON_ENCHANTMENTS[r - 1] || FQ_DUNGEON_ENCHANTMENTS[0];
    setEnchantCounters((v) => Math.max(0, v - enchantmentCost));
    setActiveEnchantments((prev) => [{ ...picked, uid: Date.now() }, ...prev]);
    setTableRollPopup({
      title: `🌀 Encantamiento de Mazmorra (${r}/20): ${picked.name}`,
      badge: 'Activo durante todo el reto',
      text: picked.text,
    });
  };

  // ==================== ESTADO: MAZOS FETENQUEST ====================
  const [fqTreasureDeck, setFqTreasureDeck] = useState(() => shuffle(FQ_TREASURE_DECK));
  const [fqEventsDeck, setFqEventsDeck] = useState(() => shuffle(FQ_EVENTS_DECK));
  const [fqDiscardedCount, setFqDiscardedCount] = useState(0);
  const [deckModal, setDeckModal] = useState(null);

  const drawFQTreasure = (forMB = false) => {
    let deck = fqTreasureDeck;
    if (deck.length === 0) {
      deck = shuffle(FQ_TREASURE_DECK);
      setFqDiscardedCount(0);
    }
    const [drawn, ...rest] = deck;
    if (forMB) {
      setFqTreasureDeck(rest);
      addCardToMBHand(drawn.kind === 'negative', drawn.title);
      showToast?.(`🧙 MB robó: ${drawn.title}`);
      return;
    }
    if (drawn.kind === 'negative') {
      setFqTreasureDeck(shuffle([...rest, drawn]));
      setDeckModal({
        kind: 'negative',
        header: 'Mazo de Tesoros FetenQuest',
        badge: 'Carta Negativa 💀 (Vuelve al mazo y se baraja)',
        icon: drawn.icon,
        title: drawn.title,
        text: drawn.text,
      });
    } else if (drawn.kind === 'event') {
      setFqTreasureDeck(rest);
      setFqDiscardedCount((c) => c + 1);
      drawFQEvent(true);
    } else {
      setFqTreasureDeck(rest);
      setFqDiscardedCount((c) => c + 1);
      setDeckModal({
        kind: 'positive',
        header: 'Mazo de Tesoros FetenQuest',
        badge: 'Carta Positiva (Se descarta hasta el próximo reto)',
        icon: drawn.icon,
        title: drawn.title,
        text: drawn.text,
      });
    }
  };

  const drawFQEvent = (fromTreasure = false) => {
    let deck = fqEventsDeck;
    if (deck.length === 0) deck = shuffle(FQ_EVENTS_DECK);
    const [ev, ...rest] = deck;
    setFqEventsDeck(rest);
    setDeckModal({
      kind: ev.type === 'Guarida' ? 'lair' : 'event',
      header: fromTreasure ? '¡Carta ❓ Evento disparada desde Tesoros!' : 'Mazo de Sucesos y Guaridas (FetenQuest)',
      badge: ev.type === 'Guarida' ? '⚔️ Evento (Guarida Opcional · Máx. 1 por reto)' : '✨ Suceso de Mazmorra',
      icon: ev.icon,
      title: ev.title,
      text: ev.text,
    });
  };

  const filteredHeroes = FQ_HEROES.filter((h) => heroFilter === 'Todos' || h.category === heroFilter);
  const qLow = catalogSearch.trim().toLowerCase();

  return (
    <div className="space-y-5">
      {/* ==================== CABECERA Y NAVEGACIÓN PRINCIPAL EN 6 PESTAÑAS CLARAS ==================== */}
      <div className="no-print grimoire-panel rounded-2xl p-4 border-amber-500/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-black text-amber-200 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-amber-400" /> FetenQuest 4.1 Legacy — Centro Completo del DM
            </h2>
            <p className="text-xs text-slate-400">
              Presentación completa de los 25 Héroes (Clásicos y Extra), Reglas paso a paso, Habilidades/Hechizos/Pergaminos, La Ciudad (con Templo y Salones), Pantalla DM y Mazos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {[
            { id: 'heroes', label: '🛡️ Héroes (25)', sub: '4 Clásicos + 21 Extra' },
            { id: 'rules', label: '📖 Reglas y Orden', sub: 'Qué y cuándo usar' },
            { id: 'abilities_spells', label: '⚔️ Hab. y Magia', sub: 'Catálogo y Pergaminos' },
            { id: 'city', label: '🏛️ La Ciudad', sub: 'Armería, Rangos, Templo' },
            { id: 'mb_screen', label: '💀 Pantalla DM', sub: 'Grimorio MB y Tablas' },
            { id: 'decks', label: '🃏 Mazos FQ', sub: 'Tesoros y Sucesos' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`px-3 py-2 rounded-xl text-left cursor-pointer transition border ${
                subTab === t.id
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                  : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-amber-500/50'
              }`}
            >
              <div className="text-xs font-black leading-tight">{t.label}</div>
              <div className={`text-[10px] truncate mt-0.5 ${subTab === t.id ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                {t.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== TAB 1: REGLAS ORDENADAS (QUÉ USAR, CUÁNDO Y CÓMO CREAR HOJAS) ==================== */}
      {subTab === 'rules' && (
        <div className="no-print space-y-4">
          {/* Guía Rápida: Cómo presentar y llevar el control de cada Aventurero en mesa */}
          <div className="grimoire-panel rounded-2xl p-5 border-emerald-500/40 space-y-3">
            <h3 className="font-display text-base font-black text-emerald-300 flex items-center gap-2">
              <Crown className="w-5 h-5" /> Cómo Presentar y Escalar a los Aventureros en Mesa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-200">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-black text-amber-300">1. Presenta los 25 Héroes</div>
                <p>Abre <strong>🛡️ Héroes (25)</strong> y muéstrale a cada amigo su clase: ahí viene de qué va, sus dados, PC, PM, arma inicial, habilidades y ramas de hechizos.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-black text-amber-300">2. Anota en su Ficha Física</div>
                <p>Cada jugador apunta en su hoja física (o libreta) sus 4 stats, su arma inicial y sus habilidades/hechizos con casillas de uso (☐☐☐).</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-black text-amber-300">3. Equipo en La Ciudad</div>
                <p>Al terminar una misión, abren <strong>🏛️ La Ciudad</strong> para tirar Evento 1D100 y comprar nuevas armas, armaduras o pociones.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-black text-amber-300">4. Sube de Rango (c/7 Retos)</div>
                <p>Cada <strong>7 retos completados</strong> pagan 500 MO (300 MO con mazo Hasbro) y revisas la tabla exacta de Rangos 1–10 de su héroe.</p>
              </div>
            </div>
          </div>

          {/* Las 7 Fases Completas de Reglas de FetenQuest 4.1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {FQ_RULES_GUIDE.map((sec) => (
              <div key={sec.id} className="grimoire-panel rounded-2xl p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="font-display text-sm font-black text-amber-200">
                      {sec.icon} {sec.step}
                    </h4>
                    <div className="text-[11px] text-sky-300 font-semibold">⏱️ Cuándo: {sec.when}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/50 text-emerald-300 text-[10px] font-bold shrink-0">
                    {sec.recommended}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200 leading-relaxed">
                  {sec.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-black">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 1: GALERÍA DE PRESENTACIÓN DE LOS 25 HÉROES (CLÁSICOS + EXTRA) ==================== */}
      {subTab === 'heroes' && (() => {
        const meta = FQ_HERO_SHOWCASE_META[activeHero.id] || { summary: '', schoolIds: [] };
        const heroSchools = (meta.schoolIds || [])
          .map((sid) => FQ_SPELL_SCHOOLS.find((s) => s.id === sid))
          .filter(Boolean);
        const heroRanks = FQ_HERO_RANKS[activeHero.id] || [];

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* COLUMNA IZQUIERDA: LISTA DE LOS 25 HÉROES (CLÁSICOS Y EXTRA) */}
            <div className="lg:col-span-4 grimoire-panel rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-sm font-black text-amber-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" /> Elige un Héroe ({filteredHeroes.length})
                </span>
                <div className="flex gap-1 text-[11px]">
                  {['Todos', 'Clásico', 'Extra'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setHeroFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                        heroFilter === cat
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
                {filteredHeroes.map((h) => {
                  const isSel = h.id === activeHero.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setActiveHeroId(h.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                        isSel
                          ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/10 border-amber-400 text-amber-100 shadow'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{h.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{h.role}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                            h.category === 'Clásico'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {h.category}
                        </span>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                          AT{h.at} DF{h.def} PC{h.pc} PM{h.pm}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLUMNA DERECHA: FICHA DE PRESENTACIÓN COMPLETA DEL HÉROE */}
            <div className="lg:col-span-8 space-y-4">
              {/* Encabezado + De qué va + Estadísticas + Equipo Inicial */}
              <div className="grimoire-panel rounded-2xl p-5 border-amber-500/50 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          activeHero.category === 'Clásico'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-purple-600 text-white'
                        }`}
                      >
                        Héroe {activeHero.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 text-[10px] font-bold">
                        {activeHero.role}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                        Tamaño: {activeHero.size}
                      </span>
                      {activeHero.magicSaber && (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/60 text-indigo-200 text-[10px] font-bold">
                          ✨ {activeHero.magicSaber}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-2xl font-black text-amber-100 mt-2">
                      {activeHero.name}
                    </h3>
                  </div>
                </div>

                {/* Resumen "De qué va este personaje" para leerle al jugador */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border-l-4 border-amber-400 text-sm text-amber-50 leading-relaxed">
                  {meta.summary}
                </div>

                {/* 4 Estadísticas Iniciales + Movimiento */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-red-950/45 border border-red-800/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Ataque</div>
                    <div className="text-xl font-black text-red-300">{activeHero.at} DC</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/45 border border-amber-800/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Defensa</div>
                    <div className="text-xl font-black text-amber-200">{activeHero.def} DC</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/45 border border-emerald-700/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Cuerpo (PC)</div>
                    <div className="text-xl font-black text-emerald-300">{activeHero.pc}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sky-950/45 border border-sky-700/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Mente (PM)</div>
                    <div className="text-xl font-black text-sky-300">{activeHero.pm}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Movimiento</div>
                    <div className="text-base font-black text-white mt-0.5">2D6 (8)</div>
                  </div>
                </div>

                {/* Equipo Inicial Detallado (con Propiedades del Arma) y Restricciones */}
                {(() => {
                  const gearLow = (activeHero.startingGear || '').toLowerCase();
                  const matchedGear = FQ_ARMORY_CATALOG.filter((it) => {
                    const baseName = it.name.split('/')[0].trim().toLowerCase();
                    return gearLow.includes(baseName);
                  });
                  return (
                    <div className="space-y-2.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-800/50 space-y-1.5">
                          <div className="text-[10px] font-black uppercase text-emerald-400">
                            ⚔️ Equipo Inicial (Qué lleva al empezar)
                          </div>
                          <div className="font-bold text-white">{activeHero.startingGear}</div>
                          {matchedGear.length > 0 && (
                            <div className="pt-1.5 border-t border-slate-800 space-y-1.5">
                              {matchedGear.map((mg) => (
                                <div key={mg.id} className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-1">
                                    <span className="font-bold text-amber-300">{mg.name}</span>
                                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px] font-bold">
                                      {mg.dc} · {mg.hands}
                                    </span>
                                    {(mg.tags || []).map((tg) => (
                                      <span
                                        key={tg}
                                        className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/50 text-amber-200 text-[10px] font-bold"
                                      >
                                        {tg}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-snug">{mg.traits}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-800/40 space-y-1">
                          <div className="text-[10px] font-black uppercase text-rose-400">
                            🚫 Restricciones de Equipo y Tamaño
                          </div>
                          <div className="text-slate-200 leading-relaxed">{activeHero.restrictions}</div>
                          {activeHero.size === 'Pequeño' && (
                            <div className="text-[11px] text-amber-300 pt-1">
                              ⚠️ Tamaño Pequeño: no puede usar Mandoble.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Habilidades Especiales del Héroe */}
              <div className="grimoire-panel rounded-2xl p-5 space-y-3">
                <h4 className="font-display text-sm font-black text-emerald-300 uppercase tracking-wider">
                  ⚡ Habilidades Especiales de {activeHero.name.split('/')[0].trim()} ({activeHero.abilities.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  {activeHero.abilities.map((ab, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-emerald-800/40 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="font-black text-emerald-200">• {ab.name}</div>
                        {ab.usage && (
                          <span
                            className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getUsageBadgeClass(
                              ab.usageType
                            )}`}
                          >
                            {ab.usage}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-200 leading-relaxed">{ab.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rama y Escuelas de Hechizos de Este Héroe (si usa magia) */}
              {(heroSchools.length > 0 || activeHero.startingSpells.length > 0) && (
                <div className="grimoire-panel rounded-2xl p-5 border-purple-500/40 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-display text-sm font-black text-purple-300 uppercase tracking-wider">
                      ✨ Ramas y Hechizos de {activeHero.name.split('/')[0].trim()}
                    </h4>
                    <span className="text-[11px] text-purple-200 font-bold">
                      {activeHero.magicSaber || 'Magia Especial'}
                    </span>
                  </div>
                  {activeHero.startingSpells.length > 0 && (
                    <div className="p-3 rounded-xl bg-purple-950/35 border border-purple-700/50 text-xs space-y-1">
                      <div className="text-[10px] font-black uppercase text-amber-300">Cómo empieza:</div>
                      {activeHero.startingSpells.map((sp, i) => (
                        <div key={i} className="text-purple-100">
                          <strong>[Nv.{sp.level}] {sp.name}:</strong> {sp.note}
                        </div>
                      ))}
                    </div>
                  )}
                  {heroSchools.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                      {heroSchools.map((sc) => (
                        <div key={sc.id} className="p-3 rounded-xl bg-slate-950/85 border border-purple-800/50 space-y-2">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
                            <strong className="text-purple-200">{sc.name}</strong>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-amber-300 font-bold">
                              Nv.{sc.level} · {sc.saber}
                            </span>
                          </div>
                          {sc.usesLabel && (
                            <div className="px-2 py-1 rounded-lg bg-amber-950/40 border border-amber-600/40 text-[10px] text-amber-200 font-bold">
                              📊 {sc.usesLabel}
                            </div>
                          )}
                          <div className="space-y-1.5">
                            {sc.spells.map((sp) => (
                              <div key={sp.name} className="text-[11px] leading-snug">
                                <strong className="text-sky-300">{sp.name}:</strong>{' '}
                                {sp.usage && (
                                  <span className="inline-block mr-1 px-1.5 py-0.2 rounded bg-purple-950 border border-purple-500/50 text-[9px] text-purple-200 font-bold">
                                    {sp.usage}
                                  </span>
                                )}
                                <span className="text-slate-300">{sp.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Progresión Completa de Rangos (1 al 10) de Este Héroe */}
              <div className="grimoire-panel rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-sm font-black text-amber-300 uppercase tracking-wider">
                    🏰 Evolución por Rangos (1 al 10) — Cada 7 Retos
                  </h4>
                  <span className="text-[11px] text-slate-400">500 MO (300 MO con mazo Hasbro)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {FQ_RANK_PROGRESSION.map((r, idx) => (
                    <div key={r.rank} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-200">
                          Rango {r.rank}: {r.title}
                        </strong>
                        <span className="text-[10px] text-sky-300 font-bold">{r.questsReq} retos</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{heroRanks[idx]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==================== TAB 3: HABILIDADES DE LOS 25 HÉROES + 16 ESCUELAS + 20 PERGAMINOS ==================== */}
      {subTab === 'abilities_spells' && (
        <div className="no-print space-y-4">
          <div className="grimoire-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'abilities', label: '⚔️ Habilidades de los 25 Héroes' },
                { id: 'spells', label: '✨ 16 Escuelas de Hechizos' },
                { id: 'scrolls', label: '📜 20 Pergaminos Mágicos' },
              ].map((ct) => (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => setCatalogTab(ct.id)}
                  className={`px-3.5 py-2 rounded-xl font-black cursor-pointer ${
                    catalogTab === ct.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
            <div className="relative min-w-[220px] flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Buscar héroe, habilidad o hechizo..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* 3A. HABILIDADES DE TODOS LOS 25 HÉROES (CON RECOMENDACIONES) */}
          {catalogTab === 'abilities' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-sky-950/35 border border-sky-500/40 text-xs text-sky-100 leading-relaxed">
                <strong>💡 Cómo repartir y usar las Habilidades:</strong> Cada héroe comienza automáticamente con TODAS las habilidades de su grupo (incluidas las marcadas como <em>Opcional</em> si tu mesa quiere que Bárbaro/Enano/Mago tengan el mismo brillo que los héroes extra). Las habilidades de <em>1 uso/reto</em> se recargan al completar la misión o con las condiciones indicadas (ej. 2 Escudos Blancos/Negros).
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FQ_HEROES.filter(
                  (h) =>
                    !qLow ||
                    h.name.toLowerCase().includes(qLow) ||
                    h.abilities.some((a) => a.name.toLowerCase().includes(qLow) || a.text.toLowerCase().includes(qLow))
                ).map((h) => (
                  <div key={h.id} className="grimoire-panel rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div>
                        <strong className="font-display text-sm text-amber-200">{h.name}</strong>
                        <div className="text-[10px] text-slate-400">
                          {h.role} · AT {h.at} · DF {h.def} · PC {h.pc} · PM {h.pm}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300">
                        {h.category}
                      </span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg bg-rose-950/35 border border-rose-800/40 text-[11px] text-rose-100">
                      <strong className="text-rose-300">🚫 Restricciones:</strong> {h.restrictions}
                    </div>
                    <div className="space-y-1.5">
                      {h.abilities.map((ab, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <div className="font-bold text-emerald-300">{ab.name}</div>
                            {ab.usage && (
                              <span
                                className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getUsageBadgeClass(
                                  ab.usageType
                                )}`}
                              >
                                {ab.usage}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 leading-snug">{ab.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3B. LAS 16 ESCUELAS DE HECHIZOS */}
          {catalogTab === 'spells' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-purple-950/35 border border-purple-500/40 text-xs text-purple-100 leading-relaxed">
                <strong>✨ Regla de Reparto y Fases de Uso:</strong> Los hechizos <strong>Nivel 1</strong> se pueden usar hasta 3 veces (1 gratis + 2 repeticiones pagando 1 PM c/u); los de <strong>Nivel 2</strong> hasta 2 veces (1 gratis + 1 repetición pagando 1 PM); los de <strong>Nivel 3</strong> 1 sola vez. Siempre se tira <strong>2D6 en Vientos de la Magia</strong> según el Saber (Arcano, Divino o Rúnico).
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FQ_SPELL_SCHOOLS.filter(
                  (sc) =>
                    !qLow ||
                    sc.name.toLowerCase().includes(qLow) ||
                    sc.who.toLowerCase().includes(qLow) ||
                    sc.spells.some((sp) => sp.name.toLowerCase().includes(qLow) || sp.text.toLowerCase().includes(qLow))
                ).map((sc) => (
                  <div key={sc.id} className="grimoire-panel rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                      <div>
                        <strong className="font-display text-sm text-purple-200">{sc.name}</strong>
                        <div className="text-[10px] text-amber-300">Para: {sc.who}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-600/60 text-purple-200 text-[10px] font-black shrink-0">
                        Nv.{sc.level} · {sc.saber}
                      </span>
                    </div>
                    {sc.usesLabel && (
                      <div className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-600/40 text-[10px] text-amber-200 font-bold">
                        📊 {sc.usesLabel}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      {sc.spells.map((sp) => (
                        <div key={sp.name} className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 space-y-0.5">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <strong className="text-sky-300">{sp.name}</strong>
                            {sp.usage && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/50 text-[9px] text-purple-200 font-bold">
                                {sp.usage}
                              </span>
                            )}
                          </div>
                          <div className="text-slate-200 leading-snug">{sp.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3C. LOS 20 PERGAMINOS MÁGICOS DETALLADOS */}
          {catalogTab === 'scrolls' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-950/35 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-100">
                <div>
                  <strong>📜 Regla de Pergaminos:</strong> Cualquier héroe puede leer un pergamino tirando 2D6 en Vientos de la Magia (Saber Arcano). Si NO es lanzador de hechizos, resta <strong>−1 por cada pieza de armadura metálica</strong> equipada (Yelmo, Cota de Malla, Placas). Con Crítico (12) el pergamino NO se consume.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const p = FQ_SCROLLS_DETAILED[Math.floor(Math.random() * FQ_SCROLLS_DETAILED.length)];
                    setTableRollPopup({
                      title: `📜 Pergamino (1D20 = ${p.d20}): ${p.name}`,
                      badge: `Origen: ${p.origin}`,
                      text: p.text,
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shrink-0"
                >
                  🎲 Tirar Pergamino (1D20)
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                {FQ_SCROLLS_DETAILED.filter(
                  (p) => !qLow || p.name.toLowerCase().includes(qLow) || p.text.toLowerCase().includes(qLow)
                ).map((p) => (
                  <div key={p.d20} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-amber-200">
                        [{p.d20}] {p.name}
                      </strong>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-500/50 text-rose-200 font-bold">
                          1 solo uso (salvo 12)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-sky-300 font-bold">
                          {p.origin}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-snug">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: LA CIUDAD (EVENTOS 1D100, ARMERÍA, ALQUIMISTA, SALONES Y EL TEMPLO) ==================== */}
      {subTab === 'city' && (
        <div className="no-print space-y-4">
          <div className="grimoire-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'events', label: '🎲 Eventos Ciudad (1D100)' },
                { id: 'armory', label: '⚔️ Armería' },
                { id: 'alchemy', label: '🧪 Alquimista' },
                { id: 'ranks', label: '🏰 Salones Imperiales (Rangos)' },
                { id: 'temple', label: '⛪ El Templo' },
              ].map((ct) => (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => setCityTab(ct.id)}
                  className={`px-3 py-2 rounded-xl font-black cursor-pointer ${
                    cityTab === ct.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setUseHasbroHalfPrice((v) => !v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
                useHasbroHalfPrice
                  ? 'bg-emerald-700 border-emerald-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-amber-200'
              }`}
              title="Regla Pág. 10: Si juegas con el Mazo de Tesoros Oficial de Hasbro, divide los precios entre 2"
            >
              {useHasbroHalfPrice ? '✓ Precios ÷2 (Mazo Hasbro)' : 'Precios Estándar (Mazo FetenQuest)'}
            </button>
          </div>

          {/* 4A. EVENTOS DE CIUDAD 1D100 */}
          {cityTab === 'events' && (
            <div className="grimoire-panel rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <strong className="text-amber-200 text-sm">🏛️ Entrada a la Ciudad ({fmtPrice(10)} MO por héroe)</strong>
                  <p className="text-slate-400 mt-0.5">
                    Al entrar recuperan todos los PC, PM, hechizos y curan enfermedades. Antes de comprar, cada héroe tira 1D100 aquí (61–100 = Jornada tranquila).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const r = Math.floor(Math.random() * 100) + 1;
                    const ev = FQ_CITY_EVENTS.find((e) => r >= e.min && r <= e.max) || FQ_CITY_EVENTS[FQ_CITY_EVENTS.length - 1];
                    setCityEventRoll({ r, ev });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Dices className="w-4 h-4" /> Tirar Evento de Ciudad (1D100)
                </button>
              </div>
              {cityEventRoll && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-400 space-y-1">
                  <div className="text-amber-300 font-black text-sm">
                    🎲 Resultado 1D100 = {cityEventRoll.r} · {cityEventRoll.ev.title}
                  </div>
                  <p className="text-sm text-amber-50 leading-relaxed">{cityEventRoll.ev.text}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
                {FQ_CITY_EVENTS.map((ev) => (
                  <div key={ev.title} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <strong className="text-amber-300">{ev.title}:</strong>{' '}
                    <span className="text-slate-300">{ev.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4B. ARMERÍA COMPLETA (CON DICCIONARIO DE PROPIEDADES, ETIQUETAS Y QUIÉN PUEDE USAR CADA ARMA) */}
          {cityTab === 'armory' && (
            <div className="space-y-4 text-xs">
              {/* Diccionario de Propiedades de Armas y Armaduras */}
              <div className="grimoire-panel rounded-2xl p-4 border-amber-500/40 space-y-2.5">
                <div className="font-display text-sm font-black text-amber-300">
                  📖 Propiedades Especiales de Armas y Armaduras (Qué significa cada etiqueta)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {FQ_WEAPON_PROPERTIES_GLOSSARY.map((prop) => (
                    <div key={prop.tag} className={`p-2.5 rounded-xl border ${prop.color} space-y-1`}>
                      <div className="font-black text-xs">{prop.tag}</div>
                      <p className="text-[11px] leading-snug opacity-95">{prop.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grimoire-panel rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {['Todas', 'Arma', 'Distancia', 'Armadura', 'Apoyo'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setArmoryCat(c)}
                        className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                          armoryCat === c ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <span className="text-slate-400">Venta de equipo usado: 50% del precio marcado.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {FQ_ARMORY_CATALOG.filter((it) => armoryCat === 'Todas' || it.cat === armoryCat).map((it) => (
                    <div key={it.id} className="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <strong className="text-amber-200 text-sm leading-tight">{it.name}</strong>
                          <span className="font-black text-amber-400 shrink-0">{fmtPrice(it.price)} MO</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-black text-[10px]">
                            {it.dc}
                          </span>
                          {it.hands && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[10px]">
                              {it.hands}
                            </span>
                          )}
                          {(it.tags || []).map((tg) => (
                            <span
                              key={tg}
                              className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/50 text-amber-200 text-[10px] font-bold"
                            >
                              {tg}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-200 leading-snug">{it.traits}</p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800/80 text-[10.5px] text-rose-300/95">
                        <strong>Quién puede usarla:</strong> <span className="text-slate-300">{it.restrictions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4C. TIENDA DEL ALQUIMISTA */}
          {cityTab === 'alchemy' && (
            <div className="grimoire-panel rounded-2xl p-5 space-y-3 text-xs">
              <p className="text-slate-300">
                Las <strong>12 Pócimas Comunes</strong> se compran libremente aquí. Las <strong>8 Infrecuentes</strong> no se venden en tienda (solo se consiguen en mazmorra o eventos).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {FQ_POTIONS_TABLE.map((p) => (
                  <div key={p.d20} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2">
                    <div>
                      <strong className={p.tier === 'Infrecuente' ? 'text-indigo-300' : 'text-emerald-300'}>
                        {p.name}
                      </strong>{' '}
                      <span className="text-[10px] text-slate-400">({p.tier})</span>
                      <div className="text-[11px] text-slate-300 mt-0.5">{p.effect}</div>
                    </div>
                    <span className="font-black text-amber-400 shrink-0">{fmtPrice(p.price)} MO</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4D. SALONES IMPERIALES (RANGOS 1–10 EXACTOS PARA CADA UNO DE LOS 25 HÉROES) */}
          {cityTab === 'ranks' && (() => {
            const selHero = FQ_HEROES.find((h) => h.id === rankHeroId) || FQ_HEROES[0];
            const heroBenefits = FQ_HERO_RANKS[selHero.id] || [];
            return (
              <div className="grimoire-panel rounded-2xl p-5 space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-amber-950/35 border border-amber-500/40 text-amber-100">
                  <strong>🏰 Salones Imperiales:</strong> Cada <strong>7 retos completados</strong>, el héroe puede pagar{' '}
                  <strong>{useHasbroHalfPrice ? '300 MO' : '500 MO'}</strong> para subir 1 Rango (máx. 1 rango por visita). Cada héroe tiene su propia progresión exacta — elige un héroe abajo:
                </div>

                {/* Selector de los 25 Héroes */}
                <div className="flex flex-wrap gap-1.5">
                  {FQ_HEROES.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setRankHeroId(h.id)}
                      className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer transition border ${
                        h.id === selHero.id
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/50'
                      }`}
                    >
                      {h.name.split('/')[0].trim()}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <strong className="font-display text-base text-amber-200">
                      Tabla de Rangos de {selHero.name}
                    </strong>
                    <div className="text-[11px] text-slate-400">
                      Inicio: AT {selHero.at} DC · DEF {selHero.def} DC · PC {selHero.pc} · PM {selHero.pm} · {selHero.role}
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-bold">
                    Todos los beneficios de rango son acumulativos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {FQ_RANK_PROGRESSION.map((r, idx) => (
                    <div key={r.rank} className="p-3 rounded-xl bg-slate-950/85 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-200 text-sm">
                          Rango {r.rank}: {r.title}
                        </strong>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-sky-300 font-bold">
                          {r.questsReq} retos
                        </span>
                      </div>
                      <p className="text-slate-200 leading-snug">
                        {heroBenefits[idx] || 'Beneficio de rango.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 4E. EL TEMPLO (RESURRECCIÓN Y CICATRICES DE BATALLA) */}
          {cityTab === 'temple' && (
            <div className="grimoire-panel rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <strong className="text-rose-300 text-sm flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4" /> El Templo — Resurrección ({fmtPrice(500)} MO)
                  </strong>
                  <p className="text-slate-300 mt-0.5">
                    Si sus compañeros trajeron el cuerpo del héroe caído, paga {fmtPrice(500)} MO y tira <strong>2D6 menos los PC negativos</strong> con los que murió en la tabla de Cicatrices de Batalla.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700">
                    <span className="text-slate-400">PC negativos:</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={templeNegPC}
                      onChange={(e) => setTempleNegPC(Math.max(0, Number(e.target.value)))}
                      className="w-12 bg-transparent text-rose-300 font-black text-center"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const raw = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
                      const total = raw - templeNegPC;
                      const found =
                        total <= 1
                          ? FQ_BATTLE_SCARS[0]
                          : total === 6 || total === 8
                          ? FQ_BATTLE_SCARS.find((s) => s.roll === '6 u 8')
                          : FQ_BATTLE_SCARS.find((s) => s.roll === String(total)) || FQ_BATTLE_SCARS[FQ_BATTLE_SCARS.length - 1];
                      setTempleRollRes({ raw, total, found });
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black cursor-pointer"
                  >
                    🎲 Tirar Resurrección
                  </button>
                </div>
              </div>
              {templeRollRes && (
                <div className="p-4 rounded-2xl bg-rose-950/50 border-2 border-rose-400 space-y-1">
                  <div className="font-black text-amber-200 text-sm">
                    2D6 ({templeRollRes.raw}) − {templeNegPC} = {templeRollRes.total} → {templeRollRes.found.name}
                  </div>
                  <p className="text-sm text-rose-50">{templeRollRes.found.text}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {FQ_BATTLE_SCARS.map((sc) => (
                  <div key={sc.roll} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <strong className="text-amber-300">[{sc.roll}] {sc.name}:</strong>{' '}
                    <span className="text-slate-300">{sc.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 5: GRIMORIO & PANTALLA DEL MALVADO BRUJO SUPREMO ==================== */}
      {subTab === 'mb_screen' && (
        <div className="no-print space-y-5">
          {/* GRIMORIO INTERACTIVO (FichaMB.pdf) */}
          <div className="grimoire-panel rounded-2xl p-5 border-purple-500/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-display text-base font-black text-purple-200 flex items-center gap-2">
                  <Skull className="w-5 h-5 text-rose-400" /> Grimorio del Malvado Brujo Supremo
                </h3>
                <p className="text-xs text-slate-400">
                  1) Sin monstruos → roba carta (máx. {maxHandSize}) · 2) Activa monstruos · 3) Gasta cartas en Hechizos Oscuros y Acumular Poder.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700">
                  <span className="text-slate-400">Héroes:</span>
                  <select
                    value={heroCount}
                    onChange={(e) => setHeroCount(Number(e.target.value))}
                    className="bg-transparent text-amber-300 font-black cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n} className="bg-slate-900">{n}</option>
                    ))}
                  </select>
                </label>
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-700/60 text-purple-200 font-bold">
                  Mano: {mbHand.length}/{maxHandSize} · Encantamiento: {enchantCounters}/{enchantmentCost}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-amber-200">
                    ✋ Mano del MB ({mbHand.length}/{maxHandSize}) · Negativas 💀: {negCardsInHand}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" onClick={() => drawFQTreasure(true)} className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-black text-[11px] cursor-pointer">
                      🎲 Robar Mazo FQ
                    </button>
                    <button type="button" onClick={() => addCardToMBHand(false, 'Carta Normal')} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[11px] cursor-pointer">
                      + Normal
                    </button>
                    <button type="button" onClick={() => addCardToMBHand(true, 'Carta Negativa 💀')} className="px-2.5 py-1 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-100 font-bold text-[11px] cursor-pointer">
                      + Negativa 💀
                    </button>
                  </div>
                </div>
                {mbHand.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Mano vacía. Roba 1 carta en cada turno de Zargon sin monstruos en el tablero.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {mbHand.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setMbHand((prev) => prev.filter((x) => x.id !== c.id))}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 cursor-pointer ${
                          c.isNegative ? 'bg-rose-950/80 border-rose-500/70 text-rose-200' : 'bg-slate-900 border-slate-700 text-slate-200'
                        }`}
                      >
                        <span>{c.label}</span>
                        <span className="opacity-60">✕</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl bg-purple-950/30 border border-purple-700/50 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-purple-200">🌀 Encantamientos de Mazmorra</span>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => setEnchantCounters((v) => Math.max(0, v - 1))} className="p-1 rounded bg-slate-900 border border-slate-700 cursor-pointer"><Minus className="w-3 h-3" /></button>
                    <span className="font-mono font-black text-sm text-amber-300">{enchantCounters}/{enchantmentCost}</span>
                    <button type="button" onClick={() => setEnchantCounters((v) => v + 1)} className="p-1 rounded bg-slate-900 border border-slate-700 cursor-pointer"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={rollDungeonEnchantment}
                  className={`w-full py-2 rounded-xl font-black text-xs cursor-pointer ${
                    enchantCounters >= enchantmentCost ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-pulse' : 'bg-purple-800/80 hover:bg-purple-700 text-white'
                  }`}
                >
                  🎲 Activar Encantamiento (1D20)
                </button>
                {activeEnchantments.length > 0 && (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {activeEnchantments.map((en) => (
                      <div key={en.uid} className="p-2 rounded-lg bg-slate-950/80 border border-purple-600/40 text-[11px] flex items-start justify-between gap-2">
                        <div><strong className="text-amber-300">{en.name}:</strong> <span className="text-slate-300">{en.text}</span></div>
                        <button type="button" onClick={() => setActiveEnchantments((prev) => prev.filter((x) => x.uid !== en.uid))} className="text-slate-400 hover:text-rose-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {FQ_DARK_SPELLS.map((sp) => {
                const canAfford = mbHand.length >= sp.costAny + sp.costNeg && negCardsInHand >= sp.costNeg;
                return (
                  <div key={sp.id} className={`p-3 rounded-xl border text-xs space-y-1.5 flex flex-col justify-between ${canAfford ? 'bg-slate-900/90 border-purple-500/60' : 'bg-slate-950/70 border-slate-800 opacity-75'}`}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-amber-200">{sp.name}</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-700/60 text-rose-200 font-bold">{sp.costLabel}</span>
                      </div>
                      <div className="text-[10px] text-purple-300 font-semibold">⏱️ {sp.timing}</div>
                      <p className="text-[11px] text-slate-300 leading-snug">{sp.effect}</p>
                    </div>
                    <button type="button" onClick={() => castDarkSpell(sp)} className={`w-full py-1.5 rounded-lg font-black text-[11px] cursor-pointer mt-1 ${canAfford ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      ⚡ Lanzar {sp.name}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-200">Retos Completados</div>
                  <div className="text-[10px] text-slate-400">Cada 7 retos = Mejoras Oscuras</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setCompletedQuestsCount((v) => Math.max(0, v - 1))} className="px-2 py-1 rounded bg-slate-800 cursor-pointer">-</button>
                  <span className="font-mono font-black text-base text-white">{completedQuestsCount}</span>
                  <button type="button" onClick={() => setCompletedQuestsCount((v) => v + 1)} className="px-2 py-1 rounded bg-slate-800 cursor-pointer">+</button>
                </div>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={darkUpgradesNote}
                  onChange={(e) => setDarkUpgradesNote(e.target.value)}
                  placeholder="Anota tus Mejoras Oscuras activas..."
                  className="w-full h-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* PANTALLA RÁPIDA DEL DM (Pantalla_MB.pdf) */}
          <div className="grimoire-panel rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-display text-base font-black text-amber-200 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" /> Pantalla del Malvado Brujo (Consultas Rápidas)
              </h3>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'winds', label: '✨ Vientos Magia / Caos' },
                  { id: 'furniture', label: '🪑 Revisar Mueble (1D6)' },
                  { id: 'chaos', label: '💀 Hechizos del Caos (1D20)' },
                  { id: 'monsters', label: '👹 Bestiario Pantalla' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setScreenTab(st.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      screenTab === st.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {screenTab === 'winds' && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setWindsRoll(Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2)} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black cursor-pointer flex items-center gap-1.5">
                    <Dices className="w-4 h-4" /> Tirar Vientos Magia (2D6)
                  </button>
                  <button type="button" onClick={() => setChaosWindsRoll(Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2)} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black cursor-pointer flex items-center gap-1.5">
                    <Dices className="w-4 h-4" /> Tirar Vientos Caos (2D6)
                  </button>
                  {windsRoll !== null && <span className="px-3 py-1.5 rounded-lg bg-sky-950 border border-sky-400 text-sky-200 font-black">Magia: {windsRoll}</span>}
                  {chaosWindsRoll !== null && <span className="px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-400 text-rose-200 font-black">Caos: {chaosWindsRoll}</span>}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-800 text-left">
                    <thead className="bg-slate-900 text-amber-300">
                      <tr>
                        <th className="p-2 border-b border-slate-800">2D6</th>
                        <th className="p-2 border-b border-slate-800">Saber Arcano</th>
                        <th className="p-2 border-b border-slate-800">Saber Divino</th>
                        <th className="p-2 border-b border-slate-800">Saber Rúnico</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FQ_WINDS_OF_MAGIC.map((row) => {
                        const hl = windsRoll !== null && windsRoll >= row.min && windsRoll <= row.max;
                        return (
                          <tr key={row.roll} className={hl ? 'bg-sky-900/50 text-white font-bold' : 'border-b border-slate-800/70 text-slate-300'}>
                            <td className="p-2 font-black text-amber-300 whitespace-nowrap">{row.roll}</td>
                            <td className="p-2">{row.arcano}</td>
                            <td className="p-2">{row.divino}</td>
                            <td className="p-2">{row.runico}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {FQ_WINDS_OF_CHAOS.map((c) => {
                    const hl = chaosWindsRoll !== null && String(chaosWindsRoll) === c.roll;
                    return (
                      <div key={c.roll} className={`p-2.5 rounded-xl border ${hl ? 'bg-rose-900/60 border-rose-400 text-white' : 'bg-slate-950/70 border-slate-800 text-slate-300'}`}>
                        <strong className="text-rose-300">[{c.roll}]</strong> {c.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {screenTab === 'furniture' && (
              <div className="space-y-3 text-xs">
                {furnitureRollResult && (
                  <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-400 text-amber-100 font-bold flex items-center justify-between">
                    <span>{furnitureRollResult}</span>
                    <button onClick={() => setFurnitureRollResult(null)} className="text-xs px-2 py-0.5 rounded bg-slate-900 cursor-pointer">✕</button>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {FQ_FURNITURE_TABLE.map((f) => (
                    <div key={f.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <strong className="text-amber-200">{f.name}</strong>
                          <span className="text-[10px] text-slate-400">{f.height}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">{f.rule}</p>
                      </div>
                      {f.rollable && (
                        <button
                          type="button"
                          onClick={() => {
                            const r = Math.floor(Math.random() * 6) + 1;
                            setFurnitureRollResult(`🪑 ${f.name} (1D6 = ${r}): ${f.rollMap(r)}`);
                          }}
                          className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
                        >
                          🎲 Tirar 1D6 ({f.name})
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {screenTab === 'chaos' && (
              <div className="space-y-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const r = Math.floor(Math.random() * 20) + 1;
                    const found = FQ_CHAOS_SPELLS_D20.find((x) => {
                      const [a, b] = x.range.split('–').map(Number);
                      return b ? r >= a && r <= b : r === a;
                    });
                    setTableRollPopup({
                      title: `💀 Hechizo del Caos (${r}/20): ${found?.name}`,
                      badge: found?.level || 'Caos',
                      text: 'Hechizo del Caos determinado al azar para monstruo lanzador o Hechicero del Caos.',
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-black cursor-pointer"
                >
                  🎲 Tirar Hechizo del Caos al Azar (1D20)
                </button>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {FQ_CHAOS_SPELLS_D20.map((cs) => (
                    <div key={cs.range} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-amber-300">{cs.range}:</strong> {cs.name}{' '}
                      <span className="text-[10px] text-rose-300">({cs.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {screenTab === 'monsters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs max-h-96 overflow-y-auto pr-1">
                {FQ_SCREEN_MONSTERS.map((m) => (
                  <div key={m.name} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-200">{m.name}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">{m.group}</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-200">
                      MV <strong>{m.mv}</strong> · AT <strong className="text-red-300">{m.at}</strong> · DF{' '}
                      <strong className="text-amber-300">{m.df}</strong> · PC{' '}
                      <strong className="text-emerald-300">{m.pc}</strong> · PM{' '}
                      <strong className="text-sky-300">{m.pm}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 leading-snug">{m.special}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: MAZOS FETENQUEST (TESOROS + SUCESOS Y GUARIDAS) ==================== */}
      {subTab === 'decks' && (
        <div className="no-print space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grimoire-panel rounded-2xl p-5 border-emerald-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-black text-emerald-300 flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Mazo de Tesoros FetenQuest
                </h3>
                <span className="text-xs font-bold text-slate-300">Quedan {fqTreasureDeck.length} · Desc. {fqDiscardedCount}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cartas Positivas (25–125 MO, Pociones, Pergaminos), Negativas 💀 (vuelven al mazo) y <strong>5 cartas ❓ Evento</strong> que disparan automáticamente el Mazo de Sucesos y Guaridas.
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => drawFQTreasure(false)} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow">
                  💎 Robar Carta de Tesoro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFqTreasureDeck(shuffle(FQ_TREASURE_DECK));
                    setFqDiscardedCount(0);
                    showToast?.('🔄 Mazo de Tesoros FetenQuest barajado.');
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Barajar
                </button>
              </div>
            </div>

            <div className="grimoire-panel rounded-2xl p-5 border-purple-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-black text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Mazo de Sucesos y Guaridas
                </h3>
                <span className="text-xs font-bold text-slate-300">Quedan {fqEventsDeck.length}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sucesos narrativos y <strong>Guaridas opcionales</strong> (máx. 1 por reto, con puerta secreta hacia una sala vacía y recompensa de jefe).
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => drawFQEvent(false)} className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow">
                  ❓ Robar Suceso / Guarida
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFqEventsDeck(shuffle(FQ_EVENTS_DECK));
                    showToast?.('🔄 Mazo de Sucesos barajado.');
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Barajar
                </button>
              </div>
            </div>
          </div>

          {/* GUÍA CLARA: TESOROS OFICIALES vs FETENQUEST + CUÁNDO Y CÓMO USAR CADA MAZO */}
          <div className="grimoire-panel rounded-2xl p-5 border-amber-500/45 space-y-4">
            <div className="border-b border-slate-800 pb-2.5">
              <h3 className="font-display text-base font-black text-amber-200 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" /> Guía de Mazos: Tesoros Oficiales vs FetenQuest (Cuándo y Cómo usar cada uno)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Reglas claras para saber exactamente qué mazo elegir, en qué momento robar y qué NO mezclar para mantener el juego equilibrado.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
              {FQ_DECKS_GUIDE.map((g) => (
                <div key={g.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-display font-black text-sm text-amber-200">
                    {g.icon} {g.title}
                  </div>
                  <div className="text-[11px] text-sky-300 font-semibold">
                    ⏱️ Cuándo: {g.when}
                  </div>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line">{g.how}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL GRANDE PARA CARTAS Y TIRADAS ==================== */}
      {(deckModal || tableRollPopup) && (
        <div
          className="no-print fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => {
            setDeckModal(null);
            setTableRollPopup(null);
          }}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-purple-950/95 via-slate-950 to-slate-950 border-2 border-amber-400/80 p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                {deckModal?.header && (
                  <div className="text-xs font-black uppercase tracking-widest text-amber-300">
                    {deckModal.icon} {deckModal.header}
                  </div>
                )}
                <h3 className="font-display text-2xl font-black text-white">
                  {deckModal ? deckModal.title : tableRollPopup.title}
                </h3>
                <div className="text-xs font-bold text-purple-200">
                  {deckModal ? deckModal.badge : tableRollPopup.badge}
                </div>
              </div>
              <button
                onClick={() => {
                  setDeckModal(null);
                  setTableRollPopup(null);
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <p className="text-base sm:text-lg text-slate-100 leading-relaxed">
                {deckModal ? deckModal.text : tableRollPopup.text}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              {deckModal && (
                <button
                  type="button"
                  onClick={() => (deckModal.kind === 'event' || deckModal.kind === 'lair' ? drawFQEvent(false) : drawFQTreasure(false))}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  🎲 Sacar Otra Carta
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setDeckModal(null);
                  setTableRollPopup(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-black text-sm cursor-pointer"
              >
                ✓ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
