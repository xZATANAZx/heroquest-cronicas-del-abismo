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
  const raw = TOWN_EVENTS_TABLE[Math.floor(Math.random() * TOWN_EVENTS_TABLE.length)];
  return {
    ...raw,
    // Ocultar spoilers de recompensas/fallos en los botones de acción hasta que el grupo elija
    actions: (raw.actions || []).map((a) => ({
      ...a,
      label: stripChoiceSpoilers(a.label),
    })),
  };
}

// ============================================================================
// ENTRADA NARRATIVA + EVENTOS PERSONALES INDEPENDIENTES DE CIUDAD (CELULAR)
// Adaptados a Rasgo (Quirk), Profesión, Clase, Raza y Modo Supervivencia
// ============================================================================
export function generatePersonalCityArrival(hero, cityMode = 'relaxed') {
  const name = hero?.name || 'Aventurero';
  const isSurv = cityMode === 'survival';
  const scenes = isSurv
    ? [
        `Las puertas de hierro de El Bastión chirrían bajo una lluvia fría. Los guardias revisan cada capa con recelo y el aire huele a hierro y carbón. ${name}, en Modo Supervivencia cada moneda cuenta y las sombras de los callejones observan...`,
        `Las antorchas parpadean en la plaza empedrada mientras las campanas anuncian el toque de queda. Mercaderes nerviosos cierran sus puestos temprano. ${name}, cruzar las murallas hoy exige astucia y mantener tu oro a salvo.`,
      ]
    : [
        `Las grandes puertas de piedra de El Bastión se abren ante ti. El aroma a pan recién horneado, acero templado y especias alquímicas llena la avenida principal. ${name}, el murmullo de la taberna y el brillo de la forja te dan la bienvenida.`,
        `Banderines dorados ondean sobre las torres del Bastión mientras los bardos afinan sus laúdes en la plaza. Al reconocerte por tus hazañas, varios ciudadanos apartan el paso con admiración. ¿Qué te espera hoy en las calles, ${name}?`,
        `La niebla del camino queda atrás y las farolas cálidas iluminan el mercado del Bastión. Herreros golpean el yunque al compás de las risas en El Grifo Dorado. Es tu momento de recorrer la ciudad a tu ritmo, ${name}.`,
      ];
  return scenes[Math.floor(Math.random() * scenes.length)];
}

export function stripChoiceSpoilers(label = '') {
  return String(label)
    .replace(/\s*\([^)]*(?:MO|XP|PC|PM|Fama|Rep|Reputación|Acero|Polvo|Hierba|Aceite|Ración|Esencia|Pólvora|Huesos|Glándula|DC|temp|combate|gratis)[^)]*\)/gi, '')
    .trim();
}

export function generatePersonalCityEvent(hero, cityMode = 'relaxed') {
  const isSurv = cityMode === 'survival';
  const quirkId = hero?.quirk?.id || '';
  const profId = hero?.professionId || '';
  const clsId = hero?.classId || '';
  const raceId = hero?.raceId || '';
  const gold = Number(hero?.gold || 0);

  const personalPool = [];

  // --- 1. EVENTOS POR RASGO DE PERSONALIDAD (QUIRK) ---
  if (quirkId === 'piromano') {
    personalPool.push({
      id: 'pe_quirk_piromano',
      tag: '🔥 Tu Rasgo: Pirómano Fascinado',
      title: 'La Fragua Desbocada del Callejón',
      story: 'Un aprendiz de herrero perdió el control de su crisol y las chispas amenazan un carro de heno. ¡El fuego te hipnotiza, pero también sabes exactamente cómo domarlo!',
      choices: [
        {
          label: '🔥 Domar las llamas con estilo (+1 Polvo Rúnico, +15 MO)',
          goldDelta: 15,
          materialId: 'polvo_runico',
          materialQty: 1,
          outcome: 'Controlas la llamarada con una sonrisa fascinante; el herrero agradecido te regala 15 MO y ceniza rúnica.',
        },
        {
          label: '💥 Aprovechar las brasas para un truco (+1 Aceite, +1 Fama)',
          fameDelta: 1,
          materialId: 'aceite_alquitran',
          materialQty: 1,
          outcome: 'La multitud aplaude tu espectáculo ígneo. Ganas +1 Fama y 1 Aceite de Alquitrán.',
        },
      ],
    });
  }
  if (quirkId === 'gloton_heroico') {
    personalPool.push({
      id: 'pe_quirk_gloton',
      tag: '🍖 Tu Rasgo: Glotón de Taberna',
      title: 'Reto del Estofado de Dragón',
      story: 'El tabernero de El Grifo Dorado te reta a terminar un caldero picante ante toda la posada.',
      choices: [
        {
          label: '🍲 ¡Aceptar el reto! (+1 Ración y +2 PC temporales)',
          materialId: 'racion_mazmorra',
          materialQty: 1,
          buff: { id: 'city_estofado', label: '🍲 Estofado Heroico (+2 PC temp)', type: 'buff', duration: 99 },
          outcome: '¡Lo devoras sin pestañear! Te llevas +1 Ración gratis y empiezas la próxima misión con vigor (+2 PC temp).',
        },
        {
          label: '🍺 Invitar una ronda rápida (-10 MO, +1 Fama)',
          goldDelta: -10,
          fameDelta: 1,
          outcome: 'Brindas con los parroquianos y todos corean tu nombre (+1 Fama).',
        },
      ],
    });
  }
  if (quirkId === 'coleccionista_huesos') {
    personalPool.push({
      id: 'pe_quirk_coleccionista',
      tag: '🦴 Tu Rasgo: Coleccionista de Trofeos',
      title: 'El Anticuario de Curiosidades',
      story: 'Un coleccionista excéntrico te detiene en el mercado y señala tu mochila buscando piezas raras de mazmorra.',
      choices: [
        {
          label: '🦴 Intercambiar historias y piezas (+1 Huesos y Colmillos, +20 MO)',
          goldDelta: 20,
          materialId: 'colmillos_hueso',
          materialQty: 1,
          outcome: 'Te compra un relato detallado y te entrega 20 MO + 1 Huesos y Colmillos.',
        },
        {
          label: '💎 Comprar su caja misteriosa (-25 MO → +1 Esencia Espectral)',
          goldDelta: -25,
          materialId: 'esencia_espectral',
          materialQty: 1,
          outcome: '¡Dentro de la caja había ectoplasma sellado! Consigues +1 Esencia Espectral.',
        },
      ],
    });
  }
  if (quirkId === 'negociador_nato') {
    personalPool.push({
      id: 'pe_quirk_negociador',
      tag: '💬 Tu Rasgo: Lengua de Plata',
      title: 'Disputa en la Subasta del Puerto',
      story: 'Dos mercaderes discuten acaloradamente por un cargamento sellado. Tu labia puede resolverlo a tu favor.',
      choices: [
        {
          label: '🤝 Mediar el trato por comisión (+35 MO)',
          goldDelta: 35,
          outcome: 'Ambos quedan satisfechos y te pagan 35 MO por cerrar el acuerdo.',
        },
        {
          label: '🏅 Ceder la ganancia al Gremio (+1 Reputación)',
          repDelta: 1,
          outcome: 'El Gremio reconoce tu honorabilidad y te otorga +1 Ficha de Reputación.',
        },
      ],
    });
  }
  if (quirkId === 'insomne') {
    personalPool.push({
      id: 'pe_quirk_insomne',
      tag: '👁️ Tu Rasgo: Insomne Alerta',
      title: 'Sombras en el Tejado de la Plaza',
      story: 'Mientras todos descansan, tus ojos atentos descubren a un espía dejando un paquete tras una gárgola.',
      choices: [
        {
          label: '👁️ Interceptar el paquete (+25 MO y +1 Pólvora Negra)',
          goldDelta: 25,
          materialId: 'polvora_negra',
          materialQty: 1,
          outcome: 'El espía huye dejando 25 MO y 1 carga de Pólvora Negra.',
        },
        {
          label: '🛡️ Avisar a la Guardia Imperial (+1 Reputación)',
          repDelta: 1,
          outcome: 'El capitán de la guardia agradece tu vigilancia nocturna (+1 Reputación).',
        },
      ],
    });
  }
  if (quirkId === 'fanatico_acero') {
    personalPool.push({
      id: 'pe_quirk_acero',
      tag: '⚔️ Tu Rasgo: Obsesionado con el Filo',
      title: 'Duelo Amistoso en el Patio de Armas',
      story: 'Un veterano de la Guardia del Rey te reta a un intercambio con espadas romas frente a los reclutas.',
      choices: [
        {
          label: '⚔️ Aceptar el duelo (+1 Acero Templado y +25 XP)',
          xpDelta: 25,
          materialId: 'chatarra_acero',
          materialQty: 1,
          outcome: 'Tu técnica impresiona al instructor: ganas +25 XP y un lingote de Acero Templado.',
        },
        {
          label: '✨ Pedirle que afile tu hoja (+1 DC en tu primer combate)',
          buff: { id: 'city_filo_maestro', label: '⚔️ Filo Afilado (+1 DC 1er combate)', type: 'buff', duration: 99, attackMod: 1 },
          outcome: 'Tu arma brilla con un filo impecable para la próxima misión.',
        },
      ],
    });
  }
  if (quirkId === 'supersticioso' || quirkId === 'temerario') {
    personalPool.push({
      id: 'pe_quirk_runa_puerta',
      tag: quirkId === 'supersticioso' ? '🔮 Tu Rasgo: Supersticioso' : '🚪 Tu Rasgo: Rompe-Puertas',
      title: 'El Reloj Antiguo de la Torre',
      story: 'Un mecanismo rúnico en la entrada del mercado se atascó y bloquea el paso de una carreta llena de suministros.',
      choices: [
        {
          label: '⚙️ Desatascarlo a tu manera (+20 MO y +1 Hierba Lunar)',
          goldDelta: 20,
          materialId: 'hierba_lunar',
          materialQty: 1,
          outcome: 'Logras abrir el paso y el cochero te recompensa con 20 MO y 1 Hierba Lunar.',
        },
        {
          label: '🙏 Pedir una bendición rápida (+1 PM y +15 XP)',
          xpDelta: 15,
          healPM: 2,
          outcome: 'Un acólito cercano bendice tu camino: recuperas mente y ganas +15 XP.',
        },
      ],
    });
  }

  // --- 2. EVENTOS POR PROFESIÓN ---
  if (profId === 'herrero' || profId === 'minero') {
    personalPool.push({
      id: 'pe_prof_forja',
      tag: '⚒️ Tu Profesión en Acción',
      title: 'Encargo Urgente de la Guardia',
      story: 'El sargento necesita reparar bisagras y hebillas de escudo antes del cambio de guardia.',
      choices: [
        {
          label: '⚒️ Hacer el trabajo rápido (+30 MO y +1 Acero Templado)',
          goldDelta: 30,
          materialId: 'chatarra_acero',
          materialQty: 1,
          outcome: 'Trabajo impecable: te pagan 30 MO y te quedas con 1 Acero Templado sobrante.',
        },
        {
          label: '🏅 Hacerlo gratis por la ciudad (+1 Reputación)',
          repDelta: 1,
          outcome: 'La guardia recuerda tu gesto generoso (+1 Reputación).',
        },
      ],
    });
  } else if (profId === 'alquimista' || profId === 'escriba') {
    personalPool.push({
      id: 'pe_prof_arcano',
      tag: '🧪 Tu Profesión en Acción',
      title: 'Consulta en la Torre del Sabio',
      story: 'Un erudito te pide ayuda para estabilizar una tinta rúnica y clasificar hierbas recién traídas de Elethorn.',
      choices: [
        {
          label: '✨ Estabilizar la fórmula (+1 Polvo Rúnico y +1 Hierba Lunar)',
          materialId: 'polvo_runico',
          materialQty: 1,
          goldDelta: 15,
          outcome: 'Tu precisión evita un desastre: recibes 15 MO y 1 Polvo Rúnico.',
        },
        {
          label: '📜 Copiar notas secretas (+30 XP)',
          xpDelta: 30,
          outcome: 'Aprendes secretos de antiguos conjuros (+30 XP).',
        },
      ],
    });
  } else if (profId === 'sacerdote' || profId === 'cazador' || profId === 'explorador' || profId === 'mercader') {
    personalPool.push({
      id: 'pe_prof_gremio',
      tag: '🧭 Tu Profesión en Acción',
      title: 'Rumor Valioso en el Gremio',
      story: 'Un mensajero agotado llega desde las fronteras con noticias sobre las hordas de Zargon y busca a alguien con tu oficio.',
      choices: [
        {
          label: '🗺️ Ayudarlo y cobrar la tarifa (+25 MO y +1 Ración)',
          goldDelta: 25,
          materialId: 'racion_mazmorra',
          materialQty: 1,
          outcome: 'Te entrega 25 MO y provisiones frescas para tu próxima incursión.',
        },
        {
          label: '🎯 Estudiar sus mapas tácticos (+25 XP y +1 Fama)',
          xpDelta: 25,
          fameDelta: 1,
          outcome: 'Compartes inteligencia clave con el Bastión (+25 XP y +1 Fama).',
        },
      ],
    });
  }

  // --- 3. EVENTOS POR CLASE / RAZA ---
  if (['mago', 'brujo', 'nigromante', 'mago_batalla', 'exorcista'].includes(clsId)) {
    personalPool.push({
      id: 'pe_cls_arcano',
      tag: '🔮 Resonancia de tu Clase Mágica',
      title: 'El Cristal Vibrante de la Fuente',
      story: 'Al pasar junto a la fuente central, tu sensibilidad arcana detecta un eco mágico latente bajo el agua.',
      choices: [
        {
          label: '✨ Absorber la chispa (+1 Polvo Rúnico y PM al máximo)',
          materialId: 'polvo_runico',
          materialQty: 1,
          healPM: 6,
          outcome: 'La energía arcana fluye por tus venas: recuperas PM y recoges 1 Polvo Rúnico.',
        },
        {
          label: '📖 Compartir el hallazgo con el Escriba (+25 MO y +20 XP)',
          goldDelta: 25,
          xpDelta: 20,
          outcome: 'El Escriba documenta la anomalía y te recompensa con 25 MO y +20 XP.',
        },
      ],
    });
  } else if (['picaro', 'explorador', 'tirador_asedio'].includes(clsId) || ['elfo_oscuro', 'mediano', 'feliniano'].includes(raceId)) {
    personalPool.push({
      id: 'pe_cls_sombras',
      tag: '🗡️ Oportunidad en los Callejones',
      title: 'El Susurro del Mercado Nocturno',
      story: 'Un contacto encapuchado te reconoce y te ofrece información o suministros discretos.',
      choices: [
        {
          label: '🧪 Comprar toxina barata (-15 MO → +1 Glándula de Veneno)',
          goldDelta: -15,
          materialId: 'glandula_veneno',
          materialQty: 1,
          outcome: 'Consigues una Glándula de Veneno de primera calidad a precio de calle.',
        },
        {
          label: '🎲 Apostar a los dados cargados (+25 MO)',
          goldDelta: 25,
          outcome: 'Notas su truco antes que él y le ganas 25 MO limpiamente.',
        },
      ],
    });
  } else {
    personalPool.push({
      id: 'pe_cls_vanguardia',
      tag: '🛡️ Orgullo de Guerrero',
      title: 'Aclamación en la Plaza de Armas',
      story: 'Un grupo de jóvenes reclutas te pide consejos para enfrentarse a Orcos y No Muertos.',
      choices: [
        {
          label: '⚔️ Darles una clase rápida (+25 XP y +1 Fama)',
          xpDelta: 25,
          fameDelta: 1,
          outcome: 'Los reclutas te ovacionan; tu nombre corre por toda la ciudad (+25 XP, +1 Fama).',
        },
        {
          label: '🛡️ Aceptar su tributo de gratitud (+20 MO)',
          goldDelta: 20,
          outcome: 'Reúnen 20 MO para agradecer tu tiempo y consejos.',
        },
      ],
    });
  }

  // --- 4. EVENTOS DE MODO SUPERVIVENCIA (SI ESTÁ ACTIVO) ---
  if (isSurv) {
    personalPool.push({
      id: 'pe_surv_carterista',
      tag: '🔥 Evento de Supervivencia',
      title: '¡Carterista entre la Multitud!',
      story: `Un ladrón ágil roza tu cinturón al cruzar el mercado abarrotado${gold > 80 ? ' atraído por el sonido de tus monedas' : ''}.`,
      choices: [
        {
          label: '🏃 Perseguirlo y encararlo (-1 PC de esfuerzo, recuperas todo +15 MO)',
          goldDelta: 15,
          pcDelta: -1,
          outcome: 'Tras un choque en el callejón lo atrapas, recuperas tu bolsa y le quitas 15 MO de su botín.',
        },
        {
          label: '💰 Dejarlo escapar y proteger tu salud (-15 MO)',
          goldDelta: -15,
          outcome: 'Evitas una emboscada en el callejón, pero perdiste 15 MO en el roce.',
        },
      ],
    });
  }

  // --- 5. EVENTOS GENERALES DIVERTIDOS ---
  const generalPool = [
    {
      id: 'pe_gen_perro',
      tag: '🐕 Encuentro Callejero',
      title: 'El Perro Callejero con un Pañuelo',
      story: 'Un perro simpático tira de tu capa y te guía hasta un callejón donde brilla una bolsa caída detrás de unos barriles.',
      choices: [
        {
          label: '🍖 Darle un bocado y revisar la bolsa (+25 MO)',
          goldDelta: 25,
          outcome: 'El perro mueve la cola feliz mientras recoges 25 MO perdidas.',
        },
        {
          label: '🔎 Buscar al dueño en la plaza (+1 Fama y +15 XP)',
          fameDelta: 1,
          xpDelta: 15,
          outcome: 'Devuelves la bolsa a una panadera agradecida; tu fama crece en el Bastión.',
        },
      ],
    },
    {
      id: 'pe_gen_bardo',
      tag: '🎵 Ambiente de El Bastión',
      title: 'Un Bardo Canta tu Nombre',
      story: 'En la esquina de la taberna un juglar improvisa una canción exagerada sobre tu última pelea.',
      choices: [
        {
          label: '🪙 Tirarle unas monedas (-10 MO → +1 Fama y PM al máximo)',
          goldDelta: -10,
          fameDelta: 1,
          healPM: 6,
          outcome: 'La canción sube tu moral al cielo: recuperas PM y ganas +1 Fama.',
        },
        {
          label: '😄 Reír y corregir los detalles (+20 XP)',
          xpDelta: 20,
          outcome: 'Todos ríen con tus anécdotas reales y ganas +20 XP.',
        },
      ],
    },
    {
      id: 'pe_gen_carro',
      tag: '⚗️ Caos en el Mercado',
      title: 'Carro de Suministros Volcado',
      story: 'Una rueda se rompió en plena avenida y frascos, hierbas y piezas rodaron por los adoquines.',
      choices: [
        {
          label: '🤝 Ayudar a recoger todo (+1 Hierba Lunar y +15 MO)',
          goldDelta: 15,
          materialId: 'hierba_lunar',
          materialQty: 1,
          outcome: 'El comerciante te agradece con 15 MO y 1 Hierba Lunar.',
        },
        {
          label: '⚙️ Reparar la rueda rota (+1 Acero Templado)',
          materialId: 'chatarra_acero',
          materialQty: 1,
          outcome: 'Usas tu ingenio para fijar el eje y te regalan 1 Acero Templado.',
        },
      ],
    },
  ];

  // 70% probabilidad de evento temático de SU héroe (Quirk/Profesión/Clase/Supervivencia), 30% evento divertido general
  const usePersonal = personalPool.length > 0 && Math.random() < 0.72;
  const chosenPool = usePersonal ? personalPool : generalPool;
  const rawEv = chosenPool[Math.floor(Math.random() * chosenPool.length)];
  // Limpiar cualquier spoiler de recompensas/costes en los botones: el jugador elige por pura narrativa y descubre el resultado después
  return {
    ...rawEv,
    choices: (rawEv.choices || []).map((ch) => ({
      ...ch,
      label: stripChoiceSpoilers(ch.label),
    })),
  };
}
