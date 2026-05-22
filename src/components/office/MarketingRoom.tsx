import { motion } from 'framer-motion';
import { agents } from '@/data/agents';
import { useAppStore } from '@/store/useAppStore';
import type { AIAgent } from '@/types';

const DEPT_COLOR = '#8b5cf6';

const marketingAgents = agents.filter((a) => a.department === 'marketing');
const seatedAgents = marketingAgents.filter(
  (a) => a.status !== 'idle' && a.status !== 'standby'
);
const walkingAgents = marketingAgents.filter(
  (a) => a.status === 'idle' || a.status === 'standby'
);
const deskXPositions = [9, 22, 35, 49, 63, 77, 90];

// ─── PersonFigure ──────────────────────────────────────────────────────────────

function PersonFigure({ agent }: { agent: AIAgent }) {
  const color = agent.avatarColor;
  const isActive = agent.status === 'active' || agent.status === 'processing';
  const isProcessing = agent.status === 'processing';
  const initial = agent.name.charAt(0).toUpperCase();

  return (
    <motion.div
      className="relative flex flex-col items-center"
      animate={isActive ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Head */}
      <div className="relative">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}66)`,
            boxShadow: isActive ? `0 0 10px ${color}60` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {initial}
          </span>

          {/* Active pulse ring */}
          {isActive && (
            <motion.div
              style={{
                position: 'absolute',
                inset: -3,
                borderRadius: '50%',
                border: `1.5px solid ${color}`,
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#f59e0b',
                border: '1.5px solid #05050a',
              }}
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '8px 8px 0 0',
          background: `linear-gradient(180deg, ${color}44, ${color}22)`,
          border: `1px solid ${color}30`,
          marginTop: 2,
        }}
      />
    </motion.div>
  );
}

// ─── Monitor bars animation ─────────────────────────────────────────────────

function MonitorBars({
  color,
  deskIndex,
}: {
  color: string;
  deskIndex: number;
}) {
  const bars = [
    { width: '75%', delay: deskIndex * 0.3 },
    { width: '55%', delay: deskIndex * 0.3 + 0.2 },
    { width: '85%', delay: deskIndex * 0.3 + 0.4 },
    { width: '45%', delay: deskIndex * 0.3 + 0.6 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '6px 6px',
        height: '100%',
      }}
    >
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          style={{
            height: 4,
            borderRadius: 2,
            background: color,
            width: bar.width,
          }}
          animate={{ opacity: [0.3, 0.8, 0.3], width: [bar.width, '90%', bar.width] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: bar.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Workstation ────────────────────────────────────────────────────────────

function Workstation({ agent, x, onOpen }: { agent: AIAgent; x: number; onOpen: () => void }) {
  const color = agent.avatarColor;
  const isActive = agent.status === 'active' || agent.status === 'processing';
  const deskIndex = agent.deskIndex ?? 0;
  const shortName = agent.name.split(' ')[0];

  return (
    <div
      onClick={onOpen}
      style={{
        position: 'absolute',
        left: `${x}%`,
        bottom: 10,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <PersonFigure agent={agent} />

      {/* Monitor + stand */}
      <div style={{ position: 'relative', width: 56, marginTop: 2 }}>
        {/* Screen */}
        <div
          style={{
            width: 56,
            height: 36,
            borderRadius: 4,
            background: isActive ? `${color}12` : 'rgba(15,10,30,0.6)',
            border: `1px solid ${isActive ? `${color}40` : 'rgba(80,60,120,0.2)'}`,
            boxShadow: isActive ? `0 0 8px ${color}30` : 'none',
            overflow: 'hidden',
          }}
        >
          {isActive && <MonitorBars color={color} deskIndex={deskIndex} />}
          {!isActive && (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'rgba(80,60,120,0.3)',
                }}
              />
            </div>
          )}
        </div>

        {/* Monitor stand stem */}
        <div
          style={{
            width: 2,
            height: 6,
            background: 'rgba(100,80,160,0.3)',
            margin: '0 auto',
          }}
        />

        {/* Monitor stand base */}
        <div
          style={{
            width: 18,
            height: 2,
            background: 'rgba(100,80,160,0.25)',
            borderRadius: 1,
            margin: '0 auto',
          }}
        />
      </div>

      {/* Desk surface */}
      <div
        style={{
          width: 80,
          height: 10,
          borderRadius: 3,
          marginTop: 2,
          background: 'linear-gradient(180deg, rgba(60,40,100,0.5), rgba(30,20,60,0.6))',
          border: '1px solid rgba(139,92,246,0.12)',
        }}
      />

      {/* Name label */}
      <span
        style={{
          fontSize: 8,
          color: 'rgba(160,140,200,0.6)',
          marginTop: 3,
          maxWidth: 72,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {shortName}
      </span>
    </div>
  );
}

// ─── WalkingPerson ──────────────────────────────────────────────────────────

function WalkingPerson({ agent, delay = 0, onOpen }: { agent: AIAgent; delay?: number; onOpen: () => void }) {
  const color = agent.avatarColor;
  const initial = agent.name.charAt(0).toUpperCase();
  const shortName = agent.name.split(' ')[0];

  return (
    <motion.div
      onClick={onOpen}
      style={{
        position: 'absolute',
        bottom: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      animate={{ left: ['20%', '20%', '70%', '70%', '20%'] }}
      transition={{
        duration: 14,
        times: [0, 0.05, 0.5, 0.55, 1],
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <motion.div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Head */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}55)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{initial}</span>
        </div>

        {/* Body */}
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '6px 6px 0 0',
            background: `linear-gradient(180deg, ${color}33, ${color}18)`,
            border: `1px solid ${color}25`,
            marginTop: 2,
          }}
        />
      </motion.div>

      {/* Name */}
      <span
        style={{
          fontSize: 7,
          color: 'rgba(160,140,200,0.5)',
          marginTop: 3,
          whiteSpace: 'nowrap',
        }}
      >
        {shortName}
      </span>
    </motion.div>
  );
}

// ─── Left screen (analytics bars) ──────────────────────────────────────────

function LeftScreen() {
  const barWidths = ['80%', '55%', '70%', '40%'];

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 48,
        width: 96,
        height: 64,
        borderRadius: 4,
        background: 'rgba(10,6,24,0.8)',
        border: `1px solid ${DEPT_COLOR}18`,
        boxShadow: `0 0 12px ${DEPT_COLOR}10`,
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        overflow: 'hidden',
      }}
    >
      {barWidths.map((w, i) => (
        <motion.div
          key={i}
          style={{
            height: 5,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${DEPT_COLOR}60, ${DEPT_COLOR}20)`,
            width: w,
          }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Right screen (bar chart) ───────────────────────────────────────────────

function RightScreen() {
  const bars = [
    { height: '60%', delay: 0 },
    { height: '80%', delay: 0.3 },
    { height: '45%', delay: 0.6 },
    { height: '70%', delay: 0.9 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 48,
        width: 96,
        height: 64,
        borderRadius: 4,
        background: 'rgba(10,6,24,0.8)',
        border: `1px solid ${DEPT_COLOR}18`,
        boxShadow: `0 0 12px ${DEPT_COLOR}10`,
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        overflow: 'hidden',
      }}
    >
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          style={{
            flex: 1,
            borderRadius: '2px 2px 0 0',
            background: `linear-gradient(180deg, ${DEPT_COLOR}70, ${DEPT_COLOR}20)`,
            height: bar.height,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: bar.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main center screen ─────────────────────────────────────────────────────

function CenterScreen() {
  const stats = [
    { label: 'Posts/Mo', value: '94' },
    { label: 'Live Campaigns', value: '3' },
    { label: 'Agents Online', value: '5/7' },
  ];

  const sparklinePoints = '0,32 16,22 32,26 48,14 64,18 80,8 96,6';

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 320,
        height: 96,
        borderRadius: 6,
        background: 'rgba(8,4,20,0.85)',
        border: `1px solid rgba(139,92,246,0.22)`,
        boxShadow: `0 0 24px ${DEPT_COLOR}18, inset 0 0 16px ${DEPT_COLOR}06`,
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <motion.div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: DEPT_COLOR,
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          style={{
            fontSize: 8,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: `${DEPT_COLOR}cc`,
            fontFamily: 'monospace',
          }}
        >
          MARKETING DEPARTMENT · LIVE
        </span>
      </div>

      {/* Stats + sparkline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: DEPT_COLOR,
                  fontFamily: 'monospace',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 8,
                  color: 'rgba(160,140,200,0.5)',
                  letterSpacing: '0.06em',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Sparkline */}
        <svg width={100} height={40} viewBox="0 0 100 40">
          <polyline
            points={sparklinePoints}
            fill="none"
            stroke={DEPT_COLOR}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Floating particles ─────────────────────────────────────────────────────

function Particles() {
  const particles = [
    { xPct: 15, duration: 3.0 },
    { xPct: 35, duration: 4.2 },
    { xPct: 55, duration: 3.6 },
    { xPct: 72, duration: 4.8 },
    { xPct: 88, duration: 3.2 },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.xPct}%`,
            bottom: '22%',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: DEPT_COLOR,
          }}
          animate={{ y: [-10, -30, -10], opacity: [0, 0.4, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

// ─── MarketingRoom ──────────────────────────────────────────────────────────

export default function MarketingRoom() {
  const { openAgent } = useAppStore();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 240,
        flexShrink: 0,
        background: 'linear-gradient(180deg, #05050a 0%, #07050f 55%, #0a0618 100%)',
        borderBottom: '1px solid #1a1a2e',
        overflow: 'hidden',
      }}
    >
      {/* Ceiling ambient glow */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: `radial-gradient(ellipse at 50% 0%, ${DEPT_COLOR}18, transparent 70%)`,
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Back wall */}
      <div
        style={{
          position: 'absolute',
          insetInline: 0,
          top: 0,
          height: '58%',
          borderBottom: `1px solid rgba(139,92,246,0.06)`,
        }}
      />

      {/* Left screen */}
      <LeftScreen />

      {/* Right screen */}
      <RightScreen />

      {/* Main center screen */}
      <CenterScreen />

      {/* Floor glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '42%',
          background: `linear-gradient(to top, ${DEPT_COLOR}08, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Seated agents at workstations */}
      {seatedAgents.map((agent, i) => (
        <Workstation key={agent.id} agent={agent} x={deskXPositions[i] ?? 50} onOpen={() => openAgent(agent)} />
      ))}

      {/* Walking agents */}
      {walkingAgents.map((agent, i) => (
        <WalkingPerson key={agent.id} agent={agent} delay={i * 7} onOpen={() => openAgent(agent)} />
      ))}

      {/* Floating particles */}
      <Particles />
    </div>
  );
}
