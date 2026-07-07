# AI Text Summariser — Final Report

## Project Overview

**AI Text Summariser** is a full-stack web application that uses the **Groq API** (LLaMA 3.3 70B) to generate concise summaries from user-provided text or uploaded files. Built with a modern TypeScript stack, it supports three summary formats, file parsing, persistent history, and per-IP rate limiting.

---

## What It Does

| Feature | Detail |
|---------|--------|
| **Text summarisation** | Paste any text and generate a summary in 3 formats |
| **File upload** | Upload `.txt`, `.md`, `.pdf`, `.docx` files for automatic text extraction and summarisation |
| **Summary formats** | Bullet points (3–10), paragraph (2–3 paragraphs), or headlines (3–5) |
| **History** | View and clear past summaries with metadata (token usage, processing time, compression ratio) |
| **Rate limiting** | 10 requests per hour per IP address |
| **Usage tracking** | Total requests and token usage persisted in SQLite |

---

## Tech Stack

### Frontend
- **React 19** + **TypeScript 6** — type-safe UI
- **Vite 8** — dev server and build tool (port 5173)
- **Tailwind CSS v4** — utility-first styling
- **React Router DOM v7** — client-side routing (`/`, `/history`, `/instructions`)
- **@tailwindcss/vite** — Tailwind Vite plugin

### Backend
- **Express 5** — HTTP server (port 5000)
- **groq-sdk** — Groq API client (LLaMA 3.3 70B, `temperature: 0.3`)
- **sql.js** — SQLite compiled to WebAssembly (pure JS, no native deps)
- **multer** — multipart file upload handling
- **pdf-parse** — PDF text extraction
- **mammoth** — DOCX text extraction
- **cors** — cross-origin support
- **dotenv** — environment variable loading

### Tooling
- **tsx** — TypeScript execution for the server
- **oxlint** — linting
- **concurrently** — run frontend + backend with one command

---

## Architecture

```
┌─────────────┐     Vite Proxy      ┌─────────────┐    Groq API
│  React SPA  │ ──── /api/* ──────→ │  Express 5  │ ────────────→ llama-3.3-70b
│  :5173      │                     │  :5000      │
└─────────────┘                     └──────┬──────┘
                                           │
                                    ┌──────┴──────┐
                                    │   SQLite DB  │
                                    │  data/*.db   │
                                    └─────────────┘
```

### Routes

| Method | Path | Handler | Description |
|--------|------|---------|-------------|
| POST | `/api/summarize` | `summarize` | Generate summary from text |
| POST | `/api/parse-file` | `parseFileUpload` | Upload & extract text from file |
| GET | `/api/history` | `getHistory` | Get last 50 summaries |
| DELETE | `/api/history` | `deleteHistory` | Clear all history |
| GET | `/api/usage` | `getUsage` | Get current usage stats |

---

## Database Schema (`data/summaries.db`)

### `summaries`
Stores each summarisation request and its result:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment |
| `title` | TEXT | First 50 chars of input |
| `content` | TEXT | Full input text |
| `summary` | TEXT | Generated summary |
| `format` | TEXT | bullet / paragraph / headline |
| `bullet_count` | INTEGER | 3–10 |
| `original_length` | INTEGER | Word count of input |
| `summary_length` | INTEGER | Word count of summary |
| `processing_time` | INTEGER | ms |
| `compression_ratio` | REAL | % reduction |
| `token_usage_prompt` | INTEGER | Prompt tokens |
| `token_usage_completion` | INTEGER | Completion tokens |
| `token_usage_total` | INTEGER | Total tokens |
| `created_at` | TEXT | ISO datetime |

### `usage_limits`
Rate-limiting per IP per hour window:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment |
| `ip_address` | TEXT | Client IP |
| `request_count` | INTEGER | Requests in this window |
| `window_start` | TEXT | Hour bucket (ISO) |
| `total_tokens_used` | INTEGER | Tokens consumed |
| `created_at` | TEXT | ISO datetime |
| **UNIQUE** | `(ip_address, window_start)` | Prevents duplicates |

---

## Rate Limiting Design

Per-IP, per-hour window using atomic `INSERT OR REPLACE`:

```
INSERT OR REPLACE INTO usage_limits
  (ip_address, window_start, request_count, total_tokens_used)
VALUES (?, ?, COALESCE(
  (SELECT request_count FROM usage_limits
   WHERE ip_address = ? AND window_start = ?), 0) + 1, 0)
```

- **Atomic**: `INSERT OR REPLACE` + `UNIQUE(ip_address, window_start)` prevents TOCTOU race conditions without transactions
- **Window**: Hourly bucket computed client-side (`getHourWindow()`)
- **Limit**: 10 requests/hour (configurable via `RATE_LIMIT_PER_HOUR` env var)
- **Enforcement**: Checked after increment; returns `429 RATE_LIMITED` if exceeded

---

## Error Handling

All errors return JSON with a `code` field for programmatic handling:

| Status | Code | Meaning |
|--------|------|---------|
| 400 | `INVALID_INPUT` | Missing or invalid text |
| 400 | `TEXT_TOO_LONG` | Exceeds 10,000 word limit |
| 400 | `NO_FILE` | No file in upload request |
| 400 | `LIMIT_FILE_SIZE` | File exceeds 5 MB |
| 400 | `LIMIT_UNEXPECTED_FILE` | Multer field error |
| 429 | `RATE_LIMITED` | Exceeded hourly limit |
| 500 | `INTERNAL_ERROR` | Generic server error |

The `fetchJSON` helper on the frontend unwraps `.error` from the response body for user-friendly messages. Requests time out after 30 seconds.

---

## Configuration (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `GROQ_API_KEY` | — | Groq API key (required) |
| `PORT` | `5000` | Express server port |
| `NODE_ENV` | `development` | Environment mode |
| `RATE_LIMIT_PER_HOUR` | `10` | Max requests per IP per hour |
| `MAX_WORD_COUNT` | `10000` | Max input word count |
| `MAX_FILE_SIZE` | `5242880` | Max upload file size (bytes) |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run server` | Start Express server |
| `npm run dev:all` | Start both (via concurrently) |
| `npm run build` | Type-check + Vite build |
| `npm run lint` | Run oxlint |
| `npm run preview` | Preview production build |

---

## Bugs Fixed During Development

| Bug | Cause | Fix |
|-----|-------|-----|
| **502 Bad Gateway on all `/api` requests** | Express 5 uses `path-to-regexp` v8+, which dropped bare `*` route patterns. Server crashed on startup | Changed `app.get('*', ...)` → `app.get('/{*path}', ...)` in `server/app.ts:33` |
| **500 Invalid API Key from Groq** | `groq.service.ts` created the Groq client at module level; `config()` hadn't run yet (static imports resolve first), so `process.env.GROQ_API_KEY` was `undefined` | Changed to lazy `getClient()` singleton in `server/services/groq.service.ts:5-12` |
| **TOCTOU race in rate limiter** (initial design) | Read counter → check limit → write used separate queries | Replaced with atomic `INSERT OR REPLACE` + `UNIQUE` constraint |
| **TypeScript errors on `req.file`** | Multer types not augmenting Express Request | Added `@types/multer`, switched to `moduleResolution: "bundler"` |
| **`import.meta.dirname` undefined** (Node 24 compat) | Was using deprecated `import.meta.dirname` | Replaced with `fileURLToPath(import.meta.url)` + `dirname` |

---

## File Structure

```
ai-summerise/
├── .env
├── package.json
├── tsconfig.json
├── tsconfig.server.json
├── vite.config.ts
├── data/
│   └── summaries.db
├── server/
│   ├── index.ts
│   ├── app.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── api.routes.ts
│   ├── controllers/
│   │   └── summarize.controller.ts
│   ├── services/
│   │   ├── groq.service.ts
│   │   └── file-parser.service.ts
│   ├── middleware/
│   │   └── error.middleware.ts
│   └── db/
│       └── database.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── pages/
    │   ├── Home.tsx
    │   ├── History.tsx
    │   ├── Instructions.tsx
    │   └── NotFound.tsx
    ├── components/
    │   ├── TextInput.tsx
    │   ├── SummaryOutput.tsx
    │   ├── LoadingSpinner.tsx
    │   ├── ErrorAlert.tsx
    │   ├── ErrorBoundary.tsx
    │   └── layout/
    ├── services/
    │   └── groqAPI.ts
    ├── types/
    │   └── index.ts
    ├── utils/
    │   └── constants.ts
    ├── theme/
    └── styles/
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set your Groq API key in .env
echo "GROQ_API_KEY=gsk_your_key_here" >> .env

# 3. Start both servers
npm run dev:all

# 4. Open http://localhost:5173
```

Get a Groq API key at https://console.groq.com
