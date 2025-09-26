import * as React from "react";

export function RadialScore({ value, size = 140 }: { value: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = Math.PI * 2 * r;
  const dash = (clamped / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Score ${clamped} out of 100`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          r={r}
          fill="none"
          stroke="#3697a4"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90)"
          strokeLinecap="round"
        />
        <text x={0} y={6} textAnchor="middle" className="fill-neutral-800" style={{ fontSize: size * 0.24, fontWeight: 700 }}>
          {clamped}
        </text>
        <text x={0} y={size * 0.24} textAnchor="middle" className="fill-gray-600" style={{ fontSize: size * 0.1 }}>
          /100
        </text>
      </g>
    </svg>
  );
}


