import * as React from "react";

export function Progress({ value, className = "" }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full h-2 bg-gray-100 rounded-full overflow-hidden ${className}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped}>
      <div className="h-full bg-brand-teal transition-all duration-300" style={{ width: `${clamped}%` }} />
    </div>
  );
}


