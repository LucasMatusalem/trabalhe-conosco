import Cnpj from '@/domain/validators/cnpj.validator'

describe('CnpjValidator', () => {
  let validCnpj: string

  beforeAll(() => {
    validCnpj = '21286582000194'
  })
  it('should return true on a valid cnpj', () => {
    const sut = Cnpj.validate(validCnpj)

    expect(sut).toBe(true)
  })

  it('should return true on a valid cnpj with rest < 2 on calculateDigit', () => {
    const validCnpj = '15879434000180'

    const sut = Cnpj.validate(validCnpj)

    expect(sut).toBe(true)
  })

  it('should return false if not valid length', () => {
    const invalidCnpj = validCnpj.slice(0, 12)

    const sut = Cnpj.validate(invalidCnpj)

    expect(sut).toBe(false)
  })

  it('should return false if all digits is same', () => {
    const invalidCnpj = '11111111111111'

    const sut = Cnpj.validate(invalidCnpj)

    expect(sut).toBe(false)
  })

  it('should return false if check digits is incorrect', () => {
    const invalidCnpj = '21286582000111'

    const sut = Cnpj.validate(invalidCnpj)

    expect(sut).toBe(false)
  })
})
