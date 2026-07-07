import type { SummarizeResponse } from '../types'

interface SummaryOutputProps {
  data: SummarizeResponse
}

export function SummaryOutput({ data }: SummaryOutputProps) {
  const points = data.summary ?? []
  const usage = data.tokenUsage

  return (
    <div className="bg-surface border border-primary/20 rounded-lg overflow-hidden">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-primary">Summary</h2>
      </div>

      <div className="px-6 py-4 space-y-3">
        {points.length === 0 ? (
          <p className="text-text-muted italic">No summary content returned.</p>
        ) : (
          <div className="space-y-2">
            {points.map((point, i) => (
              <p key={i} className="text-text leading-relaxed">
                {points.length > 1 && (
                  <span className="text-primary font-medium mr-2">{i + 1}.</span>
                )}
                {point}
              </p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5">
          <Metric label="Original" value={`${data.originalLength ?? 0} words`} />
          <Metric label="Summary" value={`${data.summaryLength ?? 0} words`} />
          <Metric label="Compression" value={`${data.compressionRatio ?? 0}%`} />
          <Metric label="Processed in" value={`${((data.processingTime ?? 0) / 1000).toFixed(1)}s`} />
        </div>

        {usage && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-text-muted/50">Tokens:</span>
            <span className="text-xs text-text-muted/50">
              {usage.promptTokens ?? 0} prompt &middot; {usage.completionTokens ?? 0} completion
            </span>
          </div>
        )}

        <div className="pt-1">
          <div className="flex items-center justify-between text-xs text-text-muted/50">
            <span>Requests remaining this hour</span>
            <span>{data.remaining ?? 0} / {data.limit ?? 10}</span>
          </div>
          <div className="mt-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((data.remaining ?? 0) / (data.limit ?? 10)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-text-muted/50">{label}</p>
      <p className="text-sm font-medium text-text mt-0.5">{value}</p>
    </div>
  )
}
