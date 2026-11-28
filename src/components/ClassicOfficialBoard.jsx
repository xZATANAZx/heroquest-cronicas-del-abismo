import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Package,
  AlertTriangle,
  MapPin,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Skull,
  Shield,
  Maximize2,
  Minimize2,
  Dices,
  X,
  RotateCcw,
  Crown,
  ScrollText,
  FlaskConical,
  Swords,
} from 'lucide-react';
import {
  BOARD_COLS,
  BOARD_ROWS,
  HQ_ROOMS,
  PIECE_TYPES,
  OFFICIAL_QUEST_MAPS,
  getRoomAt,
  getRoomObj,
  getRoomCells,
} from '../data/officialBoardMaps';
import { EXPANSION_BOARD_MAPS, DREAD_MOON_QUESTS } from '../data/expansionQuests';
import { QUESTS } from '../data/quests';
import {
  OFFICIAL_ARTIFACTS,
  OFFICIAL_ALCHEMY_DECK,
  OFFICIAL_DREAD_SPELLS,
  OFFICIAL_ELEMENTAL_SPELLS,
  OFFICIAL_KNIGHT_SKILLS,
  OFFICIAL_ELVEN_MERCENARIES,
} from '../data/officialCards';
import {
  CLASSIC_HERO_PROFILES,
  CLASSIC_MONSTERS,
  CLASSIC_TREASURE_DECK,
  CLASSIC_ARMORY,
  CLASSIC_TRAP_RULES,
  DREAD_MOON_OFFICIAL_RULES,
  CLASSIC_FURNITURE_DECK,
  CLASSIC_EVIL_WIZARD_DECK,
} from '../data/classicOfficialData';
import {
  FurnitureSVG,
  StairsSVG,
  DoorSVG,
  BlockedWallSVG,
  TrapSVG,
  MonsterIconSVG,
  getPieceIconSrc,
} from './BoardPiecesSVG';

const COL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const CELL = 32;
const MARGIN_LEFT = 24;
const MARGIN_TOP = 22;
const SVG_W = MARGIN_LEFT + BOARD_COLS * CELL + 8;
const SVG_H = MARGIN_TOP + BOARD_ROWS * CELL + 8;

const coordLabel = (x, y) => `${COL_LETTERS[x]}${y + 1}`;

// Dado de Combate Oficial de HeroQuest (6 caras: 3 Calaveras, 2 Escudos Blancos, 1 Escudo Negro)
const HQ_COMBAT_FACES = [
  { type: 'skull', label: 'Calavera', icon: '💀', cls: 'bg-red-950 border-red-400 text-red-100' },
  { type: 'skull', label: 'Calavera', icon: '💀', cls: 'bg-red-950 border-red-400 text-red-100' },
  { type: 'skull', label: 'Calavera', icon: '💀', cls: 'bg-red-950 border-red-400 text-red-100' },
  { type: 'white', label: 'Escudo Blanco', icon: '🛡️', cls: 'bg-sky-950 border-sky-300 text-sky-100' },
  { type: 'white', label: 'Escudo Blanco', icon: '🛡️', cls: 'bg-sky-950 border-sky-300 text-sky-100' },
  { type: 'black', label: 'Escudo Negro', icon: '🖤', cls: 'bg-stone-900 border-amber-400 text-amber-200' },
];

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ClassicOfficialBoard({ showToast = null }) {
  // Campaña oficial: Juego Base (14) o La Luna del Terror (10)
  const [campaignFilter, setCampaignFilter] = useState('base'); // 'base' | 'dread_moon'

  const dreadMoonMaps = useMemo(
    () => (EXPANSION_BOARD_MAPS || []).filter((m) => String(m.id || '').startsWith('dm')),
    []
  );

  const availableMaps = useMemo(
    () => (campaignFilter === 'dread_moon' ? dreadMoonMaps : OFFICIAL_QUEST_MAPS),
    [campaignFilter, dreadMoonMaps]
  );

  const [selectedMapId, setSelectedMapId] = useState(OFFICIAL_QUEST_MAPS[0].id);

  const currentMap = useMemo(() => {
    const found = availableMaps.find((m) => m.id === selectedMapId);
    return found || availableMaps[0] || OFFICIAL_QUEST_MAPS[0];
  }, [availableMaps, selectedMapId]);

  const linkedQuestMeta = useMemo(() => {
    if (campaignFilter === 'dread_moon') {
      return DREAD_MOON_QUESTS.find((q) => q.officialMapId === currentMap.id || q.id === currentMap.id) || null;
    }
    return QUESTS.find((q) => q.officialMapId === currentMap.id) || null;
  }, [campaignFilter, currentMap.id]);

  // Estado del Tablero Oficial
  const [selectedRoomId, setSelectedRoomId] = useState(currentMap.startRoom || 'R14');
  const [selectedMonsterKey, setSelectedMonsterKey] = useState(null);
  const [selectedTrapKey, setSelectedTrapKey] = useState(null);
  const [rightTab, setRightTab] = useState('room'); // 'room' | 'notes' | 'bestiary'
  const [revealedRooms, setRevealedRooms] = useState(() => new Set([currentMap.startRoom || 'R14']));
  const [showFogOverlay, setShowFogOverlay] = useState(true);
  const [disarmedTraps, setDisarmedTraps] = useState(() => new Set());
  const [monsterHP, setMonsterHP] = useState({});
  const [showIntro, setShowIntro] = useState(true);

  // Modo Pantalla Completa (Mesa Oficial DM)
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  // Mazo Oficial de Tesoro (24 cartas con descarte real y retorno de Errantes/Trampas)
  const [treasureDeck, setTreasureDeck] = useState(() => shuffleArray(CLASSIC_TREASURE_DECK));
  const [discardedTreasures, setDiscardedTreasures] = useState([]);

  // Mazo Clásico del Malvado Brujo (24 cartas + Mano de Zargon para cartas "Guardar")
  const [evilWizardDeck, setEvilWizardDeck] = useState(() => shuffleArray(CLASSIC_EVIL_WIZARD_DECK));
  const [zargonHand, setZargonHand] = useState([]);

  // Mobiliario Original examinado en esta misión (para no repetir cartas ni muebles)
  const [examinedFurnitureKeys, setExaminedFurnitureKeys] = useState(() => new Set());
  const [usedFurnitureCardIds, setUsedFurnitureCardIds] = useState(() => new Set());

  // Hechizos del Terror usados en esta misión
  const [usedDreadSpells, setUsedDreadSpells] = useState(() => new Set());

  // Ventana Modal Grande para Carta Robada (Tesoro / Hechizo del Terror / Poción de Alquimia)
  const [cardModal, setCardModal] = useState(null);

  // Modales de Referencia Oficial (Dados HQ / Artefactos / Armería / Reglas Oficiales)
  const [refModal, setRefModal] = useState(null); // null | 'dice' | 'artifacts' | 'armory' | 'alchemy' | 'dread_spells' | 'rules'

  // Estado del Lanzador de Dados Oficial HQ (Solo Dados de Combate + Dados Rojos)
  const [combatRoll, setCombatRoll] = useState([]);
  const [moveRoll, setMoveRoll] = useState([]);

  const switchCampaign = (nextCamp) => {
    setCampaignFilter(nextCamp);
    const list = nextCamp === 'dread_moon' ? dreadMoonMaps : OFFICIAL_QUEST_MAPS;
    if (list[0]) {
      resetBoardForMap(list[0]);
    }
  };

  const resetBoardForMap = (mapObj) => {
    setSelectedMapId(mapObj.id);
    setSelectedRoomId(mapObj.startRoom || 'R14');
    setRevealedRooms(new Set([mapObj.startRoom || 'R14']));
    setSelectedMonsterKey(null);
    setSelectedTrapKey(null);
    setDisarmedTraps(new Set());
    setMonsterHP({});
    setTreasureDeck(shuffleArray(CLASSIC_TREASURE_DECK));
    setDiscardedTreasures([]);
    setEvilWizardDeck(shuffleArray(CLASSIC_EVIL_WIZARD_DECK));
    setZargonHand([]);
    setExaminedFurnitureKeys(new Set());
    setUsedFurnitureCardIds(new Set());
    setUsedDreadSpells(new Set());
    setShowIntro(true);
  };

  const switchQuestMap = (mapId) => {
    const target = availableMaps.find((m) => m.id === mapId);
    if (target) resetBoardForMap(target);
  };

  const toggleFullscreenMode = () => {
    setIsFullscreenMode((prev) => {
      const next = !prev;
      if (next) {
        setShowIntro(false);
        try {
          if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } catch {
          // ignore
        }
      } else {
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreenMode(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (cardModal) setCardModal(null);
        else if (refModal) setRefModal(null);
        else if (isFullscreenMode && !document.fullscreenElement) setIsFullscreenMode(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [cardModal, refModal, isFullscreenMode]);

  // Robar carta oficial del Mazo de Tesoro (con regla oficial de retorno al mazo vs descarte)
  const drawOfficialTreasure = () => {
    let deck = treasureDeck;
    if (deck.length === 0) {
      deck = shuffleArray(CLASSIC_TREASURE_DECK);
      setDiscardedTreasures([]);
    }
    const [drawn, ...rest] = deck;
    if (drawn.returnToDeck) {
      setTreasureDeck(shuffleArray([...rest, drawn]));
    } else {
      setTreasureDeck(rest);
      setDiscardedTreasures((prev) => [drawn, ...prev]);
    }
    const isWM = drawn.title === 'Monstruo Errante';
    setCardModal({
      kind: drawn.category === 'Peligro' ? 'danger' : 'treasure',
      header: 'Mazo Oficial de Tesoro',
      badge: drawn.returnToDeck ? 'Vuelve al mazo y se baraja' : 'Se descarta hasta la próxima Misión',
      icon: drawn.icon,
      title: isWM ? `Monstruo Errante: ${currentMap.wanderingMonster}` : drawn.title,
      text: drawn.text,
      wanderingMonster: isWM ? currentMap.wanderingMonster : null,
      onDrawAnother: drawOfficialTreasure,
      drawAnotherLabel: '💎 Robar Otra Carta de Tesoro',
    });
  };

  // Robar Hechizo del Terror oficial
  const drawOfficialDreadSpell = () => {
    const pool = OFFICIAL_DREAD_SPELLS.filter(
      (s) =>
        (campaignFilter === 'dread_moon' || s.expansion === 'Juego Base') &&
        !usedDreadSpells.has(s.id)
    );
    const list = pool.length > 0 ? pool : OFFICIAL_DREAD_SPELLS.filter((s) => campaignFilter === 'dread_moon' || s.expansion === 'Juego Base');
    const picked = list[Math.floor(Math.random() * list.length)];
    setUsedDreadSpells((prev) => {
      const next = new Set(prev);
      next.add(picked.id);
      return next;
    });
    setCardModal({
      kind: 'dread',
      header: `Hechizo del Terror · ${picked.expansion}`,
      badge: 'Carta Oficial de Zargon',
      icon: '💀',
      title: picked.name,
      text: picked.text,
      onDrawAnother: drawOfficialDreadSpell,
      drawAnotherLabel: '💀 Robar Otro Hechizo del Terror',
    });
  };

  // Robar Carta Clásica del Malvado Brujo (Evil Wizard Deck)
  const drawClassicEvilWizard = () => {
    let deck = evilWizardDeck;
    if (deck.length === 0) {
      deck = shuffleArray(CLASSIC_EVIL_WIZARD_DECK);
    }
    const [drawn, ...rest] = deck;
    setEvilWizardDeck(rest);
    setCardModal({
      kind: 'evil_wizard',
      header: 'Mazo Clásico del Malvado Brujo',
      badge: drawn.timing === 'Guardar' ? '✋ Carta para Guardar en Mano de Zargon' : '⚡ Instantánea (Se juega ahora)',
      icon: drawn.icon,
      title: drawn.title,
      text: drawn.text,
      saveableCard: drawn.timing === 'Guardar' ? drawn : null,
      onDrawAnother: drawClassicEvilWizard,
      drawAnotherLabel: '🧙 Robar Otra del Malvado Brujo',
    });
  };

  // Examinar Mueble Original (100% reglas clásicas HeroQuest sin D20)
  const examineClassicFurniture = (item, fKey) => {
    const poolAll = CLASSIC_FURNITURE_DECK[item.type] || CLASSIC_FURNITURE_DECK.table;
    const fresh = poolAll.filter((c) => !usedFurnitureCardIds.has(c.id));
    const list = fresh.length > 0 ? fresh : poolAll;
    const drawn = list[Math.floor(Math.random() * list.length)];

    setExaminedFurnitureKeys((prev) => {
      const next = new Set(prev);
      next.add(fKey);
      return next;
    });
    setUsedFurnitureCardIds((prev) => {
      const next = new Set(prev);
      next.add(drawn.id);
      return next;
    });

    const isWM = drawn.title.includes('Monstruo Errante');
    setCardModal({
      kind: drawn.kind === 'Peligro' ? 'danger' : 'treasure',
      header: `Mobiliario Original · ${item.info?.label || 'Mueble'} (${item.coord})`,
      badge: drawn.kind,
      icon: drawn.icon,
      title: isWM ? `¡Monstruo Errante: ${currentMap.wanderingMonster}!` : drawn.title,
      text: drawn.text,
      onDrawAnother: () => examineClassicFurniture(item, fKey),
      drawAnotherLabel: `🪑 Volver a Tirar (${item.info?.label || 'Mueble'})`,
    });
  };

  // Robar Poción del Mazo Oficial de Alquimia (La Luna del Terror)
  const drawOfficialAlchemy = () => {
    const picked = OFFICIAL_ALCHEMY_DECK[Math.floor(Math.random() * OFFICIAL_ALCHEMY_DECK.length)];
    setCardModal({
      kind: 'alchemy',
      header: 'Mazo Oficial de Alquimia (La Luna del Terror)',
      badge: `Valor Oficial: ${picked.price} MO · ${picked.dice}`,
      icon: '⚗️',
      title: picked.name,
      text: picked.text,
      onDrawAnother: drawOfficialAlchemy,
      drawAnotherLabel: '⚗️ Robar Otra Poción de Alquimia',
    });
  };

  // Tirar Dados Oficiales de HeroQuest
  const rollHQCombat = (count) => {
    const res = Array.from({ length: count }, () => HQ_COMBAT_FACES[Math.floor(Math.random() * 6)]);
    setCombatRoll(res);
  };
  const rollHQMove = (count) => {
    const res = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
    setMoveRoll(res);
  };

  // Cálculo de paredes oficiales del tablero 26×19
  const wallSegments = useMemo(() => {
    const segs = [];
    for (let y = 0; y < BOARD_ROWS; y += 1) {
      for (let x = 0; x < BOARD_COLS; x += 1) {
        const cur = getRoomAt(x, y);
        if (x + 1 < BOARD_COLS && getRoomAt(x + 1, y) !== cur) {
          segs.push({
            x1: MARGIN_LEFT + (x + 1) * CELL,
            y1: MARGIN_TOP + y * CELL,
            x2: MARGIN_LEFT + (x + 1) * CELL,
            y2: MARGIN_TOP + (y + 1) * CELL,
          });
        }
        if (y + 1 < BOARD_ROWS && getRoomAt(x, y + 1) !== cur) {
          segs.push({
            x1: MARGIN_LEFT + x * CELL,
            y1: MARGIN_TOP + (y + 1) * CELL,
            x2: MARGIN_LEFT + (x + 1) * CELL,
            y2: MARGIN_TOP + (y + 1) * CELL,
          });
        }
      }
    }
    return segs;
  }, []);

  const allMapItems = currentMap.items || [];

  const activeMissionRooms = useMemo(() => {
    const set = new Set();
    if (Array.isArray(currentMap.darkCells) && currentMap.darkCells.length > 0) {
      const darkSet = new Set(currentMap.darkCells);
      for (const r of HQ_ROOMS) {
        const cells = getRoomCells(r);
        if (cells.some((c) => !darkSet.has(`${c.x},${c.y}`))) set.add(r.id);
      }
      return set;
    }
    if (currentMap.startRoom) set.add(currentMap.startRoom);
    allMapItems.forEach((it) => {
      const rA = getRoomAt(it.x, it.y);
      if (rA !== 'CORRIDOR') set.add(rA);
    });
    return set;
  }, [allMapItems, currentMap]);

  const getMonsterKey = (item) => `${currentMap.id}-${item.type}-${item.x}-${item.y}`;
  const getTrapKey = (item) => `${currentMap.id}-trap-${item.type}-${item.x}-${item.y}`;

  const roomItems = useMemo(() => {
    return allMapItems
      .filter((it) => getRoomAt(it.x, it.y) === selectedRoomId)
      .map((it) => ({
        ...it,
        info: PIECE_TYPES[it.type],
        coord: coordLabel(it.x, it.y),
      }));
  }, [allMapItems, selectedRoomId]);

  const selectedRoomObj = getRoomObj(selectedRoomId);
  const roomNotes = (currentMap.notes || []).filter((n) => n.room === selectedRoomId);

  const selectedMonsterObj = useMemo(() => {
    if (!selectedMonsterKey) return null;
    const item = allMapItems.find((it) => PIECE_TYPES[it.type]?.monsterId && getMonsterKey(it) === selectedMonsterKey);
    if (!item) return null;
    const base = CLASSIC_MONSTERS[item.type] || CLASSIC_MONSTERS.orc;
    const curPC = monsterHP[selectedMonsterKey] !== undefined ? monsterHP[selectedMonsterKey] : base.pc;
    return {
      key: selectedMonsterKey,
      item: { ...item, coord: coordLabel(item.x, item.y) },
      base,
      currentPC: curPC,
    };
  }, [selectedMonsterKey, allMapItems, monsterHP]);

  const selectedTrapObj = useMemo(() => {
    if (!selectedTrapKey) return null;
    const item = allMapItems.find(
      (it) =>
        (it.type === 'trap_pit' || it.type === 'trap_spear' || it.type === 'trap_falling_rock') &&
        getTrapKey(it) === selectedTrapKey
    );
    if (!item) return null;
    return {
      key: selectedTrapKey,
      item: { ...item, coord: coordLabel(item.x, item.y) },
      rules: CLASSIC_TRAP_RULES[item.type] || CLASSIC_TRAP_RULES.trap_pit,
      disarmed: disarmedTraps.has(selectedTrapKey),
    };
  }, [selectedTrapKey, allMapItems, disarmedTraps]);

  const groupedChecklist = useMemo(() => {
    const groups = { Estructura: {}, Mobiliario: {}, Monstruos: {} };
    allMapItems.forEach((it) => {
      const info = PIECE_TYPES[it.type];
      if (!info) return;
      const cat = info.category === 'Monstruo' ? 'Monstruos' : info.category === 'Mobiliario' ? 'Mobiliario' : 'Estructura';
      if (!groups[cat][it.type]) groups[cat][it.type] = { type: it.type, info, count: 0 };
      groups[cat][it.type].count += 1;
    });
    return groups;
  }, [allMapItems]);

  const toggleRevealRoom = (roomId) => {
    setRevealedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) next.delete(roomId);
      else next.add(roomId);
      return next;
    });
  };

  const adjustMonsterHP = (key, maxPC, delta) => {
    setMonsterHP((prev) => {
      const cur = prev[key] !== undefined ? prev[key] : maxPC;
      return { ...prev, [key]: Math.max(0, Math.min(maxPC + 10, cur + delta)) };
    });
  };

  const missionIntroText = linkedQuestMeta?.intro || currentMap.readAloudIntro || '';

  return (
    <div className={isFullscreenMode ? 'fixed inset-0 z-40 bg-[#0b0f17] flex flex-col overflow-hidden' : 'space-y-4'}>
      {/* ==================== BARRA SUPERIOR: PANTALLA COMPLETA vs NORMAL ==================== */}
      {isFullscreenMode ? (
        <div className="shrink-0 bg-[#14100d] border-b border-amber-900/60 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shadow-lg">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 font-display font-black text-amber-300 pr-1">
              <Crown className="w-4 h-4 text-amber-400" /> HQ CLÁSICO
            </span>
            <div className="flex rounded-lg overflow-hidden border border-amber-800/70">
              <button
                type="button"
                onClick={() => switchCampaign('base')}
                className={`px-2 py-1 text-[11px] font-bold cursor-pointer ${
                  campaignFilter === 'base' ? 'bg-amber-500 text-slate-950' : 'bg-stone-950 text-stone-300'
                }`}
              >
                🏰 Base
              </button>
              <button
                type="button"
                onClick={() => switchCampaign('dread_moon')}
                className={`px-2 py-1 text-[11px] font-bold cursor-pointer ${
                  campaignFilter === 'dread_moon' ? 'bg-indigo-500 text-white' : 'bg-stone-950 text-stone-300'
                }`}
              >
                🌙 Luna del Terror
              </button>
            </div>
            <select
              value={currentMap.id}
              onChange={(e) => switchQuestMap(e.target.value)}
              className="max-w-[230px] px-2.5 py-1 rounded-lg bg-stone-950 border border-amber-500/70 text-amber-200 font-bold text-xs cursor-pointer truncate"
            >
              {availableMaps.map((m, idx) => (
                <option key={m.id} value={m.id} className="bg-stone-900">
                  M{idx + 1}: {m.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowFogOverlay((v) => !v)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 cursor-pointer ${
                showFogOverlay ? 'bg-stone-900 border-stone-700 text-stone-300' : 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
              }`}
            >
              {showFogOverlay ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              Niebla
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {missionIntroText && (
              <button
                type="button"
                onClick={() => setShowIntro((s) => !s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 cursor-pointer ${
                  showIntro ? 'bg-amber-500 text-slate-950 border-amber-300' : 'bg-stone-900 border-amber-700/60 text-amber-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Pergamino
              </button>
            )}
            <button
              type="button"
              onClick={() => setRefModal('dice')}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" /> Dados HQ
            </button>
            <button
              type="button"
              onClick={() => setRefModal('artifacts')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 border border-amber-700/60 text-amber-200 font-bold text-[11px] cursor-pointer"
            >
              🏆 Artefactos
            </button>
            <button
              type="button"
              onClick={() => setRefModal('armory')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 font-bold text-[11px] cursor-pointer"
            >
              🛡️ Armería
            </button>
            <button
              type="button"
              onClick={() => setRefModal('rules')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-sky-200 font-bold text-[11px] cursor-pointer"
            >
              📜 Reglas
            </button>
            <button
              type="button"
              onClick={toggleFullscreenMode}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer shadow"
            >
              <Minimize2 className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>
      ) : (
        <div className="grimoire-panel rounded-2xl p-4 border-amber-500/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="font-display text-lg font-black text-amber-200">
                  HeroQuest Clásico — 100% Reglas y Contenido Oficial
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Juego Base (14 Misiones) + La Luna del Terror (10 Misiones). Sin D20, sin escalado ni reglas caseras: solo cartas, bestiario y narrativas oficiales.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreenMode}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Maximize2 className="w-4 h-4" /> Pantalla Completa
              </button>
              <button
                type="button"
                onClick={() => setRefModal('dice')}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-amber-600/60 text-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Dices className="w-4 h-4" /> Dados HQ
              </button>
              <button
                type="button"
                onClick={() => setRefModal('rules')}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-sky-200 text-xs font-bold cursor-pointer"
              >
                📜 Reglas Oficiales
              </button>
            </div>
          </div>

          {/* Selector de Campaña Oficial + Misión + Botones de Mazos Oficiales */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl overflow-hidden border border-amber-700/70">
                <button
                  type="button"
                  onClick={() => switchCampaign('base')}
                  className={`px-3 py-1.5 text-xs font-black cursor-pointer transition ${
                    campaignFilter === 'base'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-stone-950 text-stone-300 hover:text-white'
                  }`}
                >
                  🏰 Juego Base (14)
                </button>
                <button
                  type="button"
                  onClick={() => switchCampaign('dread_moon')}
                  className={`px-3 py-1.5 text-xs font-black cursor-pointer transition ${
                    campaignFilter === 'dread_moon'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-stone-950 text-stone-300 hover:text-white'
                  }`}
                >
                  🌙 La Luna del Terror (10)
                </button>
              </div>

              <select
                value={currentMap.id}
                onChange={(e) => switchQuestMap(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-stone-950 border border-amber-500/70 text-amber-200 font-bold text-xs cursor-pointer"
              >
                {availableMaps.map((m, idx) => (
                  <option key={m.id} value={m.id} className="bg-stone-900">
                    Misión {idx + 1}: {m.title}
                  </option>
                ))}
              </select>

              {missionIntroText && (
                <button
                  type="button"
                  onClick={() => setShowIntro((s) => !s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                    showIntro
                      ? 'bg-amber-600 text-slate-950 border-amber-300'
                      : 'bg-stone-900 border-amber-700/60 text-amber-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Pergamino
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={drawOfficialTreasure}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black cursor-pointer shadow"
              >
                💎 Tesoro ({treasureDeck.length})
              </button>
              <button
                type="button"
                onClick={drawClassicEvilWizard}
                className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-black cursor-pointer shadow"
                title="Mazo Clásico del Malvado Brujo (24 cartas originales sin D20)"
              >
                🧙 Malvado Brujo ({evilWizardDeck.length})
              </button>
              <button
                type="button"
                onClick={drawOfficialDreadSpell}
                className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-black cursor-pointer shadow"
              >
                💀 Hechizo del Terror
              </button>
              <button
                type="button"
                onClick={drawOfficialAlchemy}
                className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-black cursor-pointer shadow"
              >
                ⚗️ Alquimia (Luna)
              </button>
              <button
                type="button"
                onClick={() => setRefModal('artifacts')}
                className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-700/60 text-amber-200 text-xs font-bold cursor-pointer"
              >
                🏆 Artefactos
              </button>
              <button
                type="button"
                onClick={() => setRefModal('armory')}
                className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold cursor-pointer"
              >
                🛡️ Armería
              </button>
            </div>
          </div>

          {/* Pergamino Oficial de la Misión (Solo lectura oficial en voz alta) */}
          {showIntro && missionIntroText && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-stone-900/95 to-stone-900/95 border border-amber-500/60 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-black text-amber-300 flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-amber-400" />
                  Pergamino Oficial — {currentMap.title}
                </span>
                <button
                  onClick={() => setShowIntro(false)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-bold cursor-pointer"
                >
                  Ocultar ✕
                </button>
              </div>
              <p className="font-lore text-sm sm:text-base italic text-amber-50 leading-relaxed">
                {missionIntroText}
              </p>
              <div className="pt-1.5 border-t border-amber-900/40 flex flex-wrap items-center gap-4 text-xs">
                <span className="text-red-300 font-bold">
                  👹 Monstruo Errante Oficial: <strong className="text-white">{currentMap.wanderingMonster}</strong>
                </span>
                {campaignFilter === 'dread_moon' && (
                  <span className="text-indigo-300 font-bold">
                    🌙 Expansión: La Luna del Terror (Elethorn)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== CUERPO PRINCIPAL: TABLERO + PANEL DM OFICIAL ==================== */}
      <div
        className={
          isFullscreenMode
            ? 'flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden'
            : 'grid grid-cols-1 xl:grid-cols-12 gap-5 items-start'
        }
      >
        {/* TABLERO PERGAMINO OFICIAL 26×19 */}
        <div
          className={
            isFullscreenMode
              ? 'flex-1 min-w-0 min-h-0 flex flex-col p-2 sm:p-3 gap-2 overflow-hidden'
              : 'xl:col-span-8 parchment-sheet rounded-2xl p-3 sm:p-4 overflow-x-auto shadow-2xl'
          }
        >
          <div
            className={
              isFullscreenMode
                ? 'flex-1 min-h-0 parchment-sheet rounded-2xl p-2 sm:p-3 flex flex-col shadow-2xl overflow-hidden'
                : ''
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 px-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm text-stone-900 uppercase tracking-wider">
                  {currentMap.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-900/15 border border-amber-900/30 text-[10px] font-black text-amber-950">
                  Salas: {revealedRooms.size}/{HQ_ROOMS.length}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-900/15 border border-red-900/30 text-[10px] font-black text-red-950">
                  👹 Errante: {currentMap.wanderingMonster}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isFullscreenMode && (
                  <button
                    type="button"
                    onClick={toggleFullscreenMode}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Pantalla Completa
                  </button>
                )}
                <span className="text-[11px] font-bold text-amber-950">
                  Toca una sala, monstruo o trampa
                </span>
              </div>
            </div>

            <div className={isFullscreenMode ? 'flex-1 min-h-0 flex items-center justify-center overflow-hidden' : ''}>
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                preserveAspectRatio="xMidYMid meet"
                className={
                  isFullscreenMode
                    ? 'w-full h-full max-w-full max-h-full rounded-lg border-2 border-[#3b2c1e] bg-[#e7dbc0]'
                    : 'w-full min-w-[740px] h-auto rounded-lg border-2 border-[#3b2c1e] bg-[#e7dbc0]'
                }
              >
                {/* Coordenadas A–Z */}
                {COL_LETTERS.map((letter, idx) => (
                  <text
                    key={letter}
                    x={MARGIN_LEFT + idx * CELL + CELL / 2}
                    y={15}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#4a3826"
                  >
                    {letter}
                  </text>
                ))}
                {/* Coordenadas 1–19 */}
                {Array.from({ length: BOARD_ROWS }, (_, rowIdx) => (
                  <text
                    key={rowIdx}
                    x={MARGIN_LEFT - 6}
                    y={MARGIN_TOP + rowIdx * CELL + CELL / 2 + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="800"
                    fill="#4a3826"
                  >
                    {rowIdx + 1}
                  </text>
                ))}

                {/* Fondo Pasillos */}
                <rect
                  x={MARGIN_LEFT}
                  y={MARGIN_TOP}
                  width={BOARD_COLS * CELL}
                  height={BOARD_ROWS * CELL}
                  fill={selectedRoomId === 'CORRIDOR' ? '#e7dac2' : '#dfd2bc'}
                  onClick={() => setSelectedRoomId('CORRIDOR')}
                  className="cursor-pointer"
                />

                {/* Habitaciones Oficiales */}
                {HQ_ROOMS.map((r) => {
                  const cells = getRoomCells(r);
                  const rx = MARGIN_LEFT + r.x1 * CELL;
                  const ry = MARGIN_TOP + r.y1 * CELL;
                  const isSelected = r.id === selectedRoomId;
                  const isRevealed = revealedRooms.has(r.id);
                  const isUsedInQuest = activeMissionRooms.has(r.id);

                  return (
                    <g
                      key={r.id}
                      onClick={() => isUsedInQuest && setSelectedRoomId(r.id)}
                      className={isUsedInQuest ? 'cursor-pointer' : 'cursor-default'}
                    >
                      {cells.map((c) => {
                        const cx = MARGIN_LEFT + c.x * CELL;
                        const cy = MARGIN_TOP + c.y * CELL;
                        return (
                          <g key={`${c.x}-${c.y}`}>
                            <rect
                              x={cx}
                              y={cy}
                              width={CELL}
                              height={CELL}
                              fill={!isUsedInQuest ? '#b5aa99' : r.id === 'R11' ? '#efe2c8' : '#f7f2e8'}
                            />
                            {isUsedInQuest && showFogOverlay && !isRevealed && (
                              <rect x={cx} y={cy} width={CELL} height={CELL} fill="rgba(48, 24, 18, 0.18)" />
                            )}
                            {isUsedInQuest && isSelected && (
                              <rect x={cx + 0.5} y={cy + 0.5} width={CELL - 1} height={CELL - 1} fill="rgba(217, 155, 38, 0.26)" />
                            )}
                          </g>
                        );
                      })}
                      {isUsedInQuest && (
                        <text x={rx + 4} y={ry + 11} fontSize="8" fontWeight="800" fill="rgba(59, 22, 22, 0.55)">
                          {r.id}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Celdas Oscurecidas Oficiales */}
                {(currentMap.darkCells || []).map((cellKey) => {
                  const [dx, dy] = cellKey.split(',').map(Number);
                  if (Number.isNaN(dx) || Number.isNaN(dy)) return null;
                  return (
                    <rect
                      key={`dk-${cellKey}`}
                      x={MARGIN_LEFT + dx * CELL}
                      y={MARGIN_TOP + dy * CELL}
                      width={CELL}
                      height={CELL}
                      fill="rgba(42, 34, 28, 0.52)"
                      pointerEvents="none"
                    />
                  );
                })}

                {/* Cuadrícula 26×19 */}
                {Array.from({ length: BOARD_COLS + 1 }, (_, x) => (
                  <line
                    key={`vx-${x}`}
                    x1={MARGIN_LEFT + x * CELL}
                    y1={MARGIN_TOP}
                    x2={MARGIN_LEFT + x * CELL}
                    y2={MARGIN_TOP + BOARD_ROWS * CELL}
                    stroke="rgba(74, 25, 25, 0.28)"
                    strokeWidth="0.75"
                  />
                ))}
                {Array.from({ length: BOARD_ROWS + 1 }, (_, y) => (
                  <line
                    key={`hy-${y}`}
                    x1={MARGIN_LEFT}
                    y1={MARGIN_TOP + y * CELL}
                    x2={MARGIN_LEFT + BOARD_COLS * CELL}
                    y2={MARGIN_TOP + y * CELL}
                    stroke="rgba(74, 25, 25, 0.28)"
                    strokeWidth="0.75"
                  />
                ))}

                {/* Muros Oficiales */}
                {wallSegments.map((s, idx) => (
                  <line
                    key={idx}
                    x1={s.x1}
                    y1={s.y1}
                    x2={s.x2}
                    y2={s.y2}
                    stroke="#3b1616"
                    strokeWidth="3.2"
                    strokeLinecap="square"
                  />
                ))}

                {/* Piezas Oficiales */}
                {allMapItems.map((item, idx) => {
                  const info = PIECE_TYPES[item.type];
                  if (!info) return null;
                  const px = MARGIN_LEFT + item.x * CELL;
                  const py = MARGIN_TOP + item.y * CELL;
                  const w = (item.w || info.defaultW || 1) * CELL;
                  const h = (item.h || info.defaultH || 1) * CELL;
                  const roomId = getRoomAt(item.x, item.y);

                  if (item.type === 'stairs') {
                    return (
                      <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                        <StairsSVG px={px} py={py} w={w} h={h} />
                      </g>
                    );
                  }
                  if (item.type === 'door' || item.type === 'secret_door') {
                    return (
                      <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                        <title>{item.note || info.label}</title>
                        <DoorSVG type={item.type} px={px} py={py} cell={CELL} edge={item.edge || 'N'} />
                      </g>
                    );
                  }
                  if (item.type === 'blocked' || item.type === 'blocked_double') {
                    return (
                      <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                        <BlockedWallSVG type={item.type} px={px} py={py} w={w} h={h} />
                      </g>
                    );
                  }
                  if (item.type === 'trap_pit' || item.type === 'trap_spear' || item.type === 'trap_falling_rock') {
                    const tKey = getTrapKey(item);
                    return (
                      <g
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoomId(roomId);
                          setSelectedMonsterKey(null);
                          setSelectedTrapKey(tKey);
                        }}
                        className="cursor-pointer"
                      >
                        <TrapSVG
                          type={item.type}
                          px={px}
                          py={py}
                          cell={CELL}
                          isDisarmed={disarmedTraps.has(tKey)}
                          isSelected={selectedTrapKey === tKey}
                        />
                      </g>
                    );
                  }
                  if (info.category === 'Mobiliario') {
                    return (
                      <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                        <title>{item.note || info.label}</title>
                        <FurnitureSVG type={item.type} px={px} py={py} w={w} h={h} label={info.code} />
                      </g>
                    );
                  }

                  const mKey = info.monsterId ? getMonsterKey(item) : null;
                  const isDeadMon = mKey && monsterHP[mKey] !== undefined && monsterHP[mKey] <= 0;
                  return (
                    <g
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoomId(roomId);
                        if (mKey) {
                          setSelectedTrapKey(null);
                          setSelectedMonsterKey(mKey);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <title>{item.note || info.label}</title>
                      <MonsterIconSVG
                        type={item.type}
                        px={px}
                        py={py}
                        cell={CELL}
                        info={info}
                        isSelected={mKey && selectedMonsterKey === mKey}
                        isDead={isDeadMon}
                      />
                    </g>
                  );
                })}

                {/* Letras de Notas Oficiales (A, B, C, D, X) */}
                {(currentMap.notes || []).map((n, nIdx) => {
                  let bx;
                  let by;
                  if (typeof n.x === 'number' && typeof n.y === 'number') {
                    bx = MARGIN_LEFT + n.x * CELL + CELL / 2;
                    by = MARGIN_TOP + n.y * CELL + CELL / 2;
                  } else {
                    const r = getRoomObj(n.room);
                    if (!r) return null;
                    bx = MARGIN_LEFT + (r.x2 + 1) * CELL - 12;
                    by = MARGIN_TOP + r.y1 * CELL + 12;
                  }
                  return (
                    <g
                      key={`${n.code}-${nIdx}`}
                      onClick={() => setSelectedRoomId(n.room || 'CORRIDOR')}
                      className="cursor-pointer"
                    >
                      <title>{`${n.code}: ${n.title}`}</title>
                      <circle cx={bx} cy={by} r="10.5" fill="#991b1b" stroke="#fde047" strokeWidth="2" />
                      <text x={bx} y={by + 3.5} textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#fef08a">
                        {n.code.slice(0, 2)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* BARRA INFERIOR DE MAZOS OFICIALES (Solo en Modo Pantalla Completa) */}
          {isFullscreenMode && (
            <div className="shrink-0 bg-[#14100d] border border-amber-900/60 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={drawOfficialTreasure}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black cursor-pointer shadow"
                >
                  💎 Robar Tesoro ({treasureDeck.length})
                </button>
                <button
                  type="button"
                  onClick={drawClassicEvilWizard}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-black cursor-pointer shadow"
                >
                  🧙 Malvado Brujo ({evilWizardDeck.length})
                </button>
                <button
                  type="button"
                  onClick={drawOfficialDreadSpell}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-black cursor-pointer shadow"
                >
                  💀 Hechizo del Terror
                </button>
                <button
                  type="button"
                  onClick={drawOfficialAlchemy}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-black cursor-pointer shadow"
                >
                  ⚗️ Poción de Alquimia
                </button>
                <button
                  type="button"
                  onClick={() => setRefModal('dread_spells')}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-rose-800/60 text-rose-200 text-xs font-bold cursor-pointer"
                >
                  📖 Ver Hechizos ({OFFICIAL_DREAD_SPELLS.length - usedDreadSpells.size})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTreasureDeck(shuffleArray(CLASSIC_TREASURE_DECK));
                    setDiscardedTreasures([]);
                    showToast?.('🔄 Mazo Oficial de Tesoro barajado completo (24 cartas).');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Reiniciar y barajar el Mazo Oficial de Tesoro"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Barajar Tesoros
                </button>
              </div>
              <span className="text-[11px] text-amber-300/90 font-bold">
                Descartadas: {discardedTreasures.length} · Reglas Oficiales 2021
              </span>
            </div>
          )}
        </div>

        {/* PANEL DERECHO OFICIAL: MANO DE ZARGON / MONSTRUO / TRAMPA / SALA / NOTAS / BESTIARIO OFICIAL */}
        <div
          className={
            isFullscreenMode
              ? 'w-full lg:w-[390px] xl:w-[430px] shrink-0 overflow-y-auto border-t lg:border-t-0 lg:border-l border-amber-900/50 bg-[#0f141e] p-3 space-y-3'
              : 'xl:col-span-4 space-y-4'
          }
        >
          {/* Mano de Zargon (Cartas "Guardar" del Mazo del Malvado Brujo) */}
          {zargonHand.length > 0 && (
            <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-500/60 space-y-2 shadow-lg">
              <div className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center justify-between">
                <span>✋ Mano de Zargon ({zargonHand.length})</span>
                <span className="text-purple-400">Listas para jugar</span>
              </div>
              <div className="space-y-1.5">
                {zargonHand.map((card) => (
                  <div
                    key={card.handId}
                    className="p-2 rounded-xl bg-slate-950/85 border border-purple-700/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-purple-100 truncate">
                        {card.icon} {card.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{card.text}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setZargonHand((prev) => prev.filter((c) => c.handId !== card.handId));
                        setCardModal({
                          kind: 'evil_wizard',
                          header: '¡Zargon Juega Carta de su Mano!',
                          badge: 'Mazo Clásico del Malvado Brujo',
                          icon: card.icon,
                          title: card.title,
                          text: card.text,
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] cursor-pointer shrink-0"
                    >
                      ⚡ Jugar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Tarjeta Oficial del Monstruo Seleccionado */}
          {selectedMonsterObj && (
            <div
              className={`rounded-2xl p-4 border-2 space-y-3 shadow-xl ${
                selectedMonsterObj.currentPC <= 0
                  ? 'bg-stone-950/90 border-stone-700'
                  : 'bg-gradient-to-b from-red-950/80 to-stone-950 border-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                    <Skull className="w-3.5 h-3.5" /> Monstruo Oficial · {selectedMonsterObj.item.coord}
                  </div>
                  <h4 className="font-display text-lg font-black text-white mt-0.5">
                    {selectedMonsterObj.item.note || selectedMonsterObj.base.name}
                    {selectedMonsterObj.currentPC <= 0 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-red-900 text-red-200">💀 DERROTADO</span>
                    )}
                  </h4>
                  <div className="text-[11px] text-stone-400">{selectedMonsterObj.base.expansion}</div>
                </div>
                <button
                  onClick={() => setSelectedMonsterKey(null)}
                  className="text-xs px-2 py-1 rounded-lg bg-stone-900 text-stone-300 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-700">
                  <div className="text-[9px] text-stone-400">MOV</div>
                  <div className="font-black text-white">{selectedMonsterObj.base.mov}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/60">
                  <div className="text-[9px] text-stone-400">ATQ</div>
                  <div className="font-black text-red-300">{selectedMonsterObj.base.at} DC</div>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60">
                  <div className="text-[9px] text-stone-400">DEF</div>
                  <div className="font-black text-amber-200">{selectedMonsterObj.base.def} DC</div>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-700/60">
                  <div className="text-[9px] text-stone-400">CUERPO</div>
                  <div className="font-black text-white">
                    {selectedMonsterObj.currentPC}/{selectedMonsterObj.base.pc}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-cyan-950/50 border border-cyan-800/50">
                  <div className="text-[9px] text-stone-400">MENTE</div>
                  <div className="font-black text-cyan-300">{selectedMonsterObj.base.pm}</div>
                </div>
              </div>

              <p className="text-xs text-amber-100 bg-black/40 p-2.5 rounded-xl border border-amber-900/50 leading-snug">
                {selectedMonsterObj.base.notes}
              </p>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => adjustMonsterHP(selectedMonsterObj.key, selectedMonsterObj.base.pc, -1)}
                  className="flex-1 py-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-white font-black text-xs cursor-pointer"
                >
                  -1 Cuerpo
                </button>
                <button
                  onClick={() => adjustMonsterHP(selectedMonsterObj.key, selectedMonsterObj.base.pc, 1)}
                  className="px-3 py-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 font-black text-xs cursor-pointer"
                >
                  +1
                </button>
                {selectedMonsterObj.currentPC > 0 ? (
                  <button
                    onClick={() => setMonsterHP((prev) => ({ ...prev, [selectedMonsterObj.key]: 0 }))}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs cursor-pointer"
                  >
                    💀 Abatir
                  </button>
                ) : (
                  <button
                    onClick={() => setMonsterHP((prev) => ({ ...prev, [selectedMonsterObj.key]: selectedMonsterObj.base.pc }))}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs cursor-pointer"
                  >
                    ↩️ Revivir
                  </button>
                )}
              </div>

              {selectedMonsterObj.base.isCaster && (
                <button
                  type="button"
                  onClick={drawOfficialDreadSpell}
                  className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs cursor-pointer"
                >
                  💀 Lanzar Hechizo del Terror Oficial
                </button>
              )}
            </div>
          )}

          {/* Tarjeta Oficial de Trampa Seleccionada */}
          {selectedTrapObj && (
            <div
              className={`rounded-2xl p-4 border-2 space-y-2.5 shadow-xl text-xs ${
                selectedTrapObj.disarmed
                  ? 'bg-emerald-950/40 border-emerald-600/70'
                  : 'bg-gradient-to-b from-orange-950/85 to-stone-950 border-orange-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Trampa Oficial · {selectedTrapObj.item.coord}
                  </div>
                  <h4 className="font-display text-base font-black text-white mt-0.5">
                    {selectedTrapObj.rules.name}
                    {selectedTrapObj.disarmed && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-emerald-700 text-white">✓ DESARMADA</span>
                    )}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedTrapKey(null)}
                  className="text-xs px-2 py-1 rounded-lg bg-stone-900 text-stone-300 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1.5 bg-black/35 p-2.5 rounded-xl border border-orange-800/50 text-stone-200 leading-snug">
                <p><strong className="text-amber-300">👁️ Buscar:</strong> {selectedTrapObj.rules.detect}</p>
                <p><strong className="text-sky-300">🔧 Desarmar:</strong> {selectedTrapObj.rules.disarm}</p>
                <p><strong className="text-red-300">💥 Efecto:</strong> {selectedTrapObj.rules.effect}</p>
              </div>
              <button
                onClick={() =>
                  setDisarmedTraps((prev) => {
                    const next = new Set(prev);
                    if (next.has(selectedTrapObj.key)) next.delete(selectedTrapObj.key);
                    else next.add(selectedTrapObj.key);
                    return next;
                  })
                }
                className={`w-full py-2 rounded-xl font-black text-xs cursor-pointer ${
                  selectedTrapObj.disarmed
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {selectedTrapObj.disarmed ? '↩️ Reactivar Trampa' : '✓ Marcar como Desarmada / Activada'}
              </button>
            </div>
          )}

          {/* Panel de 3 Pestañas: Sala / Notas Oficiales / Bestiario Oficial */}
          <div className="grimoire-panel rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Sala Seleccionada ({selectedRoomId})
                </div>
                <h4 className="font-display text-base font-bold text-stone-100 flex items-center gap-1.5 truncate">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  {selectedRoomObj ? selectedRoomObj.name : 'Pasillos'}
                </h4>
              </div>
              <button
                onClick={() => toggleRevealRoom(selectedRoomId)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 cursor-pointer shrink-0 ${
                  revealedRooms.has(selectedRoomId)
                    ? 'bg-emerald-800 border-emerald-400 text-white'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-emerald-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {revealedRooms.has(selectedRoomId) ? 'Revelada' : 'Abrir Sala'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setRightTab('room')}
                className={`py-1.5 rounded-lg cursor-pointer ${
                  rightTab === 'room' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📋 Sala
              </button>
              <button
                onClick={() => setRightTab('notes')}
                className={`py-1.5 rounded-lg cursor-pointer ${
                  rightTab === 'notes' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📜 Notas ({(currentMap.notes || []).length})
              </button>
              <button
                onClick={() => setRightTab('bestiary')}
                className={`py-1.5 rounded-lg cursor-pointer ${
                  rightTab === 'bestiary' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                👹 Bestiario
              </button>
            </div>

            {/* SUB-TAB 1: SALA ACTUAL */}
            {rightTab === 'room' && (
              <div className="space-y-3">
                {roomNotes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                      📜 Notas Oficiales en esta Sala
                    </div>
                    {roomNotes.map((n) => (
                      <div key={n.code} className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/50 text-xs space-y-1">
                        <div className="font-bold text-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> [{n.code}] {n.title}
                        </div>
                        <p className="text-slate-200 leading-relaxed">{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {roomItems.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No hay piezas oficiales colocadas en esta sala.</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {/* Monstruos */}
                    {roomItems.filter((it) => it.info?.monsterId).map((it, idx) => {
                      const mKey = getMonsterKey(it);
                      const base = CLASSIC_MONSTERS[it.type] || CLASSIC_MONSTERS.orc;
                      const curPC = monsterHP[mKey] !== undefined ? monsterHP[mKey] : base.pc;
                      const isDead = curPC <= 0;
                      return (
                        <button
                          key={`m-${idx}`}
                          onClick={() => {
                            setSelectedTrapKey(null);
                            setSelectedMonsterKey(mKey);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer ${
                            selectedMonsterKey === mKey
                              ? 'bg-rose-950/70 border-amber-400'
                              : isDead
                              ? 'bg-slate-950/60 border-slate-800 opacity-55'
                              : 'bg-rose-950/25 border-rose-900/50 hover:border-amber-500'
                          }`}
                        >
                          <div className="min-w-0">
                            <strong className={isDead ? 'line-through text-slate-500' : 'text-slate-100'}>
                              {it.note || base.name}
                            </strong>
                            <div className="text-[10px] text-slate-400">
                              MOV {base.mov} · AT {base.at} · DEF {base.def} · PC {curPC}/{base.pc} · PM {base.pm}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-amber-400 shrink-0">{it.coord}</span>
                        </button>
                      );
                    })}

                    {/* Muebles Originales (Con botón Examinar del Sistema de Mobiliario Original) */}
                    {roomItems.filter((it) => it.info?.category === 'Mobiliario').map((it, idx) => {
                      const fKey = `${currentMap.id}-furn-${it.type}-${it.x}-${it.y}`;
                      const alreadyExamined = examinedFurnitureKeys.has(fKey);
                      return (
                        <div
                          key={`f-${idx}`}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            alreadyExamined
                              ? 'bg-stone-950/60 border-stone-800 opacity-75'
                              : 'bg-amber-950/25 border-amber-800/60'
                          }`}
                        >
                          <div className="min-w-0">
                            <strong className="text-amber-100">{it.info?.label}</strong>
                            <span className="font-mono text-[11px] text-amber-400 ml-1.5">{it.coord}</span>
                            {it.note && <div className="text-[10px] text-amber-300/90 truncate">★ {it.note}</div>}
                          </div>
                          <button
                            type="button"
                            onClick={() => examineClassicFurniture(it, fKey)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer shrink-0 ${
                              alreadyExamined
                                ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                            }`}
                          >
                            {alreadyExamined ? '✓ Revisado' : '🪑 Examinar'}
                          </button>
                        </div>
                      );
                    })}

                    {/* Puertas, Trampas y Estructura */}
                    {roomItems.filter((it) => !it.info?.monsterId && it.info?.category !== 'Mobiliario').map((it, idx) => {
                      const isTrap = it.type === 'trap_pit' || it.type === 'trap_spear' || it.type === 'trap_falling_rock';
                      const tKey = isTrap ? getTrapKey(it) : null;
                      const isDisarmed = tKey && disarmedTraps.has(tKey);
                      return (
                        <div
                          key={`o-${idx}`}
                          onClick={() => {
                            if (tKey) {
                              setSelectedMonsterKey(null);
                              setSelectedTrapKey(tKey);
                            }
                          }}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            isTrap
                              ? isDisarmed
                                ? 'bg-emerald-950/30 border-emerald-800/60 cursor-pointer'
                                : 'bg-orange-950/35 border-orange-600/60 cursor-pointer'
                              : 'bg-slate-900/80 border-slate-800'
                          }`}
                        >
                          <div className="min-w-0">
                            <strong className={isDisarmed ? 'line-through text-slate-400' : 'text-slate-100'}>
                              {it.info?.label}
                            </strong>
                            {it.edge && <span className="text-amber-300 text-[10px] ml-1">[Muro {it.edge}]</span>}
                            {it.note && <div className="text-[10px] text-amber-300/90 truncate">★ {it.note}</div>}
                          </div>
                          <span className="font-mono font-bold text-amber-400 shrink-0">{it.coord}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={drawOfficialTreasure}
                    className="py-2 px-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-black cursor-pointer"
                  >
                    💎 Tesoro
                  </button>
                  <button
                    type="button"
                    onClick={drawClassicEvilWizard}
                    className="py-2 px-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-black cursor-pointer"
                  >
                    🧙 Brujo
                  </button>
                  <button
                    type="button"
                    onClick={drawOfficialDreadSpell}
                    className="py-2 px-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-black cursor-pointer"
                  >
                    💀 Terror
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: TODAS LAS NOTAS OFICIALES DE LA MISIÓN */}
            {rightTab === 'notes' && (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                <p className="text-[11px] text-slate-400">
                  Notas Oficiales del Libro de Misiones (toca para ir a la sala):
                </p>
                {(currentMap.notes || []).map((n) => (
                  <button
                    key={n.code}
                    onClick={() => {
                      setSelectedRoomId(n.room || 'CORRIDOR');
                      setRightTab('room');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs space-y-1 cursor-pointer ${
                      selectedRoomId === n.room
                        ? 'bg-purple-950/50 border-amber-400'
                        : 'bg-stone-900/80 hover:bg-stone-800 border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-red-900 text-amber-200 font-bold text-[10px] mr-1.5">
                          {n.code}
                        </span>
                        <strong className="text-stone-100">{n.title}</strong>
                      </span>
                      <span className="text-stone-400 text-[10px]">{n.room}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{n.text}</p>
                  </button>
                ))}
              </div>
            )}

            {/* SUB-TAB 3: TABLA RÁPIDA DEL BESTIARIO OFICIAL */}
            {rightTab === 'bestiary' && (
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1 text-xs">
                {Object.values(CLASSIC_MONSTERS).map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-200">{m.name}</strong>
                      <span className="text-[10px] text-slate-400">{m.expansion}</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-200">
                      MOV <strong>{m.mov}</strong> · ATQ <strong className="text-red-300">{m.at}</strong> · DEF{' '}
                      <strong className="text-amber-300">{m.def}</strong> · PC{' '}
                      <strong className="text-emerald-300">{m.pc}</strong> · PM{' '}
                      <strong className="text-sky-300">{m.pm}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-snug">{m.notes}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHECKLIST DE PIEZAS OFICIALES DE LA CAJA (Oculto en Fullscreen) */}
      {!isFullscreenMode && (
        <div className="grimoire-panel rounded-2xl p-5 space-y-4">
          <h4 className="font-display font-bold text-base text-amber-300 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" /> Preparación Oficial: Piezas a sacar de tu caja física
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Estructura', 'Mobiliario', 'Monstruos'].map((groupName) => {
              const entries = Object.values(groupedChecklist[groupName] || {});
              return (
                <div key={groupName} className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">{groupName}</div>
                  <div className="flex flex-wrap gap-2">
                    {entries.map(({ type, count, info }) => {
                      const iconSrc = getPieceIconSrc(type);
                      return (
                        <span
                          key={type || info.label}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200 flex items-center gap-2"
                        >
                          {iconSrc ? (
                            <span className="w-7 h-7 rounded-lg bg-[#f7f2e8] border border-amber-900/40 flex items-center justify-center p-0.5 shrink-0">
                              <img src={iconSrc} alt={info.label} className="max-w-full max-h-full object-contain" />
                            </span>
                          ) : (
                            <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ backgroundColor: info.fill }} />
                          )}
                          <span>
                            <strong className="text-amber-300">{count}×</strong> {info.label}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== MODAL GRANDE DE PERGAMINO EN FULLSCREEN ==================== */}
      {isFullscreenMode && showIntro && missionIntroText && (
        <div
          className="fixed inset-0 z-[45] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowIntro(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-gradient-to-b from-amber-950/95 via-stone-950 to-stone-950 border-2 border-amber-400/70 p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-amber-800/60 pb-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <ScrollText className="w-4 h-4" /> Pergamino Oficial (Leer en Voz Alta)
                </div>
                <h3 className="font-display text-2xl font-black text-white mt-1">{currentMap.title}</h3>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-lore text-lg sm:text-xl italic text-amber-50 leading-relaxed">{missionIntroText}</p>
            <div className="text-sm text-red-300 font-bold">
              👹 Monstruo Errante Oficial: <strong className="text-white">{currentMap.wanderingMonster}</strong>
            </div>
            <button
              onClick={() => setShowIntro(false)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm cursor-pointer"
            >
              ✓ Cerrar Pergamino y Jugar
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL GRANDE DE CARTA OFICIAL ROBADA ==================== */}
      {cardModal && (
        <div
          className="fixed inset-0 z-[45] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setCardModal(null)}
        >
          <div
            className={`w-full max-w-xl rounded-3xl bg-gradient-to-b border-2 p-6 sm:p-8 space-y-5 shadow-2xl ${
              cardModal.kind === 'danger' || cardModal.kind === 'dread'
                ? 'from-rose-950/95 via-slate-950 to-slate-950 border-rose-500/80'
                : cardModal.kind === 'evil_wizard'
                ? 'from-purple-950/95 via-slate-950 to-slate-950 border-purple-400/80'
                : cardModal.kind === 'alchemy'
                ? 'from-indigo-950/95 via-slate-950 to-slate-950 border-indigo-400/80'
                : 'from-emerald-950/95 via-slate-950 to-slate-950 border-amber-400/80'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-widest text-amber-300">
                  {cardModal.icon} {cardModal.header}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                  {cardModal.title}
                </h3>
                <div className="text-xs font-bold text-slate-300">{cardModal.badge}</div>
              </div>
              <button
                onClick={() => setCardModal(null)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <p className="text-base sm:text-lg text-slate-100 leading-relaxed">{cardModal.text}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
              <div className="flex flex-wrap gap-2">
                {cardModal.saveableCard && (
                  <button
                    type="button"
                    onClick={() => {
                      const c = cardModal.saveableCard;
                      setZargonHand((prev) => [...prev, { ...c, handId: `${c.id}-${Date.now()}` }]);
                      showToast?.(`✋ Guardada en Mano de Zargon: ${c.title}`);
                      setCardModal(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow"
                  >
                    ✋ Guardar en Mano de Zargon
                  </button>
                )}
                {cardModal.onDrawAnother && (
                  <button
                    type="button"
                    onClick={cardModal.onDrawAnother}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    {cardModal.drawAnotherLabel}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCardModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-black text-sm cursor-pointer ml-auto"
              >
                ✓ Cerrar (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODALES DE REFERENCIA OFICIAL (DADOS HQ / ARTEFACTOS / ARMERÍA / REGLAS) ==================== */}
      {refModal && (
        <div
          className="fixed inset-0 z-[50] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setRefModal(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl bg-[#0f141e] border-2 border-amber-500/60 p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display text-xl font-black text-amber-300">
                {refModal === 'dice' && '🎲 Dados Oficiales de HeroQuest (Sin D20)'}
                {refModal === 'artifacts' && '🏆 Cartas Oficiales de Artefactos (Base + Luna del Terror)'}
                {refModal === 'armory' && '🛡️ Armería Oficial del Juego Base (2021)'}
                {refModal === 'dread_spells' && '💀 Hechizos del Terror Oficiales de Zargon'}
                {refModal === 'rules' && '📜 Referencia Oficial: Héroes, Trampas, Mercenarios y Luna del Terror'}
              </h3>
              <button
                onClick={() => setRefModal(null)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. DADOS OFICIALES HQ */}
            {refModal === 'dice' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="font-bold text-sm text-amber-200 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-red-400" /> Dados de Combate Oficiales (Calavera · Escudo Blanco · Escudo Negro)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => rollHQCombat(n)}
                        className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-black text-sm cursor-pointer"
                      >
                        Tirar {n} DC
                      </button>
                    ))}
                  </div>
                  {combatRoll.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {combatRoll.map((d, i) => (
                          <div key={i} className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center ${d.cls}`}>
                            <span className="text-2xl leading-none">{d.icon}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        💀 Calaveras: <strong className="text-red-300">{combatRoll.filter((d) => d.type === 'skull').length}</strong> ·{' '}
                        🛡️ Escudos Blancos: <strong className="text-sky-300">{combatRoll.filter((d) => d.type === 'white').length}</strong> ·{' '}
                        🖤 Escudos Negros: <strong className="text-amber-300">{combatRoll.filter((d) => d.type === 'black').length}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="font-bold text-sm text-amber-200">🎲 Dados Rojos de Movimiento / Resistencia</div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => rollHQMove(n)}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-sm cursor-pointer"
                      >
                        Tirar {n}d6 Rojo
                      </button>
                    ))}
                  </div>
                  {moveRoll.length > 0 && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex gap-2">
                        {moveRoll.map((v, i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-xl bg-red-700 border-2 border-red-300 text-white font-black text-xl flex items-center justify-center shadow"
                          >
                            {v}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm font-black text-amber-200">
                        Total: {moveRoll.reduce((a, b) => a + b, 0)} casillas
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ARTEFACTOS OFICIALES */}
            {refModal === 'artifacts' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {OFFICIAL_ARTIFACTS.map((art) => (
                  <div key={art.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-700/40 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-amber-200 text-sm">{art.name}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{art.expansion}</span>
                    </div>
                    <div className="text-[11px] text-emerald-300 font-bold">{art.dice} · {art.restriction}</div>
                    <p className="text-slate-200 leading-snug">{art.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. ARMERÍA OFICIAL */}
            {refModal === 'armory' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {CLASSIC_ARMORY.map((it) => (
                  <div key={it.name} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-200 text-sm">{it.name}</strong>
                      <span className="font-black text-amber-400">{it.cost} MO</span>
                    </div>
                    <p className="text-slate-300 leading-snug">{it.effect}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 4. HECHIZOS DEL TERROR */}
            {refModal === 'dread_spells' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Marca los hechizos que Zargon ya lanzó en esta Misión:</span>
                  <button
                    type="button"
                    onClick={() => setUsedDreadSpells(new Set())}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold cursor-pointer"
                  >
                    🔄 Reiniciar Todos
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {OFFICIAL_DREAD_SPELLS.map((sp) => {
                    const used = usedDreadSpells.has(sp.id);
                    return (
                      <div
                        key={sp.id}
                        className={`p-3 rounded-xl border space-y-1.5 ${
                          used ? 'bg-slate-950/60 border-slate-800 opacity-55' : 'bg-rose-950/35 border-rose-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-rose-200">{sp.name}</strong>
                          <button
                            type="button"
                            onClick={() =>
                              setUsedDreadSpells((prev) => {
                                const next = new Set(prev);
                                if (next.has(sp.id)) next.delete(sp.id);
                                else next.add(sp.id);
                                return next;
                              })
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                              used ? 'bg-slate-800 text-slate-400' : 'bg-rose-600 text-white'
                            }`}
                          >
                            {used ? '✓ Usado' : 'Marcar Usado'}
                          </button>
                        </div>
                        <p className="text-slate-200 leading-snug">{sp.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. REGLAS OFICIALES (HÉROES, LUNA DEL TERROR, MERCENARIOS, HECHIZOS ELEMENTALES) */}
            {refModal === 'rules' && (
              <div className="space-y-5 text-xs">
                <div className="space-y-2">
                  <div className="font-display font-black text-amber-300 text-sm">🛡️ Héroes Oficiales (Base + Caballero Guardián)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CLASSIC_HERO_PROFILES.map((h) => (
                      <div key={h.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex justify-between">
                          <strong className="text-white">{h.name}</strong>
                          <span className="text-[10px] text-amber-300">{h.expansion}</span>
                        </div>
                        <div className="font-mono text-[11px] text-emerald-300">
                          ATQ {h.attack} · DEF {h.defense} · CUERPO {h.body} · MENTE {h.mind}
                        </div>
                        <div className="text-[11px] text-slate-300">{h.notes}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-display font-black text-indigo-300 text-sm">🌙 Reglas Oficiales de La Luna del Terror</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DREAD_MOON_OFFICIAL_RULES.map((r) => (
                      <div key={r.title} className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-700/50 space-y-1">
                        <strong className="text-indigo-200">{r.title}</strong>
                        <p className="text-slate-200 leading-snug">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-display font-black text-emerald-300 text-sm">🧝 Mercenarios Élficos Oficiales (La Luna del Terror)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {OFFICIAL_ELVEN_MERCENARIES.map((em) => (
                      <div key={em.id} className="p-3 rounded-xl bg-slate-900 border border-emerald-800/50 space-y-1">
                        <div className="flex justify-between">
                          <strong className="text-emerald-200">{em.name}</strong>
                          <span className="font-black text-amber-400">{em.cost} MO</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-200">
                          MOV {em.mov} · ATQ {em.at} · DEF {em.def} · PC {em.pc} · PM {em.pm}
                        </div>
                        <p className="text-slate-300">{em.gear}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-display font-black text-sky-300 text-sm">✨ Habilidades del Caballero Guardián & Hechizos Elementales (12)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {OFFICIAL_KNIGHT_SKILLS.map((k) => (
                      <div key={k.id} className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-700/50">
                        <strong className="text-amber-200">{k.name}</strong>
                        <p className="text-[11px] text-slate-300 mt-0.5">{k.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {OFFICIAL_ELEMENTAL_SPELLS.map((s) => (
                      <div key={s.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <strong className="text-sky-200">[{s.school}] {s.name}:</strong>{' '}
                        <span className="text-slate-300">{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
