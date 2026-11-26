// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// NPCs con Mini-Misiones Secundarias + Puzzles Interactivos para el Celular
// ============================================================================

export const DUNGEON_NPCS = [
  {
    id: 'npc_bram',
    name: 'Bram el Enano Herrero',
    icon: '⚒️',
    role: 'Prisionero / Artesano',
    dialogue: '«¡Por las barbas de Grungni! Esos orcos me quitaron mi martillo rúnico y lo escondieron en el cofre de la sala siguiente. Si me ayudan a recuperarlo, les afilo las armas ahora mismo.»',
    miniQuest: 'Mini-Misión: Recuperar el Martillo de Bram (o abrir 1 cofre cercano) y entregárselo.',
    rewardText: 'Recompensa: +1 DC de ataque para el próximo combate de un héroe + 40 MO.',
    rewardGold: 40,
  },
  {
    id: 'npc_lyra',
    name: 'Hermana Lyra (Sanadora Errante)',
    icon: '🕯️',
    role: 'Clériga / Alquimista',
    dialogue: '«Me quedé atrapada aquí buscando raíces lunares para curar la plaga de Elethorn. Si me escoltan hasta la puerta o me dan 1 Hierba Lunar, bendeciré sus heridas.»',
    miniQuest: 'Mini-Misión: Proteger a Lyra 1 combate o entregarle 1 Hierba Lunar / superar Medicina CD 12.',
    rewardText: 'Recompensa: Cura +3 PC y +2 PM a un héroe + 1 Poción de Curación Menor.',
    rewardLoot: {
      name: 'Poción de Curación Menor',
      type: 'Poción',
      rarity: 'comun',
      dice: '+2 PC',
      upgrade: 'Acción gratuita: restaura 2 PC.',
      special: 'Restaura 2 PC.',
      restriction: 'Todas las clases',
    },
  },
  {
    id: 'npc_pip',
    name: 'Pip el Goblin Traidor',
    icon: '👺',
    role: 'Informante Cobarde',
    dialogue: '«¡No me peguen, no me peguen! El jefe me golpea todo el día. Si me dan 20 monedas de oro (o superan Persuasión/Intimidación CD 11), les digo dónde está la puerta secreta y todas las trampas de adelante.»',
    miniQuest: 'Mini-Misión: Pagar 20 MO o superar Persuasión / Intimidación CD 11.',
    rewardText: 'Recompensa: El DM revela gratis 1 puerta secreta o trampa cercana y el grupo gana +1 🏅 Reputación.',
    rewardGold: 0,
  },
  {
    id: 'npc_ghost_knight',
    name: 'Espíritu de Sir Aldric',
    icon: '👻',
    role: 'Caballero Caído de Elethorn',
    dialogue: '«Mi guardia no termina hasta que caiga el monstruo que profana esta cripta. Juren sobre mi escudo que purificarán esta sala y les prestaré mi fuerza espectral.»',
    miniQuest: 'Mini-Misión: Derrotar al monstruo más fuerte de la sala o rezar con SAB CD 12.',
    rewardText: 'Recompensa: +1 Polvo Rúnico al héroe y +1 Pergamino de Coraje.',
    rewardLoot: {
      name: 'Pergamino de Coraje',
      type: 'Pergamino',
      rarity: 'poco_comun',
      dice: '+2 DC Ataque',
      upgrade: '1 uso: otorga +2 DC de ataque cuerpo a cuerpo.',
      special: 'Hechizo Coraje (1 uso).',
      restriction: 'Todas las clases',
    },
  },
  {
    id: 'npc_varek',
    name: 'Varek el Mercader de las Sombras',
    icon: '🎒',
    role: 'Comerciante Clandestino',
    dialogue: '«¿Aventureros vivos aquí abajo? Qué suerte... tengo mercancía fina rescatada de cofres antiguos. Si me ayudan con un acertijo de mi caja fuerte, les regalo un objeto.»',
    miniQuest: 'Mini-Misión: Mandar un Puzzle al celular de un héroe para abrir la caja de Varek.',
    rewardText: 'Recompensa: +55 MO o 1 Poción de Clarividencia (+2 PM).',
    rewardGold: 55,
  },
];

// Puzzles interactivos variados que el DM envía al celular del jugador
// Mecánicas: 'timing_bar' | 'dial_lock' | 'memory_runes' | 'balance_scales' | 'sequence' | 'riddle'
export const INTERACTIVE_PUZZLES = [
  {
    id: 'puz_timing_trampa',
    type: 'timing_bar',
    title: '✂️ Desactivar Trampa de Cuchillas',
    subtitle: 'Detén el mecanismo justo cuando el pulso brillante cruce la zona verde',
    clue: '«Un mal corte soltará las hojas oxidadas. Tienes 2 intentos antes de que se dispare el resorte.»',
    zoneStart: 38,
    zoneEnd: 62,
    speedMs: 18,
    maxAttempts: 2,
    successText: '¡Corte milimétrico! Desactivas el resorte y recuperas 60 MO + 1 Acero Templado.',
    failText: '¡CLANG! Una cuchilla te roza: pierdes 1 PC y quedas Herido (-1 DC Defensa por 2 turnos).',
    rewardGold: 60,
    rewardInsp: 1,
    failDamagePC: 1,
    failDebuff: { id: 'puz_herido', label: '🩸 Herido por Trampa (-1 DC Def)', type: 'debuff', duration: 2, defendMod: -1 },
  },
  {
    id: 'puz_dial_boveda',
    type: 'dial_lock',
    title: '🔐 Bóveda Numérica de los Enanos',
    subtitle: 'Gira las 3 ruedas hasta formar el código exacto (2 intentos)',
    clue: '«El primer número es el doble del segundo. El tercero es la suma de los dos primeros. Si el segundo es 2... ¿cuál es el código?»',
    solution: [4, 2, 6],
    maxAttempts: 2,
    successText: '¡Clic, clic, clic! La bóveda se abre revelando 75 MO y una Poción de Curación Menor.',
    failText: '¡Gas somnífero! Pierdes 1 PM y quedas Mareado (-1 DC Ataque por 2 turnos).',
    rewardGold: 75,
    rewardInsp: 1,
    rewardLoot: {
      name: 'Poción de Curación Menor',
      type: 'Poción',
      rarity: 'comun',
      dice: '+2 PC',
      upgrade: 'Acción gratuita: restaura 2 PC.',
      special: 'Restaura 2 PC.',
      restriction: 'Todas las clases',
    },
    failDamagePM: 1,
    failDebuff: { id: 'puz_mareado', label: '😵 Mareado por Gas (-1 DC Ataque)', type: 'debuff', duration: 2, attackMod: -1 },
  },
  {
    id: 'puz_memoria_altar',
    type: 'memory_runes',
    title: '🧠 Destello del Altar Arcano',
    subtitle: 'Observa el orden en que brillan las 4 runas y repítelo de memoria',
    clue: '«Mira con atención la secuencia de luz antes de que se apague...»',
    buttons: [
      { id: 'fuego', label: '🔥 Fuego' },
      { id: 'agua', label: '💧 Agua' },
      { id: 'tierra', label: '🪨 Tierra' },
      { id: 'aire', label: '💨 Aire' },
    ],
    solution: ['aire', 'fuego', 'agua', 'tierra'],
    successText: '¡Memoria prodigiosa! El altar te bendice: recuperas +2 PM y ganas +50 MO.',
    failText: 'Descarga arcana: pierdes 1 PM y quedas Desorientado (-2 Mov por 2 turnos).',
    rewardGold: 50,
    rewardInsp: 1,
    rewardHealPM: 2,
    failDamagePM: 1,
    failDebuff: { id: 'puz_desorientado', label: '💫 Desorientado (-2 Mov)', type: 'debuff', duration: 2, speedMod: -2 },
  },
  {
    id: 'puz_balanza_oro',
    type: 'balance_scales',
    title: '⚖️ La Balanza del Juicio',
    subtitle: 'Coloca reliquias en el platillo hasta sumar EXACTAMENTE 11 kg (2 intentos)',
    clue: '«Ni un gramo de más, ni un gramo de menos. Solo el equilibrio exacto abre el sello.»',
    targetWeight: 11,
    weights: [
      { id: 'w2', label: '🗝️ Llave de Bronce', kg: 2 },
      { id: 'w3', label: '🕯️ Cáliz de Plata', kg: 3 },
      { id: 'w4', label: '📜 Orbe de Hierro', kg: 4 },
      { id: 'w5', label: '🛡️ Escudo Enano', kg: 5 },
      { id: 'w6', label: '👑 Corona Antigua', kg: 6 },
    ],
    maxAttempts: 2,
    successText: '¡Equilibrio perfecto! El sello se abre con 80 MO y recibes Bendición de Precisión (+1 DC Ataque por 2 turnos).',
    failText: 'La balanza se desploma y dispara una aguja: pierdes 1 PC y quedas Envenenado (-1 DC Ataque por 2 turnos).',
    rewardGold: 80,
    rewardInsp: 1,
    rewardBuff: { id: 'puz_bendicion', label: '✨ Bendición del Altar (+1 DC Ataque)', type: 'buff', duration: 2, attackMod: 1 },
    failDamagePC: 1,
    failDebuff: { id: 'puz_veneno', label: '☠️ Envenenado (-1 DC Ataque)', type: 'debuff', duration: 2, attackMod: -1 },
  },
  {
    id: 'puz_runas_elementos',
    type: 'sequence',
    title: '✨ Sello de los Tres Elementos',
    subtitle: 'Toca las 3 runas en el orden exacto que indica la inscripción',
    clue: '«Primero brota la vida del manantial, luego arde la forja del guerrero, y al final el viento barre las cenizas.»',
    buttons: [
      { id: 'fuego', label: '🔥 Fuego' },
      { id: 'agua', label: '💧 Agua' },
      { id: 'tierra', label: '🪨 Tierra' },
      { id: 'aire', label: '💨 Aire' },
    ],
    solution: ['agua', 'fuego', 'aire'],
    successText: 'Las runas brillan en oro: ganas +60 MO y curas +2 PC.',
    failText: 'Chispa elemental: pierdes 1 PC y quedas Quemado (-1 DC Defensa por 2 turnos).',
    rewardGold: 60,
    rewardInsp: 1,
    rewardHealPC: 2,
    failDamagePC: 1,
    failDebuff: { id: 'puz_quemado', label: '🔥 Quemado (-1 DC Defensa)', type: 'debuff', duration: 2, defendMod: -1 },
  },
  {
    id: 'puz_acertijo_sombra',
    type: 'riddle',
    title: '🗣️ La Puerta Parlante de Zargon',
    subtitle: 'Responde correctamente el acertijo para abrir el cerrojo sin activar la trampa',
    clue: '«No tengo boca, pero hablo si me llamas. No tengo cuerpo, pero el viento me da vida en cada pasillo de piedra. ¿Qué soy?»',
    options: [
      { id: 'a', label: 'Una sombra' },
      { id: 'b', label: 'El eco' },
      { id: 'c', label: 'El fuego' },
      { id: 'd', label: 'Un espectro' },
    ],
    correctOption: 'b',
    successText: '«Sabia respuesta, mortal...» Ganas +55 MO y +1 Polvo Rúnico.',
    failText: '«¡Incorrecto!» Humo sombrío te envuelve: pierdes 1 PC y quedas Vulnerable (-1 DC Defensa por 2 turnos).',
    rewardGold: 55,
    rewardInsp: 1,
    failDamagePC: 1,
    failDebuff: { id: 'puz_vuln', label: '💔 Vulnerable (-1 DC Defensa)', type: 'debuff', duration: 2, defendMod: -1 },
  },
  {
    id: 'puz_acertijo_antorcha',
    type: 'riddle',
    title: '🔥 Brasero de la Verdad',
    subtitle: 'Responde al guardián de piedra para recibir su bendición',
    clue: '«Si me das de comer, crezco y vivo; pero si me das de beber, muero al instante. ¿Qué soy?»',
    options: [
      { id: 'a', label: 'El fuego' },
      { id: 'b', label: 'El óxido' },
      { id: 'c', label: 'Un troll' },
      { id: 'd', label: 'La oscuridad' },
    ],
    correctOption: 'a',
    successText: 'El brasero arde en luz dorada: recuperas +2 PC y ganas +40 MO.',
    failText: 'Las brasas estallan en chispas oscuras: pierdes 1 PC y quedas Cegado (-1 DC Ataque por 1 turno).',
    rewardGold: 40,
    rewardInsp: 1,
    rewardHealPC: 2,
    failDamagePC: 1,
    failDebuff: { id: 'puz_cegado', label: '🌑 Cegado por Ceniza (-1 DC Ataque)', type: 'debuff', duration: 1, attackMod: -1 },
  },
];

// ============================================================================
// GENERADOR PROCEDURAL INFINITO Y RETADOR DE PUZZLES (Nunca se repite igual)
// ============================================================================
const pickRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);

const HARD_RIDDLES = [
  {
    q: '«Cuanto más quitas de mí, más grande me vuelvo. ¿Qué soy?»',
    opts: ['Un foso / agujero', 'Una sombra', 'El hambre', 'Una maldición'],
    ans: 0,
  },
  {
    q: '«Tengo llaves que no abren puertas, espacio pero no habitaciones, y puedes entrar pero no salir. ¿Qué soy?»',
    opts: ['Un laberinto', 'Un mapa antiguo', 'Una prisión mágica', 'Un acertijo'],
    ans: 0,
  },
  {
    q: '«Camino sin pies, vuelo sin alas, lloro sin ojos y donde paso la luz muere. ¿Qué soy?»',
    opts: ['Una nube de tormenta', 'Un espectro', 'El viento', 'La ceniza'],
    ans: 0,
  },
  {
    q: '«Quien me fabrica no me quiere; quien me compra no me usa; quien me usa nunca me ve. ¿Qué soy?»',
    opts: ['Un ataúd', 'Una trampa', 'Un veneno', 'Un espejo oscuro'],
    ans: 0,
  },
  {
    q: '«Siempre corro pero nunca camino; tengo boca pero nunca hablo; tengo lecho pero nunca duermo. ¿Qué soy?»',
    opts: ['Un río subterráneo', 'Un goblin', 'El reloj de arena', 'Una llama'],
    ans: 0,
  },
  {
    q: '«Rompe mi nombre con solo decirlo en voz alta. ¿Qué soy?»',
    opts: ['El silencio', 'Un juramento', 'El cristal', 'Un hechizo'],
    ans: 0,
  },
  {
    q: '«Devoro hierro, muerdo acero, convierto montañas en polvo y mato reyes sin espada. ¿Qué soy?»',
    opts: ['El tiempo', 'Un dragón', 'El óxido', 'El abismo'],
    ans: 0,
  },
  {
    q: '«Tengo dientes afilados pero nunca muerdo; sirvo a reyes y guerreros por igual. ¿Qué soy?»',
    opts: ['Un peine / sierra', 'Una espada dentada', 'Una llave antigua', 'Una cerradura'],
    ans: 0,
  },
  {
    q: '«No respiro pero necesito aire; no tengo vida pero puedo crecer y morir. ¿Qué soy?»',
    opts: ['El fuego', 'La niebla', 'El veneno', 'Un gólem'],
    ans: 0,
  },
  {
    q: '«Te pertenezco solo a ti, pero tus amigos me usan mucho más que tú. ¿Qué soy?»',
    opts: ['Tu nombre', 'Tu oro', 'Tu escudo', 'Tu antorcha'],
    ans: 0,
  },
];

const FAIL_DEBUFFS = [
  { id: 'puz_herido', label: '🩸 Herido por Trampa (-1 DC Def)', type: 'debuff', duration: 2, defendMod: -1 },
  { id: 'puz_veneno', label: '☠️ Envenenado (-1 DC Ataque)', type: 'debuff', duration: 2, attackMod: -1 },
  { id: 'puz_desor', label: '💫 Desorientado (-2 Mov)', type: 'debuff', duration: 2, speedMod: -2 },
  { id: 'puz_vuln', label: '💔 Vulnerable (-1 DC Defensa)', type: 'debuff', duration: 2, defendMod: -1 },
  { id: 'puz_mareo', label: '😵 Aturdido por Gas (-1 DC At)', type: 'debuff', duration: 2, attackMod: -1 },
];

const REWARD_BUFFS = [
  { id: 'puz_bend_at', label: '✨ Filo Bendecido (+1 DC Ataque)', type: 'buff', duration: 2, attackMod: 1 },
  { id: 'puz_bend_def', label: '🛡️ Aura Protectora (+1 DC Defensa)', type: 'buff', duration: 2, defendMod: 1 },
  { id: 'puz_bend_mov', label: '💨 Paso Ligero (+2 Mov)', type: 'buff', duration: 2, speedMod: 2 },
];

export function generateProceduralPuzzle(partyLevel = 1, forcedType = 'random') {
  const types = ['timing_bar', 'dial_lock', 'memory_runes', 'balance_scales', 'sequence', 'riddle'];
  const type = forcedType === 'random' ? pickRand(types) : forcedType;
  const gold = 45 + partyLevel * 15 + Math.floor(Math.random() * 35);
  const dmgPC = partyLevel >= 5 ? 2 : 1;
  const failDebuff = pickRand(FAIL_DEBUFFS);
  const rewardBuff = Math.random() < 0.45 ? pickRand(REWARD_BUFFS) : null;
  const rewardLoot =
    Math.random() < 0.35
      ? {
          name: Math.random() < 0.5 ? 'Poción de Curación Menor' : 'Poción de Clarividencia',
          type: 'Poción',
          rarity: 'poco_comun',
          dice: Math.random() < 0.5 ? '+2 PC' : '+2 PM',
          upgrade: 'Recompensa de puzzle resuelto.',
          special: 'Consumible inmediato.',
          restriction: 'Todas las clases',
        }
      : null;

  const baseRewardSummary = `+${gold} MO${rewardBuff ? `, ${rewardBuff.label}` : ''}${rewardLoot ? ` y ${rewardLoot.name}` : ''}`;
  const uid = `proc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;

  if (type === 'timing_bar') {
    const width = Math.max(12, 18 - Math.floor(partyLevel / 2)); // Más estrecho y difícil
    const start = 18 + Math.floor(Math.random() * (64 - width));
    const end = start + width;
    const titles = [
      '✂️ Desactivar Péndulo de Cuchillas',
      '⚡ Cortar Resorte de Agujas Envenenadas',
      '🔥 Sellar Válvula de Fuego Alquímico',
      '⚙️ Frenar Engranaje de Derrumbe',
    ];
    return {
      id: uid,
      type: 'timing_bar',
      title: pickRand(titles),
      subtitle: 'Detén el pulso exactamente dentro de la estrecha zona verde',
      clue: '«El mecanismo gira a gran velocidad. Un error activará la trampa al instante.»',
      zoneStart: start,
      zoneEnd: end,
      speedMs: Math.max(12, 16 - Math.floor(partyLevel / 3)),
      stepSize: 3.1,
      maxAttempts: 2,
      successText: `¡Reflejos de acero! Desactivas la trampa y obtienes ${baseRewardSummary}.`,
      failText: `¡TRAMPA ACTIVADA! Recibes -${dmgPC} PC y sufres ${failDebuff.label}.`,
      rewardGold: gold,
      rewardInsp: 1,
      rewardBuff,
      rewardLoot,
      failDamagePC: dmgPC,
      failDebuff,
    };
  }

  if (type === 'dial_lock') {
    // Genera 3 dígitos con acertijo algebraico único cada vez
    const b = 2 + Math.floor(Math.random() * 4); // 2..5
    const diff = 1 + Math.floor(Math.random() * 3); // 1..3
    const a = Math.min(9, b + diff);
    const c = (a + b) % 10;
    const sumAll = a + b + c;
    const pattern = Math.floor(Math.random() * 2);
    const clue =
      pattern === 0
        ? `«El segundo número es ${b}. El primero es ${diff} más que el segundo. Los tres números juntos suman ${sumAll}. ¿Cuál es la clave?»`
        : `«El primer número es ${a}. El segundo es ${diff} menos que el primero. El tercero es el último dígito de sumar los dos primeros (${a}+${b}).»`;
    return {
      id: uid,
      type: 'dial_lock',
      title: pickRand(['🔐 Bóveda Rúnica de Hierro', '🗝️ Cerradura del Archiduque', '🏛️ Cripta de los 3 Sellos']),
      subtitle: 'Resuelve la pista matemática y gira las 3 ruedas (2 intentos)',
      clue,
      solution: [a, b, c],
      maxAttempts: 2,
      successText: `¡Bóveda abierta! Dentro encuentras ${baseRewardSummary}.`,
      failText: `¡Descarga protectora! Pierdes -1 PM y sufres ${failDebuff.label}.`,
      rewardGold: gold,
      rewardInsp: 1,
      rewardBuff,
      rewardLoot,
      failDamagePM: 1,
      failDebuff,
    };
  }

  if (type === 'memory_runes') {
    const runeSet = pickRand([
      [
        { id: 'fuego', label: '🔥 Fuego' },
        { id: 'agua', label: '💧 Agua' },
        { id: 'tierra', label: '🪨 Tierra' },
        { id: 'aire', label: '💨 Aire' },
      ],
      [
        { id: 'sol', label: '☀️ Sol' },
        { id: 'luna', label: '🌙 Luna' },
        { id: 'espada', label: '⚔️ Espada' },
        { id: 'calavera', label: '💀 Cráneo' },
      ],
    ]);
    const len = partyLevel >= 4 ? 6 : 5; // 5 o 6 destellos (mucho más retador!)
    const solution = Array.from({ length: len }, () => pickRand(runeSet).id);
    return {
      id: uid,
      type: 'memory_runes',
      title: pickRand(['🧠 Altar de Memoria Arcana', '🔮 Eco de las Runas Antiguas', '👁️ Sello Hipnótico del Velo']),
      subtitle: `Memoriza la secuencia exacta de ${len} destellos y repítela sin fallar`,
      clue: `«Las runas brillarán ${len} veces rápidamente (pueden repetirse). ¡Concéntrate!»`,
      buttons: runeSet,
      solution,
      flashMs: 460,
      maxAttempts: 1,
      successText: `¡Mente prodigiosa! Recuperas +2 PM y ganas ${baseRewardSummary}.`,
      failText: `¡Choque psíquico! Pierdes -1 PM y sufres ${failDebuff.label}.`,
      rewardGold: gold,
      rewardInsp: 1,
      rewardHealPM: 2,
      rewardBuff,
      rewardLoot,
      failDamagePM: 1,
      failDebuff,
    };
  }

  if (type === 'balance_scales') {
    const poolWeights = shuffleArr([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6);
    const relicNames = shuffleArr([
      '🗝️ Llave Antigua', '🕯️ Cáliz Oscuro', '📜 Orbe de Plomo',
      '🛡️ Escudo Enano', '👑 Corona Rota', '💎 Gema de Sangre',
      '⚱️ Urna de Ceniza', '⚔️ Empuñadura Real',
    ]);
    const weights = poolWeights.map((kg, i) => ({ id: `w-${i}`, label: relicNames[i], kg }));
    // Elige 3 reliquias secretas para el peso objetivo
    const chosen3 = shuffleArr(weights).slice(0, 3);
    const targetWeight = chosen3.reduce((s, w) => s + w.kg, 0);
    return {
      id: uid,
      type: 'balance_scales',
      title: pickRand(['⚖️ La Balanza del Juicio', '🏛️ Pedestal de Contrapeso', '🪙 Altar de la Precisión']),
      subtitle: `Combina reliquias hasta sumar EXACTAMENTE ${targetWeight} kg (2 intentos)`,
      clue: `«Coloca las reliquias exactas en el platillo hasta igualar ${targetWeight} kg sin pasarte.»`,
      targetWeight,
      weights,
      maxAttempts: 2,
      successText: `¡Equilibrio perfecto! El mecanismo cede y obtienes ${baseRewardSummary}.`,
      failText: `¡El contrapeso falla y activa un dardo! Pierdes -${dmgPC} PC y sufres ${failDebuff.label}.`,
      rewardGold: gold,
      rewardInsp: 1,
      rewardBuff,
      rewardLoot,
      failDamagePC: dmgPC,
      failDebuff,
    };
  }

  if (type === 'sequence') {
    const symbols = shuffleArr([
      { id: 's1', label: '🔥 Llama', name: 'la Llama' },
      { id: 's2', label: '💧 Ola', name: 'la Ola' },
      { id: 's3', label: '🪨 Roca', name: 'la Roca' },
      { id: 's4', label: '💨 Brisa', name: 'la Brisa' },
      { id: 's5', label: '🌙 Luna', name: 'la Luna' },
      { id: 's6', label: '☀️ Alba', name: 'el Alba' },
    ]).slice(0, 4);
    const [p1, p2, p3, p4] = shuffleArr(symbols);
    return {
      id: uid,
      type: 'sequence',
      title: '✨ Sello Lógico de 4 Runas',
      subtitle: 'Deduce el orden exacto de las 4 runas leyendo las pistas',
      clue: `«${p4.name.charAt(0).toUpperCase() + p4.name.slice(1)} va al final. ${p2.name.charAt(0).toUpperCase() + p2.name.slice(1)} va justo después de ${p1.name}, pero antes que ${p3.name}.»`,
      buttons: symbols.map(({ id, label }) => ({ id, label })),
      solution: [p1.id, p2.id, p3.id, p4.id],
      maxAttempts: 1,
      successText: `¡Lógica impecable! El sello se rompe revelando ${baseRewardSummary}.`,
      failText: `¡Orden incorrecto! Descarga rúnica: -${dmgPC} PC y sufres ${failDebuff.label}.`,
      rewardGold: gold,
      rewardInsp: 1,
      rewardBuff,
      rewardLoot,
      failDamagePC: dmgPC,
      failDebuff,
    };
  }

  // Fallback: 'riddle' difícil con opciones mezcladas
  const r = pickRand(HARD_RIDDLES);
  const indexedOpts = shuffleArr(r.opts.map((label, idx) => ({ label, isAns: idx === r.ans })));
  const letters = ['a', 'b', 'c', 'd'];
  const options = indexedOpts.map((o, i) => ({ id: letters[i], label: o.label }));
  const correctOption = letters[indexedOpts.findIndex((o) => o.isAns)];

  return {
    id: uid,
    type: 'riddle',
    title: pickRand(['🗣️ La Puerta Parlante', '🗿 Esfinge de Piedra', '🕯️ Susurro del Guardián']),
    subtitle: 'Piensa bien antes de responder (solo 1 oportunidad)',
    clue: r.q,
    options,
    correctOption,
    maxAttempts: 1,
    successText: `«Respuesta digna de un sabio...» Obtienes ${baseRewardSummary}.`,
    failText: `«¡Equivocado!» Una maldición te golpea: -${dmgPC} PC y sufres ${failDebuff.label}.`,
    rewardGold: gold,
    rewardInsp: 1,
    rewardBuff,
    rewardLoot,
    failDamagePC: dmgPC,
    failDebuff,
  };
}
