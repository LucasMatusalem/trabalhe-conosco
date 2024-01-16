export class ServerError extends Error {
  statusCode = 500

  constructor (error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401

  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
