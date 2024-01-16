export class AlreadyExistsError extends Error {
  statusCode = 400

  constructor (fieldName: string) {
    super(`${fieldName} already exists`)
    this.name = 'AlreadyExistsError'
  }
}
