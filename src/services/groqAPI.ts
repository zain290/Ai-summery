import { API_BASE } from '../utils/constants'
import type { SummarizeRequest, SummarizeResponse, HistoryRecord, UsageStatus } from '../types'

async function fetchJSON<T>(url: string, options?: RequestInit, timeoutMs = 30000): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    if (!res.ok) {
      let errorMsg = `Request failed (${res.status})`
      try {
        const body = await res.json()
        errorMsg = body.error || errorMsg
      } catch { }
      throw new Error(errorMsg)
    }
    return await res.json() as T
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export async function summarizeText(req: SummarizeRequest): Promise<SummarizeResponse> {
  return fetchJSON<SummarizeResponse>(`${API_BASE}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function uploadFile(file: File): Promise<{ text: string; fileName: string; wordCount: number }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30000)
  try {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${API_BASE}/parse-file`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    })
    if (!res.ok) {
      let errorMsg = `Upload failed (${res.status})`
      try {
        const body = await res.json()
        errorMsg = body.error || errorMsg
      } catch { }
      throw new Error(errorMsg)
    }
    return res.json()
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Upload timed out. Please check your connection and try again.')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export async function getHistory(): Promise<HistoryRecord[]> {
  return fetchJSON<HistoryRecord[]>(`${API_BASE}/history`)
}

export async function deleteHistory(): Promise<void> {
  await fetchJSON<{ message: string }>(`${API_BASE}/history`, { method: 'DELETE' })
}

export async function getUsage(): Promise<UsageStatus> {
  return fetchJSON<UsageStatus>(`${API_BASE}/usage`)
}
