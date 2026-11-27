// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// SISTEMA MODULAR DE RECOLECCIÓN Y CRAFTEO ("La Forja y el Alambique")
// 100% Digital — Cero cartas físicas requeridas
// ============================================================================

export const MATERIAL_BRANCHES = [
  {
    id: 'alquimia',
    name: 'Alquimia y Venenos',
    icon: '🧪',
    color: 'text-emerald-300',
    badgeClass: 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200',
    desc: 'Pociones, tónicos arriesgados, venenos para hojas, fuego griego y banquetes.',
  },
  {
    id: 'forja',
    name: 'Forja e Ingeniería',
    icon: '⚒️',
    color: 'text-amber-300',
    badgeClass: 'bg-amber-950/60 border-amber-700/60 text-amber-200',
    desc: 'Bombas, trampas tácticas, mejoras temporales y nivelación de artefactos (Nv.1–5).',
  },
  {
    id: 'arcano',
    name: 'Arcano y Runas',
    icon: '🔮',
    color: 'text-purple-300',
    badgeClass: 'bg-purple-950/60 border-purple-700/60 text-purple-200',
    desc: 'Pergaminos de hechizos y runas grabables permanentes para armas y armaduras.',
  },
  {
    id: 'equipo',
    name: 'Forja de Equipo (Solo Ciudad)',
    icon: '🛡️',
    color: 'text-sky-300',
    badgeClass: 'bg-sky-950/60 border-sky-700/60 text-sky-200',
    desc: 'Armas, armaduras y escudos forjados por rareza (Común → Legendario). Más poder pide más materiales y oro.',
  },
];

export const MATERIALS_CATALOG = [
  // ALQUIMIA Y VENENOS
  {
    id: 'hierba_lunar',
    name: 'Hierba Lunar',
    branch: 'alquimia',
    icon: '🌿',
    rarity: 'Común',
    value: 15,
    sources: 'Mobiliario (Armario, Banco de Alquimista), Salas de Peligro de Hongos/Humedad, Tesoros.',
    desc: 'Base curativa luminiscente usada en pociones de PC, PM y antídotos.',
  },
  {
    id: 'glandula_veneno',
    name: 'Glándula de Veneno',
    branch: 'alquimia',
    icon: '☠️',
    rarity: 'Común',
    value: 20,
    sources: 'Goblins, Abominaciones, Arañas, Trampas de Aguja desarmadas.',
    desc: 'Toxina concentrada para recubrir armas o fabricar venenos tácticos.',
  },
  {
    id: 'sangre_icor',
    name: 'Ícor Oscuro',
    branch: 'alquimia',
    icon: '🩸',
    rarity: 'Poco Común',
    value: 30,
    sources: 'Orcos, Guerreros del Terror, Jefes, Altares profanos.',
    desc: 'Sangre alquímica potente que impulsa tónicos de alto riesgo y gran poder.',
  },
  {
    id: 'racion_mazmorra',
    name: 'Ración de Mazmorra',
    branch: 'alquimia',
    icon: '🍖',
    rarity: 'Común',
    value: 12,
    sources: 'Mesas, Chimeneas, Despensas, Campamentos de Orcos/Goblins.',
    desc: 'Provisiones rescatables. Úsalas en la Taberna para preparar Banquetes con bonos de misión.',
  },

  // FORJA E INGENIERÍA
  {
    id: 'chatarra_acero',
    name: 'Acero Templado',
    branch: 'forja',
    icon: '⚙️',
    rarity: 'Común',
    value: 20,
    sources: 'Armerías, Guerreros del Terror, Gárgolas, Trampas Mecánicas desarmadas.',
    desc: 'Lingotes y placas de calidad para reforzar armas, armaduras y trampas.',
  },
  {
    id: 'polvora_negra',
    name: 'Pólvora Negra',
    branch: 'forja',
    icon: '💣',
    rarity: 'Poco Común',
    value: 30,
    sources: 'Cofres, Armerías, Chimeneas, Goblins Ingenieros, Salas de Gas.',
    desc: 'Polvo explosivo enano para bombas de área, humo y cargas de demolición.',
  },
  {
    id: 'colmillos_hueso',
    name: 'Huesos y Colmillos',
    branch: 'forja',
    icon: '🦴',
    rarity: 'Común',
    value: 15,
    sources: 'Esqueletos, Momias, Zombis, Tumbas, Bestias.',
    desc: 'Material ligero para abrojos, puntas de flecha y refuerzos bárbaros.',
  },
  {
    id: 'aceite_alquitran',
    name: 'Aceite y Alquitrán',
    branch: 'forja',
    icon: '🛢️',
    rarity: 'Común',
    value: 18,
    sources: 'Mesas, Chimeneas, Bancos de Alquimista, Barriles.',
    desc: 'Combustible espeso ideal para Fuego Griego, bombas incendiarias y mantenimiento.',
  },

  // ARCANO Y RUNAS
  {
    id: 'polvo_runico',
    name: 'Polvo Rúnico',
    branch: 'arcano',
    icon: '✨',
    rarity: 'Poco Común',
    value: 35,
    sources: 'Bibliotecas, Altares del Mago, Hechiceros, Puzzles resueltos.',
    desc: 'Polvo cristalino necesario para grabar runas permanentes en equipo.',
  },
  {
    id: 'esencia_espectral',
    name: 'Esencia Espectral',
    branch: 'arcano',
    icon: '👻',
    rarity: 'Raro',
    value: 45,
    sources: 'Espectros, Espíritus Guerreros, Liches, Salas Encantadas.',
    desc: 'Ectoplasma puro que vuelve mágica cualquier arma contra enemigos Etéreos.',
  },
  {
    id: 'gema_abismal',
    name: 'Gema Abismal',
    branch: 'arcano',
    icon: '💎',
    rarity: 'Raro',
    value: 60,
    sources: 'Jefes, Cofres Sellados, Salas del Tesoro, Artefactos rotos.',
    desc: 'Núcleo de energía necesario para subir Artefactos de Nivel 1 a Nivel 5.',
  },
  {
    id: 'pergamino_virgen',
    name: 'Pergamino Virgen',
    branch: 'arcano',
    icon: '📜',
    rarity: 'Común',
    value: 18,
    sources: 'Bibliotecas, Altares, Escritorios de Hechicero.',
    desc: 'Papiro tratado con tinta arcana listo para inscribir hechizos de 1 uso.',
  },
];

export const getMaterialById = (id) =>
  MATERIALS_CATALOG.find((m) => m.id === id) || MATERIALS_CATALOG[0];

// ============================================================================
// CATÁLOGO DE RECETAS CONOCIDAS (22 Recetas Claras y Balanceadas)
// ============================================================================
export const CRAFTING_RECIPES = [
  // --- ALQUIMIA Y VENENOS ---
  {
    id: 'rec_pocion_curacion',
    name: 'Poción de Curación',
    branch: 'alquimia',
    type: 'Poción',
    rarity: 'comun',
    dice: '+2 PC',
    station: 'Cualquier lugar (Alquimista = Ventaja · Otros = Suerte)',
    arcanaCD: 0,
    costGold: 10,
    ingredients: { hierba_lunar: 2 },
    effect: 'Acción gratuita: restaura 2 PC al instante (evita morir al llegar a 0 PC).',
  },
  {
    id: 'rec_pocion_curacion_mayor',
    name: 'Poción de Curación Mayor',
    branch: 'alquimia',
    type: 'Poción',
    rarity: 'poco_comun',
    dice: '+4 PC',
    station: 'Cualquier lugar (Alquimista = Ventaja · Otros = Suerte)',
    arcanaCD: 12,
    costGold: 25,
    ingredients: { hierba_lunar: 3, sangre_icor: 1 },
    effect: 'Acción gratuita: restaura hasta 4 PC al instante.',
  },
  {
    id: 'rec_pocion_clarividencia',
    name: 'Poción de Clarividencia',
    branch: 'alquimia',
    type: 'Poción',
    rarity: 'comun',
    dice: '+2 PM',
    station: 'Cualquier lugar (Alquimista = Ventaja · Otros = Suerte)',
    arcanaCD: 0,
    costGold: 15,
    ingredients: { hierba_lunar: 1, polvo_runico: 1 },
    effect: 'Acción gratuita: restaura 2 PM y te saca del Estado de Shock.',
  },
  {
    id: 'rec_antidoto',
    name: 'Antídoto Universal',
    branch: 'alquimia',
    type: 'Poción',
    rarity: 'comun',
    dice: 'Cura Estados',
    station: 'Cualquier lugar',
    arcanaCD: 0,
    costGold: 10,
    ingredients: { hierba_lunar: 1, glandula_veneno: 1 },
    effect: 'Acción gratuita: elimina Envenenado, Enfermedad y todos los debuffs físicos.',
  },
  {
    id: 'rec_tonico_furia',
    name: 'Tónico de Furia Sangrienta',
    branch: 'alquimia',
    type: 'Poción',
    rarity: 'raro',
    dice: '+2 DC Ataque (Riesgo)',
    station: 'Cualquier lugar (Alquimista = Ventaja · Otros = Suerte)',
    arcanaCD: 13,
    costGold: 20,
    ingredients: { sangre_icor: 2, hierba_lunar: 1 },
    effect: 'Ganas +2 DC de Ataque durante 2 turnos. ⚠️ RIESGO: Al terminar tira en la Tabla de Efectos Secundarios de Tónicos (o CON CD 13 para evitarlo).',
  },
  {
    id: 'rec_tonico_hierro',
    name: 'Tónico de Piel de Hierro',
    branch: 'alquimia',
    type: 'Poción',
    rarity: 'raro',
    dice: '+2 DC Defensa (Riesgo)',
    station: 'Cualquier lugar (Alquimista = Ventaja · Otros = Suerte)',
    arcanaCD: 13,
    costGold: 20,
    ingredients: { sangre_icor: 1, chatarra_acero: 1, hierba_lunar: 1 },
    effect: 'Ganas +2 DC de Defensa durante 2 turnos. ⚠️ RIESGO: Al terminar supera CON CD 13 o sufre 1 efecto secundario de Tónico.',
  },
  {
    id: 'rec_veneno_pieles_verdes',
    name: 'Veneno de Hoja: Mata-Orcos',
    branch: 'alquimia',
    type: 'Consumible',
    rarity: 'poco_comun',
    dice: '+2 DC vs Pieles Verdes',
    station: 'Cualquier lugar',
    arcanaCD: 0,
    costGold: 15,
    ingredients: { glandula_veneno: 2, aceite_alquitran: 1 },
    effect: 'Recubre 1 arma por toda la sala: +2 DC de ataque contra Goblins, Orcos, Abominaciones y Trolls.',
  },
  {
    id: 'rec_aceite_sagrado',
    name: 'Aceite de Plata Sagrada',
    branch: 'alquimia',
    type: 'Consumible',
    rarity: 'poco_comun',
    dice: '+2 DC vs No Muertos/Etéreos',
    station: 'Alquimista o Templo',
    arcanaCD: 0,
    costGold: 20,
    ingredients: { esencia_espectral: 1, aceite_alquitran: 1 },
    effect: 'Recubre 1 arma por 1 combate: daña normalmente a Espectros Etéreos y suma +2 DC contra No Muertos.',
  },
  {
    id: 'rec_fuego_griego',
    name: 'Frasco de Fuego Griego',
    branch: 'alquimia',
    type: 'Consumible',
    rarity: 'raro',
    dice: '3 DC Fuego (Área 2×2)',
    station: 'Cualquier lugar (Alquimista = Ventaja · Otros = Suerte)',
    arcanaCD: 12,
    costGold: 25,
    ingredients: { aceite_alquitran: 2, polvora_negra: 1 },
    effect: 'Arrojadizo (hasta 5 casillas): 3 DC de daño de Fuego en área 2×2. Detiene la regeneración de Trolls y Momias.',
  },
  {
    id: 'rec_veneno_ratas',
    name: 'Cebo Venenoso de Ratas/Goblins',
    branch: 'alquimia',
    type: 'Consumible',
    rarity: 'comun',
    dice: 'Debilita Horda',
    station: 'Cualquier lugar',
    arcanaCD: 0,
    costGold: 10,
    ingredients: { glandula_veneno: 1, racion_mazmorra: 1 },
    effect: 'Lánzalo antes de abrir una puerta o en pasillo: enemigos pequeños (Goblins/Skaven/Ratas) pierden 1 PC y atacan con -1 DC en la sala.',
  },

  // --- FORJA E INGENIERÍA ---
  {
    id: 'rec_bomba_humo',
    name: 'Bomba de Humo Táctica',
    branch: 'forja',
    type: 'Consumible',
    rarity: 'comun',
    dice: 'Escape / Cobertura',
    station: 'Cualquier lugar',
    arcanaCD: 0,
    costGold: 10,
    ingredients: { polvora_negra: 1, aceite_alquitran: 1 },
    effect: 'Acción gratuita: crea humo 3×3 por 1 ronda. Bloquea Línea de Visión enemiga y permite salir sin Zona de Control.',
  },
  {
    id: 'rec_abrojos',
    name: 'Bolsa de Abrojos de Hueso',
    branch: 'forja',
    type: 'Consumible',
    rarity: 'comun',
    dice: '-3 Mov + 1 PC',
    station: 'Cualquier lugar',
    arcanaCD: 0,
    costGold: 10,
    ingredients: { colmillos_hueso: 2 },
    effect: 'Cubre 2 casillas de pasillo/puerta: el primer enemigo que pise sufre 1 PC automático y pierde 3 casillas de movimiento.',
  },
  {
    id: 'rec_bomba_polvora',
    name: 'Bomba de Pólvora Enana',
    branch: 'forja',
    type: 'Consumible',
    rarity: 'raro',
    dice: '4 DC Área 3×3',
    station: 'Herrería (Ciudad)',
    arcanaCD: 0,
    costGold: 30,
    ingredients: { polvora_negra: 2, chatarra_acero: 1 },
    effect: 'Arrojadiza (4 casillas): explota en 3×3 infligiendo 4 DC (DES CD 14 mitad) y vuela puertas cerradas/atrancadas. +1 Reloj del Caos por el ruido.',
  },
  {
    id: 'rec_trampa_oso',
    name: 'Trampa de Cepo Portátil',
    branch: 'forja',
    type: 'Consumible',
    rarity: 'poco_comun',
    dice: '2 PC + Inmovilizado',
    station: 'Herrería o Armería',
    arcanaCD: 0,
    costGold: 15,
    ingredients: { chatarra_acero: 2, colmillos_hueso: 1 },
    effect: 'Colócala en una casilla adyacente (puerta/pasillo): el primer monstruo que entre recibe 2 PC y queda Inmovilizado 1 turno.',
  },
  {
    id: 'rec_afilado_maestro',
    name: 'Piedra de Afilado Maestro',
    branch: 'forja',
    type: 'Consumible',
    rarity: 'poco_comun',
    dice: '+1 DC (1 Misión)',
    station: 'Herrería o Armería',
    arcanaCD: 0,
    costGold: 20,
    ingredients: { chatarra_acero: 2, aceite_alquitran: 1 },
    effect: 'Afila 1 arma cuerpo a cuerpo antes de entrar: suma +1 DC en el primer ataque de cada combate durante la misión.',
  },
  {
    id: 'rec_refuerzo_placas',
    name: 'Placas de Refuerzo Temporales',
    branch: 'forja',
    type: 'Consumible',
    rarity: 'poco_comun',
    dice: '+2 PC Temporales',
    station: 'Herrería (Ciudad)',
    arcanaCD: 0,
    costGold: 20,
    ingredients: { chatarra_acero: 2, colmillos_hueso: 1 },
    effect: 'Refuerza tu armadura para la siguiente misión: absorbe los primeros 2 puntos de daño que recibas.',
  },

  // --- ARCANO Y RUNAS ---
  {
    id: 'rec_pergamino_fuego',
    name: 'Pergamino: Bola de Fuego',
    branch: 'arcano',
    type: 'Pergamino',
    rarity: 'poco_comun',
    dice: '3 DC Fuego (Área)',
    station: 'Escriba o Biblioteca',
    arcanaCD: 12,
    costGold: 20,
    ingredients: { pergamino_virgen: 1, polvo_runico: 1, polvora_negra: 1 },
    effect: '1 uso (cualquier héroe): lanza Bola de Fuego (3 DC en 2×2) sin gastar PM.',
  },
  {
    id: 'rec_pergamino_sanacion',
    name: 'Pergamino: Agua de Sanación',
    branch: 'arcano',
    type: 'Pergamino',
    rarity: 'poco_comun',
    dice: '+4 PC a Aliado',
    station: 'Escriba o Templo',
    arcanaCD: 11,
    costGold: 20,
    ingredients: { pergamino_virgen: 1, hierba_lunar: 2 },
    effect: '1 uso (cualquier héroe): cura +4 PC a un aliado visible sin gastar PM.',
  },
  {
    id: 'rec_runa_fuego',
    name: 'Runa Grabable: Filo Ígneo',
    branch: 'arcano',
    type: 'Artefacto',
    rarity: 'epico',
    dice: '+1 DC Fuego Permanente',
    station: 'Torre Arcana (Ciudad)',
    arcanaCD: 14,
    costGold: 60,
    ingredients: { polvo_runico: 2, gema_abismal: 1, aceite_alquitran: 1 },
    effect: 'Grábala en 1 arma equipada: se vuelve mágica de Fuego (+1 DC extra contra No Muertos, Trolls y Bestias de Hielo).',
  },
  {
    id: 'rec_runa_espectral',
    name: 'Runa Grabable: Rompe-Espectros',
    branch: 'arcano',
    type: 'Artefacto',
    rarity: 'epico',
    dice: 'Daña Etéreos +1 Def PM',
    station: 'Torre Arcana (Ciudad)',
    arcanaCD: 14,
    costGold: 60,
    ingredients: { esencia_espectral: 2, polvo_runico: 2 },
    effect: 'Grábala en 1 arma o escudo: tus golpes dañan normalmente a Espectros Etéreos y ganas +2 a salvaciones de Mente.',
  },
  {
    id: 'rec_runa_celeridad',
    name: 'Runa Grabable: Paso del Viento',
    branch: 'arcano',
    type: 'Artefacto',
    rarity: 'raro',
    dice: '+2 Mov Permanente',
    station: 'Torre Arcana (Ciudad)',
    arcanaCD: 13,
    costGold: 45,
    ingredients: { polvo_runico: 2, colmillos_hueso: 1 },
    effect: 'Grábala en botas o armadura: +2 casillas de movimiento fijo e ignoras el primer penalizador de terreno difícil.',
  },
  {
    id: 'rec_mejora_artefacto',
    name: 'Forja de Artefacto (+1 Nivel de Reliquia)',
    branch: 'forja',
    type: 'Mejora',
    rarity: 'legendario',
    dice: 'Artefacto Nv.+1 (Máx 5)',
    station: 'Herrería Maestra (Ciudad)',
    arcanaCD: 0,
    costGold: 80,
    ingredients: { gema_abismal: 1, chatarra_acero: 2, polvo_runico: 1 },
    effect: 'Sube 1 nivel a cualquier Arma/Armadura/Artefacto (Nv.1→5): Nv.2 repite 1 dado fallido/combate; Nv.3 +1 DC; Nv.4 daña Etéreos; Nv.5 Crítico en 19–20.',
  },
  // --- FORJA DE EQUIPO POR RAREZA (EXCLUSIVO DE LA HERRERÍA EN CIUDAD) ---
  {
    id: 'eq_espada_reforzada',
    name: 'Espada Corta Reforzada',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Arma',
    rarity: 'comun',
    dice: '2 DC',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 120,
    ingredients: { chatarra_acero: 2, aceite_alquitran: 1 },
    effect: 'Arma equilibrada de 1 mano (2 DC). Permite repetir un 1 en tirada de daño físico 1 vez por combate.',
  },
  {
    id: 'eq_escudo_acero',
    name: 'Escudo de Roble y Acero',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Armadura',
    rarity: 'comun',
    dice: '+1 Def',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 150,
    ingredients: { chatarra_acero: 2, colmillos_hueso: 1 },
    effect: 'Mano secundaria: +1 Dado de Defensa. Ideal para tanques y soportes.',
  },
  {
    id: 'eq_espada_larga_fina',
    name: 'Espada Larga de Filo Fino',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Arma',
    rarity: 'poco_comun',
    dice: '3 DC (Diagonal)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 290,
    ingredients: { chatarra_acero: 3, colmillos_hueso: 1, aceite_alquitran: 1 },
    effect: '1 mano, 3 DC y ataque en diagonal. Perfecta para vanguardia versátil.',
  },
  {
    id: 'eq_cota_templada',
    name: 'Cota de Malla Templada',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Armadura',
    rarity: 'poco_comun',
    dice: '+1 Def (Sin penalizar Sigilo)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 340,
    ingredients: { chatarra_acero: 3, aceite_alquitran: 2 },
    effect: 'Armadura media silenciosa: +1 Def sin reducir movimiento ni penalizar Sigilo.',
  },
  {
    id: 'eq_arco_compuesto',
    name: 'Arco Compuesto de Colmillo',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Arma',
    rarity: 'poco_comun',
    dice: '3 DC (Distancia)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 310,
    ingredients: { colmillos_hueso: 3, chatarra_acero: 1, aceite_alquitran: 1 },
    effect: 'Ataque a distancia de 3 DC en Línea de Visión (sin enemigos adyacentes).',
  },
  {
    id: 'eq_hacha_runica',
    name: 'Hacha de Guerra Rúnica',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Arma',
    rarity: 'raro',
    dice: '4 DC (2 Manos · Mágica)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 580,
    ingredients: { chatarra_acero: 4, polvo_runico: 2, sangre_icor: 1 },
    effect: '4 DC a 2 manos (no permite escudo). Sus runas dañan normalmente a Espectros Etéreos.',
  },
  {
    id: 'eq_placas_ligeras',
    name: 'Armadura de Placas Ligeras',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Armadura',
    rarity: 'raro',
    dice: '+2 Def (-1 Mov)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 650,
    ingredients: { chatarra_acero: 5, aceite_alquitran: 2, polvo_runico: 1 },
    effect: 'Armadura pesada superior: +2 Dados de Defensa y solo -1 casilla de movimiento (no Mago).',
  },
  {
    id: 'eq_baston_eter',
    name: 'Bastón Arcano del Éter',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Arma',
    rarity: 'raro',
    dice: '2 DC Mágico (+1 PM máx)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 550,
    ingredients: { polvo_runico: 3, esencia_espectral: 1, colmillos_hueso: 2 },
    effect: 'Diagonal y mágico (daña Etéreos). Otorga +1 PM máximo mientras esté equipado.',
  },
  {
    id: 'eq_hoja_plata_abismal',
    name: 'Hoja de Plata Abismal',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Arma',
    rarity: 'epico',
    dice: '4 DC (Diagonal · Plata)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 950,
    ingredients: { chatarra_acero: 4, esencia_espectral: 2, polvo_runico: 2, gema_abismal: 1 },
    effect: '1 mano, 4 DC, Diagonal y Mágica. Suma +1 DC adicional contra No Muertos, Espectros y Jefes.',
  },
  {
    id: 'eq_egida_bastion',
    name: 'Égida del Bastión',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Armadura',
    rarity: 'epico',
    dice: '+2 Def (Escudo Maestro)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 900,
    ingredients: { chatarra_acero: 5, polvo_runico: 2, gema_abismal: 1 },
    effect: 'Escudo de élite: +2 Dados de Defensa y anula 1 Calavera Crítica por combate.',
  },
  {
    id: 'eq_espada_alba_eterna',
    name: 'Espada del Alba Eterna',
    branch: 'equipo',
    onlyInCity: true,
    type: 'Artefacto',
    rarity: 'legendario',
    dice: '4 DC (1 Mano · Legendaria)',
    station: 'Solo Herrería de Ciudad',
    arcanaCD: 0,
    costGold: 1500,
    ingredients: { chatarra_acero: 5, esencia_espectral: 2, polvo_runico: 3, gema_abismal: 2 },
    effect: 'Obra Maestra Legendaria: 4 DC, Diagonal, Mágica, daña Etéreos, y al sacar 2+ calaveras cura 1 PC a un aliado adyacente.',
  },
];

// ============================================================================
// TABLA DE EFECTOS SECUNDARIOS DE TÓNICOS (Inspirada en HQ Homebrew)
// ============================================================================
export const TONIC_SIDE_EFFECTS = [
  { roll: 1, title: 'Resaca Alquímica', effect: 'Pierdes 1 PC y 1 PM al terminar el efecto del tónico.' },
  { roll: 2, title: 'Temblor Incontrolable', effect: '-1 DC en tu siguiente tirada de ataque o defensa.' },
  { roll: 3, title: 'Visión Borrosa', effect: 'Tu Línea de Visión se reduce a 4 casillas durante 2 turnos.' },
  { roll: 4, title: 'Sed Insaciable', effect: 'Debes gastar tu siguiente acción gratuita en beber algo o pierdes 1 PC.' },
  { roll: 5, title: 'Erupción de Chispas', effect: 'Un destello delata tu posición: +1 al Reloj del Caos.' },
  { roll: 6, title: '¡Adrenalina Pura!', effect: '¡Sin efecto negativo! Tu cuerpo absorbe el tónico y ganas +1 punto de movimiento este turno.' },
];

export function rollTonicSideEffect() {
  const idx = Math.floor(Math.random() * TONIC_SIDE_EFFECTS.length);
  return TONIC_SIDE_EFFECTS[idx];
}

// ============================================================================
// NIVELES DE ARTEFACTOS (Sistema de Nivelación Nv.1 a Nv.5)
// ============================================================================
export const ARTIFACT_LEVEL_BONUSES = {
  1: 'Nv.1 (Base): Estadísticas originales del objeto.',
  2: 'Nv.2 (Templado): 1 vez por combate puedes repetir 1 Dado de Combate fallido.',
  3: 'Nv.3 (Maestro): +1 Dado de Combate permanente (Ataque si es Arma, Defensa si es Armadura).',
  4: 'Nv.4 (Encantado): El objeto se vuelve Mágico (hiere normalmente a Espectros Etéreos y No Muertos).',
  5: 'Nv.5 (Legendario): Crítico ampliado (19 o 20 Natural en d20 = +1 Calavera Crítica indefendible).',
};

// ============================================================================
// RECOLECCIÓN AUTOMÁTICA (Drops de Materiales por Fuente / Bioma)
// ============================================================================
const SOURCE_POOLS = {
  pieles_verdes: ['glandula_veneno', 'racion_mazmorra', 'colmillos_hueso', 'polvora_negra'],
  no_muertos: ['colmillos_hueso', 'esencia_espectral', 'polvo_runico', 'chatarra_acero'],
  caos: ['sangre_icor', 'chatarra_acero', 'polvo_runico', 'gema_abismal'],
  espiritus: ['esencia_espectral', 'polvo_runico', 'hierba_lunar', 'gema_abismal'],
  jefe: ['gema_abismal', 'sangre_icor', 'esencia_espectral', 'polvo_runico'],
  mueble_alquimia: ['hierba_lunar', 'glandula_veneno', 'aceite_alquitran', 'polvo_runico'],
  mueble_armeria: ['chatarra_acero', 'polvora_negra', 'aceite_alquitran', 'colmillos_hueso'],
  mueble_biblioteca: ['pergamino_virgen', 'polvo_runico', 'hierba_lunar'],
  mueble_general: ['racion_mazmorra', 'hierba_lunar', 'aceite_alquitran', 'chatarra_acero'],
  trampa: ['chatarra_acero', 'glandula_veneno', 'polvora_negra'],
  sala_peligro: ['hierba_lunar', 'esencia_espectral', 'polvora_negra', 'sangre_icor', 'gema_abismal'],
};

export function rollMaterialDrop(sourceKey = 'mueble_general', partyLevel = 1) {
  const pool = SOURCE_POOLS[sourceKey] || SOURCE_POOLS.mueble_general;
  const matId = pool[Math.floor(Math.random() * pool.length)];
  const mat = getMaterialById(matId);
  const qty = sourceKey === 'jefe' ? 2 : partyLevel >= 6 && Math.random() < 0.35 ? 2 : 1;
  return { materialId: mat.id, material: mat, qty };
}

// ============================================================================
// ALQUIMIA POR SUERTE Y CALIFICACIÓN (Sin requerir Mesa de Alquimia)
// Cualquier héroe puede intentar preparar pociones, pero los más calificados
// (Alquimista, Mago, Druida, Clérigo, Gnomo o Prof. Alquimista/Escriba) tiran
// con VENTAJA. Los no calificados dependen de su Suerte (SUE): pueden lograrlo,
// crear una Poción de Destino Imprevisible o sufrir un contratiempo.
// ============================================================================
const QUALIFIED_ALCHEMY_CLASSES = ['alquimista', 'mago', 'druida', 'clerigo', 'exorcista', 'chaman', 'brujo'];

export function isQualifiedAlchemist(hero) {
  if (!hero) return false;
  return (
    QUALIFIED_ALCHEMY_CLASSES.includes(hero.classId) ||
    hero.professionId === 'alquimista' ||
    hero.professionId === 'escriba' ||
    hero.raceId === 'gnomo'
  );
}

export function rollPotionCraftAttempt(hero, recipe) {
  const qualified = isQualifiedAlchemist(hero);
  const rawAttrs = hero?.attributes || {};
  const sueBonus =
    rawAttrs.SUE !== undefined
      ? Number(rawAttrs.SUE || 0)
      : Math.max(0, Math.floor((Number(rawAttrs.INT ?? rawAttrs.CAR ?? 10) - 10) / 2) + 1);
  const menBonus =
    rawAttrs.MEN !== undefined
      ? Number(rawAttrs.MEN || 0)
      : Math.max(0, Math.floor((Number(rawAttrs.INT ?? 10) - 10) / 2) + 1);

  const d1 = Math.floor(Math.random() * 20) + 1;
  const d2 = Math.floor(Math.random() * 20) + 1;
  const roll = qualified ? Math.max(d1, d2) : d1;
  const bonus = qualified ? Math.max(menBonus, sueBonus) + 2 : sueBonus;
  const total = roll + bonus;
  const targetCD = recipe?.arcanaCD ? Math.max(10, recipe.arcanaCD) : 11;

  // Éxito Crítico (18+ o 20 natural)
  if (roll === 20 || total >= targetCD + 6) {
    return {
      outcome: 'critico',
      qualified,
      roll,
      bonus,
      total,
      targetCD,
      qtyBonus: 1,
      item: {
        name: recipe.name,
        type: recipe.type || 'Poción',
        rarity: recipe.rarity || 'poco_comun',
        dice: recipe.dice,
        special: recipe.effect,
      },
      title: '✨ ¡Destilación Perfecta (×2)!',
      text: `${qualified ? 'Tu maestría alquímica' : 'Un golpe de pura suerte'} logró una pureza increíble (Tirada ${roll} + ${bonus} = ${total}). ¡Obtienes 2 unidades de ${recipe.name}!`,
    };
  }

  // Éxito Normal
  if (total >= targetCD) {
    return {
      outcome: 'exito',
      qualified,
      roll,
      bonus,
      total,
      targetCD,
      qtyBonus: 0,
      item: {
        name: recipe.name,
        type: recipe.type || 'Poción',
        rarity: recipe.rarity || 'comun',
        dice: recipe.dice,
        special: recipe.effect,
      },
      title: `✅ ¡${recipe.name} lista!`,
      text: `Tirada ${roll} + ${bonus} = ${total} (CD ${targetCD}). ${qualified ? 'Mezcla estable y precisa.' : '¡Contra todo pronóstico salió perfecta!'}`,
    };
  }

  // Éxito Parcial / Poción de Destino Imprevisible (PDF p.183)
  if (total >= targetCD - 4) {
    return {
      outcome: 'imprevisible',
      qualified,
      roll,
      bonus,
      total,
      targetCD,
      qtyBonus: 0,
      item: {
        name: 'Poción de Destino Imprevisible',
        type: 'Poción',
        rarity: 'poco_comun',
        dice: 'Efecto Sorpresa',
        special:
          'Brebaje sin identificar: al beberla en combate tira 1d6 — (1-2) -1 PC y humo; (3-4) +2 PC; (5) +2 DC próximo ataque; (6) +3 PC y +2 PM.',
      },
      title: '🟣 ¡Poción de Destino Imprevisible!',
      text: `Tirada ${roll} + ${bonus} = ${total} (CD ${targetCD}). Cambió de color y burbujea violeta: nadie sabe exactamente qué hará hasta beberla...`,
    };
  }

  // Fallo / Contratiempo (los ingredientes se pierden)
  const side = rollTonicSideEffect();
  return {
    outcome: 'fallo',
    qualified,
    roll,
    bonus,
    total,
    targetCD,
    item: null,
    pcLoss: 1,
    title: '💥 ¡Mezcla Arruinada!',
    text: `Tirada ${roll} + ${bonus} = ${total} (CD ${targetCD}). El frasco chisporrotea y se pierde el brebaje (-1 PC por vapores · ${side.title}).`,
  };
}

// ============================================================================
// MEZCLA EXPERIMENTAL (Combina 2–3 ingredientes + Tirada Mente/Suerte)
// ============================================================================
export function resolveExperimentalMix(materialIds = [], arcanaTotal = 12) {
  if (!materialIds || materialIds.length < 2) {
    return {
      ok: false,
      title: 'Faltan ingredientes',
      text: 'Selecciona al menos 2 materiales para experimentar.',
    };
  }

  const mats = materialIds.map(getMaterialById);
  const hasArcano = mats.some((m) => m.branch === 'arcano');
  const hasForja = mats.some((m) => m.branch === 'forja');
  const hasAlq = mats.some((m) => m.branch === 'alquimia');
  const rareCount = mats.filter((m) => m.rarity === 'Raro').length;

  // Éxito Crítico o Muy Alto (17+)
  if (arcanaTotal >= 17) {
    if (hasArcano && rareCount >= 1) {
      return {
        ok: true,
        outcome: 'crítico',
        title: '✨ ¡Descubrimiento Alquímico Legendario!',
        item: {
          name: 'Elixir del Fénix Abismal',
          type: 'Poción',
          rarity: 'epico',
          dice: '+5 PC y +3 PM',
          special: 'Restaura 5 PC y 3 PM de golpe, elimina todos los estados negativos y otorga +1 DC en tu próximo ataque.',
        },
        text: 'Tu mezcla brilla con luz dorada perfecta. ¡Creaste un Elixir del Fénix Abismal!',
      };
    }
    if (hasForja && hasAlq) {
      return {
        ok: true,
        outcome: 'crítico',
        title: '💥 ¡Invención Maestra de Guerra!',
        item: {
          name: 'Granada Alquímica Inestable',
          type: 'Consumible',
          rarity: 'raro',
          dice: '4 DC Fuego + Veneno',
          special: 'Arrojadiza (5 casillas): 4 DC de daño en 2×2 y deja Envenenados a los supervivientes.',
        },
        text: 'Lograste estabilizar una carga explosiva tóxica de altísimo poder.',
      };
    }
    return {
      ok: true,
      outcome: 'crítico',
      title: '🧪 ¡Destilación Maestra!',
      item: {
        name: 'Tónico Dorado de Heroísmo',
        type: 'Poción',
        rarity: 'raro',
        dice: '+2 DC Atq y +2 DC Def',
        special: 'Sin efectos secundarios: otorga +2 DC de Ataque y +2 DC de Defensa por 2 turnos.',
      },
      text: 'La mezcla alcanzó pureza absoluta sin residuos tóxicos.',
    };
  }

  // Éxito Estándar (12–16)
  if (arcanaTotal >= 12) {
    const mysteryPool = [
      {
        name: 'Poción Misteriosa (Vigor)',
        type: 'Poción',
        rarity: 'poco_comun',
        dice: '+3 PC',
        special: 'Restaura 3 PC al beberla (Acción gratuita).',
      },
      {
        name: 'Poción Misteriosa (Velocidad)',
        type: 'Poción',
        rarity: 'poco_comun',
        dice: '+4 Mov (1 turno)',
        special: 'Suma +4 casillas de movimiento este turno e ignoras Zona de Control.',
      },
      {
        name: 'Aceite Volátil Experimental',
        type: 'Consumible',
        rarity: 'poco_comun',
        dice: '+2 DC (1 ataque)',
        special: 'Aplícalo a tu arma: tu próximo ataque suma +2 DC de daño mágico.',
      },
      {
        name: 'Frasco de Niebla Arcana',
        type: 'Consumible',
        rarity: 'poco_comun',
        dice: 'Invisibilidad 1 turno',
        special: 'Te vuelve indetectable 1 turno: los enemigos no pueden atacarte hasta que ataques.',
      },
    ];
    const picked = mysteryPool[Math.floor(Math.random() * mysteryPool.length)];
    return {
      ok: true,
      outcome: 'éxito',
      title: `✅ Mezcla Exitosa: ${picked.name}`,
      item: picked,
      text: `Los ingredientes reaccionaron bien. Obtienes: ${picked.name} (${picked.dice}).`,
    };
  }

  // Éxito Parcial / Poción Dudosa (8–11)
  if (arcanaTotal >= 8) {
    return {
      ok: true,
      outcome: 'parcial',
      title: '⚠️ Brebaje Inestable (Efecto Sorpresa)',
      item: {
        name: 'Poción Misteriosa Burbujeante',
        type: 'Poción',
        rarity: 'comun',
        dice: '+2 PC o Efecto Aleatorio',
        special: 'Al beberla restaura +2 PC, pero tira 1d6 en la Tabla de Efectos Secundarios de Tónicos.',
      },
      text: 'Huele raro y burbujea violeta, pero es bebible... con cierto riesgo.',
    };
  }

  // Fallo (7 o menos)
  return {
    ok: true,
    outcome: 'fallo',
    title: '💨 ¡Explosión de Humo en el Alambique!',
    item: null,
    damagePC: 1,
    text: 'Los ingredientes se consumen en una nube fétida. No obtienes objeto y sufres 1 PC de daño leve (hollín en la cara).',
  };
}
