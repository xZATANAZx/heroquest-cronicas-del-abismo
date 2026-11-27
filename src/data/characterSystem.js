// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// Base de datos de Creación de Personajes, Niveles, Equipo y Magia
// ============================================================================

// ============================================================================
// 4 PILARES SIMPLIFICADOS (HQ-D20 v6 — Sin matemáticas tediosas de D&D)
// Cada héroe tiene bonos directos de +0 a +4 que se suman directo a 1d20
// ============================================================================
export const ATTRIBUTES = [
  {
    id: 'FUE',
    name: 'Fuerza',
    short: 'FUE',
    icon: '💪',
    color: 'text-rose-300',
    desc: 'Potencia física, forzar puertas atrancadas, empujar enemigos, cargar cofres y resistir golpes o venenos.',
  },
  {
    id: 'AGI',
    name: 'Agilidad',
    short: 'AGI',
    icon: '⚡',
    color: 'text-emerald-300',
    desc: 'Sigilo en pasillos, esquivar trampas, desarmar cerraduras, moverte entre enemigos y acrobacias.',
  },
  {
    id: 'MEN',
    name: 'Mente',
    short: 'MEN',
    icon: '🧠',
    color: 'text-sky-300',
    desc: 'Magia, alquimia, puzzles, detectar puertas secretas, medicina y resistir Shock o Miedo.',
  },
  {
    id: 'SUE',
    name: 'Suerte',
    short: 'SUE',
    icon: '🍀',
    color: 'text-amber-300',
    desc: 'Negociación en Ciudad, botín en eventos, destilar pociones por fortuna y salir vivo de situaciones imposibles.',
  },
];

// Compatible tanto con los 4 Pilares directos (+0..+4) como con fichas antiguas (8..20)
export const getModifier = (score) => {
  const n = Number(score ?? 0);
  if (n <= 5 && n >= -2) return Math.round(n);
  return Math.floor((n - 10) / 2);
};

export const formatMod = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

export const STANDARD_ARRAY = [3, 2, 1, 0];

// Convierte cualquier héroe (nuevo de 4 Pilares o antiguo de 6 atributos D&D) a los 4 Pilares limpios
export function getHeroPillars(hero) {
  const raw = hero?.attributes || {};
  if (raw.AGI !== undefined || raw.MEN !== undefined || raw.SUE !== undefined) {
    return {
      FUE: getModifier(raw.FUE ?? 1),
      AGI: getModifier(raw.AGI ?? 1),
      MEN: getModifier(raw.MEN ?? 1),
      SUE: getModifier(raw.SUE ?? 1),
    };
  }
  // Mapeo automático para héroes creados en v1–v5
  const fue = getModifier(raw.FUE ?? 10);
  const con = getModifier(raw.CON ?? 10);
  const des = getModifier(raw.DES ?? 10);
  const int = getModifier(raw.INT ?? 10);
  const sab = getModifier(raw.SAB ?? 10);
  const car = getModifier(raw.CAR ?? 10);
  return {
    FUE: Math.max(0, Math.min(4, Math.round((fue + con) / 2) + 1)),
    AGI: Math.max(0, Math.min(4, des + 1)),
    MEN: Math.max(0, Math.min(4, Math.round((int + sab) / 2) + 1)),
    SUE: Math.max(0, Math.min(4, car + 1)),
  };
}

// Calcula los 4 Pilares base recomendados según Clase y Raza (sin reparto manual tedioso)
export function computeClassRacePillars(cls, race) {
  const pillars = { FUE: 1, AGI: 1, MEN: 1, SUE: 1 };
  const primaries = cls?.primaryAttrs || [];
  const mapToPillar = (a) => {
    if (a === 'FUE' || a === 'CON') return 'FUE';
    if (a === 'DES' || a === 'AGI') return 'AGI';
    if (a === 'INT' || a === 'SAB' || a === 'MEN') return 'MEN';
    return 'SUE';
  };
  if (primaries[0]) pillars[mapToPillar(primaries[0])] += 2;
  if (primaries[1]) pillars[mapToPillar(primaries[1])] += 1;
  // Bono racial (+1 al pilar principal de la raza)
  const rBonuses = race?.bonuses || {};
  const topRaceAttr = Object.entries(rBonuses).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (topRaceAttr) {
    const p = mapToPillar(topRaceAttr);
    pillars[p] = Math.min(4, pillars[p] + 1);
  }
  return pillars;
}

// Habilidades resumidas y ligadas a los 4 Pilares (solo referencia clara, sin listas eternas)
export const SKILLS = [
  { id: 'atletismo', name: 'Atletismo y Aguante', attr: 'FUE', desc: 'Forzar puertas, saltar fosos, empujar enemigos y resistir venenos o golpes.' },
  { id: 'sigilo', name: 'Sigilo y Trampas', attr: 'AGI', desc: 'Moverse sin subir el Caos, iniciativa, esquivar y desarmar trampas/cofres.' },
  { id: 'arcano', name: 'Mente, Magia y Secretos', attr: 'MEN', desc: 'Hallar puertas secretas, resolver puzzles, alquimia, curar y resistir Shock/Miedo.' },
  { id: 'persuasion', name: 'Suerte y Negociación', attr: 'SUE', desc: 'Tratos en Ciudad, convencer monstruos, destilar pociones por fortuna y botín.' },
];

// ============================================================================
// CATÁLOGO COMPLETO DE ESTADOS ACTIVOS (Negativos y Positivos — Ilustrados)
// ============================================================================
export const STATUS_CATALOG = [
  // --- ESTADOS NEGATIVOS (DEBUFFS) ---
  {
    id: 'sangrado',
    name: 'Sangrado',
    icon: '🩸',
    type: 'debuff',
    color: 'bg-red-950/80 border-red-600/80 text-red-200',
    effect: 'Pierdes 1 PC al inicio de cada uno de tus turnos.',
    cure: 'Se cura con cualquier Curación, Poción, Venda o al terminar el combate.',
  },
  {
    id: 'quemadura',
    name: 'Quemadura',
    icon: '🔥',
    type: 'debuff',
    color: 'bg-orange-950/80 border-orange-500/80 text-orange-200',
    effect: 'Pierdes 1 PC al final de tu turno y sufres -1 DC de Defensa por el dolor.',
    cure: 'Gasta 1 acción en apagar las llamas o usa Agua/Curación.',
  },
  {
    id: 'congelado',
    name: 'Congelado',
    icon: '❄️',
    type: 'debuff',
    color: 'bg-cyan-950/80 border-cyan-500/80 text-cyan-200',
    effect: 'Tu movimiento se reduce a la mitad y no puedes atacar en diagonal.',
    cure: 'Dura 2 turnos o se rompe al recibir calor/Fuego o superar FUE CD 12.',
  },
  {
    id: 'envenenado',
    name: 'Envenenado',
    icon: '☠️',
    type: 'debuff',
    color: 'bg-lime-950/80 border-lime-600/80 text-lime-200',
    effect: 'Tiras -1 Dado de Combate al atacar y sufres Desventaja en pruebas físicas.',
    cure: 'Antídoto, Curación sagrada o superar FUE CD 12 al final de tu turno.',
  },
  {
    id: 'aturdido',
    name: 'Aturdido',
    icon: '💫',
    type: 'debuff',
    color: 'bg-yellow-950/80 border-yellow-500/80 text-yellow-200',
    effect: 'Pierdes tu acción principal este turno y defiendes con -1 DC.',
    cure: 'Se pasa automáticamente al terminar tu turno afectado.',
  },
  {
    id: 'shock',
    name: 'Estado de Shock',
    icon: '🧠',
    type: 'debuff',
    color: 'bg-purple-950/80 border-purple-500/80 text-purple-200',
    effect: 'Al llegar a 0 PM: solo atacas con 1 DC, defiendes con 2 DC y mueves 1 dado rojo.',
    cure: 'Recupera al menos 1 PM (Poción de Clarividencia, Bardo o Hechizo) o descansa en Ciudad.',
  },
  {
    id: 'miedo',
    name: 'Miedo',
    icon: '😱',
    type: 'debuff',
    color: 'bg-indigo-950/80 border-indigo-500/80 text-indigo-200',
    effect: 'Solo puedes atacar con 1 Dado de Combate contra el enemigo que te asustó.',
    cure: 'Supera Mente (MEN CD 12) al inicio de tu turno o mata al enemigo.',
  },
  {
    id: 'inmovilizado',
    name: 'Inmovilizado',
    icon: '🕸️',
    type: 'debuff',
    color: 'bg-stone-900/90 border-stone-500/80 text-stone-200',
    effect: 'Tu movimiento es 0 (telaraña, cepo o raíces). Aún puedes atacar o lanzar magia.',
    cure: 'Gasta tu acción en romperlo (FUE o AGI CD 12) o dura 1–2 turnos.',
  },
  {
    id: 'maldicion',
    name: 'Maldición',
    icon: '💀',
    type: 'debuff',
    color: 'bg-fuchsia-950/80 border-fuchsia-600/80 text-fuchsia-200',
    effect: 'Los Escudos Negros te perjudican y sufres -1 a todas tus tiradas d20.',
    cure: 'Purificación en el Templo, Agua Bendita o hechizo de Curación/Luz.',
  },

  // --- ESTADOS POSITIVOS (BUFFS) ---
  {
    id: 'furia',
    name: 'Furia',
    icon: '💢',
    type: 'buff',
    color: 'bg-rose-900/70 border-rose-500/70 text-rose-100',
    effect: '+1 Dado de Combate en ataques cuerpo a cuerpo y reduces 1 punto el daño físico.',
    cure: 'Dura 3 turnos de combate.',
  },
  {
    id: 'coraje',
    name: 'Coraje',
    icon: '⚔️',
    type: 'buff',
    color: 'bg-amber-900/70 border-amber-500/70 text-amber-100',
    effect: '+2 Dados de Combate en ataques cuerpo a cuerpo mientras haya monstruos visibles.',
    cure: 'Termina cuando no queden enemigos en Línea de Visión.',
  },
  {
    id: 'piel_roca',
    name: 'Piel de Roca',
    icon: '🪨',
    type: 'buff',
    color: 'bg-emerald-900/70 border-emerald-500/70 text-emerald-100',
    effect: '+1 Dado de Defensa adicional contra todos los golpes.',
    cure: 'Se rompe cuando recibes 1 punto de daño real (o tras 3 turnos).',
  },
  {
    id: 'viento_veloz',
    name: 'Viento Veloz',
    icon: '💨',
    type: 'buff',
    color: 'bg-sky-900/70 border-sky-500/70 text-sky-100',
    effect: '+3 casillas de movimiento e ignoras Terreno Difícil.',
    cure: 'Dura 2 turnos.',
  },
  {
    id: 'niebla',
    name: 'Forma de Niebla',
    icon: '🌫️',
    type: 'buff',
    color: 'bg-teal-900/70 border-teal-500/70 text-teal-100',
    effect: 'Puedes atravesar casillas ocupadas por monstruos sin provocar ataques.',
    cure: 'Dura 1 turno.',
  },
  {
    id: 'bendecido',
    name: 'Bendecido',
    icon: '✨',
    type: 'buff',
    color: 'bg-yellow-900/70 border-yellow-400/70 text-yellow-100',
    effect: 'Ventaja en tu próxima tirada d20 y tus ataques dañan normalmente a Etéreos/No Muertos.',
    cure: 'Dura hasta finalizar el combate actual.',
  },
  {
    id: 'oculto',
    name: 'Oculto (Sigilo)',
    icon: '🌑',
    type: 'buff',
    color: 'bg-slate-800/90 border-slate-500/80 text-slate-100',
    effect: 'Los enemigos no te ven: tu próximo ataque suma +1 DC y no subes el Caos al moverte.',
    cure: 'Termina en cuanto atacas o abres una puerta ruidosa.',
  },
];

export const getStatusInfo = (idOrLabel) => {
  const key = `${idOrLabel || ''}`.toLowerCase();
  return (
    STATUS_CATALOG.find(
      (s) => s.id === key || key.includes(s.id) || key.includes(s.name.toLowerCase())
    ) || null
  );
};

export const RACES = [
  {
    id: 'humano',
    name: 'Humano del Imperio',
    icon: '🛡️',
    bonuses: { FUE: 1, SUE: 1 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Mediano',
    vision: 'Normal',
    traitName: 'Determinación Imperial',
    traitDesc: '1 vez por misión puedes repetir una tirada fallida de d20 y quedarte con el mejor resultado.',
    lore: 'Versátiles y ambiciosos, los hijos del Imperio se adaptan a cualquier clase y forjan su leyenda a base de voluntad.',
  },
  {
    id: 'enano',
    name: 'Enano de las Montañas',
    icon: '⛏️',
    bonuses: { FUE: 2 },
    freeBonus: 0,
    speedMod: -1,
    size: 'Mediano (Robusto)',
    vision: 'Visión en la Oscuridad (6 casillas)',
    traitName: 'Sangre de Piedra y Forja',
    traitDesc: 'Empiezas con +1 PC máximo permanente. Tienes Ventaja en tiradas de Salvación contra venenos y al intentar Desarmar Trampas mecánicas.',
    lore: 'Forjados bajo la roca eterna, son duros de matar y maestros naturales en hachas, armaduras y trampas.',
  },
  {
    id: 'alto_elfo',
    name: 'Alto Elfo de Elethorn',
    icon: '✨',
    bonuses: { MEN: 2, AGI: 1 },
    freeBonus: 0,
    speedMod: 1,
    size: 'Mediano',
    vision: 'Visión en la Penumbra',
    traitName: 'Herencia de la Luna',
    traitDesc: 'Empiezas con +1 PM máximo permanente, eres inmune a hechizos de Sueño mágico y puedes lanzar 1 rayo mágico menor (1 DC a distancia) 1 vez por combate aunque no seas mago.',
    lore: 'Guardianes ancestrales de Elethorn, unen la agilidad de la espada con el dominio natural de la magia.',
  },
  {
    id: 'elfo_silvano',
    name: 'Elfo Silvano',
    icon: '🏹',
    bonuses: { AGI: 2, MEN: 1 },
    freeBonus: 0,
    speedMod: 1,
    size: 'Mediano',
    vision: 'Visión en la Penumbra',
    traitName: 'Paso del Bosque',
    traitDesc: 'Ignoras el coste extra de Terreno difícil (escombros, telarañas, agua) y tienes Ventaja en pruebas de Agilidad (AGI) y Mente (MEN) (rastrear y evitar emboscadas en viajes).',
    lore: 'Rápidos como el viento entre los árboles, cazan a las hordas del Terror antes de que puedan reaccionar.',
  },
  {
    id: 'mediano',
    name: 'Mediano (Halfling)',
    icon: '🍀',
    bonuses: { AGI: 1, SUE: 2 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Pequeño',
    vision: 'Normal',
    traitName: 'Suerte Insolente',
    traitDesc: 'Una vez por combate puedes repetir un 1 natural en un d20 o repetir 1 Dado de Combate fallido. Por tu tamaño pequeño, puedes pasar por casillas ocupadas por monstruos grandes.',
    lore: 'Subestimados por su estatura, salen vivos de las peores trampas gracias a su ingenio y buena fortuna.',
  },
  {
    id: 'semiorco',
    name: 'Semiorco Errante',
    icon: '🪓',
    bonuses: { FUE: 2 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Mediano (Corpulento)',
    vision: 'Visión en la Oscuridad (6 casillas)',
    traitName: 'Resistencia Implacable',
    traitDesc: 'Una vez por misión, cuando un golpe te deje en 0 PC, en lugar de caer derrotado te mantienes de pie con 1 PC y ganas +1 DC extra en tu próximo ataque.',
    lore: 'Desterrados de ambos mundos, canalizan su resistencia brutal contra los ejércitos de Zargon.',
  },
  {
    id: 'draconido',
    name: 'Sangre de Dragón',
    icon: '🐉',
    bonuses: { FUE: 2, SUE: 1 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Mediano (Escamoso)',
    vision: 'Normal',
    traitName: 'Aliento de Dragón (1 vez por misión)',
    traitDesc: 'Al crear tu héroe eliges tu linaje: Fuego o Hielo. Una vez por misión, gastas tu acción principal para exhalar tu aliento en línea recta hasta 3 casillas frente a ti: golpea a todos los enemigos en esa línea con 2 DC de daño mágico (si el enemigo supera Agilidad AGI CD 12 recibe solo la mitad). Si es Fuego, además corta la regeneración de Momias y Trolls.',
    lore: 'Descendientes de antiguos dragones con escamas resistentes; imponen respeto y desatan furia elemental en momentos críticos.',
  },
  {
    id: 'tocado_caos',
    name: 'Tocado por el Velo (Tiefling)',
    icon: '🔥',
    bonuses: { MEN: 1, SUE: 2 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Mediano',
    vision: 'Visión en la Oscuridad (8 casillas)',
    traitName: 'Resistencia del Abismo',
    traitDesc: 'Reduces en 1 punto todo el daño que recibas por fuego o magia del Terror (mínimo 1 de daño). Además tienes Ventaja en pruebas de Fuerza (FUE) y Suerte (SUE).',
    lore: 'Marcados por la sombra de Zargon pero juramentados a destruir el mal desde sus propias profundidades.',
  },
  {
    id: 'gnomo',
    name: 'Gnomo Alquimista',
    icon: '⚗️',
    bonuses: { MEN: 2, AGI: 1 },
    freeBonus: 0,
    speedMod: -1,
    size: 'Pequeño',
    vision: 'Visión en la Oscuridad (6 casillas)',
    traitName: 'Ingenio Explosivo',
    traitDesc: 'Tienes Ventaja en pruebas de Mente (MEN) en alquimia y secretos (hallar secretos y mecanismos). Empiezas con +1 Hierba Lunar y +1 Polvo Rúnico extra.',
    lore: 'Inventores brillantes apasionados por pociones, mecanismos antiguos y fórmulas explosivas.',
  },
  {
    id: 'goliat',
    name: 'Goliat de las Cumbres',
    icon: '🏔️',
    bonuses: { FUE: 2 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Grande (Imponente)',
    vision: 'Normal',
    traitName: 'Piel de Granito',
    traitDesc: 'Una vez por combate, como reacción, reduces en 1 punto (o a la mitad si es mayor) el daño de un ataque físico recibido. Además los monstruos medianos nunca pueden empujarte.',
    lore: 'Guerreros gigantes de las montañas heladas, construidos para resistir los golpes más devastadores.',
  },
  {
    id: 'elfo_oscuro',
    name: 'Elfo Oscuro Rebelde (Drow)',
    icon: '🌑',
    bonuses: { AGI: 1, SUE: 2 },
    freeBonus: 0,
    speedMod: 1,
    size: 'Mediano',
    vision: 'Visión en la Oscuridad Superior (10 casillas)',
    traitName: 'Fuego Feérico (1 vez por misión)',
    traitDesc: 'Como acción gratuita, envuelves en luz violeta a 1 enemigo visible durante 2 rondas: tú y todos tus aliados tienen Ventaja al atacarlo y no puede volverse invisible ni esconderse.',
    lore: 'Desertores de las cavernas profundas que dominan la oscuridad y las tácticas de emboscada.',
  },
  {
    id: 'licantropo_jur',
    name: 'Sangre de Lobo (Cambiaformas)',
    icon: '🐺',
    bonuses: { FUE: 1, AGI: 1, MEN: 1 },
    freeBonus: 0,
    speedMod: 1,
    size: 'Mediano',
    vision: 'Olfato Agudo y Penumbra',
    traitName: 'Instinto Lupino',
    traitDesc: 'Tienes Ventaja en pruebas de Mente (MEN). Una vez por combate, como acción gratuita, desatas tus garras por 2 turnos ganando +1 DC en ataque cuerpo a cuerpo y +2 casillas de movimiento.',
    lore: 'Cazadores que domaron la maldición lunar para convertir su ferocidad en arma contra Zargon.',
  },
  {
    id: 'semielfo',
    name: 'Semielfo Diplomático',
    icon: '🌿',
    bonuses: { CAR: 2, DES: 1 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Mediano',
    vision: 'Visión en la Penumbra',
    traitName: 'Vínculo de Dos Mundos',
    traitDesc: 'Tienes Ventaja en Suerte (SUE) (negociar con monstruos inteligentes y descuentos en Ciudad). Cuando ayudas a un aliado en una prueba d20, le otorgas +2 adicional.',
    lore: 'Puente entre humanos y elfos; maestros en unir al grupo y resolver conflictos con ingenio.',
  },
  {
    id: 'aasimar',
    name: 'Aasimar (Hijo del Alba)',
    icon: '🌟',
    bonuses: { MEN: 2, SUE: 1 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Mediano',
    vision: 'Visión en la Penumbra',
    traitName: 'Toque del Alba (1 vez por misión)',
    traitDesc: 'Como acción gratuita junto a un aliado, le restauras 2 PC (o sumas +1 DC radiante contra No Muertos/Espectros este turno).',
    lore: 'Portadores de una chispa celestial que brilla con fuerza en las criptas más oscuras.',
  },
  {
    id: 'hombre_lagarto',
    name: 'Hombre Lagarto (Escama Pantanosa)',
    icon: '🦎',
    bonuses: { FUE: 2, MEN: 1 },
    freeBonus: 0,
    speedMod: 0,
    size: 'Mediano (Escamoso)',
    vision: 'Visión en la Penumbra',
    traitName: 'Escamas Naturales y Pantano',
    traitDesc: 'Tu defensa base sin armadura nunca es menor a 2 DC (3 DC con escudo). Ignoras Terreno Difícil de agua, barro o salas inundadas.',
    lore: 'Guerreros curtidos de las ciénegas, implacables en terrenos donde otros quedan atrapados.',
  },
  {
    id: 'feliniano',
    name: 'Feliniano (Tabaxi Explorador)',
    icon: '🐆',
    bonuses: { AGI: 1, SUE: 2 },
    freeBonus: 0,
    speedMod: 1,
    size: 'Mediano (Ágil)',
    vision: 'Visión en la Oscuridad (6 casillas)',
    traitName: 'Zarpazo Veloz (1 vez por combate)',
    traitDesc: 'Como acción gratuita, duplicas tu movimiento este turno (+4 casillas en exploración) y ganas +1 permanente a Mente (MEN).',
    lore: 'Curiosos, veloces y letales en el flanqueo; aparecen donde el enemigo menos lo espera.',
  },
];

export const CLASSES = [
  {
    id: 'barbaro',
    name: 'Bárbaro del Norte',
    role: 'Vanguardia / Daño Bruto',
    miniature: 'Bárbaro (Juego Base)',
    icon: '⚔️',
    basePC: 8,
    basePM: 2,
    pcPerLevel: 2,
    pmPerLevel: 0,
    baseAttackDice: 3,
    baseDefendDice: 2,
    resourceName: 'Furia (2/misión)',
    primaryAttrs: ['FUE', 'AGI'],
    proficientSkills: ['atletismo', 'intimidacion', 'supervivencia'],
    startingGear: ['Espada Ancha (3 DC)', 'Daga Arrojadiza (1 DC)', 'Poción de Curación Menor'],
    coreAbility: 'Furia Salvaje: Como acción gratuita, durante 3 turnos añades +1 Dado de Combate a tus ataques cuerpo a cuerpo y reduces 1 punto el daño físico recibido.',
    subclasses: [
      { id: 'berserker', name: 'Senda del Berserker', desc: 'En Furia puedes realizar un ataque adicional al derrotar un enemigo (1 vez por turno).' },
      { id: 'totem', name: 'Guardián del Tótem Oso', desc: 'En Furia ganas +1 Dado de Defensa y eres inmune al estado de Shock o Miedo.' },
    ],
    progression: {
      1: 'Furia Salvaje (2 usos/misión)',
      2: 'Ataque Temerario (ganas Ventaja en ataque, pero enemigos tienen Ventaja contra ti hasta tu turno)',
      3: 'Elección de Subclase + +1 uso de Furia',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4) + Empuje Brutal (empuja 2 casillas)',
      5: 'Golpe Devastador (sacar 19-20 en Dado de Destino es Calavera Crítica)',
      6: 'Piel de Acero (+1 Dado de Defensa sin armadura pesada)',
      7: 'Instinto Salvaje (Ventaja en tu primer ataque de cada combate)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Furia Imparable (4 usos/misión, +2 DC en el primer golpe en Furia)',
      10: 'Campeón del Norte (1 vez/misión atacas a TODOS los enemigos adyacentes con +1 DC)',
    },
  },
  {
    id: 'caballero',
    name: 'Caballero del Guardián',
    role: 'Tanque / Protector',
    miniature: 'Caballero (La Luna del Terror) o Bárbaro',
    icon: '🛡️',
    basePC: 7,
    basePM: 3,
    pcPerLevel: 2,
    pmPerLevel: 1,
    baseAttackDice: 2,
    baseDefendDice: 3,
    resourceName: 'Determinación (3 pts)',
    primaryAttrs: ['FUE', 'SUE'],
    proficientSkills: ['atletismo', 'persuasion', 'percepcion'],
    startingGear: ['Espada Corta (2 DC)', 'Escudo de Hierro (+1 Def)', 'Cota de Malla (+1 Def)'],
    coreAbility: 'Escudo del Guardián: Como reacción cuando un aliado adyacente vaya a recibir daño, interceptas el golpe usando tus Dados de Defensa.',
    subclasses: [
      { id: 'paladin', name: 'Juramento de la Luz', desc: 'Gastas 1 Determinación para añadir +2 DC contra No Muertos/Demonios o curar 2 PC a un aliado.' },
      { id: 'comandante', name: 'Comandante Táctico', desc: 'Gastas 1 Determinación para otorgar un movimiento o ataque gratuito a un aliado en línea de visión.' },
    ],
    progression: {
      1: 'Escudo del Guardián + Postura Defensiva',
      2: 'Desafío del Caballero (obliga a un enemigo en 3 casillas a atacarte a ti)',
      3: 'Elección de Subclase + Determinación sube a 4 pts',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Muro Inquebrantable (los Escudos Negros en tu defensa ahora bloquean daño igual que blancos 1 vez/turno)',
      6: 'Aura de Valor (aliados en 2 casillas tienen Ventaja contra Miedo y Shock)',
      7: 'Contraataque con Escudo (si bloqueas todo el daño, haces 1 ataque gratis de 2 DC)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Bastión Viviente (+1 Dado de Defensa permanente con escudo)',
      10: 'Leyenda de Elethorn (1 vez/misión anulas completamente un ataque o hechizo de Jefe contra el grupo)',
    },
  },
  {
    id: 'enano_ingeniero',
    name: 'Ingeniero de Batalla / Forjador',
    role: 'Especialista / Trampas / Soporte',
    miniature: 'Enano o Artificiero (Juego Base)',
    icon: '🔧',
    basePC: 7,
    basePM: 3,
    pcPerLevel: 2,
    pmPerLevel: 1,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Cargas de Forja (3/misión)',
    primaryAttrs: ['FUE', 'MEN'],
    proficientSkills: ['trampas', 'investigacion', 'atletismo'],
    startingGear: ['Hacha de Mano (2 DC)', 'Kit de Herramientas Maestras', 'Bomba de Humo (1 uso)'],
    coreAbility: 'Maestro de Trampas y Runas: Desarmas trampas con Ventaja (sin necesitar herramientas) y puedes gastar 1 Carga de Forja para imbuir un arma (+1 DC por 2 turnos) o reparar armadura.',
    subclasses: [
      { id: 'artificiero', name: 'Artificiero de Pólvora', desc: 'Puedes fabricar minas rúnicas y atacar a distancia con arcabuz o granadas de 3 DC en área.' },
      { id: 'clerigo_forja', name: 'Clérigo de la Forja', desc: 'Aprende 3 plegarias de curación y protección rúnica usando tus PM.' },
    ],
    progression: {
      1: 'Maestro de Trampas + Cargas de Forja (3)',
      2: 'Ojo de Piedra (detectas puertas secretas en 3 casillas automáticamente al buscar)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Armadura Reforzada (tu armadura no penaliza movimiento)',
      6: 'Trampa Improvisada (colocas una trampa de 3 DC en una casilla adyacente)',
      7: 'Cargas de Forja suben a 5/misión',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Runa de Invulnerabilidad (1 vez/misión absorbe 3 PC de daño en un aliado)',
      10: 'Obra Maestra (tu arma principal gana +1 DC permanente y propiedad Mágica)',
    },
  },
  {
    id: 'picaro',
    name: 'Pícaro de las Sombras',
    role: 'Asesino / Movilidad / Sigilo',
    miniature: 'Pícaro o Asesino (La Luna del Terror)',
    icon: '🗡️',
    basePC: 5,
    basePM: 4,
    pcPerLevel: 1,
    pmPerLevel: 1,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Astucia (3 pts)',
    primaryAttrs: ['AGI', 'SUE'],
    proficientSkills: ['sigilo', 'trampas', 'percepcion', 'investigacion'],
    startingGear: ['Dagas Gemelas (2 DC, Diagonal)', 'Bandolera de Herramientas', 'Abrojos (1 uso)'],
    coreAbility: 'Ataque Furtivo: Si atacas por la espalda, con Ventaja o a un enemigo adyacente a otro héroe, añades +1 Dado de Combate (+2 DC en Nivel 5, +3 DC en Nivel 9).',
    subclasses: [
      { id: 'asesino', name: 'Hoja Nocturna', desc: 'En el primer turno de combate tienes Ventaja y tus ataques furtivos ignoran 1 escudo enemigo.' },
      { id: 'acróbata', name: 'Sombra Acrobática', desc: 'Puedes atravesar casillas enemigas sin coste extra e intercalar tu ataque en medio del movimiento.' },
    ],
    progression: {
      1: 'Ataque Furtivo (+1 DC) + Paso Ágil (no provocas ataques de oportunidad al salir de 1 casilla)',
      2: 'Evasión (cuando superes una salvación de DES de trampa o magia, no recibes daño)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Ataque Furtivo (+2 DC) + Esfumarse (1 Astucia para volver a Sigilo)',
      6: 'Manos Rápidas (examinar un mueble es acción gratuita 1 vez/turno)',
      7: 'Golpe Paralizante (1 Astucia: objetivo supera Resistencia Física (6 en 1d6) o queda Aturdido)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Ataque Furtivo (+3 DC)',
      10: 'Maestro de las Sombras (1 vez/misión realizas un turno completo extra antes de que actúe Zargon)',
    },
  },
  {
    id: 'explorador',
    name: 'Explorador de Elethorn',
    role: 'Tirador / Rastreador / Híbrido',
    miniature: 'Elfo (Juego Base)',
    icon: '🏹',
    basePC: 6,
    basePM: 4,
    pcPerLevel: 1,
    pmPerLevel: 1,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Marca del Cazador + 1 Escuela Mágica',
    primaryAttrs: ['AGI', 'MEN'],
    proficientSkills: ['supervivencia', 'percepcion', 'sigilo'],
    startingGear: ['Arco Corto (2 DC a distancia)', 'Espada Corta (2 DC)', 'Carcaj de Flechas'],
    coreAbility: 'Presa Marcada: Como acción gratuita, marcas un enemigo en línea de visión; añades +1 Dado de Combate contra él y conoces 1 escuela de magia elemental (3 hechizos).',
    subclasses: [
      { id: 'francotirador', name: 'Ojo de Halcón', desc: 'Tus disparos a distancia ignoran cobertura y hacen +1 daño si no te moviste ese turno.' },
      { id: 'senor_bestias', name: 'Domador de Bestias', desc: 'Empiezas acompañado por un Lobo Fiel (Mov 9, At 2, Def 1, PC 3) que actúa en tu turno.' },
    ],
    progression: {
      1: 'Presa Marcada + 1 Escuela Elemental (3 hechizos)',
      2: 'Disparo Rápido (puedes atacar a distancia incluso tras moverte)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Lluvia de Flechas (1 vez/combate atacas a 2 objetivos distintos en LdV)',
      6: 'Sentido del Peligro (el grupo tiene Ventaja en eventos de Viaje)',
      7: 'Hechicero del Bosque (aprendes 2 hechizos adicionales)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Flecha Perforante (ignora 2 Dados de Defensa del objetivo, 2 usos/misión)',
      10: 'Leyenda Silvana (tu Presa Marcada salta gratis a otro enemigo cuando muere el anterior)',
    },
  },
  {
    id: 'mago',
    name: 'Mago Elemental',
    role: 'Control / Magia / Daño en Área',
    miniature: 'Mago (Juego Base)',
    icon: '🔮',
    basePC: 4,
    basePM: 6,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 1,
    baseDefendDice: 2,
    resourceName: 'Puntos de Maná (= PM) + 3 Escuelas',
    primaryAttrs: ['MEN', 'SUE'],
    proficientSkills: ['arcano', 'investigacion', 'medicina'],
    startingGear: ['Bastón Rúnico (1 DC, Diagonal)', 'Capa de Aprendiz Arcano (+1 Def)', 'Poción de Clarividencia (+2 PM)'],
    coreAbility: 'Canalizar Éter: Gastas 1 PM para potenciar tu próximo hechizo (+1 DC mágico) o recargar 1 hechizo de Nivel 1 ya usado.',
    subclasses: [
      { id: 'piromante', name: 'Archimago de la Evocación', desc: 'Tus hechizos ofensivos añaden +1 Dado de Combate y nunca dañan a aliados.' },
      { id: 'cronomante', name: 'Tejedor del Destino', desc: 'Puedes gastar 1 PM como reacción para obligar a Zargon a repetir una tirada de d20 o dados de combate.' },
    ],
    progression: {
      1: '[Activable] Proyectil Arcano: ataque mágico básico a distancia (1 DC). Puedes usarlo siempre que quieras, no se agota ni gasta PM.',
      2: '[Activable] Recuperación Arcana: 1 vez por misión recuperas +2 PM al instante.',
      3: '[Pasiva] Elección de Subclase.',
      4: '[Pasiva] Mejora de Pilar (+1 a un Pilar a elección, máx. +4).',
      5: '[Pasiva] Desbloqueas la 4ª Escuela Elemental (Aire) en tus hechizos.',
      6: '[Activable] Escudo Arcano: gastas 1 PM para ganar +2 DC de Defensa por 1 turno.',
      7: '[Pasiva] Conjuración Doble: 1 vez por misión puedes lanzar 2 hechizos en un mismo turno.',
      8: '[Pasiva] Mejora de Pilar (+1 a un Pilar a elección, máx. +4).',
      9: '[Pasiva] Ventaja en todas tus pruebas de Mente (MEN) y magia.',
      10: '[Pasiva] Archimago Supremo: tus hechizos de Nivel 1 ya no se agotan mientras tengas 2 o más PM.',
    },
  },
  {
    id: 'bardo',
    name: 'Bardo Espiritual',
    role: 'Soporte / Acordes de Valor / Control Mental',
    miniature: 'Bardo (El Tormento de la Reina de los Espíritus)',
    icon: '🎵',
    basePC: 5,
    basePM: 5,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Acordes de Valor (3/misión) + Cantos',
    primaryAttrs: ['SUE', 'MEN'],
    proficientSkills: ['persuasion', 'percepcion', 'arcano', 'medicina'],
    startingGear: ['Estoque (2 DC, Diagonal)', 'Laúd Rúnico (+1 Persuasión)', 'Poción de Clarividencia (+2 PM)'],
    coreAbility: 'Canción de Valor: Como acción gratuita, gastas 1 Acorde para dar +1 Dado de Combate o +1d6 a una prueba d20 de un aliado, o restaurar 1 PM perdido (vital contra Espíritus).',
    subclasses: [
      { id: 'valor', name: 'Colegio del Valor', desc: 'Puedes usar escudo y armadura ligera (+1 Def) y tu Canción afecta a 2 aliados a la vez.' },
      { id: 'espiritus', name: 'Medium de la Reina', desc: 'Tus ataques dañan plenamente a Espectros Etéreos y puedes calmar o dañar PM enemigos.' },
    ],
    progression: {
      1: 'Canción de Valor (3 usos) + 3 Cantos Espirituales',
      2: 'Palabras Cortantes (reacción: resta 1 DC al ataque de un monstruo visible)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Balada Sanadora (recupera 1 PC y 1 PM a todo el grupo tras un combate, 1 vez/misión)',
      6: 'Acordes de Valor suben a 5 usos',
      7: 'Discurso Heroico (un aliado en Shock sale inmediatamente del estado)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Crescendo (el aliado inspirado repite todos los escudos negros de su ataque)',
      10: 'Epopeya Inmortal (1 vez/misión todos los héroes ganan +2 DC de ataque y defensa durante 1 ronda)',
    },
  },
  {
    id: 'brujo',
    name: 'Brujo del Velo',
    role: 'Magia Oscura / Daño Sostenido / Debuff',
    miniature: 'Brujo (Pack Mítico / Reina de los Espíritus)',
    icon: '👁️',
    basePC: 5,
    basePM: 5,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Pactos del Velo (2 ranuras recargables)',
    primaryAttrs: ['MEN', 'SUE'],
    proficientSkills: ['arcano', 'intimidacion', 'investigacion'],
    startingGear: ['Varita de Sombras (2 DC, Mágico)', 'Túnica del Velo (+1 Def)', 'Poción de Curación Menor (+2 PC)'],
    coreAbility: 'Descarga Sobrenatural y Maldición: Tu varita ataca a cualquier enemigo en LdV con 2 DC mágicos (dañando incluso a Etéreos). Puedes maldecir un enemigo para que defienda con -1 DC.',
    subclasses: [
      { id: 'demonio', name: 'Pacto del Abismo', desc: 'Cada vez que matas a un enemigo, recuperas 1 PC o 1 PM a elección.' },
      { id: 'forma_sombra', name: 'Forma Demoníaca / Espectral', desc: '1 vez/combate te vuelves semietéreo durante 2 turnos (+1 Def, atraviesas enemigos).' },
    ],
    progression: {
      1: 'Varita de Sombras (2 DC mágicos) + Maldición del Velo',
      2: 'Invocaciones (elige: Visión Diabólica 10 casillas o Armadura de Sombras +1 Def)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Doble Descarga (tu varita lanza 3 DC o divide 2 DC + 1 DC entre dos objetivos)',
      6: 'Pactos del Velo suben a 3 ranuras',
      7: 'Sifón de Alma (robas 1 PM al jefe para recargar un hechizo)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Terror Inverso (inmune a Miedo y Shock; tus maldiciones reducen -1 At y -1 Def)',
      10: 'Señor del Umbral (1 vez/misión invocas un Espectro Aliado durante 3 turnos)',
    },
  },
  {
    id: 'paladin',
    name: 'Paladín de la Aurora',
    role: 'Guerrero Sagrado / Sanador / Anti-No Muertos',
    miniature: 'Caballero (Luna del Terror) o Bárbaro',
    icon: '☀️',
    basePC: 7,
    basePM: 4,
    pcPerLevel: 2,
    pmPerLevel: 1,
    baseAttackDice: 2,
    baseDefendDice: 3,
    resourceName: 'Imposición de Manos (6 PC) + Castigo',
    primaryAttrs: ['FUE', 'SUE'],
    proficientSkills: ['atletismo', 'medicina', 'persuasion'],
    startingGear: ['Espada Larga (3 DC, Diagonal)', 'Escudo de Hierro (+1 Def)', 'Símbolo Sagrado'],
    coreAbility: 'Castigo Sagrado: 2 veces por misión añades +2 DC de daño radiante (golpea Etéreos y No Muertos con Ventaja). Además tienes una reserva de 6 PC para curar tocando aliados.',
    subclasses: [
      { id: 'venganza', name: 'Juramento de Venganza', desc: 'Cuando un aliado cae a 0 PC, tu siguiente ataque tiene +3 DC y crítico en 18-20.' },
      { id: 'devocion', name: 'Juramento de la Luz', desc: 'Tu aura a 2 casillas otorga +1 a todas las salvaciones d20 y +1 Def contra No Muertos.' },
    ],
    progression: {
      1: 'Castigo Sagrado (2 usos) + Imposición de Manos (6 PC)',
      2: 'Sentido Divino (detectas No Muertos, Demonios y Espectros tras puertas cerradas)',
      3: 'Elección de Subclase + Inmunidad a Veneno',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Golpe Radiante (tus ataques cuerpo a cuerpo siempre cuentan como mágicos)',
      6: 'Aura de Protección (aliados en 2 casillas suman +1 a todas sus pruebas de defensa y resistencia)',
      7: 'Castigo Sagrado sube a 4 usos/misión',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Imposición de Manos sube a 12 PC y cura Shock/Parálisis',
      10: 'Avatar del Alba (1 vez/misión todos los No Muertos/Espectros en la sala sufren 3 DC indefendibles)',
    },
  },
  {
    id: 'druida',
    name: 'Druida del Círculo Salvaje',
    role: 'Cambiaformas / Control / Curación',
    miniature: 'Druida (Pack Mítico / Elfo)',
    icon: '🌿',
    basePC: 6,
    basePM: 5,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Forma Salvaje (2/misión) + Magia Natural',
    primaryAttrs: ['MEN', 'FUE'],
    proficientSkills: ['supervivencia', 'medicina', 'percepcion'],
    startingGear: ['Bastón de Roble (2 DC, Diagonal)', 'Armadura de Cuero (+1 Def)', 'Poción de Curación Menor (+2 PC)'],
    coreAbility: 'Forma Salvaje: Como acción gratuita te transformas en Oso (PC +3 temporales, At 3 DC) o Lobo (Mov 10, ataque diagonal) durante 3 turnos.',
    subclasses: [
      { id: 'luna', name: 'Círculo de la Luna', desc: 'Puedes transformarte en Tigre Dientes de Sable (At 4 DC, Def 3 DC) y curarte 1 PC al cambiar.' },
      { id: 'esporas', name: 'Círculo de las Esporas', desc: 'Liberas esporas venenosas a enemigos adyacentes (1 daño automático al inicio de su turno).' },
    ],
    progression: {
      1: 'Forma Salvaje (2 usos) + 3 Hechizos Naturales',
      2: 'Enredar (1/combate inmoviliza a un enemigo 1 turno, FUE CD 13)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Garras Primordiales (en Forma Salvaje dañas normalmente a Espectros Etéreos)',
      6: 'Forma Salvaje sube a 3 usos/misión',
      7: 'Regeneración del Bosque (recuperas 1 PC al entrar a cada sala nueva si estás bajo mitad)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Tormenta de Raíces (ataque en área de 3 DC a todos los enemigos en la sala, 1/misión)',
      10: 'Archidruida (puedes lanzar hechizos incluso estando en Forma Salvaje)',
    },
  },
  {
    id: 'monje',
    name: 'Monje del Puño Elemental',
    role: 'Artes Marciales / Movilidad Extrema / Control',
    miniature: 'Monje (La Senda del Monje / Pícaro)',
    icon: '🥋',
    basePC: 6,
    basePM: 4,
    pcPerLevel: 2,
    pmPerLevel: 1,
    baseAttackDice: 2,
    baseDefendDice: 3,
    resourceName: 'Puntos de Ki (4/misión) + 4 Técnicas',
    primaryAttrs: ['AGI', 'MEN'],
    proficientSkills: ['atletismo', 'sigilo', 'percepcion'],
    startingGear: ['Puños Desnudos (2 DC sin armas)', 'Túnica Elemental', 'Cuerda con Garfio'],
    coreAbility: 'Ráfaga de Golpes y Defensa sin Armadura: Sin armadura metálica defiendes con 3 DC y puedes gastar 1 Ki para hacer 2 ataques en tu turno o desviar proyectiles.',
    subclasses: [
      { id: 'fuego_viento', name: 'Senda del Dragón Elemental', desc: 'Gastas 1 Ki para añadir daño de Fuego o Aire (+1 DC y empuja 2 casillas).' },
      { id: 'sombra_ki', name: 'Senda de la Sombra Silenciosa', desc: 'Gastas 1 Ki para teletransportarte 4 casillas entre sombras y atacar con Ventaja.' },
    ],
    progression: {
      1: 'Ráfaga de Golpes (4 Ki) + Paso del Viento (+2 mov)',
      2: 'Desviar Proyectiles (reacción: reduces 2 daños de flechas o magia)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Golpe Aturdidor (1 Ki: objetivo supera Resistencia Física (6 en 1d6) o queda Aturdido 1 turno)',
      6: 'Puños de Ki (tus golpes desarmados dañan Etéreos e ignoran Piel de Piedra)',
      7: 'Mente Serena (1 Ki para salir inmediatamente de Shock o Miedo)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Puntos de Ki suben a 8/misión',
      10: 'Palma Vibrante (1 vez/misión infliges 5 DC indefendibles de energía pura)',
    },
  },
  {
    id: 'alquimista',
    name: 'Alquimista de Batalla',
    role: 'Bombardero / Soporte / Crafteo en Vivo',
    miniature: 'Mago o Explorador (Luna del Terror)',
    icon: '🧪',
    basePC: 5,
    basePM: 5,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Frascos Alquímicos (4/misión) + Crafteo',
    primaryAttrs: ['MEN', 'AGI'],
    proficientSkills: ['arcano', 'investigacion', 'medicina'],
    startingGear: ['Ballesta Ligera (2 DC)', 'Estuche de Alquimia (+1 MEN en pociones)', 'Poción de Curación Menor (+2 PC)'],
    coreAbility: 'Bombas y Elixires Rápidos: Gastas 1 Frasco para lanzar una Bomba de Fuego/Ácido (3 DC en 1 casilla + 1 daño adyacente) o crear un Elixir instantáneo (+2 PC o +2 PM) sin necesitar mesa.',
    subclasses: [
      { id: 'pirotecnico', name: 'Maestro Pirotécnico', desc: 'Tus bombas queman regeneración de Trolls/Momias y afectan un área de 3x3 casillas.' },
      { id: 'botanico', name: 'Boticario de Elethorn', desc: 'Tus pociones curan +2 PC adicionales y otorgan inmunidad a veneno y Shock por 2 turnos.' },
    ],
    progression: {
      1: 'Frascos Alquímicos (4/misión) + Alquimia en Campo con Ventaja',
      2: 'Ácido Corrosivo (reduce permanentemente -1 Def a un monstruo, 1/combate)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Doble Lanzamiento (puedes lanzar 1 bomba y beber/dar 1 poción en el mismo turno)',
      6: 'Frascos Alquímicos suben a 6/misión',
      7: 'Poción de Piedra Filosofal (1/misión revive a un héroe que cayó a 0 PC con 4 PC)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Nube Alquímica (crea niebla curativa o tóxica durante 2 rondas)',
      10: 'Gran Maestro Alquimista (todos tus aliados empiezan cada misión con 1 poción gratis)',
    },
  },
  {
    id: 'exorcista',
    name: 'Exorcista / Nigromante Blanco',
    role: 'Control de Espíritus / Invocador / Soporte',
    miniature: 'Brujo o Bardo (Reina de los Espíritus)',
    icon: '🕯️',
    basePC: 5,
    basePM: 6,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Esencia Espiritual (3/misión)',
    primaryAttrs: ['MEN', 'SUE'],
    proficientSkills: ['arcano', 'medicina', 'percepcion'],
    startingGear: ['Farol de Almas (2 DC, Mágico)', 'Agua Bendita (2 usos)', 'Símbolo Exorcista (+1 vs Espíritus)'],
    coreAbility: 'Sello del Exorcista: Tus ataques dañan completamente a Espectros y No Muertos. Cuando un enemigo muere a 4 casillas, puedes gastar 1 Esencia para invocar un Espíritu Guardián aliado por 2 turnos.',
    subclasses: [
      { id: 'cazafantasmas', name: 'Inquisidor Espectral', desc: 'Absorbes daño de PM dirigido a aliados y lo conviertes en +1 DC en tu siguiente ataque.' },
      { id: 'tejedor_almas', name: 'Tejedor de Almas', desc: 'Tu Espíritu Guardián puede curar 1 PC o 1 PM a un aliado adyacente en cada turno.' },
    ],
    progression: {
      1: 'Farol de Almas + Sello del Exorcista (3 Esencias)',
      2: 'Expulsar No Muertos (1/combate: No Muertos en 4 casillas resisten con 1 dado rojo por PM (6 resiste) o pierden su turno)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Vínculo de Cordura (ningún aliado a 3 casillas puede caer en Shock mientras tú tengas PM)',
      6: 'Esencia Espiritual sube a 5/misión',
      7: 'Cadenas de Luz (inmoviliza a un Jefe o Espectro 1 turno, Resistencia Mental (1 dado por PM, 6 resiste))',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Cosecha Sagrada (recuperas 1 hechizo cada vez que exorcizas un Élite)',
      10: 'Guardia de Silvana (1/misión invocas 2 Guerreros Espirituales aliados por toda la sala)',
    },
  },
  {
    id: 'cazador_sombras',
    name: 'Cazador de Monstruos (Inquisidor)',
    role: 'Cazador de Jefes / Versátil / Armas de Pólvora',
    miniature: 'Asesino o Explorador (Luna del Terror)',
    icon: '🎯',
    basePC: 6,
    basePM: 4,
    pcPerLevel: 2,
    pmPerLevel: 1,
    baseAttackDice: 3,
    baseDefendDice: 2,
    resourceName: 'Balas de Plata / Aceites (3/misión)',
    primaryAttrs: ['AGI', 'FUE'],
    proficientSkills: ['supervivencia', 'investigacion', 'intimidacion'],
    startingGear: ['Ballesta de Mano (2 DC)', 'Espada de Plata (2 DC, daña Etéreos)', '3 Aceites de Caza'],
    coreAbility: 'Aceites y Plata: Aplicas un Aceite como acción gratuita para ganar +2 DC contra una familia elegida (No Muertos, Caos, Pieles Verdes o Bestias) durante todo el combate.',
    subclasses: [
      { id: 'pistolero', name: 'Tirador de Pólvora Negra', desc: 'Usas Arcabuz/Pistola (4 DC) sin penalización de movimiento y críticos en 19-20.' },
      { id: 'brujo_cazador', name: 'Cazador de Mutágenos', desc: 'Bebes un mutágeno por misión: +2 PC máx, Visión en la Oscuridad y +1 Def.' },
    ],
    progression: {
      1: 'Aceites de Caza (3) + Espada de Plata',
      2: 'Estudio de Presa (conoces los PC exactos y debilidades del Jefe al verlo)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Disparo de Gracia (si un enemigo tiene ≤ 2 PC, tu ataque impacta con +1 Calavera automática)',
      6: 'Aceites de Caza suben a 5/misión',
      7: 'Trampa de Plata (colocas un cepo que inflige 3 DC e inmoviliza a un Jefe)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Cazador Implacable (Ventaja en todas las tiradas contra Jefes y Élites)',
      10: 'Sentencia Final (1 vez/misión realizas un ataque de 6 DC con arma de plata o pólvora)',
    },
  },
  {
    id: 'clerigo',
    name: 'Clérigo de la Luz',
    role: 'Soporte / Sanador Puro / Anti-No Muertos',
    miniature: 'Mago o Bardo (Juego Base)',
    icon: '✝️',
    basePC: 6,
    basePM: 5,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Fe Radiante (= PM) + Plegarias',
    primaryAttrs: ['MEN', 'SUE'],
    proficientSkills: ['medicina', 'persuasion', 'percepcion'],
    startingGear: ['Maza Bendita (2 DC)', 'Escudo de Hierro (+1 Def)', 'Símbolo Sagrado'],
    coreAbility: 'Bendición y Curación: Gastas 1 PM para curar 3 PC a un aliado (hasta 4 casillas) o darle Escudo de Fe (+1 DC Defensa por 2 turnos).',
    subclasses: [
      { id: 'vida', name: 'Dominio de la Vida', desc: 'Tus curaciones siempre restauran +1 PC extra y eliminan Veneno o Sangrado.' },
      { id: 'luz', name: 'Dominio del Sol', desc: 'Expulsar No Muertos inflige 2 DC radiantes automáticos a todos los No Muertos en la sala.' },
    ],
    progression: {
      1: 'Curación Radiante (-1 PM → +3 PC) + Escudo de Fe',
      2: 'Expulsar No Muertos (1/combate: No Muertos en 4 casillas resisten con 1 dado rojo por PM (6 resiste) o huyen)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Plegaria de Grupo (1/misión: todos los aliados en la sala recuperan 2 PC y 1 PM)',
      6: 'Armadura Sagrada (puedes usar Cota de Malla sin penalizar hechizos)',
      7: 'Purificar Mente (curar a un aliado también lo saca inmediatamente del Shock)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Faro de Esperanza (aliados a 3 casillas tienen Ventaja en Tiradas de Salvación)',
      10: 'Milagro del Alba (1/misión levantas a todos los aliados caídos con 4 PC)',
    },
  },
  {
    id: 'maestro_armas',
    name: 'Maestro de Armas (Luchador Táctico)',
    role: 'Vanguardia Táctica / Control Físico / Sinergia',
    miniature: 'Bárbaro o Caballero',
    icon: '🗡️',
    basePC: 7,
    basePM: 3,
    pcPerLevel: 2,
    pmPerLevel: 0,
    baseAttackDice: 3,
    baseDefendDice: 2,
    resourceName: 'Maniobras de Acero (3/misión)',
    primaryAttrs: ['FUE', 'AGI'],
    proficientSkills: ['atletismo', 'percepcion', 'intimidacion'],
    startingGear: ['Espada Larga (3 DC, Diagonal)', 'Escudo de Hierro (+1 Def)', 'Cuerda con Garfio'],
    coreAbility: 'Maniobras de Acero: Gastas 1 Maniobra al golpear para Derribar (FUE CD 13 → aliados tienen Ventaja contra ese enemigo), Desarmar (-1 DC enemigo) o Abrir Hueco (1 aliado mueve 2 casillas gratis).',
    subclasses: [
      { id: 'duelista', name: 'Maestro Duelista', desc: 'Cuando peleas contra 1 enemigo sin otros adyacentes, ganas +1 DC Ataque y +1 DC Defensa.' },
      { id: 'estratega', name: 'Estratega de Batalla', desc: 'Tus Maniobras suben a 5/misión y puedes ceder tu ataque para que un aliado ataque con +1 DC.' },
    ],
    progression: {
      1: 'Maniobras de Acero (3/misión: Derribar, Desarmar, Abrir Hueco)',
      2: 'Aliento de Combate (1/misión recuperas 2 PC como acción gratuita)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Golpe Coordinado (si atacas al mismo enemigo que un aliado, +1 DC extra)',
      6: 'Maniobras de Acero suben a 5/misión',
      7: 'Reflejos de Veterano (+1 casilla de movimiento y Ventaja contra trampas físicas)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Ataque Doble Táctico (1/combate realizas 2 ataques cuerpo a cuerpo)',
      10: 'Gran General (todos los aliados en la sala ganan 1 acción de movimiento o ataque gratis, 1/misión)',
    },
  },
  {
    id: 'mago_batalla',
    name: 'Hechicero de Batalla (Espada Arcana)',
    role: 'Híbrido Acero + Magia / Flanqueo',
    miniature: 'Elfo (Juego Base)',
    icon: '⚡',
    basePC: 6,
    basePM: 5,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Filo Elemental (3/misión) + 1 Escuela',
    primaryAttrs: ['MEN', 'FUE'],
    proficientSkills: ['arcano', 'atletismo', 'investigacion'],
    startingGear: ['Espada Corta Rúnica (2 DC)', 'Capa de Protección (+1 Def)', 'Poción de Clarividencia (+2 PM)'],
    coreAbility: 'Filo Elemental: Acción gratuita (3/misión): imbuyes tu espada con Fuego o Rayo durante 2 turnos (+1 DC mágico, daña Etéreos y quema regeneración).',
    subclasses: [
      { id: 'hoja_fuego', name: 'Danzarín de Brasas', desc: 'Al matar con Filo Elemental infliges 1 daño de fuego automático a un enemigo adyacente.' },
      { id: 'egida_arcana', name: 'Guardián de Éter', desc: 'Al lanzar un hechizo ganas +1 DC Defensa hasta tu próximo turno.' },
    ],
    progression: {
      1: 'Filo Elemental (3 usos) + 1 Escuela Elemental (3 hechizos)',
      2: 'Paso Relámpago (1/combate teletransportas 3 casillas sin provocar ataques)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Golpe y Conjuro (1/combate atacas con espada y lanzas un hechizo en el mismo turno)',
      6: 'Filo Elemental sube a 5 usos/misión',
      7: 'Contrahechizo Menor (1/misión anulas un hechizo enemigo con Mente MEN CD 13)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Espada Resonante (tus golpes con Filo Elemental ignoran 1 escudo enemigo)',
      10: 'Tormenta de Acero y Éter (1/misión golpeas a todos los enemigos a 2 casillas con 3 DC mágicos)',
    },
  },
  {
    id: 'artificiero',
    name: 'Artificiero Rúnico (Soporte Técnico)',
    role: 'Soporte Técnico / Trampas / Mejoras de Grupo',
    miniature: 'Enano o Gnomo',
    icon: '⚙️',
    basePC: 6,
    basePM: 5,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Artificios de Campo (3/misión)',
    primaryAttrs: ['MEN', 'AGI'],
    proficientSkills: ['trampas', 'arcano', 'investigacion'],
    startingGear: ['Ballesta Ligera (2 DC)', 'Kit de Herramientas Maestras', 'Cepo Táctico'],
    coreAbility: 'Ingeniería de Campo: Gastas 1 Artificio para mejorar el arma/escudo de un aliado (+1 DC por 2 turnos) o colocar un Cepo en una casilla vacía (2 DC e inmoviliza 1 turno).',
    subclasses: [
      { id: 'armero', name: 'Armero Rúnico', desc: 'Puedes mejorar a 2 aliados a la vez y tus mejoras también otorgan propiedad Mágica.' },
      { id: 'trampero', name: 'Maestro de Torretas', desc: 'Despliegas una Miniballesta automática (2 DC a distancia durante 2 rondas, 1/combate).' },
    ],
    progression: {
      1: 'Artificios de Campo (3/misión) + Ventaja al desarmar trampas',
      2: 'Chatarrero Experto (desarmar una trampa siempre te da +1 Acero o Pólvora Negra)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Escudo de Energía (reacción: -1 PM para absorber 2 PC dirigidos a un aliado en 3 casillas)',
      6: 'Artificios de Campo suben a 5/misión',
      7: 'Crafteo Acelerado (tus Mezclas Experimentales tienen +2 en Arcano)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Sobrecarga Rúnica (el arma mejorada de un aliado suma +2 DC en vez de +1)',
      10: 'Autómata Guardián (1/misión despliegas un Gólem de Bronce aliado: At 3, Def 3, 4 PC)',
    },
  },
  {
    id: 'caballero_runico',
    name: 'Caballero Rúnico (Forja Arcana)',
    role: 'Vanguardia / Barreras Rúnicas / Anti-Magia',
    miniature: 'Caballero o Bárbaro',
    icon: '🔷',
    basePC: 7,
    basePM: 4,
    pcPerLevel: 2,
    pmPerLevel: 1,
    baseAttackDice: 2,
    baseDefendDice: 3,
    resourceName: 'Runas de Acero (3/misión)',
    primaryAttrs: ['FUE', 'MEN'],
    proficientSkills: ['atletismo', 'arcano', 'percepcion'],
    startingGear: ['Espada Larga (3 DC, Diagonal)', 'Escudo de Hierro (+1 Def)', 'Poción de Curación Menor (+2 PC)'],
    coreAbility: 'Sello Rúnico: Acción gratuita (3/misión): grabas una runa en tu hoja o escudo (+1 DC mágico contra Etéreos o +2 DC Defensa contra el próximo Hechizo del Terror).',
    subclasses: [
      { id: 'rompehechizos', name: 'Rompehechizos', desc: '1 vez/combate puedes anular un Hechizo del Terror dirigido a ti o un aliado en 3 casillas (Mente MEN CD 13).' },
      { id: 'hoja_runa', name: 'Hoja de Escarcha y Fuego', desc: 'Tus golpes con Sello Rúnico añaden +1 daño elemental y cortan regeneración.' },
    ],
    progression: {
      1: 'Sello Rúnico (3/misión) + 3 Hechizos de Tierra',
      2: 'Barrera de Acero (+1 a Salvaciones contra Magia del Terror)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Golpe Rúnico (ignoras 1 Escudo Negro enemigo al usar Sello Rúnico)',
      6: 'Runas de Acero suben a 5/misión',
      7: 'Égida Grupal (aliados adyacentes ganan +1 Defensa contra magia)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Contraataque Rúnico (si bloqueas un ataque, devuelves 2 DC mágicos)',
      10: 'Baluarte Eterno (1/misión anulas todo daño a tu grupo durante 1 turno enemigo)',
    },
  },
  {
    id: 'chaman',
    name: 'Chamán de los Espíritus',
    role: 'Soporte Elemental / Tótems / Curación',
    miniature: 'Druida o Bardo',
    icon: '🪶',
    basePC: 6,
    basePM: 5,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 2,
    baseDefendDice: 2,
    resourceName: 'Tótems Ancestrales (3/misión)',
    primaryAttrs: ['MEN', 'SUE'],
    proficientSkills: ['supervivencia', 'medicina', 'arcano'],
    startingGear: ['Bastón de Roble (2 DC, Diagonal)', 'Tótem Ancestral (+1 Curación)', 'Poción de Curación Menor (+2 PC)'],
    coreAbility: 'Invocar Tótem: Colocas un Tótem en tu sala durante 3 turnos: Tótem Sanador (+1 PC al inicio de turno a aliados en 2 casillas) o Tótem de Tormenta (+1 DC a aliados cercanos).',
    subclasses: [
      { id: 'ancestros', name: 'Guía de los Ancestros', desc: 'Tus Tótems curan también +1 PM y protegen contra el Estado de Shock.' },
      { id: 'tormenta_ch', name: 'Llamador de Truenos', desc: 'Al colocar un Tótem, un enemigo visible recibe 2 DC de rayo automático.' },
    ],
    progression: {
      1: 'Invocar Tótem (3/misión) + 3 Hechizos de Espíritu',
      2: 'Espíritu del Lobo (+2 casillas de movimiento en pasillos)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Doble Tótem (puedes mantener 2 Tótems activos a la vez)',
      6: 'Tótems Ancestrales suben a 5/misión',
      7: 'Purificación Tribal (al colocar Tótem elimina Veneno y Miedo en 3 casillas)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Furia Elemental (tus hechizos suman +1 DC adicional)',
      10: 'Avatar Ancestral (1/misión todos los aliados recuperan 3 PC, 2 PM y ganan +1 DC por 2 rondas)',
    },
  },
  {
    id: 'nigromante',
    name: 'Nigromante del Umbral',
    role: 'Invocador Táctico / Control de Sombras',
    miniature: 'Mago o Brujo',
    icon: '💀',
    basePC: 5,
    basePM: 6,
    pcPerLevel: 1,
    pmPerLevel: 2,
    baseAttackDice: 1,
    baseDefendDice: 2,
    resourceName: 'Almas Cosechadas (3/misión)',
    primaryAttrs: ['MEN', 'SUE'],
    proficientSkills: ['arcano', 'investigacion', 'intimidacion'],
    startingGear: ['Varita de Sombras (2 DC, Mágico)', 'Túnica del Velo (+1 Def)', 'Poción de Clarividencia (+2 PM)'],
    coreAbility: 'Alzar Esqueleto Aliado: Cuando cae un enemigo en tu sala, gastas 1 Alma para levantar 1 Esqueleto Aliado (Mov 6, At 2 DC, Def 2 DC, 2 PC) durante 3 turnos.',
    subclasses: [
      { id: 'senor_huesos', name: 'Señor de los Huesos', desc: 'Tu Esqueleto Aliado tiene 3 PC y 3 DC de ataque.' },
      { id: 'cosechador', name: 'Cosechador de Almas', desc: 'Cuando un enemigo muere a 4 casillas de ti recuperas +1 PC o +1 PM.' },
    ],
    progression: {
      1: 'Alzar Esqueleto Aliado (3/misión) + 3 Hechizos de Sombras',
      2: 'Toque Gélido (1/combate: 2 DC mágicos que impiden curación al objetivo)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Comandar No Muertos (los Esqueletos/Zombis enemigos sufren -1 DC contra ti)',
      6: 'Almas Cosechadas suben a 5/misión',
      7: 'Explosión Ósea (detonas tu Esqueleto Aliado infligiendo 3 DC en 2×2 casillas)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Inmortalidad Menor (1/misión al caer a 0 PC te levantas con 2 PC)',
      10: 'Legión del Umbral (1/misión invocas 2 Esqueletos Aliados de élite al instante)',
    },
  },
  {
    id: 'tirador_asedio',
    name: 'Tirador de Asedio (Ballestero)',
    role: 'Francotirador Pesado / Perforación / Trampas',
    miniature: 'Explorador o Enano',
    icon: '🏹',
    basePC: 6,
    basePM: 3,
    pcPerLevel: 2,
    pmPerLevel: 1,
    baseAttackDice: 3,
    baseDefendDice: 2,
    resourceName: 'Virotes Especiales (4/misión)',
    primaryAttrs: ['AGI', 'FUE'],
    proficientSkills: ['percepcion', 'trampas', 'supervivencia'],
    startingGear: ['Ballesta Pesada (3 DC, Distancia)', 'Daga (1 DC, Arrojadiza)', 'Abrojos (1 uso)'],
    coreAbility: 'Virote Perforante: Gastas 1 Virote Especial al disparar para ignorar 1 Escudo Negro enemigo (o clavar al objetivo reduciendo su movimiento a 0 por 1 turno).',
    subclasses: [
      { id: 'francotirador_p', name: 'Ojo de Águila', desc: 'Si no te mueves este turno, tu disparo suma +1 DC y crítico en 19–20.' },
      { id: 'zapador', name: 'Zapador de Pasillos', desc: 'Tus disparos pueden ser explosivos (2 DC al objetivo + 1 daño a adyacentes).' },
    ],
    progression: {
      1: 'Virotes Especiales (4/misión: Perforante o Clavar)',
      2: 'Posición Firme (si no te mueves, +1 DC Defensa contra proyectiles)',
      3: 'Elección de Subclase',
      4: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      5: 'Recarga Relámpago (puedes disparar incluso tras moverte hasta 4 casillas)',
      6: 'Virotes Especiales suben a 6/misión',
      7: 'Disparo de Cobertura (reacción: disparas 2 DC a un enemigo que abra una puerta)',
      8: 'Mejora de Pilar (+1 a un Pilar a elección, máx. +4)',
      9: 'Virote de Plata (tus disparos dañan plenamente a Espectros Etéreos)',
      10: 'Salva de Asedio (1/misión disparas 3 DC a hasta 3 enemigos distintos en LdV)',
    },
  },
];

export const ALIGNMENTS = [
  { id: 'LB', name: 'Legal Bueno', desc: 'Honor, justicia y protección de los inocentes.', effect: 'Función: +1 a Persuasión con guardias y nobles. Al proteger a un aliado o prisionero ganas Ventaja en tu próxima defensa.' },
  { id: 'NB', name: 'Neutral Bueno', desc: 'Hace el bien sin atarse a leyes rígidas.', effect: 'Función: +1 a pruebas de Medicina y cuando ayudas a un aliado adyacente le otorgas Ventaja.' },
  { id: 'CB', name: 'Caótico Bueno', desc: 'Espíritu libre que lucha contra la tiranía.', effect: 'Función: +1 a Sigilo o Desarmar Trampas; al rescatar a alguien ganas +2 casillas de movimiento ese turno.' },
  { id: 'LN', name: 'Legal Neutral', desc: 'Orden, disciplina y cumplimiento del deber.', effect: 'Función: Mente disciplinada: +1 a todas las tiradas de Salvación contra Miedo y Shock.' },
  { id: 'NN', name: 'Neutral Auténtico', desc: 'Equilibrio y pragmatismo ante todo.', effect: 'Función: Adaptable: 1 vez por misión puedes sumar +2 a cualquier prueba de d20 que necesites.' },
  { id: 'CN', name: 'Caótico Neutral', desc: 'Sigue sus instintos, la fortuna y la emoción.', effect: 'Función: Impredecible: +1 DC en el primer ataque (d20) y 1 vez por misión puedes repetir una tirada de movimiento.' },
  { id: 'LM', name: 'Legal Malvado', desc: 'Código estricto pero despiadado; busca poder.', effect: 'Función: +1 a Intimidación y consigues 15% más de oro al vender botín en la Ciudad.' },
  { id: 'NM', name: 'Neutral Malvado', desc: 'Egoísta y oportunista; actúa por oro y ventaja.', effect: 'Función: Oportunista: 1 vez por combate ganas +1 DC al atacar a un enemigo que ya esté herido o derribado.' },
  { id: 'CM', name: 'Caótico Malvado', desc: 'Impredecible y salvaje (solo con permiso del DM).', effect: 'Función: +1 daño extra al sacar Crítico Natural (20), pero si sacas 1 natural el Reloj del Caos sube +2.' },
];

export const MOTIVATIONS = [
  { id: 'venganza', name: 'Juramento de Venganza', desc: 'Zargon destruyó tu hogar. Ganas +1 DC en tu siguiente ataque tras derrotar a un Jefe o monstruo Élite.' },
  { id: 'tesoro', name: 'Sed de Fortuna y Reliquias', desc: 'Buscas gloria y oro. Ganas +20 MO extra al descubrir una puerta secreta o abrir un cofre oculto.' },
  { id: 'protector', name: 'Escudo de los Caídos', desc: 'Nadie muere bajo tu guardia. Ganas +1 DC de Defensa por 1 turno al curar o salvar a un aliado.' },
  { id: 'conocimiento', name: 'Buscador de Saberes Prohibidos', desc: 'Estudias ruinas y grimorios. Ganas +1 Polvo Rúnico al examinar bibliotecas, altares o descifrar runas.' },
  { id: 'redencion', name: 'Camino de Redención', desc: 'Un pasado oscuro te persigue. Recuperas 1 PM al sacrificarte o asumir un riesgo por el grupo.' },
  { id: 'gloria', name: 'Leyenda Viviente', desc: 'Quieres que los bardos canten tu nombre. Ganas +25 XP extra al sacar un 20 natural o matar 2 enemigos en un turno.' },
];

export const PERKS = [
  { id: 'alerta', name: 'Alerta de Mazmorra', cost: 1, desc: '+3 a tu Iniciativa (d20) y nunca puedes ser sorprendido por emboscadas o cartas del Malvado Brujo.' },
  { id: 'duro', name: 'Duro de Pelar', cost: 1, desc: '+2 PC máximos inmediatamente (+1 PC adicional al llegar a Nivel 5). Ideal para aguantar más golpes.' },
  { id: 'mente_ferrea', name: 'Mente Férrea', cost: 1, desc: '+2 PM máximos y Ventaja en tiradas de Salvación contra Miedo, Espíritus y estado de Shock.' },
  { id: 'alquimista', name: 'Alquimista Aprendiz', cost: 1, desc: '+2 a pruebas de Alquimia (Arcano) y al destilar en un Banco de Alquimista creas 1 poción extra gratis.' },
  { id: 'saqueador', name: 'Ojo de Saqueador', cost: 1, desc: 'Una vez por misión, al buscar Tesoro o examinar un Mueble, puedes pedirle al DM robar 2 veces y elegir el mejor resultado.' },
  { id: 'tactico', name: 'Maestro de Flanqueo', cost: 1, desc: 'Cuando atacas a un enemigo que está junto a otro aliado tuyo, obtienes Ventaja (repites 1 Dado de Combate fallido).' },
  { id: 'curandero', name: 'Manos Sanadoras', cost: 1, desc: 'Una vez por misión, gastando tu acción junto a un aliado, le curas 3 PC sin gastar pociones ni hechizos.' },
  { id: 'veloz', name: 'Zancada Veloz', cost: 1, desc: '+2 casillas permanentes a tu movimiento tanto en exploración (10 casillas) como en combate.' },
  { id: 'afortunado', name: 'Tocado por la Fortuna', cost: 1, desc: 'Una vez por misión puedes repetir cualquier tirada mala de d20 o de Dados de Combate.' },
  { id: 'matamonstruos', name: 'Azote del Caos', cost: 1, desc: 'Elige una familia (Pieles Verdes, No Muertos o Caos): +1 daño extra en críticos y Ventaja al rastrearlos con Supervivencia.' },
  { id: 'maestro_escudo', name: 'Muro de Escudos', cost: 1, desc: 'Mientras lleves escudo equipado, tienes Ventaja en prueba de Agilidad (AGI) contra trampas y hechizos de área.' },
  { id: 'dos_armas', name: 'Combate con Dos Armas', cost: 1, desc: 'Si peleas con armas ligeras de 1 mano (dagas o espadas cortas sin escudo), repites 1 Dado de Combate en cada ataque.' },
  { id: 'negociador', name: 'Mercader Nato', cost: 1, desc: '20% de descuento permanente en tiendas de la Ciudad y +2 a todas tus pruebas de Persuasión.' },
  { id: 'silencioso', name: 'Paso Fantasma', cost: 1, desc: '+2 a Sigilo; abrir puertas y examinar muebles contigo nunca hace ruido ni sube el Reloj del Caos.' },
  { id: 'sintonizado', name: 'Sintonía Arcana', cost: 1, desc: 'Aprendes 2 hechizos de Nivel 1 a elección (1 uso cada uno por misión), incluso si tu clase no es mágica.' },
  { id: 'lider_nato', name: 'Voz de Mando', cost: 1, desc: 'Una vez por combate (acción gratuita), todos los aliados a 3 casillas o menos ganan +1 DC en su próximo ataque.' },
  { id: 'cazatesoros', name: 'Sexto Sentido de Trampas', cost: 1, desc: '+2 a Percepción; al entrar a una sala nueva el DM te avisa si existe al menos una trampa o puerta secreta (sin decir dónde).' },
  { id: 'indomable', name: 'Voluntad Indomable', cost: 1, desc: 'Una vez por misión puedes convertir una tirada de Salvación d20 fallida en un éxito automático.' },
  { id: 'artesano_campo', name: 'Artesano de Campo (Crafteo)', cost: 1, desc: 'Cuando obtengas Materiales de Crafteo en la mazmorra, ganas +1 unidad extra 1 vez por sala y tienes Ventaja en Mezclas Experimentales.' },
];

export const FLAWS = [
  { id: 'codicioso', name: 'Codicia Irresistible', desc: 'Si ves un cofre o tesoro, debes intentar abrirlo/buscarlo antes de salir de la sala (o sufrir Desventaja en tu próxima tirada).' },
  { id: 'temerario', name: 'Sangre Caliente', desc: 'Te cuesta contenerte frente al peligro: tienes -2 en pruebas de Sigilo y debes avanzar hacia los enemigos visibles.' },
  { id: 'claustrofobia', name: 'Temor a la Soledad', desc: 'Si terminas tu turno a más de 3 casillas de cualquier aliado, tienes Desventaja en pruebas de Sabiduría (SAB).' },
  { id: 'orgulloso', name: 'Orgullo Herido', desc: 'Tu actitud altiva molesta a los mercaderes: las compras en Ciudad te cuestan 15% más caras.' },
  { id: 'cicatriz', name: 'Vieja Herida de Guerra', desc: 'Cuando sacas un 1 natural en un d20, pierdes 2 casillas de movimiento en tu próximo turno por el dolor.' },
  { id: 'supersticioso', name: 'Supersticioso', desc: 'Desconfías de altares y magia oscura: tienes -2 en pruebas de Arcano y Alquimia.' },
  { id: 'bocazas', name: 'Lengua Suelta', desc: 'Hablas de más en mal momento: si fallas una prueba de Persuasión o Sigilo, el Reloj del Caos sube +1.' },
  { id: 'fragil_mente', name: 'Pesadillas de Zargon', desc: 'Tu mente es más sensible al terror: entras en Shock al llegar a 1 PM o menos (en vez de a 0 PM).' },
  { id: 'impulsivo', name: 'Manos Inquietas', desc: 'Te distraes fácilmente: tienes -2 en pruebas de Percepción para notar trampas o emboscadas.' },
  { id: 'enemigo_jurado', name: 'Marcado por el Culto', desc: 'Los Asesinos y Guerreros del Terror siempre te eligen como su primer objetivo si pueden alcanzarte.' },
  { id: 'alergia_magia', name: 'Estómago Delicado', desc: 'Las pociones curativas te restauran 1 PC menos de lo normal (mínimo siempre curan 1 PC).' },
  { id: 'honorable', name: 'Código de Honor Estricto', desc: 'Nunca atacas por la espalda ni usas venenos (no puedes aprovechar Ventaja por Flanqueo).' },
];

export const LEVEL_TABLE = [
  { level: 1, xp: 0, prof: 2, tier: 'Fácil (Iniciado)', reward: 'Creación de personaje + Habilidad Base' },
  { level: 2, xp: 600, prof: 2, tier: 'Fácil (Aventurero)', reward: '+PC/PM de clase + Rasgo Nivel 2' },
  { level: 3, xp: 1500, prof: 2, tier: 'Medio (Veterano)', reward: '+PC/PM + Elección de Subclase' },
  { level: 4, xp: 2800, prof: 2, tier: 'Medio (Veterano)', reward: '+PC/PM + Mejora de Atributo (+2 pts) o 1 Ventaja' },
  { level: 5, xp: 4600, prof: 3, tier: 'Medio-Alto (Campeón)', reward: '+PC/PM + Bono Competencia +3 + Poder Nivel 5' },
  { level: 6, xp: 7000, prof: 3, tier: 'Difícil (Campeón)', reward: '+PC/PM + Rasgo Nivel 6' },
  { level: 7, xp: 10000, prof: 3, tier: 'Difícil (Héroe del Reino)', reward: '+PC/PM + Rasgo Nivel 7' },
  { level: 8, xp: 13800, prof: 3, tier: 'Difícil (Héroe del Reino)', reward: '+PC/PM + Mejora de Atributo (+2 pts) o 1 Ventaja' },
  { level: 9, xp: 18500, prof: 4, tier: 'Legendario', reward: '+PC/PM + Bono Competencia +4 + Poder Nivel 9' },
  { level: 10, xp: 24500, prof: 4, tier: 'Legendario (Mito)', reward: '+PC/PM + Habilidad Definitiva Nivel 10' },
];

export const EQUIPMENT_CATALOG = [
  // Armas (Armería Expandida Fetenquest — Contundentes, Alcance, Especiales y Pólvora)
  { id: 'daga', name: 'Daga', type: 'Arma', dice: '1 DC', price: 50, tier: 'Fácil', traits: 'Lanzable a tantas casillas como tus PC máx. (se pierde al lanzarla).' },
  { id: 'hacha_mano', name: 'Hacha de Mano', type: 'Arma', dice: '1 DC', price: 100, tier: 'Fácil', traits: 'Lanzable a tantas casillas como tus PC máx. Recuperable.' },
  { id: 'baston', name: 'Bastón Rúnico', type: 'Arma', dice: '1 DC', price: 150, tier: 'Fácil', traits: 'Diagonal, Contundente (Escudo Negro aturde), 2 manos. Apto Mago.' },
  { id: 'espada_corta', name: 'Espada Corta', type: 'Arma', dice: '2 DC', price: 250, tier: 'Fácil', traits: 'Equilibrada, 1 mano. No Mago.' },
  { id: 'maza', name: 'Maza / Martillo', type: 'Arma', dice: '2 DC', price: 300, tier: 'Fácil', traits: 'Contundente (Escudo Negro no bloqueado aturde 1 turno). No Mago.' },
  { id: 'guadana', name: 'Guadaña de Guerra', type: 'Arma', dice: '1 DC', price: 300, tier: 'Fácil', traits: 'Diagonal, 2 manos. El Escudo Negro cuenta como Calavera adicional. No Mago.' },
  { id: 'cimitarra', name: 'Cimitarra Curva', type: 'Arma', dice: '2 DC', price: 420, tier: 'Medio', traits: '1 mano: puedes repetir 1 dado de tu tirada de ataque. No Mago.' },
  { id: 'estoque', name: 'Estoque', type: 'Arma', dice: '2 DC', price: 450, tier: 'Medio', traits: 'Ataque diagonal, 1 mano.' },
  { id: 'mangual', name: 'Mangual con Cadena', type: 'Arma', dice: '2 DC', price: 480, tier: 'Medio', traits: 'Diagonal y Contundente (Escudo Negro no bloqueado aturde). No Mago.' },
  { id: 'espada_ancha', name: 'Espada Ancha', type: 'Arma', dice: '3 DC', price: 500, tier: 'Medio', traits: '1 mano, sólida y letal. No Mago.' },
  { id: 'martillo_guerra', name: 'Martillo de Guerra', type: 'Arma', dice: '3 DC', price: 550, tier: 'Medio', traits: '1 mano, Contundente (Escudo Negro no bloqueado aturde 1 turno). No Mago.' },
  { id: 'lanza', name: 'Lanza de Guerra', type: 'Arma', dice: '2 DC', price: 550, tier: 'Medio', traits: 'Diagonal y alcance 2 casillas ortogonal. Lanzable y recuperable. 2 manos.' },
  { id: 'alabarda', name: 'Alabarda Imperial', type: 'Arma', dice: '3 DC', price: 700, tier: 'Medio', traits: 'Ataque diagonal o a 1 casilla ortogonal de distancia. 2 manos. No Mago.' },
  { id: 'espada_larga', name: 'Espada Larga', type: 'Arma', dice: '3 DC', price: 750, tier: 'Medio', traits: 'Ataque diagonal, 1 mano. No Mago.' },
  { id: 'hacha_batalla', name: 'Hacha de Batalla', type: 'Arma', dice: '4 DC', price: 900, tier: 'Difícil', traits: '2 manos. No permite escudo. No Mago.' },
  { id: 'mandoble', name: 'Mandoble a Dos Manos', type: 'Arma', dice: '4 DC', price: 1250, tier: 'Difícil', traits: 'Ataque diagonal pesado a 2 manos. No Mago ni razas pequeñas.' },
  { id: 'gran_martillo', name: 'Gran Martillo de Batalla', type: 'Arma', dice: '4 DC', price: 1300, tier: 'Difícil', traits: '2 manos, Contundente (Escudo Negro no bloqueado aturde 1 turno). No Mago.' },
  { id: 'baculo_magico', name: 'Báculo Mágico de Éter', type: 'Arma', dice: '2 DC', price: 1100, tier: 'Difícil', traits: 'Solo Mago. Diagonal, Contundente y recarga 1 uso de un hechizo por misión.' },
  { id: 'arco_corto', name: 'Arco Corto', type: 'Arma', dice: '2 DC', price: 350, tier: 'Fácil', traits: 'A distancia (LdV). Sin enemigos adyacentes. 2 manos.' },
  { id: 'ballesta', name: 'Ballesta Pesada', type: 'Arma', dice: '3 DC', price: 600, tier: 'Medio', traits: 'A distancia (LdV). Sin enemigos adyacentes. 2 manos.' },
  { id: 'arco_compuesto', name: 'Arco Compuesto', type: 'Arma', dice: '3 DC', price: 720, tier: 'Medio', traits: 'A distancia (LdV) sin penalizar movimiento. 2 manos. No Mago.' },
  { id: 'arcabuz', name: 'Arcabuz de Pólvora', type: 'Arma', dice: '4 DC', price: 1150, tier: 'Difícil', traits: 'A distancia (LdV). Cada Escudo Negro causa 1 daño a miniaturas adyacentes al objetivo. 2 manos.' },
  { id: 'varita_sombras', name: 'Varita Arcana', type: 'Arma', dice: '2 DC', price: 400, tier: 'Fácil', traits: 'Daño mágico a distancia (daña Etéreos). Mago/Brujo/Nigromante.' },

  // Armaduras (Solo Herrería / Armería)
  { id: 'escudo', name: 'Escudo de Hierro', type: 'Armadura', dice: '+1 Def', price: 250, tier: 'Fácil', traits: 'Mano secundaria. No con armas a 2 manos.' },
  { id: 'yelmo', name: 'Yelmo de Acero', type: 'Armadura', dice: '+1 Def', price: 300, tier: 'Fácil', traits: 'Cabeza. No Mago.' },
  { id: 'cuero', name: 'Armadura de Cuero', type: 'Armadura', dice: '+1 Def', price: 650, tier: 'Fácil', traits: 'Ligera, sin penalización de Sigilo.' },
  { id: 'cota_malla', name: 'Cota de Malla', type: 'Armadura', dice: '+1 Def', price: 1000, tier: 'Medio', traits: 'Media. No Mago.' },
  { id: 'placas', name: 'Armadura de Placas', type: 'Armadura', dice: '+2 Def', price: 1700, tier: 'Difícil', traits: 'Pesada (-2 casillas de movimiento).' },

  // Accesorios (Equilibrados para Ciudad — SIN duplicar Artefactos Oficiales)
  { id: 'acc_botas_expl', name: 'Botas de Explorador', type: 'Accesorio', dice: '+1 Mov', price: 350, tier: 'Fácil', traits: 'Añade +1 casilla permanente a tu movimiento en exploración y combate.' },
  { id: 'acc_brazales_cuero', name: 'Brazales Reforzados', type: 'Accesorio', dice: '+1 Def (Sin Placas)', price: 500, tier: 'Medio', traits: '+1 Dado de Defensa para clases ligeras o lanzadores (no acumulable con Cota/Placas).' },
  { id: 'acc_amuleto_hierro', name: 'Amuleto de Voluntad Férrea', type: 'Accesorio', dice: '+1 Salvaciones', price: 420, tier: 'Medio', traits: '+1 permanente a todas tus Tiradas de Salvación d20 (Trampas, Veneno y Terror).' },
  { id: 'acc_capa_viajero', name: 'Capa de Viajero Sombrío', type: 'Accesorio', dice: '+2 Sigilo', price: 320, tier: 'Fácil', traits: '+2 a pruebas de Sigilo y Percepción en pasillos oscuros.' },

  // Herramientas de Aventura (Las Pociones viven en la Torre del Alquimista)
  { id: 'herramientas', name: 'Kit de Herramientas', type: 'Herramienta', dice: 'Ventaja AGI', price: 400, tier: 'Fácil', traits: 'Permite desarmar trampas mecánicas con Ventaja.' },
  { id: 'cuerda_garfio', name: 'Cuerda con Garfio', type: 'Herramienta', dice: 'Repetir Salto', price: 350, tier: 'Fácil', traits: 'Al saltar foso o grieta puedes repetir la tirada (con Escudo Negro no caes, pero pierdes la cuerda).' },
  { id: 'abrojos', name: 'Bolsa de Abrojos', type: 'Consumible', dice: 'Frena Enemigo', price: 180, tier: 'Fácil', traits: 'Acción gratuita: deja abrojos en una casilla; quien cruce tira 1 DC (sin Escudo Blanco acaba su movimiento).' },
  { id: 'bomba_humo', name: 'Bomba de Humo', type: 'Consumible', dice: 'Escape', price: 200, tier: 'Fácil', traits: 'Anula el Área de Influencia de 1 enemigo adyacente durante 1 turno para atravesarlo sin penalización.' },
];

export const SPELLS_CATALOG = [
  // ==================== FUEGO (5) ====================
  {
    id: 'bola_fuego', school: 'Fuego', name: 'Bola de Fuego', level: 1, unlockLevel: 1, costPM: 0,
    dice: 2, isMagic: true, isFire: true,
    desc: 'Hechizo oficial: lanza 2 DC de daño de fuego a un objetivo en LdV (Resistencia Física (6 en 1d6) para mitad). Quema regeneración.',
  },
  {
    id: 'coraje', school: 'Fuego', name: 'Coraje', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true, isFire: true,
    buff: { id: 'spell_coraje', label: '🔥 Coraje (+2 DC Ataque)', type: 'buff', duration: 3, attackMod: 2, note: '+2 DC en ataques cuerpo a cuerpo hasta que no queden monstruos visibles.' },
    desc: 'Hechizo oficial: tú o un héroe visible gana +2 DC en ataques cuerpo a cuerpo hasta que no queden monstruos visibles.',
  },
  {
    id: 'ira_fuego', school: 'Fuego', name: 'Fuego de la Ira', level: 1, unlockLevel: 1, costPM: 0,
    dice: 2, isMagic: true, isFire: true,
    desc: 'Hechizo oficial: inflige 2 puntos de daño de fuego a cualquier monstruo en la mazmorra (Resistencia Física (5-6 en 1d6) reduce a 1). Quema regeneración.',
  },
  {
    id: 'llamarada_ceniza', school: 'Fuego', name: 'Muro de Brasas', level: 2, unlockLevel: 3, costPM: 1,
    dice: 2, isMagic: true, isFire: true,
    desc: 'Desbloqueado en Nv.3: creas una línea de llamas en 2 casillas adyacentes durante 2 rondas; cualquier enemigo que cruce sufre 2 DC de fuego.',
  },
  {
    id: 'nova_cenizas', school: 'Fuego', name: 'Nova de Cenizas', level: 3, unlockLevel: 6, costPM: 1,
    dice: 3, isMagic: true, isFire: true,
    desc: 'Desbloqueado en Nv.6: explosión controlada de 3 DC de fuego a todos los enemigos a 2 casillas de ti (no daña aliados; corta regeneración).',
  },

  // ==================== AGUA (5) ====================
  {
    id: 'agua_curativa', school: 'Agua', name: 'Agua Milagrosa', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true, healPC: 4,
    desc: 'Hechizo oficial: restaura hasta 4 PC a ti o a un héroe visible (o evita su muerte instantáneamente al llegar a 0 PC).',
  },
  {
    id: 'sueno', school: 'Agua', name: 'Dormir', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    desc: 'Hechizo oficial: un enemigo vivo resiste con 1 dado rojo por PM (6 resiste) o queda dormido hasta recibir daño o despertar al inicio de su turno.',
  },
  {
    id: 'velo_niebla', school: 'Agua', name: 'Niebla', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    buff: { id: 'spell_niebla', label: '🌫️ Niebla (Atraviesa enemigos)', type: 'buff', duration: 1, note: 'Puedes atravesar casillas ocupadas por monstruos sin provocar ataques este turno.' },
    desc: 'Hechizo oficial: el objetivo puede atravesar casillas ocupadas por monstruos sin provocar ataques este turno.',
  },
  {
    id: 'escarcha_helada', school: 'Agua', name: 'Lanza de Escarcha', level: 2, unlockLevel: 3, costPM: 1,
    dice: 3, isMagic: true,
    desc: 'Desbloqueado en Nv.3: proyectil helado de 3 DC mágicos a distancia; si hiere, reduce el movimiento del enemigo a la mitad en su próximo turno.',
  },
  {
    id: 'marea_purificadora', school: 'Agua', name: 'Marea Purificadora', level: 3, unlockLevel: 6, costPM: 1,
    dice: 0, isMagic: true, healPC: 3, cleansesDebuffs: true,
    desc: 'Desbloqueado en Nv.6: cura +3 PC a hasta 2 aliados visibles y elimina Veneno, Sangrado y Quemadura.',
  },

  // ==================== TIERRA (5) ====================
  {
    id: 'piel_piedra', school: 'Tierra', name: 'Piel de Roca', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    buff: { id: 'spell_piedra', label: '🪨 Piel de Roca (+1 DC Defensa)', type: 'buff', duration: 3, defendMod: 1, note: '+1 Dado de Defensa hasta recibir 1 herida o terminar el combate.' },
    desc: 'Hechizo oficial: tú o un héroe gana +1 Dado de Defensa hasta recibir 1 herida o terminar el combate.',
  },
  {
    id: 'sanar_cuerpo', school: 'Tierra', name: 'Cura Corporal', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true, healPC: 4, cleansesDebuffs: true,
    desc: 'Hechizo oficial: restaura hasta 4 PC a un héroe visible y cura veneno o parálisis.',
  },
  {
    id: 'atravesar_roca', school: 'Tierra', name: 'A Través de la Roca', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    buff: { id: 'spell_roca', label: '🧱 A Través de la Roca', type: 'buff', duration: 1, note: 'Puedes caminar a través de paredes en tu próximo movimiento.' },
    desc: 'Hechizo oficial: un héroe puede caminar a través de paredes durante su próximo movimiento.',
  },
  {
    id: 'temblor_piedra', school: 'Tierra', name: 'Sismo Menor', level: 2, unlockLevel: 3, costPM: 1,
    dice: 2, isMagic: true,
    desc: 'Desbloqueado en Nv.3: sacudes el suelo bajo un enemigo (2 DC mágicos); si falla FUE CD 13 queda Derribado y tus aliados tienen Ventaja contra él.',
  },
  {
    id: 'muro_obsidiana', school: 'Tierra', name: 'Muro de Obsidiana', level: 3, unlockLevel: 6, costPM: 1,
    dice: 0, isMagic: true,
    buff: { id: 'spell_obsidiana', label: '🛡️ Muro de Obsidiana (+2 DC Def)', type: 'buff', duration: 2, defendMod: 2, note: '+2 DC de Defensa por 2 turnos o bloquea 2 casillas.' },
    desc: 'Desbloqueado en Nv.6: levantas un muro de roca que bloquea 2 casillas durante 2 rondas O envuelves a un aliado en +2 DC de Defensa por 2 turnos.',
  },

  // ==================== AIRE (5) ====================
  {
    id: 'genio', school: 'Aire', name: 'Genio', level: 1, unlockLevel: 1, costPM: 0,
    dice: 5, isMagic: true,
    desc: 'Hechizo oficial: abre cualquier puerta en el tablero O ataca a un enemigo visible con 5 DC mágicos.',
  },
  {
    id: 'viento_veloz', school: 'Aire', name: 'Ráfaga (Viento Veloz)', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    buff: { id: 'spell_viento', label: '💨 Ráfaga (+4 Mov / 4d6)', type: 'buff', duration: 1, speedMod: 4, note: 'Duplicas tus dados de movimiento (4d6) en tu próximo turno.' },
    desc: 'Hechizo oficial: un héroe duplica sus dados de movimiento (4d6) en su próximo turno.',
  },
  {
    id: 'tempestad', school: 'Aire', name: 'Tempestad', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    desc: 'Hechizo oficial: un monstruo visible queda envuelto en un torbellino y pierde su próximo turno completo.',
  },
  {
    id: 'relampago_arco', school: 'Aire', name: 'Arco Eléctrico', level: 2, unlockLevel: 3, costPM: 1,
    dice: 2, isMagic: true,
    desc: 'Desbloqueado en Nv.3: disparas un rayo de 2 DC mágicos a un enemigo y salta con 1 DC automático a otro enemigo adyacente.',
  },
  {
    id: 'ojo_huracan', school: 'Aire', name: 'Ojo del Huracán', level: 3, unlockLevel: 6, costPM: 1,
    dice: 2, isMagic: true,
    desc: 'Desbloqueado en Nv.6: onda de viento que empuja 2 casillas a todos los enemigos adyacentes e inflige 2 DC mágicos.',
  },

  // ==================== ESPÍRITU (5 — Bardo / Exorcista) ====================
  {
    id: 'canto_calma', school: 'Espíritu', name: 'Canto de Calma Mental', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true, healPM: 2, cleansesDebuffs: true,
    desc: 'Restaura 2 PM a ti o a un aliado y elimina Shock o Miedo.',
  },
  {
    id: 'eco_espectral', school: 'Espíritu', name: 'Eco Espectral', level: 1, unlockLevel: 1, costPM: 0,
    dice: 2, isMagic: true,
    desc: 'Ataque sónico de 2 DC que ignora armadura y golpea normalmente a Espectros Etéreos.',
  },
  {
    id: 'himno_heroico', school: 'Espíritu', name: 'Himno Heroico', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    buff: { id: 'spell_himno', label: '🎵 Himno Heroico (Ventaja)', type: 'buff', duration: 1, note: 'Todos los aliados en la habitación tienen Ventaja en su siguiente tirada.' },
    desc: 'Todos los aliados en la habitación ganan Ventaja en su siguiente tirada de ataque o salvación.',
  },
  {
    id: 'vinculo_alba', school: 'Espíritu', name: 'Vínculo del Alba', level: 2, unlockLevel: 3, costPM: 1,
    dice: 0, isMagic: true, healPC: 2, healPM: 1,
    desc: 'Desbloqueado en Nv.3: restaura +2 PC y +1 PM a un aliado visible en Línea de Visión.',
  },
  {
    id: 'exorcismo_radiante', school: 'Espíritu', name: 'Exorcismo Radiante', level: 3, unlockLevel: 6, costPM: 1,
    dice: 4, isMagic: true,
    desc: 'Desbloqueado en Nv.6: descarga espiritual de 4 DC contra No Muertos/Espectros (2 DC contra vivos), ignorando resistencia etérea.',
  },

  // ==================== SOMBRAS (5 — Brujo) ====================
  {
    id: 'maldicion_terror', school: 'Sombras', name: 'Maldición del Velo', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    desc: 'Un enemigo defiende con -1 DC y sufre Desventaja en ataques durante 2 turnos.',
  },
  {
    id: 'paso_sombrio', school: 'Sombras', name: 'Paso Sombrío', level: 1, unlockLevel: 1, costPM: 0,
    dice: 0, isMagic: true,
    desc: 'Te teletransportas hasta 6 casillas a cualquier espacio vacío visible.',
  },
  {
    id: 'drenar_esencia', school: 'Sombras', name: 'Drenar Esencia', level: 1, unlockLevel: 1, costPM: 0,
    dice: 3, isMagic: true, healPC: 1,
    desc: 'Ataca con 3 DC mágicos a un objetivo en LdV; recuperas 1 PC por cada herida causada.',
  },
  {
    id: 'lanza_umbria', school: 'Sombras', name: 'Lanza Umbría', level: 2, unlockLevel: 3, costPM: 1,
    dice: 3, isMagic: true,
    desc: 'Desbloqueado en Nv.3: rayo sombrío de 3 DC mágicos que ignora 1 Escudo Negro del enemigo.',
  },
  {
    id: 'eclipse_abisal', school: 'Sombras', name: 'Eclipse Abisal', level: 3, unlockLevel: 6, costPM: 1,
    dice: 0, isMagic: true,
    desc: 'Desbloqueado en Nv.6: oscurece la sala 1 ronda; todos los enemigos atacan con Desventaja y reciben +1 daño mágico.',
  },
];

// ============================================================================
// SISTEMA DE MEJORA DE HECHIZOS (Nivel 1 → Nivel 5, limitado al Nivel del Héroe)
// ============================================================================
export const SPELL_UPGRADE_TIERS = {
  2: {
    gold: 120,
    ingredients: { polvo_runico: 1 },
    tag: 'Perfeccionado',
    bonusText: '+1 DC en daño · +1 PC/PM en curación · +1 CD en control',
  },
  3: {
    gold: 220,
    ingredients: { polvo_runico: 2, pergamino_virgen: 1 },
    tag: 'Potenciado',
    bonusText: '+1 DC/curación y repite 1 Dado de Combate fallido (o +1 ronda en buffs)',
  },
  4: {
    gold: 350,
    ingredients: { polvo_runico: 2, esencia_espectral: 1 },
    tag: 'Arcano Superior',
    bonusText: '+2 DC en daño · +2 PC/PM en curación · Ignora 1 Escudo Negro enemigo',
  },
  5: {
    gold: 500,
    ingredients: { polvo_runico: 3, gema_abismal: 1 },
    tag: 'Maestría Legendaria',
    bonusText: '+2 DC/curación · Ignora 1 Escudo · 4–6 en 1d6 conserva el hechizo sin agotarse (1/misión)',
  },
};

// ============================================================================
// TÉCNICAS DE COMBATE INTERCAMBIABLES (Preparación antes de cada Misión)
// Las clases marciales eligen 2 Técnicas activas antes de cada misión;
// las clases mágicas eligen sus Escuelas de Hechizos activas antes de cada misión.
// ============================================================================
export const COMBAT_TECHNIQUES = [
  {
    id: 'tech_contundente',
    name: 'Golpe Contundente (Aturdidor)',
    icon: '🔨',
    maxUses: 2,
    cooldownTurns: 2,
    damageType: 'Control',
    desc: 'Al atacar cuerpo a cuerpo, cualquier Escudo Negro no bloqueado aturde al enemigo (pierde su próximo turno; Jefes inmunes).',
    buff: { id: 'tech_contundente_b', label: '🔨 Golpe Contundente (Aturde)', type: 'buff', duration: 1 },
  },
  {
    id: 'tech_empuje',
    name: 'Empuje de Vanguardia',
    icon: '💥',
    maxUses: 2,
    cooldownTurns: 1,
    damageType: 'Posición',
    desc: 'Si causas al menos 1 PC de daño cuerpo a cuerpo, empujas al enemigo 2 casillas (si choca contra muro o mueble sufre +1 PC adicional).',
    buff: { id: 'tech_empuje_b', label: '💥 Empuje de Vanguardia (+1 daño choque)', type: 'buff', duration: 1 },
  },
  {
    id: 'tech_muro_escudo',
    name: 'Postura de Muro',
    icon: '🛡️',
    maxUses: 2,
    cooldownTurns: 2,
    damageType: 'Defensa',
    desc: 'Acción gratuita: sumas +2 DC de Defensa hasta tu próximo turno, pero tu movimiento este turno se reduce a la mitad.',
    buff: { id: 'tech_muro_b', label: '🛡️ Postura de Muro (+2 DC Defensa)', type: 'buff', duration: 1, defendMod: 2 },
  },
  {
    id: 'tech_paso_sombrio',
    name: 'Paso Sombrío',
    icon: '🌑',
    maxUses: 2,
    cooldownTurns: 2,
    damageType: 'Movilidad',
    desc: 'Ignoras el Área de Influencia enemiga este turno y puedes atravesar 1 miniatura enemiga para atacar por la espalda con Ventaja.',
    buff: { id: 'tech_sombra_b', label: '🌑 Paso Sombrío (Sin área de influencia)', type: 'buff', duration: 1, speedMod: 2 },
  },
  {
    id: 'tech_corte_giratorio',
    name: 'Corte Giratorio',
    icon: '🌪️',
    maxUses: 1,
    cooldownTurns: 0,
    damageType: 'Área',
    desc: 'Atacas a TODOS los enemigos adyacentes ortogonalmente a ti con tu arma equipada (cada uno defiende por separado).',
    isAttack: true,
    dice: 2,
  },
  {
    id: 'tech_tiro_preciso',
    name: 'Foco Letal',
    icon: '🎯',
    maxUses: 2,
    cooldownTurns: 2,
    damageType: 'Precisión',
    desc: 'Antes de atacar (cuerpo a cuerpo o distancia): puedes repetir hasta 2 Dados de Combate fallidos de esa tirada.',
    buff: { id: 'tech_foco_b', label: '🎯 Foco Letal (Repite 2 DC)', type: 'buff', duration: 1, attackMod: 1 },
  },
  {
    id: 'tech_rompe_guardia',
    name: 'Rompe-Guardia',
    icon: '🪓',
    maxUses: 2,
    cooldownTurns: 2,
    damageType: 'Perforación',
    desc: 'Tu ataque ignora 1 Escudo Negro del enemigo y abre la guardia para que el próximo aliado ataque con Ventaja.',
    buff: { id: 'tech_rompe_b', label: '🪓 Rompe-Guardia (Ignora 1 escudo)', type: 'buff', duration: 1 },
  },
  {
    id: 'tech_auxilios',
    name: 'Primeros Auxilios de Campo',
    icon: '🩹',
    maxUses: 1,
    cooldownTurns: 0,
    damageType: 'Curación',
    desc: 'Junto a un aliado (o a ti mismo): restauras +2 PC y eliminas Sangrado o Veneno sin gastar pociones.',
    targetAlly: true,
    supportHealPC: 2,
  },
];

export function getHeroLoadoutConfig(hero) {
  if (!hero) return { mode: 'techniques', maxPicks: 2, options: COMBAT_TECHNIQUES, defaults: ['tech_empuje', 'tech_foco_letal'] };
  const lvl = Number(hero.level || 1);
  const clsId = hero.classId;

  if (clsId === 'mago') {
    return {
      mode: 'schools',
      maxPicks: lvl >= 5 ? 4 : 3,
      options: ['Fuego', 'Agua', 'Tierra', 'Aire', 'Espíritu', 'Sombras'],
      defaults: lvl >= 5 ? ['Fuego', 'Agua', 'Tierra', 'Aire'] : ['Fuego', 'Agua', 'Tierra'],
    };
  }
  if (['explorador', 'mago_batalla', 'caballero_runico'].includes(clsId)) {
    const def = clsId === 'mago_batalla' ? ['Fuego'] : clsId === 'caballero_runico' ? ['Tierra'] : ['Aire'];
    return {
      mode: 'schools',
      maxPicks: 1,
      options: ['Fuego', 'Agua', 'Tierra', 'Aire'],
      defaults: def,
    };
  }
  if (['druida', 'clerigo'].includes(clsId)) {
    return {
      mode: 'schools',
      maxPicks: 2,
      options: ['Agua', 'Tierra', 'Espíritu'],
      defaults: ['Agua', 'Tierra'],
    };
  }
  if (['bardo', 'exorcista', 'chaman'].includes(clsId)) {
    return {
      mode: 'schools',
      maxPicks: 2,
      options: ['Espíritu', 'Aire', 'Agua'],
      defaults: ['Espíritu', 'Aire'],
    };
  }
  if (['brujo', 'nigromante'].includes(clsId)) {
    return {
      mode: 'schools',
      maxPicks: 2,
      options: ['Sombras', 'Fuego', 'Espíritu'],
      defaults: ['Sombras', 'Fuego'],
    };
  }
  return {
    mode: 'techniques',
    maxPicks: 2,
    options: COMBAT_TECHNIQUES,
    defaults: ['tech_empuje', 'tech_tiro_preciso'],
  };
}

export function getHeroUnlockedSpells(hero) {
  if (!hero) return [];
  const lvl = Number(hero.level || 1);
  const cfg = getHeroLoadoutConfig(hero);
  if (cfg.mode !== 'schools') return [];
  const activeSchools =
    Array.isArray(hero.selectedSchools) && hero.selectedSchools.length > 0
      ? hero.selectedSchools.slice(0, cfg.maxPicks)
      : cfg.defaults;
  return SPELLS_CATALOG.filter((sp) => activeSchools.includes(sp.school) && (sp.unlockLevel || 1) <= lvl);
}

export function getHeroActiveTechniques(hero) {
  if (!hero) return [];
  const cfg = getHeroLoadoutConfig(hero);
  if (cfg.mode !== 'techniques') return [];
  const chosenIds =
    Array.isArray(hero.selectedTechniques) && hero.selectedTechniques.length > 0
      ? hero.selectedTechniques.slice(0, cfg.maxPicks)
      : cfg.defaults;
  return COMBAT_TECHNIQUES.filter((t) => chosenIds.includes(t.id));
}

export function getUpgradedSpellView(spell, spellLevel = 1) {
  const lvl = Math.max(1, Math.min(5, Number(spellLevel || 1)));
  const bonusDice = lvl >= 4 ? 2 : lvl >= 2 ? 1 : 0;
  const bonusHeal = lvl >= 4 ? 2 : lvl >= 2 ? 1 : 0;
  const tierInfo = SPELL_UPGRADE_TIERS[lvl] || null;
  return {
    ...spell,
    spellLevel: lvl,
    effectiveDice: spell.dice > 0 ? spell.dice + bonusDice : 0,
    effectiveHealPC: spell.healPC > 0 ? spell.healPC + bonusHeal : 0,
    effectiveHealPM: spell.healPM > 0 ? spell.healPM + (lvl >= 4 ? 2 : lvl >= 2 ? 1 : 0) : 0,
    upgradeTag: tierInfo?.tag || 'Base',
    upgradeBonusText: tierInfo?.bonusText || '',
  };
}

// Poderes de clase activables limpios (sin texto de relleno), con costes reales y estados (Buff / Debuff)
export const CLASS_ACTIVE_POWERS = {
  barbaro: {
    name: 'Furia Salvaje',
    desc: 'Acción gratuita: durante 3 turnos ganas +1 DC en ataque cuerpo a cuerpo y reduces en 1 punto el daño físico recibido.',
    costPM: 0,
    maxUses: 2,
    cooldownTurns: 2,
    dice: 0,
    damageType: 'Buff',
    isAttack: false,
    buff: { id: 'cls_furia', label: '🔥 Furia Salvaje (+1 DC At, -1 daño físico)', type: 'buff', duration: 3, attackMod: 1, note: '+1 DC ataque cuerpo a cuerpo y -1 daño físico recibido.' },
  },
  caballero: {
    name: 'Escudo del Guardián',
    desc: 'Reacción / Postura: interceptas el golpe hacia un aliado adyacente usando tus Dados de Defensa y ganas +1 DC de Defensa por 1 turno.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 1,
    dice: 0,
    damageType: 'Defensa',
    isAttack: false,
    buff: { id: 'cls_escudo', label: '🛡️ Postura de Guardián (+1 DC Defensa)', type: 'buff', duration: 1, defendMod: 1, note: '+1 Dado de Defensa hasta tu próximo turno.' },
  },
  enano_ingeniero: {
    name: 'Imbuir Arma con Runa',
    desc: 'Gastas 1 Carga de Forja para imbuir tu arma o la de un aliado con +1 DC de ataque durante 2 turnos.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 1,
    dice: 0,
    damageType: 'Buff',
    isAttack: false,
    buff: { id: 'cls_runa', label: '🔧 Arma Rúnica (+1 DC Ataque)', type: 'buff', duration: 2, attackMod: 1, note: '+1 DC de ataque por runa forjada.' },
  },
  picaro: {
    name: 'Ataque Furtivo',
    desc: 'Si atacas por la espalda, con Ventaja o a un enemigo adyacente a un aliado, lanzas un golpe con +1 DC adicional.',
    costPM: 0,
    maxUses: null,
    cooldownTurns: 1,
    diceBonus: 1,
    damageType: 'Físico (Furtivo)',
    isAttack: true,
  },
  explorador: {
    name: 'Presa Marcada',
    desc: 'Acción gratuita: marcas a un enemigo en Línea de Visión; ganas +1 DC de ataque contra él durante 3 turnos.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 0,
    dice: 0,
    damageType: 'Buff',
    isAttack: false,
    buff: { id: 'cls_marca', label: '🏹 Presa Marcada (+1 DC vs objetivo)', type: 'buff', duration: 3, attackMod: 1, note: '+1 DC de ataque contra el enemigo marcado.' },
  },
  mago: {
    name: 'Canalizar Éter',
    desc: 'Gastas 1 PM para potenciar tu próximo hechizo (+1 DC de ataque mágico) o recargar 1 hechizo de Nivel 1 ya usado.',
    costPM: 1,
    maxUses: null,
    cooldownTurns: 0,
    dice: 0,
    damageType: 'Mágico',
    isMagic: true,
    isAttack: false,
    canRechargeSpell: true,
    buff: { id: 'cls_eter', label: '🔮 Éter Canalizado (+1 DC próximo hechizo)', type: 'buff', duration: 2, attackMod: 1, note: '+1 DC mágico en tu próximo hechizo ofensivo.' },
  },
  bardo: {
    name: 'Canción de Valor',
    desc: 'Acción gratuita: otorgas +1 DC de ataque (o +1d6 en d20) a ti o un aliado, o restauras 1 PM perdido.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 0,
    dice: 0,
    damageType: 'Soporte',
    isAttack: false,
    healPM: 1,
    buff: { id: 'cls_valor', label: '🎵 Canción de Valor (+1 DC Ataque)', type: 'buff', duration: 1, attackMod: 1, note: '+1 DC de ataque o +1d6 en tu próxima prueba.' },
  },
  brujo: {
    name: 'Descarga Sobrenatural',
    desc: 'Disparas un rayo mágico de 2 DC a cualquier enemigo en Línea de Visión (daña normalmente a Espectros Etéreos).',
    costPM: 0,
    maxUses: null,
    cooldownTurns: 0,
    dice: 2,
    damageType: 'Mágico',
    isMagic: true,
    isRanged: true,
    isAttack: true,
  },
  paladin: {
    name: 'Castigo Sagrado',
    desc: 'Desatas luz radiante en tu golpe cuerpo a cuerpo: añade +2 DC mágicos (con Ventaja contra No Muertos y Espectros).',
    costPM: 0,
    maxUses: 2,
    cooldownTurns: 1,
    diceBonus: 2,
    damageType: 'Mágico (Radiante)',
    isMagic: true,
    isAttack: true,
  },
  druida: {
    name: 'Forma Salvaje (Oso / Lobo)',
    desc: 'Acción gratuita: te transformas por 3 turnos ganando +1 DC de ataque, +2 casillas de movimiento y +3 PC temporales.',
    costPM: 0,
    maxUses: 2,
    cooldownTurns: 2,
    dice: 0,
    damageType: 'Transformación',
    isAttack: false,
    healPC: 3,
    buff: { id: 'cls_salvaje', label: '🐻 Forma Salvaje (+1 DC At, +2 Mov)', type: 'buff', duration: 3, attackMod: 1, speedMod: 2, note: 'Transformado en bestia: +1 DC ataque y +2 movimiento.' },
  },
  monje: {
    name: 'Ráfaga de Ki',
    desc: 'Gastas 1 Punto de Ki (1 PM) para realizar un ataque extra de 2 DC desarmado o desviar proyectiles.',
    costPM: 1,
    maxUses: 4,
    cooldownTurns: 0,
    dice: 2,
    damageType: 'Físico (Ki)',
    isAttack: true,
  },
  alquimista: {
    name: 'Bomba Alquímica',
    desc: 'Lanzas un frasco explosivo a distancia: 3 DC de daño de fuego/ácido en la casilla objetivo (+1 daño a adyacentes).',
    costPM: 0,
    maxUses: 4,
    cooldownTurns: 0,
    dice: 3,
    damageType: 'Fuego',
    isFire: true,
    isRanged: true,
    isAttack: true,
  },
  exorcista: {
    name: 'Sello del Exorcista',
    desc: 'Gastas 1 PM para lanzar un pulso espiritual de 2 DC mágicos que daña plenamente a Espectros y No Muertos.',
    costPM: 1,
    maxUses: 3,
    cooldownTurns: 0,
    dice: 2,
    damageType: 'Mágico (Espíritu)',
    isMagic: true,
    isRanged: true,
    isAttack: true,
  },
  cazador_sombras: {
    name: 'Aplicar Aceite de Caza',
    desc: 'Acción gratuita: impregnas tu arma con aceite y plata para ganar +2 DC contra una familia elegida durante 3 turnos.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 1,
    dice: 0,
    damageType: 'Buff',
    isAttack: false,
    buff: { id: 'cls_aceite', label: '🎯 Aceite de Caza (+2 DC vs familia)', type: 'buff', duration: 3, attackMod: 2, note: '+2 DC contra la familia de monstruo elegida.' },
  },
  clerigo: {
    name: 'Curación Radiante',
    desc: 'Gastas 1 PM para restaurar 3 PC a un aliado (hasta 4 casillas) o a ti mismo.',
    costPM: 1,
    maxUses: null,
    cooldownTurns: 0,
    dice: 0,
    damageType: 'Curación',
    isAttack: false,
    targetAlly: true,
    supportHealPC: 3,
  },
  maestro_armas: {
    name: 'Maniobra de Acero (Derribar / Abrir Hueco)',
    desc: 'Al golpear, derribas al enemigo (FUE CD 13 → aliados tienen Ventaja) o permites a un aliado adyacente moverse 2 casillas gratis.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 1,
    diceBonus: 1,
    damageType: 'Físico (Táctico)',
    isAttack: true,
  },
  mago_batalla: {
    name: 'Filo Elemental',
    desc: 'Acción gratuita: imbuyes tu arma con Fuego o Rayo durante 2 turnos (+1 DC mágico, daña Etéreos).',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 1,
    dice: 0,
    damageType: 'Mágico',
    isMagic: true,
    isFire: true,
    isAttack: false,
    buff: { id: 'cls_filo_el', label: '⚡ Filo Elemental (+1 DC Mágico)', type: 'buff', duration: 2, attackMod: 1, note: '+1 DC mágico y daña Etéreos.' },
  },
  artificiero: {
    name: 'Artificio de Campo (Mejora / Cepo)',
    desc: 'Mejoras el arma o escudo de un aliado (+1 DC por 2 turnos) o colocas un Cepo de 2 DC en una casilla vacía.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 1,
    dice: 0,
    damageType: 'Soporte',
    isAttack: false,
    buff: { id: 'cls_artif', label: '⚙️ Equipo Mejorado (+1 DC)', type: 'buff', duration: 2, attackMod: 1, note: '+1 DC de ataque o defensa por 2 turnos.' },
  },
  caballero_runico: {
    name: 'Sello Rúnico (Hoja / Escudo)',
    desc: 'Acción gratuita: grabas una runa que otorga +1 DC mágico (daña Etéreos) y +1 DC de Defensa contra Hechizos del Terror por 2 turnos.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 1,
    dice: 0,
    damageType: 'Mágico / Defensa',
    isMagic: true,
    isAttack: false,
    buff: { id: 'cls_runico', label: '🔷 Sello Rúnico (+1 DC Mágico / +1 Def)', type: 'buff', duration: 2, attackMod: 1, defendMod: 1, note: '+1 DC mágico y +1 DC Defensa.' },
  },
  chaman: {
    name: 'Invocar Tótem Ancestral',
    desc: 'Colocas un Tótem por 3 turnos en la sala: cura +1 PC a aliados cercanos o suma +1 DC de ataque.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 2,
    dice: 0,
    damageType: 'Soporte',
    isAttack: false,
    healPC: 1,
    buff: { id: 'cls_totem', label: '🪶 Tótem Activo (+1 DC / +1 PC)', type: 'buff', duration: 3, attackMod: 1, note: 'Tótem ancestral activo en la sala.' },
  },
  nigromante: {
    name: 'Alzar Esqueleto Aliado',
    desc: 'Al caer un enemigo en la sala, levantas 1 Esqueleto Aliado (Mov 6, At 2 DC, Def 2 DC, 2 PC) durante 3 turnos.',
    costPM: 0,
    maxUses: 3,
    cooldownTurns: 1,
    dice: 0,
    damageType: 'Invocación',
    isMagic: true,
    isAttack: false,
  },
  tirador_asedio: {
    name: 'Virote Perforante',
    desc: 'Disparo de ballesta que ignora 1 Escudo Negro enemigo (o reduce a 0 el movimiento del blanco por 1 turno).',
    costPM: 0,
    maxUses: 4,
    cooldownTurns: 0,
    diceBonus: 1,
    damageType: 'Proyectil Perforante',
    isRanged: true,
    isAttack: true,
  },
};

// Rasgos raciales: distingue claramente los ACTIVABLES en misión vs los PASIVOS siempre activos
export const RACIAL_ACTIONS = {
  draconido: {
    active: true,
    name: 'Aliento de Dragón',
    maxUses: 1,
    cooldownTurns: 0,
    dice: 2,
    isMagic: true,
    isAttack: true,
    chooseElement: true,
    desc: 'Exhalas tu aliento elemental en línea recta (3 casillas frente a ti): 2 DC de daño mágico a todos los enemigos en la línea (Agilidad AGI CD 12 mitad).',
  },
  alto_elfo: {
    active: true,
    name: 'Rayo Lunar Menor',
    maxUses: 1,
    cooldownTurns: 2,
    dice: 1,
    damageType: 'Mágico',
    isMagic: true,
    isRanged: true,
    isAttack: true,
    desc: '1 vez por combate lanzas un rayo mágico menor de 1 DC a distancia (daña Etéreos).',
  },
  mediano: {
    active: true,
    name: 'Suerte Insolente',
    maxUses: 1,
    cooldownTurns: 2,
    dice: 0,
    damageType: 'Suerte',
    isAttack: false,
    desc: '1 vez por combate repites un 1 natural en un d20 o repites 1 Dado de Combate fallido.',
  },
  semiorco: {
    active: true,
    name: 'Resistencia Implacable',
    maxUses: 1,
    cooldownTurns: 0,
    dice: 0,
    damageType: 'Supervivencia',
    isAttack: false,
    healPC: 1,
    buff: { id: 'race_orco', label: '🪓 Furia de Superviviente (+1 DC próximo ataque)', type: 'buff', duration: 1, attackMod: 1, note: 'Te mantienes de pie con 1 PC y ganas +1 DC en tu próximo ataque.' },
    desc: '1 vez por misión, al caer a 0 PC te mantienes de pie con 1 PC y ganas +1 DC en tu próximo ataque.',
  },
  goliat: {
    active: true,
    name: 'Piel de Granito',
    maxUses: 1,
    cooldownTurns: 2,
    dice: 0,
    damageType: 'Defensa',
    isAttack: false,
    buff: { id: 'race_goliat', label: '🏔️ Piel de Granito (+1 DC Def / -1 daño)', type: 'buff', duration: 1, defendMod: 1, note: 'Reacción: reduces en 1 punto (o a la mitad) el daño físico recibido.' },
    desc: '1 vez por combate (reacción) reduces en 1 punto (o a la mitad si es mayor) el daño de un ataque físico recibido.',
  },
  elfo_oscuro: {
    active: true,
    name: 'Fuego Feérico',
    maxUses: 1,
    cooldownTurns: 0,
    dice: 0,
    damageType: 'Mágico (Debuff)',
    isMagic: true,
    isAttack: false,
    desc: 'Acción gratuita (1/misión): envuelves en luz violeta a 1 enemigo por 2 rondas; todos tienen Ventaja al atacarlo y no puede esconderse.',
  },
  licantropo_jur: {
    active: true,
    name: 'Desatar Garras (Instinto Lupino)',
    maxUses: 1,
    cooldownTurns: 2,
    dice: 0,
    damageType: 'Buff',
    isAttack: false,
    buff: { id: 'race_lobo', label: '🐺 Garras Lupinas (+1 DC At, +2 Mov)', type: 'buff', duration: 2, attackMod: 1, speedMod: 2, note: '+1 DC ataque cuerpo a cuerpo y +2 casillas de movimiento por 2 turnos.' },
    desc: '1 vez por combate (acción gratuita): desatas tus garras por 2 turnos ganando +1 DC cuerpo a cuerpo y +2 de movimiento.',
  },
  // Razas puramente pasivas (no requieren botón de gasto)
  humano: { active: false, name: 'Determinación Imperial (Pasiva)' },
  enano: { active: false, name: 'Sangre de Piedra y Forja (Pasiva)' },
  elfo_silvano: { active: false, name: 'Paso del Bosque (Pasiva)' },
  tocado_caos: { active: false, name: 'Resistencia del Abismo (Pasiva)' },
  gnomo: { active: false, name: 'Ingenio Explosivo (Pasiva)' },
  semielfo: { active: false, name: 'Vínculo de Dos Mundos (Pasiva)' },
  hombre_lagarto: { active: false, name: 'Escamas Naturales y Pantano (Pasiva)' },
  aasimar: {
    active: true,
    name: 'Toque del Alba',
    maxUses: 1,
    cooldownTurns: 0,
    dice: 0,
    damageType: 'Radiante / Curación',
    isAttack: false,
    targetAlly: true,
    supportHealPC: 2,
    desc: '1 vez por misión (acción gratuita): curas 2 PC a un aliado adyacente o añades +1 DC radiante contra No Muertos/Espectros.',
  },
  feliniano: {
    active: true,
    name: 'Zarpazo Veloz',
    maxUses: 1,
    cooldownTurns: 2,
    dice: 0,
    damageType: 'Movilidad',
    isAttack: false,
    buff: { id: 'race_tabaxi', label: '🐆 Zarpazo Veloz (+4 Mov)', type: 'buff', duration: 1, speedMod: 4, note: 'Duplicas tu movimiento este turno (+4 casillas).' },
    desc: '1 vez por combate (acción gratuita): duplicas tu movimiento este turno para flanquear o escapar.',
  },
};

// Habilidades activables adicionales que se desbloquean automáticamente según el nivel del héroe
export const UNLOCKABLE_CLASS_ABILITIES = {
  mago: [
    {
      id: 'mago_proyectil',
      minLevel: 1,
      name: 'Proyectil Arcano (Ataque Mágico Básico)',
      desc: 'Disparas un rayo mágico de 1 DC a cualquier enemigo que puedas ver. Nunca se agota ni gasta PM (también daña a Espectros Etéreos).',
      costPM: 0,
      maxUses: null,
      cooldownTurns: 0,
      dice: 1,
      damageType: 'Mágico',
      isMagic: true,
      isRanged: true,
      isAttack: true,
    },
    {
      id: 'mago_recuperacion',
      minLevel: 2,
      name: 'Recuperación Arcana',
      desc: '1 vez por misión recuperas +2 PM al instante.',
      costPM: 0,
      maxUses: 1,
      cooldownTurns: 0,
      dice: 0,
      damageType: 'Soporte',
      isAttack: false,
      healPM: 2,
    },
    {
      id: 'mago_escudo',
      minLevel: 6,
      name: 'Escudo Arcano',
      desc: 'Reacción (-1 PM): ganas +2 Dados de Defensa durante 1 turno.',
      costPM: 1,
      maxUses: null,
      cooldownTurns: 0,
      dice: 0,
      damageType: 'Defensa',
      isMagic: true,
      isAttack: false,
      buff: { id: 'mago_escudo_buff', label: '🛡️ Escudo Arcano (+2 DC Defensa)', type: 'buff', duration: 1, defendMod: 2, note: '+2 DC de Defensa hasta tu próximo turno.' },
    },
  ],
  barbaro: [
    {
      id: 'barbaro_temerario',
      minLevel: 2,
      name: 'Ataque Temerario',
      desc: 'Ganas +1 DC de ataque este turno, pero quedas expuesto (-1 DC Defensa hasta tu próximo turno).',
      costPM: 0,
      maxUses: null,
      cooldownTurns: 1,
      dice: 0,
      damageType: 'Buff / Riesgo',
      isAttack: false,
      buff: { id: 'barb_tem_at', label: '⚔️ Temerario (+1 DC Ataque)', type: 'buff', duration: 1, attackMod: 1 },
      debuff: { id: 'barb_tem_def', label: '⚠️ Expuesto (-1 DC Defensa)', type: 'debuff', duration: 1, defendMod: -1 },
    },
  ],
  caballero: [
    {
      id: 'caballero_desafio',
      minLevel: 1,
      name: 'Reto del Caballero (Habilidad Oficial)',
      desc: 'Acción gratuita (1/combate): desafías a un monstruo visible; queda obligado a atacarte solo a ti en su próximo turno y ganas +1 DC de Defensa contra su golpe.',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 2,
      dice: 0,
      damageType: 'Control',
      isAttack: false,
      buff: { id: 'cab_reto', label: '🛡️ Reto del Caballero (+1 DC Defensa)', type: 'buff', duration: 1, defendMod: 1 },
    },
    {
      id: 'caballero_parada_escudo',
      minLevel: 1,
      name: 'Parada con Escudo (Habilidad Oficial)',
      desc: 'Reacción (1/combate): al defender con escudo, añades +2 DC de Defensa adicionales contra un golpe dirigido a ti o a un aliado adyacente.',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 2,
      dice: 0,
      damageType: 'Defensa',
      isAttack: false,
      buff: { id: 'cab_parada', label: '🛡️ Parada con Escudo (+2 DC Defensa)', type: 'buff', duration: 1, defendMod: 2 },
    },
    {
      id: 'caballero_tenacidad',
      minLevel: 3,
      name: 'Tenacidad (Habilidad Oficial)',
      desc: '1 vez por misión: si un golpe te dejaría en 0 PC, resistes en pie con 1 PC y recuperas +1 PC adicional al final de tu turno.',
      costPM: 0,
      maxUses: 1,
      cooldownTurns: 0,
      dice: 0,
      damageType: 'Supervivencia',
      isAttack: false,
      healPC: 2,
    },
  ],
  enano_ingeniero: [
    {
      id: 'enano_trampa',
      minLevel: 6,
      name: 'Trampa Improvisada',
      desc: 'Colocas una trampa mecánica de 3 DC en una casilla adyacente.',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 2,
      dice: 3,
      damageType: 'Trampa',
      isAttack: true,
    },
  ],
  picaro: [
    {
      id: 'picaro_esfumarse',
      minLevel: 5,
      name: 'Esfumarse en Sombras',
      desc: 'Vuelves a Sigilo: ganas +1 DC en tu próximo ataque.',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 2,
      dice: 0,
      damageType: 'Sigilo',
      isAttack: false,
      buff: { id: 'pic_sigilo', label: '🌑 Oculto (+1 DC próximo ataque)', type: 'buff', duration: 1, attackMod: 1 },
    },
  ],
  explorador: [
    {
      id: 'expl_lluvia',
      minLevel: 5,
      name: 'Lluvia de Flechas',
      desc: '1 vez por combate disparas a 2 objetivos distintos en Línea de Visión (2 DC cada uno).',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 2,
      dice: 2,
      damageType: 'Proyectil',
      isRanged: true,
      isAttack: true,
    },
  ],
  bardo: [
    {
      id: 'bardo_palabras',
      minLevel: 2,
      name: 'Palabras Cortantes',
      desc: 'Reacción: restas -1 DC al ataque de un monstruo visible este turno.',
      costPM: 0,
      maxUses: 3,
      cooldownTurns: 1,
      dice: 0,
      damageType: 'Control',
      isAttack: false,
    },
    {
      id: 'bardo_balada',
      minLevel: 5,
      name: 'Balada Sanadora',
      desc: '1 vez por misión: tú y todo el grupo recuperan +1 PC y +1 PM.',
      costPM: 0,
      maxUses: 1,
      cooldownTurns: 0,
      dice: 0,
      damageType: 'Curación',
      isAttack: false,
      healPC: 1,
      healPM: 1,
    },
  ],
  brujo: [
    {
      id: 'brujo_maldicion',
      minLevel: 1,
      name: 'Maldición del Velo',
      desc: 'Malduces a un enemigo visible: defiende con -1 DC durante 2 turnos.',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 1,
      dice: 0,
      damageType: 'Mágico (Debuff)',
      isMagic: true,
      isAttack: false,
    },
  ],
  paladin: [
    {
      id: 'paladin_manos',
      minLevel: 1,
      name: 'Imposición de Manos',
      desc: 'Tocas a un aliado (o a ti mismo) para curar +3 PC sin gastar pociones. Avisa al DM para aplicarle la vida.',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 0,
      dice: 0,
      damageType: 'Curación',
      isAttack: false,
      targetAlly: true,
      supportHealPC: 3,
    },
  ],
  druida: [
    {
      id: 'druida_enredar',
      minLevel: 2,
      name: 'Raíces Enredadoras',
      desc: 'Inmovilizas a un enemigo visible 1 turno (Salvación FUE CD 13).',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 2,
      dice: 0,
      damageType: 'Control',
      isMagic: true,
      isAttack: false,
    },
  ],
  monje: [
    {
      id: 'monje_aturdir',
      minLevel: 5,
      name: 'Golpe Aturdidor',
      desc: 'Gastas 1 PM (Ki): golpe de 2 DC que obliga Resistencia Física (6 en 1d6) o deja Aturdido 1 turno.',
      costPM: 1,
      maxUses: null,
      cooldownTurns: 1,
      dice: 2,
      damageType: 'Físico (Ki)',
      isAttack: true,
    },
  ],
  alquimista: [
    {
      id: 'alq_acido',
      minLevel: 2,
      name: 'Ácido Corrosivo',
      desc: 'Reduces permanentemente -1 DC de Defensa a un monstruo objetivo.',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 2,
      dice: 1,
      damageType: 'Ácido',
      isRanged: true,
      isAttack: true,
    },
  ],
  exorcista: [
    {
      id: 'exo_expulsar',
      minLevel: 2,
      name: 'Expulsar No Muertos',
      desc: 'Todos los No Muertos a 4 casillas resisten con 1 dado rojo por PM (6 resiste) o pierden su próximo turno.',
      costPM: 0,
      maxUses: 2,
      cooldownTurns: 2,
      dice: 0,
      damageType: 'Mágico (Espíritu)',
      isMagic: true,
      isAttack: false,
    },
  ],
  cazador_sombras: [
    {
      id: 'caz_trampa_plata',
      minLevel: 7,
      name: 'Trampa de Plata',
      desc: 'Colocas un cepo de plata que inflige 3 DC e inmoviliza a un Jefe.',
      costPM: 0,
      maxUses: 1,
      cooldownTurns: 0,
      dice: 3,
      damageType: 'Mágico (Plata)',
      isMagic: true,
      isAttack: true,
    },
  ],
};

// Ventajas (Perks) con botón activable en partida (las demás son pasivas siempre activas)
export const PERK_ACTIVE_ABILITIES = {
  curandero: {
    id: 'perk_curandero',
    name: 'Manos Sanadoras (Ventaja)',
    desc: '1 vez por misión: curas +3 PC a un aliado adyacente (o a ti mismo) sin gastar pociones ni hechizos. Avisa al DM para aplicarle la curación.',
    maxUses: 1,
    cooldownTurns: 0,
    damageType: 'Curación',
    targetAlly: true,
    supportHealPC: 3,
  },
  lider_nato: {
    id: 'perk_lider_nato',
    name: 'Voz de Mando (Ventaja)',
    desc: '1 vez por combate (acción gratuita): tú y todos los aliados a 3 casillas o menos ganan +1 DC en su próximo ataque.',
    maxUses: 1,
    cooldownTurns: 2,
    damageType: 'Apoyo Grupal',
    buff: { id: 'perk_voz_mando', label: '📣 Voz de Mando (+1 DC Ataque)', type: 'buff', duration: 1, attackMod: 1, note: '+1 DC en tu próximo ataque.' },
  },
  saqueador: {
    id: 'perk_saqueador',
    name: 'Ojo de Saqueador (Ventaja)',
    desc: '1 vez por misión: al buscar Tesoro o examinar un Mueble, pides al DM robar 2 veces y elegir el mejor resultado.',
    maxUses: 1,
    cooldownTurns: 0,
    damageType: 'Exploración',
  },
  indomable: {
    id: 'perk_indomable',
    name: 'Voluntad Indomable (Ventaja)',
    desc: '1 vez por misión: conviertes una tirada de Salvación d20 fallida en un éxito automático.',
    maxUses: 1,
    cooldownTurns: 0,
    damageType: 'Salvación',
  },
};

// Alineamientos con poder activable en misión (los demás son bonos pasivos siempre activos)
export const ALIGNMENT_ACTIVE_ABILITIES = {
  'Neutral Auténtico': {
    id: 'align_nn',
    name: 'Adaptable (Alineamiento)',
    desc: '1 vez por misión: sumas +2 a cualquier prueba de d20 que necesites en este momento.',
    maxUses: 1,
    cooldownTurns: 0,
    damageType: 'Alineamiento',
  },
  'Caótico Neutral': {
    id: 'align_cn',
    name: 'Impredecible (Alineamiento)',
    desc: '1 vez por misión: repites una tirada de movimiento que haya salido baja.',
    maxUses: 1,
    cooldownTurns: 0,
    damageType: 'Alineamiento',
  },
  'Neutral Malvado': {
    id: 'align_nm',
    name: 'Oportunista (Alineamiento)',
    desc: '1 vez por combate: ganas +1 DC al atacar a un enemigo que ya esté herido o derribado.',
    maxUses: 1,
    cooldownTurns: 2,
    damageType: 'Alineamiento',
    buff: { id: 'align_oport', label: '🗡️ Oportunista (+1 DC vs herido)', type: 'buff', duration: 1, attackMod: 1 },
  },
};

// Guías tácticas personalizadas por clase (cada jugador ve reglas únicas para SU personaje)
export const CLASS_PERSONAL_GUIDES = {
  barbaro: {
    summary: 'Eres la primera línea de choque: aguantas mucho daño físico y pegas muy fuerte cuerpo a cuerpo.',
    howToPlay: 'Activa Furia Salvaje al entrar a un combate duro para ganar +1 DC de ataque y reducir 1 punto el daño físico por 3 turnos. Cuida tus PM (tienes pocos) para no caer en Shock contra Espíritus.',
    proTip: 'Usa Empujar al herir a un enemigo para bloquear puertas y proteger a tu Mago o Pícaro.',
  },
  caballero: {
    summary: 'Eres el escudo viviente del grupo: tu trabajo es absorber golpes y salvar a compañeros heridos.',
    howToPlay: 'Colócate junto a aliados débiles y activa Escudo del Guardián para interceptar ataques hacia ellos con tu alta Defensa.',
    proTip: 'Si equipas Escudo y Cota de Malla, casi ningún monstruo común podrá hacerte daño fácilmente.',
  },
  enano_ingeniero: {
    summary: 'Eres el experto en trampas, puertas y mejoras tácticas de armas.',
    howToPlay: 'Usa tus Cargas de Forja para imbuir armas con +1 DC y busca/desarma trampas antes de que tus compañeros abran cofres.',
    proTip: 'Nunca te separes del frente cuando entren a una sala nueva con cofres o pasillos sospechosos.',
  },
  picaro: {
    summary: 'Eres letal atacando por sorpresa, moviéndote rápido y abriendo cofres/trampas.',
    howToPlay: 'Espera a que un compañero se ponga junto al monstruo y usa Ataque Furtivo (+1 DC extra). Evita quedarte rodeado.',
    proTip: 'Tu Sigilo y Percepción altos son clave para evitar emboscadas y hallar puertas secretas.',
  },
  explorador: {
    summary: 'Eres versátil: disparas desde lejos sin recibir golpes y además tienes magia de apoyo.',
    howToPlay: 'Marca al enemigo más peligroso con Presa Marcada (+1 DC) y atácalo a distancia. Recuerda: no puedes disparar arco si un monstruo está pegado a ti.',
    proTip: 'Guarda tus hechizos de Aire para emergencias o para abrir puertas clave.',
  },
  mago: {
    summary: 'Eres el cerebro táctico y el mayor poder mágico del grupo, pero tu vida (PC) es frágil.',
    howToPlay: 'Mantente detrás de los guerreros. Usa Proyectil Arcano (1 DC, no se gasta ni cuesta PM) para golpes normales, y guarda tus 9 hechizos de 1 uso para momentos críticos. Usa Canalizar Éter (-1 PM) para potenciar un hechizo o recargar uno de Nivel 1.',
    proTip: 'Nunca bajes a 0 PM o caerás en Shock. Tu magia daña plenamente a Espectros Etéreos y Gárgolas.',
  },
  bardo: {
    summary: 'Eres el soporte indispensable: mantienes viva la cordura (PM) y mejoras las tiradas del grupo.',
    howToPlay: 'Activa Canción de Valor para dar +1 DC o recuperar PM, y usa tus Cantos Espirituales contra Espectros y jefes que drenan mente.',
    proTip: 'Eres el mejor personaje para negociar con NPCs gracias a tu alta Persuasión.',
  },
  brujo: {
    summary: 'Lanzas magia oscura constante a distancia y debilitas a los enemigos más duros.',
    howToPlay: 'Tu Descarga Sobrenatural (2 DC mágicos) golpea a distancia incluso a Espectros sin gastar PM. Usa Maldición del Velo en jefes para bajarles -1 DC de defensa.',
    proTip: 'Guarda Drenar Esencia para curarte mientras haces daño fuerte.',
  },
  paladin: {
    summary: 'Combinas ataque sagrado devastador, alta defensa y curación directa para tus aliados.',
    howToPlay: 'Guarda Castigo Sagrado (+2 DC mágicos) para Jefes, Momias y Espectros. Usa Imposición de Manos (+3 PC) para levantar a un compañero herido y avisar al DM.',
    proTip: 'Tu daño radiante ignora resistencias físicas de No Muertos y Etéreos.',
  },
  druida: {
    summary: 'Te adaptas a cualquier situación: curas con magia natural o te transformas en bestia para pelear.',
    howToPlay: 'Activa Forma Salvaje (+1 DC At, +2 Mov, +3 PC) cuando necesites pelear en el frente, y usa tus hechizos de Tierra/Agua para proteger y curar.',
    proTip: 'Piel de Piedra + Forma Salvaje te convierte en un tanque muy difícil de bajar.',
  },
  monje: {
    summary: 'Tienes la mejor movilidad y defensa sin armadura; controlas el campo a golpes rápidos.',
    howToPlay: 'Aprovecha tu alta velocidad para cazar arqueros o magos enemigos. Gasta 1 PM (Ki) en Ráfaga de Ki para hacer ataques extra.',
    proTip: 'No te equipes armadura pesada o perderás tu ventaja de Defensa sin Armadura.',
  },
  alquimista: {
    summary: 'Controlas el tablero con bombas explosivas de fuego/ácido y pociones en vivo.',
    howToPlay: 'Lanza Bombas Alquímicas (3 DC de fuego) contra grupos o monstruos con regeneración (Momias/Trolls). Aprovecha los Bancos de Alquimista para crear pociones gratis.',
    proTip: 'Recoge siempre Materiales de Crafteo en muebles, trampas y cofres.',
  },
  exorcista: {
    summary: 'Eres el terror de los No Muertos y Espectros; proteges la mente (PM) del grupo.',
    howToPlay: 'Usa Sello del Exorcista (-1 PM) para dañar plenamente a Espectros Etéreos y usa tus hechizos de Espíritu para evitar que el grupo caiga en Shock.',
    proTip: 'En misiones de Barak Tor o La Luna del Terror eres la pieza clave del equipo.',
  },
  cazador_sombras: {
    summary: 'Especialista en cazar Jefes y monstruos Élites usando aceites y armas de plata.',
    howToPlay: 'Aplica Aceite de Caza (+2 DC contra una familia) al iniciar un combate fuerte. Tu Espada de Plata daña normalmente a Espectros Etéreos.',
    proTip: 'Coordínate con el grupo para rematar rápidamente al enemigo más peligroso de cada sala.',
  },
  clerigo: {
    summary: 'El pilar de curación y protección del equipo; mantienes en pie a los guerreros y destruyes No Muertos.',
    howToPlay: 'Quédate detrás del Tanque. Usa Curación Radiante (-1 PM) para mantener al grupo sano y Escudo de Fe en quien bloquee la puerta.',
    proTip: 'Expulsar No Muertos puede salvar al equipo entero en criptas y salas con Momias.',
  },
  maestro_armas: {
    summary: 'Vanguardia táctica que crea oportunidades de oro para sus compañeros sin depender de magia.',
    howToPlay: 'Usa Maniobras de Acero para Derribar enemigos duros (dando Ventaja a tu Pícaro o Bárbaro) o Abrir Hueco para sacar de peligro al Mago.',
    proTip: 'Tu verdadero poder está en coordinar ataques con tus aliados.',
  },
  mago_batalla: {
    summary: 'Híbrido versátil que alterna espada encantada y magia elemental según lo que necesite la sala.',
    howToPlay: 'Activa Filo Elemental antes de entrar al cuerpo a cuerpo para dañar Etéreos y cortar regeneración, y guarda tus hechizos para momentos clave.',
    proTip: 'Eres el comodín ideal para apoyar tanto al Tanque como al Mago.',
  },
  artificiero: {
    summary: 'Soporte técnico que potencia el equipo de tus aliados, domina trampas y controla accesos con cepos.',
    howToPlay: 'Coloca Cepos en puertas para frenar hordas, mejora el arma del DPS principal y desarma todas las trampas para ganar Acero y Pólvora extra.',
    proTip: 'Brillas aún más al craftear pociones, bombas y equipo en la Ciudad.',
  },
  caballero_runico: {
    summary: 'Tanque híbrido especialista en resistir Hechizos del Terror y dañar enemigos Etéreos.',
    howToPlay: 'Activa Sello Rúnico al entrar a salas con magos o espectros y apoya con tus hechizos de Tierra.',
    proTip: 'Eres ideal para enfrentarte a jefes hechiceros y proteger al grupo frente a Zargon.',
  },
  chaman: {
    summary: 'Soporte tribal versátil que sostiene al grupo con Tótems y hechizos de Espíritu.',
    howToPlay: 'Coloca tu Tótem Ancestral al inicio del combate y combina curación con presión elemental.',
    proTip: 'Tu Tótem de Tormenta potencia a todo el grupo cuando pelean juntos en una sala.',
  },
  nigromante: {
    summary: 'Invocador táctico que convierte los enemigos caídos en escudos y atacantes aliados.',
    howToPlay: 'En cuanto caiga el primer monstruo, usa Alzar Esqueleto Aliado para bloquear puertas o flanquear.',
    proTip: 'Usa tus hechizos de Sombras para debilitar al jefe antes de lanzar a tu Esqueleto.',
  },
  tirador_asedio: {
    summary: 'Francotirador pesado que atraviesa armaduras enemigas desde largas distancias.',
    howToPlay: 'Busca buena Línea de Visión en pasillos y usa Virote Perforante contra Guerreros del Terror y Gárgolas.',
    proTip: 'Mantente detrás del Tanque: no puedes disparar ballesta si un enemigo está pegado a ti.',
  },
};

// ============================================================================
// RASGOS DE HÉROE (8 Rasgos Claros, Tácticos y Balanceados — HQ-D20 v6.1)
// ============================================================================
export const QUIRKS = [
  {
    id: 'corazon_de_hierro',
    name: 'Corazón de Hierro',
    icon: '🛡️',
    bonus: '+1 PC máximo permanente y Ventaja en pruebas de Fuerza (FUE) contra Sangrado o Veneno.',
    drawback: 'Tu paso firme es más ruidoso: -1 en pruebas de Agilidad (AGI) de sigilo.',
  },
  {
    id: 'instinto_cazador',
    name: 'Instinto de Cazador',
    icon: '🏹',
    bonus: 'Al atacar a un enemigo que ya esté herido, sumas +1 DC de Ataque adicional.',
    drawback: 'Si fallas un ataque sin sacar ninguna calavera, quedas expuesto (-1 DC Defensa 1 turno).',
  },
  {
    id: 'sangre_arcana',
    name: 'Sangre Arcana',
    icon: '✨',
    bonus: '+1 PM máximo permanente y Ventaja en pruebas de Mente (MEN) contra magia y puzzles.',
    drawback: 'Tu cuerpo es más sensible al acero: si un enemigo saca 3+ calaveras, sufres +1 daño extra.',
  },
  {
    id: 'manos_de_oro',
    name: 'Manos de Fortuna',
    icon: '🪙',
    bonus: 'Recibes +25% más oro al revisar cofres o cuerpos y -10% de descuento en la Ciudad.',
    drawback: 'Tu fama atrae odio: los monstruos en estado Venganza te eligen primero como objetivo.',
  },
  {
    id: 'paso_fantasma',
    name: 'Paso Fantasma',
    icon: '🌑',
    bonus: 'Ignoras Zona de Control al retirarte de un enemigo y tienes Ventaja en AGI contra trampas.',
    drawback: 'Complexión ligera: sufres -1 en pruebas de Fuerza (FUE) para forzar puertas o empujar.',
  },
  {
    id: 'vanguardia_implacable',
    name: 'Vanguardia Implacable',
    icon: '⚔️',
    bonus: 'Si entras primero a una sala con enemigos, tu primer ataque gana +1 DC adicional.',
    drawback: 'Lanzarte al frente te deja descubierto (-1 DC Defensa durante esa primera ronda).',
  },
  {
    id: 'alma_inquebrantable',
    name: 'Alma Inquebrantable',
    icon: '🕯️',
    bonus: 'Inmune a Miedo; la primera vez por misión que bajarías a 0 PM te quedas en 1 PM (evitas Shock).',
    drawback: 'Prefieres el frente de batalla: sufres -1 DC al atacar con arcos o ballestas.',
  },
  {
    id: 'tactico_de_campo',
    name: 'Táctico de Campo',
    icon: '🧭',
    bonus: '1 vez por combate (acción gratuita) otorgas +1 DC de Ataque o Defensa a un aliado visible.',
    drawback: 'Depender del equipo te cuesta en solitario: -1 en pruebas de Suerte (SUE) sin aliados en la sala.',
  },
];

// ============================================================================
// TÍTULOS Y LEYENDAS HEROICAS (Hazañas desbloqueables durante la campaña)
// ============================================================================
export const HEROIC_TITLES = [
  { id: 'tit_matajefes', name: 'Azote de los Jefes', icon: '👑', requirement: 'Dar el golpe final a 2 Jefes', perk: '+1 DC en tu primer ataque contra cualquier Jefe.' },
  { id: 'tit_alquimista', name: 'Maestro del Alambique', icon: '🧪', requirement: 'Lograr un Crítico en Mezcla Experimental', perk: '+2 a todas tus pruebas de Arcano al craftear.' },
  { id: 'tit_sobreviviente', name: 'Inquebrantable', icon: '❤️', requirement: 'Sobrevivir a llegar a 0 PC o 0 PM (Shock)', perk: '+1 PC máximo permanente.' },
  { id: 'tit_cazador_nemesis', name: 'Verdugo de Némesis', icon: '💀', requirement: 'Derrotar definitivamente a un Némesis recurrente', perk: '+1 DC en tu primer ataque contra Jefes y Élites en cada misión.' },
  { id: 'tit_salvador', name: 'Héroe del Bastión', icon: '🛡️', requirement: 'Completar 3 Objetivos Secundarios', perk: '-10% permanente en todos los servicios de la Ciudad.' },
  { id: 'tit_ingeniero', name: 'Manos de Relojero', icon: '⚙️', requirement: 'Desarmar 5 trampas sin fallar', perk: '+2 permanente a Desarmar Trampas.' },
];

// ============================================================================
// CONSTRUCTOR COHERENTE DE EQUIPO INICIAL POR CLASE
// Clasifica cada objeto en Arma / Armadura / Poción / Herramienta / Consumible / Accesorio
// con sus dados y función real en mesa (sin clasificar kits como armas ni meter hechizos como ítems)
// ============================================================================
export function buildStartingInventory(cls) {
  const gearList = Array.isArray(cls?.startingGear) ? cls.startingGear : [];
  let weaponEquipped = false;

  return gearList.map((raw, idx) => {
    const lower = `${raw}`.toLowerCase();
    const parenMatch = raw.match(/\(([^)]+)\)/);
    const cleanName = raw.replace(/\s*\([^)]+\)\s*/g, '').trim();
    const inside = parenMatch ? parenMatch[1] : '';

    let type = 'Herramienta';
    let dice = inside || '';
    let traits = 'Equipo representativo inicial de tu clase.';
    let equipped = false;

    if (
      lower.includes('espada') ||
      lower.includes('hacha') ||
      lower.includes('daga') ||
      lower.includes('arco') ||
      lower.includes('ballesta') ||
      lower.includes('bastón') ||
      lower.includes('estoque') ||
      lower.includes('varita') ||
      lower.includes('maza') ||
      lower.includes('puños') ||
      lower.includes('farol de almas')
    ) {
      type = 'Arma';
      const dcMatch = inside.match(/\d+\s*DC/i);
      dice = dcMatch ? dcMatch[0].toUpperCase() : inside || `${cls?.baseAttackDice || 2} DC`;
      if (lower.includes('diagonal')) traits = 'Permite atacar en diagonal además de ortogonal.';
      else if (lower.includes('distancia') || lower.includes('ballesta') || lower.includes('arco'))
        traits = 'Ataque a distancia en Línea de Visión (sin enemigos adyacentes).';
      else if (lower.includes('mágico') || lower.includes('plata') || lower.includes('varita'))
        traits = 'Ataque mágico/plata: daña normalmente a Espectros Etéreos.';
      else if (lower.includes('arrojadiza')) traits = 'Arma ligera arrojadiza (hasta 4 casillas).';
      else traits = 'Arma principal equilibrada de tu clase.';
      if (!weaponEquipped) {
        equipped = true;
        weaponEquipped = true;
      }
    } else if (
      lower.includes('escudo') ||
      lower.includes('cota') ||
      lower.includes('armadura') ||
      lower.includes('capa') ||
      lower.includes('túnica')
    ) {
      type = 'Armadura';
      dice = inside || '+1 Def';
      traits = lower.includes('escudo')
        ? 'Mano secundaria: +1 Dado de Defensa (no combinable con armas a 2 manos).'
        : 'Protección equipada de tu clase (+1 Dado de Defensa).';
      equipped = true;
    } else if (lower.includes('poción') || lower.includes('agua bendita')) {
      type = 'Poción';
      if (lower.includes('curación')) {
        dice = '+2 PC';
        traits = 'Acción gratuita: restaura 2 PC al instante (evita morir al llegar a 0 PC).';
      } else if (lower.includes('clarividencia')) {
        dice = '+2 PM';
        traits = 'Acción gratuita: restaura 2 PM y te saca del Estado de Shock.';
      } else if (lower.includes('agua bendita')) {
        dice = '2 usos';
        traits = 'Arrojadiza (4 casillas): 3 DC indefendibles contra No Muertos y Espectros.';
      }
    } else if (
      lower.includes('bomba') ||
      lower.includes('abrojos') ||
      lower.includes('aceites') ||
      lower.includes('cepo')
    ) {
      type = 'Consumible';
      dice = inside || '1 uso';
      if (lower.includes('bomba de humo')) traits = 'Anula Zona de Control de 1 enemigo durante 1 turno.';
      else if (lower.includes('abrojos')) traits = 'Ralentiza a la mitad a enemigos que crucen esa casilla.';
      else if (lower.includes('aceites')) traits = 'Impregna tu arma (+2 DC contra una familia elegida).';
      else if (lower.includes('cepo')) traits = 'Colócalo en 1 casilla: 2 DC e inmoviliza 1 turno.';
    } else if (lower.includes('laúd') || lower.includes('símbolo') || lower.includes('carcaj') || lower.includes('tótem')) {
      type = 'Accesorio';
      dice = inside || 'Foco de clase';
      if (lower.includes('laúd')) traits = 'Foco musical para Cantos Espirituales y +1 en pruebas de Persuasión.';
      else if (lower.includes('símbolo')) traits = 'Foco sagrado/exorcista: +1 en pruebas contra No Muertos y Espíritus.';
      else if (lower.includes('tótem')) traits = 'Foco ancestral: tus curaciones y Tótems restauran +1 PC adicional.';
      else if (lower.includes('carcaj')) traits = 'Munición lista para disparos continuos con Arco.';
    } else {
      type = 'Herramienta';
      if (lower.includes('alquimia')) {
        dice = '+2 Arcano';
        traits = 'Herramienta de campo: +2 a pruebas de Arcano al destilar o hacer Mezclas Experimentales.';
      } else if (lower.includes('herramientas')) {
        dice = '+2 Trampas';
        traits = 'Permite desarmar trampas mecánicas y forzar cerraduras con Ventaja.';
      } else if (lower.includes('cuerda')) {
        dice = 'Utilidad';
        traits = 'Ventaja en Atletismo para cruzar fosos, trepar o asegurar rescates.';
      }
    }

    return {
      id: `init-${cls?.id || 'hero'}-${idx}`,
      name: cleanName,
      type,
      dice,
      traits,
      special: traits,
      equipped,
      qty: 1,
    };
  });
}
