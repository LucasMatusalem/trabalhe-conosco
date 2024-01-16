import { type Request } from 'express'
import { type HttpResponse, noContent } from '../../helpers'
import { Controller } from '../abstract.controller'
import joi from 'joi'
import { type FarmerDTO } from '@/domain/contracts/dtos/farmer.dto'
import { type DeleteFarmerUseCase } from '@/domain/use-cases/delete-farmer.usecase'

type InputData = Required<Pick<FarmerDTO, 'id'>>

export class DeleteFarmerController extends Controller {
  constructor (private readonly deleteFarmerUseCase: DeleteFarmerUseCase) {
    super()
  }

  override async execute (data: InputData): Promise<HttpResponse> {
    await this.deleteFarmerUseCase.execute({ id: data.id })
    return noContent()
  }

  override validate (httpRequest: Request): { error?: Error, data: InputData } {
    const schema = joi.object({
      id: joi.string().uuid().required()
    }).required()
    const { error, value } = schema.validate(httpRequest.params)
    return {
      error,
      data: value
    }
  }
}
