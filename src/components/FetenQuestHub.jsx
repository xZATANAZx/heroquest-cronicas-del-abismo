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
} from 'lucide-react';
import {
  FQ_HEROES,
  FQ_DARK_SPELLS,
  FQ_DUNGEON_ENCHANTMENTS,
  FQ_WINDS_OF_MAGIC,
  FQ_WINDS_OF_CHAOS,
  FQ_FURNITURE_TABLE,
  FQ_POTIONS_TABLE,
  FQ_SCROLLS_D20,
  FQ_CHAOS_SPELLS_D20,
  FQ_BATTLE_SCARS,
  FQ_TREASURE_DECK,
  FQ_EVENTS_DECK,
  FQ_SCREEN_MONSTERS,
} from '../data/fetenquestData';

const MB_STORAGE_KEY = 'hq_fetenquest_mb_v41';

function shuffle(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

// ==================== COMPONENTE DE HOJA IMPRIMIBLE A4 (ESTILO FichaHeroe_A4.pdf) ====================
function PrintableHeroSheet({ hero }) {
  return (
    <div className="fq-print-sheet bg-white text-black border-2 border-black rounded-xl p-5 sm:p-6 space-y-4 shadow-xl print:shadow-none print:rounded-none print:border-black">
      {/* Cabecera estilo FetenQuest */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-black pb-3">
        <div>
          <div className="font-display text-2xl font-black tracking-tight uppercase leading-none">
            FETENQUEST 4.1
          </div>
          <div className="text-base font-black mt-1">{hero.name}</div>
          <div className="text-[11px] font-semibold text-neutral-700">
            {hero.role} · Categoría: {hero.category} · Tamaño: {hero.size}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs min-w-[240px]">
          <div className="border-b border-black pb-0.5">
            <strong>Nombre:</strong> ________________
          </div>
          <div className="border-b border-black pb-0.5">
            <strong>Jugador:</strong> ________________
          </div>
          <div className="border-b border-black pb-0.5">
            <strong>Rango:</strong> 1 (Aprendiz)
          </div>
          <div className="border-b border-black pb-0.5">
            <strong>Retos Completados:</strong> [ &nbsp;&nbsp; ]
          </div>
        </div>
      </div>

      {/* Dos columnas principales estilo FichaHeroe_A4.pdf */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* COLUMNA IZQUIERDA: STATS + CUERPO/MENTE + EQUIPO */}
        <div className="space-y-3.5">
          {/* Tabla de Estadísticas Iniciales */}
          <div className="grid grid-cols-4 border-2 border-black text-center">
            <div className="p-2 border-r border-black">
              <div className="text-[9px] font-bold uppercase leading-tight">Dados Ataque</div>
              <div className="text-xl font-black mt-0.5">{hero.at} DC</div>
            </div>
            <div className="p-2 border-r border-black">
              <div className="text-[9px] font-bold uppercase leading-tight">Dados Defensa</div>
              <div className="text-xl font-black mt-0.5">{hero.def} DC</div>
            </div>
            <div className="p-2 border-r border-black">
              <div className="text-[9px] font-bold uppercase leading-tight">PC Iniciales</div>
              <div className="text-xl font-black mt-0.5">{hero.pc}</div>
            </div>
            <div className="p-2">
              <div className="text-[9px] font-bold uppercase leading-tight">PM Iniciales</div>
              <div className="text-xl font-black mt-0.5">{hero.pm}</div>
            </div>
          </div>

          {/* Barra de seguimiento de Cuerpo y Mente */}
          <div className="border-2 border-black text-xs">
            <div className="grid grid-cols-11 border-b border-black">
              <div className="col-span-2 p-1 font-black bg-neutral-100 border-r border-black">Cuerpo</div>
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className={`p-1 text-center border-r last:border-r-0 border-black font-bold ${
                    i + 1 === hero.pc ? 'bg-neutral-200 underline' : ''
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-11">
              <div className="col-span-2 p-1 font-black bg-neutral-100 border-r border-black">Mente</div>
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className={`p-1 text-center border-r last:border-r-0 border-black font-bold ${
                    i + 1 === hero.pm ? 'bg-neutral-200 underline' : ''
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Objetos Equipados + Oro */}
          <div className="border-2 border-black p-2.5 space-y-2">
            <div className="flex items-center justify-between border-b border-black pb-1">
              <span className="text-xs font-black uppercase">Objetos Equipados</span>
              <span className="text-xs font-black border border-black px-2 py-0.5">
                Monedas de Oro: _________
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="border border-black p-1.5 min-h-[38px]">
                <div className="text-[9px] font-bold uppercase text-neutral-600">Mano Derecha (Arma Inicial)</div>
                <div className="font-bold">{hero.startingGear}</div>
              </div>
              <div className="border border-black p-1.5 min-h-[38px]">
                <div className="text-[9px] font-bold uppercase text-neutral-600">Mano Izquierda / Escudo</div>
                <div className="text-neutral-400">__________________</div>
              </div>
              <div className="border border-black p-1.5 min-h-[36px]">
                <div className="text-[9px] font-bold uppercase text-neutral-600">Cabeza (Yelmo)</div>
              </div>
              <div className="border border-black p-1.5 min-h-[36px]">
                <div className="text-[9px] font-bold uppercase text-neutral-600">Armadura</div>
              </div>
              <div className="border border-black p-1.5 col-span-2 min-h-[32px]">
                <div className="text-[9px] font-bold uppercase text-neutral-600">Accesorios (Anillos / Amuletos / Capas)</div>
              </div>
            </div>
            <div className="text-[10px] bg-neutral-100 border border-neutral-400 p-1.5">
              <strong>Restricciones de Equipo:</strong> {hero.restrictions}
            </div>
          </div>

          {/* Objetos Guardados (Límites exactos de FetenQuest 4.1) */}
          <div className="border-2 border-black p-2.5 space-y-1.5 text-[10px]">
            <div className="text-xs font-black uppercase border-b border-black pb-1">
              Objetos Guardados (Límites FetenQuest)
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div>
                <strong>Armas / Escudos (Máx. 2):</strong>
                <div>1. _______________________</div>
                <div>2. _______________________</div>
              </div>
              <div>
                <strong>Arrojadizas (Máx. 3):</strong>
                <div>1. ___________ 2. _________</div>
                <div>3. _______________________</div>
              </div>
              <div>
                <strong>Pociones (Máx. 3):</strong>
                <div>1. _______________________</div>
                <div>2. _______________________</div>
                <div>3. _______________________</div>
              </div>
              <div>
                <strong>Pergaminos (Máx. 3):</strong>
                <div>1. _______________________</div>
                <div>2. _______________________</div>
                <div>3. _______________________</div>
              </div>
              <div className="col-span-2">
                <strong>Equipo de Apoyo (Herramientas, Bandolera, Cuerda — Máx. 3):</strong>
                <div>1. ______________________ 2. ______________________ 3. ______________________</div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: HABILIDADES + HECHIZOS + COMPAÑEROS */}
        <div className="space-y-3.5">
          {/* Habilidades Especiales */}
          <div className="border-2 border-black p-2.5 space-y-2">
            <div className="text-xs font-black uppercase border-b border-black pb-1">
              Habilidades Especiales Iniciales
            </div>
            <div className="space-y-2 text-[11px]">
              {hero.abilities.map((ab, idx) => (
                <div key={idx} className="border-b border-neutral-300 last:border-b-0 pb-1.5 last:pb-0">
                  <div className="font-black">• {ab.name}</div>
                  <div className="text-neutral-800 leading-snug">{ab.text}</div>
                </div>
              ))}
            </div>
            <div className="pt-1 border-t border-dashed border-neutral-400 text-[10px] text-neutral-600">
              Nuevas habilidades (Rangos / Salones Imperiales):
              <div className="mt-1">___________________________________________________________</div>
              <div>___________________________________________________________</div>
            </div>
          </div>

          {/* Hechizos / Saberes y Fases de Uso */}
          <div className="border-2 border-black p-2.5 space-y-1.5">
            <div className="flex items-center justify-between border-b border-black pb-1">
              <span className="text-xs font-black uppercase">Hechizos / Fases de Uso</span>
              <span className="text-[10px] font-bold">
                {hero.magicSaber ? `Saber: ${hero.magicSaber}` : 'Sin magia inicial'}
              </span>
            </div>
            {hero.startingSpells.length > 0 ? (
              <div className="space-y-1.5 text-[11px]">
                {hero.startingSpells.map((sp, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 border-b border-neutral-300 pb-1">
                    <div>
                      <strong>[Nv.{sp.level}] {sp.name}:</strong>{' '}
                      <span className="text-neutral-700">{sp.note}</span>
                    </div>
                    <span className="font-mono text-xs shrink-0">☐ ☐ ☐</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-neutral-600 italic">
                Este héroe no comienza con hechizos (puede usar Pergaminos tirando 2D6 en Vientos de la Magia).
              </div>
            )}
            <div className="text-[10px] text-neutral-600 pt-1">
              Repetición FetenQuest: Nv.1 repite 2 veces (-1 PM) · Nv.2 repite 1 vez (-1 PM) · Nv.3 no se repite.
            </div>
          </div>

          {/* Compañeros (Mercenarios y Animales) */}
          <div className="border-2 border-black text-[10px]">
            <div className="bg-neutral-100 border-b border-black px-2 py-1 text-xs font-black uppercase">
              Compañeros (Mercenarios y Bestias)
            </div>
            <div className="grid grid-cols-12 border-b border-black font-bold text-center bg-neutral-50">
              <div className="col-span-5 p-1 text-left border-r border-black">Nombre / Habilidad</div>
              <div className="col-span-1 p-1 border-r border-black">MV</div>
              <div className="col-span-1 p-1 border-r border-black">AT</div>
              <div className="col-span-1 p-1 border-r border-black">DF</div>
              <div className="col-span-1 p-1 border-r border-black">PC</div>
              <div className="col-span-1 p-1 border-r border-black">PM</div>
              <div className="col-span-2 p-1">Salario</div>
            </div>
            {[0, 1].map((row) => (
              <div key={row} className="grid grid-cols-12 border-b last:border-b-0 border-black h-7">
                <div className="col-span-5 border-r border-black" />
                <div className="col-span-1 border-r border-black" />
                <div className="col-span-1 border-r border-black" />
                <div className="col-span-1 border-r border-black" />
                <div className="col-span-1 border-r border-black" />
                <div className="col-span-1 border-r border-black" />
                <div className="col-span-2" />
              </div>
            ))}
          </div>

          {/* Nota Rápida de Turno FetenQuest */}
          <div className="border border-black bg-neutral-100 p-2 text-[9.5px] leading-snug">
            <strong>Recordatorio de Turno:</strong> 1 Movimiento (2D6, u 8 fijo sin enemigos) + 1 Acción Normal + Acciones Gratuitas (beber poción, abrir puerta, revisar mueble adyacente, dar objeto guardado). · <strong>Shock (0 PM):</strong> mueve 1D6, ataca 1 DC, defiende 2 DC.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FetenQuestHub({ showToast = null }) {
  const [subTab, setSubTab] = useState('sheets'); // 'sheets' | 'mb_screen' | 'decks'

  // ==================== ESTADO SUB-TAB 1: HOJAS IMPRIMIBLES (25 HÉROES) ====================
  const [heroFilter, setHeroFilter] = useState('Todos');
  const [activeHeroId, setActiveHeroId] = useState(FQ_HEROES[0].id);
  const [selectedForPrint, setSelectedForPrint] = useState(() => new Set(['fq_barbaro', 'fq_enano', 'fq_elfo', 'fq_mago']));
  const [printMode, setPrintMode] = useState('single'); // 'single' | 'batch'

  const filteredHeroes = FQ_HEROES.filter((h) => heroFilter === 'Todos' || h.category === heroFilter);
  const activeHero = FQ_HEROES.find((h) => h.id === activeHeroId) || FQ_HEROES[0];

  const triggerPrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => window.print(), 120);
  };

  // ==================== ESTADO SUB-TAB 2: GRIMORIO & PANTALLA DEL MB SUPREMO ====================
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
  const [mbHand, setMbHand] = useState(savedMB?.mbHand || []); // [{ id, label, isNegative }]
  const [enchantCounters, setEnchantCounters] = useState(savedMB?.enchantCounters || 0);
  const [activeEnchantments, setActiveEnchantments] = useState(savedMB?.activeEnchantments || []);
  const [darkUpgradesNote, setDarkUpgradesNote] = useState(savedMB?.darkUpgradesNote || '');
  const [completedQuestsCount, setCompletedQuestsCount] = useState(savedMB?.completedQuestsCount || 0);
  const [screenTab, setScreenTab] = useState('winds'); // 'winds' | 'furniture' | 'potions' | 'chaos_scars' | 'monsters'

  // Tiradores rápidos de Pantalla MB
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
        showToast?.(`⚠️ Mano del MB llena (máx. ${maxHandSize} cartas). Descarta el exceso al mazo de tesoros.`);
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
    let remainingNeg = spell.costNeg;
    let remainingAny = spell.costAny;
    const nextHand = [];
    // Primero descontamos las negativas requeridas
    for (const c of mbHand) {
      if (c.isNegative && remainingNeg > 0) {
        remainingNeg -= 1;
      } else {
        nextHand.push(c);
      }
    }
    // Luego descontamos las cartas cualquiera (preferimos gastar positivas primero para ahorrar negativas)
    const finalHand = [];
    for (const c of nextHand) {
      if (!c.isNegative && remainingAny > 0) {
        remainingAny -= 1;
      } else {
        finalHand.push(c);
      }
    }
    const finalHand2 = [];
    for (const c of finalHand) {
      if (remainingAny > 0) {
        remainingAny -= 1;
      } else {
        finalHand2.push(c);
      }
    }
    setMbHand(finalHand2);
    if (spell.addsCounter) {
      setEnchantCounters((v) => v + 1);
    }
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

  // ==================== ESTADO SUB-TAB 3: MAZOS FETENQUEST (TESOROS + SUCESOS) ====================
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
      const isNeg = drawn.kind === 'negative';
      addCardToMBHand(isNeg, drawn.title);
      showToast?.(`🧙 MB robó: ${drawn.title} (${isNeg ? 'Negativa 💀' : 'Normal'})`);
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

  return (
    <div className="space-y-5">
      {/* ==================== CABECERA Y SELECTOR DE 3 SUB-PESTAÑAS (Oculta al imprimir) ==================== */}
      <div className="no-print grimoire-panel rounded-2xl p-4 border-amber-500/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-black text-amber-200 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-amber-400" /> FetenQuest 4.1 Legacy — Fichas, Pantalla DM y Mazos
            </h2>
            <p className="text-xs text-slate-400">
              100% compatible con HeroQuest Original (Dados de Combate + 2D6). Imprime las 25 hojas de héroes A4, usa el Grimorio del Malvado Brujo y consulta la Pantalla del DM.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'sheets', label: '🖨️ Hojas de Héroes (25)' },
              { id: 'mb_screen', label: '📖 Grimorio y Pantalla DM' },
              { id: 'decks', label: '🃏 Mazos Sucesos / Tesoros' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition border ${
                  subTab === t.id
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== SUB-TAB 1: HOJAS IMPRIMIBLES A4 DE LOS 25 HÉROES ==================== */}
      {subTab === 'sheets' && (
        <div className="space-y-4">
          {/* Controles de selección e impresión (ocultos al imprimir) */}
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
                  <Printer className="w-4 h-4" /> Imprimir Paquete ({selectedForPrint.size} marcadas)
                </button>
              </div>
            </div>

            {/* Parrilla de los 25 Héroes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredHeroes.map((h) => {
                const isViewing = h.id === activeHeroId;
                const isChecked = selectedForPrint.has(h.id);
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
                        AT {h.at} · DF {h.def} · PC {h.pc} · PM {h.pm}
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
                      className="text-amber-300 hover:text-amber-200 cursor-pointer shrink-0"
                      title="Marcar para imprimir en paquete"
                    >
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-500" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vista Previa / Zona de Impresión A4 */}
          <div className="space-y-6">
            {printMode === 'batch' ? (
              <>
                <div className="no-print text-xs text-emerald-300 font-bold">
                  Vista previa del paquete ({selectedForPrint.size} hojas listas para imprimir). Para ver solo una, toca cualquier héroe arriba.
                </div>
                {FQ_HEROES.filter((h) => selectedForPrint.has(h.id)).map((h) => (
                  <PrintableHeroSheet key={h.id} hero={h} />
                ))}
              </>
            ) : (
              <PrintableHeroSheet hero={activeHero} />
            )}
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 2: GRIMORIO & PANTALLA DEL MALVADO BRUJO SUPREMO ==================== */}
      {subTab === 'mb_screen' && (
        <div className="no-print space-y-5">
          {/* 1. GRIMORIO INTERACTIVO DEL MALVADO BRUJO SUPREMO (FichaMB.pdf) */}
          <div className="grimoire-panel rounded-2xl p-5 border-purple-500/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-display text-base font-black text-purple-200 flex items-center gap-2">
                  <Skull className="w-5 h-5 text-rose-400" /> Grimorio del Malvado Brujo Supremo (FichaMB)
                </h3>
                <p className="text-xs text-slate-400">
                  Turno MB: 1) Si no hay monstruos, roba carta de tesoro (máx. Nº Héroes + 1) · 2) Activa monstruos · 3) Descarta cartas para lanzar Hechizos Oscuros.
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
                  Mano Máx: {maxHandSize} · Coste Encantamiento: {enchantmentCost}
                </div>
              </div>
            </div>

            {/* Mano de Cartas del MB + Contadores de Encantamiento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Mano del MB */}
              <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-black text-amber-200">
                    ✋ Mano del Malvado Brujo ({mbHand.length}/{maxHandSize}) · Negativas 💀: {negCardsInHand}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => drawFQTreasure(true)}
                      className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-black text-[11px] cursor-pointer"
                    >
                      🎲 Robar del Mazo FQ
                    </button>
                    <button
                      type="button"
                      onClick={() => addCardToMBHand(false, 'Carta Normal (Positiva)')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[11px] cursor-pointer"
                    >
                      + Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => addCardToMBHand(true, 'Carta Negativa 💀')}
                      className="px-2.5 py-1 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-100 font-bold text-[11px] cursor-pointer"
                    >
                      + Negativa 💀
                    </button>
                  </div>
                </div>
                {mbHand.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    Tu mano está vacía. Cuando no haya monstruos en el tablero, pulsa "Robar del Mazo FQ".
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {mbHand.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setMbHand((prev) => prev.filter((x) => x.id !== c.id))}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 cursor-pointer ${
                          c.isNegative
                            ? 'bg-rose-950/80 border-rose-500/70 text-rose-200'
                            : 'bg-slate-900 border-slate-700 text-slate-200'
                        }`}
                        title="Clic para descartar y devolver al mazo"
                      >
                        <span>{c.label}</span>
                        <span className="opacity-60">✕</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Encantamientos de Mazmorra + Retos Jugados */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-purple-950/30 border border-purple-700/50 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-purple-200">🌀 Encantamientos de Mazmorra</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEnchantCounters((v) => Math.max(0, v - 1))}
                      className="p-1 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-black text-sm text-amber-300">
                      {enchantCounters}/{enchantmentCost}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEnchantCounters((v) => v + 1)}
                      className="p-1 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={rollDungeonEnchantment}
                  className={`w-full py-2 rounded-xl font-black text-xs cursor-pointer transition ${
                    enchantCounters >= enchantmentCost
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg animate-pulse'
                      : 'bg-purple-800/80 hover:bg-purple-700 text-white'
                  }`}
                >
                  🎲 Activar Encantamiento de Mazmorra (1D20)
                </button>
                {activeEnchantments.length > 0 && (
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    {activeEnchantments.map((en) => (
                      <div key={en.uid} className="p-2 rounded-lg bg-slate-950/80 border border-purple-600/40 text-[11px] flex items-start justify-between gap-2">
                        <div>
                          <strong className="text-amber-300">{en.name}:</strong>{' '}
                          <span className="text-slate-300">{en.text}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveEnchantments((prev) => prev.filter((x) => x.uid !== en.uid))}
                          className="text-slate-400 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Los 9 Hechizos Oscuros del Grimorio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {FQ_DARK_SPELLS.map((sp) => {
                const canAfford = mbHand.length >= sp.costAny + sp.costNeg && negCardsInHand >= sp.costNeg;
                return (
                  <div
                    key={sp.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 flex flex-col justify-between ${
                      canAfford
                        ? 'bg-slate-900/90 border-purple-500/60'
                        : 'bg-slate-950/70 border-slate-800 opacity-75'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-amber-200">{sp.name}</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-700/60 text-rose-200 font-bold">
                          {sp.costLabel}
                        </span>
                      </div>
                      <div className="text-[10px] text-purple-300 font-semibold">⏱️ {sp.timing}</div>
                      <p className="text-[11px] text-slate-300 leading-snug">{sp.effect}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => castDarkSpell(sp)}
                      className={`w-full py-1.5 rounded-lg font-black text-[11px] cursor-pointer mt-1 ${
                        canAfford
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      ⚡ Lanzar {sp.name}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Notas de Mejoras Oscuras y Retos Jugados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-200">Retos Completados</div>
                  <div className="text-[10px] text-slate-400">Cada 7 retos = +1 Rango / Mejoras Oscuras</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCompletedQuestsCount((v) => Math.max(0, v - 1))}
                    className="px-2 py-1 rounded bg-slate-800 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-base text-white">{completedQuestsCount}</span>
                  <button
                    type="button"
                    onClick={() => setCompletedQuestsCount((v) => v + 1)}
                    className="px-2 py-1 rounded bg-slate-800 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={darkUpgradesNote}
                  onChange={(e) => setDarkUpgradesNote(e.target.value)}
                  placeholder="Anota aquí tus Mejoras Oscuras compradas (ej. Caos Mejorado, Custodio de Ogros, Conde Vampiro...)"
                  className="w-full h-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* 2. PANTALLA DE REFERENCIA RÁPIDA DEL MALVADO BRUJO (Pantalla_MB.pdf) */}
          <div className="grimoire-panel rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-display text-base font-black text-amber-200 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" /> Pantalla del Malvado Brujo (Tablas Interactivas)
              </h3>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'winds', label: '✨ Vientos Magia / Caos' },
                  { id: 'furniture', label: '🪑 Revisar Mueble (1D6)' },
                  { id: 'potions', label: '🧪 Pociones & Pergaminos' },
                  { id: 'chaos_scars', label: '💀 Caos & Cicatrices' },
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

            {/* Pantalla 1: Vientos de la Magia + Vientos del Caos */}
            {screenTab === 'winds' && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWindsRoll(Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black cursor-pointer flex items-center gap-1.5"
                  >
                    <Dices className="w-4 h-4" /> Tirar Vientos de la Magia (2D6)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChaosWindsRoll(Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black cursor-pointer flex items-center gap-1.5"
                  >
                    <Dices className="w-4 h-4" /> Tirar Vientos del Caos (2D6)
                  </button>
                  {windsRoll !== null && (
                    <span className="px-3 py-1.5 rounded-lg bg-sky-950 border border-sky-400 text-sky-200 font-black">
                      Resultado Magia: {windsRoll}
                    </span>
                  )}
                  {chaosWindsRoll !== null && (
                    <span className="px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-400 text-rose-200 font-black">
                      Resultado Caos: {chaosWindsRoll}
                    </span>
                  )}
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
                      <div
                        key={c.roll}
                        className={`p-2.5 rounded-xl border ${
                          hl ? 'bg-rose-900/60 border-rose-400 text-white' : 'bg-slate-950/70 border-slate-800 text-slate-300'
                        }`}
                      >
                        <strong className="text-rose-300">[{c.roll}]</strong> {c.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pantalla 2: Acción Gratuita Revisar Mueble (1D6) */}
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

            {/* Pantalla 3: 20 Pociones & 20 Pergaminos */}
            {screenTab === 'potions' && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const p = FQ_POTIONS_TABLE[Math.floor(Math.random() * 12)];
                      setTableRollPopup({ title: `🧪 Pócima Común: ${p.name}`, badge: `${p.price} MO`, text: p.effect });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black cursor-pointer"
                  >
                    🎲 Pócima Común (1D12)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const p = FQ_POTIONS_TABLE[12 + Math.floor(Math.random() * 8)];
                      setTableRollPopup({ title: `⚗️ Pócima Infrecuente: ${p.name}`, badge: `${p.price} MO`, text: p.effect });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-black cursor-pointer"
                  >
                    🎲 Pócima Infrecuente (1D8)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const s = FQ_SCROLLS_D20[Math.floor(Math.random() * FQ_SCROLLS_D20.length)];
                      setTableRollPopup({ title: `📜 Pergamino de Hechizo`, badge: 'Tirada 1D20', text: s });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer"
                  >
                    🎲 Pergamino al Azar (1D20)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {FQ_POTIONS_TABLE.map((p) => (
                    <div key={p.d20} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2">
                      <div>
                        <strong className={p.tier === 'Infrecuente' ? 'text-indigo-300' : 'text-emerald-300'}>
                          [{p.d20}] {p.name}
                        </strong>{' '}
                        <span className="text-[10px] text-slate-400">({p.tier})</span>
                        <div className="text-[11px] text-slate-300">{p.effect}</div>
                      </div>
                      <span className="font-black text-amber-400 shrink-0">{p.price} MO</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pantalla 4: Hechizos del Caos (1D20) & Cicatrices de Batalla (2D6) */}
            {screenTab === 'chaos_scars' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-rose-300 text-sm">💀 Hechizos del Caos (1D20)</strong>
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
                          text: 'Consulta el efecto en Hechizos del Terror / Caos.',
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-black cursor-pointer"
                    >
                      🎲 Tirar 1D20
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FQ_CHAOS_SPELLS_D20.map((cs) => (
                      <div key={cs.range} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <strong className="text-amber-300">{cs.range}:</strong> {cs.name}{' '}
                        <span className="text-[10px] text-rose-300">({cs.level})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-300 text-sm">🩹 Cicatrices de Batalla (Templo · 2D6)</strong>
                    <button
                      type="button"
                      onClick={() => {
                        const r = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
                        const found =
                          FQ_BATTLE_SCARS.find((s) => s.roll === String(r)) ||
                          (r === 6 || r === 8 ? FQ_BATTLE_SCARS.find((s) => s.roll === '6 u 8') : FQ_BATTLE_SCARS[0]);
                        setTableRollPopup({
                          title: `🩹 Cicatriz de Batalla (2D6 = ${r}): ${found.name}`,
                          badge: 'Resurrección en el Templo (500 MO)',
                          text: found.text,
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer"
                    >
                      🎲 Tirar 2D6
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                    {FQ_BATTLE_SCARS.map((sc) => (
                      <div key={sc.roll} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <strong className="text-amber-300">[{sc.roll}] {sc.name}:</strong>{' '}
                        <span className="text-slate-300">{sc.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pantalla 5: Bestiario Resumen de Pantalla_MB */}
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

      {/* ==================== SUB-TAB 3: MAZOS FETENQUEST (TESOROS + SUCESOS) & GUÍA ==================== */}
      {subTab === 'decks' && (
        <div className="no-print space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mazo de Tesoros FetenQuest */}
            <div className="grimoire-panel rounded-2xl p-5 border-emerald-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-black text-emerald-300 flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Mazo de Tesoros FetenQuest
                </h3>
                <span className="text-xs font-bold text-slate-300">
                  Quedan {fqTreasureDeck.length} · Descartadas {fqDiscardedCount}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Equilibrado con cartas Positivas (25–125 MO, Pociones, Pergaminos), cartas Negativas 💀 (vuelven al mazo) y <strong>5 cartas ❓ Suceso/Evento</strong> que disparan automáticamente el Mazo de Sucesos y Guaridas.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => drawFQTreasure(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow"
                >
                  💎 Robar Carta de Tesoro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFqTreasureDeck(shuffle(FQ_TREASURE_DECK));
                    setFqDiscardedCount(0);
                    showToast?.('🔄 Mazo de Tesoros FetenQuest barajado completo.');
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Barajar
                </button>
              </div>
            </div>

            {/* Mazo de Sucesos y Guaridas */}
            <div className="grimoire-panel rounded-2xl p-5 border-purple-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-black text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Mazo de Sucesos y Guaridas
                </h3>
                <span className="text-xs font-bold text-slate-300">Quedan {fqEventsDeck.length}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Añade sucesos memorables (Altares, Mercaderes, Fuentes Arcanas) y <strong>Guaridas opcionales</strong> (Troll, Tumulario, Arañas, Forajidos — máx. 1 Guarida por reto, con puerta secreta a una sala vacía).
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => drawFQEvent(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow"
                >
                  ❓ Robar Suceso / Guarida
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFqEventsDeck(shuffle(FQ_EVENTS_DECK));
                    showToast?.('🔄 Mazo de Sucesos y Guaridas barajado.');
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Barajar
                </button>
              </div>
            </div>
          </div>

          {/* Guía de cómo combinar FetenQuest con el HeroQuest Original */}
          <div className="grimoire-panel rounded-2xl p-5 border-amber-500/40 space-y-3 text-xs">
            <h3 className="font-display text-base font-black text-amber-300 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Cómo usar FetenQuest 4.1 con tu HeroQuest Original (Paso a Paso)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-200 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong className="text-amber-300">1. Elige tus Héroes e Imprime las Hojas:</strong> Usa las hojas A4 de los 25 personajes de FetenQuest tal cual sobre el tablero y misiones originales del Juego Base o La Luna del Terror.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong className="text-amber-300">2. Regla de Oro y Mazos (Pág. 10):</strong> Si usas el <strong>Mazo de Tesoros FetenQuest</strong> de aquí arriba, usa los precios de FetenQuest tal cual. Si prefieres el <strong>Mazo Oficial de Hasbro</strong>, simplemente divide entre 2 los precios de la tienda/ciudad de FetenQuest.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong className="text-amber-300">3. Grimorio del Malvado Brujo Supremo:</strong> Cuando no queden monstruos en el tablero, en tu turno de DM roba 1 carta de tesoro a tu mano (máx. Nº Héroes + 1) y gástalas en los 9 Hechizos Oscuros o en Acumular Poder para Encantamientos de Mazmorra.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong className="text-amber-300">4. Modular y Sin Complicaciones:</strong> Puedes activar solo lo que te guste hoy (por ejemplo: Héroes FetenQuest + Revisar Mueble 1D6 + Mazo de Sucesos) y sumar Vientos de la Magia o Encantamientos cuando tu mesa ya los domine.
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
