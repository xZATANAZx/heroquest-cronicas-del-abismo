// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// "EL ARQUITECTO DEL ABISMO" — Motor Procedural de Misiones, Arcos, Biomas,
// Salas de Peligro, Mazo de Pistas, Puertas Tácticas y Contadores de Zargon
// ============================================================================

import { HQ_ROOMS, PIECE_TYPES, getRoomAt } from './officialBoardMaps';
import { OFFICIAL_BLUEPRINTS } from './officialBlueprints';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================================================
// 1. BIOMAS TEMÁTICOS (Cambian reglas reales, monstruos y drops de materiales)
// ============================================================================
export const PROCEDURAL_BIOMES = [
  {
    id: 'catacumbas',
    name: 'Catacumbas Malditas',
    icon: '⚰️',
    badgeColor: 'bg-purple-950/60 border-purple-700/60 text-purple-200',
    globalRule:
      'Frío Sepulcral: Los No Muertos ganan +1 DC de Defensa junto a Tumbas. Las armas de Fuego o Plata Sagrada ignoran este bono.',
    monsterPool: ['skeleton', 'zombie', 'mummy', 'specter'],
    bossPool: ['sorcerer', 'gargoyle'],
    wandering: 'Esqueleto o Momia',
    materialSource: 'no_muertos',
    furniturePool: ['tomb', 'chest', 'bookcase', 'sorcerer_table', 'table'],
    ambientFlavor: 'El aire huele a cera rancia y polvo de siglos; cada paso resuena entre sarcófagos entreabiertos.',
  },
  {
    id: 'fortaleza_orca',
    name: 'Fortaleza Orca y Goblin',
    icon: '🪓',
    badgeColor: 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200',
    globalRule:
      'Trampas Sucias: Las trampas mecánicas tienen +1 CD, pero al desarmarlas siempre otorgan +1 Chatarra de Acero o Pólvora Negra.',
    monsterPool: ['goblin', 'orc', 'abomination'],
    bossPool: ['dread_warrior', 'gargoyle'],
    wandering: 'Orco o Goblin',
    materialSource: 'pieles_verdes',
    furniturePool: ['weapon_rack', 'table', 'fireplace', 'chest', 'torture_rack'],
    ambientFlavor: 'Humo de hogueras, olor a hierro mal forjado y risas guturales retumban detrás de puertas reforzadas.',
  },
  {
    id: 'abismo_caos',
    name: 'Bastión del Caos y Lava',
    icon: '🔥',
    badgeColor: 'bg-red-950/60 border-red-700/60 text-red-200',
    globalRule:
      'Calor Abrasador: Los Guerreros del Terror ganan +1 DC de Ataque. Al sacar 1 Natural, el Reloj del Caos sube +2 en vez de +1.',
    monsterPool: ['dread_warrior', 'orc', 'abomination', 'gargoyle'],
    bossPool: ['gargoyle', 'sorcerer'],
    wandering: 'Guerrero del Terror',
    materialSource: 'caos',
    furniturePool: ['throne', 'sorcerer_table', 'fireplace', 'weapon_rack', 'chest'],
    ambientFlavor: 'Grietas incandescentes iluminan muros de obsidiana cubiertos de estandartes negros de Zargon.',
  },
  {
    id: 'cripta_espectral',
    name: 'Cripta de la Luna Espectral',
    icon: '👻',
    badgeColor: 'bg-cyan-950/60 border-cyan-700/60 text-cyan-200',
    globalRule:
      'Velo Etéreo: La niebla reduce la Línea de Visión a 6 casillas. Los Espectros y ataques a PM son frecuentes; el Aceite de Plata brilla aquí.',
    monsterPool: ['specter', 'skeleton', 'assassin', 'mummy'],
    bossPool: ['sorcerer', 'specter'],
    wandering: 'Espectro Etéreo',
    materialSource: 'espiritus',
    furniturePool: ['alchemy_bench', 'bookcase', 'tomb', 'sorcerer_table', 'chest'],
    ambientFlavor: 'Una neblina azulada lame el suelo y susurra los nombres de los héroes desde el otro lado de los muros.',
  },
  {
    id: 'cavernas_hielo',
    name: 'Cavernas de Hielo Ártico',
    icon: '❄️',
    badgeColor: 'bg-sky-950/60 border-sky-700/60 text-sky-200',
    globalRule:
      'Suelo Helado: Correr más de 6 casillas en combate pide Atletismo CD 11 o caes Derribado. El Fuego (hechizos/Fuego Griego) hace +1 DC.',
    monsterPool: ['abomination', 'dread_warrior', 'goblin', 'skeleton'],
    bossPool: ['gargoyle', 'dread_warrior'],
    wandering: 'Abominación Ártica',
    materialSource: 'caos',
    furniturePool: ['chest', 'table', 'fireplace', 'weapon_rack', 'cupboard'],
    ambientFlavor: 'Estalactitas de hielo cuelgan del techo y el aliento se congela al instante en la penumbra azul.',
  },
  {
    id: 'laboratorio_alquimico',
    name: 'Laboratorio Alquímico Olvidado',
    icon: '⚗️',
    badgeColor: 'bg-teal-950/60 border-teal-700/60 text-teal-200',
    globalRule:
      'Gases Volátiles: Usar Fuego o Bombas en salas con Banco de Alquimista provoca una chispa extra (+1 DC en 2×2). ¡Doble drop de ingredientes!',
    monsterPool: ['goblin', 'assassin', 'zombie', 'mimic'],
    bossPool: ['sorcerer', 'abomination'],
    wandering: 'Asesino o Mímico',
    materialSource: 'mueble_alquimia',
    furniturePool: ['alchemy_bench', 'bookcase', 'cupboard', 'table', 'chest'],
    ambientFlavor: 'Frascos burbujeantes, manchas ácidas y mesas cubiertas de pergaminos quemados llenan cada estancia.',
  },
];

// ============================================================================
// 2. TRAMAS DE MISIÓN, GIROS Y OBJETIVOS SECUNDARIOS (FICHAS DE REPUTACIÓN)
// ============================================================================
export const QUEST_PLOTS = [
  {
    id: 'rescate',
    name: 'Rescate en la Oscuridad',
    icon: '⛓️',
    objective: 'Localizar al prisionero (NPC), liberarlo y escoltarlo con vida de vuelta a las escaleras.',
    climaxRule: 'Al liberar al prisionero se activa la Horda Post-Objetivo: aparece 1 patrulla en los pasillos para cortar la retirada.',
  },
  {
    id: 'recuperacion',
    name: 'Recuperación de Reliquia',
    icon: '👑',
    objective: 'Encontrar la reliquia custodiada en la Gran Sala Central (R11) y derrotar a su guardián.',
    climaxRule: 'El cofre principal está protegido por un Sello Arcano o un Mímico oculto hasta vencer al Jefe.',
  },
  {
    id: 'contrarreloj',
    name: 'Carrera contra el Ritual',
    icon: '⏳',
    objective: 'Detener el ritual antes de que el Reloj del Caos llegue a 10 por segunda vez destruyendo el Altar del Jefe.',
    climaxRule: 'Cada 2 rondas completas el Reloj del Caos sube +1 automáticamente por los cánticos del ritual.',
  },
  {
    id: 'exploracion',
    name: 'Sellado de Brechas',
    icon: '🧭',
    objective: 'Explorar 3 salas clave del complejo para sellar runas/grietas (Arcano o Atletismo CD 13) antes de enfrentar al Jefe.',
    climaxRule: 'Cada brecha sellada debilita al Jefe Final (-1 PC y -1 DC de Defensa).',
  },
  {
    id: 'venganza',
    name: 'Caza de Némesis',
    icon: '💀',
    objective: 'Rastrear al comandante enemigo hasta su trono y acabar con su reinado de terror (o impedir que vuelva a escapar).',
    climaxRule: 'El Jefe tiene Fase 2 garantizada al llegar al 50% de PC.',
  },
  {
    id: 'defensa_oleadas',
    name: 'Defender el Bastión / Caravana (5 Oleadas)',
    icon: '🛡️',
    objective: 'Resistir en la Gran Sala Central (R11) durante 5 oleadas progresivas usando mesas volcadas, cepos, bombas y puertas atrancadas hasta vencer al Comandante en la Oleada 5.',
    climaxRule: 'Oleada 1–2: Exploradores y hostigadores · Oleada 3–4: Élite y flanqueo por 2 puertas · Oleada 5: Llega el Comandante con Fase 2.',
  },
];

export const QUEST_TWISTS = [
  'Traición en la Sombra: El primer NPC o prisionero encontrado tiene información falsa o es un espía hasta superar Perspicacia CD 13.',
  'Horda Post-Objetivo: En cuanto completen el objetivo principal, suenan cuernos de alarma y aparecen 2 enemigos bloqueando el camino a las escaleras.',
  'Fase 2 del Jefe: Al bajar al 50% de sus PC, el Jefe se enfurece (+1 DC Ataque, recupera 2 PC y empuja a todos los adyacentes 1 casilla).',
  'Cámara Sellada por Puzzle: La puerta de la Sala Central exige resolver un Puzzle interactivo enviado al celular o forzarla con +2 al Reloj del Caos.',
  'Escape del Némesis: Si el Jefe queda con 2 PC o menos y tiene ruta libre, intenta huir hacia el siguiente capítulo como Némesis recurrente.',
  'Tesoro Maldito: El cofre final contiene +100 MO extra, pero al abrirlo libera 1 Espectro o dispara un Evento del Caos.',
];

export const SIDE_OBJECTIVES = [
  {
    title: 'Rescatar al Explorador Perdido',
    desc: 'Encuentra al NPC oculto en una sala lateral y dale 1 Poción o escolta segura.',
    reward: '+1 Ficha de Reputación y +1 Fama',
  },
  {
    title: 'Recolectar 3 Materiales Raros',
    desc: 'Examina al menos 3 muebles o desarma 2 trampas para recuperar suministros del Gremio.',
    reward: '+1 Ficha de Reputación y +40 MO',
  },
  {
    title: 'Sin Activar el Reloj del Caos',
    desc: 'Completa la misión sin que el Reloj del Caos llegue a 10 ninguna vez.',
    reward: '+1 Ficha de Reputación y +1 Material Raro a todos',
  },
  {
    title: 'Destruir el Estandarte Profano',
    desc: 'Quema o derriba el Altar / Trono de una sala lateral antes de abrir la Sala del Jefe.',
    reward: '+1 Ficha de Reputación y -1 DC al Jefe',
  },
];

// ============================================================================
// 3. SALAS DE PELIGRO (Hazard Rooms — Advanced HeroQuest Enhanced)
// ============================================================================
export const HAZARD_ROOMS = [
  {
    id: 'haz_gas',
    name: 'Cámara de Gas Tóxico',
    icon: '☠️',
    rule: 'Al terminar tu turno dentro de esta sala, supera CON CD 12 o pierdes 1 PC y quedas Envenenado. Contiene 1 Glándula de Veneno extra.',
  },
  {
    id: 'haz_inundada',
    name: 'Sala Inundada',
    icon: '🌊',
    rule: 'El agua hasta la cintura reduce el movimiento a la mitad y da Desventaja en ataques con fuego/pólvora. Oculta +30 MO sumergidos (Percepción CD 12).',
  },
  {
    id: 'haz_hongos',
    name: 'Bosque de Hongos Luminiscentes',
    icon: '🍄',
    rule: 'Esporas alucinógenas: al entrar, supera SAB CD 12 o pierdes 1 PM. Recolectar (Naturaleza/Supervivencia CD 11) da 2 Hierbas Lunares.',
  },
  {
    id: 'haz_inestable',
    name: 'Techo Inestable',
    icon: '🪨',
    rule: 'Cualquier ataque con 3+ calaveras o explosión hace caer piedras (DES CD 13 o 2 PC de daño).',
  },
  {
    id: 'haz_runas',
    name: 'Suelo de Runas Arcanas',
    icon: '⚡',
    rule: 'Los hechizos lanzados aquí ganan +1 DC, pero cualquier 1 Natural descarga un rayo (1 PC a todos en la sala). Contiene 1 Polvo Rúnico.',
  },
  {
    id: 'haz_telaranas',
    name: 'Nido de Telarañas Gigantes',
    icon: '🕸️',
    rule: 'Terreno difícil (-2 Mov). Al entrar supera FUE o DES CD 12 o quedas inmovilizado hasta gastar tu acción para liberarte.',
  },
  {
    id: 'haz_bruma',
    name: 'Bruma Psíquica',
    icon: '🌫️',
    rule: 'La Línea de Visión dentro de la sala es máximo 3 casillas. Los ataques sorpresa ganan Ventaja (+1 repetición de DC).',
  },
  {
    id: 'haz_braseros',
    name: 'Braseros Volcánicos',
    icon: '🔥',
    rule: 'Empujar a un enemigo contra una pared/brasero aquí inflige +1 PC de daño de fuego automático.',
  },
];

// ============================================================================
// 4. MAZO DE PISTAS (Hint Deck — Decisiones reales en bifurcaciones)
// ============================================================================
const ROOM_HINT_TEMPLATES = [
  {
    title: 'Huellas Recientes junto a la Puerta',
    clue: 'Marcas frescas de botas y garras cruzan el polvo de esta cámara hacia el siguiente acceso.',
    reward: 'Supervivencia CD 11: sorprenden a la siguiente sala (ganan +2 a Iniciativa y Ventaja en el primer ataque).',
    consequence: 'Si avanzan haciendo ruido, los guardias pasan a estado ALERTA.',
  },
  {
    title: 'Susurros tras el Muro',
    clue: 'Escuchan voces discutiendo sobre un cofre con trampa y una llave escondida en un mueble cercano.',
    reward: 'El grupo obtiene Ventaja al desarmar la próxima trampa o detectar si un cofre es un Mímico.',
    consequence: 'Detenerse demasiado tiempo sube +1 el Reloj del Caos.',
  },
  {
    title: 'Marca Secreta del Gremio',
    clue: 'Un símbolo tallado a ras del suelo advierte sobre un mecanismo oculto en esta sala.',
    reward: 'El DM confirma gratis si hay alguna Puerta Secreta o trampa en este sector sin gastar acción.',
    consequence: 'Ninguna — recompensa pura por observar el entorno.',
  },
  {
    title: 'Rastro de Hierbas y Frascos Rotos',
    clue: 'Un explorador anterior dejó caer un frasco roto junto a la pared de esta habitación.',
    reward: 'Investigación CD 11: recuperan +1 Hierba Lunar o +1 Polvo Rúnico gratis.',
    consequence: 'Sin guantes (DES CD 11) el vidrio corta por 1 PC.',
  },
  {
    title: 'Aroma a Pólvora y Aceite',
    clue: 'El olor a aceite de armas delata un escondite improvisado detrás de los muebles.',
    reward: 'Percepción CD 12: +1 Pólvora Negra o +1 Acero Templado al examinar el próximo mueble.',
    consequence: 'Usar fuego descuidadamente aquí provoca una chispa (DES CD 12 o 1 PC).',
  },
];

const CORRIDOR_HINT_TEMPLATES = [
  {
    title: 'Corriente de Aire en el Pasillo',
    clue: 'La llama de la antorcha se inclina bruscamente hacia un tramo concreto de la pared del corredor.',
    reward: 'Percepción CD 11: el DM confirma si existe una Puerta Secreta o atajo en este pasillo.',
    consequence: 'Si la antorcha se apaga, el grupo avanza con Desventaja en Percepción 1 turno.',
  },
  {
    title: 'Losa Floja en el Corredor',
    clue: 'Una baldosa suena hueca al pisar cerca del cruce del pasillo.',
    reward: 'Desarmar Trampas o DES CD 12: neutralizan una trampa del pasillo y rescatan +1 Acero Templado.',
    consequence: 'Si fallan por 5+, suena un clic metálico (+1 Reloj del Caos).',
  },
  {
    title: 'Eco de Patrulla a la Vuelta',
    clue: 'Pasos rítmicos resuenan más adelante en el corredor.',
    reward: 'Sigilo grupal CD 12: dejan pasar la patrulla o la emboscan con Ventaja en el primer turno.',
    consequence: 'Si fallan el Sigilo, el Monstruo Errante los sorprende desde el cruce.',
  },
  {
    title: 'Mapa Garabateado en la Pared',
    clue: 'Un prisionero fugado rayó con carbón una flecha indicando peligro adelante.',
    reward: 'Todos ganan Ventaja en su próxima Tirada de Salvación contra trampas o efectos de bioma.',
    consequence: 'El garabato atrae la mirada: si no vigilan la retaguardia, +1 al Reloj del Caos.',
  },
];

let lastHintTitle = '';
export function generateHintCard(biomeId = 'catacumbas', isCorridor = false) {
  const pool = isCorridor ? CORRIDOR_HINT_TEMPLATES : ROOM_HINT_TEMPLATES;
  const freshPool = pool.filter((h) => h.title !== lastHintTitle);
  const base = pick(freshPool.length ? freshPool : pool);
  lastHintTitle = base.title;
  const biome = PROCEDURAL_BIOMES.find((b) => b.id === biomeId) || PROCEDURAL_BIOMES[0];
  return {
    id: `hint-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    biomeName: `${biome.name} (${isCorridor ? 'Pasillo' : 'Sala'})`,
    biomeIcon: biome.icon,
    ...base,
  };
}

// ============================================================================
// 5. PUERTAS TÁCTICAS Y CONTADORES DIGITALES DE ZARGON
// ============================================================================
export const DOOR_STATES = [
  { id: 'normal', label: 'Puerta Normal', badge: 'Abierta gratis', rule: 'Acción gratuita al estar adyacente. Regla Anti-Campeo: al abrir, el DM puede usar Romper Filas (enemigo empuja/flanquea) o permitir abrir a 2 de ancho.' },
  { id: 'cerrada', label: 'Cerrada con Llave', badge: 'DES CD 13 / Llave', rule: 'Requiere Llave, Herramientas de Ladrón (DES CD 13) o derribarla con FUE CD 14 (+1 Reloj del Caos).' },
  { id: 'atrancada', label: 'Atrancada por Dentro', badge: 'FUE CD 15', rule: 'Los monstruos la bloquearon: requiere FUE CD 15 o Bomba de Pólvora. Los enemigos dentro están en estado Alerta.' },
  { id: 'entreabierta', label: 'Entreabierta', badge: 'Espiar Gratis', rule: 'Un héroe adyacente puede espiar la sala sin entrar ni activar enemigos (Percepción CD 11).' },
  { id: 'trampa_aguja', label: 'Trampa en el Picaporte', badge: 'DES CD 13', rule: 'Si se abre sin buscar trampas, dispara una aguja envenenada (1 PC + Envenenado salvo CON CD 12).' },
  { id: 'sello_puzzle', label: 'Sello Rúnico (Puzzle)', badge: 'Puzzle Móvil', rule: 'El DM envía un Puzzle interactivo al celular de un héroe para desbloquear el paso sin subir el Caos.' },
];

export const ZARGON_COUNTER_TYPES = [
  {
    id: 'trampa',
    name: 'Trampa Oculta',
    icon: '🪤',
    color: 'text-orange-300 border-orange-700/60 bg-orange-950/40',
    desc: 'Gasta 1 contador para activar una trampa sorpresa en el pasillo o puerta actual.',
  },
  {
    id: 'emboscada',
    name: 'Emboscada',
    icon: '🗡️',
    color: 'text-red-300 border-red-700/60 bg-red-950/40',
    desc: 'Gasta 1 contador para desplegar 1–2 monstruos errantes por la retaguardia cuando abran una sala.',
  },
  {
    id: 'patrulla',
    name: 'Patrulla',
    icon: '👣',
    color: 'text-amber-300 border-amber-700/60 bg-amber-950/40',
    desc: 'Gasta 1 contador para mover una patrulla por los pasillos si los héroes se demoran o hacen ruido.',
  },
  {
    id: 'destino',
    name: 'Destino Oscuro',
    icon: '🎲',
    color: 'text-purple-300 border-purple-700/60 bg-purple-950/40',
    desc: 'Gasta 1 contador para obligar a un héroe a repetir 1 tirada exitosa o darle +1 DC a un Jefe este turno.',
  },
  {
    id: 'escape',
    name: 'Escape de Némesis',
    icon: '💨',
    color: 'text-cyan-300 border-cyan-700/60 bg-cyan-950/40',
    desc: 'Gasta 1 contador cuando un Jefe baje a ≤2 PC para que lance bomba de humo y escape como Némesis recurrente.',
  },
];

// ============================================================================
// 5B. GENERADOR DE HISTORIA SIN SPOILERS Y ESCENAS PROGRESIVAS POR SALA
// ============================================================================
const NARRATIVE_HOOKS_BY_BIOME = {
  catacumbas: [
    'Durante las últimas tres noches, las campanas del cementerio viejo han tañido solas bajo una niebla helada. Los sepultureros huyeron al ver marcas de garras saliendo desde el interior de los mausoleos.',
    'Un mensajero del Imperio llegó al alba con el sello roto: las antiguas criptas selladas hace un siglo han vuelto a abrirse y una procesión silenciosa de antorchas azules desciende hacia las profundidades.',
  ],
  fortaleza_orca: [
    'Las caravanas de hierro del camino norte llevan dos semanas desapareciendo sin dejar rastro. Los exploradores divisaron humo negro y tambores de guerra resonando desde las ruinas excavadas en la ladera.',
    'Una partida de pieles verdes más organizada de lo normal ha tomado un antiguo bastión fronterizo, reforzando sus puertas y acumulando armas para un asalto inminente.',
  ],
  abismo_caos: [
    'El cielo sobre las colinas cenicientas se tiñó de rojo cobrizo al caer la tarde. Un calor antinatural emana de las grietas del subsuelo y los pájaros han abandonado la región por completo.',
    'Los vigías imperiales reportan columnas de ceniza negra y estandartes con la marca de Zargon alzándose en las galerías volcánicas donde antaño ardían las fraguas enanas.',
  ],
  cripta_espectral: [
    'Los habitantes de las aldeas cercanas despiertan cada mañana con el mismo sueño: una voz que los llama por su nombre desde un sagrario envuelto en bruma azulada.',
    'La luz de la luna parece quedarse atrapada sobre estas ruinas incluso al mediodía. Quienes se acercan a la entrada sienten un escalofrío que apaga las antorchas y nubla la memoria.',
  ],
  cavernas_hielo: [
    'Una ventisca fuera de temporada congeló el paso de montaña en una sola noche. Bajo el hielo translúcido de la caverna se distinguen siluetas inmóviles y el eco metálico de picos golpeando la piedra.',
    'Un guía de montaña regresó con las manos quemadas por el frío pidiendo ayuda: algo ha despertado en las grutas glaciares y está atrayendo a los viajeros hacia el abismo helado.',
  ],
  laboratorio_alquimico: [
    'El agua del arroyo que baja de las ruinas comenzó a brillar con un tono verdoso al anochecer. Nadie ha visto salir a los eruditos que bajaron a investigar las viejas cámaras de alquimia.',
    'Explosiones sordas sacuden el subsuelo cada pocas horas, acompañadas de un olor dulce y metálico que marea a los guardias de la superficie.',
  ],
};

const NARRATIVE_MISSION_CALL_BY_PLOT = {
  rescate:
    'Vuestro encargo es claro: descender con cautela, localizar a quien fue capturado antes de que sea demasiado tarde y traerlo con vida de vuelta a las escaleras de salida.',
  recuperacion:
    'El consejo os ha confiado una tarea decisiva: encontrar la reliquia perdida que alguien custodia en el corazón del complejo y recuperarla antes de que caiga en manos peores.',
  contrarreloj:
    'El tiempo corre en vuestra contra: un ritual oscuro ya ha comenzado en las profundidades. Debéis abrir paso hasta su foco y detenerlo antes de que culmine.',
  exploracion:
    'Nadie conoce con certeza qué aguarda tras las puertas selladas. Vuestra misión es explorar las alas principales, neutralizar las brechas de energía que encontréis y asegurar la cámara central.',
  venganza:
    'Los rumores señalan que un comandante enemigo dirige las operaciones desde lo más hondo. Debéis seguir su rastro, atravesar sus defensas y poner fin a su amenaza de una vez por todas.',
  defensa_oleadas:
    'No hay tiempo para avanzar: la caravana y los suministros se han refugiado en la cámara central y las antorchas enemigas ya rodean los accesos. Preparad mesas, trampas y posiciones porque tendréis que resistir 5 oleadas hasta quebrar su asalto.',
};

function buildQuestNarrative({ biome, plot, title, bossName, arcInfo, nemesis }) {
  const hook = pick(NARRATIVE_HOOKS_BY_BIOME[biome.id] || NARRATIVE_HOOKS_BY_BIOME.catacumbas);
  const call = NARRATIVE_MISSION_CALL_BY_PLOT[plot.id] || NARRATIVE_MISSION_CALL_BY_PLOT.exploracion;

  const arcIntroLine = arcInfo
    ? arcInfo.partNumber === 1
      ? `Este es el comienzo de "${arcInfo.arcTitle}". Apenas están tocando la superficie de una conspiración mayor.`
      : arcInfo.partNumber === 2
      ? `Siguiendo las pistas del capítulo anterior de "${arcInfo.arcTitle}", han llegado al bastión intermedio donde el enemigo oculta su siguiente paso.`
      : `Todo lo descubierto en "${arcInfo.arcTitle}" converge aquí. El corazón de la fortaleza se abre ante ustedes para el enfrentamiento final.`
    : nemesis
    ? `El rastro inconfundible de ${nemesis.name} —quien logró escapar de ustedes en el pasado— vuelve a aparecer grabado en los muros de entrada.`
    : '';

  // TEXTO 100% SIN SPOILERS PARA LEER EN VOZ ALTA A LOS AVENTUREROS
  const readAloudIntro = [
    hook,
    arcIntroLine,
    `Al descender los escalones de piedra hacia ${title}, ${biome.ambientFlavor.charAt(0).toLowerCase()}${biome.ambientFlavor.slice(1)}`,
    call,
  ]
    .filter(Boolean)
    .join(' ');

  const npcRoom = plot.id === 'rescate' ? 'R10' : 'R1';

  // Escenas progresivas que SOLO se activan cuando los héroes llegan a esas salas
  const storyBeats = {
    R14: {
      stage: 'Inicio · Entrada',
      title: 'El Descenso',
      readAloud: `Sus botas resuenan al pisar el último escalón. ${biome.ambientFlavor} Dos puertas se perfilan en la penumbra: el aire se siente denso, como si la propia mazmorra contuviera la respiración.`,
      dmTip: 'Lee la Historia de Inicio sin spoilers. Recuerda a los jugadores la Regla del Bioma solo cuando entre en juego.',
    },
    R12: {
      stage: 'Desarrollo · Primera Pista',
      title: 'Señales del Enemigo',
      readAloud:
        'Encuentran restos recientes de actividad: antorchas aún tibias, marcas frescas en el suelo y suministros apresurados. Quien manda aquí sabe que alguien podría bajar... pero aún no sabe que ya están dentro.',
      dmTip: 'Momento ideal para robar 1 Pista Sensorial o dejar que un héroe haga Percepción/Investigación CD 12.',
    },
    R5: {
      stage: 'Tensión · Mitad de Mazmorra',
      title: 'El Eco de lo que Aguarda',
      readAloud:
        'Un murmullo grave o el choque de metales vibra a través de los muros centrales. Algo poderoso domina la gran cámara del corazón del complejo, y el aire se vuelve más pesado con cada paso.',
      dmTip: 'Solo activa esta escena cuando el grupo haya cruzado la mitad del mapa. Prepara el ambiente del clímax sin revelar el giro.',
    },
    [npcRoom]: {
      stage: plot.id === 'rescate' ? 'Objetivo Clave' : 'Encuentro Secundario',
      title: plot.id === 'rescate' ? 'El Prisionero Hallado' : 'Una Voz en la Penumbra',
      readAloud:
        plot.id === 'rescate'
          ? 'Entre cadenas y sombras distinguen a la figura que vinieron a buscar. Al verlos, levanta la mirada con alivio y susurra: "¡Rápido... si abren esta sala, toda la guardia sabrá que estamos aquí!"'
          : 'Un explorador malherido se apoya contra la pared con una antorcha apagada. "Pensé que nadie vendría... si pueden ayudarme, sé algo que les salvará la vida más adelante."',
      dmTip:
        plot.id === 'rescate'
          ? 'Al liberarlo se activa la retirada / patrulla de persecución.'
          : 'Si lo curan o escoltan, otorga +1 🏅 Reputación y revela 1 trampa o puerta secreta.',
    },
    R11: {
      stage: 'Clímax · Cámara Central',
      title: `Frente a ${bossName}`,
      readAloud: `Las hojas de la gran puerta ceden con un estruendo. En el centro de la cámara, rodeado de su guardia y de los ecos de ${biome.name}, se alza ${bossName}. Su mirada se clava en ustedes: "Llegaron más lejos de lo que esperaba... pero aquí termina vuestra historia."`,
      dmTip: `CLÍMAX ACTIVO: Aplica la regla de clímax (${plot.climaxRule}) y activa Fase 2 cuando baje al 50% de PC.`,
    },
  };

  return { readAloudIntro, storyBeats };
}
// ============================================================================
// 6. GENERADOR DE MAPAS PROCEDURALES 26×19 COMPATIBLE CON TACTICALBOARD
// ============================================================================
const ROOM_DOORS_PRESETS = [
  { room: 'R14', x: 4, y: 15, edge: 'E' },
  { room: 'R14', x: 2, y: 14, edge: 'N' },
  { room: 'R15', x: 8, y: 15, edge: 'E' },
  { room: 'R12', x: 4, y: 11, edge: 'E' },
  { room: 'R13', x: 6, y: 10, edge: 'N' },
  { room: 'R4', x: 4, y: 6, edge: 'E' },
  { room: 'R5', x: 8, y: 6, edge: 'E' },
  { room: 'R1', x: 4, y: 2, edge: 'E' },
  { room: 'R2', x: 6, y: 3, edge: 'S' },
  { room: 'R3', x: 11, y: 3, edge: 'E' },
  { room: 'R11', x: 10, y: 9, edge: 'W' },
  { room: 'R11', x: 15, y: 9, edge: 'E' },
  { room: 'R6', x: 14, y: 3, edge: 'W' },
  { room: 'R7', x: 18, y: 4, edge: 'S' },
  { room: 'R8', x: 21, y: 2, edge: 'W' },
  { room: 'R9', x: 17, y: 6, edge: 'W' },
  { room: 'R10', x: 21, y: 6, edge: 'W' },
  { room: 'R17', x: 17, y: 11, edge: 'W' },
  { room: 'R18', x: 21, y: 11, edge: 'W' },
  { room: 'R20', x: 17, y: 15, edge: 'W' },
  { room: 'R21', x: 21, y: 15, edge: 'W' },
];

const ALERTNESS_LIST = ['Distraído', 'Alerta', 'Patrulla', 'Guardia', 'Venganza'];

// ============================================================================
// MOTOR ANTI-REPETICIÓN (BARAJADO SIN REPETIR HASTA AGOTAR EL CATÁLOGO)
// ============================================================================
const FRESH_DECK_MEMORY = {};
function pickFresh(deckKey, arr, getKey = (x) => (typeof x === 'string' ? x : x.id || x.name), avoidSet = null) {
  if (!arr || arr.length === 0) return null;
  if (!FRESH_DECK_MEMORY[deckKey]) FRESH_DECK_MEMORY[deckKey] = [];
  const used = new Set(FRESH_DECK_MEMORY[deckKey]);
  let pool = arr.filter((item) => {
    const k = getKey(item);
    if (avoidSet && avoidSet.has(k)) return false;
    return !used.has(k);
  });
  if (pool.length === 0) {
    FRESH_DECK_MEMORY[deckKey] = [];
    pool = arr.filter((item) => !(avoidSet && avoidSet.has(getKey(item))));
    if (pool.length === 0) pool = arr;
  }
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  FRESH_DECK_MEMORY[deckKey].push(getKey(chosen));
  return chosen;
}

const BOSS_NAMES = [
  'Kragor el Desollador',
  'Vexia la Tejedora de Almas',
  'Lord Malakor de las Cenizas',
  'Skarn Colmillo de Hierro',
  'Archimago Morvath el Sin Rostro',
  'Baronesa Sanguina de Elethorn',
  'Grimjaw el Quebrantahuesos',
  'Inquisidor Caído Malrick',
  'Duquesa Valeriana de la Cripta',
  'Thorgar Martillo de Obsidiana',
  'Oráculo Zephira de la Niebla',
  'Capitán Draug el Ahorcado',
  'Alquimista Vespera la Venenosa',
  'General Kaelen el Traidor',
  'Morgul Boca de Abismo',
  'Lady Isolde la Dama de Hielo',
  'Vorak el Carnicero de Piedra',
  'Escriba Oscuro Nyxarion',
  'Centurión Rúnico Khaz-Dul',
  'Sacerdotisa Umbra del Eclipse',
  'Rey Mendigo Osgar',
  'Balthazar el Nigromante Roto',
  'Gorgutz Garras de Sangre',
  'El Vigía de las Mil Llaves',
];

const BOSS_DIALOGUES = [
  '“¿Así que la ciudad envió carne fresca? Sus huesos reforzarán mis muros.”',
  '“Llegan tarde, héroes. El sello ya se agrieta bajo sus propios pies.”',
  '“Dejen sus armas y tal vez les permita marcharse con sus almas intactas.”',
  '“¡Nadie profana mi santuario y vive para contarlo en la taberna!”',
  '“He esperado siglos a oponentes dignos… muéstrenme de qué están hechos.”',
  '“Cada paso que dieron por estos pasillos fue parte de mi plan.”',
];

const ACT2_DISCOVERIES = [
  'En un cadáver antiguo hallan un diario manchado: revela que el verdadero objetivo del jefe no es el oro, sino un sello enterrado bajo la sala central.',
  'Un prisionero herido susurra un secreto antes de desmayarse: las patrullas obedecen una señal rúnica oculta cerca de la cámara principal.',
  'Grabados recientes en la piedra muestran un mapa incompleto y una advertencia: uno de los contactos de la ciudad filtró la ruta de los héroes.',
  'Encuentran un estandarte quemado de una expedición anterior; entre las cenizas hay una pista que delata la debilidad táctica del jefe.',
  'Un altar profanado vibra con energía oscura: al examinarlo descubren que el jefe intentó negociar con Zargon y fue traicionado.',
  'Hallan una carta sellada con cera imperial que vincula esta mazmorra con una conspiración mayor en los barrios altos de la ciudad.',
];

const EPILOGUES = [
  'Al regresar a la ciudad con pruebas de su victoria, los guardias les abren paso con respeto y los bardos ya componen una nueva balada.',
  'El Concejo recompensa al grupo, aunque entre las sombras un mensajero anónimo observa su regreso y desaparece hacia el norte.',
  'Los comerciantes celebran el fin de la amenaza; la fama del grupo crece y nuevos clientes se acercan al tablón de contratos.',
  'La paz vuelve a los caminos cercanos, pero un objeto recuperado en la sala del jefe emite un tenue pulso arcano que presagia futuros peligros.',
];

const QUEST_TITLES_PREFIX = [
  'Ecos de',
  'La Caída de',
  'Sombras sobre',
  'El Secreto de',
  'Asalto a',
  'Sangre en',
  'La Maldición de',
  'El Último Sello de',
  'Cenizas de',
  'El Juramento de',
  'Susurros en',
  'La Vigilia de',
  'El Despertar de',
  'Traición en',
  'Las Ruinas de',
  'El Juicio de',
];

const QUEST_PLACES = [
  'la Cripta de Bronce',
  'el Bastión Quebrado',
  'los Túneles del Eco',
  'la Torre Sumergida',
  'el Osario Carmesí',
  'la Fragua del Abismo',
  'el Sagrario Olvidado',
  'las Minas de Kael',
  'la Abadía Silenciosa',
  'el Panteón de Ceniza',
  'la Fortaleza del Eclipse',
  'las Catacumbas de Sal',
  'el Laboratorio de Elethorn',
  'la Cámara del Trono Roto',
  'el Paso de los Lamentos',
  'el Relicario de Obsidiana',
];

function buildProceduralBoardMap({
  id,
  title,
  biome,
  plot,
  twist,
  bossName,
  partyLevel,
  partySize,
  narrative,
}) {
  // ============================================================================
  // BASE ARQUITECTÓNICA REAL: 14 PLANOS OFICIALES DE HEROQUEST (HeroScribe GPL-2.0)
  // Conserva la estructura maestra exacta de puertas, pasillos, muros bloqueados,
  // trampas y muebles del Libro de Misiones Original, y la re-tematiza dinámicamente
  // al Bioma, Trama, Número de Jugadores (1–4), Alquimia y Salas de Peligro HQ-D20 v2.
  // ============================================================================
  const bp = pickFresh('official_bp', OFFICIAL_BLUEPRINTS, (b) => b.id);
  const startRoom = bp.startRoom || 'R14';

  const items = [];
  const monstersByRoom = {};
  const roomsWithChest = new Set();
  const roomsWithFurniture = new Set();
  let alchemyCount = 0;

  // 1. Copiar arquitectura exacta (escaleras, puertas, puertas secretas, muros bloqueados, trampas y muebles)
  bp.items.forEach((raw) => {
    const info = PIECE_TYPES[raw.type];
    if (!info) return;

    if (info.monsterId) {
      const rId = getRoomAt(raw.x, raw.y);
      if (!monstersByRoom[rId]) monstersByRoom[rId] = [];
      monstersByRoom[rId].push(raw);
      return;
    }

    if (raw.type === 'alchemy_bench') {
      alchemyCount += 1;
      if (alchemyCount > 1) {
        // Garantizar máximo 1 Mesa de Alquimia por misión: las demás se vuelven Mesa o Altar
        items.push({ ...raw, type: 'table', note: 'Mesa de Laboratorio' });
        return;
      }
      items.push({
        ...raw,
        label: 'Mesa de Alquimia 3×2 (Única en la misión)',
        note: 'Los héroes pueden destilar pociones aquí con tirada d20 de Arcano.',
      });
      return;
    }

    if (raw.type === 'chest') {
      const rId = getRoomAt(raw.x, raw.y);
      if (rId !== 'CORRIDOR') roomsWithChest.add(rId);
    }
    if (info.category === 'Mobiliario') {
      const rId = getRoomAt(raw.x, raw.y);
      if (rId !== 'CORRIDOR') roomsWithFurniture.add(rId);
    }

    if (raw.type === 'door') {
      const ds = Math.random() < 0.18 ? pick(DOOR_STATES.filter((d) => d.id !== 'normal')) : DOOR_STATES[0];
      items.push({
        ...raw,
        doorState: ds.id,
        label: `${ds.label} (${ds.badge})`,
      });
      return;
    }

    items.push({ ...raw });
  });

  // 2. Elegir sala del Jefe (prioriza R11 si tiene enemigos; si no, la sala con más enemigos)
  const combatRoomIds = Object.keys(monstersByRoom).filter((r) => r !== 'CORRIDOR' && r !== startRoom);
  let bossRoom = 'R11';
  if (!monstersByRoom['R11'] || monstersByRoom['R11'].length === 0) {
    bossRoom =
      combatRoomIds.sort((a, b) => (monstersByRoom[b]?.length || 0) - (monstersByRoom[a]?.length || 0))[0] ||
      'R11';
  }

  // 3. Re-tematizar los monstruos al Bioma elegido y escalar densidad a 1–4 aventureros
  const bossType = pick(biome.bossPool);
  let bossPlaced = false;

  Object.entries(monstersByRoom).forEach(([rId, list]) => {
    // En 1 Jugador (Solo): máximo 1 enemigo por sala (y el Jefe lucha sin escoltas)
    // En 2 Jugadores: máximo 2 enemigos por sala
    // En 3–4 Jugadores: densidad completa del plano oficial
    const maxAllowed =
      partySize === 1
        ? 1
        : partySize === 2
        ? Math.max(1, Math.ceil(list.length * 0.65))
        : list.length;

    const kept = list.slice(0, maxAllowed);
    kept.forEach((rawMon, idx) => {
      const isBossSlot = !bossPlaced && rId === bossRoom && idx === 0;
      if (isBossSlot) {
        bossPlaced = true;
        items.push({
          x: rawMon.x,
          y: rawMon.y,
          type: bossType,
          isBoss: true,
          alertness: 'Guardia',
          label: `JEFE: ${bossName}`,
          note: `JEFE: ${bossName}`,
        });
      } else {
        const themedType = pick(biome.monsterPool);
        const alertState = pick(ALERTNESS_LIST);
        items.push({
          x: rawMon.x,
          y: rawMon.y,
          type: themedType,
          alertness: alertState,
          label: `${themedType.toUpperCase()} [${alertState}]`,
        });
      }
    });
  });

  // 4. Salas de Peligro: asignar SOLO en 2 salas activas con combate de este plano (0 en salas vacías)
  const hazCandidates = combatRoomIds.filter((r) => r !== bossRoom && r !== startRoom);
  const chosenHazRooms = [...hazCandidates].sort(() => Math.random() - 0.5).slice(0, 2);
  const shuffledHazList = [...HAZARD_ROOMS].sort(() => Math.random() - 0.5);
  const realHazards = {};
  chosenHazRooms.forEach((rId, idx) => {
    if (shuffledHazList[idx]) realHazards[rId] = shuffledHazList[idx];
  });

  // 5. Notas coherentes A/B/C/E/F apuntando SOLO a salas activas reales del plano
  const treasureRoom = [...roomsWithChest].find((r) => r !== startRoom && r !== bossRoom) || hazCandidates[0] || bossRoom;
  const notes = [
    {
      code: 'A',
      room: startRoom,
      title: `Inicio (${bp.name}) — ${biome.name}`,
      text: `${biome.ambientFlavor} Regla del Bioma: ${biome.globalRule}`,
    },
    {
      code: 'B',
      room: bossRoom,
      title: `Cámara del Jefe: ${bossName}`,
      text: `Clímax: ${plot.climaxRule} | Giro: ${twist}`,
    },
    {
      code: 'C',
      room: treasureRoom,
      title: 'Cámara de Botín y Pistas',
      text: narrative?.storyBeats?.act2Discovery || 'Exploren el mobiliario para hallar pistas y materiales del bioma.',
    },
  ];
  const hazardCodes = ['E', 'F'];
  Object.entries(realHazards).forEach(([rId, haz], idx) => {
    notes.push({
      code: hazardCodes[idx] || 'G',
      room: rId,
      title: `Sala de Peligro: ${haz.icon} ${haz.name}`,
      text: haz.rule,
    });
  });

  return {
    id,
    title,
    campaign: `Procedural · ${biome.name}`,
    recLevel: partyLevel,
    startRoom,
    darkCells: bp.darkCells || [],
    isProcedural: true,
    biomeId: biome.id,
    biomeRule: biome.globalRule,
    hazardRooms: realHazards,
    intro: narrative?.readAloudIntro || `${biome.ambientFlavor} Objetivo: ${plot.objective}`,
    readAloudIntro: narrative?.readAloudIntro || `${biome.ambientFlavor} Objetivo: ${plot.objective}`,
    storyBeats: narrative?.storyBeats || {},
    bossName,
    plotName: plot.name,
    twist,
    wanderingMonster: biome.wandering,
    items,
    notes,
  };
}

// ============================================================================
// 7. GENERADOR DE MISIÓN PROCEDURAL (ONE-SHOT O PARTE DE UN ARCO)
// ============================================================================
export function generateProceduralQuest({
  mode = 'oneshot', // 'oneshot' | 'arc_part'
  biomeId = 'random',
  plotId = 'random',
  partyLevel = 1,
  partySize = 4,
  arcInfo = null, // { arcId, arcTitle, partNumber, totalParts, continuityNote }
  nemesis = null,
  existingTitles = [],
} = {}) {
  const biome =
    biomeId === 'random'
      ? pickFresh('biome', PROCEDURAL_BIOMES, (b) => b.id)
      : PROCEDURAL_BIOMES.find((b) => b.id === biomeId) || PROCEDURAL_BIOMES[0];

  const plot =
    plotId === 'random'
      ? pickFresh('plot', QUEST_PLOTS, (p) => p.id)
      : QUEST_PLOTS.find((p) => p.id === plotId) || QUEST_PLOTS[0];

  const twist = pickFresh('twist', QUEST_TWISTS);
  const sideObjective = pickFresh('sideObj', SIDE_OBJECTIVES);
  const bossName = nemesis
    ? `${nemesis.name} (Némesis Nv.${nemesis.rank || 2})`
    : pickFresh('boss', BOSS_NAMES);
  const bossDialogue = pickFresh('bossDlg', BOSS_DIALOGUES);
  const act2Discovery = pickFresh('act2', ACT2_DISCOVERIES);
  const epilogue = pickFresh('epilogue', EPILOGUES);
  const id = `proc-q-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;

  const existingSet = new Set(existingTitles || []);
  let title = arcInfo
    ? `${arcInfo.arcTitle} — Parte ${arcInfo.partNumber}/${arcInfo.totalParts}`
    : nemesis
    ? `Venganza contra ${nemesis.name}`
    : `${pickFresh('prefix', QUEST_TITLES_PREFIX)} ${pickFresh('place', QUEST_PLACES)}`;
  if (!arcInfo && !nemesis && existingSet.has(title)) {
    title = `${pickFresh('prefix', QUEST_TITLES_PREFIX)} ${pickFresh('place', QUEST_PLACES)}`;
  }

  // Asignar 2–3 Salas de Peligro aleatorias
  const hazardCandidates = ['R4', 'R5', 'R12', 'R7', 'R18', 'R2'];
  const shuffledHaz = [...HAZARD_ROOMS].sort(() => Math.random() - 0.5);
  const hazardAssignments = {
    [hazardCandidates[0]]: shuffledHaz[0],
    [hazardCandidates[2]]: shuffledHaz[1],
    [hazardCandidates[4]]: shuffledHaz[2],
  };

  const baseXP = 220 + partyLevel * 90 + (mode === 'arc_part' ? 60 : 0);
  const baseGold = 80 + partyLevel * 35 + (nemesis ? 60 : 0);

  const rawNarrative = buildQuestNarrative({
    biome,
    plot,
    title,
    bossName,
    arcInfo,
    nemesis,
  });
  const narrative = {
    ...rawNarrative,
    storyBeats: {
      ...(rawNarrative.storyBeats || {}),
      act2Discovery,
      bossDialogue,
      epilogue,
    },
  };

  const mapData = buildProceduralBoardMap({
    id,
    title,
    biome,
    plot,
    twist,
    bossName,
    partyLevel,
    partySize,
    hazardAssignments,
    narrative,
  });

  // Contadores Digitales de Zargon recomendados según tamaño/nivel
  const zargonCounters = {
    trampa: 2,
    emboscada: partySize >= 4 ? 2 : 1,
    patrulla: 2,
    destino: partyLevel >= 4 ? 2 : 1,
    escape: mode === 'arc_part' || nemesis ? 1 : 0,
  };

  return {
    id,
    mode,
    title,
    biome,
    plot,
    twist,
    readAloudIntro: narrative.readAloudIntro,
    storyBeats: narrative.storyBeats,
    sideObjective,
    bossName,
    bossPhase2: `Fase 2 (al 50% PC): ${bossName} recupera 2 PC, gana +1 DC Ataque y empuja 1 casilla a todos los héroes adyacentes.`,
    nemesisId: nemesis?.id || null,
    arcInfo,
    partyLevel,
    partySize,
    hazardRooms: mapData.hazardRooms || {},
    zargonCounters,
    rewards: {
      xp: baseXP,
      gold: baseGold,
      fame: mode === 'arc_part' && arcInfo?.partNumber === arcInfo?.totalParts ? 2 : 1,
      reputation: 1,
      materialsHint: `Materiales destacados de ${biome.name} (${biome.materialSource})`,
    },
    mapData,
    createdAt: Date.now(),
  };
}

// ============================================================================
// 8. GENERADOR DE ARCO DE CAMPAÑA CONECTADO (3 MISIONES CON CONTINUIDAD)
// ============================================================================
export function generateCampaignArc({
  biomeId = 'random',
  partyLevel = 1,
  partySize = 4,
} = {}) {
  const biome =
    biomeId === 'random'
      ? pick(PROCEDURAL_BIOMES)
      : PROCEDURAL_BIOMES.find((b) => b.id === biomeId) || PROCEDURAL_BIOMES[0];

  const villainName = pick(BOSS_NAMES);
  const arcTitle = `Crónica de ${villainName.split(' ')[0]} en ${biome.name}`;
  const arcId = `arc-${Date.now()}`;

  const parts = [
    {
      partNumber: 1,
      plotId: 'exploracion',
      continuityNote:
        'Acto I (Pistas e Infiltración): Descubren el plan del villano. Si completan el objetivo secundario, el Jefe del Acto III pierde 1 Contador de Destino.',
    },
    {
      partNumber: 2,
      plotId: 'rescate',
      continuityNote:
        'Acto II (El Bastión Intermedio): Rescatan a un aliado clave o roban la llave del sagrario. Si el lugarteniente escapa, se une al Acto III.',
    },
    {
      partNumber: 3,
      plotId: 'venganza',
      continuityNote:
        'Acto III (Clímax Final): Enfrentamiento definitivo contra el villano principal en su fortaleza. Recompensa doble de Fama y Gema Abismal.',
    },
  ];

  const quests = parts.map((p) =>
    generateProceduralQuest({
      mode: 'arc_part',
      biomeId: biome.id,
      plotId: p.plotId,
      partyLevel: Math.min(10, partyLevel + (p.partNumber - 1)),
      partySize,
      arcInfo: {
        arcId,
        arcTitle,
        partNumber: p.partNumber,
        totalParts: 3,
        continuityNote: p.continuityNote,
        villainName,
      },
    })
  );

  return {
    id: arcId,
    title: arcTitle,
    biome,
    villainName,
    currentPart: 1,
    completedParts: [],
    flags: [],
    quests,
    createdAt: Date.now(),
  };
}

// ============================================================================
// 9. TABLÓN DE CONTRATOS DE LA TABERNA (3 Misiones Listas en Ciudad)
// ============================================================================
export function generateContractBoard(partyLevel = 1, partySize = 4, nemeses = []) {
  const activeNemesis = nemeses.find((n) => !n.defeated) || null;
  return [
    generateProceduralQuest({ mode: 'oneshot', partyLevel, partySize }),
    generateProceduralQuest({ mode: 'oneshot', partyLevel: Math.min(10, partyLevel + 1), partySize }),
    activeNemesis
      ? generateProceduralQuest({
          mode: 'oneshot',
          plotId: 'venganza',
          partyLevel: Math.min(10, partyLevel + 1),
          partySize,
          nemesis: activeNemesis,
        })
      : generateProceduralQuest({ mode: 'oneshot', plotId: 'contrarreloj', partyLevel, partySize }),
  ];
}

// ============================================================================
// 10. GENERADORES PROCEDURALES CLÁSICOS (Mantenidos para Mazos del DM y Tablero)
// ============================================================================
const EW_SUBJECTS = [
  'Niebla del Abismo',
  'Maldición de Zargon',
  'Llamada de la Horda',
  'Sombras Hambrientas',
  'Eco del Señor Brujo',
  'Furia de las Profundidades',
  'Velo de la Luna Rota',
  'Trampa de los Antiguos',
];

const EW_TRIGGERS = [
  'Al abrir la próxima puerta',
  'Al inicio del turno de Zargon',
  'Cuando un héroe busque tesoros',
  'En el próximo combate cuerpo a cuerpo',
  'Al entrar en un pasillo largo',
];

const EW_EFFECTS = [
  'invoca 2 Esqueletos o Goblins en las esquinas más cercanas al héroe con menos PC.',
  'todos los monstruos visibles ganan +1 DC de Ataque y Defensa durante 1 ronda completa.',
  'las antorchas parpadean: los héroes atacan con Desventaja hasta que alguien supere SAB CD 13.',
  'una trampa oculta se activa bajo el líder (DES CD 13 o pierde 2 PC y termina su movimiento).',
  'el enemigo más cercano entra en Modo Espíritu: su próximo ataque daña PM en lugar de PC.',
  'un muro de sombras bloquea la puerta detrás del grupo durante 2 turnos (FUE CD 14 para abrirlo).',
];

const EW_DREAD_VARIANTS = [
  { title: 'Bola en Llamas (Terror)', type: 'Hechizo', rarity: 'Inusual', text: 'Envuelve a un héroe visible en llamas: sufre 2 PC (tira 2 Dados Rojos o DES CD {CD}: cada 5–6 reduce 1 daño).' },
  { title: 'Nube de Terror (Terror)', type: 'Hechizo', rarity: 'Rara', text: 'Paraliza a los héroes de la sala actual (no mueven ni atacan). Cada víctima se libera con SAB CD {CD} o sacando 6 con tantos d6 como PM.' },
  { title: 'Luces del Terror (Luna)', type: 'Maldición', rarity: 'Inusual', text: 'Haces fantasmales rodean a un héroe: todos los monstruos tiran +1 DC Ataque contra él hasta superar SAB CD {CD} o sacar 5–6 en 1d6.' },
  { title: 'Canalizar el Terror (Luna)', type: 'Hechizo', rarity: 'Común', text: 'Un monstruo canaliza energía oscura: tira 1d6 (+1 por cada aliado adyacente): 4–5 = 1 PC, 6+ = 2 PC a un héroe en LdV.' },
  { title: 'Rayo Mortífero (Terror)', type: 'Hechizo', rarity: 'Rara', text: 'Un rayo atraviesa en línea recta hasta chocar con pared/puerta: 2 PC a todos en el camino (DES CD {CD} reduce a 1 PC).' },
  { title: 'Dominación Oscura (Terror)', type: 'Maldición', rarity: 'Rara', text: 'Un héroe debe superar SAB CD {CD} o Zargon lo mueve 3 casillas y le hace atacar a un aliado adyacente.' },
  { title: 'Refuerzo de la Horda', type: 'Emboscada', rarity: 'Común', text: 'Al inicio del turno de Zargon, aparece 1 {WANDERING} en la puerta o esquina más cercana fuera de línea de visión.' },
  { title: 'Frenesí de Zargon', type: 'Táctica', rarity: 'Común', text: 'Todos los monstruos visibles ganan +1 DC Ataque este turno pero defienden con -1 DC.' },
  { title: 'Trampa Reactivada', type: 'Trampa', rarity: 'Común', text: 'Cuando un héroe avance por un pasillo o abra una puerta, se activa un dardo oculto (DES CD {CD} o 1 PC + Envenenado).' },
  { title: 'Muro de Sombras', type: 'Hechizo', rarity: 'Inusual', text: 'Una puerta abierta se sella mágicamente por 2 turnos (FUE CD {CD} o Arcano CD {CD} para abrirla antes).' },
  { title: 'Velo Espectral', type: 'Maldición', rarity: 'Inusual', text: 'El enemigo más cercano entra en forma espectral por 1 ronda: su próximo ataque daña PM en lugar de PC.' },
  { title: 'Invocar Espectros (Luna)', type: 'Emboscada', rarity: 'Rara', text: 'De las sombras emerge 1 Espectro Etéreo (2 si el grupo es Nivel 6+) adyacente al héroe con menos PM.' },
];

let lastEwTitle = '';
export function generateProceduralEvilWizard(level = 1, missionContext = null) {
  const cd = Math.min(16, 11 + Math.floor(level / 2));
  const wandering = missionContext?.wanderingMonster || 'Orco';
  const fresh = EW_DREAD_VARIANTS.filter((c) => c.title !== lastEwTitle);
  const picked = pick(fresh.length ? fresh : EW_DREAD_VARIANTS);
  lastEwTitle = picked.title;
  return {
    id: `proc-ew-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: picked.title,
    type: picked.type,
    rarity: picked.rarity,
    text: picked.text.replace(/\{CD\}/g, String(cd)).replace(/\{WANDERING\}/g, wandering),
  };
}

const EV_ADJECTIVES = [
  'Súbito',
  'Inquietante',
  'Catastrófico',
  'Arcano',
  'Fantasmal',
  'Subterráneo',
];
const EV_NOUNS = [
  'Temblor',
  'Susurro',
  'Derrumbe',
  'Portal Menor',
  'Enjambre',
  'Escalofrío',
  'Cambio de Guardia',
];
const EV_OUTCOMES = [
  'todos los héroes deben superar DES CD {CD} o quedar Derribados y perder 1 PC.',
  'aparece una patrulla errante de {N} monstruos desde las escaleras de entrada.',
  'las sombras drenan la voluntad: cada héroe supera SAB CD {CD} o pierde 1 PM.',
  'una grieta revela un escondite con {GOLD} MO y 1 Material de Crafteo, pero el ruido atrae 1 monstruo errante.',
  'un pulso mágico recarga 1 hechizo gastado al lanzador más herido, pero sube +1 el Reloj del Caos.',
];

export function generateProceduralEvent(level = 1, missionContext = null) {
  const cd = Math.min(16, 11 + Math.floor(level / 2));
  const gold = randInt(2, 4) * 10 + level * 6;
  const n = level >= 5 ? 3 : 2;
  const biome = missionContext?.biomeId
    ? PROCEDURAL_BIOMES.find((b) => b.id === missionContext.biomeId)
    : null;
  const outcome = pick(EV_OUTCOMES)
    .replace('{CD}', String(cd))
    .replace('{GOLD}', String(gold))
    .replace('{N}', String(n));

  return {
    id: `proc-ev-${Date.now()}`,
    title: `${pick(EV_NOUNS)} ${pick(EV_ADJECTIVES)}${biome ? ` · ${biome.icon}` : ''}`,
    severity: level >= 6 ? 'Peligro Alto' : pick(['Tensión', 'Peligro', 'Oportunidad']),
    text: `${biome ? `En ${biome.name}: ` : ''}${outcome}${missionContext?.wanderingMonster ? ` (Errante temático: ${missionContext.wanderingMonster})` : ''}`,
  };
}

const FURN_FINDS = [
  { type: 'Tesoro', text: 'Encuentras un doble fondo oculto con {GOLD} MO y 1 Material de Crafteo.' },
  { type: 'Alquimia', text: 'Hallazgo de 2 ingredientes intactos (Hierba Lunar / Polvo Rúnico) listos para crafteo.' },
  { type: 'Trampa', text: '¡Resorte oculto! Supera DES CD {CD} o sufres 2 PC por dardo envenenado.' },
  { type: 'Pista', text: 'Encuentras notas que revelan la posición de 1 trampa o puerta secreta en esta ala.' },
  { type: 'Bendición', text: 'Un talismán antiguo otorga Ventaja en tu próximo ataque o tirada de salvación.' },
  { type: 'Emboscada', text: '¡Un Mímico menor o rata gigante salta desde el interior! (1 PC salvo DES CD {CD}).' },
];

export function generateProceduralFurniture(furnitureType = 'Genérico', level = 1) {
  const cd = Math.min(16, 11 + Math.floor(level / 2));
  const gold = randInt(1, 3) * 10 + level * 5;
  const found = pick(FURN_FINDS);
  return {
    id: `proc-f-${Date.now()}`,
    furniture: furnitureType,
    type: found.type,
    title: `Hallazgo en ${furnitureType}: ${found.type}`,
    text: found.text.replace('{CD}', String(cd)).replace('{GOLD}', String(gold)),
  };
}

const LOOT_PREFIXES = ['Filo', 'Amuleto', 'Anillo', 'Frasco', 'Pergamino', 'Capa', 'Brazal'];
const LOOT_THEMES = [
  'de la Reina Espiritual',
  'del Alba Imperial',
  'de la Luna de Sangre',
  'de los Enanos de Kellar',
  'del Viento Cortante',
  'de la Guardia Eterna',
];
const LOOT_POWERS = [
  'otorga +1 DC de Ataque contra No Muertos y Espectros.',
  'permite repetir 1 Dado de Combate fallido una vez por misión.',
  'restaura 3 PC o 2 PM al beberlo (1 uso, acción gratuita).',
  'otorga +2 a pruebas de Sigilo y Percepción.',
  'reduce en 1 el daño recibido de trampas y hechizos de fuego.',
  'puede venderse en Ciudad por {GOLD} MO o equiparse de inmediato.',
];

export function generateProceduralTreasure(level = 1) {
  const isTrap = Math.random() < 0.25;
  const cd = 11 + Math.floor(level / 2);
  if (isTrap) {
    return {
      id: `proc-tr-${Date.now()}`,
      kind: 'Trampa',
      title: `Trampa Procedural (Nv.${level})`,
      text: `Una runa de presión se ilumina bajo tus pies: supera DES o Arcano CD ${cd} o sufres ${Math.min(4, 1 + Math.ceil(level / 3))} PC de daño.`,
    };
  }
  const gold = randInt(4, 9) * 20 + level * 25;
  return {
    id: `proc-tr-${Date.now()}`,
    kind: 'Reliquia Procedural',
    title: `${pick(LOOT_PREFIXES)} ${pick(LOOT_THEMES)}`,
    text: `Objeto único encontrado: ${pick(LOOT_POWERS).replace('{GOLD}', String(gold))}`,
  };
}

const TRAVEL_BIOMES = ['Bosque Sombrío', 'Paso de Montaña', 'Camino Real', 'Pantano de Niebla', 'Ruinas Antiguas'];
const TRAVEL_EVENTS = [
  {
    title: 'Caravana Atacada',
    test: 'Atletismo o Persuasión CD {CD}',
    success: 'Ayudan a los mercaderes y reciben {GOLD} MO + 1 Ración de Mazmorra cada uno.',
    fail: 'Llegan tarde; el retraso sube el Reloj del Caos inicial a 2.',
  },
  {
    title: 'Santuario Olvidado',
    test: 'Religión o Arcano CD {CD}',
    success: 'Cada héroe comienza la próxima misión con Ventaja en su primera tirada y 1 Polvo Rúnico.',
    fail: 'Un espíritu inquieto drena 1 PM al líder antes de desaparecer.',
  },
  {
    title: 'Emboscada en el Puente',
    test: 'Percepción o Sigilo CD {CD}',
    success: 'Detectan la trampa y roban 1 Bomba de Humo y {GOLD} MO a los bandidos.',
    fail: 'Un héroe al azar comienza la misión con 2 PC menos por flechas en el camino.',
  },
];

export function generateProceduralTravel(level = 1) {
  const cd = 11 + Math.floor(level / 2);
  const gold = randInt(3, 7) * 10 + level * 10;
  const ev = pick(TRAVEL_EVENTS);
  return {
    id: `proc-tv-${Date.now()}`,
    biome: pick(TRAVEL_BIOMES),
    title: ev.title,
    test: ev.test.replace('{CD}', String(cd)),
    success: ev.success.replace('{GOLD}', String(gold)),
    fail: ev.fail,
  };
}
