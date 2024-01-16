import { type Request } from 'express'
import { type HttpResponse, noContent } from '../../helpers'
import { Controller } from '../abstract.controller'
import joi from 'joi'
import { type EditFarmerUseCase } from '@/domain/use-cases/edit-farmer.usecase'
import { type FarmerDTO } from '@/domain/contracts/dtos/farmer.dto'

type InputData = { id: string, data: Partial<FarmerDTO> }

export class EditFarmerController extends Controller {
  constructor (private readonly editFarmerUseCase: EditFarmerUseCase) {
    super()
  }

  override async execute (data: InputData): Promise<HttpResponse> {
    await this.editFarmerUseCase.execute(data)
    return noContent()
  }

  override validate (httpRequest: Request): { error?: Error, data: InputData } {
    const schema = joi.object({
      id: joi.string().uuid().required()
    }).required()
    const { error: paramsValidationError, value: params } = schema.validate(httpRequest.params)
    if (paramsValidationError) {
      return {
        error: paramsValidationError,
        data: params
      }
    }
    const validCrops = ['soybeans', 'corn', 'cotton', 'coffee', 'sugarcane']
    const bodySchema = joi.object<FarmerDTO>({
      name: joi.string().optional(),
      legalDocumentType: joi.string().valid(...['cpf', 'cnpj']).optional(),
      legalDocumentValue: joi.alternatives().conditional('legalDocumentType', {
        is: 'cpf',
        then: joi.string().regex(/^\d+$/).length(11),
        otherwise: joi.string().regex(/^\d+$/).length(14)
      }).optional(),
      farmName: joi.string().optional(),
      farmCity: joi.string().optional(),
      farmState: joi.string().optional(),
      farmTotalArea: joi.number().optional(),
      farmArableArea: joi.number().optional(),
      farmVegetationArea: joi.number().optional(),
      farmCrops: joi.array().items(joi.string().valid(...validCrops)).min(1).optional()
    }).required()
    const { error: bodyValidationError, value: body } = bodySchema.validate(httpRequest.body)
    return {
      error: bodyValidationError,
      data: {
        id: params.id,
        data: body
      }
    }
  }
}
