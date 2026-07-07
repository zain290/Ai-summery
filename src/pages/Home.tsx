import { useState, useRef, useEffect, useCallback } from 'react'
import { TextInput } from '../components/TextInput'
import { SummaryOutput } from '../components/SummaryOutput'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { summarizeText, uploadFile } from '../services/groqAPI'
import { DEFAULT_BULLET_COUNT, MIN_BULLET_COUNT, MAX_BULLET_COUNT, FILE_SIZE_LIMIT } from '../utils/constants'
import type { SummaryFormat, SummarizeResponse } from '../types'

export function Home() {
  const [text, setText] = useState('')
  const [format, setFormat] = useState<SummaryFormat>('bullet')
  const [bulletCount, setBulletCount] = useState(DEFAULT_BULLET_COUNT)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SummarizeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleSummarize = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await summarizeText({ text, format, bulletCount })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > FILE_SIZE_LIMIT) {
      setError(`File too large. Maximum size is 5 MB.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (file.size === 0) {
      setError('The selected file is empty. Please choose a file with content.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploading(true)
    setError(null)
    setFileName(file.name)

    try {
      const data = await uploadFile(file)
      if (!data.text || data.text.trim().length === 0) {
        setError('The file contained no extractable text. Please try a different file.')
        setFileName(null)
      } else {
        setText(data.text)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file')
      setFileName(null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [])

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-text">AI Text Summariser</h1>
        <p className="text-text-muted max-w-xl mx-auto">
          Paste your text or upload a file, choose a format, and let Groq AI generate a concise summary.
        </p>
      </div>

      <div className="space-y-4">
        <TextInput value={text} onChange={setText} />

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-text-muted text-sm">or upload a file</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf,.docx"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            type="button"
            className="w-full py-8 border-2 border-dashed border-white/10 rounded-lg
              text-text-muted hover:border-primary hover:text-primary hover:bg-primary/5
              transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Uploading...
              </span>
            ) : fileName ? (
              <span>{fileName}</span>
            ) : (
              <span>Click to browse files (TXT, PDF, DOCX, MD &mdash; max 5 MB)</span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-text-muted">Summary format</label>
            <div className="flex gap-2">
              {(['bullet', 'paragraph', 'headline'] as SummaryFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors capitalize
                    ${format === f
                      ? 'bg-primary border-primary text-white'
                      : 'bg-surface border-white/10 text-text-muted hover:border-white/30'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {format === 'bullet' && (
            <div className="space-y-2">
              <label className="text-sm text-text-muted">
                Bullet points: {bulletCount}
              </label>
              <input
                type="range"
                min={MIN_BULLET_COUNT}
                max={MAX_BULLET_COUNT}
                value={bulletCount}
                onChange={(e) => setBulletCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-text-muted/50">
                <span>{MIN_BULLET_COUNT}</span>
                <span>{MAX_BULLET_COUNT}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={handleSummarize}
            disabled={!text.trim() || loading}
            type="button"
            className="min-w-[200px] px-8 py-3 bg-primary text-white rounded-lg font-medium
              hover:brightness-110 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Summarising...' : 'Summarise'}
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {loading && <LoadingSpinner />}

      {result && (
        <div ref={resultRef}>
          <SummaryOutput data={result} />
        </div>
      )}
    </div>
  )
}
