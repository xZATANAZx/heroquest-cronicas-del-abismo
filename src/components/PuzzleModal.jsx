import React, { useState, useEffect, useRef } from 'react';

export default function PuzzleModal({ heroName, activePuzzle, onResolve, onClose }) {
  const puz = activePuzzle?.puzzle;
  const [result, setResult] = useState(null); // null | 'success' | 'fail'
  const [attemptsLeft, setAttemptsLeft] = useState(puz?.maxAttempts || 1);
  const [attemptMsg, setAttemptMsg] = useState('');

  // Estados específicos por mecánica
  const [seqInput, setSeqInput] = useState([]);
  const [dials, setDials] = useState([0, 0, 0]);
  const [selectedWeights, setSelectedWeights] = useState([]);

  // Mecánica timing_bar (barra de precisión en movimiento)
  const [cursorPos, setCursorPos] = useState(10);
  const dirRef = useRef(1);

  // Mecánica memory_runes (secuencia de destellos)
  const [memPhase, setMemPhase] = useState('watching'); // 'watching' | 'playing'
  const [litRuneId, setLitRuneId] = useState(null);

  useEffect(() => {
    setResult(null);
    setAttemptsLeft(puz?.maxAttempts || 1);
    setAttemptMsg('');
    setSeqInput([]);
    setDials([1, 1, 1]);
    setSelectedWeights([]);
    setCursorPos(10);
    setMemPhase('watching');
    setLitRuneId(null);
  }, [activePuzzle?.instanceId]);

  // Animación de la barra de precisión (timing_bar)
  useEffect(() => {
    if (!puz || puz.type !== 'timing_bar' || result) return;
    const step = puz.stepSize || 2.8;
    const timer = setInterval(() => {
      setCursorPos((prev) => {
        let next = prev + dirRef.current * step;
        if (next >= 96) {
          next = 96;
          dirRef.current = -1;
        } else if (next <= 4) {
          next = 4;
          dirRef.current = 1;
        }
        return next;
      });
    }, puz.speedMs || 18);
    return () => clearInterval(timer);
  }, [puz, result]);

  // Animación de memoria de runas (memory_runes)
  useEffect(() => {
    if (!puz || puz.type !== 'memory_runes' || result || memPhase !== 'watching') return;
    let cancelled = false;
    const flash = puz.flashMs || 520;
    const playSequence = async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      await wait(450);
      for (const id of puz.solution) {
        if (cancelled) return;
        setLitRuneId(id);
        await wait(flash);
        if (cancelled) return;
        setLitRuneId(null);
        await wait(220);
      }
      if (!cancelled) setMemPhase('playing');
    };
    playSequence();
    return () => {
      cancelled = true;
    };
  }, [puz, result, memPhase]);

  if (!puz) return null;

  const finish = (isSuccess) => {
    if (result) return;
    setResult(isSuccess ? 'success' : 'fail');
    onResolve(isSuccess);
  };

  const handleWrongAttempt = (hint) => {
    if (attemptsLeft > 1) {
      setAttemptsLeft((a) => a - 1);
      setAttemptMsg(hint || '¡Casi! Te queda 1 intento más.');
    } else {
      finish(false);
    }
  };

  const currentWeight = (puz.weights || [])
    .filter((w) => selectedWeights.includes(w.id))
    .reduce((acc, w) => acc + w.kg, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#23102b] via-[#170f1a] to-[#0f0a12] border-2 border-fuchsia-400 shadow-2xl p-5 space-y-4">
        <div className="text-center space-y-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-fuchsia-300">
            🧩 DESAFÍO DEL DM PARA {heroName?.toUpperCase()}
          </div>
          <h2 className="font-display text-xl font-black text-amber-200">{puz.title}</h2>
          <p className="text-xs text-stone-300">{puz.subtitle}</p>
          {!result && (puz.maxAttempts || 1) > 1 && (
            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300">
              Intentos restantes: {attemptsLeft}
            </span>
          )}
        </div>

        <div className="p-3 rounded-2xl bg-black/50 border border-fuchsia-700/60 font-lore italic text-sm text-amber-100 leading-relaxed text-center">
          {puz.clue}
        </div>

        {attemptMsg && !result && (
          <div className="p-2 rounded-xl bg-amber-900/50 border border-amber-500/70 text-amber-200 text-xs font-bold text-center">
            ⚠️ {attemptMsg}
          </div>
        )}

        {/* 1) BARRA DE PRECISIÓN EN MOVIMIENTO (timing_bar) */}
        {puz.type === 'timing_bar' && !result && (
          <div className="space-y-4">
            <div className="relative h-10 rounded-xl bg-stone-950 border-2 border-stone-700 overflow-hidden">
              {/* Zona verde objetivo */}
              <div
                className="absolute top-0 bottom-0 bg-emerald-500/40 border-x-2 border-emerald-400"
                style={{
                  left: `${puz.zoneStart}%`,
                  width: `${puz.zoneEnd - puz.zoneStart}%`,
                }}
              />
              {/* Cursor brillante */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-amber-300 shadow-[0_0_12px_#fde047] rounded"
                style={{ left: `calc(${cursorPos}% - 5px)` }}
              />
            </div>
            <button
              onClick={() => {
                if (cursorPos >= puz.zoneStart && cursorPos <= puz.zoneEnd) {
                  finish(true);
                } else {
                  handleWrongAttempt('¡Fallaste el momento! Intenta detenerlo justo en el verde.');
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-black font-display font-black text-base cursor-pointer shadow-lg"
            >
              ✂️ ¡DETENER AHORA!
            </button>
          </div>
        )}

        {/* 2) CERRADURA DE 3 RUEDAS GIRATORIAS (dial_lock) */}
        {puz.type === 'dial_lock' && !result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {dials.map((val, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-stone-950 border-2 border-amber-700/60 flex flex-col items-center gap-1.5"
                >
                  <button
                    onClick={() =>
                      setDials((prev) => prev.map((v, i) => (i === idx ? (v + 1) % 10 : v)))
                    }
                    className="w-full py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-black cursor-pointer"
                  >
                    ▲
                  </button>
                  <div className="font-display text-3xl font-black text-white">{val}</div>
                  <button
                    onClick={() =>
                      setDials((prev) => prev.map((v, i) => (i === idx ? (v + 9) % 10 : v)))
                    }
                    className="w-full py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-black cursor-pointer"
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const ok = dials.every((v, i) => v === puz.solution[i]);
                if (ok) finish(true);
                else handleWrongAttempt('Combinación incorrecta. Relee la pista matemática.');
              }}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm cursor-pointer"
            >
              🔓 Probar Combinación
            </button>
          </div>
        )}

        {/* 3) MEMORIA DE RUNAS (memory_runes) */}
        {puz.type === 'memory_runes' && !result && (
          <div className="space-y-3">
            <div className="text-center text-xs font-bold">
              {memPhase === 'watching' ? (
                <span className="text-amber-300 animate-pulse">👀 Observa el orden en que brillan...</span>
              ) : (
                <span className="text-emerald-300">
                  ✋ ¡Tu turno! Toca las {puz.solution.length} runas ({seqInput.length}/{puz.solution.length})
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {puz.buttons.map((b) => {
                const isLit = litRuneId === b.id;
                return (
                  <button
                    key={b.id}
                    disabled={memPhase !== 'playing'}
                    onClick={() => {
                      const next = [...seqInput, b.id];
                      setSeqInput(next);
                      const stepIdx = next.length - 1;
                      if (next[stepIdx] !== puz.solution[stepIdx]) {
                        finish(false);
                      } else if (next.length === puz.solution.length) {
                        finish(true);
                      }
                    }}
                    className={`py-4 rounded-2xl border-2 font-black text-base transition cursor-pointer ${
                      isLit
                        ? 'bg-amber-400 border-white text-black scale-105 shadow-[0_0_20px_#fde047]'
                        : 'bg-fuchsia-950/70 border-fuchsia-600/60 text-white hover:bg-fuchsia-900/80 disabled:opacity-75'
                    }`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
            {memPhase === 'playing' && seqInput.length === 0 && (
              <button
                onClick={() => setMemPhase('watching')}
                className="w-full py-1.5 rounded-lg bg-stone-900 text-stone-400 text-xs font-bold cursor-pointer"
              >
                👁️ Ver destello otra vez
              </button>
            )}
          </div>
        )}

        {/* 4) BALANZA DE RELIQUIAS (balance_scales) */}
        {puz.type === 'balance_scales' && !result && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-stone-950 border border-amber-700/60 flex items-center justify-between text-xs">
              <span className="text-stone-300">Peso en el platillo:</span>
              <span
                className={`font-display text-lg font-black ${
                  currentWeight === puz.targetWeight
                    ? 'text-emerald-400'
                    : currentWeight > puz.targetWeight
                    ? 'text-red-400'
                    : 'text-amber-300'
                }`}
              >
                {currentWeight} kg / {puz.targetWeight} kg
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {puz.weights.map((w) => {
                const active = selectedWeights.includes(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() =>
                      setSelectedWeights((prev) =>
                        prev.includes(w.id) ? prev.filter((id) => id !== w.id) : [...prev, w.id]
                      )
                    }
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition ${
                      active
                        ? 'bg-emerald-950/70 border-emerald-400 text-emerald-100'
                        : 'bg-stone-900 border-stone-700 text-stone-200'
                    }`}
                  >
                    <span>{w.label}</span>
                    <span className="px-2 py-0.5 rounded bg-black/40 text-amber-300">{w.kg} kg</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                if (currentWeight === puz.targetWeight) finish(true);
                else handleWrongAttempt(`El platillo pesa ${currentWeight} kg y debe ser exactamente ${puz.targetWeight} kg.`);
              }}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm cursor-pointer"
            >
              ⚖️ Confirmar Equilibrio
            </button>
          </div>
        )}

        {/* 5) SECUENCIA ELEMENTAL (sequence) */}
        {puz.type === 'sequence' && !result && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              {puz.solution.map((_, slot) => {
                const chosenId = seqInput[slot];
                const btnObj = puz.buttons.find((b) => b.id === chosenId);
                return (
                  <div
                    key={slot}
                    className="px-3 py-1.5 rounded-xl bg-stone-950 border border-fuchsia-600/60 text-xs font-bold text-amber-200 min-w-[78px] text-center"
                  >
                    {btnObj ? btnObj.label : `Paso ${slot + 1}`}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {puz.buttons.map((b) => (
                <button
                  key={b.id}
                  disabled={seqInput.includes(b.id) || seqInput.length >= puz.solution.length}
                  onClick={() => {
                    const next = [...seqInput, b.id];
                    setSeqInput(next);
                    if (next.length === puz.solution.length) {
                      const ok = next.every((val, i) => val === puz.solution[i]);
                      finish(ok);
                    }
                  }}
                  className="py-3 rounded-xl bg-fuchsia-950/70 hover:bg-fuchsia-800/80 disabled:opacity-40 border border-fuchsia-500/60 text-white font-bold text-sm cursor-pointer"
                >
                  {b.label}
                </button>
              ))}
            </div>
            {seqInput.length > 0 && (
              <button
                onClick={() => setSeqInput([])}
                className="w-full py-1.5 rounded-lg bg-stone-900 text-stone-400 text-xs font-bold cursor-pointer"
              >
                ↺ Borrar selección
              </button>
            )}
          </div>
        )}

        {/* 6) ACERTIJO DE OPCIONES (riddle) */}
        {puz.type === 'riddle' && !result && (
          <div className="space-y-2">
            {puz.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => finish(opt.id === puz.correctOption)}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-fuchsia-900/70 border border-fuchsia-700/60 text-left text-sm font-bold text-stone-100 cursor-pointer"
              >
                {opt.id.toUpperCase()}) {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* RESULTADO FINAL (ÉXITO O FALLO APLICADO EN LA HOJA) */}
        {result && (
          <div
            className={`p-4 rounded-2xl border-2 text-center space-y-2.5 ${
              result === 'success'
                ? 'bg-emerald-950/70 border-emerald-400 text-emerald-100'
                : 'bg-red-950/70 border-red-500 text-red-100'
            }`}
          >
            <div className="font-display text-xl font-black">
              {result === 'success' ? '✅ ¡DESAFÍO SUPERADO!' : '💥 ¡TRAMPA ACTIVADA!'}
            </div>
            <p className="text-xs leading-relaxed">
              {result === 'success' ? puz.successText : puz.failText}
            </p>
            <div className="text-[11px] font-bold bg-black/40 p-2 rounded-xl text-amber-200">
              {result === 'success'
                ? '✓ Recompensas aplicadas automáticamente en tu hoja.'
                : '⚠️ Penalización aplicada automáticamente en tu hoja y Estados Activos.'}
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs cursor-pointer"
            >
              Cerrar y Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
