import React, { useState } from 'react';
import {
  Building2,
  Hammer,
  FlaskConical,
  Sparkles,
  Shield,
  Coins,
  Award,
  ScrollText,
  Users,
  Landmark,
  Flame,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Briefcase,
  Heart,
} from 'lucide-react';
import {
  CITY_MODES,
  CITY_DISTRICTS,
  TAVERN_FEASTS,
  TEMPLE_SERVICES,
  REPUTATION_FAVORS,
  PROFESSIONS,
  UNIQUE_FOLLOWERS,
  FAMILIARS,
  rollTownEvent,
} from '../data/citySystem';
import {
  MATERIAL_BRANCHES,
  MATERIALS_CATALOG,
  CRAFTING_RECIPES,
  ARTIFACT_LEVEL_BONUSES,
  getMaterialById,
  resolveExperimentalMix,
  rollTonicSideEffect,
} from '../data/craftingSystem';
import { MERCENARIES } from '../data/decks';
import { EQUIPMENT_CATALOG } from '../data/characterSystem';
import { generateContractBoard } from '../data/proceduralEngine';

export default function CityHubPanel({
  heroes = [],
  onUpdateHeroes,
  fame = 1,
  setFame,
  reputation = 1,
  setReputation,
  cityMode = 'relaxed',
  setCityMode,
  partyLevel = 1,
  partySize = 4,
  nemeses = [],
  onLaunchProceduralQuest,
  showToast,
}) {
  const [activeDistrict, setActiveDistrict] = useState('taberna');
  const [selectedHeroId, setSelectedHeroId] = useState(heroes[0]?.id || '');
  const [townEvent, setTownEvent] = useState(null);
  const [townEventLog, setTownEventLog] = useState('');
  const [contracts, setContracts] = useState(() =>
    generateContractBoard(partyLevel, partySize, nemeses)
  );
  const [contractVotes, setContractVotes] = useState({});

  // Publicar contratos SIN SPOILERS al servidor para que los jugadores voten desde su celular
  React.useEffect(() => {
    if (!contracts || contracts.length === 0) return;
    const publicContracts = contracts.map((q) => ({
      id: q.id,
      title: q.title,
      biomeName: q.biome?.name || 'Mazmorra',
      biomeIcon: q.biome?.icon || '🗺️',
      plotName: q.plot?.name || 'Encargo',
      plotIcon: q.plot?.icon || '⚔️',
      summary: q.readAloudIntro || q.plot?.objective || '',
      recLevel: q.partyLevel || partyLevel,
      gold: q.rewards?.gold || 100,
      xp: q.rewards?.xp || 200,
    }));
    fetch('/api/contracts/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contracts: publicContracts }),
    }).catch(() => {});
  }, [contracts]);

  // Escuchar votos en tiempo real desde los celulares
  React.useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await fetch('/api/contracts', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setContractVotes(data.votes || {});
        }
      } catch {
        // ignore
      }
    };
    fetchVotes();
    const timer = setInterval(fetchVotes, 2500);
    return () => clearInterval(timer);
  }, []);

  // Estado de Crafteo y Experimentación
  const [craftBranch, setCraftBranch] = useState('alquimia');
  const [expSelectedMats, setExpSelectedMats] = useState([]);
  const [expArcanaRoll, setExpArcanaRoll] = useState(14);
  const [expResult, setExpResult] = useState(null);
  const [tonicRollResult, setTonicRollResult] = useState(null);

  // Banco
  const [bankAmount, setBankAmount] = useState(50);

  // Mejora de Artefacto
  const [upgradeItemId, setUpgradeItemId] = useState('');

  const activeHero = heroes.find((h) => h.id === selectedHeroId) || heroes[0] || null;
  const modeCfg = CITY_MODES[cityMode] || CITY_MODES.relaxed;

  const getDiscountMult = (districtId) => {
    if (!activeHero?.professionId) return 1;
    const prof = PROFESSIONS.find((p) => p.id === activeHero.professionId);
    const hasQuirkDiscount = activeHero.quirk?.id === 'negociador_nato' ? 0.1 : 0;
    const profDisc = prof?.districtId === districtId ? 0.2 : 0;
    return Math.max(0.6, 1 - profDisc - hasQuirkDiscount);
  };

  const calcPrice = (baseCost, districtId) =>
    Math.max(0, Math.round(baseCost * getDiscountMult(districtId)));

  const updateHeroById = (heroId, updater) => {
    onUpdateHeroes((prev) => prev.map((h) => (h.id === heroId ? updater(h) : h)));
  };

  const getHeroMatQty = (hero, matId) => Number(hero?.materials?.[matId] || 0);

  const hasRecipeIngredients = (hero, recipe) => {
    if (!hero) return false;
    return Object.entries(recipe.ingredients || {}).every(
      ([mId, qty]) => getHeroMatQty(hero, mId) >= qty
    );
  };

  const RANDOM_TOWN_POTIONS = [
    'Poción de Curación Mayor (+4 PC)',
    'Poción de Velocidad (+4 Mov)',
    'Elixir de Piel de Piedra (+2 Def)',
    'Poción de Valor (+2 Atq)',
    'Elixir de Claridad (+2 PM)',
  ];

  // Resolver acción interactiva de Evento de Ciudad (1 héroe o todo el grupo)
  const handleResolveTownEventAction = (ev, action) => {
    const isAll = ev.target === 'all';
    if (!isAll && !activeHero) {
      showToast('Selecciona un héroe en el selector superior primero.');
      return;
    }
    if (isAll && heroes.length === 0) {
      showToast('No hay héroes en el grupo.');
      return;
    }

    const goldCost = action.goldDelta < 0 ? Math.abs(action.goldDelta) : 0;
    if (!isAll && goldCost > 0 && (activeHero.gold || 0) < goldCost) {
      showToast(`${activeHero.name} no tiene suficientes MO (necesita ${goldCost} MO).`);
      return;
    }

    const chosenRandomMat = action.randomMaterialChoice
      ? action.randomMaterialChoice[Math.floor(Math.random() * action.randomMaterialChoice.length)]
      : null;
    const chosenRandomPotion = action.randomPotion
      ? RANDOM_TOWN_POTIONS[Math.floor(Math.random() * RANDOM_TOWN_POTIONS.length)]
      : null;

    const applyToHero = (h) => {
      const nextMats = { ...(h.materials || {}) };
      if (action.materials) {
        action.materials.forEach((m) => {
          nextMats[m.id] = (nextMats[m.id] || 0) + m.qty;
        });
      }
      if (chosenRandomMat) {
        nextMats[chosenRandomMat] = (nextMats[chosenRandomMat] || 0) + 1;
      }

      const nextPotions = [...(h.potions || [])];
      if (action.lootItem) nextPotions.push(action.lootItem);
      if (chosenRandomPotion) nextPotions.push(chosenRandomPotion);

      const maxPC = h.maxPC || h.currentPC || 8;
      const maxPM = h.maxPM || h.currentPM || 4;
      let nextPC = h.currentPC ?? maxPC;
      let nextPM = h.currentPM ?? maxPM;
      if (action.fullHeal) {
        nextPC = maxPC;
        nextPM = maxPM;
      } else {
        if (action.fullPm) nextPM = maxPM;
        if (action.pcDelta) nextPC = Math.max(1, Math.min(maxPC, nextPC + action.pcDelta));
        if (action.pmDelta) nextPM = Math.max(0, Math.min(maxPM, nextPM + action.pmDelta));
      }

      return {
        ...h,
        gold: Math.max(0, (h.gold || 0) + (action.goldDelta || 0)),
        xp: Math.max(0, (h.xp || 0) + (action.xpDelta || 0)),
        currentPC: nextPC,
        currentPM: nextPM,
        fame: Math.max(0, (h.fame || 0) + (action.fameDelta || 0)),
        reputation: Math.max(0, (h.reputation || 0) + (action.repDelta || 0)),
        materials: nextMats,
        potions: nextPotions,
      };
    };

    if (isAll) {
      onUpdateHeroes((prev) => prev.map(applyToHero));
    } else {
      updateHeroById(activeHero.id, applyToHero);
    }

    if (action.fameDelta && setFame) setFame((f) => Math.max(0, f + action.fameDelta));
    if (action.repDelta && setReputation) setReputation((r) => Math.max(0, r + action.repDelta));

    const extras = [];
    if (chosenRandomMat) {
      const matObj = getMaterialById(chosenRandomMat);
      extras.push(`${matObj?.icon || '💎'} ${matObj?.name || chosenRandomMat}`);
    }
    if (chosenRandomPotion) extras.push(`🧪 ${chosenRandomPotion}`);

    const targetLabel = isAll ? 'Todo el Grupo' : activeHero.name;
    const summary = `[${targetLabel}] ${action.note || action.label}${
      extras.length > 0 ? ` — Obtenido: ${extras.join(' + ')}` : ''
    }`;
    setTownEventLog(summary);
    showToast(summary);
  };

  // Descanso grupal en la Posada
  const handlePartyRest = () => {
    if (heroes.length === 0) {
      showToast('Crea al menos un héroe primero.');
      return;
    }
    const costPerHero = modeCfg.upkeepPerHero;
    onUpdateHeroes((prev) =>
      prev.map((h) => {
        const profDisc = h.professionId === 'mercader' ? 0.8 : 1;
        const quirkExtra = h.quirk?.id === 'insomne' ? 5 : 0;
        const finalCost = Math.round(costPerHero * profDisc) + quirkExtra;
        return {
          ...h,
          gold: Math.max(0, (h.gold || 0) - finalCost),
          currentPC: h.maxPC,
          currentPM: h.maxPM,
          usedSpells: [],
          activeEffects: (h.activeEffects || []).filter((e) => e.persistInTown),
        };
      })
    );
    const ev = rollTownEvent();
    setTownEvent(ev);
    setTownEventLog('');
    showToast(`🍺 Grupo descansado en El Grifo Dorado. Evento de Ciudad: ${ev.title}`);
  };

  // Banquete de Taberna
  const handleBuyFeast = (feast) => {
    if (!activeHero) return;
    const price = calcPrice(feast.goldCost, 'taberna');
    const rations = getHeroMatQty(activeHero, 'racion_mazmorra');
    if (rations < feast.rationsCost) {
      showToast(`❌ ${activeHero.name} necesita ${feast.rationsCost} Ración de Mazmorra.`);
      return;
    }
    if ((activeHero.gold || 0) < price) {
      showToast(`❌ ${activeHero.name} necesita ${price} MO.`);
      return;
    }
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      gold: (h.gold || 0) - price,
      materials: {
        ...(h.materials || {}),
        racion_mazmorra: getHeroMatQty(h, 'racion_mazmorra') - feast.rationsCost,
      },
      activeEffects: [
        ...(h.activeEffects || []).filter((e) => !e.id?.startsWith('feast_')),
        {
          id: feast.id,
          label: feast.buffLabel,
          type: 'buff',
          persistInTown: true,
          note: feast.effect,
        },
      ],
    }));
    showToast(`🍖 ${activeHero.name} disfrutó "${feast.name}" para la próxima misión.`);
  };

  // Craftear Receta
  const handleCraftRecipe = (recipe, districtId) => {
    if (!activeHero) return;
    if (recipe.id === 'rec_mejora_artefacto') {
      showToast('Usa la sección "Nivelación de Artefactos" justo abajo para elegir qué objeto mejorar.');
      return;
    }
    const price = calcPrice(recipe.costGold, districtId);
    if (!hasRecipeIngredients(activeHero, recipe)) {
      showToast('❌ Faltan materiales de crafteo en la bolsa de este héroe.');
      return;
    }
    if ((activeHero.gold || 0) < price) {
      showToast(`❌ Necesitas ${price} MO para fabricar ${recipe.name}.`);
      return;
    }
    updateHeroById(activeHero.id, (h) => {
      const nextMats = { ...(h.materials || {}) };
      Object.entries(recipe.ingredients).forEach(([mId, qty]) => {
        nextMats[mId] = Math.max(0, (nextMats[mId] || 0) - qty);
      });
      return {
        ...h,
        gold: (h.gold || 0) - price,
        materials: nextMats,
        inventory: [
          ...(h.inventory || []),
          {
            id: `craft-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            name: recipe.name,
            type: recipe.type,
            rarity: recipe.rarity,
            dice: recipe.dice,
            special: recipe.effect,
            traits: recipe.effect,
            equipped: false,
            qty: 1,
          },
        ],
      };
    });
    showToast(`✨ ${activeHero.name} fabricó: ${recipe.name} (enviado a su celular).`);
  };

  // Nivelación de Artefactos (Lv 1 -> 5)
  const handleUpgradeArtifact = () => {
    if (!activeHero || !upgradeItemId) return;
    const item = (activeHero.inventory || []).find((i) => i.id === upgradeItemId);
    if (!item) return;
    const currLv = item.artifactLevel || 1;
    if (currLv >= 5) {
      showToast('Ese objeto ya alcanzó el Nivel 5 (Legendario).');
      return;
    }
    const costGold = calcPrice(80 * currLv, 'herreria');
    if (
      getHeroMatQty(activeHero, 'gema_abismal') < 1 ||
      getHeroMatQty(activeHero, 'chatarra_acero') < 2 ||
      getHeroMatQty(activeHero, 'polvo_runico') < 1
    ) {
      showToast('❌ Necesitas 1 Gema Abismal, 2 Acero Templado y 1 Polvo Rúnico.');
      return;
    }
    if ((activeHero.gold || 0) < costGold) {
      showToast(`❌ Necesitas ${costGold} MO.`);
      return;
    }
    const nextLv = currLv + 1;
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      gold: (h.gold || 0) - costGold,
      materials: {
        ...(h.materials || {}),
        gema_abismal: getHeroMatQty(h, 'gema_abismal') - 1,
        chatarra_acero: getHeroMatQty(h, 'chatarra_acero') - 2,
        polvo_runico: getHeroMatQty(h, 'polvo_runico') - 1,
      },
      inventory: (h.inventory || []).map((it) =>
        it.id === item.id
          ? {
              ...it,
              artifactLevel: nextLv,
              name: it.name.replace(/\s*\(Nv\.\d\)/, '') + ` (Nv.${nextLv})`,
              special: `${it.special || it.traits || ''} | ${ARTIFACT_LEVEL_BONUSES[nextLv]}`.trim(),
            }
          : it
      ),
    }));
    showToast(`🔥 ¡${item.name} subió a Nivel ${nextLv}! ${ARTIFACT_LEVEL_BONUSES[nextLv]}`);
  };

  // Mezcla Experimental
  const handleExperimentalMix = () => {
    if (!activeHero || expSelectedMats.length < 2) {
      showToast('Selecciona 2 o 3 materiales que tenga el héroe.');
      return;
    }
    const profBonus = activeHero.professionId === 'alquimista' ? 3 : 0;
    const totalRoll = Number(expArcanaRoll || 10) + profBonus;
    const res = resolveExperimentalMix(expSelectedMats, totalRoll);
    setExpResult({ ...res, totalRoll, profBonus });

    updateHeroById(activeHero.id, (h) => {
      const nextMats = { ...(h.materials || {}) };
      expSelectedMats.forEach((mId) => {
        nextMats[mId] = Math.max(0, (nextMats[mId] || 0) - 1);
      });
      const nextInv = res.item
        ? [
            ...(h.inventory || []),
            {
              ...res.item,
              id: `exp-${Date.now()}`,
              traits: res.item.special,
              equipped: false,
              qty: 1,
            },
          ]
        : h.inventory || [];
      return {
        ...h,
        materials: nextMats,
        currentPC: res.damagePC ? Math.max(1, (h.currentPC ?? h.maxPC) - res.damagePC) : h.currentPC,
        inventory: nextInv,
      };
    });
    setExpSelectedMats([]);
  };

  // Comprar equipo estándar en Herrería
  const handleBuyGear = (gear) => {
    if (!activeHero) return;
    const price = calcPrice(gear.price || 50, 'herreria');
    if ((activeHero.gold || 0) < price) {
      showToast(`❌ ${activeHero.name} necesita ${price} MO.`);
      return;
    }
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      gold: (h.gold || 0) - price,
      inventory: [
        ...(h.inventory || []),
        {
          id: `shop-${Date.now()}`,
          name: gear.name,
          type: gear.type,
          dice: gear.dice,
          traits: gear.traits,
          special: gear.traits,
          equipped: false,
          qty: 1,
        },
      ],
    }));
    showToast(`⚔️ ${activeHero.name} compró ${gear.name} por ${price} MO.`);
  };

  // Servicios del Templo
  const handleTempleService = (srv) => {
    if (!activeHero) return;
    const price = calcPrice(srv.goldCost, 'templo');
    if (srv.repCost > 0 && reputation < srv.repCost) {
      showToast('❌ El grupo no tiene suficientes Fichas de Reputación.');
      return;
    }
    if (price > 0 && (activeHero.gold || 0) < price) {
      showToast(`❌ ${activeHero.name} necesita ${price} MO.`);
      return;
    }
    if (srv.repCost > 0) setReputation((r) => Math.max(0, r - srv.repCost));
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      gold: (h.gold || 0) - price,
      debt: (h.debt || 0) + (srv.addsDebt || 0),
      currentPC: srv.id.includes('resurrect') ? h.maxPC : h.currentPC,
      currentPM: srv.id.includes('resurrect') || srv.id === 'temple_cleanse' ? h.maxPM : h.currentPM,
      activeEffects:
        srv.id === 'temple_cleanse'
          ? (h.activeEffects || []).filter((e) => e.type !== 'debuff')
          : srv.id === 'temple_bless'
          ? [
              ...(h.activeEffects || []),
              {
                id: 'temple_bless',
                label: '⛪ Bendición de la Luz (+2 DC vs No Muertos/Caos)',
                type: 'buff',
                persistInTown: true,
                note: srv.effect,
              },
            ]
          : h.activeEffects || [],
    }));
    showToast(`⛪ Servicio aplicado a ${activeHero.name}: ${srv.name}`);
  };

  // Profesión, Seguidores y Familiares
  const handleSelectProfession = (prof) => {
    if (!activeHero) return;
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      professionId: prof.id,
      professionName: prof.name,
    }));
    showToast(`🛠️ ${activeHero.name} ahora tiene la profesión: ${prof.name}`);
  };

  const handleRecruitFollower = (fol) => {
    if (!activeHero) return;
    if (fame < fol.fameRequired) {
      showToast(`❌ Necesitas Fama ${fol.fameRequired} para atraer a ${fol.name}.`);
      return;
    }
    const price = calcPrice(fol.hireCost, 'gremio');
    if ((activeHero.gold || 0) < price) {
      showToast(`❌ Necesitas ${price} MO.`);
      return;
    }
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      gold: (h.gold || 0) - price,
      followers: [...(h.followers || []).filter((f) => f.id !== fol.id), fol],
    }));
    showToast(`🛡️ ¡${fol.name} se unió a ${activeHero.name} por ${price} MO!`);
  };

  const handleAdoptFamiliar = (fam) => {
    if (!activeHero) return;
    const price = calcPrice(fam.cost, 'gremio');
    if ((activeHero.gold || 0) < price) {
      showToast(`❌ Necesitas ${price} MO.`);
      return;
    }
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      gold: (h.gold || 0) - price,
      familiar: fam,
    }));
    showToast(`${fam.icon} ${activeHero.name} adoptó a ${fam.name}!`);
  };

  // Banco
  const handleBankDeposit = () => {
    if (!activeHero) return;
    const amt = Math.min(activeHero.gold || 0, Math.max(0, Number(bankAmount) || 0));
    if (amt <= 0) return;
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      gold: (h.gold || 0) - amt,
      bankedGold: (h.bankedGold || 0) + amt,
    }));
    showToast(`🏦 ${activeHero.name} depositó ${amt} MO a salvo en el Banco.`);
  };

  const handleBankWithdraw = () => {
    if (!activeHero) return;
    const amt = Math.min(activeHero.bankedGold || 0, Math.max(0, Number(bankAmount) || 0));
    if (amt <= 0) return;
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      gold: (h.gold || 0) + amt,
      bankedGold: (h.bankedGold || 0) - amt,
    }));
    showToast(`💰 ${activeHero.name} retiró ${amt} MO del Banco.`);
  };

  const handleSpendReputationFavor = (favor) => {
    if (reputation < favor.repCost) {
      showToast('❌ No hay suficientes Fichas de Reputación.');
      return;
    }
    setReputation((r) => Math.max(0, r - favor.repCost));
    if (favor.id === 'rep_artifact_gift' && activeHero) {
      updateHeroById(activeHero.id, (h) => ({
        ...h,
        materials: {
          ...(h.materials || {}),
          gema_abismal: getHeroMatQty(h, 'gema_abismal') + 1,
          polvo_runico: getHeroMatQty(h, 'polvo_runico') + 2,
        },
      }));
    }
    showToast(`🏅 Favor de Reputación activado: ${favor.name}`);
  };

  // Regalo rápido de materiales para pruebas / recompensas del DM
  const giveQuickMaterial = (matId) => {
    if (!activeHero) return;
    updateHeroById(activeHero.id, (h) => ({
      ...h,
      materials: {
        ...(h.materials || {}),
        [matId]: getHeroMatQty(h, matId) + 1,
      },
    }));
    const m = getMaterialById(matId);
    showToast(`📦 +1 ${m.icon} ${m.name} añadido a ${activeHero.name}`);
  };

  // Reciclaje / Desmantelar equipo viejo en la Herrería para recuperar Materiales de Crafteo
  const handleSalvageGear = (item) => {
    if (!activeHero || !item) return;
    const rar = `${item.rarity || 'comun'}`.toLowerCase();
    let yieldMats = { chatarra_acero: 1 };
    if (rar === 'poco_comun') yieldMats = { chatarra_acero: 2, aceite_alquitran: 1 };
    else if (rar === 'raro') yieldMats = { chatarra_acero: 2, polvo_runico: 1 };
    else if (rar === 'epico' || rar === 'legendario') {
      yieldMats = { chatarra_acero: 3, polvo_runico: 2, gema_abismal: 1 };
    }

    updateHeroById(activeHero.id, (h) => {
      const nextMats = { ...(h.materials || {}) };
      Object.entries(yieldMats).forEach(([mId, q]) => {
        nextMats[mId] = Number(nextMats[mId] || 0) + q;
      });
      return {
        ...h,
        materials: nextMats,
        inventory: (h.inventory || []).filter((it) => it.id !== item.id),
      };
    });

    const summary = Object.entries(yieldMats)
      .map(([mId, q]) => `+${q} ${getMaterialById(mId).name}`)
      .join(', ');
    showToast(`♻️ ${item.name} desmantelado: ${summary}`);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado de Ciudad Viva + Fama + Reputación + Modo */}
      <div className="grimoire-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              Fase Entre Misiones · 100% Digital
            </div>
            <h2 className="font-display text-2xl font-black text-amber-200 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-amber-400" /> El Bastión de los Héroes (Ciudad Viva y Crafteo)
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Descansa, fabrica pociones/bombas/runas, mejora artefactos, contrata seguidores y elige contratos del Tablón.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Fama */}
            <div className="px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-700/60 text-xs flex items-center gap-2">
              <span className="text-amber-300 font-bold">⭐ Fama: {fame}</span>
              <button onClick={() => setFame((f) => Math.max(0, f - 1))} className="px-1.5 rounded bg-stone-900 text-stone-300 cursor-pointer">-</button>
              <button onClick={() => setFame((f) => f + 1)} className="px-1.5 rounded bg-stone-900 text-amber-300 cursor-pointer">+</button>
            </div>

            {/* Fichas de Reputación */}
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-xs flex items-center gap-2">
              <span className="text-emerald-300 font-bold">🏅 Reputación: {reputation}</span>
              <button onClick={() => setReputation((r) => Math.max(0, r - 1))} className="px-1.5 rounded bg-stone-900 text-stone-300 cursor-pointer">-</button>
              <button onClick={() => setReputation((r) => r + 1)} className="px-1.5 rounded bg-stone-900 text-emerald-300 cursor-pointer">+</button>
            </div>

            {/* Toggle Modo Relajado vs Supervivencia */}
            <button
              onClick={() => setCityMode(cityMode === 'relaxed' ? 'survival' : 'relaxed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
                cityMode === 'survival'
                  ? 'bg-red-950/60 border-red-500 text-red-200'
                  : 'bg-sky-950/60 border-sky-500 text-sky-200'
              }`}
              title={modeCfg.summary}
            >
              {cityMode === 'survival' ? '🔥 Modo Supervivencia' : '🛡️ Modo Relajado'}
            </button>
          </div>
        </div>

        {/* Selector de Héroe Activo + Resumen de Oro y Materiales */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 font-bold">Héroe comprando / crafteando:</span>
            {heroes.length === 0 ? (
              <span className="text-xs text-red-300">Crea héroes en la pestaña "Héroes" primero.</span>
            ) : (
              heroes.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHeroId(h.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
                    activeHero?.id === h.id
                      ? 'bg-amber-600 text-black border-amber-300'
                      : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500'
                  }`}
                >
                  {h.name} · 💰 {h.gold || 0} MO
                </button>
              ))
            )}
          </div>

          {activeHero && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700 text-amber-300">
                🏦 Banco: <strong>{activeHero.bankedGold || 0} MO</strong>
              </span>
              {activeHero.debt > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-700 text-red-300">
                  Deuda: <strong>{activeHero.debt} MO</strong>
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700 text-emerald-300">
                🛠️ Profesión: <strong>{activeHero.professionName || 'Sin elegir'}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Regla del Modo Activo */}
        <div className="text-[11px] text-stone-300 bg-stone-950/70 border border-stone-800 rounded-xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong className="text-amber-300">{modeCfg.name}:</strong> {modeCfg.summary} — {modeCfg.deathRule}
          </span>
        </div>
      </div>

      {/* Navegación de los 6 Distritos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {CITY_DISTRICTS.map((d) => {
          const locked = fame < d.fameRequired;
          const active = activeDistrict === d.id;
          return (
            <button
              key={d.id}
              onClick={() => !locked && setActiveDistrict(d.id)}
              disabled={locked}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                active
                  ? 'bg-amber-950/40 border-amber-400 shadow-lg'
                  : 'grimoire-panel border-stone-800 hover:border-stone-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{d.icon}</span>
                {d.fameRequired > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 text-amber-400 font-bold">
                    ⭐ {d.fameRequired}
                  </span>
                )}
              </div>
              <div className="font-display font-bold text-xs text-stone-100 mt-1.5 leading-snug">
                {d.name.split('"')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* DISTRITO 1: TABERNA, DESCANSO, BANQUETES, EVENTO DE CIUDAD Y TABLÓN */}
      {/* ==================================================================== */}
      {activeDistrict === 'taberna' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Posada + Evento de Ciudad */}
            <div className="grimoire-panel rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-amber-300">
                  🍺 Posada "El Grifo Dorado" ({modeCfg.upkeepPerHero} MO/héroe)
                </h3>
                <button
                  onClick={handlePartyRest}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs cursor-pointer"
                >
                  Descansar Grupo + Tirar Evento
                </button>
              </div>
              <p className="text-xs text-stone-400">
                Descansar restaura al 100% los PC, PM y Hechizos de todos los héroes y dispara 1 Evento de Ciudad automático.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTownEvent(rollTownEvent());
                    setTownEventLog('');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 hover:border-amber-500 text-xs text-amber-200 font-bold cursor-pointer"
                >
                  🎲 Tirar Evento de Ciudad Manual
                </button>
              </div>

              {townEvent && (
                <div
                  className={`p-4 rounded-xl border space-y-2.5 ${
                    townEvent.tone === 'peligro'
                      ? 'bg-red-950/35 border-red-600/60'
                      : townEvent.tone === 'positivo'
                      ? 'bg-emerald-950/35 border-emerald-600/60'
                      : 'bg-amber-950/35 border-amber-600/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                      Evento de Ciudad · {townEvent.tone}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        townEvent.target === 'all'
                          ? 'bg-sky-950/70 border-sky-500/60 text-sky-200'
                          : 'bg-purple-950/70 border-purple-500/60 text-purple-200'
                      }`}
                    >
                      {townEvent.target === 'all'
                        ? `👥 Afecta a Todo el Grupo (${heroes.length})`
                        : `👤 Afecta a 1 Héroe: ${activeHero?.name || 'Selecciona arriba'}`}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">
                    {townEvent.title}
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed">{townEvent.effect}</p>

                  {townEvent.actions && townEvent.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1.5 border-t border-white/10">
                      {townEvent.actions.map((act) => {
                        const btnStyle =
                          act.style === 'emerald'
                            ? 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500/50'
                            : act.style === 'amber'
                            ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 border-amber-400/60'
                            : act.style === 'rose'
                            ? 'bg-rose-800 hover:bg-rose-700 text-rose-50 border-rose-500/50'
                            : act.style === 'sky'
                            ? 'bg-sky-700 hover:bg-sky-600 text-white border-sky-500/50'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-600';
                        return (
                          <button
                            key={act.id}
                            onClick={() => handleResolveTownEventAction(townEvent, act)}
                            className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition ${btnStyle}`}
                          >
                            {act.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {townEventLog && (
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-500/40 text-[11px] text-emerald-200 font-semibold">
                      ✅ {townEventLog}
                    </div>
                  )}
                </div>
              )}

              {/* Banquetes */}
              <div className="pt-3 border-t border-stone-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  🍖 Banquetes de Mazmorra (Requieren Ración de Mazmorra)
                </h4>
                <div className="space-y-2">
                  {TAVERN_FEASTS.map((f) => {
                    const price = calcPrice(f.goldCost, 'taberna');
                    return (
                      <div
                        key={f.id}
                        className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-stone-100">{f.name}</div>
                          <div className="text-stone-400">{f.effect}</div>
                        </div>
                        <button
                          onClick={() => handleBuyFeast(f)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold whitespace-nowrap cursor-pointer"
                        >
                          {f.rationsCost}🍖 + {price} MO
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Favores de Reputación */}
            <div className="grimoire-panel rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-emerald-300 flex items-center gap-2">
                  <Award className="w-5 h-5" /> Favores de Reputación (Fichas: {reputation})
                </h3>
              </div>
              <p className="text-xs text-stone-400">
                Gana Fichas de Reputación completando Objetivos Secundarios, rescatando NPCs o devolviendo reliquias. Gástalas aquí para ventajas estratégicas.
              </p>
              <div className="space-y-2.5">
                {REPUTATION_FAVORS.map((fav) => (
                  <div
                    key={fav.id}
                    className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-emerald-200">{fav.name}</div>
                      <div className="text-stone-400 mt-0.5">{fav.effect}</div>
                    </div>
                    <button
                      onClick={() => handleSpendReputationFavor(fav)}
                      disabled={reputation < fav.repCost}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold whitespace-nowrap cursor-pointer"
                    >
                      Canjear ({fav.repCost} 🏅)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tablón de Contratos Procedurales */}
          <div className="grimoire-panel rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-amber-300 flex items-center gap-2">
                  <ScrollText className="w-5 h-5" /> Tablón de Contratos (3 Misiones Procedurales)
                </h3>
                <p className="text-xs text-stone-400">
                  Acepta cualquier contrato para cargarlo directamente en el Tablero Táctico 2D con mapa, Salas de Peligro y Contadores de Zargon.
                </p>
              </div>
              <button
                onClick={() => setContracts(generateContractBoard(partyLevel, partySize, nemeses))}
                className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500 text-xs font-bold text-amber-200 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Renovar Contratos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contracts.map((q) => {
                const voters = Object.values(contractVotes || {}).filter((v) => v.contractId === q.id);
                const maxVotes = Math.max(
                  0,
                  ...contracts.map(
                    (c) => Object.values(contractVotes || {}).filter((v) => v.contractId === c.id).length
                  )
                );
                const isWinner = voters.length > 0 && voters.length === maxVotes;
                return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl bg-stone-950/80 border flex flex-col justify-between gap-3 ${
                    isWinner
                      ? 'border-emerald-400 ring-2 ring-emerald-500/40 shadow-xl'
                      : 'border-amber-800/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                      <span className={`px-2 py-0.5 rounded border ${q.biome.badgeColor}`}>
                        {q.biome.icon} {q.biome.name}
                      </span>
                      <span className="text-amber-400">Nv.{q.partyLevel}</span>
                    </div>
                    {voters.length > 0 && (
                      <div className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-[11px] text-emerald-200 font-bold">
                        🗳️ {voters.length} voto{voters.length > 1 ? 's' : ''}: {voters.map((v) => v.heroName).join(', ')}
                        {isWinner && ' 🏆'}
                      </div>
                    )}
                    <h4 className="font-display font-bold text-base text-amber-100">{q.title}</h4>
                    <p className="text-xs text-stone-300">
                      <strong>{q.plot.icon} {q.plot.name}:</strong> {q.plot.objective}
                    </p>
                    <div className="text-[11px] text-purple-200 bg-purple-950/30 border border-purple-800/40 rounded-lg p-2">
                      <strong>Jefe:</strong> {q.bossName}
                    </div>
                    <div className="text-[11px] text-emerald-300">
                      Recompensa: <strong>+{q.rewards.xp} XP</strong> · <strong>+{q.rewards.gold} MO</strong> · +{q.rewards.fame} Fama
                    </div>
                  </div>
                  <button
                    onClick={() => onLaunchProceduralQuest && onLaunchProceduralQuest(q)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Aceptar y Lanzar al Tablero
                  </button>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* DISTRITO 2 Y 3: HERRERÍA / FORJA Y ALQUIMISTA / RUNAS / EXPERIMENTO */}
      {/* ==================================================================== */}
      {(activeDistrict === 'herreria' || activeDistrict === 'alquimista') && (
        <div className="space-y-6">
          {/* Bolsa Digital de Materiales del Héroe + Botón DM para otorgar */}
          {activeHero && (
            <div className="grimoire-panel rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-amber-300">
                  🎒 Bolsa de Materiales de {activeHero.name} (Haz clic en +1 si el DM otorga material)
                </h3>
                <div className="flex gap-1.5">
                  {MATERIAL_BRANCHES.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setCraftBranch(b.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                        craftBranch === b.id
                          ? 'bg-amber-600 text-black border-amber-300'
                          : 'bg-stone-900 border-stone-700 text-stone-300'
                      }`}
                    >
                      {b.icon} {b.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {MATERIALS_CATALOG.map((m) => {
                  const qty = getHeroMatQty(activeHero, m.id);
                  return (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between gap-1 ${
                        qty > 0
                          ? 'bg-stone-900/90 border-amber-700/60'
                          : 'bg-stone-950/60 border-stone-800/80 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-100">
                          {m.icon} {m.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-black/50 text-amber-300 font-black">
                          ×{qty}
                        </span>
                      </div>
                      <button
                        onClick={() => giveQuickMaterial(m.id)}
                        className="text-[10px] py-0.5 rounded bg-stone-800 hover:bg-amber-700 hover:text-black text-stone-300 font-bold cursor-pointer"
                      >
                        +1 DM
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recetas de Crafteo por Rama */}
          <div className="grimoire-panel rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-xl font-bold text-amber-300 flex items-center gap-2">
                {activeDistrict === 'herreria' ? <Hammer className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
                Mesa de Crafteo — {MATERIAL_BRANCHES.find((b) => b.id === craftBranch)?.name}
              </h3>
              <button
                onClick={() => setTonicRollResult(rollTonicSideEffect())}
                className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-700 text-purple-200 text-xs font-bold cursor-pointer"
              >
                🧪 Tirar Efecto Secundario de Tónico (1d6)
              </button>
            </div>

            {tonicRollResult && (
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/60 text-xs text-purple-100">
                <strong>Resultado Tónico (d6 = {tonicRollResult.roll}) — {tonicRollResult.title}:</strong>{' '}
                {tonicRollResult.effect}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CRAFTING_RECIPES.filter((r) => r.branch === craftBranch).map((r) => {
                const canCraft = hasRecipeIngredients(activeHero, r);
                const price = calcPrice(r.costGold, activeDistrict);
                return (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-bold text-sm text-amber-200">{r.name}</span>
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-emerald-300 font-bold whitespace-nowrap">
                          {r.dice}
                        </span>
                      </div>
                      <p className="text-stone-300 leading-relaxed">{r.effect}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {Object.entries(r.ingredients).map(([mId, qty]) => {
                          const mat = getMaterialById(mId);
                          const have = getHeroMatQty(activeHero, mId);
                          return (
                            <span
                              key={mId}
                              className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                                have >= qty
                                  ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-200'
                                  : 'bg-red-950/40 border-red-800/50 text-red-300'
                              }`}
                            >
                              {mat.icon} {mat.name} {have}/{qty}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCraftRecipe(r, activeDistrict)}
                      disabled={!activeHero || !canCraft || r.id === 'rec_mejora_artefacto'}
                      className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-black font-bold cursor-pointer"
                    >
                      {r.id === 'rec_mejora_artefacto'
                        ? 'Usar Nivelación Abajo'
                        : `Fabricar (${price} MO)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Herrería: Nivelación de Artefactos (Nv.1 -> Nv.5) + Armería */}
          {activeDistrict === 'herreria' && activeHero && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="grimoire-panel rounded-2xl p-5 space-y-3">
                <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" /> Nivelación de Artefactos (Nv.1 → Nv.5)
                </h3>
                <p className="text-xs text-stone-400">
                  Mejora cualquier arma, armadura o reliquia de {activeHero.name} usando 1 💎 Gema Abismal + 2 ⚙️ Acero + 1 ✨ Polvo Rúnico.
                </p>
                <div className="flex gap-2">
                  <select
                    value={upgradeItemId}
                    onChange={(e) => setUpgradeItemId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                  >
                    <option value="">-- Elige un objeto del inventario --</option>
                    {(activeHero.inventory || []).map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} (Nv.{it.artifactLevel || 1})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleUpgradeArtifact}
                    disabled={!upgradeItemId}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-black font-bold text-xs cursor-pointer"
                  >
                    Subir Nivel
                  </button>
                </div>
                <div className="space-y-1 text-[11px] text-stone-300 bg-stone-950/70 p-3 rounded-xl border border-stone-800">
                  {Object.values(ARTIFACT_LEVEL_BONUSES).map((txt, i) => (
                    <div key={i}>• {txt}</div>
                  ))}
                </div>
              </div>

              {/* Armería Estándar */}
              <div className="grimoire-panel rounded-2xl p-5 space-y-3">
                <h3 className="font-display text-lg font-bold text-amber-300">
                  ⚔️ Armería del Bastión
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {EQUIPMENT_CATALOG.filter((e) => e.price > 0).map((e) => {
                    const price = calcPrice(e.price, 'herreria');
                    return (
                      <div
                        key={e.id}
                        className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <strong className="text-stone-100">{e.name}</strong>{' '}
                          <span className="text-emerald-300">({e.dice})</span>
                          <div className="text-[11px] text-stone-400">{e.traits}</div>
                        </div>
                        <button
                          onClick={() => handleBuyGear(e)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold whitespace-nowrap cursor-pointer"
                        >
                          {price} MO
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Reciclaje / Desmantelar Equipo Viejo en Materiales */}
              <div className="lg:col-span-2 grimoire-panel rounded-2xl p-5 space-y-3 border-emerald-700/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-emerald-300">
                    ♻️ Reciclar / Desmantelar Equipo de {activeHero.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Desarma armas o armaduras que ya no uses para recuperar Acero, Polvo Rúnico o Gemas
                  </span>
                </div>
                {(activeHero.inventory || []).filter((it) => !it.equipped && ['Arma', 'Armadura', 'Artefacto', 'Accesorio'].includes(it.type)).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No tienes equipo sin equipar en la mochila para desmantelar (desequipa primero si deseas reciclar algo).
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(activeHero.inventory || [])
                      .filter((it) => !it.equipped && ['Arma', 'Armadura', 'Artefacto', 'Accesorio'].includes(it.type))
                      .map((it) => {
                        const rar = `${it.rarity || 'comun'}`.toLowerCase();
                        const preview =
                          rar === 'epico' || rar === 'legendario'
                            ? '+3 Acero, +2 Polvo, +1 Gema'
                            : rar === 'raro'
                            ? '+2 Acero, +1 Polvo Rúnico'
                            : rar === 'poco_comun'
                            ? '+2 Acero, +1 Aceite'
                            : '+1 Acero Templado';
                        return (
                          <div
                            key={it.id}
                            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-slate-100 truncate">{it.name}</div>
                              <div className="text-[10px] text-emerald-300">Recicla: {preview}</div>
                            </div>
                            <button
                              onClick={() => handleSalvageGear(it)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] cursor-pointer shrink-0"
                            >
                              ♻️ Desmantelar
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Alquimista: Mezcla Experimental */}
          {activeDistrict === 'alquimista' && activeHero && (
            <div className="grimoire-panel rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="font-display text-lg font-bold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Mezcla Experimental (Combina 2–3 Materiales + Arcano d20)
                </h3>
                <p className="text-xs text-stone-400">
                  Experimenta sin receta: selecciona 2 o 3 materiales que tenga el héroe, introduce su tirada total de Arcano (d20 + INT) y descubre pociones raras o desastres divertidos.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {MATERIALS_CATALOG.filter((m) => getHeroMatQty(activeHero, m.id) > 0).map((m) => {
                  const selected = expSelectedMats.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        if (selected) {
                          setExpSelectedMats((prev) => prev.filter((id) => id !== m.id));
                        } else if (expSelectedMats.length < 3) {
                          setExpSelectedMats((prev) => [...prev, m.id]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        selected
                          ? 'bg-purple-600 text-white border-purple-300'
                          : 'bg-stone-900 border-stone-700 text-stone-300'
                      }`}
                    >
                      {m.icon} {m.name} (×{getHeroMatQty(activeHero, m.id)})
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs text-stone-300 flex items-center gap-2">
                  Tirada Arcano (d20 + Mod):
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={expArcanaRoll}
                    onChange={(e) => setExpArcanaRoll(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-amber-300 font-bold"
                  />
                </label>
                <button
                  onClick={handleExperimentalMix}
                  disabled={expSelectedMats.length < 2}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-white font-bold text-xs cursor-pointer"
                >
                  🧪 Mezclar ({expSelectedMats.length}/3 ingredientes)
                </button>
              </div>

              {expResult && (
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/60 text-xs space-y-1">
                  <div className="font-display font-bold text-base text-amber-200">
                    {expResult.title} (Total Arcano: {expResult.totalRoll})
                  </div>
                  <p className="text-stone-200">{expResult.text}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* DISTRITO 4: TEMPLO DE LA LUZ Y SANADOR                               */}
      {/* ==================================================================== */}
      {activeDistrict === 'templo' && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-display text-xl font-bold text-sky-300 flex items-center gap-2">
            <Heart className="w-5 h-5" /> Templo de la Luz y Sanador
          </h3>
          <p className="text-xs text-stone-400">
            Cura maldiciones, recibe bendiciones antes de entrar a la mazmorra o resucita héroes caídos usando Oro, Fichas de Reputación o Deuda Imperial.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TEMPLE_SERVICES.map((srv) => {
              const price = calcPrice(srv.goldCost, 'templo');
              return (
                <div
                  key={srv.id}
                  className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-display font-bold text-sm text-sky-200">{srv.name}</div>
                    <p className="text-stone-300 mt-1">{srv.effect}</p>
                  </div>
                  <button
                    onClick={() => handleTempleService(srv)}
                    disabled={!activeHero}
                    className="w-full py-2 rounded-xl bg-sky-700 hover:bg-sky-600 disabled:opacity-40 text-white font-bold cursor-pointer"
                  >
                    {srv.repCost > 0
                      ? `Usar ${srv.repCost} Ficha de Reputación`
                      : srv.addsDebt
                      ? `Contraer Deuda (${srv.addsDebt} MO)`
                      : `Aplicar (${price} MO)`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* DISTRITO 5: GREMIO, PROFESIONES, SEGUIDORES ÚNICOS Y FAMILIARES     */}
      {/* ==================================================================== */}
      {activeDistrict === 'gremio' && (
        <div className="space-y-6">
          {/* Profesiones */}
          <div className="grimoire-panel rounded-2xl p-5 space-y-3">
            <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> Profesiones del Gremio (1 por Héroe: -20% Ciudad + Bono en Mazmorra)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {PROFESSIONS.map((p) => {
                const chosen = activeHero?.professionId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProfession(p)}
                    disabled={!activeHero}
                    className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      chosen
                        ? 'bg-emerald-950/40 border-emerald-400'
                        : 'bg-stone-950/80 border-stone-800 hover:border-amber-500'
                    }`}
                  >
                    <div className="font-bold text-amber-200 flex items-center justify-between">
                      <span>{p.icon} {p.name}</span>
                      {chosen && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-emerald-300 mt-1">{p.cityBonus}</p>
                    <p className="text-stone-400 mt-1">{p.dungeonBonus}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seguidores Únicos por Fama + Familiares */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="grimoire-panel rounded-2xl p-5 space-y-3">
              <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
                <Users className="w-5 h-5" /> Seguidores Únicos (Desbloqueados por Fama)
              </h3>
              <div className="space-y-2.5">
                {UNIQUE_FOLLOWERS.map((fol) => {
                  const locked = fame < fol.fameRequired;
                  const price = calcPrice(fol.hireCost, 'gremio');
                  return (
                    <div
                      key={fol.id}
                      className={`p-3.5 rounded-xl border text-xs flex flex-col gap-2 ${
                        locked ? 'bg-stone-950/40 border-stone-800 opacity-60' : 'bg-stone-900/80 border-amber-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-amber-200">{fol.name} · {fol.role}</div>
                          <div className="text-[11px] text-sky-300">{fol.stats}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-stone-950 text-amber-400 font-bold">
                          ⭐ Fama {fol.fameRequired}
                        </span>
                      </div>
                      <p className="text-stone-300">{fol.ability}</p>
                      <button
                        onClick={() => handleRecruitFollower(fol)}
                        disabled={locked || !activeHero}
                        className="py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-black font-bold cursor-pointer"
                      >
                        {locked ? `Requiere Fama ${fol.fameRequired}` : `Reclutar (${price} MO)`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              {/* Familiares */}
              <div className="grimoire-panel rounded-2xl p-5 space-y-3">
                <h3 className="font-display text-lg font-bold text-purple-300">
                  🦉 Familiares de Utilidad (1 por Héroe)
                </h3>
                <div className="space-y-2">
                  {FAMILIARS.map((fam) => {
                    const price = calcPrice(fam.cost, 'gremio');
                    return (
                      <div
                        key={fam.id}
                        className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-purple-200">{fam.icon} {fam.name}</div>
                          <div className="text-stone-400">{fam.ability}</div>
                        </div>
                        <button
                          onClick={() => handleAdoptFamiliar(fam)}
                          disabled={!activeHero}
                          className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-white font-bold whitespace-nowrap cursor-pointer"
                        >
                          {price} MO
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mercenarios Clásicos */}
              <div className="grimoire-panel rounded-2xl p-5 space-y-2">
                <h4 className="font-display text-sm font-bold text-stone-200 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" /> Mercenarios Clásicos del Cuartel
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {MERCENARIES.map((m) => (
                    <div key={m.id} className="p-2 rounded-lg bg-stone-900/80 border border-stone-800 text-xs flex justify-between">
                      <div>
                        <strong className="text-stone-100">{m.name}</strong>
                        <span className="text-stone-400 ml-1.5">Mov {m.mov} · At {m.at} · Def {m.def} · PC {m.pc}</span>
                      </div>
                      <span className="text-amber-400 font-bold">{calcPrice(m.cost, 'gremio')} MO</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* DISTRITO 6: BANCO DEL PRESTAMISTA IMPERIAL                           */}
      {/* ==================================================================== */}
      {activeDistrict === 'banco' && activeHero && (
        <div className="grimoire-panel rounded-2xl p-6 space-y-4 max-w-2xl">
          <h3 className="font-display text-xl font-bold text-amber-300 flex items-center gap-2">
            <Landmark className="w-5 h-5" /> Banco del Prestamista Imperial
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            El oro guardado en el Banco está 100% protegido contra robos en la posada (Modo Supervivencia) y nunca se pierde si un héroe cae en la mazmorra.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
              <div className="text-[10px] text-stone-400 uppercase">En Bolsillo</div>
              <div className="font-display text-xl font-bold text-amber-300">{activeHero.gold || 0} MO</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60">
              <div className="text-[10px] text-emerald-300 uppercase">En Bóveda</div>
              <div className="font-display text-xl font-bold text-emerald-300">{activeHero.bankedGold || 0} MO</div>
            </div>
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/60">
              <div className="text-[10px] text-red-300 uppercase">Deuda Activa</div>
              <div className="font-display text-xl font-bold text-red-300">{activeHero.debt || 0} MO</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min="10"
              step="10"
              value={bankAmount}
              onChange={(e) => setBankAmount(Number(e.target.value))}
              className="w-32 px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-sm text-amber-200 font-bold"
            />
            <button
              onClick={handleBankDeposit}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer"
            >
              Depositar en Bóveda
            </button>
            <button
              onClick={handleBankWithdraw}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs cursor-pointer"
            >
              Retirar a Bolsillo
            </button>
            {activeHero.debt > 0 && (
              <button
                onClick={() => {
                  const pay = Math.min(activeHero.gold || 0, activeHero.debt);
                  if (pay <= 0) return;
                  updateHeroById(activeHero.id, (h) => ({
                    ...h,
                    gold: (h.gold || 0) - pay,
                    debt: Math.max(0, (h.debt || 0) - pay),
                  }));
                  showToast(`✅ ${activeHero.name} pagó ${pay} MO de su Deuda.`);
                }}
                className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs cursor-pointer"
              >
                Pagar Deuda
              </button>
            )}
          </div>

          {cityMode === 'survival' && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-700/50 text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Modo Supervivencia activo: guarda aquí tu oro sobrante antes de dormir en la posada.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
