"use client";
import * as React from "react";
import { Button } from "./Button";

export function StickyNav({
  canPrev,
  canNext,
  isLast,
  onPrev,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 p-2 pb-[calc(env(safe-area-inset-bottom)+8px)] z-40">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" className="w-32" onClick={onPrev} disabled={!canPrev}>Previous</Button>
          <Button variant="secondary" className="w-40" onClick={onNext} disabled={!canNext}>{isLast ? 'View Results' : 'Next'}</Button>
        </div>
      </div>
    </div>
  );
}


