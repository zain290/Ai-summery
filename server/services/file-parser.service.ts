import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'

export async function parseFile(buffer: Buffer, fileName: string): Promise<string> {
  if (!buffer || buffer.length === 0) {
    throw new Error('File is empty.')
  }

  const name = fileName.toLowerCase()
  const dot = name.lastIndexOf('.')
  if (dot === -1) {
    throw new Error(`File "${fileName}" has no extension. Supported: .txt, .md, .pdf, .docx`)
  }
  const ext = name.slice(dot)

  switch (ext) {
    case '.txt':
    case '.md':
      return buffer.toString('utf-8')

    case '.pdf': {
      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      const textResult = await parser.getText()
      return textResult.text
    }

    case '.docx': {
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    }

    default:
      throw new Error(`Unsupported file type "${ext}". Supported: .txt, .md, .pdf, .docx`)
  }
}
