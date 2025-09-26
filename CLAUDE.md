# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on http://localhost:3000)
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Lint**: `npm run lint`

## Project Architecture

This is a Next.js 14 application implementing a 25-question Change Readiness Assessment for Summit Leadership. The app uses the App Router with TypeScript and Tailwind CSS.

### Core Structure

- **App Router**: Uses Next.js App Router (`app/` directory)
  - `/` - Landing page with assessment intro
  - `/assessment` - Multi-section assessment form
  - `/results` - Score visualization and interpretation

- **Assessment Data**: Questions are configured in `data/questions.json` with 5 sections (mindset, awareness, leadership, resources, resilience), each containing 5 questions rated 1-5

- **State Management**: Uses localStorage to persist responses and scores across page navigation via custom `useLocalStorage` hook

- **Scoring System**: Located in `lib/scoring.ts`
  - Raw scores calculated from 1-5 responses
  - Normalized to 0-100 scale
  - Interpreted into readiness bands (High/Moderate/Low/Resistant)

### UI Components

- **Reusable UI**: `components/ui/` contains Button, Card, Progress, ChoiceScale, etc.
- **Visualization**: `components/viz/` contains scoring visualizations (RadialScore, ChangeLogoGauge, SectionBars)
- **Design System**: Extensive Tailwind config with Summit Leadership brand colors (teal, green, pink, yellow, orange) and custom animations

### Key Features

- Section-based navigation with progress tracking
- Sticky navigation for mobile/desktop
- PDF export functionality using jsPDF and html2canvas
- Responsive design with mobile-first approach
- Local storage persistence of assessment progress

### Data Flow

1. Questions loaded from JSON config
2. User responses stored in localStorage with keys like `sectionId:questionIndex`
3. Scoring calculated on completion and stored as `cra:score`
4. Results page reads stored score for visualization

### Styling Approach

- Tailwind CSS with custom design tokens
- Brand color system with multiple variants
- Custom animations and gradients
- Responsive breakpoints for mobile/tablet/desktop