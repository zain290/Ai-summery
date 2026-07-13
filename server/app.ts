import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import routes from './routes'
import { errorHandler } from './middleware/error.middleware'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class App {
  private app: express.Application

  constructor() {
    this.app = express()
    this.configureMiddleware()
    this.registerRoutes()
  }

  private configureMiddleware() {
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || false
        : true,
    }))
    this.app.use(express.json({ limit: '1mb' }))
  }

  private registerRoutes() {
    const distPath = resolve(__dirname, '..', 'dist')
    this.app.use(routes)
    this.app.use(express.static(distPath))
    this.app.get('/{*path}', (_req, res) => {
      res.sendFile(resolve(distPath, 'index.html'))
    })
    this.app.use(errorHandler)
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  }
}
