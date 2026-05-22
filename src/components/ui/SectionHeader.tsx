interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  color?: string;
  action?: { label: string; onClick: () => void };
}

export function SectionHeader({ title, subtitle, count, color, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {color && (
          <span
            className="w-1 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
            {count !== undefined && (
              <span className="text-[10px] font-mono bg-white/8 text-muted px-1.5 py-0.5 rounded-md">
                {count}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-[11px] text-muted hover:text-slate-300 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
