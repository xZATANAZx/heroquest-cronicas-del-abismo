// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20 v6.3)
// VIENTOS DE LA MAGIA, TABLA DE VIENTOS DEL CAOS Y 20 PERGAMINOS DE HECHIZO
// Inspirado en Fetenquest 4.1
// ============================================================================

export const WINDS_OF_CHAOS_TABLE = [
  {
    roll: 0,
    title: 'Brecha en la Disformidad',
    effect: 'Tu cuerpo cruza un instante el espacio disforme: tus PC bajan a 1 de golpe y sufres una cicatriz arcana.',
    pcSet: 1,
  },
  {
    roll: 1,
    title: 'Explosión Disforme',
    effect: 'La magia estalla en tu interior: pierdes 3 PC y toda miniatura adyacente (ortogonal o diagonal) recibe 3 DC.',
    pcDelta: -3,
  },
  {
    roll: 2,
    title: 'Llamas Verdes del Caos',
    effect: 'Fuego disforme brota de tus manos: pierdes 2 PC y toda miniatura adyacente recibe 2 DC defendibles.',
    pcDelta: -2,
  },
  {
    roll: 3,
    title: 'Visiones Abominables',
    effect: 'Imágenes de demonios nublan tus sentidos: pierdes 1 PC y 1 PM.',
    pcDelta: -1,
    pmDelta: -1,
  },
  {
    roll: 4,
    title: 'Marchitamiento Súbito',
    effect: 'Tu brazo envejece de golpe: pierdes -1 DC Ataque y -1 DC Defensa hasta recibir un hechizo de curación.',
    debuff: { id: 'chaos_marchito', label: '💀 Marchito (-1 DC Atq/Def)', type: 'debuff', duration: 99, attackMod: -1, defendMod: -1 },
  },
  {
    roll: 5,
    title: 'Enjambre Disforme',
    effect: 'Insectos espectrales brotan de tu túnica: pierdes 1 PC.',
    pcDelta: -1,
  },
  {
    roll: 6,
    title: 'Susurros Inmundos',
    effect: 'Voces oscuras resuenan en tu mente: pierdes 1 PM.',
    pmDelta: -1,
  },
  {
    roll: 7,
    title: 'Marea Cambiante',
    effect: 'Tira 1 DC en mesa: Calavera = -1 PC · Escudo Blanco = +1 PC · Escudo Negro = +1 PM.',
  },
  {
    roll: 8,
    title: 'Recarga Caótica',
    effect: 'La energía fluye a tu favor: recuperas +1 PM al instante.',
    pmDelta: 1,
  },
  {
    roll: 9,
    title: 'Arma Chisporroteante',
    effect: 'Tu arma arde con energía disforme (+1 DC Ataque hasta que recibas daño) y recuperas +1 PC.',
    pcDelta: 1,
    buff: { id: 'chaos_arma', label: '⚡ Arma Disforme (+1 DC Atq)', type: 'buff', duration: 3, attackMod: 1 },
  },
  {
    roll: 10,
    title: 'Mutación Bestial Temporal',
    effect: 'Te transformas temporalmente: +2 DC Ataque y +2 PC (solo puedes mover o atacar; vuelve a normal tras perder 2 PC).',
    pcDelta: 2,
    buff: { id: 'chaos_mutacion', label: '👹 Mutación (+2 DC Atq)', type: 'buff', duration: 3, attackMod: 2 },
  },
  {
    roll: 11,
    title: 'Chispa del Caos Gratis',
    effect: 'Robas un Hechizo del Terror al azar que puedes lanzar gratis 1 vez en esta misión.',
  },
  {
    roll: 12,
    title: 'Tentáculos del Abismo',
    effect: 'El suelo se agrieta y tentáculos golpean a TODAS las demás miniaturas de tu sala/pasillo con 4 DC.',
  },
  {
    roll: 13,
    title: 'Portal Menor de Demonios',
    effect: 'Abres una brecha: realizas 5 ataques de 2 DC repartidos entre miniaturas en tu Línea de Visión.',
  },
  {
    roll: 14,
    title: 'Avatar de la Sangre',
    effect: 'Desatas un ataque masivo de 7 DC en un área de 4×4 casillas en Línea de Visión.',
  },
  {
    roll: 15,
    title: 'Canalizador Supremo',
    effect: 'Durante esta misión puedes lanzar 1 hechizo por turno sin gastar usos ni PM.',
  },
  {
    roll: 16,
    title: 'Vórtice Disforme',
    effect: 'Un portal succiona la sala: cada miniatura (incluido tú) tira 1 DC; con Calavera sufre 3 PC indefendibles.',
  },
];

export function rollWindsOfChaos(penalty = 0) {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const total = Math.max(0, Math.min(16, d1 + d2 + penalty));
  const entry = WINDS_OF_CHAOS_TABLE.find((e) => e.roll === total) || WINDS_OF_CHAOS_TABLE[0];
  return { d1, d2, total, entry };
}

export function rollWindsOfMagic(isShock = false) {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = isShock ? 0 : Math.floor(Math.random() * 6) + 1;
  const total = d1 + d2;

  if (total <= 2) {
    const chaos = rollWindsOfChaos(-2);
    return {
      outcome: 'pifia',
      total,
      d1,
      d2,
      castSuccess: false,
      pmCost: 1,
      consumeUse: true,
      chaos,
      title: `💥 Pifia en Vientos de la Magia (${total})`,
      text: `El hechizo falla y se desata un Viento del Caos (${chaos.total}): ${chaos.entry.title} — ${chaos.entry.effect}`,
    };
  }
  if (total <= 4) {
    const chaos = rollWindsOfChaos(-2);
    return {
      outcome: 'inestable',
      total,
      d1,
      d2,
      castSuccess: true,
      pmCost: 1,
      consumeUse: true,
      chaos,
      title: `⚠️ Magia Inestable (${total})`,
      text: `Logras lanzar el hechizo, pero los Vientos del Caos responden (${chaos.total}): ${chaos.entry.title} — ${chaos.entry.effect}`,
    };
  }
  if (total <= 9) {
    return {
      outcome: 'normal',
      total,
      d1,
      d2,
      castSuccess: true,
      pmCost: 1,
      consumeUse: true,
      chaos: null,
      title: `✨ Vientos Estables (${total})`,
      text: 'El hechizo se repite correctamente gastando 1 PM.',
    };
  }
  if (total <= 11) {
    return {
      outcome: 'favorable',
      total,
      d1,
      d2,
      castSuccess: true,
      pmCost: 0,
      consumeUse: true,
      chaos: null,
      title: `🌟 Vientos Favorables (${total})`,
      text: '¡Gran canalización! Repites el hechizo y recuperas al instante el 1 PM gastado.',
    };
  }
  return {
    outcome: 'critico',
    total,
    d1,
    d2,
    castSuccess: true,
    pmCost: 0,
    consumeUse: false,
    chaos: null,
    title: `👑 Crítico de los Vientos (${total})`,
    text: '¡Canalización perfecta! Lanzas el hechizo SIN gastar PM ni consumir la repetición.',
  };
}

// ============================================================================
// LOS 20 PERGAMINOS DE HECHIZO (Fetenquest 4.1 — Incluye 10 Exclusivos)
// ============================================================================
export const SPELL_SCROLLS_20 = [
  { id: 'scr_1', name: 'Pergamino de Valentía', school: 'Fuego', dice: '+2 DC Ataque', rarity: 'poco_comun', special: '1 uso: tú o un aliado visible gana +2 DC de ataque cuerpo a cuerpo mientras haya monstruos visibles.' },
  { id: 'scr_2', name: 'Pergamino de Cura Corporal', school: 'Tierra', dice: '+4 PC', rarity: 'poco_comun', special: '1 uso: restaura hasta 4 PC a un héroe visible y cura veneno o parálisis.' },
  { id: 'scr_3', name: 'Pergamino de Fuego de la Ira', school: 'Fuego', dice: '2 PC Fuego', rarity: 'poco_comun', special: '1 uso: inflige 2 puntos de daño de fuego a cualquier monstruo en la mazmorra (quema regeneración).' },
  { id: 'scr_4', name: 'Pergamino de Tempestad', school: 'Aire', dice: 'Pierde Turno', rarity: 'poco_comun', special: '1 uso: un enemigo en LdV pierde su próximo turno completo (salvo sacar 6 con 1d6 por PM).' },
  { id: 'scr_5', name: 'Pergamino de Sueño', school: 'Agua', dice: 'Dormir', rarity: 'poco_comun', special: '1 uso: un enemigo vivo queda dormido hasta recibir daño o sacar 6 con 1d6 por PM.' },
  { id: 'scr_6', name: 'Pergamino de Piel de Piedra', school: 'Tierra', dice: '+1 DC Defensa', rarity: 'comun', special: '1 uso: otorga +1 DC de Defensa hasta sufrir 1 herida.' },
  { id: 'scr_7', name: 'Pergamino de Bola de Fuego', school: 'Fuego', dice: '2 DC Fuego', rarity: 'poco_comun', special: '1 uso: 2 DC de daño de fuego en LdV (quema regeneración de Trolls y Momias).' },
  { id: 'scr_8', name: 'Pergamino de Genio', school: 'Aire', dice: '5 DC o Abrir', rarity: 'raro', special: '1 uso: abre cualquier puerta del tablero a distancia O ataca a un enemigo en LdV con 5 DC mágicos.' },
  { id: 'scr_9', name: 'Pergamino de Pasar a Través de la Roca', school: 'Tierra', dice: 'Cruzar Muros', rarity: 'poco_comun', special: '1 uso: permite atravesar muros durante el próximo movimiento.' },
  { id: 'scr_10', name: 'Pergamino de Puente de Hielo', school: 'Exclusivo', dice: 'Cruzar Fosos', rarity: 'poco_comun', special: 'Exclusivo de pergamino (1 uso): crea un puente de hielo sobre fosos o abismos durante 2 rondas para que cruce todo el grupo sin peligro.' },
  { id: 'scr_11', name: 'Pergamino de Calidez', school: 'Exclusivo', dice: 'Cura Frío +2 PC', rarity: 'comun', special: 'Exclusivo de pergamino (1 uso): elimina Congelado/Inmovilizado y cura +2 PC a todos los héroes adyacentes.' },
  { id: 'scr_12', name: 'Pergamino de Recuperación Psíquica', school: 'Exclusivo', dice: '+3 PM / Sin Shock', rarity: 'poco_comun', special: 'Exclusivo de pergamino (1 uso): restaura hasta 3 PM a un héroe visible y lo saca al instante del Estado de Shock.' },
  { id: 'scr_13', name: 'Pergamino de Patinar', school: 'Exclusivo', dice: '+4 Mov / Sin AoO', rarity: 'comun', special: 'Exclusivo de pergamino (1 uso): tu movimiento suma +4 casillas este turno e ignoras Áreas de Influencia enemigas.' },
  { id: 'scr_14', name: 'Pergamino de Escalofrío', school: 'Exclusivo', dice: '2 DC + Congela', rarity: 'poco_comun', special: 'Exclusivo de pergamino (1 uso): 2 DC mágicos a distancia y deja Congelado (mitad de movimiento) al objetivo 2 turnos.' },
  { id: 'scr_15', name: 'Pergamino de Tormenta de Hielo', school: 'Exclusivo', dice: '2 DC en Sala', rarity: 'raro', special: 'Exclusivo de pergamino (1 uso): todos los enemigos en tu sala o sección de pasillo sufren 2 DC mágicos y pierden 2 casillas de movimiento.' },
  { id: 'scr_16', name: 'Pergamino de Tesoro sin Maldición', school: 'Exclusivo', dice: 'Anula Trampa', rarity: 'poco_comun', special: 'Exclusivo de pergamino (1 uso): úsalo al abrir un cofre o buscar tesoro para anular cualquier trampa, Mímico o carta negativa automáticamente.' },
  { id: 'scr_17', name: 'Pergamino de Rayo Mortífero', school: 'Exclusivo', dice: '3 DC Línea', rarity: 'raro', special: 'Exclusivo de pergamino (1 uso): dispara un rayo en línea recta que inflige 3 DC mágicos a todas las criaturas en su trayectoria.' },
  { id: 'scr_18', name: 'Pergamino de Alzar No Muerto', school: 'Exclusivo', dice: 'Esqueleto Aliado', rarity: 'raro', special: 'Exclusivo de pergamino (1 uso): levanta un Esqueleto Aliado (Mov 6, At 2, Def 2, 2 PC) que combate a tus órdenes hasta morir o terminar la misión.' },
  { id: 'scr_19', name: 'Pergamino de Miedo', school: 'Exclusivo', dice: 'Miedo (1 DC)', rarity: 'poco_comun', special: 'Exclusivo de pergamino (1 uso): un enemigo vivo solo ataca con 1 DC hasta que saque un 6 tirando 1d6 por cada PM.' },
  { id: 'scr_20', name: 'Pergamino de Tormenta de Fuego', school: 'Exclusivo', dice: '3 DC a Toda la Sala', rarity: 'epico', special: 'Exclusivo de pergamino (1 uso): envuelve toda la habitación en llamas (3 DC de fuego a todos los enemigos de la sala; quema regeneración).' },
];

export function rollRandomSpellScroll() {
  const s = SPELL_SCROLLS_20[Math.floor(Math.random() * SPELL_SCROLLS_20.length)];
  return {
    name: s.name,
    type: 'Pergamino',
    rarity: s.rarity,
    dice: s.dice,
    special: s.special,
    traits: s.special,
    upgrade: s.special,
    restriction: 'Todas las clases',
  };
}
