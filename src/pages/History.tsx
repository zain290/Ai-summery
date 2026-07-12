import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  if (loading) return (
    <div className="relative pt-24 min-h-screen bg-background w-full flex flex-col items-center justify-center">
      <LoadingSpinner message="Loading history..." />
    </div>
  )

  return (
    <div className="relative pt-24 bg-background w-full flex flex-col items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl mx-auto px-4 pb-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-[56px] font-medium text-text mb-2 tracking-tight" style={{ fontFamily: 'Google Sans, var(--heading)' }}>
              Summary History
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
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
              className="px-6 py-3 text-sm font-medium text-text bg-[var(--color-create-surface)] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 border border-transparent hover:border-red-200 dark:hover:border-red-800 rounded-full transition-all duration-300 disabled:opacity-50"
            >
              {clearing ? 'Clearing...' : 'Clear All History'}
            </button>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <ErrorAlert message={error} onDismiss={() => setError(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {records.length === 0 && !error ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full bg-[var(--color-create-surface)] rounded-3xl border border-transparent p-16 text-center shadow-sm"
          >
            <svg className="w-16 h-16 mx-auto mb-6 text-neutral-300 dark:text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-xl font-medium text-text mb-2">No summaries yet</p>
            <p className="text-neutral-500 dark:text-neutral-400">Head over to the Showcase to summarize your first text.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {records.map((r, i) => (
                <motion.div 
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="relative p-8 rounded-3xl bg-[var(--color-create-surface)] border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                    <h3 className="text-xl font-medium text-text truncate flex-1">{r.title}</h3>
                    <span className="text-sm font-medium text-neutral-400 shrink-0 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                      {new Date(r.created_at + 'Z').toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed line-clamp-3 mb-6">
                    {r.summary}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-text font-medium">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg capitalize">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      {r.format}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V4m0 0l6 6m-6-6l-6 6"/></svg>
                      {r.original_length} &rarr; {r.summary_length} words
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      {(r.processing_time / 1000).toFixed(1)}s
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 15v4a2 2 0 002 2h16v-5H5a2 2 0 00-2 2z"/></svg>
                      {r.token_usage_total} tokens
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
