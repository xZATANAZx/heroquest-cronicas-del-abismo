// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20)
// Bestiario Dinámico Escalable (Juego Base + Luna del Terror + Reina de los Espíritus + Extra)
// ============================================================================

export const EXPANSIONS = [
  { id: 'base', name: 'Juego Base (HQ 2021)', color: 'amber', unlocked: true },
  { id: 'reina_espiritus', name: 'El Tormento de la Reina de los Espíritus', color: 'cyan', unlocked: true },
  { id: 'luna_terror', name: 'La Luna del Terror', color: 'purple', unlocked: true },
  { id: 'extra', name: 'Bestiario Crónicas del Abismo (Extra)', color: 'rose', unlocked: true },
];

export const MONSTERS = [
  // ==================== JUEGO BASE ====================
  {
    id: 'goblin',
    name: 'Goblin Escurridizo',
    expansion: 'base',
    family: 'Pieles Verdes',
    tier: 'Fácil',
    miniature: 'Goblin (Base)',
    mov: 10, at: 2, def: 1, pc: 1, pm: 1, initMod: 2, xp: 50,
    abilities: [
      'Movilidad Táctica: Puede mover, atacar y continuar moviéndose.',
      'Honda / Arco (opcional): Puede atacar a distancia (2 DC) sin enemigos adyacentes.',
    ],
    eliteAbility: 'Líder de Manada (Élite): +1 DC en ataque si otro piel verde está adyacente al objetivo.',
    lore: 'Pequeños, cobardes en solitario pero letales en emboscadas coordinadas.',
  },
  {
    id: 'orco',
    name: 'Orco Guerrero',
    expansion: 'base',
    family: 'Pieles Verdes',
    tier: 'Fácil',
    miniature: 'Orco (Base)',
    mov: 8, at: 3, def: 2, pc: 2, pm: 2, initMod: 1, xp: 90,
    abilities: [
      'Furia Verde: Si tiene 1 PC restante, gana +1 DC en su próximo ataque.',
      'Variante Ballestero: Puede llevar ballesta (3 DC a distancia, mueve 4).',
    ],
    eliteAbility: 'Orco Negro (Élite): Armadura pesada (+1 Def, +1 PC) y no puede ser empujado.',
    lore: 'La columna vertebral de las hordas de Zargon; brutales y disciplinados en el saqueo.',
  },
  {
    id: 'abominacion',
    name: 'Abominación (Fimir)',
    expansion: 'base',
    family: 'Pieles Verdes',
    tier: 'Medio',
    miniature: 'Abominación (Base)',
    mov: 6, at: 3, def: 3, pc: 3, pm: 3, initMod: 0, xp: 160,
    abilities: [
      'Piel Escamosa: Reduce en 1 el daño de ataques a distancia no mágicos.',
      'Afinidad Arcana: 1 de cada 3 Abominaciones conoce 1 Hechizo del Terror al azar.',
    ],
    eliteAbility: 'Sacerdote de las Ciénegas (Élite): Conoce 2 hechizos del Terror y regenera 1 PC si saca calavera en 1 DC.',
    lore: 'Criaturas anfibias y astutas de las profundidades que combinan fuerza bruta y hechicería.',
  },
  {
    id: 'esqueleto',
    name: 'Esqueleto Armado',
    expansion: 'base',
    family: 'No Muertos',
    tier: 'Fácil',
    miniature: 'Esqueleto (Base)',
    mov: 6, at: 2, def: 2, pc: 1, pm: 0, initMod: 0, xp: 60,
    abilities: [
      'No Muerto: Inmune a veneno, miedo, sueño y ataques a PM.',
      'Guadaña Ósea: Puede atacar en diagonal.',
      'Resistencia a Proyectiles: Defiende contra flechas con Escudos Blancos.',
    ],
    eliteAbility: 'Guerrero Tumulario (Élite): Sus golpes siempre añaden +1 Calavera automática si impactan.',
    lore: 'Huesos animados por la voluntad del Señor Brujo; incansables y silenciosos.',
  },
  {
    id: 'zombi',
    name: 'Zombi Putrefacto',
    expansion: 'base',
    family: 'No Muertos',
    tier: 'Fácil',
    miniature: 'Zombi (Base)',
    mov: 5, at: 2, def: 3, pc: 2, pm: 0, initMod: -2, xp: 75,
    abilities: [
      'No Muerto: Inmune a veneno, sueño, miedo y hechizos mentales.',
      'Superioridad Numérica: Si 2 o más Zombis atacan al mismo héroe en un turno, cada uno tira +1 DC adicional.',
    ],
    eliteAbility: 'Zombi de Plaga (Élite): Al morir libera gas pútrido; héroes adyacentes pierden 1 PC (pueden evitarlo bebiendo un Antídoto).',
    lore: 'Lentos pero tenaces; en grupo pueden arrastrar al suelo incluso al bárbaro más fuerte.',
  },
  {
    id: 'momia',
    name: 'Momia Ancestral',
    expansion: 'base',
    family: 'No Muertos',
    tier: 'Medio',
    miniature: 'Momia (Base)',
    mov: 4, at: 3, def: 4, pc: 3, pm: 0, initMod: -1, xp: 180,
    abilities: [
      'No Muerto y Vulnerable al Fuego (recibe +1 daño por hechizos de Fuego).',
      'Inmortal: Al inicio del turno de Zargon tira 1 DC; con Calavera recupera 1 PC (salvo daño por fuego).',
      'Toque Maldito: Si inflige 2+ heridas, el héroe salva MEN CD 12 o pierde 1 PM.',
    ],
    eliteAbility: 'Faraón Guardián (Élite): Aura de Miedo (Mente MEN CD  al entrar en la sala o -1 DC al atacar).',
    lore: 'Guardianes vendados de tumbas antiguas cuya maldición pudre el cuerpo y el espíritu.',
  },
  {
    id: 'guerrero_terror',
    name: 'Guerrero del Terror (Caos)',
    expansion: 'base',
    family: 'Caos y Terror',
    tier: 'Medio',
    miniature: 'Guerrero del Terror (Base)',
    mov: 7, at: 4, def: 4, pc: 3, pm: 3, initMod: 1, xp: 240,
    abilities: [
      'Armadura Maldita: No puede ser empujado por ataques normales.',
      'Arma Embrujada (opcional): El DM puede darle un arma embrujada (+1 DC de ataque adicional).',
    ],
    eliteAbility: 'Campeón del Terror (Élite): Arma Embrujada (+1 DC) y 1 Hechizo del Terror.',
    lore: 'Caballeros condenados sellados en acero oscuro, juramentados a la ruina del Imperio.',
  },
  {
    id: 'gargola',
    name: 'Gárgola de Obsidiana',
    expansion: 'base',
    family: 'Caos y Terror',
    tier: 'Difícil',
    miniature: 'Gárgola (Base)',
    image: '/art/boss_gargoyle.jpg',
    mov: 6, at: 4, def: 5, pc: 4, pm: 4, initMod: 0, xp: 400,
    abilities: [
      'Piel de Piedra Viva: Ignora el primer punto de daño físico en cada ronda si el arma no es mágica.',
      'Aliento Venenoso: En vez de atacar, lanza su aliento venenoso por toda la habitación. Todos los héroes en la sala pierden 1 PC (pueden beber un Antídoto para evitarlo).',
    ],
    eliteAbility: 'Gárgola Primordial (Élite): Puede volar ignorando muebles/trampas y ataca con 5 DC.',
    lore: 'Estatuas demoníacas que despiertan en el momento exacto para masacrar intrusos.',
  },
  {
    id: 'hechicero_terror',
    name: 'Hechicero del Terror',
    expansion: 'base',
    family: 'Caos y Terror',
    tier: 'Difícil',
    miniature: 'Hechicero del Terror (Base)',
    mov: 7, at: 3, def: 4, pc: 4, pm: 6, initMod: 2, xp: 450,
    abilities: [
      'Maestro Arcano: Conoce 4 Hechizos del Terror (Miedo, Rayo, Tormenta de Fuego, Invocar No Muertos).',
      'Barrera Oscura: 1 vez/combate anula un hechizo de héroe con reacción.',
    ],
    eliteAbility: 'Archibrujo de Zargon (Jefe): Lanza 2 hechizos por turno y teletransporta 5 casillas al recibir daño.',
    lore: 'Lugartenientes directos de Zargon que tuercen la realidad y levantan ejércitos de sombras.',
  },

  // ==================== LA LUNA DEL TERROR ====================
  {
    id: 'espectro',
    name: 'Espectro de la Luna',
    expansion: 'luna_terror',
    family: 'Espectros',
    tier: 'Medio',
    miniature: 'Espectro (Luna del Terror)',
    mov: 8, at: 3, def: 3, pc: 2, pm: 2, initMod: 3, xp: 200,
    abilities: [
      'Etéreo: Atraviesa muros, puertas, trampas y héroes. Los ataques físicos normales solo lo hieren sacando Escudos Negros (la magia, artefactos y ataques espirituales lo hieren normal).',
      'Toque Gélido: Quien sufra daño salva FUE CD 12 o pierde 1 casilla de movimiento el próximo turno.',
    ],
    eliteAbility: 'Espectro Aullador (Élite): Grito que hace salvar MEN CD 13 a toda la sala o perder 1 PM.',
    lore: 'Almas desgarradas de Elethorn atadas a la Luna del Terror.',
  },
  {
    id: 'espectro_terror',
    name: 'Espectro del Terror (Dread Wraith)',
    expansion: 'luna_terror',
    family: 'Espectros',
    tier: 'Legendario',
    miniature: 'Espectro del Terror (Luna del Terror)',
    image: '/art/boss_dread_wraith.jpg',
    mov: 9, at: 5, def: 4, pc: 6, pm: 5, initMod: 4, xp: 750,
    abilities: [
      'Etéreo: Atraviesa obstáculos; ataques físicos normales solo impactan con Escudos Negros.',
      'Hechicero Espectral: Conoce Miedo, Luces del Terror, Canalizar Terror e Invocar Espectros (hasta 3).',
      'Fantasma del Terror: Sus hechizos pueden afectar a TODOS los héroes en línea de visión.',
    ],
    eliteAbility: 'Señor de las Sombras (Jefe): Cuando cae a mitad de PC, invoca 2 Espectros inmediatamente.',
    lore: 'Una pesadilla viviente capaz de congelar la sangre de un escuadrón entero.',
  },
  {
    id: 'guardia_mago',
    name: 'Guardia Mago',
    expansion: 'luna_terror',
    family: 'Caos y Terror',
    tier: 'Medio',
    miniature: 'Guardia Mago (Luna del Terror)',
    mov: 8, at: 4, def: 4, pc: 3, pm: 3, initMod: 2, xp: 260,
    abilities: [
      'Hoja Rúnica: Sus ataques cuentan como mágicos y pueden golpear en diagonal.',
      'Contrahechizo Menor: Tiene Ventaja en salvaciones contra magia elemental.',
    ],
    eliteAbility: 'Capitán Mago (Élite): Puede lanzar Rayo Arcano (3 DC a distancia) 2 veces por combate.',
    lore: 'Élite militar de Elethorn corrompida por el pacto de la Luna del Terror.',
  },
  {
    id: 'asesino_luna',
    name: 'Asesino del Culto',
    expansion: 'luna_terror',
    family: 'Forajidos',
    tier: 'Medio',
    miniature: 'Asesino (Luna del Terror)',
    mov: 10, at: 4, def: 3, pc: 2, pm: 3, initMod: 4, xp: 230,
    abilities: [
      'Agilidad Mortal: Ataca y mueve en diagonal, atraviesa héroes sin coste y divide su movimiento antes y después de atacar.',
      'Hoja Envenenada: Si causa daño, el héroe salva FUE CD 12 o queda Envenenado (-1 DC).',
    ],
    eliteAbility: 'Asesino Élite (Verdugo): Inflige +1 daño automático si ataca por la espalda o desde sigilo.',
    lore: 'Sombras contratadas para silenciar a los héroes antes de que alcancen el corazón del culto.',
  },
  {
    id: 'cultista',
    name: 'Sectario del Terror (Cultista)',
    expansion: 'luna_terror',
    family: 'Forajidos',
    tier: 'Fácil',
    miniature: 'Sectario del Terror (Luna del Terror)',
    mov: 7, at: 2, def: 2, pc: 1, pm: 2, initMod: 1, xp: 80,
    abilities: [
      'Canalizar Terror: Lanza 1d6 (+1 por cada otro Sectario adyacente): 4-5 = 1 daño; 6+ = 2 daños a un héroe en LdV.',
      'Ofrenda al Caos: Si hiere a un héroe, el Reloj del Caos del DM sube +1.',
    ],
    eliteAbility: 'Fanático del Velo (Élite): Al morir lanza una maldición final (Mente MEN CD  o -1 PM).',
    lore: 'Adoradores encapuchados de la Cuadrilla del Velo del Cuervo que canalizan energía oscura en grupo.',
  },
  {
    id: 'guerrero_elfico',
    name: 'Guerrero Élfico',
    expansion: 'luna_terror',
    family: 'Forajidos',
    tier: 'Medio',
    miniature: 'Guerrero Élfico (Luna del Terror)',
    mov: 6, at: 4, def: 3, pc: 3, pm: 2, initMod: 2, xp: 210,
    abilities: [
      'Espada de Elethorn: Precisión marcial que permite repetir 1 dado de ataque si saca escudo blanco al defender.',
      'Contratable (Mercenario): Los héroes pueden reclutarlo en la Guarida de los Contrabandistas por 200 MO.',
    ],
    eliteAbility: 'Capitán Élfico (Élite): +1 Def y ataca en diagonal con espada larga.',
    lore: 'Veteranos de la guardia élfica que sirven al mejor postor o custodian los barrios de Elethorn.',
  },
  {
    id: 'arquero_elfico',
    name: 'Arquero Élfico',
    expansion: 'luna_terror',
    family: 'Forajidos',
    tier: 'Medio',
    miniature: 'Arquero Élfico (Luna del Terror)',
    mov: 6, at: 4, def: 2, pc: 3, pm: 2, initMod: 3, xp: 210,
    abilities: [
      'Arco Largo Élfico: Dispara con 4 DC a cualquier objetivo en línea de visión; solo 1 DC en combate cuerpo a cuerpo adyacente.',
      'Retirada Ágil: Puede retroceder 2 casillas tras disparar si no está rodeado.',
    ],
    eliteAbility: 'Tirador de la Luna (Élite): Ignora cobertura parcial y añade +1 daño contra enemigos sin armadura pesada.',
    lore: 'Centinelas silenciosos apostados en los tejados y pasillos de la capital élfica.',
  },
  {
    id: 'sir_ragnar_traidor',
    name: 'Sir Ragnar (Traidor del Terror)',
    expansion: 'luna_terror',
    family: 'Jefes',
    tier: 'Difícil',
    miniature: 'Sir Ragnar / Guerrero del Terror (Luna del Terror)',
    mov: 5, at: 5, def: 5, pc: 4, pm: 4, initMod: 2, xp: 550,
    abilities: [
      'Voluntad Inquebrantable (4* PC): La primera vez que sus PC se reducen a 0, sobrevive con 1 PC y continúa combatiendo.',
      'Traición de Elethorn: Al vencerlo, Ithraeon llega con guardias élficos para arrestarlo.',
    ],
    eliteAbility: 'Campeón Caído (Fase 2): Al quedar en 1 PC realiza un contraataque inmediato de 5 DC.',
    lore: 'El antiguo caballero rescatado por los héroes, ahora corrompido y aliado de Zargon en el Palacio Real.',
  },

  // ==================== REINA DE LOS ESPÍRITUS ====================
  {
    id: 'espiritu_guerrero',
    name: 'Guerrero Espiritual (Translúcido)',
    expansion: 'reina_espiritus',
    family: 'Espectros',
    tier: 'Medio',
    miniature: 'Miniaturas Translúcidas (Reina de los Espíritus)',
    mov: 7, at: 3, def: 3, pc: 2, pm: 3, initMod: 2, xp: 180,
    abilities: [
      'Ataque a la Mente (Regla Reina de los Espíritus): Sus ataques exitosos dañan PUNTOS DE MENTE (PM) en lugar de PC. Al llegar a 0 PM, el héroe entra en Shock.',
      'Presencia Inquietante: Los héroes adyacentes sufren -1 a pruebas de Percepción.',
    ],
    eliteAbility: 'Espíritu Vengativo (Élite): Si el objetivo ya está en Shock, el ataque sí inflige daño directo a PC.',
    lore: 'Ecos translúcidos de guerreros atrapados por el tormento de Silvana.',
  },
  {
    id: 'kavra',
    name: 'Kavra, Hechicera del Tormento',
    expansion: 'reina_espiritus',
    family: 'Jefes',
    tier: 'Legendario',
    miniature: 'Gárgola / Hechicero del Terror (Reina de los Espíritus)',
    mov: 7, at: 4, def: 5, pc: 6, pm: 6, initMod: 3, xp: 800,
    abilities: [
      'Conjuración Doble: En su primer turno lanza Rayo Mortífero y Bola en Llamas juntos.',
      'Escudo de Almas: Estadísticas de Guerrero del Terror con +1 DC Defensa mientras mantenga su aura arcana.',
    ],
    eliteAbility: 'Furia del Tormento (Fase 2 a mitad de PC): Todos los héroes salvan MEN CD 14 o pierden 2 PM.',
    lore: 'Hechicera despiadada que profanó la Tumba de Nelath para servir a Zargon.',
  },
  {
    id: 'reina_espiritus_jefe',
    name: 'La Reina de los Espíritus (Nelath)',
    expansion: 'reina_espiritus',
    family: 'Jefes',
    tier: 'Legendario',
    miniature: 'Reina de los Espíritus / Hechicero del Terror',
    mov: 7, at: 4, def: 4, pc: 6, pm: 6, initMod: 3, xp: 950,
    abilities: [
      'Tormenta de Zargon: Lanza 2 Hechizos del Terror por turno entre Dominación, Miedo, Rayo Mortífero y Tormenta de Fuego.',
      'Redención de Nelath: Un héroe puede usar su acción para recordarle su pasado y tirar 1 DC; cada escudo reduce en 1 los PM de la Reina. ¡Al llegar a 0 PM se rompe el encantamiento y se salva!',
    ],
    eliteAbility: 'Forma Insustancial: Puede atravesar héroes y muebles sin penalización.',
    lore: 'La antigua aprendiz de Silvana, transformada por Zargon en la temible Reina de los Espíritus en la Aguja.',
  },

  // ==================== BESTIARIO EXTRA (REVOLUCIONARIO) ====================
  {
    id: 'mimico',
    name: 'Mímico de Cofre',
    expansion: 'extra',
    family: 'Bestias',
    tier: 'Medio',
    miniature: 'Cofre del Tesoro (Base)',
    image: '/art/monster_mimic.jpg',
    mov: 4, at: 4, def: 3, pc: 4, pm: 1, initMod: 2, xp: 280,
    abilities: [
      'Emboscada Perfecta: Parece un cofre normal hasta que un héroe lo abre o examina (salvación AGI CD 13 o recibe un mordisco gratis).',
      'Adhesivo: El héroe mordido no puede moverse hasta superar Atletismo (FUE CD 13).',
    ],
    eliteAbility: 'Mímico Voraz (Élite): Recupera 1 PC cada vez que hiere a un héroe.',
    lore: 'El terror de todo aventurero codicioso: el tesoro que te muerde de vuelta.',
  },
  {
    id: 'arana_gigante',
    name: 'Araña Gigante de Caverna',
    expansion: 'extra',
    family: 'Bestias',
    tier: 'Fácil',
    miniature: 'Token / Proxy (o Goblin)',
    mov: 8, at: 2, def: 2, pc: 2, pm: 1, initMod: 3, xp: 100,
    abilities: [
      'Veneno: Cada vez que ataque y haga daño, el defensor tira 1 DC. Si saca Calavera, no podrá moverse su próximo turno. Si saca Escudo Negro, sufre 1 PC adicional.',
      'Telaraña: Ignora terreno difícil y muebles.',
    ],
    eliteAbility: 'Reina Arácnida (Élite): Dispara telaraña a 5 casillas (inmoviliza hasta superar FUE CD 13).',
    lore: 'Depredadoras silenciosas que caen desde el techo de las salas oscuras.',
  },
  {
    id: 'troll',
    name: 'Troll de las Profundidades',
    expansion: 'extra',
    family: 'Pieles Verdes',
    tier: 'Difícil',
    miniature: 'Ogro / Gárgola Proxy',
    mov: 6, at: 5, def: 4, pc: 7, pm: 1, initMod: -1, xp: 520,
    abilities: [
      'Regeneración Sobrenatural: Al inicio del turno de Zargon recupera 2 PC (salvo si recibió daño por Fuego o Ácido ese turno).',
      'Garrotazo: Empuja al héroe 2 casillas; si choca con pared o mueble recibe +1 daño.',
    ],
    eliteAbility: 'Troll Blindado (Élite): +1 Def y lanza rocas a 5 casillas (4 DC).',
    lore: 'Brutos casi inmortales que obligan al grupo a coordinar fuego y acero.',
  },
  {
    id: 'minotauro',
    name: 'Minotauro del Laberinto',
    expansion: 'extra',
    family: 'Caos y Terror',
    tier: 'Difícil',
    miniature: 'Gárgola / Guerrero Élite Proxy',
    mov: 8, at: 5, def: 4, pc: 6, pm: 2, initMod: 1, xp: 500,
    abilities: [
      'Embestida Imparable: Si mueve 3+ casillas en línea recta, ataca con +2 DC y atraviesa/empuja al héroe.',
      'Laberíntico: Nunca puede ser sorprendido ni flanqueado.',
    ],
    eliteAbility: 'Señor del Laberinto (Jefe): Rugido atronador (salvación FUE CD 14 o Aturdido 1 turno).',
    lore: 'Furia cornuda que destroza líneas defensivas en los pasillos estrechos.',
  },
  // ==================== BESTIARIO EXTRA (FETENQUEST) ====================
  {
    id: 'orco_negro',
    name: 'Orco Negro',
    expansion: 'extra',
    family: 'Pieles Verdes',
    tier: 'Medio',
    miniature: 'Orco (Base)',
    mov: 8, at: 3, def: 4, pc: 2, pm: 2, initMod: 0, xp: 190,
    abilities: [
      'Bien Armado: Al colocarlo, el DM elige mejor armamento (+1 DC de Ataque) o mejor armadura (+1 DC de Defensa y +1 PC).',
    ],
    eliteAbility: 'Jefe Orco Negro (Élite): No puede ser empujado y repite 1 dado fallido en ataque.',
    lore: 'Los guerreros pieles verdes más disciplinados y mejor equipados de la fortaleza.',
  },
  {
    id: 'chaman_goblin',
    name: 'Chamán Goblin',
    expansion: 'extra',
    family: 'Pieles Verdes',
    tier: 'Medio',
    miniature: 'Goblin / Hechicero Proxy',
    mov: 10, at: 2, def: 2, pc: 2, pm: 4, initMod: 2, xp: 220,
    abilities: [
      'Conocimiento Arcano: Conoce los hechizos Invocar Orcos, Oxidar, Miedo y Rayo Mortífero.',
      'Movilidad: Puede moverse, lanzar un hechizo y terminar su movimiento.',
    ],
    eliteAbility: 'Gran Chamán (Élite): +1 PC y puede lanzar 2 hechizos en su primer turno.',
    lore: 'Hechiceros diminutos y escurridizos que canalizan la furia verde a distancia.',
  },
  {
    id: 'hombre_bestia',
    name: 'Hombre Bestia',
    expansion: 'extra',
    family: 'Caos y Terror',
    tier: 'Medio',
    miniature: 'Orco / Abominación Proxy',
    mov: 6, at: 3, def: 3, pc: 2, pm: 1, initMod: 1, xp: 170,
    abilities: [
      'Emboscada: La primera vez que ataque en el combate puede realizar 2 ataques seguidos con una sola acción (ambos defendibles).',
    ],
    eliteAbility: 'Bestigor (Élite): +1 DC Ataque y +1 PC.',
    lore: 'Bestias salvajes del Caos que cargan sin aviso en cuanto se abre la puerta.',
  },
  {
    id: 'bandido',
    name: 'Bandido Saqueador',
    expansion: 'extra',
    family: 'Forajidos',
    tier: 'Fácil',
    miniature: 'Asesino / Guerrero Élfico Proxy',
    mov: 8, at: 2, def: 2, pc: 1, pm: 2, initMod: 2, xp: 90,
    abilities: [
      'Robar (1 vez/misión, gratis): Un héroe adyacente tira 1 dado rojo por PM; si no saca ningún 6, le roba 1d6×10 MO o 1 objeto no equipado (se recupera al matarlo).',
      'Armas a Distancia (opcional): Puede llevar arco (2 DC en Línea de Visión).',
    ],
    eliteAbility: 'Líder Forajido (Élite): Los aliados a 5 casillas repiten 1 dado de combate por turno.',
    lore: 'Asaltantes rápidos que prefieren vaciar tu mochila y huir hacia la salida.',
  },
  {
    id: 'conde_vampiro',
    name: 'Conde Vampiro',
    expansion: 'extra',
    family: 'No Muertos',
    tier: 'Legendario',
    miniature: 'Hechicero del Terror / Jefe',
    mov: 8, at: 5, def: 5, pc: 5, pm: 4, initMod: 3, xp: 750,
    abilities: [
      'No Muerto: Inmune a veneno, sueño y miedo.',
      'La Sangre es Poder: Cuando cause daño en combate se cura tantos PC como PC haya infligido (sin superar su máximo).',
      'Forma de Niebla: Al moverse ignora Áreas de Influencia enemigas.',
      'Conocimiento Arcano: Conoce los hechizos Dominar e Invocar No Muertos.',
    ],
    eliteAbility: 'Señor de la Noche (Jefe): Si queda a 1 PC se convierte en niebla y reaparece a 5 casillas.',
    lore: 'Aristócrata inmortal que drena la vitalidad de sus enemigos con cada corte.',
  },
  {
    id: 'basilisco',
    name: 'Basilisco de Caverna',
    expansion: 'extra',
    family: 'Bestias',
    tier: 'Difícil',
    miniature: 'Gárgola / Bestia Proxy',
    mov: 8, at: 4, def: 5, pc: 5, pm: 2, initMod: 1, xp: 480,
    abilities: [
      'Mirada Petrificante (acción gratuita): Escoge un héroe en Línea de Visión; este tira 1 dado rojo por cada PM. Si no saca ningún 6 queda Petrificado (pierde su turno y no recibe daño; se cura con cualquier poción o hechizo curativo).',
    ],
    eliteAbility: 'Basilisco Ancestral (Élite): +1 PC y piel escamosa (+1 DC Defensa).',
    lore: 'Reptil monstruoso cuya mirada convierte en piedra a los imprudentes.',
  },
  {
    id: 'liche',
    name: 'Liche / Señor Brujo (Jefe Final)',
    expansion: 'extra',
    family: 'Jefes',
    tier: 'Legendario',
    miniature: 'Hechicero del Terror / Señor Brujo',
    image: '/art/boss_witch_lord.jpg',
    mov: 7, at: 4, def: 5, pc: 8, pm: 7, initMod: 3, xp: 1200,
    abilities: [
      'Maestro Nigromante: Al inicio de cada turno de Zargon invoca 1 Esqueleto o Zombi en una casilla visible.',
      'Inmortalidad Arcana: Recupera 1 PC cada turno salvo daño de Hoja Espiritual o Fuego.',
      '5 Hechizos del Terror: Incluye Miedo, Rayo, Tormenta de Fuego, Nube del Caos y Dominar.',
    ],
    eliteAbility: 'Filacteria Activa (Jefe): Al llegar a 0 PC, si no se destruyó su Altar/Tumba, revive una vez con 4 PC.',
    lore: 'El pináculo de la nigromancia; una batalla que pondrá a prueba todo el ingenio del grupo.',
  },
];

// ============================================================================
// MOTOR DE AUTO-ESCALADO INTELIGENTE (Niveles 1 a 10 · Adaptado a HQ-D20 v2)
// Los héroes HQ-D20 tienen más poderes y equipo: los monstruos escalan de verdad
// para mantener tensión táctica en Misiones Oficiales (y aún más en Supervivencia).
// ============================================================================
export function scaleMonster(
  monster,
  partyLevel = 1,
  partySize = 4,
  isElite = false,
  isSpiritMode = false,
  isSurvivalMode = false
) {
  const lvl = Math.max(1, Math.min(10, Number(partyLevel) || 1));
  const isBossTier = monster.tier === 'Legendario' || monster.tier === 'Difícil';
  const effectiveElite = Boolean(isElite || (isSurvivalMode && isBossTier) || lvl >= 6);

  // Escalado progresivo real adaptado al poder de héroes HQ-D20 v2
  const pcBonusFromLevel =
    Math.floor(lvl * 0.65) + (isBossTier ? Math.floor((lvl - 1) * 0.55) : 0);
  const atBonusFromLevel = lvl >= 8 ? 2 : lvl >= 3 ? 1 : 0;
  const defBonusFromLevel = lvl >= 8 ? 2 : lvl >= 4 ? 1 : 0;

  // Bono de Modo Supervivencia (+1 PC a todos los monstruos, +1 CD)
  const survivalPC = isSurvivalMode ? 1 : 0;
  const survivalDC = isSurvivalMode ? 1 : 0;

  // Ajuste por Élite
  const elitePC = effectiveElite ? Math.max(1, Math.ceil(monster.pc * 0.4)) : 0;
  const eliteAt = effectiveElite ? 1 : 0;
  const eliteDef = effectiveElite ? 1 : 0;

  const scaledPC = Math.max(1, monster.pc + pcBonusFromLevel + survivalPC + elitePC);
  const scaledAt = Math.min(9, monster.at + atBonusFromLevel + eliteAt);
  const scaledDef = Math.min(8, monster.def + defBonusFromLevel + eliteDef);

  // Resistencia a hechizos (clara y directa con dados rojos d6 por PM)
  const isMindImmune = (monster.pm || 0) <= 0;
  const mindResistLabel = isMindImmune
    ? 'Inmune a magia mental (0 PM)'
    : `${monster.pm}d6 (con un 6 resiste)`;
  const physResistLabel =
    scaledPC >= 5
      ? 'Grande (no puede ser empujado)'
      : 'Normal (puede ser empujado al recibir daño)';
  const resistGuide = isMindImmune
    ? 'No Muerto (0 PM): Inmune a hechizos mentales, sueño y miedo.'
    : `Resistencia a hechizos: tira ${monster.pm} dado(s) rojo(s) (1 por PM). Si sale al menos un 6, resiste el hechizo.`;

  // XP rebalanceada para evitar subida explosiva de nivel (+25% en Modo Supervivencia)
  const scaledXP = Math.round(
    monster.xp * 0.72 * (1 + (lvl - 1) * 0.14) * (effectiveElite ? 1.3 : 1) * (isSurvivalMode ? 1.25 : 1)
  );

  const activeAbilities = [...monster.abilities];
  if (effectiveElite) {
    activeAbilities.push(`⭐ ${monster.eliteAbility}`);
  }
  if (isSurvivalMode) {
    activeAbilities.push('💀 MODO SUPERVIVENCIA: +1 PC adicional.');
  }
  if (isSpiritMode && monster.id !== 'espiritu_guerrero') {
    activeAbilities.unshift('👻 MODO ESPÍRITU (Reina de los Espíritus): Sus ataques dañan Puntos de Mente (PM) en lugar de PC.');
  }

  return {
    ...monster,
    scaledPC,
    scaledAt,
    scaledDef,
    mindResistLabel,
    physResistLabel,
    resistGuide,
    scaledXP,
    isElite: effectiveElite,
    isSpiritMode,
    isSurvivalMode,
    activeAbilities,
    difficultyTag: isSurvivalMode
      ? 'Supervivencia'
      : lvl <= 2
      ? 'Normal'
      : lvl <= 5
      ? 'Veterano'
      : lvl <= 8
      ? 'Heroico'
      : 'Pesadilla',
  };
}

// ============================================================================
// PLANTILLAS DE MONSTRUOS EN 1 CLIC (Inspiradas en HQ Homebrew & AHQ)
// Multiplica tu bestiario sin comprar miniaturas nuevas
// ============================================================================
export const MONSTER_TEMPLATES = [
  {
    id: 'normal',
    name: 'Estándar',
    icon: '⚔️',
    pcMod: 0,
    atMod: 0,
    defMod: 0,
    movMod: 0,
    xpMult: 1,
    ability: null,
  },
  {
    id: 'esqueletico',
    name: 'Esquelético',
    icon: '💀',
    pcMod: 0,
    atMod: 0,
    defMod: 1,
    movMod: 0,
    xpMult: 1.2,
    ability: 'Plantilla Esquelética: Inmune a Veneno y Miedo; ataque diagonal con armas de hueso.',
  },
  {
    id: 'zombificado',
    name: 'Zombificado',
    icon: '🧟',
    pcMod: 2,
    atMod: 0,
    defMod: -1,
    movMod: -2,
    xpMult: 1.15,
    ability: 'Plantilla Zombificada: +2 PC pero lento (-2 Mov). Al morir explota en nube tóxica (FUE CD 12 o 1 PC).',
  },
  {
    id: 'momificado',
    name: 'Momificado',
    icon: '🧻',
    pcMod: 2,
    atMod: 1,
    defMod: 0,
    movMod: -1,
    xpMult: 1.35,
    ability: 'Plantilla Momificada: Sus golpes aplican Maldición (-1 DC ataque 1 turno). Vulnerable al Fuego (+1 DC).',
  },
  {
    id: 'fantasmal',
    name: 'Fantasmal (Etéreo)',
    icon: '👻',
    pcMod: -1,
    atMod: 0,
    defMod: 1,
    movMod: 2,
    xpMult: 1.4,
    ability: 'Plantilla Fantasmal: Atraviesa muros/miniaturas. Armas normales solo lo hieren con Escudos Negros; magia/plata normal.',
  },
  {
    id: 'artico',
    name: 'Ártico (Escarcha)',
    icon: '❄️',
    pcMod: 1,
    atMod: 0,
    defMod: 1,
    movMod: 0,
    xpMult: 1.25,
    ability: 'Plantilla Ártica: Al herir a un héroe reduce su movimiento en -2 casillas el siguiente turno. Vulnerable al Fuego.',
  },
  {
    id: 'piedra',
    name: 'De Piedra (Gólem)',
    icon: '🪨',
    pcMod: 2,
    atMod: 0,
    defMod: 2,
    movMod: -2,
    xpMult: 1.4,
    ability: 'Plantilla de Piedra: +2 DC Defensa e inmune a Veneno/Sangrado/Aturdir, pero movimiento reducido (-2).',
  },
  {
    id: 'vampirico',
    name: 'Vampírico',
    icon: '🦇',
    pcMod: 1,
    atMod: 1,
    defMod: 0,
    movMod: 1,
    xpMult: 1.45,
    ability: 'Plantilla Vampírica: Cada vez que inflige daño a un héroe recupera 1 PC (hasta su máximo).',
  },
  {
    id: 'demoniaco',
    name: 'Demoníaco (Caos)',
    icon: '🔥',
    pcMod: 2,
    atMod: 2,
    defMod: 0,
    movMod: 1,
    xpMult: 1.55,
    ability: 'Plantilla Demoníaca: Inmune al Fuego; sus ataques empujan 1 casilla e infligen +1 PC si el héroe choca con muro.',
  },
  {
    id: 'gigante',
    name: 'Gigante / Colosal',
    icon: '🗿',
    pcMod: 4,
    atMod: 2,
    defMod: 1,
    movMod: -1,
    xpMult: 1.65,
    ability: 'Plantilla Gigante: Golpe de Barrido (ataca hasta 2 héroes adyacentes a la vez) y no puede ser empujado.',
  },
  {
    id: 'veterano',
    name: 'Veterano Táctico',
    icon: '🛡️',
    pcMod: 1,
    atMod: 1,
    defMod: 1,
    movMod: 0,
    xpMult: 1.3,
    ability: 'Plantilla Veterano: Puede usar Romper Filas en puertas (empuja 1 casilla) y repite 1 Escudo Negro fallido por combate.',
  },
];

export function applyMonsterTemplate(scaledMonster, templateId = 'normal') {
  const tpl = MONSTER_TEMPLATES.find((t) => t.id === templateId) || MONSTER_TEMPLATES[0];
  if (tpl.id === 'normal') return { ...scaledMonster, templateName: null };

  return {
    ...scaledMonster,
    name: `${scaledMonster.name} (${tpl.name})`,
    templateId: tpl.id,
    templateName: tpl.name,
    mov: Math.max(2, (scaledMonster.mov || 6) + tpl.movMod),
    scaledPC: Math.max(1, scaledMonster.scaledPC + tpl.pcMod),
    scaledAt: Math.max(1, Math.min(10, scaledMonster.scaledAt + tpl.atMod)),
    scaledDef: Math.max(1, Math.min(9, scaledMonster.scaledDef + tpl.defMod)),
    scaledXP: Math.round(scaledMonster.scaledXP * tpl.xpMult),
    activeAbilities: [
      `${tpl.icon} ${tpl.ability}`,
      ...(scaledMonster.activeAbilities || []),
    ],
  };
}

// ============================================================================
// ESTADOS DE ALERTA DE MONSTRUOS Y NEGOCIACIÓN (Inspirado en HQ Homebrew)
// ============================================================================
export const MONSTER_ALERTNESS = [
  { id: 'Distraído', icon: '💤', color: 'text-emerald-300', rule: 'No esperan combate: los héroes tienen Ventaja en el primer turno y pueden intentar Sigilo o Emboscada.' },
  { id: 'Alerta', icon: '👁️', color: 'text-amber-300', rule: 'Armas listas: actúan normalmente por Iniciativa en cuanto se abre la puerta.' },
  { id: 'Patrulla', icon: '👣', color: 'text-sky-300', rule: 'Se mueven 4 casillas por turno por los pasillos buscando intrusos.' },
  { id: 'Guardia', icon: '🛡️', color: 'text-purple-300', rule: 'Defienden un cofre o jefe: ganan +1 DC de Defensa mientras no se muevan de su casilla.' },
  { id: 'Venganza', icon: '🔥', color: 'text-red-400', rule: 'Enfurecidos: ganan +1 DC de Ataque pero -1 DC de Defensa; persiguen al héroe que más daño hizo.' },
  { id: 'Miedo', icon: '😱', color: 'text-stone-300', rule: 'Moral rota: si ven caer a su líder, intentan huir o se rinden (permiten Negociar).' },
];

export const MONSTER_NEGOTIATION_GUIDE = [
  'Soborno (Persuasión SUE CD 13 + 30–60 MO): Goblins, Orcos o Mercenarios dejan pasar al grupo o revelan 1 trampa.',
  'Intimidación (CAR o FUE CD 14): Si el grupo ya venció al líder o tiene ventaja numérica, enemigos con Miedo sueltan su botín y huyen.',
  'Tregua / Intercambio (SUE CD 15): Monstruos inteligentes (Hechiceros, Asesinos, Abominaciones) pueden cambiar información o un prisionero por un objeto/pacto.',
];

// ============================================================================
// CALCULADORA DE NIVEL DE AMENAZA (Prowess / Encounter Balance)
// ============================================================================
export function calculateEncounterThreat(monstersList = [], partyLevel = 1, partySize = 4) {
  const totalProwess = monstersList.reduce((acc, m) => {
    const score = (m.scaledAt || m.at || 2) * 1.4 + (m.scaledDef || m.def || 2) * 1.1 + (m.scaledPC || m.pc || 1) * 1.2;
    return acc + score;
  }, 0);

  const partyPower = partySize * (7 + partyLevel * 1.8);
  const ratio = partyPower > 0 ? totalProwess / partyPower : 0;

  let rating = 'Trivial / Fácil';
  let color = 'text-emerald-300 border-emerald-700/60 bg-emerald-950/40';
  if (ratio >= 1.35) {
    rating = '☠️ Mortal / Jefe Épico';
    color = 'text-red-300 border-red-700/60 bg-red-950/50';
  } else if (ratio >= 1.0) {
    rating = '🔥 Difícil (Táctico)';
    color = 'text-amber-300 border-amber-700/60 bg-amber-950/40';
  } else if (ratio >= 0.65) {
    rating = '⚔️ Equilibrado (Ideal)';
    color = 'text-sky-300 border-sky-700/60 bg-sky-950/40';
  }

  return {
    totalProwess: Math.round(totalProwess),
    partyPower: Math.round(partyPower),
    ratio: Number(ratio.toFixed(2)),
    rating,
    color,
  };
}
