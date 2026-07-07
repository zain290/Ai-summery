import initSqlJs from 'sql.js'
import type { SqlJsStatic, Database } from 'sql.js'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DB_PATH = join(process.cwd(), 'data', 'summaries.db')

let db: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (db) return db

  const SQL: SqlJsStatic = await initSqlJs()
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      summary TEXT NOT NULL,
      format TEXT DEFAULT 'bullet',
      bullet_count INTEGER DEFAULT 5,
      original_length INTEGER DEFAULT 0,
      summary_length INTEGER DEFAULT 0,
      processing_time INTEGER DEFAULT 0,
      compression_ratio REAL DEFAULT 0,
      token_usage_prompt INTEGER DEFAULT 0,
      token_usage_completion INTEGER DEFAULT 0,
      token_usage_total INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS usage_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT NOT NULL,
      request_count INTEGER DEFAULT 1,
      window_start TEXT NOT NULL,
      total_tokens_used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(ip_address, window_start)
    )
  `)

  saveDatabase()
  return db
}

export function saveDatabase() {
  if (!db) return
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(DB_PATH, buffer)
}

export function closeDatabase() {
  if (db) {
    saveDatabase()
    db.close()
    db = null
  }
}
