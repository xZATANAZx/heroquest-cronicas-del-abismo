// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20 v2)
// SISTEMA DE VIAJES DE ROL (Sin tablero ni miniaturas — Decisiones + d20 físico)
// ============================================================================

export const TRAVEL_ENCOUNTERS = [
  {
    id: 'trv_carro_volcado',
    icon: '🛞',
    biome: 'Camino del Bosque',
    tag: 'NPC / Posible Trampa',
    title: 'El Carro Volcado en la Curva',
    readAloud:
      'Al caer la tarde, una carreta con una rueda rota bloquea el sendero. Un hombre con capa polvorienta agita los brazos pidiendo ayuda: "¡Por favor, aventureros! Los lobos espantaron a mi mula y mi carga se cayó a la zanja... ¡les pagaré bien si me ayudan a levantarla!" Entre los árboles cercanos, las ramas se mueven sin viento.',
    choices: [
      {
        id: 'inspect',
        label: '👀 Revisar primero los árboles (Percepción CD 13)',
        skillCheck: 'Percepción CD 13',
        success: {
          text: '¡Era una trampa! Descubren a 3 bandidos escondidos con ballestas antes de acercarse. Al verse descubiertos huyen dejando caer una bolsa con suministros.',
          goldPerHero: 15,
          materialId: 'chatarra_acero',
          fameDelta: 1,
        },
        fail: {
          text: 'No ven nada sospechoso; al acercarse a ayudar, salen bandidos de los arbustos y les lanzan flechas mientras retroceden. Cada héroe pierde 1 PC.',
          pcDelta: -1,
        },
      },
      {
        id: 'help_bold',
        label: '💪 Ayudar de frente imponiendo respeto (Intimidación CD 13)',
        skillCheck: 'Intimidación CD 13',
        success: {
          text: 'Sus armas desenvainadas ahuyentan a los bandidos ocultos. Resulta que el mercader era rehén obligado a atraer viajeros: agradecido les regala materiales y habla bien de ustedes en la Ciudad.',
          goldPerHero: 10,
          materialId: 'racion_mazmorra',
          repDelta: 1,
        },
        fail: {
          text: 'Los bandidos no se acobardan y logran arrancarles un peaje rápido tras un breve forcejeo (-15 MO a cada héroe).',
          goldPerHero: -15,
        },
      },
      {
        id: 'bypass',
        label: '🌲 Rodear el sendero por el bosque (Sin tirada)',
        skillCheck: null,
        success: {
          text: 'Evitan el riesgo por completo y llegan sanos y salvos a las murallas de la Ciudad, aunque pierden una hora de luz.',
        },
      },
    ],
  },
  {
    id: 'trv_peregrino_azul',
    icon: '🏮',
    biome: 'Cruce de Piedra',
    tag: 'NPC / Gancho de Misión',
    title: 'El Peregrino de la Linterna Azul',
    readAloud:
      'Junto a un hito cubierto de musgo descansa un anciano con una linterna que arde con llama azulada. Sin levantar la vista murmura: "Veo el polvo de las profundidades en vuestras botas. Llevo un mapa de una cámara olvidada que nadie ha pisado en décadas... pero el hambre me debilita. ¿Compartiríais algo de oro o consejo con un viejo viajero?"',
    choices: [
      {
        id: 'share_gold',
        label: '🪙 Darle 15 MO por héroe y escuchar su historia',
        skillCheck: null,
        success: {
          text: 'Sonríe y entrega un pergamino sellado: en la próxima misión el DM les revelará gratis 1 Puerta Secreta o la ubicación de la Cámara de Alquimia. Además reciben Polvo Rúnico.',
          goldPerHero: -15,
          materialId: 'polvo_runico',
          repDelta: 1,
        },
      },
      {
        id: 'arcana_lantern',
        label: '🔮 Analizar la linterna azul (Arcano CD 12)',
        skillCheck: 'Arcano CD 12',
        success: {
          text: 'Reconocen fuego espectral benigno. El peregrino se quita la capucha —es un espíritu guardián de Mentor— y bendice sus mentes (+2 PM a todos y +1 Polvo Rúnico).',
          pmDelta: 2,
          materialId: 'polvo_runico',
        },
        fail: {
          text: 'Al tocar la llama azul sin cuidado, un escalofrío recorre al grupo (-1 PM a todos) y el peregrino se desvanece en niebla.',
          pmDelta: -1,
        },
      },
      {
        id: 'ignore',
        label: '🚶 Seguir de largo hacia la Ciudad',
        skillCheck: null,
        success: {
          text: 'El anciano baja la cabeza en silencio mientras continúan el camino sin contratiempos.',
        },
      },
    ],
  },
  {
    id: 'trv_mensajero_herido',
    icon: '📜',
    biome: 'Camino Real',
    tag: 'NPC / Reputación',
    title: 'El Mensajero Imperial Herido',
    readAloud:
      'Un caballo sin jinete trota nervioso hacia ustedes. Cincuenta pasos atrás, un mensajero con el escudo del Emperador yace junto a una roca con una flecha orca en el hombro, abrazando una bolsa sellada con lacre rojo.',
    choices: [
      {
        id: 'heal_messenger',
        label: '🩹 Atender su herida y escoltarlo (Medicina CD 12)',
        skillCheck: 'Medicina CD 12',
        success: {
          text: 'Logran extraer la flecha y estabilizarlo. Al llegar a la Ciudad, la Guardia Real recompensa al grupo con oro, Fama y Reputación.',
          goldPerHero: 20,
          fameDelta: 1,
          repDelta: 1,
        },
        fail: {
          text: 'La herida era profunda y tuvieron que improvisar vendas gastando tiempo y esfuerzo, pero logran llevarlo vivo a la puerta (+1 Fama).',
          fameDelta: 1,
        },
      },
      {
        id: 'track_attackers',
        label: '🏹 Rastrear a los atacantes (Supervivencia CD 13)',
        skillCheck: 'Supervivencia CD 13',
        success: {
          text: 'Encuentran el campamento abandonado de los exploradores orcos y recuperan 20 MO por héroe y Acero Templado antes de regresar por el mensajero.',
          goldPerHero: 20,
          materialId: 'chatarra_acero',
        },
        fail: {
          text: 'Pisan una trampa de cuerda dejada por los orcos (-1 PC a todos) y los atacantes ya escaparon.',
          pcDelta: -1,
        },
      },
    ],
  },
  {
    id: 'trv_anciana_hierbas',
    icon: '🌿',
    biome: 'Puente del Arroyo',
    tag: 'NPC / Alquimia',
    title: 'La Herbolaria del Puente',
    readAloud:
      'Bajo el arco del puente de piedra, una anciana recoge flores plateadas que solo brotan de noche. Al verlos ríe con voz cascada: "Huelen a sangre de monstruo y piedra húmeda. Si alguien aquí sabe distinguir una raíz lunar de un veneno mortal, le regalaré parte de mi cosecha."',
    choices: [
      {
        id: 'nature_test',
        label: '🌿 Identificar las plantas (Supervivencia o Arcano CD 12)',
        skillCheck: 'Supervivencia o Arcano CD 12',
        success: {
          text: '¡Impresionada! Les regala Hierba Lunar a cada héroe y les prepara un té caliente que restaura +2 PC a todo el grupo.',
          pcDelta: 2,
          materialId: 'hierba_lunar',
        },
        fail: {
          text: 'Confunden una hoja urticante y se ríe mientras se frotan las manos ardientes (-1 PC a quien probó), aunque les da 1 Hierba Lunar por el intento.',
          pcDelta: -1,
          materialId: 'hierba_lunar',
        },
      },
      {
        id: 'buy_bundle',
        label: '🪙 Comprarle un atado de hierbas (15 MO por héroe)',
        skillCheck: null,
        success: {
          text: 'Cada héroe recibe Hierba Lunar fresca y el grupo llega descansado a la Ciudad.',
          goldPerHero: -15,
          materialId: 'hierba_lunar',
        },
      },
    ],
  },
  {
    id: 'trv_goblins_desertores',
    icon: '👺',
    biome: 'Desfiladero Rocoso',
    tag: 'Rol / Negociación',
    title: 'Los Goblins Desertores',
    readAloud:
      'Al doblar una peña, sorprenden a cuatro Goblins acurrucados alrededor de una fogata diminuta asando hongos. En vez de atacar, levantan las manos temblando: "¡No pegar! ¡Nosotros escapar de Jefe malo! ¡Nosotros cambiar mapa y polvo brillante por comida o paso libre!"',
    choices: [
      {
        id: 'negotiate',
        label: '💬 Negociar intercambio justo (Persuasión CD 12)',
        skillCheck: 'Persuasión CD 12',
        success: {
          text: 'Los Goblins entregan Pólvora Negra y revelan un atajo seguro hacia la Ciudad (+15 MO de un cofre olvidado en el camino).',
          goldPerHero: 15,
          materialId: 'polvora_negra',
        },
        fail: {
          text: 'Uno de los Goblins intenta robarles una bolsa en la distracción (-10 MO a cada héroe) antes de salir corriendo entre risas.',
          goldPerHero: -10,
        },
      },
      {
        id: 'sneak_past',
        label: '🤫 Pasar en silencio sin que los vean (Sigilo CD 12)',
        skillCheck: 'Sigilo CD 12',
        success: {
          text: 'Cruzan como sombras y además toman una caja de suministros que los Goblins dejaron atrás.',
          materialId: 'racion_mazmorra',
        },
        fail: {
          text: 'Una piedra rueda cuesta abajo; los Goblins lanzan piedras al huir (-1 PC a todos).',
          pcDelta: -1,
        },
      },
    ],
  },
  {
    id: 'trv_puente_quebrado',
    icon: '🌉',
    biome: 'Barranco del Río',
    tag: 'Exploración / Riesgo',
    title: 'El Puente Derrumbado',
    readAloud:
      'La crecida del río partió el viejo puente de madera. En una roca a mitad de la corriente brilla un cofre metálico atascado entre troncos, pero los tablones crujen peligrosamente.',
    choices: [
      {
        id: 'cross_chest',
        label: '🪢 Cruzar y rescatar el cofre (Atletismo CD 13)',
        skillCheck: 'Atletismo CD 13',
        success: {
          text: '¡Maniobra impecable! Recuperan el cofre con 25 MO por héroe y Acero Templado.',
          goldPerHero: 25,
          materialId: 'chatarra_acero',
        },
        fail: {
          text: 'Un tablón cede y el agua helada los golpea antes de salir a la orilla (-2 PC a todos, sin botín).',
          pcDelta: -2,
        },
      },
      {
        id: 'detour',
        label: '🧭 Tomar el vado seguro río arriba (Sin tirada)',
        skillCheck: null,
        success: {
          text: 'Cruzan secos y sin peligro, llegando tranquilos a la Ciudad.',
        },
      },
    ],
  },
  {
    id: 'trv_posada_tormenta',
    icon: '⛈️',
    biome: 'Colinas Grises',
    tag: 'Misterio / Refugio',
    title: 'La Capilla Abandonada en la Tormenta',
    readAloud:
      'Una tormenta eléctrica cae de golpe y los obliga a refugiarse en una capilla en ruinas. El altar está intacto, pero una losa en el suelo tiene arañazos recientes y un susurro helado recorre las vigas.',
    choices: [
      {
        id: 'investigate_slab',
        label: '🔍 Examinar la losa del altar (Investigación CD 12)',
        skillCheck: 'Investigación CD 12',
        success: {
          text: 'Encuentran un compartimento secreto con Polvo Rúnico y pasan la noche secos (+2 PC y +1 PM a todos).',
          pcDelta: 2,
          pmDelta: 1,
          materialId: 'polvo_runico',
        },
        fail: {
          text: 'Al mover la losa liberan un lamento espectral que hiela la sangre (-1 PM a todos), aunque sobreviven a la tormenta.',
          pmDelta: -1,
        },
      },
      {
        id: 'rest_fire',
        label: '🔥 Encender fogata en la entrada sin tocar el altar',
        skillCheck: null,
        success: {
          text: 'Descansan al calor del fuego y recuperan +1 PC cada uno antes del amanecer.',
          pcDelta: 1,
        },
      },
    ],
  },
  {
    id: 'trv_mercader_cofre',
    icon: '🎁',
    biome: 'Cruce de Mercaderes',
    tag: 'NPC / Trampa o Tesoro',
    title: 'El Cofre Sellado del Buhonero',
    readAloud:
      'Un buhonero de sonrisa demasiado amplia les ofrece un cofre pequeño envuelto en cadenas: "¡Lo hallé en unas ruinas! No tengo llave y me da mala espina... ¡20 monedas de cada uno y es vuestro! Puede haber oro imperial o algo mucho peor."',
    choices: [
      {
        id: 'inspect_box',
        label: '🔎 Inspeccionar la cerradura antes de comprar (Percepción o Trampas CD 13)',
        skillCheck: 'Percepción o Trampas CD 13',
        success: {
          text: 'Descubren una aguja venenosa oculta y la desarman frente al buhonero atónito. Les regala el cofre por vergüenza: dentro hay 20 MO/héroe y Glándula de Veneno.',
          goldPerHero: 20,
          materialId: 'glandula_veneno',
        },
        fail: {
          text: 'No notan nada raro; al pagar y abrirlo salta un gas somnífero (-1 PC y -1 PM a todos) y el buhonero ya desapareció.',
          goldPerHero: -20,
          pcDelta: -1,
          pmDelta: -1,
        },
      },
      {
        id: 'decline',
        label: '✋ Rechazar la oferta y seguir camino',
        skillCheck: null,
        success: {
          text: 'El buhonero se encoge de hombros y desaparece por el camino lateral. Llegan a salvo a la Ciudad.',
        },
      },
    ],
  },
];

export function pickRandomTravelEncounter(excludeId = null) {
  const pool = TRAVEL_ENCOUNTERS.filter((e) => e.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)] || TRAVEL_ENCOUNTERS[0];
}
