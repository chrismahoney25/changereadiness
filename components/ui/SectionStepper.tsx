import * as React from "react";

export interface StepperItem {
  id: string;
  title: string;
  completed: boolean;
  current: boolean;
}

export function SectionStepper({ items, onSelect }: { items: StepperItem[]; onSelect?: (id: string) => void }) {
  return (
    <ol className="flex flex-wrap gap-2 md:gap-3" aria-label="Assessment sections">
      {items.map((it, idx) => (
        <li key={it.id}>
          <button
            type="button"
            onClick={() => onSelect?.(it.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-sm ${
              it.current
                ? 'border-brand-teal bg-brand-teal/10 text-brand-teal'
                : it.completed
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
            aria-current={it.current ? 'step' : undefined}
          >
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
              it.current ? 'bg-brand-teal text-white' : it.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}>{idx + 1}</span>
            <span className="font-medium max-w-[10rem] truncate" title={it.title}>{it.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}


