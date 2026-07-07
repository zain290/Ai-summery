export type SummaryFormat = 'bullet' | 'paragraph' | 'headline'

export interface SummarizeRequest {
  text: string
  format?: SummaryFormat
  bulletCount?: number
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface SummarizeResponse {
  success: boolean
  summary: string[]
  originalLength: number
  summaryLength: number
  processingTime: number
  compressionRatio: number
  tokenUsage: TokenUsage
  remaining: number
  limit: number
}

export interface UsageStatus {
  success: boolean
  totalUsed: number
  totalTokensUsed: number
  remaining: number
  limit: number
}

export interface HistoryRecord {
  id: number
  title: string
  summary: string
  format: string
  original_length: number
  summary_length: number
  processing_time: number
  token_usage_total: number
  created_at: string
}
