// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20 v6)
// TABLA DE CRISIS DEL CAOS (10 Eventos de Tensión para el Reloj del Caos 0–10)
// Se dispara al llegar a 5/10 (Alerta Media) o 10/10 (Crisis Total de Zargon)
// ============================================================================

export const CHAOS_CRISIS_TABLE = [
  {
    id: 'chaos_1',
    roll: 1,
    severity: 'media',
    icon: '👣',
    title: 'Patrulla por la Retaguardia',
    badge: 'Emboscada',
    narrative:
      '¡Botas pesadas retumban desde el pasillo que ya habían despejado! Una patrulla enemiga siguió sus antorchas y les corta la retirada.',
    dmRule:
      'Coloca 2 Monstruos Errantes de la misión (o 1 Orco + 1 Goblin) en la entrada del pasillo más cercano detrás del grupo. Actúan en el próximo turno de Zargon.',
    mechanicalTag: '+2 Enemigos atrás',
  },
  {
    id: 'chaos_2',
    roll: 2,
    severity: 'media',
    icon: '💰',
    title: 'Saqueadores de Zargon',
    badge: 'Contrarreloj',
    narrative:
      'Escuchan risas y cofres arrastrándose en una sala cercana: ¡los monstruos intentan escapar con el botín de la mazmorra!',
    dmRule:
      'Un Goblin o Cultista aparece en la sala sin explorar más cercana cargando 40 MO. Si los héroes no lo alcanzan en 3 rondas, huye con el oro.',
    mechanicalTag: 'Botín en fuga (3 rondas)',
  },
  {
    id: 'chaos_3',
    roll: 3,
    severity: 'media',
    icon: '🚪',
    title: 'Puertas Atrancadas',
    badge: 'Trampa Táctica',
    narrative:
      'Un chirrido metálico recorre el corredor: los enemigos han trabado las puertas con cuñas de hierro para encerrar al grupo.',
    dmRule:
      'La próxima puerta cerrada que intenten abrir estará atrancada: requiere superar Fuerza (FUE CD 12) o gastar 2 acciones para derribarla (el ruido alerta a la sala).',
    mechanicalTag: 'Puerta atrancada (FUE CD 12)',
  },
  {
    id: 'chaos_4',
    roll: 4,
    severity: 'alta',
    icon: '⚡',
    title: 'Hechizo del Terror Súbito',
    badge: 'Magia de Zargon',
    narrative:
      'La risa de Zargon retumba en las piedras y una nube helada envuelve al grupo sin previo aviso.',
    dmRule:
      'Zargon lanza inmediatamente 1 Hechizo del Terror gratis (Miedo, Rayo o Tempestad) sobre el héroe más adelantado. El objetivo tira Mente (MEN CD 12) para resistir.',
    mechanicalTag: 'Hechizo del Terror gratis',
  },
  {
    id: 'chaos_5',
    roll: 5,
    severity: 'alta',
    icon: '📯',
    title: 'Cuerno de Refuerzos',
    badge: 'Alarma',
    narrative:
      'Un cuerno grave resuena por toda la fortaleza. Las salas vecinas se ponen en guardia y los monstruos se agrupan para resistir.',
    dmRule:
      'Todos los monstruos en la siguiente sala que abran empiezan en estado ALERTA (+1 DC Defensa en el primer turno) y reciben +1 Monstruo Errante extra.',
    mechanicalTag: 'Próxima sala en Alerta +1',
  },
  {
    id: 'chaos_6',
    roll: 6,
    severity: 'media',
    icon: '🪨',
    title: 'Derrumbe Parcial del Techo',
    badge: 'Peligro de Terreno',
    narrative:
      'El polvo cae en cascada y una viga de piedra cede con un estruendo ensordecedor sobre el pasillo.',
    dmRule:
      'El héroe con menos Agilidad (o el último de la fila) tira Agilidad (AGI CD 12): si falla sufre 2 DC de daño y la casilla queda bloqueada con escombros.',
    mechanicalTag: 'AGI CD 12 o 2 DC + Bloqueo',
  },
  {
    id: 'chaos_7',
    roll: 7,
    severity: 'media',
    icon: '🕯️',
    title: 'Apagón de Antorchas',
    badge: 'Oscuridad',
    narrative:
      'Una corriente helada y antinatural apaga de golpe las antorchas de los muros. La mazmorra se sumerge en penumbra opresiva.',
    dmRule:
      'Durante 2 rondas, la Línea de Visión se reduce a 4 casillas y todos los ataques a distancia sufren -1 DC (salvo razas con Visión en la Oscuridad o quien gaste 1 acción en reencender fuego).',
    mechanicalTag: 'Penumbra 2 rondas (LdV 4)',
  },
  {
    id: 'chaos_8',
    roll: 8,
    severity: 'alta',
    icon: '🧙‍♂️',
    title: 'Lugarteniente del Caos',
    badge: 'Élite Inesperado',
    narrative:
      'Una figura envuelta en humo oscuro atraviesa las sombras murmurando conjuros de Zargon: un oficial enemigo toma el mando.',
    dmRule:
      'El monstruo más fuerte actualmente en el tablero (o en la próxima sala) se convierte en ÉLITE (+1 PC, +1 DC Ataque y conoce 1 Hechizo del Terror).',
    mechanicalTag: '1 Enemigo asciende a Élite',
  },
  {
    id: 'chaos_9',
    roll: 9,
    severity: 'critica',
    icon: '🔥',
    title: 'Furia de la Horda',
    badge: 'Crisis Total',
    narrative:
      '¡Las sombras se agitan por todos los pasillos! Los sirvientes de Zargon entran en frenesí dispuestos a no dejar salir a nadie con vida.',
    dmRule:
      'Durante las próximas 2 rondas, todos los monstruos ganan +1 DC de Ataque y +2 casillas de Movimiento (entran en estado Venganza). Si no hay enemigos en tablero, aparecen 2 Monstruos Errantes.',
    mechanicalTag: 'Enemigos +1 DC Atq / +2 Mov',
  },
  {
    id: 'chaos_10',
    roll: 10,
    severity: 'critica',
    icon: '👑',
    title: 'Despertar Oscuro del Jefe',
    badge: 'Segunda Forma',
    narrative:
      'Un pulso carmesí recorre la mazmorra entera: el poder de Zargon fortalece directamente al líder de esta misión.',
    dmRule:
      'El Jefe de la misión gana una Segunda Fase: cuando caiga por primera vez a 1–2 PC, recupera +2 PC al instante, libera una onda de choque (1 PC a adyacentes) y gana +1 DC en su próximo ataque. (Si el Jefe ya murió, aparece un Espectro Vengativo).',
    mechanicalTag: 'Jefe gana Segunda Fase (+2 PC)',
  },
];

export function rollChaosCrisis(chaosLevel = 5) {
  // Si el Caos es bajo/medio (<=6), prioriza eventos 1–7; si es alto (7–10), puede salir cualquiera con peso a los más épicos
  const pool =
    chaosLevel >= 8
      ? CHAOS_CRISIS_TABLE.slice(3)
      : chaosLevel >= 5
      ? CHAOS_CRISIS_TABLE.slice(0, 8)
      : CHAOS_CRISIS_TABLE.slice(0, 6);
  const picked = pool[Math.floor(Math.random() * pool.length)] || CHAOS_CRISIS_TABLE[0];
  return {
    ...picked,
    triggeredAt: chaosLevel,
  };
}
