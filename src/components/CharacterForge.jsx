import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  UserPlus,
  Printer,
  Trash2,
  TrendingUp,
  Backpack,
  Sparkles,
  Heart,
  Brain,
  Shield,
  Swords,
  Dices,
  Coins,
  Plus,
  X,
  QrCode,
  Gift,
  Smartphone,
} from 'lucide-react';
import {
  ATTRIBUTES,
  SKILLS,
  RACES,
  CLASSES,
  ALIGNMENTS,
  MOTIVATIONS,
  PERKS,
  FLAWS,
  QUIRKS,
  LEVEL_TABLE,
  EQUIPMENT_CATALOG,
  SPELLS_CATALOG,
  getModifier,
  formatMod,
} from '../data/characterSystem';
import { PROFESSIONS } from '../data/citySystem';
import {
  RARITIES,
  DIGITAL_LOOT_CATALOG,
  getRarityMeta,
  generateProceduralLoot,
} from '../data/lootCatalog';
import { KeywordChip, RichRuleText, KeywordModal } from './KeywordTooltip';

const DEFAULT_ATTRS = { FUE: 15, DES: 14, CON: 13, INT: 12, SAB: 10, CAR: 8 };

// Distribuye el Arreglo Estándar (15, 14, 13, 12, 10, 8) priorizando los atributos clave de cada Clase
function buildAttrsForClass(clsObj) {
  const pool = [15, 14, 13, 12, 10, 8];
  const order = [...(clsObj?.primaryAttrs || [])];
  ['CON', 'DES', 'SAB', 'FUE', 'INT', 'CAR'].forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });
  const result = {};
  order.forEach((id, idx) => {
    result[id] = pool[idx] ?? 10;
  });
  return result;
}

export default function CharacterForge({
  heroes,
  setHeroes,
  mobileCreateOnly = false,
  onHeroCreatedMobile,
}) {
  const [mode, setMode] = useState(mobileCreateOnly ? 'create' : heroes.length > 0 ? 'sheet' : 'create');
  const [selectedHeroId, setSelectedHeroId] = useState(heroes[0]?.id || null);

  // Estado QR Universal (Wi-Fi Local instantáneo + Túnel Público HTTPS + QR directo por Héroe)
  const [showQRPanel, setShowQRPanel] = useState(false);
  const [networkInfo, setNetworkInfo] = useState({
    baseUrl: '',
    localUrl: '',
    publicTunnelUrl: '',
    interfaces: [],
    isPublicTunnel: false,
    tunnelStatus: 'starting',
  });
  const [qrMode, setQrMode] = useState('local'); // 'local' | 'tunnel'
  const [selectedInterfaceUrl, setSelectedInterfaceUrl] = useState('');
  const [qrTargetParam, setQrTargetParam] = useState('new'); // 'new' | hero.id
  const [qrCopied, setQrCopied] = useState(false);
  const [qrCreateUrl, setQrCreateUrl] = useState('');

  // Envío de Objeto / Tesoro con 6 Rarezas del DM
  const [lootRarityFilter, setLootRarityFilter] = useState('all');
  const [selectedLootId, setSelectedLootId] = useState(DIGITAL_LOOT_CATALOG[0].id);
  const [procRarity, setProcRarity] = useState('auto');
  const [procPreview, setProcPreview] = useState(null);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemType, setCustomItemType] = useState('Arma');
  const [customItemRarity, setCustomItemRarity] = useState('raro');
  const [customItemDice, setCustomItemDice] = useState('3 DC');
  const [customItemSpecial, setCustomItemSpecial] = useState('');
  const [customItemFlaw, setCustomItemFlaw] = useState('');

  // Estado del Creador de Personajes (Simplificado: Atributos fijos recomendados, sin Alineamiento/Motivación/Ventajas/Desventajas)
  const [name, setName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [raceId, setRaceId] = useState('humano');
  const [dragonElement, setDragonElement] = useState('Fuego');
  const [classId, setClassId] = useState('barbaro');
  const level = 1; // Todos los héroes nuevos inician en Nivel 1; solo el DM los sube de nivel
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [professionId, setProfessionId] = useState('herrero');
  const [quirkId, setQuirkId] = useState('fanatico_acero');

  // Estado de Tienda / Inventario en Hoja
  const [itemToAdd, setItemToAdd] = useState(EQUIPMENT_CATALOG[0].id);

  const race = RACES.find((r) => r.id === raceId);
  const cls = CLASSES.find((c) => c.id === classId);
  const baseAttrs = buildAttrsForClass(cls);

  const finalAttrs = ATTRIBUTES.reduce((acc, a) => {
    const racial = race?.bonuses?.[a.id] || 0;
    acc[a.id] = Number(baseAttrs[a.id] || 10) + racial;
    return acc;
  }, {});

  const calcMaxPC = () => {
    const conMod = Math.max(0, getModifier(finalAttrs.CON));
    const raceBonus = raceId === 'enano' ? 1 : 0;
    return cls.basePC + conMod + raceBonus + (level - 1) * cls.pcPerLevel;
  };

  const calcMaxPM = () => {
    const intMod = Math.max(0, getModifier(finalAttrs.INT));
    const raceBonus = raceId === 'alto_elfo' ? 1 : 0;
    return cls.basePM + Math.floor(intMod / 2) + raceBonus + (level - 1) * cls.pmPerLevel;
  };

  const randomizeHero = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const firstNames = [
      'Kaelen', 'Lyra', 'Thorin', 'Valeria', 'Draven', 'Elowen', 'Garrick', 'Nyx',
      'Rowan', 'Seraphina', 'Brom', 'Isolde', 'Aldric', 'Freya', 'Kragor', 'Morrigan',
      'Talia', 'Ronan', 'Vesper', 'Darian', 'Astrid', 'Balthazar', 'Caelum', 'Soren',
    ];
    const epithets = [
      'del Norte', 'Puño de Hierro', 'de Elethorn', 'Sombra Gris', 'Rompeescudos',
      'Fuego Lunar', 'el Errante', 'la Audaz', 'Colmillo de Plata', 'del Abismo',
      'Guardia del Alba', 'Paso Silencioso',
    ];

    const rRace = pick(RACES);
    const rCls = pick(CLASSES);

    setName(`${pick(firstNames)} ${pick(epithets)}`);
    setRaceId(rRace.id);
    setClassId(rCls.id);
    setProfessionId(pick(PROFESSIONS).id);
    setQuirkId(pick(QUIRKS).id);
    setDragonElement(Math.random() < 0.5 ? 'Fuego' : 'Hielo');
  };

  const createHero = () => {
    const heroName = name.trim() || `${cls.name} de ${race.name.split(' ')[0]}`;
    const levelInfo = LEVEL_TABLE.find((l) => l.level === level) || LEVEL_TABLE[0];
    const maxPC = calcMaxPC();
    const maxPM = calcMaxPM();
    const speedBase = 8 + (race.speedMod || 0);
    const initMod = getModifier(finalAttrs.DES);
    const chosenSub = null; // La subclase se desbloquea cuando el DM sube al héroe a Nivel 3

    const finalSkills = Array.from(new Set([...cls.proficientSkills]));
    const raceTraitFull =
      raceId === 'draconido'
        ? `${race.traitName} (${dragonElement}): ${race.traitDesc}`
        : `${race.traitName}: ${race.traitDesc}`;

    const newHero = {
      id: `h-${Date.now()}`,
      name: heroName,
      playerName: playerName.trim() || 'Jugador',
      raceId: race.id,
      raceName: raceId === 'draconido' ? `${race.name} (${dragonElement})` : race.name,
      dragonElement: raceId === 'draconido' ? dragonElement : null,
      raceTrait: raceTraitFull,
      usedSpells: [],
      activeEffects: [],
      classId: cls.id,
      className: cls.name,
      role: cls.role,
      miniature: cls.miniature,
      subclass: chosenSub,
      level,
      xp: levelInfo.xp,
      profBonus: levelInfo.prof,
      gold: 25,
      attributes: finalAttrs,
      maxPC,
      currentPC: maxPC,
      maxPM,
      currentPM: maxPM,
      attackDice: cls.baseAttackDice,
      defendDice: cls.baseDefendDice,
      speed: speedBase,
      initMod,
      resourceName: cls.resourceName,
      coreAbility: cls.coreAbility,
      proficientSkills: finalSkills,
      alignment: null,
      motivation: null,
      perks: [],
      flaws: [],
      inventory: cls.startingGear.map((g, idx) => ({
        id: `init-${idx}`,
        name: g,
        type: idx === 0 ? 'Arma' : 'Equipo',
        traits: 'Equipo inicial de clase',
        equipped: idx === 0,
        qty: 1,
      })),
      professionId,
      professionName: PROFESSIONS.find((p) => p.id === professionId)?.name || 'Herrero de Batalla',
      quirk: QUIRKS.find((q) => q.id === quirkId) || null,
      materials: {
        racion_mazmorra: 1,
        ...(professionId === 'herbolario' || raceId === 'gnomo' ? { hierba_lunar: 1 } : {}),
        ...(professionId === 'herrero' ? { chatarra_acero: 1 } : {}),
        ...(professionId === 'escriba' || raceId === 'gnomo' ? { polvo_runico: 1 } : {}),
        ...(professionId === 'cazador' ? { colmillos_hueso: 1 } : {}),
      },
      bankedGold: 0,
      debt: 0,
      fame: 0,
      reputation: 0,
      titles: [],
      notes: '',
    };

    if (mobileCreateOnly && onHeroCreatedMobile) {
      onHeroCreatedMobile(newHero);
      return;
    }

    setHeroes((prev) => [...prev, newHero]);
    setSelectedHeroId(newHero.id);
    setName('');
    setMode('sheet');
  };

  const activeHero = heroes.find((h) => h.id === selectedHeroId) || heroes[0] || null;

  // Consultar red local y túnel público mientras el panel QR esté abierto
  useEffect(() => {
    if (mobileCreateOnly || !showQRPanel) return;
    let cancelled = false;

    const refreshNetwork = async () => {
      try {
        const res = await fetch('/api/network-info', { cache: 'no-store' });
        const info = res.ok
          ? await res.json()
          : {
              localUrl: window.location.origin,
              baseUrl: window.location.origin,
              interfaces: [],
              isPublicTunnel: false,
              tunnelStatus: 'local',
            };
        if (cancelled) return;
        setNetworkInfo(info);
        if (!selectedInterfaceUrl && info.localUrl) {
          setSelectedInterfaceUrl(info.localUrl);
        }
      } catch {
        // ignore
      }
    };

    refreshNetwork();
    const timer = setInterval(refreshNetwork, 3000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [showQRPanel, mobileCreateOnly]);

  // Calcular URL activa del QR y generar imagen al instante
  const activeQrBaseUrl =
    qrMode === 'tunnel' && networkInfo.publicTunnelUrl
      ? networkInfo.publicTunnelUrl
      : selectedInterfaceUrl || networkInfo.localUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const activeQrLink = activeQrBaseUrl ? `${activeQrBaseUrl}/?player=${qrTargetParam || 'new'}` : '';

  useEffect(() => {
    if (mobileCreateOnly || !showQRPanel || !activeQrLink) return;
    let cancelled = false;
    QRCode.toDataURL(activeQrLink, { width: 280, margin: 2, errorCorrectionLevel: 'M' })
      .then((img) => {
        if (!cancelled) setQrCreateUrl(img);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeQrLink, showQRPanel, mobileCreateOnly]);

  const updateActiveHero = (updater) => {
    if (!activeHero) return;
    setHeroes((prev) => prev.map((h) => (h.id === activeHero.id ? updater(h) : h)));
  };

  const levelUpHero = () => {
    if (!activeHero || activeHero.level >= 10) return;
    const hCls = CLASSES.find((c) => c.id === activeHero.classId) || CLASSES[0];
    const nextLvl = activeHero.level + 1;
    const lvlInfo = LEVEL_TABLE.find((l) => l.level === nextLvl);
    updateActiveHero((h) => ({
      ...h,
      level: nextLvl,
      xp: Math.max(h.xp, lvlInfo?.xp || h.xp),
      profBonus: lvlInfo?.prof || h.profBonus,
      maxPC: h.maxPC + hCls.pcPerLevel,
      currentPC: h.maxPC + hCls.pcPerLevel,
      maxPM: h.maxPM + hCls.pmPerLevel,
      currentPM: h.maxPM + hCls.pmPerLevel,
      subclass: nextLvl === 3 && !h.subclass ? hCls.subclasses[0] : h.subclass,
    }));
  };

  const addItemToHero = () => {
    const item = EQUIPMENT_CATALOG.find((i) => i.id === itemToAdd);
    if (!item || !activeHero) return;
    updateActiveHero((h) => ({
      ...h,
      inventory: [
        ...h.inventory,
        {
          id: `it-${Date.now()}`,
          name: item.name,
          type: item.type,
          dice: item.dice,
          traits: item.traits,
          equipped: false,
          qty: 1,
        },
      ],
    }));
  };

  const sendLootObjectToHero = (lootObj) => {
    if (!lootObj || !activeHero) return;
    updateActiveHero((h) => ({
      ...h,
      inventory: [
        ...h.inventory,
        {
          ...lootObj,
          id: `loot-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          equipped: false,
          qty: 1,
        },
      ],
    }));
  };

  const sendCatalogLootToHero = () => {
    const found = DIGITAL_LOOT_CATALOG.find((i) => i.id === selectedLootId);
    if (found) sendLootObjectToHero(found);
  };

  const sendCustomItemToHero = () => {
    if (!customItemName.trim() || !activeHero) return;
    sendLootObjectToHero({
      name: customItemName.trim(),
      type: customItemType,
      rarity: customItemRarity,
      dice: customItemDice.trim(),
      special: customItemSpecial.trim() || 'Tesoro especial entregado por el DM.',
      upgrade: customItemSpecial.trim() || 'Tesoro especial entregado por el DM.',
      flaw: customItemFlaw.trim(),
      traits: customItemSpecial.trim() || 'Tesoro especial entregado por el DM.',
      restriction: 'Todas las clases',
    });
    setCustomItemName('');
    setCustomItemSpecial('');
    setCustomItemFlaw('');
  };

  const removeItemFromHero = (itemId) => {
    updateActiveHero((h) => ({
      ...h,
      inventory: h.inventory.filter((i) => i.id !== itemId),
    }));
  };

  const deleteHero = (id) => {
    const next = heroes.filter((h) => h.id !== id);
    setHeroes(next);
    setSelectedHeroId(next[0]?.id || null);
    if (next.length === 0) setMode('create');
  };

  const nextLevelInfo = activeHero
    ? LEVEL_TABLE.find((l) => l.level === activeHero.level + 1)
    : null;

  return (
    <div className="space-y-6">
      {/* Barra superior (Oculta al imprimir y en modo creación móvil) */}
      {!mobileCreateOnly && (
        <div className="no-print space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMode('create')}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer transition ${
                  mode === 'create'
                    ? 'bg-amber-600 text-black border-amber-400'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Forjar Nuevo Héroe
              </button>
              <button
                onClick={() => setMode('sheet')}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer transition ${
                  mode === 'sheet'
                    ? 'bg-amber-600 text-black border-amber-400'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500'
                }`}
              >
                <Backpack className="w-4 h-4" /> Hojas de Héroes ({heroes.length})
              </button>
            </div>

            {mode === 'sheet' && activeHero && (
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" /> Imprimir Hoja A4
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Interactivo de Palabras Clave para Jugadores Nuevos */}
      <KeywordModal keyword={activeKeyword} onClose={() => setActiveKeyword(null)} />

      {/* ==================== MODO CREACIÓN DE PERSONAJE ==================== */}
      {mode === 'create' && (
        <div className="space-y-6 no-print">
          {/* Guía Rápida de Palabras Clave Tocables */}
          <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-700/50 space-y-2">
            <div className="text-xs font-bold text-sky-300">
              💡 ¿Eres nuevo? Toca cualquier palabra resaltada en azul para ver qué significa y para qué sirve:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['PC', 'PM', 'DC', 'CD', 'Competencia', 'Ventaja', 'Shock', 'Iniciativa', 'Modificador'].map((kw) => (
                <KeywordChip key={kw} word={kw} onSelect={setActiveKeyword} />
              ))}
            </div>
          </div>

          {/* Paso 1: Identidad (Todos inician en Nivel 1) */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-amber-300">1. Identidad del Héroe</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={randomizeHero}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Dices className="w-4 h-4" /> 🎲 Generar Personaje Random
                </button>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/50 text-amber-300 font-bold">
                  Nivel Inicial: 1
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Nombre del Personaje</label>
                <input
                  type="text"
                  placeholder="Ej. Kragor Puño de Hierro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 block mb-1">Tu Nombre (Jugador)</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Paso 2: Raza / Linaje */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-amber-300">2. Raza / Linaje</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RACES.map((r) => {
                const active = r.id === raceId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRaceId(r.id)}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      active
                        ? 'bg-amber-950/50 border-amber-400 shadow-lg'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{r.icon}</span>
                      <span className="text-[11px] font-bold text-emerald-300">
                        {Object.entries(r.bonuses)
                          .map(([k, v]) => `+${v} ${k}`)
                          .join(', ')}
                      </span>
                    </div>
                    <div className="font-display font-bold text-stone-100 mt-2">{r.name}</div>
                    <div className="text-xs text-amber-300/90 font-semibold mt-1">{r.traitName}</div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                      <RichRuleText text={r.traitDesc} onSelectKeyword={setActiveKeyword} />
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Opción Especial de Raza: Sangre de Dragón (Elemento) */}
            {raceId === 'draconido' && (
              <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-700/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-amber-300">🐉 Linaje de Sangre de Dragón — Elige tu Elemento de Aliento:</div>
                  <div className="text-stone-300">Se lanza 1 vez por misión en línea recta (3 casillas frente a ti) con 2 DC de daño mágico.</div>
                </div>
                <div className="flex gap-2">
                  {['Fuego', 'Hielo'].map((el) => (
                    <button
                      key={el}
                      type="button"
                      onClick={() => setDragonElement(el)}
                      className={`px-4 py-2 rounded-lg font-bold border cursor-pointer ${
                        dragonElement === el
                          ? 'bg-amber-600 text-black border-amber-300'
                          : 'bg-stone-900 border-stone-700 text-stone-300'
                      }`}
                    >
                      {el === 'Fuego' ? '🔥 Fuego (corta regeneración)' : '❄️ Hielo (escarcha mágica)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Paso 3: Clase / Arquetipo */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-amber-300">3. Clase / Arquetipo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CLASSES.map((c) => {
                const active = c.id === classId;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setClassId(c.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      active
                        ? 'bg-red-950/40 border-amber-400 shadow-lg'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{c.icon}</span>
                      <span className="text-[11px] font-bold text-amber-300">
                        PC {c.basePC} · PM {c.basePM}
                      </span>
                    </div>
                    <div className="font-display font-bold text-stone-100 mt-2">{c.name}</div>
                    <div className="text-[11px] text-stone-400">{c.role}</div>
                    <div className="text-[10px] text-sky-300 mt-1">Mini: {c.miniature}</div>
                    <p className="text-[11px] text-stone-300 mt-2 leading-snug">
                      <RichRuleText text={c.coreAbility} onSelectKeyword={setActiveKeyword} />
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paso 4: Atributos Recomendados Automáticos (Solo Lectura + Explicación Clara) */}
          <div className="grimoire-panel rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-amber-300">4. Atributos Recomendados de {cls.name}</h3>
              <p className="text-xs text-stone-400">
                Se asignan automáticamente según tu <strong>Clase + Raza</strong> para mantener el juego equilibrado. Atributos clave de tu clase:{' '}
                <strong className="text-amber-300">{cls.primaryAttrs.join(', ')}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ATTRIBUTES.map((a) => {
                const racial = race?.bonuses?.[a.id] || 0;
                const baseVal = Number(baseAttrs[a.id] ?? 10);
                const total = finalAttrs[a.id];
                const mod = getModifier(total);
                const isPrimary = cls.primaryAttrs.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={`p-3.5 rounded-xl border text-left space-y-1.5 ${
                      isPrimary
                        ? 'bg-amber-950/25 border-amber-500/70'
                        : 'bg-stone-900/90 border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-300">
                        {a.name} ({a.short}) {isPrimary && '★ Clave'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-600/20 border border-amber-500/50 text-amber-200 font-black text-xs">
                        {total} ({formatMod(mod)})
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Base recomendada: <strong>{baseVal}</strong>
                      {racial > 0 ? <span className="text-emerald-300"> + {racial} por Raza ({race.name.split(' ')[0]})</span> : ''}
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">{a.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Paso 5: Profesión (Ciudad + Mazmorra) y Rasgo de Personalidad (Quirk con Alertas al DM) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="text-xl font-bold text-amber-300">5. Profesión del Héroe</h3>
              <p className="text-xs text-stone-400">
                Otorga <strong>-20% de descuento</strong> en su distrito de la Ciudad y un <strong>bono único dentro de la mazmorra</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {PROFESSIONS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProfessionId(p.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer transition ${
                      professionId === p.id
                        ? 'bg-emerald-950/50 border-emerald-400 text-emerald-100'
                        : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-600'
                    }`}
                  >
                    <div className="font-bold">{p.icon} {p.name}</div>
                    <div className="text-[11px] text-emerald-300 mt-0.5">{p.cityBonus}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{p.dungeonBonus}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grimoire-panel rounded-2xl p-6 space-y-3">
              <h3 className="text-xl font-bold text-purple-300">6. Rasgo de Personalidad (Quirk)</h3>
              <p className="text-xs text-stone-400">
                Elige 1 rasgo equilibrado (1 ventaja táctica + 1 manía divertida). <strong>¡El DM recibirá alertas en vivo en el Tablero</strong> cuando tu manía pueda activarse en la sala!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {QUIRKS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuirkId(q.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer transition ${
                      quirkId === q.id
                        ? 'bg-purple-950/50 border-purple-400 text-purple-100'
                        : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-600'
                    }`}
                  >
                    <div className="font-bold">{q.icon} {q.name}</div>
                    <div className="text-[11px] text-emerald-300 mt-0.5">+ {q.bonus}</div>
                    <div className="text-[10px] text-red-300 mt-0.5">- {q.drawback}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen y Botón Final */}
          <div className="grimoire-panel rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 border-amber-500/50">
            <div className="flex flex-wrap gap-4 text-sm">
              <div><span className="text-stone-400">PC Máx:</span> <strong className="text-emerald-300 text-lg">{calcMaxPC()}</strong></div>
              <div><span className="text-stone-400">PM Máx:</span> <strong className="text-cyan-300 text-lg">{calcMaxPM()}</strong></div>
              <div><span className="text-stone-400">Ataque:</span> <strong className="text-red-300 text-lg">{cls.baseAttackDice} DC</strong></div>
              <div><span className="text-stone-400">Defensa:</span> <strong className="text-amber-300 text-lg">{cls.baseDefendDice} DC</strong></div>
              <div><span className="text-stone-400">Iniciativa:</span> <strong className="text-purple-300 text-lg">{formatMod(getModifier(finalAttrs.DES))}</strong></div>
            </div>
            <button
              onClick={createHero}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-display font-bold text-base shadow-xl cursor-pointer transition flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />{' '}
              {mobileCreateOnly ? 'Finalizar y Entrar a mi Hoja' : 'Forjar Héroe y Abrir Hoja'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODO HOJA DE PERSONAJE (IMPRIMIBLE) ==================== */}
      {mode === 'sheet' && (
        <div className="space-y-6">
          {/* Selector de Héroes del Grupo (no-print) */}
          <div className="no-print flex flex-wrap gap-2">
            {heroes.length === 0 ? (
              <p className="text-stone-400 text-sm">Aún no hay héroes creados. Pulsa "Forjar Nuevo Héroe".</p>
            ) : (
              heroes.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHeroId(h.id)}
                  className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
                    activeHero?.id === h.id
                      ? 'bg-amber-600/20 border-amber-400 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span>{h.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                    Nv.{h.level}
                  </span>
                </button>
              ))
            )}
          </div>

          {activeHero && (
            <div className="parchment-sheet rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Encabezado de Hoja */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-amber-900/40 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-900">
                    HeroQuest: Crónicas del Abismo (HQ-D20) · Hoja Oficial de Héroe
                  </div>
                  <h2 className="font-display text-3xl font-black text-stone-950 mt-1">
                    {activeHero.name}
                  </h2>
                  <p className="text-sm font-semibold text-stone-700">
                    {activeHero.raceName} · {activeHero.className}
                    {activeHero.subclass ? ` (${activeHero.subclass.name})` : ''}
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Jugador: <strong>{activeHero.playerName}</strong> · Miniatura: {activeHero.miniature}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-4 py-2 rounded-xl bg-amber-900/15 border-2 border-amber-800/50 text-center">
                    <div className="text-[10px] font-bold uppercase text-amber-900">Nivel</div>
                    <div className="font-display text-2xl font-black text-stone-950 leading-none">
                      {activeHero.level}
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-amber-900/15 border-2 border-amber-800/50 text-center">
                    <div className="text-[10px] font-bold uppercase text-amber-900">XP</div>
                    <div className="font-bold text-base text-stone-950">
                      {activeHero.xp}{nextLevelInfo ? ` / ${nextLevelInfo.xp}` : ' (MÁX)'}
                    </div>
                  </div>

                  <div className="no-print flex flex-col gap-1">
                    {activeHero.level < 10 && (
                      <button
                        onClick={levelUpHero}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> Subir Nivel
                      </button>
                    )}
                    <button
                      onClick={() => deleteHero(activeHero.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-800/90 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>

              {/* Estadísticas de Combate HQ + D20 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="p-3 rounded-xl bg-red-900/10 border border-red-900/40">
                  <div className="text-[11px] font-bold uppercase text-red-900 flex items-center justify-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> Puntos Cuerpo
                  </div>
                  <div className="text-2xl font-black text-red-950 mt-1">{activeHero.maxPC} PC</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-900/10 border border-cyan-900/40">
                  <div className="text-[11px] font-bold uppercase text-cyan-900 flex items-center justify-center gap-1">
                    <Brain className="w-3.5 h-3.5" /> Puntos Mente
                  </div>
                  <div className="text-2xl font-black text-cyan-950 mt-1">{activeHero.maxPM} PM</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-900/10 border border-amber-900/40">
                  <div className="text-[11px] font-bold uppercase text-amber-900 flex items-center justify-center gap-1">
                    <Swords className="w-3.5 h-3.5" /> Ataque Base
                  </div>
                  <div className="text-2xl font-black text-stone-950 mt-1">{activeHero.attackDice} DC</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-900/10 border border-amber-900/40">
                  <div className="text-[11px] font-bold uppercase text-amber-900 flex items-center justify-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Defensa Base
                  </div>
                  <div className="text-2xl font-black text-stone-950 mt-1">{activeHero.defendDice} DC</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-900/10 border border-stone-700/40">
                  <div className="text-[11px] font-bold uppercase text-stone-800">Mov / Init</div>
                  <div className="text-xl font-black text-stone-950 mt-1">
                    {activeHero.speed} cas · {formatMod(activeHero.initMod)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-600/20 border border-amber-800/50">
                  <div className="text-[11px] font-bold uppercase text-amber-950 flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> Oro / Insp.
                  </div>
                  <div className="text-xl font-black text-stone-950 mt-1">
                    {activeHero.gold} MO
                  </div>
                </div>
              </div>

              {/* Atributos + Competencias */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {ATTRIBUTES.map((a) => {
                      const val = activeHero.attributes?.[a.id] ?? 10;
                      const mod = getModifier(val);
                      return (
                        <div key={a.id} className="p-2.5 rounded-xl bg-white/60 border border-amber-900/30 text-center">
                          <div className="text-[10px] font-bold uppercase text-amber-900">{a.short}</div>
                          <div className="text-xl font-black text-stone-950">{formatMod(mod)}</div>
                          <div className="text-xs font-semibold text-stone-600">({val})</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-xl bg-white/60 border border-amber-900/30">
                    <h4 className="font-display font-bold text-sm uppercase text-amber-950 mb-2">
                      Competencias (Bono +{activeHero.profBonus ?? 2})
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {SKILLS.map((sk) => {
                        const prof = (activeHero.proficientSkills || []).includes(sk.id);
                        const bonus = getModifier(activeHero.attributes?.[sk.attr] ?? 10) + (prof ? (activeHero.profBonus ?? 2) : 0);
                        return (
                          <div key={sk.id} className="flex items-center justify-between px-2 py-1 rounded bg-amber-900/5">
                            <span className={prof ? 'font-bold text-stone-950' : 'text-stone-600'}>
                              {prof ? '● ' : '○ '}
                              {sk.name}
                            </span>
                            <span className="font-bold text-amber-950">{formatMod(bonus)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Rasgos, Habilidades, Inventario */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 rounded-xl bg-white/60 border border-amber-900/30 space-y-2 text-xs">
                    <h4 className="font-display font-bold text-sm uppercase text-amber-950">
                      Rasgos, Poderes y Personalidad
                    </h4>
                    <p><strong>Recurso:</strong> {activeHero.resourceName}</p>
                    <p><strong>Habilidad de Clase:</strong> {activeHero.coreAbility}</p>
                    <p><strong>Rasgo Racial:</strong> {activeHero.raceTrait}</p>
                    {activeHero.subclass && (
                      <p><strong>Subclase ({activeHero.subclass.name}):</strong> {activeHero.subclass.desc}</p>
                    )}
                    {activeHero.professionName && (
                      <p><strong>Profesión:</strong> {activeHero.professionName}</p>
                    )}
                    {activeHero.quirk && (
                      <p>
                        <strong>{activeHero.quirk.icon} Rasgo ({activeHero.quirk.name}):</strong>{' '}
                        <span className="text-emerald-900">+ {activeHero.quirk.bonus}</span> ·{' '}
                        <span className="text-red-900">- {activeHero.quirk.drawback}</span>
                      </p>
                    )}
                  </div>

                  {/* Inventario con Espacios y Oro */}
                  <div className="p-4 rounded-xl bg-white/60 border border-amber-900/30 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-display font-bold text-sm uppercase text-amber-950">
                        Inventario ({(activeHero.inventory || []).length}/10 Espacios)
                      </h4>
                      <div className="no-print flex items-center gap-1.5">
                        <button
                          onClick={() => updateActiveHero((h) => ({ ...h, gold: Math.max(0, h.gold - 50) }))}
                          className="px-2 py-0.5 rounded bg-amber-900/20 text-xs font-bold cursor-pointer"
                        >
                          -50 MO
                        </button>
                        <button
                          onClick={() => updateActiveHero((h) => ({ ...h, gold: h.gold + 50 }))}
                          className="px-2 py-0.5 rounded bg-amber-900/20 text-xs font-bold cursor-pointer"
                        >
                          +50 MO
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(activeHero.inventory || []).map((it) => {
                        const rMeta = getRarityMeta(it.rarity || 'comun');
                        return (
                          <div
                            key={it.id}
                            className={`px-2.5 py-1 rounded-lg bg-white/80 border-2 ${rMeta.border} text-xs font-semibold text-stone-900 flex items-center gap-1.5`}
                            title={`${rMeta.name}${it.special ? ` · ${it.special}` : ''}${it.flaw ? ` · Desventaja: ${it.flaw}` : ''}`}
                          >
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${rMeta.badge}`}>
                              {rMeta.name}
                            </span>
                            <span>{it.name} {it.dice ? `(${it.dice})` : ''}</span>
                            <button
                              onClick={() => removeItemFromHero(it.id)}
                              className="no-print text-red-700 hover:text-red-900 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Forja Digital de Botín por 6 Rarezas (Solo DM → Celular del Héroe) */}
                    <div className="no-print pt-3 mt-2 border-t border-amber-900/25 space-y-3">
                      <div className="text-[11px] font-bold uppercase text-amber-950 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-amber-800" /> Enviar Armas, Armaduras, Artefactos y Accesorios (6 Rarezas)
                      </div>

                      {/* Filtro de rareza + Catálogo Digital */}
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => setLootRarityFilter('all')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            lootRarityFilter === 'all' ? 'bg-stone-900 text-amber-300' : 'bg-amber-900/15 text-stone-800'
                          }`}
                        >
                          Todas
                        </button>
                        {RARITIES.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              setLootRarityFilter(r.id);
                              const first = DIGITAL_LOOT_CATALOG.find((x) => x.rarity === r.id);
                              if (first) setSelectedLootId(first.id);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              lootRarityFilter === r.id ? r.badge : 'bg-amber-900/15 text-stone-800'
                            }`}
                          >
                            {r.name}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-1.5">
                        <select
                          value={selectedLootId}
                          onChange={(e) => setSelectedLootId(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-amber-900/40 text-xs text-stone-900"
                        >
                          {DIGITAL_LOOT_CATALOG.filter(
                            (x) => lootRarityFilter === 'all' || x.rarity === lootRarityFilter
                          ).map((eq) => (
                            <option key={eq.id} value={eq.id}>
                              [{getRarityMeta(eq.rarity).name.toUpperCase()} · {eq.type}] {eq.name} ({eq.dice})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={sendCatalogLootToHero}
                          className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" /> Enviar
                        </button>
                      </div>

                      {/* Generador Procedural Infinito de Botín con Mejoras y Desventajas */}
                      <div className="p-2.5 rounded-xl bg-amber-950/10 border border-amber-900/30 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-stone-900">♾️ Forjar Botín Procedural:</span>
                          <select
                            value={procRarity}
                            onChange={(e) => setProcRarity(e.target.value)}
                            className="px-2 py-1 rounded bg-white border border-amber-900/40 text-xs text-stone-900"
                          >
                            <option value="auto">Auto según Nivel ({activeHero.level})</option>
                            {RARITIES.map((r) => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setProcPreview(generateProceduralLoot(procRarity, activeHero.level))}
                            className="px-3 py-1 rounded-lg bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Generar Objeto Único
                          </button>
                        </div>

                        {procPreview && (
                          <div className={`p-2.5 rounded-lg bg-white border-2 ${getRarityMeta(procPreview.rarity).border} text-xs space-y-1`}>
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase mr-1.5 ${getRarityMeta(procPreview.rarity).badge}`}>
                                  {getRarityMeta(procPreview.rarity).name}
                                </span>
                                <strong className="text-stone-950">{procPreview.name} ({procPreview.dice})</strong>
                                <span className="text-stone-600 ml-1">[{procPreview.type} · {procPreview.restriction}]</span>
                              </div>
                              <button
                                onClick={() => {
                                  sendLootObjectToHero(procPreview);
                                  setProcPreview(null);
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer shrink-0"
                              >
                                🎁 Enviar a {activeHero.name}
                              </button>
                            </div>
                            <div className="text-emerald-900"><strong>✨ Mejora:</strong> {procPreview.upgrade}</div>
                            {procPreview.flaw && (
                              <div className="text-red-800"><strong>⚠️ Desventaja:</strong> {procPreview.flaw}</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Tesoro / Reliquia 100% Personalizada */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-bold uppercase text-stone-700">
                          O crea un objeto personalizado a mano:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          <input
                            type="text"
                            placeholder="Nombre (ej. Daga Lunar)"
                            value={customItemName}
                            onChange={(e) => setCustomItemName(e.target.value)}
                            className="px-2 py-1.5 rounded-lg bg-white border border-amber-900/40 text-xs text-stone-900"
                          />
                          <select
                            value={customItemRarity}
                            onChange={(e) => setCustomItemRarity(e.target.value)}
                            className="px-2 py-1.5 rounded-lg bg-white border border-amber-900/40 text-xs text-stone-900"
                          >
                            {RARITIES.map((r) => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                          <select
                            value={customItemType}
                            onChange={(e) => setCustomItemType(e.target.value)}
                            className="px-2 py-1.5 rounded-lg bg-white border border-amber-900/40 text-xs text-stone-900"
                          >
                            {['Arma', 'Armadura', 'Artefacto', 'Accesorio', 'Poción', 'Pergamino'].map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Dados (ej. 3 DC)"
                            value={customItemDice}
                            onChange={(e) => setCustomItemDice(e.target.value)}
                            className="px-2 py-1.5 rounded-lg bg-white border border-amber-900/40 text-xs text-stone-900"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5">
                          <input
                            type="text"
                            placeholder="Efecto / Mejora especial..."
                            value={customItemSpecial}
                            onChange={(e) => setCustomItemSpecial(e.target.value)}
                            className="sm:col-span-6 px-2 py-1.5 rounded-lg bg-white border border-amber-900/40 text-xs text-stone-900"
                          />
                          <input
                            type="text"
                            placeholder="Desventaja opcional (balance)..."
                            value={customItemFlaw}
                            onChange={(e) => setCustomItemFlaw(e.target.value)}
                            className="sm:col-span-4 px-2 py-1.5 rounded-lg bg-white border border-red-900/30 text-xs text-stone-900"
                          />
                          <button
                            onClick={sendCustomItemToHero}
                            className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                          >
                            🎁 Enviar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referencia rápida de Hechizos si es lanzador */}
              {['mago', 'explorador', 'bardo', 'brujo'].includes(activeHero.classId) && (
                <div className="p-4 rounded-xl bg-white/60 border border-amber-900/30">
                  <h4 className="font-display font-bold text-sm uppercase text-amber-950 mb-2">
                    Grimorio Sugerido de {activeHero.className}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {SPELLS_CATALOG.filter((sp) =>
                      activeHero.classId === 'bardo'
                        ? sp.school === 'Espíritu'
                        : activeHero.classId === 'brujo'
                        ? sp.school === 'Sombras'
                        : ['Fuego', 'Agua', 'Tierra', 'Aire'].includes(sp.school)
                    )
                      .slice(0, 6)
                      .map((sp) => (
                        <div key={sp.id} className="p-2 rounded bg-amber-900/5 border border-amber-900/20">
                          <div className="font-bold text-stone-950">
                            [{sp.school}] {sp.name}
                          </div>
                          <div className="text-[11px] text-stone-700 mt-0.5">{sp.desc}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
