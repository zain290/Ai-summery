import { useMemo } from 'react'
import { MAX_WORD_COUNT } from '../utils/constants'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function TextInput({ value, onChange }: TextInputProps) {
  const wordCount = useMemo(() => countWords(value), [value])
  const overLimit = wordCount > MAX_WORD_COUNT

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-text-muted">Enter text to summarise</label>
        <span className={`text-xs ${overLimit ? 'text-red-400' : 'text-text-muted/50'}`}>
          {wordCount.toLocaleString()} / {MAX_WORD_COUNT.toLocaleString()} words
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your article, document, or notes here..."
        className={`w-full min-h-[220px] p-4 rounded-lg bg-surface border text-text placeholder:text-text-muted/30
          focus:outline-none focus:border-primary resize-y transition-colors
          ${overLimit ? 'border-red-500/50' : 'border-white/10'}`}
      />
      {overLimit && (
        <p className="text-red-400 text-xs">
          Text exceeds maximum length. Please remove {(wordCount - MAX_WORD_COUNT).toLocaleString()} words.
        </p>
      )}
    </div>
  )
}
