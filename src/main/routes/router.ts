import { Router } from 'express'
import { farmerRoutes } from './farmer.routes'
import { dashboardRoutes } from './dashboard.routes'

const router = Router()
router.use('/farmer', farmerRoutes)
router.use('/dashboard', dashboardRoutes)

export { router }
