interface HealthScoreProps {
  score: number;
  size?: 'sm' | 'md';
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

export function HealthScore({ score, size = 'md' }: HealthScoreProps) {
  const color = scoreColor(score);
  const r = size === 'sm' ? 10 : 14;
  const sw = size === 'sm' ? 2.5 : 3;
  const dim = (r + sw) * 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-1.5">
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={dim / 2} cy={dim / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw}
        />
        <circle
          cx={dim / 2} cy={dim / 2} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="text-xs font-semibold font-mono" style={{ color }}>
        {score}
      </span>
    </div>
  );
}
