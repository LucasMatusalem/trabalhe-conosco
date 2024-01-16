import { type Request } from 'express'
import { type HttpResponse, created } from '../../helpers'
import { Controller } from '../abstract.controller'
import joi from 'joi'
import { type CreateFarmerUseCase } from '@/domain/use-cases/create-farmer.usecase'
import { type FarmerDTO } from '@/domain/contracts/dtos/farmer.dto'

type InputData = FarmerDTO

export class CreateFarmerController extends Controller {
  constructor (private readonly createFarmerUseCase: CreateFarmerUseCase) {
    super()
  }

  override async execute (data: InputData): Promise<HttpResponse> {
    const farmer = await this.createFarmerUseCase.execute(data)
    return created(farmer)
  }

  override validate (httpRequest: Request): { error?: Error, data: InputData } {
    const validCrops = ['soybeans', 'corn', 'cotton', 'coffee', 'sugarcane']
    const bodySchema = joi.object<FarmerDTO>({
      name: joi.string().required(),
      legalDocumentType: joi.string().valid(...['cpf', 'cnpj']).required(),
      legalDocumentValue: joi.alternatives().conditional('legalDocumentType', {
        is: 'cpf',
        then: joi.string().regex(/^\d+$/).length(11),
        otherwise: joi.string().regex(/^\d+$/).length(14)
      }).required(),
      farmName: joi.string().required(),
      farmCity: joi.string().required(),
      farmState: joi.string().required(),
      farmTotalArea: joi.number().required(),
      farmArableArea: joi.number().required(),
      farmVegetationArea: joi.number().required(),
      farmCrops: joi.array().items(joi.string().valid(...validCrops)).min(1).required()
    }).required()
    const { error, value } = bodySchema.validate(httpRequest.body)
    return {
      error,
      data: value
    }
  }
}
