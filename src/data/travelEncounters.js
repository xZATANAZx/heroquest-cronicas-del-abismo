// ============================================================================
// VIAJES: EL VIEJO MUNDO — SISTEMA COMPLETO (Kemo & Heval)
// Se juega ANTES de llegar a cada misión desde la Gran Ciudad hasta la mazmorra.
// ============================================================================

export const TRAVEL_MODES = [
  {
    id: 'intemperie',
    name: 'Intemperie (A pie)',
    icon: '🏕️',
    costPerHero: 0,
    protections: 0,
    capacity: 'Ilimitada',
    dieSides: 4,
    triggerRoll: 4,
    summary: 'Gratis. Lanzas 1D4 de desplazamiento: si sacas un 4, sufres Evento Viaje o Noche (0 Protecciones).',
  },
  {
    id: 'caravana',
    name: 'Caravana',
    icon: '🛒',
    costPerHero: 500,
    protections: 2,
    capacity: 'Hasta 4 héroes',
    dieSides: 6,
    triggerRoll: 6,
    summary: '500 MO c/u. Lanzas 1D6 de desplazamiento (evento con un 6) y dispones de 2 Protecciones para eludir peligros o eventos.',
  },
  {
    id: 'montura',
    name: 'Montura',
    icon: '🐎',
    costPerHero: 500,
    protections: 1,
    capacity: 'Hasta 2 héroes',
    dieSides: 8,
    triggerRoll: 8,
    summary: '500 MO c/u. Lanzas 1D8 de desplazamiento (evento con un 8) y dispones de 1 Protección para eludir peligros o eventos.',
  },
];

export const TRAVEL_TERRAINS = [
  { id: 'camino', label: 'Camino (Línea de puntos)', mod: 0, note: 'Sin penalización.' },
  { id: 'campo', label: 'Campo a través', mod: -1, note: '−1 a la tirada de desplazamiento.' },
  { id: 'rio', label: 'Cruzar Río', mod: -2, note: '−2 a la tirada de desplazamiento.' },
  { id: 'montana', label: 'Cruzar Montaña', mod: -3, note: '−3 a la tirada de desplazamiento.' },
];

export const TRAVEL_MAP_LANDMARKS = [
  { id: 'peligro', icon: '💀', name: 'Peligro', rule: 'Aparecen 1D4 Orcos por héroe en loseta de campo abierto (eludible gastando 1 Protección).' },
  { id: 'batalla', icon: '⚔️', name: 'Batalla', rule: '¡Zona de guerra! Debes rodear esa casilla (no estás preparado).' },
  { id: 'poblado', icon: '🏘️', name: 'Poblado', rule: 'Recuperas PC y PM pagando 5 MO por pasar la noche (evento de ciudad opcional).' },
  { id: 'puente', icon: '🌉', name: 'Puente', rule: 'Peaje obligatorio: 10 MO por cada héroe para cruzar.' },
  { id: 'templo', icon: '⛪', name: 'Templo', rule: 'Lugar sagrado para resucitar héroes caídos (300 MO).' },
  { id: 'ciudad', icon: '🏰', name: 'Gran Ciudad', rule: 'Inicio/fin de misión: tiendas, alquimia, templo y descanso completo por 10 MO (sin pagar recuperas mitad de PC/PM).' },
];

// ============================================================================
// TABLA COMPLETA 1D100 DE EVENTOS VIAJE Y NOCHE (Kemo & Heval — Págs. 2 a 9)
// Cada evento incluye acciones directas con Qué Da / Qué Quita al héroe o grupo.
// ============================================================================
export const KEMO_TRAVEL_EVENTS_D100 = [
  {
    min: 1, max: 10, id: 'kh_01', icon: '🌤️', title: '01–10 · Sin Evento',
    tag: 'Tranquilo',
    text: 'La jornada y la noche transcurren sin incidentes. Los héroes avanzan con tranquilidad hacia su destino.',
    outcomes: [
      { label: '✓ Continuar viaje', target: 'ALL', goldDelta: 0, pcDelta: 0, pmDelta: 0, text: 'Jornada tranquila sin contratiempos en el camino.' },
    ],
  },
  {
    min: 11, max: 11, id: 'kh_11', icon: '🔥', title: '11 · Masacre (Juramento de Venganza)',
    tag: 'Narrativo / Buff',
    text: 'Los Héroes encuentran una carreta en llamas en un claro del bosque. Tira 1D6 por héroe: el más alto reconoce a sus parientes masacrados. Tira 1D6 (1 Goblins, 2 Orcos, 3 Abominaciones, 4 Esqueletos, 5 Zombis, 6 Guerreros del Caos): ese héroe jura Venganza contra ese tipo de monstruo (1 vez por combate puede repetir 1 Escudo Negro al atacarlos).',
    outcomes: [
      { label: '⚔️ Registrar Venganza al Héroe', target: 'ONE', goldDelta: 0, pcDelta: 0, pmDelta: 0, fameDelta: 1, text: 'Juras Venganza contra la raza culpable de la masacre: 1 vez por combate contra ese tipo de monstruo puedes repetir 1 Escudo Negro al atacar.' },
    ],
  },
  {
    min: 12, max: 12, id: 'kh_12', icon: '🔥', title: '12 · Fuego en el Campamento',
    tag: 'Azar / Oro',
    text: 'Un incendio arrasa el campamento. Cada héroe tira 1D6: • 1: Tu oro se funde y pierde la mitad de su valor. • 2–5: Tu oro queda intacto. • 6: ¡Tu oro está intacto y hallas una gema enterrada valorada en 1D6×50 MO!',
    outcomes: [
      { label: '💎 Sacó 6 (+150 MO en Gema)', target: 'ONE', goldDelta: 150, text: '¡Tu oro sobrevivió al incendio y hallaste una piedra preciosa enterrada (+150 MO)!' },
      { label: '✓ Sacó 2–5 (Sin pérdidas)', target: 'ONE', goldDelta: 0, text: 'Lograste salvar todo tu oro de las llamas.' },
      { label: '🔥 Sacó 1 (−50 MO fundidas)', target: 'ONE', goldDelta: -50, text: 'El fuego derritió parte de tus monedas en lingotes deformes (−50 MO).' },
    ],
  },
  {
    min: 13, max: 13, id: 'kh_13', icon: '⛪', title: '13 · Capilla del Camino',
    tag: 'Ofrenda / Bendición',
    text: 'Los Héroes ven una pequeña capilla. Si un héroe ofrenda 20 MO y reza, tira 1D6: • 1–4: Los dioses guardan silencio. • 5–6: ¡Bendición! +1 PC máximo adicional durante las próximas 1D3 misiones.',
    outcomes: [
      { label: '✨ Ofrenda 20 MO — Éxito (5–6: +1 PC y +1 PM)', target: 'ONE', goldDelta: -20, pcDelta: 1, pmDelta: 1, fameDelta: 1, text: 'Ofrendaste 20 MO en la capilla: los dioses responden otorgándote bendición (+1 PC temporal para las próximas misiones).' },
      { label: '🪙 Ofrenda 20 MO — Silencio (1–4)', target: 'ONE', goldDelta: -20, text: 'Dejaste 20 MO en el altar, pero la capilla permanece en silencio.' },
    ],
  },
  {
    min: 14, max: 14, id: 'kh_14', icon: '🌋', title: '14 · Terremoto de Zargon',
    tag: 'Peligro / Ruta',
    text: 'El suelo se abre formando un abismo infranqueable. Tira 1D6: • 1–3: Deben volver al campamento y reiniciar el viaje por otra ruta. • 4–6: Pueden cruzar perdiendo 1D4 PC cada uno (deben abandonar carros/caballos y pasar a Intemperie 1D4).',
    outcomes: [
      { label: '💔 Cruzar el abismo (−2 PC al grupo)', target: 'ALL', pcDelta: -2, text: 'Cruzaron el abismo entre rocas sueltas (−2 PC a cada héroe; pierden monturas/caravana).' },
      { label: '🔄 Rodear por otra ruta (sin daño)', target: 'ALL', pcDelta: 0, text: 'Decidieron rodear la grieta buscando otro camino seguro.' },
    ],
  },
  {
    min: 15, max: 15, id: 'kh_15', icon: '🕵️', title: '15 · Un Extraño en el Camino',
    tag: 'Encuentro / Combate',
    text: 'Un desconocido ofrece 40 MO a cada héroe por viajar escoltado. Tira 1D6: • 1–3: Se pierden y sufren emboscada de 4 Orcos (eludible con 1 Protección), pero al llegar paga las 40 MO c/u. • 4–6: Conoce un atajo, otorga +1 Protección extra y paga 40 MO c/u.',
    outcomes: [
      { label: '💰 Escoltarlo (+40 MO a cada héroe)', target: 'ALL', goldDelta: 40, text: 'El viajero agradecido entrega 40 MO a cada héroe al llegar al destino (y +1 Protección si sacaron 4–6).' },
      { label: '⚔️ Emboscada 4 Orcos (−1 PC y +40 MO)', target: 'ALL', goldDelta: 40, pcDelta: -1, text: 'Tras repeler la emboscada de 4 Orcos en el atajo, el extraño cumple y entrega 40 MO a cada héroe.' },
    ],
  },
  {
    min: 16, max: 16, id: 'kh_16', icon: '🛍️', title: '16 · Vendedora Ambulante',
    tag: 'Comercio',
    text: 'Una vendedora en harapos de colores con un burro ofrece equipo y pociones elaboradas (300 MO c/u).',
    outcomes: [
      { label: '🧪 Comprar Pócima de Curación (−300 MO)', target: 'ONE', goldDelta: -300, items: [{ name: 'Pócima de Curación Ambulante', type: 'Poción', rarity: 'poco_comun', effect: 'Acción gratuita: restaura 4 Puntos de Cuerpo.' }], text: 'Compraste una Pócima de Curación (+4 PC) a la vendedora ambulante por 300 MO.' },
      { label: '✓ Solo mirar y seguir', target: 'ALL', goldDelta: 0, text: 'Escucharon su flauta chillona y continuaron su marcha.' },
    ],
  },
  {
    min: 17, max: 24, id: 'kh_17', icon: '🌤️', title: '17–24 · Sin Evento',
    tag: 'Tranquilo',
    text: 'El camino avanza sin sobresaltos bajo un cielo despejado.',
    outcomes: [
      { label: '✓ Continuar viaje', target: 'ALL', text: 'Jornada despejada y sin peligros.' },
    ],
  },
  {
    min: 25, max: 25, id: 'kh_25', icon: '🌪️', title: '25 · Tornado de Zargon',
    tag: 'Desastre',
    text: 'Un tornado arranca el acantilado. Tira 1D6 por héroe; el más bajo es víctima: • 1: Cae al barranco (−100 MO de sanador en el poblado). • 2: Suelta 1D4×10 MO para agarrarse al borde. • 3–6: Se aferra, pero pierde su arma (queda con 1 DC hasta comprar otra).',
    outcomes: [
      { label: '🌪️ Sacó 1 (−100 MO sanador y −2 PC)', target: 'ONE', goldDelta: -100, pcDelta: -2, text: 'El tornado te lanzó al barranco: pierdes 2 PC y pagas 100 MO al sanador del poblado.' },
      { label: '🪙 Sacó 2 (−30 MO al abismo)', target: 'ONE', goldDelta: -30, text: 'Para no caer al abismo tuviste que soltar tu bolsa (−30 MO).' },
      { label: '⚔️ Sacó 3–6 (Arma perdida)', target: 'ONE', pcDelta: -1, text: 'Lograste aferrarte al borde, pero el tornado se llevó tu arma (quedas con 1 DC hasta equipar otra).' },
    ],
  },
  {
    min: 26, max: 26, id: 'kh_26', icon: '☣️', title: '26 · Plaga en el Poblado',
    tag: 'Enfermedad',
    text: 'Llegan a un poblado en cuarentena. Al salir, cada héroe tira 1D6: • 1: Contrae la plaga (−1 Ataque toda la próxima misión). • 2: Contrae la plaga (−1 Defensa toda la próxima misión). • 3–6: Sano.',
    outcomes: [
      { label: '☣️ Contrajo Plaga (−1 PC / Debilitado)', target: 'ONE', pcDelta: -1, statusAdded: { id: 'plaga_viaje', label: 'Plaga (−1 At/Def)', desc: 'Debilitado por la plaga durante la próxima misión.' }, text: 'Contrajiste la plaga del poblado: sufres −1 Ataque o −1 Defensa durante la próxima misión.' },
      { label: '✓ Sano (3–6)', target: 'ALL', text: '¡Gracias a los Dioses! Ningún héroe contrajo la plaga.' },
    ],
  },
  {
    min: 27, max: 27, id: 'kh_27', icon: '⛓️', title: '27 · Prisionero Noble',
    tag: 'Rescate / Combate',
    text: 'Una banda de mercenarios (1D4 por héroe) arrastra a un noble adinerado. Si lo rescatan (combate en campo abierto), al llevarlo a ciudad les paga 300 MO a cada héroe.',
    outcomes: [
      { label: '👑 Rescatar al Noble (+300 MO c/u y +1 Fama)', target: 'ALL', goldDelta: 300, fameDelta: 1, text: 'Derrotaron a los mercenarios y escoltaron al hijo del noble hasta la ciudad: +300 MO a cada héroe y +1 Fama.' },
      { label: '🚶 Dejarlos pasar (sin combate)', target: 'ALL', text: 'Evitaron la pelea en la colina y continuaron el camino.' },
    ],
  },
  {
    min: 28, max: 28, id: 'kh_28', icon: '🍷', title: '28 · Invitados al Festival',
    tag: 'Hospitalidad',
    text: 'Un pequeño pueblo celebra un festival y agasaja a los héroes con vino y banquete. Al despertar compensan al pueblo con 1D4×10 MO cada uno.',
    outcomes: [
      { label: '🍖 Banquete (+2 PC, +1 PM y −20 MO c/u)', target: 'ALL', goldDelta: -20, pcDelta: 2, pmDelta: 1, text: 'Noche inolvidable de vino y comida: recuperan +2 PC y +1 PM, dejando 20 MO cada uno al pueblo.' },
    ],
  },
  {
    min: 29, max: 30, id: 'kh_29', icon: '🌤️', title: '29–30 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Sin novedades durante la marcha.',
    outcomes: [{ label: '✓ Continuar viaje', target: 'ALL', text: 'Sin incidentes.' }],
  },
  {
    min: 31, max: 31, id: 'kh_31', icon: '🧙‍♀️', title: '31 · Cueva de la Bruja',
    tag: 'Poción Misteriosa',
    text: 'Una bruja en un barranco vende 1 poción por 1D6×10 MO (debe beberse al instante). Tira 1D6: • 1–2: Agonía (−1 Defensa siguiente misión). • 3–4: +1 PC máximo en la siguiente misión. • 5–6: +1 Dado de Defensa en la siguiente misión.',
    outcomes: [
      { label: '✨ Beber Poción — Éxito (3–6: −30 MO, +1 PC/Def)', target: 'ONE', goldDelta: -30, pcDelta: 1, statusAdded: { id: 'bruja_buff', label: 'Poción Bruja (+1 Def/PC)', desc: 'Bono de la bruja para la siguiente misión.' }, text: 'Pagaste 30 MO y el brebaje fortaleció tu cuerpo (+1 PC o +1 DC Defensa para la próxima misión).' },
      { label: '🤢 Beber Poción — Fallo (1–2: −30 MO, −1 Def)', target: 'ONE', goldDelta: -30, pcDelta: -1, statusAdded: { id: 'bruja_debuff', label: 'Agonía (−1 Def)', desc: '−1 Defensa en el siguiente desafío.' }, text: 'El brebaje te quemó por dentro (−30 MO, −1 PC y −1 Defensa en el siguiente desafío).' },
    ],
  },
  {
    min: 32, max: 32, id: 'kh_32', icon: '🌾', title: '32 · Tierras de Hambre',
    tag: 'Caridad',
    text: 'Campesinos hambrientos piden ayuda. Tira 1D6 por héroe: • 1–2: Entregas 20 MO (o 1 tesoro). • 3: Entregas 10 MO. • 4–5: Entregas 1D4×10 MO. • 6: Un anciano te vende una Espada Ancha reluciente por 40 MO.',
    outcomes: [
      { label: '⚔️ Sacó 6: Espada Ancha por 40 MO', target: 'ONE', goldDelta: -40, fameDelta: 1, items: [{ name: 'Espada Ancha del Anciano', type: 'Arma', rarity: 'comun', attack: 3, properties: ['1 Mano'], effect: '3 DC de ataque cuerpo a cuerpo.' }], text: 'Conmovido por tu nobleza, el anciano te entregó su Espada Ancha (3 DC) a cambio de 40 MO.' },
      { label: '🪙 Donar a los campesinos (−20 MO y +1 Fama)', target: 'ALL', goldDelta: -20, fameDelta: 1, text: 'Compartieron 20 MO con los campesinos empobrecidos (+1 Fama).' },
    ],
  },
  {
    min: 33, max: 33, id: 'kh_33', icon: '🌤️', title: '33 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Sin eventos en esta etapa.',
    outcomes: [{ label: '✓ Continuar viaje', target: 'ALL', text: 'Marcha tranquila.' }],
  },
  {
    min: 34, max: 34, id: 'kh_34', icon: '🗺️', title: '34 · Mapa Mal Señalado',
    tag: 'Poblado',
    text: 'El asentamiento estaba mal señalado y llegan a un pequeño pueblo donde pueden comprar equipo y alquimia básica antes de seguir.',
    outcomes: [{ label: '🏘️ Descansar en el poblado (+1 PC)', target: 'ALL', pcDelta: 1, text: 'Se reagruparon en el pequeño poblado (+1 PC) antes de retomar la ruta.' }],
  },
  {
    min: 35, max: 35, id: 'kh_35', icon: '🪞', title: '35 · Piscina de Sueños',
    tag: 'Visión Futura',
    text: 'Un estanque congelado refleja imágenes del futuro. Cada héroe tira 1D6: • 1–3: Sin sentido. • 4–6: ¡Visión del futuro! En la próxima mazmorra puedes ignorar por completo 1 golpe que te alcanzaría.',
    outcomes: [
      { label: '✨ Visión del Futuro (4–6: Ignorar 1 golpe)', target: 'ONE', pmDelta: 1, statusAdded: { id: 'vision_futuro', label: 'Visión (Ignora 1 golpe)', desc: 'Anula 1 ataque enemigo completo en la próxima mazmorra.' }, text: '¡La piscina te concedió una visión! En la próxima mazmorra podrás ignorar 1 golpe enemigo por completo.' },
    ],
  },
  {
    min: 36, max: 36, id: 'kh_36', icon: '⚡', title: '36 · Relámpagos del Caos',
    tag: 'Tormenta',
    text: 'Un rayo morado del Caos impacta al héroe con la tirada más baja (1D6 c/u), derritiendo su armadura (−1 DC Defensa hasta reponer equipo en ciudad).',
    outcomes: [
      { label: '⚡ Impacto de Rayo (−1 PC y −1 Def)', target: 'ONE', pcDelta: -1, statusAdded: { id: 'armadura_derretida', label: 'Armadura Derretida (−1 Def)', desc: '−1 Dado de Defensa hasta reponer equipo en ciudad.' }, text: 'Un rayo morado del Caos impactó tu equipo: −1 PC y −1 Defensa hasta visitar la armería.' },
    ],
  },
  {
    min: 37, max: 40, id: 'kh_37', icon: '🌤️', title: '37–40 · Sin Evento',
    tag: 'Tranquilo',
    text: 'El viaje continúa sin contratiempos.',
    outcomes: [{ label: '✓ Continuar viaje', target: 'ALL', text: 'Sin eventos.' }],
  },
  {
    min: 41, max: 41, id: 'kh_41', icon: '🌫️', title: '41 · Perdidos en la Niebla',
    tag: 'Retraso',
    text: 'Los héroes se pierden y llegan a un poblado no marcado: añade 1 noche extra de viaje (deben tirar de nuevo en la tabla de eventos).',
    outcomes: [{ label: '🌫️ Noche extra de viaje', target: 'ALL', text: 'Se perdieron y debieron acampar una noche extra antes de retomar la senda.' }],
  },
  {
    min: 42, max: 42, id: 'kh_42', icon: '🌊', title: '42 · Diluvio',
    tag: 'Peaje',
    text: 'Las lluvias inundaron la carretera. Pueden pagar 20 MO cada uno a un barquero para cruzar o dar un rodeo.',
    outcomes: [
      { label: '⛵ Pagar barquero (−20 MO c/u)', target: 'ALL', goldDelta: -20, text: 'Pagaron 20 MO cada uno al barquero y cruzaron el lago inundado sin perder tiempo.' },
    ],
  },
  {
    min: 43, max: 43, id: 'kh_43', icon: '👹', title: '43 · Pueblo Saqueado por Orcos',
    tag: 'Combate / Botín',
    text: 'Un pueblo devastado suplica ayuda contra una banda de Orcos (2 por jugador en campo abierto). Si vencen, los aldeanos pagan 100 MO por cada Orco derrotado.',
    outcomes: [
      { label: '⚔️ Defender el pueblo (+200 MO c/u y +1 Fama)', target: 'ALL', goldDelta: 200, fameDelta: 1, text: '¡Heroica defensa! Los aldeanos agradecidos les entregan 200 MO a cada héroe y +1 Fama.' },
    ],
  },
  {
    min: 44, max: 44, id: 'kh_44', icon: '🌤️', title: '44 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Camino despejado.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Sin novedad.' }],
  },
  {
    min: 45, max: 45, id: 'kh_45', icon: '🔀', title: '45 · Encrucijada',
    tag: 'Decisión',
    text: 'El camino se divide en dos. Eligen izquierda o derecha y tiran 1D6: • 1–3: Emboscada de 1D6 Esqueletos en campo abierto. • 4–6: ¡Ruta correcta! Llegan directos.',
    outcomes: [
      { label: '✨ Ruta correcta (4–6: llegan directos)', target: 'ALL', text: '¡Eligieron la senda correcta y acortaron el viaje!' },
      { label: '💀 Emboscada Esqueletos (1–3: −1 PC)', target: 'ALL', pcDelta: -1, text: 'Tomaron el desvío equivocado y combatieron contra esqueletos (−1 PC).' },
    ],
  },
  {
    min: 46, max: 46, id: 'kh_46', icon: '🗡️', title: '46 · Emboscada Goblin Nocturna',
    tag: 'Emboscada',
    text: 'Horda de Goblins embosca el campamento. Tira 1D6 por héroe: • 1: Roban 1 arma y 100 MO. • 2: Roban 100 MO. • 3: Roban 1 objeto. • 4–6: Combate en campo abierto; si vencen recuperan 3D100 MO.',
    outcomes: [
      { label: '💰 Vencen Emboscada (+150 MO al grupo)', target: 'ALL', goldDelta: 150, text: '¡Repelieron a los Goblins y recuperaron el botín robado a otros viajeros (+150 MO c/u)!' },
      { label: '💸 Noqueado (1–2: −100 MO)', target: 'ONE', goldDelta: -100, pcDelta: -1, text: 'Un golpe astuto desde atrás te noqueó: despiertas sin 100 MO.' },
    ],
  },
  {
    min: 47, max: 51, id: 'kh_47', icon: '🌤️', title: '47–51 · Sin Evento',
    tag: 'Tranquilo',
    text: 'El grupo marcha sin novedades.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Sin incidentes.' }],
  },
  {
    min: 52, max: 52, id: 'kh_52', icon: '❄️', title: '52 · Tormenta de Nieve',
    tag: 'Clima',
    text: 'Una ventisca de Zargon obliga a refugiarse en el pueblo más cercano (pueden comprar equipo). Al amainar tiran otro evento (evitable con 1 Protección).',
    outcomes: [{ label: '❄️ Refugiarse en el pueblo', target: 'ALL', text: 'Se resguardaron de la ventisca en un pueblo cercano antes de retomar la marcha.' }],
  },
  {
    min: 53, max: 53, id: 'kh_53', icon: '🌤️', title: '53 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Sin contratiempos.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Camino tranquilo.' }],
  },
  {
    min: 54, max: 54, id: 'kh_54', icon: '🪨', title: '54 · Desprendimiento de Rocas',
    tag: 'Obstáculo',
    text: 'Un derrumbe bloquea el barranco. Pueden pagar 1D4×10 MO cada uno a obreros locales para despejarlo o rodear con otro evento.',
    outcomes: [
      { label: '⛏️ Pagar obreros (−20 MO c/u)', target: 'ALL', goldDelta: -20, text: 'Pagaron 20 MO cada uno para despejar el derrumbe sin perder tiempo.' },
    ],
  },
  {
    min: 55, max: 55, id: 'kh_55', icon: '🛒', title: '55 · Caravana de Carretas',
    tag: 'Atajo / Comercio',
    text: 'Un convoy se dirige al mismo destino: si cada héroe paga 1D6×10 MO pueden subir, ahorrándose el resto del viaje, además de comprar equipo y alquimia.',
    outcomes: [
      { label: '🛒 Subir al convoy (−30 MO c/u · llegan directo)', target: 'ALL', goldDelta: -30, text: 'Pagaron 30 MO cada uno al conductor del convoy y llegaron directo al destino.' },
    ],
  },
  {
    min: 56, max: 60, id: 'kh_56', icon: '🌤️', title: '56–60 · Sin Evento',
    tag: 'Tranquilo',
    text: 'El trayecto avanza sin peligros.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Sin incidentes.' }],
  },
  {
    min: 61, max: 61, id: 'kh_61', icon: '🛡️', title: '61 · Milicia de la Colonia',
    tag: 'Peaje',
    text: 'Mercenarios desconfiados cobran 30 MO por héroe para atravesar su colonia; si se niegan deben rodear (+1 noche de evento extra).',
    outcomes: [
      { label: '🪙 Pagar paso (−30 MO c/u)', target: 'ALL', goldDelta: -30, text: 'Pagaron 30 MO cada uno a la milicia para cruzar sin rodeos.' },
    ],
  },
  {
    min: 62, max: 62, id: 'kh_62', icon: '🏴‍☠️', title: '62 · Bandidos del Camino',
    tag: 'Combate / Peaje',
    text: 'Bandidos exigen 20 MO por héroe. Si deciden luchar, se enfrentan a 1D4 bandidos por héroe en campo abierto.',
    outcomes: [
      { label: '🪙 Pagar a los bandidos (−20 MO c/u)', target: 'ALL', goldDelta: -20, text: 'Entregaron 20 MO cada uno a los bandidos para evitar derramamiento de sangre.' },
      { label: '⚔️ Derrotar a los bandidos (+50 MO c/u)', target: 'ALL', goldDelta: 50, fameDelta: 1, text: '¡Derrotaron a la banda de salteadores y repartieron +50 MO por héroe!' },
    ],
  },
  {
    min: 63, max: 63, id: 'kh_63', icon: '⛺', title: '63 · Campamento de Batalla Orco',
    tag: 'Sigilo / Reconocimiento',
    text: 'Pueden rodear (+1 noche) o infiltrarse (1D6): • 1: Capturados y escapan heridos (−1 PC inicial próxima misión). • 2–4: Pasan desapercibidos. • 5–6: ¡Inteligencia militar! +1 Ataque vs Orcos próxima misión y +100 MO en la próxima ciudad.',
    outcomes: [
      { label: '🎯 Éxito 5–6 (+100 MO y +1 vs Orcos)', target: 'ALL', goldDelta: 100, statusAdded: { id: 'intel_orcos', label: '+1 vs Orcos', desc: '+1 en combate contra Orcos en la próxima misión.' }, text: 'Obtuvieron planos del campamento Orco: +100 MO de la guarnición y ventaja contra Orcos.' },
      { label: '💔 Fallo 1 (−1 PC al grupo)', target: 'ALL', pcDelta: -1, text: 'Fueron descubiertos y lograron escapar heridos (−1 PC para la próxima misión).' },
    ],
  },
  {
    min: 64, max: 64, id: 'kh_64', icon: '🦶', title: '64 · Tropiezo y Tobillo Roto',
    tag: 'Accidente',
    text: 'Tira 1D6 por héroe: el más bajo tropieza con un tronco y se tuerce el tobillo (cuesta 30 MO curarlo en el asentamiento).',
    outcomes: [
      { label: '🩹 Curar tobillo (−30 MO al afectado)', target: 'ONE', goldDelta: -30, pcDelta: -1, text: 'Te torciste el tobillo en la senda (−1 PC y −30 MO para curarlo).' },
    ],
  },
  {
    min: 65, max: 65, id: 'kh_65', icon: '🌤️', title: '65 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Sin novedad.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Sin incidentes.' }],
  },
  {
    min: 66, max: 66, id: 'kh_66', icon: '⛈️', title: '66 · Tormenta Torrencial',
    tag: 'Clima',
    text: 'Una tormenta arrastra parte del equipo del campamento: cada héroe pierde 1 objeto menor o 25 MO en suministros.',
    outcomes: [
      { label: '⛈️ Pérdida de suministros (−25 MO c/u)', target: 'ALL', goldDelta: -25, text: 'La lluvia torrencial arruinó suministros del campamento (−25 MO por héroe).' },
    ],
  },
  {
    min: 67, max: 67, id: 'kh_67', icon: '🍑', title: '67 · Frutas Extrañas Curativas',
    tag: 'Hallazgo',
    text: 'Un árbol oculto da frutos rosados que restauran +1 PC cada uno (cada héroe recoge 1D4 frutas).',
    outcomes: [
      { label: '🍑 Recoger y comer frutas (+2 PC c/u)', target: 'ALL', pcDelta: 2, items: [{ name: 'Fruta Silvestre Curativa', type: 'Poción', rarity: 'comun', effect: 'Acción gratuita: restaura +1 PC.' }], text: 'Comieron frutas curativas (+2 PC) y guardaron 1 fruta extra en su mochila.' },
    ],
  },
  {
    min: 68, max: 68, id: 'kh_68', icon: '🌲', title: '68 · Bosque Interminable',
    tag: 'Retraso',
    text: 'El bosque se extiende sin fin: añade 2 noches adicionales de viaje (tira 2 eventos).',
    outcomes: [{ label: '🌲 2 noches adicionales en el bosque', target: 'ALL', text: 'El denso bosque prolonga la travesía dos noches adicionales.' }],
  },
  {
    min: 69, max: 69, id: 'kh_69', icon: '🪨', title: '69 · Losa de Runas Antiguas',
    tag: 'Prueba de Mente',
    text: 'Un héroe intenta traducir las runas (tira tantos D6 como su Mente; con al menos un 6 las descifra): ¡Bendición de +1 Dado de Ataque en la próxima misión!',
    outcomes: [
      { label: '✨ Tradujo las Runas (+1 DC Ataque)', target: 'ALL', pmDelta: 1, statusAdded: { id: 'runas_viaje', label: 'Bendición Rúnica (+1 At)', desc: '+1 Dado de Ataque en la próxima misión.' }, text: '¡Descifraron la losa rúnica! El grupo recibe +1 Dado de Ataque en la siguiente misión.' },
    ],
  },
  {
    min: 70, max: 70, id: 'kh_70', icon: '🐍', title: '70 · Boa Constrictor del Pantano',
    tag: 'Peligro Mortal',
    text: 'Una serpiente gigante atrapa a un héroe al azar: tira 1D6 repetidamente hasta sacar un 6; por cada tirada sin 6 pierde 1 PC.',
    outcomes: [
      { label: '🐍 Liberarse tras forcejeo (−2 PC)', target: 'ONE', pcDelta: -2, text: 'Lograste zafarte de la boa constrictor del pantano tras sufrir 2 PC de daño.' },
    ],
  },
  {
    min: 71, max: 71, id: 'kh_71', icon: '✨', title: '71 · Brillo de Metal entre la Maleza',
    tag: 'Riesgo / Tesoro',
    text: 'Un héroe divisa algo brillante. Si lo toma tira 1D6: • 1–3: ¡Trampa para osos! (−2 PC y −1 At/Def siguiente misión). • 4–6: ¡Roba 1 Carta de Tesoro positiva garantizada!',
    outcomes: [
      { label: '💎 Éxito 4–6 (+75 MO de tesoro)', target: 'ONE', goldDelta: 75, text: '¡Entre la maleza hallaste un cofre oculto con +75 MO!' },
      { label: '🩸 Trampa para osos 1–3 (−2 PC)', target: 'ONE', pcDelta: -2, statusAdded: { id: 'mano_herida', label: 'Mano Herida (−1 At/Def)', desc: '−1 Ataque y −1 Defensa en la próxima misión.' }, text: '¡Era una trampa para osos! Pierdes 2 PC y sufres −1 At/Def en la próxima misión.' },
    ],
  },
  {
    min: 72, max: 72, id: 'kh_72', icon: '🔨', title: '72 · Reconstruir el Pequeño Pueblo',
    tag: 'Trabajo',
    text: 'Un pueblo pide ayuda tras una tormenta: ganan 10–20 MO cada uno (+1 día de viaje).',
    outcomes: [
      { label: '🔨 Ayudar (+20 MO c/u y +1 Reputación)', target: 'ALL', goldDelta: 20, repDelta: 1, text: 'Ayudaron a reconstruir las casas del pueblo (+20 MO c/u y +1 Reputación).' },
    ],
  },
  {
    min: 73, max: 73, id: 'kh_73', icon: '🕳️', title: '73 · Cueva Misteriosa',
    tag: 'Exploración',
    text: 'Si entran en la cueva tira 1D6: • 1: 1D6 Guerreros del Caos. • 2: 2D6 Goblins. • 3: 1D6 Esqueletos y 1D6 Zombis. • 4: 1D6+4 Orcos. • 5–6: ¡Vacía! Cada héroe halla 1D6×100 MO.',
    outcomes: [
      { label: '👑 Cueva con Tesoro 5–6 (+200 MO c/u)', target: 'ALL', goldDelta: 200, text: '¡La cueva estaba deshabitada y repleta de oro olvidado (+200 MO a cada héroe)!' },
      { label: '⚔️ Limpiar monstruos de la cueva (+100 MO c/u)', target: 'ALL', goldDelta: 100, pcDelta: -1, text: 'Combate en la cueva: derrotaron a los moradores y saquearon +100 MO c/u (−1 PC).' },
    ],
  },
  {
    min: 74, max: 74, id: 'kh_74', icon: '🦜', title: '74 · Pájaros del Paraíso',
    tag: 'Magia',
    text: 'Una bandada mágica irradia energía arcana. Cada lanzador tira 1D6 ≤ su Mente: si pasa, gana +1 PM durante la próxima misión.',
    outcomes: [
      { label: '✨ Sintonizar energía (+1 PM)', target: 'ONE', pmDelta: 1, text: 'El canto mágico de las aves armonizó tu mente: +1 PM para la próxima misión.' },
    ],
  },
  {
    min: 75, max: 77, id: 'kh_75', icon: '🌤️', title: '75–77 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Sin novedades.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Marcha tranquila.' }],
  },
  {
    min: 78, max: 78, id: 'kh_78', icon: '🌿', title: '78 · Encuentro con Dríadas',
    tag: 'Bosque Mágico',
    text: 'Cada héroe tira 1D6: • 1: Castigo (−1 PC varias misiones). • 2–3: −1 Ataque próxima misión. • 4–5: Pasa indemne. • 6: Regalan una Fruta de Dríada (cura TODOS los PC al comerla).',
    outcomes: [
      { label: '🌿 Sacó 6: Fruta de Dríada (Cura Total)', target: 'ONE', items: [{ name: 'Fruta Sagrada de Dríada', type: 'Poción', rarity: 'raro', effect: 'Acción gratuita: restaura TODOS tus Puntos de Cuerpo al máximo.' }], text: 'Impresionaste a las Dríadas y te regalaron su Fruta Sagrada (curación total de PC).' },
      { label: '⚠️ Ofendió a las Dríadas (1–3: −1 PC)', target: 'ONE', pcDelta: -1, text: 'Las Dríadas te castigaron por irrumpir en su claro (−1 PC).' },
    ],
  },
  {
    min: 79, max: 79, id: 'kh_79', icon: '🌤️', title: '79 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Sin incidentes.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Sin novedad.' }],
  },
  {
    min: 80, max: 80, id: 'kh_80', icon: '🧟', title: '80 · Pueblo de los Malditos',
    tag: 'Terror',
    text: 'Un pueblo abandonado infestado de Zombis y Ghouls. Cada héroe tira 1D6: con 6 escapa ileso; con 1–5 sufre arañazos (−1 PC o −4 Movimiento próxima misión).',
    outcomes: [
      { label: '🧟 Escapar arañado (−1 PC)', target: 'ONE', pcDelta: -1, text: 'Lograste huir del pueblo maldito con heridas (−1 PC).' },
    ],
  },
  {
    min: 81, max: 81, id: 'kh_81', icon: '🔥', title: '81 · Incendio Forestal',
    tag: 'Desastre',
    text: 'Un incendio arrasa la zona: añaden 1 día más de viaje rodeando el fuego (+1 tirada de evento).',
    outcomes: [{ label: '🔥 Rodear incendio (+1 día)', target: 'ALL', text: 'Rodearon el incendio forestal perdiendo un día de viaje.' }],
  },
  {
    min: 82, max: 82, id: 'kh_82', icon: '🕯️', title: '82 · Ceremonia Sagrada',
    tag: 'Bendición / Maldición',
    text: 'Interrumpen una ceremonia. Tira 1D6: • 1–4: Maldición (tu próximo 6 en 1D6 cuenta como 1). • 5–6: ¡Éxtasis! Cada héroe recibe un tesoro (+60 MO).',
    outcomes: [
      { label: '🎁 Éxtasis 5–6 (+60 MO a cada héroe)', target: 'ALL', goldDelta: 60, text: 'Los adoradores creen que los dioses los enviaron y entregan +60 MO en reliquias a cada héroe.' },
      { label: '💀 Maldición 1–4', target: 'ALL', statusAdded: { id: 'maldicion_6', label: 'Maldición (Próx. 6 = 1)', desc: 'Tu próximo 6 en 1D6 se convierte en 1.' }, text: 'Los oficiantes lanzaron una maldición sobre el grupo.' },
    ],
  },
  {
    min: 83, max: 83, id: 'kh_83', icon: '🌤️', title: '83 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Sin novedades.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Sin incidentes.' }],
  },
  {
    min: 84, max: 84, id: 'kh_84', icon: '🧚', title: '84 · Cónclave de las Hadas',
    tag: 'Bendición',
    text: 'Bajo una cascada mágica, las hadas otorgan a cada héroe +1D4 PC temporales para la siguiente misión.',
    outcomes: [
      { label: '🧚 Bendición de las Hadas (+2 PC c/u)', target: 'ALL', pcDelta: 2, pmDelta: 1, text: 'Las hadas de la cascada fortalecen al grupo (+2 PC y +1 PM para la próxima misión).' },
    ],
  },
  {
    min: 85, max: 85, id: 'kh_85', icon: '🥕', title: '85 · Jardín Exuberante',
    tag: 'Atajo',
    text: 'Los héroes llenan sus mochilas con vegetales frescos y ganan vigor: ¡pueden saltarse el próximo evento de viaje!',
    outcomes: [
      { label: '🥕 Provisiones frescas (+1 PC y +1 Protección)', target: 'ALL', pcDelta: 1, text: 'Provisiones frescas recuperan +1 PC y les permiten saltarse 1 evento de viaje.' },
    ],
  },
  {
    min: 86, max: 86, id: 'kh_86', icon: '🚧', title: '86 · Estación de Peaje',
    tag: 'Peaje',
    text: 'La milicia cobra 5 MO por cada objeto de equipo/tesoro (o −15 MO estándar). Si no pagan pasan 1 noche encerrados (−1 mov. en la mazmorra).',
    outcomes: [
      { label: '🪙 Pagar peaje (−15 MO c/u)', target: 'ALL', goldDelta: -15, text: 'Pagaron el peaje de la milicia (−15 MO por héroe).' },
    ],
  },
  {
    min: 87, max: 90, id: 'kh_87', icon: '🌤️', title: '87–90 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Tramo tranquilo.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Sin contratiempos.' }],
  },
  {
    min: 91, max: 91, id: 'kh_91', icon: '💀', title: '91 · Campeones de Zargon',
    tag: 'Élite / Botín',
    text: 'Cuatro guerreros oscuros atacan desde el bosque. Tira 1D6 tras resolver: • 1–2: Botín de 1D4×100 MO a repartir. • 3–4: 1 Pergamino mágico al azar. • 5–6: Deben ceder 1 tesoro o luchar en campo abierto.',
    outcomes: [
      { label: '⚔️ Derrotar Campeones (+100 MO c/u y +1 Fama)', target: 'ALL', goldDelta: 100, fameDelta: 1, text: '¡Vencieron a los Campeones de Zargon! Reparten +100 MO c/u y ganan +1 Fama.' },
    ],
  },
  {
    min: 92, max: 92, id: 'kh_92', icon: '🥖', title: '92 · Escasez de Alimentos',
    tag: 'Supervivencia',
    text: 'Cada héroe tira 1D6: con un 1 pierde −1 PC para la próxima misión por hambre.',
    outcomes: [
      { label: '🥖 Sacó 1 (−1 PC por hambre)', target: 'ONE', pcDelta: -1, text: 'La escasez de provisiones te debilita (−1 PC).' },
    ],
  },
  {
    min: 93, max: 93, id: 'kh_93', icon: '🌠', title: '93 · Estrella Fugaz',
    tag: 'Suerte',
    text: 'Tira 1D6 por héroe: el más alto puede repetir 1 tirada de evento de viaje o ciudad cuando lo desee.',
    outcomes: [
      { label: '🌠 Deseo concedido (+1 PM)', target: 'ONE', pmDelta: 1, text: 'Una estrella fugaz ilumina la noche: +1 PM y derecho a repetir 1 tirada de evento.' },
    ],
  },
  {
    min: 94, max: 94, id: 'kh_94', icon: '🌤️', title: '94 · Sin Evento',
    tag: 'Tranquilo',
    text: 'Sin novedades.',
    outcomes: [{ label: '✓ Continuar', target: 'ALL', text: 'Sin incidentes.' }],
  },
  {
    min: 95, max: 95, id: 'kh_95', icon: '🗼', title: '95 · La Torre de la Doncella',
    tag: 'Rescate',
    text: 'Si tienen Herramientas pueden rescatar a la doncella. Al llegar al poblado tira 1D6: • 2–6: Era hija de un noble (+1D6×50 MO a repartir). • 1: ¡Los acusa de secuestro! Multa de 25 MO c/u.',
    outcomes: [
      { label: '👑 Recompensa del Noble (+75 MO c/u y +1 Fama)', target: 'ALL', goldDelta: 75, fameDelta: 1, text: '¡Rescataron a la hija del noble! Reciben +75 MO por héroe y +1 Fama.' },
      { label: '⚖️ Acusación falsa 1 (−25 MO c/u)', target: 'ALL', goldDelta: -25, text: '¡Trampa! Los multaron con 25 MO a cada héroe.' },
    ],
  },
  {
    min: 96, max: 96, id: 'kh_96', icon: '🍄', title: '96 · Setas Salvajes',
    tag: 'Provisiones',
    text: 'Cada héroe seca 1D6 provisiones de setas. Al comerlas recuperan 1D6 PC, pero si sacan un 1 alucinan y pierden 1D3 PM.',
    outcomes: [
      { label: '🍄 Guardar Setas Salvajes en mochila', target: 'ALL', items: [{ name: 'Setas Salvajes Secas', type: 'Poción', rarity: 'comun', effect: 'Cura 1D6 PC al comerlas (si sale 1, pierdes 1D3 PM por alucinaciones).' }], text: 'Secaron setas silvestres al sol y las guardaron como provisiones.' },
    ],
  },
  {
    min: 97, max: 97, id: 'kh_97', icon: '🗿', title: '97 · Obelisco Arcano',
    tag: 'Poder Mágico',
    text: 'Un destello del obelisco imbuye al grupo: al inicio de la siguiente misión pueden mirar las 4 cartas superiores del mazo de Tesoros/Eventos y ordenarlas a su gusto.',
    outcomes: [
      { label: '✨ Poder del Obelisco (+1 PM c/u)', target: 'ALL', pmDelta: 1, text: 'El obelisco les concede +1 PM y la capacidad de ordenar las 4 cartas superiores del mazo en la próxima misión.' },
    ],
  },
  {
    min: 98, max: 98, id: 'kh_98', icon: '💀', title: '98 · Mal Olor en la Maleza',
    tag: 'Hallazgo',
    text: 'Tira 1D6: • 1–4: Pueblo saqueado por el Caos; rescatan al niño superviviente (+1 noche extra). • 5–6: Campo de batalla con Orcos caídos: cada héroe saquea 1D10×20 MO.',
    outcomes: [
      { label: '💰 Campo de batalla 5–6 (+100 MO c/u)', target: 'ALL', goldDelta: 100, text: 'Entre los restos del campo de batalla orco recogieron +100 MO cada uno.' },
      { label: '🕊️ Rescatar al niño 1–4 (+1 Fama)', target: 'ALL', fameDelta: 1, text: 'Escoltaron al niño superviviente hasta un lugar seguro (+1 Fama).' },
    ],
  },
  {
    min: 99, max: 99, id: 'kh_99', icon: '👻', title: '99 · Fantasma Arrepentido',
    tag: 'Adivinanza',
    text: 'El DM tira 1D6 y un héroe apuesta si sacará más alto o más bajo. Si acierta el espectro descansa; si falla, el terror impide buscar trampas en la siguiente misión.',
    outcomes: [
      { label: '✨ Acertó (+1 PM al héroe)', target: 'ONE', pmDelta: 1, text: 'Aplacaste al espectro de Ollar y recuperas +1 PM.' },
      { label: '👻 Falló (Terror en la próxima misión)', target: 'ALL', pmDelta: -1, text: 'El frenesí del fantasma aterrorizó al grupo (−1 PM; no podrán buscar trampas en la próxima misión).' },
    ],
  },
  {
    min: 100, max: 100, id: 'kh_100', icon: '🏰', title: '100 · Bastión del Bandido Proscrito',
    tag: 'Evento Épico',
    text: 'Hallan una fortaleza oculta. Tira 2D6: • 2–3: Capturados y despojados (−1 Ataque). • 4–5: Roban oro y liberan. • 6–8: Huyen con 1D6×50 MO. • 9–12: Combate vs bandidos + Guerrero del Terror: ¡si vencen ganan 1000 MO!',
    outcomes: [
      { label: '👑 Victoria Épica 9–12 (+250 MO c/u y +2 Fama)', target: 'ALL', goldDelta: 250, fameDelta: 2, text: '¡Tomaron el Bastión del Bandido y derrotaron al Guerrero del Terror! Reparten 1000 MO (+250 MO c/u) y +2 Fama.' },
      { label: '💰 Escape con botín 6–8 (+100 MO c/u)', target: 'ALL', goldDelta: 100, text: 'Huyeron del bastión llevándose +100 MO por héroe de botín.' },
      { label: '💔 Emboscada 2–5 (−50 MO y −1 PC)', target: 'ALL', goldDelta: -50, pcDelta: -1, text: 'Los bandidos superaron al grupo en número (−50 MO y −1 PC).' },
    ],
  },
];

export function rollKemoTravelEvent() {
  const roll = Math.floor(Math.random() * 100) + 1;
  const found =
    KEMO_TRAVEL_EVENTS_D100.find((e) => roll >= e.min && roll <= e.max) ||
    KEMO_TRAVEL_EVENTS_D100[0];
  return { roll, event: found };
}

export function pickRandomTravelEncounter() {
  return rollKemoTravelEvent().event;
}
