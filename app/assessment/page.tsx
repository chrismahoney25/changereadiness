"use client";
import * as React from "react";
import data from "../../data/questions.json";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import type { StepperItem } from "../../components/ui/SectionStepper";
import { SegmentedProgress } from "../../components/ui/SegmentedProgress";
import { ChoiceScale } from "../../components/ui/ChoiceScale";
import { StickyNav } from "../../components/ui/StickyNav";
import { keyFor, normalizeTo100, scoreRaw, type Responses, type AssessmentData } from "../../lib/scoring";
import { useRouter } from "next/navigation";

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = React.useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

export default function AssessmentPage() {
  const router = useRouter();
  const assessment = data as AssessmentData;
  const [responses, setResponses] = useLocalStorage<Responses>("cra:responses", {});

  const totalQuestions = assessment.sections.reduce((a, s) => a + s.questions.length, 0);
  const answered = Object.keys(responses).length;
  const progress = Math.round((answered / totalQuestions) * 100);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(assessment.sections[0]?.id || "");
  const activeSection = assessment.sections.find((s) => s.id === activeSectionId) || assessment.sections[0];

  const sectionIsComplete = (sectionId: string) => {
    const sec = assessment.sections.find((s) => s.id === sectionId);
    if (!sec) return false;
    return sec.questions.every((_, i) => responses[keyFor(sectionId, i)]);
  };

  const currentIndex = assessment.sections.findIndex((s) => s.id === activeSectionId);
  const completionFlags = assessment.sections.map((s) => sectionIsComplete(s.id));
  const lastCompletedIndex = [...completionFlags].lastIndexOf(true);
  const maxNavigableIndex = Math.max(currentIndex, lastCompletedIndex);

  const stepperItems: StepperItem[] = assessment.sections.map((s) => {
    const completed = sectionIsComplete(s.id);
    return { id: s.id, title: s.title, completed, current: s.id === activeSectionId };
  });

  const handleSelect = (sectionId: string, index: number, value: number) => {
    setResponses((prev) => ({ ...prev, [keyFor(sectionId, index)]: value }));
  };

  const handleSubmit = () => {
    const { total, min, max } = scoreRaw(responses, assessment);
    const score100 = normalizeTo100(total, min, max);
    try { window.localStorage.setItem("cra:score", JSON.stringify({ total, min, max, score100 })); } catch {}
    router.push("/results");
  };

  const goPrev = () => {
    const prevIdx = Math.max(0, currentIndex - 1);
    setActiveSectionId(assessment.sections[prevIdx].id);
  };
  const goNext = () => {
    const isLast = currentIndex === assessment.sections.length - 1;
    if (!isLast) {
      setActiveSectionId(assessment.sections[currentIndex + 1].id);
    } else {
      handleSubmit();
    }
  };

  const canPrev = currentIndex > 0;
  const canNext = sectionIsComplete(activeSection.id);
  const isLast = currentIndex === assessment.sections.length - 1;

  const guardedSelect = (id: string) => {
    const targetIdx = assessment.sections.findIndex((s) => s.id === id);
    if (targetIdx <= maxNavigableIndex) setActiveSectionId(id);
  };

  // No long-form instructions per request

  return (
    <main className="min-h-dvh bg-white">
      {/* Mobile sticky segmented progress at top */}
      <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="container mx-auto px-4 py-2">
          <SegmentedProgress
            segments={assessment.sections.map((s, idx) => ({
              id: s.id,
              title: s.title,
              index: idx,
              answered: s.questions.filter((_, i) => responses[keyFor(s.id, i)]).length,
              total: s.questions.length,
            }))}
            currentId={activeSectionId}
            maxNavigableIndex={maxNavigableIndex}
            onSelect={guardedSelect}
          />
          <div className="mt-1 text-[11px] text-gray-700 tracking-wide">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200">
              <span className="font-medium text-neutral-dark">{answered}</span>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-neutral-dark">{totalQuestions}</span>
              <span className="text-gray-600">answered</span>
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal text-sm font-medium mb-3">
              Change Readiness Assessment
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-neutral-dark mb-2">
              How ready are you to <span className="text-brand-teal">lead change</span>?
            </h1>
            {/* instructions removed */}
          </div>

          <div className="mb-6 hidden md:block">
            <SegmentedProgress
              segments={assessment.sections.map((s, idx) => ({
                id: s.id,
                title: s.title,
                index: idx,
                answered: s.questions.filter((_, i) => responses[keyFor(s.id, i)]).length,
                total: s.questions.length,
              }))}
              currentId={activeSectionId}
              maxNavigableIndex={maxNavigableIndex}
              onSelect={guardedSelect}
            />
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200">
                <span className="font-medium text-neutral-dark">{answered}</span>
                <span className="text-gray-500">/</span>
                <span className="font-medium text-neutral-dark">{totalQuestions}</span>
                <span className="text-gray-600">answered</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200">
                <span className="text-gray-600">Section</span>
                <span className="font-medium text-neutral-dark">{currentIndex + 1}</span>
                <span className="text-gray-500">of</span>
                <span className="font-medium text-neutral-dark">{assessment.sections.length}</span>
              </span>
            </div>
          </div>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader className="bg-gradient-to-r from-brand-teal/5 to-brand-pink/5 rounded-t-2xl">
              <div className="text-xs text-gray-600 md:hidden mb-1">Section {currentIndex + 1} of {assessment.sections.length}</div>
              <h2 className="text-xl font-semibold text-brand-teal">{activeSection.title}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSection.questions.map((q, idx) => {
                const k = keyFor(activeSection.id, idx);
                const current = responses[k];
                return (
                  <div key={k} className="border border-gray-100 rounded-xl p-4 bg-white/80">
                    <div className="text-neutral-dark mb-3 font-medium">{q}</div>
                    <ChoiceScale
                      value={current}
                      min={assessment.scale.min}
                      max={assessment.scale.max}
                      onChange={(v) => handleSelect(activeSection.id, idx, v)}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="mt-6 hidden md:flex items-center justify-between">
            <Button variant="ghost" onClick={goPrev} disabled={!canPrev}>Previous</Button>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="lg" disabled={!canNext} onClick={goNext}>{isLast ? 'View Results' : 'Next'}</Button>
            </div>
          </div>
        </div>
      </div>

      <StickyNav canPrev={canPrev} canNext={canNext} isLast={isLast} onPrev={goPrev} onNext={goNext} />
    </main>
  );
}


