// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20 v2)
// SISTEMA OUTWORLD DIGITAL INTEGRADO (Basado en Nory 90's Outworld, 2024)
// Incluye LAS 9 TABLAS COMPLETAS (11–66 y 2–12), Viaje, Asentamientos,
// Regla de 10 Días, Refugio (Haven), Apuestas, Arena (SC), Mentor y Random Events
// Mejorado con tiradas HQ-D20 v2 y soporte 100% para dados físicos.
// ============================================================================

export function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

export function rollD66() {
  return `${rollD6()}${rollD6()}`;
}

export function roll2D6() {
  return rollD6() + rollD6();
}

export function lookupD66(table, rawCode) {
  const code = String(rawCode || '').trim();
  return table.find((e) => e.code === code) || null;
}

export function lookup2D6(table, sumVal) {
  const n = Number(sumVal);
  return table.find((e) => n >= e.min && n <= e.max) || null;
}

// ============================================================================
// CONFIGURACIÓN DE ASENTAMIENTOS, VIAJE Y REGLAS DE RANDOM EVENTS (pág. 45)
// ============================================================================
export const OUTWORLD_SETTLEMENT_TYPES = {
  village: {
    id: 'village',
    name: 'Aldea (Village)',
    icon: '🏡',
    travelFormula: '2 + Escudos Negros (3 DC)',
    stockDice: 1,
    innCost: 15,
    searchRule: 'Solo tiene Taberna (y Casa de Apuestas oculta con 2D6 = 10–12).',
  },
  town: {
    id: 'town',
    name: 'Pueblo / Burgo (Town)',
    icon: '🏘️',
    travelFormula: '3 + Escudos Blancos (3 DC)',
    stockDice: 2,
    innCost: 15,
    searchRule: 'Para hallar un Lugar Especial tira 2D6 ≥ 8 (o Investigación/Percepción CD 12).',
  },
  capital: {
    id: 'capital',
    name: 'La Capital (City)',
    icon: '🏰',
    travelFormula: '4 + Calaveras (3 DC)',
    stockDice: 3,
    innCost: 15,
    havenCost: 20,
    searchRule: 'Todas las ubicaciones están disponibles sin tirada de búsqueda.',
  },
};

export const OUTWORLD_RANDOM_EVENT_MODES = [
  { id: 'off', label: 'Apagado', desc: 'Sin Random Events automáticos de Outworld.' },
  { id: 'mode1', label: 'Modo 1 · Sin monstruos', desc: 'Se activa en el turno de Zargon cuando no queden monstruos en el tablero.' },
  { id: 'mode2', label: 'Modo 2 · Sin monstruos + Escudo Negro', desc: 'Sin monstruos en tablero: tira 1 DC; con Escudo Negro se activa.' },
  { id: 'mode3', label: 'Modo 3 · Cada turno + Escudo Negro', desc: 'En cada turno de Zargon tira 1 DC; con Escudo Negro se activa.' },
  { id: 'mode4', label: 'Modo 4 · Cada turno + Escudo Blanco', desc: 'Máxima tensión: en cada turno de Zargon tira 1 DC; con Escudo Blanco se activa.' },
];

export const OUTWORLD_EAVESDROPPING_TABLE = [
  { roll: 1, label: '¡Puerta abierta!', text: 'Haces ruido y la puerta se abre de golpe: ¡Zargon toma su turno inmediatamente!' },
  { roll: 2, label: 'Silencio confuso', text: 'No logras distinguir nada claro tras la madera.' },
  { roll: 3, label: 'Ecos lejanos', text: 'Solo escuchas corrientes de aire y pasos indeterminados.' },
  { roll: 4, label: 'Tipos de enemigos', text: 'El DM te revela QUÉ tipos de monstruos hay en la sala (sin decir cuántos).' },
  { roll: 5, label: 'Tipos de enemigos', text: 'El DM te revela QUÉ tipos de monstruos hay en la sala (sin decir cuántos).' },
  { roll: 6, label: '¡Lectura perfecta!', text: 'El DM te revela los tipos Y la cantidad exacta de monstruos en la sala.' },
];

export const OUTWORLD_MENTOR_TABLE = [
  { min: 2, max: 4, title: 'Claridad del Objetivo', text: 'Mentor explica detalles estratégicos clave sobre el objetivo principal de la siguiente misión.' },
  { min: 5, max: 5, title: 'Pergamino Elemental', text: 'Mentor obsequia 1 Pergamino de Hechizo Elemental al azar al grupo.' },
  { min: 6, max: 6, title: 'Dado del Destino', text: 'Cada héroe podrá fijar 1 dado en su resultado deseado (sin tirarlo) una vez en la próxima misión.' },
  { min: 7, max: 8, title: 'Estudio en Silencio', text: 'Mentor está ocupado conteniendo a Zargon; no obtiene pista adicional hoy.' },
  { min: 9, max: 9, title: 'Monstruo Errante Revelado', text: 'Mentor advierte exactamente qué Monstruo Errante acecha en la siguiente misión (+1 DC contra el primero).' },
  { min: 10, max: 10, title: 'Pasadizo Oculto', text: 'Mentor marca la ubicación de 1 Puerta Secreta en la próxima misión.' },
  { min: 11, max: 11, title: 'Mapa de Trampas', text: 'Mentor señala la ubicación de hasta 3 Trampas ocultas en la próxima misión.' },
  { min: 12, max: 12, title: 'Visión de la Sala Final', text: 'Mentor revela el contenido y jefe de la cámara final de la siguiente misión.' },
];

// ============================================================================
// CATÁLOGOS ÚNICOS DE OUTWORLD (Monturas, Mercado Negro, Afilado, Maestrías, Arena)
// ============================================================================
export const OUTWORLD_MOUNTS = [
  { id: 'mula', name: 'Mula de Carga', price: 300, stock: 8, travelReduce: 1, dailyCost: 1, desc: 'Reduce el viaje en 1 día (+1 MO/día). Al salir de misión/ciudad tira 1D6: con 1 es robada.' },
  { id: 'caballo', name: 'Caballo de Silla', price: 500, stock: 10, travelReduce: 2, dailyCost: 2, desc: 'Reduce el viaje en 2 días (+2 MO/día). Al salir de misión/ciudad tira 1D6: con 1 es robado.' },
  { id: 'perro_comp', name: 'Perro Guardián', price: 500, stock: 8, travelReduce: 0, dailyCost: 0, desc: 'Compañero Animal: Mov 10, Atq 2, Def 1, PC 3, PM 1 (ataca incluso en diagonal).' },
  { id: 'lobo_comp', name: 'Lobo Feroz', price: 1000, stock: 10, travelReduce: 0, dailyCost: 0, desc: 'Compañero Animal: Mov 10, Atq 3, Def 2, PC 4, PM 1 (actúa justo tras su dueño).' },
];

export const OUTWORLD_BLACK_MARKET_ITEMS = [
  { id: 'bm_caltrops', name: 'Abrojos (Caltrops)', price: 100, stock: 5, type: 'Consumible', dice: '-3 Mov', desc: 'Frena perseguidores (-3 casillas mov o 1 PC al pisarlos).' },
  { id: 'bm_smoke', name: 'Bomba de Humo', price: 100, stock: 5, type: 'Consumible', dice: 'Escape/Sigilo', desc: 'Cubre 3×3 en humo, evita ataques de oportunidad y permite recuperar Disfraz.' },
  { id: 'bm_bandage', name: 'Vendaje de Combate', price: 150, stock: 8, type: 'Poción', dice: 'Cura 1–2 PC', desc: 'Tira 1D6: 1–2 = 0 PC, 3–5 = +1 PC, 6 = +2 PC.' },
  { id: 'bm_poison', name: 'Veneno de Arma', price: 150, stock: 7, type: 'Consumible', dice: '+1 Daño', desc: 'Aplica veneno a tu arma: el próximo golpe exitoso hace +1 daño y envenena (CON CD 12).' },
  { id: 'bm_camouflage', name: 'Capa de Camuflaje', price: 200, stock: 8, type: 'Accesorio', dice: 'Sigilo', desc: 'Permite pasar inadvertido (monstruos deben tirar 1 DC para detectarte).' },
  { id: 'bm_explosive', name: 'Explosivo de Demolición (2×2)', price: 250, stock: 9, type: 'Consumible', dice: '1 PC Área 2×2', desc: 'Inflige 1 daño INDEFENDIBLE a todo lo que esté en un área de 2×2 casillas.' },
  { id: 'bm_holy_water', name: 'Agua Bendita (Templo)', price: 400, stock: 6, type: 'Poción', dice: 'Destruye No Muerto', desc: 'Arrojadiza: destruye al instante 1 Esqueleto, Zombi o Momia (o 3 DC mágicos a Jefes No Muertos).' },
  { id: 'bm_rope', name: 'Cuerda de Explorador', price: 50, stock: 7, type: 'Herramienta', dice: 'Cruzar Fosos', desc: 'Cruza fosos o abismos en viaje (1D6: con 1 se rompe tras cruzar).' },
  { id: 'bm_boots', name: 'Botas Reforzadas', price: 200, stock: 8, type: 'Armadura', dice: '+2 Mov', desc: 'Suma +2 casillas de movimiento permanente.' },
];

export const OUTWORLD_GUILD_MASTERIES = [
  // Adaptadas a TODAS las clases HQ-D20 v2 por arquetipo (1 uso/misión, 7 días de entreno)
  { id: 'm_combate_1', archetype: 'Combate', level: 1, cost: 500, name: 'Furia / Golpe Demoler', effect: '1 uso/misión: +2 DC en tu próximo ataque cuerpo a cuerpo (o ignora 1 escudo enemigo).' },
  { id: 'm_combate_2', archetype: 'Combate', level: 2, cost: 1000, name: 'Terremoto / Martillo Ancestral', effect: '1 uso/misión: ataca a todos los enemigos adyacentes con 3 DC y los empuja 1 casilla.' },
  { id: 'm_combate_3', archetype: 'Combate', level: 3, cost: 1500, name: 'Provocación / Furia Imparable', effect: '1 uso/misión: obliga a los enemigos de la sala a atacarte a ti (+2 DC Defensa este turno).' },
  { id: 'm_combate_4', archetype: 'Combate', level: 4, cost: 2000, name: 'Ira del Berserker', effect: '1 uso/misión: realiza DOS ataques completos en el mismo turno con +1 DC cada uno.' },

  { id: 'm_sigilo_1', archetype: 'Sigilo / Exploración', level: 1, cost: 500, name: 'Paso Silencioso / Maestro de Flechas', effect: '1 uso/misión: atraviesa enemigos sin bloqueos o dispara con +1 DC a distancia.' },
  { id: 'm_sigilo_2', archetype: 'Sigilo / Exploración', level: 2, cost: 1000, name: 'Invocación Natural / Esquiva Ágil', effect: '1 uso/misión: esquiva automáticamente un ataque completo o cura +2 PC a un aliado.' },
  { id: 'm_sigilo_3', archetype: 'Sigilo / Exploración', level: 3, cost: 1500, name: 'Disparo Preciso', effect: '1 uso/misión: ataque a distancia que ignora cobertura y 2 escudos de defensa.' },
  { id: 'm_sigilo_4', archetype: 'Sigilo / Exploración', level: 4, cost: 2000, name: 'Disparo Perforante / Visión Oscura', effect: '1 uso/misión: un proyectil atraviesa en línea recta a hasta 3 enemigos con 4 DC.' },

  { id: 'm_resist_1', archetype: 'Resistencia / Trampas', level: 1, cost: 500, name: 'Fortaleza Enana / Odio Piel Verde', effect: '1 uso/misión: recupera +2 PC gratis o suma +2 DC contra Orcos/Goblins.' },
  { id: 'm_resist_2', archetype: 'Resistencia / Trampas', level: 2, cost: 1000, name: 'Voluntad de Hierro / Maestro Herrero', effect: '1 uso/misión: supera automáticamente una salvación de Mente o repara/afila un arma en mazmorra.' },
  { id: 'm_resist_3', archetype: 'Resistencia / Trampas', level: 3, cost: 1500, name: 'Bomba Incendiaria', effect: '1 uso/misión: lanza bomba de 3 DC en área 2×2 (quema regeneración).' },
  { id: 'm_resist_4', archetype: 'Resistencia / Trampas', level: 4, cost: 2000, name: 'Maestro de Trampas', effect: 'Pasivo + 1 uso/misión: desarma cualquier trampa automáticamente y puede reutilizarla contra un monstruo.' },

  { id: 'm_magia_1', archetype: 'Magia / Arcano', level: 1, cost: 500, name: 'Percepción Arcana / Impacto', effect: '1 uso/misión: revela trampas/puertas secretas en la sala o empuja 2 casillas con daño mágico.' },
  { id: 'm_magia_2', archetype: 'Magia / Arcano', level: 2, cost: 1000, name: 'Aura Curativa / Nova Mágica', effect: '1 uso/misión: cura +2 PC a todos los aliados en la sala O inflige 2 DC mágicos a todos los enemigos.' },
  { id: 'm_magia_3', archetype: 'Magia / Arcano', level: 3, cost: 1500, name: 'Defensa Arcana', effect: '1 uso/misión: anula completamente un hechizo enemigo o gana +3 DC Defensa por 1 ronda.' },
  { id: 'm_magia_4', archetype: 'Magia / Arcano', level: 4, cost: 2000, name: 'Teletransporte / Debilidad Mágica', effect: '1 uso/misión: teletransporta a cualquier casilla visible o reduce a la mitad la defensa de un Jefe 1 turno.' },
];

export const OUTWORLD_ARENA_ENEMIES = [
  { id: 'arena_explorer', name: 'Explorador', mov: 9, at: 2, def: 3, pc: 2, pm: 2, sc: 3 },
  { id: 'arena_halberdier', name: 'Alabardero', mov: 6, at: 3, def: 3, pc: 2, pm: 2, sc: 4 },
  { id: 'arena_crossbow', name: 'Ballestero', mov: 6, at: 3, def: 3, pc: 2, pm: 2, sc: 4 },
  { id: 'arena_swordsman', name: 'Espadachín', mov: 5, at: 4, def: 5, pc: 2, pm: 2, sc: 5 },
  { id: 'arena_ogre', name: 'Ogro Gladiador', mov: 8, at: 4, def: 4, pc: 4, pm: 1, sc: 5 },
];

export const OUTWORLD_PUBLIC_HELP_TABLE = [
  { min: 2, max: 6, title: 'El público abuchea', effect: 'Sin ayuda esta ronda.' },
  { min: 7, max: 8, title: '¡Escudo arrojado!', effect: '+1 Dado de Defensa hasta tu próximo turno.' },
  { min: 9, max: 10, title: '¡Aclamación feroz!', effect: '+1 Dado de Ataque en tu próximo golpe.' },
  { min: 11, max: 11, title: '¡Frenesí de la Arena!', effect: 'Puedes realizar 2 ataques en tu próximo turno.' },
  { min: 12, max: 12, title: '¡Regalo del Emperador!', effect: 'El público lanza una Poción de Curación Menor (+2 PC) gratis.' },
];

export function calculatePartySC(heroes = []) {
  if (!heroes || heroes.length === 0) return 16;
  return heroes.reduce((sum, h) => {
    const baseAt = Number(h.attackDice) || 2;
    const lvlBonus = Math.floor(((Number(h.level) || 1) - 1) / 3);
    return sum + baseAt + 1 + lvlBonus;
  }, 0);
}

// ============================================================================
// TABLA 1: DANGER TABLE A (36 entradas · 11–66)
// ============================================================================
export const DANGER_TABLE_A = [
  { code: '11', title: 'Masacre', text: 'Tiran 1D6 c/u (menor = parientes atacados). 1D6 culpables (1 Goblins, 2 Orcos, 3 Abominaciones, 4 Esqueletos, 5 Zombis, 6 Guerreros del Terror). Ese héroe gana +1 DC Ataque contra ellos en la próxima misión.' },
  { code: '12', title: 'Incendio en el Camino', text: 'Salvación DES CD 12 o 1D6 c/u: 1–2 (-1 PC máx. próx. misión); 3–5 destruye 1 objeto no-artefacto al azar; 6 ileso y halla gema de 1D6×50 MO.' },
  { code: '13', title: 'Capilla del Camino', text: 'Pueden donar 20 MO y tirar 1D6 (Religión CD 13 da +1): 1–4 nada; 5–6 ganan +1 PC máx. durante las próximas 1D6 misiones.' },
  { code: '14', title: 'Abismo', text: 'Abandonar viaje (directo a próx. misión), buscar otra ruta (recalcular viaje) o cruzar con Cuerda (Atletismo CD 12 o 1D6: 1–2 se rompe tras cruzar; 3–6 se recupera).' },
  { code: '15', title: 'Forastero', text: 'Ofrece 40 MO/héroe por escolta. Si aceptan, Supervivencia CD 12 o 1D6: 1–2 perdidos (+1D6 días, huye sin pagar); 3–4 paga 40 MO c/u; 5–6 atajo (-1 día) y paga 40 MO c/u.' },
  { code: '16', title: 'Buhonero', text: 'Vende Poción Restauradora (250 MO), Amuleto Suerte (100 MO, repetir 1 dado), Brazaletes Bronce (30 MO, -1 daño 1 vez), Baratijas (20 MO). Tira 1D6/ítem (Percepción CD 13 evita estafa): con 1 es falso.' },
  { code: '21', title: 'Tornado', text: '1D6 c/u (menor tira 1D6 / FUE CD 13): 1 barranco (+1 día y 100 MO curación); 2–3 pierde 5D6×10 MO; 4–5 pierde 1 equipo al azar; 6 ileso.' },
  { code: '22', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
  { code: '23', title: 'Plaga en Aldea', text: 'Pueden pasar de largo a la próx. misión o ayudar. Si entran, CON CD 12 o 1D6 c/u: 1 (-1 Atq próx. misión), 2 (-1 Def próx. misión), 3–6 sano.' },
  { code: '24', title: 'Fantasma del Guerrero', text: 'Pide recuperar su mandoble (se añade al botín de un monstruo en la próx. misión). Si lo devuelven: gema de 250 MO; si se lo quedan: -1 PC permanente.' },
  { code: '25', title: 'Prisionero de Mercenarios', text: 'Ocultarse o rescatarlo (Sigilo/Ataque o 1D6 +1 por daga/arco): 1–2 pierden 1D6×10 MO c/u; 3–4 vencen y hallan 1D6×20 MO c/u; 5–6 lo rescatan (+2 días, +100 MO/héroe).' },
  { code: '26', title: 'Huéspedes de Finca', text: 'Banquete nocturno; al amanecer les cobran (1D6 por héroe sumados)×5 MO entre todos (Persuasión CD 13 reduce a la mitad).' },
  { code: '31', title: 'Guarida de la Bruja', text: 'Poción misteriosa por 1D6×10 MO c/u. 1D6 grupal: 1–2 (-1 Def próx. misión); 3–5 (+1 Atq y +1 Def próx. misión); 6 (+1 PC máximo permanente).' },
  { code: '32', title: 'Hambruna', text: '1D6 c/u: 1–2 dona 1 objeto; 3 dona 50 MO; 4–5 dona 1D6×10 MO; 6 dona 1D6×10 MO y recibe un Mandoble (Greatsword).' },
  { code: '33', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
  { code: '34', title: 'Mapa Engañoso', text: 'El destino resulta ser una aldehuela de 4 chozas y taberna: quedarse ahí o marchar directo a la próxima misión.' },
  { code: '35', title: 'Lago de los Sueños', text: 'SAB CD 12 o 1D6 c/u: 1–3 nada; 4–6 premonición (ignora por completo 1 ataque a elección en la próxima misión).' },
  { code: '36', title: 'Impacto de Rayo', text: '1D6 c/u (menor recibe rayo; DES CD 13 evita): pierde 2 piezas de armadura (o su armadura + 50 MO en ropa al llegar).' },
  { code: '41', title: 'Perdidos en Aldea Oculta', text: 'Hallan una aldea sin marcar; la Capital queda a 6 días. Deciden si terminar el viaje aquí o seguir hacia la Capital.' },
  { code: '42', title: 'Diluvio', text: 'El camino se inunda: ir directo a la próx. misión o pagar 20 MO/héroe al barquero.' },
  { code: '43', title: 'Aldea Saqueada', text: 'Arrasada por orcos; ayudan 1 día a reconstruir (+1 día de viaje, +1 Reputación opcional si donan 25 MO).' },
  { code: '44', title: 'La Esfinge', combat: 'esfinge', text: 'Pueden pasar de largo o responder su acertijo (INT/Arcano CD 14 o 1D6+PM ≥ 10 → gema de 2D6×100 MO). Si fallan: ¡Combate en Sala Central vs Esfinge (6 PC, -1 DC cuerpo a cuerpo)!' },
  { code: '45', title: 'Bifurcación', text: 'Supervivencia CD 12 o 1D6: 1–3 camino erróneo (llegan a una Aldea); 4–6 camino correcto.' },
  { code: '46', title: 'Emboscada Goblin', text: 'Cada héroe tira 1D6 + Ataque: 2–5 noqueado (pierde 1 arma azar y 1D6×50 MO); 6–9 gana 1D6×10 MO; 10–12 gana 1D6×50 MO.' },
  { code: '51', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
  { code: '52', title: 'Tormenta de Nieve', text: 'Deben abandonar su destino y refugiarse en la Aldea más cercana.' },
  { code: '53', title: 'Dando Vueltas en Círculos', text: 'Regresan al punto de partida (Supervivencia CD 14 evita esto); recalcular días de viaje.' },
  { code: '54', title: 'Desprendimiento de Rocas', text: 'Pagar 1D6×50 MO a mineros para despejar (Atletismo grupal CD 14 ahorra la mitad) o rodear (+4 días de viaje).' },
  { code: '55', title: 'Carruaje Imperial', text: 'Un cochero ofrece llevarlos directo al destino por 1D6×10 MO/héroe sin más tiradas de peligro.' },
  { code: '56', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
  { code: '61', title: 'Campamento de la Milicia', text: 'Cobran 30 MO/héroe por paso seguro (Persuasión CD 13 reduce a 15 MO); si no pagan, rodeo (+4 días).' },
  { code: '62', title: 'Bandidos en el Camino', combat: 'orco', text: 'Pagar 1D6×20 MO/héroe o combatir en Sala Central vs 2 Abominaciones + 3 Orcos (botín 2D6×50 MO).' },
  { code: '63', title: 'Campo de Batalla', text: 'Rodear (+3 días) o infiltrarse (Sigilo CD 12 o 1D6): 1–3 pasan; 4–5 si 1D6 ≤ PM ganan +200 MO en Pueblo/Capital; 6 capturados por orcos (escapan, 1D6 c/u: 1 = -1 PC próx. misión, 2 = pierde 1 objeto).' },
  { code: '64', title: 'Tormenta en Campamento', text: 'Un vendaval arrasa el campamento (Supervivencia CD 13 protege el equipo); cada héroe que falle pierde 1 objeto común al azar.' },
  { code: '65', title: 'Estatua de Jade', combat: 'estatua_jade', text: 'Estatua inmóvil en la sala central (solo ataca si la atacan: Mov 0, Atq 4, Def 5, PC 3). Al destruirla suelta 1 Pergamino Mágico al azar.' },
  { code: '66', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
];

// ============================================================================
// TABLA 2: DANGER TABLE B (36 entradas · 11–66)
// ============================================================================
export const DANGER_TABLE_B = [
  { code: '11', title: 'Fruta Extraña', text: 'Arbustos con frutas rosas: cada una restaura +1 PC. Cada héroe recoge hasta 1D6 frutas (se estropean tras la próxima misión).' },
  { code: '12', title: 'Bosque Inmenso', text: 'Si iban a la Capital deben desviarse a una Aldea (toma 2 días cruzar el bosque hacia ella).' },
  { code: '13', title: 'Runas Antiguas', text: 'Arcano CD 13 o 1D6 ≥ PM actuales: el próximo dado que tire ese héroe en cualquier tabla contará automáticamente como 6.' },
  { code: '14', title: 'Serpiente Gigante', text: 'El héroe con menor 1D6 queda atrapado: debe sacar 6 en 1D6 (o Atletismo CD 14) o pierde 1 PC/intento. Aliados tiran 1D6 (5–6 la hieren); se suelta tras 3 heridas.' },
  { code: '15', title: 'Destello entre Arbustos', text: 'El héroe con mayor 1D6/Percepción puede meter la mano: 1–3 trampa de oso (-2 PC, -1 Atq y -1 Def próx. misión); 4–6 roba 1 Tesoro sin trampas.' },
  { code: '16', title: 'Pequeña Aldea Dañada', text: 'Aldea azotada por tormenta; si se quedan ayudando cobran 20 MO/héroe por cada día trabajado.' },
  { code: '21', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
  { code: '22', title: 'Aves del Paraíso', text: 'Lanzadores de conjuros tiran 1D6 ≤ PM actuales (o Arcano CD 13): si triunfan ganan +1 PM permanente.' },
  { code: '23', title: 'Mercader Enano', text: 'Vende mapa de la próx. misión por 350 MO. 1D6: 1–3 falso; 4–5 revela 2 salas; 6 revela todo el mapa.' },
  { code: '24', title: 'Cueva Misteriosa', combat: 'orco', text: 'Si entran (Sala Central), 1D6: 1 (1D6 Guerreros Terror); 2 (2D6 Goblins); 3 (1D6 Esqueletos + 1D6 Zombis); 4 (1D6+4 Orcos); 5–6 vacía con 1D6×100 MO.' },
  { code: '25', title: 'Ermitaño Ciego', text: 'Bendición del ermitaño: la próxima vez que deban tirar en la Tabla Catastrófica podrán ignorar el resultado y repetirla.' },
  { code: '26', title: 'Señal de Camino', text: 'Supervivencia CD 12 o 1D6: 1 perdidos (recalcular viaje); 2–4 el destino resulta ser una Aldea; 5–6 atajo (-1 día de viaje).' },
  { code: '31', title: 'Dríadas del Bosque', text: 'SAB CD 12 o 1D6 c/u: 1 (-1 PC máx. por 1D6 misiones); 2–3 (-1 DC Atq próx. misión); 4–5 pasan ilesos; 6 fruta que cura todos los PC.' },
  { code: '32', title: 'Aldea de los Condenados', text: '¡Los aldeanos son Ghouls! Cada héroe tira 1D6 + Ataque: ≥8 escapa ileso; ≤7 sufre -1 PC y -4 Mov en la próxima misión.' },
  { code: '33', title: 'Incendio Forestal', text: 'Las llamas bloquean la ruta: +2 días de viaje para rodearlo.' },
  { code: '34', title: 'Ceremonia Extraña', text: 'Si investigan, 1D6: 1–4 maldición (el próximo 6 de cada héroe cuenta como 1); 5–6 regalan 1 carta de Tesoro c/u.' },
  { code: '35', title: 'Mujer Misteriosa (Súcubo)', combat: 'sucubo', text: 'Pide 1 curación o 50 MO para su hijo. Si la ignoran se transforma en Súcubo en Sala Central (Mov 10, Atq 2, Def 2, PC 3, PM 3, -1 DC cuerpo a cuerpo).' },
  { code: '36', title: 'Hadas del Bosque', text: 'Polvo dorado en una cascada: cada héroe gana +2 PC temporales para la próxima misión.' },
  { code: '41', title: 'Jardín Oculto', text: 'Frutas maduras y sendero claro: reducen en 1 día el viaje.' },
  { code: '42', title: 'Peaje del Puente', text: 'Pagar 5 MO por cada pieza de equipo que carguen (Persuasión CD 13 reduce a la mitad) o rodear (+2 días).' },
  { code: '43', title: 'Campeones del Terror', combat: 'guerrero_terror', text: 'Emboscada en Sala Central vs 3 Guerreros del Terror. Botín: 1D6×100 MO a repartir + 1 Pergamino al azar.' },
  { code: '44', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
  { code: '45', title: 'Sin Provisiones', text: 'Escasez de comida (Supervivencia CD 12 evita). 1D6 c/u: 1–2 (-1 PC próx. misión); 3+ sin penalización.' },
  { code: '46', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
  { code: '51', title: 'Estrella Fugaz', text: 'El héroe con mayor 1D6 pide un deseo: podrá repetir 1 tirada en Settlement Event en el próximo asentamiento.' },
  { code: '52', title: 'Slime en Ruinas', combat: 'slime_acido', text: 'Si entran a la casa en ruinas hay un Slime Ácido (Mov 4, Atq 2, Def 2, PC 3). En cuerpo a cuerpo, cada Escudo Negro disuelve el arma (no artefactos). Suelta gema 1D6×50 MO.' },
  { code: '53', title: 'La Torre de la Doncella', text: 'Usan Cuerda (se gasta) para rescatarla y escoltarla. Al llegar, 1D6: 2–6 recompensa 1D6×100 MO; 1 acusa de secuestro (1D6 días cárcel + multa 1D6×25 MO c/u).' },
  { code: '54', title: 'Setas Salvajes Azules', text: 'Si las comen (Naturaleza CD 12 da +1), 1D6 común: 1–3 (-1 PC próx. misión); 4–5 (+2 PC iniciales próx. misión); 6 (+1 PC máximo permanente).' },
  { code: '55', title: 'Obelisco Arcano', text: 'Destello rúnico: cada héroe gana +1 PM durante la próxima misión.' },
  { code: '56', title: 'Unicornio Rosa', text: '1D6 c/u: quien saque 6 ve al unicornio y podrá repetir 1 dado en cualquier momento de la próxima misión.' },
  { code: '61', title: 'Fortaleza Bandida', combat: 'guerrero_terror', text: 'Rodear (+3 días) o asaltar Sala Central vs 2 Abominaciones, 3 Orcos y 1 Guerrero del Terror líder (+2 días escoltando al líder = 2D6×100 MO).' },
  { code: '62', title: 'Tribu Bárbara', text: 'Si hay un Bárbaro en el grupo regalan un Elixir Heroico; si no, rodean el campamento (+1 día).' },
  { code: '63', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
  { code: '64', title: 'Aparición Sangrienta', text: 'SAB CD 12 o 1D6 c/u: 1–2 (-1 PM próx. misión); 3–6 sin penalización.' },
  { code: '65', title: 'Olor Nauseabundo', text: '1D6: 1–4 aldea arrasada, rescatan niño herido (+1 día de viaje); 5–6 campamento orco destruido, hallan 1D6×20 MO.' },
  { code: '66', title: 'Día Tranquilo (Quiet Day)', quiet: true, text: 'Viaje sereno sin incidentes. Cada héroe recupera +1 PC o +1 Hechizo/Habilidad.' },
];

// ============================================================================
// TABLA 3: TAVERN TABLE (36 entradas · 11–66)
// ============================================================================
export const TAVERN_TABLE = [
  { code: '11', title: 'Juerga de Taberna', text: 'Invitas rondas a toda la posada: pagas 1D6×20 MO.' },
  { code: '12', title: 'Pulseadas vs Mercenario', text: 'Apuesta máx. 200 MO. Atletismo CD 13 o 1D6 (+1 Bárbaro/Enano): 1–2 pierdes; 3 recuperas apuesta; 4–6 ganas el doble.' },
  { code: '13', title: 'Nada Fuera de lo Común', quiet: true, text: 'Velada tranquila en la taberna.' },
  { code: '14', title: 'Estatuas Misteriosas', combat: 'momia', text: 'Pasadizo oculto tras el baño: combate en sala 4×4 vs 1 Momia; recompensa 2 gemas de 50 MO c/u.' },
  { code: '15', title: 'Encuentro Romántico (Tiefling)', text: 'Velada inolvidable: ganas +1 Dado de Defensa durante la próxima misión.' },
  { code: '16', title: 'Pelea de Taberna', text: 'Si intervienes, 1D6 (+2 Bárbaro/Enano): 1 cárcel 1D6 días; 2 roban 1D6×10 MO; 3 expulsado; 4 (-1 PC próx. misión); 5 (+20 MO); 6 (+50 MO).' },
  { code: '21', title: 'Adivina', text: 'Paga 50 MO y tira 1D6: 1–2 (-1 DC Atq si par / Def si impar próx. misión); 3–4 recupera 50 MO; 5–6 repite 1 dado de combate hasta 3 veces en la próx. misión.' },
  { code: '22', title: 'Nada Fuera de lo Común', quiet: true, text: 'Velada tranquila en la taberna.' },
  { code: '23', title: 'Reencuentro con un Amigo', text: 'Celebración a lo grande: pagas 2D6×20 MO en rondas.' },
  { code: '24', title: 'Maestro Guerrero Élfico', text: 'Ofrece enseñar 1 Maestría Nivel 1 (ingredientes 200 MO) si vences a un clon exacto de tu héroe en la sala central; si pierdes: -2 PM próx. misión.' },
  { code: '25', title: 'Partida de Dados', text: '1D6 (+1 lanzador de conjuros): 1–3 pierdes 50 MO; 4–6 ganas 50 MO.' },
  { code: '26', title: 'Tatuaje Legendario', text: 'Tras demasiadas jarras te despiertas con un tatuaje épico de dragón en el brazo (puro rol / +1 a Intimidación en tabernas).' },
  { code: '31', title: 'Nada Fuera de lo Común', quiet: true, text: 'Velada tranquila en la taberna.' },
  { code: '32', title: 'Vendedor Sospechoso', text: 'Ofrece 3 viales de Agua Bendita robados por 400 MO; si compras, pierdes 1 Ficha de Reputación.' },
  { code: '33', title: 'Relato Cautivador', text: 'Tu historia encanta a todos: al comprar tira 1D6: 1–2 mercader rechaza; 3–6 compras a mitad de precio.' },
  { code: '34', title: 'Despedida de Soltero Enana', text: 'Si te unes a la fiesta, empiezas la próxima misión con -2 PM por la resaca monumental.' },
  { code: '35', title: 'Viejo Conocido', text: 'Te quedas dormido y te deja la cuenta: pagas 1D6×10 MO.' },
  { code: '36', title: 'Comida en Mal Estado', text: 'Si PM ≥ 4 (o CON CD 12) lo notas a tiempo; si no, empiezas la próxima misión con -1 PC.' },
  { code: '41', title: 'Concurso de Bebida', text: 'Apuesta 50 MO y tira 1D6 (+2 Bárbaro/Enano): 1–3 pierdes; 4–6 ganas 1D6×50 MO. En cualquier caso, en la próx. misión mueves con 1D6.' },
  { code: '42', title: 'Viejo Mendigo', text: 'Pide 10 MO. Si se las das regala 1 Agua Bendita; si te niegas te maldice (-2 PC en la próxima misión).' },
  { code: '43', title: 'Nada Fuera de lo Común', quiet: true, text: 'Velada tranquila en la taberna.' },
  { code: '44', title: 'Dados Mágicos', text: 'Pipa misteriosa; 1D6 (+1 lanzador): 1–5 pierdes 50 MO; 6 ganas 50 MO.' },
  { code: '45', title: 'Cazador de Monstruos', text: 'Te enseña un punto débil (+1 DC 1 vez/misión contra esa familia). 1D6: 1–3 Orcos/Goblins; 4–5 Esqueletos/Zombis; 6 Guerreros del Terror.' },
  { code: '46', title: 'Ruleta Helada', text: 'Reto de cerveza glacial: 1D6 + PC (+1 Bárbaro/Enano): ≥13 ganas 100 MO; <10 pierdes y pierdes 1 Reputación.' },
  { code: '51', title: 'Borrachera Melancólica', text: 'Noche amarga: empiezas la próxima misión con -1 PM.' },
  { code: '52', title: 'Manos Rápidas (Carterista)', text: 'Percepción CD 13 o 1D6: 1–3 te roban el oro encima; 4–6 lo atrapas y cobras 50 MO de recompensa.' },
  { code: '53', title: 'Incendio en Establos', text: 'Te acusan injustamente: gasta 1 Reputación o quedas expulsado de la ciudad.' },
  { code: '54', title: 'Nada Fuera de lo Común', quiet: true, text: 'Velada tranquila en la taberna.' },
  { code: '55', title: 'Borrachera Molesta', text: 'Discutes con el posadero: gasta 1 Reputación (o Persuasión CD 14) o te expulsan.' },
  { code: '56', title: 'Visión Borrosa', text: 'Bebida rara; 1D6: 1–3 envenenado (-1 DC Defensa próx. misión); 4–6 solo resaca fuerte.' },
  { code: '61', title: 'Nada Fuera de lo Común', quiet: true, text: 'Velada tranquila en la taberna.' },
  { code: '62', title: 'Pariente Lejano', text: 'El posadero jura que eres familia suya y te regala 2D6×10 MO.' },
  { code: '63', title: 'Buena Prensa', text: 'Un bardo pide 20 MO; si pagas canta tus hazañas y el próximo mercader te hace -50 MO de descuento.' },
  { code: '64', title: 'Emboscada en el Baño', combat: 'orco', text: 'Combate en sala 3×4 vs 2 Goblins + 2 Orcos (Guerrero/Enano) o 1 Goblin + 1 Orco (Elfo/Mago). Botín: 2D6×10 MO.' },
  { code: '65', title: 'Mercader Enano Errante', text: 'Vende Poción Restauradora (250 MO), Amuleto Suerte (100 MO), Brazaletes Bronce (30 MO), Baratijas (20 MO). Tira 1D6/ítem: con 1 es falso.' },
  { code: '66', title: 'Nada Fuera de lo Común', quiet: true, text: 'Velada tranquila en la taberna.' },
];

// ============================================================================
// TABLA 4: BLACK MARKET TABLE (36 entradas · 11–66)
// ============================================================================
export const BLACK_MARKET_TABLE = [
  { code: '11', title: 'Bandidos del Callejón', combat: 'orco', text: 'Paga 1D6×20 MO o combate en Sala Central vs 4 Orcos (botín gema 1D6×50 MO; si caes pierdes tu oro).' },
  { code: '12', title: 'Campeón del Terror', combat: 'guerrero_terror', text: 'Duelo en sala 4×4 vs 1 Guerrero del Terror. Si vences: 1D6×50 MO + 1 Pergamino al azar.' },
  { code: '13', title: 'Todo Tranquilo', quiet: true, text: 'Sales del Mercado Negro sin llamar la atención.' },
  { code: '14', title: 'Perdido en los Callejones', text: 'Anciana cobra 50 MO por guiarte. Si no pagas, tira 1D6 hasta sacar 6 (máx. 10 intentos; si fallas te desmayas sin oro).' },
  { code: '15', title: 'Paliza en la Esquina', text: 'Si defiendes a un joven, 1D6 (+2 Bárbaro/Enano): 1–3 pierdes tu oro; 4–6 espantas matones y recibes gema de 30 MO.' },
  { code: '16', title: 'Vendedor Callejero', text: 'Vende Poción Restauradora (250), Amuleto Suerte (100), Brazaletes (30), Baratijas (20). 1D6/ítem: con 1 es falso.' },
  { code: '21', title: 'La Carne es Débil (Tiefling)', text: 'Por 100 MO ganas +1 Dado de Defensa durante toda la próxima misión.' },
  { code: '22', title: 'Todo Tranquilo', quiet: true, text: 'Sales del Mercado Negro sin incidentes.' },
  { code: '23', title: 'Dados Mágicos', text: '1D6 (+1 lanzador): 1–5 pierdes 50 MO; 6 ganas 50 MO.' },
  { code: '24', title: 'Reto de Fuerza', text: 'Levantar roca (apuesta máx. 200 MO). Atletismo CD 13 o 1D6 (+1 Bárbaro/Enano): 1–2 pierdes; 3 empate; 4–6 ganas el doble.' },
  { code: '25', title: 'Fruta Rosa Clandestina', text: 'Compra hasta 1D6 frutas a 30 MO c/u (+1 PC al comerla; caducan tras la próxima misión).' },
  { code: '26', title: 'Emboscada en Sombras', combat: 'orco', text: 'Combate en sala 4×4 vs 2 Goblins + 2 Orcos (Bárbaro/Enano) o 1 Goblin + 1 Orco (Elfo/Mago). Botín: 2D6×10 MO.' },
  { code: '31', title: 'Todo Tranquilo', quiet: true, text: 'Sales del Mercado Negro sin incidentes.' },
  { code: '32', title: 'Todo Tranquilo', quiet: true, text: 'Sales del Mercado Negro sin incidentes.' },
  { code: '33', title: 'Encantamiento del Mendigo', text: 'Por 200 MO intenta encantar un arma (1D6): 1–4 destruye el arma; 5 runa +1 DC Ataque; 6 runa 1 dado siempre Calavera.' },
  { code: '34', title: 'Trato Turbio', text: 'Paga 100 MO y tira 1D6 (+1 Pícaro): 1–2 cárcel 1D6 días; 3–4 gema 60 MO; 5–6 mapa de 1 puerta secreta o 3 trampas de la próx. misión.' },
  { code: '35', title: 'Hada Cautiva', text: 'Tira 1D6: con 6 te regala polvo mágico para repetir 1 dado en cualquier momento de la próxima misión.' },
  { code: '36', title: 'Reyerta Clandestina', text: '1D6 (+2 Bárbaro/Enano): 1 cárcel 1D6 días; 2 pierdes tu oro; 3 expulsado del Mercado Negro; 4 (-1 PC próx. misión); 5 (+20 MO); 6 (+100 MO).' },
  { code: '41', title: 'Espada Falsa', text: 'Anciana ofrece "espada mágica" por 1D6×50 MO (si caes, resulta ser una simple Espada Corta).' },
  { code: '42', title: 'Dedos Ligeros', text: 'Percepción CD 13 o 1D6: 1–3 pierdes tu oro; 4–6 lo entregas y cobras 50 MO.' },
  { code: '43', title: 'Todo Tranquilo', quiet: true, text: 'Sales del Mercado Negro sin incidentes.' },
  { code: '44', title: 'Soldado Herido', text: 'Te vende su legendario Martillo de Guerra (5 DC Ataque, 2 manos, no lanzadores) por solo 200 MO.' },
  { code: '45', title: 'Bandidos de la Esquina', combat: 'orco', text: 'Paga 1D6×20 MO o combate vs 4 Orcos (botín gema 1D6×50 MO).' },
  { code: '46', title: '¡Mímico de Letrina!', combat: 'mimico_letrina', text: '¡La letrina (3×2) cobra vida! Combate vs Mímico de Letrina (Mov 6, Atq 3, Def 2, PC 2). Recompensa: 1D6×100 MO.' },
  { code: '51', title: 'Apuesta Clandestina', text: 'Apuesta 300 MO y tira 1D6: 1–3 pierdes; 4–5 empatas; 6 ganas 1D6×300 MO.' },
  { code: '52', title: 'Fruta Azul (Consumo Inmediato)', text: '30 MO, 1D6: 1–2 (+1 PC próx. misión); 3–4 (+1 PM próx. misión); 5–6 (-1 PC máx. próx. misión).' },
  { code: '53', title: 'Bandidos Pesados', combat: 'abominacion', text: 'Paga 1D6×20 MO o combate en Sala Central vs 2 Abominaciones (botín gema 1D6×50 MO).' },
  { code: '54', title: 'Monedas Falsas', text: 'Descubres que 1D6×10 MO de tu bolsa son plomo pintado y se descartan.' },
  { code: '55', title: 'Todo Tranquilo', quiet: true, text: 'Sales del Mercado Negro sin incidentes.' },
  { code: '56', title: 'Pelea con Mercader', text: '1D6 (+2 Bárbaro/Enano): 1 pagas 150 MO; 2 pierdes 100 MO; 3 empate; 4 multa 50 MO; 5 (+100 MO); 6 (+150 MO).' },
  { code: '61', title: 'Todo Tranquilo', quiet: true, text: 'Sales del Mercado Negro sin incidentes.' },
  { code: '62', title: 'Golpe de Suerte', text: 'Rebuscas en un saco olvidado, 1D6: 1–2 nada; 3 (1D6 MO); 4–5 (2D6 MO); 6 (gema 40 MO).' },
  { code: '63', title: 'Alcantarilla Misteriosa', combat: 'momia', text: 'Sala 4×4 con 1 Momia y 1 Zombi; si vences hallas 2 gemas de 50 MO c/u.' },
  { code: '64', title: 'Adivina del Submundo', text: 'Paga 50 MO, 1D6: 1–2 (-1 Atq/Def próx. misión); 3–5 emboscada vs Orco + Abominación (+200 MO si vences); 6 repite 1 dado combate ×3 próx. misión.' },
  { code: '65', title: 'Bandidos de Élite', combat: 'abominacion', text: 'Paga 1D6×20 MO o combate vs 2 Abominaciones (botín 1D6×50 MO).' },
  { code: '66', title: 'Todo Tranquilo', quiet: true, text: 'Sales del Mercado Negro sin incidentes.' },
];

// ============================================================================
// TABLA 5: HAVEN TABLE (36 entradas · 11–66 · Refugio con Alfred)
// ============================================================================
export const HAVEN_TABLE = [
  { code: '11', title: 'Viejo Conocido', text: 'Un camarada pide ayuda: si donan ≥100 MO (oro o equipo), entrega 1 Pergamino al azar.' },
  { code: '12', title: 'Todo Tranquilo en el Refugio', quiet: true, text: 'Alfred sirve té caliente; día apacible en el Haven.' },
  { code: '13', title: '¡Alfred Atado!', combat: 'orco', text: 'Matones noquean a Alfred: combate en Sala Central vs 3 Exploradores y 1 Ballestero.' },
  { code: '14', title: 'Donación de Viuda', text: 'Una noble agradecida dona 300 MO al Refugio.' },
  { code: '15', title: 'Incendio Nocturno', text: '1D6 c/u (DES CD 12 evita): 1–2 (-1 PC máx. próx. misión); 3–5 destruye 1 objeto azar; 6 ileso y halla gema 1D6×50 MO.' },
  { code: '16', title: 'Ruido tras la Chimenea', combat: 'momia', text: 'Pasaje oculto: combate vs 2 Momias, 2 Esqueletos y 2 Zombis; recompensa 2 gemas de 150 MO c/u.' },
  { code: '21', title: 'Asalto Nocturno', combat: 'guerrero_terror', text: '4 Guerreros del Terror irrumpen en la Sala Central. Botín: 1D6×100 MO + 1 Pergamino.' },
  { code: '22', title: 'Enfermedad de Alfred', text: 'Alfred cae enfermo: pagan 200 MO entre todos para curarlo (Medicina CD 14 reduce a 100 MO).' },
  { code: '23', title: 'Todo Tranquilo en el Refugio', quiet: true, text: 'Día apacible en el Haven.' },
  { code: '24', title: 'Fallo Alquímico (Slime 2×2)', combat: 'slime_acido', text: 'Un Slime Ácido 2×2 brota del laboratorio (Mov 4, Atq 2, Def 2, PC 3; Escudo Negro disuelve armas no-artefacto).' },
  { code: '25', title: 'Todo Tranquilo en el Refugio', quiet: true, text: 'Día apacible en el Haven.' },
  { code: '26', title: 'Misiva del Sheriff', text: 'Carta oficial: ¡las recompensas del Sheriff por bajas en la próxima misión serán el DOBLE!' },
  { code: '31', title: 'Mercenario Traidor', text: 'Espadachín se ofrece por solo 30 MO; ¡si lo contratan, tras limpiar una sala en la próx. misión los traiciona!' },
  { code: '32', title: 'Todo Tranquilo en el Refugio', quiet: true, text: 'Día apacible en el Haven.' },
  { code: '33', title: 'Socios de Negocio', combat: 'guerrero_terror', text: 'Hermanos mercenarios (Explorador + Ballestero) por 100 MO; si rechazan atacan con 1 Espadachín y 1 Alabardero (botín 1D6×20 MO).' },
  { code: '34', title: '¡Cofre Mímico Gigante!', combat: 'mimico', text: 'Un paquete sospechoso en la Sala Central resulta ser un Mímico (PC 4). Suelta 1D6×100 MO.' },
  { code: '35', title: 'Fachada Vandalizada', text: 'Pintan sangre en la puerta: pagar 150 MO de limpieza o quedarse 3 días extra (solo Taberna).' },
  { code: '36', title: '¿Quieres un Reloj de Sol?', text: 'Un vendedor insistente ofrece un reloj de sol meramente decorativo por 200 MO.' },
  { code: '41', title: 'Fuga en los Baños', text: 'Avería grave en las tuberías: 200 MO de reparación.' },
  { code: '42', title: 'Cena con el Rey', text: 'El Rey visita el Refugio: pueden gastar 200–500 MO en banquete (si superan 350 MO, el Rey reembolsa todo y gana fama).' },
  { code: '43', title: 'Donación del Marqués de Carabas', text: 'Reciben un cofrecillo con 500 MO.' },
  { code: '44', title: 'Todo Tranquilo en el Refugio', quiet: true, text: 'Día apacible en el Haven.' },
  { code: '45', title: 'Protesta en la Puerta', text: 'Pagar 150 MO de limpieza o quedarse 3 días extra (solo Taberna).' },
  { code: '46', title: 'Asalto del Terror', combat: 'guerrero_terror', text: 'Combate en Sala Central vs 4 Guerreros del Terror (botín 1D6×100 MO + 1 Pergamino).' },
  { code: '51', title: 'Emboscada Goblin en la Cena', text: 'Cada héroe tira 1D6 + Ataque: 2–5 pierde 1 arma azar y 1D6×50 MO; 6–9 (+1D6×10 MO); 10–12 (+1D6×50 MO).' },
  { code: '52', title: 'Regalo del Conde Malabot', text: 'Donación de 150 MO para el Refugio.' },
  { code: '53', title: 'Todo Tranquilo en el Refugio', quiet: true, text: 'Día apacible en el Haven.' },
  { code: '54', title: '¡Poltergeist en el Armario!', combat: 'poltergeist', text: 'Un armario poseído ataca en la Sala Central (Mov 3, Atq 3, Def 4, PC 6). Al vencerlo: gema de 100 MO.' },
  { code: '55', title: 'Decorador Exigente (Enzo)', combat: 'guerrero_terror', text: 'Exige 500 MO por "reforma"; si se niegan envía 4 Guerreros del Terror (botín colgante 200 MO).' },
  { code: '56', title: 'Goblins en la Despensa', text: '1D6 + Ataque c/u: 2–5 pierde 1 arma azar y 1D6×50 MO; 6–9 (+1D6×10 MO); 10–12 (+1D6×50 MO).' },
  { code: '61', title: 'Todo Tranquilo en el Refugio', quiet: true, text: 'Día apacible en el Haven.' },
  { code: '62', title: 'El Viejo Zorro (Old Fox)', text: 'Un veterano ofrece entrenar 1 Maestría de Nivel 1 a un héroe al azar por solo 300 MO.' },
  { code: '63', title: 'Aparición Espectral', combat: 'momia', text: 'Fantasma pide recuperar su Espada Corta en la próx. misión. Al devolverla: gema 250 MO; si se niegan: 4 Momias en sala 4×4.' },
  { code: '64', title: 'Todo Tranquilo en el Refugio', quiet: true, text: 'Día apacible en el Haven.' },
  { code: '65', title: 'Saco Misterioso', combat: 'esqueleto', text: 'Si lo abren, 1D6: 1 (4 Esqueletos); 2–3 basura; 4 gema 100 MO; 5 (6 Goblins); 6 gema 200 MO.' },
  { code: '66', title: 'Tejado Dañado', text: 'Reparación urgente del tejado: 200 MO entre el grupo.' },
];

// ============================================================================
// TABLA 6: SETTLEMENT TABLE A (36 entradas · 11–66)
// ============================================================================
export const SETTLEMENT_TABLE_A = [
  { code: '11', title: 'Expulsión', text: 'La guardia te expulsa de la ciudad (fianza 300 MO; cada noche fuera tira 1D6: con 1 bandidos roban tu oro).' },
  { code: '12', title: 'Inversión Comercial', text: 'Invierte 1D6×50 MO y recibe Certificado. En futuros asentamientos tira 1D6: 1–2 quiebra (-1D6×50 MO deuda); 3–5 ganas 1D6×20 MO; 6 ganas 1D6×50 MO.' },
  { code: '13', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '14', title: 'Trampa de la Anciana', text: 'Te noquean en una emboscada y roban 1D6×20 MO (Percepción CD 13 evita la trampa).' },
  { code: '15', title: 'Carterista', text: 'Percepción CD 12 o un ladrón te roba 1D6×20 MO.' },
  { code: '16', title: 'Aguas Termales', text: 'Baño reparador: ganas +1 PC máximo durante toda la próxima misión.' },
  { code: '21', title: 'Estafa', text: 'Si compraste un objeto hoy resulta falso y se descarta (Investigación CD 13 recupera el oro).' },
  { code: '22', title: 'Pelea con Mercader', text: '1D6 (+2 Bárbaro/Enano): 1 pagas 150 MO; 2 pierdes 100 MO; 3 empate; 4 multa 50 MO; 5 (+100 MO); 6 (+150 MO).' },
  { code: '23', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '24', title: 'Intoxicación Alimentaria', text: '2 días en cama sin acciones (sigues pagando posada; CON CD 13 reduce a 1 día).' },
  { code: '25', title: 'Rescate al Mercader', text: '1D6: 1 incriminado (soborno 1D6×50 MO); 2–5 salvas al mercader (+50 MO); 6 capturas ladrón (+100 MO y Campeón del Asentamiento).' },
  { code: '26', title: 'Un Día Honesto de Trabajo', text: 'Cargas heno todo el día y cobras 50 MO.' },
  { code: '31', title: 'Amor Verdadero (Boda)', strictWarning: true, text: 'Boda o huir de la ciudad: si te casas recibes 1D6×100 MO en regalos y tiras 1D6 (con 1: Modo Estricto = retiro; Modo Heroico = dona 100 MO a tu familia y sigues aventurando).' },
  { code: '32', title: 'Bebida Adulterada', text: 'CON CD 12 o 1D6: 1–3 (-1 DC Defensa próx. misión); 4–6 solo resaca.' },
  { code: '33', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '34', title: 'Vida de Lujos', text: 'Juerga descontrolada: gastas 100 MO.' },
  { code: '35', title: 'Duelo al Atardecer', strictWarning: true, text: 'Aceptar o huir del asentamiento. 1D6 (+1 Bárbaro/Enano): 1 (Modo Estricto = muerte; Modo Heroico = herido grave -2 PC próx. misión y 100 MO médico); 2–4 empate y posada gratis; 5–6 ganas joya 2D6×50 MO + 1 Tesoro.' },
  { code: '36', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '41', title: 'Dados Callejeros', text: '1D6: 1–2 pierdes 1 objeto azar; 3–4 empate; 5 (+1D6×10 MO); 6 (+3D6×10 MO).' },
  { code: '42', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '43', title: 'Impuesto del Sheriff', text: 'Todos los precios del asentamiento suben +50 MO esta estancia.' },
  { code: '44', title: 'Cripta del Templo', text: 'Si registras la bolsa, 1D6: 1–2 medallón maldito (-1 PC máx. permanente hasta purificar en Templo); 3–4 escorpión (2 heridas); 5–6 gema 1D6×100 MO.' },
  { code: '45', title: 'Gran Feria', text: '1D6: 1–2 tiendas cerradas 1D6 días; 3 stock sube de categoría 1D6 días; 4–5 (-20% hoy); 6 (-50% hoy en tu 1ª compra).' },
  { code: '46', title: 'Confusión de Identidad', text: 'Encarcelado 7 días (sin gastos ni acciones) o tus aliados pagan fianza de 1D6×50 MO.' },
  { code: '51', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '52', title: 'Héroe del Incendio', text: 'Salvas a una familia: nombrado Campeón del Asentamiento y recibes gema de 1D6×20 MO.' },
  { code: '53', title: 'Perro Callejero', text: 'Adopta un perro fiel (Atq 2, Def 1, PC 3) gratis si el grupo aún no tiene mascota.' },
  { code: '54', title: 'Gente Supersticiosa', text: 'Si exhibes un objeto mágico te expulsan salvo que lo ocultes (Engaño/Persuasión CD 13).' },
  { code: '55', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '56', title: 'Falsificación', text: '1D6×10 MO de tu bolsa resultan falsas y se pierden.' },
  { code: '61', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '62', title: 'Donación al Templo', text: 'Si donas 1D6×25 MO podrás repetir 1 tirada de ataque en un combate futuro.' },
  { code: '63', title: 'La Gran Caza del Quarag', text: '1D6 (+1 Bárbaro/Enano): 1 nada; 2–3 (-2 PC inicio próx. misión); 4–5 recompensa 1D6×50 MO; 6 capa mágica que anula todo el daño de 2 ataques.' },
  { code: '64', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '65', title: 'Acusación de Brujería', text: 'Persuasión CD 13 o 1D6: 1–3 saltas el muro y esperas fuera; 4–5 necesitas disfraz (200 MO); 6 la guardia te exonera.' },
  { code: '66', title: 'Accidente de Carreta', text: 'Arrollado por un carro: 1D6 días reposo sin acciones, pero la anciana paga gastos y regala 1 Poción Curativa.' },
];

// ============================================================================
// TABLA 7: SETTLEMENT TABLE B (36 entradas · 11–66)
// ============================================================================
export const SETTLEMENT_TABLE_B = [
  { code: '11', title: 'Ermitaño Malhumorado', text: 'Si lo ayudas, tira 1 DC: Escudo → 1 Pergamino al azar; Calavera → maldición (1D6: 1 [-1 PC], 2 [-1 Atq], 3–6 convertido en cabra 1D6 días).' },
  { code: '12', title: 'Felínida Vampira', text: '1D6: 1–2 mordido (200 MO antídoto o -1 PC permanente); 3–4 pociones ineficaces próx. misión; 5–6 la vences y obtienes 2 viales de Veneno de Arma.' },
  { code: '13', title: 'Golpe de Suerte', text: '1D6: 1 nada; 2 (1 MO); 3 (1D6 MO); 4–5 (2D6 MO); 6 (gema 40 MO).' },
  { code: '14', title: 'Cumpleaños del Rey', text: '¡Feriado real! Todas las tiendas cierran durante los próximos 3 días.' },
  { code: '15', title: 'Espada Engañosa', text: 'Anciana vende falsa espada mágica por 1D6×50 MO (Investigación CD 12 detecta el fraude).' },
  { code: '16', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '21', title: 'Revuelta Campesina', text: '1D6: 1 multa 1D6×200 MO o cepo 1D6 días; 2–3 cárcel 1D6 días o 1D6×100 MO; 4–5 ganas Vendajes y 1D6×5 MO; 6 ganas 2D6 Vendajes y 1D6×50 MO.' },
  { code: '22', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '23', title: 'Temor a la Magia', text: 'Si muestras objetos mágicos debes marcharte o convencer a los vecinos (CAR CD 13).' },
  { code: '24', title: 'Puesto de Mercader (7 días)', text: 'Puedes atender un puesto 7 días (1D6/día): 1 (-1D6×25 MO); 2 (-70 MO); 3–5 (+1D6×50 MO); 6 (+1D6×100 MO).' },
  { code: '25', title: 'Fosa Común', text: 'Si investigas el cementerio, 1D6: 1–2 (-2 PC próx. misión); 3–4 nada; 5–6 gema 2D6×20 MO.' },
  { code: '26', title: 'Cartógrafo Local', text: 'En Pueblo dibuja mapa de Ubicaciones Especiales (1D6 c/u: 2–6 accesibles sin tirada). En Capital: Día Tranquilo.' },
  { code: '31', title: 'Acusado de Cultista', text: '1D6: 1–2 huyes fuera de muros; 3–4 escapas por callejones; 5–6 la turba se disculpa y entrega 50 MO.' },
  { code: '32', title: 'Mala Fama', text: 'El resto de la estancia solo te dejan entrar en Taberna, Mercado Negro y Casa de Apuestas.' },
  { code: '33', title: 'Maestro Rúnico Enano', text: 'Graba una runa en un arma cortante por 300 MO (un resultado de 1 en ataque cuenta como Calavera).' },
  { code: '34', title: 'Emboscada de Mercenario', combat: 'guerrero_terror', text: 'Duelo en pasillo 7×2 vs 1 Espadachín Mercenario; si sobrevives hallas 100 MO.' },
  { code: '35', title: 'Liquidación en el Armero', text: '¡Todo el equipo del Armero/Herrería está a MITAD DE PRECIO hoy!' },
  { code: '36', title: 'Visitante Divino', text: 'Paga 1D6×50 MO, 1D6: 1 estafa; 2–3 es Mentor y devuelve el oro; 4 ataque extra usable en las próx. 2 misiones; 5–6 doble ataque por turno en la próxima misión.' },
  { code: '41', title: 'Obras Viales', text: 'En Pueblo: -4 a tiradas para encontrar ubicaciones el resto de la estancia. En Capital: Día Tranquilo.' },
  { code: '42', title: 'Readmisión', text: 'Si algún compañero fue expulsado del asentamiento, la guardia le permite regresar.' },
  { code: '43', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '44', title: 'Pesadillas', text: 'SAB CD 12 o 1D6: 1–2 (-2 PM al iniciar la próx. misión); 3–6 sin efecto.' },
  { code: '45', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '46', title: 'Reformas en la Posada', text: 'El coste de alojamiento se duplica el resto de la estancia.' },
  { code: '51', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
  { code: '52', title: 'Título Heroico', text: 'Nombrado Defensor del Pueblo: ganas +1 Ficha de Reputación.' },
  { code: '53', title: 'Presagio Oscuro', text: 'Un cuervo sin ojos te observa: -2 PM durante la próxima misión.' },
  { code: '54', title: 'Jornalero', text: 'Trabajas en una obra por 10 MO hoy.' },
  { code: '55', title: 'Emboscada en el Callejón', combat: 'orco', text: 'Pasillo 7×2 vs 2 Goblins + 2 Orcos (Bárbaro/Enano) o 1 Goblin + 1 Orco (Elfo/Mago). Botín: 2D6×10 MO.' },
  { code: '56', title: 'Club de Lucha', text: '1D6 (+1 Bárbaro/Enano): 1 pierdes 50 MO; 2–4 empate y cena gratis; 5–6 ganas 1D6×50 MO.' },
  { code: '61', title: 'La Rosa Escarlata', text: 'Entrada 50 MO; 1D6: 1–2 enfermedad (-1 PC máx. próx. misión); 3–6 (+1 PC máx. próx. misión).' },
  { code: '62', title: 'Mercenario Sospechoso', text: 'Si le entregas cualquier curación de PC o PM, un Ballestero se une GRATIS para la próxima misión.' },
  { code: '63', title: 'Pariente Noble', text: 'El Señor local cree que eres su bisnieto y te regala 2D6×10 MO.' },
  { code: '64', title: 'Desafío de Ajedrez', text: 'Apuesta máx. 50 MO: 1D6 + PM del héroe debe superar 8 (o INT CD 13); si ganas cobras el doble.' },
  { code: '65', title: 'Mensaje de Mentor', text: 'Antes de iniciar la próxima misión, el DM revela 2 Puertas Secretas o 3 Trampas en el tablero.' },
  { code: '66', title: 'Día Tranquilo', quiet: true, text: 'Estancia pacífica en el asentamiento.' },
];

// ============================================================================
// TABLA 8: CATASTROPHIC TABLE (2–12 · Se tira al Día 10 de estancia)
// ============================================================================
export const CATASTROPHIC_TABLE = [
  { min: 2, max: 2, code: '2', title: '¡Campeones del Terror!', combat: 'guerrero_terror', text: 'Emboscada en la plaza (Sala Central) vs 4 Guerreros del Terror. Botín: 1D6×100 MO + 1 Pergamino al azar.' },
  { min: 3, max: 3, code: '3', title: 'Inundación Total', text: 'El río desborda cerrando todos los comercios: el grupo debe salir de inmediato hacia la próxima misión.' },
  { min: 4, max: 4, code: '4', title: 'Bajo Asedio Orco', text: 'Orcos y Goblins atacan las murallas. 1D6 c/u (Atletismo CD 13 da +1): 1 cae (-1 PC permanente); 2 herido (-1 PC máx. próx. misión); 3–6 los rechaza y cobra 100 MO.' },
  { min: 5, max: 5, code: '5', title: 'Inflación Galopante', text: 'Todos los precios y los gastos de posada se DUPLICAN durante el resto de la estancia.' },
  { min: 6, max: 9, code: '6–9', title: 'Sin Catástrofe', quiet: true, text: 'Por suerte el asentamiento permanece en calma hoy.' },
  { min: 10, max: 10, code: '10', title: 'Enfermedad Mortal', strictWarning: true, text: 'Peste en las calles: pueden salir ya a la próx. misión o quedarse (1D6 c/u: 1–3 en Modo Estricto = muerte; en Modo Heroico = -2 PC máx. próx. misión o pagar 100 MO en el Templo).' },
  { min: 11, max: 11, code: '11', title: 'Incendio en los Establos', text: 'Arden los establos del Señor; acusan a los héroes y los expulsan del asentamiento.' },
  { min: 12, max: 12, code: '12', title: 'Plaga y Cuarentena', text: 'El héroe con menor 1D6 contrae la plaga: el curandero cobra 1D6×50 MO o 2 días de cuarentena obligatoria.' },
];

// ============================================================================
// TABLA 9: RANDOM EVENTS EN MAZMORRA (36 entradas · 11–66 · pág. 45 y 102–105)
// ============================================================================
export const RANDOM_DUNGEON_EVENTS = [
  { code: '11', title: 'Dust to Dust (Polvo al Polvo)', spawnType: 'skeleton', text: 'Héroe al azar: detrás de él aparece 1 Esqueleto en casilla adyacente y ataca de inmediato.' },
  { code: '12', title: 'Shaky Legs (Piernas Temblorosas)', targetHero: true, text: 'Héroe al azar tira 1 DC por cada PM (o SAB CD 13): si no saca ≥2 Escudos Blancos, Zargon lo mueve hasta 12 casillas de inmediato.' },
  { code: '13', title: 'Mental Assault (Asalto Mental)', targetHero: true, text: 'Héroe al azar tira 1 DC por cada PM (o SAB CD 13): si no saca ≥2 Escudos Blancos, sufre 1 PC de daño.' },
  { code: '14', title: '¡Nada! (Falsa Alarma)', quiet: true, text: 'Un eco recorre la mazmorra, pero no ocurre nada.' },
  { code: '15', title: '¡Emboscada! (Ambush!)', spawnType: 'wandering', text: '¡El DOBLE de Monstruos Errantes de esta misión aparece y ataca de inmediato a un héroe al azar!' },
  { code: '16', title: 'Flecha en la Rodilla', targetHero: true, text: 'Un dardo oculto dispara contra un héroe al azar (-1 PC; DES CD 13 reduce a 0).' },
  { code: '21', title: 'Niebla Densa (Fog)', text: 'Una bruma espesa cubre el tablero: en el próximo turno todos los héroes mueven con 1 solo dado.' },
  { code: '22', title: 'Compañeros de Hueso (Bone Buddies)', spawnType: 'skeleton', text: 'La próxima vez que entre un No Muerto al tablero, añade 2 No Muertos adicionales del mismo tipo.' },
  { code: '23', title: '¡Nada! (Falsa Alarma)', quiet: true, text: 'Silencio inquietante, sin efecto.' },
  { code: '24', title: 'Voces tras la Puerta (Chatter)', text: '¡Se abre de golpe la puerta de la sala más cercana a los héroes, revelando su contenido!' },
  { code: '25', title: 'Trampa de Esquina (Trap)', spawnType: 'wandering', text: 'La próxima vez que un héroe doble una esquina o cruce una puerta, aparece 1 Monstruo Errante que ataca al instante.' },
  { code: '26', title: '¡Kamikaze!', text: 'El próximo monstruo que muera explota atacando a todos los adyacentes con tantos DC como sus PC máximos.' },
  { code: '31', title: 'Aliados Pieles Verdes', spawnType: 'orc', text: 'La próxima vez que entre un Orco o Goblin al tablero, añade 2 pieles verdes adicionales del mismo tipo.' },
  { code: '32', title: 'Flecha en la Rodilla', targetHero: true, text: 'Un dardo oculto dispara contra un héroe al azar (-1 PC; DES CD 13 evita).' },
  { code: '33', title: '¡Nada! (Falsa Alarma)', quiet: true, text: 'Sin efecto esta ronda.' },
  { code: '34', title: 'Desesperación', text: 'La próxima vez que un héroe sufra ≥1 PC de daño, pierde también 1 PM.' },
  { code: '35', title: 'Viga en el Ojo (Beam to the Eye)', text: 'Zargon elige una fila de 3 casillas: todos los héroes y monstruos ahí tiran 1 DC y pierden 1 PC si sacan Calavera.' },
  { code: '36', title: '¡Fallo Seguro! (Missed)', text: 'El próximo ataque de un héroe fallará automáticamente (el arma resbala o rebota).' },
  { code: '41', title: 'Favor de la Fortuna', rewardGold: 40, text: 'El primer héroe en doblar una esquina o entrar en sala vacía halla una gema de 1D6×10 MO.' },
  { code: '42', title: 'El Enterrador (Undertaker)', text: '¡El próximo monstruo asesinado resucita al instante en su casilla con todos sus PC!' },
  { code: '43', title: 'Colapso del Suelo (Floor Collapse)', spawnType: 'trap_pit', targetHero: true, text: 'Un héroe al azar cae en un foso (-1 PC); coloca una loseta de Trampa de Foso bajo él para el resto de la misión.' },
  { code: '44', title: 'Campeón del Terror', spawnType: 'dread_warrior', text: 'El próximo monstruo en aparecer (o el más débil de la sala) se transforma en un Guerrero del Terror.' },
  { code: '45', title: '¡Nada! (Falsa Alarma)', quiet: true, text: 'Sin efecto esta ronda.' },
  { code: '46', title: '¡Locura Súbita! (Sudden Madness)', targetHero: true, text: 'Héroe al azar tira 1 DC por cada PM (o SAB CD 13): sin Escudo Blanco, ¡Zargon controla su próximo turno completo!' },
  { code: '51', title: 'Flecha en la Rodilla', targetHero: true, text: 'Un dardo oculto dispara contra un héroe al azar (-1 PC; DES CD 13 evita).' },
  { code: '52', title: 'Compañeros de Hueso (Bone Buddies)', spawnType: 'skeleton', text: 'La próxima vez que entre un No Muerto al tablero, añade 2 No Muertos adicionales del mismo tipo.' },
  { code: '53', title: 'Magia Reflejada (Reflected Magic)', text: 'El próximo hechizo lanzado rebota sobre el lanzador si no saca ≥2 Escudos Blancos tirando 1 DC por cada PM (o Arcano CD 13).' },
  { code: '54', title: '¡Emboscada! (Ambush!)', spawnType: 'wandering', text: '¡El DOBLE de Monstruos Errantes aparece y ataca de inmediato a un héroe al azar!' },
  { code: '55', title: '¡Nada! (Falsa Alarma)', quiet: true, text: 'Sin efecto esta ronda.' },
  { code: '56', title: 'Favor de la Fortuna', rewardGold: 40, text: 'El primer héroe en doblar una esquina o entrar en sala vacía halla una gema de 1D6×10 MO.' },
  { code: '61', title: 'Gas Nocivo (Noxious Gas)', text: 'Cada héroe tira 2 DC (o CON CD 12): si saca al menos 1 Calavera pierde 1 PC.' },
  { code: '62', title: '¡Nada! (Falsa Alarma)', quiet: true, text: 'Sin efecto esta ronda.' },
  { code: '63', title: 'El Enterrador (Undertaker)', text: '¡El próximo monstruo asesinado resucita al instante con todos sus PC!' },
  { code: '64', title: 'Shaky Legs (Piernas Temblorosas)', targetHero: true, text: 'Héroe al azar tira 1 DC por cada PM (o SAB CD 13): sin ≥2 Escudos Blancos, Zargon lo mueve 12 casillas.' },
  { code: '65', title: 'Trampa de Esquina (Trap)', spawnType: 'wandering', text: 'La próxima vez que un héroe doble una esquina o cruce una puerta, aparece 1 Monstruo Errante que ataca al instante.' },
  { code: '66', title: 'Colapso del Suelo (Floor Collapse)', spawnType: 'trap_pit', targetHero: true, text: 'Un héroe al azar cae en un foso (-1 PC); coloca una loseta de Trampa de Foso bajo él para toda la misión.' },
];
