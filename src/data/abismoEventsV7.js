// ============================================================================
// CRÓNICAS DEL ABISMO — MAZO ÚNICO DE TESOROS, EVENTOS, GUARIDAS Y GIROS ÉPICOS
// 100% auditado: coherencia lógica, especificaciones completas en cada arma,
// armadura, anillo o amuleto (tipo, manos, quién puede usarlo y stats),
// pruebas D20 claras solo donde aplican, y colocación en tablero solo cuando
// realmente aparece un Monstruo, NPC o Puerta Secreta.
// ============================================================================

export const ABISMO_TREASURE_DECK_V7 = [
  // --- CARTAS POSITIVAS (ORO, JOYAS, POCIONES, PERGAMINOS, EQUIPO DETALLADO) ---
  {
    id: 'at_gold_25', kind: 'positive', icon: '🪙', title: 'Bolsa de Monedas Imperiales (25 MO)',
    badge: 'Tesoro · Oro',
    narrative: 'Bajo una losa floja encuentras una bolsa de cuero con 25 Monedas de Oro acuñadas en el Imperio.',
    goldDelta: 25,
  },
  {
    id: 'at_gold_50', kind: 'positive', icon: '💰', title: 'Cofrecillo de Mercader (50 MO)',
    badge: 'Tesoro · Oro',
    narrative: 'Escondido detrás de unos barriles vacíos hallas un cofrecillo con 50 Monedas de Oro.',
    goldDelta: 50,
  },
  {
    id: 'at_gold_75', kind: 'positive', icon: '💎', title: 'Rubí de las Profundidades (75 MO)',
    badge: 'Tesoro · Gema',
    narrative: 'Una gema carmesí tallada brilla entre los escombros (+75 Monedas de Oro).',
    goldDelta: 75,
  },
  {
    id: 'at_gold_100', kind: 'positive', icon: '👑', title: 'Cáliz Ceremonial de Oro (100 MO)',
    badge: 'Tesoro · Reliquia',
    narrative: '¡Gran hallazgo! Un cáliz antiguo intacto valorado en 100 Monedas de Oro.',
    goldDelta: 100,
  },
  {
    id: 'at_pot_heal', kind: 'positive', icon: '🧪', title: 'Pócima de Curación',
    badge: 'Tesoro · Pócima Común',
    narrative: 'Encuentras un frasco sellado con cera roja intacto sobre una repisa.',
    items: [{
      name: 'Pócima de Curación',
      type: 'Poción (Consumible · 1 uso)',
      hands: 'Acción Gratuita',
      usableBy: 'Todas las clases (no cura a No Muertos)',
      rarity: 'comun',
      price: 400,
      effect: 'Restaura hasta 4 Puntos de Cuerpo perdidos. Se consume al usarla.',
    }],
  },
  {
    id: 'at_pot_res', kind: 'positive', icon: '🛡️', title: 'Pócima de Resistencia',
    badge: 'Tesoro · Pócima Común',
    narrative: 'Un frasco espeso de color acero líquido que endurece la piel al beberlo.',
    items: [{
      name: 'Pócima de Resistencia',
      type: 'Poción (Consumible · 1 uso)',
      hands: 'Acción Gratuita',
      usableBy: 'Todas las clases',
      rarity: 'comun',
      price: 60,
      effect: 'Bébelo antes de defender un ataque enemigo: lanzas +2 Dados de Defensa adicionales contra ese golpe.',
    }],
  },
  {
    id: 'at_pot_hero', kind: 'positive', icon: '🔥', title: 'Pócima de Héroes',
    badge: 'Tesoro · Pócima Común',
    narrative: 'Un vial dorado que acelera el pulso y la precisión en combate.',
    items: [{
      name: 'Pócima de Héroes',
      type: 'Poción (Consumible · 1 uso)',
      hands: 'Acción Gratuita',
      usableBy: 'Todas las clases',
      rarity: 'comun',
      price: 100,
      effect: 'Bébelo antes de atacar: este turno realizas DOS ataques en lugar de uno.',
    }],
  },
  {
    id: 'at_pot_aether', kind: 'positive', icon: '🔮', title: 'Pócima de Clarividencia',
    badge: 'Tesoro · Pócima Común',
    narrative: 'Un frasco azulado que despeja la mente y fortalece el espíritu.',
    items: [{
      name: 'Pócima de Clarividencia',
      type: 'Poción (Consumible · 1 uso)',
      hands: 'Acción Gratuita',
      usableBy: 'Todas las clases',
      rarity: 'comun',
      price: 300,
      effect: 'Restaura 2 Puntos de Mente perdidos.',
    }],
  },
  {
    id: 'at_weapon_dagger', kind: 'positive', icon: '🗡️', title: 'Daga de Acero Élfico',
    badge: 'Tesoro · Arma (1 Mano)',
    narrative: 'Una hoja ligera y finamente equilibrada oculta dentro de una bota olvidada.',
    items: [{
      name: 'Daga de Acero Élfico',
      type: 'Arma · Daga (1 Mano)',
      hands: '1 Mano',
      usableBy: 'Todas las clases (incluye Mago; excepto Estrella Blood Bowl, Sacerdote y Matador)',
      rarity: 'poco_comun',
      attack: 2,
      price: 280,
      properties: ['1 Mano', 'Lanzable', 'Diagonal'],
      effect: '2 DC de ataque (permite atacar en diagonal o lanzarla a tantas casillas como tus PC máx.).',
    }],
  },
  {
    id: 'at_ring_iron', kind: 'positive', icon: '💍', title: 'Anillo de Voluntad Férrea',
    badge: 'Tesoro · Anillo (Accesorio)',
    narrative: 'Un anillo de plata oscura grabado con runas protectoras.',
    items: [{
      name: 'Anillo de Voluntad Férrea',
      type: 'Accesorio · Anillo',
      hands: 'Dedo (No ocupa manos)',
      usableBy: 'Todas las clases',
      rarity: 'poco_comun',
      price: 350,
      properties: ['Accesorio', '+1 PM'],
      effect: 'Mientras lo lleves equipado ganas +1 Punto de Mente máximo y +1 a pruebas D20 de Mente.',
    }],
  },
  {
    id: 'at_amulet_ward', kind: 'positive', icon: '📿', title: 'Amuleto de Piel de Roble',
    badge: 'Tesoro · Amuleto (Accesorio)',
    narrative: 'Un colgante de madera petrificada tibio al tacto.',
    items: [{
      name: 'Amuleto de Piel de Roble',
      type: 'Accesorio · Amuleto',
      hands: 'Cuello (No Metálico)',
      usableBy: 'Todas las clases (no penaliza magia)',
      rarity: 'raro',
      defense: 1,
      price: 500,
      properties: ['No Metálica', '+1 Def'],
      effect: '+1 Dado de Defensa permanente sin penalizar movimiento ni lanzamiento de hechizos.',
    }],
  },
  {
    id: 'at_scroll_fire', kind: 'positive', icon: '📜', title: 'Pergamino de Bola de Fuego',
    badge: 'Tesoro · Pergamino Mágico (1 uso)',
    narrative: 'Un pergamino enrollado con sello de lacre naranja.',
    items: [{
      name: 'Pergamino de Bola de Fuego',
      type: 'Pergamino Mágico (1 solo uso)',
      hands: 'Acción Normal',
      usableBy: 'Todas las clases (no lanzadores restan −1 por cada armadura metálica en Vientos de la Magia)',
      rarity: 'poco_comun',
      price: 300,
      properties: ['1 solo uso', 'Crítico 12 no se consume'],
      effect: 'Causa 2 PC a un monstruo visible (el monstruo tira 2D6; cada 5 o 6 reduce 1 punto de daño).',
    }],
  },
  {
    id: 'at_rest', kind: 'positive', icon: '🕯️', title: 'Momento de Descanso',
    badge: 'Tesoro · Alivio',
    narrative: 'Un rincón tranquilo libre de peligro te permite vendar heridas y recuperar aliento (+1 PC y +1 PM).',
    pcDelta: 1,
    pmDelta: 1,
  },
  {
    id: 'at_nothing', kind: 'positive', icon: '💨', title: 'Sala Registrada sin Suerte',
    badge: 'Tesoro · Vacío',
    narrative: 'Remueves cajas rotas, telarañas y huesos viejos, pero no encuentras nada de valor.',
  },

  // --- CARTAS NEGATIVAS 💀 (TRAMPAS INSTANTÁNEAS SIN "PONER TRAMPA" + MONSTRUOS ERRANTES) ---
  {
    id: 'at_neg_wm1', kind: 'negative', icon: '👹', title: '¡Monstruo Errante! 💀',
    badge: 'Peligro · Emboscada',
    narrative: '¡Un rugido retumba desde la oscuridad! El DM coloca al Monstruo Errante de esta misión adyacente al buscador y ataca de inmediato.',
    boardSpawn: { kind: 'monster', type: 'orc', label: 'Monstruo Errante' },
  },
  {
    id: 'at_neg_wm2', kind: 'negative', icon: '💀', title: '¡Esqueleto Oculto! 💀',
    badge: 'Peligro · Emboscada',
    narrative: 'Un montón de huesos se ensambla de golpe con espada en mano. El DM lo coloca adyacente al buscador y ataca.',
    boardSpawn: { kind: 'monster', type: 'skeleton', label: 'Esqueleto Errante' },
  },
  {
    id: 'at_neg_trap_dart', kind: 'negative', icon: '🏹', title: 'Trampa de Flecha Oculta 💀',
    badge: 'Trampa Instantánea',
    narrative: 'Al levantar una tabla suelta se dispara una flecha oculta desde el muro.',
    d20Check: { skill: 'Agilidad / Esquivar', pillar: 'AGI', cd: 13 },
    successOutcome: { narrative: '¡Reflejos rápidos! Te agachas a tiempo y la flecha se clava en la pared sin herirte.' },
    failOutcome: { pcDelta: -1, narrative: 'La flecha te impacta en el hombro: pierdes 1 Punto de Cuerpo y termina tu turno.' },
  },
  {
    id: 'at_neg_trap_gas', kind: 'negative', icon: '☠️', title: 'Nube de Gas Venenoso 💀',
    badge: 'Trampa Instantánea',
    narrative: 'Una válvula oxidada libera un vapor verdoso que inunda la habitación.',
    d20Check: { skill: 'Salvación Física (Aguante)', pillar: 'FUE', cd: 13 },
    successOutcome: { narrative: 'Contienes la respiración y sales de la nube sin sufrir daño.' },
    failOutcome: { pcDelta: -1, statusAdded: { id: 'veneno_gas', label: 'Envenenado', desc: 'Debilitado hasta usar Antídoto o acabar la misión.' }, narrative: 'Inhalas el gas tóxico: pierdes 1 PC (evitable si bebes un Antídoto).' },
  },
  {
    id: 'at_neg_trap_collapse', kind: 'negative', icon: '🪨', title: 'Derrumbamiento Parcial 💀',
    badge: 'Trampa Instantánea',
    narrative: 'El techo vibra y varios cascotes caen directamente sobre ti.',
    d20Check: { skill: 'Agilidad / Esquivar', pillar: 'AGI', cd: 14 },
    successOutcome: { narrative: 'Ruedas hacia un lado esquivando los escombros intacto.' },
    failOutcome: { pcDelta: -2, narrative: 'Una piedra golpea tu espalda: pierdes 2 Puntos de Cuerpo y termina tu turno.' },
  },
  {
    id: 'at_neg_skull', kind: 'negative', icon: '🌀', title: 'Calavera Encantada 💀',
    badge: 'Peligro Mental',
    narrative: 'Una calavera grabada en la pared abre la mandíbula y lanza un chillido sobrenatural.',
    d20Check: { skill: 'Mente / Voluntad', pillar: 'MEN', cd: 13 },
    successOutcome: { narrative: 'Mantienes la concentración y resistes el grito arcano.' },
    failOutcome: { pmDelta: -1, narrative: 'El chillido sacude tu mente: pierdes 1 Punto de Mente.' },
  },

  // --- 6 CARTAS DE ALEATORIZACIÓN (DISPARAN AUTOMÁTICAMENTE EVENTOS Y GUARIDAS) ---
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `at_ev_${i}`,
    kind: 'event',
    icon: '❓',
    title: '¡Evento / Guarida!',
    badge: 'Aleatorización',
    narrative: 'Se dispara automáticamente un Evento o Guarida de Mazmorra.',
  })),
];

// ============================================================================
// EVENTOS Y GUARIDAS (INTEGRADOS EN EL MAZO ÚNICO DE TESOROS)
// ============================================================================
export const ABISMO_EVENTS_AND_LAIRS_V7 = [
  // --- EVENTOS DE MAZMORRA ---
  {
    id: 'ev7_altar', type: 'Evento', icon: '🕯️', title: 'Altar de la Llama Plateada',
    d20Check: { skill: 'Arcano / Investigación', pillar: 'MEN', cd: 12 },
    narrative: 'Un brasero antiguo arde con fuego frío sin consumir madera. Si descifras la inscripción sagrada puedes recibir su bendición.',
    successOutcome: { pcDelta: 2, pmDelta: 1, fameDelta: 1, narrative: 'La llama fría sana tus heridas: recuperas +2 PC, +1 PM y ganas +1 Fama.' },
    failOutcome: { pcDelta: -1, narrative: 'Pronuncias mal la runa y una chispa te quema las manos (−1 PC).' },
  },
  {
    id: 'ev7_merchant', type: 'Evento', icon: '🧙', title: 'El Contrabandista Encapuchado',
    d20Check: { skill: 'Persuasión / Negociación', pillar: 'SUE', cd: 13 },
    narrative: 'Un mercader furtivo se oculta entre los barriles y ofrece venderte un objeto táctico si sabes regatear.',
    successOutcome: {
      goldDelta: -20,
      items: [{
        name: 'Bomba de Humo',
        type: 'Objeto de Apoyo (Consumible · 1 uso)',
        hands: 'Acción Gratuita',
        usableBy: 'Todas las clases',
        rarity: 'comun',
        price: 250,
        effect: 'Un enemigo adyacente pierde su Área de Influencia y puede atravesarse hasta su próximo turno.',
      }],
      narrative: 'Negocias un gran precio: pagas 20 MO y recibes 1 Bomba de Humo.',
    },
    failOutcome: { narrative: 'No llegan a un acuerdo; el mercader recoge su saco y se pierde en la penumbra.' },
    boardSpawn: { kind: 'npc', type: 'npc', label: 'Contrabandista (NPC)' },
  },
  {
    id: 'ev7_mirror', type: 'Evento', icon: '🪞', title: 'Espejo del Doble Oscuro',
    d20Check: { skill: 'Mente / Voluntad', pillar: 'MEN', cd: 14 },
    narrative: 'Un espejo de obsidiana refleja a tu héroe sosteniendo un broche de oro. Si superas la ilusión podrás arrancarlo del marco real.',
    successOutcome: { goldDelta: 80, pmDelta: 1, narrative: 'Rompes la ilusión y recuperas el broche auténtico (+80 MO y +1 PM).' },
    failOutcome: { pmDelta: -2, narrative: 'El reflejo drena tu voluntad antes de quebrarse (−2 PM).' },
  },
  {
    id: 'ev7_fountain', type: 'Evento', icon: '⛲', title: 'Fuente de Líquido Carmesí',
    d20Check: { skill: 'Salvación Física (Aguante)', pillar: 'FUE', cd: 13 },
    narrative: 'Una fuente de gárgolas vierte un líquido aromático rojizo. Si te atreves a beber, tu resistencia decidirá si es elixir o veneno.',
    successOutcome: { pcDelta: 3, narrative: '¡Era elixir élfico añejo! Recuperas +3 Puntos de Cuerpo.' },
    failOutcome: { pcDelta: -2, narrative: '¡Estaba corrompido! Sufres un fuerte dolor estomacal (−2 PC).' },
  },
  {
    id: 'ev7_chest_mimic', type: 'Evento', icon: '📦', title: 'Cofre Sospechoso en la Esquina',
    d20Check: { skill: 'Percepción', pillar: 'MEN', cd: 14 },
    narrative: 'Un cofre reluciente parece respirar suavemente. Tira Percepción antes de meter la mano.',
    successOutcome: { goldDelta: 65, narrative: 'Detectas la trampa viva y sacas 65 MO del doble fondo sin despertarlo.' },
    failOutcome: { pcDelta: -2, narrative: '¡Era un Mímico! Te muerde el brazo (−2 PC) y entra en combate en el tablero.' },
    boardSpawn: { kind: 'monster', type: 'abomination', label: 'Mímico Voraz' },
  },
  {
    id: 'ev7_codex', type: 'Evento', icon: '📚', title: 'Códice Encadenado',
    d20Check: { skill: 'Arcano / Investigación', pillar: 'MEN', cd: 14 },
    narrative: 'Un libro antiguo vibra sobre un atril de hierro. Si logras leer sus runas sin perder la cordura, podrás copiar un hechizo.',
    successOutcome: {
      pmDelta: 1,
      items: [{
        name: 'Pergamino de Tempestad',
        type: 'Pergamino Mágico (1 solo uso)',
        hands: 'Acción Normal',
        usableBy: 'Todas las clases (−1 por armadura metálica si no eres lanzador)',
        rarity: 'poco_comun',
        price: 300,
        properties: ['1 solo uso'],
        effect: 'Un monstruo en tu Línea de Visión pierde su siguiente turno completo.',
      }],
      narrative: 'Copias el conjuro con éxito (+1 PM y Pergamino de Tempestad).',
    },
    failOutcome: { pmDelta: -2, narrative: 'Las runas gritan en tu mente (−2 PM).' },
  },

  // --- EVENTOS DE GUARIDA OPCIONAL (MÁX. 1 POR RETO · ADAPTADOS A NUESTRO SISTEMA) ---
  {
    id: 'lair7_troll', type: 'Guarida', icon: '👹', title: 'Guarida Opcional: El Cubil del Troll',
    narrative: 'GUARIDA OPCIONAL (Máx. 1 por reto): El DM coloca una Puerta Secreta cerrada hacia una sala vacía del tablero. Si deciden abrirla, dentro aguarda un Troll de Obsidiana (AT 5, DF 5, PC 6, regenera 1 PC/turno). Si lo vencen reclaman su botín.',
    goldDelta: 140,
    fameDelta: 2,
    items: [{
      name: 'Sangre de Troll Purificada',
      type: 'Poción Épica (Consumible · 1 uso)',
      hands: 'Acción Gratuita',
      usableBy: 'Todas las clases (no cura a No Muertos)',
      rarity: 'epico',
      price: 500,
      effect: 'Restaura TODOS tus Puntos de Cuerpo y otorga +1 DC Defensa hasta terminar la misión.',
    }],
    boardSpawn: { kind: 'secret_door', type: 'secret_door', label: 'Puerta Secreta de Guarida (Troll)' },
  },
  {
    id: 'lair7_wight', type: 'Guarida', icon: '💀', title: 'Guarida Opcional: Cripta del Rey Tumulario',
    narrative: 'GUARIDA OPCIONAL (Máx. 1 por reto): El DM coloca una Puerta Secreta hacia una cámara sellada con un Rey Tumulario (AT 4, DF 4, PC 4) y 2 Esqueletos. Al derrotarlos pueden reclamar su espada rúnica.',
    goldDelta: 120,
    fameDelta: 2,
    items: [{
      name: 'Espada Tumularia de Escarcha',
      type: 'Arma · Espada Larga (1 Mano)',
      hands: '1 Mano',
      usableBy: 'Guerreros, Elfo, Caballero, Vampiro (No Mago, No Orco, No Sacerdote, No Herrero)',
      rarity: 'raro',
      attack: 3,
      price: 800,
      properties: ['1 Mano', 'Diagonal', 'Daño Mágico'],
      effect: '3 DC de ataque con ataque diagonal. Daña a seres etéreos y cada Escudo Negro reduce −2 movimiento al objetivo.',
    }],
    boardSpawn: { kind: 'secret_door', type: 'secret_door', label: 'Puerta Secreta de Guarida (Tumulario)' },
  },
  {
    id: 'lair7_spider', type: 'Guarida', icon: '🕷️', title: 'Guarida Opcional: Nido de la Araña Madre',
    narrative: 'GUARIDA OPCIONAL (Máx. 1 por reto): El DM coloca una Puerta Secreta hacia una sala cubierta de telarañas con la Araña Madre (AT 4, DF 3, PC 5, Veneno). Al limpiar el nido obtienen su capa de seda.',
    goldDelta: 110,
    fameDelta: 1,
    items: [{
      name: 'Capa de Seda Arácnida',
      type: 'Armadura Ligera · Capa (No Metálica)',
      hands: 'Capa (Espalda)',
      usableBy: 'Todas las clases (incluye Mago, Druida, Bardo y Cazador)',
      rarity: 'raro',
      defense: 1,
      price: 650,
      properties: ['No Metálica', '+1 Def'],
      effect: '+1 Dado de Defensa sin penalizar magia ni movimiento. Inmune a telarañas.',
    }],
    boardSpawn: { kind: 'secret_door', type: 'secret_door', label: 'Puerta Secreta de Guarida (Araña)' },
  },
];

// ============================================================================
// EVENTOS DE PASILLO (COHERENTES, SIN PUERTAS ABSURDAS)
// ============================================================================
export const ABISMO_HALLWAY_EVENTS_V7 = [
  {
    id: 'hw_patrol', icon: '👣', title: 'Patrulla en el Pasillo',
    d20Check: { skill: 'Sigilo', pillar: 'AGI', cd: 13 },
    narrative: 'Antorchas y pasos pesados se acercan doblando la esquina del pasillo. Tira Sigilo para esconderte o sorprenderlos.',
    successOutcome: { fameDelta: 1, narrative: '¡Emboscada perfecta! Sorprenden a la patrulla (atacan primero con +1 DC en la 1ª ronda).' },
    failOutcome: { pcDelta: -1, narrative: '¡Los descubren! Una flecha roza al grupo (−1 PC) y el DM coloca la patrulla en el pasillo.' },
    boardSpawn: { kind: 'monster', type: 'goblin', label: 'Explorador de Patrulla' },
  },
  {
    id: 'hw_draft', icon: '💨', title: 'Corriente de Aire Helado',
    d20Check: { skill: 'Salvación Física (Aguante)', pillar: 'FUE', cd: 12 },
    narrative: 'Una ráfaga gélida recorre el corredor apagando las antorchas y calando hasta los huesos.',
    successOutcome: { narrative: 'Avanzas firme protegiendo tu antorcha sin perder el paso.' },
    failOutcome: { pcDelta: -1, narrative: 'El frío entumece tus músculos (−1 PC).' },
  },
  {
    id: 'hw_corpse', icon: '🦴', title: 'Aventurero Caído en el Corredor',
    d20Check: { skill: 'Investigación / Percepción', pillar: 'MEN', cd: 12 },
    narrative: 'Junto a un muro yace un explorador caído aferrando una mochila polvorienta.',
    successOutcome: {
      goldDelta: 35,
      items: [{
        name: 'Antídoto',
        type: 'Poción (Consumible · 1 uso)',
        hands: 'Acción Gratuita',
        usableBy: 'Todas las clases',
        rarity: 'comun',
        price: 50,
        effect: 'Elimina Envenenado, Enfermo o Paralizado.',
      }],
      narrative: 'Encuentras 35 MO y un frasco de Antídoto intacto.',
    },
    failOutcome: { goldDelta: 10, narrative: 'Casi todo está arruinado; solo rescatas 10 MO.' },
  },
  {
    id: 'hw_torch', icon: '🔥', title: 'Antorcha Rúnica Encendida',
    narrative: 'Un candelabro antiguo en el pasillo desprende un calor reconfortante que ahuyenta las sombras (+1 PM al héroe que lo examine).',
    pmDelta: 1,
  },
];

// ============================================================================
// EVENTOS DE BIOMA
// ============================================================================
export const ABISMO_BIOME_EVENTS_V7 = [
  {
    id: 'bio_miasma', icon: '☠️', title: 'Miasma de las Catacumbas',
    d20Check: { skill: 'Salvación Física (Aguante)', pillar: 'FUE', cd: 13 },
    narrative: 'Un vapor tóxico sube desde las rejillas del suelo cubriendo el corredor.',
    successOutcome: { narrative: 'Aguantas la respiración y cruzas la nube sin sufrir efectos.' },
    failOutcome: { pcDelta: -1, narrative: 'Inhalas el miasma y sufres −1 Punto de Cuerpo.' },
  },
  {
    id: 'bio_quake', icon: '🪨', title: 'Temblor Subterráneo',
    d20Check: { skill: 'Agilidad / Equilibrio', pillar: 'AGI', cd: 13 },
    narrative: 'La piedra retumba bajo tus botas y caen cascotes desde las bóvedas.',
    successOutcome: { narrative: 'Mantienes el equilibrio y esquivas todas las piedras que caen.' },
    failOutcome: { pcDelta: -1, narrative: 'Un cascote te golpea el hombro (−1 PC).' },
  },
  {
    id: 'bio_aether', icon: '✨', title: 'Corriente de Vientos Mágicos',
    d20Check: { skill: 'Arcano / Mente', pillar: 'MEN', cd: 12 },
    narrative: 'Una oleada de energía arcana atraviesa la sala haciendo vibrar tus armas.',
    successOutcome: { pmDelta: 2, narrative: 'Canalizas la corriente mágica y recuperas +2 Puntos de Mente.' },
    failOutcome: { pmDelta: -1, narrative: 'La descarga desestabiliza tu concentración (−1 PM).' },
  },
];

// ============================================================================
// PISTAS DE MAZMORRA
// ============================================================================
export const ABISMO_CLUE_EVENTS_V7 = [
  {
    id: 'cl_weakness', icon: '🔍', title: 'Pista: Punto Débil del Jefe',
    d20Check: { skill: 'Investigación / Arcano', pillar: 'MEN', cd: 13 },
    narrative: 'Unas notas talladas en la pared describen una grieta en la armadura del jefe final de esta misión. Haz una prueba de Mente (CD 13) para descifrarlas.',
    successOutcome: {
      fameDelta: 1,
      statusAdded: { id: 'punto_debil', label: 'Debilidad del Jefe (+1 DC)', desc: '+1 DC al atacar al jefe de esta misión.', duration: 99 },
      narrative: '¡Descifras el punto débil! Ganas +1 DC contra el jefe de esta misión y +1 Fama.',
    },
    failOutcome: { narrative: 'La inscripción está demasiado desgastada y no logras sacar ninguna ventaja.' },
  },
  {
    id: 'cl_map', icon: '🗺️', title: 'Pista: Plano de Contrabandistas',
    d20Check: { skill: 'Percepción', pillar: 'MEN', cd: 12 },
    narrative: 'Un plano doblado entre piedras señala un escondite de monedas y un paso oculto cercano. Haz una prueba de Percepción (CD 12).',
    successOutcome: { goldDelta: 30, narrative: 'Encuentras el escondite (+30 MO) y el DM puede colocar la Puerta Secreta del plano.' },
    failOutcome: { goldDelta: 10, narrative: 'El plano está rasgado; solo encuentras 10 MO sueltas.' },
    boardSpawn: { kind: 'secret_door', type: 'secret_door', label: 'Paso Oculto del Plano' },
  },
];

// ============================================================================
// GIROS ÉPICOS (CON PRUEBAS CLARAS O EFECTOS DIRECTOS SIN BOTONES FALSOS)
// ============================================================================
export const ABISMO_EPIC_TWISTS_V7 = [
  {
    id: 'tw_blessing', icon: '🌟', title: '¡Intervención de Sigmar!',
    narrative: 'Cuando todo parece perdido, un rayo dorado rompe la oscuridad de la mazmorra restaurando fuerzas a todo el grupo (+2 PC y +1 PM a todos los héroes).',
    defaultAllHeroes: true,
    pcDelta: 2,
    pmDelta: 1,
    fameDelta: 1,
  },
  {
    id: 'tw_portal', icon: '🌀', title: '¡Brecha del Caos Abierta!',
    d20Check: { skill: 'Arcano / Voluntad', pillar: 'MEN', cd: 15 },
    narrative: 'Un portal púrpura se rasga en la sala: el DM coloca un Guerrero del Terror en el tablero. Si un héroe supera Arcano (MEN CD 15), cierra la brecha y recibe la recompensa.',
    successOutcome: { goldDelta: 90, fameDelta: 2, narrative: '¡Sellas la brecha disforme! Ganas +90 MO y +2 Fama.' },
    failOutcome: { pmDelta: -1, narrative: 'La brecha escupe energía oscura (−1 PM) mientras el enemigo avanza.' },
    boardSpawn: { kind: 'monster', type: 'dread_warrior', label: 'Guerrero del Terror (Brecha)' },
  },
  {
    id: 'tw_rival', icon: '⚔️', title: '¡Cazador Rival en la Mazmorra!',
    d20Check: { skill: 'Persuasión / Intimidación', pillar: 'SUE', cd: 14 },
    narrative: 'Un mercenario rival intenta adelantarse al tesoro. Pueden intimidarlo o negociar (SUE CD 14) para que entregue su botín, o enfrentarlo en el tablero.',
    successOutcome: { goldDelta: 75, fameDelta: 1, narrative: 'El rival se retira dejando su bolsa (+75 MO y +1 Fama).' },
    failOutcome: { goldDelta: -20, narrative: 'El rival se escabulle robando 20 MO o entra en combate.' },
    boardSpawn: { kind: 'monster', type: 'assassin', label: 'Cazador Rival' },
  },
  {
    id: 'tw_alarm', icon: '🔔', title: '¡Cuerno de Alarma de la Mazmorra!',
    narrative: 'Un cuerno resuena por todos los corredores alertando a los defensores. El DM coloca un refuerzo de Monstruo Errante donde desee en una sala o pasillo revelado.',
    boardSpawn: { kind: 'monster', type: 'orc', label: 'Refuerzo de Alarma' },
  },
];
