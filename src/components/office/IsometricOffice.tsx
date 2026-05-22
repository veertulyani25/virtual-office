import { motion } from 'framer-motion';
import { useState } from 'react';
import { departments } from '@/data/departments';
import { agents } from '@/data/agents';
import { useAppStore } from '@/store/useAppStore';
import { isoProject, zonePoly, deskTopPoly, TILE_W, TILE_H } from './isoUtils';
import type { Department } from '@/types';

// ─── Single Desk ─────────────────────────────────────────────────────────────

function IsoDesk({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const DW = 36, DH = 18, DZ = 14;
  const TW2 = DW / 2, TH2 = DH / 2;
  // Top face
  const top = `${cx},${cy - TH2 - DZ} ${cx + TW2},${cy - DZ} ${cx},${cy + TH2 - DZ} ${cx - TW2},${cy - DZ}`;
  // Left face (going down from bottom-left of top to ground)
  const left = `${cx - TW2},${cy - DZ} ${cx},${cy + TH2 - DZ} ${cx},${cy + TH2} ${cx - TW2},${cy}`;
  // Right face
  const right = `${cx},${cy + TH2 - DZ} ${cx + TW2},${cy - DZ} ${cx + TW2},${cy} ${cx},${cy + TH2}`;
  // Monitor stand (tiny)
  const monX = cx, monY = cy - TH2 - DZ - 2;

  return (
    <g>
      <polygon points={left}  fill={`${color}18`} stroke={`${color}35`} strokeWidth="0.5" />
      <polygon points={right} fill={`${color}25`} stroke={`${color}35`} strokeWidth="0.5" />
      <polygon points={top}   fill={`${color}40`} stroke={`${color}60`} strokeWidth="0.8" />
      {/* Monitor */}
      <rect x={monX - 7} y={monY - 11} width={14} height={10} rx="1.5"
            fill={`${color}50`} stroke={`${color}80`} strokeWidth="0.5" />
      <rect x={monX - 2} y={monY - 1}  width={4}  height={2}
            fill={`${color}40`} />
      {/* Screen glow */}
      <rect x={monX - 6} y={monY - 10} width={12} height={8} rx="1"
            fill={`${color}30`} />
    </g>
  );
}

// ─── Agent Figure ─────────────────────────────────────────────────────────────

function IsoAgent({
  cx, cy, color, status, delay,
}: {
  cx: number; cy: number; color: string; status: string; delay: number;
}) {
  const isActive = status === 'active' || status === 'processing';
  return (
    <motion.g
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: isActive ? 1.8 : 2.8, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {/* Glow ring */}
      <circle cx={cx} cy={cy - 20} r={9}
              fill="none" stroke={color} strokeWidth="1"
              opacity={isActive ? 0.5 : 0.2} />
      {/* Head */}
      <circle cx={cx} cy={cy - 20} r={6.5}
              fill={`${color}CC`} />
      {/* Body */}
      <rect x={cx - 5.5} y={cy - 12} width={11} height={12} rx="2.5"
            fill={`${color}88`} />
      {/* Status indicator on desk */}
      {isActive && (
        <motion.circle
          cx={cx + 8} cy={cy - 26}
          r={2.5}
          fill={status === 'processing' ? '#06b6d4' : '#22c55e'}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
    </motion.g>
  );
}

// ─── Department Zone ──────────────────────────────────────────────────────────

function DeptZone({
  dept,
  isHovered,
  isSelected,
  onClick,
}: {
  dept: Department;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const poly = zonePoly(dept.isoCol, dept.isoRow, dept.isoWidth, dept.isoDepth);
  const deptAgents = agents.filter(a => a.department === dept.id).slice(0, 3);

  // Compute desk positions within the zone
  const deskPositions = deptAgents.map((agent, i) => {
    const col = dept.isoCol + Math.floor(i % 2) * Math.floor(dept.isoWidth / 2) + 0.5;
    const row = dept.isoRow + Math.floor(i / 2) * Math.floor(dept.isoDepth / 2) + 0.5;
    const { x, y } = isoProject(col, row);
    return { x, y, agent };
  });

  // Label position: top vertex of zone
  const labelPos = isoProject(dept.isoCol, dept.isoRow);
  const labelY = labelPos.y - TILE_H / 2 - 18;
  const labelX = labelPos.x;

  const active = isHovered || isSelected;

  return (
    <motion.g
      onClick={onClick}
      style={{ cursor: dept.available ? 'pointer' : 'default' }}
      animate={{ opacity: dept.available ? 1 : 0.55 }}
    >
      {/* Zone floor fill */}
      <motion.polygon
        points={poly}
        fill={`${dept.color}${active ? '18' : '0c'}`}
        stroke={`${dept.color}${active ? '60' : '35'}`}
        strokeWidth={active ? 1.5 : 0.8}
        animate={{ opacity: active ? 1 : 0.85 }}
        transition={{ duration: 0.2 }}
      />

      {/* Glow when active */}
      {active && (
        <motion.polygon
          points={poly}
          fill={`${dept.color}08`}
          stroke={dept.color}
          strokeWidth={2}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ filter: `drop-shadow(0 0 6px ${dept.color}60)` }}
        />
      )}

      {/* Desks */}
      {deskPositions.map(({ x, y, agent }) => (
        <IsoDesk key={agent.id} cx={x} cy={y} color={dept.color} />
      ))}

      {/* Agent figures */}
      {deskPositions.map(({ x, y, agent }, i) => (
        <IsoAgent
          key={agent.id}
          cx={x}
          cy={y - 16}
          color={dept.color}
          status={agent.status}
          delay={i * 0.4}
        />
      ))}

      {/* Department label */}
      <g>
        <rect
          x={labelX - 40}
          y={labelY - 10}
          width={80}
          height={18}
          rx={5}
          fill={active ? `${dept.color}25` : 'rgba(5,5,8,0.7)'}
          stroke={`${dept.color}${active ? '50' : '30'}`}
          strokeWidth="0.8"
        />
        <text
          x={labelX}
          y={labelY + 2}
          textAnchor="middle"
          fontSize={8.5}
          fontFamily="Inter, sans-serif"
          fontWeight={active ? '600' : '400'}
          fill={active ? dept.color : '#94a3b8'}
        >
          {dept.shortLabel}
        </text>
        {/* "Coming soon" indicator for unavailable */}
        {!dept.available && (
          <text
            x={labelX}
            y={labelY + 2}
            textAnchor="middle"
            fontSize={7}
            fontFamily="Inter, sans-serif"
            fill="transparent"
          >
            {dept.shortLabel}
          </text>
        )}
      </g>

      {/* Unavailable overlay indicator */}
      {!dept.available && (
        <text
          x={(() => { const p = isoProject(dept.isoCol + dept.isoWidth / 2, dept.isoRow + dept.isoDepth / 2); return p.x; })()}
          y={(() => { const p = isoProject(dept.isoCol + dept.isoWidth / 2, dept.isoRow + dept.isoDepth / 2); return p.y - 4; })()}
          textAnchor="middle"
          fontSize={7}
          fontFamily="Inter, sans-serif"
          fill="#475569"
          opacity={0.6}
        >
          soon
        </text>
      )}
    </motion.g>
  );
}

// ─── Main Isometric Office ────────────────────────────────────────────────────

export function IsometricOffice() {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const { openDepartment, selectedDepartment } = useAppStore();

  const handleDeptClick = (dept: Department) => {
    if (dept.available) {
      openDepartment(dept.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)`,
        }}
      />

      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="-550 -150 1100 780"
          className="w-full h-full"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
          onMouseLeave={() => setHoveredDept(null)}
        >
          {/* Grid floor base */}
          {Array.from({ length: 9 }).map((_, col) =>
            Array.from({ length: 7 }).map((_, row) => {
              const { x, y } = isoProject(col, row);
              const TW2 = TILE_W / 2, TH2 = TILE_H / 2;
              const pts = `${x},${y - TH2} ${x + TW2},${y} ${x},${y + TH2} ${x - TW2},${y}`;
              return (
                <polygon
                  key={`${col}-${row}`}
                  points={pts}
                  fill="rgba(255,255,255,0.01)"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                />
              );
            })
          )}

          {/* Department zones */}
          {departments.map(dept => (
            <DeptZone
              key={dept.id}
              dept={dept}
              isHovered={hoveredDept === dept.id}
              isSelected={selectedDepartment === dept.id}
              onClick={() => handleDeptClick(dept)}
            />
          ))}

          {/* "Available" pulse rings on Branding + Marketing */}
          {departments.filter(d => d.available).map(dept => {
            const mid = isoProject(dept.isoCol + dept.isoWidth / 2, dept.isoRow + dept.isoDepth / 2);
            return (
              <motion.ellipse
                key={`pulse-${dept.id}`}
                cx={mid.x}
                cy={mid.y}
                rx={dept.isoWidth * TILE_W / 2 * 0.8}
                ry={dept.isoDepth * TILE_H / 2 * 0.8}
                fill="none"
                stroke={dept.color}
                strokeWidth="1"
                animate={{ opacity: [0, 0.35, 0], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: dept.id === 'branding' ? 0 : 1.5 }}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-muted">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span className="text-[10px] text-muted">Coming soon</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <span className="text-[10px] text-muted">Click a department to open</span>
        </div>
      </div>
    </div>
  );
}
