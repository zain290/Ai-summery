import Groq from 'groq-sdk'

let client: Groq | null = null

function getClient(): Groq {
  if (!client) {
    client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return client
}

export async function generateSummary(
  text: string,
  format: 'bullet' | 'paragraph' | 'headline' = 'bullet',
  bulletCount: number = 5,
): Promise<{
  summary: string[]
  promptTokens: number
  completionTokens: number
  totalTokens: number
}> {
  const systemPrompt = getSystemPrompt(format, bulletCount)

  const response = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please summarise the following text:\n\n${text}` },
    ],
    temperature: 0.3,
    max_completion_tokens: 1024,
  })

  const content = response.choices[0]?.message?.content?.trim() || ''
  const bulletPoints = parseSummary(content, format)

  return {
    summary: bulletPoints,
    promptTokens: response.usage?.prompt_tokens || 0,
    completionTokens: response.usage?.completion_tokens || 0,
    totalTokens: response.usage?.total_tokens || 0,
  }
}

function getSystemPrompt(format: string, bulletCount: number): string {
  switch (format) {
    case 'bullet':
      return `You are a precise summarisation assistant. Summarise the given text into exactly ${bulletCount} concise bullet points. Each bullet point must be a complete sentence. Return ONLY the bullet points, one per line, starting with "- ".`
    case 'paragraph':
      return `You are a precise summarisation assistant. Summarise the given text into 2-3 concise paragraphs. Capture the main arguments and key details. Return ONLY the paragraphs separated by blank lines.`
    case 'headline':
      return `You are a precise summarisation assistant. Summarise the given text into 3-5 short headline-style points. Each headline should be 5-10 words capturing one key idea. Return ONLY the headlines, one per line, starting with "- ".`
    default:
      return `You are a precise summarisation assistant. Summarise the given text into exactly ${bulletCount} concise bullet points.`
  }
}

function parseSummary(content: string, format: string): string[] {
  if (format === 'paragraph') {
    return content.split('\n\n').filter((p) => p.trim().length > 0)
  }
  return content
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter((line) => line.length > 0)
}
