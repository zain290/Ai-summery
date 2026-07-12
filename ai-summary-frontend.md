# AI Text Summariser — Frontend Overview

## Project Identity

- **Name:** AI Text Summariser (`ai-summerise`)
- **Version:** 0.1.0 (private)
- **Purpose:** A React SPA that uses the Groq API (LLaMA 3.3 70B) to generate concise summaries from user-provided text or uploaded files. Supports three summary formats (bullet points, paragraph, headlines), local file parsing (TXT, PDF, DOCX, MD), persistent history stored in SQLite, and per-IP rate limiting.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.7 | UI framework |
| TypeScript | ~6.0.2 | Type safety |
| Vite | ^8.1.1 | Dev server & build tool (port 5173) |
| @vitejs/plugin-react | ^6.0.3 | Vite React plugin (Oxc-based) |
| React Router DOM | ^7.6.2 | Client-side routing |
| Tailwind CSS | ^4.1.6 | Utility-first styling |
| @tailwindcss/vite | ^4.1.6 | Tailwind Vite plugin |
| oxlint | ^1.71.0 | Linter |

---

## Project Structure

```
ai-summerise/
├── index.html                     # Vite entry HTML (mounts #root + loads /src/main.tsx)
├── package.json                   # Dependencies & npm scripts
├── vite.config.ts                 # Vite config (React + Tailwind plugins, /api proxy to :5000)
├── tsconfig.json                  # Root TS config (references app/node/server configs)
├── tsconfig.app.json              # Frontend TS config (ES2023, DOM, strict)
├── tsconfig.node.json             # Vite config TS config
├── tsconfig.server.json           # Server TS config
├── .env                           # Environment variables (GROQ_API_KEY, PORT, rate limits, etc.)
├── .gitignore                     # Ignores node_modules, dist, .env, data/, *.db
├── .oxlintrc.json                 # Oxlint linter rules (React hooks, export conventions)
├── public/
│   ├── favicon.svg                # Tab icon
│   └── icons.svg                  # SVG sprite for social icons (unused in components)
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Root component (ThemeProvider → ErrorBoundary → BrowserRouter → Layout → Routes)
│   ├── styles/
│   │   └── globals.css            # Tailwind v4 import + custom @theme color tokens + body defaults
│   ├── types/
│   │   └── index.ts               # All TypeScript types (SummaryFormat, SummarizeRequest/Response, UsageStatus, HistoryRecord)
│   ├── utils/
│   │   └── constants.ts           # App-wide constants (API_BASE, APP_NAME, ROUTES, limits, etc.)
│   ├── theme/
│   │   ├── tokens.ts              # Design token object (colors, fonts, shadows, spacing, radii, breakpoints)
│   │   ├── ThemeContext.tsx        # React context for design tokens
│   │   └── ThemeProvider.tsx       # Context provider component
│   ├── services/
│   │   └── groqAPI.ts             # API client (summarizeText, uploadFile, getHistory, deleteHistory, getUsage)
│   ├── components/
│   │   ├── TextInput.tsx          # Textarea with word count and validation
│   │   ├── SummaryOutput.tsx      # Summary results card with metrics
│   │   ├── LoadingSpinner.tsx     # Animated loading spinner with message
│   │   ├── ErrorAlert.tsx         # Dismissable error banner
│   │   ├── ErrorBoundary.tsx      # React error boundary (class component)
│   │   └── layout/
│   │       ├── Layout.tsx         # Page wrapper (Header + main + Footer)
│   │       ├── Header.tsx         # Sticky nav bar with active link highlighting
│   │       └── Footer.tsx         # Copyright footer (auto-updating year)
│   └── pages/
│       ├── Home.tsx               # Main summarization page (text input, file upload, format selection, results)
│       ├── History.tsx            # Summary history list with clear-all functionality
│       ├── Instructions.tsx       # How-to-use guide with format descriptions, limits, live usage stats
│       └── NotFound.tsx           # 404 page with "Go Home" link
```

---

## Key Config Files

### `package.json` Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Type-check (`tsc -b`) then build (`vite build`) |
| `npm run lint` | Run oxlint |
| `npm run preview` | Preview production build |
| `npm run server` | Start Express backend via `tsx server/index.ts` (port 5000) |
| `npm run dev:all` | Start frontend + backend concurrently |

### `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { '/api': 'http://localhost:5000' },
  },
})
```

### `index.html`

- Title: "AI Summariser"
- Mounts `<div id="root">` and loads `/src/main.tsx` as an ES module

### `.env` (Backend-focused, but relevant to frontend limits)

```
GROQ_API_KEY=...
PORT=5000
NODE_ENV=development
RATE_LIMIT_PER_HOUR=10
MAX_WORD_COUNT=10000
MAX_FILE_SIZE=5242880
```

---

## Styling Approach

- **Tailwind CSS v4** with `@import "tailwindcss"` (no PostCSS config needed)
- **Dark-first design:** deep dark background (`#0a0a0f`), slightly lighter surface (`#1a1a2e`), indigo primary (`#6366f1`), pink secondary (`#ec4899`), cyan accent (`#22d3ee`), light text (`#e2e8f0`)
- All styling is inline Tailwind utility classes (no CSS modules or styled-components)
- Custom CSS only in `globals.css` for body defaults and custom `@theme` variables

### `globals.css`

```css
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --color-secondary: #ec4899;
  --color-background: #0a0a0f;
  --color-surface: #1a1a2e;
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;
  --color-accent: #22d3ee;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
}
```

### Design Tokens (`src/theme/tokens.ts`)

```ts
export const tokens = {
  colors: {
    primary: '#6366f1',           // Indigo
    secondary: '#ec4899',         // Pink
    background: '#0a0a0f',        // Near-black
    surface: '#1a1a2e',           // Dark navy
    text: '#e2e8f0',              // Light gray
    textMuted: '#94a3b8',         // Muted gray
    accent: '#22d3ee',            // Cyan
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.4)',
    lg: '0 10px 25px rgba(0,0,0,0.5)',
    glow: '0 0 20px rgba(99,102,241,0.3)',
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '2rem', xl: '4rem', section: '6rem' },
  borderRadius: { sm: '0.375rem', md: '0.5rem', lg: '1rem', full: '9999px' },
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 },
}
```

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | Home | Main summarization page |
| `/history` | History | Past summaries list |
| `/instructions` | Instructions | How-to-use guide and usage stats |
| `*` | NotFound | 404 page |

---

## App Architecture (`src/App.tsx`)

```
ThemeProvider
  └── ErrorBoundary
      └── BrowserRouter
          └── Layout (Header + main + Footer)
              └── Routes
                  ├── "/" → Home
                  ├── "/history" → History
                  ├── "/instructions" → Instructions
                  └── "*" → NotFound
```

---

## TypeScript Types (`src/types/index.ts`)

```ts
export type SummaryFormat = 'bullet' | 'paragraph' | 'headline'

export interface SummarizeRequest {
  text: string
  format?: SummaryFormat
  bulletCount?: number
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface SummarizeResponse {
  success: boolean
  summary: string[]
  originalLength: number
  summaryLength: number
  processingTime: number
  compressionRatio: number
  tokenUsage: TokenUsage
  remaining: number
  limit: number
}

export interface UsageStatus {
  success: boolean
  totalUsed: number
  totalTokensUsed: number
  remaining: number
  limit: number
}

export interface HistoryRecord {
  id: number
  title: string
  summary: string
  format: string
  original_length: number
  summary_length: number
  processing_time: number
  token_usage_total: number
  created_at: string
}
```

---

## Constants (`src/utils/constants.ts`)

```ts
export const API_BASE = '/api'
export const APP_NAME = 'AI Text Summariser'
export const ROUTES = { home: '/', history: '/history', instructions: '/instructions' } as const
export const MAX_WORD_COUNT = 10000
export const FILE_SIZE_LIMIT = 5 * 1024 * 1024  // 5 MB
export const SUPPORTED_FILE_TYPES = ['.txt', '.pdf', '.docx', '.md']
export const DEFAULT_BULLET_COUNT = 5
export const MIN_BULLET_COUNT = 3
export const MAX_BULLET_COUNT = 10
```

---

## API Service Layer (`src/services/groqAPI.ts`)

A centralized HTTP client using `fetch` with a 30-second timeout and typed responses.

### Functions

| Function | Method | Endpoint | Request | Response |
|---|---|---|---|---|
| `summarizeText(req)` | POST | `/api/summarize` | `{ text, format?, bulletCount? }` | `SummarizeResponse` |
| `uploadFile(file)` | POST | `/api/parse-file` | `FormData` with `file` | `{ text, fileName, wordCount }` |
| `getHistory()` | GET | `/api/history` | — | `HistoryRecord[]` |
| `deleteHistory()` | DELETE | `/api/history` | — | `{ message }` |
| `getUsage()` | GET | `/api/usage` | — | `UsageStatus` |

All requests are proxied via Vite dev server from `/api/*` → `http://localhost:5000/*`.

---

## Components

### Theme System

- **`ThemeContext.tsx`** — Creates React context with design tokens as default value
- **`ThemeProvider.tsx`** — Provides tokens via context to all children
- **`tokens.ts`** — All design tokens (colors, fonts, shadows, spacing, radii, breakpoints)

### Layout Components

- **`Layout.tsx`** — Flex column with `min-h-screen`; renders `Header` at top, `<main>` with `max-w-6xl` in the middle, `Footer` at bottom
- **`Header.tsx`** — Sticky top navbar with `backdrop-blur-sm`; app name (link to home) on the left, nav links (Home, History, How to Use) on the right with active route highlighting via `useLocation()`
- **`Footer.tsx`** — Centered copyright text with auto-updating year

### `TextInput.tsx` — `{ value: string, onChange: (value: string) => void }`

- Textarea with word count indicator (`X / 10,000 words`)
- Real-time word counting via `useMemo`
- Red border + warning message when word count exceeds `MAX_WORD_COUNT`

### `SummaryOutput.tsx` — `{ data: SummarizeResponse }`

- Displays summary points as a numbered list
- Metrics grid (2×2 mobile / 4-column desktop): Original words, Summary words, Compression ratio, Processing time
- Token usage display (prompt + completion tokens)
- Rate limit progress bar (requests remaining this hour)

### `LoadingSpinner.tsx` — `{ message?: string }` (default: "Generating summary...")

- Animated spinning ring using `animate-spin`
- Configurable message below the spinner

### `ErrorAlert.tsx` — `{ message: string, onDismiss?: () => void }`

- Red-tinted banner with error icon SVG
- Optional dismiss button (X icon)

### `ErrorBoundary.tsx` — `{ children: ReactNode }`

- Class component using `componentDidCatch`
- Fallback UI with warning icon, error message, and "Reload Page" button (`window.location.reload()`)

---

## Pages

### `Home.tsx` (Route: `/`)

**State:**
- `text` — User input text
- `format` — Summary format (`'bullet'` | `'paragraph'` | `'headline'`)
- `bulletCount` — Number of bullet points (3–10, only shown when format is `'bullet'`)
- `loading` / `result` / `error` — API call state
- `fileName` / `uploading` — File upload state

**UI Sections:**
1. Hero title + subtitle
2. `TextInput` component
3. "or upload a file" divider with dashed-border drop zone (hidden file input, accepts `.txt,.md,.pdf,.docx`)
4. Format selector — three toggle buttons
5. Bullet count slider (3–10 range input, visible only when `format === 'bullet'`)
6. "Summarise" button (disabled when text is empty or loading)
7. `ErrorAlert` (conditional)
8. `LoadingSpinner` (conditional)
9. `SummaryOutput` (conditional, with smooth scroll on result)

**Key functions:**
- `handleSummarize()` — Validates text, calls `summarizeText()`, handles errors
- `handleFileSelect()` — Validates file size (5 MB) and non-empty, calls `uploadFile()`, populates textarea

### `History.tsx` (Route: `/history`)

**State:** `records` / `loading` / `error` / `clearing`

- Fetches history on mount via `getHistory()`
- Shows `LoadingSpinner` while loading
- "Clear All" button calls `deleteHistory()`
- Empty state: archive icon + "No summaries yet"
- Each record card shows: title, date, summary (line-clamped 3 lines), format, word counts, processing time, tokens

### `Instructions.tsx` (Route: `/instructions`)

**State:** `usage` / `usageError` — fetched from `/api/usage` on mount

**Sections:**
1. "Getting Started" — numbered usage steps
2. "Format Options" — bullet points, paragraph, headlines descriptions
3. "Usage Limits & Fair Use" — rate limit, word count, file size, abuse policy, live usage stats
4. "Metrics Explained" — compression ratio, processing time, token usage, word count

### `NotFound.tsx` (Route: `*`)

- Large "404" in primary color
- "Page not found" message
- "Go Home" button linking to `/`

---

## Data Flow

1. User pastes text or uploads a file on the Home page
2. For files, frontend sends to `POST /api/parse-file` → backend extracts text → returns extracted text
3. Text is populated into the `TextInput` component
4. User selects format and optionally adjusts bullet count
5. On "Summarise" click, frontend sends `POST /api/summarize` with `{ text, format, bulletCount }`
6. Backend validates, calls Groq API (LLaMA 3.3 70B, temperature 0.3), saves to SQLite, returns summary with metrics
7. Frontend displays summary in `SummaryOutput` with compression ratio, processing time, token usage, and remaining requests

---

## Error Handling Strategy

- **ErrorBoundary** catches React rendering crashes with a fallback UI and "Reload Page" button
- **ErrorAlert** shows API/validation errors with an optional dismiss button
- **API service** has a 30-second `AbortController` timeout per request
- **Form validation** prevents submission with empty text or text exceeding 10,000 words
- **File validation** checks file size (5 MB max) and non-empty before upload

---

## Linting

- Uses oxlint with React, TypeScript, and Oxc plugins
- Rules: `react/rules-of-hooks` (error), `react/only-export-components` (warn)
