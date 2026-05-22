import { Search, Zap, Bell, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { clients } from '@/data/clients';

const quickActions = [
  { label: 'Open Branding Dept',  action: 'openDept:branding' },
  { label: 'Open Marketing Dept', action: 'openDept:marketing' },
  { label: 'View Raveras',        action: 'openClient:raveras' },
  { label: 'View Tirupati Group', action: 'openClient:tirupati-group' },
];

export function CommandBar() {
  const [focused, setFocused] = useState(false);
  const { commandQuery, setCommandQuery, openDepartment, openClient } = useAppStore();

  const filteredClients = commandQuery
    ? clients.filter(c =>
        c.name.toLowerCase().includes(commandQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(commandQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleAction = (action: string) => {
    if (action.startsWith('openDept:')) {
      openDepartment(action.split(':')[1] as any);
    } else if (action.startsWith('openClient:')) {
      const client = clients.find(c => c.id === action.split(':')[1]);
      if (client) openClient(client);
    }
    setCommandQuery('');
    setFocused(false);
  };

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <header className="h-14 border-b border-border flex items-center px-5 gap-4 relative z-50"
            style={{ background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(16px)' }}>
      {/* Brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Zap size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-slate-200">Evolve AI</span>
        <span className="hidden sm:block text-[11px] text-muted ml-0.5">Virtual Office</span>
      </div>

      <div className="w-px h-5 bg-border flex-shrink-0" />

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <div className={`flex items-center gap-2 h-8 rounded-lg px-3 transition-all duration-200 ${
          focused ? 'bg-surface2 border border-primary/40' : 'bg-surface border border-border'
        }`}>
          <Search size={13} className="text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search clients, departments…"
            value={commandQuery}
            onChange={e => setCommandQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            className="flex-1 bg-transparent text-xs text-slate-300 placeholder-muted/60 outline-none"
          />
          {commandQuery && (
            <button onClick={() => setCommandQuery('')} className="text-muted hover:text-slate-400 text-xs">×</button>
          )}
        </div>

        <AnimatePresence>
          {focused && (commandQuery || true) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute top-10 left-0 right-0 glass rounded-xl border border-border overflow-hidden z-50 shadow-xl"
            >
              {commandQuery && filteredClients.length > 0 ? (
                <div className="p-1">
                  <div className="px-3 py-1.5 text-[10px] text-muted uppercase tracking-wider">Clients</div>
                  {filteredClients.map(c => (
                    <button
                      key={c.id}
                      onMouseDown={() => handleAction(`openClient:${c.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-left"
                    >
                      <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ background: `${c.logoColor}30`, color: c.logoColor }}>
                        {c.shortName[0]}
                      </span>
                      <div>
                        <div className="text-xs text-slate-300">{c.name}</div>
                        <div className="text-[10px] text-muted">{c.industry}</div>
                      </div>
                      <ChevronRight size={11} className="text-muted ml-auto" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-1">
                  <div className="px-3 py-1.5 text-[10px] text-muted uppercase tracking-wider">Quick Actions</div>
                  {quickActions.map((qa, i) => (
                    <button
                      key={i}
                      onMouseDown={() => handleAction(qa.action)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-left"
                    >
                      <ChevronRight size={11} className="text-primary" />
                      <span className="text-xs text-slate-300">{qa.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Status pills */}
        <div className="hidden md:flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            8 agents active
          </span>
          <span className="text-border">·</span>
          <span className="text-[11px] text-muted">
            {clients.filter(c => c.crmStage === 'Active').length} clients
          </span>
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Time */}
        <span className="text-xs font-mono text-muted">{time}</span>

        {/* Notification bell */}
        <button className="relative w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-white/8">
          <Bell size={13} className="text-muted" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
             style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          V
        </div>
      </div>
    </header>
  );
}
