import type { Request, Response, NextFunction } from 'express'
import { MulterError } from 'multer'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (res.headersSent) {
    console.error('Headers already sent, skipping error handler:', err.message)
    return
  }

  if (err instanceof MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File too large. Maximum size is 5 MB.'
      : err.message
    res.status(status).json({ success: false, error: message, code: err.code })
    return
  }

  const status = (err as any).statusCode || 500
  console.error(`[${status}] ${err.message}`)
  if (status >= 500) console.error(err.stack)

  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.',
    code: 'INTERNAL_ERROR',
  })
}
