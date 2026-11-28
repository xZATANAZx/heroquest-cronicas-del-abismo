// ============================================================================
// CRÓNICAS DEL ABISMO v7.0 — MOTOR RENOVADO DE MAZOS, EVENTOS Y GUARIDAS
// Combina Aleatorización + Guaridas (FetenQuest) + Pruebas D20 estilo D&D +
// Despacho exacto DM→Celular + Colocación Libre en el Tablero 2D.
// ============================================================================

export const ABISMO_TREASURE_DECK_V7 = [
  // Positivas (Oro + Objetos reales con estadísticas completas)
  {
    id: 'at_gold_30', kind: 'positive', icon: '🪙', title: 'Bolsa de Monedas Imperiales (30 MO)',
    badge: 'Carta Positiva · Se descarta',
    narrative: 'Bajo una losa suelta brilla una bolsa de cuero con monedas acuñadas del Imperio.',
    goldDelta: 30,
  },
  {
    id: 'at_gold_50', kind: 'positive', icon: '💰', title: 'Cofrecillo de Mercader (50 MO)',
    badge: 'Carta Positiva · Se descarta',
    narrative: 'Un cofre pequeño olvidado contiene 50 Monedas de Oro y anillos de plata.',
    goldDelta: 50,
  },
  {
    id: 'at_gold_75', kind: 'positive', icon: '💎', title: 'Rubí de las Profundidades (75 MO)',
    badge: 'Carta Positiva · Se descarta',
    narrative: 'Una gema carmesí tallada irradia reflejos bajo la luz de tu antorcha (+75 MO).',
    goldDelta: 75,
  },
  {
    id: 'at_gold_110', kind: 'positive', icon: '👑', title: 'Reliquia Real Perdida (110 MO)',
    badge: 'Carta Positiva · Se descarta',
    narrative: '¡Botín extraordinario! Un cáliz ceremonial con incrustaciones de oro valorado en 110 MO.',
    goldDelta: 110,
  },
  {
    id: 'at_pot_heal', kind: 'positive', icon: '🧪', title: 'Pócima de Curación Mayor',
    badge: 'Carta Positiva · Objeto',
    narrative: 'Encuentras un frasco sellado con cera escarlata: restaura hasta 4 Puntos de Cuerpo al beberla.',
    items: [{ name: 'Pócima de Curación Mayor', type: 'Poción', rarity: 'poco_comun', price: 350, effect: 'Acción gratuita: restaura 4 Puntos de Cuerpo.' }],
  },
  {
    id: 'at_pot_fury', kind: 'positive', icon: '🔥', title: 'Elixir de Furia Heroica',
    badge: 'Carta Positiva · Objeto',
    narrative: 'Un brebaje dorado que hierve suavemente al agitarlo.',
    items: [{ name: 'Elixir de Furia Heroica', type: 'Poción', rarity: 'raro', price: 300, effect: 'Acción gratuita antes de atacar: realiza 2 ataques este turno o añade +2 DC.' }],
  },
  {
    id: 'at_pot_aether', kind: 'positive', icon: '🔮', title: 'Vial de Éter Puro',
    badge: 'Carta Positiva · Objeto',
    narrative: 'Un cristal líquido azulado que revitaliza la mente de cualquier aventurero.',
    items: [{ name: 'Vial de Éter Puro', type: 'Poción', rarity: 'poco_comun', price: 280, effect: 'Acción gratuita: restaura 2 PM y recarga 1 uso de hechizo Nivel 1.' }],
  },
  {
    id: 'at_weapon_dagger', kind: 'positive', icon: '🗡️', title: 'Daga Rúnica de Sombras',
    badge: 'Carta Positiva · Arma Poco Común',
    narrative: 'Una hoja oscura perfectamente equilibrada que susurra al desenfundarse.',
    items: [{ name: 'Daga Rúnica de Sombras', type: 'Arma', rarity: 'poco_comun', attack: 2, price: 320, properties: ['1 Mano', 'Lanzable', 'Diagonal'], effect: '2 DC de ataque (diagonal o lanzable). +1 a pruebas de Sigilo.' }],
  },
  {
    id: 'at_scroll_bolt', kind: 'positive', icon: '📜', title: 'Pergamino de Rayo Mortífero',
    badge: 'Carta Positiva · Pergamino (1 uso)',
    narrative: 'Un pergamino antiguo sellado con runas de tormenta.',
    items: [{ name: 'Pergamino de Rayo Mortífero', type: 'Pergamino', rarity: 'raro', price: 400, effect: '1 solo uso (salvo Crítico 12): dispara un rayo en línea recta que inflige 2 PC sin defensa a toda miniatura en su trayectoria.' }],
  },
  {
    id: 'at_rest', kind: 'positive', icon: '🕯️', title: 'Rincón Consagrado',
    badge: 'Carta Positiva · Alivio',
    narrative: 'Una luz tibia atraviesa una grieta del techo: recuperas aliento y concentración (+2 PC y +1 PM).',
    pcDelta: 2, pmDelta: 1,
  },
  {
    id: 'at_mat_steel', kind: 'positive', icon: '⚒️', title: 'Alijo de Forja Enana',
    badge: 'Carta Positiva · Materiales + Oro',
    narrative: 'Encuentras lingotes de acero templado y 25 MO escondidos tras un ladrillo flojo.',
    goldDelta: 25,
    materials: [{ id: 'acero_templado', qty: 2 }],
  },

  // Negativas 💀 (Vuelven al mazo y pueden invocar monstruos/trampas en el tablero)
  {
    id: 'at_neg_wm1', kind: 'negative', icon: '👹', title: '¡Monstruo Errante! 💀',
    badge: 'Carta Negativa · Vuelve al mazo',
    narrative: '¡Un rugido retumba desde las sombras! El DM coloca al Monstruo Errante de esta misión donde desee cerca del buscador.',
    boardSpawn: { kind: 'monster', type: 'orc', label: 'Monstruo Errante (Orco)' },
  },
  {
    id: 'at_neg_wm2', kind: 'negative', icon: '💀', title: '¡Emboscada No-Muerta! 💀',
    badge: 'Carta Negativa · Vuelve al mazo',
    narrative: 'Huesos rechinan tras los muebles: un guerrero esquelético se alza listo para atacar.',
    boardSpawn: { kind: 'monster', type: 'skeleton', label: 'Esqueleto Errante' },
  },
  {
    id: 'at_neg_trap_dart', kind: 'negative', icon: '🏹', title: 'Trampa de Dardo Envenenado 💀',
    badge: 'Carta Negativa · Salvación AGI CD 13',
    narrative: 'Un mecanismo hace clic al mover un ladrillo. Prueba de Agilidad (CD 13) para esquivarlo o pierdes 1 PC.',
    d20Check: { skill: 'Sigilo / Acrobacia', pillar: 'AGI', cd: 13 },
    successOutcome: { pcDelta: 0, narrative: '¡Reflejos felinos! Esquivas el dardo envenenado por milímetros.' },
    failOutcome: { pcDelta: -1, statusAdded: { id: 'veneno_dardo', label: 'Envenenado', desc: 'Pierdes 1 PC adicional si no usas Antídoto.' }, narrative: 'El dardo te roza el hombro (−1 PC y estado Envenenado).' },
    boardSpawn: { kind: 'trap', type: 'trap_spear', label: 'Trampa de Dardo' },
  },
  {
    id: 'at_neg_trap_pit', kind: 'negative', icon: '🕳️', title: 'Suelo Falso (Foso Oculto) 💀',
    badge: 'Carta Negativa · Salvación AGI CD 13',
    narrative: 'Las losas ceden bajo tus botas. Prueba de Agilidad (CD 13) o caes al foso (−1 PC y termina tu turno).',
    d20Check: { skill: 'Sigilo / Acrobacia', pillar: 'AGI', cd: 13 },
    successOutcome: { pcDelta: 0, narrative: 'Saltas hacia atrás justo a tiempo; el foso queda revelado en el suelo.' },
    failOutcome: { pcDelta: -1, narrative: 'Caes dentro del foso oculto (−1 PC y termina tu turno).' },
    boardSpawn: { kind: 'trap', type: 'trap_pit', label: 'Foso Oculto' },
  },
  {
    id: 'at_neg_chaos', kind: 'negative', icon: '🌀', title: 'Susurro de la Disformidad 💀',
    badge: 'Carta Negativa · Salvación MEN CD 13',
    narrative: 'Una risa helada invade tu cabeza. Prueba de Mente (CD 13) o pierdes 1 PM.',
    d20Check: { skill: 'Arcano / Mente', pillar: 'MEN', cd: 13 },
    successOutcome: { pmDelta: 0, narrative: 'Mantienes la mente firme y rechazas el susurro oscuro.' },
    failOutcome: { pmDelta: -1, narrative: 'Las visiones sacuden tu cordura (−1 PM).' },
  },

  // 6 Cartas Comodín ❓ de Aleatorización (Disparan el Mazo de Eventos y Guaridas)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `at_ev_${i}`,
    kind: 'event',
    icon: '❓',
    title: '¡Evento / Guarida!',
    badge: 'Aleatorización · Roba del Mazo de Eventos',
    narrative: 'Se dispara automáticamente una carta del Mazo de Eventos y Guaridas.',
  })),
];

// ============================================================================
// MAZO DE EVENTOS Y GUARIDAS (Originales, Rejugables, con D20 y Colocación Libre)
// ============================================================================
export const ABISMO_EVENTS_AND_LAIRS_V7 = [
  // --- EVENTOS (SUCESOS) ---
  {
    id: 'ev7_altar', type: 'Evento', icon: '🕯️', title: 'Altar de la Llama Plateada',
    d20Check: { skill: 'Arcano / Investigación', pillar: 'MEN', cd: 12 },
    narrative: 'Un brasero antiguo arde con fuego frío sin consumir madera. Si recitas la inscripción correctamente (MEN CD 12), bendice tus armas y heridas.',
    successOutcome: { pcDelta: 2, pmDelta: 1, fameDelta: 1, narrative: 'La llama te envuelve sin quemar: recuperas +2 PC, +1 PM y ganas +1 Fama.' },
    failOutcome: { pcDelta: -1, narrative: 'Pronuncias mal la runa y una chispa arcana te quema las manos (−1 PC).' },
  },
  {
    id: 'ev7_merchant', type: 'Evento', icon: '🧙', title: 'El Contrabandista de las Sombras',
    d20Check: { skill: 'Persuasión / Negociación', pillar: 'SUE', cd: 13 },
    narrative: 'Un mercader encapuchado sale de un pasadizo oculto y ofrece un trato relámpago. Prueba de Suerte/Persuasión (CD 13) para sacarle una ganga.',
    successOutcome: { goldDelta: -20, items: [{ name: 'Bomba de Humo Alquímica', type: 'Consumible', rarity: 'poco_comun', price: 200, effect: 'Acción gratuita: anula el Área de Influencia de enemigos adyacentes durante 1 turno.' }], narrative: 'Negocias como un maestro: por solo 20 MO consigues una Bomba de Humo Alquímica.' },
    failOutcome: { goldDelta: -35, narrative: 'El contrabandista te cobra de más por información mediocre (−35 MO) y desaparece.' },
    boardSpawn: { kind: 'npc', type: 'npc', label: 'Contrabandista (NPC)' },
  },
  {
    id: 'ev7_mirror', type: 'Evento', icon: '🪞', title: 'Espejo del Doble Oscuro',
    d20Check: { skill: 'Salvación Mente', pillar: 'MEN', cd: 14 },
    narrative: 'Un espejo de obsidiana refleja a tu héroe... ¡pero el reflejo sonríe y extiende su mano con una joya! Prueba de Mente (CD 14) para arrebatarla sin caer en la ilusión.',
    successOutcome: { goldDelta: 85, pmDelta: 1, narrative: '¡Rompes la ilusión y arrancas el colgante real del marco (+85 MO y +1 PM)!' },
    failOutcome: { pmDelta: -2, narrative: 'El reflejo drena tu voluntad antes de hacerse añicos (−2 PM).' },
  },
  {
    id: 'ev7_prisoner', type: 'Evento', icon: '⛓️', title: 'Explorador Imperial Encadenado',
    d20Check: { skill: 'Trampas y Cerraduras', pillar: 'AGI', cd: 12 },
    narrative: 'Un explorador malherido susurra que conoce una puerta secreta cercana si logras abrir sus grilletes (AGI CD 12).',
    successOutcome: { goldDelta: 40, fameDelta: 1, narrative: 'Lo liberas con destreza: te entrega 40 MO, +1 Fama y el DM coloca una Puerta Secreta cercana.' },
    failOutcome: { pcDelta: -1, narrative: 'Los grilletes tenían un resorte envenenado (−1 PC), aunque logras soltarlo con esfuerzo.' },
    boardSpawn: { kind: 'secret_door', type: 'secret_door', label: 'Puerta Secreta Revelada' },
  },
  {
    id: 'ev7_fountain', type: 'Evento', icon: '⛲', title: 'Fuente de Sangre o Vino',
    d20Check: { skill: 'Salvación Física', pillar: 'FUE', cd: 13 },
    narrative: 'Una fuente esculpida con gárgolas vierte líquido carmesí aromático. Si bebes, haz prueba de Fuerza/Aguante (CD 13).',
    successOutcome: { pcDelta: 3, statusAdded: { id: 'vigor_fuente', label: 'Vigor Carmesí (+1 At)', desc: '+1 DC en tu próximo ataque.' }, narrative: '¡Era elixir élfico añejo! Recuperas +3 PC y sientes furia renovada.' },
    failOutcome: { pcDelta: -2, narrative: '¡Veneno rancio! Tu estómago se retuerce (−2 PC).' },
  },
  {
    id: 'ev7_chest_mimic', type: 'Evento', icon: '📦', title: 'Cofre Respirando en la Esquina',
    d20Check: { skill: 'Percepción', pillar: 'MEN', cd: 14 },
    narrative: 'Un cofre cubierto de oro parece… ¡respirar levemente! Prueba de Percepción (CD 14) antes de tocarlo.',
    successOutcome: { goldDelta: 65, narrative: 'Detectas el engaño y sacas 65 MO del doble fondo sin despertar a la bestia.' },
    failOutcome: { pcDelta: -2, narrative: '¡Era un Mímico! Te muerde el brazo (−2 PC) y el DM lo coloca en el tablero.' },
    boardSpawn: { kind: 'monster', type: 'abomination', label: 'Mímico Voraz' },
  },
  {
    id: 'ev7_forge', type: 'Evento', icon: '⚒️', title: 'Yunque de Runas Enanas',
    d20Check: { skill: 'Atletismo / Fuerza', pillar: 'FUE', cd: 13 },
    narrative: 'Un yunque aún tibio tiene un martillo rúnico al lado. Si golpeas tu arma con precisión (FUE CD 13), la templas mágicamente.',
    successOutcome: { statusAdded: { id: 'filo_runico', label: 'Filo Templado (+1 DC)', desc: '+1 DC a tu arma durante esta misión.' }, materials: [{ id: 'polvo_runico', qty: 1 }], narrative: '¡Chispas azules recorren tu arma! Ganas +1 DC esta misión y +1 Polvo Rúnico.' },
    failOutcome: { pcDelta: -1, narrative: 'El retroceso del yunque te lastima la muñeca (−1 PC).' },
  },
  {
    id: 'ev7_library', type: 'Evento', icon: '📚', title: 'Códice Prohibido de Morcar',
    d20Check: { skill: 'Arcano / Investigación', pillar: 'MEN', cd: 15 },
    narrative: 'Un tomo encadenado palpita sobre un atril. Prueba de Arcano (CD 15) para copiar un conjuro sin volverte loco.',
    successOutcome: { pmDelta: 2, items: [{ name: 'Pergamino de Bola de Fuego', type: 'Pergamino', rarity: 'raro', price: 350, effect: '1 solo uso: 2 PC a un monstruo visible (defiende con 2D6, cada 5–6 reduce 1).' }], narrative: 'Descifras el conjuro: +2 PM y obtienes un Pergamino de Bola de Fuego.' },
    failOutcome: { pmDelta: -2, narrative: 'Las páginas gritan en tu mente (−2 PM).' },
  },

  // --- EVENTOS (GUARIDA OPCIONAL · MÁX. 1 POR RETO) ---
  {
    id: 'lair7_troll', type: 'Guarida', icon: '👹', title: 'Guarida: El Cubil del Troll de Obsidiana',
    d20Check: { skill: 'Percepción / Rastreo', pillar: 'MEN', cd: 13 },
    narrative: 'GUARIDA OPCIONAL (Máx. 1/reto): El DM coloca una Puerta Secreta hacia una sala vacía. Dentro aguarda Rockgut, Troll de Obsidiana (AT 5, DF 5, PC 6, Regenera 1 PC/turno). Si lo derrotan reclaman su tesoro.',
    successOutcome: { goldDelta: 160, fameDelta: 2, items: [{ name: 'Sangre de Troll Purificada', type: 'Poción', rarity: 'epico', price: 500, effect: 'Acción gratuita: restaura TODOS tus PC y otorga +1 DC Defensa hasta el fin de la misión.' }], narrative: '¡Victoria sobre el Troll de Obsidiana! +160 MO, +2 Fama y Sangre de Troll Purificada.' },
    failOutcome: { pcDelta: -2, narrative: 'El hedor y los golpes del Troll obligan a retroceder (−2 PC).' },
    boardSpawn: { kind: 'monster', type: 'gargoyle', label: 'Rockgut, Troll de Obsidiana (Jefe Guarida)' },
  },
  {
    id: 'lair7_wight', type: 'Guarida', icon: '💀', title: 'Guarida: Cripta del Rey Tumulario',
    d20Check: { skill: 'Arcano / Mente', pillar: 'MEN', cd: 14 },
    narrative: 'GUARIDA OPCIONAL (Máx. 1/reto): Puerta Secreta a una cámara sellada con un Rey Tumulario (AT 4, DF 4, PC 4) y 2 Esqueletos. Su espada brilla con fuego frío.',
    successOutcome: { goldDelta: 140, fameDelta: 2, items: [{ name: 'Filo Tumulario de Escarcha', type: 'Arma', rarity: 'epico', attack: 3, price: 850, properties: ['1 Mano', 'Diagonal', 'Daño Mágico'], effect: '3 DC de ataque (diagonal). Daña seres etéreos y cada Escudo Negro congela (−2 Mov al objetivo).' }], narrative: '¡Derrotaron al Rey Tumulario! +140 MO, +2 Fama y el Filo Tumulario de Escarcha.' },
    failOutcome: { pmDelta: -2, narrative: 'El aura helada del Rey Tumulario drena tu espíritu (−2 PM).' },
    boardSpawn: { kind: 'monster', type: 'mummy', label: 'Rey Tumulario (Jefe Guarida)' },
  },
  {
    id: 'lair7_spider', type: 'Guarida', icon: '🕷️', title: 'Guarida: Nido de la Araña Madre',
    d20Check: { skill: 'Sigilo / Acrobacia', pillar: 'AGI', cd: 14 },
    narrative: 'GUARIDA OPCIONAL (Máx. 1/reto): Puerta Secreta hacia una sala cubierta de telarañas (terreno difícil) con la Araña Madre (AT 4, DF 3, PC 5, Veneno).',
    successOutcome: { goldDelta: 130, fameDelta: 1, items: [{ name: 'Capa de Seda Arácnida', type: 'Armadura', rarity: 'raro', defense: 1, price: 650, properties: ['No Metálica', 'Sigilo +2'], effect: '+1 DC Defensa sin penalizar magia ni movimiento. Inmune a telarañas.' }], narrative: '¡Limpiaron el Nido de la Araña Madre! +130 MO, +1 Fama y Capa de Seda Arácnida.' },
    failOutcome: { pcDelta: -2, statusAdded: { id: 'veneno_arana', label: 'Veneno Arácnido', desc: '−1 a ataques hasta curar veneno.' }, narrative: 'Mordedura venenosa en las telarañas (−2 PC).' },
    boardSpawn: { kind: 'monster', type: 'abomination', label: 'Araña Madre (Jefe Guarida)' },
  },
  {
    id: 'lair7_chaos_smith', type: 'Guarida', icon: '🔥', title: 'Guarida: Forja Maldita de Arek',
    d20Check: { skill: 'Atletismo / Fuerza', pillar: 'FUE', cd: 15 },
    narrative: 'GUARIDA OPCIONAL (Máx. 1/reto): Puerta Secreta hacia una forja ardiente custodiada por Arek, Guerrero del Caos (AT 5, DF 5, PC 5).',
    successOutcome: { goldDelta: 180, fameDelta: 2, items: [{ name: 'Filo de Disformidad de Arek', type: 'Arma', rarity: 'epico', attack: 4, price: 1100, properties: ['2 Manos', 'Contundente', 'Diagonal'], effect: '4 DC de ataque (diagonal). Contundente: Escudo Negro no bloqueado aturde al enemigo 1 turno.' }], narrative: '¡Arek cae ante ustedes! +180 MO, +2 Fama y el legendario Filo de Disformidad de Arek.' },
    failOutcome: { pcDelta: -2, narrative: 'El calor infernal y los tajos de Arek hieren al grupo (−2 PC).' },
    boardSpawn: { kind: 'monster', type: 'dread_warrior', label: 'Arek, Herrero del Caos (Jefe Guarida)' },
  },
];

// ============================================================================
// EVENTOS DE PASILLO, BIOMA, PISTAS Y GIROS ÉPICOS (RENOVADOS v7.0)
// ============================================================================
export const ABISMO_HALLWAY_EVENTS_V7 = [
  {
    id: 'hw_patrol', icon: '👣', title: 'Patrulla en el Pasillo',
    d20Check: { skill: 'Sigilo', pillar: 'AGI', cd: 13 },
    narrative: 'Antorchas y pasos pesados se acercan doblando la esquina. Prueba grupal de Sigilo (AGI CD 13) para esconderse o emboscarlos.',
    successOutcome: { fameDelta: 1, narrative: '¡Emboscada perfecta! Sorprenden a la patrulla (atacan primero con +1 DC).' },
    failOutcome: { pcDelta: -1, narrative: '¡Los descubren! El DM coloca la patrulla en el pasillo (−1 PC por flecha sorpresa).' },
    boardSpawn: { kind: 'monster', type: 'goblin', label: 'Explorador de Patrulla' },
  },
  {
    id: 'hw_draft', icon: '💨', title: 'Corriente de Aire Helado',
    d20Check: { skill: 'Percepción', pillar: 'MEN', cd: 12 },
    narrative: 'Las llamas de las antorchas se inclinan hacia un muro aparentemente sólido. Prueba de Percepción (MEN CD 12).',
    successOutcome: { pmDelta: 1, narrative: '¡Hallan una Puerta Secreta oculta! El DM puede colocarla en el muro del pasillo.' },
    failOutcome: { pcDelta: 0, narrative: 'Solo parece una grieta sin salida.' },
    boardSpawn: { kind: 'secret_door', type: 'secret_door', label: 'Puerta Secreta de Corriente' },
  },
  {
    id: 'hw_pendulum', icon: '🪓', title: 'Hacha Pendular Activada',
    d20Check: { skill: 'Acrobacia / Sigilo', pillar: 'AGI', cd: 14 },
    narrative: 'Un chasquido metálico libera un hacha gigante desde el techo del pasillo. Prueba de Agilidad (CD 14) para rodar por debajo.',
    successOutcome: { pcDelta: 0, narrative: '¡Ruedas limpiamente por debajo del filo y revelas la trampa!' },
    failOutcome: { pcDelta: -2, narrative: 'El hacha te alcanza de lleno (−2 PC).' },
    boardSpawn: { kind: 'trap', type: 'trap_spear', label: 'Trampa de Hacha Pendular' },
  },
  {
    id: 'hw_corpse', icon: '🦴', title: 'Aventurero Caído en el Pasillo',
    d20Check: { skill: 'Investigación', pillar: 'MEN', cd: 11 },
    narrative: 'Un esqueleto con capa imperial aferra un diario y una bolsa de monedas.',
    successOutcome: { goldDelta: 45, items: [{ name: 'Antídoto Imperial', type: 'Poción', rarity: 'comun', price: 80, effect: 'Acción gratuita: cura Veneno/Enfermedad/Parálisis.' }], narrative: 'Recuperas +45 MO, 1 Antídoto Imperial y una pista sobre el jefe.' },
    failOutcome: { goldDelta: 15, narrative: 'Solo logras rescatar 15 MO antes de que el resto se deshaga en polvo.' },
  },
];

export const ABISMO_BIOME_EVENTS_V7 = [
  {
    id: 'bio_miasma', icon: '☠️', title: 'Miasma de las Catacumbas',
    d20Check: { skill: 'Salvación Física', pillar: 'FUE', cd: 13 },
    narrative: 'Un vapor verdoso brota de las alcantarillas cubriendo la zona. Prueba de Fuerza/Aguante (CD 13).',
    successOutcome: { pcDelta: 0, narrative: 'Aguantas la respiración y atraviesas la nube sin sufrir daño.' },
    failOutcome: { pcDelta: -1, statusAdded: { id: 'miasma', label: 'Intoxicado (−1 Mov)', desc: 'Tos persistente durante 2 turnos.' }, narrative: 'Inhalas el gas tóxico (−1 PC).' },
  },
  {
    id: 'bio_quake', icon: '🪨', title: 'Temblor Subterráneo',
    d20Check: { skill: 'Acrobacia', pillar: 'AGI', cd: 13 },
    narrative: 'El techo cruje y caen cascotes por toda la sala. Prueba de Agilidad (CD 13).',
    successOutcome: { pcDelta: 0, narrative: 'Esquivas las piedras que caen; el DM puede colocar un bloque de roca caída.' },
    failOutcome: { pcDelta: -2, narrative: 'Un bloque golpea tu hombro (−2 PC).' },
    boardSpawn: { kind: 'trap', type: 'trap_falling_rock', label: 'Roca Caída' },
  },
  {
    id: 'bio_aether', icon: '✨', title: 'Resonancia de Vientos Mágicos',
    d20Check: { skill: 'Arcano', pillar: 'MEN', cd: 12 },
    narrative: 'Una oleada de magia pura atraviesa las paredes de piedra. Prueba de Arcano (MEN CD 12) para canalizarla.',
    successOutcome: { pmDelta: 2, narrative: '¡Absorbes la oleada arcana! Recuperas +2 PM (o recargas 1 hechizo Nivel 1).' },
    failOutcome: { pmDelta: -1, narrative: 'La sobrecarga te aturde momentáneamente (−1 PM).' },
  },
];

export const ABISMO_CLUE_EVENTS_V7 = [
  {
    id: 'cl_weakness', icon: '🔍', title: 'Pista: Punto Débil del Jefe',
    d20Check: { skill: 'Investigación / Arcano', pillar: 'MEN', cd: 13 },
    narrative: 'Notas grabadas en piedra revelan la falla en la armadura del jefe final de esta misión.',
    successOutcome: { fameDelta: 1, statusAdded: { id: 'punto_debil', label: 'Debilidad del Jefe (+1 DC)', desc: '+1 DC al atacar al jefe de esta misión.' }, narrative: '¡Descubres su punto débil! Ganas +1 DC contra el jefe de esta misión.' },
    failOutcome: { pmDelta: 0, narrative: 'El texto está demasiado borroso para sacar una ventaja clara.' },
  },
  {
    id: 'cl_map', icon: '🗺️', title: 'Pista: Plano de Contrabandistas',
    d20Check: { skill: 'Percepción', pillar: 'MEN', cd: 12 },
    narrative: 'Un mapa arrugado marca un atajo y una trampa cercana en esta planta.',
    successOutcome: { goldDelta: 30, narrative: 'Identificas el atajo (+30 MO escondidas) y el DM puede revelar una puerta secreta.' },
    failOutcome: { goldDelta: 10, narrative: 'El mapa está rasgado, pero hallas 10 MO pegadas al reverso.' },
    boardSpawn: { kind: 'secret_door', type: 'secret_door', label: 'Atajo Secreto del Mapa' },
  },
];

export const ABISMO_EPIC_TWISTS_V7 = [
  {
    id: 'tw_portal', icon: '🌀', title: 'Giro Épico: ¡Brecha del Caos Abierta!',
    narrative: 'Un portal púrpura se rasga en medio de la mazmorra: el DM coloca inmediatamente un Guerrero del Terror o 2 Esqueletos donde desee. Si los héroes cierran el portal (MEN CD 15), ganan +100 MO y +2 Fama.',
    d20Check: { skill: 'Arcano', pillar: 'MEN', cd: 15 },
    successOutcome: { goldDelta: 100, fameDelta: 2, narrative: '¡Sellar la brecha otorga +100 MO y +2 Fama!' },
    failOutcome: { pmDelta: -1, narrative: 'El portal escupe energía oscura (−1 PM) y los refuerzos avanzan.' },
    boardSpawn: { kind: 'monster', type: 'dread_warrior', label: 'Refuerzo de Brecha (Guerrero del Terror)' },
  },
  {
    id: 'tw_rival', icon: '⚔️', title: 'Giro Épico: ¡Cazador Rival en la Mazmorra!',
    narrative: 'Un mercenario rival intenta robar el botín antes que ustedes. Pueden intimidarlo/negociar (SUE CD 14) o combatirlo en el tablero.',
    d20Check: { skill: 'Persuasión / Intimidar', pillar: 'SUE', cd: 14 },
    successOutcome: { goldDelta: 90, fameDelta: 1, narrative: 'El rival se retira dejando su alijo (+90 MO y +1 Fama).' },
    failOutcome: { goldDelta: -25, narrative: 'El rival escapa llevándose parte del botín (−25 MO) o ataca desde las sombras.' },
    boardSpawn: { kind: 'monster', type: 'assassin', label: 'Cazador Rival' },
  },
  {
    id: 'tw_blessing', icon: '🌟', title: 'Giro Épico: ¡Intervención de Sigmar!',
    narrative: 'Cuando todo parece perdido, un rayo dorado rompe el techo de la mazmorra restaurando fuerzas a todo el grupo (+2 PC, +1 PM a todos).',
    successOutcome: { pcDelta: 2, pmDelta: 1, fameDelta: 1, narrative: '¡La luz de Sigmar restaura +2 PC y +1 PM a todos los héroes!' },
    failOutcome: { pcDelta: 1, narrative: 'Un alivio sutil restaura +1 PC.' },
  },
];
