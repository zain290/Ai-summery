import { Router } from 'express'
import apiRoutes from './api.routes'
import seoRoutes from './seo.routes'

const router = Router()

router.use('/api', apiRoutes)
router.use(seoRoutes)

export default router
