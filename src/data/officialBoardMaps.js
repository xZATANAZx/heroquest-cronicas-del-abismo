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
    title: 'Misión 1: La Prueba',
    expansion: 'Juego Base',
    startRoom: 'R14',
    wanderingMonster: 'Orco',
    hazardRooms: {
      R2: { icon: '💀', name: 'Guardián de Fellmarg (C)', rule: 'La Momia Guardián de la Tumba de Fellmarg tira 4 Dados de Ataque en lugar de 3.' },
      R11: { icon: '🗿', name: 'Cámara de Verag (E)', rule: 'Verag, la Gárgola, aguarda en el salón central junto al cofre de 120 MO.' },
    },
    specialAlert: 'Zargon: No hay Trampas ni Puertas Secretas en esta primera Misión. Deben explorar las catacumbas de Fellmarg y destruir a Verag (Gárgola en R11).',
    notes: [
      { code: 'A', room: 'R16', x: 11, y: 14, title: 'Armería Oxidada (A)', text: 'Las Armas de este estante están astilladas, oxidadas y rotas. No hay nada aquí de valor para los Héroes.' },
      { code: 'B', room: 'R19', x: 17, y: 15, title: 'Cofre Vacío (B)', text: 'Este Cofre del Tesoro está vacío.' },
      { code: 'C', room: 'R2', x: 7, y: 2, title: 'Guardián de la Tumba de Fellmarg (C)', text: 'En vida, un poderoso guerrero; en la muerte, esta Momia es el Guardián de la Tumba de Fellmarg. Puede tirar 4 Dados de Ataque en lugar de 3.' },
      { code: 'D', room: 'R3', x: 11, y: 5, title: 'Cofre de Fellmarg (D)', text: 'El primer Héroe que busque Tesoros encuentra 84 Monedas de Oro en este Cofre.', rewards: [{ label: '84 Monedas de Oro', gold: 84 }] },
      { code: 'E', room: 'R11', x: 10, y: 7, title: 'Cofre de Verag (E)', text: 'El primer Héroe que busque Tesoros encuentra 120 Monedas de Oro en este Cofre. Verag (Gárgola) custodia esta sala.', rewards: [{ label: '120 Monedas de Oro', gold: 120 }] },
    ],
    items: getOfficialBlueprint(1).items,
    darkCells: getOfficialBlueprint(1).darkCells,
  },
  {
    id: 'm2_sir_ragnar',
    questId: 'q2',
    biomeId: 'fortaleza_orca',
    title: 'Misión 2: El Rescate de Sir Ragnar',
    expansion: 'Juego Base',
    startRoom: 'R11',
    wanderingMonster: 'Orco',
    hazardRooms: {
      R13: { icon: '🚨', name: 'Celda de Sir Ragnar (X)', rule: 'Al encontrar a Sir Ragnar suena la alarma: coloca TODOS los monstruos, puertas y muebles restantes; todas las puertas se abren.' },
    },
    specialAlert: '¡ALARMA AL RESCATAR A SIR RAGNAR (X en R13)! Sir Ragnar tiene 2 PC, 2 Def, no ataca y mueve 1 Dado Rojo tras el turno de quien abrió la celda. Debe volver vivo a la escalera (R11) para cobrar 240 MO.',
    notes: [
      { code: 'A', room: 'R12', x: 3, y: 13, title: 'Cofre con Aguja Envenenada (A)', text: 'El Cofre del Tesoro tiene una Trampa con una aguja envenenada. Si un Héroe busca Tesoros antes de desactivar la Trampa, pierde 1 Punto Corporal. El Cofre está vacío.' },
      {
        code: 'B',
        room: 'R9',
        x: 20,
        y: 8,
        title: 'Cofre de la Guardia (B)',
        text: 'El primer Héroe que busque Tesoros en la Habitación encontrará 60 Monedas de Oro dentro de este Cofre y una Poción Curativa (+4 PC).',
        rewards: [
          { label: '60 Monedas de Oro', gold: 60 },
          {
            label: 'Poción Curativa (+4 PC)',
            loot: {
              name: 'Poción Curativa',
              type: 'Poción',
              rarity: 'poco_comun',
              dice: '+4 PC',
              upgrade: 'Restaura hasta 4 Puntos Corporales al beberla.',
              special: 'Restaura 4 PC.',
              restriction: 'Todas las clases',
            },
          },
        ],
      },
      { code: 'X', room: 'R13', x: 5, y: 11, title: 'Sir Ragnar (Celda X)', text: 'Usa la Figura del Hechicero del Terror para Sir Ragnar (2 PC, 2 Def, no ataca, mueve 1 Dado Rojo). Suena la alarma y se abren todas las puertas. No se puede buscar tesoros en la celda.' },
    ],
    items: getOfficialBlueprint(2).items,
    darkCells: getOfficialBlueprint(2).darkCells,
  },
  {
    id: 'm3_caudillo_orco',
    questId: 'q3',
    biomeId: 'fortaleza_orca',
    title: 'Misión 3: La Guarida del Caudillo Orco',
    expansion: 'Juego Base',
    startRoom: 'R3',
    wanderingMonster: 'Orco',
    hazardRooms: {
      R15: { icon: '⚔️', name: 'Salón de Ulag', rule: 'Ulag, el Caudillo Orco: Mov 10, Atq 4, Def 5, Cuerpo 2, Mente 3. Recompensa: 180 MO a repartir.' },
    },
    specialAlert: 'El Príncipe Magnus ofrece 180 MO a repartir por eliminar a Ulag (en R15: Mov 10, Atq 4, Def 5, PC 2, PM 3).',
    notes: [
      {
        code: 'A',
        room: 'R1',
        x: 3,
        y: 3,
        title: 'Armería de los Orcos (A)',
        text: 'El primer Héroe que busque Tesoros encuentra un Bastón (Armería de los Héroes) que puede quedarse o dar a otro Héroe.',
        rewards: [
          {
            label: 'Bastón (Armería)',
            loot: {
              name: 'Bastón',
              type: 'Arma',
              rarity: 'comun',
              dice: '1 DC (Diagonal)',
              upgrade: 'Permite atacar en diagonal. Apto para el Mago y todas las clases.',
              special: 'Ataque en diagonal.',
              restriction: 'Todas las clases',
            },
          },
        ],
      },
      {
        code: 'B',
        room: 'R12',
        x: 2,
        y: 10,
        title: 'Alacena del Cuartel (B)',
        text: 'El primer Héroe que busque Tesoros en la Habitación encontrará 24 Monedas de Oro y una Poción Curativa (+4 PC) en la alacena.',
        rewards: [
          { label: '24 Monedas de Oro', gold: 24 },
          {
            label: 'Poción Curativa (+4 PC)',
            loot: {
              name: 'Poción Curativa',
              type: 'Poción',
              rarity: 'poco_comun',
              dice: '+4 PC',
              upgrade: 'Restaura hasta 4 Puntos Corporales al beberla.',
              special: 'Restaura 4 PC.',
              restriction: 'Todas las clases',
            },
          },
        ],
      },
      { code: 'UL', room: 'R15', x: 7, y: 14, title: 'Ulag, Caudillo Orco', text: 'Orco con Espada Larga. Estadísticas oficiales: Mov 10, Atq 4, Def 5, Cuerpo 2, Mente 3.' },
    ],
    items: getOfficialBlueprint(3).items,
    darkCells: getOfficialBlueprint(3).darkCells,
  },
  {
    id: 'm4_oro_magnus',
    questId: 'q4',
    biomeId: 'fortaleza_orca',
    title: 'Misión 4: El Oro del Príncipe Magnus',
    expansion: 'Juego Base',
    startRoom: 'R20',
    wanderingMonster: 'Abominación',
    hazardRooms: {
      R11: { icon: '💰', name: 'Bóveda de Gulthor (A)', rule: 'Aquí están los 3 Cofres Reales (1 cofre por héroe, mueve solo 1 Dado Rojo). No pueden quedarse con el oro.' },
    },
    specialAlert: 'Recuperen los 3 Cofres del sello real en R11 (custodiados por Gulthor, Guerrero del Terror) y devuélvanlos a las escaleras (R20) por 240 MO de recompensa.',
    notes: [
      { code: 'A', room: 'R11', x: 10, y: 11, title: 'Los Tres Cofres Reales y Gulthor (A)', text: 'Los 3 Cofres están marcados con el sello real (250 MO c/u, no pueden quedárselo). Un Héroe solo transporta 1 Cofre a la vez y tira 1 Dado Rojo para moverse. Recompensa al devolverlos: 240 MO.' },
    ],
    items: getOfficialBlueprint(4).items,
    darkCells: getOfficialBlueprint(4).darkCells,
  },
  {
    id: 'm5_laberinto_melar',
    questId: 'q5',
    biomeId: 'cripta_espectral',
    title: 'Misión 5: El Laberinto de Melar',
    expansion: 'Juego Base',
    startRoom: 'R1',
    wanderingMonster: 'Zombi',
    hazardRooms: {
      R12: { icon: '🗿', name: 'Estatua Gárgola (B)', rule: 'La Gárgola es invulnerable hasta que alguien abra la puerta siguiente y ella mueva o ataque.' },
    },
    specialAlert: 'Encuentren el Talismán de la Sabiduría en el laboratorio de Melar (D en R11). ¡Busquen Tesoros en E (R4) para hallar la Llave de Melar que desliza el Trono!',
    notes: [
      { code: 'A', room: 'R5', x: 8, y: 5, title: 'Banco de Alquimista (A)', text: 'El primer Héroe que busque Tesoros encuentra un frasco medio lleno: Poción Curativa (+2 PC).' },
      { code: 'B', room: 'R12', x: 4, y: 11, title: 'Gárgola Estatua (B)', text: 'Parece una estatua de piedra inerte e invulnerable. Cobra vida cuando un Héroe abre la puerta hacia la siguiente habitación.' },
      { code: 'C', room: 'R14', x: 2, y: 16, title: 'Cofre con Gas Tóxico (C)', text: 'Trampa de gas tóxico (-2 PC si buscan tesoros antes de desactivarla). Contiene 144 Monedas de Oro.', rewards: [{ label: '144 Monedas de Oro', gold: 144 }] },
      { code: 'D', room: 'R11', x: 10, y: 9, title: 'Talismán de la Sabiduría (D)', text: 'El primer Héroe que busque Tesoros encuentra el Artefacto Mágico Talismán de la Sabiduría.' },
      { code: 'E', room: 'R4', x: 3, y: 7, title: 'La Llave de Melar y el Trono (E)', text: 'Buscar Puertas Secretas no halla nada. ¡Si un Héroe busca Tesoros encuentra la Llave de Melar: el Trono se desliza revelando una Puerta Secreta!' },
    ],
    items: getOfficialBlueprint(5).items,
    darkCells: getOfficialBlueprint(5).darkCells,
  },
  {
    id: 'm6_legado_orco',
    questId: 'q6',
    biomeId: 'fortaleza_orca',
    title: 'Misión 6: El Legado del Caudillo Orco',
    expansion: 'Juego Base',
    startRoom: 'R13',
    wanderingMonster: 'Abominación',
    hazardRooms: {
      R13: { icon: '⛓️', name: 'CELDA (Inicio Sin Equipo)', rule: 'Empiezan aquí sin armas, armadura ni hechizos (1 Dado Ataque, 2 Defensa). No se puede buscar tesoros en la Celda.' },
    },
    specialAlert: '¡SIN EQUIPO! Empiezan en la CELDA (R13). Recuperen sus pertenencias en el Armario de A (R1), venzan a Grak (R15) y escapen por la escalera B.',
    notes: [
      { code: 'A', room: 'R1', x: 1, y: 3, title: 'Armario con el Equipo Confiscado (A)', text: 'Al buscar Tesoros hallan todo su Equipo. Cada Héroe debe entrar a esta sala para recuperar sus pertenencias y volver a lanzar Hechizos.' },
      { code: 'B', room: 'R15', x: 7, y: 13, title: 'Escalera de Salida y Grak (B)', text: 'Grak (Orco con Bastón y Capa de Archimago): Mov 8, Atq 4, Def 4, Cuerpo 3, Mente 3. Hechizos: Miedo, Dormir y Tempestad. Cualquier Héroe que llegue a la escalera escapa.' },
    ],
    items: getOfficialBlueprint(6).items,
    darkCells: getOfficialBlueprint(6).darkCells,
  },
  {
    id: 'm7_mago_perdido',
    questId: 'q7',
    biomeId: 'laboratorio_alquimico',
    title: 'Misión 7: El Mago Perdido',
    expansion: 'Juego Base',
    startRoom: 'R5',
    wanderingMonster: 'Momia',
    hazardRooms: {
      R19: { icon: '🧟', name: 'Laboratorio de Wardoz (D)', rule: 'El Zombi con Túnica de Mago es Wardoz. Su cofre tiene 144 MO y sus papeles revelan que la Magia del Terror lo consumió.' },
    },
    specialAlert: 'Descubran qué pasó con Wardoz (D en R19) y vuelvan a las escaleras (R5) para cobrar 100 MO por héroe. Todos los Guerreros del Terror (A) son de piedra (+1 Def).',
    notes: [
      { code: 'A', room: 'CORRIDOR', x: 10, y: 6, title: 'Guerreros del Terror de Piedra (A)', text: 'Los 4 Guerreros del Terror en los pasillos centrales son de piedra y tiran 1 Dado de Defensa adicional.' },
      { code: 'B', room: 'R21', x: 24, y: 17, title: 'Sala de Armas — Armadura de Borin (B)', text: 'El primer Héroe que busque Tesoros encuentra el Artefacto Mágico Armadura de Borin.' },
      { code: 'C', room: 'R15', x: 8, y: 13, title: 'Cofre Venenoso y Líquido Púrpura (C)', text: 'Aguja envenenada (-2 PC). Contiene un frasco púrpura: quien lo beba se vuelve estatua de piedra 5 turnos (inmóvil pero invulnerable).' },
      { code: 'D', room: 'R19', x: 15, y: 17, title: 'Wardoz y su Cofre (D)', text: 'El Zombi con Túnica de Mago es Wardoz. Tras destruirlo, su cofre contiene 144 MO y papeles sobre su corrupción.', rewards: [{ label: '144 Monedas de Oro', gold: 144 }] },
    ],
    items: getOfficialBlueprint(7).items,
    darkCells: getOfficialBlueprint(7).darkCells,
  },
  {
    id: 'm8_mago_fuego',
    questId: 'q8',
    biomeId: 'abismo_caos',
    title: 'Misión 8: La Magia de Fuego',
    expansion: 'Juego Base',
    startRoom: 'R10',
    wanderingMonster: 'Abominación',
    hazardRooms: {
      R1: { icon: '🔥', name: 'Guarida de Balur (X)', rule: 'Balur (Mov 8, Atq 2, Def 5, PC 3, PM 7) es inmune a Fuego. Huida Fugaz lo teletransporta a XX (R11).' },
    },
    specialAlert: 'Su Majestad paga 100 MO a cada héroe por destruir a Balur (X en R1). Inmune a Fuego; conoce Bola en Llamas, Tormenta de Fuego, Tempestad, Invocar Orcos, Miedo y Huida Fugaz (hacia XX en R11).',
    notes: [
      { code: 'A', room: 'R18', x: 21, y: 10, title: 'Cofre de la Varita de Celeridad (A)', text: 'El Cofre del Tesoro contiene 150 Monedas de Oro y el Artefacto Varita de Celeridad.', rewards: [{ label: '150 Monedas de Oro', gold: 150 }] },
      { code: 'X', room: 'R1', x: 2, y: 3, title: 'Balur, el Mago del Fuego (X)', text: 'Figura Hechicero del Terror. Mov 8, Atq 2, Def 5, Cuerpo 3, Mente 7. Inmune a Fuego. Si usa Huida Fugaz, salta a XX (R11).' },
      { code: 'XX', room: 'R11', x: 12, y: 9, title: 'Destino de Huida Fugaz (XX)', text: 'Si Balur lanza Huida Fugaz se teletransporta aquí (no lo coloques hasta que abran la puerta de R11).' },
    ],
    items: getOfficialBlueprint(8).items,
    darkCells: getOfficialBlueprint(8).darkCells,
  },
  {
    id: 'm9_carrera_tiempo',
    questId: 'q9',
    biomeId: 'catacumbas',
    title: 'Misión 9: La Carrera Contra el Tiempo',
    expansion: 'Juego Base',
    startRoom: 'R20',
    wanderingMonster: 'Abominación',
    hazardRooms: {
      R13b: { icon: '☠️', name: 'Cofre de Gas Tóxico (C)', rule: 'Buscar tesoro antes de desactivar la trampa quita 3 PC. Contiene el Elixir de Vida.' },
    },
    specialAlert: 'Un guía traidor los ha encerrado en A (R20). ¡Deben escapar y llegar vivos a la escalera en R5!',
    notes: [
      { code: 'A', room: 'R20', x: 19, y: 16, title: 'Inicio de los Héroes (A)', text: 'Esta es la Habitación donde los Héroes comienzan su Misión (sin escaleras).' },
      { code: 'B', room: 'R13', x: 6, y: 11, title: 'Dos Cofres del Tesoro (B)', text: 'Cada uno de estos Cofres del Tesoro contiene 100 Monedas de Oro (200 MO en total).', rewards: [{ label: '200 Monedas de Oro (2 cofres)', gold: 200 }] },
      { code: 'C', room: 'R13b', x: 8, y: 10, title: 'Cofre del Elixir de Vida (C)', text: 'Trampa con gas tóxico (-3 PC si no se desactiva). Dentro está el Artefacto Elixir de Vida.' },
    ],
    items: getOfficialBlueprint(9).items,
    darkCells: getOfficialBlueprint(9).darkCells,
  },
  {
    id: 'm10_castillo_misterio',
    questId: 'q10',
    biomeId: 'cripta_espectral',
    title: 'Misión 10: El Castillo Misterioso',
    expansion: 'Juego Base',
    startRoom: 'R14',
    wanderingMonster: 'El Fantasma de Ollar (ríe y desaparece)',
    hazardRooms: {
      R6: { icon: '✨', name: 'Entrada a la Mina de Ollar (B)', rule: '5.000 MO falsas: quien las lleve no puede atacar ni defenderse, y al final resultan no tener valor.' },
    },
    specialAlert: 'PUERTAS TELETRANSPORTADORAS: Al cruzar una puerta, para y tira 2 Dados Rojos → teletransporta a la casilla con ese número (2/12=R14, 3=R3, 4=R4, 5=R13, 6=R16, 7=R11, 8=R6, 9=R19, 10=R18, 11=R8). Solo 1 puerta por turno.',
    notes: [
      { code: 'A', room: 'R18', x: 23, y: 11, title: 'Anillo del Retorno (A)', text: 'Si ambos Guerreros del Terror son derrotados, el primer Héroe que busque Tesoros encuentra el Artefacto Anillo del Retorno.' },
      { code: 'B', room: 'R6', x: 15, y: 4, title: 'Entrada a la Mina de Oro (B)', text: 'Cualquier jugador puede coger 5.000 MO, pero no podrá atacar ni defenderse mientras las lleve. ¡Al terminar la misión el oro resulta ser falso!' },
    ],
    items: getOfficialBlueprint(10).items,
    darkCells: getOfficialBlueprint(10).darkCells,
  },
  {
    id: 'm11_bastion_caos',
    questId: 'q11',
    biomeId: 'fortaleza_orca',
    title: 'Misión 11: El Bastión del Terror',
    expansion: 'Juego Base',
    startRoom: 'R13b',
    wanderingMonster: 'Abominación',
    hazardRooms: {
      R13: { icon: '🗿', name: 'Gárgola y Cofre Trampa (B)', rule: 'Si buscan tesoros antes de desactivar el cofre, la Gárgola (invulnerable hasta mover/atacar) cobra vida inmediatamente.' },
    },
    specialAlert: 'RECOMPENSAS POR CABEZA: 10 MO/Goblin, 20 MO/Orco, 30 MO/Abominación, 50 MO/Guerrero del Terror. Empiezan en R13b.',
    notes: [
      { code: 'A', room: 'R20', x: 19, y: 14, title: 'Armería del Bastión (A)', text: 'El primer Héroe que busque Tesoros encontrará un Escudo (Armería). El resto de armas es inservible.' },
      { code: 'B', room: 'R13', x: 6, y: 11, title: 'Estatua Gárgola y Cofre Trampa (B)', text: 'El Cofre es una Trampa que despierta a la Gárgola (invulnerable hasta que mueva o ataque).' },
      { code: 'C', room: 'R11', x: 15, y: 10, title: 'Guerrero del Terror con Azote de Orcos (C)', text: 'Este Guerrero del Terror porta la Espada Mágica Azote de Orcos. Quien lo mate se la queda.' },
    ],
    items: getOfficialBlueprint(11).items,
    darkCells: getOfficialBlueprint(11).darkCells,
  },
  {
    id: 'm12_barak_tor_tumulo',
    questId: 'q12',
    biomeId: 'cripta_espectral',
    title: 'Misión 12: Barak Tor: La Tumba del Señor de los Brujos',
    expansion: 'Juego Base',
    startRoom: 'R14',
    wanderingMonster: 'Esqueleto',
    hazardRooms: {
      R12: { icon: '💀', name: 'Tumba del Señor de los Brujos (D/X)', rule: '¡INMORTAL AQUÍ! Ningún arma o hechizo lo daña (solo el Filo del Espíritu de M13). Mov 1, Atq 2, 4 hechizos.' },
    },
    specialAlert: 'Recuperen la Estrella de Occidente (en la mano del Zombi B en R11) por 200 MO. Al entrar a D (R12) despierta el Señor de los Brujos (invulnerable — ¡HUYAN!).',
    notes: [
      { code: 'A', room: 'R7', x: 18, y: 1, title: 'Puertas Falsas (A)', text: 'Las 3 puertas marcadas con A en el ala noreste son puertas falsas y no se pueden abrir.' },
      { code: 'B', room: 'R11', x: 11, y: 10, title: 'La Estrella de Occidente (B)', text: 'La Estrella de Occidente está en la mano del Zombi de la Gran Sala Central.' },
      { code: 'C', room: 'CORRIDOR', x: 1, y: 0, title: 'Trampa Especial de Bloque Movedizo (C)', text: 'Se derrumba automáticamente después de que pase el último Héroe, bloqueando para siempre el camino de vuelta.' },
      { code: 'D', room: 'R12', x: 1, y: 13, title: 'Tumba del Señor de los Brujos (D / X)', text: 'Al entrar, el Señor de los Brujos despierta (invulnerable; Mov 1, Atq 2; hechizos: Invocar Muertos Vivientes, Miedo, Dominación, Bola en Llamas).' },
      { code: 'E', room: 'R15', x: 5, y: 17, title: 'Báculo Mágico (E)', text: 'El primer Héroe que busque Tesoros encuentra el Artefacto Báculo Mágico escondido detrás de la librería.' },
    ],
    items: getOfficialBlueprint(12).items,
    darkCells: getOfficialBlueprint(12).darkCells,
  },
  {
    id: 'm13_hoja_espiritual',
    questId: 'q13',
    biomeId: 'forja_enana',
    title: 'Misión 13: En Busca del Filo del Espíritu',
    expansion: 'Juego Base',
    startRoom: 'R11',
    wanderingMonster: 'Guerrero del Terror',
    hazardRooms: {
      R21: { icon: '🗡️', name: 'Santuario del Filo del Espíritu (A)', rule: 'Aquí reposa el Filo del Espíritu, la única arma capaz de dañar al Señor de los Brujos.' },
    },
    specialAlert: 'REGLA DE BLOQUES MOVEDIZOS: Quien caiga en uno tira 1 Dado Rojo (4–6 = -1 PC; con Yelmo solo 6 = -1 PC). No bloquean el paso ni afectan a monstruos.',
    notes: [
      { code: 'A', room: 'R21', x: 23, y: 15, title: 'El Filo del Espíritu (A)', text: 'El primer Héroe que busque Tesoros encuentra el Artefacto Mágico Filo del Espíritu.' },
      { code: 'B', room: 'R13', x: 6, y: 11, title: 'Cofre del Tesoro (B)', text: 'El Cofre del Tesoro contiene 200 Monedas de Oro.', rewards: [{ label: '200 Monedas de Oro', gold: 200 }] },
    ],
    items: getOfficialBlueprint(13).items,
    darkCells: getOfficialBlueprint(13).darkCells,
  },
  {
    id: 'm14_barak_tor',
    questId: 'q14',
    biomeId: 'cripta_espectral',
    title: 'Misión 14: Retorno a Barak Tor',
    expansion: 'Juego Base (Clímax)',
    startRoom: 'R14',
    wanderingMonster: 'Momia',
    hazardRooms: {
      R8: { icon: '👑', name: 'Salón del Señor de los Brujos (X)', rule: 'Mov 10, Atq 5, Def 6, Cuerpo 4, Mente 6. SOLO el Filo del Espíritu puede dañarlo.' },
    },
    specialAlert: 'GRAN FINAL DEL JUEGO BASE: El Señor de los Brujos está fortalecido en R8 (X). Solo el Filo del Espíritu puede herirlo. Al vencerlo suelta el Anillo de Hechizos y todos reciben el título de "Campeón".',
    notes: [
      { code: 'A', room: 'R12', x: 3, y: 10, title: 'Tumba Vacía (A)', text: 'La Tumba del Señor de los Brujos está vacía.' },
      { code: 'X', room: 'R8', x: 23, y: 3, title: 'El Señor de los Brujos (X)', text: 'Mov 10, Atq 5, Def 6, Cuerpo 4, Mente 6. Solo el Filo del Espíritu lo daña. Hechizos: Invocar Muertos Vivientes, Miedo (×2), Bola en Llamas, Dominación y Tempestad. Al caer suelta el Anillo de Hechizos.' },
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
