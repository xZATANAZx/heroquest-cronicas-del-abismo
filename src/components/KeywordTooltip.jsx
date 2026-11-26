import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export const KEYWORD_DEFS = {
  PC: {
    title: 'PC — Puntos de Cuerpo (Tu Vida)',
    desc: 'Es tu salud física. Cuando un monstruo te hace daño, pierdes PC. Si llegas a 0 PC caes derrotado (si tienes una Poción de Curación, puedes beberla al instante para salvarte).',
  },
  PM: {
    title: 'PM — Puntos de Mente (Cordura y Magia)',
    desc: 'Es tu fuerza mental y reserva mágica. Los hechizos mentales y los Espíritus atacan PM. Si llegas a 0 PM entras en Estado de Shock.',
  },
  DC: {
    title: 'DC — Dados de Combate (HeroQuest)',
    desc: 'Son los dados especiales de 6 caras con 3 Calaveras (atacar), 2 Escudos Blancos (defender héroes) y 1 Escudo Negro (defender monstruos). Más DC = ataques o defensas más fuertes.',
  },
  CD: {
    title: 'CD — Clase de Dificultad (Dado d20)',
    desc: 'El número que debes igualar o superar al tirar 1d20 + tu bono. Fácil: 10 · Media: 13 · Difícil: 16 · Legendaria: 19.',
  },
  Competencia: {
    title: 'Competencia (+2 al d20)',
    desc: 'Significa que tu héroe está entrenado en esa tarea (como Sigilo, Supervivencia o Desarmar Trampas). Cuando haces una tirada de d20 en algo donde tienes Competencia, sumas +2 extra (sube a +3 en Nivel 5 y +4 en Nivel 9).',
  },
  'Competencia a elección': {
    title: 'Competencia a Elección',
    desc: 'Significa que TÚ puedes elegir 1 habilidad extra cualquiera (ej. Percepción, Sigilo, Medicina o Persuasión) para volver a tu héroe experto en ella y sumar +2 extra en sus tiradas de d20.',
  },
  Supervivencia: {
    title: 'Supervivencia (Habilidad de Sabiduría)',
    desc: 'Sirve para rastrear monstruos, orientarte en los Viajes entre misiones, encontrar refugio ante tormentas, evitar emboscadas en el camino y sobrevivir en terrenos hostiles.',
  },
  Percepción: {
    title: 'Percepción (Habilidad de Sabiduría)',
    desc: 'Es qué tan atento estás a tu entorno. Se usa para detectar trampas ocultas, oír monstruos detrás de una puerta cerrada y evitar ser sorprendido por emboscadas.',
  },
  Investigación: {
    title: 'Investigación (Habilidad de Inteligencia)',
    desc: 'Sirve para revisar muebles a fondo, descubrir puertas secretas, fondos falsos en cofres, acertijos y pistas escondidas en la mazmorra.',
  },
  Arcano: {
    title: 'Arcano y Alquimia (Habilidad de Inteligencia)',
    desc: 'Se usa para identificar artefactos mágicos, desactivar runas oscuras y fabricar pociones o tónicos usando tus Materiales de Crafteo.',
  },
  Medicina: {
    title: 'Medicina (Habilidad de Sabiduría)',
    desc: 'Permite estabilizar aliados heridos, curar venenos, ayudar a un compañero a salir del Estado de Shock y acelerar el movimiento de NPCs heridos (como Sir Ragnar).',
  },
  Salvación: {
    title: 'Tirada de Salvación (d20)',
    desc: 'Es una tirada defensiva de d20 para resistir un peligro: DES para esquivar trampas/fuego, CON para aguantar venenos, SAB para resistir miedo/hechizos mentales y FUE para no caer derribado.',
  },
  'Terreno difícil': {
    title: 'Terreno Difícil',
    desc: 'Zonas con escombros, agua profunda, telarañas o escaleras. Entrar o salir de esas casillas cuesta 1 punto de movimiento adicional (salvo razas/habilidades que lo ignoran).',
  },
  Ventaja: {
    title: 'Ventaja (Tirada Mejorada)',
    desc: 'En pruebas de d20: tiras 2 dados de 20 y te quedas con el MÁS ALTO. En combate con DC: puedes repetir 1 Dado de Combate fallido.',
  },
  Desventaja: {
    title: 'Desventaja (Tirada Penalizada)',
    desc: 'En pruebas de d20: tiras 2 dados de 20 y te quedas con el MÁS BAJO. Ocurre en oscuridad o situaciones difíciles.',
  },
  Shock: {
    title: 'Estado de Shock (0 PM)',
    desc: 'Si tus Puntos de Mente llegan a 0 no mueres, pero entras en pánico: solo mueves 1d6, atacas con 1 DC, defiendes con máximo 2 DC y no puedes buscar hasta recuperar al menos 1 PM.',
  },
  Iniciativa: {
    title: 'Iniciativa (Orden de Turno)',
    desc: 'Al empezar un combate, todos tiran 1d20 + su Modificador de Destreza (DES). Quien saque el número más alto actúa primero.',
  },
  Modificador: {
    title: 'Modificador de Atributo',
    desc: 'Es el bono numérico que sale de cada atributo (ej: 14–15 da +2, 12–13 da +1, 10–11 da 0, 8–9 da -1). Es el número que realmente sumas a tus tiradas de d20.',
  },
  'Reloj del Caos': {
    title: 'Reloj del Caos (0 a 10)',
    desc: 'Medidor de peligro del DM. Sube cuando alguien hace ruido, falla sigilo o saca un 1 natural. Al llegar a 10 se dispara un evento sorpresa en la mazmorra.',
  },
  Etéreos: {
    title: 'Monstruos Etéreos (La Luna del Terror)',
    desc: 'Fantasmas y Espectros que atraviesan paredes. Las armas físicas normales solo los hieren sacando Escudos Negros, pero la magia, la plata y los artefactos los hieren normal.',
  },
  Alquimia: {
    title: 'Alquimia y Crafteo',
    desc: 'Durante las misiones hallarás Materiales de Crafteo (Hierba Lunar, Polvo Rúnico, Glándula de Veneno, etc.) para fabricar pociones, bombas y runas desde tu celular o en la Ciudad.',
  },
  Sigilo: {
    title: 'Sigilo (Destreza)',
    desc: 'Te permite moverte en silencio, preparar emboscadas y abrir puertas sin alertar monstruos ni subir el Reloj del Caos.',
  },
  Flanqueo: {
    title: 'Flanqueo (Ataque por la Espalda)',
    desc: 'Atacar a un enemigo distraído por un aliado o por su espalda te otorga Ventaja en el combate.',
  },
  Motivación: {
    title: 'Motivación del Personaje',
    desc: 'Es la razón por la que tu héroe arriesga la vida. Cumplirla en la partida otorga bonos de rol, Fama o Reputación según decida el DM.',
  },
  Alineamiento: {
    title: 'Alineamiento Moral',
    desc: 'Define la brújula ética de tu personaje (si sigue las reglas o su instinto, y si actúa por el bien común o por interés propio). Sirve para guiar cómo roleas.',
  },
};

const SORTED_KEYS = Object.keys(KEYWORD_DEFS).sort((a, b) => b.length - a.length);
const REGEX = new RegExp(`\\b(${SORTED_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g');

export function KeywordChip({ word, onSelect }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(word);
      }}
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-950/70 border border-sky-500/50 text-sky-300 hover:bg-sky-800 hover:text-white font-bold text-[11px] cursor-pointer transition"
    >
      <HelpCircle className="w-3 h-3 shrink-0" />
      {word}
    </button>
  );
}

// Resalta automáticamente palabras clave dentro de cualquier descripción y permite tocarlas
export function RichRuleText({ text, onSelectKeyword }) {
  if (!text) return null;
  const parts = String(text).split(REGEX);
  return (
    <>
      {parts.map((part, idx) => {
        if (KEYWORD_DEFS[part]) {
          return (
            <span
              key={idx}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onSelectKeyword(part);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onSelectKeyword(part);
                }
              }}
              className="text-sky-300 font-bold underline decoration-dotted decoration-sky-400 hover:text-amber-300 cursor-pointer"
              title={`Toca para ver qué significa "${part}"`}
            >
              {part}
            </span>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
}

// Modal / Tarjeta flotante explicativa para jugadores nuevos
export function KeywordModal({ keyword, onClose }) {
  if (!keyword || !KEYWORD_DEFS[keyword]) return null;
  const info = KEYWORD_DEFS[keyword];
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full grimoire-panel rounded-2xl p-6 border-2 border-sky-400 shadow-2xl space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-sky-300">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <h4 className="font-display font-bold text-lg text-amber-200">{info.title}</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-stone-900 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-stone-200 leading-relaxed">{info.desc}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer"
        >
          Entendido ✓
        </button>
      </div>
    </div>
  );
}
