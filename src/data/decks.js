// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// Los 5 Mazos Interactivos: Malvado Brujo, Eventos, Mobiliario, Tesoros/Trampas y Viajes/Ciudad
// ============================================================================

export const EVIL_WIZARD_DECK = [
  // Mezcla táctica HQ-D20 v2 + Hechizos del Terror Oficiales (Base + La Luna del Terror)
  { id: 'ew1', title: 'Emboscada en las Sombras', type: 'Instantánea', rarity: 'Común', text: 'Coloca 2 Goblins (o 1 Orco) fuera de la línea de visión de los héroes. Mueven y atacan inmediatamente.' },
  { id: 'ew2', title: 'Bola en Llamas (Hechizo del Terror)', type: 'Guardar', rarity: 'Inusual', text: 'Envuelve a un héroe visible en llamas: sufre 2 PC (tira 2 Dados Rojos o AGI CD 13: cada 5–6 reduce 1 daño).' },
  { id: 'ew3', title: 'Grito de Guerra del Caos', type: 'Guardar', rarity: 'Común', text: 'Al inicio del turno de Zargon: todos los monstruos visibles ganan +1 DC Ataque pero defienden con -1 DC esta ronda.' },
  { id: 'ew4', title: 'Nube de Terror (Hechizo del Terror)', type: 'Guardar', rarity: 'Rara', text: 'Paraliza a todos los héroes de la sala actual (no mueven ni atacan). Se liberan con MEN CD 13 o sacando 6 con tantos d6 como PM.' },
  { id: 'ew5', title: 'Oxidación (Hechizo del Terror)', type: 'Guardar', rarity: 'Inusual', text: 'Un arma o escudo no-artefacto sufre -1 DC hasta que gasten 1 acción en limpiarlo o lo reparen en Herrería (FUE CD 13 evita).' },
  { id: 'ew6', title: 'Frenesí Sangriento', type: 'Guardar', rarity: 'Común', text: 'Un monstruo que acaba de recibir daño realiza un contraataque gratuito inmediato contra un héroe adyacente.' },
  { id: 'ew7', title: 'Luces del Terror (Luna del Terror)', type: 'Guardar', rarity: 'Inusual', text: 'Rodea a un héroe en haces fantasmales: todos los monstruos tiran +1 DC Ataque contra él hasta sacar 5–6 en 1d6 al iniciar su turno.' },
  { id: 'ew8', title: 'Canalizar el Terror (Luna del Terror)', type: 'Instantánea', rarity: 'Común', text: 'Tira 1d6 (+1 por cada monstruo adyacente al lanzador): 4–5 = 1 PC; 6+ = 2 PC a un héroe en Línea de Visión.' },
  { id: 'ew9', title: 'Invocar Muertos Vivientes', type: 'Instantánea', rarity: 'Inusual', text: 'De las sombras o tumbas cercanas se alzan 2 Esqueletos y 1 Zombi en la sala o pasillo más próximo.' },
  { id: 'ew10', title: 'Dominación (Hechizo del Terror)', type: 'Guardar', rarity: 'Rara', text: 'Elige un héroe visible: debe superar MEN CD 13 o Zargon lo mueve 3 casillas y le obliga a atacar a un compañero.' },
  { id: 'ew11', title: 'Piel de Hierro Oscuro', type: 'Guardar', rarity: 'Común', text: 'Un monstruo de tu elección gana +2 Dados de Defensa durante el resto de la ronda.' },
  { id: 'ew12', title: 'Miedo (Hechizo del Terror)', type: 'Guardar', rarity: 'Inusual', text: 'El héroe con menos PM entra en pánico y solo ataca con 1 DC hasta superar MEN CD 13 o sacar 6 con tantos d6 como PM.' },
  { id: 'ew13', title: 'Campeón Emergente', type: 'Guardar', rarity: 'Rara', text: 'Asciende a un monstruo recién revelado a su versión ÉLITE (+2 PC, +1 Atq, +1 Def y Habilidad Élite).' },
  { id: 'ew14', title: 'Rayo Mortífero (Hechizo del Terror)', type: 'Guardar', rarity: 'Rara', text: 'Línea recta horizontal, vertical o diagonal hasta pared/puerta: 2 PC a todos en el camino (AGI CD 13 reduce a 1 PC).' },
  { id: 'ew15', title: 'Invocar Espectros (Luna del Terror)', type: 'Instantánea', rarity: 'Rara', text: 'Tira 1 Dado Rojo: 1–3 = 1 Espectro Etéreo; 4–6 = 2 Espectros Etéreos junto al héroe más alejado.' },
  { id: 'ew16', title: 'Presagio de la Luna Roja', type: 'Instantánea', rarity: 'Rara', text: 'Durante las próximas 2 rondas, los monstruos defienden con Escudos Blancos en lugar de Escudos Negros.' },
];

export const DUNGEON_EVENTS_DECK = [
  { id: 'ev1', title: 'Temblor Subterráneo', severity: 'Peligro', text: 'La mazmorra tiembla violentamente (Techo Inestable temporal). Todos los héroes salvan AGI CD 12 o caen derribados (pierden mitad de movimiento). 1 casilla aleatoria se derrumba.' },
  { id: 'ev2', title: 'Antorchas Apagadas', severity: 'Tensión', text: 'Una ráfaga helada extingue las luces durante 2 rondas. Héroes sin Visión en la Oscuridad atacan y buscan con Desventaja.' },
  { id: 'ev3', title: 'Patrulla Errante', severity: 'Combate', text: '¡Pasos en la oscuridad! Aparece una patrulla del bioma actual en estado PATRULLA (2 monstruos Fácil o 1 Medio) entrando por la escalera o pasillo trasero.' },
  { id: 'ev4', title: 'Mercader Fantasmal', severity: 'Oportunidad', text: 'Un mercader encapuchado aparece en una esquina segura. Vende 2 pociones o 2 Materiales de Crafteo al 50% de descuento, o compra botín al instante.' },
  { id: 'ev5', title: 'Eco de los Antiguos', severity: 'Beneficio', text: 'Una melodía ancestral calma la sala. Todos los héroes recuperan 1 PM y ganan Ventaja en su próxima tirada.' },
  { id: 'ev6', title: 'Bruma Venenosa', severity: 'Peligro', text: 'Gas verdoso brota de las grietas durante 1 ronda. Quien no supere FUE CD 12 sufre 1 PC de veneno. Un Alquimista o Herbolario puede recolectar 1 Glándula de Veneno.' },
  { id: 'ev7', title: 'Prisionero Sobreviviente', severity: 'Rol / Decisión', text: 'Encuentran a un explorador herido. Si gastan 1 poción, Ración o MEN CD 12 para salvarlo, revela 1 puerta secreta o trampa cercana y otorga +1 🏅 Reputación.' },
  { id: 'ev8', title: 'Vientos de la Magia Desatados', severity: 'Caos', text: 'Durante 2 rondas todos los hechizos lanzan +1 DC adicional, pero sacar 1 Natural quema 1 PM al lanzador y sube +1 el Reloj del Caos.' },
  { id: 'ev9', title: 'Canto de la Reina de los Espíritus', severity: 'Terror', text: 'Un lamento espectral recorre los muros. Todos los monstruos en la sala siguiente ganan el rasgo Espíritu (atacan PM) durante 1 turno. Al vencerlos dejan +1 Esencia Espectral.' },
  { id: 'ev10', title: 'Alijo de Contrabandistas', severity: 'Beneficio', text: 'Una losa suelta esconde 60 MO, 1 Hierba Lunar y 1 Acero Templado listos para crafteo.' },
  { id: 'ev11', title: 'Ojo de Zargon', severity: 'Tensión', text: 'Zargon observa cada paso: roba inmediatamente 2 cartas del Mazo del Malvado Brujo.' },
  { id: 'ev12', title: 'Fuente de Agua Pura', severity: 'Beneficio', text: 'Un manantial subterráneo permite a cada héroe beber y recuperar 2 PC (1 vez por héroe) y limpiar Veneno.' },
];

export const FURNITURE_TYPES = [
  'Todos',
  'Genérico',
  'Altar del Mago',
  'Armario',
  'Armería',
  'Banco de Alquimista',
  'Biblioteca',
  'Chimenea',
  'Cofre',
  'Mesa',
  'Potro de Tortura',
  'Trono',
  'Tumba',
];

export const FURNITURE_DECK = [
  // Específicas por mueble
  { id: 'f1', furniture: 'Altar del Mago', title: 'Bendición Arcana', type: 'Beneficio', text: 'El altar irradia energía pura. Prueba MEN CD 12: recuperas 1 hechizo ya gastado o +2 PM.' },
  { id: 'f2', furniture: 'Altar del Mago', title: 'Maldición del Grimorio', type: 'Peligro', text: 'El libro abierto te susurra secretos prohibidos. Salva MEN CD 13 o pierdes 1 PM; si resistes obtienes +1 Polvo Rúnico.' },
  { id: 'f3', furniture: 'Armario', title: 'Fondo Falso', type: 'Tesoro', text: 'Prueba MEN CD 12: encuentras una Capa de Viaje (+1 Sigilo) y 20 MO.', rewardGold: 20 },
  { id: 'f4', furniture: 'Armario', title: '¡Araña Oculta!', type: 'Combate', text: 'Al abrir las puertas salta una Araña Gigante directamente frente a ti (inicia con sorpresa si fallas AGI CD 12).' },
  { id: 'f5', furniture: 'Armería', title: 'Acero Bien Templado', type: 'Tesoro', text: 'Encuentras +1 Acero Templado (Crafteo), 1 Daga Arrojadiza y una piedra de afilar (+1 DC en tu próximo ataque).' },
  { id: 'f6', furniture: 'Armería', title: 'Trampa de Ballesta', type: 'Trampa', text: 'Un hilo tensado dispara un virote. Salva AGI CD 13 o recibe 2 DC de daño. Si la desarmas ganas +1 Pólvora Negra.' },
  { id: 'f7', furniture: 'Banco de Alquimista', title: 'Ingredientes Puros (Crafteo)', type: 'Alquimia', text: 'Encuentras 2 Hierbas Lunares y 1 Polvo Rúnico. Con MEN CD 12 puedes destilar inmediatamente 1 Poción de Curación Menor o Antídoto gratis.' },
  { id: 'f8', furniture: 'Banco de Alquimista', title: 'Reacción Inestable', type: 'Peligro', text: 'Un matraz burbujea violentamente. Salva AGI CD 12 para apartarte o sufre 1 PC de daño ácido (y +1 Reloj del Caos).' },
  { id: 'f9', furniture: 'Biblioteca', title: 'Mapa de Pasadizos', type: 'Beneficio', text: 'Entre tomos polvorientos hallas planos de la fortaleza: el DM te revela la ubicación de 1 puerta secreta o trampa en el tablero.' },
  { id: 'f10', furniture: 'Biblioteca', title: 'Pergamino Antiguo', type: 'Tesoro', text: 'Encuentras un Pergamino de Hechizo de Nivel 1 aleatorio (puede usarlo cualquier héroe una vez).' },
  { id: 'f11', furniture: 'Chimenea', title: 'Brasas Ocultas', type: 'Tesoro', text: 'Tras los ladrillos ennegrecidos hay una bolsita ignífuga con 35 MO.', rewardGold: 35 },
  { id: 'f12', furniture: 'Chimenea', title: 'Humo Sofocante', type: 'Peligro', text: 'Al remover las cenizas, una nube tóxica llena tus pulmones. Salva FUE CD 12 o toses sin control (-1 DC el próximo turno).' },
  { id: 'f13', furniture: 'Cofre', title: '¡Cofre Mímico!', type: 'Combate', text: '¡El cofre abre una boca llena de dientes! Sustituye el cofre por un Mímico de Cofre que ataca inmediatamente.' },
  { id: 'f14', furniture: 'Cofre', title: 'Botín de Veterano', type: 'Tesoro', text: 'Dentro hallas 45 MO y 1 Poción de Curación Menor.', rewardGold: 45 },
  { id: 'f15', furniture: 'Mesa', title: 'Táctica: Cobertura o Altura', type: 'Táctico', text: 'Encuentras 10 MO y cartas enemigas. Recuerda: puedes VOLCAR la mesa (acción gratuita FUE CD 11) para crear cobertura (+1 Def vs proyectiles) o SUBIRTE (+1 movimiento) para Ventaja de altura.', rewardGold: 10 },
  { id: 'f16', furniture: 'Potro de Tortura', title: 'Llaves del Carcelero', type: 'Beneficio', text: 'Un manojo de llaves oxidadas te da Ventaja en tus próximas 2 pruebas de Desarmar Trampas o abrir cerraduras.' },
  { id: 'f17', furniture: 'Potro de Tortura', title: 'Eco de Sufrimiento', type: 'Terror', text: 'Una visión macabra golpea tu mente. Salva MEN CD 13 o pierdes 1 PM.' },
  { id: 'f18', furniture: 'Trono', title: 'Compartimento Real', type: 'Tesoro', text: 'Bajo el reposabrazos oculto encuentras un anillo de oro (55 MO) y 1 Polvo Rúnico.', rewardGold: 55 },
  { id: 'f19', furniture: 'Trono', title: 'Aura de Tiranía', type: 'Peligro', text: 'Sentarse o tocar el trono dispara una descarga oscura: salva FUE CD 13 o sufre 2 DC de daño.' },
  { id: 'f20', furniture: 'Tumba', title: 'Descanso Perturbado', type: 'Combate', text: 'La lápida se desliza con un chirrido y emerge 1 Esqueleto (o 1 Espectro si es nivel 4+) en una casilla adyacente.' },
  { id: 'f21', furniture: 'Tumba', title: 'Reliquia del Héroe Caído', type: 'Tesoro', text: 'Un antiguo paladín sostiene un amuleto bendito (+1 salvaciones contra No Muertos) y 60 MO.' },
  // Genéricas (aplican a cualquier mueble)
  { id: 'f22', furniture: 'Genérico', title: 'Bolsita Olvidada', type: 'Tesoro', text: 'Encuentras 1d6 x 10 monedas de oro escondidas en una rendija.' },
  { id: 'f23', furniture: 'Genérico', title: 'Trampa de Aguja Envenenada', type: 'Trampa', text: '¡Pinchazo! Salva FUE CD 13 o sufres 1 PC de daño y quedas Envenenado (-1 DC hasta curarte).' },
  {
    id: 'f24',
    furniture: 'Genérico',
    title: 'Raciones y Vendas',
    type: 'Beneficio',
    text: 'Material de curación útil: recuperas 1 PC inmediatamente o mandas la Venda de Campaña (+1 PC) al inventario del héroe para usarla después.',
    rewardLoot: {
      name: 'Venda de Campaña (+1 PC)',
      type: 'Poción',
      rarity: 'comun',
      dice: '+1 PC',
      upgrade: 'Acción gratuita: aplica la venda para recuperar 1 PC y detener sangrado.',
      special: 'Consumible: restaura 1 PC.',
      restriction: 'Todas las clases',
    },
  },
  { id: 'f25', furniture: 'Genérico', title: 'Ruido Delator', type: 'Tensión', text: 'El mueble cruje y cae con estruendo. No encuentras nada y el Reloj del Caos sube +1.' },
];

export const TREASURE_TRAP_DECK = [
  // Mazo Oficial HeroQuest 2021 + Alquimia de La Luna del Terror adaptado a HQ-D20 v2
  { id: 't_gema_1', title: '¡Gema! (35 MO)', kind: 'Tesoro', returnToDeck: false, rewardGold: 35, text: 'Escondida en la puntera de una vieja bota encuentras una pequeña Gema que vale 35 Monedas de Oro. (No vuelve al mazo).' },
  { id: 't_gema_2', title: '¡Gema! (35 MO)', kind: 'Tesoro', returnToDeck: false, rewardGold: 35, text: 'Entre escombros brilla una Gema tallada valorada en 35 Monedas de Oro. (No vuelve al mazo).' },
  { id: 't_oro_15_1', title: '¡Oro! (15 MO)', kind: 'Tesoro', returnToDeck: false, rewardGold: 15, text: 'Entre viejos trapos y mantas sucias encuentras 15 Monedas de Oro. (No vuelve al mazo).' },
  { id: 't_oro_15_2', title: '¡Oro! (15 MO)', kind: 'Tesoro', returnToDeck: false, rewardGold: 15, text: 'Junto a una antorcha caída hallas una bolsita con 15 Monedas de Oro. (No vuelve al mazo).' },
  { id: 't_oro_25_1', title: '¡Oro! (25 MO)', kind: 'Tesoro', returnToDeck: false, rewardGold: 25, text: 'Arrancas una piedra suelta de la pared y descubres 25 Monedas de Oro envueltas en cuero. (No vuelve al mazo).' },
  { id: 't_oro_25_2', title: '¡Oro! (25 MO)', kind: 'Tesoro', returnToDeck: false, rewardGold: 25, text: 'Bajo una tabla floja encuentras una bolsa con 25 Monedas de Oro. (No vuelve al mazo).' },
  { id: 't_joyas_1', title: '¡Joyas! (50 MO)', kind: 'Tesoro', returnToDeck: false, rewardGold: 50, text: 'Un pequeño cofre forrado de terciopelo guarda joyas antiguas por valor de 50 Monedas de Oro. (No vuelve al mazo).' },
  { id: 't_joyas_2', title: '¡Joyas! (50 MO)', kind: 'Tesoro', returnToDeck: false, rewardGold: 50, text: 'Encuentras un broche imperial incrustado con gemas valorado en 50 Monedas de Oro. (No vuelve al mazo).' },
  { id: 't_poc_heroica', title: 'Poción Heroica', kind: 'Tesoro', returnToDeck: false, text: 'Bolsa de cuero en la pared: bébela antes de atacar para hacer DOS ataques en lugar de uno (1 uso).', rewardLoot: { name: 'Poción Heroica', type: 'Poción', rarity: 'poco_comun', dice: '2 Ataques', upgrade: 'Haz 2 ataques con arma en este turno.', special: '1 uso.' } },
  { id: 't_poc_defensa', title: 'Poción de Defensa', kind: 'Tesoro', returnToDeck: false, text: 'Frasco transparente: bébelo en cualquier momento para tirar +2 Dados de Combate adicionales en tu próxima defensa (1 uso).', rewardLoot: { name: 'Poción de Defensa', type: 'Poción', rarity: 'poco_comun', dice: '+2 DC Def', upgrade: '+2 DC en tu próxima defensa.', special: '1 uso.' } },
  { id: 't_poc_fuerza', title: 'Poción de Fuerza', kind: 'Tesoro', returnToDeck: false, text: 'Frasco púrpura: bébelo en cualquier momento para tirar +2 Dados de Combate adicionales en tu próximo ataque (1 uso).', rewardLoot: { name: 'Poción de Fuerza', type: 'Poción', rarity: 'poco_comun', dice: '+2 DC Atq', upgrade: '+2 DC en tu próximo ataque.', special: '1 uso.' } },
  { id: 't_poc_cur_1', title: 'Poción Curativa (+1d6 PC)', kind: 'Tesoro', returnToDeck: false, text: 'Botella de líquido azulado: bébela en cualquier momento para restaurar 1 Dado Rojo de Puntos Corporales (1 uso).', rewardLoot: { name: 'Poción Curativa', type: 'Poción', rarity: 'comun', dice: '+1d6 PC', upgrade: 'Restaura 1d6 PC (evita morir a 0 PC).', special: '1 uso.' } },
  { id: 't_poc_cur_2', title: 'Poción Curativa (+1d6 PC)', kind: 'Tesoro', returnToDeck: false, text: 'En un fardo de harapos encuentras una Poción Curativa (+1 Dado Rojo de PC).', rewardLoot: { name: 'Poción Curativa', type: 'Poción', rarity: 'comun', dice: '+1d6 PC', upgrade: 'Restaura 1d6 PC (evita morir a 0 PC).', special: '1 uso.' } },
  { id: 't_flor_misteriosa', title: 'Flor Misteriosa (Alquimia)', kind: 'Alquimia', returnToDeck: false, text: 'Planta élfica comestible: consúmela para recuperar +1 PC al instante O guárdala como +1 Hierba Lunar para Crafteo.' },
  { id: 't_planta_sagrada', title: 'Planta Sagrada (Alquimia)', kind: 'Alquimia', returnToDeck: false, text: 'Hierba medicinal élfica: consúmela para recuperar +1 PM al instante O guárdala como +1 Polvo Rúnico para Crafteo.' },
  { id: 't_ingrediente_desc', title: 'Ingrediente Desconocido', kind: 'Alquimia', returnToDeck: false, text: 'Esencia molida en polvo fino: guárdala como +1 Esencia Espectral para Crafteo o destila 1 Poción aleatoria del Mazo de Alquimia.' },
  { id: 't_agua_bendita', title: 'Agua Bendita', kind: 'Tesoro', returnToDeck: false, text: 'Frasco sagrado: mata al instante a un Esqueleto, Zombi o Momia (o causa 3 DC mágicos a Jefes No Muertos).', rewardLoot: { name: 'Agua Bendita', type: 'Poción', rarity: 'raro', dice: 'Mata No Muerto', upgrade: 'Destruye No Muerto común o 3 DC mágicos a Jefes.', special: '1 uso.' } },
  // Peligros y Trampas oficiales (vuelven al fondo del mazo)
  { id: 't_pel_foso_1', title: '¡Peligro! Foso Oculto', kind: 'Trampa', returnToDeck: true, text: 'El suelo cede bajo tus pies: pierdes 1 PC y termina tu turno (AGI CD 13 evita el daño). Vuelve al fondo del mazo.' },
  { id: 't_pel_flecha_1', title: '¡Peligro! Flecha Oculta', kind: 'Trampa', returnToDeck: true, text: 'Una flecha oculta sale disparada de la pared: pierdes 1 PC y termina tu turno (AGI CD 13 evita). Vuelve al fondo del mazo.' },
  { id: 't_veneno', title: '¡Veneno!', kind: 'Trampa', returnToDeck: true, text: 'Probar el frasco te retuerce la garganta: tira 1 DC (si sacas Calavera pierdes 1 PM). Vuelve al fondo del mazo.' },
  { id: 't_errante_1', title: 'Monstruo Errante', kind: 'Peligro', returnToDeck: true, text: '¡Emboscada! Zargon coloca el Monstruo Errante de esta Misión en una casilla adyacente y ataca inmediatamente. Vuelve al fondo del mazo.' },
  { id: 't_errante_2', title: 'Monstruo Errante', kind: 'Peligro', returnToDeck: true, text: '¡Un enemigo te acecha desde las sombras! El Monstruo Errante de la Misión ataca al instante. Vuelve al fondo del mazo.' },
  { id: 't_errante_3', title: 'Monstruo Errante', kind: 'Peligro', returnToDeck: true, text: '¡Ruido tras la esquina! Aparece el Monstruo Errante de esta Misión junto a ti y ataca inmediatamente. Vuelve al fondo del mazo.' },
  { id: 't_nada', title: '¡Nada!', kind: 'Vacío', returnToDeck: true, text: 'A pesar de tu búsqueda minuciosa, solo encuentras polvo y telarañas.' },
];

export const TRAVEL_DECK = [
  { id: 'tr1', title: 'Emboscada de Bandidos en el Camino', biome: 'Bosque / Camino', test: 'MEN CD 13', success: 'Detectan la emboscada a tiempo, ahuyentan a los bandidos y recuperan 25 MO + 1 Acero Templado.', fail: 'Cada héroe pierde 1 PC o paga 15 MO de peaje para evitar el combate.' },
  { id: 'tr2', title: 'Caravana de Mercaderes Enanos', biome: 'Montaña / Camino', test: 'SUE CD 12', success: 'Descuento del 15% en tu primera compra de Ciudad y +1 Pólvora Negra de regalo.', fail: 'Viajan escoltados a salvo hasta las murallas (+1 PC recuperado).' },
  { id: 'tr3', title: 'Tormenta de la Luna del Terror', biome: 'Cualquiera', test: 'MEN CD 13', success: 'Encuentran refugio seco, recuperan PC/PM y hallan 1 Hierba Lunar en la cueva.', fail: 'Llegan agotados a la Ciudad (la posada cuesta +5 MO extra por secar el equipo).' },
  { id: 'tr4', title: 'Santuario Abandonado de Mentor', biome: 'Ruinas', test: 'MEN CD 12', success: 'Bendición del santuario: el grupo gana +1 Polvo Rúnico y Ventaja en su primera tirada de la próxima misión.', fail: 'Descansan seguros una noche sin incidentes (+1 PC).' },
  { id: 'tr5', title: 'Puente Derrumbado', biome: 'Río / Barranco', test: 'FUE CD 13', success: 'Cruzan ágilmente y rescatan un cofre atascado en las rocas (30 MO).', fail: 'Pierden horas dando rodeo; el Reloj del Caos de la próxima misión empieza en 2.' },
  { id: 'tr6', title: 'Lobo Herido en Cepo', biome: 'Bosque', test: 'Medicina o MEN CD 12', success: 'Lo curan: el lobo los guía por un atajo seguro (+30 XP a todos y +1 Ración de Mazmorra).', fail: 'El lobo logra soltarse y huye al bosque sin causar daño.' },
  { id: 'tr7', title: 'Niebla de los Espíritus', biome: 'Pantano / Bosque', test: 'Mente MEN CD ', success: 'Resisten las visiones de Silvana y recogen 1 Esencia Espectral condensada.', fail: 'Quien falle llega turbado (-1 PM al empezar la próxima misión si no descansa en Posada).' },
  { id: 'tr8', title: 'Posada del Jabalí Dorado', biome: 'Aldea del Camino', test: 'Ninguna (Rol)', success: 'Por 10 MO por héroe cenan caliente, recuperan PC/PM completos y oyen un rumor sobre trampas de la siguiente misión.', fail: 'Acampar fuera es gratis pero solo recupera 1 PC.' },
  { id: 'tr9', title: 'Carreta de Alquimista Volcada', biome: 'Camino Real', test: 'Investigación o FUE CD 12', success: 'Ayudan a levantar la carreta: el alquimista regala 1 Poción de Curación Menor y 1 Hierba Lunar.', fail: 'Un frasco se rompe derramando humo ácido (AGI CD 12 o 1 PC).' },
  { id: 'tr10', title: 'Puesto de Peaje Imperial', biome: 'Puertas de la Ciudad', test: 'SUE CD 12 (o Fama ≥ 3)', success: 'Los guardias los reconocen como héroes: pasan gratis y les entregan +15 MO de recompensa por informes.', fail: 'Pagan 10 MO de peaje entre el grupo para entrar sin retrasos.' },
];

export const CITY_EVENTS = [
  { roll: '01-15', title: 'Festival del Imperio', effect: 'Las tabernas celebran sus hazañas: hospedaje gratis y +1 PC temporal para la próxima misión.' },
  { roll: '16-30', title: 'Carterista en el Mercado', effect: 'Cada héroe hace MEN CD 13; quien falle pierde 1d6 x 10 MO.' },
  { roll: '31-45', title: 'Subasta del Alquimista', effect: 'Todas las pociones y materiales de crafteo tienen un 25% de descuento en esta visita.' },
  { roll: '46-60', title: 'Entrenamiento en el Cuartel', effect: 'Por 100 MO, un héroe entrena con veteranos y gana +100 XP instantáneos.' },
  { roll: '61-75', title: 'Encargo del Gremio', effect: 'Si completan la próxima misión sin que ningún héroe caiga a 0 PC, reciben +150 MO de bonificación.' },
  { roll: '76-90', title: 'Rumor de Reliquia', effect: 'Un anciano les dibuja un mapa: en la próxima misión pueden repetir 1 búsqueda de tesoro.' },
  { roll: '91-100', title: 'Bendición de la Catedral', effect: 'Un sacerdote bendice sus armas: +1 DC contra No Muertos y Espectros durante toda la próxima misión.' },
];

export const MERCENARIES = [
  // Mercenarios Élficos Oficiales (La Luna del Terror)
  { id: 'elf_exploradora', name: 'Exploradora Élfica (Oficial)', mov: 9, at: 2, def: 3, pc: 2, pm: 2, cost: 50, gear: 'Habilidad del Enano para detectar y desactivar trampas.' },
  { id: 'elf_ballestera', name: 'Ballestera Élfica (Oficial)', mov: 6, at: 3, def: 3, pc: 2, pm: 2, cost: 75, gear: 'Ballesta (3 DC a distancia) + Espada Ancha en combate adyacente.' },
  { id: 'elf_guja', name: 'Guja Élfica (Oficial)', mov: 6, at: 3, def: 3, pc: 2, pm: 2, cost: 75, gear: 'Arma de asta: puede atacar en diagonal.' },
  { id: 'elf_taladora', name: 'Taladora Élfica (Oficial)', mov: 5, at: 4, def: 5, pc: 2, pm: 2, cost: 100, gear: 'Guerrera pesada de primera línea (4 DC Atq, 5 DC Def).' },
  // Mercenarios Imperiales (HQ-D20)
  { id: 'espadachin_m', name: 'Espadachín Imperial de Élite', mov: 5, at: 4, def: 5, pc: 3, pm: 2, cost: 160, gear: 'Espada ancha y armadura pesada.' },
  { id: 'lobo_comp', name: 'Lobo de Combate (Domador)', mov: 10, at: 2, def: 1, pc: 3, pm: 1, cost: 250, gear: 'Compañero permanente: ataque diagonal y salta fosos.' },
];
