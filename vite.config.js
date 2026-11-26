import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { bin as cloudflaredBin, install as installCloudflared } from 'cloudflared';

const DATA_DIR = path.resolve(process.cwd(), '.hq_data');
const DATA_FILE = path.resolve(DATA_DIR, 'campaign_heroes.json');
const CREATOR_NOTES_FILE = path.resolve(DATA_DIR, 'creator_notes.json');
const OUTWORLD_FILE = path.resolve(DATA_DIR, 'outworld_state.json');
const LEGACY_DATA_FILE = path.resolve(process.cwd(), 'campaign_heroes.json');
const isCreatorMachine = () =>
  fs.existsSync(path.resolve(process.cwd(), '.hq_creator')) ||
  fs.existsSync(path.resolve(process.cwd(), '.git'));
const ACTIONS_STORE = [];
const ACTIVE_PUZZLES = {}; // { [heroId]: { id, puzzle, sentAt } }
let CITY_MODE_OPEN = false;
let CONTRACTS_BOARD = { contracts: [], votes: {} };

const DEFAULT_OUTWORLD_STATE = {
  phase: 'camp', // 'camp' | 'travel' | 'settlement'
  settlementType: 'capital', // 'village' | 'town' | 'capital'
  travelDay: 0,
  travelTotal: 0,
  settlementDay: 1,
  strictMode: false, // false = Campaña Heroica, true = Estricto Outworld
  useStockRolls: false,
  havenUnlocked: false,
  havenVaultGold: 0,
  havenVaultGems: 0,
  havenVaultItems: [],
  activeEvent: null, // Último evento de Outworld (Viaje / Asentamiento / Taberna / Mercado Negro / Haven / Catástrofe)
  randomDungeonEvent: null, // Último Random Event de Mazmorra (pág. 45 / 102–105)
  arenaRound: 0,
  updatedAt: 0,
};

function readOutworldState() {
  try {
    if (fs.existsSync(OUTWORLD_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(OUTWORLD_FILE, 'utf8'));
      return { ...DEFAULT_OUTWORLD_STATE, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_OUTWORLD_STATE };
}

function writeOutworldState(next) {
  try {
    fs.writeFileSync(OUTWORLD_FILE, JSON.stringify(next, null, 2), 'utf8');
  } catch {
    // ignore
  }
}

// Migrar archivo antiguo si existe para no perder héroes ya creados
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}
if (!fs.existsSync(DATA_FILE) && fs.existsSync(LEGACY_DATA_FILE)) {
  try {
    fs.copyFileSync(LEGACY_DATA_FILE, DATA_FILE);
  } catch {
    // ignore
  }
}

function getAllLocalIPv4s() {
  const nets = os.networkInterfaces();
  const list = [];
  const virtualPattern = /(vethernet|wsl|hyper-v|virtualbox|vmware|docker|vbox|loopback|tailscale|zerotier|hamachi|vpn|bluetooth|pseudo)/i;

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254.')) {
        const isVirtual =
          virtualPattern.test(name) ||
          net.address.startsWith('192.168.56.') ||
          net.address.startsWith('172.17.') ||
          net.address.startsWith('172.18.') ||
          net.address.startsWith('172.19.') ||
          net.address.startsWith('172.20.') ||
          net.address.startsWith('172.21.') ||
          net.address.startsWith('172.22.') ||
          net.address.startsWith('172.23.') ||
          net.address.startsWith('172.24.') ||
          net.address.startsWith('172.25.') ||
          net.address.startsWith('172.26.') ||
          net.address.startsWith('172.27.') ||
          net.address.startsWith('172.28.') ||
          net.address.startsWith('172.29.') ||
          net.address.startsWith('172.30.') ||
          net.address.startsWith('172.31.');

        let score = 0;
        if (!isVirtual) score += 100;
        if (/wi-?fi|wlan|wireless|inal/i.test(name)) score += 40;
        if (/ethernet|lan/i.test(name) && !isVirtual) score += 30;
        if (net.address.startsWith('192.168.')) score += 25;
        else if (net.address.startsWith('10.')) score += 15;

        list.push({ name, address: net.address, isVirtual, score });
      }
    }
  }

  list.sort((a, b) => b.score - a.score);
  return list;
}

function getLocalIPv4() {
  const all = getAllLocalIPv4s();
  return all[0]?.address || 'localhost';
}

function readHeroesStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      return { heroes: parsed.heroes || [], version: parsed.version || 1 };
    }
  } catch {
    // ignore corrupt file
  }
  return { heroes: [], version: 1 };
}

function writeHeroesStore(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

function localSyncAndTunnelPlugin() {
  let publicTunnelUrl = '';
  let tunnelStatus = 'starting'; // 'starting' | 'ready' | 'local'
  let tunnelProc = null;
  let activePort = 5173;
  let retryCount = 0;

  const stopTunnel = () => {
    try {
      tunnelProc?.kill();
    } catch {
      // ignore
    }
    tunnelProc = null;
  };

  const startTunnel = async (port) => {
    activePort = port || activePort;
    stopTunnel();
    publicTunnelUrl = '';
    tunnelStatus = 'starting';
    try {
      if (!fs.existsSync(cloudflaredBin)) {
        console.log('[HeroQuest QR] Descargando Cloudflare Tunnel por primera vez...');
        await installCloudflared(cloudflaredBin);
      }
      // --protocol http2 usa HTTPS TCP 443 (evita bloqueos de UDP/QUIC en routers de casa y Windows)
      tunnelProc = spawn(
        cloudflaredBin,
        ['tunnel', '--protocol', 'http2', '--no-autoupdate', '--url', `http://127.0.0.1:${activePort}`],
        { stdio: ['ignore', 'pipe', 'pipe'] }
      );

      const handleOutput = (data) => {
        const text = data.toString();
        const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
        if (match && !publicTunnelUrl) {
          publicTunnelUrl = match[0];
          tunnelStatus = 'ready';
          retryCount = 0;
          console.log(`\n[HeroQuest QR] Tunel Publico Listo (cualquier router/datos): ${publicTunnelUrl}/?player=new\n`);
        }
      };

      tunnelProc.stdout.on('data', handleOutput);
      tunnelProc.stderr.on('data', handleOutput);
      tunnelProc.on('error', () => {
        tunnelStatus = 'local';
      });
      tunnelProc.on('close', () => {
        if (!publicTunnelUrl) {
          if (retryCount < 2) {
            retryCount += 1;
            setTimeout(() => startTunnel(activePort), 2500);
          } else {
            tunnelStatus = 'local';
          }
        }
      });
    } catch {
      tunnelStatus = 'local';
    }
  };

  return {
    name: 'heroquest-lan-sync-and-tunnel',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const addr = server.httpServer.address();
        const port = typeof addr === 'object' && addr ? addr.port : 5173;
        startTunnel(port);
      });

      server.httpServer?.once('close', () => {
        stopTunnel();
      });

      server.middlewares.use('/api/ping', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ ok: true, time: Date.now() }));
      });

      server.middlewares.use('/api/city-mode', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        if (req.method === 'POST') {
          const payload = await parseBody(req);
          CITY_MODE_OPEN = Boolean(payload.cityOpen);
        }
        res.end(JSON.stringify({ ok: true, cityOpen: CITY_MODE_OPEN }));
      });

      server.middlewares.use('/api/contracts', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        const url = req.url || '';
        if (req.method === 'POST') {
          const payload = await parseBody(req);
          if (url.startsWith('/publish') && Array.isArray(payload.contracts)) {
            CONTRACTS_BOARD = { contracts: payload.contracts, votes: {} };
            res.end(JSON.stringify({ ok: true, ...CONTRACTS_BOARD }));
            return;
          }
          if (url.startsWith('/vote') && payload.heroId && payload.contractId) {
            CONTRACTS_BOARD.votes[payload.heroId] = {
              contractId: payload.contractId,
              heroName: payload.heroName || 'Héroe',
            };
            res.end(JSON.stringify({ ok: true, ...CONTRACTS_BOARD }));
            return;
          }
        }
        res.end(JSON.stringify(CONTRACTS_BOARD));
      });

      server.middlewares.use('/api/outworld', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        const current = readOutworldState();
        if (req.method === 'POST') {
          const payload = await parseBody(req);
          const merged = { ...current, ...payload, updatedAt: Date.now() };
          writeOutworldState(merged);
          res.end(JSON.stringify({ ok: true, state: merged }));
          return;
        }
        res.end(JSON.stringify({ ok: true, state: current }));
      });

      server.middlewares.use('/api/network-info', (req, res) => {
        const interfaces = getAllLocalIPv4s();
        const ip = interfaces[0]?.address || 'localhost';
        const addr = server.httpServer?.address();
        const port = typeof addr === 'object' && addr ? addr.port : 5173;
        const localUrl = `http://${ip}:${port}`;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');

        if (req.method === 'POST' && (req.url || '').startsWith('/restart')) {
          retryCount = 0;
          startTunnel(port);
          res.end(JSON.stringify({ ok: true, tunnelStatus: 'starting' }));
          return;
        }

        res.end(
          JSON.stringify({
            ip,
            port,
            localUrl,
            interfaces: interfaces.map((i) => ({
              name: i.name,
              address: i.address,
              isVirtual: i.isVirtual,
              url: `http://${i.address}:${port}`,
            })),
            publicTunnelUrl,
            baseUrl: publicTunnelUrl || localUrl,
            isPublicTunnel: Boolean(publicTunnelUrl),
            tunnelStatus,
          })
        );
      });

      server.middlewares.use('/api/actions', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');

        if (req.method === 'GET') {
          res.end(JSON.stringify({ actions: ACTIONS_STORE.slice(0, 12) }));
          return;
        }

        if (req.method === 'POST') {
          const url = req.url || '';
          const payload = await parseBody(req);

          if (url.startsWith('/dismiss') && payload.id) {
            const idx = ACTIONS_STORE.findIndex((a) => a.id === payload.id);
            if (idx >= 0) ACTIONS_STORE.splice(idx, 1);
            res.end(JSON.stringify({ ok: true }));
            return;
          }

          if (payload.action) {
            const entry = {
              ...payload.action,
              id: payload.action.id || `act-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              timestamp: Date.now(),
            };
            ACTIONS_STORE.unshift(entry);
            if (ACTIONS_STORE.length > 20) ACTIONS_STORE.length = 20;
            res.end(JSON.stringify({ ok: true, action: entry }));
            return;
          }
        }

        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Acción inválida' }));
      });

      // Puzzles interactivos enviados del DM al celular de un héroe específico
      server.middlewares.use('/api/puzzles', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');

        if (req.method === 'GET') {
          const parsed = new URL(req.url || '/', 'http://localhost');
          const heroId = parsed.searchParams.get('heroId');
          if (heroId) {
            res.end(JSON.stringify({ activePuzzle: ACTIVE_PUZZLES[heroId] || null }));
            return;
          }
          res.end(JSON.stringify({ activePuzzles: ACTIVE_PUZZLES }));
          return;
        }

        if (req.method === 'POST') {
          const url = req.url || '';
          const payload = await parseBody(req);

          if (url.startsWith('/send') && payload.heroId && payload.puzzle) {
            ACTIVE_PUZZLES[payload.heroId] = {
              instanceId: `puz-${Date.now()}`,
              heroId: payload.heroId,
              puzzle: payload.puzzle,
              sentAt: Date.now(),
            };
            res.end(JSON.stringify({ ok: true, activePuzzle: ACTIVE_PUZZLES[payload.heroId] }));
            return;
          }

          if (url.startsWith('/clear') && payload.heroId) {
            delete ACTIVE_PUZZLES[payload.heroId];
            res.end(JSON.stringify({ ok: true }));
            return;
          }
        }

        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Solicitud de puzzle inválida' }));
      });

      server.middlewares.use('/api/heroes', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');

        if (req.method === 'GET') {
          const store = readHeroesStore();
          res.end(JSON.stringify(store));
          return;
        }

        if (req.method === 'POST') {
          const url = req.url || '';
          const payload = await parseBody(req);
          const store = readHeroesStore();

          if (url.startsWith('/add') && payload.hero) {
            const exists = store.heroes.some((h) => h.id === payload.hero.id);
            const nextHeroes = exists
              ? store.heroes.map((h) => (h.id === payload.hero.id ? payload.hero : h))
              : [...store.heroes, payload.hero];
            const nextStore = { heroes: nextHeroes, version: store.version + 1 };
            writeHeroesStore(nextStore);
            res.end(JSON.stringify({ ok: true, hero: payload.hero, version: nextStore.version }));
            return;
          }

          if (url.startsWith('/update') && payload.hero) {
            const nextHeroes = store.heroes.map((h) =>
              h.id === payload.hero.id ? payload.hero : h
            );
            const nextStore = { heroes: nextHeroes, version: store.version + 1 };
            writeHeroesStore(nextStore);
            res.end(JSON.stringify({ ok: true, hero: payload.hero, version: nextStore.version }));
            return;
          }

          if (url.startsWith('/transfer') && payload.fromHeroId && payload.toHeroId && payload.itemId) {
            const fromHero = store.heroes.find((h) => h.id === payload.fromHeroId);
            const toHero = store.heroes.find((h) => h.id === payload.toHeroId);
            const item = fromHero?.inventory?.find((it) => it.id === payload.itemId);
            if (!fromHero || !toHero || !item) {
              res.statusCode = 404;
              res.end(JSON.stringify({ ok: false, error: 'Héroe u objeto no encontrado' }));
              return;
            }
            const transferredItem = { ...item, equipped: false };
            const nextHeroes = store.heroes.map((h) => {
              if (h.id === fromHero.id) {
                return { ...h, inventory: (h.inventory || []).filter((it) => it.id !== item.id) };
              }
              if (h.id === toHero.id) {
                return { ...h, inventory: [...(h.inventory || []), transferredItem] };
              }
              return h;
            });
            const nextStore = { heroes: nextHeroes, version: store.version + 1 };
            writeHeroesStore(nextStore);
            const updatedFrom = nextHeroes.find((h) => h.id === fromHero.id);
            res.end(
              JSON.stringify({
                ok: true,
                fromHero: updatedFrom,
                toHeroName: toHero.name,
                itemName: item.name,
                version: nextStore.version,
              })
            );
            return;
          }

          if (url.startsWith('/sync') && Array.isArray(payload.heroes)) {
            const nextStore = { heroes: payload.heroes, version: store.version + 1 };
            writeHeroesStore(nextStore);
            res.end(JSON.stringify({ ok: true, version: nextStore.version }));
            return;
          }
        }

        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Solicitud inválida' }));
      });

      // Detección de PC del Creador (solo true en la PC con .git o .hq_creator; false en PCs de amigos)
      server.middlewares.use('/api/creator-status', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ isCreator: isCreatorMachine() }));
      });

      // Notas privadas del creador (guardadas solo en .hq_data local)
      server.middlewares.use('/api/creator-notes', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        if (!isCreatorMachine()) {
          res.statusCode = 403;
          res.end(JSON.stringify({ notes: [] }));
          return;
        }
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(CREATOR_NOTES_FILE)) {
              const parsed = JSON.parse(fs.readFileSync(CREATOR_NOTES_FILE, 'utf-8'));
              res.end(JSON.stringify({ notes: parsed.notes || [] }));
              return;
            }
          } catch {
            // ignore
          }
          res.end(JSON.stringify({ notes: [] }));
          return;
        }
        if (req.method === 'POST') {
          const payload = await parseBody(req);
          const notes = Array.isArray(payload.notes) ? payload.notes : [];
          try {
            fs.writeFileSync(CREATOR_NOTES_FILE, JSON.stringify({ notes }, null, 2), 'utf-8');
          } catch {
            // ignore
          }
          res.end(JSON.stringify({ ok: true, notes }));
          return;
        }
        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Método no permitido' }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localSyncAndTunnelPlugin()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    watch: {
      // CRÍTICO: ignorar los archivos JSON de estado para que guardar cambios del celular NUNCA refresque la página
      ignored: ['**/.hq_data/**', '**/campaign_heroes.json'],
    },
  },
});
