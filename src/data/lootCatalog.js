// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// Catálogo Digital de Armas, Armaduras, Artefactos y Accesorios (6 Rarezas)
// Con Efectos, Mejoras y Desventajas de Balanceo + Generador Procedural
// ============================================================================

// NOTA OFICIAL: Los 21 Artefactos Oficiales NO están en este catálogo genérico porque son
// objetos mágicos únicos que SOLO se obtienen cumpliendo objetivos específicos en el Libro de Misiones.

export const RARITIES = [
  { id: 'comun', name: 'Común', color: '#a8a29e', badge: 'bg-stone-700 text-stone-100', border: 'border-stone-600' },
  { id: 'poco_comun', name: 'Poco Común', color: '#34d399', badge: 'bg-emerald-700 text-emerald-50', border: 'border-emerald-500/70' },
  { id: 'raro', name: 'Raro', color: '#38bdf8', badge: 'bg-sky-700 text-sky-50', border: 'border-sky-500/70' },
  { id: 'epico', name: 'Épico', color: '#c084fc', badge: 'bg-purple-700 text-purple-50', border: 'border-purple-500/80' },
  { id: 'legendario', name: 'Legendario', color: '#fbbf24', badge: 'bg-amber-600 text-black', border: 'border-amber-400' },
  { id: 'mitico', name: 'Mítico', color: '#fb7185', badge: 'bg-gradient-to-r from-rose-600 to-amber-500 text-white', border: 'border-rose-400' },
];

export const getRarityMeta = (rarityId) =>
  RARITIES.find((r) => r.id === rarityId) || RARITIES[0];

export const DIGITAL_LOOT_CATALOG = [
  // ==================== COMÚN ====================
  {
    id: 'l_espada_corta',
    name: 'Espada Corta Imperial',
    type: 'Arma',
    rarity: 'comun',
    dice: '2 DC',
    price: 200,
    special: 'Arma equilibrada de 1 mano. Permite usar Escudo.',
    upgrade: 'Ninguna (base fiable).',
    flaw: '',
    restriction: 'No Mago',
  },
  {
    id: 'l_baston_roble',
    name: 'Bastón de Roble',
    type: 'Arma',
    rarity: 'comun',
    dice: '1 DC',
    price: 150,
    special: 'Ataque diagonal. Contundente (2 manos).',
    upgrade: 'Apto para cualquier lanzador de hechizos.',
    flaw: '',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_escudo_madera',
    name: 'Escudo Reforzado',
    type: 'Armadura',
    rarity: 'comun',
    dice: '+1 Def',
    price: 250,
    special: 'Añade +1 Dado de Defensa en mano secundaria.',
    upgrade: 'Bloquea flechas y ataques cuerpo a cuerpo.',
    flaw: 'No puede usarse con armas a 2 manos.',
    restriction: 'No Mago',
  },

  // ==================== POCO COMÚN ====================
  {
    id: 'l_daga_colmillos',
    name: 'Daga de Colmillo Venenoso',
    type: 'Arma',
    rarity: 'poco_comun',
    dice: '2 DC',
    price: 420,
    special: 'Ligera, arrojadiza (4 casillas) y ataque diagonal.',
    upgrade: 'Si infliges herida, el enemigo salva CON CD 11 o queda Envenenado (-1 DC).',
    flaw: '',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_espada_plata',
    name: 'Espada Ancha de Plata',
    type: 'Arma',
    rarity: 'poco_comun',
    dice: '3 DC',
    price: 600,
    special: 'Forjada en plata pura de Elethorn.',
    upgrade: 'Daña normalmente a Espectros Etéreos y Licántropos.',
    flaw: '',
    restriction: 'No Mago',
  },
  {
    id: 'l_botas_sigilo',
    name: 'Botas de Sombra Silenciosa',
    type: 'Accesorio',
    rarity: 'poco_comun',
    dice: '+1 Mov',
    price: 450,
    special: 'Suelas de cuero élfico que amortiguan cada paso.',
    upgrade: '+2 a pruebas de Sigilo y +1 casilla de movimiento.',
    flaw: '',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_anillo_claridad',
    name: 'Anillo de Claridad Mental',
    type: 'Accesorio',
    rarity: 'poco_comun',
    dice: '+1 PM Máx',
    price: 480,
    special: 'Gema azul que estabiliza la mente frente a Espíritus.',
    upgrade: '+1 PM máximo y Ventaja en salvaciones contra Miedo.',
    flaw: '',
    restriction: 'Todas las clases',
  },

  // ==================== RARO ====================
  {
    id: 'l_hacha_brasas',
    name: 'Hacha de las Brasas',
    type: 'Arma',
    rarity: 'raro',
    dice: '3 DC (Fuego)',
    price: 850,
    special: 'Su filo arde con fuego rúnico al golpear.',
    upgrade: '+1 daño automático contra Momias y Trolls (anula su regeneración).',
    flaw: 'No puedes esconderte en Sigilo mientras la lleves desenfundada.',
    restriction: 'No Mago',
  },
  {
    id: 'l_arco_elethorn',
    name: 'Arco Largo de Elethorn',
    type: 'Arma',
    rarity: 'raro',
    dice: '3 DC (Distancia)',
    price: 900,
    special: 'Dispara a cualquier enemigo en Línea de Visión.',
    upgrade: 'Ignora cobertura de muebles y repite 1 escudo negro en ataque (1 vez/turno).',
    flaw: '2 manos; no puedes atacar enemigos adyacentes.',
    restriction: 'No Mago',
  },
  {
    id: 'l_capa_velo',
    name: 'Capa del Velo Arcano',
    type: 'Armadura',
    rarity: 'raro',
    dice: '+1 Def',
    price: 950,
    special: 'Tejida con hilos de maná para lanzadores.',
    upgrade: '+1 Def y 1 vez por misión anulas un proyectil o hechizo dirigido a ti.',
    flaw: '',
    restriction: 'Solo Mago / Brujo / Bardo / Exorcista',
  },
  {
    id: 'l_amuleto_sangre',
    name: 'Amuleto de Vitalidad Enana',
    type: 'Accesorio',
    rarity: 'raro',
    dice: '+2 PC Máx',
    price: 820,
    special: 'Reliquia forjada bajo la montaña.',
    upgrade: '+2 PC máximos y Ventaja en salvaciones contra veneno y enfermedad.',
    flaw: '',
    restriction: 'Todas las clases',
  },

  // ==================== ÉPICO ====================
  {
    id: 'l_mandoble_venganza',
    name: 'Mandoble de la Venganza Carmesí',
    type: 'Arma',
    rarity: 'epico',
    dice: '4 DC (Diagonal)',
    price: 1450,
    special: 'Espada gigante de 2 manos que ataca en diagonal.',
    upgrade: 'Si matas a un enemigo, realizas inmediatamente 1 ataque gratuito de 3 DC a otro enemigo adyacente.',
    flaw: 'Pesada (-1 casilla de movimiento) y te impide usar Escudo.',
    restriction: 'No Mago',
  },
  {
    id: 'l_baculo_tormenta',
    name: 'Báculo de la Tormenta Viva',
    type: 'Arma',
    rarity: 'epico',
    dice: '2 DC (Mágico)',
    price: 1500,
    special: 'Ataca a distancia (4 casillas) o diagonal con rayos.',
    upgrade: 'Tus hechizos ofensivos ganan +1 DC y puedes recargar 1 hechizo de Nivel 1 por misión.',
    flaw: 'Si sacas un 1 natural en el Dado de Destino, recibes 1 daño eléctrico.',
    restriction: 'Solo Mago / Brujo / Druida / Exorcista',
  },
  {
    id: 'l_brazaletes_duelista',
    name: 'Brazaletes del Duelista Fantasma',
    type: 'Accesorio',
    rarity: 'epico',
    dice: '+1 Def / +2 Init',
    price: 1350,
    special: 'Aumentan reflejos en combate cercano.',
    upgrade: '+1 Def sin armadura pesada, +2 a Iniciativa y 1 vez/combate esquivas 1 impacto.',
    flaw: 'Se desactivan si vistes Cota de Malla o Placas.',
    restriction: 'Todas las clases',
  },

  // ==================== LEGENDARIO (Únicos de Crónicas del Abismo) ====================
  {
    id: 'l_espada_devoradora',
    name: 'Filo Devorador de Almas',
    type: 'Artefacto',
    rarity: 'legendario',
    dice: '4 DC (Mágico)',
    price: 2600,
    special: 'Espada negra que bebe la esencia de los caídos.',
    upgrade: 'Cada vez que matas a un enemigo recuperas 1 PC automáticamente.',
    flaw: 'MALDICIÓN: Al inicio de cada combate pierdes 1 PM si no hieres a un enemigo en 2 turnos.',
    restriction: 'No Mago',
  },
  {
    id: 'l_brazales_mago',
    name: 'Brazales de Mago (Artefacto Base)',
    type: 'Accesorio',
    rarity: 'raro',
    dice: '+1 Def',
    price: 900,
    special: 'Brazales rúnicos del Juego Base diseñados para lanzadores sin armadura.',
    upgrade: '+1 Dado de Defensa permanente y +1 a tiradas de concentración/Arcano.',
    flaw: 'No se acumulan con Cota de Malla ni Armadura de Placas.',
    restriction: 'Solo Mago / Brujo / Bardo / Exorcista',
  },
  {
    id: 'l_agua_bendita',
    name: 'Agua Bendita (Tesoro Base)',
    type: 'Poción',
    rarity: 'poco_comun',
    dice: '3 DC vs No Muertos',
    price: 200,
    special: 'Frasco arrojadizo (hasta 4 casillas): destruye instantáneamente a 1 Esqueleto/Zombi o inflige 3 DC indefendibles a Momias y Espectros.',
    upgrade: 'Ignora armadura y la regla Etéreo.',
    flaw: 'Un solo uso (consumible).',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_pocion_heroismo',
    name: 'Poción Heroica (Tesoro Base)',
    type: 'Poción',
    rarity: 'raro',
    dice: '2 Ataques',
    price: 350,
    special: 'Acción gratuita antes de atacar: te permite realizar DOS ataques completos en este turno.',
    upgrade: 'Combinable con habilidades de clase como Furia o Castigo Sagrado.',
    flaw: 'Un solo uso; tras el turno sufres -1 casilla de movimiento por cansancio.',
    restriction: 'Todas las clases',
  },
  // ==================== CARTAS EXACTAS DEL PDF BASE (EQUIPO, POCIONES Y ARTEFACTOS) ====================
  {
    id: 'l_hacha_enana',
    name: 'Hacha Enana (Equipo Base)',
    type: 'Arma',
    rarity: 'comun',
    dice: '2 DC (Arrojadiza)',
    price: 200,
    special: 'Hacha de mano equilibrada: ataca cuerpo a cuerpo o se lanza a cualquier enemigo en Línea de Visión.',
    upgrade: 'En HQ-D20 puedes recuperarla del suelo al terminar el combate (en reglas clásicas se perdía).',
    flaw: '',
    restriction: 'No Mago',
  },
  {
    id: 'l_brazaletes_cuero',
    name: 'Brazaletes de Cuero Reforzado (Equipo Base)',
    type: 'Armadura',
    rarity: 'poco_comun',
    dice: '+1 Def',
    price: 550,
    special: 'Otorgan +1 Dado de Defensa adicional. Se combinan con Yelmo y/o Escudo.',
    upgrade: 'No penalizan el Sigilo ni el movimiento.',
    flaw: '',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_pocion_defensa',
    name: 'Poción de Defensa (Tesoro Base)',
    type: 'Poción',
    rarity: 'poco_comun',
    dice: '+2 DC Defensa',
    price: 150,
    special: 'Bébela en cualquier momento (acción gratuita) para sumar +2 Dados de Combate en tu próxima defensa.',
    upgrade: 'Puede usarse como reacción justo antes de defender un golpe de Jefe.',
    flaw: 'Un solo uso (consumible).',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_pocion_velocidad',
    name: 'Poción de Velocidad (Equipo Base)',
    type: 'Poción',
    rarity: 'poco_comun',
    dice: 'Doble Mov (4d6)',
    price: 200,
    special: 'Bébela como acción gratuita para lanzar el doble de dados en tu próximo movimiento.',
    upgrade: 'Ignoras terreno difícil durante ese desplazamiento.',
    flaw: 'Un solo uso (consumible).',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_anillo_fortaleza',
    name: 'Anillo de Fortaleza (Artefacto Base)',
    type: 'Accesorio',
    rarity: 'poco_comun',
    dice: '+1 PC Máx',
    price: 500,
    special: 'Anillo mágico del Juego Base que otorga +1 Punto de Cuerpo máximo permanente.',
    upgrade: 'También otorga +1 a salvaciones de Constitución (CON) contra venenos.',
    flaw: '',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_espada_fortuna',
    name: 'Espada Larga de la Fortuna (Artefacto Base)',
    type: 'Artefacto',
    rarity: 'raro',
    dice: '3 DC (Diagonal)',
    price: 1150,
    special: 'Permite atacar en diagonal con 3 Dados de Combate.',
    upgrade: 'Una vez por misión puedes repetir 1 Dado de Combate de tu tirada de ataque (o 1 vez por combate si eres Nivel 5+).',
    flaw: 'No puede ser utilizada por el Mago.',
    restriction: 'No Mago',
  },
  {
    id: 'l_baston_mago',
    name: 'Bastón del Mago (Artefacto Base)',
    type: 'Artefacto',
    rarity: 'raro',
    dice: '2 DC (Diagonal)',
    price: 1100,
    special: 'Brilla con suave luz azul. Otorga 2 Dados de Ataque y ataque en diagonal.',
    upgrade: 'Sus golpes cuentan como mágicos (dañan Espectros Etéreos) y +1 a pruebas de Arcano.',
    flaw: 'Exclusivo de lanzadores arcanos.',
    restriction: 'Solo Mago / Brujo / Bardo / Exorcista',
  },
  {
    id: 'l_filo_fantasma',
    name: 'Filo del Fantasma (Artefacto Base)',
    type: 'Artefacto',
    rarity: 'epico',
    dice: '2 DC (Perfora Armadura)',
    price: 1550,
    special: 'Daga ornamentada que atraviesa cualquier armadura física y hiere normalmente a Espectros Etéreos.',
    upgrade: 'Una vez por misión, el objetivo NO puede lanzar Dados de Defensa contra este ataque.',
    flaw: 'Si sacas 0 calaveras al activar su poder, pierdes 1 PM por retroceso espectral.',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_vara_telekinesis',
    name: 'Vara de Telekinesis (Artefacto Base)',
    type: 'Artefacto',
    rarity: 'epico',
    dice: 'Atrapar Enemigo',
    price: 1650,
    special: 'Una vez por misión atrapas a un monstruo visible en un campo de fuerza mágico.',
    upgrade: 'El monstruo pierde su siguiente turno completo (salvo que supere salvación SAB CD 13).',
    flaw: 'No afecta a Jefes Legendarios en Fase 2.',
    restriction: 'Todas las clases',
  },
  {
    id: 'l_anillo_hechizos',
    name: 'Anillo de Hechizos (Artefacto Base)',
    type: 'Accesorio',
    rarity: 'epico',
    dice: 'Duplica 1 Hechizo',
    price: 1750,
    special: 'Al iniciar cada misión eliges 1 hechizo para alojar en el anillo y poder lanzarlo DOS veces (no simultáneamente).',
    upgrade: 'Excelente para duplicar Agua Curativa, Bola de Fuego o Genio.',
    flaw: 'El segundo lanzamiento cuesta 1 PM adicional.',
    restriction: 'Solo Mago / Brujo / Bardo / Exorcista / Explorador',
  },
  {
    id: 'l_elixir_vida',
    name: 'Elixir de Vida (Artefacto Base)',
    type: 'Artefacto',
    rarity: 'legendario',
    dice: 'Revive 100% PC/PM',
    price: 3000,
    special: 'Botella de líquido perlado que devuelve la vida a un Héroe Caído, restaurando TODOS sus PC y PM al máximo.',
    upgrade: 'También elimina inmediatamente Shock, veneno, parálisis y maldiciones.',
    flaw: 'Un solo uso (reliquia consumible irreemplazable).',
    restriction: 'Todas las clases',
  },

  // ==================== MÍTICO ====================
  {
    id: 'l_martillo_titanes',
    name: 'Rompe-Abismos, Martillo del Fin del Mundo',
    type: 'Artefacto',
    rarity: 'mitico',
    dice: '5 DC (Contundente)',
    price: 4500,
    special: 'Arma mítica a 2 manos capaz de agrietar la piedra.',
    upgrade: 'Ignora 1 escudo enemigo, empuja 2 casillas y los Escudos Negros no bloqueados aturden incluso a Élites.',
    flaw: 'EXIGENCIA MÍTICA: Requiere FUE 15+. Reduce tu movimiento en -2 casillas y si fallas todo el ataque (0 calaveras), el Reloj del Caos sube +1.',
    restriction: 'No Mago',
  },
  {
    id: 'l_corona_elethorn',
    name: 'Corona del Eclipse de Elethorn',
    type: 'Artefacto',
    rarity: 'mitico',
    dice: '+2 Def / +2 PM',
    price: 4800,
    special: 'Reliquia suprema forjada bajo la Luna del Terror.',
    upgrade: 'Eres inmune a Shock y Miedo; 1 vez por misión otorgas Ventaja y +1 DC a TODOS los héroes durante 1 ronda completa.',
    flaw: 'PESO DEL ECLIPSE: Zargon roba 1 carta extra del Malvado Brujo al iniciar cada misión donde se use la Corona.',
    restriction: 'Todas las clases',
  },
];

// ============================================================================
// GENERADOR PROCEDURAL DE BOTÍN CON RAREZA, MEJORAS Y DESVENTAJAS DE BALANCEO
// ============================================================================
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const LOOT_BASES = [
  { type: 'Arma', names: ['Espada Larga', 'Hacha de Batalla', 'Daga', 'Lanza', 'Martillo de Guerra', 'Arco', 'Bastón', 'Varita', 'Cimitarra'], diceByTier: { comun: '2 DC', poco_comun: '2 DC', raro: '3 DC', epico: '4 DC', legendario: '4 DC', mitico: '5 DC' } },
  { type: 'Armadura', names: ['Yelmo', 'Escudo', 'Cota de Malla', 'Capa Rúnica', 'Coraza'], diceByTier: { comun: '+1 Def', poco_comun: '+1 Def', raro: '+1 Def', epico: '+2 Def', legendario: '+2 Def', mitico: '+3 Def' } },
  { type: 'Accesorio', names: ['Anillo', 'Amuleto', 'Brazaletes', 'Botas', 'Talismán', 'Broche'], diceByTier: { comun: '+1 Hab.', poco_comun: '+1 PM/PC', raro: '+2 PC/PM', epico: '+1 Def/+1 DC', legendario: '+2 Stats', mitico: 'Poder Único' } },
];

const LOOT_EPITHETS = [
  'del Alba', 'de la Forja Enana', 'de Elethorn', 'del Abismo', 'de Barak Tor',
  'de Sangre Fría', 'de la Luna Roja', 'de Mentor', 'del Centinela', 'de los Espíritus',
];

const UPGRADES_POOL = {
  comun: ['Acero bien equilibrado, sin penalizaciones.', 'Fácil de empuñar y mantener.'],
  poco_comun: ['Ataque diagonal o +1 a Iniciativa.', '+1 a pruebas de Percepción o Sigilo.', 'Daña normalmente a Espectros Etéreos.'],
  raro: ['+1 DC adicional contra No Muertos o Pieles Verdes.', '1 vez por combate permite repetir 1 Dado de Combate fallido.', 'Al sacar 19–20 en d20, inflige +1 daño extra.'],
  epico: ['Ignora 1 escudo enemigo al atacar (o reduce 1 daño mágico recibido).', 'Cada vez que derrotas un enemigo recuperas 1 PC o 1 PM.', 'Permite realizar un empuje de 2 casillas o teletransporte corto (3 casillas) 1/combate.'],
  legendario: ['+1 DC permanente + crítico natural en 19–20 + cuenta como Artefacto Sagrado.', '1 vez por misión anula por completo un ataque o hechizo de Jefe.', 'Otorga Ventaja en todas tus tiradas contra Jefes y Élites.'],
  mitico: ['+2 Calaveras automáticas 1 vez por combate + daña a todos los enemigos adyacentes.', 'Al caer a 0 PC te revive automáticamente 1 vez por misión con 4 PC y +2 DC.', 'Permite lanzar 2 acciones principales en un mismo turno (1 vez por misión).'],
};

const FLAWS_POOL = [
  'Pesado: reduce en -1 casilla tu movimiento.',
  'Sed de Combate: si pasas 2 turnos de combate sin herir a nadie, pierdes 1 PM.',
  'Llamativo: -2 a todas las pruebas de Sigilo y los enemigos te enfocan primero.',
  'Inestable: al sacar un 1 natural en d20 sufres 1 PC de retroceso.',
  'Eco Oscuro: al activar su poder especial, el Reloj del Caos sube +1.',
  'Exigente: impide usar Escudo o reduce tu defensa en -1 contra ataques mágicos.',
];

export function generateProceduralLoot(forcedRarity = 'auto', partyLevel = 1) {
  let rarityId = forcedRarity;
  if (rarityId === 'auto') {
    const r = Math.random() * 100 + partyLevel * 5;
    if (r < 35) rarityId = 'comun';
    else if (r < 62) rarityId = 'poco_comun';
    else if (r < 82) rarityId = 'raro';
    else if (r < 95) rarityId = 'epico';
    else if (r < 106) rarityId = 'legendario';
    else rarityId = 'mitico';
  }

  const base = pick(LOOT_BASES);
  const baseName = pick(base.names);
  const fullName = rarityId === 'comun' ? `${baseName} de Calidad` : `${baseName} ${pick(LOOT_EPITHETS)}`;
  const upgrade = pick(UPGRADES_POOL[rarityId]);
  const needsFlaw = ['epico', 'legendario', 'mitico'].includes(rarityId) || (rarityId === 'raro' && Math.random() < 0.45);
  const flaw = needsFlaw ? pick(FLAWS_POOL) : '';
  const isMageOnly = ['Bastón', 'Varita', 'Capa Rúnica'].includes(baseName);
  const isNoMage = ['Espada Larga', 'Hacha de Batalla', 'Martillo de Guerra', 'Cota de Malla', 'Coraza', 'Escudo'].includes(baseName);

  return {
    id: `proc-loot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: fullName,
    type: base.type,
    rarity: rarityId,
    dice: base.diceByTier[rarityId],
    special: upgrade,
    upgrade,
    flaw,
    traits: `${upgrade}${flaw ? ` | ⚠️ DESVENTAJA: ${flaw}` : ''}`,
    restriction: isMageOnly ? 'Solo Mago / Brujo / Bardo' : isNoMage ? 'No Mago' : 'Todas las clases',
    equipped: false,
    qty: 1,
  };
}
