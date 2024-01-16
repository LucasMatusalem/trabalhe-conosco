import Cpf from '@/domain/validators/cpf.validator'

describe('CpfValidator', () => {
  let validCpf: string

  beforeAll(() => {
    validCpf = '91935165097'
  })
  it('should return true on a valid cpf', () => {
    const sut = Cpf.validate(validCpf)

    expect(sut).toBe(true)
  })

  it('should return true on a valid cpf with rest < 2 on calculateDigit', () => {
    const validCpf = '60963607006'

    const sut = Cpf.validate(validCpf)

    expect(sut).toBe(true)
  })

  it('should return false if not valid length', () => {
    const invalidCpf = validCpf.slice(0, 9)

    const sut = Cpf.validate(invalidCpf)

    expect(sut).toBe(false)
  })

  it('should return false if all digits is same', () => {
    const invalidCpf = '11111111111'

    const sut = Cpf.validate(invalidCpf)

    expect(sut).toBe(false)
  })

  it('should return false if check digits is incorrect', () => {
    const invalidCpf = '91935165066'

    const sut = Cpf.validate(invalidCpf)

    expect(sut).toBe(false)
  })
})
