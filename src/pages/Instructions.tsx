import { useState, useEffect } from 'react'
import { ErrorAlert } from '../components/ErrorAlert'
import { getUsage } from '../services/groqAPI'
import { MAX_WORD_COUNT, FILE_SIZE_LIMIT } from '../utils/constants'
import type { UsageStatus } from '../types'

export function Instructions() {
  const [usage, setUsage] = useState<UsageStatus | null>(null)
  const [usageError, setUsageError] = useState<string | null>(null)

  useEffect(() => {
    getUsage()
      .then((data) => {
        if (data.success) setUsage(data)
      })
      .catch((err) => setUsageError(err instanceof Error ? err.message : 'Failed to load usage stats'))
  }, [])

  const MB = FILE_SIZE_LIMIT / (1024 * 1024)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-text">How to Use</h1>
        <p className="text-text-muted">AI Text Summariser &mdash; powered by Groq Cloud</p>
      </div>

      <section className="bg-surface border border-white/10 rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-text">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-text-muted text-sm leading-relaxed">
          <li>Paste your text into the input box or upload a file (TXT, PDF, DOCX, MD).</li>
          <li>Choose a summary format: <strong className="text-text">Bullet points</strong>, <strong className="text-text">Paragraph</strong>, or <strong className="text-text">Headlines</strong>.</li>
          <li>For bullet format, adjust the number of points (3&ndash;10).</li>
          <li>Click <strong className="text-text">Summarise</strong> and wait a few seconds.</li>
          <li>View your summary with processing metrics.</li>
        </ol>
      </section>

      <section className="bg-surface border border-white/10 rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-text">Format Options</h2>
        <div className="space-y-3 text-sm">
          <div>
            <h3 className="text-primary font-medium mb-1">Bullet Points</h3>
            <p className="text-text-muted">Key points presented as a numbered list. Adjust the count from 3&ndash;10 using the slider.</p>
          </div>
          <div>
            <h3 className="text-primary font-medium mb-1">Paragraph</h3>
            <p className="text-text-muted">A coherent 2&ndash;3 paragraph summary that reads like a short article.</p>
          </div>
          <div>
            <h3 className="text-primary font-medium mb-1">Headlines</h3>
            <p className="text-text-muted">Short headline-style points (5&ndash;10 words each) capturing the core ideas.</p>
          </div>
        </div>
      </section>

      <section className="bg-surface border border-yellow-500/20 rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-yellow-400">Usage Limits &amp; Fair Use</h2>
        <div className="space-y-3 text-sm text-text-muted">
          <p>To ensure fair access for all users, the following strict limits are enforced:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-text">Rate limit:</strong> Maximum <strong>{usage?.limit || 10} requests per hour</strong> per IP address. This resets on the hour.</li>
            <li><strong className="text-text">Text length:</strong> Maximum <strong>{MAX_WORD_COUNT.toLocaleString()} words</strong> per request.</li>
            <li><strong className="text-text">File size:</strong> Maximum <strong>{MB} MB</strong> per uploaded file.</li>
            <li><strong className="text-text">Abuse:</strong> Automated or bulk submissions are prohibited. Excessive usage may result in a permanent IP ban.</li>
            <li><strong className="text-text">Token consumption:</strong> Each request consumes tokens from the shared API quota. The system tracks total tokens used.</li>
          </ul>
          {usageError && <ErrorAlert message={usageError} onDismiss={() => setUsageError(null)} />}
          {usage && (
            <div className="mt-4 bg-black/20 rounded-lg p-4">
              <p className="text-text text-sm font-medium mb-2">System Usage Statistics</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-text-muted/50">Total requests served</span>
                  <p className="text-text font-medium">{usage.totalUsed.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-text-muted/50">Total tokens consumed</span>
                  <p className="text-text font-medium">{usage.totalTokensUsed.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-surface border border-white/10 rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-text">Metrics Explained</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <h3 className="text-primary font-medium mb-1">Compression Ratio</h3>
            <p className="text-text-muted">How much shorter the summary is compared to the original, expressed as a percentage.</p>
          </div>
          <div>
            <h3 className="text-primary font-medium mb-1">Processing Time</h3>
            <p className="text-text-muted">The total time taken from request to response, including API latency.</p>
          </div>
          <div>
            <h3 className="text-primary font-medium mb-1">Token Usage</h3>
            <p className="text-text-muted">Number of tokens consumed by the AI model for prompt and completion.</p>
          </div>
          <div>
            <h3 className="text-primary font-medium mb-1">Word Count</h3>
            <p className="text-text-muted">Original and summary word counts for quick comparison.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
