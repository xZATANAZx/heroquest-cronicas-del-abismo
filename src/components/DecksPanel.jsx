import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Armchair,
  Gem,
  Compass,
  Shuffle,
  Trash2,
  Building2,
  Users,
  Infinity as InfinityIcon,
  Tv,
  FlaskConical,
  Crown,
  Zap,
} from 'lucide-react';
import {
  EVIL_WIZARD_DECK,
  DUNGEON_EVENTS_DECK,
  FURNITURE_DECK,
  FURNITURE_TYPES,
  TREASURE_TRAP_DECK,
  TRAVEL_DECK,
} from '../data/decks';
import {
  OFFICIAL_ARTIFACTS,
  OFFICIAL_ALCHEMY_DECK,
  OFFICIAL_DREAD_SPELLS,
  OFFICIAL_ELEMENTAL_SPELLS,
  OFFICIAL_KNIGHT_SKILLS,
} from '../data/officialCards';
import {
  generateProceduralEvilWizard,
  generateProceduralEvent,
  generateProceduralFurniture,
  generateProceduralTreasure,
  generateProceduralTravel,
  generateHintCard,
  PROCEDURAL_BIOMES,
  ZARGON_COUNTER_TYPES,
} from '../data/proceduralEngine';

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function DecksPanel({
  onChaosChange,
  partyLevel = 1,
  onProjectToTV,
  zargonCounters,
  setZargonCounters,
  activeMissionContext = null,
}) {
  const [activeTab, setActiveTab] = useState('treasure');

  // Mazo del Malvado Brujo (mano máx 3)
  const [ewDeck, setEwDeck] = useState(() => shuffleArray(EVIL_WIZARD_DECK));
  const [ewHand, setEwHand] = useState([]);
  const [ewDiscard, setEwDiscard] = useState([]);

  // Mazo de Eventos
  const [eventCard, setEventCard] = useState(null);

  // Mazo de Mobiliario
  const [furnitureFilter, setFurnitureFilter] = useState('Todos');
  const [furnitureCard, setFurnitureCard] = useState(null);

  // Mazo Oficial de Tesoros y Trampas (descarta tesoros, devuelve trampas/errantes al fondo)
  const [treasureDeck, setTreasureDeck] = useState(() => shuffleArray(TREASURE_TRAP_DECK));
  const [treasureCard, setTreasureCard] = useState(null);

  // Nuevos Mazos Oficiales: Alquimia (20), Artefactos (21), Hechizos (27) + Caballero (3)
  const [alchemyCard, setAlchemyCard] = useState(null);
  const [artifactFilter, setArtifactFilter] = useState('Todos');
  const [spellSubTab, setSpellSubTab] = useState('terror'); // 'terror' | 'elemental' | 'caballero'

  const drawOfficialTreasure = () => {
    let pool = treasureDeck;
    if (pool.length === 0) {
      pool = shuffleArray(TREASURE_TRAP_DECK);
    }
    const [drawn, ...rest] = pool;
    const nextDeck = drawn.returnToDeck ? [...rest, drawn] : rest;
    setTreasureDeck(nextDeck);
    setTreasureCard({ ...drawn, _drawnAt: Date.now() });
  };

  const resetOfficialTreasure = () => {
    setTreasureDeck(shuffleArray(TREASURE_TRAP_DECK));
    setTreasureCard(null);
  };

  // Viajes y Pistas
  const [travelCard, setTravelCard] = useState(null);
  const [hintBiomeId, setHintBiomeId] = useState(activeMissionContext?.biomeId || 'catacumbas');
  const [hintCard, setHintCard] = useState(null);

  React.useEffect(() => {
    if (activeMissionContext?.biomeId) {
      setHintBiomeId(activeMissionContext.biomeId);
    }
  }, [activeMissionContext?.biomeId]);

  const activeBiomeObj = PROCEDURAL_BIOMES.find((b) => b.id === activeMissionContext?.biomeId);

  const drawEvilWizard = () => {
    if (ewHand.length >= 3) return;
    let pool = ewDeck;
    if (pool.length === 0) {
      pool = shuffleArray(EVIL_WIZARD_DECK);
      setEwDiscard([]);
    }
    const [drawn, ...rest] = pool;
    setEwDeck(rest);
    setEwHand((prev) => [...prev, drawn]);
  };

  const playEvilWizardCard = (card) => {
    setEwHand((prev) => prev.filter((c) => c.id !== card.id));
    setEwDiscard((prev) => [card, ...prev]);
  };

  const resetEvilWizard = () => {
    setEwDeck(shuffleArray(EVIL_WIZARD_DECK));
    setEwHand([]);
    setEwDiscard([]);
  };

  const drawRandom = (list, setter) => {
    const picked = list[Math.floor(Math.random() * list.length)];
    setter({ ...picked, _drawnAt: Date.now() });
  };

  const drawFurniture = () => {
    const pool =
      furnitureFilter === 'Todos'
        ? FURNITURE_DECK
        : FURNITURE_DECK.filter(
            (c) => c.furniture === furnitureFilter || c.furniture === 'Genérico'
          );
    drawRandom(pool, setFurnitureCard);
  };

  const tabs = [
    { id: 'treasure', label: `Tesoros Oficiales (${treasureDeck.length})`, icon: Gem, color: 'text-emerald-400' },
    { id: 'alquimia', label: 'Alquimia (20)', icon: FlaskConical, color: 'text-teal-400' },
    { id: 'artefactos', label: 'Artefactos (21)', icon: Crown, color: 'text-amber-300' },
    { id: 'hechizos', label: 'Hechizos Oficiales', icon: Zap, color: 'text-cyan-400' },
    { id: 'zargon', label: 'Malvado Brujo', icon: Flame, color: 'text-red-400' },
    { id: 'furniture', label: 'Mobiliario', icon: Armchair, color: 'text-amber-400' },
    { id: 'events', label: 'Eventos / Caos', icon: Sparkles, color: 'text-purple-400' },
    { id: 'travel', label: 'Pistas y Viajes', icon: Compass, color: 'text-sky-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner de Contexto de Misión Activa */}
      {activeMissionContext && (
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/35 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-300 font-bold">
              🗺️ Mazos conectados a: {activeMissionContext.title}
            </span>
            {activeBiomeObj && (
              <span className={`px-2 py-0.5 rounded-lg border font-bold ${activeBiomeObj.badgeColor}`}>
                {activeBiomeObj.icon} {activeBiomeObj.name}
              </span>
            )}
          </div>
          <span className="text-slate-400">
            Las cartas <strong>Procedurales</strong> y <strong>Pistas</strong> se adaptan automáticamente a esta misión.
          </span>
        </div>
      )}

      {/* Selector de Mazo */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 border transition cursor-pointer ${
                active
                  ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-lg shadow-amber-950/40'
                  : 'bg-stone-900/70 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-600'
              }`}
            >
              <Icon className={`w-4 h-4 ${t.color}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 1. MAZO DEL MALVADO BRUJO */}
      {activeTab === 'zargon' && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-red-400">Mazo del Malvado Brujo (Zargon)</h3>
              <p className="text-sm text-stone-400">
                Cuando sea el turno de Zargon y no haya monstruos en el tablero, roba 1 carta (mano máxima: 3).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-300">
                Mazo: <strong className="text-amber-300">{ewDeck.length}</strong> · Descarte:{' '}
                <strong className="text-stone-400">{ewDiscard.length}</strong>
              </span>
              <button
                onClick={drawEvilWizard}
                disabled={ewHand.length >= 3}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-bold text-sm cursor-pointer transition"
              >
                + Robar Carta ({ewHand.length}/3)
              </button>
              <button
                onClick={() => {
                  if (ewHand.length >= 3) return;
                  setEwHand((prev) => [...prev, generateProceduralEvilWizard(partyLevel, activeMissionContext)]);
                }}
                disabled={ewHand.length >= 3}
                className="px-3.5 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                title="Genera una carta nueva infinita escalada al nivel actual"
              >
                <InfinityIcon className="w-4 h-4" /> Procedural
              </button>
              <button
                onClick={resetEvilWizard}
                className="p-2 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500 text-stone-300 cursor-pointer"
                title="Barajar todo"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Reverso visual del Mazo de Zargon (Nano Banana) */}
            <button
              onClick={drawEvilWizard}
              disabled={ewHand.length >= 3}
              className="group relative rounded-2xl overflow-hidden border-2 border-amber-600/60 hover:border-amber-400 disabled:opacity-50 shadow-2xl min-h-[260px] flex flex-col justify-end p-4 text-left cursor-pointer transition"
            >
              <img
                src="/art/deck_zargon.jpg"
                alt="Mazo del Malvado Brujo"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Mazo Activo ({ewDeck.length})
                </div>
                <div className="font-display font-bold text-lg text-white">
                  {ewHand.length >= 3 ? 'Mano Llena (3/3)' : 'Robar Carta Oscura'}
                </div>
              </div>
            </button>

            {ewHand.length === 0 ? (
              <div className="md:col-span-3 py-12 text-center border border-dashed border-stone-700 rounded-2xl text-stone-500 flex items-center justify-center px-6">
                <span>
                  Tu mano de Zargon está vacía. Haz clic en la carta de <strong>Zargon</strong> a la izquierda cuando no tengas monstruos activos.
                </span>
              </div>
            ) : (
              ewHand.map((card) => (
                <div
                  key={card.id}
                  className="p-5 rounded-2xl bg-gradient-to-b from-red-950/60 to-stone-950 border border-red-700/50 flex flex-col justify-between gap-4 shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2 py-0.5 rounded bg-red-900/70 text-red-200 font-semibold">
                        {card.type}
                      </span>
                      <span className="text-amber-400/90">{card.rarity}</span>
                    </div>
                    <h4 className="font-display font-bold text-lg text-amber-200 mb-2">{card.title}</h4>
                    <p className="text-sm text-stone-300 leading-relaxed">{card.text}</p>
                  </div>
                  <button
                    onClick={() => playEvilWizardCard(card)}
                    className="w-full py-2 rounded-lg bg-red-800/80 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Jugar / Descartar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. MAZO DE EVENTOS DE MAZMORRA */}
      {activeTab === 'events' && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-purple-300">Eventos Repentinos y Reloj del Caos</h3>
              <p className="text-sm text-stone-400">
                Roba un evento cuando el Reloj del Caos llegue a 10, al sacar un 1 natural o para añadir tensión repentina.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => drawRandom(DUNGEON_EVENTS_DECK, setEventCard)}
                className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm cursor-pointer transition"
              >
                ⚡ Robar Evento
              </button>
              <button
                onClick={() => setEventCard(generateProceduralEvent(partyLevel, activeMissionContext))}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-sm flex items-center gap-1.5 cursor-pointer transition"
              >
                <InfinityIcon className="w-4 h-4" /> Evento Procedural Infinito
              </button>
              {eventCard && onProjectToTV && (
                <button
                  onClick={() =>
                    onProjectToTV({
                      kind: 'card',
                      subtitle: `Evento de Mazmorra · ${eventCard.severity}`,
                      title: eventCard.title,
                      text: eventCard.text,
                    })
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Tv className="w-4 h-4" /> Proyectar en TV
                </button>
              )}
              {onChaosChange && (
                <button
                  onClick={() => onChaosChange(0)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-purple-400 text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Reiniciar Reloj a 0
                </button>
              )}
            </div>
          </div>

          {eventCard ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/60 via-stone-950 to-stone-900 border-2 border-purple-500/60 max-w-2xl mx-auto shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-purple-900/70 text-purple-200">
                {eventCard.severity}
              </span>
              <h4 className="font-display text-2xl font-bold text-amber-200 mt-3 mb-2">{eventCard.title}</h4>
              <p className="text-base text-stone-200 leading-relaxed">{eventCard.text}</p>
            </div>
          ) : (
            <p className="text-center py-10 text-stone-500">Pulsa el botón superior para revelar un suceso inesperado.</p>
          )}
        </div>
      )}

      {/* 3. MAZO DE MOBILIARIO */}
      {activeTab === 'furniture' && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-amber-300">Sistema de Mobiliario Interactivo</h3>
            <p className="text-sm text-stone-400">
              Un héroe adyacente a un mueble puede gastar su acción para examinarlo (1 vez por mueble). También puede volcar mesas para cobertura (+1 Def vs proyectiles) o subir encima (+1 mov, Ventaja de altura).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FURNITURE_TYPES.map((f) => (
              <button
                key={f}
                onClick={() => setFurnitureFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition ${
                  furnitureFilter === f
                    ? 'bg-amber-600 text-black border-amber-400'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={drawFurniture}
              className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-display font-bold text-sm cursor-pointer transition shadow-lg"
            >
              🪑 Examinar Mueble ({furnitureFilter})
            </button>
            <button
              onClick={() => setFurnitureCard(generateProceduralFurniture(furnitureFilter, partyLevel))}
              className="px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm flex items-center gap-1.5 cursor-pointer transition"
            >
              <InfinityIcon className="w-4 h-4" /> Hallazgo Procedural Único
            </button>
            {furnitureCard && onProjectToTV && (
              <button
                onClick={() =>
                  onProjectToTV({
                    kind: 'card',
                    subtitle: `Mobiliario · ${furnitureCard.furniture}`,
                    title: furnitureCard.title,
                    text: furnitureCard.text,
                  })
                }
                className="px-4 py-3 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Tv className="w-4 h-4" /> Proyectar en TV
              </button>
            )}
          </div>

          {furnitureCard && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/50 via-stone-950 to-stone-900 border-2 border-amber-500/60 max-w-2xl shadow-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2.5 py-1 rounded bg-amber-900/70 text-amber-200 font-bold">
                  Mueble: {furnitureCard.furniture}
                </span>
                <span className="px-2.5 py-1 rounded bg-stone-800 text-stone-200 font-semibold">
                  {furnitureCard.type}
                </span>
              </div>
              <h4 className="font-display text-2xl font-bold text-amber-200 mb-2">{furnitureCard.title}</h4>
              <p className="text-stone-200 leading-relaxed">{furnitureCard.text}</p>
            </div>
          )}
        </div>
      )}

      {/* 4. MAZO OFICIAL DE TESOROS, ALQUIMIA Y TRAMPAS */}
      {activeTab === 'treasure' && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-emerald-300">Mazo Oficial de Tesoros (Base + Luna del Terror)</h3>
              <p className="text-sm text-stone-400">
                Regla oficial: los Tesoros salen del mazo al robarse; las Trampas y Monstruos Errantes vuelven al fondo. Cartas restantes: <strong className="text-amber-300">{treasureDeck.length}/{TREASURE_TRAP_DECK.length}</strong>.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={drawOfficialTreasure}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm cursor-pointer transition"
              >
                💎 Robar Carta Oficial ({treasureDeck.length})
              </button>
              <button
                onClick={resetOfficialTreasure}
                className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" /> Barajar Mazo
              </button>
              <button
                onClick={() => setTreasureCard(generateProceduralTreasure(partyLevel))}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-sm flex items-center gap-1.5 cursor-pointer transition"
              >
                <InfinityIcon className="w-4 h-4" /> Reliquia Procedural
              </button>
              {treasureCard && onProjectToTV && (
                <button
                  onClick={() =>
                    onProjectToTV({
                      kind: 'card',
                      subtitle: `Tesoro Oficial · ${treasureCard.kind}`,
                      title: treasureCard.title,
                      text: treasureCard.text,
                    })
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Tv className="w-4 h-4" /> Proyectar en TV
                </button>
              )}
            </div>
          </div>

          {treasureCard ? (
            <div
              className={`p-6 rounded-2xl border-2 max-w-2xl mx-auto shadow-xl ${
                treasureCard.kind === 'Trampa' || treasureCard.kind === 'Peligro'
                  ? 'bg-red-950/40 border-red-500/70'
                  : 'bg-emerald-950/30 border-emerald-500/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-black/40 text-amber-300">
                  {treasureCard.kind}
                </span>
                <span className="text-[11px] font-bold text-stone-300">
                  {treasureCard.returnToDeck ? '↩️ Vuelve al fondo del mazo' : '✓ Se retira del mazo'}
                </span>
              </div>
              <h4 className="font-display text-2xl font-bold text-white mt-3 mb-2">{treasureCard.title}</h4>
              <p className="text-stone-200 leading-relaxed">{treasureCard.text}</p>
            </div>
          ) : (
            <p className="text-center py-10 text-stone-500">Pulsa <strong>Robar Carta Oficial</strong> para sacar una carta del Mazo de Tesoros.</p>
          )}
        </div>
      )}

      {/* 4B. MAZO OFICIAL DE ALQUIMIA (20 POCIONES · LA LUNA DEL TERROR) */}
      {activeTab === 'alquimia' && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-teal-300">🧪 Mazo Oficial de Alquimia (20 Pociones)</h3>
              <p className="text-sm text-stone-400">
                Todas las pociones oficiales de La Luna del Terror, incluyendo <strong>Poción de Destino Imprevisible</strong> y <strong>Grog Ogro</strong>.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => drawRandom(OFFICIAL_ALCHEMY_DECK, setAlchemyCard)}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-sm cursor-pointer shadow"
              >
                🧪 Robar Poción Aleatoria
              </button>
              {alchemyCard && onProjectToTV && (
                <button
                  onClick={() =>
                    onProjectToTV({
                      kind: 'card',
                      subtitle: `Alquimia Oficial · ${alchemyCard.dice}`,
                      title: alchemyCard.name,
                      text: `${alchemyCard.text} (Valor: ${alchemyCard.price} MO)`,
                    })
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Tv className="w-4 h-4" /> TV
                </button>
              )}
            </div>
          </div>

          {alchemyCard && (
            <div className="p-5 rounded-2xl bg-teal-950/40 border-2 border-teal-400/70 max-w-2xl mx-auto space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-teal-500 text-slate-950 text-xs font-black">
                  {alchemyCard.dice}
                </span>
                <span className="text-xs font-bold text-amber-300">💰 {alchemyCard.price} MO</span>
              </div>
              <h4 className="font-display text-2xl font-bold text-white">{alchemyCard.name}</h4>
              <p className="text-sm text-teal-100 leading-relaxed">{alchemyCard.text}</p>
              {alchemyCard.isWildcard && (
                <button
                  onClick={() => drawRandom(OFFICIAL_ALCHEMY_DECK.filter((p) => !p.isWildcard), setAlchemyCard)}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  🎲 ¡Robar Efecto Aleatorio de Destino Imprevisible!
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {OFFICIAL_ALCHEMY_DECK.map((p) => (
              <div
                key={p.id}
                onClick={() => setAlchemyCard(p)}
                className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-teal-500/70 cursor-pointer space-y-1 text-xs transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-teal-200 text-sm">{p.name}</strong>
                  <span className="text-amber-300 font-bold shrink-0">{p.price} MO</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-300">{p.dice}</div>
                <p className="text-stone-300 leading-snug">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4C. GALERÍA DE ARTEFACTOS OFICIALES (21 CARTAS: 14 BASE + 7 LUNA DEL TERROR) */}
      {activeTab === 'artefactos' && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-amber-300">👑 Artefactos Oficiales (21 Reliquias)</h3>
              <p className="text-sm text-stone-400">
                Catálogo oficial completo del Juego Base (14) y La Luna del Terror (7). Haz clic en TV para mostrar la carta a la mesa.
              </p>
            </div>
            <div className="flex gap-1.5">
              {['Todos', 'Juego Base', 'La Luna del Terror'].map((f) => (
                <button
                  key={f}
                  onClick={() => setArtifactFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    artifactFilter === f
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-stone-900 border-stone-700 text-stone-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {OFFICIAL_ARTIFACTS.filter((a) => artifactFilter === 'Todos' || a.expansion === artifactFilter).map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/30 to-stone-950 border border-amber-700/45 flex flex-col justify-between gap-2 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black">
                      {a.expansion}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300">{a.dice}</span>
                  </div>
                  <h4 className="font-display text-base font-bold text-amber-100">{a.name}</h4>
                  <p className="text-stone-300 leading-relaxed">{a.text}</p>
                </div>
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">{a.type} · {a.restriction}</span>
                  {onProjectToTV && (
                    <button
                      onClick={() =>
                        onProjectToTV({
                          kind: 'card',
                          subtitle: `Artefacto Oficial · ${a.expansion}`,
                          title: `${a.name} (${a.dice})`,
                          text: a.text,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-sky-700 hover:bg-sky-600 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Tv className="w-3 h-3" /> TV
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4D. HECHIZOS OFICIALES (15 TERROR DE ZARGON + 12 ELEMENTALES + 3 CABALLERO) */}
      {activeTab === 'hechizos' && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-cyan-300">⚡ Hechizos Oficiales y Caballero Guardián</h3>
              <p className="text-sm text-stone-400">
                Referencia rápida oficial para el DM (Hechizos del Terror de Zargon) y los jugadores (Elementales y Caballero).
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                ['terror', '💀 Hechizos del Terror (15)'],
                ['elemental', '✨ Elementales (12)'],
                ['caballero', '🛡️ Caballero Guardián (3)'],
              ].map(([id, lbl]) => (
                <button
                  key={id}
                  onClick={() => setSpellSubTab(id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    spellSubTab === id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : 'bg-stone-900 border-stone-700 text-stone-300'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {spellSubTab === 'terror' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {OFFICIAL_DREAD_SPELLS.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-rose-950/25 border border-rose-700/45 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="font-display text-sm text-rose-200">{s.name}</strong>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 text-amber-300 font-bold">
                      {s.expansion}
                    </span>
                  </div>
                  <p className="text-stone-200 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          )}

          {spellSubTab === 'elemental' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {OFFICIAL_ELEMENTAL_SPELLS.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-sky-950/25 border border-sky-700/45 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="font-display text-sm text-sky-200">{s.name}</strong>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 text-cyan-300 font-bold">
                      {s.school}
                    </span>
                  </div>
                  <p className="text-stone-200 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          )}

          {spellSubTab === 'caballero' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {OFFICIAL_KNIGHT_SKILLS.map((k) => (
                <div key={k.id} className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/50 space-y-1.5 text-xs">
                  <strong className="font-display text-base text-amber-200">🛡️ {k.name}</strong>
                  <p className="text-stone-200 leading-relaxed">{k.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. VIAJES Y CIUDAD */}
      {activeTab === 'travel' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Viajes entre misiones */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-sky-300 flex items-center gap-2">
                <Compass className="w-5 h-5" /> Viajes Entre Misiones
              </h3>
              <div className="flex gap-1.5">
                <button
                  onClick={() => drawRandom(TRAVEL_DECK, setTravelCard)}
                  className="px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs cursor-pointer"
                >
                  🗺️ Robar Viaje
                </button>
                <button
                  onClick={() => setTravelCard(generateProceduralTravel(partyLevel))}
                  className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <InfinityIcon className="w-3.5 h-3.5" /> Procedural
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-400">
              Antes de iniciar una nueva misión, roba 1 carta de viaje para representar el trayecto por los caminos del Imperio.
            </p>
            {travelCard ? (
              <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-700/50 space-y-2">
                <div className="flex justify-between text-xs text-sky-300 font-semibold">
                  <span>Bioma: {travelCard.biome}</span>
                  <span>Prueba: {travelCard.test}</span>
                </div>
                <h4 className="font-display text-lg font-bold text-amber-200">{travelCard.title}</h4>
                <p className="text-sm text-emerald-300"><strong>✓ Éxito:</strong> {travelCard.success}</p>
                <p className="text-sm text-red-300"><strong>✗ Fallo:</strong> {travelCard.fail}</p>
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic py-4">Sin evento de viaje activo.</p>
            )}
          </div>

          {/* Mazo de Pistas (Hint Deck — Bifurcaciones con Recompensa/Consecuencia) */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Mazo de Pistas (Bifurcaciones)
              </h3>
              <button
                onClick={() => setHintCard(generateHintCard(hintBiomeId))}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs cursor-pointer"
              >
                🔍 Robar Pista Sensorial
              </button>
            </div>
            <p className="text-xs text-stone-400">
              Cuando los héroes lleguen a un cruce de pasillos o investiguen una puerta, roba 1 Pista: les da una decisión táctica real con recompensa o consecuencia. (La gestión completa de Ciudad ahora está en la pestaña <strong>Ciudad y Crafteo</strong>).
            </p>
            <select
              value={hintBiomeId}
              onChange={(e) => setHintBiomeId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200"
            >
              {PROCEDURAL_BIOMES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.icon} {b.name}
                </option>
              ))}
            </select>

            {hintCard ? (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/50 space-y-2 text-xs">
                <div className="text-amber-400 font-bold">
                  {hintCard.biomeIcon} Pista · {hintCard.biomeName}
                </div>
                <h4 className="font-display text-lg font-bold text-amber-100">{hintCard.title}</h4>
                <p className="text-stone-200 italic">“{hintCard.clue}”</p>
                <p className="text-emerald-300"><strong>✓ Si investigan/aprovechan:</strong> {hintCard.reward}</p>
                <p className="text-red-300"><strong>⚠️ Consecuencia/Riesgo:</strong> {hintCard.consequence}</p>
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic py-3">Pulsa "Robar Pista Sensorial" para dar vida al próximo cruce.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
