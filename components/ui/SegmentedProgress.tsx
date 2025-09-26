import * as React from "react";

export interface SegmentMeta {
  id: string;
  title: string;
  index: number;
  answered: number;
  total: number;
}

export function SegmentedProgress({
  segments,
  currentId,
  onSelect,
  maxNavigableIndex,
}: {
  segments: SegmentMeta[];
  currentId: string;
  onSelect?: (id: string) => void;
  maxNavigableIndex: number; // user cannot jump past this index
}) {
  return (
    <div className="flex items-center gap-2 py-2">
      {segments.map((s) => {
        const pct = Math.min(100, Math.round((s.answered / s.total) * 100));
        const isActive = s.id === currentId;
        const disabled = s.index > maxNavigableIndex;
        return (
          <button
            key={s.id}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSelect?.(s.id)}
            className={`relative flex-1 h-3.5 rounded-full border overflow-hidden transition-opacity ${
              disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:opacity-90'
            } ${isActive ? 'ring-2 ring-primary-500 ring-offset-1' : ''}`}
            aria-label={`${s.title} (${s.answered}/${s.total})`}
            title={s.title}
          >
            <div className="absolute inset-0 bg-gray-100" />
            <div className="absolute inset-y-0 left-0 bg-brand-teal" style={{ width: `${pct}%` }} />
          </button>
        );
      })}
    </div>
  );
}


