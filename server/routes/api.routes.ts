import { Router } from 'express'
import multer from 'multer'
import { summarize, parseFileUpload, getHistory, deleteHistory, getUsage, chat } from '../controllers/summarize.controller'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
})

router.post('/summarize', summarize)
router.post('/parse-file', upload.single('file'), parseFileUpload)
router.get('/history', getHistory)
router.delete('/history', deleteHistory)
router.get('/usage', getUsage)
router.post('/chat', chat)

export default router
