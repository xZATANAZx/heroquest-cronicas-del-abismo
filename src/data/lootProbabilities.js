// ============================================================================
// HEROQUEST: CRÓNICAS DEL ABISMO (Sistema HQ-D20 v2)
// MOTOR DE PROBABILIDADES POR RAREZA (Cuerpos, Cofres, Muebles y Eventos)
// Incluye resultados vacíos y bonos automáticos según el Héroe que revisa
// ============================================================================

import { DIGITAL_LOOT_CATALOG, generateProceduralLoot, getRarityMeta } from './lootCatalog';
import { getMaterialById } from './craftingSystem';
import { rollRandomSpellScroll } from './magicWinds';

const COMMON_MATS = ['hierba_lunar', 'chatarra_acero', 'colmillos_hueso', 'aceite_alquitran', 'racion_mazmorra'];
const UNCOMMON_MATS = ['glandula_veneno', 'sangre_icor', 'polvora_negra', 'polvo_runico', 'pergamino_virgen'];
const RARE_MATS = ['esencia_espectral', 'gema_abismal'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Detecta bonos activos del héroe que revisa un cuerpo, cofre, mueble o trampa
export function evaluateHeroLootBonuses(hero, context = 'body', isEliteOrBoss = false) {
  const bonuses = {
    extraMaterials: 0,
    doubleMaterials: false,
    goldMultiplier: 1,
    notes: [],
  };
  if (!hero) return bonuses;

  const prof = hero.professionId || '';
  const quirkId = hero.quirk?.id || '';

  // 1. Rasgo: Manos de Fortuna (+25% Monedas de Oro en cofres y cuerpos)
  if (quirkId === 'manos_de_oro' && (context === 'body' || context === 'chest')) {
    bonuses.goldMultiplier = Math.max(bonuses.goldMultiplier, 1.25);
    bonuses.notes.push('🪙 Manos de Fortuna (+25% Monedas de Oro)');
  }

  // 2. Profesión: Cazador de Trofeos (+1 Material raro de Jefes/Élites)
  if (prof === 'cazador' && (context === 'body' || isEliteOrBoss)) {
    bonuses.extraMaterials += 1;
    bonuses.notes.push('🏹 Cazador de Trofeos (+1 Material extra al revisar cuerpos)');
  }

  // 3. Profesión: Mercader (+20% Oro en cofres/tesoros)
  if (prof === 'mercader' && (context === 'chest' || context === 'furniture')) {
    bonuses.goldMultiplier = 1.2;
    bonuses.notes.push('💰 Mercader (+20% Monedas de Oro)');
  }

  // 4. Profesión: Escriba Rúnico (+1 Polvo Rúnico en muebles/bibliotecas/altares)
  if (prof === 'escriba' && context === 'furniture') {
    bonuses.extraMaterials += 1;
    bonuses.notes.push('📜 Escriba Rúnico (+1 Material arcano extra)');
  }

  // 5. Profesión: Cerrajero/Minero (dobla materiales en trampas/cofres)
  if (prof === 'minero' && context === 'chest') {
    bonuses.doubleMaterials = true;
    bonuses.notes.push('🗝️ Cerrajero e Ingeniero (×2 Materiales en cofres)');
  }

  // 6. Profesión: Herbolario Alquimista (+1 Hierba en muebles/eventos)
  if (prof === 'alquimista' && (context === 'furniture' || context === 'event')) {
    bonuses.extraMaterials += 1;
    bonuses.notes.push('🧪 Herbolario Alquimista (+1 ingrediente extra)');
  }

  // 7. Efecto activo temporal de "Doble Material" (ej. de un evento o banco de alquimia)
  const hasDoubleBuff = (hero.activeEffects || []).some((e) =>
    `${e.label || ''} ${e.note || ''}`.toLowerCase().includes('doble material')
  );
  if (hasDoubleBuff) {
    bonuses.doubleMaterials = true;
    bonuses.notes.push('✨ Beneficio Activo (×2 Materiales en este encuentro)');
  }

  return bonuses;
}

// Revisa el cadáver de un monstruo abatido usando tabla real de porcentajes por rareza
export function rollBodyLoot({ monsterName = 'Monstruo', isBoss = false, isElite = false, partyLevel = 1, hero = null }) {
  const rollPct = Math.floor(Math.random() * 100) + 1; // 1..100
  const highTier = isBoss || isElite;
  const heroBonuses = evaluateHeroLootBonuses(hero, 'body', highTier);

  let materialId = null;
  let materialQty = 0;
  let rewardGold = 0;
  let rewardLoot = null;
  let rarityLabel = 'Vacío';
  let title = '';
  let text = '';

  if (highTier) {
    // JEFE / ÉLITE: 0% Vacío | 30% Oro + Mat Poco Común | 40% Mat Raro | 22% Objeto Raro | 8% Objeto Épico
    if (rollPct <= 30) {
      rarityLabel = 'Poco Común';
      rewardGold = Math.round((25 + partyLevel * 8) * heroBonuses.goldMultiplier);
      materialId = pick(UNCOMMON_MATS);
      materialQty = 1;
      const mat = getMaterialById(materialId);
      title = `Bolsa de Guerra de ${monsterName}`;
      text = `Entre su armadura encuentran ${rewardGold} MO y 1× ${mat.icon} ${mat.name}.`;
    } else if (rollPct <= 70) {
      rarityLabel = 'Raro';
      materialId = pick(RARE_MATS);
      materialQty = 1;
      rewardGold = Math.round((15 + partyLevel * 5) * heroBonuses.goldMultiplier);
      const mat = getMaterialById(materialId);
      title = `Esencia Valiosa de ${monsterName}`;
      text = `Extraen un componente raro: 1× ${mat.icon} ${mat.name} y ${rewardGold} MO.`;
    } else if (rollPct <= 92) {
      rarityLabel = 'Objeto Raro';
      const rarePool = DIGITAL_LOOT_CATALOG.filter((it) => it.rarity === 'raro');
      rewardLoot = Math.random() < 0.5 && rarePool.length ? pick(rarePool) : generateProceduralLoot('raro', partyLevel);
      title = `¡Trofeo Raro: ${rewardLoot.name}!`;
      text = `${monsterName} portaba ${rewardLoot.name} (${rewardLoot.dice}). ${rewardLoot.upgrade || rewardLoot.special || ''}`;
    } else {
      rarityLabel = 'Objeto Épico';
      const epicPool = DIGITAL_LOOT_CATALOG.filter((it) => it.rarity === 'epico');
      rewardLoot = Math.random() < 0.5 && epicPool.length ? pick(epicPool) : generateProceduralLoot('epico', partyLevel);
      title = `✨ ¡Botín Épico: ${rewardLoot.name}!`;
      text = `¡Hallazgo excepcional! ${rewardLoot.name} (${rewardLoot.dice}). ${rewardLoot.upgrade || rewardLoot.special || ''}`;
    }
  } else {
    // MONSTRUO NORMAL: 35% Vacío | 33% Oro pequeño | 22% Material Común/Poco Común | 8% Consumible | 2% Objeto Poco Común
    if (rollPct <= 35) {
      rarityLabel = 'Vacío';
      title = `Cuerpo Vacío (${monsterName})`;
      text = `Revisan el cuerpo, pero solo lleva harapos rotos y armas inservibles. No encuentran nada.`;
    } else if (rollPct <= 68) {
      rarityLabel = 'Común · Oro';
      rewardGold = Math.round((6 + Math.floor(Math.random() * 10) + partyLevel * 2) * heroBonuses.goldMultiplier);
      title = `Monedas de ${monsterName}`;
      text = `En su cinturón rescatan ${rewardGold} Monedas de Oro.`;
    } else if (rollPct <= 90) {
      rarityLabel = 'Material';
      materialId = rollPct > 83 ? pick(UNCOMMON_MATS) : pick(COMMON_MATS);
      materialQty = 1;
      const mat = getMaterialById(materialId);
      title = `Material Rescatado de ${monsterName}`;
      text = `Aprovechan 1× ${mat.icon} ${mat.name} en buen estado.`;
    } else if (rollPct <= 98) {
      rarityLabel = 'Consumible';
      rewardLoot = {
        name: 'Poción de Curación Menor',
        type: 'Poción',
        rarity: 'comun',
        dice: '+2 PC',
        special: 'Acción gratuita: restaura 2 PC.',
        upgrade: 'Acción gratuita: restaura 2 PC.',
      };
      title = `¡Frasco Intacto en ${monsterName}!`;
      text = `Entre sus ropas llevaba una Poción de Curación Menor (+2 PC) intacta.`;
    } else {
      rarityLabel = 'Poco Común';
      const uncPool = DIGITAL_LOOT_CATALOG.filter((it) => it.rarity === 'poco_comun');
      rewardLoot = uncPool.length ? pick(uncPool) : generateProceduralLoot('poco_comun', partyLevel);
      title = `¡Hallazgo Inusual: ${rewardLoot.name}!`;
      text = `¡Suerte rara! Escondía ${rewardLoot.name} (${rewardLoot.dice}).`;
    }
  }

  // Aplicar bonos automáticos del héroe que revisa
  if (heroBonuses.doubleMaterials && materialId && materialQty > 0) {
    materialQty *= 2;
  }
  if (heroBonuses.extraMaterials > 0) {
    if (!materialId) {
      materialId = highTier ? pick(UNCOMMON_MATS) : pick(COMMON_MATS);
      materialQty = heroBonuses.extraMaterials;
    } else {
      materialQty += heroBonuses.extraMaterials;
    }
  }

  return {
    rollPct,
    rarityLabel,
    title,
    text,
    rewardGold,
    rewardLoot,
    materialId,
    materialQty,
    heroBonusNotes: heroBonuses.notes,
    isEmpty: !rewardGold && !rewardLoot && !materialId,
  };
}

// Búsqueda de Tesoro / Cofre con probabilidades reales por rareza (incluye Vacío y Trampa; NUNCA suelta Artefactos Oficiales)
export function rollTreasureProbability({ partyLevel = 1, hero = null }) {
  const rollPct = Math.floor(Math.random() * 100) + 1;
  const heroBonuses = evaluateHeroLootBonuses(hero, 'chest', false);

  let rewardGold = 0;
  let rewardLoot = null;
  let materialId = null;
  let materialQty = 0;
  let isTrap = false;
  let badge = '';
  let title = '';
  let text = '';

  if (rollPct <= 18) {
    badge = 'Vacío';
    title = 'Cofre / Rincón Vacío';
    text = 'Solo polvo, telas podridas y monedas falsas. No hay nada de valor aquí.';
  } else if (rollPct <= 30) {
    isTrap = true;
    badge = '¡Trampa!';
    title = '¡Trampa de Aguja en el Escondite!';
    text = '¡Clic! Una aguja salta al buscar. Agilidad AGI CD 12 o pierde 1 PC (y el Reloj del Caos sube +1).';
  } else if (rollPct <= 64) {
    badge = 'Común · Oro';
    rewardGold = Math.round((15 + partyLevel * 6 + Math.floor(Math.random() * 15)) * heroBonuses.goldMultiplier);
    title = `Alijo de ${rewardGold} Monedas de Oro`;
    text = `Encuentran una bolsa escondida con ${rewardGold} MO.`;
  } else if (rollPct <= 84) {
    badge = 'Materiales';
    materialId = rollPct > 76 ? pick(UNCOMMON_MATS) : pick(COMMON_MATS);
    materialQty = 1;
    const mat = getMaterialById(materialId);
    title = `Suministros de Crafteo: ${mat.name}`;
    text = `Recuperan 1× ${mat.icon} ${mat.name} listo para la Forja o el Alquimista.`;
  } else if (rollPct <= 94) {
    badge = 'Poco Común';
    if (Math.random() < 0.38) {
      rewardLoot = rollRandomSpellScroll();
      title = `📜 ¡${rewardLoot.name}!`;
      text = `${rewardLoot.special}`;
    } else {
      const pool = DIGITAL_LOOT_CATALOG.filter((it) => it.rarity === 'poco_comun');
      rewardLoot = pool.length ? pick(pool) : generateProceduralLoot('poco_comun', partyLevel);
      const rMeta = getRarityMeta(rewardLoot.rarity);
      title = `¡${rewardLoot.name} (${rMeta.name})!`;
      text = `${rewardLoot.special || rewardLoot.upgrade || ''}`;
    }
  } else if (rollPct <= 98) {
    badge = 'Raro';
    const pool = DIGITAL_LOOT_CATALOG.filter((it) => it.rarity === 'raro');
    rewardLoot = pool.length && Math.random() < 0.5 ? pick(pool) : generateProceduralLoot('raro', partyLevel);
    const rMeta = getRarityMeta(rewardLoot.rarity);
    title = `✨ ¡Tesoro Raro: ${rewardLoot.name} (${rMeta.name})!`;
    text = `${rewardLoot.upgrade || rewardLoot.special || ''}`;
  } else {
    badge = 'Épico';
    const pool = DIGITAL_LOOT_CATALOG.filter((it) => it.rarity === 'epico');
    rewardLoot = pool.length && Math.random() < 0.5 ? pick(pool) : generateProceduralLoot('epico', partyLevel);
    const rMeta = getRarityMeta(rewardLoot.rarity);
    title = `🌟 ¡Tesoro Épico: ${rewardLoot.name} (${rMeta.name})!`;
    text = `¡Hallazgo extraordinario! ${rewardLoot.upgrade || rewardLoot.special || ''}`;
  }

  if (heroBonuses.doubleMaterials && materialId && materialQty > 0) {
    materialQty *= 2;
  }
  if (heroBonuses.extraMaterials > 0 && !isTrap && rollPct > 18) {
    if (!materialId) {
      materialId = pick(COMMON_MATS);
      materialQty = heroBonuses.extraMaterials;
    } else {
      materialQty += heroBonuses.extraMaterials;
    }
  }

  return {
    rollPct,
    badge,
    title,
    text,
    rewardGold,
    rewardLoot,
    materialId,
    materialQty,
    isTrap,
    heroBonusNotes: heroBonuses.notes,
  };
}
