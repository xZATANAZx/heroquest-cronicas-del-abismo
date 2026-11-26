// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// SISTEMA DE CIUDAD VIVA ("El Bastión de los Héroes")
// Basado en Advanced HeroQuest Enhanced + HQ Homebrew (100% Digital)
// ============================================================================

export const CITY_MODES = {
  relaxed: {
    id: 'relaxed',
    name: 'Modo Relajado (Aventura Heroica)',
    upkeepPerHero: 10,
    robberyRisk: false,
    xpMultiplier: 1.0,
    goldMultiplier: 1.0,
    trapDCBonus: 0,
    monsterPCBonus: 0,
    deathRule: 'Si un héroe cae a 0 PC en misión, queda Inconsciente y el Templo lo cura al volver por 25 MO (o gratis con 1 Ficha de Reputación).',
    summary: 'Partidas ágiles: 10 MO de posada, cero robos en ciudad, escalado estándar de monstruos y trampas CD 12.',
  },
  survival: {
    id: 'survival',
    name: 'Modo Supervivencia (Desafío Táctico)',
    upkeepPerHero: 25,
    robberyRisk: true,
    xpMultiplier: 1.25,
    goldMultiplier: 1.2,
    trapDCBonus: 2,
    monsterPCBonus: 1,
    deathRule: 'Si un héroe muere sin Poción de Curación, requiere Resurrección en el Templo (150 MO, 1 Ficha de Reputación o Deuda Imperial).',
    summary: 'Alta tensión en Ciudad y Mazmorra: 25 MO posada, riesgo de robo sin Banco, monstruos oficiales +1 PC, trampas CD +2 y Jefes Élite (+25% XP y +20% Oro).',
  },
};

// ============================================================================
// 6 DISTRITOS DE LA CIUDAD (Se desbloquean y mejoran con Fama del Grupo)
// ============================================================================
export const CITY_DISTRICTS = [
  {
    id: 'taberna',
    name: 'Taberna y Posada "El Grifo Dorado"',
    icon: '🍺',
    fameRequired: 0,
    professionDiscountId: 'mercader',
    summary: 'Descansa (restaura todos los PC, PM y hechizos), cocina Banquetes con Raciones de Mazmorra y revisa el Tablón de Contratos.',
  },
  {
    id: 'herreria',
    name: 'Herrería y Taller de Ingeniería',
    icon: '⚒️',
    fameRequired: 0,
    professionDiscountId: 'herrero',
    summary: 'Compra armas/armaduras, fabrica bombas y trampas, y sube el nivel de tus Artefactos (Nv.1 → Nv.5).',
  },
  {
    id: 'alquimista',
    name: 'Torre del Alquimista y Escriba',
    icon: '🧪',
    fameRequired: 0,
    professionDiscountId: 'alquimista',
    summary: 'Destila pociones, tónicos arriesgados, venenos de hoja, runas grabables y haz Mezclas Experimentales.',
  },
  {
    id: 'templo',
    name: 'Templo de la Luz y Sanador',
    icon: '⛪',
    fameRequired: 1,
    professionDiscountId: 'sacerdote',
    summary: 'Cura maldiciones, compra bendiciones de misión o resucita héroes caídos (oro, Ficha de Reputación o Deuda).',
  },
  {
    id: 'gremio',
    name: 'Gremio de Aventureros y Cuartel',
    icon: '🛡️',
    fameRequired: 2,
    professionDiscountId: 'explorador',
    summary: 'Aprende Profesiones, contrata Mercenarios, recluta Seguidores Únicos por Fama y adopta Familiares.',
  },
  {
    id: 'banco',
    name: 'Banco del Prestamista Imperial',
    icon: '🏦',
    fameRequired: 0,
    professionDiscountId: 'mercader',
    summary: 'Guarda tu oro a salvo de robos en la posada (Modo Supervivencia) o solicita un préstamo de emergencia.',
  },
];

// ============================================================================
// BANQUETES DE TABERNA (Usan Raciones de Mazmorra para bonos en la próxima misión)
// ============================================================================
export const TAVERN_FEASTS = [
  {
    id: 'feast_guerrero',
    name: 'Estofado del Bárbaro',
    rationsCost: 1,
    goldCost: 15,
    buffLabel: '🍖 Banquete: +2 PC Temporales',
    effect: 'Empiezas la siguiente misión con +2 PC temporales (absorben los primeros 2 daños).',
  },
  {
    id: 'feast_explorador',
    name: 'Asado de Caza Élfico',
    rationsCost: 1,
    goldCost: 15,
    buffLabel: '🍖 Banquete: +2 Mov en la 1ª Sala',
    effect: 'Empiezas la misión bien descansado: +2 a Iniciativa y +2 casillas de movimiento en tu primer combate.',
  },
  {
    id: 'feast_sabio',
    name: 'Vino Especiado de la Torre',
    rationsCost: 1,
    goldCost: 20,
    buffLabel: '🍖 Banquete: +1 PM y Ventaja Mental',
    effect: 'Empiezas la siguiente misión con +1 PM temporal y Ventaja en tu primera salvación de Mente.',
  },
];

// ============================================================================
// SERVICIOS DEL TEMPLO Y FAVORES DE REPUTACIÓN
// ============================================================================
export const TEMPLE_SERVICES = [
  {
    id: 'temple_bless',
    name: 'Bendición de la Luz',
    goldCost: 30,
    repCost: 0,
    effect: 'Durante la próxima misión, tu primer ataque contra No Muertos o Caos suma +2 DC mágicos.',
  },
  {
    id: 'temple_cleanse',
    name: 'Purificación Total',
    goldCost: 25,
    repCost: 0,
    effect: 'Elimina cualquier maldición, veneno crónico, cicatriz de Shock o efecto negativo persistente.',
  },
  {
    id: 'temple_resurrect_gold',
    name: 'Resurrección Sagrada (Oro)',
    goldCost: 150,
    repCost: 0,
    effect: 'Devuelve a la vida a un héroe caído con todos sus PC y PM intactos.',
  },
  {
    id: 'temple_resurrect_rep',
    name: 'Resurrección por Favor Heroico (Reputación)',
    goldCost: 0,
    repCost: 1,
    effect: 'Gasta 1 Ficha de Reputación del grupo: el Templo resucita gratis a un héroe caído por sus servicios al Imperio.',
  },
  {
    id: 'temple_resurrect_debt',
    name: 'Resurrección a Crédito (Deuda Imperial)',
    goldCost: 0,
    repCost: 0,
    addsDebt: 180,
    effect: 'El héroe revive de inmediato sin pagar ahora, pero contrae una Deuda de 180 MO con el Templo.',
  },
];

export const REPUTATION_FAVORS = [
  {
    id: 'rep_decree',
    name: 'Decreto Real de Recompensa',
    repCost: 1,
    effect: 'El Consejo paga +50% de oro extra en la próxima misión completada.',
  },
  {
    id: 'rep_follower',
    name: 'Escolta Gratuita del Gremio',
    repCost: 1,
    effect: 'Un Seguidor Único o Mercenario acompaña al grupo GRATIS durante toda la próxima misión.',
  },
  {
    id: 'rep_intel',
    name: 'Planos Secretos de la Mazmorra',
    repCost: 1,
    effect: 'Al iniciar la próxima misión, el DM revela la ubicación de 1 Puerta Secreta o la Sala del Jefe y otorga 2 Pistas gratis.',
  },
  {
    id: 'rep_artifact_gift',
    name: 'Reliquia de la Armería Real',
    repCost: 2,
    effect: 'El grupo recibe 1 Gema Abismal + 2 Polvos Rúnicos para mejorar sus artefactos.',
  },
];

// ============================================================================
// RANGOS INDIVIDUALES DE FAMA Y PROFESIONES MEJORADAS (HQ-D20 v2)
// Cada héroe gana su propia Fama (⭐) y Reputación (🏅) con efectos reales en Ciudad
// ============================================================================
export function getHeroFameTier(heroFame = 0) {
  const f = Number(heroFame || 0);
  if (f >= 6) {
    return {
      rank: 'Leyenda del Bastión',
      discount: 0.2,
      freeInn: true,
      perk: '-20% en toda la Ciudad, Posada GRATIS y acceso a todos los Seguidores.',
    };
  }
  if (f >= 3) {
    return {
      rank: 'Héroe Reconocido',
      discount: 0.1,
      freeInn: false,
      perk: '-10% en toda la Ciudad y desbloquea Seguidores Únicos.',
    };
  }
  if (f >= 1) {
    return {
      rank: 'Aventurero Prometedor',
      discount: 0.05,
      freeInn: false,
      perk: '-5% en Ciudad y reputación creciente en la Taberna.',
    };
  }
  return {
    rank: 'Forastero Novato',
    discount: 0,
    freeInn: false,
    perk: 'Completa misiones y hazañas para ganar Fama individual y descuentos.',
  };
}

export const PROFESSIONS = [
  {
    id: 'herrero',
    name: 'Herrero de Batalla',
    icon: '⚒️',
    districtId: 'herreria',
    cityBonus: '-20% al Forjar Equipo y +1 Acero extra al Reciclar armas/armaduras.',
    dungeonBonus: '1 vez por misión (acción gratuita): afila el arma de un aliado (+1 DC en su próximo combate) y repara escudos dañados.',
  },
  {
    id: 'alquimista',
    name: 'Herbolario Alquimista',
    icon: '🧪',
    districtId: 'alquimista',
    cityBonus: '-20% en pociones/tónicos en Ciudad y +1 Hierba Lunar al visitar el Alquimista.',
    dungeonBonus: '+3 a tiradas de Arcano en Mesas de Alquimia (más críticos ×2 y menos explosiones) y empiezas cada misión con 1 Venda de Campaña.',
  },
  {
    id: 'sacerdote',
    name: 'Médico / Acólito del Templo',
    icon: '⛪',
    districtId: 'templo',
    cityBonus: '-20% en curas, bendiciones y resurrección del Templo.',
    dungeonBonus: 'Estabilizas aliados a 0 PC automáticamente (sin tirar Medicina) y cualquier venda o curación que apliques restaura +1 PC extra.',
  },
  {
    id: 'explorador',
    name: 'Rastreador de Pasillos',
    icon: '🧭',
    districtId: 'gremio',
    cityBonus: '-20% al contratar Seguidores o adoptar Familiares.',
    dungeonBonus: 'En pasillos detectas trampas y emboscadas con Ventaja (Percepción) y revelas 1 Pista Sensorial gratis por misión.',
  },
  {
    id: 'minero',
    name: 'Cerrajero e Ingeniero',
    icon: '🗝️',
    districtId: 'herreria',
    cityBonus: '-20% en bombas, pólvora y forja de equipo.',
    dungeonBonus: '+2 a Desarmar Trampas y abrir puertas cerradas; 1 vez por misión abres una puerta cerrada sin subir el Reloj del Caos y doblas Acero/Pólvora de trampas.',
  },
  {
    id: 'escriba',
    name: 'Escriba Rúnico',
    icon: '📜',
    districtId: 'alquimista',
    cityBonus: '-20% en Pergaminos, Runas y Nivelación de Artefactos.',
    dungeonBonus: 'Al examinar Bibliotecas o Altares ganas +1 Polvo Rúnico automático y puedes pedir 1 pista extra en Puzzles del celular.',
  },
  {
    id: 'mercader',
    name: 'Mercader Negociante',
    icon: '💰',
    districtId: 'taberna',
    cityBonus: 'Posada y Banquetes al 50% y vendes/reciclas botín con +25% de oro extra.',
    dungeonBonus: 'Encuentras +20% más Monedas de Oro en cofres y tienes Ventaja (+2) en Persuasión al negociar en mazmorra.',
  },
  {
    id: 'cazador',
    name: 'Cazador de Trofeos',
    icon: '🏹',
    districtId: 'gremio',
    cityBonus: '-20% en venenos de hoja y servicios del Gremio.',
    dungeonBonus: 'Al caer un Jefe o Élite siempre extraes +1 Material raro extra (Ícor, Glándula o Gema) y conoces sus PC y debilidades.',
  },
];

// ============================================================================
// SEGUIDORES ÚNICOS POR FAMA (Inspirados en Advanced HeroQuest Enhanced)
// ============================================================================
export const UNIQUE_FOLLOWERS = [
  {
    id: 'fol_capitan',
    name: 'Capitán Imperial Marcus',
    role: 'Vanguardia / Estratega',
    fameRequired: 2,
    hireCost: 180,
    stats: 'Mov 6 · At 3 DC · Def 4 DC · PC 4',
    ability: 'Grito de Formación: 1 vez por combate, todos los héroes en la misma sala ganan +1 DC de Defensa por 1 ronda.',
  },
  {
    id: 'fol_matatrolls',
    name: 'Snorri el Matatrolls',
    role: 'Berserker Enano',
    fameRequired: 3,
    hireCost: 220,
    stats: 'Mov 6 · At 4 DC · Def 2 DC · PC 5',
    ability: 'Juramento de Muerte: +2 DC contra Jefes, Trolls, Minotauros y Gárgolas. Nunca sufre Miedo.',
  },
  {
    id: 'fol_bailarin',
    name: 'Liriel, Bailarina Guerrera',
    role: 'Acróbata Élfica',
    fameRequired: 4,
    hireCost: 260,
    stats: 'Mov 9 · At 3 DC (2 ataques) · Def 3 DC · PC 3',
    ability: 'Danza de Espadas: Ignora Zona de Control y puede atacar a 2 enemigos adyacentes en el mismo turno.',
  },
  {
    id: 'fol_aprendiz',
    name: 'Vaelen, Aprendiz Arcano',
    role: 'Soporte Mágico',
    fameRequired: 3,
    hireCost: 210,
    stats: 'Mov 7 · At 2 DC Mágico · Def 2 DC · PC 3 · PM 5',
    ability: 'Chispa de Apoyo: Lleva 1 Bola de Fuego, 1 Curación (+3 PC) y 1 Luz Reveladora por misión.',
  },
];

// ============================================================================
// FAMILIARES DE UTILIDAD (Acompañantes sin estorbar el combate)
// ============================================================================
export const FAMILIARS = [
  {
    id: 'fam_cuervo',
    name: 'Cuervo Vigía',
    icon: '🐦‍⬛',
    cost: 160,
    ability: 'Asoma por puertas entreabiertas: 1 vez por misión te dice exactamente qué monstruos hay tras una puerta cerrada sin abrirla.',
  },
  {
    id: 'fam_sabueso',
    name: 'Sabueso de Caza',
    icon: '🐕',
    cost: 185,
    ability: 'Olfato infalible: +2 a detectar Emboscadas/Patrullas y 1 vez por combate muerde al objetivo (-1 DC Defensa enemigo).',
  },
  {
    id: 'fam_huron',
    name: 'Hurón Ladronzuelo',
    icon: '🦡',
    cost: 175,
    ability: 'Manos rápidas: 1 vez por misión puede recoger 1 llave, moneda o material a 3 casillas sin activar trampas de presión.',
  },
  {
    id: 'fam_buho',
    name: 'Búho Rúnico',
    icon: '🦉',
    cost: 210,
    ability: 'Ojo Arcano: +2 a pruebas de Arcano e Investigación, y te avisa si un cofre es un Mímico antes de abrirlo.',
  },
];

// ============================================================================
// EVENTOS DE CIUDAD (16 Eventos Ricos combinando AHQ Enhanced + HQ-D20)
// ============================================================================
export const TOWN_EVENTS_TABLE = [
  {
    id: 'te_1',
    title: 'Festival del Sol Imperial',
    tone: 'positivo',
    target: 'all',
    effect: 'Las calles celebran una gran victoria. Todos recuperan PC/PM al máximo, ganan +1 Fama y el grupo recibe 1 Ración de Mazmorra cada uno.',
    actions: [
      {
        id: 'claim_festival',
        label: '🎉 Aplicar Beneficio al Grupo (+PC/PM, +1 Ración, +1 Fama)',
        style: 'emerald',
        fullHeal: true,
        fameDelta: 1,
        materials: [{ id: 'racion_mazmorra', qty: 1 }],
        note: 'Todos celebran: PC/PM restaurados, +1 Ración de Mazmorra y +1 Fama.',
      },
    ],
  },
  {
    id: 'te_2',
    title: 'Caravana de Mercaderes Exóticos',
    tone: 'oportunidad',
    target: 'single',
    effect: 'Un mercader del Este vende un lote raro de suministros por 25 MO: contiene 2 Hierbas Lunares + 1 Polvo Rúnico.',
    actions: [
      {
        id: 'buy_caravan',
        label: '💰 Comprar Lote (-25 MO → 2 Hierbas + 1 Polvo Rúnico)',
        style: 'amber',
        goldDelta: -25,
        materials: [
          { id: 'hierba_lunar', qty: 2 },
          { id: 'polvo_runico', qty: 1 },
        ],
        note: 'Lote exótico comprado: +2 Hierbas Lunares y +1 Polvo Rúnico.',
      },
      {
        id: 'skip_caravan',
        label: '🚫 Pasar de largo',
        style: 'slate',
        note: 'El héroe deja pasar la caravana.',
      },
    ],
  },
  {
    id: 'te_3',
    title: 'Bolsillos Ligeros en la Taberna',
    tone: 'peligro',
    target: 'single',
    effect: 'Un ladrón intenta robar al héroe seleccionado. Tira Percepción CD 13 en mesa: si falla pierde 15 MO; si lo atrapa recupera 10 MO y gana +1 Reputación.',
    actions: [
      {
        id: 'catch_thief',
        label: '✅ Éxito CD 13 (+10 MO y +1 Reputación)',
        style: 'emerald',
        goldDelta: 10,
        repDelta: 1,
        note: '¡Ladrón atrapado! +10 MO de recompensa y +1 Reputación.',
      },
      {
        id: 'robbed',
        label: '❌ Fallo CD 13 (-15 MO)',
        style: 'rose',
        goldDelta: -15,
        note: 'El carterista escapa con 15 MO.',
      },
    ],
  },
  {
    id: 'te_4',
    title: 'Herrero Ambulante Enano',
    tone: 'oportunidad',
    target: 'single',
    effect: 'Un maestro herrero ofrece afilar y reforzar el equipo de 1 héroe por 15 MO (entrega 1 Piedra de Afilar Enana + 1 Acero Templado).',
    actions: [
      {
        id: 'hire_smith',
        label: '⚒️ Pagar Afilado (-15 MO → +1 Acero + Piedra de Afilar)',
        style: 'amber',
        goldDelta: -15,
        materials: [{ id: 'chatarra_acero', qty: 1 }],
        lootItem: 'Piedra de Afilar Enana (+1 DC próximo combate)',
        note: 'El herrero entrega Acero Templado y Piedra de Afilar Enana.',
      },
      {
        id: 'skip_smith',
        label: '🚫 Rechazar',
        style: 'slate',
        note: 'El herrero sigue su camino.',
      },
    ],
  },
  {
    id: 'te_5',
    title: 'Fiebre de los Muelles',
    tone: 'peligro',
    target: 'all',
    effect: 'Una plaga leve azota el barrio bajo. Cada héroe tira CON CD 12 en mesa: quienes fallen pagan 15 MO en el Templo o sufren -2 PC.',
    actions: [
      {
        id: 'pay_temple_all',
        label: '⛪ Pagar Cura en Templo (-15 MO a todos)',
        style: 'amber',
        goldDelta: -15,
        note: 'Todos pagan 15 MO en el Templo y evitan la fiebre.',
      },
      {
        id: 'suffer_fever',
        label: '🤒 Fallaron CON (-2 PC a todos)',
        style: 'rose',
        pcDelta: -2,
        note: 'La fiebre debilita al grupo (-2 PC).',
      },
      {
        id: 'resist_fever',
        label: '✅ Todos superaron CON CD 12',
        style: 'emerald',
        note: 'El grupo resiste la plaga sin consecuencias.',
      },
    ],
  },
  {
    id: 'te_6',
    title: 'Rumor de Reliquia Olvidada',
    tone: 'oportunidad',
    target: 'single',
    effect: 'Un informante vende un mapa parcial por 20 MO: otorga +35 XP al héroe y 1 Pergamino Virgen.',
    actions: [
      {
        id: 'buy_map',
        label: '📜 Comprar Mapa (-20 MO → +35 XP y +1 Pergamino Virgen)',
        style: 'sky',
        goldDelta: -20,
        xpDelta: 35,
        materials: [{ id: 'pergamino_virgen', qty: 1 }],
        note: 'Mapa adquirido: +35 XP y +1 Pergamino Virgen.',
      },
      {
        id: 'skip_map',
        label: '🚫 Ignorar rumor',
        style: 'slate',
        note: 'El informante se marcha.',
      },
    ],
  },
  {
    id: 'te_7',
    title: 'Inquisidor en la Plaza',
    tone: 'mixto',
    target: 'single',
    effect: 'Los clérigos inspeccionan magia oscura. Tira Persuasión/CAR CD 12: si fallas pagas 15 MO de diezmo; si triunfas recibes Agua Bendita gratis (+1 Reputación).',
    actions: [
      {
        id: 'pass_inq',
        label: '✅ Éxito CD 12 (+Agua Bendita y +1 Rep)',
        style: 'emerald',
        repDelta: 1,
        lootItem: 'Frasco de Agua Bendita (2 daño a No-Muertos)',
        note: 'El Inquisidor bendice al héroe: +Agua Bendita y +1 Reputación.',
      },
      {
        id: 'fail_inq',
        label: '❌ Fallo CD 12 (Pagar 15 MO de diezmo)',
        style: 'rose',
        goldDelta: -15,
        note: 'El héroe paga 15 MO de diezmo obligatorio.',
      },
    ],
  },
  {
    id: 'te_8',
    title: 'Torneo de la Guardia',
    tone: 'oportunidad',
    target: 'single',
    effect: 'Un héroe puede inscribirse por 15 MO y tirar Atletismo o Combate (CD 14): si gana obtiene 45 MO (+30 netos) y +1 Fama; si pierde, solo pierde la apuesta.',
    actions: [
      {
        id: 'win_tourney',
        label: '🏆 Ganó Torneo (+30 MO netos y +1 Fama)',
        style: 'emerald',
        goldDelta: 30,
        fameDelta: 1,
        note: '¡Campeón de la arena! +30 MO netos y +1 Fama.',
      },
      {
        id: 'lose_tourney',
        label: '❌ Perdió Torneo (-15 MO)',
        style: 'rose',
        goldDelta: -15,
        note: 'Derrota honorable: -15 MO de inscripción.',
      },
      {
        id: 'skip_tourney',
        label: '🚫 No participar',
        style: 'slate',
        note: 'El héroe observa desde las gradas.',
      },
    ],
  },
  {
    id: 'te_9',
    title: 'Incendio en el Almacén Alquímico',
    tone: 'mixto',
    target: 'single',
    effect: 'Un héroe puede ayudar a apagar el fuego (Atletismo CD 13): éxito otorga 2 Hierbas Lunares + 1 Polvo Rúnico + 1 Reputación; fallo causa -2 PC por quemaduras.',
    actions: [
      {
        id: 'help_fire_ok',
        label: '✅ Éxito CD 13 (+2 Hierbas, +1 Polvo Rúnico, +1 Rep)',
        style: 'emerald',
        repDelta: 1,
        materials: [
          { id: 'hierba_lunar', qty: 2 },
          { id: 'polvo_runico', qty: 1 },
        ],
        note: '¡Almacén salvado! +2 Hierbas Lunares, +1 Polvo Rúnico y +1 Reputación.',
      },
      {
        id: 'help_fire_fail',
        label: '🔥 Fallo CD 13 (-2 PC por quemaduras)',
        style: 'rose',
        pcDelta: -2,
        note: 'El humo y las llamas hieren al héroe (-2 PC).',
      },
    ],
  },
  {
    id: 'te_10',
    title: 'Emboscada en el Callejón',
    tone: 'peligro',
    target: 'single',
    effect: 'Matones locales acorralan a un héroe. Tira Intimidación o DES CD 13: éxito obtiene 15 MO y +20 XP; fallo sufre -2 PC y pierde 10 MO.',
    actions: [
      {
        id: 'beat_ambush',
        label: '⚔️ Éxito CD 13 (+15 MO y +20 XP)',
        style: 'emerald',
        goldDelta: 15,
        xpDelta: 20,
        note: '¡Emboscada repelida! +15 MO y +20 XP.',
      },
      {
        id: 'fail_ambush',
        label: '🩸 Fallo CD 13 (-2 PC y -10 MO)',
        style: 'rose',
        pcDelta: -2,
        goldDelta: -10,
        note: 'El héroe escapa herido (-2 PC y -10 MO).',
      },
    ],
  },
  {
    id: 'te_11',
    title: 'Agradecimiento del Concejo',
    tone: 'positivo',
    target: 'all',
    effect: 'Por sus hazañas recientes, la ciudad recompensa a cada héroe con +20 MO y +1 Fama.',
    actions: [
      {
        id: 'claim_council',
        label: '🏅 Cobrar Recompensa (+20 MO a cada héroe y +1 Fama)',
        style: 'emerald',
        goldDelta: 20,
        fameDelta: 1,
        note: 'El Concejo entrega +20 MO a cada héroe y +1 Fama.',
      },
    ],
  },
  {
    id: 'te_12',
    title: 'Subasta del Mercado Negro',
    tone: 'oportunidad',
    target: 'single',
    effect: 'Un encapuchado ofrece una caja misteriosa por 40 MO: contiene 1 Gema Abismal o 1 Esencia Espectral + 1 Poción aleatoria.',
    actions: [
      {
        id: 'buy_mystery_box',
        label: '🎁 Comprar Caja Misteriosa (-40 MO → Material Raro + Poción)',
        style: 'amber',
        goldDelta: -40,
        randomMaterialChoice: ['gema_abismal', 'esencia_espectral'],
        randomPotion: true,
        note: '¡Caja abierta! Se agregó 1 material raro y 1 poción aleatoria al héroe.',
      },
      {
        id: 'skip_mystery_box',
        label: '🚫 Rechazar oferta',
        style: 'slate',
        note: 'El encapuchado desaparece entre la niebla.',
      },
    ],
  },
  {
    id: 'te_13',
    title: 'Tormenta de Ceniza',
    tone: 'mixto',
    target: 'all',
    effect: 'Cae ceniza volcánica sobre la ciudad. Tiren Supervivencia CD 12: si tienen éxito recolectan 1 Pólvora Negra por héroe; si fallan pagan 10 MO en reparaciones.',
    actions: [
      {
        id: 'ash_success',
        label: '✅ Éxito CD 12 (+1 Pólvora Negra a cada héroe)',
        style: 'emerald',
        materials: [{ id: 'polvora_negra', qty: 1 }],
        note: 'Ceniza aprovechada: +1 Pólvora Negra para cada héroe.',
      },
      {
        id: 'ash_fail',
        label: '❌ Fallo CD 12 (-10 MO a cada héroe)',
        style: 'rose',
        goldDelta: -10,
        note: 'Gastos de limpieza y refugio: -10 MO a cada héroe.',
      },
    ],
  },
  {
    id: 'te_14',
    title: 'Canto del Bardo Viajero',
    tone: 'positivo',
    target: 'all',
    effect: 'Las baladas sobre el grupo elevan el ánimo: todos recuperan todos sus PM y ganan +15 XP y +1 Fama.',
    actions: [
      {
        id: 'claim_bard',
        label: '🎵 Escuchar Balada (PM al máximo, +15 XP y +1 Fama)',
        style: 'emerald',
        fullPm: true,
        xpDelta: 15,
        fameDelta: 1,
        note: 'Todos recuperan PM al máximo, ganan +15 XP y +1 Fama.',
      },
    ],
  },
  {
    id: 'te_15',
    title: 'Impuesto de Guerra Imperial',
    tone: 'peligro',
    target: 'all',
    effect: 'La corona recauda fondos contra el Caos: cada héroe paga 15 MO (o acepta perder -1 Reputación por negarse).',
    actions: [
      {
        id: 'pay_tax',
        label: '💰 Pagar Impuesto (-15 MO a cada héroe)',
        style: 'amber',
        goldDelta: -15,
        note: 'Impuesto pagado: -15 MO por héroe.',
      },
      {
        id: 'refuse_tax',
        label: '🚫 Negarse (-1 Reputación)',
        style: 'rose',
        repDelta: -1,
        note: 'Los recaudadores anotan sus nombres (-1 Reputación).',
      },
    ],
  },
  {
    id: 'te_16',
    title: 'Visita de un Maestro Retirado',
    tone: 'positivo',
    target: 'all',
    effect: 'Un veterano comparte técnicas de combate en el Gremio: cada héroe gana +40 XP gratis antes de partir.',
    actions: [
      {
        id: 'claim_master',
        label: '🎓 Recibir Entrenamiento (+40 XP a cada héroe)',
        style: 'emerald',
        xpDelta: 40,
        note: 'Cada héroe recibe +40 XP del Maestro Retirado.',
      },
    ],
  },
];

export function rollTownEvent() {
  return TOWN_EVENTS_TABLE[Math.floor(Math.random() * TOWN_EVENTS_TABLE.length)];
}
