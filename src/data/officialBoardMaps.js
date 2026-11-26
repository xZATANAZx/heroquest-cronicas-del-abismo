// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// Geometría EXACTA 26×19 del Tablero Oficial MODERNO 2021 (22 Salas Reales)
// Incluye las 2 salas gemelas 2×3 (R13 / R13b) y la Sala en "L" (R17) + Muesca (R19)
// ============================================================================
import { getOfficialBlueprint } from './officialBlueprints.js';
import { EXPANSION_BOARD_MAPS } from './expansionQuests.js';

export const BOARD_COLS = 26;
export const BOARD_ROWS = 19;

export const HQ_ROOMS = [
  // Cuadrante Superior Izquierdo (5 salas)
  { id: 'R1', name: 'Sala Noroeste 1', x1: 1, y1: 1, x2: 4, y2: 3, tint: '#f7f2e8' },
  { id: 'R2', name: 'Sala Noroeste 2', x1: 5, y1: 1, x2: 8, y2: 3, tint: '#f7f2e8' },
  { id: 'R3', name: 'Sala Norte-Centro Izq.', x1: 9, y1: 1, x2: 11, y2: 5, tint: '#f7f2e8' },
  { id: 'R4', name: 'Sala Oeste-Norte', x1: 1, y1: 4, x2: 4, y2: 8, tint: '#f7f2e8' },
  { id: 'R5', name: 'Sala Interior Izq.-Norte', x1: 5, y1: 4, x2: 8, y2: 8, tint: '#f7f2e8' },

  // Cuadrante Superior Derecho (5 salas)
  { id: 'R6', name: 'Sala Norte-Centro Der.', x1: 14, y1: 1, x2: 16, y2: 5, tint: '#f7f2e8' },
  { id: 'R7', name: 'Sala Noreste 1', x1: 17, y1: 1, x2: 20, y2: 4, tint: '#f7f2e8' },
  { id: 'R8', name: 'Sala Noreste 2', x1: 21, y1: 1, x2: 24, y2: 4, tint: '#f7f2e8' },
  { id: 'R9', name: 'Sala Interior Der.-Norte', x1: 17, y1: 5, x2: 20, y2: 8, tint: '#f7f2e8' },
  { id: 'R10', name: 'Sala Este-Norte', x1: 21, y1: 5, x2: 24, y2: 8, tint: '#f7f2e8' },

  // Gran Sala Central (6×5)
  { id: 'R11', name: 'Gran Sala Central', x1: 10, y1: 7, x2: 15, y2: 11, tint: '#efe2c8' },

  // Cuadrante Inferior Izquierdo (6 salas — incluye las 2 gemelas 2×3: R13 y R13b)
  { id: 'R12', name: 'Sala Oeste-Sur', x1: 1, y1: 10, x2: 4, y2: 13, tint: '#f7f2e8' },
  { id: 'R13', name: 'Sala Gemela Oeste (2×3)', x1: 5, y1: 10, x2: 6, y2: 12, tint: '#f7f2e8' },
  { id: 'R13b', name: 'Sala Gemela Este (2×3)', x1: 7, y1: 10, x2: 8, y2: 12, tint: '#f7f2e8' },
  { id: 'R14', name: 'Sala Suroeste (Inicio)', x1: 1, y1: 14, x2: 4, y2: 17, tint: '#f7f2e8' },
  { id: 'R15', name: 'Sala Sur-Izq. Media', x1: 5, y1: 13, x2: 8, y2: 17, tint: '#f7f2e8' },
  { id: 'R16', name: 'Sala Sur-Centro Izq.', x1: 9, y1: 13, x2: 11, y2: 17, tint: '#f7f2e8' },

  // Cuadrante Inferior Derecho (5 salas — incluye Sala en "L" R17 de 15 casillas + R19 4×5 + R20 3×4)
  {
    id: 'R17',
    name: 'Sala en "L" Der.-Sur',
    x1: 17,
    y1: 10,
    x2: 20,
    y2: 13,
    exclude: [{ x: 17, y: 13 }],
    tint: '#f7f2e8',
  },
  { id: 'R18', name: 'Sala Este-Sur', x1: 21, y1: 10, x2: 24, y2: 13, tint: '#f7f2e8' },
  { id: 'R19', name: 'Sala Sur-Centro Der. (4×5)', x1: 14, y1: 13, x2: 17, y2: 17, tint: '#f7f2e8' },
  { id: 'R20', name: 'Sala Sur-Der. Media (3×4)', x1: 18, y1: 14, x2: 20, y2: 17, tint: '#f7f2e8' },
  { id: 'R21', name: 'Sala Sureste', x1: 21, y1: 14, x2: 24, y2: 17, tint: '#f7f2e8' },
];

export function isCellInRoom(r, x, y) {
  if (!r || x < r.x1 || x > r.x2 || y < r.y1 || y > r.y2) return false;
  if (r.exclude && r.exclude.some((ex) => ex.x === x && ex.y === y)) return false;
  return true;
}

export function getRoomCells(r) {
  const cells = [];
  if (!r) return cells;
  for (let y = r.y1; y <= r.y2; y++) {
    for (let x = r.x1; x <= r.x2; x++) {
      if (isCellInRoom(r, x, y)) cells.push({ x, y });
    }
  }
  return cells;
}

export function getRoomAt(x, y) {
  for (const r of HQ_ROOMS) {
    if (isCellInRoom(r, x, y)) {
      return r.id;
    }
  }
  return 'CORRIDOR';
}

export function getRoomObj(roomId) {
  return HQ_ROOMS.find((r) => r.id === roomId) || null;
}

export const PIECE_TYPES = {
  stairs: { label: 'Escaleras (Inicio 2×2)', code: 'ESC', defaultW: 2, defaultH: 2, fill: '#2e6f40', stroke: '#133a1e', category: 'Estructura' },
  door: { label: 'Puerta', code: 'P', defaultW: 1, defaultH: 1, fill: '#a16207', stroke: '#1c1917', category: 'Estructura' },
  secret_door: { label: 'Puerta Secreta', code: 'SEC', defaultW: 1, defaultH: 1, fill: '#7e22ce', stroke: '#f3e8ff', category: 'Secreto', secret: true },
  blocked: { label: 'Pared Bloqueada (1×1)', code: 'MURO', defaultW: 1, defaultH: 1, fill: '#292524', stroke: '#0c0a09', category: 'Estructura' },
  blocked_double: { label: 'Pared Bloqueada Doble (2×1)', code: 'MURO 2×1', defaultW: 2, defaultH: 1, fill: '#1c1917', stroke: '#0c0a09', category: 'Estructura' },
  trap_pit: { label: 'Trampa de Foso', code: 'FOSO', defaultW: 1, defaultH: 1, fill: '#ea580c', stroke: '#ffedd5', category: 'Trampa', secret: true },
  trap_spear: { label: 'Trampa de Lanzas', code: 'LANZA', defaultW: 1, defaultH: 1, fill: '#dc2626', stroke: '#fee2e2', category: 'Trampa', secret: true },
  trap_falling_rock: { label: 'Bloque Cayendo', code: 'ROCA', defaultW: 1, defaultH: 1, fill: '#9a3412', stroke: '#fed7aa', category: 'Trampa', secret: true },

  // Mobiliario oficial HeroQuest 2021 (dimensiones exactas en casillas)
  table: { label: 'Mesa (3×2)', code: 'MESA', defaultW: 3, defaultH: 2, fill: '#8b5a2b', stroke: '#3b220c', category: 'Mobiliario', furnitureKey: 'Mesa' },
  throne: { label: 'Trono (1×1)', code: 'TRONO', defaultW: 1, defaultH: 1, fill: '#b45309', stroke: '#451a03', category: 'Mobiliario', furnitureKey: 'Trono' },
  chest: { label: 'Cofre del Tesoro (1×1)', code: 'COFRE', defaultW: 1, defaultH: 1, fill: '#ca8a04', stroke: '#422006', category: 'Mobiliario', furnitureKey: 'Cofre' },
  tomb: { label: 'Tumba (3×2)', code: 'TUMBA', defaultW: 3, defaultH: 2, fill: '#6b7280', stroke: '#1f2937', category: 'Mobiliario', furnitureKey: 'Tumba' },
  bookcase: { label: 'Biblioteca (3×1)', code: 'BIBLIO', defaultW: 3, defaultH: 1, fill: '#78350f', stroke: '#291002', category: 'Mobiliario', furnitureKey: 'Biblioteca' },
  cupboard: { label: 'Alacena / Armario (3×1)', code: 'ALACENA', defaultW: 3, defaultH: 1, fill: '#6d4c41', stroke: '#261712', category: 'Mobiliario', furnitureKey: 'Armario' },
  weapon_rack: { label: 'Estante de Armas (3×1)', code: 'ARMERO', defaultW: 3, defaultH: 1, fill: '#57534e', stroke: '#1c1917', category: 'Mobiliario', furnitureKey: 'Armería' },
  fireplace: { label: 'Chimenea (3×1)', code: 'CHIMENEA', defaultW: 3, defaultH: 1, fill: '#9a3412', stroke: '#431407', category: 'Mobiliario', furnitureKey: 'Chimenea' },
  sorcerer_table: { label: 'Mesa de Hechicero (3×2)', code: 'HECHICERO', defaultW: 3, defaultH: 2, fill: '#581c87', stroke: '#2e1065', category: 'Mobiliario', furnitureKey: 'Altar del Mago' },
  alchemy_bench: { label: 'Mesa de Alquimista (3×2)', code: 'ALQUIMIA', defaultW: 3, defaultH: 2, fill: '#0f766e', stroke: '#134e4a', category: 'Mobiliario', furnitureKey: 'Banco de Alquimista' },
  torture_rack: { label: 'Potro de Tortura (3×2)', code: 'POTRO', defaultW: 3, defaultH: 2, fill: '#7f1d1d', stroke: '#2a0707', category: 'Mobiliario', furnitureKey: 'Potro de Tortura' },

  // Monstruos
  goblin: { label: 'Goblin', code: 'GO', fill: '#4d7c0f', stroke: '#ecfccb', category: 'Monstruo', monsterId: 'goblin' },
  orc: { label: 'Orco', code: 'OR', fill: '#15803d', stroke: '#dcfce7', category: 'Monstruo', monsterId: 'orco' },
  abomination: { label: 'Abominación (Fimir)', code: 'AB', fill: '#047857', stroke: '#d1fae5', category: 'Monstruo', monsterId: 'abominacion' },
  skeleton: { label: 'Esqueleto', code: 'ES', fill: '#475569', stroke: '#f1f5f9', category: 'Monstruo', monsterId: 'esqueleto' },
  zombie: { label: 'Zombi', code: 'ZO', fill: '#115e59', stroke: '#ccfbf1', category: 'Monstruo', monsterId: 'zombi' },
  mummy: { label: 'Momia', code: 'MO', fill: '#a16207', stroke: '#fef9c3', category: 'Monstruo', monsterId: 'momia' },
  dread_warrior: { label: 'Guerrero del Terror', code: 'GT', fill: '#991b1b', stroke: '#fee2e2', category: 'Monstruo', monsterId: 'guerrero_terror' },
  gargoyle: { label: 'Gárgola (Jefe)', code: 'GA', fill: '#6b21a8', stroke: '#fde047', category: 'Jefe', monsterId: 'gargola', isBoss: true },
  sorcerer: { label: 'Hechicero / Jefe', code: 'HE', fill: '#581c87', stroke: '#fca5a5', category: 'Jefe', monsterId: 'liche', isBoss: true },
  specter: { label: 'Espectro (Luna)', code: 'EP', fill: '#0e7490', stroke: '#cffafe', category: 'Monstruo', monsterId: 'espectro' },
  assassin: { label: 'Asesino (Luna)', code: 'AS', fill: '#3730a3', stroke: '#e0e7ff', category: 'Monstruo', monsterId: 'asesino_luna' },
  mimic: { label: '¡Mímico HQ-D20!', code: 'MI', fill: '#be123c', stroke: '#fde047', category: 'Monstruo', monsterId: 'mimico' },
  npc: { label: 'NPC / Prisionero', code: 'NPC', fill: '#0369a1', stroke: '#e0f2fe', category: 'NPC' },
  hero: { label: 'Héroe', code: 'H', fill: '#059669', stroke: '#ffffff', category: 'Héroe' },
};

export const ROOM_READ_ALOUD = {
  R14: 'Descienden por las frías escaleras de piedra hasta la cámara de entrada. Las antorchas parpadean iluminando dos sólidas puertas de roble frente a ustedes.',
  R15: 'Un cuarto de guardia improvisado con olor a hierro y sudor; alguien vigilaba el acceso desde las sombras.',
  R12: 'Racks de armas y cajas polvorientas cubren las paredes de esta antigua armería subterránea.',
  R13: 'Una sala estrecha de paso con marcas de garras en la madera y ecos provenientes del norte.',
  R4: 'El techo gotea agua helada sobre losas agrietadas; unas siluetas se giran bruscamente al oír la puerta.',
  R5: 'Una cámara bien custodiada. Entre los pilares brilla el contorno metálico de un cofre cerrado.',
  R1: 'Un silencio sepulcral domina la cripta. Un enorme sarcófago de piedra descansa junto a un cofre antiguo.',
  R2: 'El aire huele a vendajes resecos y polvo de siglos; el guardián de la tumba despierta lentamente.',
  R3: 'Pasadizo cubierto de telarañas que conecta las criptas del norte con el corazón de la mazmorra.',
  R11: 'Al abrir la imponente puerta central, el calor de los braseros y un aura oscura llenan el salón del trono. ¡La principal amenaza de la misión los espera!',
  R6: 'Una cámara de guardia al norte con estantes y botín acumulado por los soldados del Terror.',
  R7: 'El olor a aceite y acero recién afilado delata que están cerca de la cámara principal del ala este.',
  R8: 'Una sala apartada en el extremo noreste; estanterías antiguas o barrotes de hierro dominan el lugar.',
  R10: 'Un despacho arcano iluminado por velas violetas y olor a incienso oscuro.',
  R18: 'Una sala de mando con mesas pesadas que pueden volcarse como cobertura en combate.',
  R21: 'Un almacén del tesoro escondido en el extremo sureste, protegido por huesos inquietos.',
  CORRIDOR: 'Los pasillos de piedra conectan las distintas alas de la fortaleza. Algunos corredores fueron derrumbados con rocas para acortar y dirigir el camino.',
};

// ============================================================================
// MAPAS COHERENTES Y VERIFICADOS (Puertas exactas en edge N/S/E/W, 100% transitables)
// ============================================================================
export const OFFICIAL_QUEST_MAPS = [
  {
    id: 'm1_la_prueba',
    questId: 'q1',
    biomeId: 'catacumbas',
    title: 'Misión 1: La Prueba (Coherente + Mejoras HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: 'R14',
    wanderingMonster: 'Orco',
    zargonCounters: { trampa: 2, emboscada: 1, patrulla: 1, destino: 1, escape: 0 },
    hazardRooms: {
      R4: { icon: '🪨', name: 'Techo Inestable', rule: 'Si un ataque saca 3+ calaveras, caen piedras en la sala (DES CD 12 o 1 PC).' },
      R1: { icon: '❄️', name: 'Cripta Fría de Fellmarg', rule: 'Los No Muertos junto a la Tumba ganan +1 DC Defensa.' },
      R11: { icon: '🔥', name: 'Sala del Sello de Verag', rule: 'Si examinaron la Biblioteca (R8, CD 12), Verag pierde -1 DC Defensa.' },
    },
    specialAlert: 'Misión de inicio reestructurada HQ-D20 v2: R14 conecta por el Ala Oeste hacia la Tumba de Fellmarg (R1–R2, Momia en GUARDIA) o hacia la Sala Central (R11, Verag con Fase 2).',
    notes: [
      {
        code: 'A',
        room: 'R12',
        title: 'Armería Oxidada (Sala Oeste-Sur)',
        text: 'Armas oxidadas. MEJORA HQ-D20: Con Investigación CD 12 encuentran 1 Daga de Colmillo Venenoso (Poco Común) lista para enviar al héroe que superó la tirada.',
        rewards: [
          {
            label: 'Daga de Colmillo Venenoso (2 DC)',
            loot: {
              name: 'Daga de Colmillo Venenoso',
              type: 'Arma',
              rarity: 'poco_comun',
              dice: '2 DC',
              upgrade: 'Arrojadiza (4 casillas). Si hace daño, objetivo salva CON CD 12 o queda Envenenado (-1 DC At).',
              special: 'Arrojadiza (4 casillas). Envenena al herir (CON CD 12).',
              restriction: 'Todas las clases',
            },
          },
        ],
      },
      {
        code: 'B',
        room: 'R5',
        title: 'Cofre del Guardia (Sala Interior Izq.)',
        text: 'Custodiado por 1 Guerrero del Terror. MEJORA HQ-D20: Al abrir el cofre hallan 1 Reactivo Alquímico + 50 MO.',
        rewards: [
          {
            label: 'Reactivo Alquímico',
            loot: {
              name: 'Reactivo Alquímico Puro',
              type: 'Accesorio',
              rarity: 'comun',
              dice: 'Alquimia',
              upgrade: 'Permite destilar 1 poción gratis en cualquier Banco de Alquimista.',
              special: 'Ingrediente alquímico puro.',
              restriction: 'Todas las clases',
            },
          },
          { label: '50 Monedas de Oro', gold: 50 },
        ],
      },
      { code: 'C', room: 'R2', title: 'Tumba de Fellmarg (Guardián)', text: 'La Momia de Fellmarg ataca con 4 DC en lugar de 3 (Vulnerable a Fuego +1 daño).' },
      {
        code: 'D',
        room: 'R1',
        title: 'Tesoro de Fellmarg',
        text: 'El primer héroe que busque tesoros encuentra 84 Monedas de Oro y el Diario de Fellmarg (+75 XP secundario).',
        rewards: [
          { label: '84 Monedas de Oro', gold: 84 },
          { label: 'Diario de Fellmarg (+75 XP)', xp: 75 },
        ],
      },
      {
        code: 'E',
        room: 'R21',
        title: 'Cámara del Tesoro Sureste',
        text: 'Cofre con 120 Monedas de Oro + tirada de Tesoro para el grupo.',
        rewards: [{ label: '120 Monedas de Oro', gold: 120 }],
      },
      { code: 'BO', room: 'R11', title: 'Verag, la Gárgola (Gran Sala Central)', text: 'JEFE: Si antes examinaron la Biblioteca (R8) con Arcano/Investigación CD 12, descubren la runa que reduce -1 Def a Verag.' },
    ],
    items: getOfficialBlueprint(1).items,
    darkCells: getOfficialBlueprint(1).darkCells,
  },
  {
    id: 'm2_sir_ragnar',
    questId: 'q2',
    biomeId: 'fortaleza_orca',
    title: 'Misión 2: El Rescate de Sir Ragnar (Alarma + Patrullas HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: 'R14',
    wanderingMonster: 'Orco',
    zargonCounters: { trampa: 2, emboscada: 2, patrulla: 2, destino: 1, escape: 1 },
    hazardRooms: {
      R5: { icon: '⛓️', name: 'Sala de Cadenas', rule: 'Oculta 1 Prisionero Enano rescatable (+1 Reputación) y trampa de cepo.' },
      R8: { icon: '🚨', name: 'Celda con Alarma', rule: 'Al abrir R8, el Reloj del Caos sube a 6 y los enemigos pasan a estado PATRULLA.' },
      R10: { icon: '☠️', name: 'Alijo con Trampa', rule: 'Cofre tras puerta secreta con aguja venenosa (DES CD 13) y Reactivo Lunar.' },
    },
    specialAlert: '¡ALARMA GENERAL! Al abrir la puerta de la celda de Sir Ragnar (R8), el Reloj del Caos sube a 6, todas las puertas restantes se abren y cada 2 rondas aparece 1 Goblin en las escaleras.',
    notes: [
      {
        code: 'A',
        room: 'R10',
        title: 'Cofre Trampa (Tras Puerta Secreta)',
        text: 'Trampa de aguja (DES CD 13 o 1 PC + Envenenado). Contiene 1 Reactivo Alquímico Lunar.',
        rewards: [
          {
            label: 'Reactivo Alquímico Lunar',
            loot: {
              name: 'Reactivo Alquímico Lunar',
              type: 'Accesorio',
              rarity: 'poco_comun',
              dice: 'Alquimia',
              upgrade: 'Destila 1 Poción de Curación Mayor o Clarividencia en un Banco de Alquimista.',
              special: 'Ingrediente raro de alquimia.',
              restriction: 'Todas las clases',
            },
          },
        ],
      },
      {
        code: 'B',
        room: 'R6',
        title: 'Botín de la Guardia',
        text: 'Cofre con 60 MO y 1 Poción de Curación Mayor (+4 PC).',
        rewards: [
          { label: '60 Monedas de Oro', gold: 60 },
          {
            label: 'Poción de Curación Mayor (+4 PC)',
            loot: {
              name: 'Poción de Curación Mayor',
              type: 'Poción',
              rarity: 'poco_comun',
              dice: '+4 PC',
              upgrade: 'Acción gratuita: restaura hasta 4 PC al instante.',
              special: 'Restaura 4 PC.',
              restriction: 'Todas las clases',
            },
          },
        ],
      },
      { code: 'NP', room: 'R8', title: 'Celda de Sir Ragnar', text: 'Sir Ragnar (2 PC, mueve 1d6; +2 mov si lo curan con Medicina CD 11 o poción).' },
    ],
    items: getOfficialBlueprint(2).items,
    darkCells: getOfficialBlueprint(2).darkCells,
  },
  {
    id: 'm3_caudillo_orco',
    questId: 'q3',
    biomeId: 'fortaleza_orca',
    title: 'Misión 3: La Guarida del Caudillo Orco (Ulag · HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: 'R14',
    wanderingMonster: 'Orco',
    zargonCounters: { trampa: 2, emboscada: 2, patrulla: 2, destino: 1, escape: 1 },
    hazardRooms: {
      R13: { icon: '🚩', name: 'Armería del Estandarte', rule: 'Derribar el estandarte (Atletismo CD 12) impone Desventaja a todos los Goblins.' },
      R11: { icon: '🔥', name: 'Braseros del Trono de Ulag', rule: 'Empujar un enemigo al brasero causa 1 PC extra de fuego. Ulag activa ¡WAAAGH! en Fase 2.' },
      R18: { icon: '🗡️', name: 'Cámara de Trampa de Lanza', rule: 'Cofre protegido por lanza oculta (DES CD 13) con 100 MO.' },
    },
    specialAlert: 'Ulag el Caudillo Orco aguarda en la Gran Sala Central (R11). Al caer a mitad de PC grita "¡WAAAGH!" (+1 DC) y puede intentar huir como Némesis.',
    notes: [
      {
        code: 'A',
        room: 'R13',
        title: 'Armería Orca',
        text: 'Encuentran un Bastón de Guerra Orco + estandarte orco (derribarlo con Atletismo CD 12 da Desventaja a Goblins).',
        rewards: [
          {
            label: 'Bastón de Guerra Orco (2 DC)',
            loot: {
              name: 'Bastón de Guerra Orco',
              type: 'Arma',
              rarity: 'poco_comun',
              dice: '2 DC',
              upgrade: 'Ataque en diagonal. Apto para Mago, Brujo y todas las clases.',
              special: 'Diagonal, contundente.',
              restriction: 'Todas las clases',
            },
          },
        ],
      },
      {
        code: 'B',
        room: 'R7',
        title: 'Despensa del Cuartel',
        text: 'Armario con 24 MO y 1 Poción de Curación Mayor.',
        rewards: [
          { label: '24 Monedas de Oro', gold: 24 },
          {
            label: 'Poción de Curación Mayor (+4 PC)',
            loot: {
              name: 'Poción de Curación Mayor',
              type: 'Poción',
              rarity: 'poco_comun',
              dice: '+4 PC',
              upgrade: 'Acción gratuita: restaura hasta 4 PC al instante.',
              special: 'Restaura 4 PC.',
              restriction: 'Todas las clases',
            },
          },
        ],
      },
      {
        code: 'C',
        room: 'R18',
        title: 'Cofre con Trampa',
        text: 'Trampa de lanza (DES CD 13) custodiando 100 MO.',
        rewards: [{ label: '100 Monedas de Oro', gold: 100 }],
      },
      { code: 'BO', room: 'R11', title: 'Ulag, el Caudillo Orco', text: 'Jefe Orco escoltado en la Gran Sala Central.' },
    ],
    items: getOfficialBlueprint(3).items,
    darkCells: getOfficialBlueprint(3).darkCells,
  },
  {
    id: 'm4_oro_magnus',
    questId: 'q4',
    biomeId: 'fortaleza_orca',
    title: 'Misión 4: El Oro del Príncipe Magnus (+ Mímico HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: 'R14',
    wanderingMonster: 'Orco',
    zargonCounters: { trampa: 3, emboscada: 2, patrulla: 2, destino: 1, escape: 1 },
    hazardRooms: {
      R11: { icon: '💰', name: 'Bóveda de Gulthor', rule: 'Cargar 1 cofre reduce movimiento a 1d6 (salvo FUE 14+). Gulthor entra en Venganza en Fase 2.' },
      R18: { icon: '👾', name: 'Guarida del Mímico', rule: 'El cofre de R18 es un Mímico (Atq 4 DC, 4 PC) que sorprende si no hacen Percepción CD 13.' },
    },
    specialAlert: 'Recuperen los 3 Cofres de Oro (cargar 1 cofre reduce mov a 1d6 salvo FUE 14+). ¡El cofre de R18 es un MÍMICO!',
    notes: [
      { code: 'A', room: 'R11', title: 'Cámara de Gulthor (2 Cofres)', text: 'Gulthor custodia 2 de los 3 cofres oficiales.' },
      { code: 'B', room: 'R8', title: 'Tercer Cofre del Príncipe', text: 'Custodiado por 1 Abominación y 2 Orcos.' },
      { code: 'MI', room: 'R18', title: '¡Emboscada de Mímico!', text: 'El cofre de R18 es un Mímico de Cofre (At 4 DC, PC 4).' },
    ],
    items: getOfficialBlueprint(4).items,
    darkCells: getOfficialBlueprint(4).darkCells,
  },
  {
    id: 'm5_laberinto_melar',
    questId: 'q5',
    biomeId: 'cripta_espectral',
    title: 'Misión 5: El Laberinto de Melar (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(5).startRoom,
    wanderingMonster: 'Zombi',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto de El Laberinto de Melar. Busquen el Talismán del Saber.',
    notes: [{ code: 'A', room: getOfficialBlueprint(5).startRoom, title: 'El Laberinto de Melar', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(5).items,
    darkCells: getOfficialBlueprint(5).darkCells,
  },
  {
    id: 'm6_legado_orco',
    questId: 'q6',
    biomeId: 'fortaleza_orca',
    title: 'Misión 6: El Legado del Caudillo Orco (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(6).startRoom,
    wanderingMonster: 'Orco',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto: Grak, hijo de Ulag, los ha capturado. Recuperen su equipo y escapen.',
    notes: [{ code: 'A', room: getOfficialBlueprint(6).startRoom, title: 'Prisión de Grak', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(6).items,
    darkCells: getOfficialBlueprint(6).darkCells,
  },
  {
    id: 'm7_mago_perdido',
    questId: 'q7',
    biomeId: 'laboratorio_alquimico',
    title: 'Misión 7: El Mago Perdido (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(7).startRoom,
    wanderingMonster: 'Momia',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto: descubran el destino de Wardoz en las cámaras arcanas.',
    notes: [{ code: 'A', room: getOfficialBlueprint(7).startRoom, title: 'Cámara de Wardoz', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(7).items,
    darkCells: getOfficialBlueprint(7).darkCells,
  },
  {
    id: 'm8_mago_fuego',
    questId: 'q8',
    biomeId: 'forja_enana',
    title: 'Misión 8: El Mago del Fuego — Balur (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(8).startRoom,
    wanderingMonster: 'Orco',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto: destruyan a Balur, el Mago del Fuego, inmune a hechizos ígneos.',
    notes: [{ code: 'A', room: getOfficialBlueprint(8).startRoom, title: 'Guarida de Balur', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(8).items,
    darkCells: getOfficialBlueprint(8).darkCells,
  },
  {
    id: 'm9_carrera_tiempo',
    questId: 'q9',
    biomeId: 'catacumbas',
    title: 'Misión 9: Carrera Contra el Tiempo (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(9).startRoom,
    wanderingMonster: 'Abominación',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto: escapen de la mazmorra antes de que colapse.',
    notes: [{ code: 'A', room: getOfficialBlueprint(9).startRoom, title: 'Inicio del Colapso', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(9).items,
    darkCells: getOfficialBlueprint(9).darkCells,
  },
  {
    id: 'm10_castillo_misterio',
    questId: 'q10',
    biomeId: 'cripta_espectral',
    title: 'Misión 10: El Castillo del Misterio (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(10).startRoom,
    wanderingMonster: 'Esqueleto',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto: las puertas teletransportan entre cámaras del castillo de Ollar.',
    notes: [{ code: 'A', room: getOfficialBlueprint(10).startRoom, title: 'Castillo de Ollar', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(10).items,
    darkCells: getOfficialBlueprint(10).darkCells,
  },
  {
    id: 'm11_bastion_caos',
    questId: 'q11',
    biomeId: 'fortaleza_orca',
    title: 'Misión 11: El Bastión del Caos (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(11).startRoom,
    wanderingMonster: 'Guerrero del Terror',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto: purguen la fortaleza de los Guerreros del Terror.',
    notes: [{ code: 'A', room: getOfficialBlueprint(11).startRoom, title: 'Bastión del Caos', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(11).items,
    darkCells: getOfficialBlueprint(11).darkCells,
  },
  {
    id: 'm12_barak_tor_tumulo',
    questId: 'q12',
    biomeId: 'cripta_espectral',
    title: 'Misión 12: Barak Tor — Túmulo del Señor Brujo (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(12).startRoom,
    wanderingMonster: 'Esqueleto',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto: recuperen la Estrella del Oeste en el Túmulo del Señor Brujo.',
    notes: [{ code: 'A', room: getOfficialBlueprint(12).startRoom, title: 'Túmulo del Señor Brujo', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(12).items,
    darkCells: getOfficialBlueprint(12).darkCells,
  },
  {
    id: 'm13_hoja_espiritual',
    questId: 'q13',
    biomeId: 'forja_enana',
    title: 'Misión 13: En Busca de la Hoja Espiritual (Plano Oficial + HQ-D20 v2)',
    expansion: 'Juego Base',
    startRoom: getOfficialBlueprint(13).startRoom,
    wanderingMonster: 'Guerrero del Terror',
    hazardRooms: {},
    specialAlert: 'Plano oficial exacto: recuperen la Hoja Espiritual para vencer al Señor Brujo.',
    notes: [{ code: 'A', room: getOfficialBlueprint(13).startRoom, title: 'Santuario de la Hoja Espiritual', text: 'Plano oficial exacto del Libro de Misiones adaptado al sistema HQ-D20 v2.' }],
    items: getOfficialBlueprint(13).items,
    darkCells: getOfficialBlueprint(13).darkCells,
  },
  {
    id: 'm14_barak_tor',
    questId: 'q14',
    biomeId: 'cripta_espectral',
    title: 'Misión 14: Regreso a Barak Tor (Señor Brujo · HQ-D20 v2)',
    expansion: 'Juego Base (Clímax)',
    startRoom: 'R14',
    wanderingMonster: 'Momia',
    zargonCounters: { trampa: 3, emboscada: 3, patrulla: 2, destino: 3, escape: 0 },
    hazardRooms: {
      R11: { icon: '🔮', name: 'Suelo de Runas y Filacteria', rule: 'Mientras el Altar (3 PC o Arcano CD 14) siga intacto, el Señor Brujo regenera 2 PC/turno. Hechizos +1 DC.' },
      R16: { icon: '🌫️', name: 'Bruma Psíquica', rule: 'Al empezar el turno aquí, SAB CD 13 o pierde 1 PM.' },
    },
    specialAlert: 'BATALLA FINAL EN 2 FASES: Destruyan la Filacteria en el Altar (R11) para detener la regeneración del Señor Brujo y remátenlo con la Hoja Espiritual.',
    notes: [
      { code: 'FI', room: 'R11', title: 'Altar de la Filacteria', text: 'Mientras el Altar siga intacto (3 PC o Arcano CD 14), el Señor Brujo regenera 2 PC cada turno.' },
      { code: 'BO', room: 'R11', title: 'El Señor Brujo (Liche)', text: 'Invoca 1 Esqueleto cada turno. En Fase 2 (mitad de PC) libera Onda de Terror (SAB CD 14 o -2 PM).' },
    ],
    items: getOfficialBlueprint(14).items,
    darkCells: getOfficialBlueprint(14).darkCells,
  },
  ...EXPANSION_BOARD_MAPS,
];

// ============================================================================
// EVENTOS CONTEXTUALES POR MISIÓN (Integrados directamente en cada Sala/Pasillo)
// Reemplaza el antiguo Oráculo genérico: siempre 100% coherente con la misión actual.
// ============================================================================
export const MISSION_CONTEXT_EVENTS = {
  m1_la_prueba: {
    room: [
      {
        title: 'Eco de Piedra de Verag',
        badge: 'Ambiente / Tensión',
        text: 'Un temblor sacude las antorchas y el polvo cae del techo. Al fondo de las catacumbas retumba el rugido pétreo de Verag. Prueba de Percepción CD 12: quien la supere nota hacia qué dirección provienen los pasos pesados (hacia la Gran Sala Central) y gana +1 a su próxima iniciativa.',
      },
      {
        title: 'Escudo Caído de un Recluta',
        badge: 'Hallazgo de Misión',
        text: 'Junto a un rincón ven el cuerpo seco de un antiguo aprendiz de Mentor. Investigación CD 11 permite rescatar una Poción de Curación Menor (+2 PC) aún intacta en su cinturón.',
        rewardLoot: {
          name: 'Poción de Curación Menor',
          type: 'Poción',
          rarity: 'comun',
          dice: '+2 PC',
          upgrade: 'Acción gratuita: restaura 2 PC.',
          special: 'Restaura 2 PC.',
          restriction: 'Todas las clases',
        },
      },
      {
        title: 'Runa Agrietada de Fellmarg',
        badge: 'Pista Táctica',
        text: 'Una losa tiene grabada una advertencia en lengua antigua. Arcano o Investigación CD 12: revela que la Momia de Fellmarg arde con facilidad (+1 daño extra por Fuego) y otorga +1 Inspiración al héroe.',
      },
    ],
    corridor: [
      {
        title: 'Patrulla Orca Distraída',
        badge: 'Encuentro de Pasillo',
        text: 'Escuchan gruñidos detrás de la esquina. Sigilo grupal CD 11: si lo superan, pueden sorprender a 1 Orco rezagado (atacan primero con Ventaja); si fallan, el Orco alerta a la sala más cercana.',
      },
      {
        title: 'Antorcha que se Apaga',
        badge: 'Peligro Menor',
        text: 'Una corriente helada apaga la antorcha más cercana. Hasta que alguien gaste una acción gratuita en reencenderla, las pruebas de Percepción en este pasillo tienen Desventaja (salvo razas con Visión en la Oscuridad).',
      },
    ],
  },
  m2_sir_ragnar: {
    room: [
      {
        title: 'Llavero del Carcelero',
        badge: 'Ventaja Táctica',
        text: 'Colgado en un clavo oxidado hay un manojo de llaves de hierro. Percepción CD 12 para verlo: el héroe que las tome abre cerraduras y desarma trampas de cofres con Ventaja durante el resto de la misión.',
      },
      {
        title: 'Mensaje Rasgado de Sir Ragnar',
        badge: 'Pista de Rescate',
        text: 'Bajo la mesa hay un trozo de capa azul con manchas de sangre. Supervivencia CD 11: el rastro fresco confirma que llevaron a Sir Ragnar hacia el ala Noreste (R8).',
      },
      {
        title: 'Raciones y Botiquín de Guardia',
        badge: 'Hallazgo de Misión',
        text: 'Encuentran un morral olvidado por los guardias orcos con vendajes limpios y 35 MO.',
        rewardGold: 35,
      },
    ],
    corridor: [
      {
        title: 'Campana de Alerta en el Techo',
        badge: 'Trampa de Pasillo',
        text: 'Un hilo casi invisible cruza el corredor conectado a una campana orca. Percepción o Desarmar Trampas CD 12: si fallan, suena la alarma y el Reloj del Caos sube +1.',
      },
      {
        title: 'Refuerzo Goblin a la Carrera',
        badge: 'Emboscada',
        text: 'Un Goblin mensajero dobla la esquina corriendo con una antorcha. Si no lo derriban en 1 turno, avisa a los enemigos de la sala siguiente.',
      },
    ],
  },
  m3_caudillo_orco: {
    room: [
      {
        title: 'Tambores de Guerra de Ulag',
        badge: 'Tensión de Combate',
        text: 'Los tambores resuenan desde la Sala del Trono. Todos los héroes tiran Salvación de SAB CD 11 o sufren -1 a su próxima iniciativa por el estruendo salvaje.',
      },
      {
        title: 'Botín Robado de Caravana',
        badge: 'Hallazgo de Misión',
        text: 'Entre cajas saqueadas encuentran un Pergamino de Coraje (+2 DC ataque) listo para usar.',
        rewardLoot: {
          name: 'Pergamino de Coraje',
          type: 'Pergamino',
          rarity: 'poco_comun',
          dice: '+2 DC Ataque',
          upgrade: '1 uso: otorga +2 DC de ataque cuerpo a cuerpo por 2 turnos.',
          special: 'Hechizo Coraje en pergamino (1 uso).',
          restriction: 'Todas las clases',
        },
      },
    ],
    corridor: [
      {
        title: 'Charco de Aceite Orco',
        badge: 'Peligro Táctico',
        text: 'El suelo está resbaladizo con grasa de antorcha. Quien corra por aquí tira DES CD 11 o resbala (pierde el resto de su movimiento). Si cae fuego aquí, arde causando 1 PC.',
      },
    ],
  },
  m4_oro_magnus: {
    room: [
      {
        title: 'Monedas Sueltas en el Suelo',
        badge: 'Rastro de Oro',
        text: 'Un reguero de monedas imperiales marca por dónde arrastraron los cofres de Magnus. El héroe que las recoja suma +30 MO.',
        rewardGold: 30,
      },
      {
        title: 'Crujido Sospechoso de Madera',
        badge: 'Advertencia de Mímico',
        text: 'Percepción CD 12: un héroe nota marcas de dientes y saliva oscura cerca de las bisagras de un mueble. ¡Cuidado con los cofres falsos en el ala este!',
      },
    ],
    corridor: [
      {
        title: 'Peso del Tesoro',
        badge: 'Complicación',
        text: 'Una baldosa cede ligeramente bajo el peso de las armaduras y cofres. Quien cargue un Cofre de Oro tira FUE CD 12 para no tropezar y hacer ruido (+1 Reloj del Caos).',
      },
    ],
  },
  m14_barak_tor: {
    room: [
      {
        title: 'Susurro Necrótico del Señor Brujo',
        badge: 'Terror de Barak Tor',
        text: 'Las sombras de la sala se alargan hacia ustedes. Salvación de SAB CD 13 o pierden 1 PM por el frío sepulcral de la cripta.',
      },
      {
        title: 'Reliquia de un Cruzado Antiguo',
        badge: 'Hallazgo Sagrado',
        text: 'Junto a una columna yace un frasco de Agua Bendita intacto (+2 DC mágicos contra No Muertos al arrojarlo).',
        rewardLoot: {
          name: 'Frasco de Agua Bendita',
          type: 'Poción',
          rarity: 'raro',
          dice: '2 DC Mágico',
          upgrade: 'Arrojadizo: inflige 2 DC mágicos indefendibles a No Muertos o Espectros.',
          special: 'Daña No Muertos y corta regeneración.',
          restriction: 'Todas las clases',
        },
      },
    ],
    corridor: [
      {
        title: 'Manos Esqueléticas del Suelo',
        badge: 'Trampa Necrótica',
        text: 'Brazos de hueso brotan entre las grietas intentando sujetar los tobillos. Salvación FUE o DES CD 12 para liberarse sin perder el turno.',
      },
    ],
  },
  exp_luna_terror: {
    room: [
      {
        title: 'Niebla Plateada del Eclipse',
        badge: 'Fenómeno Espectral',
        text: 'Una bruma fría entra por las rendijas. Los ataques a distancia tienen Desventaja este turno, pero los héroes con Visión en la Oscuridad o magia detectan el aura de cualquier Espectro oculto.',
      },
      {
        title: 'Frasco Oculto de Elethorn',
        badge: 'Hallazgo Alquímico',
        text: 'Investigación CD 12: encuentran una Poción de Fuerza escondida tras un ladrillo flojo.',
        rewardLoot: {
          name: 'Poción de Fuerza',
          type: 'Poción',
          rarity: 'poco_comun',
          dice: '+2 DC Ataque',
          upgrade: 'Acción gratuita: +2 DC en tu próximo ataque.',
          special: '+2 DC Ataque por 1 turno.',
          restriction: 'Todas las clases',
        },
      },
    ],
    corridor: [
      {
        title: 'Sombra de un Asesino del Culto',
        badge: 'Emboscada Silenciosa',
        text: 'Percepción CD 13: detectan un brillo metálico en la oscuridad antes de que un Asesino lance su daga (si fallan, el héroe más atrasado recibe 1 ataque sorpresa de 2 DC).',
      },
    ],
  },
};

// Pool amplio de eventos variados de Mazmorra (Salas y Pasillos) + Generador Combinatorio coherente por Misión
export const GENERIC_DUNGEON_EVENTS = {
  room: [
    {
      title: 'Baldosa Suelta con Compartimento',
      badge: 'Hallazgo Secreto',
      text: 'Al pisar cerca de la pared se escucha un clic hueco. Investigación CD 12: bajo la losa hay una bolsa con 45 MO y una nota vieja sobre una trampa cercana.',
      rewardGold: 45,
    },
    {
      title: 'Bramido en la Oscuridad',
      badge: 'Tensión / Moral',
      text: 'Un aullido helado retumba por los muros. Todos los héroes en la sala tiran Salvación de SAB CD 11: quien falle sufre -1 a su próxima tirada d20; quien supere gana +1 Inspiración por mantener la calma.',
    },
    {
      title: 'Brasero aún Encendido',
      badge: 'Ventaja Táctica',
      text: 'Un brasero de hierro arde con carbones rojos. Un héroe puede gastar 1 acción gratuita para prender su arma en llamas (+1 daño de Fuego en su próximo ataque, quema regeneración) o volcarlo hacia un enemigo (DES CD 12 o 1 PC).',
    },
    {
      title: 'Estatua Agrietada con Gema',
      badge: 'Dilema Riesgo/Recompensa',
      text: 'Una estatua antigua sostiene una gema roja en su ojo. Desarmar Trampas o DES CD 13: si la extraen con cuidado ganan 65 MO; si fallan, un dardo oculto dispara por 1 PC.',
      rewardGold: 65,
    },
    {
      title: 'Esqueleto de un Explorador Imperial',
      badge: 'Equipo Olvidado',
      text: 'Apoyado contra la esquina yace un aventurero caído hace años. Medicina o Investigación CD 11: descubren que murió por veneno y rescatan un Antídoto sellado de su morral.',
      rewardLoot: {
        name: 'Antídoto Imperial',
        type: 'Poción',
        rarity: 'comun',
        dice: 'Cura Debuffs',
        upgrade: 'Acción gratuita: elimina Envenenado, Paralizado y cualquier estado negativo.',
        special: 'Limpia estados negativos.',
        restriction: 'Todas las clases',
      },
    },
    {
      title: 'Muro con Inscripción Rúnica',
      badge: 'Sabiduría Arcana',
      text: 'Símbolos brillantes parpadean en el muro. Arcano CD 12: el lanzador que los descifre recupera +1 PM al instante y descubre si hay enemigos tras la siguiente puerta cerrada.',
    },
    {
      title: 'Cadenas Colgantes del Techo',
      badge: 'Terreno Táctico',
      text: 'Cadenas oxidadas cuelgan a baja altura. Un héroe ágil (Atletismo CD 12) puede balancearse para saltar 3 casillas sin provocar ataques de oportunidad; si falla, hace ruido (+1 Reloj del Caos).',
    },
    {
      title: 'Nido de Ratas Gigantes',
      badge: 'Sorpresa Menor',
      text: 'De entre los escombros saltan ratas hambrientas. Supervivencia o Intimidación CD 11 para ahuyentarlas; si fallan, muerden al héroe más cercano (1 PC) antes de huir por una grieta.',
    },
    {
      title: 'Altar Polvoriento de los Antiguos',
      badge: 'Bendición o Maldición',
      text: 'Un pequeño altar olvidado aún conserva un tenue brillo dorado. Quien rece u ofrende 15 MO tira SAB CD 12: con éxito gana Ventaja en su próximo ataque o salvación.',
    },
    {
      title: 'Barril de Pólvora o Aceite',
      badge: 'Elemento Explosivo',
      text: 'En un rincón hay un barril sellado con olor penetrante. Si alguien lo golpea con Fuego o ataque a distancia, estalla en un área de 3×3 casillas infligiendo 2 DC a todo lo que esté alrededor.',
    },
    {
      title: 'Espejo Empañado',
      badge: 'Visión Fugaz',
      text: 'Un espejo roto refleja brevemente la sala contigua antes de oscurecerse. Percepción CD 12: el DM revela gratis qué monstruos hay en una habitación adyacente sin abrir la puerta.',
    },
    {
      title: 'Botiquín de Campaña Roto',
      badge: 'Suministro Útil',
      text: 'Entre restos de cajas encuentran vendajes limpios y hierbas secas. Medicina CD 11: un héroe puede curar +2 PC a un compañero aquí mismo sin gastar pociones.',
    },
  ],
  corridor: [
    {
      title: 'Corriente de Aire Helado',
      badge: 'Pista de Secreto',
      text: 'Una brisa fina brota de una rendija entre los ladrillos. Percepción o Investigación CD 12: el DM confirma si existe una Puerta Secreta o atajo en este tramo del pasillo.',
    },
    {
      title: 'Techo Inestable',
      badge: 'Peligro de Pasillo',
      text: 'Pequeñas piedras caen del techo agrietado. Si el grupo corre o grita aquí, el último héroe tira Salvación DES CD 12 o recibe 1 PC por escombros.',
    },
    {
      title: 'Huellas Frescas en el Polvo',
      badge: 'Rastreo',
      text: 'Marcas recientes cruzan el suelo. Supervivencia CD 11: determinan el tipo y número aproximado de enemigos que patrullan el sector siguiente (ganan +2 a Iniciativa en el próximo combate).',
    },
    {
      title: 'Reja Semicaída',
      badge: 'Obstáculo Táctico',
      text: 'Una reja oxidada cuelga a media altura. Atletismo CD 12 para levantarla y trabarla (paso libre), o pasar agachados gastando +2 casillas de movimiento.',
    },
    {
      title: 'Bolsa Caída de un Goblin',
      badge: 'Suerte en el Camino',
      text: 'En una esquina oscura brilla una bolsita rota con 30 MO y dados de hueso.',
      rewardGold: 30,
    },
    {
      title: 'Eco de Pasos Cercanos',
      badge: 'Decisión Rápida',
      text: 'Se oyen pisadas acercándose por el cruce. Sigilo grupal CD 12: si se esconden pegados a la pared, dejan pasar a la patrulla sin combatir; si fallan, aparece 1 Monstruo Errante.',
    },
    {
      title: 'Antorcha de Pared con Palanca',
      badge: 'Mecanismo Oculto',
      text: 'Una antorcha está ligeramente torcida. Investigación CD 12: al girarla desactiva una trampa cercana (o abre un nicho con 1 Reactivo Alquímico).',
      rewardLoot: {
        name: 'Reactivo Alquímico',
        type: 'Accesorio',
        rarity: 'comun',
        dice: 'Alquimia',
        upgrade: 'Permite destilar 1 poción gratis en un Banco de Alquimista.',
        special: 'Ingrediente alquímico.',
        restriction: 'Todas las clases',
      },
    },
    {
      title: 'Charco de Agua Estancada',
      badge: 'Terreno Difícil',
      text: 'El pasillo está inundado hasta los tobillos (cuesta 2 casillas de movimiento por paso, salvo Elfos Silvanos). Percepción CD 12: algo metálico brilla en el fondo (25 MO).',
      rewardGold: 25,
    },
  ],
};

// Generador combinatorio coherente con la misión actual (crea variaciones frescas para que nunca se sienta repetitivo)
export function generateDynamicMissionEvent(currentMap, isCorridor, partyLevel = 1) {
  const missionShort = (currentMap?.title || 'la Mazmorra').split(':')[1]?.split('(')[0]?.trim() || 'la Mazmorra';
  const wandering = currentMap?.wanderingMonster || 'Orco';
  const cd = Math.min(16, 11 + Math.floor((partyLevel - 1) / 3));
  const goldAmt = 20 + partyLevel * 12 + Math.floor(Math.random() * 25);

  const roomTemplates = [
    {
      title: `Rastro de ${wandering} en ${missionShort}`,
      badge: 'Pista Dinámica',
      text: `Encuentran armas melladas y marcas frescas de ${wandering}. Supervivencia CD ${cd}: descubren su punto débil y el grupo gana Ventaja en el primer ataque del próximo combate.`,
    },
    {
      title: `Alijo Oculto de ${missionShort}`,
      badge: 'Botín Escondido',
      text: `Detrás de una piedra floja hay un escondite improvisado. Investigación CD ${cd}: recuperan ${goldAmt} MO sin hacer ruido.`,
      rewardGold: goldAmt,
    },
    {
      title: `Eco Mágico de ${currentMap?.expansion || 'Zargon'}`,
      badge: 'Anomalía Arcana',
      text: `El aire vibra con energía antigua. Arcano CD ${cd}: un héroe absorbe la chispa y recupera +1 PM (si falla, las antorchas parpadean y el Reloj del Caos sube +1).`,
    },
    {
      title: `Trampa Improvisada de ${wandering}`,
      badge: 'Alerta Táctica',
      text: `Un cable tenso cruza detrás de la entrada. Percepción o Desarmar Trampas CD ${cd}: si lo desarman obtienen piezas útiles (+${Math.round(goldAmt / 2)} MO); si fallan, el primero recibe 1 PC.`,
      rewardGold: Math.round(goldAmt / 2),
    },
    {
      title: `Susurro de Superviviente`,
      badge: 'Moral y Tensión',
      text: `Un mensaje tallado en la pared advierte sobre los peligros de ${missionShort}. Quien lo lea con Medicina o Persuasión CD ${cd} inspira al grupo (+1 Inspiración a un héroe).`,
    },
  ];

  const corridorTemplates = [
    {
      title: `Cruce Vigilado por ${wandering}`,
      badge: 'Táctica de Pasillo',
      text: `Voces guturales resuenan en el siguiente cruce. Sigilo CD ${cd}: si lo superan, el DM les dice qué hay tras la puerta más cercana sin alertar a nadie.`,
    },
    {
      title: `Escombros de ${missionShort}`,
      badge: 'Obstáculo Rápido',
      text: `Un derrumbe parcial estrecha el corredor. Atletismo CD ${cd} para apartar la roca principal y abrir paso (entre los escombros brillan ${goldAmt} MO).`,
      rewardGold: goldAmt,
    },
    {
      title: `Bruma Fría del Corredor`,
      badge: 'Ambiente Sobrenatural',
      text: `Una neblina baja cubre el suelo. Salvación de SAB CD ${cd}: quien la supere detecta al instante cualquier trampa de foso en los próximos 4 pasos.`,
    },
  ];

  const pool = isCorridor ? corridorTemplates : roomTemplates;
  return pool[Math.floor(Math.random() * pool.length)];
}
