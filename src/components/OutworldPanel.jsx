import React, { useState, useEffect } from 'react';
import {
  Compass,
  Dices,
  Shield,
  Coins,
  Flame,
  Sparkles,
  AlertTriangle,
  Home,
  Swords,
  BookOpen,
  ShoppingBag,
  Trophy,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import {
  OUTWORLD_SETTLEMENT_TYPES,
  OUTWORLD_MENTOR_TABLE,
  OUTWORLD_MOUNTS,
  OUTWORLD_BLACK_MARKET_ITEMS,
  OUTWORLD_GUILD_MASTERIES,
  OUTWORLD_ARENA_ENEMIES,
  OUTWORLD_PUBLIC_HELP_TABLE,
  DANGER_TABLE_A,
  DANGER_TABLE_B,
  TAVERN_TABLE,
  BLACK_MARKET_TABLE,
  HAVEN_TABLE,
  SETTLEMENT_TABLE_A,
  SETTLEMENT_TABLE_B,
  CATASTROPHIC_TABLE,
  calculatePartySC,
  rollD6,
  rollD66,
  roll2D6,
  lookupD66,
  lookup2D6,
} from '../data/outworldTables';

const TABLE_REGISTRY = [
  { id: 'dangerA', label: '🛤️ Danger Table A (Viaje)', type: 'd66', data: DANGER_TABLE_A, badge: 'Viaje A' },
  { id: 'dangerB', label: '🌲 Danger Table B (Viaje)', type: 'd66', data: DANGER_TABLE_B, badge: 'Viaje B' },
  { id: 'settlementA', label: '🏘️ Settlement Table A', type: 'd66', data: SETTLEMENT_TABLE_A, badge: 'Asentamiento A' },
  { id: 'settlementB', label: '🏛️ Settlement Table B', type: 'd66', data: SETTLEMENT_TABLE_B, badge: 'Asentamiento B' },
  { id: 'tavern', label: '🍺 Tavern Table', type: 'd66', data: TAVERN_TABLE, badge: 'Taberna' },
  { id: 'blackMarket', label: '🕶️ Black Market Table', type: 'd66', data: BLACK_MARKET_TABLE, badge: 'Mercado Negro' },
  { id: 'haven', label: '🏰 Haven Table (Refugio)', type: 'd66', data: HAVEN_TABLE, badge: 'Refugio' },
  { id: 'catastrophic', label: '☄️ Catastrophic Table (Día 10)', type: '2d6', data: CATASTROPHIC_TABLE, badge: 'Catástrofe' },
];

export default function OutworldPanel({ heroes = [], onUpdateHeroes, showToast }) {
  const [ow, setOw] = useState({
    phase: 'settlement',
    settlementType: 'capital',
    travelDay: 0,
    travelTotal: 0,
    settlementDay: 1,
    strictMode: false,
    useStockRolls: false,
    havenUnlocked: false,
    havenVaultGold: 0,
    havenVaultGems: 0,
    havenVaultItems: [],
    activeEvent: null,
    arenaRound: 1,
  });

  const [subTab, setSubTab] = useState('tables'); // 'tables' | 'haven' | 'shops' | 'gambling' | 'arena'
  const [selectedTableId, setSelectedTableId] = useState('dangerA');
  const [manualRoll, setManualRoll] = useState('');
  const [selectedHeroId, setSelectedHeroId] = useState(heroes[0]?.id || '');
  const [buffText, setBuffText] = useState('');
  const [mentorResult, setMentorResult] = useState(null);
  const [publicHelpResult, setPublicHelpResult] = useState(null);
  const [stockResult, setStockResult] = useState(null);
  const [mountBonus, setMountBonus] = useState(0);
  const [lostCheckMsg, setLostCheckMsg] = useState('');
  const [vaultAmount, setVaultAmount] = useState(100);

  // Cargar estado Outworld del servidor local
  useEffect(() => {
    fetch('/api/outworld', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.state) setOw((prev) => ({ ...prev, ...d.state }));
      })
      .catch(() => {});
  }, []);

  const syncOutworld = (patch) => {
    setOw((prev) => {
      const next = { ...prev, ...patch };
      fetch('/api/outworld', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }).catch(() => {});
      return next;
    });
  };

  const activeHero = heroes.find((h) => h.id === selectedHeroId) || heroes[0] || null;
  const settlementMeta = OUTWORLD_SETTLEMENT_TYPES[ow.settlementType] || OUTWORLD_SETTLEMENT_TYPES.capital;
  const partySC = calculatePartySC(heroes);

  // Tirar distancia de viaje (3 Dados de Combate)
  const startTravelRoll = (destType) => {
    // 1D6 por dado de combate: 1–3 Calavera (3/6), 4–5 Escudo Blanco (2/6), 6 Escudo Negro (1/6)
    let skulls = 0;
    let whites = 0;
    let blacks = 0;
    for (let i = 0; i < 3; i++) {
      const r = rollD6();
      if (r <= 3) skulls++;
      else if (r <= 5) whites++;
      else blacks++;
    }
    const base = destType === 'capital' ? 4 + skulls : destType === 'town' ? 3 + whites : 2 + blacks;
    const total = Math.max(1, base - mountBonus);
    syncOutworld({
      phase: 'travel',
      settlementType: destType,
      travelDay: 1,
      travelTotal: total,
      activeEvent: {
        table: 'Viaje Iniciado',
        code: `${skulls}💀 ${whites}🛡️ ${blacks}⬛`,
        title: `Rumbo a ${OUTWORLD_SETTLEMENT_TYPES[destType].name} (${total} días)`,
        text: `3 Dados de Combate: ${skulls} Calaveras, ${whites} Escudos Blancos, ${blacks} Escudos Negros${mountBonus ? ` (-${mountBonus} días por montura)` : ''}. Tira 1 evento diario en Danger Table A o B.`,
        ts: Date.now(),
      },
    });
    setSelectedTableId('dangerA');
    setLostCheckMsg('');
    if (showToast) showToast(`Viaje iniciado: ${total} días hacia ${OUTWORLD_SETTLEMENT_TYPES[destType].name}`);
  };

  const advanceTravelDay = () => {
    const d1 = rollD6();
    const d2 = rollD6();
    const isLost = d1 === 1 && d2 === 1;
    if (isLost) {
      setLostCheckMsg('⚠️ ¡DOBLE 1! El grupo se ha perdido: +1 día de viaje y +1 tirada de Peligro.');
      syncOutworld({ travelTotal: ow.travelTotal + 1 });
      return;
    }
    setLostCheckMsg(`✓ Chequeo de rumbo (${d1} + ${d2}): siguen en la ruta correcta.`);
    if (ow.travelDay >= ow.travelTotal) {
      syncOutworld({ phase: 'settlement', settlementDay: 1, travelDay: 0, travelTotal: 0 });
      if (showToast) showToast(`¡Llegaron a ${settlementMeta.name}! Día 1 de estancia.`);
    } else {
      syncOutworld({ travelDay: ow.travelDay + 1 });
    }
  };

  const triggerTableRoll = (tableId = selectedTableId, forcedCode = '') => {
    const meta = TABLE_REGISTRY.find((t) => t.id === tableId);
    if (!meta) return;
    let entry = null;
    let rollCode = '';
    if (meta.type === '2d6') {
      const val = forcedCode ? Number(forcedCode) : roll2D6();
      entry = lookup2D6(meta.data, val);
      rollCode = String(val);
    } else {
      const code = forcedCode && lookupD66(meta.data, forcedCode) ? forcedCode : rollD66();
      entry = lookupD66(meta.data, code);
      rollCode = code;
    }
    if (!entry) return;
    const evObj = {
      table: meta.badge,
      code: rollCode,
      title: entry.title,
      text: entry.text,
      combat: entry.combat || null,
      quiet: Boolean(entry.quiet),
      strictWarning: Boolean(entry.strictWarning),
      ts: Date.now(),
    };
    syncOutworld({ activeEvent: evObj });
  };

  const applyBuffToHero = (label) => {
    if (!activeHero || !onUpdateHeroes || !label.trim()) return;
    const nextHeroes = heroes.map((h) => {
      if (h.id !== activeHero.id) return h;
      const buffs = Array.isArray(h.outworldBuffs) ? h.outworldBuffs : [];
      return { ...h, outworldBuffs: [...buffs, label.trim()] };
    });
    onUpdateHeroes(nextHeroes);
    setBuffText('');
    if (showToast) showToast(`Efecto añadido a ${activeHero.name}: ${label.trim()}`);
  };

  const buyOutworldItem = (item, kind = 'item') => {
    if (!activeHero || !onUpdateHeroes) return;
    if (ow.useStockRolls && item.stock) {
      const diceCount = settlementMeta.stockDice;
      let sum = 0;
      const rolls = [];
      for (let i = 0; i < diceCount; i++) {
        const r = rollD6();
        rolls.push(r);
        sum += r;
      }
      const passed = sum >= item.stock;
      setStockResult({
        item: item.name,
        rolls,
        sum,
        needed: item.stock,
        passed,
      });
      if (!passed) {
        if (showToast) showToast(`Sin stock de ${item.name} (${sum} < ${item.stock})`);
        return;
      }
    }
    if ((activeHero.gold || 0) < item.price) {
      if (showToast) showToast(`${activeHero.name} no tiene suficiente oro (${item.price} MO)`);
      return;
    }
    const nextHeroes = heroes.map((h) => {
      if (h.id !== activeHero.id) return h;
      if (kind === 'mount') {
        const mounts = Array.isArray(h.outworldMounts) ? h.outworldMounts : [];
        return { ...h, gold: (h.gold || 0) - item.price, outworldMounts: [...mounts, item.name] };
      }
      if (kind === 'mastery') {
        const buffs = Array.isArray(h.outworldBuffs) ? h.outworldBuffs : [];
        return {
          ...h,
          gold: (h.gold || 0) - item.price,
          outworldBuffs: [...buffs, `🎓 Maestría N${item.level}: ${item.name} (${item.effect})`],
        };
      }
      const inv = Array.isArray(h.inventory) ? h.inventory : [];
      return {
        ...h,
        gold: (h.gold || 0) - item.price,
        inventory: [
          ...inv,
          {
            id: `ow-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            name: item.name,
            type: item.type || 'Accesorio',
            rarity: 'poco_comun',
            dice: item.dice || '',
            upgrade: item.desc,
            special: item.desc,
          },
        ],
      };
    });
    onUpdateHeroes(nextHeroes);
    if (showToast) showToast(`${activeHero.name} adquirió ${item.name} (-${item.price} MO)`);
  };

  const sharpenWeaponForHero = () => {
    if (!activeHero || !onUpdateHeroes) return;
    if ((activeHero.gold || 0) < 100) {
      if (showToast) showToast(`${activeHero.name} necesita 100 MO para afilar su arma.`);
      return;
    }
    const nextHeroes = heroes.map((h) => {
      if (h.id !== activeHero.id) return h;
      const buffs = Array.isArray(h.outworldBuffs) ? h.outworldBuffs : [];
      return {
        ...h,
        gold: (h.gold || 0) - 100,
        outworldBuffs: [...buffs, '🗡️ Arma Afilada (5 ataques · 1 dado siempre Calavera)'],
      };
    });
    onUpdateHeroes(nextHeroes);
    if (showToast) showToast(`Arma de ${activeHero.name} afilada (-100 MO).`);
  };

  const rollMentorStudy = () => {
    const presentRoll = rollD6();
    if (presentRoll < 6) {
      setMentorResult({ present: false, presentRoll, title: 'Mentor Ausente', text: `Tirada 1D6 = ${presentRoll} (necesitas 6). Mentor vigila a Zargon hoy.` });
      return;
    }
    const sum = roll2D6();
    const res = lookup2D6(OUTWORLD_MENTOR_TABLE, sum);
    setMentorResult({ present: true, presentRoll, sum, ...res });
    syncOutworld({
      activeEvent: {
        table: 'Estudio de Mentor',
        code: `2D6=${sum}`,
        title: `🧙 ${res.title}`,
        text: res.text,
        ts: Date.now(),
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Barra Superior de Estado Mundial (Sincronizada al Celular) */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-amber-950/50 border border-amber-500/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-black text-amber-300 text-lg flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              Sistema Outworld Digital + HQ-D20 v2
            </h3>
            <p className="text-xs text-slate-300">
              Conectado en tiempo real a la pestaña <strong>🌍 Outworld</strong> en los celulares de los jugadores.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => syncOutworld({ strictMode: !ow.strictMode })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                ow.strictMode
                  ? 'bg-rose-900/70 border-rose-400 text-rose-100'
                  : 'bg-emerald-900/60 border-emerald-500 text-emerald-100'
              }`}
              title="Cambia entre Modo Estricto Outworld (muerte/retiro real en ciudad) y Campaña Heroica"
            >
              {ow.strictMode ? '💀 Modo Estricto Outworld' : '🛡️ Modo Campaña Heroica'}
            </button>
            <button
              onClick={() => syncOutworld({ useStockRolls: !ow.useStockRolls })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                ow.useStockRolls
                  ? 'bg-amber-600 border-amber-300 text-slate-950'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
              title="Activa o desactiva las tiradas de disponibilidad Stock (1D6/2D6/3D6)"
            >
              {ow.useStockRolls ? '🎲 Stock Activo (1D6/2D6/3D6)' : '🛒 Stock Libre'}
            </button>
          </div>
        </div>

        {/* Estado de Fase + Reloj de 10 Días */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Fase Actual</div>
              <div className="font-black text-amber-200">
                {ow.phase === 'camp'
                  ? '🏕️ Campamento'
                  : ow.phase === 'travel'
                  ? `🛤️ Viaje Día ${ow.travelDay}/${ow.travelTotal}`
                  : `${settlementMeta.icon} ${settlementMeta.name}`}
              </div>
            </div>
            <div className="flex gap-1">
              {['camp', 'travel', 'settlement'].map((ph) => (
                <button
                  key={ph}
                  onClick={() => syncOutworld({ phase: ph })}
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    ow.phase === ph ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {ph === 'camp' ? '🏕️' : ph === 'travel' ? '🛤️' : '🏰'}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between ${
              ow.settlementDay >= 10
                ? 'bg-rose-950/80 border-rose-400 animate-pulse'
                : 'bg-slate-950/70 border-slate-700/70'
            }`}
          >
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Reloj de Estancia (Regla 10 Días)</div>
              <div className="font-black text-sm text-white">
                Día {ow.settlementDay} / 10 {ow.settlementDay >= 10 && '☄️ ¡CATÁSTROFE!'}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => syncOutworld({ settlementDay: 1 })}
                className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 font-bold cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  const nextDay = ow.settlementDay + 1;
                  syncOutworld({ settlementDay: nextDay });
                  if (nextDay >= 10) {
                    setSelectedTableId('catastrophic');
                    if (showToast) showToast('☄️ ¡DÍA 10 ALCANZADO! Tira obligatoriamente en la Tabla Catastrófica.');
                  }
                }}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black cursor-pointer"
              >
                +1 Día
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Héroe Activo</div>
              <select
                value={selectedHeroId}
                onChange={(e) => setSelectedHeroId(e.target.value)}
                className="mt-0.5 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-200 font-bold w-full"
              >
                {heroes.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.gold || 0} MO)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-pestañas Outworld */}
      <div className="flex flex-wrap gap-1.5">
        {[
          ['tables', '🎲 Viaje y las 8 Tablas'],
          ['haven', '🏰 Refugio (Haven) y Mentor'],
          ['shops', '🕶️ Mercado Negro, Granja y Maestrías'],
          ['arena', `🏟️ La Arena (SC ${partySC})`],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer border ${
              subTab === id
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-500/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ==================== TAB 1: VIAJE + LAS 8 TABLAS COMPLETAS ==================== */}
      {subTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Calculadora de Viaje */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
            <h4 className="font-display font-black text-amber-300 text-sm flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Viaje por Carretera (3 Dados de Combate)
            </h4>
            <div className="flex items-center justify-between text-xs bg-slate-950/70 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-300">Reducción por Montura:</span>
              <div className="flex gap-1">
                {[
                  [0, 'A pie'],
                  [1, 'Mula (-1d)'],
                  [2, 'Caballo (-2d)'],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setMountBonus(val)}
                    className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                      mountBonus === val ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {Object.values(OUTWORLD_SETTLEMENT_TYPES).map((st) => (
                <button
                  key={st.id}
                  onClick={() => startTravelRoll(st.id)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-950/60 border border-slate-700 hover:border-amber-400 text-left cursor-pointer transition"
                >
                  <div className="text-base">{st.icon}</div>
                  <div className="text-xs font-black text-amber-200">{st.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-400">{st.travelFormula}</div>
                </button>
              ))}
            </div>

            {ow.phase === 'travel' && (
              <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-indigo-200">
                    Día {ow.travelDay} de {ow.travelTotal} hacia {settlementMeta.name}
                  </span>
                  <button
                    onClick={advanceTravelDay}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] cursor-pointer"
                  >
                    Avanzar Día (+Chequeo Doble 1)
                  </button>
                </div>
                {lostCheckMsg && <p className="text-[11px] text-amber-200">{lostCheckMsg}</p>}
              </div>
            )}

            {/* Etiqueta rápida de Buff/Maldición para la próxima misión */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-300">
                📌 Guardar Buff/Maldición de Evento en el celular de {activeHero?.name || 'Héroe'}:
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={buffText}
                  onChange={(e) => setBuffText(e.target.value)}
                  placeholder="Ej: +1 Def próx. misión (Tiefling)"
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <button
                  onClick={() => applyBuffToHero(buffText)}
                  disabled={!buffText.trim() || !activeHero}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>

          {/* Lanzador de las 8 Tablas Completas (Digital o Dados Físicos) */}
          <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-900/80 border border-amber-500/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-display font-black text-amber-300 text-sm flex items-center gap-1.5">
                <Dices className="w-4 h-4" /> Lanzador de Tablas Outworld (11–66 / 2–12)
              </h4>
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-amber-500/60 text-xs text-amber-200 font-bold"
              >
                {TABLE_REGISTRY.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => triggerTableRoll(selectedTableId, '')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs cursor-pointer shadow"
              >
                🎲 Tirar Digital y Enviar a Celulares
              </button>
              <input
                type="text"
                maxLength={2}
                value={manualRoll}
                onChange={(e) => setManualRoll(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={selectedTableId === 'catastrophic' ? '2-12' : '11-66'}
                className="w-20 px-2 py-1.5 rounded-xl bg-slate-950 border border-amber-500/60 text-center text-amber-300 font-mono text-xs"
                title="Ingresa el resultado de tus dados físicos"
              />
              <button
                onClick={() => {
                  if (manualRoll) {
                    triggerTableRoll(selectedTableId, manualRoll);
                    setManualRoll('');
                  }
                }}
                disabled={!manualRoll}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-200 font-black text-xs cursor-pointer"
              >
                Buscar Dado Físico
              </button>
            </div>

            {ow.activeEvent && (
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  ow.activeEvent.strictWarning
                    ? 'bg-rose-950/50 border-rose-500/70'
                    : ow.activeEvent.quiet
                    ? 'bg-emerald-950/40 border-emerald-500/50'
                    : 'bg-amber-950/35 border-amber-500/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                    {ow.activeEvent.table} · [{ow.activeEvent.code}]
                  </span>
                  <span className="text-[10px] text-emerald-300 font-bold">📡 Visible en celulares</span>
                </div>
                <div className="font-display font-black text-base text-amber-200">{ow.activeEvent.title}</div>
                <p className="text-xs text-slate-100 leading-relaxed">{ow.activeEvent.text}</p>
                {ow.activeEvent.combat && (
                  <div className="text-[11px] font-bold text-rose-300 bg-rose-950/50 p-2 rounded-lg border border-rose-700/50">
                    ⚔️ Mini-Combate sugerido en Sala Central (R11) · Monstruo disponible en el Bestiario ({ow.activeEvent.combat}).
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: HAVEN (ALFRED) & ESTUDIO DE MENTOR ==================== */}
      {subTab === 'haven' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-black text-amber-300 text-sm flex items-center gap-1.5">
                <Home className="w-4 h-4" /> El Refugio (Haven) · Alfred el Semielfo
              </h4>
              <button
                onClick={() => syncOutworld({ havenUnlocked: !ow.havenUnlocked })}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                  ow.havenUnlocked ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {ow.havenUnlocked ? '✓ Desbloqueado' : '🔒 Bloqueado (clic p/ activar)'}
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Salario de Alfred: <strong>20 MO/noche</strong> en la Capital. Guarda oro y gemas del grupo, y cambia gemas a oro cobrando 20% de comisión.
            </p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Oro en Bóveda</div>
                <div className="text-lg font-black text-amber-300">{ow.havenVaultGold || 0} MO</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Valor en Gemas</div>
                <div className="text-lg font-black text-cyan-300">{ow.havenVaultGems || 0} MO</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <input
                type="number"
                value={vaultAmount}
                onChange={(e) => setVaultAmount(Number(e.target.value) || 0)}
                className="w-24 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-amber-200 font-mono"
              />
              <button
                onClick={() => syncOutworld({ havenVaultGold: (ow.havenVaultGold || 0) + vaultAmount })}
                className="flex-1 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                +Oro
              </button>
              <button
                onClick={() => syncOutworld({ havenVaultGems: (ow.havenVaultGems || 0) + vaultAmount })}
                className="flex-1 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold cursor-pointer"
              >
                +Gemas
              </button>
              <button
                onClick={() => {
                  const net = Math.round((ow.havenVaultGems || 0) * 0.8);
                  syncOutworld({ havenVaultGold: (ow.havenVaultGold || 0) + net, havenVaultGems: 0 });
                  if (showToast) showToast(`Alfred cambió las gemas por ${net} MO (20% comisión).`);
                }}
                disabled={!ow.havenVaultGems}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-slate-950 text-xs font-black cursor-pointer"
              >
                Cambiar (-20%)
              </button>
            </div>
            <button
              onClick={() => {
                setSelectedTableId('haven');
                triggerTableRoll('haven', '');
                setSubTab('tables');
              }}
              className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs cursor-pointer"
            >
              🎲 Tirar Evento Diario del Haven (11–66)
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/40 space-y-3">
            <h4 className="font-display font-black text-indigo-300 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Estudio de Mentor (Capital)
            </h4>
            <p className="text-xs text-slate-300">
              Visita en grupo antes de abandonar la Capital (sin Evento de Asentamiento). Con <strong>1D6 = 6</strong>, Mentor abre el <em>Lore Tome</em> (<code>2D6</code>).
            </p>
            <button
              onClick={rollMentorStudy}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow"
            >
              🧙 Visitar a Mentor (1D6 + Lore Tome 2D6)
            </button>
            {mentorResult && (
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/50 text-xs space-y-1">
                <div className="font-black text-amber-300">
                  {mentorResult.title} {mentorResult.sum ? `(2D6 = ${mentorResult.sum})` : ''}
                </div>
                <p className="text-slate-200">{mentorResult.text}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MERCADO NEGRO, GRANJA, AFILADO Y MAESTRÍAS ==================== */}
      {subTab === 'shops' && (
        <div className="space-y-4">
          {stockResult && (
            <div
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                stockResult.passed
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500 text-rose-200'
              }`}
            >
              🎲 Tirada de Stock para {stockResult.item}: [{stockResult.rolls.join(' + ')}] = {stockResult.sum} vs Stock {stockResult.needed} →{' '}
              {stockResult.passed ? '¡DISPONIBLE!' : 'AGOTADO esta estancia'}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Mercado Negro + Afilado */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-purple-300 text-sm">
                  🕶️ Mercado Negro & Afilado de Hojas
                </h4>
                <button
                  onClick={sharpenWeaponForHero}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
                >
                  🗡️ Afilar Arma (100 MO)
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {OUTWORLD_BLACK_MARKET_ITEMS.map((it) => (
                  <div key={it.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-amber-200">
                      <span>{it.name}</span>
                      <span>{it.price} MO</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{it.desc}</p>
                    <button
                      onClick={() => buyOutworldItem(it, 'item')}
                      className="w-full py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[10px] font-black cursor-pointer"
                    >
                      Comprar (Stock {it.stock})
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Granja de Monturas + Maestrías de Gremio N1-N4 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/40 space-y-3">
              <h4 className="font-display font-black text-emerald-300 text-sm">
                🐎 Granja de Monturas & Maestrías de Gremio (N1–N4)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {OUTWORLD_MOUNTS.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-emerald-200">
                      <span>{m.name}</span>
                      <span>{m.price} MO</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{m.desc}</p>
                    <button
                      onClick={() => buyOutworldItem(m, 'mount')}
                      className="w-full py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-black cursor-pointer"
                    >
                      Adquirir (Stock {m.stock})
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5 max-h-52 overflow-y-auto pr-1">
                <div className="text-[11px] font-bold text-amber-300">🎓 Campo de Entrenamiento (7 días · 1 uso/misión)</div>
                {OUTWORLD_GUILD_MASTERIES.map((ms) => (
                  <div key={ms.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                    <div>
                      <strong className="text-amber-200">
                        [N{ms.level} · {ms.archetype}] {ms.name}
                      </strong>
                      <div className="text-[10px] text-slate-400">{ms.effect}</div>
                    </div>
                    <button
                      onClick={() => buyOutworldItem({ ...ms, price: ms.cost }, 'mastery')}
                      className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-[10px] shrink-0 cursor-pointer"
                    >
                      {ms.cost} MO
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: LA ARENA DE GLADIADORES (SC) ==================== */}
      {subTab === 'arena' && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/45 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-display font-black text-rose-300 text-base flex items-center gap-1.5">
                <Trophy className="w-5 h-5 text-amber-400" /> La Arena de Gladiadores (Inscripción: 200 MO)
              </h4>
              <p className="text-xs text-slate-300">
                Torneo de 3 rondas en cuadrante 8×8. Sin muerte permanente (+1 PC entre rondas). Premio final: <strong>Elixir de Vida</strong> o Artefacto.
              </p>
            </div>
            <div className="flex gap-1.5 text-xs font-black">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-500 text-amber-300">
                Ronda 1: SC {partySC}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-orange-500 text-orange-300">
                Ronda 2: SC {partySC + 3}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-rose-500 text-rose-300">
                Ronda 3: SC {partySC + 6}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-amber-200">⚔️ Gladiadores Oficiales (para armar cada Ronda por SC):</div>
              {OUTWORLD_ARENA_ENEMIES.map((e) => (
                <div key={e.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-100">{e.name}</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    MOV {e.mov} · AT {e.at} · DEF {e.def} · PC {e.pc} · <strong className="text-amber-300">SC {e.sc}</strong>
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
              <div className="text-xs font-black text-amber-300">📣 Ayuda del Público (Casillas X · 2D6)</div>
              <p className="text-[11px] text-slate-300">
                Si un héroe termina en casilla <code>X</code> sin enemigo adyacente, pide ayuda al público:
              </p>
              <button
                onClick={() => {
                  const sum = roll2D6();
                  const r = lookup2D6(OUTWORLD_PUBLIC_HELP_TABLE, sum);
                  setPublicHelpResult({ sum, ...r });
                }}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                🎲 Tirar Ayuda del Público (2D6)
              </button>
              {publicHelpResult && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/60 text-xs">
                  <strong className="text-amber-300">
                    [2D6 = {publicHelpResult.sum}] {publicHelpResult.title}:
                  </strong>{' '}
                  <span className="text-slate-100">{publicHelpResult.effect}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
