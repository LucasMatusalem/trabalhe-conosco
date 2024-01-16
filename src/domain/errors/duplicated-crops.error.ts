export class DuplicatedCropsError extends Error {
  statusCode = 400

  constructor () {
    super('each crop should be unique')
    this.name = 'DuplicatedCropsError'
  }
}
