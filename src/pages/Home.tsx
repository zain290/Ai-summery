import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadZone } from '../components/ui/UploadZone'
import { SummaryOutput } from '../components/SummaryOutput'
import { summarizeText, uploadFile } from '../services/groqAPI'
import { DEFAULT_BULLET_COUNT } from '../utils/constants'
import type { SummaryFormat, SummarizeResponse } from '../types'

export function Home() {
  const [format, setFormat] = useState<SummaryFormat>('bullet')
  const [bulletCount, setBulletCount] = useState(DEFAULT_BULLET_COUNT)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SummarizeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleSummarize = useCallback(async (file: File | null, textContent: string) => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      let finalString = textContent;
      if (file) {
         const data = await uploadFile(file);
         if (!data.text || data.text.trim().length === 0) {
            throw new Error('The file contained no extractable text. Please try a different file.');
         }
         finalString += '\n' + data.text;
      }
      
      if (!finalString.trim()) {
         throw new Error("Please provide text or upload a file.");
      }

      const summaryData = await summarizeText({ text: finalString, format, bulletCount })
      setResult(summaryData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }, [format, bulletCount])

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  return (
    <div className="relative pt-24 bg-background w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="py-12 px-4 w-full"
            ref={resultRef}
          >
            <SummaryOutput data={result} />
            <div className="mt-8 flex justify-center">
               <button onClick={() => setResult(null)} className="px-6 py-2 bg-neutral-200 dark:bg-neutral-800 text-text rounded-lg">Summarize Another</button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center"
          >
            <section className="w-full flex items-center justify-center px-4 pt-12 pb-24">
              <div className="w-full max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="mb-12"
                >
                  <h1 className="text-4xl md:text-[56px] font-medium text-text mb-6 tracking-tight" style={{ fontFamily: 'Google Sans, var(--heading)' }}>
                    sum up
                  </h1>
                  <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                    Paste your text or upload a file, choose a format, and let Groq AI generate a concise summary.
                  </p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm max-w-2xl mx-auto"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <UploadZone 
                  onAnalyze={handleSummarize} 
                  loading={loading}
                  format={format}
                  setFormat={setFormat}
                  bulletCount={bulletCount}
                  setBulletCount={setBulletCount}
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-8 text-sm text-neutral-500 dark:text-neutral-400"
                >
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Your data stays private — files are processed and immediately discarded
                  </span>
                </motion.p>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
