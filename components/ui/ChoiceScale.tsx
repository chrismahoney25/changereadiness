import * as React from "react";

export interface ChoiceScaleProps {
  value?: number;
  min?: number;
  max?: number;
  labels?: string[]; // optional labels for 1..5
  onChange: (val: number) => void;
}

export function ChoiceScale({ value, min = 1, max = 5, labels = ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'], onChange }: ChoiceScaleProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {options.map((v, idx) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={value === v}
            className={`rounded-lg px-3 py-2 text-sm font-medium border transition-all ${
              value === v ? 'bg-brand-teal text-white border-brand-teal shadow-button' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-teal/50 hover:bg-brand-teal/5'
            }`}
          >
            <div className="text-base font-semibold mb-0.5">{v}</div>
            <div className="text-[10px] leading-snug opacity-80">{labels[idx] ?? String(v)}</div>
          </button>
        ))}
      </div>
      {typeof value === 'number' && (
        <div className="mt-2 text-xs text-gray-600">Selected: {value} — {labels[value - min] ?? value}</div>
      )}
    </div>
  );
}


