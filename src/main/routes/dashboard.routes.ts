import { type Controller } from '@/application/controllers/abstract.controller'
import { DashboardController } from '@/application/controllers/dashboard/dashboard.controller'
import { DashboardUseCase } from '@/domain/use-cases/dashboard.usecase'
import { FarmerRepository } from '@/infra/repositories/farmer.repository'
import { type NextFunction, type Request, type Response, Router, type RequestHandler } from 'express'

const dashboardRoutes = Router()

const farmerRepository = new FarmerRepository()
const dashboardUseCase = new DashboardUseCase(farmerRepository)
const dashboardController = new DashboardController(dashboardUseCase)

const adapt = (controller: Controller): RequestHandler => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const response = await controller.handle(req)
  res.status(response.statusCode).json(response.data)
  next()
}

dashboardRoutes.post('/', adapt(dashboardController))

export { dashboardRoutes }
