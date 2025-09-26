import * as React from "react";

// Visual gauge using the provided "another-change-3.svg" paths.
// Fills from bottom to top based on value (0–100).
export function ChangeLogoGauge({ value, size = 140, className = "" }: { value: number; size?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const pct = clamped / 100;
  const view = 1024;
  const fillHeight = view * pct;
  const fillY = view - fillHeight;

  const PathSet = ({ className = "" }: { className?: string }) => (
    <g className={className}>
      <path d="M504.7 138.1c-91.4 0-175.4 31.4-241.9 83.9l51.6 63.6c52.4-41.1 118.5-65.7 190.3-65.7 170.5 0 308.7 138.2 308.7 308.7 0 21.9-2.3 43.3-6.7 64l79.5 20.1c5.9-27.1 9.1-55.2 9.1-84 0-215.7-174.9-390.6-390.6-390.6zM702.4 765.8c-53.6 44.7-122.5 71.6-197.7 71.6-170.5 0-308.7-138.2-308.7-308.7 0-36.4 6.3-71.3 17.9-103.7l-79.7-20.1c-13 38.9-20.1 80.6-20.1 123.9 0 215.7 174.9 390.6 390.6 390.6 94.8 0 181.7-33.8 249.3-89.9l-51.6-63.7z" fill="currentColor" />
      <path d="M173.5 416.4m-40.9 0a40.9 40.9 0 1 0 81.8 0 40.9 40.9 0 1 0-81.8 0Z" fill="currentColor" />
      <path d="M286.5 256.4m-40.9 0a40.9 40.9 0 1 0 81.8 0 40.9 40.9 0 1 0-81.8 0Z" fill="currentColor" />
      <path d="M727.5 799.4m-40.9 0a40.9 40.9 0 1 0 81.8 0 40.9 40.9 0 1 0-81.8 0Z" fill="currentColor" />
      <path d="M845.8 605.8m-40.9 0a40.9 40.9 0 1 0 81.8 0 40.9 40.9 0 1 0-81.8 0Z" fill="currentColor" />
      <path d="M33.5 528.4c-14.1-17.7-11.2-43.5 6.5-57.6l108-86.1c17.7-14.1 43.5-11.2 57.6 6.5 14.1 17.7 11.2 43.5-6.5 57.6L91 534.9c-17.7 14.1-43.4 11.2-57.5-6.5z" fill="currentColor" />
      <path d="M285.2 556.4c-17.7 14.1-43.5 11.2-57.6-6.5l-86.1-108c-14.1-17.7-11.2-43.5 6.5-57.6 17.7-14.1 43.5-11.2 57.6 6.5l86.1 108c14.1 17.7 11.2 43.5-6.5 57.6zM977.7 483.6c15.4 16.5 14.5 42.5-2 57.9l-101 94.2c-16.5 15.4-42.5 14.5-57.9-2-15.4-16.5-14.5-42.5 2-57.9l101-94.2c16.6-15.4 42.5-14.5 57.9 2z" fill="currentColor" />
      <path d="M723.2 474.1c16.5-15.4 42.5-14.5 57.9 2l94.2 101c15.4 16.5 14.5 42.5-2 57.9-16.5 15.4-42.5 14.5-57.9-2l-94.2-101c-15.5-16.6-14.6-42.5 2-57.9z" fill="currentColor" />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${view} ${view}`} role="img" aria-label={`Score ${clamped} out of 100`} className={`block ${className}`}>
      <defs>
        <mask id="fillMask">
          <rect x={0} y={fillY} width={view} height={fillHeight} fill="#fff" />
        </mask>
      </defs>
      {/* Base icon in neutral */}
      <g color="#e5e7eb">
        <PathSet />
      </g>
      {/* Filled portion in brand color using mask */}
      <g mask="url(#fillMask)" color="#3697a4">
        <PathSet />
      </g>
      {/* Centered score text (use viewBox units so it scales predictably) */}
      <g>
        <text
          x={view / 2}
          y={view / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-neutral-800"
          style={{ fontSize: view * 0.24, fontWeight: 700 }}
        >
          {clamped}
        </text>
        <text
          x={view / 2}
          y={view / 2 + view * 0.18}
          textAnchor="middle"
          className="fill-gray-600"
          style={{ fontSize: view * 0.1 }}
        >
          /100
        </text>
      </g>
    </svg>
  );
}


