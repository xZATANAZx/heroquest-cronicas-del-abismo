import React from 'react';

// ============================================================================
// ICONOS OFICIALES DE TABLERO HEROQUEST (Paquete Open-Source HeroScribe GPL-2.0)
// Orientaciones reales verificadas en píxeles:
//   - tomb.png (56×91) y torture_rack.png (64×94) son NATIVAMENTE VERTICALES (2×3)
//   - El resto de muebles 3×2 y 3×1 son NATIVAMENTE HORIZONTALES
//   - door.png (41×18) y secret_door.png (27×19) son HORIZONTALES sobre el muro
// ============================================================================

const INK = '#3b1616';

const NATIVE_VERTICAL = new Set(['tomb', 'torture_rack']);

const FURNITURE_ICONS = {
  table: '/hq-icons/table.png',
  bookcase: '/hq-icons/bookcase.png',
  cupboard: '/hq-icons/cupboard.png',
  fireplace: '/hq-icons/fireplace.png',
  weapon_rack: '/hq-icons/weapon_rack.png',
  alchemy_bench: '/hq-icons/alchemy_bench.png',
  sorcerer_table: '/hq-icons/sorcerer_table.png',
  tomb: '/hq-icons/tomb.png',
  torture_rack: '/hq-icons/torture_rack.png',
  throne: '/hq-icons/throne.png',
  chest: '/hq-icons/chest.png',
};

const MONSTER_ICONS = {
  goblin: '/hq-icons/goblin.png',
  orc: '/hq-icons/orc.png',
  abomination: '/hq-icons/abomination.png',
  skeleton: '/hq-icons/skeleton.png',
  zombie: '/hq-icons/zombie.png',
  mummy: '/hq-icons/mummy.png',
  dread_warrior: '/hq-icons/dread_warrior.png',
  gargoyle: '/hq-icons/gargoyle.png',
  sorcerer: '/hq-icons/sorcerer.png',
  npc: '/hq-icons/npc.png',
  hero: '/hq-icons/hero.png',
};

const STRUCTURE_AND_TRAP_ICONS = {
  stairs: '/hq-icons/stairs.png',
  door: '/hq-icons/door.png',
  secret_door: '/hq-icons/secret_door.png',
  blocked: '/hq-icons/blocked.png',
  blocked_double: '/hq-icons/blocked_double.png',
  trap_pit: '/hq-icons/trap_pit.png',
  trap_spear: '/hq-icons/trap_spear.png',
  trap_falling_rock: '/hq-icons/trap_falling_rock.png',
};

export function getPieceIconSrc(type) {
  return FURNITURE_ICONS[type] || MONSTER_ICONS[type] || STRUCTURE_AND_TRAP_ICONS[type] || null;
}

// Rota 90° SOLO cuando la orientación del PNG nativo no coincide con la orientación (w vs h) en el tablero
function SmartOrientedImage({ type, src, px, py, w, h, pad = 1 }) {
  const isNativeVert = NATIVE_VERTICAL.has(type);
  const isTargetVert = h > w;
  const isSquare = Math.abs(w - h) < 2;
  const needsRotate = !isSquare && isNativeVert !== isTargetVert;

  if (!needsRotate) {
    return (
      <image
        href={src}
        x={px + pad}
        y={py + pad}
        width={w - pad * 2}
        height={h - pad * 2}
        preserveAspectRatio="xMidYMid meet"
      />
    );
  }

  const cx = px + w / 2;
  const cy = py + h / 2;
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(90)`}>
      <image
        href={src}
        x={-(h / 2) + pad}
        y={-(w / 2) + pad}
        width={h - pad * 2}
        height={w - pad * 2}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

// ============================================================================
// 1. MUEBLES OFICIALES (11 piezas HeroScribe con orientación y escala exactas)
// ============================================================================
export function FurnitureSVG({ type, px, py, w, h }) {
  const src = FURNITURE_ICONS[type] || FURNITURE_ICONS.table;
  return <SmartOrientedImage type={type} src={src} px={px} py={py} w={w} h={h} pad={1.5} />;
}

// ============================================================================
// 2. ESTRUCTURAS OFICIALES (Escaleras, Puertas, Puertas Secretas, Muros Bloqueados)
// ============================================================================
export function StairsSVG({ px, py, w, h }) {
  return (
    <g>
      <image
        href="/hq-icons/stairs.png"
        x={px + 0.5}
        y={py + 0.5}
        width={w - 1}
        height={h - 1}
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  );
}

export function DoorSVG({ type, px, py, cell, edge = 'N' }) {
  const isSecret = type === 'secret_door';
  const src = isSecret ? '/hq-icons/secret_door.png' : '/hq-icons/door.png';
  const isHorizontal = edge === 'N' || edge === 'S';
  const cx = edge === 'W' ? px : edge === 'E' ? px + cell : px + cell / 2;
  const cy = edge === 'N' ? py : edge === 'S' ? py + cell : py + cell / 2;
  const imgW = isSecret ? cell * 0.9 : cell * 1.05;
  const imgH = isSecret ? cell * 0.62 : cell * 0.48;

  return (
    <g transform={`translate(${cx}, ${cy}) ${isHorizontal ? '' : 'rotate(90)'}`}>
      {isSecret && (
        <rect
          x={-imgW / 2 - 1}
          y={-imgH / 2 - 1}
          width={imgW + 2}
          height={imgH + 2}
          rx="2.5"
          fill="rgba(126, 34, 206, 0.22)"
          stroke="#7e22ce"
          strokeWidth="1.2"
          strokeDasharray="2,1.5"
        />
      )}
      <image
        href={src}
        x={-imgW / 2}
        y={-imgH / 2}
        width={imgW}
        height={imgH}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

export function BlockedWallSVG({ type, px, py, w, h }) {
  const src = type === 'blocked_double' ? '/hq-icons/blocked_double.png' : '/hq-icons/blocked.png';
  return (
    <SmartOrientedImage
      type={type}
      src={src}
      px={px}
      py={py}
      w={w}
      h={h}
      pad={0}
    />
  );
}

// ============================================================================
// 3. TRAMPAS OFICIALES (Estilo Moderno HeroQuest 2021)
// ============================================================================
export function TrapSVG({ type, px, py, cell, isDisarmed, isSelected }) {
  const src =
    type === 'trap_pit'
      ? '/hq-icons/trap_pit.png'
      : type === 'trap_falling_rock'
      ? '/hq-icons/trap_falling_rock.png'
      : '/hq-icons/trap_spear.png';

  return (
    <g opacity={isDisarmed ? 0.35 : 1}>
      <rect
        x={px + 1.5}
        y={py + 1.5}
        width={cell - 3}
        height={cell - 3}
        rx="4"
        fill="rgba(185, 28, 28, 0.16)"
        stroke={isSelected ? '#fde047' : '#b91c1c'}
        strokeWidth={isSelected ? '2.4' : '1.3'}
        strokeDasharray={isSelected ? undefined : '2.5,1.5'}
      />
      <image
        href={src}
        x={px + 2.5}
        y={py + 2.5}
        width={cell - 5}
        height={cell - 5}
        preserveAspectRatio="xMidYMid meet"
      />
      {isDisarmed && (
        <g>
          <circle cx={px + cell / 2} cy={py + cell / 2} r="9" fill="rgba(21, 128, 61, 0.92)" />
          <text x={px + cell / 2} y={py + cell / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#ffffff">
            ✓
          </text>
        </g>
      )}
    </g>
  );
}

// ============================================================================
// 4. MONSTRUOS, JEFES Y NPCS (Medallones Modernos HeroQuest 2021)
// ============================================================================
export function MonsterIconSVG({ type, px, py, cell, info, isSelected, isDead }) {
  const cx = px + cell / 2;
  const cy = py + cell / 2;
  const src = MONSTER_ICONS[type];
  const isBoss = !!info?.isBoss || type === 'gargoyle' || type === 'sorcerer' || type === 'dread_warrior';
  const isFriendly = type === 'npc' || type === 'hero';
  const ringStroke = isSelected ? '#fde047' : isFriendly ? '#0ea5e9' : isBoss ? '#d97706' : '#7f1d1d';
  const ringBg = isFriendly ? 'rgba(14, 165, 233, 0.22)' : isBoss ? 'rgba(180, 83, 9, 0.26)' : 'rgba(127, 29, 29, 0.16)';

  return (
    <g opacity={isDead ? 0.32 : 1}>
      <circle
        cx={cx}
        cy={cy}
        r={cell * 0.45}
        fill={ringBg}
        stroke={ringStroke}
        strokeWidth={isSelected ? '2.8' : isBoss ? '2' : '1.4'}
      />
      {src ? (
        <image
          href={src}
          x={px + 2.5}
          y={py + 2.5}
          width={cell - 5}
          height={cell - 5}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <g>
          <circle cx={cx} cy={cy} r="12" fill={info?.fill || '#3b1616'} stroke={INK} strokeWidth="1.8" />
          {type === 'specter' ? (
            <path
              d={`M ${cx - 6} ${cy + 6} L ${cx - 6} ${cy - 1} A 6 6 0 0 1 ${cx + 6} ${cy - 1} L ${cx + 6} ${cy + 6} L ${cx + 3} ${cy + 3.5} L ${cx} ${cy + 6} L ${cx - 3} ${cy + 3.5} Z`}
              fill="#cffafe"
              stroke={INK}
              strokeWidth="1.2"
            />
          ) : type === 'assassin' ? (
            <g stroke="#e0e7ff" strokeWidth="2">
              <line x1={cx - 7} y1={cy - 6} x2={cx + 7} y2={cy + 6} />
              <line x1={cx + 7} y1={cy - 6} x2={cx - 7} y2={cy + 6} />
            </g>
          ) : (
            <g>
              <rect x={cx - 7} y={cy - 5.5} width="14" height="11" rx="2" fill="#be123c" stroke="#fde047" strokeWidth="1.2" />
              <polygon points={`${cx - 5},${cy} ${cx - 2.5},${cy - 2.5} ${cx},${cy + 1} ${cx + 2.5},${cy - 2.5} ${cx + 5},${cy} ${cx + 2.5},${cy + 3} ${cx},${cy + 1} ${cx - 2.5},${cy + 3}`} fill="#ffffff" />
            </g>
          )}
        </g>
      )}
      {info?.isBoss && !isDead && (
        <rect x={px + 1} y={py + 1} width={cell - 2} height={cell - 2} rx="3" fill="none" stroke="#d97706" strokeWidth="1.8" />
      )}
      {isDead && (
        <>
          <line x1={px + 5} y1={py + 5} x2={px + cell - 5} y2={py + cell - 5} stroke="#dc2626" strokeWidth="3.2" />
          <line x1={px + cell - 5} y1={py + 5} x2={px + 5} y2={py + cell - 5} stroke="#dc2626" strokeWidth="3.2" />
        </>
      )}
    </g>
  );
}
