export class InvalidAreaError extends Error {
  statusCode = 400

  constructor () {
    super('total area should be greater than the sum of vegetation area and arable area')
    this.name = 'InvalidAreaError'
  }
}
