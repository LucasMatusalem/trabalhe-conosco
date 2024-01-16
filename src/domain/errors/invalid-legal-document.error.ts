export class InvalidLegalDocumentError extends Error {
  statusCode = 400

  constructor () {
    super('legal document is invalid')
    this.name = 'InvalidLegalDocumentError'
  }
}
