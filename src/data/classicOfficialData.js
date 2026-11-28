// ============================================================================
// HEROQUEST CLÁSICO (100% OFICIAL — JUEGO BASE 2021 + LA LUNA DEL TERROR)
// Reglas, Bestiario, Mazo de Tesoro, Armería y Héroes originales SIN modificaciones.
// ============================================================================

export const CLASSIC_HERO_PROFILES = [
  {
    id: 'barbarian',
    name: 'Bárbaro',
    expansion: 'Juego Base',
    attack: 3,
    defense: 2,
    body: 8,
    mind: 2,
    movement: '2 Dados Rojos',
    startingWeapon: 'Espada Ancha (3 Dados de Combate)',
    notes: 'El guerrero más fuerte del grupo. Sin hechizos.',
  },
  {
    id: 'dwarf',
    name: 'Enano',
    expansion: 'Juego Base',
    attack: 2,
    defense: 2,
    body: 7,
    mind: 3,
    movement: '2 Dados Rojos',
    startingWeapon: 'Espada Corta (2 Dados de Combate)',
    notes: 'Desarma trampas sin necesidad de Juego de Herramientas: tira 1 Dado de Combate (solo falla con Escudo Negro).',
  },
  {
    id: 'elf',
    name: 'Elfo',
    expansion: 'Juego Base',
    attack: 2,
    defense: 2,
    body: 6,
    mind: 4,
    movement: '2 Dados Rojos',
    startingWeapon: 'Espada Corta (2 Dados de Combate)',
    notes: 'Elige 1 grupo de Hechizos Elementales (3 cartas: Aire, Agua, Fuego o Tierra) antes de cada Misión.',
  },
  {
    id: 'wizard',
    name: 'Mago',
    expansion: 'Juego Base',
    attack: 1,
    defense: 2,
    body: 4,
    mind: 6,
    movement: '2 Dados Rojos',
    startingWeapon: 'Daga (1 Dado de Combate)',
    notes: 'Usa los 3 grupos de Hechizos Elementales restantes (9 cartas). No puede usar armaduras ni la mayoría de armas grandes.',
  },
  {
    id: 'knight',
    name: 'Caballero Guardián',
    expansion: 'La Luna del Terror',
    attack: 2,
    defense: 3,
    body: 7,
    mind: 2,
    movement: '2 Dados Rojos',
    startingWeapon: 'Espada Corta (2 DC) + Escudo (+1 Def)',
    notes: 'Comienza con las 3 Habilidades Oficiales del Caballero: Reto del Caballero, Parada con Escudo y Tenacidad.',
  },
];

// Bestiario 100% Oficial (Estadísticas exactas de las cartas de Monstruo 2021)
export const CLASSIC_MONSTERS = {
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    expansion: 'Juego Base',
    mov: 10,
    at: 2,
    def: 1,
    pc: 1,
    pm: 1,
    notes: 'Rápido y astuto. Puede moverse, atacar y continuar su movimiento restante en el mismo turno (regla clásica opcional de libro).',
  },
  orc: {
    id: 'orc',
    name: 'Orco',
    expansion: 'Juego Base',
    mov: 8,
    at: 3,
    def: 2,
    pc: 1,
    pm: 2,
    notes: 'Soldado estándar de los ejércitos de Zargon.',
  },
  abomination: {
    id: 'abomination',
    name: 'Abominación',
    expansion: 'Juego Base',
    mov: 6,
    at: 3,
    def: 3,
    pc: 2,
    pm: 3,
    notes: 'Criatura anfibia brutal de 2 Puntos Corporales.',
  },
  skeleton: {
    id: 'skeleton',
    name: 'Esqueleto',
    expansion: 'Juego Base',
    mov: 6,
    at: 2,
    def: 2,
    pc: 1,
    pm: 0,
    notes: 'No Muerto. Inmune a hechizos que afectan la mente (como Dormir). Vulnerable a Agua Bendita.',
  },
  zombie: {
    id: 'zombie',
    name: 'Zombi',
    expansion: 'Juego Base',
    mov: 5,
    at: 2,
    def: 3,
    pc: 1,
    pm: 0,
    notes: 'No Muerto resistente (3 Dados de Defensa). Inmune a Dormir. Vulnerable a Agua Bendita.',
  },
  mummy: {
    id: 'mummy',
    name: 'Momia',
    expansion: 'Juego Base',
    mov: 4,
    at: 3,
    def: 4,
    pc: 2,
    pm: 0,
    notes: 'No Muerto poderoso (4 Dados de Defensa y 2 PC). Inmune a Dormir. Vulnerable a Agua Bendita.',
  },
  dread_warrior: {
    id: 'dread_warrior',
    name: 'Guerrero del Terror',
    expansion: 'Juego Base',
    mov: 7,
    at: 4,
    def: 4,
    pc: 3,
    pm: 3,
    notes: 'Élite acorazada de Zargon (4 Ataque, 4 Defensa, 3 PC).',
  },
  gargoyle: {
    id: 'gargoyle',
    name: 'Gárgola',
    expansion: 'Juego Base',
    mov: 6,
    at: 4,
    def: 5,
    pc: 3,
    pm: 4,
    notes: 'Estatua demoníaca viviente con 5 Dados de Defensa y 3 PC.',
  },
  sorcerer: {
    id: 'sorcerer',
    name: 'Hechicero del Terror',
    expansion: 'Juego Base / Luna del Terror',
    mov: 6,
    at: 2,
    def: 3,
    pc: 3,
    pm: 5,
    isCaster: true,
    notes: 'Lanza Hechizos del Terror según las Notas Oficiales de la Misión.',
  },
  assassin: {
    id: 'assassin',
    name: 'Asesino Elfo',
    expansion: 'La Luna del Terror',
    mov: 8,
    at: 3,
    def: 2,
    pc: 2,
    pm: 2,
    notes: 'Oficial (La Luna del Terror): Si no se mueve en su turno, puede realizar DOS ataques. También puede atacar en diagonal.',
  },
  specter: {
    id: 'specter',
    name: 'Espectro',
    expansion: 'La Luna del Terror',
    mov: 6,
    at: 2,
    def: 2,
    pc: 1,
    pm: 3,
    isCaster: true,
    notes: 'Etéreo (Oficial): Puede atravesar paredes, puertas cerradas y figuras. Las armas normales SOLO lo hieren con Escudos Negros (la Magia y los Artefactos lo hieren normal).',
  },
  dread_cultist: {
    id: 'dread_cultist',
    name: 'Cultista del Terror',
    expansion: 'La Luna del Terror',
    mov: 6,
    at: 2,
    def: 2,
    pc: 1,
    pm: 2,
    isCaster: true,
    notes: 'Oficial (La Luna del Terror): Conoce el Hechizo del Terror Canalizar el Terror o Luces del Terror según la misión.',
  },
  dread_knight: {
    id: 'dread_knight',
    name: 'Caballero del Terror',
    expansion: 'La Luna del Terror',
    mov: 6,
    at: 4,
    def: 4,
    pc: 3,
    pm: 3,
    isCaster: true,
    notes: 'Oficial (La Luna del Terror): Guerrero acorazado del Terror al servicio del Culto en Elethorn.',
  },
};

// Mazo Oficial de 24 Cartas de Tesoro (HeroQuest Juego Base 2021)
// returnToDeck: true -> Monstruos Errantes y Trampas se devuelven al mazo y se baraja (regla oficial)
// returnToDeck: false -> Oro, Gemas, Pociones y Nada se descartan hasta la próxima Misión
export const CLASSIC_TREASURE_DECK = [
  // 6 Monstruos Errantes (vuelven al mazo)
  { id: 'tr_wm_1', title: 'Monstruo Errante', category: 'Peligro', returnToDeck: true, icon: '👹', text: 'Mientras buscas, un monstruo te sorprende y ataca de inmediato. Zargon coloca el Monstruo Errante de esta Misión en cualquier casilla adyacente a ti; ataca al instante y luego la carta vuelve al mazo.' },
  { id: 'tr_wm_2', title: 'Monstruo Errante', category: 'Peligro', returnToDeck: true, icon: '👹', text: 'Mientras buscas, un monstruo te sorprende y ataca de inmediato. Zargon coloca el Monstruo Errante de esta Misión en cualquier casilla adyacente a ti; ataca al instante y luego la carta vuelve al mazo.' },
  { id: 'tr_wm_3', title: 'Monstruo Errante', category: 'Peligro', returnToDeck: true, icon: '👹', text: 'Mientras buscas, un monstruo te sorprende y ataca de inmediato. Zargon coloca el Monstruo Errante de esta Misión en cualquier casilla adyacente a ti; ataca al instante y luego la carta vuelve al mazo.' },
  { id: 'tr_wm_4', title: 'Monstruo Errante', category: 'Peligro', returnToDeck: true, icon: '👹', text: 'Mientras buscas, un monstruo te sorprende y ataca de inmediato. Zargon coloca el Monstruo Errante de esta Misión en cualquier casilla adyacente a ti; ataca al instante y luego la carta vuelve al mazo.' },
  { id: 'tr_wm_5', title: 'Monstruo Errante', category: 'Peligro', returnToDeck: true, icon: '👹', text: 'Mientras buscas, un monstruo te sorprende y ataca de inmediato. Zargon coloca el Monstruo Errante de esta Misión en cualquier casilla adyacente a ti; ataca al instante y luego la carta vuelve al mazo.' },
  { id: 'tr_wm_6', title: 'Monstruo Errante', category: 'Peligro', returnToDeck: true, icon: '👹', text: 'Mientras buscas, un monstruo te sorprende y ataca de inmediato. Zargon coloca el Monstruo Errante de esta Misión en cualquier casilla adyacente a ti; ataca al instante y luego la carta vuelve al mazo.' },

  // 5 Peligros / Trampas (vuelven al mazo)
  { id: 'tr_haz_1', title: '¡Peligro! Trampa de Flecha', category: 'Peligro', returnToDeck: true, icon: '🏹', text: '¡Ay! Una flecha sale disparada desde un muro oculto. Pierdes 1 Punto Corporal y tu turno termina de inmediato. Devuelve esta carta al mazo y baraja.' },
  { id: 'tr_haz_2', title: '¡Peligro! Trampa de Flecha', category: 'Peligro', returnToDeck: true, icon: '🏹', text: '¡Ay! Una flecha sale disparada desde un muro oculto. Pierdes 1 Punto Corporal y tu turno termina de inmediato. Devuelve esta carta al mazo y baraja.' },
  { id: 'tr_haz_3', title: '¡Peligro! Trampa de Flecha', category: 'Peligro', returnToDeck: true, icon: '🏹', text: '¡Ay! Al apartar unos escombros se dispara un dardo oculto. Pierdes 1 Punto Corporal y tu turno termina. Devuelve esta carta al mazo y baraja.' },
  { id: 'tr_haz_4', title: '¡Peligro! Trampa de Foso', category: 'Peligro', returnToDeck: true, icon: '🕳️', text: 'El suelo cede bajo tus pies y caes en un foso poco profundo. Pierdes 1 Punto Corporal y tu turno termina. Puedes salir normalmente en tu próximo turno. Devuelve esta carta al mazo.' },
  { id: 'tr_haz_5', title: '¡Peligro! Trampa de Foso', category: 'Peligro', returnToDeck: true, icon: '🕳️', text: 'El suelo cede bajo tus pies y caes en un foso poco profundo. Pierdes 1 Punto Corporal y tu turno termina. Puedes salir normalmente en tu próximo turno. Devuelve esta carta al mazo.' },

  // Oro y Joyas (se descartan)
  { id: 'tr_gold_15a', title: 'Oro (15 Monedas)', category: 'Oro', returnToDeck: false, icon: '🪙', text: 'Encuentras una pequeña bolsa escondida con 15 Monedas de Oro. Anótalas en tu Hoja de Personaje.' },
  { id: 'tr_gold_15b', title: 'Oro (15 Monedas)', category: 'Oro', returnToDeck: false, icon: '🪙', text: 'Entre las grietas de la piedra hallas 15 Monedas de Oro brillantes. Anótalas en tu Hoja de Personaje.' },
  { id: 'tr_gold_20a', title: 'Oro (20 Monedas)', category: 'Oro', returnToDeck: false, icon: '🪙', text: 'Encuentras un saquito de cuero con 20 Monedas de Oro. Anótalas en tu Hoja de Personaje.' },
  { id: 'tr_gold_20b', title: 'Oro (20 Monedas)', category: 'Oro', returnToDeck: false, icon: '🪙', text: 'Ocultas bajo una losa floja hay 20 Monedas de Oro. Anótalas en tu Hoja de Personaje.' },
  { id: 'tr_gold_25a', title: 'Oro (25 Monedas)', category: 'Oro', returnToDeck: false, icon: '💰', text: '¡Buen hallazgo! Encuentras 25 Monedas de Oro acuñadas por el Imperio.' },
  { id: 'tr_gold_25b', title: 'Oro (25 Monedas)', category: 'Oro', returnToDeck: false, icon: '💰', text: 'Hallazgo de 25 Monedas de Oro en un escondite polvoriento.' },
  { id: 'tr_gold_50', title: 'Bolsa de Oro (50 Monedas)', category: 'Oro', returnToDeck: false, icon: '👑', text: '¡Gran botín! Encuentras una pesada bolsa con 50 Monedas de Oro.' },
  { id: 'tr_gem_35', title: 'Gema (35 Monedas)', category: 'Oro', returnToDeck: false, icon: '💎', text: 'Encuentras una gema tallada con un valor de 35 Monedas de Oro.' },
  { id: 'tr_jewels_50', title: 'Joyas (50 Monedas)', category: 'Oro', returnToDeck: false, icon: '💍', text: 'Encuentras una cajita con joyas y anillos valuados en 50 Monedas de Oro.' },

  // Pociones y Consumibles (se descartan)
  { id: 'tr_pot_heal_1', title: 'Poción de Curación', category: 'Poción', returnToDeck: false, icon: '🧪', text: 'Encuentras un frasco de líquido rojo brillante. Bébelo en cualquier momento para restaurar hasta 4 Puntos Corporales perdidos (incluso si caes a 0 PC).' },
  { id: 'tr_pot_heal_2', title: 'Poción de Curación', category: 'Poción', returnToDeck: false, icon: '🧪', text: 'Encuentras un frasco de líquido rojo brillante. Bébelo en cualquier momento para restaurar hasta 4 Puntos Corporales perdidos.' },
  { id: 'tr_pot_str', title: 'Poción de Fuerza', category: 'Poción', returnToDeck: false, icon: '💪', text: 'Bébela antes de atacar para lanzar +2 Dados de Combate adicionales en tu próximo ataque.' },
  { id: 'tr_pot_def', title: 'Poción de Defensa', category: 'Poción', returnToDeck: false, icon: '🛡️', text: 'Bébela antes de defenderte para lanzar +2 Dados de Combate adicionales en tu próxima tirada de defensa.' },
  { id: 'tr_pot_hero', title: 'Poción Heroica', category: 'Poción', returnToDeck: false, icon: '⚔️', text: 'Bébela antes de atacar para poder realizar DOS ataques con arma en este mismo turno.' },
  { id: 'tr_holy_water', title: 'Agua Bendita', category: 'Poción', returnToDeck: false, icon: '✨', text: 'Puedes usar este frasco en lugar de atacar para destruir instantáneamente a cualquier criatura No Muerta (Esqueleto, Zombi o Momia).' },

  // Vacío
  { id: 'tr_nothing', title: '¡Nada!', category: 'Vacío', returnToDeck: false, icon: '💨', text: 'Registras cada rincón con cuidado, pero no encuentras nada de valor aquí.' },
];

// Armería Oficial del Juego Base 2021
export const CLASSIC_ARMORY = [
  { name: 'Daga', cost: 25, type: 'Arma', effect: '1 Dado de Combate. Puede arrojarse a un monstruo visible (se pierde al arrojarla).' },
  { name: 'Bastón', cost: 100, type: 'Arma', effect: '1 Dado de Combate. Permite atacar en diagonal. Usable por el Mago.' },
  { name: 'Espada Corta', cost: 150, type: 'Arma', effect: '2 Dados de Combate. No usable por el Mago.' },
  { name: 'Hacha de Mano', cost: 200, type: 'Arma', effect: '2 Dados de Combate. Puede arrojarse a un monstruo visible (se pierde al arrojarla). No Mago.' },
  { name: 'Espada Ancha', cost: 250, type: 'Arma', effect: '3 Dados de Combate. No usable por el Mago.' },
  { name: 'Espada Larga', cost: 350, type: 'Arma', effect: '3 Dados de Combate. Permite atacar en diagonal. No usable por el Mago.' },
  { name: 'Ballesta', cost: 350, type: 'Arma', effect: '3 Dados de Combate a distancia (línea de visión, nunca adyacente). No usable por el Mago.' },
  { name: 'Hacha de Batalla', cost: 450, type: 'Arma', effect: '4 Dados de Combate (2 manos: no puede usarse con Escudo). No usable por el Mago.' },
  { name: 'Yelmo', cost: 125, type: 'Armadura', effect: '+1 Dado de Defensa. No usable por el Mago.' },
  { name: 'Escudo', cost: 150, type: 'Armadura', effect: '+1 Dado de Defensa (no combinable con Hacha de Batalla o Ballesta). No Mago.' },
  { name: 'Cota de Malla', cost: 500, type: 'Armadura', effect: '3 Dados de Defensa base (reemplaza tus 2 dados base). Combinable con Yelmo y Escudo. No Mago.' },
  { name: 'Armadura de Placas', cost: 850, type: 'Armadura', effect: '4 Dados de Defensa base, pero solo tiras 1 Dado Rojo para moverte. Combinable con Yelmo y Escudo. No Mago.' },
  { name: 'Capa de Protección', cost: 350, type: 'Armadura', effect: '+1 Dado de Defensa. Exclusiva para el Mago.' },
  { name: 'Brazaletes', cost: 550, type: 'Armadura', effect: '+1 Dado de Defensa. Exclusivos para el Mago.' },
  { name: 'Juego de Herramientas', cost: 250, type: 'Equipo', effect: 'Permite desarmar trampas descubiertas: tira 1 Dado de Combate; con Calavera falla y se activa, con cualquier Escudo se desarma.' },
];

// Reglas 100% Oficiales de Trampas (HeroQuest 2021)
export const CLASSIC_TRAP_RULES = {
  trap_pit: {
    name: 'Trampa de Foso',
    detect: 'Buscar Trampas (acción, sin monstruos visibles en la sala/pasillo). Se coloca la loseta de Foso en el tablero.',
    jump: 'Saltar Foso: necesitas al menos 2 casillas de movimiento; tira 1 Dado de Combate. Con Calavera caes al foso (-1 PC y acaba tu turno).',
    disarm: 'Desarmar (Enano o Juego de Herramientas): colócate adyacente y tira 1 Dado de Combate. Enano falla solo con Escudo Negro; Herramientas falla con Calavera.',
    effect: 'Quien pisa el foso cae dentro: sufre 1 PC de daño y su turno termina. Dentro del foso ataca y defiende con -1 Dado de Combate.',
  },
  trap_spear: {
    name: 'Trampa de Lanza',
    detect: 'Buscar Trampas (acción, sin monstruos visibles). Zargon la señala antes de pisarla.',
    jump: 'No se salta una vez activada; se desarma o se evita la casilla.',
    disarm: 'Enano (falla con Escudo Negro) o Juego de Herramientas (falla con Calavera) en 1 Dado de Combate.',
    effect: 'Si un Héroe pisa la casilla sin haberla desarmado, tira 1 Dado de Combate: con Calavera pierde 1 PC (no defendible). Luego la trampa desaparece.',
  },
  trap_falling_rock: {
    name: 'Trampa de Bloque Cayendo',
    detect: 'Buscar Trampas (acción, sin monstruos visibles).',
    jump: 'Si se activa, el Héroe elige avanzar o retroceder 1 casilla vacía y la casilla queda bloqueada permanentemente con un Muro.',
    disarm: 'Enano (falla con Escudo Negro) o Juego de Herramientas (falla con Calavera) en 1 Dado de Combate.',
    effect: 'Tira 3 Dados de Combate: por cada Calavera el Héroe pierde 1 PC (no defendible). La casilla queda bloqueada para siempre.',
  },
};

// Reglas Oficiales Exclusivas de La Luna del Terror (Rise of the Dread Moon)
export const DREAD_MOON_OFFICIAL_RULES = [
  {
    title: '🎭 Disfraz (Sigilo en la Subciudad)',
    text: 'En las misiones con Disfraz, los Héroes no son atacados por Cultistas/Asesinos mientras mantengan su Disfraz. El Disfraz se pierde si un Héroe ataca, lanza un hechizo, busca trampas/tesoros frente a enemigos, o falla una comprobación de las Notas de Misión.',
  },
  {
    title: '👻 Criaturas Etéreas (Espectros)',
    text: 'Los Espectros pueden moverse a través de paredes, puertas cerradas y miniaturas. Las armas físicas normales SOLO les causan daño con Escudos Negros (las Calaveras no cuentan). Los Hechizos y los Artefactos Mágicos los hieren normalmente.',
  },
  {
    title: '⚗️ Mazo de Alquimia y Tienda de Reactivos',
    text: 'Entre misiones (o al encontrar mesas de alquimia indicadas en las Notas), los Héroes pueden comprar o elaborar Pociones del Mazo Oficial de Alquimia (20 cartas) usando el oro y reactivos indicados en el Libro de Misiones.',
  },
  {
    title: '🧝 Mercenarios Élficos',
    text: 'Antes de iniciar una Misión de La Luna del Terror, los Héroes pueden contratar Mercenarios Élficos (Exploradora 50 MO, Ballestera 75 MO, Guja 75 MO, Taladora 100 MO) para acompañarlos durante esa misión.',
  },
];

// ============================================================================
// SISTEMA DE MOBILIARIO ORIGINAL (100% REGLAS CLÁSICAS DE HEROQUEST — SIN D20)
// Solo usa Dados de Combate (DC), Dados Rojos, PC, PM, Oro, Pociones y Monstruos oficiales.
// ============================================================================
export const CLASSIC_FURNITURE_DECK = {
  alchemy_bench: [
    { id: 'cf_alc_1', title: 'Poción de Curación', kind: 'Tesoro', icon: '🧪', text: 'Entre los matraces hallas un frasco rojo brillante: restaura hasta 4 Puntos Corporales en cualquier momento.' },
    { id: 'cf_alc_2', title: 'Poción de Fuerza', kind: 'Tesoro', icon: '💪', text: 'Encuentras un vial de líquido espeso: bébelo antes de atacar para lanzar +2 Dados de Combate adicionales en tu próximo ataque.' },
    { id: 'cf_alc_3', title: 'Poción de Defensa', kind: 'Tesoro', icon: '🛡️', text: 'Encuentras un frasco cristalino: bébelo antes de defenderte para lanzar +2 Dados de Combate adicionales en tu próxima defensa.' },
    { id: 'cf_alc_4', title: 'Poción de Velocidad', kind: 'Tesoro', icon: '💨', text: 'Vial dorado: bébelo para lanzar el doble de Dados Rojos en tu próximo movimiento.' },
    { id: 'cf_alc_5', title: '¡Frasco de Veneno!', kind: 'Peligro', icon: '☠️', text: 'Al destapar un frasco se libera un vapor ácido. Tira 1 Dado de Combate: si sale Calavera pierdes 1 Punto Corporal.' },
    { id: 'cf_alc_6', title: 'Frascos Vacíos', kind: 'Vacío', icon: '💨', text: 'Todos los frascos están secos o rotos. No encuentras nada útil en la mesa.' },
  ],
  bookcase: [
    { id: 'cf_book_1', title: 'Pergamino de Hechizo', kind: 'Tesoro', icon: '📜', text: 'Entre los tomos encuentras un Pergamino con 1 Hechizo Elemental oficial al azar (cualquier Héroe puede lanzarlo una vez).' },
    { id: 'cf_book_2', title: 'Mapa de la Mazmorra', kind: 'Beneficio', icon: '🗺️', text: 'Encuentras planos antiguos: Zargon te revela la ubicación de 1 puerta secreta o 1 trampa en esta sala o pasillo adyacente.' },
    { id: 'cf_book_3', title: 'Oro entre Páginas (15 MO)', kind: 'Tesoro', icon: '🪙', text: 'Dentro de un libro ahuecado hallas 15 Monedas de Oro.' },
    { id: 'cf_book_4', title: '¡Libro con Trampa de Aguja!', kind: 'Peligro', icon: '🏹', text: 'Al tirar del tomo se dispara una aguja oculta. Tira 1 Dado de Combate: si sale Calavera pierdes 1 Punto Corporal.' },
    { id: 'cf_book_5', title: 'Libros Podridos', kind: 'Vacío', icon: '💨', text: 'Los pergaminos se deshacen al tocarlos. No encuentras nada de valor.' },
  ],
  weapon_rack: [
    { id: 'cf_wr_1', title: 'Daga', kind: 'Tesoro', icon: '🗡️', text: 'Encuentras una Daga en buen estado (1 Dado de Combate; puede arrojarse a un monstruo visible).' },
    { id: 'cf_wr_2', title: 'Espada Corta', kind: 'Tesoro', icon: '⚔️', text: 'Encuentras una Espada Corta lista para el combate (2 Dados de Combate; no usable por el Mago).' },
    { id: 'cf_wr_3', title: 'Escudo', kind: 'Tesoro', icon: '🛡️', text: 'Encuentras un Escudo de madera reforzada (+1 Dado de Defensa; no usable por el Mago).' },
    { id: 'cf_wr_4', title: 'Hacha de Mano', kind: 'Tesoro', icon: '🪓', text: 'Encuentras un Hacha de Mano (2 Dados de Combate; puede arrojarse; no usable por el Mago).' },
    { id: 'cf_wr_5', title: 'Piedra de Afilar', kind: 'Beneficio', icon: '✨', text: 'Afilas tu arma: ganas +1 Dado de Combate en tu próximo ataque con arma.' },
    { id: 'cf_wr_6', title: 'Armas Oxidadas', kind: 'Vacío', icon: '💨', text: 'Las armas del armero están completamente oxidadas y quebradizas. No sirven para combatir.' },
  ],
  cupboard: [
    { id: 'cf_cup_1', title: 'Bolsa de Oro (20 MO)', kind: 'Tesoro', icon: '🪙', text: 'En el estante superior encuentras una bolsa escondida con 20 Monedas de Oro.' },
    { id: 'cf_cup_2', title: 'Poción de Curación', kind: 'Tesoro', icon: '🧪', text: 'Oculta tras unos trapos viejos hallas una Poción de Curación (+4 Puntos Corporales).' },
    { id: 'cf_cup_3', title: 'Objetos de Plata (15 MO)', kind: 'Tesoro', icon: '💍', text: 'Encuentras copas y cubiertos de plata por valor de 15 Monedas de Oro.' },
    { id: 'cf_cup_4', title: '¡Bicho Venenoso!', kind: 'Peligro', icon: '🕷️', text: 'Al abrir las puertas algo te muerde la mano. Tira 1 Dado de Combate: con Calavera pierdes 1 Punto Corporal.' },
    { id: 'cf_cup_5', title: 'Armario Vacío', kind: 'Vacío', icon: '💨', text: 'Solo encuentras polvo, telarañas y trapos rotos.' },
  ],
  fireplace: [
    { id: 'cf_fp_1', title: 'Ladrillo Suelto (25 MO)', kind: 'Tesoro', icon: '💰', text: 'Tras un ladrillo flojo en la chimenea encuentras 25 Monedas de Oro.' },
    { id: 'cf_fp_2', title: 'Gema entre Cenizas (35 MO)', kind: 'Tesoro', icon: '💎', text: 'Algo brilla entre el hollín: una Gema valorada en 35 Monedas de Oro.' },
    { id: 'cf_fp_3', title: 'Calor Reconfortante', kind: 'Beneficio', icon: '🔥', text: 'El calor del fuego alivia tus heridas: recuperas 1 Punto Corporal (sin superar tu máximo).' },
    { id: 'cf_fp_4', title: '¡Nube de Hollín!', kind: 'Peligro', icon: '💨', text: 'Un golpe de humo y cenizas te hace toser violentamente: tu turno termina de inmediato.' },
    { id: 'cf_fp_5', title: 'Solo Cenizas', kind: 'Vacío', icon: '💨', text: 'Remueves las brasas frías, pero no hay nada escondido.' },
  ],
  tomb: [
    { id: 'cf_tomb_1', title: 'Joyas Funerarias (50 MO)', kind: 'Tesoro', icon: '👑', text: 'Dentro del sarcófago hallas anillos y joyas antiguas por valor de 50 Monedas de Oro.' },
    { id: 'cf_tomb_2', title: 'Agua Bendita', kind: 'Tesoro', icon: '✨', text: 'Encuentras un frasco de Agua Bendita: úsalo en lugar de atacar para destruir al instante 1 No Muerto.' },
    { id: 'cf_tomb_3', title: '¡Esqueleto Alzado!', kind: 'Peligro', icon: '💀', text: '¡La tapa de piedra se desliza! Zargon coloca 1 Esqueleto adyacente a ti que ataca inmediatamente.' },
    { id: 'cf_tomb_4', title: '¡Maldición de la Tumba!', kind: 'Peligro', icon: '👻', text: 'Un frío sobrenatural atraviesa tu mente. Tira 1 Dado de Combate: con Calavera pierdes 1 Punto Mental.' },
    { id: 'cf_tomb_5', title: 'Tumba Vacía', kind: 'Vacío', icon: '💨', text: 'La tumba ya fue saqueada hace siglos. Solo quedan huesos antiguos.' },
  ],
  sorcerer_table: [
    { id: 'cf_sor_1', title: 'Recarga Arcana', kind: 'Beneficio', icon: '✨', text: 'Si lanzas hechizos, recuperas 1 Hechizo Elemental que ya hayas usado en esta Misión. Si no lanzas hechizos, hallas 20 MO.' },
    { id: 'cf_sor_2', title: 'Pergamino de Hechizo', kind: 'Tesoro', icon: '📜', text: 'Sobre la mesa hay un Pergamino con 1 Hechizo Elemental oficial al azar (1 uso para cualquier Héroe).' },
    { id: 'cf_sor_3', title: '¡Descarga Mágica!', kind: 'Peligro', icon: '⚡', text: 'Una runa protectora estalla al tocar la mesa. Tira 1 Dado de Combate: con Calavera pierdes 1 Punto Corporal.' },
    { id: 'cf_sor_4', title: 'Polvo de Plata (20 MO)', kind: 'Tesoro', icon: '🪙', text: 'Recoges componentes y monedas rituales valorados en 20 Monedas de Oro.' },
    { id: 'cf_sor_5', title: 'Tinta Seca y Velas', kind: 'Vacío', icon: '💨', text: 'Solo hay notas ilegibles y velas derretidas.' },
  ],
  torture_rack: [
    { id: 'cf_tr_1', title: 'Llaves del Carcelero', kind: 'Beneficio', icon: '🗝️', text: 'Encuentras un manojo de herramientas y llaves: puedes desarmar automáticamente la próxima trampa sin tirar dado (1 uso).' },
    { id: 'cf_tr_2', title: 'Monedas Olvidadas (20 MO)', kind: 'Tesoro', icon: '🪙', text: 'Debajo del potro de madera hallas 20 Monedas de Oro.' },
    { id: 'cf_tr_3', title: '¡Mecanismo Oxidado!', kind: 'Peligro', icon: '⚙️', text: 'Una palanca se suelta de golpe. Tira 1 Dado de Combate: con Calavera pierdes 1 Punto Corporal.' },
    { id: 'cf_tr_4', title: 'Nada Útil', kind: 'Vacío', icon: '💨', text: 'Solo cadenas rotas y madera podrida.' },
  ],
  throne: [
    { id: 'cf_th_1', title: 'Compartimento Real (50 MO)', kind: 'Tesoro', icon: '👑', text: 'Bajo el asiento del trono descubres un escondite con 50 Monedas de Oro.' },
    { id: 'cf_th_2', title: 'Gema de la Corona (35 MO)', kind: 'Tesoro', icon: '💎', text: 'Desprendes una gema incrustada en el respaldo valorada en 35 Monedas de Oro.' },
    { id: 'cf_th_3', title: '¡Trampa de Dardo en el Trono!', kind: 'Peligro', icon: '🏹', text: 'Un resorte oculto dispara un dardo: pierdes 1 Punto Corporal y tu turno termina.' },
    { id: 'cf_th_4', title: 'Trono Vacío', kind: 'Vacío', icon: '💨', text: 'Revisas el trono entero, pero no esconde ningún secreto.' },
  ],
  table: [
    { id: 'cf_tab_1', title: 'Monedas sobre la Mesa (15 MO)', kind: 'Tesoro', icon: '🪙', text: 'Recoges 15 Monedas de Oro dejadas tras una partida de dados de los monstruos.' },
    { id: 'cf_tab_2', title: 'Provisiones Frescas', kind: 'Beneficio', icon: '🍞', text: 'Encuentras pan, queso y vino: recuperas 1 Punto Corporal (sin superar tu máximo).' },
    { id: 'cf_tab_3', title: 'Poción de Curación Menor', kind: 'Tesoro', icon: '🧪', text: 'Bajo la mesa encuentras un frasco pequeño que restaura hasta 2 Puntos Corporales.' },
    { id: 'cf_tab_4', title: 'Platos Vacíos', kind: 'Vacío', icon: '💨', text: 'Solo hay restos de comida vieja y jarras vacías.' },
  ],
  chest: [
    { id: 'cf_ch_1', title: 'Tesoro del Cofre (50 MO)', kind: 'Tesoro', icon: '💰', text: 'Dentro del cofre encuentras 50 Monedas de Oro.' },
    { id: 'cf_ch_2', title: 'Gema y Poción', kind: 'Tesoro', icon: '💎', text: 'Encuentras una Gema (35 MO) y una Poción de Curación (+4 Puntos Corporales).' },
    { id: 'cf_ch_3', title: '¡Trampa de Aguja Venenosa!', kind: 'Peligro', icon: '☠️', text: '¡Al abrir la tapa se dispara una aguja! Pierdes 1 Punto Corporal y tu turno termina.' },
    { id: 'cf_ch_4', title: '¡Monstruo Errante!', kind: 'Peligro', icon: '👹', text: '¡El ruido del cofre atrae peligro! Zargon coloca el Monstruo Errante de esta Misión adyacente y ataca al instante.' },
    { id: 'cf_ch_5', title: 'Cofre Vacío', kind: 'Vacío', icon: '💨', text: 'El cofre está completamente vacío.' },
  ],
};

// ============================================================================
// MAZO CLÁSICO DEL MALVADO BRUJO (EVIL WIZARD DECK — 24 CARTAS ORIGINALES)
// Regla Clásica: Cuando Zargon no tiene monstruos en el tablero (o al inicio de su turno),
// roba 1 carta. Las cartas "Instantánea" se juegan al momento; las de "Guardar" quedan en la
// Mano de Zargon para jugarlas durante el combate. 100% Dados de Combate y Dados Rojos.
// ============================================================================
export const CLASSIC_EVIL_WIZARD_DECK = [
  { id: 'cew_1', title: 'Emboscada', timing: 'Instantánea', icon: '👹', text: 'Coloca el Monstruo Errante de esta Misión en cualquier pasillo o sala vacía fuera de la línea de visión de los Héroes. Mueve y ataca normalmente en el turno de Zargon.' },
  { id: 'cew_2', title: 'Llamada de la Horda', timing: 'Instantánea', icon: '👺', text: 'Coloca 2 Goblins en una sala ya explorada o pasillo fuera de la línea de visión de los Héroes.' },
  { id: 'cew_3', title: 'Tumba Profanada', timing: 'Instantánea', icon: '💀', text: 'Coloca 2 Esqueletos en un pasillo o sala vacía fuera de la línea de visión de los Héroes.' },
  { id: 'cew_4', title: 'Oscuridad Repentina', timing: 'Guardar', icon: '🌑', text: 'Juégala al inicio de un turno de los Héroes: hasta el final de la ronda, todos los Héroes lanzan -1 Dado de Combate al atacar (mínimo 1).' },
  { id: 'cew_5', title: 'Frenesí de Batalla', timing: 'Guardar', icon: '⚔️', text: 'Juégala antes de atacar con un Monstruo: ese Monstruo realiza DOS ataques este turno.' },
  { id: 'cew_6', title: 'Armadura Oxidada', timing: 'Guardar', icon: '🛡️', text: 'Elige un Héroe visible: durante el resto de esta ronda lanza -1 Dado de Defensa (mínimo 1).' },
  { id: 'cew_7', title: 'Terremoto', timing: 'Instantánea', icon: '🌋', text: 'La mazmorra tiembla: cada Héroe tira 1 Dado de Combate. Quien saque Calavera pierde 1 Punto Corporal y no puede moverse en su próximo turno.' },
  { id: 'cew_8', title: 'Pánico', timing: 'Guardar', icon: '😱', text: 'Elige a un Héroe: el terror lo paraliza y solo puede tirar 1 Dado Rojo para moverse en su próximo turno.' },
  { id: 'cew_9', title: 'Maldición de Zargon', timing: 'Guardar', icon: '🔮', text: 'Juégala justo después de que un Héroe lance sus dados de ataque o defensa: debe repetir toda la tirada y quedarse con el nuevo resultado.' },
  { id: 'cew_10', title: 'Puerta Atrancada', timing: 'Guardar', icon: '🚪', text: 'Juégala cuando un Héroe intente abrir una puerta: la puerta se atasca. Debe tirar 1 Dado de Combate y sacar Calavera para abrirla (si falla, pierde su acción).' },
  { id: 'cew_11', title: 'Veneno en la Hoja', timing: 'Guardar', icon: '☠️', text: 'Juégala cuando un Monstruo cause al menos 1 punto de daño a un Héroe: ese Héroe pierde 1 Punto Corporal adicional.' },
  { id: 'cew_12', title: 'Piel de Piedra Oscura', timing: 'Guardar', icon: '🪨', text: 'Juégala antes de que un Monstruo se defienda: ese Monstruo lanza +2 Dados de Defensa contra ese ataque.' },
  { id: 'cew_13', title: 'Golpe Traicionero', timing: 'Guardar', icon: '🗡️', text: 'Juégala antes de atacar con un Monstruo: ese Monstruo gana +2 Dados de Ataque en este golpe.' },
  { id: 'cew_14', title: 'Espíritu Inquieto', timing: 'Instantánea', icon: '👻', text: 'El Héroe con menos Puntos Mentales sufre un ataque psíquico: tira 1 Dado Rojo por cada PM; si no saca ningún 6, pierde 1 Punto Mental.' },
  { id: 'cew_15', title: 'Niebla Espesa', timing: 'Guardar', icon: '🌫️', text: 'Durante 1 ronda completa, ningún Héroe puede atacar a distancia (Ballesta, armas arrojadizas) ni lanzar hechizos a más de 3 casillas.' },
  { id: 'cew_16', title: '¡Flecha Oculta!', timing: 'Guardar', icon: '🏹', text: 'Juégala mientras un Héroe se mueve por un pasillo: detén su paso y tira 1 Dado de Combate. Con Calavera pierde 1 Punto Corporal.' },
  { id: 'cew_17', title: 'Sombra de la Muerte', timing: 'Guardar', icon: '🖤', text: 'Juégala cuando un Monstruo vaya a ser derrotado: ignora el último punto de daño y sobrevive con 1 Punto Corporal.' },
  { id: 'cew_18', title: 'Contraataque', timing: 'Guardar', icon: '⚡', text: 'Juégala cuando un Héroe falle su ataque (0 Calaveras) contra un Monstruo adyacente: ese Monstruo ataca gratis de inmediato.' },
  { id: 'cew_19', title: 'Muro de Escombros', timing: 'Guardar', icon: '🧱', text: 'Juégala sobre cualquier puerta abierta: queda bloqueada por magia oscura durante 1 ronda completa (nadie puede cruzarla hasta el próximo turno de Zargon).' },
  { id: 'cew_20', title: 'Furia de Zargon', timing: 'Guardar', icon: '🔥', text: 'Juégala al inicio del turno de Zargon: todos los Monstruos en el tablero lanzan +1 Dado de Ataque este turno.' },
  { id: 'cew_21', title: 'Agotamiento', timing: 'Instantánea', icon: '⛓️', text: 'Una fatiga oscura invade la mazmorra: en su próximo turno todos los Héroes tiran 1 Dado Rojo menos para moverse (mínimo 1 Dado Rojo).' },
  { id: 'cew_22', title: 'Silencio Arcano', timing: 'Guardar', icon: '🤐', text: 'Elige a un Héroe lanzador de hechizos: no podrá lanzar ningún Hechizo durante su próximo turno.' },
  { id: 'cew_23', title: 'Escudo Negro', timing: 'Guardar', icon: '🖤', text: 'Juégala al inicio del turno de los Héroes: durante toda esta ronda, los Monstruos defienden con Escudos Blancos en lugar de Escudos Negros.' },
  { id: 'cew_24', title: 'Silencio en la Mazmorra', timing: 'Instantánea', icon: '💨', text: 'Un escalofrío recorre las paredes, pero nada ocurre... Zargon no obtiene ningún efecto en esta carta.' },
];
