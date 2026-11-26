import React, { useState, useMemo, useRef } from 'react';
import {
  Compass,
  Package,
  AlertTriangle,
  MapPin,
  Swords,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Skull,
  Shield,
  Zap,
  Armchair,
  Gem,
  Gift,
} from 'lucide-react';
import {
  BOARD_COLS,
  BOARD_ROWS,
  HQ_ROOMS,
  PIECE_TYPES,
  OFFICIAL_QUEST_MAPS,
  ROOM_READ_ALOUD,
  MISSION_CONTEXT_EVENTS,
  GENERIC_DUNGEON_EVENTS,
  generateDynamicMissionEvent,
  getRoomAt,
  getRoomObj,
} from '../data/officialBoardMaps';
import { MONSTERS, scaleMonster } from '../data/bestiary';
import { QUESTS } from '../data/quests';
import { FURNITURE_DECK, TREASURE_TRAP_DECK } from '../data/decks';
import {
  generateProceduralFurniture,
  generateHintCard,
  ZARGON_COUNTER_TYPES,
} from '../data/proceduralEngine';
import { rollMaterialDrop } from '../data/craftingSystem';
import { DIGITAL_LOOT_CATALOG, generateProceduralLoot, getRarityMeta } from '../data/lootCatalog';
import { DUNGEON_NPCS, generateProceduralPuzzle } from '../data/puzzlesAndNpcs';

const COL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const CELL = 32; // px por casilla en el plano SVG oficial
const MARGIN_LEFT = 24;
const MARGIN_TOP = 22;
const SVG_W = MARGIN_LEFT + BOARD_COLS * CELL + 8;
const SVG_H = MARGIN_TOP + BOARD_ROWS * CELL + 8;

const coordLabel = (x, y) => `${COL_LETTERS[x]}${y + 1}`;

// Reglas claras de las trampas del tablero (al hacer clic en una trampa ▲ !)
const TRAP_RULES = {
  trap_pit: {
    name: 'Trampa de Foso Oculto',
    detect: 'Percepción CD 12 (al buscar trampas sin enemigos visibles).',
    disarm: 'Desarmar Trampas o Saltar (DES CD 12).',
    effect: 'Si un héroe pisa esta casilla sin verla, cae al foso: sufre 1 PC de daño, termina su turno y ataca/defiende con -1 DC hasta salir.',
  },
  trap_spear: {
    name: 'Trampa de Lanza / Aguja',
    detect: 'Percepción CD 12 (al buscar trampas o revisar el cofre).',
    disarm: 'Desarmar Trampas CD 13 (Enano/Pícaro tienen Ventaja).',
    effect: 'Si se activa, dispara una lanza o aguja: Salvación DES CD 13 o recibe 1 PC (si es aguja envenenada, queda Envenenado -1 DC Ataque).',
  },
};

// Detecta si un evento/tesoro/mueble menciona un monstruo o trampa para poder invocarlo en el tablero con 1 clic
function detectSpawnable(disc, currentMap) {
  if (!disc) return { monsterType: null, monsterLabel: null, trapType: null };
  const txt = `${disc.title || ''} ${disc.badge || ''} ${disc.text || ''}`.toLowerCase();

  let monsterType = null;
  if (txt.includes('mímico') || txt.includes('mimico')) monsterType = 'mimic';
  else if (txt.includes('asesino')) monsterType = 'assassin';
  else if (txt.includes('espectro')) monsterType = 'specter';
  else if (txt.includes('momia')) monsterType = 'mummy';
  else if (txt.includes('esqueleto') || txt.includes('manos esqueléticas')) monsterType = 'skeleton';
  else if (txt.includes('zombi')) monsterType = 'zombie';
  else if (txt.includes('goblin')) monsterType = 'goblin';
  else if (txt.includes('abominación') || txt.includes('abominacion')) monsterType = 'abomination';
  else if (txt.includes('guerrero del terror')) monsterType = 'dread_warrior';
  else if (txt.includes('orco')) monsterType = 'orc';
  else if (txt.includes('monstruo errante') || txt.includes('emboscada') || txt.includes('patrulla')) {
    const w = (currentMap?.wanderingMonster || 'Orco').toLowerCase();
    if (w.includes('momia')) monsterType = 'mummy';
    else if (w.includes('asesino')) monsterType = 'assassin';
    else if (w.includes('goblin')) monsterType = 'goblin';
    else if (w.includes('esqueleto')) monsterType = 'skeleton';
    else monsterType = 'orc';
  }

  let trapType = null;
  if (txt.includes('foso') || txt.includes('hoyo')) trapType = 'trap_pit';
  else if (
    txt.includes('trampa') ||
    txt.includes('aguja') ||
    txt.includes('lanza') ||
    txt.includes('dardo') ||
    txt.includes('cable') ||
    txt.includes('campana')
  ) {
    trapType = 'trap_spear';
  }

  return {
    monsterType,
    monsterLabel: monsterType ? PIECE_TYPES[monsterType]?.label : null,
    trapType,
  };
}

// Guía rápida de reglas tácticas para cada mueble que aparezca en la sala
const FURNITURE_QUICK_RULES = {
  table: 'Táctica: Volcar mesa (Acción gratuita, FUE CD 11) da +1 Def vs proyectiles. Subir encima (+1 mov) da Ventaja de altura.',
  alchemy_bench: 'Alquimia: Con Materiales de Crafteo y Arcano CD 12, un héroe fabrica pociones o tónicos en campo.',
  bookcase: 'Examinar (Acción): Puede revelar pergaminos, mapas de puertas secretas o debilidades de jefes (Investigación/Arcano CD 12).',
  weapon_rack: 'Examinar (Acción): Puede contener armas de repuesto, dagas arrojadizas o piedra de afilar (+1 DC próximo ataque).',
  chest: 'Revisar Trampas primero (Percepción CD 12). Abrir sin revisar puede activar aguja/gas o despertar un Mímico.',
  tomb: 'Examinar (Acción): Puede guardar reliquias o oro, pero perturbarla puede despertar Esqueletos/Espectros.',
  sorcerer_table: 'Altar del Mago: Arcano CD 12 puede recuperar 1 hechizo gastado o +2 PM; fallar puede costar 1 PM.',
  throne: 'Trono: Investigación CD 12 puede hallar compartimentos secretos o palancas de puertas ocultas.',
  cupboard: 'Armario: Puede esconder pociones, capas o emboscadas de arañas.',
  fireplace: 'Chimenea: Revisar brasas puede ocultar bolsas ignífugas de oro o activar humo sofocante.',
  torture_rack: 'Potro: Puede contener llaves del carcelero (Ventaja en Trampas) o causar pérdida de 1 PM (SAB CD 13).',
};

// Construye los Disparadores / Eventos ESPECÍFICOS de la sala actual con CUÁNDO y PARA QUÉ claros
function buildRoomTriggers(currentMap, selectedRoomId, roomItems) {
  const triggers = [];
  const biomeId = currentMap?.biomeId;
  const typesInRoom = new Set(roomItems.map((it) => it.type));
  const hasMonster = roomItems.some((it) => it.info?.monsterId);
  const hasUndead = ['skeleton', 'zombie', 'mummy', 'specter'].some((t) => typesInRoom.has(t));
  const hasTrap = roomItems.some((it) => it.type === 'trap_pit' || it.type === 'trap_spear');
  const hasLockedOrTrappedDoor = roomItems.some((it) =>
    ['cerrada', 'atrancada', 'trampa_aguja'].includes(it.doorState)
  );
  const hasPuzzleDoor = roomItems.some((it) => it.doorState === 'sello_puzzle');
  const hasSecretDoor = typesInRoom.has('secret_door');
  const npcItem = roomItems.find((it) => it.type === 'npc');
  const isBossRoom = selectedRoomId === 'R11';

  // 1. Sala de Peligro (Hazard Room) — con CUÁNDO exacto según tipo de peligro
  const hazard = currentMap?.hazardRooms?.[selectedRoomId];
  if (hazard) {
    const hazardWhenMap = {
      haz_gas: 'Al terminar el turno de cualquier héroe dentro de esta sala.',
      haz_inundada: 'Mientras los héroes se muevan o ataquen con fuego/pólvora aquí.',
      haz_hongos: 'En el instante en que un héroe cruce la puerta y entre a esta sala.',
      haz_inestable: 'Si cualquier ataque saca 3+ calaveras o estalla una bomba/hechizo fuerte.',
      haz_runas: 'Cada vez que se lance un hechizo aquí (o si alguien saca un 1 Natural).',
      haz_telaranas: 'Al entrar o intentar moverse a través de las casillas de esta sala.',
      haz_bruma: 'Durante todo el combate mientras estén dentro de la sala.',
      haz_braseros: 'Cuando alguien empuje a un enemigo contra un muro o brasero.',
    };
    triggers.push({
      id: 'hazard',
      icon: hazard.icon || '⚠️',
      badge: 'PELIGRO DE SALA',
      title: hazard.name,
      color: 'bg-orange-950/35 border-orange-500/50 text-orange-200',
      badgeColor: 'bg-orange-600 text-white',
      when: hazardWhenMap[hazard.id] || 'Al entrar o combatir dentro de esta sala.',
      purpose: hazard.rule,
    });
  }

  // 2. Puerta con Sello Rúnico / Puzzle (o Clímax con Twist de Puzzle en R11)
  const twistHasPuzzle = `${currentMap?.twist || ''}`.toLowerCase().includes('puzzle');
  if (hasPuzzleDoor || (isBossRoom && twistHasPuzzle)) {
    triggers.push({
      id: 'puzzle_door',
      icon: '🧩',
      badge: 'PUZZLE DE PUERTA',
      title: isBossRoom ? 'Sello Rúnico de la Cámara Central' : 'Cerradura Rúnica Interactiva',
      color: 'bg-fuchsia-950/35 border-fuchsia-500/50 text-fuchsia-100',
      badgeColor: 'bg-fuchsia-600 text-white',
      when: 'Cuando un héroe examine la puerta sellada para abrirla sin forzarla.',
      purpose:
        'Envía el minijuego al celular del héroe. Si lo resuelve, abre el paso limpiamente; si la fuerzan a golpes, el Reloj del Caos sube +2 y los enemigos entran en ALERTA.',
      actionLabel: '🧩 Enviar Puzzle al Celular',
      actionType: 'puzzle',
    });
  }

  // 3. Efecto de Bioma — SOLO en las salas clave donde realmente aplica (nunca repetido sin sentido)
  if (biomeId === 'catacumbas' && (typesInRoom.has('tomb') || hasUndead)) {
    triggers.push({
      id: 'biome_rule',
      icon: '⚰️',
      badge: 'EFECTO DE BIOMA',
      title: 'Frío Sepulcral (Sala con Tumbas / No Muertos)',
      color: 'bg-purple-950/35 border-purple-500/45 text-purple-100',
      badgeColor: 'bg-purple-700 text-white',
      when: 'Al defender ataques contra No Muertos que estén junto a una Tumba aquí.',
      purpose:
        'Los No Muertos ganan +1 DC de Defensa. Las armas de Fuego o Plata Sagrada ignoran este bono.',
    });
  } else if (biomeId === 'fortaleza_orca' && (hasTrap || hasLockedOrTrappedDoor)) {
    triggers.push({
      id: 'biome_rule',
      icon: '🪓',
      badge: 'EFECTO DE BIOMA',
      title: 'Trampas Sucias (Sala con Trampas / Cerraduras)',
      color: 'bg-emerald-950/35 border-emerald-500/45 text-emerald-100',
      badgeColor: 'bg-emerald-700 text-white',
      when: 'Cuando un héroe intente desarmar la trampa o abrir la cerradura de esta sala.',
      purpose:
        'La dificultad sube +1 CD, pero si la desarman con éxito obtienen +1 Acero Templado o Pólvora Negra para crafteo.',
    });
  } else if (biomeId === 'abismo_caos' && (typesInRoom.has('dread_warrior') || typesInRoom.has('gargoyle') || typesInRoom.has('fireplace') || isBossRoom)) {
    triggers.push({
      id: 'biome_rule',
      icon: '🔥',
      badge: 'EFECTO DE BIOMA',
      title: 'Calor Abrasador del Caos',
      color: 'bg-rose-950/35 border-rose-500/45 text-rose-100',
      badgeColor: 'bg-rose-700 text-white',
      when: 'Cuando ataquen Guerreros del Terror aquí o cualquier héroe saque 1 Natural.',
      purpose:
        'Guerreros del Terror ganan +1 DC Ataque en esta cámara. Sacar 1 Natural sube +2 el Reloj del Caos en vez de +1.',
    });
  } else if (biomeId === 'cripta_espectral' && (typesInRoom.has('specter') || typesInRoom.has('sorcerer') || isBossRoom)) {
    triggers.push({
      id: 'biome_rule',
      icon: '👻',
      badge: 'EFECTO DE BIOMA',
      title: 'Velo Etéreo (Sala Espectral)',
      color: 'bg-cyan-950/35 border-cyan-500/45 text-cyan-100',
      badgeColor: 'bg-cyan-700 text-white',
      when: 'Al entrar en combate contra los Espectros o lanzadores de esta cámara.',
      purpose:
        'Visibilidad máx. 6 casillas. Armas físicas normales solo hieren Espectros con Escudos Negros (Magia, Plata y Runas hieren normal).',
    });
  } else if (biomeId === 'cavernas_hielo' && hasMonster) {
    triggers.push({
      id: 'biome_rule',
      icon: '❄️',
      badge: 'EFECTO DE BIOMA',
      title: 'Suelo Helado (Sala de Combate)',
      color: 'bg-sky-950/35 border-sky-500/45 text-sky-100',
      badgeColor: 'bg-sky-700 text-white',
      when: 'Si un héroe mueve más de 6 casillas en combate o lanza un ataque de Fuego.',
      purpose:
        'Mover >6 casillas pide Atletismo CD 11 o cae Derribado. Hechizos de Fuego y Fuego Griego ganan +1 DC extra aquí.',
    });
  } else if (biomeId === 'laboratorio_alquimico' && (typesInRoom.has('alchemy_bench') || typesInRoom.has('sorcerer_table'))) {
    triggers.push({
      id: 'biome_rule',
      icon: '⚗️',
      badge: 'EFECTO DE BIOMA',
      title: 'Gases Volátiles y Alambique',
      color: 'bg-teal-950/35 border-teal-500/45 text-teal-100',
      badgeColor: 'bg-teal-700 text-white',
      when: 'Al examinar el Banco de Alquimista o al usar Fuego/Bombas dentro de esta sala.',
      purpose:
        'Examinar el banco otorga DOBLE drop de ingredientes de crafteo. Usar Fuego provoca una chispa extra (+1 DC en 2×2).',
    });
  }

  // 4. NPC / Prisionero en esta sala
  if (npcItem) {
    const isPrisoner = `${npcItem.label || npcItem.note || ''}`.toLowerCase().includes('prisionero') ||
      `${npcItem.label || npcItem.note || ''}`.toLowerCase().includes('ragnar');
    triggers.push({
      id: 'npc_room',
      icon: isPrisoner ? '⛓️' : '🧙',
      badge: isPrisoner ? 'OBJETIVO DE RESCATE' : 'ENCUENTRO NPC',
      title: npcItem.label || npcItem.note || 'Personaje en la Sala',
      color: 'bg-sky-950/35 border-sky-500/50 text-sky-100',
      badgeColor: 'bg-sky-600 text-white',
      when: isPrisoner
        ? 'En cuanto abran su celda o liberen sus cadenas.'
        : 'Cuando un héroe se acerque a hablar o curarlo.',
      purpose: isPrisoner
        ? 'Libera al prisionero (escoltarlo a R14) y dispara la alarma / patrulla de persecución.'
        : 'Si lo curan (Medicina CD 12 o 1 poción), otorga +1 🏅 Reputación y revela 1 trampa o puerta secreta cercana.',
    });
  }

  // 5. Puerta Secreta en esta sala
  if (hasSecretDoor) {
    triggers.push({
      id: 'secret_door',
      icon: '🗝️',
      badge: 'SECRETO OCULTO',
      title: 'Puerta Secreta en esta Sala',
      color: 'bg-amber-950/30 border-amber-500/45 text-amber-100',
      badgeColor: 'bg-amber-600 text-slate-950',
      when: 'SOLO si un héroe gasta su acción en Buscar Puertas Secretas (Investigación CD 12) sin monstruos.',
      purpose: 'Revela un atajo o almacén secreto con botín y +2 Materiales de Crafteo del bioma.',
    });
  }

  // 5B. Cámara de Alquimia (Mesa de Alquimia para craftear pociones en mazmorra)
  if (typesInRoom.has('alchemy_bench')) {
    triggers.push({
      id: 'alchemy_chamber',
      icon: '⚗️',
      badge: 'MESA DE ALQUIMIA',
      title: 'Cámara de Alquimia (Crafteo en Campo)',
      color: 'bg-teal-950/40 border-teal-500/55 text-teal-100',
      badgeColor: 'bg-teal-600 text-white',
      when: 'Al limpiar esta sala y acercarse al Banco de Alquimista.',
      purpose:
        'Los héroes tiran d20 de Arcano en mesa para fabricar pociones/venenos desde su celular (Común CD 10 · Poco Común CD 12 · Raro CD 14). Crítico (20 o +5) = ×2 unidades · Fallo por 1–3 = Inestable · Fallo grave (o 1) = Explosión (-1 PC y +1 Caos).',
    });
  }

  // 6. Clímax y Fase 2 del Jefe en R11
  if (isBossRoom) {
    triggers.push({
      id: 'boss_climax',
      icon: '🔥',
      badge: 'CLÍMAX Y FASE 2',
      title: `Jefe: ${currentMap?.bossName || 'Guardián de la Cámara Central'}`,
      color: 'bg-rose-950/40 border-rose-500/60 text-rose-100',
      badgeColor: 'bg-rose-600 text-white',
      when: 'Al abrir R11 (Clímax) y en el instante en que el Jefe baje al 50% de sus PC (Fase 2).',
      purpose: `${currentMap?._questRef?.bossPhase2 || 'Fase 2: Recupera 2 PC, gana +1 DC Ataque y empuja 1 casilla a todos los adyacentes.'}${currentMap?.twist ? ` | ⚡ Giro secreto: ${currentMap.twist}` : ''}`,
    });
  }

  return triggers;
}

export default function TacticalBoard({
  partyLevel = 1,
  setPartyLevel,
  partySize = 4,
  setPartySize = null,
  onAwardXP,
  onAwardQuestRewards = null,
  onStartTravelToCity = null,
  heroes = [],
  onSendLootToHero,
  onSendMaterialToHero,
  proceduralQuests = [],
  activeProceduralQuest = null,
  activeOfficialMapRequest = null,
  zargonCounters = null,
  setZargonCounters = null,
  onRegisterNemesis = null,
  showToast = null,
}) {
  const allAvailableMaps = useMemo(() => {
    const procMaps = (proceduralQuests || [])
      .filter((q) => q?.mapData)
      .map((q) => ({
        ...q.mapData,
        expansion: `Procedural · ${q.biome?.name || 'Abismo'}`,
        specialAlert: `${q.biome?.globalRule || ''} ${q.twist ? `| ⚡ Giro: ${q.twist}` : ''}`,
        _questRef: q,
      }));
    return [...procMaps, ...OFFICIAL_QUEST_MAPS];
  }, [proceduralQuests]);

  const [selectedMapId, setSelectedMapId] = useState(
    activeProceduralQuest?.mapData?.id || OFFICIAL_QUEST_MAPS[0].id
  );
  const currentMap =
    allAvailableMaps.find((m) => m.id === selectedMapId) || allAvailableMaps[0] || OFFICIAL_QUEST_MAPS[0];

  React.useEffect(() => {
    if (activeProceduralQuest?.mapData?.id) {
      setSelectedMapId(activeProceduralQuest.mapData.id);
      setSelectedRoomId(activeProceduralQuest.mapData.startRoom || 'R14');
      setRevealedRooms(new Set([activeProceduralQuest.mapData.startRoom || 'R14']));
      setDynamicItems([]);
      setDisarmedTraps(new Set());
      setQuickHP({});
    }
  }, [activeProceduralQuest?.mapData?.id]);

  React.useEffect(() => {
    if (activeOfficialMapRequest?.mapId) {
      const target = OFFICIAL_QUEST_MAPS.find((m) => m.id === activeOfficialMapRequest.mapId);
      if (target) {
        setSelectedMapId(target.id);
        setSelectedRoomId(target.startRoom || 'R14');
        setRevealedRooms(new Set([target.startRoom || 'R14']));
        setDynamicItems([]);
        setDisarmedTraps(new Set());
        setQuickHP({});
      }
    }
  }, [activeOfficialMapRequest?.ts]);

  const [selectedRoomId, setSelectedRoomId] = useState(currentMap.startRoom || 'R14');
  const [selectedMonsterKey, setSelectedMonsterKey] = useState(null);
  const [selectedTrapKey, setSelectedTrapKey] = useState(null);
  const [rightTab, setRightTab] = useState('setup'); // 'setup' | 'actions' | 'notes'
  const [dynamicItems, setDynamicItems] = useState([]);
  const [disarmedTraps, setDisarmedTraps] = useState(() => new Set());
  const [revealedRooms, setRevealedRooms] = useState(() => new Set([currentMap.startRoom || 'R14']));
  const [showFogOverlay, setShowFogOverlay] = useState(true);
  const [quickHP, setQuickHP] = useState({});

  // Resultados en vivo de Examinar Mueble / Buscar Tesoro / Evento de Misión + envío directo al Héroe
  const [roomDiscovery, setRoomDiscovery] = useState(null);
  const [targetHeroId, setTargetHeroId] = useState(heroes[0]?.id || '');
  const [quickSendOpen, setQuickSendOpen] = useState(false);
  const [quickCat, setQuickCat] = useState('Todos');
  const [quickLootId, setQuickLootId] = useState(DIGITAL_LOOT_CATALOG[0]?.id || '');
  const [puzzleOpen, setPuzzleOpen] = useState(false);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState('random');
  const [puzzleSentToast, setPuzzleSentToast] = useState(null);

  // Rastreador de Iniciativa Sorpresa / Física en Mesa (Héroes + Monstruos de la Sala)
  const [initOpen, setInitOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [initList, setInitList] = useState([]);
  const [initTurnIdx, setInitTurnIdx] = useState(0);
  const [initRound, setInitRound] = useState(1);
  // Oleada actual si la misión es de Defensa por Oleadas
  const [currentWave, setCurrentWave] = useState(1);

  const loadInitiativeForRoom = (shuffleSurprise = false) => {
    const heroEntries = (heroes || []).map((h) => ({
      id: `h-${h.id}`,
      name: h.name,
      sub: h.className,
      kind: 'hero',
      roll: shuffleSurprise ? Math.floor(Math.random() * 20) + 1 : 10 + (h.initMod || 0),
    }));
    const monsterEntries = roomItems
      .filter((it) => it.info?.monsterId)
      .filter((it) => {
        const k = getMonsterKey(it);
        return quickHP[k] === undefined || quickHP[k] > 0;
      })
      .map((it, idx) => ({
        id: `m-${getMonsterKey(it)}-${idx}`,
        name: `${it.label || it.info?.label} (${it.coord})`,
        sub: 'Zargon',
        kind: 'monster',
        roll: Math.floor(Math.random() * 20) + 1,
      }));
    let combined = [...heroEntries, ...monsterEntries];
    if (combined.length === 0) {
      combined = [
        { id: 'def-h1', name: 'Héroe 1', sub: 'Jugador', kind: 'hero', roll: 14 },
        { id: 'def-z', name: 'Turno de Zargon', sub: 'Monstruos', kind: 'monster', roll: 11 },
      ];
    }
    if (shuffleSurprise) {
      combined.sort(() => Math.random() - 0.5);
    } else {
      combined.sort((a, b) => b.roll - a.roll);
    }
    setInitList(combined);
    setInitTurnIdx(0);
    setInitRound(1);
    setInitOpen(true);
  };

  const nextInitiativeTurn = () => {
    if (initList.length === 0) return;
    if (initTurnIdx + 1 >= initList.length) {
      setInitTurnIdx(0);
      setInitRound((r) => r + 1);
    } else {
      setInitTurnIdx((i) => i + 1);
    }
  };

  const effectiveHeroId = targetHeroId || heroes[0]?.id || '';

  // Historial sin repetición (Shuffle Bag) para que eventos, muebles y tesoros nunca se repitan seguido
  const seenHistoryRef = useRef({
    room: new Set(),
    corridor: new Set(),
    furniture: new Set(),
    treasure: new Set(),
    npc: new Set(),
    puzzle: new Set(),
  });

  const pickWithoutRepeat = (bucket, items, getKey) => {
    if (!items || items.length === 0) return null;
    const seen = seenHistoryRef.current[bucket];
    let available = items.filter((it) => !seen.has(getKey(it)));
    if (available.length === 0) {
      // Al agotar toda la baraja, reinicia evitando repetir el último salido
      const lastKey = Array.from(seen).pop();
      seen.clear();
      available = items.filter((it) => getKey(it) !== lastKey);
      if (available.length === 0) available = items;
    }
    const chosen = available[Math.floor(Math.random() * available.length)];
    seen.add(getKey(chosen));
    return chosen;
  };

  const triggerContextualRoomEvent = (mode = 'auto') => {
    const missionPool =
      MISSION_CONTEXT_EVENTS[currentMap.id] || MISSION_CONTEXT_EVENTS.m1_la_prueba;
    const isCorridor = mode === 'corridor' || (mode === 'auto' && selectedRoomId === 'CORRIDOR');
    const bucket = isCorridor ? 'corridor' : 'room';

    // Combinar eventos exclusivos de la misión + gran pool de mazmorra + 65% generador procedural infinito
    const useDynamic = Math.random() < 0.65;
    let chosen;
    if (useDynamic) {
      chosen = generateDynamicMissionEvent(currentMap, isCorridor, partyLevel);
    } else {
      const combined = [
        ...(isCorridor ? missionPool.corridor : missionPool.room),
        ...(isCorridor ? GENERIC_DUNGEON_EVENTS.corridor : GENERIC_DUNGEON_EVENTS.room),
      ];
      chosen = pickWithoutRepeat(bucket, combined, (ev) => ev.title);
    }
    if (!chosen) return;
    setRoomDiscovery({
      source: isCorridor ? `Pasillo · ${currentMap.title.split(':')[0]}` : `Evento de Sala (${selectedRoomId})`,
      title: chosen.title,
      badge: chosen.badge || 'Evento de Misión',
      text: chosen.text,
      rewardLoot: chosen.rewardLoot || null,
      rewardGold: chosen.rewardGold || 0,
    });
  };

  const examineFurnitureHere = (furnitureKey) => {
    const pool = FURNITURE_DECK.filter(
      (c) => c.furniture === furnitureKey || c.furniture === 'Genérico'
    );
    const useProcedural = Math.random() < 0.55;
    const card = useProcedural
      ? generateProceduralFurniture(furnitureKey, partyLevel)
      : pickWithoutRepeat('furniture', pool, (c) => c.id || c.title);

    // Si la carta ya trae un objeto o moneda exacta (ej. Venda de Campaña, Daga, Capa), úsalo directo!
    let rewardLoot = card.rewardLoot || null;
    let rewardGold = card.rewardGold || 0;
    const kindStr = `${card.type || ''}`.toLowerCase();
    const txtLow = `${card.title || ''} ${card.text || ''}`.toLowerCase();

    if (!rewardLoot && txtLow.includes('venda')) {
      rewardLoot = {
        name: 'Venda de Campaña (+1 PC)',
        type: 'Poción',
        rarity: 'comun',
        dice: '+1 PC',
        upgrade: 'Acción gratuita: aplica la venda para recuperar 1 PC en cualquier momento.',
        special: 'Consumible: restaura 1 PC.',
        restriction: 'Todas las clases',
      };
    } else if (!rewardLoot && txtLow.includes('daga')) {
      rewardLoot = {
        name: 'Daga Arrojadiza (1 DC)',
        type: 'Arma',
        rarity: 'comun',
        dice: '1 DC',
        upgrade: 'Arrojadiza hasta 4 casillas o cuerpo a cuerpo.',
        special: 'Ligera y arrojadiza.',
        restriction: 'Todas las clases',
      };
    } else if (!rewardLoot && txtLow.includes('capa')) {
      rewardLoot = {
        name: 'Capa de Viaje (+1 Sigilo)',
        type: 'Armadura',
        rarity: 'comun',
        dice: '+1 Sigilo',
        upgrade: 'Otorga +1 a pruebas de Sigilo y protección ligera.',
        special: '+1 Sigilo.',
        restriction: 'Todas las clases',
      };
    } else if (!rewardLoot && txtLow.includes('llaves del carcelero')) {
      rewardLoot = {
        name: 'Llaves del Carcelero',
        type: 'Herramienta',
        rarity: 'poco_comun',
        dice: 'Ventaja Trampas',
        upgrade: 'Ventaja en las próximas 2 pruebas de Desarmar Trampas o abrir cerraduras.',
        special: '2 usos.',
        restriction: 'Todas las clases',
      };
    } else if (!rewardLoot && (kindStr.includes('tesoro') || kindStr.includes('alquimia'))) {
      if (Math.random() < 0.65) {
        rewardLoot = generateProceduralLoot('auto', partyLevel);
      } else {
        rewardGold = 15 + partyLevel * 5;
      }
    }

    setRoomDiscovery({
      source: `Mueble: ${furnitureKey}`,
      title: card.title,
      badge: card.type || 'Mobiliario',
      text: card.text,
      rewardLoot,
      rewardGold,
    });
  };

  const searchRoomTreasure = () => {
    const roll = Math.random();
    if (roll < 0.52) {
      // Botín real (catálogo sin repetir / procedural infinito)
      const loot =
        Math.random() < 0.45
          ? pickWithoutRepeat('treasure', DIGITAL_LOOT_CATALOG, (it) => it.id)
          : generateProceduralLoot('auto', partyLevel);
      const rMeta = getRarityMeta(loot.rarity || 'comun');
      setRoomDiscovery({
        source: 'Búsqueda de Tesoro',
        title: `¡${loot.name} (${rMeta.name})!`,
        badge: `${rMeta.name} · ${loot.type}`,
        text: `${loot.dice ? `[${loot.dice}] ` : ''}${loot.upgrade || loot.special || ''}${loot.flaw ? ` | ⚠️ Desventaja: ${loot.flaw}` : ''}`,
        rewardLoot: loot,
        rewardGold: 0,
      });
      return;
    }
    if (roll < 0.78) {
      const gold = (Math.floor(Math.random() * 6) + 3) * 15 + partyLevel * 10;
      setRoomDiscovery({
        source: 'Búsqueda de Tesoro',
        title: `Alijo de ${gold} Monedas de Oro`,
        badge: 'Oro Imperial',
        text: `Entre las sombras de la sala encuentran una bolsa pesada con ${gold} MO listas para repartir.`,
        rewardLoot: null,
        rewardGold: gold,
      });
      return;
    }
    // Trampa o Monstruo Errante sin repetir
    const dangers = TREASURE_TRAP_DECK.filter((c) => c.kind === 'Trampa' || c.kind === 'Peligro');
    const card = pickWithoutRepeat('treasure', dangers, (c) => c.id || c.title);
    setRoomDiscovery({
      source: 'Búsqueda de Tesoro',
      title: card.title,
      badge: card.kind,
      text: card.text,
      rewardLoot: null,
      rewardGold: 0,
    });
  };

  const switchQuestMap = (mapId) => {
    const found = allAvailableMaps.find((m) => m.id === mapId);
    if (!found) return;
    setSelectedMapId(mapId);
    setSelectedRoomId(found.startRoom || 'R14');
    setSelectedMonsterKey(null);
    setSelectedTrapKey(null);
    setDynamicItems([]);
    setDisarmedTraps(new Set());
    setRoomDiscovery(null);
    setRevealedRooms(new Set([found.startRoom || 'R14']));
    setQuickHP({});
  };

  // Adapta automáticamente los monstruos del tablero (incluso en Mapas Oficiales) para 1 o 2 jugadores
  const allMapItems = useMemo(() => {
    const baseItems = currentMap.items || [];
    if (partySize >= 3) {
      return [...baseItems, ...dynamicItems];
    }

    const monsterCountByRoom = {};
    const filtered = baseItems.filter((it) => {
      const info = PIECE_TYPES[it.type];
      if (!info?.monsterId) return true; // Nunca quitar puertas, cofres, muebles, trampas ni NPCs
      const rId = getRoomAt(it.x, it.y);
      const isBoss =
        Boolean(it.isBoss) ||
        Boolean(info.isBoss) ||
        `${it.note || it.label || ''}`.toUpperCase().includes('JEFE');

      if (isBoss) return true; // El Jefe siempre permanece

      const cur = monsterCountByRoom[rId] || 0;
      if (partySize === 1) {
        // En Modo 1 Jugador: en la sala del Jefe (R11) no hay escoltas; en el resto máx. 1 monstruo
        if (rId === 'R11') return false;
        if (cur >= 1) return false;
      } else if (partySize === 2) {
        // En Modo 2 Jugadores: máx. 1 escolta en R11, máx. 2 monstruos en salas normales
        if (rId === 'R11' && cur >= 1) return false;
        if (cur >= 2) return false;
      }
      monsterCountByRoom[rId] = cur + 1;
      return true;
    });

    return [...filtered, ...dynamicItems];
  }, [currentMap, dynamicItems, partySize]);

  const getMonsterKey = (it) => `${currentMap.id}-${it.x}-${it.y}-${it.type}${it.dynId ? `-${it.dynId}` : ''}`;
  const getTrapKey = (it) => `trap-${currentMap.id}-${it.x}-${it.y}-${it.type}${it.dynId ? `-${it.dynId}` : ''}`;

  const setMonsterHPDirect = (key, hpVal) => {
    setQuickHP((prev) => ({ ...prev, [key]: Math.max(0, hpVal) }));
  };

  const toggleDisarmTrap = (tKey) => {
    setDisarmedTraps((prev) => {
      const next = new Set(prev);
      if (next.has(tKey)) next.delete(tKey);
      else next.add(tKey);
      return next;
    });
  };

  // Encuentra una casilla libre dentro de la sala actual (o pasillo) para invocar un monstruo o trampa
  const findFreeCellInRoom = (roomId) => {
    const occupied = new Set();
    allMapItems.forEach((it) => {
      if (it.type === 'door' || it.type === 'secret_door') return;
      const w = it.w || 1;
      const h = it.h || 1;
      for (let yy = it.y; yy < it.y + h; yy++) {
        for (let xx = it.x; xx < it.x + w; xx++) {
          occupied.add(`${xx},${yy}`);
        }
      }
    });

    const rObj = getRoomObj(roomId);
    if (rObj) {
      for (let y = rObj.y1; y <= rObj.y2; y++) {
        for (let x = rObj.x1; x <= rObj.x2; x++) {
          if (!occupied.has(`${x},${y}`)) return { x, y };
        }
      }
      return { x: rObj.x1, y: rObj.y1 };
    }
    // Pasillo: buscar una casilla libre de pasillo cerca del centro
    for (let y = 9; y <= 18; y++) {
      for (let x = 1; x <= 24; x++) {
        if (getRoomAt(x, y) === 'CORRIDOR' && !occupied.has(`${x},${y}`)) {
          return { x, y };
        }
      }
    }
    return { x: 9, y: 9 };
  };

  const spawnDynamicPiece = (pieceType, customNote, customTrapDesc = '') => {
    const pos = findFreeCellInRoom(selectedRoomId);
    const dynId = Date.now().toString(36);
    const newItem = {
      x: pos.x,
      y: pos.y,
      type: pieceType,
      note: customNote || PIECE_TYPES[pieceType]?.label || 'Invocado',
      customTrapDesc,
      dynId,
    };
    setDynamicItems((prev) => [...prev, newItem]);
    if (PIECE_TYPES[pieceType]?.monsterId) {
      setSelectedTrapKey(null);
      setSelectedMonsterKey(getMonsterKey(newItem));
    } else if (pieceType === 'trap_pit' || pieceType === 'trap_spear') {
      setSelectedMonsterKey(null);
      setSelectedTrapKey(getTrapKey(newItem));
    }
  };

  const spawnNpcQuestInRoom = () => {
    const npc = pickWithoutRepeat('npc', DUNGEON_NPCS, (n) => n.id);
    if (!npc) return;
    spawnDynamicPiece('npc', `${npc.icon} ${npc.name}`);
    setRoomDiscovery({
      source: `NPC en ${selectedRoomId}`,
      title: `${npc.icon} ${npc.name} (${npc.role})`,
      badge: 'NPC + Mini-Misión',
      text: `${npc.dialogue} — ${npc.miniQuest} ${npc.rewardText}`,
      rewardLoot: npc.rewardLoot || null,
      rewardGold: npc.rewardGold || 0,
    });
    setRightTab('actions');
  };

  const sendPuzzleToHeroPhone = async () => {
    if (!effectiveHeroId) return;
    // Genera un puzzle procedural completamente nuevo y retador cada vez
    const chosen = generateProceduralPuzzle(partyLevel, selectedPuzzleId);
    const targetHero = heroes.find((h) => h.id === effectiveHeroId);
    try {
      await fetch('/api/puzzles/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroId: effectiveHeroId, puzzle: chosen }),
      });
      setPuzzleSentToast(`📲 Puzzle nuevo "${chosen.title}" enviado a ${targetHero?.name || 'Héroe'}!`);
      setTimeout(() => setPuzzleSentToast(null), 3500);
    } catch {
      // ignore
    }
  };

  const adjustQuickHP = (key, maxPC, delta) => {
    setQuickHP((prev) => {
      const current = prev[key] !== undefined ? prev[key] : maxPC;
      return { ...prev, [key]: Math.max(0, Math.min(maxPC + 5, current + delta)) };
    });
  };

  const toggleRevealRoom = (roomId) => {
    setRevealedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) next.delete(roomId);
      else next.add(roomId);
      return next;
    });
  };

  const revealAllRooms = () => {
    setRevealedRooms(new Set([...HQ_ROOMS.map((r) => r.id), 'CORRIDOR']));
  };

  // Checklist agrupado de piezas físicas a sacar de la caja
  const groupedChecklist = useMemo(() => {
    const groups = { Estructura: {}, Mobiliario: {}, Monstruos: {} };
    (currentMap.items || []).forEach((it) => {
      const info = PIECE_TYPES[it.type];
      if (!info) return;
      const bucket =
        info.category === 'Monstruo' || info.category === 'Jefe' || info.category === 'NPC'
          ? 'Monstruos'
          : info.category === 'Mobiliario'
          ? 'Mobiliario'
          : 'Estructura';
      if (!groups[bucket][it.type]) {
        groups[bucket][it.type] = { count: 0, info };
      }
      groups[bucket][it.type].count += 1;
    });
    return groups;
  }, [currentMap]);

  // Elementos dentro de la habitación seleccionada (incluyendo monstruos y trampas invocadas por eventos)
  const roomItems = useMemo(() => {
    return allMapItems
      .filter((it) => getRoomAt(it.x, it.y) === selectedRoomId)
      .map((it) => ({
        ...it,
        coord: coordLabel(it.x, it.y),
        info: PIECE_TYPES[it.type],
      }));
  }, [allMapItems, selectedRoomId]);

  // Monstruos de la sala auto-escalados al nivel actual del grupo
  const roomMonstersScaled = useMemo(() => {
    return roomItems
      .filter((it) => it.info?.monsterId)
      .map((it) => {
        const base = MONSTERS.find((m) => m.id === it.info.monsterId);
        if (!base) return null;
        return {
          item: it,
          scaled: scaleMonster(base, partyLevel, partySize, !!it.info.isBoss, false),
        };
      })
      .filter(Boolean);
  }, [roomItems, partyLevel, partySize]);

  const totalRoomXP = useMemo(() => {
    return roomMonstersScaled.reduce((acc, { scaled }) => acc + (scaled.scaledXP || 0), 0);
  }, [roomMonstersScaled]);

  // Monstruo actualmente seleccionado al hacer clic en el tablero
  const selectedMonsterObj = useMemo(() => {
    if (!selectedMonsterKey) return null;
    const foundItem = allMapItems.find(
      (it) => PIECE_TYPES[it.type]?.monsterId && getMonsterKey(it) === selectedMonsterKey
    );
    if (!foundItem) return null;
    const info = PIECE_TYPES[foundItem.type];
    const base = MONSTERS.find((m) => m.id === info.monsterId);
    if (!base) return null;
    const scaled = scaleMonster(base, partyLevel, partySize, !!info.isBoss, false);
    const currentPC =
      quickHP[selectedMonsterKey] !== undefined ? quickHP[selectedMonsterKey] : scaled.scaledPC;
    return {
      key: selectedMonsterKey,
      item: { ...foundItem, coord: coordLabel(foundItem.x, foundItem.y), info },
      scaled,
      currentPC,
    };
  }, [selectedMonsterKey, allMapItems, partyLevel, partySize, quickHP]);

  // Trampa actualmente seleccionada al hacer clic en ▲ ! en el tablero
  const selectedTrapObj = useMemo(() => {
    if (!selectedTrapKey) return null;
    const foundItem = allMapItems.find(
      (it) => (it.type === 'trap_pit' || it.type === 'trap_spear') && getTrapKey(it) === selectedTrapKey
    );
    if (!foundItem) return null;
    const rules = TRAP_RULES[foundItem.type] || TRAP_RULES.trap_spear;
    return {
      key: selectedTrapKey,
      item: { ...foundItem, coord: coordLabel(foundItem.x, foundItem.y), info: PIECE_TYPES[foundItem.type] },
      rules,
      disarmed: disarmedTraps.has(selectedTrapKey),
    };
  }, [selectedTrapKey, allMapItems, disarmedTraps]);

  // Pre-calcular paredes gruesas oficiales del tablero 26×19
  const wallSegments = useMemo(() => {
    const segs = [];
    for (let y = 0; y < BOARD_ROWS; y++) {
      for (let x = 0; x < BOARD_COLS; x++) {
        const r = getRoomAt(x, y);
        const px = MARGIN_LEFT + x * CELL;
        const py = MARGIN_TOP + y * CELL;
        if (y === 0 || getRoomAt(x, y - 1) !== r) {
          segs.push({ x1: px, y1: py, x2: px + CELL, y2: py });
        }
        if (y === BOARD_ROWS - 1) {
          segs.push({ x1: px, y1: py + CELL, x2: px + CELL, y2: py + CELL });
        }
        if (x === 0 || getRoomAt(x - 1, y) !== r) {
          segs.push({ x1: px, y1: py, x2: px, y2: py + CELL });
        }
        if (x === BOARD_COLS - 1) {
          segs.push({ x1: px + CELL, y1: py, x2: px + CELL, y2: py + CELL });
        }
      }
    }
    return segs;
  }, []);

  const selectedRoomObj = getRoomObj(selectedRoomId);
  const roomNotes = (currentMap.notes || []).filter((n) => n.room === selectedRoomId);
  const readAloud =
    ROOM_READ_ALOUD[selectedRoomId] ||
    'Al abrir la puerta, la luz de sus antorchas revela el interior de esta cámara silenciosa...';

  const linkedOfficialQuest = useMemo(
    () => QUESTS.find((q) => q.officialMapId === currentMap.id) || null,
    [currentMap.id]
  );
  const missionIntroText =
    currentMap._questRef?.readAloudIntro ||
    linkedOfficialQuest?.intro ||
    currentMap.specialAlert ||
    '';
  const missionObjectives =
    currentMap._questRef?.plot?.objective
      ? [`Principal: ${currentMap._questRef.plot.objective}`]
      : linkedOfficialQuest?.objectives || [];

  return (
    <div className="space-y-3">
      {/* Barra Superior Compacta y Profesional del Tablero */}
      <div className="grimoire-panel rounded-2xl p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-display font-bold text-amber-300 pr-1">
              <Compass className="w-4 h-4 text-amber-400" /> Tablero
            </span>
            <select
              value={selectedMapId}
              onChange={(e) => switchQuestMap(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-stone-950 border border-amber-500/70 text-amber-200 font-bold text-xs cursor-pointer"
            >
              {allAvailableMaps.map((m) => (
                <option key={m.id} value={m.id} className="bg-stone-900">
                  [{m.expansion}] {m.title}
                </option>
              ))}
            </select>
            {setPartyLevel && (
              <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-xs">
                <span className="text-stone-400">Nv:</span>
                <select
                  value={partyLevel}
                  onChange={(e) => setPartyLevel(Number(e.target.value))}
                  className="bg-transparent text-amber-300 font-bold cursor-pointer focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => (
                    <option key={l} value={l} className="bg-stone-900">
                      Nv.{l}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {setPartySize && (
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-extrabold text-emerald-300 cursor-pointer"
                title="Ajusta en vivo el número de jugadores y rebalancea el tablero y monstruos"
              >
                <option value={1}>🛡️ 1 Héroe (Solo)</option>
                <option value={2}>👥 2 Héroes</option>
                <option value={3}>👥 3 Héroes</option>
                <option value={4}>👥 4 Héroes</option>
              </select>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {missionIntroText && (
              <button
                onClick={() => setShowIntro((s) => !s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                  showIntro
                    ? 'bg-amber-600 text-slate-950 border-amber-300'
                    : 'bg-stone-900 border-amber-700/60 hover:border-amber-400 text-amber-200'
                }`}
                title="Mostrar u ocultar la narrativa inicial que el DM lee en voz alta antes de empezar"
              >
                <BookOpen className="w-3.5 h-3.5" /> Narrativa
              </button>
            )}
            <button
              onClick={() => (initOpen ? setInitOpen(false) : loadInitiativeForRoom(true))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                initOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-300'
                  : 'bg-purple-950/60 border-purple-500/60 hover:bg-purple-800 text-purple-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Iniciativa {initOpen ? `(R${initRound})` : ''}
            </button>
            {onStartTravelToCity && (
              <button
                onClick={onStartTravelToCity}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow"
                title="Inicia un encuentro interactivo de rol en el camino de regreso a la Ciudad"
              >
                🧭 Viajar a la Ciudad
              </button>
            )}
          </div>
        </div>

        {/* Barra de Oleadas (Solo aparece en misiones de Defensa del Bastión / Caravana) */}
        {currentMap._questRef?.plot?.id === 'defensa_oleadas' && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-display font-black text-rose-300">
                🛡️ DEFENSA POR OLEADAS — Oleada {currentWave}/5
              </span>
              <span className="text-slate-300 ml-2">
                {currentWave <= 2
                  ? 'Exploradores y hostigadores por 1 puerta.'
                  : currentWave <= 4
                  ? 'Élite y flanqueo por 2 puertas simultáneas.'
                  : '¡OLEADA FINAL! Llega el Comandante con Fase 2.'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentWave((w) => Math.max(1, w - 1))}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-bold cursor-pointer"
              >
                -1
              </button>
              <button
                onClick={() => setCurrentWave((w) => Math.min(5, w + 1))}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black cursor-pointer"
              >
                Siguiente Oleada →
              </button>
            </div>
          </div>
        )}

        {/* Barra Compacta de Iniciativa Sorpresa / Física (Héroes + Monstruos de la Sala) */}
        {initOpen && (
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/45 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-amber-300">
                  ⚡ Orden de Iniciativa — Ronda {initRound}
                </span>
                <span className="text-[11px] text-slate-400">
                  (Edita el d20 físico o mezcla al azar para sorpresa)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => loadInitiativeForRoom(true)}
                  className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold text-[11px] cursor-pointer"
                >
                  🎲 Mezclar Sorpresa
                </button>
                <button
                  onClick={() => {
                    const sorted = [...initList].sort((a, b) => Number(b.roll) - Number(a.roll));
                    setInitList(sorted);
                    setInitTurnIdx(0);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-[11px] cursor-pointer"
                >
                  ↕️ Ordenar por d20
                </button>
                <button
                  onClick={nextInitiativeTurn}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
                >
                  Siguiente Turno →
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {initList.map((entry, idx) => {
                const isTurn = idx === initTurnIdx;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setInitTurnIdx(idx)}
                    className={`px-2.5 py-1 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      isTurn
                        ? 'bg-amber-500/25 border-amber-400 text-white ring-2 ring-amber-400/60 scale-[1.02]'
                        : entry.kind === 'monster'
                        ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                        : 'bg-slate-950/70 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-black">{isTurn ? '▶' : `${idx + 1}.`}</span>
                    <span className="font-bold">{entry.kind === 'monster' ? '👹' : '🛡️'} {entry.name}</span>
                    <input
                      type="number"
                      value={entry.roll}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setInitList((prev) =>
                          prev.map((it) => (it.id === entry.id ? { ...it, roll: val } : it))
                        );
                      }}
                      className="w-10 px-1 py-0.5 rounded bg-black/50 border border-slate-600 text-center text-[11px] font-mono text-amber-300"
                      title="Resultado físico del d20"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Narrativa de Inicio de Misión (Para leer en voz alta antes de comenzar) */}
        {showIntro && missionIntroText && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/45 text-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display font-bold text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Leer en voz alta antes de iniciar — {currentMap.title}
              </span>
              <button
                onClick={() => setShowIntro(false)}
                className="text-[11px] px-2 py-0.5 rounded bg-stone-900/80 hover:bg-stone-800 text-stone-300 font-bold cursor-pointer"
              >
                Ocultar ✕
              </button>
            </div>
            <p className="text-amber-50/95 italic leading-relaxed">“{missionIntroText}”</p>
            {missionObjectives.length > 0 && (
              <div className="pt-1 border-t border-amber-800/40 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-amber-200/90">
                {missionObjectives.map((obj, i) => (
                  <span key={i}>• {obj}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cinta Táctica Compacta (Solo datos esenciales de mesa) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-red-300 font-bold">
              👹 Errante: <span className="text-stone-100">{currentMap.wanderingMonster}</span>
            </span>
            {partySize === 1 && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 font-bold">
                🛡️ Solitario: +1 PC al limpiar sala · Trampas -1 daño
              </span>
            )}
            {currentMap.hazardRooms?.[selectedRoomId] && (
              <span className="px-2 py-0.5 rounded-md bg-red-950/80 border border-red-600/60 text-red-200 font-bold">
                ⚠️ Peligro ({selectedRoomId}): {currentMap.hazardRooms[selectedRoomId].icon}{' '}
                {currentMap.hazardRooms[selectedRoomId].name} — {currentMap.hazardRooms[selectedRoomId].rule}
              </span>
            )}
          </div>
          {onRegisterNemesis && currentMap._questRef?.bossName && (
            <button
              onClick={() =>
                onRegisterNemesis(
                  currentMap._questRef.bossName,
                  currentMap._questRef.biome?.name || currentMap.title
                )
              }
              className="px-2.5 py-1 rounded-lg bg-red-900/60 border border-red-600/60 hover:bg-red-800 text-red-100 text-[11px] font-bold cursor-pointer shrink-0"
              title="Registra al Jefe como Némesis recurrente si logra escapar"
            >
              💨 Jefe Escapó (Némesis)
            </button>
          )}
        </div>
      </div>

      {/* Cuerpo Principal: Plano Pergamino SVG + Guía de Montaje por Sala */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* PLANO PERGAMINO ESTILO LIBRO DE MISIONES OFICIAL */}
        <div className="xl:col-span-8 parchment-sheet rounded-2xl p-3 sm:p-4 overflow-x-auto shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm text-stone-900 uppercase tracking-wider">
                {currentMap.title}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-900/15 border border-amber-900/30 text-[10px] font-black text-amber-950">
                Salas: {revealedRooms.size}/{HQ_ROOMS.length}
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-950">
              Toca una sala para ver su historia, reglas y montaje
            </span>
          </div>

          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full min-w-[740px] h-auto rounded-lg border-2 border-[#3b2c1e] bg-[#e7dbc0]"
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

            {/* Fondo de Pasillos (Gris Piedra Pergamino — clicable para ver bloqueos y trampas de pasillo) */}
            <rect
              x={MARGIN_LEFT}
              y={MARGIN_TOP}
              width={BOARD_COLS * CELL}
              height={BOARD_ROWS * CELL}
              fill={selectedRoomId === 'CORRIDOR' ? '#dfd0b0' : '#cfc2a7'}
              onClick={() => setSelectedRoomId('CORRIDOR')}
              className="cursor-pointer"
            />

            {/* Las 21 Habitaciones Oficiales (Pergamino Claro + Resalte de Sala Seleccionada) */}
            {HQ_ROOMS.map((r) => {
              const rx = MARGIN_LEFT + r.x1 * CELL;
              const ry = MARGIN_TOP + r.y1 * CELL;
              const rw = (r.x2 - r.x1 + 1) * CELL;
              const rh = (r.y2 - r.y1 + 1) * CELL;
              const isSelected = r.id === selectedRoomId;
              const isRevealed = revealedRooms.has(r.id);

              return (
                <g
                  key={r.id}
                  onClick={() => setSelectedRoomId(r.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={rx}
                    y={ry}
                    width={rw}
                    height={rh}
                    fill={r.id === 'R11' ? '#efe0c2' : '#f7eed9'}
                  />
                  {/* Sombra suave si la sala aún no fue abierta en la mesa */}
                  {showFogOverlay && !isRevealed && (
                    <rect
                      x={rx}
                      y={ry}
                      width={rw}
                      height={rh}
                      fill="rgba(36, 26, 18, 0.24)"
                    />
                  )}
                  {/* Resalte dorado de sala seleccionada */}
                  {isSelected && (
                    <rect
                      x={rx + 1.5}
                      y={ry + 1.5}
                      width={rw - 3}
                      height={rh - 3}
                      fill="rgba(217, 155, 38, 0.22)"
                      stroke="#b45309"
                      strokeWidth="3"
                    />
                  )}
                  {/* Etiqueta sutil del número de sala */}
                  <text
                    x={rx + 4}
                    y={ry + 11}
                    fontSize="8.5"
                    fontWeight="700"
                    fill="rgba(74, 56, 38, 0.55)"
                  >
                    {r.id}
                  </text>
                </g>
              );
            })}

            {/* Cuadrícula fina de piedra (26×19) */}
            {Array.from({ length: BOARD_COLS + 1 }, (_, x) => (
              <line
                key={`vx-${x}`}
                x1={MARGIN_LEFT + x * CELL}
                y1={MARGIN_TOP}
                x2={MARGIN_LEFT + x * CELL}
                y2={MARGIN_TOP + BOARD_ROWS * CELL}
                stroke="rgba(68, 52, 36, 0.32)"
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
                stroke="rgba(68, 52, 36, 0.32)"
                strokeWidth="0.75"
              />
            ))}

            {/* Paredes Gruesas Oficiales del Tablero */}
            {wallSegments.map((s, idx) => (
              <line
                key={idx}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke="#1c140e"
                strokeWidth="3"
                strokeLinecap="square"
              />
            ))}

            {/* PLANOS DE MOBILIARIO, ESTRUCTURA, TRAMPAS Y MONSTRUOS (Oficiales + Invocados) */}
            {allMapItems.map((item, idx) => {
              const info = PIECE_TYPES[item.type];
              if (!info) return null;
              const px = MARGIN_LEFT + item.x * CELL;
              const py = MARGIN_TOP + item.y * CELL;
              const w = (item.w || 1) * CELL;
              const h = (item.h || 1) * CELL;
              const roomId = getRoomAt(item.x, item.y);

              // 1. Escaleras 2×2
              if (item.type === 'stairs') {
                return (
                  <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                    <rect x={px + 2} y={py + 2} width={w - 4} height={h - 4} fill="#3f6212" stroke="#1a2e05" strokeWidth="2" rx="3" />
                    {[1, 2, 3, 4].map((step) => (
                      <line key={step} x1={px + 4} y1={py + (h / 5) * step} x2={px + w - 4} y2={py + (h / 5) * step} stroke="#d9f99d" strokeWidth="1.5" />
                    ))}
                    <text x={px + w / 2} y={py + h / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#ffffff">
                      INICIO
                    </text>
                  </g>
                );
              }

              // 2. Puerta / Puerta Secreta apoyada EXACTAMENTE sobre el muro (edge: N | S | E | W)
              if (item.type === 'door' || item.type === 'secret_door') {
                const isSecret = item.type === 'secret_door';
                const edge = item.edge || 'N';
                const isHorizontal = edge === 'N' || edge === 'S';
                const dw = isHorizontal ? CELL - 8 : 10;
                const dh = isHorizontal ? 10 : CELL - 8;
                const dx =
                  edge === 'W'
                    ? px - dw / 2
                    : edge === 'E'
                    ? px + CELL - dw / 2
                    : px + 4;
                const dy =
                  edge === 'N'
                    ? py - dh / 2
                    : edge === 'S'
                    ? py + CELL - dh / 2
                    : py + 4;

                return (
                  <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                    <rect
                      x={dx}
                      y={dy}
                      width={dw}
                      height={dh}
                      fill={isSecret ? '#7e22ce' : '#fde68a'}
                      stroke={isSecret ? '#f3e8ff' : '#78350f'}
                      strokeWidth="2.4"
                      strokeDasharray={isSecret ? '3,2' : undefined}
                      rx="2"
                    />
                    <text
                      x={dx + dw / 2}
                      y={dy + dh / 2 + 2.8}
                      textAnchor="middle"
                      fontSize="7.5"
                      fontWeight="900"
                      fill={isSecret ? '#ffffff' : '#451a03'}
                    >
                      {isSecret ? 'S' : 'P'}
                    </text>
                  </g>
                );
              }

              // 3. Roca / Muro Bloqueado (1×1 o 2×1 estilo oficial HeroQuest que acorta pasillos)
              if (item.type === 'blocked' || item.type === 'blocked_double') {
                return (
                  <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                    <rect
                      x={px + 1.5}
                      y={py + 1.5}
                      width={w - 3}
                      height={h - 3}
                      fill="#292524"
                      stroke="#0c0a09"
                      strokeWidth="2.5"
                      rx="2"
                    />
                    <line x1={px + 4} y1={py + 4} x2={px + w - 4} y2={py + h - 4} stroke="#78716c" strokeWidth="2" />
                    <line x1={px + w - 4} y1={py + 4} x2={px + 4} y2={py + h - 4} stroke="#78716c" strokeWidth="2" />
                    <rect x={px + w / 2 - 12} y={py + h / 2 - 5.5} width="24" height="11" fill="#1c1917" rx="1.5" />
                    <text
                      x={px + w / 2}
                      y={py + h / 2 + 3}
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="900"
                      fill="#e7e5e4"
                    >
                      MURO
                    </text>
                  </g>
                );
              }

              // 4. Trampas (Clicables para ver exactamente qué hacen y marcarlas como desarmadas)
              if (item.type === 'trap_pit' || item.type === 'trap_spear') {
                const tKey = getTrapKey(item);
                const isSelTrap = selectedTrapKey === tKey;
                const isDisarmed = disarmedTraps.has(tKey);
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
                    opacity={isDisarmed ? 0.45 : 1}
                  >
                    {isSelTrap && (
                      <circle
                        cx={px + CELL / 2}
                        cy={py + CELL / 2}
                        r="14.5"
                        fill="none"
                        stroke="#fde047"
                        strokeWidth="2.8"
                      />
                    )}
                    <polygon
                      points={`${px + CELL / 2},${py + 4} ${px + CELL - 4},${py + CELL - 4} ${px + 4},${py + CELL - 4}`}
                      fill={isDisarmed ? '#15803d' : info.fill}
                      stroke={isSelTrap ? '#fde047' : '#1c140e'}
                      strokeWidth="2"
                    />
                    <text x={px + CELL / 2} y={py + CELL - 8} textAnchor="middle" fontSize="8" fontWeight="900" fill="#ffffff">
                      {isDisarmed ? '✓' : '!'}
                    </text>
                  </g>
                );
              }

              // 5. Mobiliario (Planos rectangulares exactos con etiqueta clara)
              if (info.category === 'Mobiliario') {
                return (
                  <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                    <rect
                      x={px + 2.5}
                      y={py + 2.5}
                      width={w - 5}
                      height={h - 5}
                      fill={info.fill}
                      stroke={info.stroke}
                      strokeWidth="2"
                      rx="3"
                    />
                    <rect
                      x={px + 5}
                      y={py + 5}
                      width={w - 10}
                      height={h - 10}
                      fill="none"
                      stroke="rgba(255,245,220,0.35)"
                      strokeWidth="1"
                      rx="1.5"
                    />
                    <text
                      x={px + w / 2}
                      y={py + h / 2 + 3.5}
                      textAnchor="middle"
                      fontSize={w >= 64 ? '9.5' : '7'}
                      fontWeight="900"
                      fill="#fef3c7"
                    >
                      {info.code}
                    </text>
                  </g>
                );
              }

              // 6. Monstruos, Jefes y NPCs (Clicables para ver estadísticas, restar PC y matar)
              const mKey = info.monsterId ? getMonsterKey(item) : null;
              const isSelectedMon = mKey && selectedMonsterKey === mKey;
              const isDeadMon = mKey && quickHP[mKey] !== undefined && quickHP[mKey] <= 0;

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
                  opacity={isDeadMon ? 0.38 : 1}
                >
                  {isSelectedMon && (
                    <circle
                      cx={px + CELL / 2}
                      cy={py + CELL / 2}
                      r={info.isBoss ? 16 : 14.5}
                      fill="none"
                      stroke="#fde047"
                      strokeWidth="3"
                    />
                  )}
                  <circle
                    cx={px + CELL / 2}
                    cy={py + CELL / 2}
                    r={info.isBoss ? 13 : 11.5}
                    fill={isDeadMon ? '#44403c' : info.fill}
                    stroke={isSelectedMon ? '#fde047' : info.stroke}
                    strokeWidth={info.isBoss || isSelectedMon ? 2.8 : 2}
                  />
                  <text
                    x={px + CELL / 2}
                    y={py + CELL / 2 + 3.5}
                    textAnchor="middle"
                    fontSize={info.isBoss ? '9.5' : '8.5'}
                    fontWeight="900"
                    fill="#ffffff"
                  >
                    {info.code}
                  </text>
                  {isDeadMon && (
                    <>
                      <line
                        x1={px + 6}
                        y1={py + 6}
                        x2={px + CELL - 6}
                        y2={py + CELL - 6}
                        stroke="#ef4444"
                        strokeWidth="3"
                      />
                      <line
                        x1={px + CELL - 6}
                        y1={py + 6}
                        x2={px + 6}
                        y2={py + CELL - 6}
                        stroke="#ef4444"
                        strokeWidth="3"
                      />
                    </>
                  )}
                </g>
              );
            })}

            {/* Insignias de Notas Oficiales (A, B, C, D, E, BOSS) en esquina superior derecha de cada sala */}
            {(currentMap.notes || []).map((n) => {
              const r = getRoomObj(n.room);
              if (!r) return null;
              const bx = MARGIN_LEFT + (r.x2 + 1) * CELL - 12;
              const by = MARGIN_TOP + r.y1 * CELL + 12;
              return (
                <g key={n.code} onClick={() => setSelectedRoomId(n.room)} className="cursor-pointer">
                  <circle cx={bx} cy={by} r="10" fill="#991b1b" stroke="#fde047" strokeWidth="2" />
                  <text x={bx} y={by + 3.5} textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#fef08a">
                    {n.code.slice(0, 2)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Leyenda de Códigos del Mapa */}
          <div className="mt-3 pt-2 border-t border-amber-900/30 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-stone-800">
            <span><strong>P:</strong> Puerta</span>
            <span><strong className="text-purple-800">SEC:</strong> Puerta Secreta</span>
            <span><strong className="text-red-700">▲ !:</strong> Trampa</span>
            <span><strong className="text-green-800">GO/OR/AB:</strong> Goblin/Orco/Abominación</span>
            <span><strong className="text-slate-700">ES/ZO/MO:</strong> Esqueleto/Zombi/Momia</span>
            <span><strong className="text-red-800">GT:</strong> Guerrero Terror</span>
            <span><strong className="text-purple-900">GA/HE:</strong> Gárgola/Hechicero Jefe</span>
            <span><strong className="text-cyan-800">EP/AS/MI:</strong> Espectro/Asesino/Mímico</span>
          </div>
        </div>

        {/* PANEL DERECHO: MONSTRUO SELECCIONADO + GUÍA DE MONTAJE DE LA SALA */}
        <div className="xl:col-span-4 space-y-4">
          {/* TARJETA RÁPIDA DEL MONSTRUO CLICADO EN EL TABLERO */}
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
                    <Skull className="w-3.5 h-3.5" />
                    Monstruo Seleccionado · Casilla {selectedMonsterObj.item.coord}
                  </div>
                  <h4 className="font-display text-lg font-black text-white leading-tight mt-0.5">
                    {selectedMonsterObj.item.note || selectedMonsterObj.scaled.name}
                    {selectedMonsterObj.currentPC <= 0 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-red-900 text-red-200">
                        💀 DERROTADO
                      </span>
                    )}
                  </h4>
                  <div className="text-[11px] text-stone-400">
                    {selectedMonsterObj.scaled.family} · Escalado a Nv.{partyLevel}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMonsterKey(null)}
                  className="text-xs px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/60">
                  <div className="text-[9px] text-stone-400">ATQ</div>
                  <div className="font-black text-red-300">{selectedMonsterObj.scaled.scaledAt} DC</div>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60">
                  <div className="text-[9px] text-stone-400">DEF</div>
                  <div className="font-black text-amber-200">{selectedMonsterObj.scaled.scaledDef} DC</div>
                </div>
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-700">
                  <div className="text-[9px] text-stone-400">MOV</div>
                  <div className="font-black text-stone-100">{selectedMonsterObj.scaled.mov}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-cyan-950/50 border border-cyan-800/50">
                  <div className="text-[9px] text-stone-400">PM</div>
                  <div className="font-black text-cyan-300">{selectedMonsterObj.scaled.pm}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-700/60">
                  <div className="text-[9px] text-stone-400">VIDA</div>
                  <div className="font-black text-white">
                    {selectedMonsterObj.currentPC}/{selectedMonsterObj.scaled.scaledPC}
                  </div>
                </div>
              </div>

              {selectedMonsterObj.scaled.abilities && (
                <div className="text-[11px] text-amber-100 bg-black/40 p-2.5 rounded-xl border border-amber-900/50 leading-snug">
                  <strong>⚡ Especial:</strong> {selectedMonsterObj.scaled.abilities}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() =>
                    adjustQuickHP(selectedMonsterObj.key, selectedMonsterObj.scaled.scaledPC, -1)
                  }
                  className="flex-1 py-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-white font-black text-xs cursor-pointer"
                >
                  -1 PC
                </button>
                <button
                  onClick={() =>
                    adjustQuickHP(selectedMonsterObj.key, selectedMonsterObj.scaled.scaledPC, -2)
                  }
                  className="flex-1 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-black text-xs cursor-pointer"
                >
                  -2 PC
                </button>
                <button
                  onClick={() =>
                    adjustQuickHP(selectedMonsterObj.key, selectedMonsterObj.scaled.scaledPC, 1)
                  }
                  className="px-3 py-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 font-black text-xs cursor-pointer"
                >
                  +1
                </button>
                {selectedMonsterObj.currentPC > 0 ? (
                  <button
                    onClick={() => setMonsterHPDirect(selectedMonsterObj.key, 0)}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs cursor-pointer shadow"
                  >
                    💀 Matar
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setMonsterHPDirect(selectedMonsterObj.key, selectedMonsterObj.scaled.scaledPC)
                    }
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs cursor-pointer"
                  >
                    ↩️ Revivir
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TARJETA RÁPIDA DE LA TRAMPA CLICADA EN EL TABLERO (▲ !) */}
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
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Trampa en Tablero · Casilla {selectedTrapObj.item.coord}
                  </div>
                  <h4 className="font-display text-base font-black text-white mt-0.5">
                    {selectedTrapObj.item.note || selectedTrapObj.rules.name}
                    {selectedTrapObj.disarmed && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-emerald-700 text-white">
                        ✓ DESARMADA
                      </span>
                    )}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedTrapKey(null)}
                  className="text-xs px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {selectedTrapObj.item.customTrapDesc ? (
                <p className="text-orange-100 leading-snug bg-black/35 p-2.5 rounded-xl border border-orange-800/50">
                  {selectedTrapObj.item.customTrapDesc}
                </p>
              ) : (
                <div className="space-y-1 bg-black/35 p-2.5 rounded-xl border border-orange-800/50 text-stone-200">
                  <p><strong className="text-amber-300">👁️ Detectar:</strong> {selectedTrapObj.rules.detect}</p>
                  <p><strong className="text-sky-300">🔧 Desarmar:</strong> {selectedTrapObj.rules.disarm}</p>
                  <p><strong className="text-red-300">💥 Si se activa:</strong> {selectedTrapObj.rules.effect}</p>
                </div>
              )}

              <button
                onClick={() => toggleDisarmTrap(selectedTrapObj.key)}
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

          {/* PANEL ORGANIZADO EN 3 PESTAÑAS LIMPIAS */}
          <div className="grimoire-panel rounded-2xl p-4 space-y-3.5">
            {/* Encabezado de Sala Seleccionada */}
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

            {/* Selector de 3 Pestañas del Panel DM */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setRightTab('setup')}
                className={`py-1.5 rounded-lg cursor-pointer transition ${
                  rightTab === 'setup'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📍 Sala ({roomItems.length})
              </button>
              <button
                onClick={() => setRightTab('actions')}
                className={`py-1.5 rounded-lg cursor-pointer transition ${
                  rightTab === 'actions'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🧰 Herramientas
              </button>
              <button
                onClick={() => setRightTab('notes')}
                className={`py-1.5 rounded-lg cursor-pointer transition ${
                  rightTab === 'notes'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🗺️ Notas ({(currentMap.notes || []).length})
              </button>
            </div>

            {/* ==================== SUB-TAB 1: SALA COMPLETA (HISTORIA + TRIGGERS + PIEZAS + RESULTADO) ==================== */}
            {rightTab === 'setup' && (() => {
              const roomTriggers = buildRoomTriggers(currentMap, selectedRoomId, roomItems);
              return (
              <div className="space-y-3">
                {/* 1. HISTORIA / ESCENA O PANEL DE PASILLOS CON VIDA */}
                {selectedRoomId === 'CORRIDOR' ? (
                  <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/45 space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                      🧱 Pasillos con Vida (Acciones para que no sea solo caminar)
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">
                      Cuando los héroes avancen por corredores largos o duden en un cruce, dispara un suceso de pasillo para mantener la tensión:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <button
                        onClick={() => triggerContextualRoomEvent('corridor')}
                        className="py-2 px-2.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold cursor-pointer"
                      >
                        🕯️ Suceso de Pasillo
                      </button>
                      <button
                        onClick={() => {
                          const h = generateHintCard(currentMap.biomeId || 'catacumbas');
                          setRoomDiscovery({
                            source: `Cruce de Pasillo · ${h.biomeName}`,
                            title: `${h.biomeIcon} ${h.title}`,
                            badge: 'Pista de Pasillo',
                            text: `“${h.clue}” | ✓ Ventaja: ${h.reward} | ⚠️ Riesgo: ${h.consequence}`,
                          });
                        }}
                        className="py-2 px-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white font-bold cursor-pointer"
                      >
                        🔍 Pista de Cruce
                      </button>
                      <button
                        onClick={() =>
                          setRoomDiscovery({
                            source: 'Pasillo · Escuchar tras Puerta',
                            title: '👂 Escuchar en la Puerta (Percepción CD 12)',
                            badge: 'Acción Táctica',
                            text: 'Si superan Percepción CD 12, el DM les dice cuántos enemigos escuchan dentro y si están Distraídos (Ventaja en 1ª ronda). Si fallan por 5+, hacen ruido (+1 Reloj del Caos).',
                          })
                        }
                        className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-200 font-bold cursor-pointer"
                      >
                        👂 Escuchar Puerta
                      </button>
                      <button
                        onClick={() =>
                          setRoomDiscovery({
                            source: 'Pasillo · Ladrillo Suelto',
                            title: '🧱 Alijo Oculto en el Muro',
                            badge: 'Hallazgo',
                            text: 'Investigación CD 12: tras un ladrillo flojo encuentran 15 MO y 1 Venda de Campaña (+1 PC).',
                            rewardGold: 15,
                            rewardLoot: {
                              name: 'Venda de Campaña (+1 PC)',
                              type: 'Poción',
                              rarity: 'comun',
                              dice: '+1 PC',
                              special: 'Restaura 1 PC en cualquier momento.',
                              restriction: 'Todas las clases',
                            },
                          })
                        }
                        className="py-2 px-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                      >
                        🧱 Alijo en Muro
                      </button>
                    </div>
                  </div>
                ) : currentMap.storyBeats?.[selectedRoomId] ? (
                  <div className="p-3.5 rounded-xl bg-amber-950/35 border-l-4 border-amber-400 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> {currentMap.storyBeats[selectedRoomId].title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                        {currentMap.storyBeats[selectedRoomId].stage}
                      </span>
                    </div>
                    <p className="font-lore text-sm italic text-amber-100 leading-relaxed">
                      “{currentMap.storyBeats[selectedRoomId].readAloud}”
                    </p>
                    {currentMap.storyBeats[selectedRoomId].dmTip && (
                      <div className="text-[11px] text-sky-200 bg-slate-950/75 p-2 rounded-lg border border-sky-500/30">
                        <strong>🔒 Guía DM:</strong> {currentMap.storyBeats[selectedRoomId].dmTip}
                      </div>
                    )}
                  </div>
                ) : selectedRoomId === 'R14' && currentMap.readAloudIntro ? (
                  <div className="p-3 rounded-xl bg-amber-950/25 border-l-4 border-amber-400 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Historia de Inicio (Leer en Voz Alta):
                    </div>
                    <p className="font-lore text-sm italic text-amber-100 leading-relaxed">
                      “{currentMap.readAloudIntro}”
                    </p>
                  </div>
                ) : null}

                {/* 2. DISPARADORES Y EVENTOS ESPECÍFICOS DE ESTA SALA (SOLO LOS QUE APLICAN AQUÍ) */}
                {roomTriggers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                      <span>🎬 Eventos y Reglas Activas en {selectedRoomId} ({roomTriggers.length})</span>
                      <span className="text-slate-400 font-normal">Solo lo que ocurre aquí</span>
                    </div>
                    {roomTriggers.map((tr) => (
                      <div key={tr.id} className={`p-3 rounded-xl border text-xs space-y-1.5 ${tr.color}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span>{tr.icon}</span> {tr.title}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase shrink-0 ${tr.badgeColor}`}>
                            {tr.badge}
                          </span>
                        </div>
                        <div className="text-[11px] leading-snug text-slate-200">
                          <strong className="text-amber-300">⏱️ CUÁNDO:</strong> {tr.when}
                        </div>
                        <div className="text-[11px] leading-snug text-slate-200">
                          <strong className="text-emerald-300">🎯 PARA QUÉ / EFECTO:</strong> {tr.purpose}
                        </div>
                        {tr.actionType === 'puzzle' && (
                          <div className="pt-1">
                            <button
                              onClick={() => setPuzzleOpen((v) => !v)}
                              className="px-2.5 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              {tr.actionLabel}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Selector Inline de Puzzle (se despliega aquí mismo sin cambiar de pestaña) */}
                {puzzleOpen && (
                  <div className="p-3 rounded-xl bg-fuchsia-950/40 border border-fuchsia-500/60 space-y-2 text-xs">
                    <div className="font-bold text-fuchsia-200 flex items-center justify-between">
                      <span>🧩 Enviar Puzzle de {selectedRoomId} al Celular</span>
                      <button
                        onClick={() => setPuzzleOpen(false)}
                        className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cerrar
                      </button>
                    </div>
                    {heroes.length === 0 ? (
                      <p className="text-[11px] text-slate-400">Crea al menos un héroe para mandarle un puzzle.</p>
                    ) : (
                      <>
                        <select
                          value={effectiveHeroId}
                          onChange={(e) => setTargetHeroId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-fuchsia-700/60 text-slate-100"
                        >
                          {heroes.map((h) => (
                            <option key={h.id} value={h.id}>
                              Resolverá: {h.name} ({h.className})
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedPuzzleId}
                          onChange={(e) => setSelectedPuzzleId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100"
                        >
                          <option value="random">🎲 Procedural Aleatorio</option>
                          <option value="timing_bar">✂️ Precisión en Movimiento (Trampa)</option>
                          <option value="dial_lock">🔐 Bóveda Numérica</option>
                          <option value="memory_runes">🧠 Memoria de Runas (Simón Dice)</option>
                          <option value="balance_scales">⚖️ Balanza de Reliquias</option>
                          <option value="sequence">✨ Sello Lógico de 4 Runas</option>
                          <option value="riddle">🗣️ Acertijo Oscuro</option>
                        </select>
                        <button
                          onClick={sendPuzzleToHeroPhone}
                          className="w-full py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black cursor-pointer"
                        >
                          📲 Mandar Puzzle Ahora al Celular
                        </button>
                      </>
                    )}
                  </div>
                )}

                {puzzleSentToast && (
                  <div className="p-2 rounded-xl bg-fuchsia-800/90 border border-fuchsia-400 text-white text-xs font-bold text-center">
                    {puzzleSentToast}
                  </div>
                )}

                {/* Resultado en Vivo (Examinar mueble, Tesoro, Pista o Evento — VISIBLE AQUÍ MISMO) */}
                {roomDiscovery && (() => {
                  const spawn = detectSpawnable(roomDiscovery, currentMap);
                  return (
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/70 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-700 text-white">
                          {roomDiscovery.source} · {roomDiscovery.badge}
                        </span>
                        <button
                          onClick={() => setRoomDiscovery(null)}
                          className="text-slate-400 hover:text-white text-[11px] font-bold cursor-pointer"
                        >
                          Cerrar ✕
                        </button>
                      </div>
                      <div className="font-display font-bold text-sm text-amber-200">{roomDiscovery.title}</div>
                      <p className="text-slate-200 leading-snug">{roomDiscovery.text}</p>
                      {(spawn.monsterType || spawn.trapType) && (
                        <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap gap-1.5">
                          {spawn.monsterType && (
                            <button
                              onClick={() => spawnDynamicPiece(spawn.monsterType, `${spawn.monsterLabel} (Evento)`)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-black text-[11px] cursor-pointer"
                            >
                              👹 Poner {spawn.monsterLabel} en Tablero
                            </button>
                          )}
                          {spawn.trapType && (
                            <button
                              onClick={() => spawnDynamicPiece(spawn.trapType, roomDiscovery.title, roomDiscovery.text)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-black text-[11px] cursor-pointer"
                            >
                              ▲ Poner Trampa en Tablero
                            </button>
                          )}
                        </div>
                      )}
                      {(roomDiscovery.rewardLoot || roomDiscovery.rewardGold > 0) && onSendLootToHero && heroes.length > 0 && (
                        <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center gap-2">
                          <select
                            value={effectiveHeroId}
                            onChange={(e) => setTargetHeroId(e.target.value)}
                            className="flex-1 px-2 py-1.5 rounded-lg bg-slate-950 border border-emerald-700 text-xs text-slate-100"
                          >
                            {heroes.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.name} ({h.className})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              onSendLootToHero(effectiveHeroId, roomDiscovery.rewardLoot, roomDiscovery.rewardGold);
                              setRoomDiscovery(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Gift className="w-3.5 h-3.5" /> Mandar Botín
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3. Notas Especiales y Recompensas de Esta Sala */}
                {roomNotes.length > 0 && (
                  <div className="space-y-2">
                    {roomNotes.map((n) => (
                      <div key={n.code} className="p-3 rounded-xl bg-purple-950/35 border border-purple-500/50 text-xs space-y-2">
                        <div className="font-bold text-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> [{n.code}] {n.title}
                        </div>
                        <p className="text-slate-200 leading-relaxed">{n.text}</p>
                        {n.rewards && n.rewards.length > 0 && (
                          <div className="pt-2 border-t border-purple-800/60 space-y-1.5">
                            {heroes.length > 0 && (
                              <select
                                value={effectiveHeroId}
                                onChange={(e) => setTargetHeroId(e.target.value)}
                                className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-purple-700/70 text-[11px] text-slate-100"
                              >
                                {heroes.map((h) => (
                                  <option key={h.id} value={h.id}>
                                    Enviar hallazgo a: {h.name} ({h.className})
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex flex-wrap gap-1.5">
                              {n.rewards.map((rw, rIdx) => (
                                <button
                                  key={rIdx}
                                  onClick={() => {
                                    if (rw.xp && onAwardXP) {
                                      onAwardXP(rw.xp);
                                    } else if (onSendLootToHero && effectiveHeroId) {
                                      onSendLootToHero(effectiveHeroId, rw.loot || null, rw.gold || 0);
                                    }
                                  }}
                                  disabled={!rw.xp && heroes.length === 0}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-[11px] flex items-center gap-1 cursor-pointer"
                                >
                                  <Gift className="w-3.5 h-3.5" />
                                  {rw.xp ? `Repartir ${rw.label}` : `Mandar ${rw.label}`}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Montaje Separado por Categoría (Monstruos / Muebles / Puertas y Trampas) */}
                {roomItems.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No hay piezas en esta sala.</p>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {/* 1) Monstruos */}
                    {roomItems.filter((it) => it.info?.monsterId).length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                          👹 Monstruos (toca para ver stats / vida)
                        </div>
                        {roomItems
                          .filter((it) => it.info?.monsterId)
                          .map((it, idx) => {
                            const mKey = getMonsterKey(it);
                            const isDead = quickHP[mKey] !== undefined && quickHP[mKey] <= 0;
                            const isSel = selectedMonsterKey === mKey;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedTrapKey(null);
                                  setSelectedMonsterKey(mKey);
                                }}
                                className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                                  isSel
                                    ? 'bg-rose-950/70 border-amber-400'
                                    : isDead
                                    ? 'bg-slate-950/60 border-slate-800 opacity-55'
                                    : 'bg-rose-950/25 border-rose-900/50 hover:border-amber-500'
                                }`}
                              >
                                <div className="min-w-0">
                                  <span
                                    className="inline-block px-1.5 py-0.5 rounded text-[10px] font-black text-white mr-1.5"
                                    style={{ backgroundColor: isDead ? '#57534e' : it.info?.fill }}
                                  >
                                    {it.info?.code}
                                  </span>
                                  <strong className={isDead ? 'line-through text-slate-500' : 'text-slate-100'}>
                                    {it.label || it.note || it.info?.label}
                                  </strong>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className={`text-[10px] font-bold ${isDead ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {isDead ? '💀' : '🎯 Stats'}
                                  </span>
                                  <span className="font-mono font-bold text-amber-400">{it.coord}</span>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    )}

                    {/* 2) Muebles Interactivos (Examinar muestra resultado aquí mismo!) */}
                    {roomItems.filter((it) => it.info?.furnitureKey).length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                          🪑 Muebles (toca Examinar sin salir de esta vista)
                        </div>
                        {roomItems
                          .filter((it) => it.info?.furnitureKey)
                          .map((it, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/50 text-xs flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <strong className="text-slate-100">{it.info?.label}</strong>
                                {(it.w > 1 || it.h > 1) && (
                                  <span className="text-sky-300 text-[10px] ml-1">({it.w}×{it.h})</span>
                                )}
                                <span className="font-mono text-[11px] text-amber-400 ml-1.5">{it.coord}</span>
                                {it.note && <div className="text-[10px] text-amber-300/90 truncate">★ {it.note}</div>}
                              </div>
                              <button
                                onClick={() => examineFurnitureHere(it.info.furnitureKey)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black cursor-pointer shrink-0"
                              >
                                🪑 Examinar
                              </button>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* 3) Puertas, Trampas y Estructura */}
                    {roomItems.filter((it) => !it.info?.monsterId && !it.info?.furnitureKey).length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                          🚪 Puertas, Trampas y Estructura
                        </div>
                        {roomItems
                          .filter((it) => !it.info?.monsterId && !it.info?.furnitureKey)
                          .map((it, idx) => {
                            const isTrap = it.type === 'trap_pit' || it.type === 'trap_spear';
                            const tKey = isTrap ? getTrapKey(it) : null;
                            const isDisarmed = tKey && disarmedTraps.has(tKey);
                            return (
                              <div
                                key={idx}
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
                                      : 'bg-orange-950/35 border-orange-600/60 cursor-pointer hover:border-amber-400'
                                    : 'bg-slate-900/80 border-slate-800'
                                }`}
                              >
                                <div className="min-w-0">
                                  <span
                                    className="inline-block px-1.5 py-0.5 rounded text-[10px] font-black text-white mr-1.5"
                                    style={{ backgroundColor: isDisarmed ? '#15803d' : it.info?.fill }}
                                  >
                                    {it.info?.code}
                                  </span>
                                  <strong className={isDisarmed ? 'line-through text-slate-400' : 'text-slate-100'}>
                                    {it.label || it.info?.label}
                                  </strong>
                                  {it.edge && (
                                    <span className="text-amber-300 text-[10px] ml-1">[Muro {it.edge}]</span>
                                  )}
                                  {isTrap && (
                                    <span className="ml-1.5 text-[10px] font-bold text-orange-300">
                                      {isDisarmed ? '✓ Desarmada' : '▲ Ver qué hace'}
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono font-bold text-amber-400 shrink-0">{it.coord}</span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Barra Rápida de Sala (siempre a mano sin cambiar de pestaña) */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-1.5">
                  <button
                    onClick={searchRoomTreasure}
                    className="py-2 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-extrabold cursor-pointer"
                  >
                    💎 Tesoro
                  </button>
                  <button
                    onClick={() => {
                      const h = generateHintCard(currentMap.biomeId || 'catacumbas');
                      setRoomDiscovery({
                        source: `Pista · ${h.biomeName}`,
                        title: `${h.biomeIcon} ${h.title}`,
                        badge: 'Pista Sensorial',
                        text: `“${h.clue}” | ✓ Si investigan: ${h.reward} | ⚠️ Riesgo: ${h.consequence}`,
                      });
                    }}
                    className="py-2 px-2 rounded-xl bg-sky-800 hover:bg-sky-700 text-white text-[11px] font-extrabold cursor-pointer"
                  >
                    🔍 Pista
                  </button>
                  <button
                    onClick={() => triggerContextualRoomEvent('room')}
                    className="py-2 px-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-extrabold cursor-pointer"
                  >
                    ✨ Evento
                  </button>
                </div>
              </div>
              );
            })()}

            {/* ==================== SUB-TAB 2: HERRAMIENTAS LIBRES DEL DM ==================== */}
            {rightTab === 'actions' && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400">
                  Herramientas libres para improvisar en cualquier momento (los triggers específicos de cada sala ya están integrados en <strong>📍 Sala</strong>).
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={searchRoomTreasure}
                    className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Gem className="w-4 h-4" /> Buscar Tesoro
                  </button>
                  <button
                    onClick={() => triggerContextualRoomEvent('room')}
                    className="py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Sparkles className="w-4 h-4" /> Evento Sala
                  </button>
                  <button
                    onClick={() => triggerContextualRoomEvent('corridor')}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-amber-200 text-xs font-black cursor-pointer"
                  >
                    🕯️ Evento Pasillo
                  </button>
                  <button
                    onClick={() => setQuickSendOpen((v) => !v)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer border ${
                      quickSendOpen
                        ? 'bg-amber-500 text-black border-amber-300'
                        : 'bg-amber-950/60 hover:bg-amber-900/70 text-amber-200 border-amber-700/70'
                    }`}
                  >
                    <Gift className="w-4 h-4" /> Dar Botín
                  </button>
                  <button
                    onClick={spawnNpcQuestInRoom}
                    className="py-2.5 px-3 rounded-xl bg-sky-800 hover:bg-sky-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    🧙 Invocar NPC
                  </button>
                  <button
                    onClick={() => setPuzzleOpen((v) => !v)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer border ${
                      puzzleOpen
                        ? 'bg-fuchsia-500 text-black border-fuchsia-300'
                        : 'bg-fuchsia-950/60 hover:bg-fuchsia-900/70 text-fuchsia-200 border-fuchsia-700/70'
                    }`}
                  >
                    🧩 Puzzle Celular
                  </button>
                </div>

                {puzzleSentToast && (
                  <div className="p-2.5 rounded-xl bg-fuchsia-800/90 border border-fuchsia-400 text-white text-xs font-bold text-center">
                    {puzzleSentToast}
                  </div>
                )}

                {puzzleOpen && (
                  <div className="p-3 rounded-xl bg-fuchsia-950/35 border border-fuchsia-600/60 space-y-2 text-xs">
                    <div className="font-bold text-fuchsia-300 flex items-center justify-between">
                      <span>🧩 Mandar Puzzle Interactivo al Celular</span>
                      <button
                        onClick={() => setPuzzleOpen(false)}
                        className="text-[10px] text-stone-400 hover:text-white cursor-pointer"
                      >
                        Cerrar
                      </button>
                    </div>
                    {heroes.length === 0 ? (
                      <p className="text-[11px] text-stone-400">Crea al menos un héroe para mandarle un puzzle.</p>
                    ) : (
                      <>
                        <select
                          value={effectiveHeroId}
                          onChange={(e) => setTargetHeroId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-fuchsia-700/60 text-stone-100"
                        >
                          {heroes.map((h) => (
                            <option key={h.id} value={h.id}>
                              Resolverá: {h.name} ({h.className})
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedPuzzleId}
                          onChange={(e) => setSelectedPuzzleId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100"
                        >
                          <option value="random">🎲 Procedural Aleatorio (Infinito y Difícil)</option>
                          <option value="timing_bar">✂️ Precisión en Movimiento (Trampa)</option>
                          <option value="dial_lock">🔐 Bóveda Numérica Procedural</option>
                          <option value="memory_runes">🧠 Memoria de 5-6 Runas (Simón Dice)</option>
                          <option value="balance_scales">⚖️ Balanza de Reliquias Procedural</option>
                          <option value="sequence">✨ Sello Lógico de 4 Runas</option>
                          <option value="riddle">🗣️ Acertijo Oscuro Difícil</option>
                        </select>
                        <button
                          onClick={sendPuzzleToHeroPhone}
                          className="w-full py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black cursor-pointer"
                        >
                          📲 Mandar Puzzle Ahora al Celular
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Resultado Activo (con botón 1 clic para Mandar Botín, Invocar Monstruo o Colocar Trampa en el Tablero) */}
                {roomDiscovery ? (
                  (() => {
                    const spawn = detectSpawnable(roomDiscovery, currentMap);
                    return (
                      <div className="p-3.5 rounded-xl bg-emerald-950/35 border-2 border-emerald-500/70 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-700 text-white">
                            {roomDiscovery.source} · {roomDiscovery.badge}
                          </span>
                          <button
                            onClick={() => setRoomDiscovery(null)}
                            className="text-stone-400 hover:text-white text-[11px] font-bold cursor-pointer"
                          >
                            Cerrar
                          </button>
                        </div>
                        <div className="font-display font-bold text-sm text-amber-200">{roomDiscovery.title}</div>
                        <p className="text-stone-200 leading-snug">{roomDiscovery.text}</p>

                        {/* Invocar Monstruo o Trampa directamente en el tablero */}
                        {(spawn.monsterType || spawn.trapType) && (
                          <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap gap-1.5">
                            {spawn.monsterType && (
                              <button
                                onClick={() =>
                                  spawnDynamicPiece(
                                    spawn.monsterType,
                                    `${spawn.monsterLabel} (Evento)`
                                  )
                                }
                                className="flex-1 py-1.5 px-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-black text-[11px] cursor-pointer"
                              >
                                👹 Poner {spawn.monsterLabel} en Tablero
                              </button>
                            )}
                            {spawn.trapType && (
                              <button
                                onClick={() =>
                                  spawnDynamicPiece(
                                    spawn.trapType,
                                    roomDiscovery.title,
                                    roomDiscovery.text
                                  )
                                }
                                className="flex-1 py-1.5 px-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-black text-[11px] cursor-pointer"
                              >
                                ▲ Poner Trampa en Tablero
                              </button>
                            )}
                          </div>
                        )}

                        {/* Enviar Botín / Oro al Celular del Héroe */}
                        {(roomDiscovery.rewardLoot || roomDiscovery.rewardGold > 0) && onSendLootToHero && (
                          <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center gap-2">
                            {heroes.length === 0 ? (
                              <span className="text-[11px] text-amber-300">
                                Crea al menos un héroe para enviarle este botín.
                              </span>
                            ) : (
                              <>
                                <select
                                  value={effectiveHeroId}
                                  onChange={(e) => setTargetHeroId(e.target.value)}
                                  className="flex-1 px-2 py-1.5 rounded-lg bg-stone-950 border border-emerald-700 text-xs text-stone-100"
                                >
                                  {heroes.map((h) => (
                                    <option key={h.id} value={h.id}>
                                      {h.name} ({h.className})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => {
                                    onSendLootToHero(
                                      effectiveHeroId,
                                      roomDiscovery.rewardLoot,
                                      roomDiscovery.rewardGold
                                    );
                                    setRoomDiscovery(null);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Gift className="w-3.5 h-3.5" /> Mandar a Inventario
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-xs text-stone-400 text-center py-3 bg-stone-950/60 rounded-xl border border-stone-800">
                    Pulsa un botón arriba para sacar un Tesoro, Evento de Sala o Pasillo. Si aparece un monstruo o trampa, podrás ponerlo en el tablero en 1 clic.
                  </p>
                )}

                {/* Envío Rápido de Armas, Pociones, Pergaminos, Accesorios u Oro */}
                {quickSendOpen && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/60 space-y-2 text-xs">
                    <div className="font-bold text-amber-300 flex items-center justify-between">
                      <span>🎁 Enviar rápido al celular de un Héroe</span>
                      <button
                        onClick={() => setQuickSendOpen(false)}
                        className="text-[10px] text-stone-400 hover:text-white cursor-pointer"
                      >
                        Cerrar
                      </button>
                    </div>
                    {heroes.length === 0 ? (
                      <p className="text-[11px] text-stone-400">Crea al menos un héroe en Forja y Hojas.</p>
                    ) : (
                      <>
                        <select
                          value={effectiveHeroId}
                          onChange={(e) => setTargetHeroId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-amber-700/60 text-stone-100"
                        >
                          {heroes.map((h) => (
                            <option key={h.id} value={h.id}>
                              Para: {h.name} ({h.className})
                            </option>
                          ))}
                        </select>
                        <div className="flex flex-wrap gap-1">
                          {['Todos', 'Arma', 'Armadura', 'Poción', 'Pergamino', 'Accesorio', 'Artefacto'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                setQuickCat(cat);
                                const first = DIGITAL_LOOT_CATALOG.find(
                                  (it) => cat === 'Todos' || it.type === cat
                                );
                                if (first) setQuickLootId(first.id);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                quickCat === cat
                                  ? 'bg-amber-500 text-black'
                                  : 'bg-stone-900 text-stone-300 border border-stone-700'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          <select
                            value={quickLootId}
                            onChange={(e) => setQuickLootId(e.target.value)}
                            className="flex-1 px-2 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-[11px]"
                          >
                            {DIGITAL_LOOT_CATALOG.filter(
                              (it) => quickCat === 'Todos' || it.type === quickCat
                            ).map((it) => (
                              <option key={it.id} value={it.id}>
                                [{getRarityMeta(it.rarity).name}] {it.name} {it.dice ? `(${it.dice})` : ''}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              const found = DIGITAL_LOOT_CATALOG.find((it) => it.id === quickLootId);
                              if (found && onSendLootToHero) {
                                onSendLootToHero(effectiveHeroId, found, 0);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer shrink-0"
                          >
                            Enviar
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-amber-900/40">
                          <span className="text-[10px] text-stone-400">Oro rápido:</span>
                          {[25, 50, 100].map((amt) => (
                            <button
                              key={amt}
                              onClick={() => onSendLootToHero && onSendLootToHero(effectiveHeroId, null, amt)}
                              className="px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-700/70 border border-amber-600/60 text-amber-200 font-bold text-[10px] cursor-pointer"
                            >
                              +{amt} MO
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== SUB-TAB 3: ÍNDICE DE SALAS CON NOTAS ==================== */}
            {rightTab === 'notes' && (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                <p className="text-[11px] text-stone-400">
                  Toca cualquier nota para saltar directo a esa sala en el mapa:
                </p>
                {(currentMap.notes || []).map((n) => (
                  <button
                    key={n.code}
                    onClick={() => {
                      setSelectedRoomId(n.room);
                      setRightTab('setup');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      selectedRoomId === n.room
                        ? 'bg-purple-950/50 border-amber-400'
                        : 'bg-stone-900/80 hover:bg-stone-800 border-stone-800'
                    }`}
                  >
                    <span className="inline-block px-1.5 py-0.5 rounded bg-red-900 text-amber-200 font-bold text-[10px] mr-1.5">
                      {n.code}
                    </span>
                    <strong className="text-stone-100">{n.title}</strong>{' '}
                    <span className="text-stone-400">({n.room})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HOJAS COMPLETAS DE LOS ENEMIGOS DE ESTA SALA (Todo en una sola pantalla) */}
      {roomMonstersScaled.length > 0 && (
        <div className="grimoire-panel rounded-2xl p-5 space-y-4 border-red-800/50">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <h4 className="font-display text-lg font-bold text-red-300 flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-400" /> Hojas de Enemigos en {selectedRoomObj ? selectedRoomObj.name : selectedRoomId} (Auto-Escalados a Nivel {partyLevel})
              </h4>
              <p className="text-xs text-stone-400">
                Todas sus estadísticas, habilidades, efectos y control rápido de PC aquí mismo sin salir del tablero.
              </p>
            </div>
            {onAwardXP && totalRoomXP > 0 && (
              <button
                onClick={() => onAwardXP(totalRoomXP)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow"
              >
                ✨ Sala Limpia: Repartir {totalRoomXP} XP al Grupo
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {roomMonstersScaled.map(({ item, scaled }, idx) => {
              const hpKey = `${selectedMapId}-${selectedRoomId}-${idx}`;
              const currentHP = quickHP[hpKey] !== undefined ? quickHP[hpKey] : scaled.scaledPC;
              const isDead = currentHP <= 0;
              return (
                <div
                  key={hpKey}
                  className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 transition ${
                    isDead
                      ? 'bg-stone-950/60 border-stone-800 opacity-50'
                      : 'bg-stone-900/90 border-red-900/50'
                  }`}
                >
                  <div className="space-y-3">
                    {scaled.image && (
                      <div className="-mx-4 -mt-4 h-32 overflow-hidden rounded-t-2xl relative border-b border-red-900/40">
                        <img src={scaled.image} alt={scaled.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-950 text-amber-300">
                          Casilla {item.coord} · {scaled.family}
                        </span>
                        <h5 className={`font-display font-bold text-base mt-1 ${isDead ? 'line-through text-stone-500' : 'text-stone-100'}`}>
                          {scaled.name}
                        </h5>
                        {item.note && <div className="text-[11px] text-amber-400 font-semibold">{item.note}</div>}
                        <div className="text-[10px] text-stone-400">Miniatura: {scaled.miniature}</div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 shrink-0">
                        {scaled.scaledXP} XP
                      </span>
                    </div>

                    {/* Estadísticas Completas */}
                    <div className="grid grid-cols-6 gap-1 text-center">
                      <div className="p-1.5 rounded bg-stone-950 border border-stone-800">
                        <div className="text-[9px] text-stone-400">MOV</div>
                        <div className="font-bold text-xs text-sky-300">{scaled.mov}</div>
                      </div>
                      <div className="p-1.5 rounded bg-red-950/50 border border-red-900/60">
                        <div className="text-[9px] text-stone-400 flex items-center justify-center">
                          <Skull className="w-2.5 h-2.5 text-red-400 mr-0.5" />AT
                        </div>
                        <div className="font-bold text-xs text-red-300">{scaled.scaledAt}</div>
                      </div>
                      <div className="p-1.5 rounded bg-amber-950/50 border border-amber-900/60">
                        <div className="text-[9px] text-stone-400 flex items-center justify-center">
                          <Shield className="w-2.5 h-2.5 text-amber-400 mr-0.5" />DF
                        </div>
                        <div className="font-bold text-xs text-amber-200">{scaled.scaledDef}</div>
                      </div>
                      <div className="p-1.5 rounded bg-emerald-950/50 border border-emerald-900/60">
                        <div className="text-[9px] text-stone-400">PC</div>
                        <div className="font-bold text-xs text-emerald-300">{scaled.scaledPC}</div>
                      </div>
                      <div className="p-1.5 rounded bg-cyan-950/50 border border-cyan-900/60">
                        <div className="text-[9px] text-stone-400">PM</div>
                        <div className="font-bold text-xs text-cyan-300">{scaled.pm}</div>
                      </div>
                      <div className="p-1.5 rounded bg-purple-950/50 border border-purple-900/60">
                        <div className="text-[9px] text-stone-400">CD</div>
                        <div className="font-bold text-xs text-purple-300">{scaled.saveDC}</div>
                      </div>
                    </div>

                    {/* Habilidades y Efectos Completos */}
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {scaled.activeAbilities.map((ab, i) => (
                        <li key={i} className="leading-snug flex gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{ab}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Control rápido de PC en la misma hoja */}
                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1 text-xs">
                      <span className="text-stone-400 font-semibold">Vida:</span>
                      <button
                        onClick={() => adjustQuickHP(hpKey, scaled.scaledPC, -1)}
                        className="px-1.5 text-red-400 hover:text-red-300 font-black cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-stone-100 min-w-[36px] text-center">
                        {currentHP}/{scaled.scaledPC}
                      </span>
                      <button
                        onClick={() => adjustQuickHP(hpKey, scaled.scaledPC, 1)}
                        className="px-1.5 text-emerald-400 hover:text-emerald-300 font-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    {onAwardXP && (
                      <button
                        onClick={() => onAwardXP(scaled.scaledXP)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-900/70 hover:bg-emerald-700 text-emerald-100 text-[11px] font-bold cursor-pointer"
                      >
                        +{scaled.scaledXP} XP
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Checklist Agrupado de Piezas Físicas a Sacar de la Caja */}
      <div className="grimoire-panel rounded-2xl p-5 space-y-4">
        <h4 className="font-display font-bold text-base text-amber-300 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-400" /> Preparación Previa: Todo lo que debes sacar de tu caja física
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Estructura', 'Mobiliario', 'Monstruos'].map((groupName) => {
            const entries = Object.values(groupedChecklist[groupName] || {});
            return (
              <div key={groupName} className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {groupName}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {entries.map(({ count, info }) => (
                    <span
                      key={info.label}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-200 flex items-center gap-1.5"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: info.fill }}
                      />
                      <strong className="text-amber-300">{count}×</strong> {info.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
