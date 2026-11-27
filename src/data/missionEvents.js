// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20 v2)
// EVENTOS CONTEXTUALES REFORMADOS (14 Misiones Base + 2 Expansiones Oficiales)
// + GIROS DE ESCENA / MOMENTOS ÉPICOS (Riesgo vs. Recompensa en Mesa)
// 100% coherentes con las salas reales de los Libros Oficiales
// ============================================================================

export const MISSION_CONTEXT_EVENTS = {
  m1_la_prueba: {
    room: [
      {
        title: 'Eco Pétreo de Verag (desde R11)',
        badge: 'Tensión de Jefe',
        text: 'Un temblor recorre las catacumbas y las antorchas parpadean: el rugido de piedra de Verag resuena desde el Salón Central (R11). Percepción CD 12: anticipan sus pasos y el grupo gana +2 a Iniciativa en su próximo combate.',
      },
      {
        title: 'Escudo de un Aprendiz de Mentor',
        badge: 'Hallazgo de Misión',
        text: 'Junto a la pared yace el morral de un antiguo recluta de Mentor. Investigación CD 11: rescatan una Poción de Curación Menor (+2 PC) intacta.',
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
        title: 'Inscripción de Fellmarg (Pista R2)',
        badge: 'Pista Táctica',
        text: 'Un epitafio tallado advierte sobre la Momia Guardián de Fellmarg (R2): "El fuego quiebra la venda ancestral". Quien lo lea con Arcano o Historia CD 11 otorga +1 daño de Fuego en el próximo ataque contra No Muertos.',
      },
    ],
    corridor: [
      {
        title: 'Patrulla Orca Distraída',
        badge: 'Encuentro de Pasillo',
        text: 'Se oyen gruñidos tras la esquina. Sigilo grupal CD 11: si lo superan sorprenden a 1 Orco rezagado (Ventaja en el primer ataque); si fallan, el Orco alerta la sala más cercana.',
      },
      {
        title: 'Antorcha que se Apaga',
        badge: 'Ambiente',
        text: 'Una ráfaga helada apaga la antorcha del corredor. Hasta reencenderla (acción gratuita), las tiradas de Percepción aquí tienen Desventaja (salvo razas con Visión en la Oscuridad).',
      },
    ],
  },

  m2_sir_ragnar: {
    room: [
      {
        title: 'Código Metálico de Sir Ragnar (desde R13)',
        badge: 'Pista de Rescate',
        text: 'Golpes rítmicos de hierro contra barrotes resuenan desde el cuadrante suroeste (R13): ¡es el código de los Caballeros del Rey! Quien supere Percepción CD 11 confirma que Sir Ragnar está vivo y gana Ventaja en su próxima prueba de Atletismo o Sigilo.',
      },
      {
        title: 'Llavero del Carcelero',
        badge: 'Ventaja Táctica',
        text: 'Colgado en un clavo oxidado hay un manojo de llaves de hierro. Percepción CD 12: el héroe que las tome desarma trampas de cofres y abre cerraduras con Ventaja el resto de la misión.',
      },
      {
        title: 'Raciones y Botiquín de Guardia',
        badge: 'Hallazgo de Misión',
        text: 'Un morral olvidado por los guardias orcos contiene vendajes limpios (+1 PC a un aliado o a Sir Ragnar al escoltarlo) y 35 MO.',
        rewardGold: 35,
      },
    ],
    corridor: [
      {
        title: 'Campana de Alerta Orca',
        badge: 'Trampa de Pasillo',
        text: 'Un hilo tenso cruza el corredor conectado a una campana oxidada. Percepción o Desarmar Trampas CD 12: si fallan, suena la alerta y el Reloj del Caos sube +1.',
      },
      {
        title: 'Goblin Mensajero a la Carrera',
        badge: 'Decisión Rápida',
        text: 'Un Goblin corre por el pasillo con una antorcha. Si lo interceptan (Ataque a distancia o Atletismo CD 12) suelta 20 MO; si escapa, avisa a los guardias de la sala siguiente.',
        rewardGold: 20,
      },
    ],
  },

  m3_caudillo_orco: {
    room: [
      {
        title: 'Tambores de Guerra de Ulag (desde R15)',
        badge: 'Tensión de Combate',
        text: 'Los tambores de guerra retumban desde el salón sur de Ulag (R15). Todos tiran Salvación de SAB CD 11: quienes superen ganan +1 al próximo ataque por adrenalina; quienes fallen sufren -1 a su próxima iniciativa.',
      },
      {
        title: 'Estandarte del Clan de Ulag',
        badge: 'Oportunidad Táctica',
        text: 'Un estandarte orco cuelga manchado de ceniza. Si un héroe lo derriba o quema (Atletismo CD 12), los Goblins de esta sala o la siguiente sufren -1 DC Defensa durante 1 ronda por pánico.',
      },
      {
        title: 'Botín Robado de Caravana',
        badge: 'Hallazgo de Misión',
        text: 'Entre cajas saqueadas encuentran un Pergamino de Coraje (+2 DC ataque) listo para usar contra Ulag.',
        rewardLoot: {
          name: 'Pergamino de Coraje',
          type: 'Pergamino',
          rarity: 'poco_comun',
          dice: '+2 DC Ataque',
          upgrade: '1 uso: otorga +2 DC de ataque cuerpo a cuerpo por 2 turnos.',
          special: 'Hechizo Coraje en pergamino (1 uso).',
          restriction: 'Todas las clases',
        },
      },
    ],
    corridor: [
      {
        title: 'Charco de Aceite Orco',
        badge: 'Terreno Táctico',
        text: 'Grasa de antorcha cubre el pasillo. Correr aquí pide DES CD 11 o resbalar; pero si prenden el charco con fuego, arde 2 rondas infligiendo 1 PC a cualquier orco que cruce.',
      },
    ],
  },

  m4_oro_magnus: {
    room: [
      {
        title: 'Surcos de los 3 Cofres Reales (hacia R11)',
        badge: 'Rastro de Oro',
        text: 'Marcas profundas de arrastre convergen hacia la Gran Sala Central (R11) donde Gulthor guarda los 3 cofres. Un reguero de monedas sueltas suma +30 MO para el grupo.',
        rewardGold: 30,
      },
      {
        title: 'Mercenario Orco Descontento',
        badge: 'Negociación Táctica',
        text: 'Un orco herido maldice a Gulthor por no repartir el botín. Persuasión o Intimidación CD 12 (o 25 MO): revela la ubicación de 1 trampa en los pasillos centrales y se marcha sin pelear.',
      },
    ],
    corridor: [
      {
        title: 'El Peso del Oro Real',
        badge: 'Tensión de Escape',
        text: 'Una losa cede bajo el peso de los cofres sellados. Si alguien carga un Cofre Real aquí, tira FUE CD 12 para mantener el equilibrio sin hacer ruido (+1 Reloj del Caos si falla).',
      },
    ],
  },

  m5_laberinto_melar: {
    room: [
      {
        title: 'Susurro Arcano de Melar',
        badge: 'Pista de Secreto',
        text: 'Una voz espectral susurra desde las runas: "Las puertas secretas no siempre se buscan en las paredes… a veces la llave descansa junto al trono (R4)". Arcano CD 12: un lanzador recupera +1 PM.',
      },
      {
        title: 'Frasco Alquímico del Laboratorio',
        badge: 'Hallazgo Arcano',
        text: 'Entre retortas rotas hallan una Hierba Lunar pura y 1 Polvo Rúnico utilizables en la Ciudad o en un Banco de Alquimista.',
        rewardLoot: {
          name: 'Polvo Rúnico de Melar',
          type: 'Accesorio',
          rarity: 'poco_comun',
          dice: '+1 DC Hechizo',
          upgrade: '1 uso: añade +1 DC a tu próximo hechizo o prueba de Arcano.',
          special: 'Catalizador arcano.',
          restriction: 'Todas las clases',
        },
      },
    ],
    corridor: [
      {
        title: 'Crujido de Piedra Viva',
        badge: 'Advertencia',
        text: 'Un sonido seco de roca raspando resuena desde el ala oeste (R12): una estatua vigila las puertas. Percepción CD 12: ganan Ventaja en iniciativa si despierta una Gárgola.',
      },
    ],
  },

  m6_legado_orco: {
    room: [
      {
        title: 'Hueso Afilado y Ganzúa Improvisada',
        badge: 'Supervivencia en Prisión',
        text: 'Escondido bajo un jergón hay un clavo doblado y un cuchillo oxidado (1 DC improvisado si aún no recuperan su equipo en R1). Otorga Ventaja al forzar cerraduras.',
      },
      {
        title: 'Guardia Orco Cabeceando',
        badge: 'Oportunidad de Sigilo',
        text: 'Un guardia ronca apoyado en una mesa. Sigilo grupal CD 12: pasan sin despertarlo y roban 35 MO de su cinturón; si fallan, grita alertando a los secuaces de Grak.',
        rewardGold: 35,
      },
    ],
    corridor: [
      {
        title: 'Aroma a Aceite de Armas (hacia R1)',
        badge: 'Pista de Equipo',
        text: 'Una brisa del norte trae olor a cuero y acero imperial: ¡sus armas confiscadas están en el extremo noroeste (R1)! El grupo gana +1 casilla de movimiento este turno por la urgencia.',
      },
    ],
  },

  m7_mago_perdido: {
    room: [
      {
        title: 'Página Quemada del Diario de Wardoz',
        badge: 'Pista de Historia',
        text: 'Un pergamino chamuscado advierte: "La Magia del Terror petrifica el cuerpo y devora la mente… los guardianes de piedra de los pasillos resisten el acero común". Arcano CD 12: +1 daño mágico contra constructos en esta sala.',
      },
      {
        title: 'Efluvio Púrpura del Laboratorio',
        badge: 'Dilema Alquímico',
        text: 'Un vapor violeta brota de un frasco roto. CON CD 12 o perder 1 casilla de movimiento el próximo turno; si un héroe lo embotella con Arcano CD 13 obtiene 1 Poción de Piel de Piedra (+1 Def por 2 turnos).',
        rewardLoot: {
          name: 'Poción de Piel de Piedra',
          type: 'Poción',
          rarity: 'poco_comun',
          dice: '+1 DC Defensa',
          upgrade: 'Acción gratuita: +1 DC Defensa durante 2 turnos.',
          special: 'Endurece la piel temporalmente.',
          restriction: 'Todas las clases',
        },
      },
    ],
    corridor: [
      {
        title: 'Ojos de Piedra que Siguen al Grupo',
        badge: 'Tensión de Pasillo',
        text: 'Las estatuas del corredor central crujen levemente al pasar. Percepción CD 12: detectan qué Guerrero de Piedra está listo para moverse y ganan +2 a Iniciativa.',
      },
    ],
  },

  m8_mago_fuego: {
    room: [
      {
        title: 'Onda de Calor de Balur (desde R1)',
        badge: 'Peligro Volcánico',
        text: 'El aire se vuelve sofocante en Darkfire Crag. Todos tiran CON CD 12: quienes superen soportan el calor sin problemas; quienes fallen sufren -1 a su próxima tirada de ataque por fatiga (salvo Enanos o resistencia al fuego).',
      },
      {
        title: 'Ungüento Ignífugo de Darkfire',
        badge: 'Hallazgo Táctico',
        text: 'Encuentran un tarro de grasa alquímica fría. Un héroe puede untarse el escudo o capa: reduce en 1 el daño del próximo hechizo de Fuego de Balur.',
      },
    ],
    corridor: [
      {
        title: 'Rastro de Ceniza hacia el Centro (XX en R11)',
        badge: 'Pista de Balur',
        text: 'Runas de teletransporte quemadas en el suelo apuntan hacia la Gran Sala Central (R11). Arcano CD 12: descubren que Balur puede huir mágicamente hacia R11 si se ve acorralado.',
      },
    ],
  },

  m9_carrera_tiempo: {
    room: [
      {
        title: 'La Risa del Guía Traidor',
        badge: 'Presión Contrarreloj',
        text: 'Un eco burlón rebota por el laberinto mientras caen guijarros del techo. ¡No pierdan tiempo! Un héroe puede motivar al grupo con Persuasión o Atletismo CD 11: todos ganan +2 casillas de movimiento en este turno.',
      },
      {
        title: 'Suministros de un Explorador Atrapado',
        badge: 'Hallazgo de Supervivencia',
        text: 'Junto a una antorcha consumida hay una cuerda, 40 MO y un mapa parcial que apunta hacia el cuadrante noroeste (R5).',
        rewardGold: 40,
      },
    ],
    corridor: [
      {
        title: 'Brisa Fresca del Exterior (hacia R5)',
        badge: 'Guía de Escape',
        text: 'Una corriente de aire limpio sopla desde la cámara de las escaleras (R5). Supervivencia CD 11: detectan el camino más corto y evitan 1 trampa de pasillo en su próximo movimiento.',
      },
    ],
  },

  m10_castillo_misterio: {
    room: [
      {
        title: 'Carcajada del Fantasma de Ollar',
        badge: 'Caos Dimensional',
        text: 'El Fantasma de Ollar atraviesa el techo riendo a carcajadas. El próximo héroe que cruce una puerta mágica puede elegir repetir 1 de sus 2 Dados Rojos si supera Arcano CD 13.',
      },
      {
        title: 'Espejismo de Monedas Doradas',
        badge: 'Advertencia de Ilusión',
        text: 'Un brillo dorado parpadea y se desvanece al tocarlo. Investigación o Arcano CD 12: descubren que la magia de Ollar crea oro ilusorio — ¡no todo lo que brilla en la mina (R6) es real!',
      },
    ],
    corridor: [
      {
        title: 'Distorsión Espacial',
        badge: 'Fenómeno Mágico',
        text: 'El pasillo parece estirarse un instante. SAB CD 12: quien la supere mantiene el rumbo y recupera +1 PM por la energía residual del castillo.',
      },
    ],
  },

  m11_bastion_caos: {
    room: [
      {
        title: 'Registro de Recompensas del Rey',
        badge: 'Motivación de Combate',
        text: 'Recuerdan el edicto real: ¡cada baja paga oro (10/20/30/50 MO)! El próximo héroe que abata un enemigo en esta sala gana +15 MO de botín adicional en su cinturón.',
        rewardGold: 15,
      },
      {
        title: 'Brillo Rúnico del Azote de Orcos (R11)',
        badge: 'Pista de Reliquia',
        text: 'Un murmullo metálico vibra desde el salón central (R11): un Guerrero del Terror empuña una hoja legendaria. Percepción CD 12: el grupo gana Ventaja en su primer ataque contra Orcos en la próxima sala.',
      },
    ],
    corridor: [
      {
        title: 'Relevo de Guardia del Bastión',
        badge: 'Decisión Táctica',
        text: 'Botas pesadas marchan cerca. Sigilo grupal CD 12 para pegarse a las sombras y dejar pasar la ronda; si fallan, el Reloj del Caos sube +1.',
      },
    ],
  },

  m12_barak_tor_tumulo: {
    room: [
      {
        title: 'Advertencia Tallada de los Enanos',
        badge: 'Pista Vital',
        text: 'Runas antiguas grabadas en la piedra rezan: "Ningún acero mortal hiere al Señor de los Brujos; solo el Filo del Espíritu". Quien lo lea con Historia/Arcano CD 11 gana +2 a su próxima tirada de huida o Atletismo.',
      },
      {
        title: 'Frío Sepulcral de la Tumba (R12)',
        badge: 'Terror de Barak Tor',
        text: 'El aliento se congela en el aire. Todos tiran SAB CD 12: quienes fallen pierden 1 casilla de movimiento este turno; quienes superen resisten el aura del Señor de los Brujos con Ventaja en su próxima salvación.',
      },
    ],
    corridor: [
      {
        title: 'Puertas Falsas que Crujen (Ala Noreste)',
        badge: 'Trampa de Tiempo',
        text: 'Una puerta del corredor este no tiene bisagras reales. Investigación CD 11: descubren que es una puerta falsa pintada sobre roca sólida sin perder su acción.',
      },
    ],
  },

  m13_hoja_espiritual: {
    room: [
      {
        title: 'Martilleo Fantasmal de los Enanos (hacia R21)',
        badge: 'Eco de la Reliquia',
        text: 'Un sonido lejano de yunque resuena desde el extremo sureste (R21), guiando a los héroes hacia el Filo del Espíritu. El Enano del grupo (o quien supere SAB CD 12) gana +1 DC en su próximo ataque.',
      },
      {
        title: 'Rocío de la Fuente de Leben',
        badge: 'Bendición Élfica',
        text: 'Agua cristalina brota de una grieta con brillo plateado. Un héroe puede mojar su arma: durante 2 turnos sus ataques cuentan como mágicos contra No Muertos.',
      },
    ],
    corridor: [
      {
        title: 'Techo Agrietado del Templo',
        badge: 'Alerta de Bloques',
        text: 'Polvo y cascotes caen del techo anunciando bloques movedizos. Percepción CD 12: quien lleva Yelmo o supera la prueba ignora el próximo golpe de bloque caído.',
      },
    ],
  },

  m14_barak_tor: {
    room: [
      {
        title: 'Resonancia del Filo del Espíritu',
        badge: 'Momento Clímax',
        text: 'La hoja forjada por los enanos brilla con luz azulada al acercarse al Señor de los Brujos (R8). El portador del Filo del Espíritu gana Ventaja en su próximo ataque contra No Muertos.',
      },
      {
        title: 'Reliquia de un Cruzado Caído',
        badge: 'Hallazgo Sagrado',
        text: 'Junto a un pilar yace un frasco intacto de Agua Bendita (+2 DC mágicos indefendibles contra No Muertos).',
        rewardLoot: {
          name: 'Frasco de Agua Bendita',
          type: 'Poción',
          rarity: 'raro',
          dice: '2 DC Mágico',
          upgrade: 'Arrojadizo: inflige 2 DC mágicos indefendibles a No Muertos o Espectros.',
          special: 'Daña No Muertos y corta regeneración.',
          restriction: 'Todas las clases',
        },
      },
      {
        title: 'Última Plegaria de Mentor',
        badge: 'Voz en la Oscuridad',
        text: 'La voz de Mentor resuena en sus mentes: "El Rey confía en vosotros en el Paso del Fuego Oscuro". Todo el grupo recupera +1 PM al instante.',
      },
    ],
    corridor: [
      {
        title: 'Manos Esqueléticas del Suelo',
        badge: 'Trampa Necrótica',
        text: 'Brazos de hueso brotan entre las losas intentando sujetar los tobillos. Salvación FUE o DES CD 12 para liberarse sin perder movimiento.',
      },
    ],
  },

  // ==================== EXPANSIÓN: REINA DE LOS ESPÍRITUS ====================
  reina_espiritus: {
    room: [
      {
        title: 'Eco Telepático de Silvana',
        badge: 'Guía de la Profetisa',
        text: 'La voz serena de Silvana atraviesa la niebla mental: señala un punto seguro de la cámara. Todo el grupo gana Ventaja en su próxima tirada de Percepción o Salvación de SAB.',
      },
      {
        title: 'Recuerdo Fragmentado de Nelath',
        badge: 'Clima de Campaña',
        text: 'Un susurro triste recorre la sala: "No quería servir a la oscuridad…". Un Bardo o héroe con Persuasión/Arcano CD 12 absorbe la chispa y recupera +1 PM.',
      },
      {
        title: 'Esencia Translúcida Condensada',
        badge: 'Hallazgo Espectral',
        text: 'Sobre una piedra brilla un frasco de aceite plateado. Investigación CD 12: obtienen una Poción de Clarividencia (+2 PM).',
        rewardLoot: {
          name: 'Poción de Clarividencia',
          type: 'Poción',
          rarity: 'poco_comun',
          dice: '+2 PM',
          upgrade: 'Restaura 2 PM y saca inmediatamente del estado de Shock.',
          special: 'Restaura 2 PM.',
          restriction: 'Todas las clases',
        },
      },
    ],
    corridor: [
      {
        title: 'Corriente Espiritual Helada',
        badge: 'Ambiente Espectral',
        text: 'Una neblina azulada cruza el pasillo. Salvación SAB CD 12: quien falle siente un escalofrío (-1 a su próxima iniciativa); quien supere distingue si hay enemigos tras la siguiente puerta.',
      },
    ],
  },

  // ==================== EXPANSIÓN: LA LUNA DEL TERROR ====================
  luna_terror: {
    room: [
      {
        title: 'Señal de la Resistencia de Elethorn',
        badge: 'Intriga en Elethorn',
        text: 'Un símbolo plateado oculto bajo el marco marca un alijo secreto de Ithraeon. Investigación CD 12: recuperan 1 Bomba de Humo y 35 MO.',
        rewardGold: 35,
        rewardLoot: {
          name: 'Bomba de Humo de Elethorn',
          type: 'Herramienta',
          rarity: 'poco_comun',
          dice: 'Escape / Disfraz',
          upgrade: 'Acción gratuita: cubre 3×3 en humo, evita ataques de oportunidad y permite recuperar Disfraz.',
          special: '1 uso. Ideal para sigilo y escape.',
          restriction: 'Todas las clases',
        },
      },
      {
        title: 'Reflejo Plateado de la Luna del Terror',
        badge: 'Fenómeno Lunar',
        text: 'La luz carmesí se filtra por una grieta. Los héroes con magia o Visión en la Oscuridad detectan al instante cualquier Espectro Etéreo cercano; los demás tiran SAB CD 12 para mantener el temple.',
      },
      {
        title: 'Frasco Alquímico de Contrabando',
        badge: 'Alquimia de Zerese',
        text: 'Escondida tras un ladrillo flojo encuentran una Poción de Fuerza (+2 DC en el próximo ataque).',
        rewardLoot: {
          name: 'Poción de Fuerza',
          type: 'Poción',
          rarity: 'poco_comun',
          dice: '+2 DC Ataque',
          upgrade: 'Acción gratuita: +2 DC en tu próximo ataque.',
          special: '+2 DC Ataque por 1 turno.',
          restriction: 'Todas las clases',
        },
      },
    ],
    corridor: [
      {
        title: 'Sombra de un Asesino del Velo',
        badge: 'Emboscada Silenciosa',
        text: 'Percepción CD 13: detectan un brillo metálico antes de que una daga vuele desde la lluvia. Si fallan, el héroe más atrasado recibe 1 ataque sorpresa de 2 DC (o pierde su Disfraz).',
      },
      {
        title: 'Patrulla de Guardias Magos bajo la Lluvia',
        badge: 'Sigilo / Disfraz',
        text: 'Antorchas azules doblan la esquina. Con Disfraz activo o Sigilo CD 12 pasan desapercibidos y escuchan la contraseña del sector (+2 a Iniciativa en la próxima sala).',
      },
    ],
  },
};

export function resolveMissionEventPool(currentMap) {
  if (!currentMap) return MISSION_CONTEXT_EVENTS.m1_la_prueba;
  if (MISSION_CONTEXT_EVENTS[currentMap.id]) return MISSION_CONTEXT_EVENTS[currentMap.id];
  if (`${currentMap.id}`.startsWith('sq') || `${currentMap.expansion || ''}`.includes('Espíritus')) {
    return MISSION_CONTEXT_EVENTS.reina_espiritus;
  }
  if (`${currentMap.id}`.startsWith('dm') || `${currentMap.expansion || ''}`.includes('Luna')) {
    return MISSION_CONTEXT_EVENTS.luna_terror;
  }
  return null;
}

// Pool limpio de eventos variados de Mazmorra (SIN Inspiración ni Reactivos obsoletos)
export const GENERIC_DUNGEON_EVENTS = {
  room: [
    {
      title: 'Baldosa Suelta con Compartimento',
      badge: 'Hallazgo Secreto',
      text: 'Al pisar cerca de la pared se escucha un clic hueco. Investigación CD 12: bajo la losa hay una bolsa con 45 MO y una nota vieja sobre una trampa cercana.',
      rewardGold: 45,
    },
    {
      title: 'Bramido en la Oscuridad',
      badge: 'Tensión',
      text: 'Un aullido helado retumba por los muros. Todos los héroes en la sala tiran Salvación de SAB CD 11: quien falle sufre -1 a su próxima tirada d20; quien supere gana Ventaja en su próxima tirada de iniciativa o ataque.',
    },
    {
      title: 'Brasero aún Encendido',
      badge: 'Ventaja Táctica',
      text: 'Un brasero de hierro arde con carbones rojos. Un héroe puede gastar 1 acción gratuita para prender su arma en llamas (+1 daño de Fuego en su próximo ataque) o volcarlo hacia un enemigo (DES CD 12 o 1 PC).',
    },
    {
      title: 'Estatua Agrietada con Gema',
      badge: 'Riesgo / Recompensa',
      text: 'Una estatua antigua sostiene una gema roja en su ojo. Desarmar Trampas o DES CD 13: si la extraen con cuidado ganan 65 MO; si fallan, un dardo oculto dispara por 1 PC.',
      rewardGold: 65,
    },
    {
      title: 'Esqueleto de un Explorador Imperial',
      badge: 'Equipo Olvidado',
      text: 'Apoyado contra la esquina yace un aventurero caído hace años. Medicina o Investigación CD 11: rescatan un Antídoto Imperial sellado de su morral.',
      rewardLoot: {
        name: 'Antídoto Imperial',
        type: 'Poción',
        rarity: 'comun',
        dice: 'Cura Debuffs',
        upgrade: 'Acción gratuita: elimina Envenenado, Paralizado y cualquier estado negativo.',
        special: 'Limpia estados negativos.',
        restriction: 'Todas las clases',
      },
    },
    {
      title: 'Muro con Inscripción Rúnica',
      badge: 'Sabiduría Arcana',
      text: 'Símbolos brillantes parpadean en el muro. Arcano CD 12: el lanzador que los descifre recupera +1 PM al instante y descubre si hay enemigos tras la siguiente puerta cerrada.',
    },
    {
      title: 'Cadenas Colgantes del Techo',
      badge: 'Terreno Táctico',
      text: 'Cadenas oxidadas cuelgan a baja altura. Un héroe ágil (Atletismo CD 12) puede balancearse para saltar 3 casillas sin provocar ataques de oportunidad; si falla, hace ruido (+1 Reloj del Caos).',
    },
    {
      title: 'Barril de Pólvora o Aceite',
      badge: 'Elemento Explosivo',
      text: 'En un rincón hay un barril sellado con olor penetrante. Si alguien lo golpea con Fuego o ataque a distancia, estalla en un área de 3×3 casillas infligiendo 2 DC a todo lo que esté alrededor.',
    },
    {
      title: 'Espejo Empañado',
      badge: 'Visión Fugaz',
      text: 'Un espejo roto refleja brevemente la sala contigua antes de oscurecerse. Percepción CD 12: el DM revela gratis qué monstruos hay en una habitación adyacente sin abrir la puerta.',
    },
    {
      title: 'Botiquín de Campaña Roto',
      badge: 'Suministro Útil',
      text: 'Entre restos de cajas encuentran vendajes limpios y hierbas secas. Medicina CD 11: un héroe puede curar +2 PC a un compañero aquí mismo sin gastar pociones.',
    },
  ],
  corridor: [
    {
      title: 'Corriente de Aire Helado',
      badge: 'Pista de Secreto',
      text: 'Una brisa fina brota de una rendija entre los ladrillos. Percepción o Investigación CD 12: el DM confirma si existe una Puerta Secreta o atajo en este tramo del pasillo.',
    },
    {
      title: 'Techo Inestable',
      badge: 'Peligro de Pasillo',
      text: 'Pequeñas piedras caen del techo agrietado. Si el grupo corre o grita aquí, el último héroe tira Salvación DES CD 12 o recibe 1 PC por escombros.',
    },
    {
      title: 'Huellas Frescas en el Polvo',
      badge: 'Rastreo',
      text: 'Marcas recientes cruzan el suelo. Supervivencia CD 11: determinan el tipo de enemigos que patrullan el sector siguiente (ganan +2 a Iniciativa en el próximo combate).',
    },
    {
      title: 'Reja Semicaída',
      badge: 'Obstáculo Táctico',
      text: 'Una reja oxidada cuelga a media altura. Atletismo CD 12 para levantarla y trabarla (paso libre), o pasar agachados gastando +2 casillas de movimiento.',
    },
    {
      title: 'Bolsa Caída en las Sombras',
      badge: 'Suerte en el Camino',
      text: 'En una esquina oscura brilla una bolsita rota con 30 MO y dados de hueso.',
      rewardGold: 30,
    },
    {
      title: 'Eco de Pasos Cercanos',
      badge: 'Decisión Rápida',
      text: 'Se oyen pisadas acercándose por el cruce. Sigilo grupal CD 12: si se esconden pegados a la pared, dejan pasar a la patrulla sin combatir; si fallan, aparece 1 Monstruo Errante.',
    },
    {
      title: 'Antorcha de Pared con Palanca',
      badge: 'Mecanismo Oculto',
      text: 'Una antorcha está ligeramente torcida. Investigación CD 12: al girarla desactiva una trampa cercana o abre un nicho con una Poción de Curación Menor (+2 PC).',
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
  ],
};

// Generador combinatorio coherente con la misión actual (economía balanceada HQ-D20 v2)
export function generateDynamicMissionEvent(currentMap, isCorridor, partyLevel = 1) {
  const missionShort = (currentMap?.title || 'la Mazmorra').split(':')[1]?.split('(')[0]?.trim() || 'la Mazmorra';
  const wandering = currentMap?.wanderingMonster || 'Orco';
  const cd = Math.min(16, 11 + Math.floor((partyLevel - 1) / 3));
  const goldAmt = 15 + partyLevel * 8 + Math.floor(Math.random() * 15);

  const roomTemplates = [
    {
      title: `Rastro de ${wandering} en ${missionShort}`,
      badge: 'Pista Dinámica',
      text: `Encuentran armas melladas y marcas frescas de ${wandering}. Supervivencia CD ${cd}: descubren su punto débil y el grupo gana Ventaja en el primer ataque del próximo combate.`,
    },
    {
      title: `Alijo Oculto de ${missionShort}`,
      badge: 'Botín Escondido',
      text: `Detrás de una piedra floja hay un escondite improvisado. Investigación CD ${cd}: recuperan ${goldAmt} MO sin hacer ruido.`,
      rewardGold: goldAmt,
    },
    {
      title: `Eco Mágico de ${currentMap?.expansion || 'Zargon'}`,
      badge: 'Anomalía Arcana',
      text: `El aire vibra con energía antigua. Arcano CD ${cd}: un héroe absorbe la chispa y recupera +1 PM (si falla, las antorchas parpadean y el Reloj del Caos sube +1).`,
    },
    {
      title: `Trampa Improvisada de ${wandering}`,
      badge: 'Alerta Táctica',
      text: `Un cable tenso cruza detrás de la entrada. Percepción o Desarmar Trampas CD ${cd}: si lo desarman obtienen piezas útiles (+${Math.round(goldAmt / 2)} MO); si fallan, el primero recibe 1 PC.`,
      rewardGold: Math.round(goldAmt / 2),
    },
    {
      title: `Mensaje de un Explorador Caído`,
      badge: 'Moral y Tensión',
      text: `Un aviso tallado en la pared advierte sobre los peligros de ${missionShort}. Quien lo estudie con Medicina o Persuasión CD ${cd} prepara al grupo (+2 a Iniciativa en la próxima pelea).`,
    },
  ];

  const corridorTemplates = [
    {
      title: `Cruce Vigilado por ${wandering}`,
      badge: 'Táctica de Pasillo',
      text: `Voces y pasos resuenan en el siguiente cruce. Sigilo CD ${cd}: si lo superan, el DM les dice qué hay tras la puerta más cercana sin alertar a nadie.`,
    },
    {
      title: `Escombros de ${missionShort}`,
      badge: 'Obstáculo Rápido',
      text: `Un derrumbe parcial estrecha el corredor. Atletismo CD ${cd} para apartar la roca principal y abrir paso (entre los escombros brillan ${goldAmt} MO).`,
      rewardGold: goldAmt,
    },
    {
      title: `Bruma Fría del Corredor`,
      badge: 'Ambiente Sobrenatural',
      text: `Una neblina baja cubre el suelo. Salvación de SAB CD ${cd}: quien la supere detecta al instante cualquier trampa de foso en los próximos 4 pasos.`,
    },
  ];

  const pool = isCorridor ? corridorTemplates : roomTemplates;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================================
// NUEVA MECÁNICA: GIRO DE ESCENA / MOMENTO ÉPICO (Riesgo vs. Recompensa)
// Añade emoción cinematográfica en cada sala sin alterar posiciones oficiales
// ============================================================================
export function generateEpicSceneTwist(currentMap, selectedRoomId, roomMonsters = [], partyLevel = 1) {
  const cd = Math.min(16, 12 + Math.floor((partyLevel - 1) / 3));
  const hasMonsters = roomMonsters.length > 0;
  const hasBoss = roomMonsters.some((m) => m.item?.info?.isBoss);
  const missionShort = (currentMap?.title || 'la Misión').split(':')[1]?.split('(')[0]?.trim() || 'la Misión';

  const combatTwists = [
    {
      title: '🔥 Candil / Lámpara Colgante Sobre los Enemigos',
      badge: 'Giro de Escena · Terreno',
      text: `Un candil de hierro arde justo encima de la sala (${selectedRoomId}). Un héroe puede gastar su acción para cortar la cadena (Ataque a distancia o DES CD ${cd}): ¡cae en llamas infligiendo 2 DC a los enemigos en 2×2 casillas! Si falla, el ruido sube +1 el Reloj del Caos.`,
    },
    {
      title: '⚔️ Maniobra de Flanqueo Heroico',
      badge: 'Giro de Escena · Táctica',
      text: 'El enemigo deja un flanco abierto al reorganizarse. Si DOS héroes atacan al mismo objetivo en esta ronda, el segundo tira +1 DC adicional y puede empujarlo 1 casilla contra un muro o mueble (+1 daño extra si choca).',
    },
    {
      title: '🛡️ Último Aliento: ¡No Retrocedan!',
      badge: 'Giro de Escena · Adrenalina',
      text: 'Un enemigo ruge cargando con furia. Cualquier héroe que decida mantener la línea (sin retroceder este turno) gana +1 DC de Defensa hasta su próximo turno y puede contraatacar con 1 DC si bloquea todo el golpe.',
    },
    {
      title: '💥 Mesa / Mueble como Barricada o Proyectil',
      badge: 'Giro de Escena · Interactivo',
      text: `En medio del combate de ${missionShort}, un héroe con FUE (Atletismo CD ${cd}) puede volcar una mesa o empujar escombros: otorga cobertura (+1 DC Defensa contra proyectiles) o derriba a un enemigo adyacente.`,
    },
  ];

  const bossTwists = [
    {
      title: '👑 Duelo de Voluntades con el Jefe',
      badge: 'Momento Épico · Jefe',
      text: `El líder enemigo en ${selectedRoomId} señala al héroe más fuerte y lanza un desafío brutal. Si el héroe acepta (Intimidación o SAB CD ${cd}), el Jefe queda obligado a atacarlo solo a él este turno, pero los aliados ganan Ventaja contra él hasta el final de la ronda.`,
    },
    {
      title: '⚡ Pulso de Poder Oscuro (Oportunidad)',
      badge: 'Momento Épico · Riesgo/Recompensa',
      text: 'El Jefe canaliza energía de Zargon preparando un golpe devastador (+1 DC en su próximo turno). Si un lanzador o pícaro interrumpe el canalizado (Arcano o Ataque CD 13) antes de su turno, ¡el Jefe pierde su defensa especial durante 1 ronda!',
    },
  ];

  const explorationTwists = [
    {
      title: '🔮 Puerta Sellada por Runas (Puzzle al Celular)',
      badge: 'Puerta Especial · Puzzle',
      text: `La siguiente puerta desde ${selectedRoomId} brilla con 3 runas de Zargon. ¡Usa el botón "Puzzle al Celular" o resuélvanlo con Mente (MEN CD ${cd})! Éxito = +1 PM a quien la abrió y los enemigos tras la puerta pierden su sorpresa; Fallo = descarga arcana (-1 PC) y +1 Reloj del Caos.`,
    },
    {
      title: '🚪 Puerta Entreabierta (Espiar o Emboscar)',
      badge: 'Puerta Especial · Táctica',
      text: `Una puerta contigua a ${selectedRoomId} está entreabierta unos centímetros y se filtran voces enemigas. Quien se asome con Agilidad (AGI CD ${cd}) descubre exactamente qué monstruos hay dentro y el grupo actúa primero si deciden entrar; si falla, cruje la bisagra y los enemigos se preparan (+1 DC Def en ronda 1).`,
    },
    {
      title: '⛓️ Puerta Atrancada con Cuñas de Hierro',
      badge: 'Puerta Especial · Riesgo',
      text: `Los sirvientes de Zargon trabaron el siguiente acceso desde ${selectedRoomId}. Pueden forzarla a golpes (FUE CD ${cd}, pero el estruendo sube +1 Reloj del Caos) o desmontar las bisagras en silencio (AGI CD ${cd + 1} / Cerrajero con Ventaja).`,
    },
    {
      title: '🗣️ La Puerta Parlante de Bronce',
      badge: 'Puerta Especial · Rol',
      text: `Un rostro metálico en la puerta de ${selectedRoomId} abre los ojos: "Dime qué pesa más que una montaña pero cabe en una mano vacía, o dame 15 monedas y te dejo pasar sin avisar a mis amos." (Suerte/Mente CD ${cd} o soborno de 15 MO; si la rompen a la fuerza, grita subiendo +2 el Reloj del Caos).`,
    },
    {
      title: '📦 Cofre Sospechoso (¿Mímico o Reliquia?)',
      badge: 'Giro de Escena · Sorpresa',
      text: `En una esquina de ${selectedRoomId} hay un cofre extra sin candado que respira levemente. Mente/Agilidad CD ${cd} para notar los dientes ocultos: si lo abren sin revisar, ¡es un Mímico de Cofre (ataca primero)! Si lo neutralizan o el cofre es real, obtienen +35 MO y 1 Material de Crafteo.`,
      rewardGold: 35,
    },
    {
      title: '🧭 Prisionero del Imperio — Dilema en Sala',
      badge: 'Giro de Escena · Narrativa',
      text: `Un explorador herido se oculta en ${selectedRoomId} y suplica que le den 1 poción o vendaje (MEN CD ${cd} o ceder 1 curación). Si lo salvan, revela 1 trampa del sector y suma +1 Reputación; si lo ignoran por prisa, sus lamentos delatan su posición (+1 Reloj del Caos).`,
    },
    {
      title: '⚙️ Trampa de Bioma Oculta',
      badge: 'Giro de Escena · Peligro',
      text: `Una losa descolorida en ${selectedRoomId} oculta un mecanismo improvisado de ${missionShort}. Agilidad (AGI CD ${cd}): si la desarman recuperan Acero Templado y +20 MO; si falla, el primero sufre 2 DC de daño y +1 Reloj del Caos.`,
      rewardGold: 20,
    },
    {
      title: '⏳ Ventana de Emboscada Perfecta',
      badge: 'Giro de Escena · Sigilo',
      text: `Antes de abrir la siguiente puerta desde ${selectedRoomId}, escuchan a los enemigos discutiendo. Si superan Agilidad grupal (AGI CD ${cd}), irrumpen con Sorpresa total: todos los héroes actúan ANTES que Zargon en la primera ronda.`,
    },
    {
      title: '🧪 Suministros Alquímicos Frescos',
      badge: 'Giro de Escena · Alquimia',
      text: `Entre restos de ${missionShort} hallan frascos intactos: cualquier héroe puede intentar destilar una poción aquí mismo por Suerte o Maestría Alquímica (+1 Hierba Lunar encontrada).`,
    },
    {
      title: '🗝️ Apuesta del Explorador (Doble o Nada)',
      badge: 'Giro de Escena · Riesgo',
      text: 'Un compartimento sellado brilla con runas de advertencia. Pueden ignorarlo o arriesgarse (AGI o SUE CD 13): éxito = +45 MO o 1 Poción de Curación; fallo = trampa de dardo (-1 PC) y +1 Reloj del Caos.',
      rewardGold: 45,
    },
    {
      title: '🕯️ Santuario Oculto de Mentor',
      badge: 'Giro de Escena · Bendición',
      text: `Tras un tapiz rasgado en ${selectedRoomId} hallan un pequeño altar de Mentor. Quien rece o descifre la inscripción (MEN CD ${cd}) otorga +1 DC en el próximo ataque a todo el grupo o restaura +1 PM al héroe más agotado.`,
    },
  ];

  const pool = hasBoss
    ? [...bossTwists, ...combatTwists]
    : hasMonsters
    ? combatTwists
    : explorationTwists;
  return pool[Math.floor(Math.random() * pool.length)];
}
