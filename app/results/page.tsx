"use client";
import * as React from "react";
import data from "../../data/questions.json";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { RadialScore } from "../../components/viz/RadialScore";
import { ChangeLogoGauge } from "../../components/viz/ChangeLogoGauge";
import { SectionBars } from "../../components/viz/SectionBars";
import { pdf, Document, Page, View, Text, StyleSheet, Image, Svg, Circle } from '@react-pdf/renderer';
import { interpret, normalizeTo100, scoreRaw, type AssessmentData, type Responses } from "../../lib/scoring";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();
  const assessment = data as AssessmentData;
  const [snapshot, setSnapshot] = React.useState<{ total: number; min: number; max: number; score100: number } | null>(null);
  const likertLabels = ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'];
  const page1Ref = React.useRef<HTMLDivElement | null>(null);
  const page2Ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("cra:score");
      if (raw) setSnapshot(JSON.parse(raw));
    } catch {}
  }, []);

  if (!snapshot) {
    return (
      <main className="min-h-dvh bg-white">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">No results yet</h1>
            <p className="text-gray-600 mb-6">Please complete the assessment first.</p>
            <Button onClick={() => router.push("/")}>Go to assessment</Button>
          </div>
        </div>
      </main>
    );
  }

  const { band, description } = interpret(snapshot.score100);
  // Color + label styling for band pill
  const bandStyles = (() => {
    switch (band) {
      case 'High Readiness':
        return { bg: 'bg-green-600', text: 'text-white' };
      case 'Moderate Readiness':
        return { bg: 'bg-yellow-400', text: 'text-neutral-900' };
      case 'Low Readiness':
        return { bg: 'bg-orange-500', text: 'text-white' };
      default:
        return { bg: 'bg-pink-600', text: 'text-white' };
    }
  })();
  const bandLabel = (() => {
    switch (band) {
      case 'High Readiness':
        return 'High';
      case 'Moderate Readiness':
        return 'Moderate';
      case 'Low Readiness':
        return 'Low';
      default:
        return 'Resistant';
    }
  })();
  // Per-section breakdown
  const sections = (data as AssessmentData).sections.map((s) => {
    const answers = s.questions.map((_, i) => {
      try {
        const all = JSON.parse(localStorage.getItem('cra:responses') || '{}') as Responses;
        return all[`${s.id}:${i}`];
      } catch { return undefined; }
    }).filter(Boolean) as number[];
    const total = answers.reduce((a, b) => a + b, 0);
    const min = 1 * s.questions.length;
    const max = 5 * s.questions.length;
    const score100 = normalizeTo100(total, min, max);
    return { id: s.id, title: s.title, score100 };
  });

  // Build opportunities list: any individual item scored <= 3, max 5 items
  let opportunityItems: { section: string; question: string; score: number }[] = [];
  try {
    const all = JSON.parse(localStorage.getItem('cra:responses') || '{}') as Responses;
    (data as AssessmentData).sections.forEach((s) => {
      s.questions.forEach((q, i) => {
        const v = all[`${s.id}:${i}`];
        if (typeof v === 'number' && v <= 3) {
          opportunityItems.push({ section: s.title, question: q, score: v });
        }
      });
    });
  } catch {}
  opportunityItems = opportunityItems.sort((a, b) => a.score - b.score).slice(0, 5);

  const handleDownloadPdf = async () => {
    try {
      const styles = StyleSheet.create({
        page: { padding: 24, fontSize: 11, fontFamily: 'Helvetica', color: '#111827' },
        headerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
        headerTitle: { fontSize: 18, fontWeight: 700 },
        chip: { fontSize: 11, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 9999, alignSelf: 'flex-start', marginBottom: 8 },
        text: { color: '#374151', lineHeight: 1.4 },
        sectionTitle: { fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#0f766e' },
        row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        barBg: { height: 8, backgroundColor: '#f3f4f6', borderRadius: 6, width: '100%' },
        barFill: { height: 8, backgroundColor: '#3697a4', borderRadius: 6 },
        item: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 8, marginBottom: 6 },
        small: { fontSize: 10, color: '#4b5563' },
        card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, marginBottom: 12 },
        split: { flexDirection: 'row', gap: 12 },
        col: { flexGrow: 1 },
        left60: { width: '60%' },
        right40: { width: '40%' },
      });

      const SectionBarsPdf = ({
        items,
      }: { items: { title: string; score100: number }[] }) => (
        <View style={{ gap: 8 }}>
          {items.map((s, i) => (
            <View key={i}>
              <View style={styles.row}>
                <Text style={styles.small}>{s.title}</Text>
                <Text style={{ fontSize: 12, fontWeight: 600 }}>{s.score100}</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, s.score100))}%` }]} />
              </View>
            </View>
          ))}
        </View>
      );

      // Brand chip colors to match app theme
      const chipBg = bandStyles.bg.includes('yellow') ? '#f2b733' : bandStyles.bg.includes('green') ? '#84bf41' : bandStyles.bg.includes('orange') ? '#e26b16' : '#b53a84';
      const chipText = bandStyles.text.includes('white') ? '#ffffff' : '#111827';

      const DonutPdf = ({ value, size = 120, stroke = 14, color = '#3697a4' }: { value: number; size?: number; stroke?: number; color?: string }) => {
        const r = (size - stroke) / 2;
        const c = 2 * Math.PI * r;
        const dash = Math.max(0, Math.min(100, value)) / 100 * c;
        return (
          <View style={{ width: size, height: size, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <Circle cx={size/2} cy={size/2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
              <Circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round"/>
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(value)}</Text>
              <Text style={{ fontSize: 10, color: '#6b7280' }}>/100</Text>
            </View>
          </View>
        );
      };

      const docEl = (
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Top card with score and description */}
            <View style={[styles.card, styles.split]}>
              <View style={[styles.col, styles.left60, { justifyContent: 'center' }]}>
                <View style={styles.headerRow}>
                  <Image src={typeof window !== 'undefined' ? `${window.location.origin}/summit-logo.png` : '/summit-logo.png'} style={{ width: 18, height: 18 }} />
                  <Text style={styles.headerTitle}>Your Change Readiness Score</Text>
                </View>
                <View style={[styles.chip, { backgroundColor: chipBg }]}> 
                  <Text style={{ color: chipText }}>Overall — {bandLabel}</Text>
                </View>
                {/* Constrain text to ~60% to avoid overlapping the chart */}
                <Text style={[styles.text]}>{description}</Text>
              </View>
              <View style={[styles.col, styles.right40, { alignItems: 'center' }]}>
                <DonutPdf value={snapshot.score100} size={110} />
              </View>
            </View>
            {/* Section performance */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Section performance</Text>
              <SectionBarsPdf items={sections} />
            </View>
            {/* Opportunities (same page) */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Opportunities (focus areas)</Text>
              {opportunityItems.length === 0 ? (
                <Text style={styles.text}>Nothing to focus on. You’re ready to tackle change head‑on. Lets do this!</Text>
              ) : (
                <View>
                  {opportunityItems.map((o, idx) => (
                    <View key={idx} style={styles.item}>
                      <Text style={styles.small}>{o.section}</Text>
                      <Text style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{o.question}</Text>
                      <Text style={[styles.small, { marginTop: 4 }]}>Score: {o.score}/5 — {likertLabels[o.score - 1] || ''}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(docEl).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'change-readiness.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF generation failed', e);
    }
  };

  return (
    <main className="min-h-dvh bg-white">
      <div className="container mx-auto px-4 md:px-6 pt-0 md:pt-12 pb-8 md:pb-16 print:pt-0 print:pb-0">
        <div className="max-w-3xl mx-auto space-y-6" ref={page1Ref}>
          <div className="rounded-2xl border border-gray-100 shadow-card bg-white overflow-hidden animate-fade-in-up mt-0 avoid-break">
            <div className="bg-gradient-to-r from-brand-teal/5 to-brand-pink/5 px-5 md:px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/summit-logo.png" alt="Summit" className="h-6 w-6 rounded" />
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-dark">Your Change Readiness Score</h1>
              </div>
            </div>
            <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm md:text-base font-semibold mb-2 ${bandStyles.bg} ${bandStyles.text}`}>
                  <span>Overall Readiness — {bandLabel}</span>
                </div>
                <p className="text-gray-700 mt-2">{description}</p>
              </div>
              <div className="flex items-center justify-center">
                <ChangeLogoGauge value={snapshot.score100} size={190} className="m-0" />
              </div>
            </div>
          </div>

          <Card className="animate-fade-in-up avoid-break">
            <CardHeader className="bg-gradient-to-r from-brand-teal/5 to-brand-pink/5 rounded-t-2xl border-b border-gray-100">
              <h2 className="text-xl font-semibold text-brand-teal">Section performance</h2>
            </CardHeader>
            <CardContent>
              <SectionBars sections={sections} />
            </CardContent>
          </Card>

        </div>

        <div className="print-page-break" />

        <div className="max-w-3xl mx-auto space-y-6" ref={page2Ref}>
          <Card className="animate-fade-in-up avoid-break">
            <CardHeader className="bg-gradient-to-r from-brand-teal/5 to-brand-pink/5 rounded-t-2xl border-b border-gray-100">
              <h2 className="text-xl font-semibold text-brand-teal">Opportunities (focus areas)</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {opportunityItems.length === 0 ? (
                <p className="text-gray-700">Nothing to focus on. You’re ready to tackle change head‑on. Lets do this!</p>
              ) : (
                <ul className="space-y-3">
                  {opportunityItems.map((o, idx) => (
                    <li key={idx} className="border border-gray-100 rounded-lg p-3 bg-white/80">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm text-gray-600">{o.section}</div>
                          <div className="text-neutral-dark font-medium mt-0.5">{o.question}</div>
                        </div>
                        <div className="shrink-0 inline-flex items-center px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700">Score: {o.score}/5 — {likertLabels[o.score - 1] || ''}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
             
            </CardContent>
          </Card>

          <div className="flex items-center justify-between print:hidden">
            <Button variant="ghost" onClick={() => { try { localStorage.removeItem('cra:responses'); localStorage.removeItem('cra:score'); } catch {}; router.push('/'); }}>Retake</Button>
            <Button variant="ghost" onClick={handleDownloadPdf}>Download PDF</Button>
          </div>
        </div>
      </div>
    </main>
  );
}


