import React, { useState } from 'react';
import {
  BookOpen,
  Swords,
  Armchair,
  FlaskConical,
  Brain,
  TrendingUp,
  Sparkles,
  Search,
  Dices,
  ShieldAlert,
  Bookmark,
  Building2,
  Hammer,
  Compass,
} from 'lucide-react';
import { LEVEL_TABLE, EQUIPMENT_CATALOG, SPELLS_CATALOG } from '../data/characterSystem';
import { MATERIALS_CATALOG, CRAFTING_RECIPES, ARTIFACT_LEVEL_BONUSES } from '../data/craftingSystem';
import { CITY_DISTRICTS, PROFESSIONS } from '../data/citySystem';

const GLOSSARY = [
  { term: 'PC (Puntos de Cuerpo)', cat: 'Estadísticas', def: 'Tu salud física. Si llegas a 0 PC caes derrotado (puedes beber una Poción de Curación instantáneamente si tienes una para evitar morir).' },
  { term: 'PM (Puntos de Mente)', cat: 'Estadísticas', def: 'Tu cordura, voluntad y reserva mágica. Los hechizos mentales y los Espíritus atacan PM. Si llegas a 0 PM entras en Estado de Shock.' },
  { term: 'DC (Dados de Combate)', cat: 'Dados', def: 'Los dados especiales de 6 caras de HeroQuest: tienen 3 Calaveras (impacto), 2 Escudos Blancos (defensa de héroes) y 1 Escudo Negro (defensa de monstruos).' },
  { term: 'CD (Clase de Dificultad)', cat: 'Dados', def: 'El número que debes igualar o superar al lanzar 1d20 + Modificador + Competencia. Fácil: 10 · Media: 13 · Difícil: 16 · Legendaria: 19.' },
  { term: 'Dado de Destino (d20)', cat: 'Dados', def: 'Un d20 opcional que se lanza junto al ataque: 20 Natural = +1 Calavera Crítica indefendible; 1 Natural = Pifia (+1 Reloj del Caos).' },
  { term: 'Reloj del Caos (0–10)', cat: 'Combate', def: 'Medidor de peligro del DM. Sube cuando alguien hace ruido, falla sigilo o saca un 1 Natural. Al llegar a 10 se dispara un evento sorpresa.' },
  { term: 'Modificador de Atributo', cat: 'Estadísticas', def: 'El bono o penalizador de tus 6 atributos (FUE, DES, CON, INT, SAB, CAR). Ej: 10-11 = +0, 12-13 = +1, 14-15 = +2, 16-17 = +3, 18-19 = +4.' },
  { term: 'Bono de Competencia', cat: 'Estadísticas', def: 'Bono que sumas al d20 en habilidades que dominas. Empieza en +2 (Nv.1–4), sube a +3 (Nv.5–8) y llega a +4 (Nv.9–10).' },
  { term: 'Ventaja / Desventaja', cat: 'Combate', def: 'Con Ventaja tiras 2d20 y tomas el mayor (o repites 1 DC fallido). Con Desventaja tomas el menor (o repites tu mejor DC).' },
  { term: 'Iniciativa', cat: 'Combate', def: 'Al iniciar un combate, todos lanzan 1d20 + Mod. DES. Quien saque más alto actúa primero en cada ronda.' },
  { term: 'LdV (Línea de Visión)', cat: 'Combate', def: 'Puedes ver a un objetivo si trazas una línea recta desde tu casilla a la suya sin atravesar muros, puertas cerradas ni miniaturas.' },
  { term: 'Empujar / Romper Filas', cat: 'Combate', def: 'Si infliges ≥1 PC cuerpo a cuerpo puedes empujar al enemigo 1 casilla y avanzar. En puertas, los monstruos Veteranos/Jefes pueden usar Romper Filas para evitar que los héroes bloqueen la puerta eternamente.' },
  { term: 'Zona de Control', cat: 'Movimiento', def: 'Salir de las casillas adyacentes a un enemigo armado cuesta +1 movimiento extra (salvo Pícaro, Monje o Bomba de Humo).' },
  { term: 'Estado de Shock (0 PM)', cat: 'Estados', def: 'Al llegar a 0 PM no mueres, pero solo mueves 1d6, atacas con 1 DC, defiendes con máx. 2 DC y no puedes buscar hasta recuperar ≥1 PM.' },
  { term: 'Etéreo (La Luna del Terror)', cat: 'Monstruos', def: 'Atraviesan muros y puertas. Armas normales SOLO los hieren con Escudos Negros; magia, plata, runas y artefactos Nv.4+ los hieren normal.' },
  { term: 'Modo Espíritu (Reina de los Espíritus)', cat: 'Monstruos', def: 'Atacan directamente tus Puntos de Mente (PM) en lugar de PC.' },
  { term: 'Reloj del Caos (0–10)', cat: 'Sistema DM', def: 'Medidor de tensión de la mazmorra. Sube +1 por ruido, pifias (1 natural) o demoras. Al llegar a 10 dispara un Evento de Mazmorra y vuelve a 0.' },
  { term: 'Contadores Digitales de Zargon', cat: 'Sistema DM', def: 'Reserva digital del DM (Trampa, Emboscada, Patrulla, Destino, Escape) para dar tensión sin usar fichas físicas.' },
  { term: 'Salas de Peligro (Hazard Rooms)', cat: 'Mazmorra', def: 'Salas vivas con efectos ambientales (Gas Tóxico, Inundación, Hongos, Techo Inestable, Runas, Telarañas) que además esconden materiales de crafteo.' },
  { term: 'Mazo de Pistas (Hint Deck)', cat: 'Mazmorra', def: 'Pistas sensoriales en cruces de pasillos que dan decisiones tácticas reales con recompensa (sorpresa/atajo) o riesgo.' },
  { term: 'Estados de Alerta', cat: 'Monstruos', def: 'Cada sala indica si los monstruos están Distraídos (Ventaja al sorprender), Alerta, Patrulla, Guardia (+1 Def quietos), Venganza (+1 Atq/-1 Def) o Miedo (negociables).' },
  { term: 'Plantillas de Monstruos', cat: 'Monstruos', def: 'Modificadores de 1 clic en el Bestiario (Esquelético, Zombificado, Ártico, Piedra, Vampírico, Demoníaco, Gigante) que transforman cualquier miniatura en un enemigo nuevo.' },
  { term: 'Némesis Recurrente', cat: 'Campaña', def: 'Un Jefe que escapó usando un Contador de Escape: reaparece en futuras misiones con mayor Rango y recompensa.' },
  { term: 'Materiales de Crafteo', cat: 'Crafteo', def: '12 ingredientes digitales divididos en Alquimia, Forja y Arcano que recoges de monstruos, muebles y trampas para fabricar sin cartas físicas.' },
  { term: 'Mezcla Experimental', cat: 'Crafteo', def: 'Combina 2–3 materiales cualquiera + una tirada de Arcano (d20) para descubrir pociones raras, bombas o efectos sorpresa.' },
  { term: 'Tónicos (Alto Riesgo)', cat: 'Crafteo', def: 'Brebajes muy poderosos (+2 DC por 2 turnos) que al terminar piden CON CD 13 o tirar 1d6 en la Tabla de Efectos Secundarios.' },
  { term: 'Nivelación de Artefactos (Nv.1–5)', cat: 'Crafteo', def: 'Mejora tus armas/armaduras en la Herrería con Gemas Abismales: Nv.2 repite 1 DC; Nv.3 +1 DC; Nv.4 daña Etéreos; Nv.5 Crítico en 19–20.' },
  { term: 'Fama y Fichas de Reputación', cat: 'Ciudad', def: 'La Fama desbloquea Distritos y Seguidores Únicos. Las Fichas de Reputación (por Objetivos Secundarios) se canjean por Resurrección gratis, Decretos de Oro o Planos Secretos.' },
  { term: 'Profesión del Héroe', cat: 'Ciudad', def: 'Cada héroe elige 1 profesión (Herrero, Alquimista, Sacerdote, Explorador, Minero, Escriba, Mercader, Cazador) que da -20% en su edificio de Ciudad + un poder único dentro de la mazmorra.' },
  { term: 'Rasgo de Personalidad (Quirk)', cat: 'Héroe', def: 'Una peculiaridad equilibrada elegida al crear el personaje: otorga 1 ventaja táctica única y 1 manía divertida de rol.' },
  { term: 'Banquetes de Taberna', cat: 'Ciudad', def: 'Usa Raciones de Mazmorra en la Posada para empezar la siguiente misión con +2 PC temporales, +2 Mov o +1 DC en el primer combate.' },
  { term: 'Modo Relajado vs Supervivencia', cat: 'Ciudad', def: 'Relajado: 10 MO de posada, sin robos, curación barata. Supervivencia: 25 MO, riesgo de robos si no usas el Banco y Resurrección exigente.' },
];

export default function GrimoirePanel() {
  const [subTab, setSubTab] = useState('rules'); // 'rules' | 'new_systems' | 'glossary' | 'tables'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGlossary = GLOSSARY.filter(
    (g) =>
      g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.def.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Encabezado y Navegación del Grimorio */}
      <div className="grimoire-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-amber-300 flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Grimorio Maestro HQ-D20 v2 (Jugadores y DM)
            </h2>
            <p className="text-sm text-stone-400">
              Todas las reglas explicadas desde cero: Combate HQ+D20, Misiones Procedurales, Crafteo Digital, Ciudad Viva y Glosario A–Z.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'rules', label: '📜 Reglas Básicas' },
              { id: 'new_systems', label: '✨ Ciudad, Crafteo y Mazmorra Viva' },
              { id: 'glossary', label: `📖 Glosario A–Z (${GLOSSARY.length})` },
              { id: 'tables', label: '⚔️ Tablas y Recetas' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition ${
                  subTab === t.id
                    ? 'bg-amber-600 text-black border-amber-300'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== 1. REGLAS BÁSICAS ==================== */}
      {subTab === 'rules' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
                <Dices className="w-5 h-5 text-amber-400" /> 1. Dados (HeroQuest + D20)
              </h3>
              <div className="text-xs text-stone-300 space-y-2.5 leading-relaxed">
                <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 space-y-1">
                  <div className="font-bold text-red-300">A) Dados de Combate de HeroQuest (DC):</div>
                  <p>• Al atacar tiras tantos DC como indique tu arma. Cada <strong>💀 Calavera</strong> es 1 impacto.</p>
                  <p>• El defensor tira Defensa: héroes bloquean con <strong>🛡️ Escudos Blancos</strong> y monstruos con <strong>🖤 Escudos Negros</strong>.</p>
                  <p>• Cada Calavera no bloqueada resta <strong>1 Punto de Cuerpo (PC)</strong>.</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 space-y-1">
                  <div className="font-bold text-amber-300">B) Dados D&D (d20) y Dado de Destino:</div>
                  <p>• Para habilidades, trampas, crafteo experimental o negociar: <strong>1d20 + Mod + Comp</strong> vs <strong>CD</strong> (Fácil 10 · Media 13 · Difícil 16 · Legendaria 19).</p>
                  <p>• <strong>Dado de Destino:</strong> 20 Natural = +1 Calavera Crítica indefendible. 1 Natural = Pifia (+1 Reloj del Caos).</p>
                </div>
              </div>
            </div>

            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-400" /> 2. Tu Turno y Combate Táctico
              </h3>
              <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
                <p>En tu turno haces <strong>1 Movimiento</strong> + <strong>1 Acción Principal</strong> (en cualquier orden) + <strong>Acciones Gratuitas</strong>:</p>
                <ul className="list-disc list-inside space-y-1.5">
                  <li><strong>Movimiento sin enemigos:</strong> <strong>8 casillas fijas</strong> (+ bonos) sin tirar dados.</li>
                  <li><strong>Movimiento en combate:</strong> <strong>2d6 + Mod. DES</strong> (mínimo 4 casillas).</li>
                  <li><strong>Acciones Principales (1):</strong> Atacar, Lanzar Hechizo, Buscar Tesoros/Trampas/Secretos, Desarmar Trampa, Examinar Mueble, Usar Banco de Alquimista o Negociar.</li>
                  <li><strong>Acciones Gratuitas:</strong> Beber poción/tónico, abrir puerta normal, volcar mesa (FUE CD 11 → +1 Def cobertura), aplicar veneno a hoja o pasar objeto a un aliado adyacente.</li>
                  <li><strong>Ventaja Táctica:</strong> Flanqueo, altura (sobre mesa) o sorprender enemigos Distraídos permite <strong>repetir 1 DC fallido</strong>.</li>
                  <li><strong>Empujar y Anti-Campeo:</strong> Al herir cuerpo a cuerpo puedes empujar 1 casilla. Los monstruos Veteranos/Jefes pueden usar <em>Romper Filas</em> para impedir que los héroes tapen una puerta eternamente.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="grimoire-panel rounded-2xl p-5 space-y-2">
              <h3 className="font-display font-bold text-amber-300 flex items-center gap-2">
                <Swords className="w-5 h-5 text-rose-400" /> 3. Tipos de Ataque (Mesa Física)
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Cuerpo a Cuerpo (Ortogonal):</strong> Solo en las 4 casillas adyacentes (N, S, E, O). Si hieres, puedes <strong>Empujar</strong> 1 casilla.</li>
                <li><strong>Diagonal / Alcance:</strong> Solo con armas que indiquen <em>Diagonal</em> (Espada Larga, Estoque, Bastón, Lanza).</li>
                <li><strong>A Distancia (Arco/Ballesta/Varita):</strong> Requiere <strong>Línea de Visión</strong> sin muros ni miniaturas tapando, y <strong>ningún enemigo adyacente</strong>.</li>
                <li><strong>Flanqueo y Sinergia:</strong> Atacar a un enemigo que ya combate contra un aliado (o por la espalda) da <strong>Ventaja</strong> (repites 1 DC fallido).</li>
                <li><strong>Mágico / Plata vs Etéreos:</strong> Armas físicas normales solo hieren Espectros sacando <strong>Escudos Negros</strong>; Magia, Plata y Runas hieren normal.</li>
              </ul>
            </div>

            <div className="grimoire-panel rounded-2xl p-5 space-y-2">
              <h3 className="font-display font-bold text-emerald-300 flex items-center gap-2">
                <Armchair className="w-5 h-5 text-amber-400" /> 4. Búsquedas, Movimiento y Puertas
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Movimiento:</strong> <strong>8 casillas fijas</strong> sin enemigos visibles; <strong>2d6 + Mod. DES</strong> en combate (mín. 4). No se mueve en diagonal; sí puedes cruzar casillas de aliados.</li>
                <li><strong>Buscar Tesoros:</strong> 1 vez por sala por héroe (solo sin monstruos visibles).</li>
                <li><strong>Buscar Trampas / Secretos:</strong> Solo sin monstruos visibles. Desarmar pide <strong>DES CD 12–14</strong> (al desarmar trampas mecánicas rescatas Acero o Pólvora).</li>
                <li><strong>Examinar Muebles:</strong> 1 vez por mueble; sueltan <strong>Vendas, Objetos, Oro y Materiales de Crafteo</strong> enviados al celular.</li>
                <li><strong>Puertas Tácticas:</strong> <em>Normal</em> (gratis), <em>Cerrada</em> (DES CD 13 / Llave), <em>Atrancada</em> (FUE CD 15), <em>Entreabierta</em> (espiar gratis), <em>Sello Puzzle</em> (minijuego al celular).</li>
              </ul>
            </div>

            <div className="grimoire-panel rounded-2xl p-5 space-y-2">
              <h3 className="font-display font-bold text-cyan-300 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> 5. Mente, Shock, Moral y Caos
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Estado de Shock (0 PM):</strong> Solo mueves 1d6, atacas con 1 DC, defiendes máx. 2 DC y no puedes buscar hasta curar ≥1 PM.</li>
                <li><strong>Reloj del Caos (0–10):</strong> Sube +1 con pifias (1 natural), forzar puertas o ruido. Al llegar a 10 dispara un <strong>Evento de Mazmorra</strong> y vuelve a 0.</li>
                <li><strong>Moral de Monstruos (AHQ):</strong> Si cae el líder o pierden la mitad de la sala, Goblins y Orcos pueden pasar a <em>Miedo</em> (negocian, se rinden o huyen).</li>
                <li><strong>Forja de Equipo:</strong> Consumibles en campo/ciudad; <strong>Armas y Armaduras por Rareza</strong> solo se forjan en la <strong>Herrería de la Ciudad</strong>.</li>
              </ul>
            </div>
          </div>

          {/* 6. GUÍA DE USOS ATREVIDOS DE HABILIDADES D20 EN MESA */}
          <div className="grimoire-panel rounded-2xl p-5 space-y-3">
            <h3 className="font-display text-base font-bold text-amber-300">
              🎲 6. Usos Atrevidos de las 10 Habilidades D20 (Combate + Exploración)
            </h3>
            <p className="text-xs text-slate-400">
              Todas las tiradas D20 se hacen en físico (<strong>1d20 + Modificador + Competencia</strong> vs CD: Fácil 10 · Media 13 · Difícil 16). ¡Anima a tus jugadores a intentar maniobras creativas!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5 text-[11px]">
              {[
                { name: 'Atletismo (FUE)', use: 'Volcar mesas (+1 Def cobertura, CD 11), saltar fosos, derribar puertas atrancadas o empujar enemigos a trampas/braseros.' },
                { name: 'Sigilo (DES)', use: 'Abrir puertas sin alertar, emboscar enemigos Distraídos (Ventaja en 1ª ronda) o infiltrarse con Disfraz.' },
                { name: 'Trampas (DES)', use: 'Desarmar trampas (rescata Acero/Pólvora), forzar cerraduras y sabotear mecanismos enemigos.' },
                { name: 'Percepción (SAB)', use: 'Escuchar tras puertas entreabiertas, detectar Mímicos antes de abrir cofres y evitar emboscadas.' },
                { name: 'Investigación (INT)', use: 'Hallar puertas secretas, fondos falsos en muebles y descubrir debilidades del Jefe en bibliotecas.' },
                { name: 'Arcano (INT)', use: 'Mezclas Experimentales de Crafteo, desactivar runas/altares, recargar magia y reconocer hechizos.' },
                { name: 'Medicina (SAB)', use: 'Estabilizar a un aliado a 0 PC sin pociones (CD 12), curar venenos/Shock y acelerar a NPCs heridos.' },
                { name: 'Supervivencia (SAB)', use: 'Seguir huellas (Pistas), evitar emboscadas en Viajes y recolectar Hierbas Lunares en salas de hongos.' },
                { name: 'Persuasión (CAR)', use: 'Sobornar o negociar paso libre con Goblins/Orcos inteligentes, y conseguir descuentos en Ciudad.' },
                { name: 'Intimidación (CAR)', use: 'Romper la moral de esbirros (CD 12–14) para que suelten información, llaves o huyan del combate.' },
              ].map((sk) => (
                <div key={sk.name} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-200">{sk.name}</div>
                  <p className="text-slate-300 leading-snug">{sk.use}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. SINERGIA DE ROLES DE EQUIPO (BALANCEO COOPERATIVO) */}
          <div className="grimoire-panel rounded-2xl p-5 space-y-2.5">
            <h3 className="font-display text-base font-bold text-emerald-300">
              🤝 7. Sinergia de Roles (Nadie gana solo: todos se apoyan)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-700/40">
                <div className="font-bold text-sky-300">🛡️ Tanques (Caballero, Paladín, Maestro de Armas)</div>
                <p className="text-[11px] text-slate-300 mt-1">Bloquean accesos, interceptan golpes, derriban jefes y protegen al grupo frágil.</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/40">
                <div className="font-bold text-emerald-300">💚 Soportes (Clérigo, Bardo, Exorcista, Artificiero)</div>
                <p className="text-[11px] text-slate-300 mt-1">Curan PC y PM, eliminan Shock, mejoran armas/escudos aliados y salvan el combate.</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-700/40">
                <div className="font-bold text-rose-300">⚔️ DPS (Bárbaro, Pícaro, Explorador, Monje, Cazador)</div>
                <p className="text-[11px] text-slate-300 mt-1">Aprovechan el flanqueo que abre el Tanque para rematar enemigos clave rápidamente.</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-700/40">
                <div className="font-bold text-purple-300">🔮 Magia / Híbridos (Mago, Brujo, Druida, Hechicero Batalla, Alquimista)</div>
                <p className="text-[11px] text-slate-300 mt-1">Controlan masas, destruyen Etéreos, queman regeneración y cubren cualquier brecha táctica.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. SISTEMAS NUEVOS (CIUDAD, CRAFTEO, PROCEDURAL) ==================== */}
      {subTab === 'new_systems' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="grimoire-panel rounded-2xl p-5 space-y-3">
            <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
              <Compass className="w-5 h-5" /> Mazmorra Viva y Procedural
            </h3>
            <ul className="text-xs text-stone-300 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>One-Shot o Arcos de 3 Partes:</strong> En <em>Misiones y Arcos</em> el DM genera aventuras independientes o arcos conectados donde las decisiones y los <strong>Némesis escapados</strong> regresan más fuertes.</li>
              <li><strong>6 Biomas con Reglas Reales:</strong> Catacumbas, Fortaleza Orca, Abismo de Lava, Cripta Espectral, Cavernas de Hielo y Laboratorio Alquímico.</li>
              <li><strong>Salas de Peligro (Hazard Rooms):</strong> Gas Tóxico, Inundación, Hongos, Techo Inestable, Runas Arcanas, Telarañas y Braseros.</li>
              <li><strong>Mazo de Pistas:</strong> En bifurcaciones, el DM roba una Pista Sensorial que premia la exploración inteligente.</li>
              <li><strong>Puertas Tácticas y Alerta:</strong> Puertas Cerradas, Atrancadas, Entreabiertas (espiar), con Trampa o Sello de Puzzle; enemigos Distraídos, Alerta, Patrulla, Guardia, Venganza o Miedo (¡puedes negociar!).</li>
              <li><strong>Fase 2 de Jefes y Horda Post-Objetivo:</strong> Los jefes se enfurecen al 50% de PC y escapar con el tesoro puede activar patrullas de retirada.</li>
            </ul>
          </div>

          <div className="grimoire-panel rounded-2xl p-5 space-y-3">
            <h3 className="font-display text-lg font-bold text-emerald-300 flex items-center gap-2">
              <Hammer className="w-5 h-5" /> Crafteo Digital ("La Forja y el Alambique")
            </h3>
            <ul className="text-xs text-stone-300 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>3 Ramas de Materiales (12 tipos):</strong> Alquimia (Hierba Lunar, Veneno, Ícor, Raciones), Forja (Acero, Pólvora, Huesos, Aceite) y Arcano (Polvo Rúnico, Esencia Espectral, Gema Abismal, Pergamino).</li>
              <li><strong>Recetas Conocidas:</strong> Fabrica pociones, <strong>Tónicos arriesgados</strong> (+2 DC con riesgo de efecto secundario 1d6), <strong>Venenos de Hoja</strong>, <strong>Fuego Griego</strong>, Bombas, Cepos, Pergaminos y <strong>Runas Grabables</strong>.</li>
              <li><strong>Mezcla Experimental:</strong> Combina 2 o 3 materiales cualquiera + una tirada de <em>Arcano (d20)</em> para descubrir pociones misteriosas o elixires legendarios (o explotar en humo con hollín).</li>
              <li><strong>Nivelación de Artefactos (Nv.1 → Nv.5):</strong> Invierte Gemas Abismales + Acero + Polvo Rúnico en la Herrería para evolucionar tus armas/armaduras favoritas hasta nivel Legendario.</li>
              <li><strong>Desde tu Celular:</strong> Los jugadores ven su Bolsa de Materiales y pueden craftear directo en la pestaña <em>Equipo → Crafteo</em>.</li>
            </ul>
          </div>

          <div className="grimoire-panel rounded-2xl p-5 space-y-3">
            <h3 className="font-display text-lg font-bold text-sky-300 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Ciudad Viva ("El Bastión de los Héroes")
            </h3>
            <ul className="text-xs text-stone-300 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>6 Distritos:</strong> Taberna/Posada (descanso, Banquetes con Raciones, Tablón de 3 Contratos), Herrería, Alquimista/Escriba, Templo, Gremio y Banco.</li>
              <li><strong>Fama y Reputación:</strong> La Fama desbloquea distritos y <strong>Seguidores Únicos</strong> (Capitán, Matatrolls, Bailarina, Aprendiz). Las <strong>Fichas de Reputación</strong> se canjean por Resurrección gratis, Decretos de Oro o Planos Secretos.</li>
              <li><strong>Profesión (1 por Héroe):</strong> Da <strong>-20% de descuento</strong> en su distrito de Ciudad + un <strong>bono único en la mazmorra</strong>.</li>
              <li><strong>Familiares de Utilidad:</strong> Cuervo Vigía, Sabueso de Caza, Hurón Ladronzuelo y Búho Rúnico.</li>
              <li><strong>Relajado vs Supervivencia:</strong> Cambia con 1 clic entre posada barata sin robos (10 MO) o realismo táctico con Banco obligatorio y Resurrección exigente (25 MO).</li>
            </ul>
          </div>
        </div>
      )}

      {/* ==================== 3. GLOSARIO BUSCABLE A–Z ==================== */}
      {subTab === 'glossary' && (
        <div className="space-y-4">
          <div className="grimoire-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Busca cualquier palabra clave (ej. Focus, Tónico, Némesis, Hazard, Profesión, Shock)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-sm text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-stone-400 font-semibold">
              Mostrando <strong className="text-amber-300">{filteredGlossary.length}</strong> de {GLOSSARY.length} términos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGlossary.map((g) => (
              <div key={g.term} className="grimoire-panel rounded-xl p-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-sm text-amber-300 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {g.term}
                  </h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-300 shrink-0">
                    {g.cat}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{g.def}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 4. TABLAS: NIVELES, RECETAS, PROFESIONES, ARMERÍA ==================== */}
      {subTab === 'tables' && (
        <div className="space-y-6">
          <div className="grimoire-panel rounded-2xl p-6 space-y-3">
            <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Progresión de Niveles (1 al 10)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-amber-400 uppercase">
                    <th className="py-2 px-3">Nivel</th>
                    <th className="py-2 px-3">XP Total</th>
                    <th className="py-2 px-3">Bono Comp.</th>
                    <th className="py-2 px-3">Tier</th>
                    <th className="py-2 px-3">Recompensa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70 text-stone-300">
                  {LEVEL_TABLE.map((l) => (
                    <tr key={l.level} className="hover:bg-stone-900/50">
                      <td className="py-2 px-3 font-bold text-amber-200">Nivel {l.level}</td>
                      <td className="py-2 px-3">{l.xp} XP</td>
                      <td className="py-2 px-3 text-emerald-300 font-bold">+{l.prof}</td>
                      <td className="py-2 px-3">{l.tier}</td>
                      <td className="py-2 px-3">{l.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recetas de Crafteo + Nivelación de Artefactos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-emerald-300 flex items-center gap-2">
                <FlaskConical className="w-5 h-5" /> Catálogo Completo de Recetas ({CRAFTING_RECIPES.length})
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                {CRAFTING_RECIPES.map((r) => (
                  <div key={r.id} className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800">
                    <div className="flex justify-between">
                      <strong className="text-amber-200">{r.name}</strong>
                      <span className="text-emerald-300 font-bold">{r.dice} · {r.costGold} MO</span>
                    </div>
                    <div className="text-stone-400 mt-0.5">{r.effect}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-amber-300">
                🛠️ Profesiones ({PROFESSIONS.length}) y Distritos ({CITY_DISTRICTS.length})
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                {PROFESSIONS.map((p) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800">
                    <div className="font-bold text-amber-200">{p.icon} {p.name}</div>
                    <div className="text-emerald-300">{p.cityBonus}</div>
                    <div className="text-stone-400">{p.dungeonBonus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-amber-300">
                ⚔️ Armería y Mejora de Artefactos (Nv.1–5)
              </h3>
              <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-800/40 text-xs space-y-1 text-stone-200">
                {Object.values(ARTIFACT_LEVEL_BONUSES).map((b, i) => (
                  <div key={i}>• {b}</div>
                ))}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {EQUIPMENT_CATALOG.map((e) => (
                  <div key={e.id} className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 flex justify-between gap-2 text-xs">
                    <div>
                      <strong className="text-stone-100">{e.name}</strong>{' '}
                      <span className="text-emerald-300 font-bold">({e.dice})</span>
                      <div className="text-stone-400">{e.traits}</div>
                    </div>
                    <div className="text-amber-400 font-bold whitespace-nowrap">
                      {e.price > 0 ? `${e.price} MO` : 'Reliquia'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-purple-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Catálogo de Hechizos (6 Escuelas)
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {SPELLS_CATALOG.map((s) => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs">
                    <div className="flex justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 mr-1.5">
                          {s.school}
                        </span>
                        <strong className="text-stone-100">{s.name}</strong>
                      </div>
                      <span className="text-cyan-300 font-semibold">
                        Nv.{s.level} {s.costPM > 0 ? `· ${s.costPM} PM` : '· 1 uso'}
                      </span>
                    </div>
                    <p className="text-stone-400 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
