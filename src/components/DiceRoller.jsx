import React, { useState } from 'react';
import { Dices, RotateCcw, Sparkles, Skull, Shield } from 'lucide-react';

// Dado de Combate Oficial de HeroQuest: 3 Calaveras, 2 Escudos Blancos, 1 Escudo Negro
const HQ_FACES = ['skull', 'skull', 'skull', 'white', 'white', 'black'];

export default function DiceRoller() {
  const [hqCount, setHqCount] = useState(3);
  const [hqResults, setHqResults] = useState([]);
  const [dndMod, setDndMod] = useState(0);
  const [d20Mode, setD20Mode] = useState('normal'); // normal | adv | dis
  const [history, setHistory] = useState([]);

  const rollHQ = (count = hqCount) => {
    const faces = Array.from({ length: count }, () => HQ_FACES[Math.floor(Math.random() * 6)]);
    setHqResults(faces);
    const skulls = faces.filter((f) => f === 'skull').length;
    const whites = faces.filter((f) => f === 'white').length;
    const blacks = faces.filter((f) => f === 'black').length;
    setHistory((prev) => [
      {
        id: Date.now(),
        label: `${count} DC (HeroQuest)`,
        detail: `💀 ${skulls} Calaveras · 🛡️ ${whites} Esc. Blancos · 🖤 ${blacks} Esc. Negros`,
        highlight: skulls >= 3 ? 'crit' : 'normal',
      },
      ...prev.slice(0, 14),
    ]);
  };

  const rollDnd = (sides) => {
    const mod = Number(dndMod) || 0;
    if (sides === 20 && d20Mode !== 'normal') {
      const r1 = Math.floor(Math.random() * 20) + 1;
      const r2 = Math.floor(Math.random() * 20) + 1;
      const chosen = d20Mode === 'adv' ? Math.max(r1, r2) : Math.min(r1, r2);
      const total = chosen + mod;
      const tag = d20Mode === 'adv' ? 'Ventaja' : 'Desventaja';
      setHistory((prev) => [
        {
          id: Date.now(),
          label: `d20 (${tag}) ${mod !== 0 ? (mod > 0 ? `+${mod}` : mod) : ''}`,
          detail: `[${r1}, ${r2}] → ${chosen}${mod !== 0 ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : ''} = ${total}${chosen === 20 ? ' ¡CRÍTICO!' : chosen === 1 ? ' ¡PIFIA!' : ''}`,
          highlight: chosen === 20 ? 'crit' : chosen === 1 ? 'fumble' : 'normal',
        },
        ...prev.slice(0, 14),
      ]);
      return;
    }

    const r = Math.floor(Math.random() * sides) + 1;
    const total = r + mod;
    setHistory((prev) => [
      {
        id: Date.now(),
        label: `1d${sides}${mod !== 0 ? (mod > 0 ? ` +${mod}` : ` ${mod}`) : ''}`,
        detail: `Dado: ${r} → Total: ${total}${sides === 20 && r === 20 ? ' ¡CRÍTICO NATURAL!' : sides === 20 && r === 1 ? ' ¡PIFIA NATURAL!' : ''}`,
        highlight: sides === 20 && r === 20 ? 'crit' : sides === 20 && r === 1 ? 'fumble' : 'normal',
      },
      ...prev.slice(0, 14),
    ]);
  };

  const skulls = hqResults.filter((f) => f === 'skull').length;
  const whites = hqResults.filter((f) => f === 'white').length;
  const blacks = hqResults.filter((f) => f === 'black').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados de Combate de HeroQuest */}
        <div className="grimoire-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <Skull className="w-5 h-5 text-red-400" /> Dados de Combate (HeroQuest)
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-950/60 border border-red-700/40 text-red-200">
              3💀 · 2🛡️ · 1🖤
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setHqCount(n);
                  rollHQ(n);
                }}
                className={`px-3.5 py-2 rounded-lg font-bold text-sm transition cursor-pointer ${
                  hqCount === n
                    ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/40'
                    : 'bg-stone-900/90 text-stone-200 border border-stone-700 hover:border-amber-500/60'
                }`}
              >
                {n} DC
              </button>
            ))}
          </div>

          <button
            onClick={() => rollHQ(hqCount)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-800 via-red-700 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white font-display font-bold tracking-wide shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Dices className="w-5 h-5" /> Lanzar {hqCount} Dados de Combate
          </button>

          {hqResults.length > 0 && (
            <div className="mt-5 p-4 rounded-xl bg-black/40 border border-amber-900/40">
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                {hqResults.map((face, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2 shadow-md ${
                      face === 'skull'
                        ? 'bg-red-950/80 border-red-500/80 text-red-100'
                        : face === 'white'
                        ? 'bg-amber-100 border-amber-500 text-stone-900'
                        : 'bg-stone-900 border-purple-500/80 text-purple-200'
                    }`}
                  >
                    <span className="text-2xl leading-none">
                      {face === 'skull' ? '💀' : face === 'white' ? '🛡️' : '🖤'}
                    </span>
                    <span className="text-[10px] font-bold uppercase mt-0.5">
                      {face === 'skull' ? 'Golpe' : face === 'white' ? 'Héroe' : 'Zargon'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 rounded-lg bg-red-950/40 border border-red-900/50">
                  <div className="text-xl font-bold text-red-300">{skulls}</div>
                  <div className="text-xs text-stone-400">Calaveras</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/50">
                  <div className="text-xl font-bold text-amber-200">{whites}</div>
                  <div className="text-xs text-stone-400">Esc. Blancos</div>
                </div>
                <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-800/50">
                  <div className="text-xl font-bold text-purple-300">{blacks}</div>
                  <div className="text-xs text-stone-400">Esc. Negros</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dados Poliédricos D&D */}
        <div className="grimoire-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Dados D&D (Pruebas, Magia y Destino)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-700 rounded-lg px-3 py-1.5">
              <span className="text-xs text-stone-400 font-semibold">Modificador:</span>
              <input
                type="number"
                value={dndMod}
                onChange={(e) => setDndMod(e.target.value)}
                className="w-14 bg-transparent text-amber-300 font-bold text-center focus:outline-none"
              />
            </div>

            <div className="flex rounded-lg overflow-hidden border border-stone-700 text-xs font-semibold">
              {[
                { id: 'normal', label: 'Normal' },
                { id: 'adv', label: 'Ventaja (2d20↑)' },
                { id: 'dis', label: 'Desventaja (2d20↓)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setD20Mode(m.id)}
                  className={`px-3 py-1.5 cursor-pointer transition ${
                    d20Mode === m.id
                      ? 'bg-amber-600 text-black'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 mb-4">
            {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
              <button
                key={sides}
                onClick={() => rollDnd(sides)}
                className={`py-3 rounded-xl font-display font-bold border transition cursor-pointer ${
                  sides === 20
                    ? 'bg-amber-700/30 border-amber-500 text-amber-200 hover:bg-amber-600 hover:text-black col-span-2 sm:col-span-1'
                    : 'bg-stone-900/80 border-stone-700 text-stone-200 hover:border-amber-500/70'
                }`}
              >
                d{sides}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-stone-300 space-y-1">
            <p><strong className="text-amber-300">CD Rápida HQ-D20:</strong> Fácil <span className="text-emerald-300">10</span> · Medio <span className="text-amber-300">13</span> · Difícil <span className="text-orange-300">16</span> · Legendario <span className="text-red-400">19</span>.</p>
            <p><strong className="text-amber-300">Dado de Destino (d20):</strong> 20 Natural = Calavera Crítica indefendible · 1 Natural = Pifia / +1 Reloj del Caos.</p>
          </div>
        </div>
      </div>

      {/* Historial de Tiradas */}
      <div className="grimoire-panel rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display font-bold text-stone-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" /> Historial de Tiradas en Mesa
          </h4>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-stone-500 italic">Aún no se han lanzado dados en esta sesión.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {history.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border text-sm ${
                  item.highlight === 'crit'
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
                    : item.highlight === 'fumble'
                    ? 'bg-red-950/50 border-red-500/70 text-red-100'
                    : 'bg-stone-900/70 border-stone-800 text-stone-200'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">{item.label}</div>
                <div className="font-semibold mt-0.5">{item.detail}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
