import type { Request, Response, NextFunction } from 'express'
import { getDatabase, saveDatabase } from '../db/database'
import { generateSummary, chatWithAI } from '../services/groq.service'
import { parseFile } from '../services/file-parser.service'

const RATE_LIMIT_PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR) || 10
const MAX_WORD_COUNT = Number(process.env.MAX_WORD_COUNT) || 10000

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function getHourWindow(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0).toISOString()
}

export async function summarize(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now()
  try {
    const { text, format, bulletCount } = req.body

    if (!text || typeof text !== 'string') {
      res.status(400).json({ success: false, error: 'Text is required', code: 'INVALID_INPUT' })
      return
    }

    const words = wordCount(text)
    if (words > MAX_WORD_COUNT) {
      res.status(400).json({
        success: false,
        error: `Text exceeds maximum length of ${MAX_WORD_COUNT.toLocaleString()} words (${words.toLocaleString()} words submitted).`,
        code: 'TEXT_TOO_LONG',
      })
      return
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown'
    const db = await getDatabase()
    const windowStart = getHourWindow()

    // Atomically increment the counter — sql.js is single-threaded within a process,
    // so INSERT OR REPLACE + read-back is safe from TOCTOU races
    db.run(
      `INSERT OR REPLACE INTO usage_limits (ip_address, window_start, request_count, total_tokens_used)
       VALUES (?, ?, COALESCE((SELECT request_count FROM usage_limits WHERE ip_address = ? AND window_start = ?), 0) + 1, 0)`,
      [ip, windowStart, ip, windowStart],
    )
    saveDatabase()

    const updated = db.exec(
      `SELECT request_count FROM usage_limits WHERE ip_address = ? AND window_start = ?`,
      [ip, windowStart],
    )
    const requestCount = Number(updated[0]?.values[0]?.[0] ?? 0)

    if (requestCount > RATE_LIMIT_PER_HOUR) {
      res.status(429).json({
        success: false,
        error: `Rate limit exceeded. 0 requests remaining this hour. Please wait.`,
        remaining: 0,
        limit: RATE_LIMIT_PER_HOUR,
        code: 'RATE_LIMITED',
      })
      return
    }

    const fmt = format || 'bullet'
    const count = Math.min(Math.max(bulletCount || 5, 3), 10)
    const result = await generateSummary(text, fmt, count)

    const processingTime = Date.now() - startTime
    const originalLength = wordCount(text)
    const summaryText = result.summary.join(' ')
    const summaryLength = wordCount(summaryText)
    const compressionRatio = originalLength > 0
      ? Math.round((1 - summaryLength / originalLength) * 100)
      : 0

    db.run(
      `INSERT INTO summaries (title, content, summary, format, bullet_count, original_length, summary_length, processing_time, compression_ratio, token_usage_prompt, token_usage_completion, token_usage_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        text.slice(0, 50),
        text,
        summaryText,
        fmt,
        count,
        originalLength,
        summaryLength,
        processingTime,
        compressionRatio,
        result.promptTokens,
        result.completionTokens,
        result.totalTokens,
      ],
    )

    // Update token usage
    db.run(
      `UPDATE usage_limits SET total_tokens_used = total_tokens_used + ? WHERE ip_address = ? AND window_start = ?`,
      [result.totalTokens, ip, windowStart],
    )

    saveDatabase()

    const remaining = Math.max(0, RATE_LIMIT_PER_HOUR - requestCount)

    res.json({
      success: true,
      summary: result.summary,
      originalLength,
      summaryLength,
      processingTime,
      compressionRatio,
      tokenUsage: {
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        totalTokens: result.totalTokens,
      },
      remaining,
      limit: RATE_LIMIT_PER_HOUR,
    })
  } catch (err) {
    next(err)
  }
}

export async function parseFileUpload(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file
    if (!file) {
      res.status(400).json({ success: false, error: 'No file uploaded', code: 'NO_FILE' })
      return
    }

    const text = await parseFile(file.buffer, file.originalname)
    const words = wordCount(text)

    if (words > MAX_WORD_COUNT) {
      res.status(400).json({
        success: false,
        error: `File contains ${words.toLocaleString()} words, which exceeds the maximum of ${MAX_WORD_COUNT.toLocaleString()}.`,
        code: 'TEXT_TOO_LONG',
      })
      return
    }

    res.json({ success: true, text, fileName: file.originalname, wordCount: words })
  } catch (err) {
    next(err)
  }
}

export async function getHistory(_req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDatabase()
    const result = db.exec(
      `SELECT id, title, summary, format, original_length, summary_length, processing_time, token_usage_total, created_at
       FROM summaries ORDER BY created_at DESC LIMIT 50`,
    )
    const rows = result[0]?.values.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      summary: row[2],
      format: row[3],
      original_length: row[4],
      summary_length: row[5],
      processing_time: row[6],
      token_usage_total: row[7],
      created_at: row[8],
    })) || []
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

export async function deleteHistory(_req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDatabase()
    db.run('DELETE FROM summaries')
    saveDatabase()
    res.json({ success: true, message: 'History cleared' })
  } catch (err) {
    next(err)
  }
}

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ success: false, error: 'Messages array is required', code: 'INVALID_INPUT' })
      return
    }

    const text = await chatWithAI(messages)

    res.json({ content: [{ text }] })
  } catch (err) {
    next(err)
  }
}

export async function getUsage(_req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDatabase()
    const result = db.exec(`
      SELECT COALESCE(SUM(request_count), 0), COALESCE(SUM(total_tokens_used), 0)
      FROM usage_limits
    `)
    const totalUsed = result[0]?.values[0]?.[0] || 0
    const totalTokensUsed = result[0]?.values[0]?.[1] || 0

    res.json({
      success: true,
      totalUsed,
      totalTokensUsed,
      remaining: 0,
      limit: RATE_LIMIT_PER_HOUR,
    })
  } catch (err) {
    next(err)
  }
}
