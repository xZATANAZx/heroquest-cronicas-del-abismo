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
  { term: '4 Pilares del Héroe (FUE, AGI, MEN, SUE)', cat: 'Estadísticas', def: 'Sistema ágil sin tablas de D&D: cada héroe tiene bonos directos (+0 a +4) en Fuerza, Agilidad, Mente y Suerte que se suman directo a 1d20.' },
  { term: 'Resistencias de Monstruos (HQ Nativo)', cat: 'Monstruos', def: 'Los monstruos ya no usan CD confusa: resisten magia mental tirando 1 dado rojo por PM (6 resiste; 0 PM = Inmune) y efectos físicos según sus PC (5–6 o 6 en 1d6).' },
  { term: 'Crisis del Caos (5/10 y 10/10)', cat: 'Sistema DM', def: 'Al llegar el Reloj del Caos a 5 o 10 se dispara 1 de 10 Crisis reales (Patrulla por la espalda, Puertas atrancadas, Apagón, Lugarteniente Élite, Segunda Forma del Jefe, etc.).' },
  { term: 'Alquimia por Suerte (Sin Mesa)', cat: 'Crafteo', def: 'Ya no se requiere Mesa de Alquimia: cualquiera puede intentar destilar pociones por Suerte (SUE), mientras los Calificados (Alquimista, Mago, Druida, Clérigo, Gnomo) tiran con Ventaja.' },
  { term: 'Vientos de la Magia (Repetir Hechizos)', cat: 'Magia', def: 'Puedes repetir un hechizo ya usado gastando 1 PM (Nivel 1 hasta 2 veces; Nivel 2 una vez) tirando 2d6: 2 = Pifia + Viento del Caos; 3–4 = Inestable + Viento del Caos; 5–9 = Normal; 10–11 = Recuperas 1 PM; 12 = Crítico sin gastar PM ni uso.' },
  { term: '20 Pergaminos de Hechizo', cat: 'Magia', def: 'Incluye 10 hechizos exclusivos de pergamino (Puente de Hielo, Calidez, Recuperación Psíquica, Patinar, Escalofrío, Tormenta de Hielo, Tesoro sin Maldición, Rayo Mortífero, Alzar No Muerto y Tormenta de Fuego).' },
  { term: 'Domador de Bestias', cat: 'Ciudad', def: 'En el Gremio puedes adoptar desde exploradores (Cuervo, Hurón, Búho) hasta bestias de combate (Ave Rapaz, Murciélago Vampiro, Lobo, Raptor, Dientes de Sable, Oso de Combate).' },
  { term: 'Armas Contundentes', cat: 'Combate', def: 'Maza, Martillo de Guerra, Mangual, Bastón y Gran Martillo: los Escudos Negros no bloqueados aturden al enemigo 1 turno (Jefes y miniaturas grandes son inmunes).' },
  { term: 'Roca Rodante y Hacha Pendular', cat: 'Trampas', def: 'Roca Rodante inflige 3 DC y avanza 1d6 casillas por turno arrollando con 5 DC. Hacha Pendular barre 2 casillas en línea con 2 DC defendibles.' },
  { term: 'Ventaja / Desventaja', cat: 'Combate', def: 'Con Ventaja tiras 2d20 y tomas el mayor (o repites 1 DC fallido). Con Desventaja tomas el menor (o repites tu mejor DC).' },
  { term: 'Orden de Turno (Clásico)', cat: 'Combate', def: 'Sin listas de iniciativa: primero actúan todos los Héroes en el orden que el grupo prefiera en mesa, y después actúa Zargon con todos los monstruos visibles.' },
  { term: 'LdV (Línea de Visión)', cat: 'Combate', def: 'Puedes ver a un objetivo si trazas una línea recta desde tu casilla a la suya sin atravesar muros, puertas cerradas ni miniaturas.' },
  { term: 'Empujar / Romper Filas', cat: 'Combate', def: 'Si infliges ≥1 PC cuerpo a cuerpo puedes empujar al enemigo 1 casilla y avanzar. En puertas, los monstruos Veteranos/Jefes pueden usar Romper Filas para evitar que los héroes bloqueen la puerta eternamente.' },
  { term: 'Zona de Control', cat: 'Movimiento', def: 'Salir de las casillas adyacentes a un enemigo armado cuesta +1 movimiento extra (salvo Pícaro, Monje o Bomba de Humo).' },
  { term: 'Estado de Shock (0 PM)', cat: 'Estados', def: 'Al llegar a 0 PM no mueres, pero solo mueves 1d6, atacas con 1 DC, defiendes con máx. 2 DC y no puedes buscar hasta recuperar ≥1 PM.' },
  { term: 'Etéreo (La Luna del Terror)', cat: 'Monstruos', def: 'Atraviesan muros y puertas. Armas normales SOLO los hieren con Escudos Negros; magia, plata, runas y artefactos Nv.4+ los hieren normal.' },
  { term: 'Modo Espíritu (Reina de los Espíritus)', cat: 'Monstruos', def: 'Atacan directamente tus Puntos de Mente (PM) en lugar de PC.' },
  { term: 'Reloj del Caos (0–10)', cat: 'Sistema DM', def: 'Medidor de tensión de la mazmorra. Sube +1 por ruido, pifias (1 natural) o demoras. Al llegar a 10 dispara un Evento de Mazmorra y vuelve a 0.' },
  { term: 'Giro Épico (Misiones Oficiales)', cat: 'Sistema DM', def: 'Botón opcional del DM en el Tablero que añade puzzles en puertas, cofres mímicos, trampas de bioma o NPCs con mini-misión SIN alterar las posiciones oficiales del libro.' },
  { term: 'Salas de Peligro (Hazard Rooms)', cat: 'Mazmorra', def: 'Salas vivas con efectos ambientales (Gas Tóxico, Inundación, Hongos, Techo Inestable, Runas, Telarañas) que además esconden materiales de crafteo.' },
  { term: 'Mazo de Pistas (Hint Deck)', cat: 'Mazmorra', def: 'Pistas sensoriales adaptadas al bioma real y diferenciadas entre Salas y Pasillos, con decisiones tácticas de riesgo/recompensa.' },
  { term: 'Cartas Oficiales Adaptadas', cat: 'Mazos', def: 'Tesoros, Trampas, 20 Pociones de Alquimia, 21 Artefactos, 15 Hechizos del Terror (en el mazo del Malvado Brujo) y 12 Hechizos Elementales integrados al balance HQ-D20 v2.' },
  { term: 'Desarmar Trampas y Materiales', cat: 'Crafteo', def: 'Al desarmar una trampa mecánica (Lanza o Roca), el DM puede enviar directamente el Material de Crafteo obtenido (Veneno o Acero) al héroe que la desarmó.' },
  { term: 'Revisar Cuerpos y Probabilidades', cat: 'Mazmorra', def: 'Al abatir un monstruo puedes revisar su cuerpo: tira por porcentaje de rareza (puede salir vacío, oro, materiales o botín). Los Jefes/Élites nunca salen vacíos y los bonos de Profesión/Quirk del héroe que revisa se aplican automáticamente.' },
  { term: 'Artefactos Oficiales (Exclusivos)', cat: 'Reliquias', def: 'Los 21 Artefactos Oficiales son objetos mágicos únicos que NO se compran en la Ciudad ni se roban del mazo normal de tesoros: solo se obtienen cumpliendo objetivos específicos en el Libro de Misiones.' },
  { term: 'Modo Relajado vs Supervivencia', cat: 'Campaña', def: 'Relajado: balance estándar y posada 10 MO. Supervivencia: posada 25 MO, riesgo de robos sin Banco, y EN MISIONES monstruos con +1 PC, Jefes Élite y Trampas +2 CD a cambio de +25% XP y +20% Oro.' },
  { term: 'Estados de Alerta', cat: 'Monstruos', def: 'Cada sala indica si los monstruos están Distraídos (Ventaja al sorprender), Alerta, Patrulla, Guardia (+1 Def quietos), Venganza (+1 Atq/-1 Def) o Miedo (negociables).' },
  { term: 'Plantillas de Monstruos', cat: 'Monstruos', def: 'Modificadores de 1 clic en el Bestiario (Esquelético, Zombificado, Ártico, Piedra, Vampírico, Demoníaco, Gigante) que transforman cualquier miniatura en un enemigo nuevo.' },
  { term: 'Némesis Recurrente', cat: 'Campaña', def: 'Un Jefe que escapó usando un Contador de Escape: reaparece en futuras misiones con mayor Rango y recompensa.' },
  { term: 'Materiales de Crafteo', cat: 'Crafteo', def: '12 ingredientes digitales divididos en Alquimia, Forja y Arcano que recoges de monstruos, muebles y trampas para fabricar sin cartas físicas.' },
  { term: 'Mezcla Experimental', cat: 'Crafteo', def: 'Combina 2–3 materiales cualquiera + una tirada de Arcano (d20) para descubrir pociones raras, bombas o efectos sorpresa.' },
  { term: 'Tónicos (Alto Riesgo)', cat: 'Crafteo', def: 'Brebajes muy poderosos (+2 DC por 2 turnos) que al terminar piden Fuerza (FUE CD 13) o tirar 1d6 en la Tabla de Efectos Secundarios.' },
  { term: 'Nivelación de Artefactos (Nv.1–5)', cat: 'Crafteo', def: 'Mejora tus armas/armaduras en la Herrería con Gemas Abismales: Nv.2 repite 1 DC; Nv.3 +1 DC; Nv.4 daña Etéreos; Nv.5 Crítico en 19–20.' },
  { term: 'Fama y Fichas de Reputación', cat: 'Ciudad', def: 'La Fama desbloquea Distritos y Seguidores Únicos. Las Fichas de Reputación (por Objetivos Secundarios) se canjean por Resurrección gratis, Decretos de Oro o Planos Secretos.' },
  { term: 'Profesión del Héroe', cat: 'Ciudad', def: 'Cada héroe elige 1 profesión (Herrero, Alquimista, Sacerdote, Explorador, Minero, Escriba, Mercader, Cazador) que da -20% en su edificio de Ciudad + un poder único dentro de la mazmorra.' },
  { term: 'Rasgo de Personalidad (Quirk)', cat: 'Héroe', def: 'Una peculiaridad equilibrada elegida al crear el personaje: otorga 1 ventaja táctica única y 1 manía divertida de rol.' },
  { term: 'Banquetes de Taberna', cat: 'Ciudad', def: 'Usa Raciones de Mazmorra en la Posada para empezar la siguiente misión con +2 PC temporales, +2 Mov o +1 DC en el primer combate.' },
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

      {/* ==================== 1. REGLAS BÁSICAS (GUÍA RÁPIDA CLARA) ==================== */}
      {subTab === 'rules' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
                <Dices className="w-5 h-5 text-amber-400" /> 1. Turno, Movimiento y Área de Influencia
              </h3>
              <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
                <p><strong>Orden de turno:</strong> Primero actúan todos los Héroes en el orden que el grupo decida; después actúa Zargon con los monstruos visibles.</p>
                <ul className="list-disc list-inside space-y-1.5">
                  <li><strong>En tu turno:</strong> 1 Movimiento + 1 Acción Principal (en cualquier orden) + Acciones Gratuitas.</li>
                  <li><strong>Movimiento:</strong> <strong>8 casillas fijas</strong> sin enemigos visibles; <strong>2d6</strong> en combate (no se mueve en diagonal, sí puedes cruzar casillas de aliados).</li>
                  <li><strong>Área de Influencia:</strong> Abandonar una casilla adyacente a un enemigo cuesta +1 movimiento extra (salvo Pícaro, Monje, Paso Fantasma o Bomba de Humo).</li>
                  <li><strong>Subir a un mueble / Terreno difícil:</strong> Cuesta +1 punto de movimiento adicional.</li>
                  <li><strong>Acciones Gratuitas:</strong> Beber poción, abrir puerta normal, revisar un mueble adyacente, pasar un objeto guardado a un aliado adyacente o saltar una trampa detectada (1 DC: sin Calavera saltas).</li>
                </ul>
              </div>
            </div>

            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-400" /> 2. Combate, Empujar y Ventaja
              </h3>
              <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
                <ul className="list-disc list-inside space-y-1.5">
                  <li><strong>Dados de Combate (DC):</strong> Cada <strong>💀 Calavera</strong> es 1 impacto. Héroes bloquean con <strong>🛡️ Escudos Blancos</strong> y monstruos con <strong>🖤 Escudos Negros</strong>.</li>
                  <li><strong>Empujar:</strong> Si infliges ≥1 PC cuerpo a cuerpo (ortogonal) puedes empujar al enemigo 1 casilla y ocupar su lugar. Si cae desde un mueble sufre 1 DC indefendible. Miniaturas grandes no pueden ser empujadas.</li>
                  <li><strong>Ventaja en Combate:</strong> Atacar por la espalda, desde altura (sobre un mueble), flanqueando o con cobertura permite <strong>repetir tu tirada de ataque o defensa</strong> (te quedas con el 2º resultado).</li>
                  <li><strong>Armas Contundentes (Maza/Martillo/Bastón):</strong> Los Escudos Negros no bloqueados aturden al enemigo 1 turno (Jefes y miniaturas grandes son inmunes).</li>
                  <li><strong>A Distancia:</strong> Requiere Línea de Visión libre y ningún enemigo adyacente.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="grimoire-panel rounded-2xl p-5 space-y-2">
              <h3 className="font-display font-bold text-purple-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> 3. Magia, Resistencia y Preparación
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Preparación entre Misiones:</strong> Antes de cada misión, cada lanzador elige sus <strong>Escuelas de Hechizos activas</strong> y cada clase marcial elige sus <strong>2 Técnicas de Combate</strong> desde su celular.</li>
                <li><strong>Resistencia a Hechizos:</strong> Cuando un hechizo afecta a un monstruo, este tira <strong>1 dado rojo (d6) por cada PM</strong>; si saca al menos un <strong>6</strong>, resiste el efecto. Los No Muertos (`0 PM`) son inmunes a magia mental.</li>
                <li><strong>Etéreos (Espectros):</strong> Atraviesan muros y muebles. Armas físicas normales solo los hieren con <strong>Escudos Negros</strong>; magia, plata y artefactos los hieren normal.</li>
              </ul>
            </div>

            <div className="grimoire-panel rounded-2xl p-5 space-y-2">
              <h3 className="font-display font-bold text-emerald-300 flex items-center gap-2">
                <Armchair className="w-5 h-5 text-amber-400" /> 4. Búsquedas, Trampas y 4 Pilares
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Los 4 Pilares (`FUE`, `AGI`, `MEN`, `SUE`):</strong> En pruebas fuera del combate tiras <strong>1d20 + tu Pilar</strong> contra la dificultad (Fácil 10 · Media 12 · Difícil 15).</li>
                <li><strong>Buscar Tesoros / Trampas / Secretos:</strong> Solo sin monstruos visibles. 1 búsqueda de tesoro por sala por héroe.</li>
                <li><strong>Desactivar Trampas:</strong> Con <strong>AGI CD 12–14</strong> (Enano, Pícaro o Herramientas tienen Ventaja). Desarmar trampas mecánicas otorga materiales de crafteo.</li>
                <li><strong>Alquimia en Campo:</strong> Cualquier héroe puede destilar pociones desde su celular: Calificados tiran con Ventaja y los demás por Suerte (`SUE`).</li>
              </ul>
            </div>

            <div className="grimoire-panel rounded-2xl p-5 space-y-2">
              <h3 className="font-display font-bold text-cyan-300 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> 5. Muerte, Shock y Reloj del Caos
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Muerte (0 PC):</strong> Si tienes una Poción de Curación puedes beberla al instante para salvarte.</li>
                <li><strong>Estado de Shock (0 PM):</strong> Solo mueves 1d6, atacas con 1 DC, defiendes con 2 DC y no puedes buscar hasta recuperar al menos 1 PM.</li>
                <li><strong>Reloj del Caos (0–10):</strong> Sube +1 por ruido, pifias (1 natural) o demoras. Al llegar a <strong>5</strong> y a <strong>10</strong> se dispara una <strong>Crisis del Caos</strong>.</li>
                <li><strong>Dado de Destino (d20 opcional):</strong> 20 Natural = +1 Calavera Crítica indefendible; 1 Natural = +1 Reloj del Caos.</li>
              </ul>
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
              <li><strong>Relajado vs Supervivencia (Ciudad + Misiones):</strong> En <strong>Relajado</strong> tienes posada 10 MO y balance estándar; en <strong>Supervivencia</strong> la ciudad exige Banco (25 MO posada) y en las <strong>Misiones Oficiales y Procedurales</strong> los monstruos ganan +1 PC, los Jefes suben a Élite y las trampas +2 CD, pero ganas <strong>+25% XP y +20% Oro</strong>.</li>
              <li><strong>Botica Oficial y Herrería Separadas:</strong> La Herrería maneja Forja, Armería, Nivelación de Artefactos y Reciclaje; la Torre del Alquimista maneja Pociones, Venenos, Runas, Mezclas Experimentales y las <strong>20 Pociones Oficiales de Alquimia</strong>.</li>
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
