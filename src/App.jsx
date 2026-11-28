import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Layers,
  Skull,
  Map,
  Users,
  Dices,
  BookOpen,
  Download,
  Upload,
  Flame,
  Compass,
  Minus,
  Plus,
  Building2,
  X,
  AlertTriangle,
  RotateCcw,
  QrCode,
  Smartphone,
  MessageSquarePlus,
  Crown,
  ScrollText,
} from 'lucide-react';
import DecksPanel from './components/DecksPanel';
import BestiaryPanel from './components/BestiaryPanel';
import QuestsPanel from './components/QuestsPanel';
import CharacterForge from './components/CharacterForge';
import DiceRoller from './components/DiceRoller';
import GrimoirePanel from './components/GrimoirePanel';
import TacticalBoard from './components/TacticalBoard';
import ClassicOfficialBoard from './components/ClassicOfficialBoard';
import FetenQuestHub from './components/FetenQuestHub';
import CityHubPanel from './components/CityHubPanel';
import PlayerMobileView from './components/PlayerMobileView';
import ActionResolverBanner from './components/ActionResolverBanner';
import TravelModal from './components/TravelModal';
import FeedbackModal from './components/FeedbackModal';
import { getMaterialById } from './data/craftingSystem';
import { generateProceduralQuest } from './data/proceduralEngine';
import { CITY_MODES } from './data/citySystem';
import { rollChaosCrisis } from './data/chaosSystem';

const STORAGE_KEY = 'hq_cronicas_abismo_v1';

// Error Boundary global: evita pantallas negras y permite recuperarse con 1 clic
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Error inesperado de renderizado' };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f141e] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full grimoire-panel rounded-2xl p-6 border-red-500/50 space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="font-display text-xl font-bold text-amber-200">
              Algo salió mal en esta vista
            </h2>
            <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-700">
              {this.state.errorMsg}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, errorMsg: '' });
                this.props.onRecover?.();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Recuperar Pantalla
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const NAV_GROUPS = [
  {
    group: 'En Partida (HQ-D20 v6)',
    items: [
      { id: 'board', label: 'Tablero 2D', subtitle: 'Plano táctico, salas y contadores', icon: Compass },
      { id: 'decks', label: 'Mazos DM', subtitle: 'Zargon, eventos, muebles y pistas', icon: Layers },
      { id: 'bestiary', label: 'Bestiario', subtitle: 'Escalado, plantillas y amenaza', icon: Skull },
    ],
  },
  {
    group: 'Juego Original (Sin Mods)',
    items: [
      { id: 'classic_board', label: 'HQ Clásico Oficial', subtitle: 'Juego Base + Luna del Terror (100% Oficial)', icon: Crown },
      { id: 'fetenquest', label: 'FetenQuest 4.1', subtitle: '25 Héroes, Reglas, Ciudad y Pantalla DM', icon: ScrollText },
    ],
  },
  {
    group: 'Campaña Viva',
    items: [
      { id: 'city', label: 'Ciudad y Crafteo', subtitle: 'Distritos, forja, alquimia y banco', icon: Building2 },
      { id: 'quests', label: 'Misiones y Arcos', subtitle: 'Arquitecto procedural y oficiales', icon: Map },
      { id: 'heroes', label: 'Héroes', subtitle: 'Forja y hojas sincronizadas', icon: Users },
    ],
  },
  {
    group: 'Referencia',
    items: [
      { id: 'grimoire', label: 'Reglas y Glosario', subtitle: 'Manual completo HQ-D20 v2', icon: BookOpen },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export default function App() {
  const playerParam =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('player')
      : null;

  if (playerParam) {
    return (
      <AppErrorBoundary onRecover={() => window.location.reload()}>
        <PlayerMobileView initialPlayerParam={playerParam} />
      </AppErrorBoundary>
    );
  }

  const saved = loadState();
  const [activeTab, setActiveTab] = useState('board');
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [qrMode, setQrMode] = useState('tunnel'); // 'tunnel' (Cloudflare por defecto) | 'local'
  const [networkInfo, setNetworkInfo] = useState({
    localUrl: '',
    publicTunnelUrl: '',
    interfaces: [],
    isPublicTunnel: false,
    tunnelStatus: 'starting',
  });
  const [selectedInterfaceUrl, setSelectedInterfaceUrl] = useState('');
  const [connectQrImg, setConnectQrImg] = useState('');
  const [qrCopied, setQrCopied] = useState(false);

  const [heroes, setHeroes] = useState(saved?.heroes || []);
  const [completedQuests, setCompletedQuests] = useState(saved?.completedQuests || []);
  const [partyLevel, setPartyLevel] = useState(saved?.partyLevel || 1);
  const [partySize, setPartySize] = useState(saved?.partySize || 4);
  const [chaosClock, setChaosClock] = useState(saved?.chaosClock || 0);

  const [fame, setFame] = useState(saved?.fame ?? 1);
  const [reputation, setReputation] = useState(saved?.reputation ?? 1);
  const [cityMode, setCityMode] = useState(saved?.cityMode || 'relaxed');
  const [cityOpenToPhones, setCityOpenToPhones] = useState(false);
  const [travelModalOpen, setTravelModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [chaosCrisisModal, setChaosCrisisModal] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    fetch('/api/creator-status', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { isCreator: false }))
      .then((d) => setIsCreator(!!d.isCreator))
      .catch(() => setIsCreator(false));
  }, []);

  const handleApplyTravelOutcome = (outcome, targetHeroId = 'ALL') => {
    if (!outcome || heroes.length === 0) return;
    handleDispatchHeroEvent(targetHeroId || 'ALL', {
      kind: 'travel',
      icon: outcome.icon || '🧭',
      title: outcome.title || 'Evento de Viaje',
      badge: outcome.badge || 'Viajes: El Viejo Mundo',
      narrative: outcome.text || '',
      goldDelta: outcome.goldPerHero || outcome.goldDelta || 0,
      pcDelta: outcome.pcDelta || 0,
      pmDelta: outcome.pmDelta || 0,
      fameDelta: outcome.fameDelta || 0,
      repDelta: outcome.repDelta || 0,
      items: outcome.item ? [outcome.item] : outcome.items || [],
      materials: outcome.materialId ? [{ id: outcome.materialId, qty: outcome.materialQty || 1 }] : [],
      statusAdded: outcome.statusAdded || null,
    });
  };

  const handleArriveCityFromTravel = async () => {
    setTravelModalOpen(false);
    setCityOpenToPhones(true);
    try {
      await fetch('/api/city-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityOpen: true, cityMode }),
      });
    } catch {
      // ignore
    }
    setActiveTab('city');
    showToast('🏛️ ¡Llegaron a la Ciudad! Pestaña Ciudad habilitada en todos los celulares.');
  };

  const toggleCityForPhones = async () => {
    const next = !cityOpenToPhones;
    setCityOpenToPhones(next);
    try {
      await fetch('/api/city-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityOpen: next, cityMode }),
      });
    } catch {
      // ignore
    }
    showToast(
      next
        ? '🏛️ ¡Ciudad ABIERTA en los celulares! Cada jugador ya ve la pestaña Ciudad para hacer sus compras y forjas.'
        : '🚪 Ciudad cerrada en los celulares (modo mazmorra activo).'
    );
  };
  const [proceduralQuests, setProceduralQuests] = useState(saved?.proceduralQuests || []);
  const [activeArcs, setActiveArcs] = useState(saved?.activeArcs || []);
  const [nemeses, setNemeses] = useState(saved?.nemeses || []);
  const [activeProceduralMap, setActiveProceduralMap] = useState(null);
  const [activeOfficialMapRequest, setActiveOfficialMapRequest] = useState(null);
  const [activeMissionContext, setActiveMissionContext] = useState({
    title: 'La Prueba (El Despertar de los Héroes)',
    biomeId: 'catacumbas',
    bossName: 'Verag, Gárgola de Obsidiana',
    wanderingMonster: 'Orco',
  });
  const [zargonCounters, setZargonCounters] = useState(
    saved?.zargonCounters || { trampa: 2, emboscada: 2, patrulla: 2, destino: 1, escape: 1 }
  );

  const [toast, setToast] = useState(null);
  const lastSyncRef = React.useRef(0);

  // Consultar red local y túnel público mientras el Modal "Conectar" esté abierto
  useEffect(() => {
    if (!connectModalOpen) return;
    let cancelled = false;
    const refreshNet = async () => {
      try {
        const res = await fetch('/api/network-info', { cache: 'no-store' });
        const info = res.ok
          ? await res.json()
          : { localUrl: window.location.origin, interfaces: [], isPublicTunnel: false, tunnelStatus: 'local' };
        if (cancelled) return;
        setNetworkInfo(info);
        if (!selectedInterfaceUrl && info.localUrl) setSelectedInterfaceUrl(info.localUrl);
      } catch {
        // ignore
      }
    };
    refreshNet();
    const timer = setInterval(refreshNet, 3000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [connectModalOpen]);

  const connectBaseUrl =
    qrMode === 'tunnel'
      ? networkInfo.publicTunnelUrl || ''
      : selectedInterfaceUrl || networkInfo.localUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const connectLink = connectBaseUrl ? `${connectBaseUrl}/?player=lobby` : '';

  useEffect(() => {
    if (!connectModalOpen) return;
    if (!connectLink) {
      setConnectQrImg('');
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(connectLink, { width: 280, margin: 2, errorCorrectionLevel: 'M' })
      .then((img) => {
        if (!cancelled) setConnectQrImg(img);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [connectModalOpen, connectLink]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/heroes', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.heroes?.length > 0) {
          lastSyncRef.current = data.version || 1;
          setHeroes(data.heroes);
        } else if (heroes.length > 0) {
          await fetch('/api/heroes/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ heroes }),
          });
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/heroes', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.version && data.version > lastSyncRef.current && Array.isArray(data.heroes)) {
          lastSyncRef.current = data.version;
          setHeroes(data.heroes);
        }
      } catch {
        // ignore
      }
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const updateHeroesSynced = (updater) => {
    setHeroes((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      fetch('/api/heroes/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroes: next }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.version) lastSyncRef.current = d.version;
        })
        .catch(() => {});
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          heroes,
          completedQuests,
          partyLevel,
          partySize,
          chaosClock,
          fame,
          reputation,
          cityMode,
          proceduralQuests: proceduralQuests.slice(0, 12),
          activeArcs: activeArcs.slice(0, 6),
          nemeses,
          zargonCounters,
        })
      );
    } catch {
      // ignore
    }
  }, [
    heroes,
    completedQuests,
    partyLevel,
    partySize,
    chaosClock,
    fame,
    reputation,
    cityMode,
    proceduralQuests,
    activeArcs,
    nemeses,
    zargonCounters,
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3400);
  };

  const handleAwardXP = (totalXP) => {
    if (heroes.length === 0) {
      showToast('Crea al menos un héroe en "Héroes y QR" para repartir XP.');
      return;
    }
    const perHero = Math.round(totalXP / heroes.length);
    updateHeroesSynced((prev) => prev.map((h) => ({ ...h, xp: (h.xp || 0) + perHero })));
    showToast(`✨ +${perHero} XP repartidos a cada héroe (${totalXP} XP total).`);
  };

  const handleAwardQuestRewards = (quest) => {
    if (heroes.length === 0) {
      showToast('Crea al menos un héroe para otorgar recompensas.');
      return;
    }
    const modeCfg = CITY_MODES[cityMode] || CITY_MODES.relaxed;
    const goldMult = modeCfg.goldMultiplier || 1;
    const xpMult = modeCfg.xpMultiplier || 1;
    // Economía reequilibrada: oro total repartido entre héroes con bono de Supervivencia si aplica
    const baseTotalGold = Math.round((quest.rewards?.gold || 100) * goldMult);
    const goldPerHero = Math.max(15, Math.round(baseTotalGold / heroes.length));
    const xpGain = Math.round((quest.rewards?.xp || 160) * xpMult);
    const repGain = quest.rewards?.reputation || quest.rewards?.fame || 1;
    updateHeroesSynced((prev) =>
      prev.map((h) => ({
        ...h,
        xp: (h.xp || 0) + xpGain,
        gold: (h.gold || 0) + goldPerHero,
        reputation: (h.reputation || 0) + repGain,
      }))
    );
    if (!completedQuests.includes(quest.id)) {
      setCompletedQuests((prev) => [...prev, quest.id]);
    }
    setFame((f) => f + repGain);
    setReputation((r) => r + repGain);
    showToast(
      `🏆 Misión completada${cityMode === 'survival' ? ' (🔥 Supervivencia)' : ''}: +${xpGain} XP, +${goldPerHero} MO y +${repGain} 🏅 Reputación a cada héroe.`
    );
  };

  // ==================== DESPACHO ATÓMICO DM -> CELULAR (Botín, Tesoros, Eventos, Viajes, Trampas) ====================
  const handleDispatchHeroEvent = (targetHeroIdOrAll, payload = {}) => {
    if (!payload) return;
    const isAll = !targetHeroIdOrAll || targetHeroIdOrAll === 'ALL';
    const uid = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const normalizedItems = (payload.items || []).filter(Boolean).map((it, idx) => ({
      ...it,
      id: it.id || `loot-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
      equipped: false,
      qty: it.qty || 1,
    }));
    const normalizedMats = (payload.materials || [])
      .filter((m) => m && m.id && (m.qty || 1) > 0)
      .map((m) => {
        const info = getMaterialById(m.id);
        return { id: m.id, qty: m.qty || 1, name: m.name || info.name, icon: m.icon || info.icon };
      });

    const inboxEntry = {
      uid,
      ts: Date.now(),
      kind: payload.kind || 'event',
      icon: payload.icon || '✨',
      title: payload.title || 'Notificación del Director de Juego',
      badge: payload.badge || '',
      narrative: payload.narrative || '',
      goldDelta: Number(payload.goldDelta || 0),
      pcDelta: Number(payload.pcDelta || 0),
      pmDelta: Number(payload.pmDelta || 0),
      xpDelta: Number(payload.xpDelta || 0),
      fameDelta: Number(payload.fameDelta || 0),
      repDelta: Number(payload.repDelta || 0),
      items: normalizedItems,
      materials: normalizedMats,
      statusAdded: payload.statusAdded || null,
    };

    updateHeroesSynced((prev) =>
      prev.map((h) => {
        if (!isAll && h.id !== targetHeroIdOrAll) return h;
        const nextMats = { ...(h.materials || {}) };
        normalizedMats.forEach((m) => {
          nextMats[m.id] = Number(nextMats[m.id] || 0) + m.qty;
        });
        const nextInv =
          normalizedItems.length > 0
            ? [...(h.inventory || []), ...normalizedItems]
            : h.inventory || [];
        const nextEffects = payload.statusAdded
          ? [
              ...(h.activeEffects || []).filter((e) => e.id !== payload.statusAdded.id),
              payload.statusAdded,
            ]
          : h.activeEffects || [];
        const nextInbox = [inboxEntry, ...(h.inbox || [])].slice(0, 20);
        return {
          ...h,
          gold: Math.max(0, (h.gold || 0) + inboxEntry.goldDelta),
          currentPC: Math.max(
            0,
            Math.min(h.maxPC, (h.currentPC ?? h.maxPC) + inboxEntry.pcDelta)
          ),
          currentPM: Math.max(
            0,
            Math.min(h.maxPM, (h.currentPM ?? h.maxPM) + inboxEntry.pmDelta)
          ),
          xp: (h.xp || 0) + inboxEntry.xpDelta,
          fame: (h.fame || 0) + inboxEntry.fameDelta,
          reputation: (h.reputation || 0) + inboxEntry.repDelta,
          inventory: nextInv,
          materials: nextMats,
          activeEffects: nextEffects,
          inbox: nextInbox,
        };
      })
    );

    if (inboxEntry.fameDelta) setFame((f) => f + inboxEntry.fameDelta);
    if (inboxEntry.repDelta) setReputation((r) => r + inboxEntry.repDelta);

    const targetLabel = isAll
      ? 'todo el grupo'
      : heroes.find((h) => h.id === targetHeroIdOrAll)?.name || 'el héroe';
    showToast(`📲 Enviado a ${targetLabel}: ${inboxEntry.icon} ${inboxEntry.title}`);
  };

  const handleSendLootToHero = (heroId, lootObj, goldAmount = 0, meta = {}) => {
    handleDispatchHeroEvent(heroId, {
      kind: meta.kind || 'loot',
      icon: meta.icon || (lootObj ? '🎁' : '💰'),
      title: meta.title || (lootObj ? lootObj.name : `+${goldAmount} Monedas de Oro`),
      badge: meta.badge || (lootObj?.rarity ? `Botín · ${lootObj.rarity}` : 'Tesoro recibido'),
      narrative: meta.narrative || lootObj?.notes || lootObj?.effect || 'El Director de Juego te entregó este botín en la mazmorra.',
      goldDelta: goldAmount || 0,
      items: lootObj ? [lootObj] : [],
    });
  };

  const handleSendMaterialToHero = (heroId, materialId, qty = 1, meta = {}) => {
    const mat = getMaterialById(materialId);
    handleDispatchHeroEvent(heroId, {
      kind: meta.kind || 'loot',
      icon: mat.icon || '🎒',
      title: meta.title || `${qty}× ${mat.name}`,
      badge: meta.badge || 'Material de Forja / Alquimia',
      narrative: meta.narrative || `Has recogido ${qty}× ${mat.name} para usar en la Herrería o Alquimista de La Ciudad.`,
      materials: [{ id: materialId, qty }],
    });
  };

  const handleLaunchProceduralQuest = (questObj) => {
    if (!questObj?.mapData) return;
    const safeQuest = {
      ...questObj,
      mapData: {
        ...questObj.mapData,
        notes: Array.isArray(questObj.mapData.notes) ? questObj.mapData.notes : [],
      },
    };
    setProceduralQuests((prev) => {
      const exists = prev.some((q) => q.id === safeQuest.id);
      return exists ? prev : [safeQuest, ...prev].slice(0, 12);
    });
    if (safeQuest.zargonCounters) {
      setZargonCounters(safeQuest.zargonCounters);
    }
    setActiveProceduralMap(safeQuest);
    setActiveMissionContext({
      title: safeQuest.title,
      biomeId: safeQuest.biome?.id || safeQuest.mapData?.biomeId || 'catacumbas',
      bossName: safeQuest.bossName || safeQuest.mapData?.bossName || '',
      wanderingMonster: safeQuest.mapData?.wanderingMonster || safeQuest.biome?.wandering || 'Orco',
    });
    setActiveTab('board');
    showToast(`🗺️ Misión "${safeQuest.title}" cargada en el Tablero Táctico 2D.`);
  };

  const handleLaunchOfficialQuest = (quest) => {
    if (!quest) return;
    if (quest.officialMapId) {
      if (quest.zargonCounters) setZargonCounters(quest.zargonCounters);
      setActiveProceduralMap(null);
      setActiveOfficialMapRequest({ mapId: quest.officialMapId, ts: Date.now() });
      setActiveMissionContext({
        title: `Misión ${quest.number}: ${quest.title}`,
        biomeId: quest.biomeId || 'catacumbas',
        bossName: quest.boss || '',
        wanderingMonster: quest.wanderingMonster || 'Orco',
      });
      setActiveTab('board');
      showToast(`🗺️ Mapa oficial de "${quest.title}" cargado en el Tablero 2D.`);
      return;
    }

    // Para las 12 misiones oficiales sin plano fijo, genera un plano 26×19 temático a medida
    const generated = generateProceduralQuest({
      mode: 'oneshot',
      biomeId: quest.biomeId || 'catacumbas',
      plotId: quest.plotId || 'exploracion',
      partyLevel: quest.recLevel || partyLevel,
      partySize,
    });
    const tailoredQuest = {
      ...generated,
      id: `official_gen_${quest.id}_${Date.now()}`,
      title: `Misión ${quest.number}: ${quest.title}`,
      bossName: quest.boss,
      bossPhase2: quest.bossPhase2 || generated.bossPhase2,
      twist: quest.hqD20Twist,
      zargonCounters: quest.zargonCounters || generated.zargonCounters,
      rewards: quest.rewards || generated.rewards,
      mapData: {
        ...generated.mapData,
        id: `map_off_${quest.id}_${Date.now()}`,
        title: `Misión ${quest.number}: ${quest.title} (Plano 26×19 Temático)`,
        wanderingMonster: quest.wanderingMonster || generated.mapData.wanderingMonster,
        notes: Array.isArray(generated.mapData?.notes) ? generated.mapData.notes : [],
      },
    };
    handleLaunchProceduralQuest(tailoredQuest);
  };

  const handleRegisterNemesis = (name, biomeName) => {
    if (!name) return;
    const clean = name.replace(/\s*\(Némesis.*\)/i, '').trim();
    setNemeses((prev) => {
      const existing = prev.find((n) => n.name.toLowerCase() === clean.toLowerCase());
      if (existing) {
        return prev.map((n) =>
          n.id === existing.id
            ? { ...n, rank: (n.rank || 1) + 1, defeated: false, lastSeen: biomeName }
            : n
        );
      }
      return [
        {
          id: `nem-${Date.now()}`,
          name: clean,
          rank: 1,
          lastSeen: biomeName || 'Mazmorra',
          defeated: false,
        },
        ...prev,
      ];
    });
    showToast(`💀 ¡${clean} escapó y ahora es un Némesis recurrente de la campaña!`);
  };

  const handleApplySupportToHero = (targetHeroId, { healPC = 0, healPM = 0 }) => {
    const target = heroes.find((h) => h.id === targetHeroId);
    if (!target) return;
    updateHeroesSynced((prev) =>
      prev.map((h) => {
        if (h.id !== targetHeroId) return h;
        return {
          ...h,
          currentPC: Math.min(h.maxPC, (h.currentPC ?? h.maxPC) + (healPC || 0)),
          currentPM: Math.min(h.maxPM, (h.currentPM ?? h.maxPM) + (healPM || 0)),
        };
      })
    );
    const parts = [];
    if (healPC) parts.push(`+${healPC} PC`);
    if (healPM) parts.push(`+${healPM} PM`);
    showToast(`💚 Aplicado a ${target.name}: ${parts.join(' y ')}`);
  };

  const handleToggleQuest = (questId) => {
    setCompletedQuests((prev) =>
      prev.includes(questId) ? prev.filter((id) => id !== questId) : [...prev, questId]
    );
  };

  const exportBackup = () => {
    const data = JSON.stringify(
      {
        heroes,
        completedQuests,
        partyLevel,
        partySize,
        chaosClock,
        fame,
        reputation,
        cityMode,
        proceduralQuests,
        activeArcs,
        nemeses,
        zargonCounters,
      },
      null,
      2
    );
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heroquest-cronicas-campana.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Copia de seguridad de la campaña descargada.');
  };

  const importBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.heroes) updateHeroesSynced(parsed.heroes);
        if (parsed.completedQuests) setCompletedQuests(parsed.completedQuests);
        if (parsed.partyLevel) setPartyLevel(parsed.partyLevel);
        if (parsed.partySize) setPartySize(parsed.partySize);
        if (typeof parsed.chaosClock === 'number') setChaosClock(parsed.chaosClock);
        if (typeof parsed.fame === 'number') setFame(parsed.fame);
        if (typeof parsed.reputation === 'number') setReputation(parsed.reputation);
        if (parsed.cityMode) setCityMode(parsed.cityMode);
        if (parsed.proceduralQuests) setProceduralQuests(parsed.proceduralQuests);
        if (parsed.activeArcs) setActiveArcs(parsed.activeArcs);
        if (parsed.nemeses) setNemeses(parsed.nemeses);
        if (parsed.zargonCounters) setZargonCounters(parsed.zargonCounters);
        showToast('📜 Campaña restaurada correctamente.');
      } catch {
        showToast('❌ Archivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  const currentNav = ALL_NAV_ITEMS.find((i) => i.id === activeTab) || ALL_NAV_ITEMS[0];

  return (
    <AppErrorBoundary onRecover={() => setActiveTab('quests')}>
      <div className="min-h-screen flex bg-[#0f141e] text-slate-100">
        {/* ==================== SIDEBAR MODERNO (ESCRITORIO) ==================== */}
        <aside className="no-print hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-slate-800/80 bg-[#111827]/90 backdrop-blur-xl sticky top-0 h-screen">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-950/50 border border-amber-300/40 shrink-0">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm font-black text-amber-300 leading-tight truncate">
                CRÓNICAS DEL ABISMO
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Estudio DM · HQ-D20 v6
              </div>
            </div>
          </div>

          {/* Grupos de Navegación */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
            {NAV_GROUPS.map((grp) => (
              <div key={grp.group} className="space-y-1.5">
                <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  {grp.group}
                </div>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-3 transition cursor-pointer border ${
                        active
                          ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/5 border-amber-400/50 text-amber-200 shadow-sm'
                          : 'bg-transparent border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Pie del Sidebar: Estado Limpio de Sesión DM (Sin Nivel/Fama/Rep de aventureros) */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold px-1">
              <span>🛡️ {heroes.length} Héroes</span>
              <span className="text-sky-300">🗺️ {completedQuests.length} Misiones</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Modo:</span>
              <span className={cityMode === 'survival' ? 'font-bold text-rose-300' : 'font-bold text-emerald-300'}>
                {cityMode === 'survival' ? '🔥 Supervivencia' : '🛡️ Relajado'}
              </span>
            </div>
          </div>
        </aside>

        {/* ==================== ÁREA PRINCIPAL DERECHA ==================== */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar Limpia y Ordenada */}
          <header className="no-print sticky top-0 z-30 backdrop-blur-xl bg-[#0f141e]/90 border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-base sm:text-lg font-black text-white leading-tight flex items-center gap-2">
                  <currentNav.icon className="w-4 h-4 text-amber-400" />
                  {currentNav.label}
                </h1>
                <p className="text-[11px] text-slate-400">{currentNav.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Reloj del Caos + Crisis del Caos (5/10 y 10/10) */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/40">
                  <span className="font-bold text-purple-200">Caos</span>
                  <button
                    onClick={() => setChaosClock(Math.max(0, chaosClock - 1))}
                    className="p-0.5 hover:text-amber-300 cursor-pointer"
                    title="Bajar Reloj del Caos"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className={`font-black min-w-[32px] text-center ${chaosClock >= 8 ? 'text-rose-400 animate-pulse' : chaosClock >= 5 ? 'text-amber-300' : 'text-purple-200'}`}>
                    {chaosClock}/10
                  </span>
                  <button
                    onClick={() => {
                      const next = Math.min(10, chaosClock + 1);
                      setChaosClock(next);
                      if (next === 5 || next === 10) {
                        setChaosCrisisModal(rollChaosCrisis(next));
                      }
                    }}
                    className="p-0.5 hover:text-rose-400 cursor-pointer"
                    title="Subir Reloj del Caos (dispara Crisis en 5 y 10)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setChaosCrisisModal(rollChaosCrisis(Math.max(5, chaosClock)))}
                    className={`ml-1 px-2 py-0.5 rounded-md font-bold text-[10px] cursor-pointer transition ${
                      chaosClock >= 5
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow'
                        : 'bg-purple-900/80 hover:bg-purple-800 text-purple-200'
                    }`}
                    title="Disparar una Crisis del Caos de la tabla de 10 eventos"
                  >
                    ⚡ Crisis
                  </button>
                </div>

                {/* Botón Toggle: Abrir / Cerrar Ciudad en los Celulares */}
                <button
                  onClick={toggleCityForPhones}
                  className={`px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 cursor-pointer transition border ${
                    cityOpenToPhones
                      ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                  title="Habilita la pestaña Ciudad en el celular de cada jugador para compras y forja individual"
                >
                  <Building2 className="w-4 h-4" />
                  {cityOpenToPhones ? 'Ciudad: ABIERTA' : 'Abrir Ciudad'}
                </button>

                {/* Botón Principal: Conectar Celulares (1 solo QR) */}
                <button
                  onClick={() => setConnectModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold flex items-center gap-1.5 cursor-pointer transition shadow-md"
                >
                  <QrCode className="w-4 h-4" /> Conectar
                </button>

                {/* Botón Rápido de Dados */}
                <button
                  onClick={() => setDiceModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
                >
                  <Dices className="w-4 h-4" /> Dados
                </button>

                {/* Botón de Sugerencias y Reporte de Bugs */}
                <button
                  onClick={() => setFeedbackModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/70 text-amber-200 font-bold flex items-center gap-1.5 cursor-pointer transition"
                  title="Enviar sugerencias, ideas o reportar bugs al creador"
                >
                  <MessageSquarePlus className="w-4 h-4" /> Sugerencias
                </button>

                {/* Backup / Import */}
                <button
                  onClick={exportBackup}
                  className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 text-slate-200 cursor-pointer"
                  title="Exportar Campaña JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
                <label
                  className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 text-slate-200 cursor-pointer"
                  title="Importar Campaña JSON"
                >
                  <Upload className="w-4 h-4" />
                  <input type="file" accept=".json" onChange={importBackup} className="hidden" />
                </label>
              </div>
            </div>

            {/* Navegación Móvil / Tablet (visible solo en < lg) */}
            <nav className="lg:hidden px-4 pb-2.5 flex gap-1.5 overflow-x-auto">
              {ALL_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap border transition cursor-pointer ${
                      active
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </header>

          {/* Modal Único: Conectar Celulares con 1 Solo QR */}
          {connectModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md grimoire-panel rounded-3xl p-6 border-purple-500/60 space-y-4 text-center shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-display text-lg font-black text-amber-200 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-purple-400" /> Conectar Celulares
                  </h3>
                  <button
                    onClick={() => setConnectModalOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Escanea este único QR con cualquier celular para <strong>Crear Personaje</strong> o <strong>Elegir Personaje</strong> existente.
                </p>

                {/* Estado del Túnel Cloudflare */}
                <div className="flex justify-center">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      qrMode === 'tunnel' && networkInfo.isPublicTunnel
                        ? 'bg-emerald-600 text-white'
                        : qrMode === 'local'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-purple-700 text-white animate-pulse'
                    }`}
                  >
                    {qrMode === 'tunnel' && networkInfo.isPublicTunnel
                      ? '🌐 Cloudflare HTTPS Activo (Cualquier celular / Wi-Fi / 4G)'
                      : qrMode === 'local'
                      ? '📶 Modo Wi-Fi Local (Requiere misma red y sin Firewall)'
                      : '⏳ Conectando Túnel Cloudflare HTTPS...'}
                  </span>
                </div>

                {/* Código QR Único */}
                <div className="flex justify-center">
                  {connectQrImg ? (
                    <img
                      src={connectQrImg}
                      alt="Código QR Conectar"
                      className="w-56 h-56 rounded-2xl bg-white p-2.5 shadow-2xl border-4 border-amber-400"
                    />
                  ) : (
                    <div className="w-56 h-56 rounded-2xl bg-slate-950 border-2 border-dashed border-amber-500/60 flex flex-col items-center justify-center p-4 space-y-2">
                      <QrCode className="w-10 h-10 text-amber-400 animate-pulse" />
                      <span className="text-xs text-amber-200 font-bold">
                        Iniciando túnel Cloudflare...
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Tarda de 3 a 5 segundos al abrir el servidor.
                      </span>
                    </div>
                  )}
                </div>

                {/* Selector Simple Cloudflare (Por defecto) vs Wi-Fi Local */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQrMode('tunnel')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition ${
                      qrMode === 'tunnel'
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    🌐 Cloudflare {networkInfo.isPublicTunnel ? '✓' : '(Recomendado)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrMode('local')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition ${
                      qrMode === 'local'
                        ? 'bg-amber-600 border-amber-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    📶 Wi-Fi Local
                  </button>
                </div>

                {qrMode === 'tunnel' && !networkInfo.publicTunnelUrl && (
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200 text-left">
                    <span>Si tarda más de 10s, pulsa Reconectar Cloudflare:</span>
                    <button
                      type="button"
                      onClick={() => fetch('/api/network-info/restart', { method: 'POST' }).catch(() => {})}
                      className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold cursor-pointer shrink-0"
                    >
                      🔄 Reconectar
                    </button>
                  </div>
                )}

                {connectLink && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-sky-300 truncate">
                      {connectLink}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(connectLink);
                        setQrCopied(true);
                        setTimeout(() => setQrCopied(false), 2000);
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer shrink-0"
                    >
                      {qrCopied ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal de Viaje Interactivo de Rol hacia la Ciudad */}
          <TravelModal
            isOpen={travelModalOpen}
            onClose={() => setTravelModalOpen(false)}
            heroes={heroes}
            onApplyTravelOutcome={handleApplyTravelOutcome}
            onArriveCity={handleArriveCityFromTravel}
          />

          {/* Modal Rápido de Dados HQ+D20 */}
          {diceModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto grimoire-panel rounded-2xl p-6 border-amber-400/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
                  <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
                    <Dices className="w-5 h-5" /> Lanzador Rápido HQ + D20
                  </h3>
                  <button
                    onClick={() => setDiceModalOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <DiceRoller />
              </div>
            </div>
          )}

          {/* Toast Flotante */}
          {toast && (
            <div className="no-print fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-amber-400/80 text-amber-100 text-sm font-bold shadow-2xl">
              {toast}
            </div>
          )}

          {/* Notificaciones en Tiempo Real desde Celulares */}
          <ActionResolverBanner
            partyLevel={partyLevel}
            partySize={partySize}
            heroes={heroes}
            onApplySupport={handleApplySupportToHero}
            activeMissionContext={activeMissionContext}
          />

          {/* Contenido Principal Espaciado y Ordenado */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
            {activeTab === 'board' && (
              <TacticalBoard
                partyLevel={partyLevel}
                setPartyLevel={setPartyLevel}
                partySize={4}
                cityMode={cityMode}
                setCityMode={setCityMode}
                chaosClock={chaosClock}
                setChaosClock={setChaosClock}
                onTriggerChaosCrisis={(lvl) => setChaosCrisisModal(rollChaosCrisis(lvl ?? Math.max(5, chaosClock)))}
                onOpenDice={() => setDiceModalOpen(true)}
                onOpenConnect={() => setConnectModalOpen(true)}
                cityOpenToPhones={cityOpenToPhones}
                onToggleCityForPhones={toggleCityForPhones}
                onAwardXP={handleAwardXP}
                onAwardQuestRewards={handleAwardQuestRewards}
                onStartTravelToCity={() => setTravelModalOpen(true)}
                heroes={heroes}
                onSendLootToHero={handleSendLootToHero}
                onSendMaterialToHero={handleSendMaterialToHero}
                onDispatchHeroEvent={handleDispatchHeroEvent}
                proceduralQuests={proceduralQuests}
                activeProceduralQuest={activeProceduralMap}
                activeOfficialMapRequest={activeOfficialMapRequest}
                zargonCounters={zargonCounters}
                setZargonCounters={setZargonCounters}
                onRegisterNemesis={handleRegisterNemesis}
                showToast={showToast}
              />
            )}

            {activeTab === 'classic_board' && (
              <ClassicOfficialBoard showToast={showToast} />
            )}

            {activeTab === 'fetenquest' && (
              <FetenQuestHub showToast={showToast} />
            )}

            {activeTab === 'city' && (
              <CityHubPanel
                heroes={heroes}
                onUpdateHeroes={updateHeroesSynced}
                fame={fame}
                setFame={setFame}
                reputation={reputation}
                setReputation={setReputation}
                cityMode={cityMode}
                setCityMode={setCityMode}
                partyLevel={partyLevel}
                partySize={partySize}
                nemeses={nemeses}
                onLaunchProceduralQuest={handleLaunchProceduralQuest}
                showToast={showToast}
              />
            )}

            {activeTab === 'quests' && (
              <QuestsPanel
                completedQuests={completedQuests}
                onToggleQuest={handleToggleQuest}
                partyLevel={partyLevel}
                partySize={partySize}
                setPartySize={setPartySize}
                onAwardQuestRewards={handleAwardQuestRewards}
                proceduralQuests={proceduralQuests}
                setProceduralQuests={setProceduralQuests}
                activeArcs={activeArcs}
                setActiveArcs={setActiveArcs}
                nemeses={nemeses}
                setNemeses={setNemeses}
                onLaunchProceduralQuest={handleLaunchProceduralQuest}
                onLaunchOfficialQuest={handleLaunchOfficialQuest}
              />
            )}

            {activeTab === 'decks' && (
              <DecksPanel
                onChaosChange={(val) => setChaosClock(val)}
                partyLevel={partyLevel}
                zargonCounters={zargonCounters}
                setZargonCounters={setZargonCounters}
                activeMissionContext={activeMissionContext}
              />
            )}

            {activeTab === 'bestiary' && (
              <BestiaryPanel
                partyLevel={partyLevel}
                setPartyLevel={setPartyLevel}
                partySize={partySize}
                setPartySize={setPartySize}
              />
            )}

            {activeTab === 'heroes' && (
              <CharacterForge heroes={heroes} setHeroes={updateHeroesSynced} />
            )}

            {activeTab === 'grimoire' && <GrimoirePanel />}
          </main>
        </div>
      </div>

      {/* Modal de Crisis del Caos (Tabla de 10 Eventos de Tensión) */}
      {chaosCrisisModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-purple-950/95 via-slate-950 to-slate-950 border-2 border-rose-500/70 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-rose-900/60 pb-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-rose-400">
                  ⚡ Crisis del Caos ({chaosCrisisModal.triggeredAt}/10) · {chaosCrisisModal.badge}
                </div>
                <h3 className="font-display text-xl font-black text-white mt-1 flex items-center gap-2">
                  <span>{chaosCrisisModal.icon}</span>
                  <span>{chaosCrisisModal.title}</span>
                </h3>
              </div>
              <button
                onClick={() => setChaosCrisisModal(null)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border-l-4 border-amber-400">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-300 mb-1">
                📢 Leer en Voz Alta
              </div>
              <p className="text-sm sm:text-[15px] italic text-amber-50 leading-relaxed">
                “{chaosCrisisModal.narrative}”
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-700/60 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase text-rose-300">🔒 Regla para el DM</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-600/30 border border-rose-500/50 text-rose-200 text-[10px] font-black">
                  {chaosCrisisModal.mechanicalTag}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {chaosCrisisModal.dmRule}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setChaosCrisisModal(rollChaosCrisis(chaosCrisisModal.triggeredAt))}
                className="flex-1 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
              >
                🎲 Robar Otra Crisis
              </button>
              <button
                onClick={() => {
                  if (chaosClock >= 10) setChaosClock(0);
                  setChaosCrisisModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                {chaosClock >= 10 ? '✓ Aplicar y Reiniciar Caos a 0' : '✓ Aplicar y Continuar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sugerencias y Reportes de Bugs (con Panel Privado solo para el Creador) */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        isCreator={isCreator}
        showToast={showToast}
      />
    </AppErrorBoundary>
  );
}
