import React, { useState, useEffect } from 'react';
import {
  Printer,
  BookOpen,
  Skull,
  Sparkles,
  CheckSquare,
  Square,
  Dices,
  Plus,
  Minus,
  RotateCcw,
  X,
  Shield,
  ScrollText,
  Layers,
  Trash2,
  Building2,
  Swords,
  Search,
  Edit3,
  HeartPulse,
  Crown,
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
  FQ_ARMORY_CATALOG,
  FQ_SPELL_SCHOOLS,
  FQ_SCROLLS_DETAILED,
  FQ_RANK_PROGRESSION,
  FQ_CITY_EVENTS,
} from '../data/fetenquestExtendedData';

const MB_STORAGE_KEY = 'hq_fetenquest_mb_v41';
const SHEETS_STORAGE_KEY = 'hq_fetenquest_custom_sheets_v41';

function shuffle(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function createDefaultSheet(hero) {
  return {
    heroId: hero.id,
    customName: '',
    playerName: '',
    rank: 1,
    completedQuests: 0,
    gold: 0,
    at: hero.at,
    def: hero.def,
    pc: hero.pc,
    pm: hero.pm,
    rightHand: hero.startingGear,
    leftHand: hero.id === 'fq_caballero' ? 'Escudo (+1 Def)' : '',
    head: hero.id === 'fq_guerrero_caos' ? 'Yelmo (+1 Def)' : '',
    armor: '',
    accessories: '',
    storedWeapons: '',
    storedThrown: '',
    storedPotions: '',
    storedScrolls: '',
    storedSupport: hero.id === 'fq_ladron' || hero.id === 'fq_picaro' ? 'Bandolera (Herramientas + Daga)' : '',
    abilities: hero.abilities.map((a) => ({ ...a })),
    spells: hero.startingSpells.map((s) => ({ ...s })),
    notes: '',
  };
}

// ==================== HOJA DE PERSONAJE MODERNA A4 (IMPRIMIBLE Y ESCALABLE) ====================
function ModernPrintableHeroSheet({ hero, sheet }) {
  const rankMeta = FQ_RANK_PROGRESSION.find((r) => r.rank === Number(sheet.rank)) || FQ_RANK_PROGRESSION[0];
  const maxTrack = Math.max(10, Number(sheet.pc || hero.pc) + 2, Number(sheet.pm || hero.pm) + 2);

  return (
    <div className="fq-print-sheet bg-white text-slate-950 border-2 border-slate-900 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl print:shadow-none print:rounded-none">
      {/* Cabecera Moderna de Alto Contraste */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-900 pb-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl border-2 border-slate-900 bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 print:bg-white print:text-black">
            <span className="text-[9px] font-bold uppercase tracking-wider leading-none">Rango</span>
            <span className="text-xl font-black leading-none mt-0.5">{sheet.rank}</span>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              FETENQUEST 4.1 · HOJA DE AVENTURERO
            </div>
            <div className="font-display text-2xl font-black tracking-tight leading-tight text-slate-950">
              {sheet.customName || hero.name}
            </div>
            <div className="text-xs font-semibold text-slate-600">
              {hero.name} · {hero.role} · Tamaño {hero.size} · {rankMeta.title}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-xs min-w-[260px] bg-slate-50 border border-slate-300 rounded-xl p-2.5">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Jugador</span>
            <span className="font-bold">{sheet.playerName || '__________________'}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Retos Completados</span>
            <span className="font-black text-sm">{sheet.completedQuests} <span className="font-normal text-[10px] text-slate-500">(+Rango c/7)</span></span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Monedas de Oro</span>
            <span className="font-black text-sm">{sheet.gold > 0 ? `${sheet.gold} MO` : '________ MO'}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Movimiento Base</span>
            <span className="font-bold">2D6 (8 sin enemigos)</span>
          </div>
        </div>
      </div>

      {/* Cuerpo en 2 Columnas Modernas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* COLUMNA IZQUIERDA: STATS + TRACKERS + EQUIPO + MOCHILA */}
        <div className="space-y-3.5">
          {/* 4 Tarjetas de Estadísticas Principales */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Ataque', val: `${sheet.at} DC` },
              { label: 'Defensa', val: `${sheet.def} DC` },
              { label: 'Cuerpo (PC)', val: sheet.pc },
              { label: 'Mente (PM)', val: sheet.pm },
            ].map((st) => (
              <div key={st.label} className="rounded-xl border-2 border-slate-900 p-2 bg-slate-50">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-600">{st.label}</div>
                <div className="text-xl font-black text-slate-950 mt-0.5">{st.val}</div>
              </div>
            ))}
          </div>

          {/* Casillas para marcar Cuerpo y Mente con lápiz */}
          <div className="rounded-xl border-2 border-slate-900 overflow-hidden text-[11px]">
            <div className="flex items-center border-b border-slate-900">
              <div className="w-16 px-2 py-1.5 font-black bg-slate-900 text-white text-[10px] uppercase shrink-0 print:bg-slate-200 print:text-black">
                Cuerpo
              </div>
              <div className="flex-1 grid grid-cols-10 divide-x divide-slate-300 text-center">
                {Array.from({ length: Math.min(10, maxTrack) }, (_, i) => (
                  <div
                    key={i}
                    className={`py-1.5 font-bold ${
                      i + 1 === Number(sheet.pc) ? 'bg-slate-200 font-black underline' : ''
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-16 px-2 py-1.5 font-black bg-slate-700 text-white text-[10px] uppercase shrink-0 print:bg-slate-200 print:text-black">
                Mente
              </div>
              <div className="flex-1 grid grid-cols-10 divide-x divide-slate-300 text-center">
                {Array.from({ length: Math.min(10, maxTrack) }, (_, i) => (
                  <div
                    key={i}
                    className={`py-1.5 font-bold ${
                      i + 1 === Number(sheet.pm) ? 'bg-slate-200 font-black underline' : ''
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipo Equipado (Editable y Actualizable) */}
          <div className="rounded-xl border-2 border-slate-900 p-3 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider border-b border-slate-300 pb-1">
              Equipo Equipado (En Uso)
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg border border-slate-400 p-2 min-h-[42px]">
                <div className="text-[9px] font-bold uppercase text-slate-500">Mano Derecha (Arma)</div>
                <div className="font-bold text-slate-950">{sheet.rightHand || '__________________'}</div>
              </div>
              <div className="rounded-lg border border-slate-400 p-2 min-h-[42px]">
                <div className="text-[9px] font-bold uppercase text-slate-500">Mano Izquierda / Escudo</div>
                <div className="font-bold text-slate-950">{sheet.leftHand || '__________________'}</div>
              </div>
              <div className="rounded-lg border border-slate-400 p-2 min-h-[38px]">
                <div className="text-[9px] font-bold uppercase text-slate-500">Cabeza (Yelmo)</div>
                <div className="font-bold text-slate-950">{sheet.head || '__________________'}</div>
              </div>
              <div className="rounded-lg border border-slate-400 p-2 min-h-[38px]">
                <div className="text-[9px] font-bold uppercase text-slate-500">Armadura (Torso)</div>
                <div className="font-bold text-slate-950">{sheet.armor || '__________________'}</div>
              </div>
              <div className="rounded-lg border border-slate-400 p-2 col-span-2 min-h-[34px]">
                <div className="text-[9px] font-bold uppercase text-slate-500">Accesorios (Anillos / Amuletos / Capas)</div>
                <div className="font-bold text-slate-950">{sheet.accessories || '__________________________________________'}</div>
              </div>
            </div>
            <div className="text-[10px] bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-slate-700">
              <strong>Restricciones de Clase:</strong> {hero.restrictions}
            </div>
          </div>

          {/* Inventario / Objetos Guardados con Límites Oficiales */}
          <div className="rounded-xl border-2 border-slate-900 p-3 space-y-1.5 text-[10.5px]">
            <div className="text-[11px] font-black uppercase tracking-wider border-b border-slate-300 pb-1">
              Mochila / Objetos Guardados (Límites FetenQuest)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="border border-slate-300 rounded-lg p-1.5 min-h-[42px]">
                <strong className="text-[9.5px] uppercase text-slate-600 block">Armas / Escudos (Máx. 2)</strong>
                <div>{sheet.storedWeapons || '1. ____________  2. ____________'}</div>
              </div>
              <div className="border border-slate-300 rounded-lg p-1.5 min-h-[42px]">
                <strong className="text-[9.5px] uppercase text-slate-600 block">Arrojadizas (Máx. 3)</strong>
                <div>{sheet.storedThrown || '1. _______ 2. _______ 3. _______'}</div>
              </div>
              <div className="border border-slate-300 rounded-lg p-1.5 min-h-[44px]">
                <strong className="text-[9.5px] uppercase text-slate-600 block">Pociones (Máx. 3)</strong>
                <div>{sheet.storedPotions || '1. ____________  2. ____________'}</div>
              </div>
              <div className="border border-slate-300 rounded-lg p-1.5 min-h-[44px]">
                <strong className="text-[9.5px] uppercase text-slate-600 block">Pergaminos (Máx. 3)</strong>
                <div>{sheet.storedScrolls || '1. ____________  2. ____________'}</div>
              </div>
              <div className="border border-slate-300 rounded-lg p-1.5 sm:col-span-2 min-h-[36px]">
                <strong className="text-[9.5px] uppercase text-slate-600 block">Equipo de Apoyo (Herramientas, Bandolera, Cuerda — Máx. 3)</strong>
                <div>{sheet.storedSupport || '1. ___________________  2. ___________________  3. ___________________'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: HABILIDADES + HECHIZOS + ESCALADO DE RANGO + NOTAS */}
        <div className="space-y-3.5">
          {/* Habilidades */}
          <div className="rounded-xl border-2 border-slate-900 p-3 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider border-b border-slate-300 pb-1">
              Habilidades Especiales ({sheet.abilities.length})
            </div>
            <div className="space-y-2 text-[11px]">
              {sheet.abilities.map((ab, idx) => (
                <div key={idx} className="border-b border-slate-200 last:border-b-0 pb-1.5 last:pb-0">
                  <div className="font-black text-slate-950">• {ab.name}</div>
                  <div className="text-slate-700 leading-snug">{ab.text}</div>
                </div>
              ))}
            </div>
            <div className="pt-1 border-t border-dashed border-slate-400 text-[10px] text-slate-500">
              Espacio para nuevas habilidades de Rango / Cicatrices de Batalla:
              <div className="mt-1">_____________________________________________________________</div>
              <div>_____________________________________________________________</div>
            </div>
          </div>

          {/* Hechizos y Fases de Uso */}
          <div className="rounded-xl border-2 border-slate-900 p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-300 pb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">Hechizos y Fases de Uso</span>
              <span className="text-[10px] font-bold text-slate-600">
                {hero.magicSaber || 'Sin magia inicial'}
              </span>
            </div>
            {sheet.spells.length > 0 ? (
              <div className="space-y-1.5 text-[11px]">
                {sheet.spells.map((sp, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 border-b border-slate-200 last:border-b-0 pb-1">
                    <div>
                      <strong className="text-slate-950">[Nv.{sp.level}] {sp.name}:</strong>{' '}
                      <span className="text-slate-700">{sp.note}</span>
                    </div>
                    <span className="font-mono text-xs shrink-0 font-bold">
                      {sp.level === 1 ? '☐ ☐ ☐' : sp.level === 2 ? '☐ ☐' : '☐'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[10.5px] text-slate-600 italic">
                Sin hechizos propios. Puede lanzar Pergaminos tirando 2D6 en Vientos de la Magia (−1 por cada armadura metálica).
              </div>
            )}
            <div className="text-[9.5px] bg-slate-100 rounded-lg px-2 py-1 text-slate-600">
              <strong>Repeticiones:</strong> Nv.1 repite 2 veces (-1 PM) · Nv.2 repite 1 vez (-1 PM) · Nv.3 no se repite.
            </div>
          </div>

          {/* Notas de Progresión / Rango / Diario */}
          <div className="rounded-xl border-2 border-slate-900 p-3 space-y-1.5 text-[10.5px]">
            <div className="text-[11px] font-black uppercase tracking-wider border-b border-slate-300 pb-1">
              Notas de Campaña y Escalado (Rango {sheet.rank}: {rankMeta.title})
            </div>
            <div className="text-[10px] text-slate-700">
              <strong>Beneficio del Rango actual:</strong> {rankMeta.benefit}
            </div>
            {sheet.notes ? (
              <div className="text-slate-900 whitespace-pre-line border-t border-slate-200 pt-1">{sheet.notes}</div>
            ) : (
              <div className="text-slate-400 space-y-1 pt-1">
                <div>_____________________________________________________________</div>
                <div>_____________________________________________________________</div>
              </div>
            )}
          </div>

          {/* Chuleta Rápida de Turno FetenQuest */}
          <div className="rounded-xl border border-slate-400 bg-slate-100 p-2 text-[9.5px] text-slate-800 leading-snug">
            <strong>Turno:</strong> 1 Mov (2D6 u 8 sin enemigos) + 1 Acción Normal + Acciones Gratuitas (beber poción, abrir puerta +1 mov, revisar mueble 1D6, saltar foso 1DC). · <strong>Shock (0 PM):</strong> mueve 1D6, ataca 1DC, defiende 2DC, Vientos 1D6.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FetenQuestHub({ showToast = null }) {
  // 6 Pestañas principales ultra-organizadas
  const [subTab, setSubTab] = useState('rules'); // 'rules' | 'sheets' | 'abilities_spells' | 'city' | 'mb_screen' | 'decks'

  // ==================== ESTADO: EDITOR DE HOJAS A4 (25 HÉROES) ====================
  const loadSavedSheets = () => {
    try {
      const raw = localStorage.getItem(SHEETS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const [customSheets, setCustomSheets] = useState(loadSavedSheets);
  const [heroFilter, setHeroFilter] = useState('Todos');
  const [activeHeroId, setActiveHeroId] = useState(FQ_HEROES[0].id);
  const [selectedForPrint, setSelectedForPrint] = useState(() => new Set(['fq_barbaro', 'fq_enano', 'fq_elfo', 'fq_mago']));
  const [printMode, setPrintMode] = useState('single'); // 'single' | 'batch'
  const [editorOpen, setEditorOpen] = useState(true);
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityText, setNewAbilityText] = useState('');
  const [newSpellLevel, setNewSpellLevel] = useState(1);
  const [newSpellName, setNewSpellName] = useState('');
  const [newSpellNote, setNewSpellNote] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(SHEETS_STORAGE_KEY, JSON.stringify(customSheets));
    } catch {
      // ignore
    }
  }, [customSheets]);

  const activeHero = FQ_HEROES.find((h) => h.id === activeHeroId) || FQ_HEROES[0];
  const getSheetForHero = (hero) => customSheets[hero.id] || createDefaultSheet(hero);
  const activeSheet = getSheetForHero(activeHero);

  const updateActiveSheet = (patch) => {
    setCustomSheets((prev) => ({
      ...prev,
      [activeHero.id]: { ...getSheetForHero(activeHero), ...patch },
    }));
  };

  const resetActiveSheet = () => {
    setCustomSheets((prev) => {
      const next = { ...prev };
      delete next[activeHero.id];
      return next;
    });
    showToast?.(`↺ Hoja de ${activeHero.name} restaurada a Rango 1 inicial.`);
  };

  const triggerPrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => window.print(), 120);
  };

  // ==================== ESTADO: HABILIDADES, HECHIZOS Y PERGAMINOS ====================
  const [catalogTab, setCatalogTab] = useState('abilities'); // 'abilities' | 'spells' | 'scrolls'
  const [catalogSearch, setCatalogSearch] = useState('');

  // ==================== ESTADO: LA CIUDAD ====================
  const [cityTab, setCityTab] = useState('events'); // 'events' | 'armory' | 'alchemy' | 'ranks' | 'temple'
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
              Reglas ordenadas paso a paso, Editor de Hojas A4 escalables, Habilidades/Hechizos/Pergaminos, La Ciudad (con Templo y Salones), Pantalla DM y Mazos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {[
            { id: 'rules', label: '📖 Reglas y Orden', sub: 'Qué y cuándo usar' },
            { id: 'sheets', label: '🖨️ Hojas A4 (25)', sub: 'Editables y escalables' },
            { id: 'abilities_spells', label: '⚔️ Hab. y Magia', sub: 'Habilidades y Pergaminos' },
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
          {/* Guía Rápida: Cómo crear y escalar la Hoja de cada Aventurero */}
          <div className="grimoire-panel rounded-2xl p-5 border-emerald-500/40 space-y-3">
            <h3 className="font-display text-base font-black text-emerald-300 flex items-center gap-2">
              <Crown className="w-5 h-5" /> Cómo Crear y Escalar la Hoja de Cada Aventurero (Paso a Paso)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-200">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-black text-amber-300">1. Elige el Héroe</div>
                <p>Ve a <strong>Hojas A4 (25)</strong> y selecciona uno de los 4 clásicos o 21 extra. La hoja carga automáticamente sus dados, PC, PM, arma inicial y habilidades.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-black text-amber-300">2. Personaliza e Imprime</div>
                <p>Escribe el nombre del jugador y personaje, imprime la hoja A4 y dásela a tu aventurero con un lápiz para marcar PC, PM, oro y fases de uso de hechizos (☐☐☐).</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-black text-amber-300">3. Al Cambiar Arma o Equipo</div>
                <p>Cuando compren en <strong>La Ciudad</strong>, puedes apuntarlo a lápiz O abrir el <strong>Editor de la Hoja A4</strong> aquí, elegir la nueva arma/armadura del catálogo y reimprimir la hoja actualizada.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-black text-amber-300">4. Al Escalar de Rango</div>
                <p>Cada <strong>7 retos completados</strong> acuden a los <strong>Salones Imperiales</strong> (500 MO / 300 MO con mazo Hasbro): sube su Rango en el Editor, suma el +PC/+PM y añade su nueva habilidad o escuela de hechizos.</p>
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

      {/* ==================== TAB 2: EDITOR INTERACTIVO DE HOJAS A4 MODERNAS (25 HÉROES) ==================== */}
      {subTab === 'sheets' && (
        <div className="space-y-4">
          {/* Selector de los 25 Héroes + Botones de Impresión (no-print) */}
          <div className="no-print grimoire-panel rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {['Todos', 'Clásico', 'Extra'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setHeroFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      heroFilter === cat ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {cat} ({cat === 'Todos' ? FQ_HEROES.length : FQ_HEROES.filter((h) => h.category === cat).length})
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setEditorOpen((v) => !v)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border ${
                    editorOpen ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-900 border-slate-700 text-sky-300'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> {editorOpen ? 'Ocultar Editor' : 'Editar Equipo / Escalado'}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerPrint('single')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" /> Imprimir Esta Hoja (A4)
                </button>
                <button
                  type="button"
                  onClick={() => triggerPrint('batch')}
                  disabled={selectedForPrint.size === 0}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" /> Imprimir Paquete ({selectedForPrint.size})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredHeroes.map((h) => {
                const isViewing = h.id === activeHeroId;
                const isChecked = selectedForPrint.has(h.id);
                const sh = getSheetForHero(h);
                return (
                  <div
                    key={h.id}
                    className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-1.5 transition ${
                      isViewing
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveHeroId(h.id)}
                      className="text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="font-bold truncate">{h.name.split('/')[0].trim()}</div>
                      <div className="text-[10px] text-slate-400">
                        Rg.{sh.rank} · AT {sh.at} · DF {sh.def} · PC {sh.pc}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedForPrint((prev) => {
                          const next = new Set(prev);
                          if (next.has(h.id)) next.delete(h.id);
                          else next.add(h.id);
                          return next;
                        })
                      }
                      className="text-amber-300 cursor-pointer shrink-0"
                    >
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-500" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EDITOR INTERACTIVO DE EQUIPO, ESCALADO, INVENTARIO, HABILIDADES Y HECHIZOS (no-print) */}
          {editorOpen && (
            <div className="no-print grimoire-panel rounded-2xl p-4 border-sky-500/40 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="font-display font-black text-sky-300 text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Editor en Vivo de la Hoja: {activeHero.name}
                </div>
                <button
                  type="button"
                  onClick={resetActiveSheet}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restaurar a Rango 1
                </button>
              </div>

              {/* Fila 1: Identidad, Rango y Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                <label className="col-span-2 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">Nombre del Héroe</span>
                  <input
                    type="text"
                    value={activeSheet.customName}
                    onChange={(e) => updateActiveSheet({ customName: e.target.value })}
                    placeholder={activeHero.name}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </label>
                <label className="col-span-2 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">Jugador</span>
                  <input
                    type="text"
                    value={activeSheet.playerName}
                    onChange={(e) => updateActiveSheet({ playerName: e.target.value })}
                    placeholder="Nombre del jugador"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-amber-300 font-bold">Rango (1–10)</span>
                  <select
                    value={activeSheet.rank}
                    onChange={(e) => updateActiveSheet({ rank: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-amber-600/70 text-amber-200 font-bold"
                  >
                    {FQ_RANK_PROGRESSION.map((r) => (
                      <option key={r.rank} value={r.rank}>
                        Rg.{r.rank} {r.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">Retos</span>
                  <input
                    type="number"
                    min={0}
                    value={activeSheet.completedQuests}
                    onChange={(e) => updateActiveSheet({ completedQuests: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-amber-300 font-bold">Oro (MO)</span>
                  <input
                    type="number"
                    min={0}
                    value={activeSheet.gold}
                    onChange={(e) => updateActiveSheet({ gold: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-200 font-bold"
                  />
                </label>
                <div className="grid grid-cols-4 gap-1 col-span-2 sm:col-span-4 lg:col-span-1">
                  {[
                    ['AT', 'at'],
                    ['DF', 'def'],
                    ['PC', 'pc'],
                    ['PM', 'pm'],
                  ].map(([lbl, key]) => (
                    <label key={key} className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold block text-center">{lbl}</span>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={activeSheet[key]}
                        onChange={(e) => updateActiveSheet({ [key]: Number(e.target.value) })}
                        className="w-full px-1 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-center font-black"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Fila 2: Cambiar Arma / Armadura en 1 clic desde la Armería FetenQuest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
                <label className="space-y-1">
                  <span className="text-[10px] text-amber-300 font-bold">Mano Derecha (Cambiar Arma)</span>
                  <input
                    type="text"
                    list="fq-weapons-list"
                    value={activeSheet.rightHand}
                    onChange={(e) => updateActiveSheet({ rightHand: e.target.value })}
                    placeholder="Escribe o elige arma..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <datalist id="fq-weapons-list">
                    {FQ_ARMORY_CATALOG.filter((x) => x.cat === 'Arma' || x.cat === 'Distancia').map((w) => (
                      <option key={w.id} value={`${w.name} (${w.dc})`} />
                    ))}
                  </datalist>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">Mano Izquierda / Escudo</span>
                  <input
                    type="text"
                    list="fq-shields-list"
                    value={activeSheet.leftHand}
                    onChange={(e) => updateActiveSheet({ leftHand: e.target.value })}
                    placeholder="Ej. Escudo (+1 Def)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <datalist id="fq-shields-list">
                    <option value="Escudo (+1 Def)" />
                    <option value="Daga (1 DC)" />
                    <option value="Espada corta (2 DC)" />
                  </datalist>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">Cabeza</span>
                  <input
                    type="text"
                    value={activeSheet.head}
                    onChange={(e) => updateActiveSheet({ head: e.target.value })}
                    placeholder="Ej. Yelmo (+1 Def)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">Armadura</span>
                  <input
                    type="text"
                    list="fq-armors-list"
                    value={activeSheet.armor}
                    onChange={(e) => updateActiveSheet({ armor: e.target.value })}
                    placeholder="Ej. Cota de malla (+1 Def)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <datalist id="fq-armors-list">
                    {FQ_ARMORY_CATALOG.filter((x) => x.cat === 'Armadura').map((a) => (
                      <option key={a.id} value={`${a.name} (${a.dc})`} />
                    ))}
                  </datalist>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">Accesorios</span>
                  <input
                    type="text"
                    value={activeSheet.accessories}
                    onChange={(e) => updateActiveSheet({ accessories: e.target.value })}
                    placeholder="Anillos / Amuletos..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </label>
              </div>

              {/* Fila 3: Inventario Guardado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {[
                  ['Armas Guardadas (Máx. 2)', 'storedWeapons', 'Ej. Hacha de mano'],
                  ['Arrojadizas (Máx. 3)', 'storedThrown', 'Ej. 2× Daga'],
                  ['Pociones (Máx. 3)', 'storedPotions', 'Ej. Pócima Curación'],
                  ['Pergaminos (Máx. 3)', 'storedScrolls', 'Ej. Bola de Fuego'],
                  ['Equipo Apoyo (Máx. 3)', 'storedSupport', 'Ej. Herramientas, Cuerda'],
                ].map(([lbl, key, ph]) => (
                  <label key={key} className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold">{lbl}</span>
                    <input
                      type="text"
                      value={activeSheet[key]}
                      onChange={(e) => updateActiveSheet({ [key]: e.target.value })}
                      placeholder={ph}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                ))}
              </div>

              {/* Fila 4: Añadir / Quitar Habilidades y Hechizos al escalar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-200">+ Añadir Habilidad Nueva (al subir de Rango)</div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newAbilityName}
                      onChange={(e) => setNewAbilityName(e.target.value)}
                      placeholder="Nombre (ej. Pericia en Ataque)"
                      className="w-1/3 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                    <input
                      type="text"
                      value={newAbilityText}
                      onChange={(e) => setNewAbilityText(e.target.value)}
                      placeholder="Efecto (ej. Repite 1 dado al atacar)"
                      className="flex-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newAbilityName.trim()) return;
                        updateActiveSheet({
                          abilities: [...activeSheet.abilities, { name: newAbilityName.trim(), text: newAbilityText.trim() || 'Habilidad de rango.' }],
                        });
                        setNewAbilityName('');
                        setNewAbilityText('');
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeSheet.abilities.map((ab, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] flex items-center gap-1">
                        {ab.name}
                        <button
                          type="button"
                          onClick={() => updateActiveSheet({ abilities: activeSheet.abilities.filter((_, idx) => idx !== i) })}
                          className="text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="font-bold text-purple-200">+ Añadir Hechizo / Escuela Nueva (al subir de Rango)</div>
                  <div className="flex gap-1.5">
                    <select
                      value={newSpellLevel}
                      onChange={(e) => setNewSpellLevel(Number(e.target.value))}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-200 font-bold"
                    >
                      <option value={1}>Nv.1</option>
                      <option value={2}>Nv.2</option>
                      <option value={3}>Nv.3</option>
                    </select>
                    <input
                      type="text"
                      value={newSpellName}
                      onChange={(e) => setNewSpellName(e.target.value)}
                      placeholder="Nombre (ej. Protección)"
                      className="w-1/3 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                    <input
                      type="text"
                      value={newSpellNote}
                      onChange={(e) => setNewSpellNote(e.target.value)}
                      placeholder="Resumen del efecto"
                      className="flex-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSpellName.trim()) return;
                        updateActiveSheet({
                          spells: [...activeSheet.spells, { level: newSpellLevel, name: newSpellName.trim(), note: newSpellNote.trim() || 'Hechizo aprendido.' }],
                        });
                        setNewSpellName('');
                        setNewSpellNote('');
                      }}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeSheet.spells.map((sp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] flex items-center gap-1">
                        [Nv.{sp.level}] {sp.name}
                        <button
                          type="button"
                          onClick={() => updateActiveSheet({ spells: activeSheet.spells.filter((_, idx) => idx !== i) })}
                          className="text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vista Previa / Área de Impresión A4 Moderna */}
          <div className="space-y-6">
            {printMode === 'batch' ? (
              FQ_HEROES.filter((h) => selectedForPrint.has(h.id)).map((h) => (
                <ModernPrintableHeroSheet key={h.id} hero={h} sheet={getSheetForHero(h)} />
              ))
            ) : (
              <ModernPrintableHeroSheet hero={activeHero} sheet={activeSheet} />
            )}
          </div>
        </div>
      )}

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
                    <div className="space-y-1.5">
                      {h.abilities.map((ab, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                          <div className="font-bold text-emerald-300">{ab.name}</div>
                          <p className="text-slate-300 leading-snug mt-0.5">{ab.text}</p>
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
                    <div className="space-y-1.5">
                      {sc.spells.map((sp) => (
                        <div key={sp.name} className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                          <strong className="text-sky-300">{sp.name}:</strong>{' '}
                          <span className="text-slate-200">{sp.text}</span>
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
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-amber-200">
                        [{p.d20}] {p.name}
                      </strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-sky-300 font-bold">
                        {p.origin}
                      </span>
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

          {/* 4B. ARMERÍA COMPLETA */}
          {cityTab === 'armory' && (
            <div className="grimoire-panel rounded-2xl p-5 space-y-3 text-xs">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {FQ_ARMORY_CATALOG.filter((it) => armoryCat === 'Todas' || it.cat === armoryCat).map((it) => (
                  <div key={it.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-amber-200">{it.name}</strong>
                      <span className="font-black text-amber-400">{fmtPrice(it.price)} MO</span>
                    </div>
                    <div className="text-[11px] text-emerald-300 font-bold">
                      {it.dc} · <span className="text-slate-400 font-normal">{it.restrictions}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{it.traits}</p>
                  </div>
                ))}
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

          {/* 4D. SALONES IMPERIALES (RANGOS 1–10) */}
          {cityTab === 'ranks' && (
            <div className="grimoire-panel rounded-2xl p-5 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-950/35 border border-amber-500/40 text-amber-100">
                <strong>🏰 Cómo funciona el Escalado:</strong> Cada <strong>7 retos completados</strong>, el héroe puede pagar <strong>{useHasbroHalfPrice ? '300 MO' : '500 MO'}</strong> en los Salones Imperiales para subir 1 Rango (máx. 1 rango por visita a la ciudad). Todos los beneficios son acumulativos.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {FQ_RANK_PROGRESSION.map((r) => (
                  <div key={r.rank} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-200 text-sm">
                        Rango {r.rank}: {r.title}
                      </strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-sky-300 font-bold">
                        {r.questsReq} retos
                      </span>
                    </div>
                    <p className="text-slate-300 leading-snug">{r.benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
