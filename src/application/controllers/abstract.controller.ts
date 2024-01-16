import { type Request } from 'express'
import { type HttpResponse, badRequest, serverError, appError } from '../helpers'

export abstract class Controller {
  abstract execute (data: unknown): Promise<HttpResponse>
  abstract validate (httpRequest: Request): { error?: Error, data: unknown }

  async handle (httpRequest: Request): Promise<HttpResponse> {
    const { error: validationError, data } = this.validate(httpRequest)
    if (validationError) return badRequest(validationError)
    try {
      return await this.execute(data)
    } catch (error: any) {
      if (error.statusCode) {
        console.log(error)
        return appError({
          statusCode: error.statusCode,
          message: error.message
        })
      }
      console.error(error)
      return serverError(error)
    }
  }
}
