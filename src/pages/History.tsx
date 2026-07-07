import { useState, useEffect, useCallback } from 'react'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { getHistory, deleteHistory } from '../services/groqAPI'
import type { HistoryRecord } from '../types'

export function History() {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistory()
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleClear = async () => {
    setClearing(true)
    try {
      await deleteHistory()
      setRecords([])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history')
    } finally {
      setClearing(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading history..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Summary History</h1>
          <p className="text-text-muted text-sm mt-1">
            {records.length === 0
              ? 'No summaries yet'
              : `Past ${records.length} summar${records.length === 1 ? 'y' : 'ies'}`
            }
          </p>
        </div>
        {records.length > 0 && (
          <button
            onClick={handleClear}
            disabled={clearing}
            className="px-4 py-2 text-sm text-text-muted hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-lg transition-colors disabled:opacity-50"
          >
            {clearing ? 'Clearing...' : 'Clear All'}
          </button>
        )}
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {records.length === 0 && !error ? (
        <div className="text-center py-16 text-text-muted">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg">No summaries yet</p>
          <p className="text-sm mt-1">Summarise something to see it here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((r) => (
            <div key={r.id} className="bg-surface border border-white/10 rounded-lg p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-text truncate flex-1">{r.title}</h3>
                <span className="text-xs text-text-muted/40 ml-4 shrink-0">
                  {new Date(r.created_at + 'Z').toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed line-clamp-3 mb-3">
                {r.summary}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-text-muted/50">
                <span>{r.format}</span>
                <span>{r.original_length} &rarr; {r.summary_length} words</span>
                <span>{(r.processing_time / 1000).toFixed(1)}s</span>
                <span>{r.token_usage_total} tokens</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
