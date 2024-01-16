export class NotFoundError extends Error {
  statusCode = 404

  constructor () {
    super('entity not found')
    this.name = 'NotFoundError'
  }
}
