export interface Section {
  id: string;
  title: string;
  questions: string[];
}

export interface AssessmentData {
  title: string;
  instructions: string;
  scale: { min: number; max: number; labels: string[] };
  sections: Section[];
}

export type Responses = Record<string, number>; // key: `${sectionId}:${qIdx}` -> 1..5

export function scoreRaw(responses: Responses, data: AssessmentData): { total: number; max: number; min: number } {
  const numQuestions = data.sections.reduce((acc, s) => acc + s.questions.length, 0);
  const min = data.scale.min * numQuestions;
  const max = data.scale.max * numQuestions;
  const total = Object.values(responses).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  return { total, max, min };
}

export function normalizeTo100(total: number, min: number, max: number): number {
  if (max === min) return 0;
  const pct = ((total - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export type ReadinessBand = "High Readiness" | "Moderate Readiness" | "Low Readiness" | "Resistant or Hesitant";

export function interpret(score100: number): { band: ReadinessBand; description: string } {
  if (score100 >= 80) {
    return {
      band: "High Readiness",
      description:
        "You are well-prepared and eager to implement change. With a clear strategy, you can move forward confidently.",
    };
  }
  if (score100 >= 60) {
    return {
      band: "Moderate Readiness",
      description:
        "You’re open to change but may need to build more clarity, resources, or support to fully commit.",
    };
  }
  if (score100 >= 40) {
    return {
      band: "Low Readiness",
      description:
        "Change may feel overwhelming. Focus on building confidence, clarity, and support systems before making big shifts.",
    };
  }
  return {
    band: "Resistant or Hesitant",
    description:
      "Change is likely to be met with resistance. Start small and address mindset and planning before significant changes.",
  };
}

export function keyFor(sectionId: string, index: number): string {
  return `${sectionId}:${index}`;
}


