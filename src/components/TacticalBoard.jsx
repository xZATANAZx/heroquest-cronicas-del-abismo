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
  resolveMissionEventPool,
  generateEpicSceneTwist,
  getRoomAt,
  getRoomObj,
  getRoomCells,
} from '../data/officialBoardMaps';
import {
  FurnitureSVG,
  StairsSVG,
  DoorSVG,
  BlockedWallSVG,
  TrapSVG,
  MonsterIconSVG,
  getPieceIconSrc,
} from './BoardPiecesSVG';
import { MONSTERS, scaleMonster } from '../data/bestiary';
import { OFFICIAL_DREAD_SPELLS } from '../data/officialCards';
import { rollBodyLoot, rollTreasureProbability } from '../data/lootProbabilities';
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

// Reglas claras de las trampas del tablero (4 Pilares HQ-D20 v6: AGI / MEN / FUE / SUE)
const TRAP_RULES = {
  trap_pit: {
    name: 'Trampa de Foso Oculto',
    detect: 'Mente (MEN CD 12 / 14 en Supervivencia) al buscar trampas sin enemigos visibles.',
    disarm: 'Agilidad (AGI CD 12 / 14 en Supervivencia) para desarmar o saltar.',
    effect: 'Si un héroe pisa esta casilla sin verla, cae al foso: sufre 1 PC de daño, termina su turno y ataca/defiende con -1 DC hasta salir.',
    disarmMaterial: null,
  },
  trap_spear: {
    name: 'Trampa de Lanza / Aguja',
    detect: 'Mente (MEN CD 12 / 14 en Supervivencia) al buscar trampas o revisar el cofre.',
    disarm: 'Agilidad (AGI CD 13 / 15 en Supervivencia — Enano/Pícaro/Cerrajero con Ventaja).',
    effect: 'Si se activa, dispara una lanza o aguja: Agilidad (AGI CD 13) o recibe 1 PC (si es aguja envenenada, queda Envenenado -1 DC Ataque).',
    disarmMaterial: { id: 'glandula_veneno', label: '☠️ Glándula de Veneno' },
  },
  trap_falling_rock: {
    name: 'Trampa de Bloque Cayendo',
    detect: 'Mente (MEN CD 13 / 15 en Supervivencia) buscando grietas en el techo.',
    disarm: 'Agilidad (AGI CD 13 / 15 en Supervivencia — Enano/Ingeniero con Ventaja).',
    effect: 'Cae un bloque de piedra: Agilidad (AGI CD 13) o sufre 2 PC (1 PC si supera) y la casilla queda bloqueada como Muro.',
    disarmMaterial: { id: 'chatarra_acero', label: '⚙️ Acero Templado' },
  },
};

// Detecta si un evento/tesoro/mueble menciona un monstruo o trampa para poder invocarlo en el tablero con 1 clic
function detectSpawnable(disc, currentMap) {
  if (!disc || disc.isBodyLoot) return { monsterType: null, monsterLabel: null, trapType: null };
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

// Guía rápida de reglas tácticas para cada mueble que aparezca en la sala (4 Pilares v6)
const FURNITURE_QUICK_RULES = {
  table: 'Táctica: Volcar mesa (Acción gratuita, FUE CD 11) da +1 Def vs proyectiles. Subir encima (+1 mov) da Ventaja de altura.',
  alchemy_bench: 'Examinar (Acción): Guarda ingredientes frescos (Hierbas, Polvo Rúnico o Veneno). Recuerda: las pociones se destilan desde el celular en cualquier momento por Suerte o Calificación.',
  bookcase: 'Examinar (Acción): Puede revelar pergaminos, mapas de puertas secretas o debilidades de jefes (MEN CD 12).',
  weapon_rack: 'Examinar (Acción): Puede contener armas de repuesto, dagas arrojadizas o piedra de afilar (+1 DC próximo ataque).',
  chest: 'Revisar Trampas primero (AGI/MEN CD 12). Abrir sin revisar puede activar aguja/gas o despertar un Mímico.',
  tomb: 'Examinar (Acción): Puede guardar reliquias o oro, pero perturbarla puede despertar Esqueletos/Espectros.',
  sorcerer_table: 'Altar del Mago: Mente (MEN CD 12) puede recuperar 1 hechizo gastado o +2 PM; fallar cuesta 1 PM.',
  throne: 'Trono: Mente (MEN CD 12) puede hallar compartimentos secretos o palancas de puertas ocultas.',
  cupboard: 'Armario: Puede esconder pociones, capas o emboscadas de arañas.',
  fireplace: 'Chimenea: Revisar brasas puede ocultar bolsas ignífugas de oro o activar humo sofocante.',
  torture_rack: 'Potro: Puede contener llaves del carcelero (Ventaja en AGI) o causar pérdida de 1 PM (MEN CD 13).',
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
        'Mover >6 casillas pide Agilidad (AGI CD 11) o cae Derribado. Hechizos de Fuego y Fuego Griego ganan +1 DC extra aquí.',
    });
  } else if (biomeId === 'laboratorio_alquimico' && (typesInRoom.has('alchemy_bench') || typesInRoom.has('sorcerer_table'))) {
    triggers.push({
      id: 'biome_rule',
      icon: '⚗️',
      badge: 'EFECTO DE BIOMA',
      title: 'Gases Volátiles del Laboratorio',
      color: 'bg-teal-950/35 border-teal-500/45 text-teal-100',
      badgeColor: 'bg-teal-700 text-white',
      when: 'Al examinar muebles alquímicos o al usar Fuego/Bombas dentro de esta sala.',
      purpose:
        'Examinar los estantes otorga DOBLE drop de ingredientes de crafteo. Usar Fuego provoca una chispa extra (+1 DC en 2×2).',
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
        : 'Si lo curan (Mente MEN CD 12 o 1 poción), otorga +1 🏅 Reputación y revela 1 trampa o puerta secreta cercana.',
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
      when: 'SOLO si un héroe gasta su acción en Buscar Puertas Secretas (MEN CD 12) sin monstruos.',
      purpose: 'Revela un atajo o almacén secreto con botín y +2 Materiales de Crafteo del bioma.',
    });
  }

  // 5B. Reserva de Ingredientes Alquímicos (Ya no requiere mesa para destilar)
  if (typesInRoom.has('alchemy_bench')) {
    triggers.push({
      id: 'alchemy_stash',
      icon: '🧪',
      badge: 'RESERVA DE INGREDIENTES',
      title: 'Estantes de Ingredientes Frescos',
      color: 'bg-teal-950/40 border-teal-500/55 text-teal-100',
      badgeColor: 'bg-teal-600 text-white',
      when: 'Al examinar este mueble sin enemigos en la sala.',
      purpose:
        'Suelta materiales alquímicos frescos (+Hierba Lunar, Veneno o Polvo Rúnico). Recuerda: cualquier héroe puede intentar preparar pociones desde su celular en cualquier momento (Calificados con Ventaja · Otros por Suerte).',
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

// Evalúa qué Rasgos de Héroe (v6.1) se disparan en la sala actual para avisar al DM
function evaluateRoomQuirks(heroes = [], roomItems = [], roomMonstersScaled = []) {
  if (!Array.isArray(heroes) || heroes.length === 0) return [];
  const types = new Set(roomItems.map((it) => it.type));
  const hasChestOrTomb = types.has('chest') || types.has('tomb');
  const hasTrap = types.has('trap_pit') || types.has('trap_spear') || types.has('trap_falling_rock');
  const hasDoor = types.has('door') || types.has('secret_door');
  const hasMagic = types.has('sorcerer_table') || roomMonstersScaled.some((m) => m.item?.info?.monsterId === 'sorcerer');
  const hasMonsters = roomMonstersScaled.length > 0;

  const alerts = [];
  heroes.forEach((h) => {
    const q = h?.quirk;
    if (!q?.id) return;
    if (q.id === 'corazon_de_hierro' && hasMonsters) {
      alerts.push({
        key: `${h.id}-${q.id}`,
        heroName: h.name,
        icon: q.icon || '🛡️',
        quirkName: q.name,
        trigger: 'Ventaja en FUE contra Sangrado/Veneno; recuerda -1 en sigilo (AGI) aquí.',
        bonus: q.bonus,
        drawback: q.drawback,
        urgent: false,
      });
    } else if (q.id === 'instinto_cazador' && hasMonsters) {
      alerts.push({
        key: `${h.id}-${q.id}`,
        heroName: h.name,
        icon: q.icon || '🏹',
        quirkName: q.name,
        trigger: '+1 DC al atacar enemigos ya heridos; si saca 0 calaveras queda -1 DC Defensa 1 turno.',
        bonus: q.bonus,
        drawback: q.drawback,
        urgent: false,
      });
    } else if (q.id === 'sangre_arcana' && (hasMagic || hasMonsters)) {
      alerts.push({
        key: `${h.id}-${q.id}`,
        heroName: h.name,
        icon: q.icon || '✨',
        quirkName: q.name,
        trigger: hasMagic
          ? 'Ventaja en Mente (MEN) contra hechizos/puzzles aquí; sufre +1 daño ante golpes de 3+ calaveras.'
          : 'Sufre +1 daño extra si un enemigo saca 3+ calaveras contra él.',
        bonus: q.bonus,
        drawback: q.drawback,
        urgent: hasMagic,
      });
    } else if (q.id === 'manos_de_oro' && (hasChestOrTomb || hasMonsters)) {
      alerts.push({
        key: `${h.id}-${q.id}`,
        heroName: h.name,
        icon: q.icon || '🪙',
        quirkName: q.name,
        trigger: hasChestOrTomb
          ? '+25% más oro automático si revisa el cofre/cuerpos de esta sala.'
          : 'Enemigos en estado Venganza lo eligen primero como objetivo.',
        bonus: q.bonus,
        drawback: q.drawback,
        urgent: hasChestOrTomb,
      });
    } else if (q.id === 'paso_fantasma' && (hasTrap || hasDoor || hasMonsters)) {
      alerts.push({
        key: `${h.id}-${q.id}`,
        heroName: h.name,
        icon: q.icon || '🌑',
        quirkName: q.name,
        trigger: hasTrap
          ? '¡Trampa en sala! Tiene Ventaja en Agilidad (AGI) para evitarla.'
          : 'Ignora Zona de Control al retirarse; -1 en FUE si intenta forzar puertas.',
        bonus: q.bonus,
        drawback: q.drawback,
        urgent: hasTrap,
      });
    } else if (q.id === 'vanguardia_implacable' && hasMonsters) {
      alerts.push({
        key: `${h.id}-${q.id}`,
        heroName: h.name,
        icon: q.icon || '⚔️',
        quirkName: q.name,
        trigger: 'Si entra primero a esta sala: +1 DC en su primer ataque, pero -1 DC Defensa en ronda 1.',
        bonus: q.bonus,
        drawback: q.drawback,
        urgent: true,
      });
    } else if (q.id === 'alma_inquebrantable' && hasMonsters) {
      alerts.push({
        key: `${h.id}-${q.id}`,
        heroName: h.name,
        icon: q.icon || '🕯️',
        quirkName: q.name,
        trigger: 'Inmune a Miedo y evita caer en Shock 1 vez por misión (se queda en 1 PM).',
        bonus: q.bonus,
        drawback: q.drawback,
        urgent: false,
      });
    } else if (q.id === 'tactico_de_campo' && hasMonsters) {
      alerts.push({
        key: `${h.id}-${q.id}`,
        heroName: h.name,
        icon: q.icon || '🧭',
        quirkName: q.name,
        trigger: 'Puede ceder +1 DC de Ataque o Defensa a un aliado visible (1 vez/combate).',
        bonus: q.bonus,
        drawback: q.drawback,
        urgent: false,
      });
    }
  });
  return alerts;
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
  cityMode = 'relaxed',
  setCityMode = null,
  showToast = null,
}) {
  const isSurvivalMode = cityMode === 'survival';
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

  const [showIntro, setShowIntro] = useState(true);
  // Oleada actual si la misión es de Defensa por Oleadas
  const [currentWave, setCurrentWave] = useState(1);

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
    const missionPool = resolveMissionEventPool(currentMap);
    const isCorridor = mode === 'corridor' || (mode === 'auto' && selectedRoomId === 'CORRIDOR');
    const bucket = isCorridor ? 'corridor' : 'room';

    // Prioriza los eventos exclusivos de ESTA misión (70%) y mezcla con eventos dinámicos/genéricos sin repetir
    const missionList = missionPool ? (isCorridor ? missionPool.corridor : missionPool.room) || [] : [];
    const roll = Math.random();
    let chosen;
    if (missionList.length > 0 && roll < 0.6) {
      chosen = pickWithoutRepeat(bucket, missionList, (ev) => `${currentMap.id}:${ev.title}`);
    } else if (roll < 0.85) {
      chosen = generateDynamicMissionEvent(currentMap, isCorridor, partyLevel);
    } else {
      const genericList = isCorridor ? GENERIC_DUNGEON_EVENTS.corridor : GENERIC_DUNGEON_EVENTS.room;
      chosen = pickWithoutRepeat(bucket, genericList, (ev) => ev.title);
    }
    if (!chosen) return;
    setRoomDiscovery({
      source: isCorridor ? `Pasillo · ${currentMap.title.split(':')[0]}` : `Evento · ${selectedRoomId}`,
      title: chosen.title,
      badge: chosen.badge || 'Evento de Misión',
      text: chosen.text,
      rewardLoot: chosen.rewardLoot || null,
      rewardGold: chosen.rewardGold || 0,
    });
  };

  const triggerEpicSceneTwist = () => {
    const twist = generateEpicSceneTwist(currentMap, selectedRoomId, roomMonstersScaled, partyLevel);
    if (!twist) return;
    setRoomDiscovery({
      source: `Giro Épico · ${selectedRoomId}`,
      title: twist.title,
      badge: twist.badge || 'Momento Épico',
      text: twist.text,
      rewardLoot: twist.rewardLoot || null,
      rewardGold: twist.rewardGold || 0,
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
    const activeSearcher = heroes.find((h) => h.id === effectiveHeroId) || heroes[0] || null;
    const res = rollTreasureProbability({ partyLevel, hero: activeSearcher });
    setRoomDiscovery({
      source: activeSearcher ? `Tesoro (${activeSearcher.name})` : 'Búsqueda de Tesoro',
      title: res.title,
      badge: res.badge,
      text: res.text,
      rewardLoot: res.rewardLoot,
      rewardGold: res.rewardGold,
      materialId: res.materialId,
      materialQty: res.materialQty,
      heroBonusNotes: res.heroBonusNotes,
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

  // Mapas oficiales SIEMPRE conservan 100% de sus miniaturas en sus casillas exactas del Libro de Misiones.
  // Solo los mapas procedurales filtran escoltas en partidas de 1–2 jugadores.
  const allMapItems = useMemo(() => {
    const baseItems = currentMap.items || [];
    const isProcedural = Boolean(currentMap._questRef || currentMap.isProcedural);
    if (!isProcedural || partySize >= 3) {
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

  // Encuentra una casilla inteligente dentro de la sala actual (o pasillo) según el tipo de pieza
  // - monster (Errante): junto a una puerta o acceso libre, separado de otros enemigos
  // - trap: en casilla estratégica frente a puerta, cofre o centro de paso
  // - npc: en casilla libre apartada de enemigos y puertas
  const findFreeCellInRoom = (roomId, kind = 'monster') => {
    const occupied = new Set();
    const roomDoors = [];
    const roomChests = [];
    const roomAllies = [];

    allMapItems.forEach((it) => {
      if (it.type === 'door' || it.type === 'secret_door') {
        const ox = it.edge === 'W' ? it.x - 1 : it.edge === 'E' ? it.x + 1 : it.x;
        const oy = it.edge === 'N' ? it.y - 1 : it.edge === 'S' ? it.y + 1 : it.y;
        if (getRoomAt(it.x, it.y) === roomId) roomDoors.push({ x: it.x, y: it.y });
        if (getRoomAt(ox, oy) === roomId) roomDoors.push({ x: ox, y: oy });
        return;
      }
      const info = PIECE_TYPES[it.type];
      const w = it.w || info?.defaultW || 1;
      const h = it.h || info?.defaultH || 1;
      for (let yy = it.y; yy < it.y + h; yy++) {
        for (let xx = it.x; xx < it.x + w; xx++) {
          occupied.add(`${xx},${yy}`);
        }
      }
      if (getRoomAt(it.x, it.y) === roomId) {
        if (it.type === 'chest') roomChests.push({ x: it.x, y: it.y });
        if (info?.monsterId) roomAllies.push({ x: it.x, y: it.y });
      }
    });

    const rObj = getRoomObj(roomId);
    if (rObj) {
      const cells = getRoomCells(rObj).filter((c) => !occupied.has(`${c.x},${c.y}`));
      if (cells.length === 0) return { x: rObj.x1, y: rObj.y1 };

      const cx = (rObj.x1 + rObj.x2) / 2;
      const cy = (rObj.y1 + rObj.y2) / 2;

      let best = cells[0];
      let bestScore = -999;
      for (const c of cells) {
        const doorDist =
          roomDoors.length > 0
            ? Math.min(...roomDoors.map((d) => Math.hypot(c.x - d.x, c.y - d.y)))
            : 2;
        const allyDist =
          roomAllies.length > 0
            ? Math.min(...roomAllies.map((a) => Math.hypot(c.x - a.x, c.y - a.y)))
            : 2.5;
        const chestDist =
          roomChests.length > 0
            ? Math.min(...roomChests.map((ch) => Math.hypot(c.x - ch.x, c.y - ch.y)))
            : 4;
        const centerDist = Math.hypot(c.x - cx, c.y - cy);

        let score = 0;
        if (kind === 'monster') {
          // Monstruo Errante: entra cerca de una puerta (distancia 1-2) y separado de aliados
          score = (3 - Math.abs(doorDist - 1.2)) * 2.2 + Math.min(allyDist, 3) * 1.6 - centerDist * 0.2;
        } else if (kind === 'trap') {
          // Trampa: protege un cofre (distancia 1), una puerta (distancia 1) o el centro de paso
          const nearChest = chestDist <= 1.5 ? 4 : 0;
          const nearDoor = doorDist <= 1.5 ? 3 : 0;
          score = nearChest + nearDoor - centerDist * 0.5;
        } else {
          // NPC: protegido lejos de puertas y monstruos
          score = doorDist * 1.3 + Math.min(allyDist, 3) * 1.2;
        }
        if (score > bestScore) {
          bestScore = score;
          best = c;
        }
      }
      return best;
    }

    // Pasillo: buscar una casilla libre adyacente a una puerta activa del corredor
    const corridorDoors = allMapItems.filter((it) => it.type === 'door' || it.type === 'secret_door');
    for (const d of corridorDoors) {
      const ox = d.edge === 'W' ? d.x - 1 : d.edge === 'E' ? d.x + 1 : d.x;
      const oy = d.edge === 'N' ? d.y - 1 : d.edge === 'S' ? d.y + 1 : d.y;
      if (getRoomAt(ox, oy) === 'CORRIDOR' && !occupied.has(`${ox},${oy}`)) {
        return { x: ox, y: oy };
      }
    }
    for (let y = 6; y <= 14; y++) {
      for (let x = 8; x <= 18; x++) {
        if (getRoomAt(x, y) === 'CORRIDOR' && !occupied.has(`${x},${y}`)) {
          return { x, y };
        }
      }
    }
    return { x: 9, y: 9 };
  };

  const spawnDynamicPiece = (pieceType, customNote, customTrapDesc = '') => {
    const kind =
      PIECE_TYPES[pieceType]?.monsterId
        ? 'monster'
        : pieceType === 'npc'
        ? 'npc'
        : 'trap';
    const pos = findFreeCellInRoom(selectedRoomId, kind);
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
    } else if (pieceType === 'trap_pit' || pieceType === 'trap_spear' || pieceType === 'trap_falling_rock') {
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
        groups[bucket][it.type] = { type: it.type, count: 0, info };
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
          scaled: scaleMonster(base, partyLevel, 4, !!it.info.isBoss, false, isSurvivalMode),
        };
      })
      .filter(Boolean);
  }, [roomItems, partyLevel, isSurvivalMode]);

  const totalRoomXP = useMemo(() => {
    return roomMonstersScaled.reduce((acc, { scaled }) => acc + (scaled.scaledXP || 0), 0);
  }, [roomMonstersScaled]);

  const [triggeredQuirks, setTriggeredQuirks] = useState({});
  const [monsterDreadSpells, setMonsterDreadSpells] = useState({});
  const [lootedBodies, setLootedBodies] = useState(() => new Set());
  const [bodyLootResults, setBodyLootResults] = useState({});
  const roomQuirkAlerts = useMemo(
    () => evaluateRoomQuirks(heroes, roomItems, roomMonstersScaled, selectedRoomId === 'CORRIDOR'),
    [heroes, roomItems, roomMonstersScaled, selectedRoomId]
  );

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
    const scaled = scaleMonster(base, partyLevel, 4, !!info.isBoss, false, isSurvivalMode);
    const currentPC =
      quickHP[selectedMonsterKey] !== undefined ? quickHP[selectedMonsterKey] : scaled.scaledPC;
    return {
      key: selectedMonsterKey,
      item: { ...foundItem, coord: coordLabel(foundItem.x, foundItem.y), info },
      scaled,
      currentPC,
    };
  }, [selectedMonsterKey, allMapItems, partyLevel, isSurvivalMode, quickHP]);

  // Trampa actualmente seleccionada al hacer clic en ▲ ! en el tablero
  const selectedTrapObj = useMemo(() => {
    if (!selectedTrapKey) return null;
    const foundItem = allMapItems.find(
      (it) =>
        (it.type === 'trap_pit' || it.type === 'trap_spear' || it.type === 'trap_falling_rock') &&
        getTrapKey(it) === selectedTrapKey
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

  // Salas que SÍ participan en esta misión:
  // Si el mapa tiene darkCells oficiales (<dark> del Libro de Misiones), una sala está activa
  // si y solo si NO está cubierta por darkCells (coincidencia 100% exacta con el libro oficial).
  const activeMissionRooms = useMemo(() => {
    const set = new Set();
    if (Array.isArray(currentMap.darkCells) && currentMap.darkCells.length > 0) {
      const darkSet = new Set(currentMap.darkCells);
      for (const r of HQ_ROOMS) {
        const cells = getRoomCells(r);
        if (cells.some((c) => !darkSet.has(`${c.x},${c.y}`))) {
          set.add(r.id);
        }
      }
      return set;
    }
    if (currentMap.startRoom) set.add(currentMap.startRoom);
    (allMapItems || []).forEach((it) => {
      const rA = getRoomAt(it.x, it.y);
      if (rA !== 'CORRIDOR') set.add(rA);
      if (it.type === 'door' || it.type === 'secret_door') {
        const ox = it.edge === 'W' ? it.x - 1 : it.edge === 'E' ? it.x + 1 : it.x;
        const oy = it.edge === 'N' ? it.y - 1 : it.edge === 'S' ? it.y + 1 : it.y;
        const rB = getRoomAt(ox, oy);
        if (rB !== 'CORRIDOR') set.add(rB);
      }
    });
    return set;
  }, [allMapItems, currentMap]);
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
            {setCityMode && (
              <button
                type="button"
                onClick={() => setCityMode(isSurvivalMode ? 'relaxed' : 'survival')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer transition ${
                  isSurvivalMode
                    ? 'bg-red-950/70 border-red-500 text-red-200 shadow'
                    : 'bg-sky-950/60 border-sky-600/60 text-sky-200 hover:border-sky-400'
                }`}
                title={
                  isSurvivalMode
                    ? 'Modo Supervivencia: Monstruos +1 PC, Jefes Élite, Trampas +2 CD, +25% XP y +20% Oro'
                    : 'Modo Relajado: Balance estándar HQ-D20 v2 (clic para activar Supervivencia)'
                }
              >
                {isSurvivalMode ? '🔥 Supervivencia (+25% XP)' : '🛡️ Relajado'}
              </button>
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

        {/* Narrativa de Inicio de Misión (Visible y clara para leer en voz alta) */}
        {showIntro && missionIntroText && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900/90 to-slate-900/90 border border-amber-500/60 shadow-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-sm font-black text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Leer en voz alta — {currentMap.title}
              </span>
              <button
                onClick={() => setShowIntro(false)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                Ocultar ✕
              </button>
            </div>
            <p className="text-sm sm:text-[15px] text-amber-50 italic leading-relaxed">“{missionIntroText}”</p>
            {missionObjectives.length > 0 && (
              <div className="pt-2 border-t border-amber-800/40 flex flex-wrap gap-x-4 gap-y-1 text-xs text-amber-200 font-medium">
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

      {/* Cuerpo Principal: Plano Pergamino SVG + Guía de Montaje por Sala (items-start evita espacio vacío debajo del tablero) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* PLANO PERGAMINO ESTILO LIBRO DE MISIONES MODERNO 2021 */}
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

            {/* Fondo de Pasillos (Tablero Moderno 2021 — Piedra beige cálida) */}
            <rect
              x={MARGIN_LEFT}
              y={MARGIN_TOP}
              width={BOARD_COLS * CELL}
              height={BOARD_ROWS * CELL}
              fill={selectedRoomId === 'CORRIDOR' ? '#e7dac2' : '#dfd2bc'}
              onClick={() => setSelectedRoomId('CORRIDOR')}
              className="cursor-pointer"
            />

            {/* Las 22 Habitaciones Oficiales Moderno 2021 (salas no usadas en esta misión atenuadas estilo Libro Oficial) */}
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
                          fill={
                            !isUsedInQuest
                              ? '#b5aa99'
                              : r.id === 'R11'
                              ? '#efe2c8'
                              : '#f7f2e8'
                          }
                        />
                        {isUsedInQuest && showFogOverlay && !isRevealed && (
                          <rect
                            x={cx}
                            y={cy}
                            width={CELL}
                            height={CELL}
                            fill="rgba(48, 24, 18, 0.18)"
                          />
                        )}
                        {isUsedInQuest && isSelected && (
                          <rect
                            x={cx + 0.5}
                            y={cy + 0.5}
                            width={CELL - 1}
                            height={CELL - 1}
                            fill="rgba(217, 155, 38, 0.24)"
                          />
                        )}
                      </g>
                    );
                  })}
                  {/* Etiqueta sutil del número de sala (solo en salas activas de la misión) */}
                  {isUsedInQuest && (
                    <text
                      x={rx + 4}
                      y={ry + 11}
                      fontSize="8"
                      fontWeight="800"
                      fill="rgba(59, 22, 22, 0.55)"
                    >
                      {r.id}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Celdas Oscurecidas Oficiales (<dark> del Libro de Misiones — cubre salas y pasillos cerrados) */}
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

            {/* Cuadrícula fina estilo Libro de Misiones Moderno 2021 (26×19) */}
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

            {/* Paredes Gruesas Oficiales del Tablero Moderno 2021 (Borgoña Oscuro) */}
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

            {/* PLANOS DE MOBILIARIO, ESTRUCTURA, TRAMPAS Y MONSTRUOS (Arte Vectorial HQ 2021) */}
            {allMapItems.map((item, idx) => {
              const info = PIECE_TYPES[item.type];
              if (!info) return null;
              const px = MARGIN_LEFT + item.x * CELL;
              const py = MARGIN_TOP + item.y * CELL;
              const w = (item.w || info.defaultW || 1) * CELL;
              const h = (item.h || info.defaultH || 1) * CELL;
              const roomId = getRoomAt(item.x, item.y);

              // 1. Escaleras 2×2 (Espiral HQ 2021)
              if (item.type === 'stairs') {
                return (
                  <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                    <StairsSVG px={px} py={py} w={w} h={h} />
                  </g>
                );
              }

              // 2. Puerta / Puerta Secreta oficial apoyada sobre el muro (edge: N | S | E | W)
              if (item.type === 'door' || item.type === 'secret_door') {
                return (
                  <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                    <title>{item.note || info.label}</title>
                    <DoorSVG type={item.type} px={px} py={py} cell={CELL} edge={item.edge || 'N'} />
                  </g>
                );
              }

              // 3. Pared Bloqueada (1×1 o 2×1 estilo oficial HeroQuest 2021)
              if (item.type === 'blocked' || item.type === 'blocked_double') {
                return (
                  <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                    <BlockedWallSVG type={item.type} px={px} py={py} w={w} h={h} />
                  </g>
                );
              }

              // 4. Trampas (Foso, Lanza, Bloque Cayendo — clicables para desarmar)
              if (item.type === 'trap_pit' || item.type === 'trap_spear' || item.type === 'trap_falling_rock') {
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
                  >
                    <TrapSVG type={item.type} px={px} py={py} cell={CELL} isDisarmed={isDisarmed} isSelected={isSelTrap} />
                  </g>
                );
              }

              // 5. Mobiliario (Arte vectorial Top-Down HQ 2021 con dimensiones exactas)
              if (info.category === 'Mobiliario') {
                return (
                  <g key={idx} onClick={() => setSelectedRoomId(roomId)} className="cursor-pointer">
                    <title>{item.note || info.label}</title>
                    <FurnitureSVG type={item.type} px={px} py={py} w={w} h={h} label={info.code} />
                  </g>
                );
              }

              // 6. Monstruos, Jefes y NPCs (Iconos representativos HQ 2021 — clicables)
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
                >
                  <title>{item.note || info.label}</title>
                  <MonsterIconSVG
                    type={item.type}
                    px={px}
                    py={py}
                    cell={CELL}
                    info={info}
                    isSelected={isSelectedMon}
                    isDead={isDeadMon}
                  />
                </g>
              );
            })}

            {/* Insignias de Notas Oficiales (A, B, C, D, E, X, XX) en su casilla exacta del Libro de Misiones */}
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

          {/* Leyenda Visual con Iconos Oficiales del Tablero Moderno 2021 */}
          <div className="mt-3 pt-2 border-t border-amber-900/30 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-stone-800">
            {[
              ['door', 'Puerta'],
              ['secret_door', 'Secreta'],
              ['trap_pit', 'Foso'],
              ['trap_spear', 'Lanza'],
              ['goblin', 'Goblin'],
              ['orc', 'Orco'],
              ['abomination', 'Abominación'],
              ['skeleton', 'Esqueleto'],
              ['zombie', 'Zombi'],
              ['mummy', 'Momia'],
              ['dread_warrior', 'Guerrero Terror'],
              ['gargoyle', 'Gárgola'],
              ['sorcerer', 'Hechicero'],
            ].map(([typeKey, lbl]) => {
              const src = getPieceIconSrc(typeKey);
              return (
                <span key={typeKey} className="inline-flex items-center gap-1">
                  {src && (
                    <img
                      src={src}
                      alt={lbl}
                      className="w-4 h-4 object-contain inline-block"
                    />
                  )}
                  <span>{lbl}</span>
                </span>
              );
            })}
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

              {selectedMonsterObj.scaled.activeAbilities?.length > 0 && (
                <div className="text-[11px] text-amber-100 bg-black/40 p-2.5 rounded-xl border border-amber-900/50 leading-snug space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-amber-300 font-black uppercase">
                    <span>⚡ Habilidades ({selectedMonsterObj.scaled.difficultyTag})</span>
                    <span>+{selectedMonsterObj.scaled.scaledXP} XP</span>
                  </div>
                  {selectedMonsterObj.scaled.activeAbilities.map((ab, abIdx) => (
                    <div key={abIdx} className="leading-snug">• {ab}</div>
                  ))}
                  <div className="mt-1.5 pt-1.5 border-t border-amber-900/40 text-[10px] text-purple-200 leading-snug">
                    <strong className="text-purple-300">🛡️ Resistencias (HQ Nativo):</strong>{' '}
                    {selectedMonsterObj.scaled.resistGuide}
                  </div>
                </div>
              )}

              {/* Hechizo del Terror Aleatorio (Solo si el monstruo tiene habilidad de Hechizo del Terror, ej. Abominación / Hechicero) */}
              {(() => {
                const abilitiesJoined = (selectedMonsterObj.scaled.activeAbilities || []).join(' ').toLowerCase();
                const hasDreadAbility =
                  abilitiesJoined.includes('hechizo del terror') ||
                  abilitiesJoined.includes('hechizos del terror') ||
                  selectedMonsterObj.item?.info?.monsterId === 'sorcerer';
                if (!hasDreadAbility) return null;
                const isOneInThree = abilitiesJoined.includes('1 de cada 3');
                const mKey = selectedMonsterObj.key;
                const entry = monsterDreadSpells[mKey];

                const drawDreadCard = (forceSuccess = false) => {
                  if (isOneInThree && !forceSuccess) {
                    const roll = Math.floor(Math.random() * 3) + 1;
                    if (roll < 3) {
                      setMonsterDreadSpells((prev) => ({
                        ...prev,
                        [mKey]: { checked: true, hasSpell: false, spell: null, used: false },
                      }));
                      showToast?.(`🎲 Afinidad Arcana (${roll}/3): Esta criatura NO tiene Hechizo del Terror.`);
                      return;
                    }
                  }
                  const picked = OFFICIAL_DREAD_SPELLS[Math.floor(Math.random() * OFFICIAL_DREAD_SPELLS.length)];
                  setMonsterDreadSpells((prev) => ({
                    ...prev,
                    [mKey]: { checked: true, hasSpell: true, spell: picked, used: false },
                  }));
                  showToast?.(`💀 ¡Hechizo del Terror asignado: ${picked.name}!`);
                };

                return (
                  <div className="p-2.5 rounded-xl bg-purple-950/45 border border-purple-500/60 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-purple-200 flex items-center gap-1">
                        💀 Hechizo del Terror {isOneInThree ? '(Afinidad 1 de 3)' : '(Lanzador)'}
                      </span>
                      {!entry ? (
                        <button
                          type="button"
                          onClick={() => drawDreadCard(false)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black text-[11px] cursor-pointer"
                        >
                          {isOneInThree ? '🎲 Tirar Afinidad (1/3)' : '💀 Robar Carta Random'}
                        </button>
                      ) : !entry.hasSpell ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-stone-400">Sin hechizo</span>
                          <button
                            type="button"
                            onClick={() => drawDreadCard(true)}
                            className="px-2 py-0.5 rounded bg-purple-900/70 hover:bg-purple-700 text-purple-200 text-[10px] font-bold cursor-pointer"
                            title="Forzar asignación de un Hechizo del Terror aleatorio"
                          >
                            Forzar carta
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setMonsterDreadSpells((prev) => ({
                                ...prev,
                                [mKey]: { ...prev[mKey], used: !prev[mKey].used },
                              }))
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                              entry.used
                                ? 'bg-stone-800 text-stone-400'
                                : 'bg-rose-600 hover:bg-rose-500 text-white'
                            }`}
                          >
                            {entry.used ? '✓ Usado' : '⚡ Lanzar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => drawDreadCard(true)}
                            className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 text-[10px] font-bold cursor-pointer"
                            title="Robar otro Hechizo del Terror al azar"
                          >
                            🔄
                          </button>
                        </div>
                      )}
                    </div>
                    {entry?.hasSpell && entry.spell && (
                      <div
                        className={`p-2 rounded-lg border ${
                          entry.used
                            ? 'bg-stone-950/60 border-stone-800 opacity-55'
                            : 'bg-rose-950/40 border-rose-500/60'
                        }`}
                      >
                        <div className="font-display font-bold text-rose-200 flex items-center justify-between gap-2">
                          <span>{entry.spell.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 text-amber-300">
                            {entry.spell.expansion}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-200 mt-1 leading-snug">{entry.spell.text}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

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
                    onClick={() => {
                      setMonsterHPDirect(selectedMonsterObj.key, 0);
                      if (onAwardXP && selectedMonsterObj.scaled.scaledXP) {
                        onAwardXP(selectedMonsterObj.scaled.scaledXP);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs cursor-pointer shadow"
                    title="Abate al monstruo y reparte su XP al grupo"
                  >
                    💀 Abatir (+{selectedMonsterObj.scaled.scaledXP} XP)
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

              {/* Revisar Cuerpo del Monstruo Abatido (Resultado inline aquí mismo + Entrega Automática al Héroe) */}
              {selectedMonsterObj.currentPC <= 0 && (() => {
                const alreadyLooted = lootedBodies.has(selectedMonsterObj.key);
                const lootRes = bodyLootResults[selectedMonsterObj.key] || null;
                return (
                  <div className="p-2.5 rounded-xl bg-emerald-950/35 border border-emerald-600/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-emerald-300">
                        🔍 Revisar Cuerpo {alreadyLooted ? '(Ya revisado ✓)' : ''}
                      </span>
                      {lootRes?.badge && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200">
                          {lootRes.badge}
                        </span>
                      )}
                    </div>
                    {!alreadyLooted ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {heroes.length > 0 && (
                          <select
                            value={effectiveHeroId}
                            onChange={(e) => setTargetHeroId(e.target.value)}
                            className="flex-1 px-2 py-1.5 rounded-lg bg-stone-950 border border-emerald-700/70 text-[11px] text-stone-100"
                          >
                            {heroes.map((h) => (
                              <option key={h.id} value={h.id}>
                                Revisa: {h.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const searcher = heroes.find((h) => h.id === effectiveHeroId) || heroes[0] || null;
                            const res = rollBodyLoot({
                              monsterName: selectedMonsterObj.scaled.name,
                              isBoss: !!selectedMonsterObj.item?.info?.isBoss,
                              isElite: !!selectedMonsterObj.scaled?.isElite,
                              partyLevel,
                              hero: searcher,
                            });
                            setLootedBodies((prev) => {
                              const next = new Set(prev);
                              next.add(selectedMonsterObj.key);
                              return next;
                            });
                            let deliveredTo = '';
                            if (searcher && !res.isEmpty) {
                              if ((res.rewardLoot || res.rewardGold > 0) && onSendLootToHero) {
                                onSendLootToHero(searcher.id, res.rewardLoot, res.rewardGold);
                              }
                              if (res.materialId && res.materialQty > 0 && onSendMaterialToHero) {
                                onSendMaterialToHero(searcher.id, res.materialId, res.materialQty);
                              }
                              deliveredTo = searcher.name;
                            }
                            const matSummary =
                              res.materialId && res.materialQty > 0
                                ? `${res.materialQty}× ${getMaterialById(res.materialId).icon} ${getMaterialById(res.materialId).name}`
                                : '';
                            setBodyLootResults((prev) => ({
                              ...prev,
                              [selectedMonsterObj.key]: {
                                title: res.title,
                                text: res.text,
                                badge: res.rarityLabel,
                                deliveredTo,
                                heroBonusNotes: res.heroBonusNotes || [],
                                matSummary,
                                isEmpty: res.isEmpty,
                              },
                            }));
                            showToast?.(
                              res.isEmpty
                                ? `🔍 ${selectedMonsterObj.scaled.name}: no llevaba nada útil.`
                                : deliveredTo
                                ? `✅ Entregado a ${deliveredTo}: ${res.title}`
                                : `🔍 Hallazgo en ${selectedMonsterObj.scaled.name}: ${res.title}`
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] cursor-pointer shrink-0"
                        >
                          🔍 Revisar y Entregar
                        </button>
                      </div>
                    ) : lootRes ? (
                      <div className="p-2 rounded-lg bg-black/40 border border-emerald-800/60 space-y-1 text-[11px]">
                        <div className="font-bold text-amber-200">{lootRes.title}</div>
                        <p className="text-stone-200 leading-snug">{lootRes.text}</p>
                        {lootRes.matSummary && (
                          <div className="text-emerald-300 font-bold">🎒 Material: {lootRes.matSummary}</div>
                        )}
                        {lootRes.heroBonusNotes?.length > 0 && (
                          <div className="text-purple-200">
                            {lootRes.heroBonusNotes.map((bn, i) => (
                              <div key={i}>✨ {bn}</div>
                            ))}
                          </div>
                        )}
                        {lootRes.deliveredTo && (
                          <div className="text-emerald-300 font-bold">
                            ✅ Enviado automáticamente a {lootRes.deliveredTo}.
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })()}
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

              {/* Botón de Material al Desarmar (SOLO si esta trampa otorga materiales) */}
              {selectedTrapObj.disarmed && selectedTrapObj.rules.disarmMaterial && onSendMaterialToHero && heroes.length > 0 && (
                <div className="pt-2 border-t border-emerald-700/50 flex flex-wrap items-center gap-1.5">
                  <select
                    value={effectiveHeroId}
                    onChange={(e) => setTargetHeroId(e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-slate-950 border border-emerald-700/70 text-[11px] text-slate-100"
                  >
                    {heroes.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.className})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      onSendMaterialToHero(effectiveHeroId, selectedTrapObj.rules.disarmMaterial.id, 1);
                      setSelectedTrapKey(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
                  >
                    📦 Dar {selectedTrapObj.rules.disarmMaterial.label}
                  </button>
                </div>
              )}
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
                🎲 Eventos
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
                            title: '👂 Escuchar en la Puerta (Mente MEN CD 12)',
                            badge: 'Acción Táctica',
                            text: 'Si superan Mente MEN CD 12, el DM les dice cuántos enemigos escuchan dentro y si están Distraídos (Ventaja en 1ª ronda). Si fallan por 5+, hacen ruido (+1 Reloj del Caos).',
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
                            text: 'Mente MEN CD 12: tras un ladrillo flojo encuentran 15 MO y 1 Venda de Campaña (+1 PC).',
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

                {/* Resultado en Vivo (Examinar mueble, Tesoro, Pista o Evento — CON STATS DE MONSTRUO INVOCADO) */}
                {roomDiscovery && (() => {
                  const spawn = detectSpawnable(roomDiscovery, currentMap);
                  const discTxtLow = `${roomDiscovery.title || ''} ${roomDiscovery.text || ''}`.toLowerCase();
                  const spawnedMonsterId = !roomDiscovery.isBodyLoot
                    ? (spawn.monsterType && PIECE_TYPES[spawn.monsterType]?.monsterId) ||
                      (discTxtLow.includes('araña') ? 'arana_gigante' : null)
                    : null;
                  const spawnedBase = spawnedMonsterId ? MONSTERS.find((m) => m.id === spawnedMonsterId) : null;
                  const spawnedScaled = spawnedBase
                    ? scaleMonster(spawnedBase, partyLevel, 4, false, false, isSurvivalMode)
                    : null;
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
                      {spawnedScaled && (
                        <div className="p-2.5 rounded-xl bg-rose-950/55 border border-rose-500/60 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between font-black text-rose-200">
                            <span>👹 {spawnedScaled.name} (Nv.{partyLevel})</span>
                            <span className="text-emerald-300">+{spawnedScaled.scaledXP} XP</span>
                          </div>
                          <div className="font-mono text-amber-200 font-bold">
                            MOV {spawnedScaled.mov} · AT {spawnedScaled.scaledAt} DC · DEF {spawnedScaled.scaledDef} DC · PC {spawnedScaled.scaledPC} · PM {spawnedScaled.pm} · CD {spawnedScaled.saveDC}
                          </div>
                          {spawnedScaled.activeAbilities?.[0] && (
                            <div className="text-rose-100 leading-snug">⚡ {spawnedScaled.activeAbilities[0]}</div>
                          )}
                        </div>
                      )}
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

                    {/* 2B) Alertas Dinámicas de Rasgos de Personalidad (Quirks) del Grupo en Esta Sala */}
                    {roomQuirkAlerts.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                          🎭 Manías y Rasgos Activos Aquí ({roomQuirkAlerts.length})
                        </div>
                        {roomQuirkAlerts.map((qa) => {
                          const qKey = `${selectedMapId}-${selectedRoomId}-${qa.key}`;
                          const done = !!triggeredQuirks[qKey];
                          return (
                            <div
                              key={qa.key}
                              className={`p-2.5 rounded-xl border text-xs space-y-1 transition ${
                                done
                                  ? 'bg-stone-950/60 border-stone-800 opacity-60'
                                  : qa.urgent
                                  ? 'bg-purple-950/35 border-purple-500/70'
                                  : 'bg-slate-900/70 border-purple-800/50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-purple-200">
                                  {qa.icon} {qa.heroName} · {qa.quirkName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTriggeredQuirks((prev) => ({ ...prev, [qKey]: !prev[qKey] }));
                                    if (!done) {
                                      showToast?.(`🎭 Manía activada (${qa.heroName}): ${qa.trigger}`);
                                    }
                                  }}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer shrink-0 ${
                                    done
                                      ? 'bg-stone-800 text-stone-400'
                                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                                  }`}
                                >
                                  {done ? '✓ Resuelta' : '⚡ Activar'}
                                </button>
                              </div>
                              <p className="text-[11px] text-amber-100 leading-snug">{qa.trigger}</p>
                            </div>
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
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    onClick={searchRoomTreasure}
                    className="py-2 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-extrabold cursor-pointer"
                  >
                    💎 Tesoro
                  </button>
                  <button
                    onClick={() => {
                      const h = generateHintCard(currentMap.biomeId || 'catacumbas', selectedRoomId === 'CORRIDOR');
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
                  <button
                    onClick={triggerEpicSceneTwist}
                    className="py-2 px-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-[11px] font-extrabold cursor-pointer shadow"
                    title="Dispara un Giro de Escena o Momento Épico de riesgo/recompensa coherente con esta sala"
                  >
                    🔥 Giro Épico
                  </button>
                </div>
              </div>
              );
            })()}

            {/* ==================== SUB-TAB 2: EVENTOS Y ACCIONES DEL DM ==================== */}
            {rightTab === 'actions' && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400">
                  Dispara eventos, tesoros, giros o puzzles en el momento adecuado de la partida:
                </p>

                <div className="space-y-2">
                  {[
                    {
                      label: '💎 Buscar Tesoro',
                      when: 'Cuándo: un héroe gasta su acción en Buscar Tesoro (sin enemigos visibles).',
                      does: 'Tira probabilidad de oro, material, equipo o trampa (aplica bonos del héroe).',
                      cls: 'bg-emerald-950/60 hover:bg-emerald-900/70 border-emerald-600/60 text-emerald-200',
                      onClick: searchRoomTreasure,
                    },
                    {
                      label: '✨ Evento de Sala',
                      when: 'Cuándo: al entrar a una sala clave o cuando el Reloj del Caos llega a 10.',
                      does: 'Saca un suceso contextual coherente con la misión oficial o bioma actual.',
                      cls: 'bg-purple-950/60 hover:bg-purple-900/70 border-purple-600/60 text-purple-200',
                      onClick: () => triggerContextualRoomEvent('room'),
                    },
                    {
                      label: '🕯️ Evento de Pasillo',
                      when: 'Cuándo: al cruzar un pasillo largo o tras 2 turnos tranquilos sin combate.',
                      does: 'Genera patrullas, rastros, trampas ligeras o tensión ambiental de corredor.',
                      cls: 'bg-stone-900/90 hover:bg-stone-800 border-stone-600 text-amber-200',
                      onClick: () => triggerContextualRoomEvent('corridor'),
                    },
                    {
                      label: '🔥 Giro Épico',
                      when: 'Cuándo: 1–2 veces por misión en salas importantes o contra el Jefe.',
                      does: 'Añade puertas con puzzle, cofres mímicos, NPCs o terreno interactivo sin alterar el mapa oficial.',
                      cls: 'bg-gradient-to-r from-amber-950/80 to-rose-950/80 hover:from-amber-900 hover:to-rose-900 border-amber-500/70 text-amber-100',
                      onClick: triggerEpicSceneTwist,
                    },
                    {
                      label: '🎁 Dar Botín Manual',
                      when: 'Cuándo: recompensa especial del libro de misiones o hallazgo narrativo.',
                      does: 'Abre el selector para enviar oro o equipo directo al celular de un héroe.',
                      cls: quickSendOpen
                        ? 'bg-amber-500 text-black border-amber-300'
                        : 'bg-amber-950/50 hover:bg-amber-900/60 border-amber-700/70 text-amber-200',
                      onClick: () => setQuickSendOpen((v) => !v),
                    },
                    {
                      label: '🧙 Invocar NPC en Sala',
                      when: 'Cuándo: quieres añadir un encuentro narrativo o rescate improvisado.',
                      does: 'Coloca un NPC en la sala actual con mini-misión (+1 Ficha de Reputación).',
                      cls: 'bg-sky-950/60 hover:bg-sky-900/70 border-sky-600/60 text-sky-200',
                      onClick: spawnNpcQuestInRoom,
                    },
                    {
                      label: '🧩 Puzzle al Celular',
                      when: 'Cuándo: puerta sellada por runas, cofre con candado o mecanismo antiguo.',
                      does: 'Envía un minijuego interactivo en vivo al celular del héroe elegido.',
                      cls: puzzleOpen
                        ? 'bg-fuchsia-500 text-black border-fuchsia-300'
                        : 'bg-fuchsia-950/50 hover:bg-fuchsia-900/60 border-fuchsia-600/60 text-fuchsia-200',
                      onClick: () => setPuzzleOpen((v) => !v),
                    },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={btn.onClick}
                      className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer space-y-0.5 ${btn.cls}`}
                    >
                      <div className="font-black text-xs">{btn.label}</div>
                      <div className="text-[10px] opacity-90 leading-snug">{btn.when}</div>
                      <div className="text-[10px] opacity-75 leading-snug">{btn.does}</div>
                    </button>
                  ))}
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
                    const spawn = roomDiscovery.isBodyLoot
                      ? { monsterType: null, trapType: null }
                      : detectSpawnable(roomDiscovery, currentMap);
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
                        {roomDiscovery.heroBonusNotes?.length > 0 && (
                          <div className="p-2 rounded-lg bg-purple-950/50 border border-purple-500/60 text-[11px] text-purple-200 space-y-0.5">
                            {roomDiscovery.heroBonusNotes.map((bn, bi) => (
                              <div key={bi}>✨ <strong>Bono aplicado:</strong> {bn}</div>
                            ))}
                          </div>
                        )}
                        {roomDiscovery.materialId && roomDiscovery.materialQty > 0 && (() => {
                          const matObj = getMaterialById(roomDiscovery.materialId);
                          return (
                            <div className="text-[11px] font-bold text-emerald-300">
                              🎒 Material incluido: {roomDiscovery.materialQty}× {matObj.icon} {matObj.name}
                            </div>
                          );
                        })()}

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

                        {roomDiscovery.alreadyDeliveredTo && (
                          <div className="p-2 rounded-lg bg-emerald-900/50 border border-emerald-500/70 text-[11px] font-bold text-emerald-200">
                            ✅ Enviado automáticamente a la mochila de {roomDiscovery.alreadyDeliveredTo}.
                          </div>
                        )}

                        {/* Enviar Botín / Oro / Material al Celular del Héroe */}
                        {!roomDiscovery.alreadyDeliveredTo && (roomDiscovery.rewardLoot || roomDiscovery.rewardGold > 0 || (roomDiscovery.materialId && roomDiscovery.materialQty > 0)) && onSendLootToHero && (
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
                                    if (roomDiscovery.rewardLoot || roomDiscovery.rewardGold) {
                                      onSendLootToHero(
                                        effectiveHeroId,
                                        roomDiscovery.rewardLoot,
                                        roomDiscovery.rewardGold
                                      );
                                    }
                                    if (roomDiscovery.materialId && roomDiscovery.materialQty > 0 && onSendMaterialToHero) {
                                      onSendMaterialToHero(
                                        effectiveHeroId,
                                        roomDiscovery.materialId,
                                        roomDiscovery.materialQty
                                      );
                                    }
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
                            <img
                              src={iconSrc}
                              alt={info.label}
                              className="max-w-full max-h-full object-contain"
                            />
                          </span>
                        ) : (
                          <span
                            className="w-3 h-3 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: info.fill }}
                          />
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
    </div>
  );
}
