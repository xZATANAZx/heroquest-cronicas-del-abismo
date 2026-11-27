import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Heart,
  Brain,
  Swords,
  Backpack,
  Sparkles,
  BookOpen,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Dices,
  Gift,
  TrendingUp,
  UserPlus,
  RefreshCw,
  Building2,
} from 'lucide-react';
import {
  ATTRIBUTES,
  CLASSES,
  RACES,
  LEVEL_TABLE,
  EQUIPMENT_CATALOG,
  SPELLS_CATALOG,
  SPELL_UPGRADE_TIERS,
  STATUS_CATALOG,
  COMBAT_TECHNIQUES,
  getHeroPillars,
  getHeroLoadoutConfig,
  getHeroActiveTechniques,
  getHeroUnlockedSpells,
  getUpgradedSpellView,
  CLASS_ACTIVE_POWERS,
  RACIAL_ACTIONS,
  UNLOCKABLE_CLASS_ABILITIES,
  PERK_ACTIVE_ABILITIES,
  ALIGNMENT_ACTIVE_ABILITIES,
  CLASS_PERSONAL_GUIDES,
  getModifier,
  formatMod,
} from '../data/characterSystem';
import CharacterForge from './CharacterForge';
import PuzzleModal from './PuzzleModal';
import { getRarityMeta } from '../data/lootCatalog';
import {
  MATERIALS_CATALOG,
  CRAFTING_RECIPES,
  getMaterialById,
  isQualifiedAlchemist,
  rollPotionCraftAttempt,
} from '../data/craftingSystem';
import {
  PROFESSIONS,
  TAVERN_FEASTS,
  FAMILIARS,
  getHeroFameTier,
  generatePersonalCityArrival,
  generatePersonalCityEvent,
} from '../data/citySystem';
import { OFFICIAL_ALCHEMY_DECK } from '../data/officialCards';

// Enriquece automáticamente cualquier objeto (incluyendo equipo inicial de clase) para que SIEMPRE muestre tipo real, dados y efecto claro
function enrichGearItem(raw) {
  const name = raw.name || 'Objeto';
  const low = name.toLowerCase();
  const hasRealEffect =
    (raw.upgrade && raw.upgrade !== 'Equipo inicial de clase') ||
    (raw.special && raw.special !== 'Equipo inicial de clase') ||
    (raw.traits && raw.traits !== 'Equipo inicial de clase');

  let type = raw.type;
  let dice = raw.dice || '';
  let effect = hasRealEffect ? (raw.upgrade || raw.special || raw.traits) : '';
  let isConsumable = false;

  // Extraer dados entre paréntesis del nombre si no vienen en dice (ej: "Espada Ancha (3 DC)")
  if (!dice) {
    const paren = name.match(/\(([^)]+)\)/);
    if (paren) dice = paren[1];
  }

  if (low.includes('poción') || low.includes('pocion') || low.includes('antídoto') || low.includes('antidoto') || low.includes('agua bendita')) {
    type = 'Poción';
    isConsumable = true;
    if (!effect) {
      if (low.includes('curación mayor') || low.includes('curacion mayor')) {
        dice = dice || '+4 PC';
        effect = 'Acción gratuita: restaura hasta 4 Puntos de Cuerpo al beberla.';
      } else if (low.includes('curación') || low.includes('curacion')) {
        dice = dice || '+2 PC';
        effect = 'Acción gratuita: restaura 2 Puntos de Cuerpo (evita morir si llegas a 0 PC).';
      } else if (low.includes('clarividencia')) {
        dice = dice || '+2 PM';
        effect = 'Acción gratuita: restaura 2 Puntos de Mente y te saca del estado de Shock.';
      } else if (low.includes('agua bendita')) {
        dice = dice || '2 DC Mágico';
        effect = 'Arrojadiza: inflige 2 DC mágicos a No Muertos o Espectros.';
      } else {
        effect = 'Consumible de un solo uso con efecto inmediato.';
      }
    }
  } else if (low.includes('pergamino')) {
    type = 'Pergamino';
    isConsumable = true;
    if (!effect) effect = 'Un solo uso: lanza el hechizo escrito sin gastar tus PM.';
  } else if (low.includes('bomba de humo') || low.includes('abrojos') || low.includes('aceite')) {
    type = 'Consumible';
    isConsumable = true;
    if (!effect) {
      if (low.includes('humo')) effect = '1 uso: bloquea ataques de oportunidad de 1 enemigo durante 1 turno para escapar.';
      else if (low.includes('abrojos')) effect = '1 uso: frena a enemigos que te persigan (-3 casillas de movimiento).';
      else effect = '1 uso: recubre tu arma para ganar +2 DC contra una familia de monstruos.';
    }
  } else if (
    low.includes('escudo') ||
    low.includes('cota') ||
    low.includes('armadura') ||
    low.includes('placas') ||
    low.includes('yelmo') ||
    low.includes('túnica') ||
    low.includes('tunica') ||
    low.includes('capa')
  ) {
    type = 'Armadura';
    if (!effect) {
      if (low.includes('escudo')) {
        dice = dice || '+1 Def';
        effect = 'Mano secundaria: suma +1 Dado de Defensa al defender (no compatible con armas a 2 manos).';
      } else if (low.includes('placas')) {
        dice = dice || '+2 Def';
        effect = 'Armadura pesada: suma +2 Dados de Defensa (-2 casillas de movimiento).';
      } else if (low.includes('cota')) {
        dice = dice || '+1 Def';
        effect = 'Armadura media: suma +1 Dado de Defensa contra todos los ataques.';
      } else if (low.includes('cuero') || low.includes('túnica') || low.includes('tunica') || low.includes('capa')) {
        dice = dice || '+1 Def';
        effect = 'Protección ligera: suma +1 Dado de Defensa sin penalizar Sigilo ni movimiento.';
      }
    }
  } else if (
    low.includes('espada') ||
    low.includes('hacha') ||
    low.includes('daga') ||
    low.includes('bastón') ||
    low.includes('baston') ||
    low.includes('arco') ||
    low.includes('ballesta') ||
    low.includes('estoque') ||
    low.includes('varita') ||
    low.includes('maza') ||
    low.includes('lanza') ||
    low.includes('puño') ||
    low.includes('farol') ||
    type === 'Arma'
  ) {
    type = 'Arma';
    if (!effect) {
      const dcM = String(dice || name).match(/(\d+)\s*dc/i);
      const dcNum = dcM ? dcM[1] : '2';
      if (low.includes('diagonal')) {
        effect = `Ataca con ${dcNum} Dados de Combate y también puede golpear en diagonal.`;
      } else if (low.includes('distancia') || low.includes('arco') || low.includes('ballesta')) {
        effect = `Arma a distancia: ataca con ${dcNum} DC a enemigos visibles (sin enemigos pegados a ti).`;
      } else if (low.includes('plata') || low.includes('mágic') || low.includes('varita') || low.includes('farol')) {
        effect = `Arma mágica/plata (${dcNum} DC): daña normalmente a Espectros Etéreos y No Muertos.`;
      } else if (low.includes('arrojadiza') || low.includes('daga')) {
        effect = `Arma ligera (${dcNum} DC): cuerpo a cuerpo o arrojadiza hasta 4 casillas.`;
      } else {
        effect = `Arma cuerpo a cuerpo: tiras ${dcNum} Dados de Combate al atacar.`;
      }
    }
  } else if (low.includes('herramienta') || low.includes('bandolera') || low.includes('cuerda') || low.includes('estuche') || low.includes('reactivo')) {
    type = 'Herramienta';
    if (!effect) {
      if (low.includes('herramienta') || low.includes('bandolera')) {
        dice = dice || '+2 Trampas';
        effect = 'Otorga Ventaja y +2 en pruebas para detectar y desarmar trampas mecánicas.';
      } else if (low.includes('estuche') || low.includes('reactivo')) {
        dice = dice || 'Alquimia';
        effect = 'Ingrediente alquímico: úsalo desde Crafteo en cualquier momento (Calificados con Ventaja · Otros por Suerte).';
      } else if (low.includes('cuerda')) {
        dice = dice || 'Utilidad';
        effect = 'Ayuda a cruzar fosos o rescatar aliados caídos con Ventaja en Atletismo.';
      }
    }
  } else if (low.includes('grimorio') || low.includes('hechizo') || low.includes('canto') || low.includes('laúd') || low.includes('símbolo') || low.includes('carcaj')) {
    type = 'Accesorio';
    if (!effect) {
      if (low.includes('grimorio') || low.includes('hechizo') || low.includes('canto')) {
        effect = 'Foco arcano/espiritual: contiene tus hechizos listos para lanzar en la pestaña Poderes.';
      } else if (low.includes('carcaj')) {
        effect = 'Munición lista para tu arco o ballesta durante toda la misión.';
      } else {
        effect = 'Foco de clase que canaliza tus habilidades especiales.';
      }
    }
  } else if (!type || type === 'Equipo') {
    type = 'Accesorio';
    if (!effect) effect = 'Equipo útil de aventurero.';
  }

  const atkDiceMatch = type === 'Arma' || type === 'Artefacto' ? String(dice || name).match(/(\d+)\s*dc/i) : null;
  const defDiceMatch = type === 'Armadura' ? String(dice || name).match(/\+(\d+)\s*def/i) : null;

  return {
    ...raw,
    type,
    dice,
    effectText: effect,
    isConsumable: isConsumable || type === 'Poción' || type === 'Pergamino' || type === 'Consumible',
    atkDiceVal: atkDiceMatch ? Number(atkDiceMatch[1]) : 0,
    defDiceVal: defDiceMatch ? Number(defDiceMatch[1]) : 0,
  };
}

// Verifica si una clase puede equipar un objeto según sus restricciones
function checkCanEquip(item, heroClassId) {
  const txt = `${item.traits || ''} ${item.restriction || ''}`.toLowerCase();
  if (!txt) return { ok: true, reason: 'Compatible con tu clase' };
  if (txt.includes('no mago') && ['mago', 'brujo'].includes(heroClassId)) {
    return { ok: false, reason: 'Restringido: No usable por Mago/Brujo' };
  }
  if (txt.includes('solo mago') && !['mago', 'brujo', 'bardo', 'exorcista'].includes(heroClassId)) {
    return { ok: false, reason: 'Solo lanzadores de hechizos' };
  }
  if (txt.includes('solo pícaro') && heroClassId !== 'picaro') {
    return { ok: false, reason: 'Solo Pícaro de las Sombras' };
  }
  return { ok: true, reason: 'Compatible con tu clase' };
}

export default function PlayerMobileView({ initialPlayerParam }) {
  const [heroId, setHeroId] = useState(initialPlayerParam);
  const [hero, setHero] = useState(null);
  const [allHeroes, setAllHeroes] = useState([]);
  const [tab, setTab] = useState('hero'); // 'hero' | 'gear' | 'skills' | 'guide'
  const [gearSubTab, setGearSubTab] = useState('equipped'); // 'equipped' | 'consumables' | 'backpack'
  const [liveAlert, setLiveAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  // Cooldowns (turnos restantes) y Usos por Misión de habilidades del jugador
  const [cooldowns, setCooldowns] = useState({});
  const [usesLeft, setUsesLeft] = useState({});
  const [actionToast, setActionToast] = useState(null);
  const [levelUpModal, setLevelUpModal] = useState(null);
  const [rechargePickerOpen, setRechargePickerOpen] = useState(false);
  const [allyTargetId, setAllyTargetId] = useState('');
  const [tradeItemId, setTradeItemId] = useState(null);
  const [tradeTargetId, setTradeTargetId] = useState('');
  const [craftRollInput, setCraftRollInput] = useState('');
  const [craftOutcome, setCraftOutcome] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityModeMobile, setCityModeMobile] = useState('relaxed');
  const [cityVisitId, setCityVisitId] = useState(0);
  const [cityPhase, setCityPhase] = useState('gate'); // 'gate' | 'event' | 'districts'
  const [arrivalStory, setArrivalStory] = useState('');
  const [personalCityEvent, setPersonalCityEvent] = useState(null);
  const [personalEventOutcome, setPersonalEventOutcome] = useState('');
  const lastCityVisitIdRef = useRef(0);
  const [cityContracts, setCityContracts] = useState([]);
  const [contractVotes, setContractVotes] = useState({});
  const [mobileCitySection, setMobileCitySection] = useState('posada'); // 'posada' | 'herreria' | 'alquimista' | 'gremio' | 'banco'
  const [mobileBankAmt, setMobileBankAmt] = useState(50);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const dismissedPuzzleIdsRef = useRef(new Set());
  const lastVersionRef = useRef(null);
  const prevStateRef = useRef({ level: null, invCount: null, gold: null, maxPC: null, maxPM: null });
  const mainScrollRef = useRef(null);

  const fetchLatest = async () => {
    try {
      const res = await fetch('/api/heroes', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const list = data.heroes || [];
      const versionChanged = data.version === undefined || data.version !== lastVersionRef.current;

      if (versionChanged) {
        lastVersionRef.current = data.version;
        setAllHeroes(list);
      }

      if (heroId && heroId !== 'new' && heroId !== 'lobby') {
        const found = list.find((h) => h.id === heroId);
        if (found && versionChanged) {
          // Detectar cambios enviados en tiempo real por el DM (subida de nivel, objeto nuevo, oro)
          const prev = prevStateRef.current;
          if (prev.level !== null && found.level > prev.level) {
            const hCls = CLASSES.find((c) => c.id === found.classId);
            const lvlInfo = LEVEL_TABLE.find((l) => l.level === found.level);
            const unlockedFeatures = [];
            for (let lv = prev.level + 1; lv <= found.level; lv += 1) {
              if (hCls?.progression?.[lv]) {
                unlockedFeatures.push({ level: lv, text: hCls.progression[lv] });
              }
            }
            setLevelUpModal({
              oldLevel: prev.level,
              newLevel: found.level,
              tier: lvlInfo?.tier || '',
              pcGain: prev.maxPC !== null ? Math.max(0, found.maxPC - prev.maxPC) : (hCls?.pcPerLevel || 0),
              pmGain: prev.maxPM !== null ? Math.max(0, found.maxPM - prev.maxPM) : (hCls?.pmPerLevel || 0),
              profBonus: found.profBonus,
              unlockedFeatures,
              subclass: found.level >= 3 && prev.level < 3 ? found.subclass : null,
            });
          } else if (prev.invCount !== null && (found.inventory?.length || 0) > prev.invCount) {
            const newest = found.inventory[found.inventory.length - 1];
            setLiveAlert(`🎁 ¡El DM te envió un objeto!: ${newest?.name || 'Nuevo tesoro'}`);
          } else if (prev.gold !== null && found.gold > prev.gold) {
            setLiveAlert(`💰 ¡Recibiste +${found.gold - prev.gold} Monedas de Oro!`);
          }
          prevStateRef.current = {
            level: found.level,
            invCount: found.inventory?.length || 0,
            gold: found.gold,
            maxPC: found.maxPC,
            maxPM: found.maxPM,
          };
          setHero(found);
        }

        // Revisar si el DM abrió o cerró la Ciudad para los celulares
        try {
          const cRes = await fetch('/api/city-mode', { cache: 'no-store' });
          if (cRes.ok) {
            const cData = await cRes.json();
            const isOpen = Boolean(cData.cityOpen);
            const serverVisitId = Number(cData.visitId || 0);
            const serverMode = cData.cityMode || 'relaxed';
            setCityOpen(isOpen);
            setCityModeMobile(serverMode);
            if (!isOpen) {
              // El DM cerró la ciudad: limpiar estado para la próxima vez que la abra
              lastCityVisitIdRef.current = 0;
              setCityVisitId(0);
            } else if (serverVisitId && serverVisitId !== lastCityVisitIdRef.current) {
              lastCityVisitIdRef.current = serverVisitId;
              setCityVisitId(serverVisitId);
              // Verificar si ESTE héroe ya entró durante esta misma apertura de Ciudad
              let alreadyEntered = false;
              try {
                alreadyEntered =
                  localStorage.getItem(`hq_city_entered_${heroId}`) === String(serverVisitId);
              } catch {
                // ignore
              }
              if (alreadyEntered) {
                setCityPhase('districts');
              } else {
                setCityPhase('gate');
                setPersonalCityEvent(null);
                setPersonalEventOutcome('');
                setArrivalStory(
                  generatePersonalCityArrival(found || hero, serverMode)
                );
              }
            }
            if (isOpen) {
              const ctRes = await fetch('/api/contracts', { cache: 'no-store' });
              if (ctRes.ok) {
                const ctData = await ctRes.json();
                setCityContracts(ctData.contracts || []);
                setContractVotes(ctData.votes || {});
              }
            }
          }
        } catch {
          // ignore
        }

        // Revisar si el DM envió un Puzzle interactivo nuevo a este héroe
        try {
          const pRes = await fetch(`/api/puzzles?heroId=${encodeURIComponent(heroId)}`, { cache: 'no-store' });
          if (pRes.ok) {
            const pData = await pRes.json();
            const incoming = pData.activePuzzle;
            if (incoming && !dismissedPuzzleIdsRef.current.has(incoming.instanceId)) {
              setActivePuzzle((curr) =>
                curr?.instanceId === incoming.instanceId ? curr : incoming
              );
            }
          }
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore offline hiccup
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
    const timer = setInterval(fetchLatest, 2000);
    return () => clearInterval(timer);
  }, [heroId]);

  const pushHeroUpdate = async (updatedHero) => {
    setHero(updatedHero);
    prevStateRef.current = {
      level: updatedHero.level,
      invCount: updatedHero.inventory?.length || 0,
      gold: updatedHero.gold,
      maxPC: updatedHero.maxPC,
      maxPM: updatedHero.maxPM,
    };
    try {
      await fetch('/api/heroes/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero: updatedHero }),
      });
    } catch {
      // ignore
    }
  };

  const handleMobileCreateHero = async (newHero) => {
    try {
      await fetch('/api/heroes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero: newHero }),
      });
      localStorage.setItem('hq_my_hero_id', newHero.id);
    } catch {
      // ignore
    }
    const url = new URL(window.location.href);
    url.searchParams.set('player', newHero.id);
    window.history.replaceState({}, '', url.toString());
    prevStateRef.current = {
      level: newHero.level,
      invCount: newHero.inventory?.length || 0,
      gold: newHero.gold,
    };
    setHero(newHero);
    setHeroId(newHero.id);
  };

  // MODO CREACIÓN DE PERSONAJE DESDE EL CELULAR (?player=new)
  if (heroId === 'new') {
    return (
      <div className="min-h-screen bg-[#0f141e] text-slate-100 p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
        <div className="grimoire-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              HeroQuest: Crónicas del Abismo · Jugador Móvil
            </div>
            <h1 className="font-display text-xl font-black text-amber-200">
              Crea tu Héroe Personalizado
            </h1>
          </div>
          {allHeroes.length > 0 && (
            <button
              onClick={() => setHeroId('lobby')}
              className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-amber-300 font-bold cursor-pointer"
            >
              Ya tengo Héroe ({allHeroes.length})
            </button>
          )}
        </div>

        <CharacterForge
          heroes={allHeroes}
          setHeroes={() => {}}
          mobileCreateOnly
          onHeroCreatedMobile={handleMobileCreateHero}
        />
      </div>
    );
  }

  // LOBBY DE BIENVENIDA AL ESCANEAR EL QR (?player=lobby)
  if (heroId === 'lobby' || (!loading && !hero)) {
    return (
      <div className="min-h-screen bg-[#0f141e] text-slate-100 p-5 max-w-md mx-auto flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
            HeroQuest · Crónicas del Abismo
          </div>
          <h1 className="font-display text-3xl font-black text-white">
            ¡Bienvenido, Aventurero!
          </h1>
          <p className="text-xs text-slate-400">
            Elige si quieres forjar un personaje nuevo o entrar a tu hoja ya creada en la mesa.
          </p>
        </div>

        {/* Opción 1: Crear Personaje Nuevo */}
        <button
          onClick={() => setHeroId('new')}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-display font-black text-base flex items-center justify-center gap-2.5 cursor-pointer shadow-xl transition"
        >
          <UserPlus className="w-5 h-5" /> ✨ Crear Personaje Nuevo
        </button>

        {/* Opción 2: Elegir Personaje Existente */}
        <div className="space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between px-1">
            <span>🛡️ Elegir Personaje Existente</span>
            <span className="text-amber-300">{allHeroes.length} en mesa</span>
          </div>

          {allHeroes.length === 0 ? (
            <div className="p-5 rounded-2xl grimoire-panel border-slate-800 text-center text-xs text-slate-400">
              Aún no hay personajes creados en esta campaña. Pulsa <strong>Crear Personaje Nuevo</strong> arriba para empezar.
            </div>
          ) : (
            <div className="space-y-2.5">
              {allHeroes.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('player', h.id);
                    window.history.replaceState({}, '', url.toString());
                    setHeroId(h.id);
                    setHero(h);
                  }}
                  className="w-full p-4 rounded-2xl grimoire-panel border-slate-700 hover:border-amber-400 text-left flex items-center justify-between cursor-pointer transition"
                >
                  <div>
                    <div className="font-display font-bold text-lg text-amber-200">{h.name}</div>
                    <div className="text-xs text-slate-400">
                      {h.raceName} · {h.className} · Nv.{h.level}
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shrink-0">
                    Elegir →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading || !hero) {
    return (
      <div className="min-h-screen bg-[#0d0a0c] text-amber-200 flex items-center justify-center">
        <div className="text-center space-y-2">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400" />
          <p className="font-display text-sm">Conectando con la mesa del DM...</p>
        </div>
      </div>
    );
  }

  const clsData = CLASSES.find((c) => c.id === hero.classId);
  const raceData = RACES.find((r) => r.id === hero.raceId);
  const nextLvl = LEVEL_TABLE.find((l) => l.level === hero.level + 1);
  const hasFragileMind = (hero.flaws || []).some((f) => f.id === 'fragil_mente');
  const isShock = (hero.currentPM ?? hero.maxPM) <= (hasFragileMind ? 1 : 0);

  // Efectos activos (Buffs / Debuffs) sincronizados en la hoja
  const activeEffects = hero.activeEffects || [];
  const usedSpells = hero.usedSpells || [];
  const atkMod = activeEffects.reduce((acc, ef) => acc + (ef.attackMod || 0), 0);
  const defMod = activeEffects.reduce((acc, ef) => acc + (ef.defendMod || 0), 0);
  const spdMod = activeEffects.reduce((acc, ef) => acc + (ef.speedMod || 0), 0);
  const effectiveAttack = Math.max(1, (hero.attackDice || 2) + atkMod);
  const effectiveDefend = Math.max(0, (hero.defendDice || 2) + defMod);
  const effectiveSpeed = Math.max(1, (hero.speed || 8) + spdMod);

  const showToast = (msg) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3000);
  };

  const notifyDMAction = async (payload) => {
    try {
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: {
            heroId: hero.id,
            heroName: hero.name,
            heroClass: hero.className,
            ...payload,
          },
        }),
      });
    } catch {
      // ignore
    }
  };

  const toggleEquipItem = (itemId) => {
    const nextInv = (hero.inventory || []).map((it) =>
      it.id === itemId ? { ...it, equipped: !it.equipped } : it
    );
    pushHeroUpdate({ ...hero, inventory: nextInv });
  };

  const transferItemToAlly = async (itemId, targetId) => {
    if (!targetId) return;
    try {
      const res = await fetch('/api/heroes/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromHeroId: hero.id,
          toHeroId: targetId,
          itemId,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && data.fromHero) {
        setHero(data.fromHero);
        prevStateRef.current = {
          level: data.fromHero.level,
          invCount: data.fromHero.inventory?.length || 0,
          gold: data.fromHero.gold,
          maxPC: data.fromHero.maxPC,
          maxPM: data.fromHero.maxPM,
        };
        setTradeItemId(null);
        showToast(`🤝 Le pasaste "${data.itemName}" a ${data.toHeroName}`);
      }
    } catch {
      showToast('❌ No se pudo transferir el objeto. Intenta de nuevo.');
    }
  };

  const removeEffect = (effectId) => {
    pushHeroUpdate({
      ...hero,
      activeEffects: activeEffects.filter((ef) => ef.id !== effectId),
    });
  };

  const addQuickDebuff = (preset) => {
    const nextEffects = [...activeEffects.filter((e) => e.id !== preset.id), preset];
    pushHeroUpdate({ ...hero, activeEffects: nextEffects });
    showToast(`Estado aplicado: ${preset.label}`);
  };

  const consumeItem = async (itemId) => {
    const item = (hero.inventory || []).find((it) => it.id === itemId);
    if (!item) return;
    const text = `${item.name || ''} ${item.dice || ''} ${item.upgrade || ''} ${item.special || ''} ${item.traits || ''}`.toLowerCase();
    const hasDelicateStomach = (hero.flaws || []).some((f) => f.id === 'alergia_magia');

    let nextPC = hero.currentPC ?? hero.maxPC;
    let nextPM = hero.currentPM ?? hero.maxPM;
    let nextEffects = [...activeEffects];
    const notes = [];

    // Curación de PC
    const pcMatch = text.match(/\+(\d+)\s*pc/);
    if (pcMatch || text.includes('curación') || text.includes('curacion') || text.includes('sanac')) {
      let heal = pcMatch ? Number(pcMatch[1]) : text.includes('mayor') ? 4 : 2;
      if (hasDelicateStomach) heal = Math.max(1, heal - 1);
      nextPC = Math.min(hero.maxPC, nextPC + heal);
      notes.push(`+${heal} PC`);
    }

    // Restauración de PM
    const pmMatch = text.match(/\+(\d+)\s*pm/);
    if (pmMatch || text.includes('clarividencia') || text.includes('maná') || text.includes('mana')) {
      const pmHeal = pmMatch ? Number(pmMatch[1]) : 2;
      nextPM = Math.min(hero.maxPM, nextPM + pmHeal);
      notes.push(`+${pmHeal} PM`);
    }

    // Buffs de pociones (Fuerza, Defensa/Piel de Piedra, Velocidad, Heroísmo)
    if (text.includes('fuerza') || text.includes('heroísmo') || text.includes('heroismo') || text.includes('+2 dc ataque')) {
      nextEffects = [
        ...nextEffects.filter((e) => e.id !== 'pot_fuerza'),
        { id: 'pot_fuerza', label: '🧪 Poción de Fuerza (+2 DC Ataque)', type: 'buff', duration: 1, attackMod: 2, note: '+2 DC en tu próximo ataque.' },
      ];
      notes.push('+2 DC Ataque (1 turno)');
    }
    if (text.includes('defensa') || text.includes('piel de piedra') || text.includes('resistencia')) {
      nextEffects = [
        ...nextEffects.filter((e) => e.id !== 'pot_defensa'),
        { id: 'pot_defensa', label: '🧪 Piel Reforzada (+2 DC Defensa)', type: 'buff', duration: 2, defendMod: 2, note: '+2 DC en defensa por 2 turnos.' },
      ];
      notes.push('+2 DC Defensa (2 turnos)');
    }
    if (text.includes('velocidad') || text.includes('rapidez')) {
      nextEffects = [
        ...nextEffects.filter((e) => e.id !== 'pot_velocidad'),
        { id: 'pot_velocidad', label: '🧪 Velocidad (+4 Mov)', type: 'buff', duration: 1, speedMod: 4, note: '+4 casillas de movimiento este turno.' },
      ];
      notes.push('+4 Mov (1 turno)');
    }
    if (text.includes('antídoto') || text.includes('antidoto') || text.includes('veneno')) {
      nextEffects = nextEffects.filter((e) => e.type !== 'debuff');
      notes.push('Debuffs curados');
    }

    const nextInv = (hero.inventory || []).filter((it) => it.id !== itemId);
    await pushHeroUpdate({
      ...hero,
      currentPC: nextPC,
      currentPM: nextPM,
      activeEffects: nextEffects,
      inventory: nextInv,
    });

    const summary = notes.length > 0 ? notes.join(', ') : 'Consumido';
    showToast(`🧪 Usaste ${item.name} (${summary})`);
    notifyDMAction({
      abilityName: `Consumió: ${item.name}`,
      attackDice: 0,
      damageType: 'Poción / Objeto',
      isMagic: false,
      isFire: false,
      isRanged: false,
      description: `${item.name} — Efecto aplicado: ${summary}.`,
    });
  };

  // Construye las habilidades activables limpias del héroe (con costes reales de PM, buffs y rasgos raciales)
  const getHeroActiveAbilities = () => {
    const equippedWeapon = (hero.inventory || []).find(
      (it) => it.equipped && (it.type === 'Arma' || it.type === 'Artefacto')
    );
    const weaponDiceMatch = String(equippedWeapon?.dice || '').match(/(\d+)/);
    const baseWeaponDice = weaponDiceMatch ? Number(weaponDiceMatch[1]) : hero.attackDice || 2;
    const totalAttackDice = Math.max(1, baseWeaponDice + atkMod);
    const weaponText = `${equippedWeapon?.name || ''} ${equippedWeapon?.dice || ''} ${equippedWeapon?.special || ''}`.toLowerCase();
    const isFire = weaponText.includes('fuego') || weaponText.includes('brasa');
    const isMagic =
      weaponText.includes('mágic') ||
      weaponText.includes('plata') ||
      weaponText.includes('espiritual') ||
      equippedWeapon?.type === 'Artefacto' ||
      ['mago', 'brujo', 'exorcista'].includes(hero.classId);
    const isRanged = weaponText.includes('distancia') || weaponText.includes('arco') || weaponText.includes('ballesta');

    const list = [
      {
        id: 'basic_attack',
        name: `Atacar con ${equippedWeapon ? equippedWeapon.name : 'Arma Base'}`,
        kind: 'ataque',
        dice: totalAttackDice,
        damageType: isFire ? 'Fuego' : isMagic ? 'Mágico' : isRanged ? 'Proyectil' : 'Físico',
        isMagic,
        isFire,
        isRanged,
        isAttack: true,
        costPM: 0,
        maxUses: null,
        cooldownTurns: 0,
        desc: equippedWeapon?.special || `Ataque principal con ${totalAttackDice} Dados de Combate${atkMod !== 0 ? ` (incluye ${atkMod > 0 ? `+${atkMod}` : atkMod} por estados activos)` : ''}.`,
      },
    ];

    // Poder Activo de Clase limpio (sin texto de relleno)
    const clsPower = CLASS_ACTIVE_POWERS[hero.classId];
    if (clsPower) {
      const powerDice = clsPower.isAttack
        ? (clsPower.diceBonus ? totalAttackDice + clsPower.diceBonus : (clsPower.dice || totalAttackDice))
        : 0;
      list.push({
        id: 'class_core',
        name: clsPower.name,
        kind: 'habilidad',
        dice: powerDice,
        damageType: clsPower.damageType || 'Especial',
        isMagic: Boolean(clsPower.isMagic),
        isFire: Boolean(clsPower.isFire),
        isRanged: Boolean(clsPower.isRanged),
        isAttack: Boolean(clsPower.isAttack),
        costPM: clsPower.costPM || 0,
        maxUses: clsPower.maxUses ?? null,
        cooldownTurns: clsPower.cooldownTurns || 0,
        buff: clsPower.buff || null,
        healPC: clsPower.healPC || 0,
        healPM: clsPower.healPM || 0,
        canRechargeSpell: Boolean(clsPower.canRechargeSpell),
        desc: clsPower.desc,
      });
    }

    // Habilidades activables desbloqueadas por nivel de clase (ej: Proyectil Arcano Nv.1, Recuperación Arcana Nv.2, etc.)
    const unlockedExtras = (UNLOCKABLE_CLASS_ABILITIES[hero.classId] || []).filter(
      (u) => u.minLevel <= (hero.level || 1)
    );
    unlockedExtras.forEach((u) => {
      list.push({
        id: u.id,
        name: u.name,
        kind: 'progresion',
        dice: u.dice || 0,
        damageType: u.damageType || 'Especial',
        isMagic: Boolean(u.isMagic),
        isFire: Boolean(u.isFire),
        isRanged: Boolean(u.isRanged),
        isAttack: Boolean(u.isAttack),
        costPM: u.costPM || 0,
        maxUses: u.maxUses ?? null,
        cooldownTurns: u.cooldownTurns || 0,
        buff: u.buff || null,
        debuff: u.debuff || null,
        healPC: u.healPC || 0,
        healPM: u.healPM || 0,
        targetAlly: Boolean(u.targetAlly),
        supportHealPC: u.supportHealPC || 0,
        supportHealPM: u.supportHealPM || 0,
        desc: u.desc,
      });
    });

    // Técnicas de Combate Preparadas (intercambiables antes de cada misión para clases marciales)
    const activeTechniques = getHeroActiveTechniques(hero);
    activeTechniques.forEach((tech) => {
      list.push({
        id: tech.id,
        name: `${tech.icon} ${tech.name}`,
        kind: 'tecnica',
        dice: tech.dice || 0,
        damageType: tech.damageType || 'Técnica',
        isMagic: false,
        isFire: false,
        isRanged: false,
        isAttack: Boolean(tech.isAttack),
        costPM: 0,
        maxUses: tech.maxUses ?? 2,
        cooldownTurns: tech.cooldownTurns || 1,
        buff: tech.buff || null,
        targetAlly: Boolean(tech.targetAlly),
        supportHealPC: tech.supportHealPC || 0,
        desc: tech.desc,
      });
    });

    // Poder Racial Activable (solo si la raza tiene habilidad activable; las pasivas se muestran aparte)
    const raceAction = RACIAL_ACTIONS[hero.raceId];
    if (raceAction?.active) {
      const chosenEl = hero.dragonElement || (hero.raceName?.includes('Hielo') ? 'Hielo' : 'Fuego');
      list.push({
        id: 'race_trait',
        name: raceAction.chooseElement
          ? `${raceAction.name} (${chosenEl === 'Fuego' ? '🔥 Fuego' : '❄️ Hielo'})`
          : raceAction.name,
        kind: 'racial',
        dice: raceAction.dice || 0,
        damageType: raceAction.chooseElement ? chosenEl : (raceAction.damageType || 'Racial'),
        isMagic: Boolean(raceAction.isMagic),
        isFire: raceAction.chooseElement ? chosenEl === 'Fuego' : Boolean(raceAction.isFire),
        isRanged: Boolean(raceAction.isRanged),
        isAttack: Boolean(raceAction.isAttack),
        chooseElement: Boolean(raceAction.chooseElement),
        costPM: 0,
        maxUses: raceAction.maxUses ?? 1,
        cooldownTurns: raceAction.cooldownTurns || 0,
        buff: raceAction.buff || null,
        healPC: raceAction.healPC || 0,
        desc: raceAction.desc,
      });
    }

    return list;
  };

  const triggerAbilityToDM = async (ab) => {
    const cd = cooldowns[ab.id] || 0;
    const rem = usesLeft[ab.id] !== undefined ? usesLeft[ab.id] : ab.maxUses;
    const curPM = hero.currentPM ?? hero.maxPM;
    if (cd > 0) return;
    if (ab.maxUses !== null && rem <= 0) return;
    if ((ab.costPM || 0) > curPM) {
      showToast(`⚠️ Necesitas ${ab.costPM} PM para activar ${ab.name}.`);
      return;
    }

    if (ab.cooldownTurns > 0) {
      setCooldowns((prev) => ({ ...prev, [ab.id]: ab.cooldownTurns }));
    }
    if (ab.maxUses !== null) {
      setUsesLeft((prev) => ({ ...prev, [ab.id]: Math.max(0, rem - 1) }));
    }

    // Si es habilidad de apoyo a aliado (ej: Manos Sanadoras / Imposición de Manos)
    let supportEffect = null;
    let extraDesc = ab.desc;
    let selfSupportHealPC = 0;
    let selfSupportHealPM = 0;
    if (ab.targetAlly) {
      const chosenAllyId = allyTargetId || allHeroes.find((h) => h.id !== hero.id)?.id || hero.id;
      const chosenAlly = allHeroes.find((h) => h.id === chosenAllyId) || hero;
      if (chosenAlly.id === hero.id) {
        selfSupportHealPC = ab.supportHealPC || 0;
        selfSupportHealPM = ab.supportHealPM || 0;
        extraDesc = `${ab.name} usada sobre sí mismo (${selfSupportHealPC ? `+${selfSupportHealPC} PC` : ''}).`;
      } else {
        supportEffect = {
          targetHeroId: chosenAlly.id,
          targetHeroName: chosenAlly.name,
          healPC: ab.supportHealPC || 0,
          healPM: ab.supportHealPM || 0,
        };
        extraDesc = `Objetivo elegido: ${chosenAlly.name} (${ab.supportHealPC ? `+${ab.supportHealPC} PC` : ''}). ¡Pulsa Aplicar abajo para sumarle la curación!`;
      }
    }

    // Aplicar costes de PM, curaciones y Buffs/Debuffs directamente en la hoja del héroe
    const needsHeroUpdate =
      (ab.costPM || 0) > 0 ||
      ab.buff ||
      ab.debuff ||
      ab.healPC ||
      ab.healPM ||
      selfSupportHealPC > 0 ||
      selfSupportHealPM > 0;
    if (needsHeroUpdate) {
      let nextPC = hero.currentPC ?? hero.maxPC;
      let nextPM = Math.max(0, curPM - (ab.costPM || 0));
      let nextEffects = [...activeEffects];
      if (ab.healPC || selfSupportHealPC) {
        nextPC = Math.min(hero.maxPC, nextPC + (ab.healPC || 0) + selfSupportHealPC);
      }
      if (ab.healPM || selfSupportHealPM) {
        nextPM = Math.min(hero.maxPM, nextPM + (ab.healPM || 0) + selfSupportHealPM);
      }
      if (ab.buff) {
        nextEffects = [...nextEffects.filter((e) => e.id !== ab.buff.id), ab.buff];
      }
      if (ab.debuff) {
        nextEffects = [...nextEffects.filter((e) => e.id !== ab.debuff.id), ab.debuff];
      }
      await pushHeroUpdate({
        ...hero,
        currentPC: nextPC,
        currentPM: nextPM,
        activeEffects: nextEffects,
      });
    }

    await notifyDMAction({
      abilityName: ab.name,
      attackDice: ab.dice,
      damageType: ab.damageType,
      isMagic: ab.isMagic,
      isFire: ab.isFire,
      isRanged: ab.isRanged,
      supportEffect,
      description: extraDesc,
    });
    showToast(
      supportEffect
        ? `💚 ${ab.name} enviada al DM para curar a ${supportEffect.targetHeroName}`
        : `⚡ ${ab.name} activada${ab.costPM ? ` (-${ab.costPM} PM)` : ''}${ab.buff ? ' · Estado aplicado' : ''}`
    );
  };

  // Hechizos exactos según la clase y nivel del héroe, con su nivel de mejora aplicado
  const getHeroSpells = () =>
    getHeroUnlockedSpells(hero).map((sp) =>
      getUpgradedSpellView(sp, hero.spellLevels?.[sp.id] || 1)
    );

  const castSpell = async (sp) => {
    if (usedSpells.includes(sp.id)) return;
    const curPM = hero.currentPM ?? hero.maxPM;
    if ((sp.costPM || 0) > curPM) {
      showToast(`⚠️ Necesitas ${sp.costPM} PM para lanzar ${sp.name}.`);
      return;
    }

    // Si tiene Éter Canalizado activo y el hechizo es ofensivo, suma +1 DC y consume el buff
    const hasEtherBuff = activeEffects.some((e) => e.id === 'cls_eter');
    const spellDice = sp.dice > 0 ? sp.dice + (hasEtherBuff ? 1 : 0) : 0;

    let nextPC = hero.currentPC ?? hero.maxPC;
    let nextPM = Math.max(0, curPM - (sp.costPM || 0));
    let nextEffects = hasEtherBuff && sp.dice > 0
      ? activeEffects.filter((e) => e.id !== 'cls_eter')
      : [...activeEffects];

    const effectiveHealPC = sp.effectiveHealPC ?? sp.healPC ?? 0;
    const effectiveHealPM = sp.effectiveHealPM ?? sp.healPM ?? 0;
    const finalSpellDice = sp.effectiveDice ?? spellDice;

    if (effectiveHealPC) nextPC = Math.min(hero.maxPC, nextPC + effectiveHealPC);
    if (effectiveHealPM) nextPM = Math.min(hero.maxPM, nextPM + effectiveHealPM);
    if (sp.cleansesDebuffs) nextEffects = nextEffects.filter((e) => e.type !== 'debuff');
    if (sp.buff) {
      nextEffects = [...nextEffects.filter((e) => e.id !== sp.buff.id), sp.buff];
    }

    await pushHeroUpdate({
      ...hero,
      currentPC: nextPC,
      currentPM: nextPM,
      usedSpells: [...usedSpells, sp.id],
      activeEffects: nextEffects,
    });

    await notifyDMAction({
      abilityName: `Hechizo [${sp.school} · Nv.${sp.spellLevel || 1}]: ${sp.name}`,
      attackDice: finalSpellDice,
      damageType: sp.isFire ? 'Fuego' : 'Mágico',
      isMagic: true,
      isFire: Boolean(sp.isFire),
      isRanged: true,
      description: `${sp.desc}${sp.upgradeBonusText ? ` | Mejora Nv.${sp.spellLevel}: ${sp.upgradeBonusText}` : ''}`,
    });
    showToast(`✨ Lanzaste ${sp.name} (Nv.${sp.spellLevel || 1})${sp.costPM ? ` (-${sp.costPM} PM)` : ''} — Marcado como usado.`);
  };

  const rechargeSpellWithEther = async (spellId) => {
    const curPM = hero.currentPM ?? hero.maxPM;
    if (curPM < 1) {
      showToast('⚠️ Necesitas 1 PM para recargar un hechizo.');
      return;
    }
    const sp = SPELLS_CATALOG.find((s) => s.id === spellId);
    await pushHeroUpdate({
      ...hero,
      currentPM: curPM - 1,
      usedSpells: usedSpells.filter((id) => id !== spellId),
    });
    setRechargePickerOpen(false);
    showToast(`🔮 Gastaste 1 PM: ¡${sp?.name || 'Hechizo'} recargado!`);
  };

  const advanceMyTurn = () => {
    setCooldowns((prev) => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (v > 1) next[k] = v - 1;
      });
      return next;
    });
    if (activeEffects.length > 0) {
      const ticked = activeEffects
        .map((ef) => (ef.duration ? { ...ef, duration: ef.duration - 1 } : ef))
        .filter((ef) => !ef.duration || ef.duration > 0);
      pushHeroUpdate({ ...hero, activeEffects: ticked });
    }
    showToast('🔄 Nuevo turno: enfriamientos y duraciones bajaron 1 turno.');
  };

  const resetMissionUses = () => {
    setCooldowns({});
    setUsesLeft({});
    pushHeroUpdate({ ...hero, usedSpells: [], activeEffects: [] });
    showToast('✨ Hechizos, usos, estados y enfriamientos reiniciados para nueva misión.');
  };

  // Resolución de Puzzle Interactivo enviado por el DM (aplica recompensa O penalización real y limpia del servidor)
  const resolvePuzzleAttempt = async (isSuccess) => {
    if (!activePuzzle) return;
    const puz = activePuzzle.puzzle;
    dismissedPuzzleIdsRef.current.add(activePuzzle.instanceId);

    // Limpiar inmediatamente en el servidor para que nunca vuelva a abrirse
    try {
      await fetch('/api/puzzles/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroId: hero.id }),
      });
    } catch {
      // ignore
    }

    let nextPC = hero.currentPC ?? hero.maxPC;
    let nextPM = hero.currentPM ?? hero.maxPM;
    let nextGold = hero.gold || 0;
    let nextInv = [...(hero.inventory || [])];
    let nextEffects = [...activeEffects];

    if (isSuccess) {
      if (puz.rewardGold) nextGold += puz.rewardGold;
      if (puz.rewardHealPC) nextPC = Math.min(hero.maxPC, nextPC + puz.rewardHealPC);
      if (puz.rewardHealPM) nextPM = Math.min(hero.maxPM, nextPM + puz.rewardHealPM);
      if (puz.rewardLoot) {
        nextInv.push({
          ...puz.rewardLoot,
          id: `puz-loot-${Date.now()}`,
          equipped: false,
          qty: 1,
        });
      }
      if (puz.rewardBuff) {
        nextEffects = [...nextEffects.filter((e) => e.id !== puz.rewardBuff.id), puz.rewardBuff];
      }
    } else {
      if (puz.failDamagePC) nextPC = Math.max(0, nextPC - puz.failDamagePC);
      if (puz.failDamagePM) nextPM = Math.max(0, nextPM - puz.failDamagePM);
      if (puz.failDebuff) {
        nextEffects = [...nextEffects.filter((e) => e.id !== puz.failDebuff.id), puz.failDebuff];
      }
    }

    await pushHeroUpdate({
      ...hero,
      currentPC: nextPC,
      currentPM: nextPM,
      gold: nextGold,
      inventory: nextInv,
      activeEffects: nextEffects,
    });

    await notifyDMAction({
      abilityName: isSuccess ? `✅ PUZZLE RESUELTO: ${puz.title}` : `💥 PUZZLE FALLADO: ${puz.title}`,
      attackDice: 0,
      damageType: 'Puzzle',
      isMagic: false,
      isFire: false,
      isRanged: false,
      description: isSuccess
        ? `${hero.name} superó el desafío: ${puz.successText}`
        : `${hero.name} falló el desafío: ${puz.failText}`,
    });
  };

  const closeActivePuzzle = async () => {
    if (activePuzzle?.instanceId) {
      dismissedPuzzleIdsRef.current.add(activePuzzle.instanceId);
    }
    setActivePuzzle(null);
    try {
      await fetch('/api/puzzles/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroId: hero.id }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="h-[100dvh] w-full max-w-lg mx-auto bg-[#0f141e] text-slate-100 flex flex-col overflow-hidden">
      {/* MODAL ÉPICO DE SUBIDA DE NIVEL */}
      {levelUpModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#2a1d0f] via-[#1a1215] to-[#120d10] border-2 border-amber-400 shadow-2xl p-6 space-y-4 text-center">
            <div className="text-4xl">🏆✨</div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-amber-400">
                ¡Felicidades, {hero.name}!
              </div>
              <h2 className="font-display text-3xl font-black text-amber-200 mt-1">
                ¡SUBISTE A NIVEL {levelUpModal.newLevel}!
              </h2>
              {levelUpModal.tier && (
                <div className="text-xs text-amber-300/80 font-semibold mt-0.5">
                  Rango: {levelUpModal.tier}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-700/60">
                <div className="text-[10px] text-red-300 uppercase font-bold">Vida (PC)</div>
                <div className="font-black text-base text-white">+{levelUpModal.pcGain} PC</div>
                <div className="text-[10px] text-emerald-300">Restaurada</div>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-700/60">
                <div className="text-[10px] text-cyan-300 uppercase font-bold">Mente (PM)</div>
                <div className="font-black text-base text-white">+{levelUpModal.pmGain} PM</div>
                <div className="text-[10px] text-emerald-300">Restaurada</div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-700/60">
                <div className="text-[10px] text-amber-300 uppercase font-bold">Competencia</div>
                <div className="font-black text-base text-white">+{levelUpModal.profBonus}</div>
                <div className="text-[10px] text-stone-300">Bono d20</div>
              </div>
            </div>

            {levelUpModal.unlockedFeatures.length > 0 && (
              <div className="text-left space-y-2 bg-stone-950/80 border border-emerald-700/50 rounded-2xl p-3.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                  ✨ Nuevos Poderes Desbloqueados:
                </div>
                {levelUpModal.unlockedFeatures.map((feat) => (
                  <div key={feat.level} className="text-xs text-stone-100 leading-snug">
                    <strong className="text-amber-300">Nivel {feat.level}:</strong> {feat.text}
                  </div>
                ))}
              </div>
            )}

            {levelUpModal.subclass && (
              <div className="text-left bg-purple-950/50 border border-purple-500/60 rounded-2xl p-3.5 text-xs text-purple-100">
                <div className="font-black text-purple-300 uppercase text-[10px]">
                  🌟 Subclase Desbloqueada
                </div>
                <div className="font-bold text-sm text-white mt-0.5">{levelUpModal.subclass.name}</div>
                <p className="mt-1">{levelUpModal.subclass.desc}</p>
              </div>
            )}

            <button
              onClick={() => setLevelUpModal(null)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-sm cursor-pointer shadow-lg"
            >
              ⚔️ ¡Entendido, a la aventura!
            </button>
          </div>
        </div>
      )}

      {/* MODAL INTERACTIVO DE PUZZLE ENVIADO POR EL DM (6 mecánicas únicas) */}
      {activePuzzle && (
        <PuzzleModal
          heroName={hero.name}
          activePuzzle={activePuzzle}
          onResolve={resolvePuzzleAttempt}
          onClose={closeActivePuzzle}
        />
      )}

      {/* Encabezado Fijo Superior del Héroe (no se mueve al desplazar) */}
      <header
        className="shrink-0 px-4 py-3 border-b border-amber-800/40 bg-[#140e12] shadow-md z-20"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Sincronizado en Vivo con el DM
            </div>
            <h1 className="font-display text-xl font-black text-amber-200 leading-tight mt-0.5 truncate">
              {hero.name}
            </h1>
            <p className="text-[11px] text-stone-400 truncate">
              {hero.raceName} · {hero.className}
              {hero.subclass ? ` (${hero.subclass.name})` : ''}
            </p>
          </div>
          <div className="text-right shrink-0 flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('player', 'lobby');
                  window.history.replaceState({}, '', url.toString());
                  prevStateRef.current = { level: null, invCount: null, gold: null, maxPC: null, maxPM: null };
                  setHero(null);
                  setHeroId('lobby');
                }}
                className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-[10px] font-bold cursor-pointer"
                title="Cambiar a otro héroe"
              >
                🔄 Cambiar
              </button>
              <div className="px-2.5 py-1 rounded-xl bg-amber-600/20 border border-amber-500/60 text-amber-300 font-display font-black text-xs">
                Nivel {hero.level}
              </div>
            </div>
            <div className="text-[10px] text-stone-400">
              {hero.xp} {nextLvl ? `/ ${nextLvl.xp} XP` : 'XP (MÁX)'}
            </div>
          </div>
        </div>

        {isShock && (
          <div className="mt-2 p-2 rounded-xl bg-cyan-950/70 border border-cyan-400 text-cyan-200 text-[11px] font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            ¡ESTÁS EN SHOCK (0 PM)! Solo mueves 1d6, atacas con 1 DC y defiendes máx. 2 DC.
          </div>
        )}

        {/* Alerta en Tiempo Real del DM */}
        {liveAlert && (
          <div className="mt-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold text-xs shadow-lg flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 shrink-0" /> {liveAlert}
            </span>
            <button
              onClick={() => setLiveAlert(null)}
              className="px-2 py-0.5 rounded bg-black/20 font-black cursor-pointer shrink-0"
            >
              OK
            </button>
          </div>
        )}

        {/* Notificación rápida de acciones (pociones, hechizos, habilidades, intercambio) */}
        {actionToast && (
          <div className="mt-2 p-2 rounded-xl bg-emerald-700/95 border border-emerald-400/60 text-white text-xs font-bold text-center shadow-lg">
            {actionToast}
          </div>
        )}
      </header>

      {/* Zona Central Desplazable Independiente (el header y menú inferior nunca se mueven) */}
      <main
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-3.5 pb-6 space-y-3.5"
      >
        {/* ==================== TAB 1: MI HÉROE ==================== */}
        {tab === 'hero' && (
          <>
            {/* Contadores Táctiles de PC, PM, Oro e Inspiración */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grimoire-panel rounded-2xl p-3.5 text-center border-red-900/50">
                <div className="text-[11px] font-bold uppercase text-red-400 flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> Puntos de Cuerpo
                </div>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      pushHeroUpdate({
                        ...hero,
                        currentPC: Math.max(0, (hero.currentPC ?? hero.maxPC) - 1),
                      })
                    }
                    className="w-9 h-9 rounded-xl bg-red-950 border border-red-700 text-red-200 font-black text-lg cursor-pointer"
                  >
                    -
                  </button>
                  <div className="font-display text-2xl font-black text-white">
                    {hero.currentPC ?? hero.maxPC}
                    <span className="text-xs text-stone-400">/{hero.maxPC}</span>
                  </div>
                  <button
                    onClick={() =>
                      pushHeroUpdate({
                        ...hero,
                        currentPC: Math.min(hero.maxPC, (hero.currentPC ?? hero.maxPC) + 1),
                      })
                    }
                    className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-200 font-black text-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grimoire-panel rounded-2xl p-3.5 text-center border-cyan-900/50">
                <div className="text-[11px] font-bold uppercase text-cyan-400 flex items-center justify-center gap-1">
                  <Brain className="w-3.5 h-3.5" /> Puntos de Mente
                </div>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      pushHeroUpdate({
                        ...hero,
                        currentPM: Math.max(0, (hero.currentPM ?? hero.maxPM) - 1),
                      })
                    }
                    className="w-9 h-9 rounded-xl bg-stone-900 border border-cyan-800 text-cyan-300 font-black text-lg cursor-pointer"
                  >
                    -
                  </button>
                  <div className="font-display text-2xl font-black text-white">
                    {hero.currentPM ?? hero.maxPM}
                    <span className="text-xs text-stone-400">/{hero.maxPM}</span>
                  </div>
                  <button
                    onClick={() =>
                      pushHeroUpdate({
                        ...hero,
                        currentPM: Math.min(hero.maxPM, (hero.currentPM ?? hero.maxPM) + 1),
                      })
                    }
                    className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-200 font-black text-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Stats de Combate HQ (actualizados en vivo con Buffs/Debuffs) */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-900/50">
                <div className="text-[10px] text-stone-400">ATAQUE</div>
                <div className="font-black text-lg text-red-300">
                  {effectiveAttack} DC
                </div>
                {atkMod !== 0 && (
                  <div className={`text-[10px] font-bold ${atkMod > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ({atkMod > 0 ? `+${atkMod}` : atkMod})
                  </div>
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/50">
                <div className="text-[10px] text-stone-400">DEFENSA</div>
                <div className="font-black text-lg text-amber-200">
                  {effectiveDefend} DC
                </div>
                {defMod !== 0 && (
                  <div className={`text-[10px] font-bold ${defMod > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ({defMod > 0 ? `+${defMod}` : defMod})
                  </div>
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-900/50">
                <div className="text-[10px] text-stone-400">MOVIMIENTO</div>
                <div className="font-black text-base text-sky-200 mt-0.5">
                  {effectiveSpeed} cas
                </div>
                {spdMod !== 0 && (
                  <div className={`text-[10px] font-bold ${spdMod > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ({spdMod > 0 ? `+${spdMod}` : spdMod} mov)
                  </div>
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-amber-900/20 border border-amber-700/50">
                <div className="text-[10px] text-stone-400">ORO</div>
                <div className="font-black text-sm text-amber-300 mt-0.5">
                  {hero.gold} MO
                </div>
              </div>
            </div>

            {/* Profesión, Rasgo (Quirk), Familiar y Seguidores */}
            {(hero.professionId || hero.quirk || hero.familiar || (hero.followers || []).length > 0) && (
              <div className="grimoire-panel rounded-2xl p-3.5 border-purple-700/50 space-y-2 text-[11px]">
                <div className="font-bold uppercase tracking-wider text-purple-300">
                  🛠️ Identidad de Ciudad y Compañeros
                </div>
                {hero.professionId && (() => {
                  const p = PROFESSIONS.find((x) => x.id === hero.professionId);
                  return p ? (
                    <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800">
                      <strong className="text-amber-300">{p.icon} Profesión ({p.name}):</strong>{' '}
                      <span className="text-emerald-300">{p.cityBonus}</span>{' '}
                      <span className="text-stone-300">{p.dungeonBonus}</span>
                    </div>
                  ) : null;
                })()}
                {hero.quirk && (
                  <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800">
                    <strong className="text-purple-300">{hero.quirk.icon} Rasgo ({hero.quirk.name}):</strong>{' '}
                    <span className="text-emerald-300">+ {hero.quirk.bonus}</span>{' '}
                    <span className="text-red-300">- {hero.quirk.drawback}</span>
                  </div>
                )}
                {hero.familiar && (
                  <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-800/50">
                    <strong className="text-purple-200">{hero.familiar.icon} Familiar ({hero.familiar.name}):</strong>{' '}
                    <span className="text-stone-200">{hero.familiar.ability}</span>
                  </div>
                )}
                {(hero.followers || []).map((f) => (
                  <div key={f.id} className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/50">
                    <strong className="text-amber-200">🛡️ Seguidor: {f.name}</strong> ({f.stats}) — {f.ability}
                  </div>
                ))}
              </div>
            )}

            {/* Estados Activos (Completo, Ilustrado e Informado) */}
            {(() => {
              const activeIds = new Set(activeEffects.map((e) => e.id));
              return (
                <div className="grimoire-panel rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      Estados Activos
                    </span>
                    <button
                      onClick={advanceMyTurn}
                      className="px-2.5 py-1 rounded-lg bg-sky-900/70 border border-sky-700 text-sky-200 text-[10px] font-bold cursor-pointer"
                    >
                      +1 Turno
                    </button>
                  </div>

                  {activeEffects.length === 0 ? (
                    <p className="text-[11px] text-slate-400">
                      Sin estados activos ahora mismo. Toca cualquier estado del catálogo para activarlo o ver su regla y cura.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {activeEffects.map((ef) => {
                        const meta = STATUS_CATALOG.find((s) => s.id === ef.id);
                        return (
                          <div
                            key={ef.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                              meta?.color ||
                              (ef.type === 'debuff'
                                ? 'bg-red-950/60 border-red-600/70 text-red-100'
                                : 'bg-emerald-950/60 border-emerald-600/70 text-emerald-100')
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="font-black">
                                {ef.label} {ef.duration && ef.duration < 90 ? `(${ef.duration}t)` : ''}
                              </div>
                              <div className="text-[11px] opacity-90 leading-snug">
                                {ef.note || meta?.effect}
                              </div>
                              {meta?.cure && (
                                <div className="text-[10px] opacity-80">
                                  <strong>Cura:</strong> {meta.cure}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeEffect(ef.id)}
                              className="px-1.5 py-0.5 rounded bg-black/40 text-white text-xs cursor-pointer shrink-0"
                              title="Quitar estado"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <details className="pt-1 border-t border-slate-800/80">
                    <summary className="text-[11px] font-bold text-purple-300 cursor-pointer select-none">
                      📋 Ver / Marcar todos los Estados ({STATUS_CATALOG.length})
                    </summary>
                    <div className="mt-2.5 space-y-2.5">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase text-rose-300">Estados Negativos</div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {STATUS_CATALOG.filter((s) => s.type === 'debuff').map((s) => {
                            const isOn = activeIds.has(s.id);
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() =>
                                  isOn
                                    ? removeEffect(s.id)
                                    : addQuickDebuff({
                                        id: s.id,
                                        label: `${s.icon} ${s.name}`,
                                        type: 'debuff',
                                        duration: 99,
                                        note: s.effect,
                                      })
                                }
                                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                                  isOn ? `${s.color} ring-2 ring-white/50` : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-rose-500/60'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 text-xs font-black">
                                  <span>{s.icon} {s.name}</span>
                                  <span className="text-[10px]">{isOn ? '✓ ACTIVO' : '+ Marcar'}</span>
                                </div>
                                <div className="text-[10px] text-slate-300 mt-0.5 leading-snug">{s.effect}</div>
                                <div className="text-[10px] text-slate-400 leading-snug">Cura: {s.cure}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase text-emerald-300">Estados Positivos (Buffs)</div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {STATUS_CATALOG.filter((s) => s.type === 'buff').map((s) => {
                            const isOn = activeIds.has(s.id);
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() =>
                                  isOn
                                    ? removeEffect(s.id)
                                    : addQuickDebuff({
                                        id: s.id,
                                        label: `${s.icon} ${s.name}`,
                                        type: 'buff',
                                        duration: 3,
                                        note: s.effect,
                                      })
                                }
                                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                                  isOn ? `${s.color} ring-2 ring-white/50` : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-emerald-500/60'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 text-xs font-black">
                                  <span>{s.icon} {s.name}</span>
                                  <span className="text-[10px]">{isOn ? '✓ ACTIVO' : '+ Marcar'}</span>
                                </div>
                                <div className="text-[10px] text-slate-300 mt-0.5 leading-snug">{s.effect}</div>
                                <div className="text-[10px] text-slate-400 leading-snug">{s.cure}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              );
            })()}

            {/* Pilares del Héroe */}
            {(() => {
              const pillars = getHeroPillars(hero);
              return (
                <div className="grimoire-panel rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                      ⚡ Tus 4 Pilares (Bono a 1d20)
                    </h3>
                    <span className="text-[10px] text-slate-400">Fácil 10 · Media 12 · Difícil 15</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ATTRIBUTES.map((a) => {
                      const val = pillars[a.id] ?? 1;
                      return (
                        <div key={a.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-black ${a.color || 'text-amber-300'}`}>
                              {a.icon} {a.name}
                            </span>
                            <span className="text-lg font-black text-white">{formatMod(val)}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-snug">{a.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Identidad, Motivación, Alineamiento, Ventajas (Activables / Pasivas) y Desventajas */}
            <div className="grimoire-panel rounded-2xl p-4 space-y-2.5 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-amber-400">Rasgos, Alineamiento y Motivación</h3>
              <p className="text-stone-300"><strong>Raza:</strong> {hero.raceTrait}</p>
              {hero.alignment && (
                <p className="text-stone-300"><strong>Alineamiento:</strong> {hero.alignment}</p>
              )}
              {hero.motivation && (
                <p className="text-stone-300"><strong>Motivación ({hero.motivation.name}):</strong> {hero.motivation.desc}</p>
              )}
              <div className="space-y-2 pt-1">
                {(hero.perks || []).map((p) => {
                  const pAct = PERK_ACTIVE_ABILITIES[p.id];
                  const matchedAb = pAct ? getHeroActiveAbilities().find((a) => a.id === pAct.id) : null;
                  const cd = matchedAb ? cooldowns[matchedAb.id] || 0 : 0;
                  const rem = matchedAb
                    ? usesLeft[matchedAb.id] !== undefined
                      ? usesLeft[matchedAb.id]
                      : matchedAb.maxUses
                    : null;
                  const blocked = matchedAb && (cd > 0 || (matchedAb.maxUses !== null && rem <= 0));

                  return (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-100 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-emerald-300">✓ {p.name}</span>
                          {matchedAb ? (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-600/30 border border-amber-500/60 text-amber-200 font-bold">
                              ⚡ Activable ({rem}/{matchedAb.maxUses})
                            </span>
                          ) : (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300">
                              Pasiva
                            </span>
                          )}
                          <p className="text-[11px] text-stone-200 mt-0.5 leading-snug">{p.desc}</p>
                        </div>
                      </div>
                      {matchedAb && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-800/50">
                          {matchedAb.targetAlly && allHeroes.length > 0 && (
                            <select
                              value={allyTargetId || allHeroes.find((h) => h.id !== hero.id)?.id || hero.id}
                              onChange={(e) => setAllyTargetId(e.target.value)}
                              className="flex-1 px-2 py-1 rounded-lg bg-stone-950 border border-emerald-700/70 text-[11px] text-stone-100"
                            >
                              {allHeroes.map((h) => (
                                <option key={h.id} value={h.id}>
                                  Curar a: {h.name}{h.id === hero.id ? ' (Yo mismo)' : ''}
                                </option>
                              ))}
                            </select>
                          )}
                          <button
                            disabled={blocked}
                            onClick={() => triggerAbilityToDM(matchedAb)}
                            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-black text-[11px] cursor-pointer"
                          >
                            {cd > 0 ? `Enfriando (${cd}t)` : rem <= 0 ? '✓ Usado' : '⚡ Activar y Avisar al DM'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {(hero.flaws || []).map((f) => (
                  <div key={f.id} className="px-2.5 py-1.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200">
                    ✗ <strong>{f.name}:</strong> {f.desc}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ==================== TAB 2: EQUIPO E INVENTARIO (ORGANIZADO) ==================== */}
        {tab === 'gear' && (() => {
          const enrichedAll = (hero.inventory || []).map(enrichGearItem);
          const equippedItems = enrichedAll.filter((it) => it.equipped && !it.isConsumable);
          const consumableItems = enrichedAll.filter((it) => it.isConsumable);
          const backpackItems = enrichedAll.filter((it) => !it.equipped && !it.isConsumable);

          const activeWeaponDice = equippedItems
            .filter((it) => it.type === 'Arma' || it.type === 'Artefacto')
            .reduce((max, it) => Math.max(max, it.atkDiceVal || 0), 0);
          const activeDefBonus = equippedItems
            .filter((it) => it.type === 'Armadura')
            .reduce((sum, it) => sum + (it.defDiceVal || 0), 0);

          const renderItemCard = (it) => {
            const compat = checkCanEquip(it, hero.classId);
            const rMeta = getRarityMeta(it.rarity || 'comun');
            // Comparador automático contra tu arma equipada actual
            let compareBadge = null;
            if (!it.equipped && (it.type === 'Arma' || it.type === 'Artefacto') && it.atkDiceVal > 0 && activeWeaponDice > 0) {
              const diff = it.atkDiceVal - activeWeaponDice;
              if (diff > 0) {
                compareBadge = { text: `⬆️ Mejor (+${diff} DC vs tu arma)`, cls: 'bg-emerald-600 text-black' };
              } else if (diff < 0) {
                compareBadge = { text: `⬇️ Menor (${diff} DC vs tu arma)`, cls: 'bg-stone-800 text-stone-400' };
              } else {
                compareBadge = { text: `= Mismo ataque (${it.atkDiceVal} DC)`, cls: 'bg-stone-800 text-stone-300' };
              }
            }

            return (
              <div
                key={it.id}
                className={`p-3.5 rounded-2xl border-2 space-y-2 ${rMeta.border} ${
                  it.equipped ? 'bg-emerald-950/25' : 'grimoire-panel'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${rMeta.badge}`}>
                        {rMeta.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-800 text-amber-300">
                        {it.type}
                      </span>
                      {it.dice && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-red-200">
                          {it.dice}
                        </span>
                      )}
                      {it.equipped && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-black">
                          ✓ PUESTO
                        </span>
                      )}
                      {compareBadge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${compareBadge.cls}`}>
                          {compareBadge.text}
                        </span>
                      )}
                      {!compat.ok && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-900 text-red-200">
                          ⚠️ {compat.reason}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-stone-100 mt-1.5">
                      {it.name}
                    </h4>
                    {it.restriction && (
                      <div className="text-[10px] text-stone-400">Restricción: {it.restriction}</div>
                    )}
                  </div>
                </div>

                {it.effectText && (
                  <div className="text-xs text-emerald-100 bg-emerald-950/35 p-2.5 rounded-xl border border-emerald-800/40 leading-snug">
                    <strong>✨ Qué hace:</strong> {it.effectText}
                  </div>
                )}

                {it.flaw && (
                  <div className="text-xs text-red-200 bg-red-950/40 p-2.5 rounded-xl border border-red-800/50">
                    <strong>⚠️ Desventaja / Coste:</strong> {it.flaw}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {!it.isConsumable && compat.ok && (
                    <button
                      onClick={() => toggleEquipItem(it.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                        it.equipped
                          ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {it.equipped ? 'Guardar en Mochila' : 'Equipar'}
                    </button>
                  )}
                  {it.isConsumable && (
                    <button
                      onClick={() => consumeItem(it.id)}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black cursor-pointer"
                    >
                      🧪 Usar / Beber
                    </button>
                  )}
                  {allHeroes.filter((h) => h.id !== hero.id).length > 0 && (
                    <button
                      onClick={() => {
                        const others = allHeroes.filter((h) => h.id !== hero.id);
                        setTradeItemId(tradeItemId === it.id ? null : it.id);
                        if (!tradeTargetId && others[0]) setTradeTargetId(others[0].id);
                      }}
                      className="px-3 py-2 rounded-xl bg-sky-900/70 hover:bg-sky-800 border border-sky-600/60 text-sky-100 text-xs font-bold cursor-pointer"
                    >
                      🤝 Pasar
                    </button>
                  )}
                </div>

                {tradeItemId === it.id && allHeroes.filter((h) => h.id !== hero.id).length > 0 && (
                  <div className="p-2.5 rounded-xl bg-sky-950/50 border border-sky-700/60 flex flex-wrap items-center gap-2 text-xs">
                    <select
                      value={tradeTargetId || allHeroes.find((h) => h.id !== hero.id)?.id || ''}
                      onChange={(e) => setTradeTargetId(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-950 border border-sky-700 text-stone-100"
                    >
                      {allHeroes
                        .filter((h) => h.id !== hero.id)
                        .map((h) => (
                          <option key={h.id} value={h.id}>
                            Dar a: {h.name} ({h.className})
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() =>
                        transferItemToAlly(
                          it.id,
                          tradeTargetId || allHeroes.find((h) => h.id !== hero.id)?.id
                        )
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black cursor-pointer"
                    >
                      Enviar →
                    </button>
                  </div>
                )}
              </div>
            );
          };

          return (
            <div className="space-y-3.5">
              {/* Resumen Compacto de Recursos y Bonos Activos */}
              <div className="grimoire-panel rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-black text-amber-300">
                    <Coins className="w-4 h-4" /> {hero.gold} MO
                  </span>
                  <span className="text-stone-400 font-semibold">
                    Espacios: {enrichedAll.length}/10
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-800 grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="py-1.5 px-2 rounded-xl bg-red-950/35 border border-red-900/50 text-red-200 font-bold">
                    ⚔️ Arma: {activeWeaponDice > 0 ? `${activeWeaponDice} DC` : `${hero.attackDice} DC`}
                  </div>
                  <div className="py-1.5 px-2 rounded-xl bg-emerald-950/35 border border-emerald-900/50 text-emerald-200 font-bold">
                    🛡️ Armadura: +{activeDefBonus} Def
                  </div>
                </div>
              </div>

              {/* 4 Sub-Pestañas Limpias: Puesto, Uso, Mochila y Crafteo Digital */}
              <div className="grid grid-cols-4 gap-1 bg-stone-950/90 p-1 rounded-xl border border-stone-800 text-[10px] font-bold">
                <button
                  onClick={() => setGearSubTab('equipped')}
                  className={`py-2 rounded-lg cursor-pointer transition ${
                    gearSubTab === 'equipped'
                      ? 'bg-emerald-600 text-black shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  🛡️ Puesto ({equippedItems.length})
                </button>
                <button
                  onClick={() => setGearSubTab('consumables')}
                  className={`py-2 rounded-lg cursor-pointer transition ${
                    gearSubTab === 'consumables'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  🧪 Uso ({consumableItems.length})
                </button>
                <button
                  onClick={() => setGearSubTab('backpack')}
                  className={`py-2 rounded-lg cursor-pointer transition ${
                    gearSubTab === 'backpack'
                      ? 'bg-sky-500 text-black shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  🎒 Mochila ({backpackItems.length})
                </button>
                <button
                  onClick={() => setGearSubTab('craft')}
                  className={`py-2 rounded-lg cursor-pointer transition ${
                    gearSubTab === 'craft'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  ⚒️ Crafteo
                </button>
              </div>

              {enrichedAll.length === 0 && gearSubTab !== 'craft' ? (
                <div className="grimoire-panel rounded-2xl p-8 text-center text-stone-400 text-sm">
                  Tu mochila está vacía. Cuando encuentres tesoros, el DM te los enviará directo aquí.
                </div>
              ) : (
                <>
                  {gearSubTab === 'equipped' && (
                    <div className="space-y-2.5">
                      {equippedItems.length === 0 ? (
                        <div className="grimoire-panel rounded-2xl p-6 text-center text-stone-400 text-xs">
                          No llevas nada equipado aún. Ve a <strong>🎒 Mochila</strong> para equipar tu arma o armadura.
                        </div>
                      ) : (
                        equippedItems.map(renderItemCard)
                      )}
                    </div>
                  )}

                  {gearSubTab === 'consumables' && (
                    <div className="space-y-2.5">
                      {consumableItems.length === 0 ? (
                        <div className="grimoire-panel rounded-2xl p-6 text-center text-stone-400 text-xs">
                          No tienes pociones ni pergaminos en este momento.
                        </div>
                      ) : (
                        consumableItems.map(renderItemCard)
                      )}
                    </div>
                  )}

                  {gearSubTab === 'backpack' && (
                    <div className="space-y-2.5">
                      {backpackItems.length === 0 ? (
                        <div className="grimoire-panel rounded-2xl p-6 text-center text-stone-400 text-xs">
                          Todo tu equipo ya está puesto. Aquí aparecerán los tesoros nuevos que encuentres.
                        </div>
                      ) : (
                        backpackItems.map(renderItemCard)
                      )}
                    </div>
                  )}

                  {gearSubTab === 'craft' && (
                    <div className="space-y-3">
                      <div className="grimoire-panel rounded-2xl p-3.5 space-y-2">
                        <div className="text-xs font-bold text-purple-300">
                          🎒 Tu Bolsa de Materiales Digitales
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Cuando el DM te envíe materiales de monstruos, muebles o trampas aparecerán aquí automáticamente.
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          {MATERIALS_CATALOG.map((m) => {
                            const qty = Number(hero.materials?.[m.id] || 0);
                            return (
                              <div
                                key={m.id}
                                className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between ${
                                  qty > 0
                                    ? 'bg-stone-900 border-amber-700/60 text-stone-100'
                                    : 'bg-stone-950/60 border-stone-800/70 text-stone-500'
                                }`}
                              >
                                <span>{m.icon} {m.name}</span>
                                <strong className={qty > 0 ? 'text-amber-300' : ''}>×{qty}</strong>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grimoire-panel rounded-2xl p-3.5 space-y-2.5">
                        {(() => {
                          const qualified = isQualifiedAlchemist(hero);
                          const pillars = getHeroPillars(hero);
                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-xs font-bold text-amber-300">
                                  🧪 Alquimia en Campo
                                </div>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                    qualified
                                      ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                                      : 'bg-amber-950/70 border-amber-500/60 text-amber-200'
                                  }`}
                                >
                                  {qualified
                                    ? `✨ Calificado (Ventaja · +${Math.max(pillars.MEN, pillars.SUE) + 2})`
                                    : `🍀 Por Suerte (SUE ${formatMod(pillars.SUE)})`}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-snug">
                                Cualquiera puede intentar destilar en cualquier momento: los <strong>Calificados</strong> (Alquimista, Mago, Druida, Clérigo, Gnomo o Prof. Alquimista/Escriba) tiran con <strong>Ventaja</strong>. Sin formación depende de tu <strong>Suerte</strong> (puede salir perfecto, volverse <em>Poción de Destino Imprevisible</em> o fallar).
                              </p>

                              {craftOutcome && (
                                <div
                                  className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                                    craftOutcome.kind === 'crit'
                                      ? 'bg-amber-950/50 border-amber-400 text-amber-100'
                                      : craftOutcome.kind === 'ok'
                                      ? 'bg-emerald-950/45 border-emerald-500 text-emerald-100'
                                      : craftOutcome.kind === 'unstable'
                                      ? 'bg-purple-950/50 border-purple-500 text-purple-100'
                                      : 'bg-rose-950/55 border-rose-500 text-rose-100'
                                  }`}
                                >
                                  <div className="font-bold">{craftOutcome.title}</div>
                                  <div className="text-[11px]">{craftOutcome.text}</div>
                                </div>
                              )}

                              {CRAFTING_RECIPES.filter((r) => !r.onlyInCity && r.id !== 'rec_mejora_artefacto').map((r) => {
                                const canCraft = Object.entries(r.ingredients).every(
                                  ([mId, q]) => Number(hero.materials?.[mId] || 0) >= q
                                );
                                return (
                                  <div
                                    key={r.id}
                                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                      canCraft
                                        ? 'bg-emerald-950/25 border-emerald-700/60'
                                        : 'bg-stone-950/70 border-stone-800 opacity-75'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <strong className="text-amber-200">{r.name}</strong>
                                      <span className="text-[10px] text-emerald-300 font-bold shrink-0">{r.dice}</span>
                                    </div>
                                    <p className="text-[11px] text-stone-300">{r.effect}</p>
                                    <div className="flex flex-wrap gap-1">
                                      {Object.entries(r.ingredients).map(([mId, q]) => {
                                        const mat = getMaterialById(mId);
                                        const have = Number(hero.materials?.[mId] || 0);
                                        return (
                                          <span
                                            key={mId}
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                              have >= q ? 'bg-emerald-900/60 text-emerald-200' : 'bg-red-950/60 text-red-300'
                                            }`}
                                          >
                                            {mat.icon} {mat.name} {have}/{q}
                                          </span>
                                        );
                                      })}
                                    </div>
                                    {canCraft && (
                                      <button
                                        onClick={async () => {
                                          const res = rollPotionCraftAttempt(hero, r);
                                          const nextMats = { ...(hero.materials || {}) };
                                          Object.entries(r.ingredients).forEach(([mId, q]) => {
                                            nextMats[mId] = Math.max(0, Number(nextMats[mId] || 0) - q);
                                          });
                                          const nextInv = [...(hero.inventory || [])];
                                          let nextPC = hero.currentPC ?? hero.maxPC;
                                          if (res.pcLoss) nextPC = Math.max(0, nextPC - res.pcLoss);
                                          if (res.item) {
                                            const copies = 1 + (res.qtyBonus || 0);
                                            for (let n = 0; n < copies; n++) {
                                              nextInv.push({
                                                id: `mob-craft-${Date.now()}-${n}`,
                                                ...res.item,
                                                traits: res.item.special,
                                                equipped: false,
                                                qty: 1,
                                              });
                                            }
                                          }
                                          const kindMap = {
                                            critico: 'crit',
                                            exito: 'ok',
                                            imprevisible: 'unstable',
                                            fallo: 'fail',
                                          };
                                          const outcomeObj = {
                                            kind: kindMap[res.outcome] || 'ok',
                                            title: res.title,
                                            text: res.text,
                                          };
                                          await pushHeroUpdate({
                                            ...hero,
                                            currentPC: nextPC,
                                            materials: nextMats,
                                            inventory: nextInv,
                                          });
                                          setCraftOutcome(outcomeObj);
                                          await notifyDMAction({
                                            abilityName: `🧪 Alquimia: ${r.name}`,
                                            attackDice: 0,
                                            damageType: 'Alquimia',
                                            description: `${outcomeObj.title} — ${outcomeObj.text}`,
                                          });
                                        }}
                                        className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] cursor-pointer"
                                      >
                                        {qualified ? '✨ Destilar con Ventaja' : '🍀 Intentar por Suerte'}
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          );
                        })()}
                      </div>
                      <div className="p-2.5 rounded-xl bg-sky-950/35 border border-sky-700/50 text-[11px] text-sky-200">
                        🏛️ <strong>Forja de Armas y Armaduras:</strong> El equipo por rareza (Común → Legendario) solo puede forjarse visitando la <strong>Herrería de la Ciudad</strong> entre misiones.
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}

        {/* ==================== TAB 3: HABILIDADES Y MAGIA ==================== */}
        {tab === 'skills' && (
          <div className="space-y-4">
            {/* Preparación de Misión: Intercambiar Escuelas de Hechizos o Técnicas de Combate */}
            {(() => {
              const loadout = getHeroLoadoutConfig(hero);
              const isSchools = loadout.mode === 'schools';
              const currentSelected = isSchools
                ? Array.isArray(hero.selectedSchools) && hero.selectedSchools.length > 0
                  ? hero.selectedSchools
                  : loadout.defaults
                : Array.isArray(hero.selectedTechniques) && hero.selectedTechniques.length > 0
                ? hero.selectedTechniques
                : loadout.defaults;

              const togglePick = async (val) => {
                const exists = currentSelected.includes(val);
                let next;
                if (exists) {
                  if (currentSelected.length <= 1) return; // Siempre mantener al menos 1
                  next = currentSelected.filter((x) => x !== val);
                } else {
                  if (currentSelected.length >= loadout.maxPicks) {
                    next = [...currentSelected.slice(1), val];
                  } else {
                    next = [...currentSelected, val];
                  }
                }
                await pushHeroUpdate(
                  isSchools
                    ? { ...hero, selectedSchools: next }
                    : { ...hero, selectedTechniques: next }
                );
                showToast(
                  isSchools
                    ? `🔮 Escuelas preparadas: ${next.join(', ')}`
                    : `⚔️ Técnicas preparadas actualizadas (${next.length}/${loadout.maxPicks})`
                );
              };

              return (
                <details className="grimoire-panel rounded-2xl p-3.5 border-purple-600/50 space-y-2.5">
                  <summary className="text-xs font-black uppercase tracking-wider text-purple-300 cursor-pointer flex items-center justify-between">
                    <span>
                      🎯 Preparar para esta Misión ({currentSelected.length}/{loadout.maxPicks}{' '}
                      {isSchools ? 'Escuelas' : 'Técnicas'})
                    </span>
                    <span className="text-[10px] font-bold text-amber-300">Cambiar ▾</span>
                  </summary>
                  <p className="text-[11px] text-slate-300 leading-snug pt-1">
                    {isSchools
                      ? `Antes de iniciar una misión puedes intercambiar qué ${loadout.maxPicks} escuela(s) de magia llevarás preparadas:`
                      : `Antes de iniciar una misión puedes elegir qué ${loadout.maxPicks} Técnicas de Combate llevarás equipadas:`}
                  </p>
                  <div className={isSchools ? 'grid grid-cols-2 gap-1.5' : 'space-y-1.5'}>
                    {isSchools
                      ? loadout.options.map((sch) => {
                          const on = currentSelected.includes(sch);
                          return (
                            <button
                              key={sch}
                              type="button"
                              onClick={() => togglePick(sch)}
                              className={`p-2 rounded-xl border text-xs font-bold text-left cursor-pointer transition flex items-center justify-between ${
                                on
                                  ? 'bg-purple-700/80 border-purple-400 text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500/60'
                              }`}
                            >
                              <span>🔮 {sch}</span>
                              <span className="text-[10px]">{on ? '✓' : '+'}</span>
                            </button>
                          );
                        })
                      : COMBAT_TECHNIQUES.map((tech) => {
                          const on = currentSelected.includes(tech.id);
                          return (
                            <button
                              key={tech.id}
                              type="button"
                              onClick={() => togglePick(tech.id)}
                              className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition space-y-0.5 ${
                                on
                                  ? 'bg-amber-950/50 border-amber-400 text-amber-100'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 text-xs font-black">
                                <span>{tech.icon} {tech.name}</span>
                                <span className="text-[10px]">{on ? '✓ EQUIPADA' : '+ Elegir'}</span>
                              </div>
                              <div className="text-[10px] text-slate-300 leading-snug">{tech.desc}</div>
                            </button>
                          );
                        })}
                  </div>
                </details>
              );
            })()}

            {/* Botones de Activación de Habilidades con Cooldown / Usos (Notifican en Vivo al DM) */}
            <div className="grimoire-panel rounded-2xl p-4 space-y-3 border-amber-600/50">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-red-400" /> Activar Acción / Habilidad (Avisa al DM)
                </h3>
                <div className="flex gap-1.5">
                  <button
                    onClick={advanceMyTurn}
                    className="px-2.5 py-1 rounded-lg bg-sky-800 hover:bg-sky-700 text-white text-[10px] font-bold cursor-pointer"
                  >
                    +1 Turno
                  </button>
                  <button
                    onClick={resetMissionUses}
                    className="px-2 py-1 rounded-lg bg-stone-800 text-stone-300 text-[10px] font-bold cursor-pointer"
                  >
                    Reiniciar
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {getHeroActiveAbilities().map((ab) => {
                  const cd = cooldowns[ab.id] || 0;
                  const rem = usesLeft[ab.id] !== undefined ? usesLeft[ab.id] : ab.maxUses;
                  const curPM = hero.currentPM ?? hero.maxPM;
                  const noPM = (ab.costPM || 0) > curPM;
                  const blocked = cd > 0 || (ab.maxUses !== null && rem <= 0) || noPM;
                  const chosenDragonEl = hero.dragonElement || (hero.raceName?.includes('Hielo') ? 'Hielo' : 'Fuego');
                  const usedLvl1Spells = getHeroSpells().filter((s) => s.level === 1 && usedSpells.includes(s.id));

                  return (
                    <div
                      key={ab.id}
                      className={`p-3 rounded-xl border space-y-2 ${
                        blocked
                          ? 'bg-stone-950/60 border-stone-800 opacity-65'
                          : 'bg-stone-900/90 border-amber-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-amber-200 flex flex-wrap items-center gap-1.5">
                            <span>{ab.name}</span>
                            {ab.costPM > 0 && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-200">
                                Coste: {ab.costPM} PM
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-300 mt-0.5 leading-snug">{ab.desc}</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-200 shrink-0">
                          {ab.dice > 0 ? `${ab.dice} DC · ${ab.damageType}` : ab.damageType}
                        </span>
                      </div>

                      {/* Selector de elemento para Sangre de Dragón */}
                      {ab.chooseElement && (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-stone-400">Elemento:</span>
                          {['Fuego', 'Hielo'].map((el) => (
                            <button
                              key={el}
                              type="button"
                              onClick={() => pushHeroUpdate({ ...hero, dragonElement: el })}
                              className={`px-2.5 py-0.5 rounded-lg font-bold border cursor-pointer ${
                                chosenDragonEl === el
                                  ? 'bg-amber-600 text-black border-amber-300'
                                  : 'bg-stone-950 text-stone-400 border-stone-700'
                              }`}
                            >
                              {el === 'Fuego' ? '🔥 Fuego' : '❄️ Hielo'}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Selector de aliado objetivo para habilidades de curación (ej: Manos Sanadoras, Imposición de Manos) */}
                      {ab.targetAlly && allHeroes.length > 0 && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-emerald-300 font-bold shrink-0">💚 ¿A quién curas?:</span>
                          <select
                            value={allyTargetId || allHeroes.find((h) => h.id !== hero.id)?.id || hero.id}
                            onChange={(e) => setAllyTargetId(e.target.value)}
                            className="flex-1 px-2 py-1 rounded-lg bg-stone-950 border border-emerald-700/70 text-stone-100"
                          >
                            {allHeroes.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.name}{h.id === hero.id ? ' (Yo mismo)' : ''} ({h.currentPC ?? h.maxPC}/{h.maxPC} PC)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] font-semibold text-stone-300">
                          {ab.maxUses === null
                            ? ab.costPM > 0
                              ? `🔮 Usa tus PM (${curPM}/${hero.maxPM})`
                              : '♾️ Uso libre (no se agota)'
                            : `Usos: ${rem}/${ab.maxUses} por misión`}
                          {cd > 0 && <span className="text-sky-400 ml-2">⏳ Cooldown: {cd}t</span>}
                        </div>
                        <div className="flex gap-1.5">
                          {ab.canRechargeSpell && usedLvl1Spells.length > 0 && (
                            <button
                              disabled={curPM < 1}
                              onClick={() => setRechargePickerOpen((v) => !v)}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 disabled:opacity-40 text-white text-[11px] font-bold cursor-pointer"
                            >
                              🔄 Recargar Hechizo (-1 PM)
                            </button>
                          )}
                          <button
                            disabled={blocked}
                            onClick={() => triggerAbilityToDM(ab)}
                            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                          >
                            {cd > 0
                              ? `Enfriando (${cd})`
                              : ab.maxUses !== null && rem <= 0
                              ? 'Agotado'
                              : noPM
                              ? 'Sin PM'
                              : '⚡ Activar'}
                          </button>
                        </div>
                      </div>

                      {ab.canRechargeSpell && rechargePickerOpen && usedLvl1Spells.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-700/60 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase text-purple-300">
                            Elige un hechizo de Nivel 1 usado para recargarlo (-1 PM):
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {usedLvl1Spells.map((sp) => (
                              <button
                                key={sp.id}
                                onClick={() => rechargeSpellWithEther(sp.id)}
                                className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold cursor-pointer"
                              >
                                ✨ {sp.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Si la raza es puramente PASIVA, mostrarla claramente como pasiva siempre activa */}
              {RACIAL_ACTIONS[hero.raceId] && !RACIAL_ACTIONS[hero.raceId].active && (
                <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-800/50 text-xs">
                  <div className="font-bold text-emerald-300">
                    ✨ Rasgo Racial Pasivo (Siempre Activo): {raceData?.traitName || hero.raceName}
                  </div>
                  <p className="text-stone-300 mt-0.5 leading-snug">{raceData?.traitDesc || hero.raceTrait}</p>
                </div>
              )}
            </div>

            {/* Grimorio / Hechizos Interactivos (1 uso por misión -> se deshabilita al lanzar) */}
            {getHeroSpells().length > 0 && (
              <div className="grimoire-panel rounded-2xl p-4 space-y-2.5 border-purple-700/50">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    📜 Tus Hechizos / Cantos ({getHeroSpells().length - usedSpells.filter((id) => getHeroSpells().some((s) => s.id === id)).length}/{getHeroSpells().length} disponibles)
                  </h3>
                  <span className="text-[10px] text-stone-400">1 uso por misión</span>
                </div>
                <div className="space-y-2 text-xs">
                  {getHeroSpells().map((sp) => {
                    const isUsed = usedSpells.includes(sp.id);
                    const curPM = hero.currentPM ?? hero.maxPM;
                    const noPM = (sp.costPM || 0) > curPM;
                    return (
                      <div
                        key={sp.id}
                        className={`p-3 rounded-xl border transition space-y-1.5 ${
                          isUsed
                            ? 'bg-stone-950/50 border-stone-800/80 opacity-50'
                            : 'bg-stone-950 border-purple-900/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className={`font-bold flex flex-wrap items-center gap-1.5 ${isUsed ? 'line-through text-stone-500' : 'text-purple-200'}`}>
                              <span>[{sp.school}] {sp.name}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                                (sp.spellLevel || 1) > 1
                                  ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60'
                                  : 'bg-stone-800 text-stone-300 border border-stone-700'
                              }`}>
                                Nv.{sp.spellLevel || 1}
                              </span>
                              {sp.effectiveDice > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-200 border border-rose-700/60">
                                  {sp.effectiveDice} DC
                                </span>
                              )}
                              {sp.effectiveHealPC > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-200 border border-emerald-700/60">
                                  +{sp.effectiveHealPC} PC
                                </span>
                              )}
                              {sp.costPM > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                                  -{sp.costPM} PM
                                </span>
                              )}
                            </div>
                            <p className="text-stone-300 mt-0.5 leading-snug">{sp.desc}</p>
                            {sp.upgradeBonusText && (
                              <p className="text-[10px] text-amber-300 mt-0.5 font-semibold">
                                ★ Mejora Nv.{sp.spellLevel} ({sp.upgradeTag}): {sp.upgradeBonusText}
                              </p>
                            )}
                          </div>
                          <button
                            disabled={isUsed || noPM}
                            onClick={() => castSpell(sp)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer ${
                              isUsed
                                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                                : noPM
                                ? 'bg-stone-800 text-red-300 cursor-not-allowed'
                                : 'bg-purple-700 hover:bg-purple-600 text-white'
                            }`}
                          >
                            {isUsed ? '✓ Usado' : noPM ? 'Sin PM' : '✨ Lanzar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hero.subclass && (
              <div className="grimoire-panel rounded-2xl p-4 border-purple-700/50 text-xs text-purple-100">
                <div className="text-[10px] font-bold uppercase text-purple-300">Subclase Desbloqueada</div>
                <div className="font-bold text-sm text-white mt-0.5">{hero.subclass.name}</div>
                <p className="mt-1">{hero.subclass.desc}</p>
              </div>
            )}

            {/* Progresión de Clase: SOLO muestra hasta el nivel actual (niveles futuros son sorpresa) */}
            {clsData?.progression && (
              <div className="grimoire-panel rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Tu Progresión de Clase (Nivel {hero.level})
                </h3>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(clsData.progression).map(([lvlNum, desc]) => {
                    const num = Number(lvlNum);
                    const unlocked = num <= hero.level;
                    return (
                      <div
                        key={lvlNum}
                        className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                          unlocked
                            ? 'bg-emerald-950/30 border-emerald-700/50 text-stone-100'
                            : 'bg-stone-950/60 border-stone-800/70 text-stone-500'
                        }`}
                      >
                        <span className={`font-bold shrink-0 ${unlocked ? 'text-emerald-400' : 'text-stone-600'}`}>
                          {unlocked ? '✓' : '🔒'} Nv.{lvlNum}
                        </span>
                        <span className="leading-snug">
                          {unlocked ? (
                            desc.startsWith('[Activable]') ? (
                              <>
                                <span className="inline-block px-1.5 py-0.5 mr-1 rounded bg-amber-600/30 border border-amber-500/60 text-amber-200 text-[10px] font-bold">
                                  ⚡ Activable arriba
                                </span>
                                {desc.replace('[Activable]', '').trim()}
                              </>
                            ) : desc.startsWith('[Pasiva]') ? (
                              <>
                                <span className="inline-block px-1.5 py-0.5 mr-1 rounded bg-emerald-900/50 border border-emerald-600/60 text-emerald-200 text-[10px] font-bold">
                                  ✨ Pasiva
                                </span>
                                {desc.replace('[Pasiva]', '').trim()}
                              </>
                            ) : (
                              desc
                            )
                          ) : (
                            'Poder secreto — Se revelará automáticamente cuando el DM te suba de nivel.'
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: GUÍA ÚNICA DE TU PERSONAJE Y REGLAS ==================== */}
        {tab === 'guide' && (
          <div className="space-y-4 text-xs leading-relaxed">
            {/* Guía Personalizada Exclusiva para la Clase de este Héroe */}
            {CLASS_PERSONAL_GUIDES[hero.classId] && (
              <div className="grimoire-panel rounded-2xl p-4 space-y-2 border-amber-500/60 bg-amber-950/20">
                <h3 className="font-display text-base font-bold text-amber-300">
                  ⚔️ Cómo Jugar tu {hero.className}
                </h3>
                <p className="text-stone-100 font-semibold">
                  {CLASS_PERSONAL_GUIDES[hero.classId].summary}
                </p>
                <p className="text-stone-200">
                  <strong className="text-amber-300">En tu turno:</strong>{' '}
                  {CLASS_PERSONAL_GUIDES[hero.classId].howToPlay}
                </p>
                <p className="text-emerald-200 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/50">
                  <strong>💡 Consejo Pro:</strong> {CLASS_PERSONAL_GUIDES[hero.classId].proTip}
                </p>
              </div>
            )}

            <div className="grimoire-panel rounded-2xl p-4 space-y-2">
              <h3 className="font-display text-base font-bold text-amber-300 flex items-center gap-1.5">
                <Dices className="w-4 h-4" /> ¿Qué Representa Cada Dado?
              </h3>
              <div className="space-y-1.5 text-stone-200">
                <p>• <strong>💀 Calavera (Dado HeroQuest):</strong> 1 Impacto al atacar.</p>
                <p>• <strong>🛡️ Escudo Blanco (Dado HeroQuest):</strong> Bloquea 1 Calavera cuando te defiendes.</p>
                <p>• <strong>🖤 Escudo Negro (Dado HeroQuest):</strong> Defensa de los monstruos (y daño especial para herir Espectros Etéreos con armas normales).</p>
                <p>• <strong>🎲 Dado de 20 caras (d20):</strong> Pruebas de habilidad y salvaciones (`d20 + Mod + Comp`). <strong>Fácil 10 · Media 13 · Difícil 16 · Legendaria 19</strong>.</p>
                <p>• <strong>⭐ Dado de Destino (d20 en ataque):</strong> Sacar <strong>20 Natural</strong> = +1 Calavera Crítica indefendible. Sacar <strong>1 Natural</strong> = Pifia (+1 Reloj del Caos).</p>
                <p>• <strong>Ventaja / Desventaja:</strong> Con Ventaja repites 1 Dado de Combate (o tiras 2d20 y tomas el mayor). Con Desventaja tomas el menor.</p>
              </div>
            </div>

            <div className="grimoire-panel rounded-2xl p-4 space-y-2">
              <h3 className="font-display text-base font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Qué PUEDES Hacer en tu Turno
              </h3>
              <p className="text-stone-300">En cada turno haces <strong>1 Movimiento + 1 Acción Principal</strong> (en el orden que quieras) + <strong>Acciones Gratuitas</strong>:</p>
              <ul className="list-disc list-inside space-y-1 text-stone-200">
                <li><strong>Mover:</strong> 8 casillas fijas sin enemigos visibles; o <strong>2d6 + Mod. DES</strong> en combate.</li>
                <li><strong>Acción Principal (elige 1):</strong> Atacar, Lanzar Hechizo, Buscar Tesoros, Buscar Trampas, Buscar Puertas Secretas, Desarmar Trampa, Examinar Mueble o Cambiar Armadura.</li>
                <li><strong>Acciones Gratuitas:</strong> Beber poción, abrir puerta, volcar una mesa (FUE CD 11 → +1 Def cobertura), o pasar un objeto guardado a un aliado adyacente.</li>
                <li><strong>Empujar:</strong> Si haces al menos 1 herida cuerpo a cuerpo, puedes empujar al monstruo 1 casilla y ocupar su lugar.</li>
              </ul>
            </div>

            <div className="grimoire-panel rounded-2xl p-4 space-y-2 border-red-900/50">
              <h3 className="font-display text-base font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Qué NO Puedes Hacer
              </h3>
              <ul className="list-disc list-inside space-y-1 text-stone-200">
                <li><strong>NO</strong> puedes buscar Tesoros, Trampas ni Puertas Secretas si hay monstruos en la habitación o en tu Línea de Visión.</li>
                <li><strong>NO</strong> puedes moverte en diagonal (solo atacar en diagonal si tu arma dice «Diagonal»).</li>
                <li><strong>NO</strong> puedes usar Escudo si empuñas un arma a 2 manos.</li>
                <li><strong>NO</strong> puedes atacar a distancia si tienes un enemigo adyacente.</li>
                <li>Si llegas a <strong>0 PM (Shock)</strong>, solo mueves 1d6, atacas con 1 DC, defiendes máx. 2 DC y no puedes buscar hasta curar 1 PM.</li>
              </ul>
            </div>

            {/* Novedades HQ-D20 v2 (Crafteo, Ciudad, Supervivencia y Cartas Oficiales) */}
            <div className="grimoire-panel rounded-2xl p-4 space-y-2 border-purple-700/50">
              <h3 className="font-display text-base font-bold text-purple-300">
                ✨ Reglas Clave HQ-D20 v2 (Misiones + Ciudad)
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-stone-200">
                <li><strong>🛠️ Trampas y Materiales:</strong> Si desarmas una trampa mecánica (Lanza o Roca), el DM te envía directo el <strong>Material de Crafteo</strong> (Veneno o Acero) a tu mochila.</li>
                <li><strong>⚒️ Crafteo Digital y Botica Oficial:</strong> Combina materiales en <em>Equipo → Crafteo</em> o compra cualquiera de las <strong>20 Pociones Oficiales</strong> en la Torre del Alquimista. La <strong>Herrería</strong> forja y mejora Artefactos (Nv.1–5).</li>
                <li><strong>🔥 Modo Relajado vs Supervivencia:</strong> En <strong>Supervivencia</strong>, los monstruos ganan +1 PC, los Jefes son Élite y las trampas +2 CD, pero recibes <strong>+25% XP y +20% Oro</strong> (y usa el Banco en Ciudad para evitar robos).</li>
                <li><strong>🏛️ Ciudad Viva:</strong> Entre misiones visiten El Bastión para descansar, comer Banquetes, elegir contratos del Tablón y usar tu <strong>Profesión (-20%)</strong>.</li>
                <li><strong>🎴 Cartas Oficiales:</strong> Tesoros, Trampas, Artefactos, Hechizos Elementales y Habilidades del Caballero están 100% integrados al sistema HQ-D20 v2.</li>
              </ul>
            </div>
          </div>
        )}
        {/* ==================== TAB 5: CIUDAD INDIVIDUAL (SOLO CUANDO EL DM LA ABRE) ==================== */}
        {tab === 'city' && cityOpen && (() => {
          const totalRep = Number(hero.reputation || 0) + Number(hero.fame || 0);
          const fameTier = getHeroFameTier(totalRep);
          const myProf = PROFESSIONS.find((p) => p.id === hero.professionId);
          const calcMyPrice = (base, district) => {
            let disc = fameTier.discount;
            if (myProf?.districtId === district) disc += 0.2;
            return Math.max(0, Math.round(base * (1 - Math.min(0.45, disc))));
          };
          const innCost = fameTier.freeInn ? 0 : calcMyPrice(20, 'taberna');
          const sellRate = hero.professionId === 'mercader' ? 0.65 : 0.45;
          const getSellPrice = (item) => {
            const rar = `${item.rarity || 'comun'}`.toLowerCase();
            const baseVal =
              rar === 'legendario' ? 500 : rar === 'epico' ? 300 : rar === 'raro' ? 180 : rar === 'poco_comun' ? 90 : 35;
            return Math.max(10, Math.round(baseVal * sellRate));
          };

          const displayArrival =
            arrivalStory ||
            `Las grandes puertas de piedra de El Bastión se abren ante ti, ${hero.name}. Es tu momento de recorrer la ciudad a tu ritmo.`;

          // PASO 1 (INDIVIDUAL POR CELULAR): PORTADA NARRATIVA DE ENTRADA A LA CIUDAD (FIJA, NO CAMBIA)
          if (cityPhase === 'gate') {
            return (
              <div className="space-y-4">
                <div className="grimoire-panel rounded-3xl p-5 border-amber-500/60 bg-gradient-to-b from-amber-950/35 to-slate-950 space-y-4 text-center shadow-2xl">
                  <div className="text-4xl">🏛️</div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                      El Bastión de los Héroes {cityModeMobile === 'survival' ? '· 🔥 Supervivencia' : ''}
                    </div>
                    <h2 className="font-display text-2xl font-black text-amber-100 mt-1">
                      Llegada a la Ciudad
                    </h2>
                  </div>
                  <p className="font-lore text-sm italic text-amber-50/95 leading-relaxed bg-black/35 p-4 rounded-2xl border border-amber-800/40 text-left">
                    “{displayArrival}”
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Al cruzar las puertas vivirás un <strong>evento personal único para {hero.name}</strong> (independiente del resto del grupo).
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const ev = generatePersonalCityEvent(hero, cityModeMobile);
                      if (cityVisitId) {
                        try {
                          localStorage.setItem(`hq_city_entered_${hero.id}`, String(cityVisitId));
                        } catch {
                          // ignore
                        }
                      }
                      setPersonalCityEvent(ev);
                      setPersonalEventOutcome('');
                      setCityPhase('event');
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-display font-black text-base shadow-xl cursor-pointer"
                  >
                    🚪 Entrar a la Ciudad
                  </button>
                </div>
              </div>
            );
          }

          // PASO 2 (INDIVIDUAL POR CELULAR): EVENTO PERSONAL INTERACTIVO DE ESTE HÉROE
          if (cityPhase === 'event' && personalCityEvent) {
            return (
              <div className="space-y-4">
                <div className="grimoire-panel rounded-3xl p-5 border-purple-500/70 bg-gradient-to-b from-purple-950/35 to-slate-950 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-600/30 border border-purple-400/60 text-purple-200">
                      {personalCityEvent.tag}
                    </span>
                    <span className="text-[11px] font-bold text-amber-300">{hero.name}</span>
                  </div>
                  <h3 className="font-display text-xl font-black text-amber-100">
                    {personalCityEvent.title}
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed bg-black/35 p-3.5 rounded-2xl border border-slate-800">
                    {personalCityEvent.story}
                  </p>

                  {!personalEventOutcome ? (
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        ¿Qué decides hacer?
                      </div>
                      {personalCityEvent.choices.map((ch, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={async () => {
                            const eff = ch.riskyCheck
                              ? Math.random() < (ch.riskyCheck.successChance ?? 0.35)
                                ? ch.riskyCheck.success
                                : ch.riskyCheck.fail
                              : ch;
                            const nextMats = { ...(hero.materials || {}) };
                            if (eff.materialId && eff.materialQty) {
                              nextMats[eff.materialId] =
                                Number(nextMats[eff.materialId] || 0) + Number(eff.materialQty);
                            }
                            let nextEffects = [...(hero.activeEffects || [])];
                            if (eff.buff) {
                              nextEffects = [
                                ...nextEffects.filter((e) => e.id !== eff.buff.id),
                                eff.buff,
                              ];
                            }
                            await pushHeroUpdate({
                              ...hero,
                              gold: Math.max(0, (hero.gold || 0) + (eff.goldDelta || 0)),
                              xp: (hero.xp || 0) + (eff.xpDelta || 0),
                              fame: Math.max(0, (hero.fame || 0) + (eff.fameDelta || 0)),
                              reputation: Math.max(0, (hero.reputation || 0) + (eff.repDelta || 0)),
                              currentPC: Math.max(
                                1,
                                Math.min(hero.maxPC, (hero.currentPC ?? hero.maxPC) + (eff.pcDelta || 0))
                              ),
                              currentPM: Math.max(
                                0,
                                Math.min(hero.maxPM, (hero.currentPM ?? hero.maxPM) + (eff.healPM || 0))
                              ),
                              materials: nextMats,
                              activeEffects: nextEffects,
                            });
                            setPersonalEventOutcome(eff.outcome);
                            showToast(`✨ Evento resuelto para ${hero.name}`);
                          }}
                          className="w-full py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-amber-500/20 border border-amber-600/60 text-left text-xs font-bold text-amber-100 cursor-pointer transition"
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="p-3.5 rounded-2xl bg-emerald-950/45 border border-emerald-500/60 text-xs text-emerald-100 leading-relaxed">
                        <strong className="text-emerald-300">Resultado:</strong> {personalEventOutcome}
                      </div>
                      <button
                        type="button"
                        onClick={() => setCityPhase('districts')}
                        className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-sm cursor-pointer shadow-lg"
                      >
                        🏛️ Continuar a los Distritos
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              {/* Perfil Unificado de Reputación del Héroe */}
              <div className="grimoire-panel rounded-2xl p-4 border-emerald-500/50 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display font-bold text-base text-emerald-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> El Bastión — Tu Visita
                  </div>
                  <span className="text-xs font-black text-amber-300">{hero.gold || 0} MO</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/35 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Tu Reputación en El Bastión</div>
                    <div className="font-black text-emerald-300">🏅 {totalRep} · {fameTier.rank}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 font-bold">
                    {fameTier.discount > 0 ? `-${Math.round(fameTier.discount * 100)}% Ciudad` : 'Rango Base'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{fameTier.perk}</p>
                {myProf && (
                  <div className="text-[11px] text-purple-200 bg-purple-950/35 p-2 rounded-lg border border-purple-500/30">
                    <strong>{myProf.icon} {myProf.name}:</strong> {myProf.cityBonus}
                  </div>
                )}

                {/* Selector de Secciones de la Ciudad (1 sección a la vez, ordenado y sin amontonar) */}
                <div className="grid grid-cols-5 gap-1 pt-2 border-t border-slate-800">
                  {[
                    { id: 'posada', icon: '🍺', label: 'Posada' },
                    { id: 'herreria', icon: '⚒️', label: 'Herrería' },
                    { id: 'alquimista', icon: '🧪', label: 'Alquimia' },
                    { id: 'gremio', icon: '🐾', label: 'Gremio' },
                    { id: 'banco', icon: '🏦', label: 'Banco' },
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setMobileCitySection(sec.id)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black flex flex-col items-center gap-0.5 border cursor-pointer transition ${
                        mobileCitySection === sec.id
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                          : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-600/60'
                      }`}
                    >
                      <span className="text-sm leading-none">{sec.icon}</span>
                      <span>{sec.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ==================== SECCIÓN 1: POSADA, BANQUETES Y CONTRATOS ==================== */}
              {mobileCitySection === 'posada' && (
                <div className="space-y-4">
              {/* Tablón de Contratos de la Taberna (Votación en Vivo — Sin Spoilers) */}
              {cityContracts.length > 0 && (
                <div className="grimoire-panel rounded-2xl p-4 space-y-2.5 border-amber-500/50">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      📜 Tablón de Contratos (Vota tu Próxima Aventura)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Vota por el encargo que prefieras. El DM verá los votos del grupo en vivo para preparar el tablero.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {cityContracts.map((ct) => {
                      const myVote = contractVotes?.[hero.id]?.contractId === ct.id;
                      const voters = Object.values(contractVotes || {}).filter((v) => v.contractId === ct.id);
                      return (
                        <div
                          key={ct.id}
                          className={`p-3 rounded-xl border space-y-1.5 text-xs ${
                            myVote
                              ? 'bg-emerald-950/40 border-emerald-400'
                              : 'bg-slate-900/85 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-amber-200">{ct.title}</span>
                            <span className="text-[10px] font-bold text-sky-300 shrink-0">
                              {ct.biomeIcon} Nv.{ct.recLevel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 leading-snug line-clamp-3">
                            {ct.summary}
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-[10px] text-emerald-300 font-bold">
                              Recompensa: {ct.gold} MO · {ct.xp} XP {voters.length > 0 ? `· 🗳️ ${voters.length}` : ''}
                            </span>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/contracts/vote', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      heroId: hero.id,
                                      heroName: hero.name,
                                      contractId: ct.id,
                                    }),
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    setContractVotes(data.votes || {});
                                    showToast(`🗳️ Votaste por: ${ct.title}`);
                                  }
                                } catch {
                                  // ignore
                                }
                              }}
                              className={`px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer shrink-0 ${
                                myVote
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                              }`}
                            >
                              {myVote ? '✓ Tu Voto' : '🗳️ Votar'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Posada y Descanso + Canje de Reputación */}
              <div className="grimoire-panel rounded-2xl p-4 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  🍺 Posada, Templo y Reputación
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={async () => {
                      if ((hero.gold || 0) < innCost) {
                        showToast(`⚠️ Necesitas ${innCost} MO.`);
                        return;
                      }
                      await pushHeroUpdate({
                        ...hero,
                        gold: (hero.gold || 0) - innCost,
                        currentPC: hero.maxPC,
                        currentPM: hero.maxPM,
                        usedSpells: [],
                        activeEffects: (hero.activeEffects || []).filter((e) => e.type !== 'debuff'),
                      });
                      showToast(`🍺 Descansaste en la Posada (${innCost} MO): PC, PM y hechizos al máximo.`);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black cursor-pointer"
                  >
                    🛏️ Descansar ({innCost === 0 ? 'GRATIS' : `${innCost} MO`})
                  </button>
                  <button
                    disabled={(hero.reputation || 0) < 1}
                    onClick={async () => {
                      await pushHeroUpdate({
                        ...hero,
                        reputation: Math.max(0, (hero.reputation || 0) - 1),
                        materials: {
                          ...(hero.materials || {}),
                          polvo_runico: Number(hero.materials?.polvo_runico || 0) + 1,
                          chatarra_acero: Number(hero.materials?.chatarra_acero || 0) + 2,
                        },
                      });
                      showToast('🏅 Canjeaste 1 Reputación: +2 Acero Templado y +1 Polvo Rúnico.');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold cursor-pointer"
                  >
                    🏅 Canjear 1 Rep (+Mats)
                  </button>
                </div>

                {/* Banquetes con Raciones */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-300">
                    🍖 Banquetes (Tus Raciones: {Number(hero.materials?.racion_mazmorra || 0)})
                  </div>
                  {TAVERN_FEASTS.map((feast) => {
                    const fPrice = calcMyPrice(feast.goldCost, 'taberna');
                    const hasRations = Number(hero.materials?.racion_mazmorra || 0) >= feast.rationCost;
                    return (
                      <div key={feast.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                        <div>
                          <div className="font-bold text-amber-200">{feast.name}</div>
                          <div className="text-[10px] text-slate-400">{feast.effect}</div>
                        </div>
                        <button
                          disabled={!hasRations || (hero.gold || 0) < fPrice}
                          onClick={async () => {
                            await pushHeroUpdate({
                              ...hero,
                              gold: (hero.gold || 0) - fPrice,
                              materials: {
                                ...(hero.materials || {}),
                                racion_mazmorra: Math.max(0, Number(hero.materials?.racion_mazmorra || 0) - feast.rationCost),
                              },
                              activeEffects: [
                                ...(hero.activeEffects || []).filter((e) => !e.id?.startsWith('feast_')),
                                { id: feast.id, label: feast.buffLabel, type: 'buff', duration: 99 },
                              ],
                            });
                            showToast(`🍖 ¡Banquete comido! ${feast.buffLabel}`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500 disabled:opacity-40 text-slate-950 font-black text-[10px] cursor-pointer shrink-0"
                        >
                          {fPrice} MO + {feast.rationCost}🍖
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
                </div>
              )}

              {/* ==================== SECCIÓN 2: HERRERÍA (ARMERÍA + FORJA + VENDER) ==================== */}
              {mobileCitySection === 'herreria' && (
                <div className="space-y-4">
                  {/* Armería: Comprar Armas, Armaduras y Herramientas */}
                  <div className="grimoire-panel rounded-2xl p-4 space-y-2.5 border-amber-700/50">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      ⚔️ Armería (Armas, Armaduras y Herramientas)
                    </div>
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {EQUIPMENT_CATALOG.filter((e) => e.price > 0).map((e) => {
                        const price = calcMyPrice(e.price, 'herreria');
                        return (
                          <div key={e.id} className="p-2.5 rounded-xl bg-slate-900/85 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <div className="font-bold text-slate-100">
                                {e.name} <span className="text-emerald-300">({e.dice})</span>
                              </div>
                              <div className="text-[10px] text-slate-400 leading-snug">{e.traits}</div>
                            </div>
                            <button
                              disabled={(hero.gold || 0) < price}
                              onClick={async () => {
                                await pushHeroUpdate({
                                  ...hero,
                                  gold: (hero.gold || 0) - price,
                                  inventory: [
                                    ...(hero.inventory || []),
                                    {
                                      id: `mob-gear-${Date.now()}`,
                                      name: e.name,
                                      type: e.type,
                                      dice: e.dice,
                                      traits: e.traits,
                                      special: e.traits,
                                      equipped: false,
                                      qty: 1,
                                    },
                                  ],
                                });
                                showToast(`⚔️ Compraste ${e.name} por ${price} MO.`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-[10px] cursor-pointer shrink-0"
                            >
                              {price} MO
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

              {/* Forja de Equipo por Rareza (Exclusivo de Ciudad) */}
              <div className="grimoire-panel rounded-2xl p-4 space-y-2.5 border-sky-700/50">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  ⚒️ Herrería: Forjar Equipo por Rareza (Solo Ciudad)
                </div>
                <div className="space-y-2">
                  {CRAFTING_RECIPES.filter((r) => r.onlyInCity).map((r) => {
                    const price = calcMyPrice(r.costGold || 0, 'herreria');
                    const hasMats = Object.entries(r.ingredients).every(
                      ([mId, q]) => Number(hero.materials?.[mId] || 0) >= q
                    );
                    const canBuy = hasMats && (hero.gold || 0) >= price;
                    return (
                      <div key={r.id} className="p-3 rounded-xl bg-slate-900/85 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-amber-200">{r.name}</strong>
                          <span className="text-[10px] font-bold text-sky-300">{r.dice}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{r.effect}</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(r.ingredients).map(([mId, q]) => {
                            const mat = getMaterialById(mId);
                            const have = Number(hero.materials?.[mId] || 0);
                            return (
                              <span key={mId} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${have >= q ? 'bg-emerald-900/60 text-emerald-200' : 'bg-rose-950/60 text-rose-300'}`}>
                                {mat.icon} {mat.name} {have}/{q}
                              </span>
                            );
                          })}
                        </div>
                        <button
                          disabled={!canBuy}
                          onClick={async () => {
                            const nextMats = { ...(hero.materials || {}) };
                            Object.entries(r.ingredients).forEach(([mId, q]) => {
                              nextMats[mId] = Math.max(0, Number(nextMats[mId] || 0) - q);
                            });
                            await pushHeroUpdate({
                              ...hero,
                              gold: (hero.gold || 0) - price,
                              materials: nextMats,
                              inventory: [
                                ...(hero.inventory || []),
                                {
                                  id: `city-eq-${Date.now()}`,
                                  name: r.name,
                                  type: r.type,
                                  rarity: r.rarity,
                                  dice: r.dice,
                                  special: r.effect,
                                  traits: r.effect,
                                  equipped: false,
                                  qty: 1,
                                },
                              ],
                            });
                            showToast(`⚒️ ¡Forjaste ${r.name} por ${price} MO!`);
                          }}
                          className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-black text-[11px] cursor-pointer"
                        >
                          ⚒️ Forjar ({price} MO)
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mercado: Vender Botín Sobrante para Conseguir Oro */}
              <div className="grimoire-panel rounded-2xl p-4 space-y-2 border-amber-700/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    💰 Vender Botín Sobrante ({Math.round(sellRate * 100)}% valor)
                  </div>
                </div>
                {(hero.inventory || []).filter((it) => !it.equipped).length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">
                    No tienes objetos sin equipar en tu mochila para vender (desequipa primero si quieres vender algo).
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {(hero.inventory || [])
                      .filter((it) => !it.equipped)
                      .map((it) => {
                        const val = getSellPrice(it);
                        return (
                          <div key={it.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <div className="font-bold text-slate-100 truncate">{it.name}</div>
                              <div className="text-[10px] text-slate-400">{it.type || 'Objeto'} · {it.rarity || 'común'}</div>
                            </div>
                            <button
                              onClick={async () => {
                                await pushHeroUpdate({
                                  ...hero,
                                  gold: (hero.gold || 0) + val,
                                  inventory: (hero.inventory || []).filter((x) => x.id !== it.id),
                                });
                                showToast(`💰 Vendiste ${it.name} por +${val} MO.`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] cursor-pointer shrink-0"
                            >
                              Vender +{val} MO
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
                </div>
              )}

              {/* ==================== SECCIÓN 3: TORRE DEL ALQUIMISTA (POCIONES + MEJORAR HECHIZOS) ==================== */}
              {mobileCitySection === 'alquimista' && (
                <div className="space-y-4">
                  {/* Botica Oficial de Alquimia (20 Pociones) */}
                  <div className="grimoire-panel rounded-2xl p-4 space-y-2.5 border-emerald-700/50">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      🧪 Botica Oficial de Alquimia ({OFFICIAL_ALCHEMY_DECK.length} Pociones)
                    </div>
                    <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                      {OFFICIAL_ALCHEMY_DECK.map((pot) => {
                        const price = calcMyPrice(pot.price || 150, 'alquimista');
                        return (
                          <div key={pot.id} className="p-2.5 rounded-xl bg-slate-900/85 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <div className="font-bold text-emerald-200">
                                {pot.name} <span className="text-amber-300 text-[10px]">({pot.dice || '1 uso'})</span>
                              </div>
                              <div className="text-[10px] text-slate-300 leading-snug">{pot.text}</div>
                            </div>
                            <button
                              disabled={(hero.gold || 0) < price}
                              onClick={async () => {
                                await pushHeroUpdate({
                                  ...hero,
                                  gold: (hero.gold || 0) - price,
                                  inventory: [
                                    ...(hero.inventory || []),
                                    {
                                      id: `mob-pot-${Date.now()}`,
                                      name: pot.name,
                                      type: 'Poción',
                                      dice: pot.dice || '1 uso',
                                      traits: pot.text,
                                      special: pot.text,
                                      equipped: false,
                                      qty: 1,
                                    },
                                  ],
                                });
                                showToast(`🧪 Compraste ${pot.name} por ${price} MO.`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-[10px] cursor-pointer shrink-0"
                            >
                              {price} MO
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

              {/* Torre del Alquimista: Mejorar Mis Hechizos (Tope = Mi Nivel de Héroe) */}
              {getHeroUnlockedSpells(hero).length > 0 && (() => {
                const maxAllowed = Math.min(5, Number(hero.level || 1));
                return (
                  <div className="grimoire-panel rounded-2xl p-4 space-y-2.5 border-cyan-600/50">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        📖 Mejorar Mis Hechizos (Tope Actual: Nv.{maxAllowed})
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Sube el nivel de tus hechizos con Oro y Materiales Arcanos. Solo puedes subirlos hasta tu Nivel de Héroe (Nv.{hero.level || 1}).
                      </p>
                    </div>
                    <div className="space-y-2">
                      {getHeroUnlockedSpells(hero).map((baseSp) => {
                        const curLvl = Number(hero.spellLevels?.[baseSp.id] || 1);
                        const nextLvl = curLvl + 1;
                        const tier = SPELL_UPGRADE_TIERS[nextLvl];
                        const lockedByHeroLvl = nextLvl > maxAllowed;
                        const goldCost = tier ? calcMyPrice(tier.gold, 'alquimista') : 0;
                        const hasMats = tier
                          ? Object.entries(tier.ingredients).every(
                              ([mId, q]) => Number(hero.materials?.[mId] || 0) >= q
                            )
                          : false;
                        const canUp = Boolean(tier) && !lockedByHeroLvl && hasMats && (hero.gold || 0) >= goldCost;

                        return (
                          <div key={baseSp.id} className="p-3 rounded-xl bg-slate-900/85 border border-cyan-900/50 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <strong className="text-cyan-200">[{baseSp.school}] {baseSp.name}</strong>
                              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-200 font-black text-[10px]">
                                Nv.{curLvl}
                              </span>
                            </div>
                            {tier ? (
                              <>
                                <div className="text-[11px] text-slate-300">
                                  <strong>Nv.{nextLvl} ({tier.tag}):</strong> {tier.bonusText}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(tier.ingredients).map(([mId, q]) => {
                                    const mat = getMaterialById(mId);
                                    const have = Number(hero.materials?.[mId] || 0);
                                    return (
                                      <span
                                        key={mId}
                                        className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                                          have >= q
                                            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                                            : 'bg-red-950/50 border-red-800 text-red-300'
                                        }`}
                                      >
                                        {mat.icon} {mat.name} {have}/{q}
                                      </span>
                                    );
                                  })}
                                </div>
                                <button
                                  disabled={!canUp}
                                  onClick={async () => {
                                    if (!canUp) return;
                                    const nextMats = { ...(hero.materials || {}) };
                                    Object.entries(tier.ingredients).forEach(([mId, q]) => {
                                      nextMats[mId] = Math.max(0, Number(nextMats[mId] || 0) - q);
                                    });
                                    await pushHeroUpdate({
                                      ...hero,
                                      gold: (hero.gold || 0) - goldCost,
                                      materials: nextMats,
                                      spellLevels: {
                                        ...(hero.spellLevels || {}),
                                        [baseSp.id]: nextLvl,
                                      },
                                    });
                                    showToast(`📖 ¡${baseSp.name} subió a Nivel ${nextLvl} (${tier.tag})!`);
                                  }}
                                  className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-black text-[11px] cursor-pointer"
                                >
                                  {lockedByHeroLvl
                                    ? `🔒 Requiere Nivel ${nextLvl}`
                                    : `Subir a Nv.${nextLvl} (${goldCost} MO)`}
                                </button>
                              </>
                            ) : (
                              <div className="text-[11px] text-amber-300 font-bold">★ Maestría Máxima (Nv.5)</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
                </div>
              )}

              {/* ==================== SECCIÓN 4: GREMIO (FAMILIARES) ==================== */}
              {mobileCitySection === 'gremio' && (
                <div className="space-y-4">
              {/* Familiares de Utilidad */}
              <div className="grimoire-panel rounded-2xl p-4 space-y-2.5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    🐾 Adoptar Familiar de Utilidad (1 activo por héroe)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Acompañantes entrenados que no estorban en el tablero ni mueren en combate, pero te dan una habilidad útil en cada misión.
                  </p>
                </div>
                <div className="space-y-2">
                  {FAMILIARS.map((fam) => {
                    const price = calcMyPrice(fam.cost, 'gremio');
                    const owned = hero.familiar?.id === fam.id;
                    return (
                      <div key={fam.id} className="p-3 rounded-xl bg-slate-900/85 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-amber-200">{fam.icon} {fam.name}</div>
                          <button
                            disabled={owned || (hero.gold || 0) < price}
                            onClick={async () => {
                              await pushHeroUpdate({
                                ...hero,
                                gold: (hero.gold || 0) - price,
                                familiar: fam,
                              });
                              showToast(`${fam.icon} ¡Adoptaste a ${fam.name}!`);
                            }}
                            className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-white font-bold text-[11px] cursor-pointer shrink-0"
                          >
                            {owned ? '✓ Tuyo' : `Adoptar (${price} MO)`}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-200 leading-snug">
                          <strong className="text-purple-300">Qué hace:</strong> {fam.ability || fam.effect}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
                </div>
              )}

              {/* ==================== SECCIÓN 5: BANCO DEL BASTIÓN ==================== */}
              {mobileCitySection === 'banco' && (
                <div className="grimoire-panel rounded-2xl p-4 space-y-3 border-amber-600/50 text-xs">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      🏦 Banco del Bastión (Oro Seguro)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Guarda tu oro para protegerlo de robos en Modo Supervivencia o retirarlo cuando vayas a comprar.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">En Bolsillo</div>
                      <div className="text-base font-black text-amber-300">{hero.gold || 0} MO</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-700/50">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">En Banco</div>
                      <div className="text-base font-black text-emerald-300">{hero.bankedGold || 0} MO</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={mobileBankAmt}
                      onChange={(e) => setMobileBankAmt(Math.max(0, Number(e.target.value) || 0))}
                      className="w-24 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-200 font-bold text-center"
                    />
                    <button
                      disabled={(hero.gold || 0) <= 0 || mobileBankAmt <= 0}
                      onClick={async () => {
                        const amt = Math.min(hero.gold || 0, mobileBankAmt);
                        if (amt <= 0) return;
                        await pushHeroUpdate({
                          ...hero,
                          gold: (hero.gold || 0) - amt,
                          bankedGold: (hero.bankedGold || 0) + amt,
                        });
                        showToast(`🏦 Depositaste ${amt} MO en el Banco.`);
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black cursor-pointer"
                    >
                      Depositar
                    </button>
                    <button
                      disabled={(hero.bankedGold || 0) <= 0 || mobileBankAmt <= 0}
                      onClick={async () => {
                        const amt = Math.min(hero.bankedGold || 0, mobileBankAmt);
                        if (amt <= 0) return;
                        await pushHeroUpdate({
                          ...hero,
                          gold: (hero.gold || 0) + amt,
                          bankedGold: (hero.bankedGold || 0) - amt,
                        });
                        showToast(`💰 Retiraste ${amt} MO del Banco.`);
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black cursor-pointer"
                    >
                      Retirar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </main>

      {/* Navegación Inferior Anclada (4 pestañas en mazmorra; 5 cuando el DM abre la Ciudad) */}
      <nav
        className={`shrink-0 bg-[#111827]/95 backdrop-blur-xl border-t border-slate-700/80 grid ${
          cityOpen ? 'grid-cols-5' : 'grid-cols-4'
        } gap-1 px-2 pt-2 z-30 shadow-[0_-8px_24px_rgba(2,6,23,0.7)]`}
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {[
          { id: 'hero', label: 'Héroe', icon: Shield },
          { id: 'gear', label: 'Equipo', icon: Backpack },
          { id: 'skills', label: 'Poderes', icon: Sparkles },
          ...(cityOpen ? [{ id: 'city', label: 'Ciudad', icon: Building2 }] : []),
          { id: 'guide', label: 'Reglas', icon: BookOpen },
        ].map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold cursor-pointer transition border ${
                active
                  ? 'bg-amber-600/25 border-amber-500/70 text-amber-200 shadow'
                  : 'bg-transparent border-transparent text-stone-400 active:bg-stone-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
