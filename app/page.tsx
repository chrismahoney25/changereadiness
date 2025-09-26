"use client";
import { Button } from "../components/ui/Button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <main className="min-h-dvh bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 via-brand-pink/5 to-brand-yellow/10" />
      <div className="container mx-auto px-4 md:px-6 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <img src="/summit-logo.png" alt="Summit Leadership" className="h-14 w-14 rounded-lg shadow-card" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark leading-tight">
            How ready are you to <span className="text-brand-teal">lead change</span>?
          </h1>
          <div className="mt-2 text-brand-teal font-semibold">Change Readiness Assessment</div>
          <p className="mt-3 text-lg text-gray-700">
            A focused, 5-minute assessment to gauge your readiness to drive meaningful change. Start strong and get clear direction.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" onClick={() => router.push('/assessment')}>Start Assessment</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
