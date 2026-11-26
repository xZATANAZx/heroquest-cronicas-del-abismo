// ============================================================================
// ESCRITOR NARRATIVO CON IA (GOOGLE GEMINI 2.5 FLASH — OPCIONAL)
// Genera historias 100% únicas, coherentes y cinematográficas sobre el mapa BFS
// La API Key se guarda SOLO en localStorage del navegador (nunca se sube a GitHub)
// ============================================================================

const GEMINI_KEY_STORAGE = 'hq_gemini_api_key_v1';

export function getSavedGeminiKey() {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function saveGeminiKey(key) {
  try {
    const clean = (key || '').trim();
    if (clean) localStorage.setItem(GEMINI_KEY_STORAGE, clean);
    else localStorage.removeItem(GEMINI_KEY_STORAGE);
  } catch {
    // ignore
  }
}

export async function enhanceQuestWithGeminiAI({
  quest,
  existingTitles = [],
  apiKey,
}) {
  const key = (apiKey || getSavedGeminiKey()).trim();
  if (!key) {
    throw new Error('Falta tu API Key gratuita de Google Gemini.');
  }

  const avoidList = existingTitles.slice(0, 15).join(' | ') || 'Ninguna';
  const prompt = `Eres un diseñador maestro de campañas de HeroQuest (fantasía oscura clásica, tono cinematográfico y claro en español latino).
Genera una historia ORIGINAL, COHERENTE y MEMORABLE para una misión física de HeroQuest con estos parámetros exactos:
- Bioma: ${quest.biome?.name} (${quest.biome?.globalRule})
- Trama principal: ${quest.plot?.name} (${quest.plot?.objective})
- Nivel del grupo: ${quest.partyLevel} (${quest.partySize} aventurero(s))
- Sala de inicio: ${quest.mapData?.startRoom || 'R14'}
- Títulos ya jugados (NO repetir temas ni nombres similares): ${avoidList}

Responde ÚNICAMENTE con un JSON válido con exactamente estas claves de texto (en español, sin markdown ni explicaciones):
{
  "title": "Título épico y original de la misión (máximo 7 palabras)",
  "bossName": "Nombre completo y epíteto del Jefe Principal",
  "bossDialogue": "Frase memorable que dice el Jefe al entrar en la Gran Sala Central",
  "readAloudIntro": "Prólogo inmersivo de 3 a 4 frases para que el DM lea en voz alta antes de empezar, explicando por qué fueron enviados, qué peligro acecha y qué deben lograr.",
  "act2Discovery": "Descubrimiento clave a mitad de la mazmorra (un diario, un símbolo o un prisionero) que profundiza la trama.",
  "twist": "Giro narrativo y táctico coherente con el bioma y el jefe (1-2 frases concretas).",
  "sideObjective": "Objetivo secundario claro que otorga +1 Reputación.",
  "epilogue": "Breve epílogo (2 frases) de lo que ocurre al volver a la ciudad tras la victoria."
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.95,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(
      res.status === 400 || res.status === 403
        ? 'API Key de Gemini inválida o sin permisos. Verifica tu clave en aistudio.google.com/apikey.'
        : `Error de Gemini (${res.status}): ${errText.slice(0, 120)}`
    );
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = JSON.parse(rawText);

  const nextTitle = parsed.title || quest.title;
  const nextBoss = parsed.bossName || quest.bossName;
  const nextTwist = parsed.twist || quest.twist;
  const nextIntro = parsed.readAloudIntro || quest.readAloudIntro;

  const updatedNotes = (quest.mapData?.notes || []).map((n) => {
    if (n.code === 'A') {
      return { ...n, title: `Inicio — ${nextTitle}`, text: nextIntro };
    }
    if (n.code === 'B') {
      return {
        ...n,
        title: `Cámara del Jefe: ${nextBoss}`,
        text: `“${parsed.bossDialogue || '¡Nadie saldrá vivo de aquí!'}” | Giro: ${nextTwist}`,
      };
    }
    if (n.code === 'D' && parsed.act2Discovery) {
      return { ...n, text: parsed.act2Discovery };
    }
    return n;
  });

  const updatedItems = (quest.mapData?.items || []).map((it) =>
    it.isBoss ? { ...it, label: `JEFE: ${nextBoss}` } : it
  );

  return {
    ...quest,
    aiGenerated: true,
    title: nextTitle,
    bossName: nextBoss,
    bossDialogue: parsed.bossDialogue || '',
    twist: nextTwist,
    sideObjective: parsed.sideObjective || quest.sideObjective,
    readAloudIntro: nextIntro,
    storyBeats: {
      ...(quest.storyBeats || {}),
      act2Discovery: parsed.act2Discovery || '',
      bossDialogue: parsed.bossDialogue || '',
      epilogue: parsed.epilogue || '',
    },
    bossPhase2: `Fase 2 (al 50% PC): ${nextBoss} grita “${parsed.bossDialogue || '¡Sientan mi ira!'}”, recupera 2 PC y gana +1 DC Ataque.`,
    mapData: {
      ...quest.mapData,
      title: nextTitle,
      bossName: nextBoss,
      twist: nextTwist,
      intro: nextIntro,
      readAloudIntro: nextIntro,
      notes: updatedNotes,
      items: updatedItems,
    },
  };
}
