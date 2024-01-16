import { type Controller } from '@/application/controllers/abstract.controller'
import { CreateFarmerController } from '@/application/controllers/farmer/create-farmer.controller'
import { DeleteFarmerController } from '@/application/controllers/farmer/delete-farmer.controller'
import { EditFarmerController } from '@/application/controllers/farmer/edit-farmer.controller'
import { CreateFarmerUseCase } from '@/domain/use-cases/create-farmer.usecase'
import { DeleteFarmerUseCase } from '@/domain/use-cases/delete-farmer.usecase'
import { EditFarmerUseCase } from '@/domain/use-cases/edit-farmer.usecase'
import { FarmerRepository } from '@/infra/repositories/farmer.repository'
import { type NextFunction, type Request, type Response, Router, type RequestHandler } from 'express'

const farmerRoutes = Router()

const farmerRepository = new FarmerRepository()
const createFarmerUseCase = new CreateFarmerUseCase(farmerRepository)
const createFarmerController = new CreateFarmerController(createFarmerUseCase)
const deleteFarmerUseCase = new DeleteFarmerUseCase(farmerRepository)
const deleteFarmerController = new DeleteFarmerController(deleteFarmerUseCase)
const editFarmerUseCase = new EditFarmerUseCase(farmerRepository)
const editFarmerController = new EditFarmerController(editFarmerUseCase)

const adapt = (controller: Controller): RequestHandler => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const response = await controller.handle(req)
  res.status(response.statusCode).json(response.data)
  next()
}

farmerRoutes.post('/', adapt(createFarmerController))
farmerRoutes.put('/:id', adapt(editFarmerController))
farmerRoutes.delete('/:id', adapt(deleteFarmerController))

export { farmerRoutes }
