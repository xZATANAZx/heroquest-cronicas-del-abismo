import React, { useState, useEffect } from 'react';
import { Compass, Dices, Coins, Sparkles, Shield, Home } from 'lucide-react';
import {
  OUTWORLD_SETTLEMENT_TYPES,
  OUTWORLD_BLACK_MARKET_ITEMS,
  OUTWORLD_MOUNTS,
  OUTWORLD_EAVESDROPPING_TABLE,
  rollD6,
} from '../data/outworldTables';

export default function MobileOutworldTab({ hero, pushHeroUpdate, showToast }) {
  const [ow, setOw] = useState(null);
  const [betAmt, setBetAmt] = useState(50);
  const [wageredSession, setWageredSession] = useState(0);
  const [gameLog, setGameLog] = useState(null);
  const [eavesLog, setEavesLog] = useState(null);

  useEffect(() => {
    const fetchOw = async () => {
      try {
        const res = await fetch('/api/outworld', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.state) setOw(data.state);
        }
      } catch {
        // ignore
      }
    };
    fetchOw();
    const timer = setInterval(fetchOw, 2500);
    return () => clearInterval(timer);
  }, []);

  if (!hero) return null;

  const settlementMeta =
    OUTWORLD_SETTLEMENT_TYPES[ow?.settlementType || 'capital'] || OUTWORLD_SETTLEMENT_TYPES.capital;
  const isNimble = /elfo|pícaro|picaro|asesino|explorador/i.test(`${hero.raceName || ''} ${hero.className || ''}`);
  const isStrong = /bárbaro|barbaro|enano|guerrero|paladín/i.test(`${hero.raceName || ''} ${hero.className || ''}`);
  const myBuffs = Array.isArray(hero.outworldBuffs) ? hero.outworldBuffs : [];
  const myMounts = Array.isArray(hero.outworldMounts) ? hero.outworldMounts : [];

  const canBet = (amt) => {
    if (amt <= 0) return false;
    if ((hero.gold || 0) < amt) {
      showToast('❌ No tienes suficiente oro.');
      return false;
    }
    if (wageredSession + amt > 200) {
      showToast(`❌ Límite Outworld: máx. 200 MO por estancia (te quedan ${Math.max(0, 200 - wageredSession)} MO).`);
      return false;
    }
    return true;
  };

  // Minijuego 1: Dados (pág. 15)
  const playDiceGame = async () => {
    const amt = Math.min(200, Math.max(10, Number(betAmt) || 10));
    if (!canBet(amt)) return;
    const raw = rollD6();
    const bonus = isNimble ? 1 : 0;
    const total = Math.min(6, raw + bonus);
    setWageredSession((w) => w + amt);

    if (total <= 2) {
      await pushHeroUpdate({ ...hero, gold: (hero.gold || 0) - amt });
      setGameLog({ title: '🎲 Dados: Pierdes', text: `Sacaste ${raw}${bonus ? '+1' : ''} = ${total}. Pierdes ${amt} MO.`, tone: 'loss' });
    } else if (total <= 5) {
      setGameLog({ title: '🎲 Dados: Empate', text: `Sacaste ${raw}${bonus ? '+1' : ''} = ${total}. Recuperas tus ${amt} MO.`, tone: 'draw' });
    } else {
      const mult = rollD6();
      const win = amt * mult;
      await pushHeroUpdate({ ...hero, gold: (hero.gold || 0) + win });
      setGameLog({ title: `🎲 ¡GRAN PREMIO! (+${win} MO)`, text: `¡Sacaste 6! Multiplicador ×${mult} → ganas +${win} MO.`, tone: 'win' });
    }
  };

  // Minijuego 2: Lanzamiento de Cuchillos (3 rondas × 3D6, pág. 16)
  const playKnivesGame = async () => {
    const amt = Math.min(200, Math.max(10, Number(betAmt) || 10));
    if (!canBet(amt)) return;
    const bonus = isNimble ? 2 : 0;
    const scoreRound = (mod) => {
      const s = rollD6() + rollD6() + rollD6() + mod;
      if (s <= 6) return 0;
      if (s <= 9) return 2;
      if (s <= 12) return 3;
      if (s <= 14) return 4;
      if (s <= 16) return 5;
      return 10;
    };
    let myPts = 0;
    let rivalPts = 0;
    for (let i = 0; i < 3; i++) {
      myPts += scoreRound(bonus);
      rivalPts += scoreRound(0);
    }
    setWageredSession((w) => w + amt);
    if (myPts > rivalPts) {
      await pushHeroUpdate({ ...hero, gold: (hero.gold || 0) + amt });
      setGameLog({ title: `🗡️ Cuchillos: ¡Victoria! (+${amt} MO)`, text: `Puntos: Tú ${myPts} vs Rival ${rivalPts}. ¡Ganas +${amt} MO!`, tone: 'win' });
    } else if (myPts === rivalPts) {
      setGameLog({ title: '🗡️ Cuchillos: Empate', text: `Empate ${myPts} a ${rivalPts}. Recuperas tu apuesta.`, tone: 'draw' });
    } else {
      await pushHeroUpdate({ ...hero, gold: (hero.gold || 0) - amt });
      setGameLog({ title: '🗡️ Cuchillos: Derrota', text: `Puntos: Tú ${myPts} vs Rival ${rivalPts}. Pierdes ${amt} MO.`, tone: 'loss' });
    }
  };

  // Minijuego 3: Pulseadas (Mejor de 5 × 3D6, pág. 17)
  const playArmWrestling = async () => {
    const amt = Math.min(200, Math.max(10, Number(betAmt) || 10));
    if (!canBet(amt)) return;
    const bonus = isStrong ? 2 : 0;
    let myW = 0;
    let rivalW = 0;
    while (myW < 3 && rivalW < 3) {
      const m = rollD6() + rollD6() + rollD6() + bonus;
      const r = rollD6() + rollD6() + rollD6();
      if (m >= r) myW++;
      else rivalW++;
    }
    setWageredSession((w) => w + amt);
    if (myW >= 3) {
      await pushHeroUpdate({ ...hero, gold: (hero.gold || 0) + amt });
      setGameLog({ title: `💪 Pulseadas: ¡Ganaste! (+${amt} MO)`, text: `Marcador ${myW}–${rivalW}. ¡Cobras el doble (+${amt} MO netos)!`, tone: 'win' });
    } else {
      await pushHeroUpdate({ ...hero, gold: (hero.gold || 0) - amt });
      setGameLog({ title: '💪 Pulseadas: Derrota', text: `Marcador ${myW}–${rivalW}. Pierdes ${amt} MO.`, tone: 'loss' });
    }
  };

  // Escuchar tras Puerta (pág. 40)
  const rollEavesdrop = () => {
    const raw = rollD6();
    const bonus = isNimble ? 1 : 0;
    const total = Math.min(6, raw + bonus);
    const res = OUTWORLD_EAVESDROPPING_TABLE.find((e) => e.roll === total) || OUTWORLD_EAVESDROPPING_TABLE[1];
    setEavesLog({ raw, bonus, ...res });
  };

  // Compra rápida desde el celular (Mercado Negro / Monturas / Afilado)
  const buyFromMobile = async (item, isMount = false) => {
    if (ow?.useStockRolls && item.stock) {
      let sum = 0;
      for (let i = 0; i < settlementMeta.stockDice; i++) sum += rollD6();
      if (sum < item.stock) {
        showToast(`❌ Sin stock hoy (${sum} < ${item.stock}).`);
        return;
      }
    }
    if ((hero.gold || 0) < item.price) {
      showToast(`❌ Necesitas ${item.price} MO.`);
      return;
    }
    if (isMount) {
      await pushHeroUpdate({
        ...hero,
        gold: (hero.gold || 0) - item.price,
        outworldMounts: [...myMounts, item.name],
      });
    } else {
      await pushHeroUpdate({
        ...hero,
        gold: (hero.gold || 0) - item.price,
        inventory: [
          ...(hero.inventory || []),
          {
            id: `ow-m-${Date.now()}`,
            name: item.name,
            type: item.type || 'Consumible',
            rarity: 'poco_comun',
            dice: item.dice || '',
            upgrade: item.desc,
            special: item.desc,
          },
        ],
      });
    }
    showToast(`✅ Compraste ${item.name} (-${item.price} MO)`);
  };

  return (
    <div className="space-y-3.5 pb-4">
      {/* 1. Banner en vivo del Mundo Outworld (Sincronizado desde la PC del DM) */}
      <div className="rounded-2xl p-3.5 bg-gradient-to-br from-indigo-950/85 via-slate-900 to-amber-950/60 border border-amber-500/50 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-black text-amber-300 text-sm flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Outworld en Vivo
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-amber-500/50 text-[10px] font-black text-amber-200">
            {ow?.phase === 'travel'
              ? `🛤️ Viaje Día ${ow.travelDay}/${ow.travelTotal}`
              : ow?.phase === 'camp'
              ? '🏕️ Campamento'
              : `${settlementMeta.icon} ${settlementMeta.name} · Día ${ow?.settlementDay || 1}/10`}
          </span>
        </div>

        {/* Alerta de Random Event en Mazmorra */}
        {ow?.randomDungeonEvent && Date.now() - (ow.randomDungeonEvent.ts || 0) < 15 * 60 * 1000 && (
          <div className="p-2.5 rounded-xl bg-rose-950/75 border border-rose-400/70 text-xs space-y-1">
            <div className="font-black text-rose-200">
              🎲 Random Event [{ow.randomDungeonEvent.code}]: {ow.randomDungeonEvent.title}
            </div>
            <p className="text-[11px] text-rose-100 leading-snug">{ow.randomDungeonEvent.text}</p>
          </div>
        )}

        {/* Evento Actual de Viaje / Ciudad / Taberna / Haven */}
        {ow?.activeEvent && (
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/50 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-300">
                [{ow.activeEvent.table} · {ow.activeEvent.code}] {ow.activeEvent.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">{ow.activeEvent.text}</p>
          </div>
        )}

        {ow?.havenUnlocked && (
          <div className="flex items-center justify-between text-[11px] bg-slate-950/70 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-cyan-300 font-bold flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Haven (Alfred):
            </span>
            <span className="text-amber-200 font-mono">
              💰 {ow.havenVaultGold || 0} MO · 💎 {ow.havenVaultGems || 0} MO
            </span>
          </div>
        )}
      </div>

      {/* 2. Mis Buffs de Próxima Misión y Monturas */}
      {(myBuffs.length > 0 || myMounts.length > 0) && (
        <div className="grimoire-panel rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300">✨ Efectos Activos y Monturas</span>
            {myBuffs.length > 0 && (
              <button
                onClick={() => pushHeroUpdate({ ...hero, outworldBuffs: [] })}
                className="text-[10px] text-slate-400 underline cursor-pointer"
              >
                Limpiar buffs
              </button>
            )}
          </div>
          {myMounts.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {myMounts.map((m, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-200 text-[10px] font-bold">
                  🐎 {m}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-1">
            {myBuffs.map((b, idx) => (
              <div key={idx} className="px-2.5 py-1.5 rounded-lg bg-purple-950/40 border border-purple-600/40 text-[11px] text-purple-100">
                {b}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Escuchar tras Puerta (Regla Outworld pág. 40) */}
      <div className="grimoire-panel rounded-2xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-indigo-300">👂 Escuchar tras Puerta (Mazmorra)</div>
            <div className="text-[10px] text-slate-400">
              Acción completa antes de abrir ({isNimble ? '+1 automático por tu clase/raza' : '1D6 estándar'}).
            </div>
          </div>
          <button
            onClick={rollEavesdrop}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] cursor-pointer"
          >
            Tirar 1D6
          </button>
        </div>
        {eavesLog && (
          <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/50 text-[11px]">
            <strong className="text-amber-300">
              [1D6={eavesLog.raw}{eavesLog.bonus ? '+1' : ''}] {eavesLog.label}:
            </strong>{' '}
            {eavesLog.text}
          </div>
        )}
      </div>

      {/* 4. Casa de Apuestas Interactiva (3 Minijuegos · Máx 200 MO/estancia) */}
      <div className="grimoire-panel rounded-2xl p-3.5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-display font-black text-amber-300 flex items-center gap-1.5">
            <Dices className="w-4 h-4" /> Casa de Apuestas
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Apostado: {wageredSession}/200 MO · 💰 {hero.gold || 0} MO
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-300">Apuesta:</span>
          {[20, 50, 100].map((v) => (
            <button
              key={v}
              onClick={() => setBetAmt(v)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer ${
                betAmt === v ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {v} MO
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={playDiceGame}
            className="py-2 px-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-[11px] cursor-pointer"
          >
            🎲 Dados
          </button>
          <button
            onClick={playKnivesGame}
            className="py-2 px-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-black text-[11px] cursor-pointer"
          >
            🗡️ Cuchillos
          </button>
          <button
            onClick={playArmWrestling}
            className="py-2 px-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-black text-[11px] cursor-pointer"
          >
            💪 Pulseadas
          </button>
        </div>

        {gameLog && (
          <div
            className={`p-2.5 rounded-xl border text-[11px] ${
              gameLog.tone === 'win'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100'
                : gameLog.tone === 'loss'
                ? 'bg-rose-950/60 border-rose-500 text-rose-100'
                : 'bg-slate-900 border-slate-600 text-slate-200'
            }`}
          >
            <div className="font-black">{gameLog.title}</div>
            <div>{gameLog.text}</div>
          </div>
        )}
      </div>

      {/* 5. Mercado Negro & Monturas rápidas desde el celular */}
      <div className="grimoire-panel rounded-2xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-purple-300">🕶️ Mercado Negro & Monturas</span>
          <span className="text-[10px] text-slate-400">
            {ow?.useStockRolls ? `Stock ${settlementMeta.stockDice}D6 activo` : 'Stock libre'}
          </span>
        </div>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {OUTWORLD_BLACK_MARKET_ITEMS.slice(0, 6).map((it) => (
            <div key={it.id} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-amber-200 text-[11px]">{it.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{it.desc}</div>
              </div>
              <button
                onClick={() => buyFromMobile(it, false)}
                className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-black text-[10px] shrink-0 cursor-pointer"
              >
                {it.price} MO
              </button>
            </div>
          ))}
          {OUTWORLD_MOUNTS.slice(0, 2).map((m) => (
            <div key={m.id} className="p-2 rounded-xl bg-slate-950/80 border border-emerald-900/50 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-emerald-200 text-[11px]">🐎 {m.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{m.desc}</div>
              </div>
              <button
                onClick={() => buyFromMobile(m, true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-black text-[10px] shrink-0 cursor-pointer"
              >
                {m.price} MO
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
