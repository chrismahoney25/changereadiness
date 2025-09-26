import * as React from "react";

export function SectionBars({
  sections,
}: {
  sections: { id: string; title: string; score100: number }[];
}) {
  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <div key={s.id}>
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="truncate" title={s.title}>{s.title}</div>
            <div className="font-semibold text-neutral-800">{s.score100}</div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-teal" style={{ width: `${Math.max(0, Math.min(100, s.score100))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}


