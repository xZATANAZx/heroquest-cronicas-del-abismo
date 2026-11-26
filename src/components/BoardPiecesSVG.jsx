import React from 'react';

// ============================================================================
// ICONOS OFICIALES DE TABLERO HEROQUEST (Paquete Open-Source HeroScribe GPL-2.0)
// Dimensiones exactas 2021: 3×2, 3×1, 2×2, 2×1, 1×1 con auto-rotación 90°
// ============================================================================

const INK = '#3b1616';

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

// Si un mueble está rotado verticalmente (h > w), rota el icono 90° alrededor de su centro
function RotatedGroup({ px, py, w, h, children }) {
  const isVertical = h > w;
  if (!isVertical) {
    return <g transform={`translate(${px}, ${py})`}>{children(w, h)}</g>;
  }
  const cx = px + w / 2;
  const cy = py + h / 2;
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(90) translate(${-h / 2}, ${-w / 2})`}>
      {children(h, w)}
    </g>
  );
}

// ============================================================================
// 1. MUEBLES OFICIALES (11 piezas HeroScribe exactas)
// ============================================================================
export function FurnitureSVG({ type, px, py, w, h }) {
  const src = FURNITURE_ICONS[type] || FURNITURE_ICONS.table;
  return (
    <RotatedGroup px={px} py={py} w={w} h={h}>
      {(rw, rh) => (
        <g>
          <image
            href={src}
            x={1}
            y={1}
            width={rw - 2}
            height={rh - 2}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      )}
    </RotatedGroup>
  );
}

// ============================================================================
// 2. ESTRUCTURAS OFICIALES (Escaleras, Puertas, Muros Bloqueados)
// ============================================================================
export function StairsSVG({ px, py, w, h }) {
  return (
    <g>
      <image
        href="/hq-icons/stairs.png"
        x={px + 1}
        y={py + 1}
        width={w - 2}
        height={h - 2}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

export function DoorSVG({ type, px, py, cell, edge = 'N' }) {
  const isSecret = type === 'secret_door';
  const src = isSecret ? '/hq-icons/secret_door.png' : '/hq-icons/door.png';
  const isHorizontal = edge === 'N' || edge === 'S';
  const dw = isHorizontal ? cell : cell * 0.42;
  const dh = isHorizontal ? cell * 0.42 : cell;
  const cx = edge === 'W' ? px : edge === 'E' ? px + cell : px + cell / 2;
  const cy = edge === 'N' ? py : edge === 'S' ? py + cell : py + cell / 2;

  if (isSecret) {
    return (
      <g>
        <image
          href={src}
          x={px + 2}
          y={py + 2}
          width={cell - 4}
          height={cell - 4}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    );
  }

  return (
    <g transform={`translate(${cx}, ${cy}) ${isHorizontal ? '' : 'rotate(90)'}`}>
      <image
        href={src}
        x={-cell / 2}
        y={-(cell * 0.24)}
        width={cell}
        height={cell * 0.48}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

export function BlockedWallSVG({ type, px, py, w, h }) {
  const src = type === 'blocked_double' ? '/hq-icons/blocked_double.png' : '/hq-icons/blocked.png';
  return (
    <RotatedGroup px={px} py={py} w={w} h={h}>
      {(rw, rh) => (
        <image
          href={src}
          x={0.5}
          y={0.5}
          width={rw - 1}
          height={rh - 1}
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </RotatedGroup>
  );
}

// ============================================================================
// 3. TRAMPAS OFICIALES (Foso, Lanza, Bloque Cayendo)
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
      {isSelected && (
        <rect x={px + 1} y={py + 1} width={cell - 2} height={cell - 2} rx="3" fill="none" stroke="#fde047" strokeWidth="2.8" />
      )}
      <image
        href={src}
        x={px + 1.5}
        y={py + 1.5}
        width={cell - 3}
        height={cell - 3}
        preserveAspectRatio="xMidYMid meet"
      />
      {isDisarmed && (
        <g>
          <circle cx={px + cell / 2} cy={py + cell / 2} r="9" fill="rgba(21, 128, 61, 0.9)" />
          <text x={px + cell / 2} y={py + cell / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#ffffff">
            ✓
          </text>
        </g>
      )}
    </g>
  );
}

// ============================================================================
// 4. MONSTRUOS, JEFES Y NPCS (Iconos oficiales HeroScribe + expansiones HQ-D20)
// ============================================================================
export function MonsterIconSVG({ type, px, py, cell, info, isSelected, isDead }) {
  const cx = px + cell / 2;
  const cy = py + cell / 2;
  const src = MONSTER_ICONS[type];

  return (
    <g opacity={isDead ? 0.32 : 1}>
      {isSelected && (
        <rect x={px + 1} y={py + 1} width={cell - 2} height={cell - 2} rx="4" fill="rgba(253, 224, 71, 0.25)" stroke="#fde047" strokeWidth="2.8" />
      )}
      {src ? (
        <image
          href={src}
          x={px + 1.5}
          y={py + 1.5}
          width={cell - 3}
          height={cell - 3}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        /* Monstruos exclusivos de expansiones modernas (Espectro, Asesino, Mímico) */
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
