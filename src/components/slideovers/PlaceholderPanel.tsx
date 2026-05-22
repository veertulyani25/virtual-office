import { Construction } from 'lucide-react';
import type { Department } from '@/types';

export function PlaceholderPanel({ dept }: { dept: Department }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 py-12">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: `${dept.color}20`, border: `1px solid ${dept.color}30` }}
      >
        <Construction size={24} style={{ color: dept.color }} />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-200">{dept.label}</h3>
        <p className="text-[12px] text-muted mt-1 max-w-xs leading-relaxed">
          This department is coming soon. Once built, you'll be able to manage{' '}
          {dept.description.toLowerCase()}
        </p>
      </div>
      <div
        className="text-xs font-semibold px-4 py-2 rounded-full border"
        style={{ color: dept.color, borderColor: `${dept.color}40`, background: `${dept.color}10` }}
      >
        In Development
      </div>
    </div>
  );
}
