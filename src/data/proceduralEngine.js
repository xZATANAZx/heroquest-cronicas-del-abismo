// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// "EL ARQUITECTO DEL ABISMO" — Motor Procedural de Misiones, Arcos, Biomas,
// Salas de Peligro, Mazo de Pistas, Puertas Tácticas y Contadores de Zargon
// ============================================================================

import { HQ_ROOMS } from './officialBoardMaps';

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
const HINT_TEMPLATES = [
  {
    title: 'Huellas Frescas de Botas Pesadas',
    clue: 'Marcas de barro reciente conducen hacia el ala norte, mientras el pasillo sur huele a ozono quemado.',
    reward: 'Si siguen las huellas (Supervivencia CD 11), sorprenden a la siguiente sala (enemigos empiezan Distraídos).',
    consequence: 'Si ignoran las huellas sin cautela, una patrulla los flanquea (+1 Contador de Patrulla).',
  },
  {
    title: 'Susurros tras la Piedra',
    clue: 'Escuchan voces discutiendo sobre un cofre falso y una llave escondida en la biblioteca.',
    reward: 'El grupo sabe de antemano si el próximo cofre tiene trampa o es un Mímico (Ventaja al desarmar).',
    consequence: 'Detenerse a escuchar demasiado sube +1 al Reloj del Caos.',
  },
  {
    title: 'Marca Secreta del Gremio',
    clue: 'Un símbolo tallado a ras del suelo advierte: "Muro falso a tres pasos del fuego".',
    reward: 'Revela automáticamente la ubicación de 1 Puerta Secreta o atajo sin gastar acción de búsqueda.',
    consequence: 'Ninguna — recompensa pura por observar el entorno.',
  },
  {
    title: 'Rastro de Sangre y Frascos Rotos',
    clue: 'Un explorador herido se arrastró hacia la cámara lateral dejando un reguero de Hierba Lunar.',
    reward: 'El héroe que investigue recibe 1 Hierba Lunar + 1 Ración de Mazmorra gratis y sabe dónde está el NPC.',
    consequence: 'Quien recoja los frascos sin guantes supera DES CD 11 o se corta (1 PC).',
  },
  {
    title: 'Corriente de Aire Helado',
    clue: 'El humo de sus antorchas se inclina bruscamente hacia la puerta este, señal de una sala de peligro adelante.',
    reward: 'Todos ganan Ventaja en su primera Tirada de Salvación al entrar a la próxima Sala de Peligro.',
    consequence: 'Si avanzan con antorchas abiertas sin precaución en sala de gas, detonan un fogonazo leve.',
  },
  {
    title: 'Mapa Arrugado de un Goblin',
    clue: 'Un garabato muestra dónde duermen los guardias y dónde escondieron la pólvora.',
    reward: 'El grupo gana +1 Pólvora Negra en el próximo mueble y el DM revela 1 trampa del pasillo.',
    consequence: 'El mapa tiene una X falsa: si fallan Investigación CD 12, la X lleva a una Emboscada.',
  },
];

export function generateHintCard(biomeId = 'catacumbas') {
  const base = pick(HINT_TEMPLATES);
  const biome = PROCEDURAL_BIOMES.find((b) => b.id === biomeId) || PROCEDURAL_BIOMES[0];
  return {
    id: `hint-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    biomeName: biome.name,
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

const BOSS_NAMES = [
  'Kragor el Desollador',
  'Vexia la Tejedora de Almas',
  'Lord Malakor de las Cenizas',
  'Skarn Colmillo de Hierro',
  'Archimago Morvath',
  'Baronesa Sanguina de Elethorn',
  'Grimjaw el Quebrantahuesos',
  'El Carcelero sin Rostro',
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
  hazardAssignments,
  narrative,
}) {
  const items = [];
  const usedCells = new Set();

  const occupy = (x, y, w = 1, h = 1) => {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        usedCells.add(`${xx},${yy}`);
      }
    }
  };

  const canPlace = (x, y, w = 1, h = 1, roomObj) => {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        if (xx < roomObj.x1 || xx > roomObj.x2 || yy < roomObj.y1 || yy > roomObj.y2) return false;
        if (usedCells.has(`${xx},${yy}`)) return false;
      }
    }
    return true;
  };

  const placeInRoom = (roomId, item) => {
    const r = HQ_ROOMS.find((rm) => rm.id === roomId);
    if (!r) return false;
    const w = item.w || 1;
    const h = item.h || 1;
    for (let y = r.y1; y <= r.y2; y++) {
      for (let x = r.x1; x <= r.x2; x++) {
        if (canPlace(x, y, w, h, r)) {
          occupy(x, y, w, h);
          items.push({ ...item, x, y, w, h });
          return true;
        }
      }
    }
    return false;
  };

  // 1. Escaleras en R14 (Inicio)
  placeInRoom('R14', { type: 'stairs', w: 2, h: 2, label: 'Escaleras de Entrada' });

  // 2. Cámara de Alquimia Única Opcional (~72% de probabilidad; 100% en Laboratorio Alquímico)
  // Solo 1 por misión, protegida por puerta Cerrada con Llave, Sello de Puzzle o Puerta Secreta
  const hasAlchemyChamber = biome.id === 'laboratorio_alquimico' || Math.random() < 0.72;
  const alchemyRoomId = hasAlchemyChamber ? pick(['R5', 'R7', 'R18', 'R21']) : null;
  const alchemySeal = hasAlchemyChamber
    ? alchemyRoomId === 'R21'
      ? 'secreta'
      : pick(['cerrada', 'sello_puzzle'])
    : null;

  // Puertas coherentes en todas las salas activas (con estados tácticos)
  const activeRooms = ['R14', 'R15', 'R12', 'R13', 'R4', 'R5', 'R1', 'R2', 'R11', 'R7', 'R10', 'R18', 'R21'];
  ROOM_DOORS_PRESETS.filter((d) => activeRooms.includes(d.room)).forEach((d, idx) => {
    let doorState;
    if (d.room === alchemyRoomId && alchemySeal && alchemySeal !== 'secreta') {
      doorState = DOOR_STATES.find((ds) => ds.id === alchemySeal) || DOOR_STATES[1];
    } else if (d.room === 'R11') {
      doorState = pick(DOOR_STATES.filter((ds) => ['cerrada', 'atrancada', 'sello_puzzle'].includes(ds.id)));
    } else if (idx % 4 === 0) {
      doorState = pick(DOOR_STATES.filter((ds) => ds.id !== 'normal'));
    } else {
      doorState = DOOR_STATES[0];
    }
    items.push({
      type: 'door',
      x: d.x,
      y: d.y,
      edge: d.edge,
      doorState: doorState.id,
      label:
        d.room === alchemyRoomId
          ? `Puerta de Alquimia · ${doorState.label} (${doorState.badge})`
          : `${doorState.label} (${doorState.badge})`,
    });
  });

  // 1 Puerta Secreta garantizada hacia R21 (almacén secreto)
  items.push({
    type: 'secret_door',
    x: 20,
    y: 16,
    edge: 'E',
    label: alchemyRoomId === 'R21' ? 'Puerta Secreta a la Cámara de Alquimia' : 'Puerta Secreta al Almacén',
  });

  // 3. Mobiliario temático del Bioma + Cofres (dimensiones exactas HeroQuest 2021)
  const nonAlchemyFurniture = biome.furniturePool.filter((f) => f !== 'alchemy_bench');
  const furnRooms = ['R15', 'R12', 'R5', 'R1', 'R7', 'R10', 'R18', 'R21'];
  furnRooms.forEach((rId) => {
    if (rId === alchemyRoomId) {
      placeInRoom(rId, {
        type: 'alchemy_bench',
        w: 3,
        h: 2,
        label: 'Mesa de Alquimia 3×2 (Única en la misión)',
        note: 'Los héroes pueden craftear pociones, antídotos y venenos aquí (tirada d20 de Arcano).',
      });
    } else {
      const fType = pick(nonAlchemyFurniture.length > 0 ? nonAlchemyFurniture : ['table', 'chest', 'bookcase']);
      const is3x2 = ['table', 'sorcerer_table', 'torture_rack', 'tomb'].includes(fType);
      const is3x1 = ['weapon_rack', 'bookcase', 'cupboard', 'fireplace'].includes(fType);
      const w = is3x2 || is3x1 ? 3 : 1;
      const h = is3x2 ? 2 : 1;
      placeInRoom(rId, { type: fType, w, h });
    }
    if (rId === 'R1' || rId === 'R21' || rId === 'R11') {
      placeInRoom(rId, { type: 'chest', w: 1, h: 1, label: 'Cofre del Tesoro' });
    }
  });

  // 4. Monstruos en salas laterales adaptados dinámicamente al número de jugadores (1 a 6)
  const combatRooms =
    partySize === 1
      ? ['R15', 'R12', 'R5', 'R2', 'R7', 'R18'] // En solitario deja más salas de respiro/exploración
      : ['R15', 'R12', 'R4', 'R5', 'R1', 'R2', 'R7', 'R10', 'R18'];
  const baseCount = partySize === 1 ? 1 : partySize === 2 ? 1 : partySize >= 5 ? 3 : 2;
  combatRooms.forEach((rId, idx) => {
    const count =
      partySize === 1
        ? 1
        : idx % 3 === 0
        ? baseCount + 1
        : baseCount;
    for (let i = 0; i < count; i++) {
      const mType = pick(biome.monsterPool);
      const alertState = pick(ALERTNESS_LIST);
      placeInRoom(rId, {
        type: mType,
        alertness: alertState,
        label: `${mType.toUpperCase()} [${alertState}]`,
      });
    }
  });

  // 5. Sala del Jefe Central (R11) + Trono/Altar + Escoltas según jugadores
  placeInRoom('R11', { type: 'throne', w: 1, h: 1, label: 'Trono / Foco del Jefe' });
  placeInRoom('R11', { type: 'chest', w: 1, h: 1, label: 'Cofre de Reliquia' });
  const bossType = pick(biome.bossPool);
  placeInRoom('R11', {
    type: bossType,
    isBoss: true,
    alertness: 'Guardia',
    label: `JEFE: ${bossName}`,
  });
  const bossEscorts = partySize === 1 ? 0 : partySize === 2 ? 1 : Math.max(2, partySize - 1);
  for (let i = 0; i < bossEscorts; i++) {
    placeInRoom('R11', {
      type: pick(biome.monsterPool),
      alertness: 'Guardia',
      label: 'Escolta del Jefe',
    });
  }

  // 6. NPC / Prisionero en R10 o R1
  placeInRoom(plot.id === 'rescate' ? 'R10' : 'R1', {
    type: 'npc',
    label: plot.id === 'rescate' ? 'Prisionero a Rescatar (Objetivo)' : 'Explorador Herido (Misión Secundaria)',
  });

  // 7. Trampas tácticas en pasillos y accesos
  items.push(
    { type: 'trap_pit', x: 9, y: 12, label: 'Foso Oculto (DES CD 13)' },
    { type: 'trap_spear', x: 12, y: 6, label: 'Trampa de Lanza (DES CD 13)' },
    { type: 'trap_pit', x: 16, y: 9, label: 'Trampa de Foso Este (DES CD 14)' }
  );

  // Notas de sala estructuradas (compatibles 100% con TacticalBoard SVG y pestaña Notas)
  const notes = [
    {
      code: 'A',
      room: 'R14',
      title: `Inicio — ${biome.name}`,
      text: `${biome.ambientFlavor} Regla del Bioma: ${biome.globalRule}`,
    },
    {
      code: 'B',
      room: 'R11',
      title: `Cámara del Jefe: ${bossName}`,
      text: `Clímax: ${plot.climaxRule} | Giro: ${twist}`,
    },
    {
      code: 'C',
      room: 'R21',
      title: 'Almacén Secreto',
      text: 'Tras la puerta secreta hay un Cofre con +2 Materiales de Crafteo del bioma.',
    },
    {
      code: 'D',
      room: plot.id === 'rescate' ? 'R10' : 'R1',
      title: plot.id === 'rescate' ? 'Prisionero (Objetivo)' : 'Explorador Herido (Secundario)',
      text: plot.id === 'rescate'
        ? 'Libera al prisionero y escóltalo de vuelta a R14 para completar la misión.'
        : 'Ayuda al explorador para ganar +1 Ficha de Reputación.',
    },
  ];
  const hazardCodes = ['E', 'F', 'G'];
  Object.entries(hazardAssignments).forEach(([rId, haz], idx) => {
    notes.push({
      code: hazardCodes[idx] || 'H',
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
    startRoom: 'R14',
    isProcedural: true,
    biomeId: biome.id,
    biomeRule: biome.globalRule,
    hazardRooms: hazardAssignments,
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
} = {}) {
  const biome =
    biomeId === 'random'
      ? pick(PROCEDURAL_BIOMES)
      : PROCEDURAL_BIOMES.find((b) => b.id === biomeId) || PROCEDURAL_BIOMES[0];

  const plot =
    plotId === 'random'
      ? pick(QUEST_PLOTS)
      : QUEST_PLOTS.find((p) => p.id === plotId) || QUEST_PLOTS[0];

  const twist = pick(QUEST_TWISTS);
  const sideObjective = pick(SIDE_OBJECTIVES);
  const bossName = nemesis ? `${nemesis.name} (Némesis Nv.${nemesis.rank || 2})` : pick(BOSS_NAMES);
  const id = `proc-q-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;

  const title = arcInfo
    ? `${arcInfo.arcTitle} — Parte ${arcInfo.partNumber}/${arcInfo.totalParts}`
    : nemesis
    ? `Venganza contra ${nemesis.name}`
    : `${pick(QUEST_TITLES_PREFIX)} ${pick(QUEST_PLACES)}`;

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

  const narrative = buildQuestNarrative({
    biome,
    plot,
    title,
    bossName,
    arcInfo,
    nemesis,
  });

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
    hazardRooms: hazardAssignments,
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

export function generateProceduralEvilWizard(level = 1, missionContext = null) {
  const cd = 11 + Math.floor(level / 2);
  const biome = missionContext?.biomeId
    ? PROCEDURAL_BIOMES.find((b) => b.id === missionContext.biomeId)
    : null;
  const ctxPrefix = biome
    ? `[${biome.icon} ${biome.name}] `
    : '';
  const bossMention = missionContext?.bossName
    ? ` (eco de ${missionContext.bossName})`
    : '';
  return {
    id: `proc-ew-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: `${pick(EW_SUBJECTS)} (Nv.${level})`,
    type: pick(['Emboscada', 'Hechizo', 'Trampa', 'Maldición']),
    rarity: pick(['Común', 'Inusual', 'Rara']),
    text: `${ctxPrefix}${pick(EW_TRIGGERS)}, ${pick(EW_EFFECTS).replace('CD 13', `CD ${cd}`)}${bossMention}`,
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
  const cd = 11 + Math.floor(level / 2);
  const gold = randInt(3, 8) * 10 + level * 15;
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
  const cd = 11 + Math.floor(level / 2);
  const gold = randInt(2, 6) * 15 + level * 10;
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
