import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '..', '.env') })

import { App } from './app'

const app = new App()
const port = Number(process.env.PORT) || 5000
app.start(port)
