import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SummaryFormat } from '../../types'

interface UploadZoneProps {
  onAnalyze: (file: File | null, jobDescription: string) => void
  loading: boolean
  format: SummaryFormat
  setFormat: (f: SummaryFormat) => void
  bulletCount: number
  setBulletCount: (c: number) => void
}

export function UploadZone({ onAnalyze, loading, format, setFormat, bulletCount, setBulletCount }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && isAllowed(dropped.type)) setFile(dropped)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }, [])

  const handleSubmit = useCallback(() => {
    if (file || jobDescription.trim()) {
      onAnalyze(file, jobDescription)
    }
  }, [file, jobDescription, onAnalyze])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full mx-auto space-y-6"
    >
      <div className="bg-[var(--color-create-surface)] rounded-3xl border border-transparent shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 overflow-hidden w-full max-w-2xl mx-auto p-8">
        
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border border-dashed p-10 text-center transition-all duration-300 ${
            dragOver
              ? 'border-neutral-500 bg-neutral-100 dark:bg-neutral-800'
              : 'border-neutral-300 dark:border-neutral-700 bg-transparent hover:border-neutral-400 dark:hover:border-neutral-500'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.md,.pdf,.docx,.doc"
            className="hidden"
            onChange={handleChange}
          />
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                  <svg className="w-7 h-7 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-text">{file.name}</p>
                <p className="text-xs text-neutral-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  className="text-xs text-red-500 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                  <svg className="w-7 h-7 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-500">
                  <span className="text-text font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-neutral-400">TXT, MD, PDF, DOCX (max 5MB)</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col relative focus-within:border-black focus-within:rounded-3xl dark:focus-within:border-white transition-all duration-300">
          <textarea
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Paste your text here..."
            className="w-full bg-transparent resize-none outline-none text-text p-6 min-h-[120px] max-h-[300px] overflow-y-auto text-lg font-normal placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-2xl border border-neutral-200 dark:border-neutral-700 focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2 text-left">
            <label className="text-sm text-neutral-500 font-medium">Summary Format</label>
            <div className="flex gap-2">
              {(['bullet', 'paragraph', 'headline'] as SummaryFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    format === f
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-transparent border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          {format === 'bullet' && (
            <div className="flex-1 space-y-2 text-left">
              <label className="text-sm text-neutral-500 font-medium">
                Bullet points: {bulletCount}
              </label>
              <input
                type="range"
                min={1}
                max={15}
                value={bulletCount}
                onChange={(e) => setBulletCount(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={(!file && !jobDescription.trim()) || loading}
            className="bg-black text-white hover:bg-neutral-800 disabled:bg-black disabled:opacity-30 dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:disabled:bg-white dark:disabled:opacity-30 rounded-full px-8 py-3 font-medium text-sm transition-all duration-300 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Summarizing...
              </span>
            ) : (
              <>
                Summarize Text
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 21L10.5 14.5L4 13.5L10.5 12.5L11.5 6L12.5 12.5L19 13.5L12.5 14.5L11.5 21Z" fill="currentColor"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function isAllowed(mime: string) {
  return [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ].includes(mime)
}
