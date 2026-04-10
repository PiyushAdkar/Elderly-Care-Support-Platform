import React from 'react';

// ── Card ──────────────────────────────────────────────
export function Card({ children, className = '', onClick }) {
  const base = `bg-white rounded-3xl shadow-lg p-6 ${className}`;
  if (onClick)
    return <div className={`${base} cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all`} onClick={onClick}>{children}</div>;
  return <div className={base}>{children}</div>;
}

// ── Stat Card ─────────────────────────────────────────
export function StatCard({ icon, label, value, sub, color = 'bg-primary-50', textColor = 'text-primary-700' }) {
  return (
    <div className={`${color} rounded-3xl p-5 flex flex-col gap-1`}>
      <span className="text-3xl">{icon}</span>
      <p className="text-sm font-bold text-primary-500 mt-1">{label}</p>
      <p className={`text-2xl font-black ${textColor}`}>{value}</p>
      {sub && <p className="text-xs font-semibold text-primary-400">{sub}</p>}
    </div>
  );
}

// ── Action Button ─────────────────────────────────────
export function ActionBtn({ icon, label, onClick, color = 'bg-primary-50 hover:bg-primary-100', textColor = 'text-primary-700' }) {
  return (
    <button onClick={onClick}
      className={`${color} ${textColor} flex flex-col items-center justify-center gap-2
                  rounded-3xl p-5 font-bold text-sm cursor-pointer
                  transition-all hover:scale-105 active:scale-95 shadow-lg
                  hover:shadow-xl border border-white/80`}>
      <span className="text-4xl">{icon}</span>
      {label}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────
export function Badge({ children, color = 'bg-primary-100 text-primary-700' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${color}`}>
      {children}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────
export function Avatar({ emoji, size = 'w-14 h-14', bg = 'bg-primary-100' }) {
  return (
    <div className={`${size} ${bg} rounded-full flex items-center justify-center text-2xl shrink-0`}>
      {emoji}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────
export function ProgressBar({ value, max, color = 'bg-primary-500' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-primary-100 rounded-full h-3 overflow-hidden">
      <div className={`${color} h-3 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Section Header ────────────────────────────────────
export function SectionHeader({ title, action, actionLabel }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-2xl font-black text-primary-900">{title}</h2>
      {action && (
        <button onClick={action}
          className="text-sm font-bold text-primary-500 hover:text-primary-700
                     bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-2xl transition-all">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-lg font-bold text-primary-400">{message}</p>
    </div>
  );
}

// ── Toggle Chip ───────────────────────────────────────
export function ToggleChip({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-5 py-2 rounded-full font-bold text-sm transition-all cursor-pointer
                  ${active
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}>
      {label}
    </button>
  );
}
