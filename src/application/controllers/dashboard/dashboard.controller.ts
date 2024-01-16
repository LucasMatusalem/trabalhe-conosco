import { type Request } from 'express'
import { type HttpResponse, ok } from '../../helpers'
import { Controller } from '../abstract.controller'
import { type DashboardUseCase } from '@/domain/use-cases/dashboard.usecase'

type InputData = undefined

export class DashboardController extends Controller {
  constructor (private readonly generateDashboard: DashboardUseCase) {
    super()
  }

  override async execute (data: InputData): Promise<HttpResponse> {
    const responseData = await this.generateDashboard.execute()
    return ok(responseData)
  }

  override validate (httpRequest: Request): { error?: Error, data: InputData } {
    return {
      data: undefined
    }
  }
}
