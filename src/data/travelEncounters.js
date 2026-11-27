// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20 v6)
// EVENTOS DE VIAJE DRAMÁTICOS — Narrativa Cinematográfica, Dilemas y Drama Grupal
// Cero spoilers en botones · Usa los 4 Pilares (FUE, AGI, MEN, SUE)
// ============================================================================

export const TRAVEL_ENCOUNTERS = [
  {
    id: 'trv_taberna_deuda',
    icon: '🍺',
    biome: 'Posada del Cruce',
    tag: 'Drama Grupal · Culpa de un Héroe',
    title: 'La Pelea de Taberna que Se Salió de Control',
    readAloud:
      'Al hacer una parada en la posada del camino, uno de los aventureros (elige al azar o al más impulsivo del grupo) tropieza con el sargento de una caravana imperial y derrama su jarra sobre sus mapas sellados. Las sillas vuelan, el tabernero grita exigiendo compensación y seis guardias desenvainan sus porras bloqueando la salida.',
    choices: [
      {
        id: 'calm_sergeant',
        label: '💬 Intentar calmar al sargento y salvar el honor del grupo (SUE CD 13)',
        skillCheck: 'Suerte (SUE) CD 13',
        success: {
          text: 'Con labia impecable convierten el escándalo en un brindis épico. El sargento ríe, perdona el incidente y les comparte información de un alijo cercano (+20 MO por héroe y +1 Reputación).',
          goldPerHero: 20,
          repDelta: 1,
        },
        fail: {
          text: 'El discurso solo empeora las cosas. Para evitar acabar en el calabozo antes de llegar a la Ciudad, todo el grupo debe pagar la fianza por culpa de su compañero (-20 MO a cada héroe).',
          goldPerHero: -20,
        },
      },
      {
        id: 'escape_window',
        label: '🏃 Volcar la mesa y saltar por la ventana trasera (AGI CD 13)',
        skillCheck: 'Agilidad (AGI) CD 13',
        success: {
          text: '¡Escape de película! Saltan al carro de heno y se pierden en la niebla sin pagar un cobre, llevándose de paso una botella de aceite fino de la cocina.',
          materialId: 'aceite_alquitran',
        },
        fail: {
          text: 'Alguien se tropieza en el marco de la ventana y los guardias les reparten golpes y arrebatan monedas en la huida (-1 PC y -15 MO a cada héroe).',
          pcDelta: -1,
          goldPerHero: -15,
        },
      },
      {
        id: 'pay_damages',
        label: '🪙 Pagar los destrozos al tabernero sin discutir',
        skillCheck: null,
        success: {
          text: 'El grupo traga saliva y paga los destrozos (-15 MO cada uno) mientras miran con furia al culpable. El tabernero, agradecido por la rapidez, les regala raciones calientes.',
          goldPerHero: -15,
          materialId: 'racion_mazmorra',
        },
      },
    ],
  },
  {
    id: 'trv_puente_acertijo',
    icon: '🗿',
    biome: 'Puente de las Efigies',
    tag: 'Puzzle en el Camino',
    title: 'El Guardián de Piedra del Puente Antiguo',
    readAloud:
      'La niebla se abre ante un puente colosal custodiado por una estatua con tres ojos apagados. Cuando el primer héroe pisa el arco, la boca de piedra retumba: "Tres cosas viajan conmigo: una devora sin boca, otra corre sin piernas y la tercera muere si le das de beber. Responded o pagad peaje de sangre." (Respuesta del Puzzle: El Fuego, el Agua/Río y el Fuego otra vez — o resolver con Mente).',
    choices: [
      {
        id: 'solve_riddle',
        label: '🧠 Resolver el acertijo de la estatua (MEN CD 13 o responder en mesa)',
        skillCheck: 'Mente (MEN) CD 13',
        success: {
          text: '¡Los ojos de la efigie arden en dorado! Un nicho oculto se abre entregando polvo arcano antiguo y una bendición mental (+2 PM y +1 Polvo Rúnico para cada héroe).',
          pmDelta: 2,
          materialId: 'polvo_runico',
        },
        fail: {
          text: 'La respuesta retumba equivocada. Una descarga helada recorre el puente (-1 PC y -1 PM a todos) antes de que las rejas cedan.',
          pcDelta: -1,
          pmDelta: -1,
        },
      },
      {
        id: 'smash_seal',
        label: '💪 Forzar el mecanismo lateral del puente a golpes (FUE CD 14)',
        skillCheck: 'Fuerza (FUE) CD 14',
        success: {
          text: '¡Cruje la piedra milenaria! Desprenden un bloque incrustado con acero antiguo y cruzan triunfantes (+15 MO y +1 Acero Templado).',
          goldPerHero: 15,
          materialId: 'chatarra_acero',
        },
        fail: {
          text: 'El mecanismo se traba y lanza esquirlas de roca contra todo el grupo (-2 PC a cada héroe).',
          pcDelta: -2,
        },
      },
    ],
  },
  {
    id: 'trv_caravana_emboscada',
    icon: '🔥',
    biome: 'Desfiladero del Lobo',
    tag: 'Emboscada · Decisión Moral',
    title: 'La Caravana en Llamas bajo la Lluvia',
    readAloud:
      'Humo negro asciende tras una curva del desfiladero. Una carreta mercante arde mientras sombras con capas oscuras saquean las cajas. Una niña grita atrapada bajo un tronco caído, pero un carro lleno de cofres imperiales está a punto de caer por el barranco.',
    choices: [
      {
        id: 'save_girl',
        label: '🛡️ Correr a levantar el tronco y rescatar a los sobrevivientes (FUE CD 12)',
        skillCheck: 'Fuerza (FUE) CD 12',
        success: {
          text: 'Arrancan el tronco en llamas y ponen a salvo a la familia. Aunque los cofres caen al abismo, el capitán de la guardia los recomienda ante el Bastión (+1 Reputación y +25 XP a todos).',
          repDelta: 1,
          xpDelta: 25,
        },
        fail: {
          text: 'Logran sacarla con vida pero las llamas y los escombros queman al grupo (-1 PC a todos), ganando igualmente +1 Reputación por su valor.',
          pcDelta: -1,
          repDelta: 1,
        },
      },
      {
        id: 'grab_chest',
        label: '💰 Lanzarse a sujetar el cofre antes de que caiga al barranco (AGI CD 13)',
        skillCheck: 'Agilidad (AGI) CD 13',
        success: {
          text: '¡Atrapan el cofre en el último segundo! Encuentran 30 MO por héroe y Pólvora Negra, aunque los supervivientes los miran con frialdad (-1 Reputación).',
          goldPerHero: 30,
          materialId: 'polvora_negra',
          repDelta: -1,
        },
        fail: {
          text: 'La cuerda resbala en el lodo y el cofre arrastra a uno de ustedes contra las rocas (-2 PC a todos y el oro se pierde en el barranco).',
          pcDelta: -2,
        },
      },
    ],
  },
  {
    id: 'trv_maldicion_reliquia',
    icon: '👁️',
    biome: 'Cruce del Ahorcado',
    tag: 'Drama Grupal · Tentación',
    title: 'El Reloj de Bolsillo del Cadáver',
    readAloud:
      'Uno de los aventureros descubre un cadáver con uniforme del Imperio aferrado a un reloj de oro que gira al revés. El aire se enfría de golpe y susurros empiezan a salir de la niebla: "Devuélvelo a la tierra o llévate mi destino...".',
    choices: [
      {
        id: 'study_curse',
        label: '🔮 Analizar el encantamiento antes de tocarlo (MEN CD 13)',
        skillCheck: 'Mente (MEN) CD 13',
        success: {
          text: 'Rompen el sello de Zargon limpiamente: el espíritu del soldado descansa en paz y les deja su bolsa intacta (+20 MO por héroe y +1 Esencia Espectral).',
          goldPerHero: 20,
          materialId: 'esencia_espectral',
        },
        fail: {
          text: 'El reloj estalla en escarcha fantasmal al abrirlo: el frío muerde la mente de todo el grupo (-2 PM a cada héroe).',
          pmDelta: -2,
        },
      },
      {
        id: 'loot_fast',
        label: '🖐️ Tomar el reloj de oro y apresurar el paso (SUE CD 14)',
        skillCheck: 'Suerte (SUE) CD 14',
        success: {
          text: '¡Pura fortuna! La maldición no logra alcanzarlos antes de cruzar el arroyo y venden el reloj en secreto (+35 MO por héroe).',
          goldPerHero: 35,
        },
        fail: {
          text: 'Durante horas dan vueltas en círculo en la niebla; al amanecer descubren que sus provisiones se pudrieron y perdieron monedas en el lodo (-15 MO y -1 PC a todos).',
          goldPerHero: -15,
          pcDelta: -1,
        },
      },
      {
        id: 'bury_respect',
        label: '🕯️ Enterrar al soldado con respeto sin tomar nada',
        skillCheck: null,
        success: {
          text: 'Una calma cálida envuelve al grupo durante el resto del viaje (+1 PC y +1 PM a cada héroe).',
          pcDelta: 1,
          pmDelta: 1,
        },
      },
    ],
  },
  {
    id: 'trv_peaje_bandidos',
    icon: '🏹',
    biome: 'Paso de los Cuervos',
    tag: 'Emboscada Táctica',
    title: 'Los Arqueros del Peaje Negro',
    readAloud:
      'Silbidos agudos cruzan el barranco. Seis bandidos apostados en lo alto de los riscos apuntan con ballestas cargadas. Su líder baja una cuerda con una cesta vacía: "Veinte piezas por cabeza y siguen respirando. Si alguien mueve una espada, llueven virotes."',
    choices: [
      {
        id: 'counter_ambush',
        label: '⚡ Dividirse y escalar por el flanco ciego (AGI CD 14)',
        skillCheck: 'Agilidad (AGI) CD 14',
        success: {
          text: '¡Los toman totalmente por sorpresa! Los bandidos sueltan sus armas y huyen dejando su botín (+25 MO por héroe y +1 Acero Templado).',
          goldPerHero: 25,
          materialId: 'chatarra_acero',
          repDelta: 1,
        },
        fail: {
          text: 'Una piedra delata su posición: una descarga de virotes hiere a todo el grupo antes de poder cubrirse (-2 PC a cada héroe).',
          pcDelta: -2,
        },
      },
      {
        id: 'bluff_zargon',
        label: '🎭 Fingir que traen una plaga mortal de la mazmorra (SUE CD 13)',
        skillCheck: 'Suerte (SUE) CD 13',
        success: {
          text: '¡Se lo tragan entero! Los bandidos retroceden horrorizados cubriéndose la boca y dejan paso libre (e incluso tiran 1 Hierba Lunar asustados).',
          materialId: 'hierba_lunar',
        },
        fail: {
          text: 'El líder se ríe de la actuación y sube el precio por hacerle perder el tiempo (-25 MO a cada héroe).',
          goldPerHero: -25,
        },
      },
      {
        id: 'pay_toll',
        label: '🪙 Poner las monedas en la cesta y cruzar sin sangre',
        skillCheck: null,
        success: {
          text: 'Entregan 15 MO por héroe; las ballestas se bajan y cruzan el desfiladero intactos.',
          goldPerHero: -15,
        },
      },
    ],
  },
  {
    id: 'trv_buhonero_apuesta',
    icon: '🎲',
    biome: 'Campamento de Nómadas',
    tag: 'Drama Grupal · Apuesta',
    title: 'El Cubilete del Alquimista Loco',
    readAloud:
      'Junto a una fogata de llamas verdes, un mercader con gafas de latón reta a uno de los héroes: "Tengo aquí tres frascos sellados: uno vale una fortuna, otro es veneno puro y el tercero despierta recuerdos prohibidos. ¿Quién de vosotros tiene agallas para elegir por todo el grupo?"',
    choices: [
      {
        id: 'inspect_vials',
        label: '🧠 Examinar el peso y el brillo de los frascos (MEN CD 13)',
        skillCheck: 'Mente (MEN) CD 13',
        success: {
          text: 'Identifican el frasco genuino sin dudarlo: el mercader aplaude furioso y entrega Hierba Lunar y 20 MO por héroe.',
          goldPerHero: 20,
          materialId: 'hierba_lunar',
        },
        fail: {
          text: '¡Era el frasco de gas cáustico! Explota al destaparlo hiriendo a todos (-1 PC y -1 PM a cada héroe) mientras el mercader ríe alejándose.',
          pcDelta: -1,
          pmDelta: -1,
        },
      },
      {
        id: 'pure_luck',
        label: '🍀 Confiar en la suerte pura y elegir a ciegas (SUE CD 12)',
        skillCheck: 'Suerte (SUE) CD 12',
        success: {
          text: '¡Golpe de fortuna increíble! Dentro había polvo rúnico purísimo y monedas antiguas (+25 MO y +1 Polvo Rúnico).',
          goldPerHero: 25,
          materialId: 'polvo_runico',
        },
        fail: {
          text: 'El frasco contenía humo somnífero: despiertan media hora después con las bolsas más ligeras (-20 MO a cada héroe).',
          goldPerHero: -20,
        },
      },
      {
        id: 'walk_away',
        label: '🚶 Ignorar sus trucos y seguir hacia la Ciudad',
        skillCheck: null,
        success: {
          text: 'El mercader chasquea la lengua decepcionado mientras el grupo llega a salvo al Bastión.',
        },
      },
    ],
  },
  {
    id: 'trv_tormenta_cripta',
    icon: '⛈️',
    biome: 'Colinas de Piedra Negra',
    tag: 'Supervivencia · Refugio',
    title: 'La Tormenta Eléctrica y la Cripta Abierta',
    readAloud:
      'Relámpagos caen a metros del camino. El único refugio cercano es una cripta semicircular cuya losa está entreabierta desde adentro. Un aroma a ozono y hierro viejo sale de la oscuridad.',
    choices: [
      {
        id: 'explore_crypt',
        label: '🔦 Entrar con cautela a asegurar el fondo (AGI o MEN CD 13)',
        skillCheck: 'Agilidad o Mente CD 13',
        success: {
          text: 'Desactivan un viejo sello de flechas y encuentran el alijo de un caballero caído (+20 MO, +1 Huesos y Colmillos y +2 PC al descansar secos).',
          goldPerHero: 20,
          pcDelta: 2,
          materialId: 'colmillos_hueso',
        },
        fail: {
          text: 'Un derrumbe de huesos y una trampa de dardos los obligan a salir bajo la tormenta (-2 PC a cada héroe).',
          pcDelta: -2,
        },
      },
      {
        id: 'endure_storm',
        label: '🌧️ Resistir la tormenta bajo los pinos sin entrar (FUE CD 12)',
        skillCheck: 'Fuerza (FUE) CD 12',
        success: {
          text: 'Aguantan el vendaval con entereza y al despejar hallan hierbas frescas arrastradas por el arroyo (+1 Hierba Lunar).',
          materialId: 'hierba_lunar',
        },
        fail: {
          text: 'El frío cala hasta los huesos y llegan agotados a las murallas (-1 PC a todos).',
          pcDelta: -1,
        },
      },
    ],
  },
];

export function pickRandomTravelEncounter(excludeId = null) {
  const pool = TRAVEL_ENCOUNTERS.filter((e) => e.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)] || TRAVEL_ENCOUNTERS[0];
}
