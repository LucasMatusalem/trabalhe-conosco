export default class Cpf {
  static DIGIT_1_FACTOR = 10
  static DIGIT_2_FACTOR = 11

  static validate (cpf: string): boolean {
    if (!this.isValidLength(cpf)) return false
    if (this.allDigitsTheSame(cpf)) return false
    const digit1 = this.calculateDigit(cpf, this.DIGIT_1_FACTOR)
    const digit2 = this.calculateDigit(cpf, this.DIGIT_2_FACTOR)
    const checkDigit = this.extractCheckDigit(cpf)
    const calculatedCheckDigit = `${digit1}${digit2}`
    return checkDigit === calculatedCheckDigit
  }

  private static isValidLength (cpf: string): boolean {
    return cpf.length === 11
  }

  private static allDigitsTheSame (cpf: string): boolean {
    const [firstDigit] = cpf
    return [...cpf].every(digit => digit === firstDigit)
  }

  private static calculateDigit (cpf: string, factor: number): number {
    let total = 0
    for (const digit of cpf) {
      if (factor > 1) {
        total += parseInt(digit) * factor--
      }
    }
    const rest = total % 11
    return (rest < 2) ? 0 : 11 - rest
  }

  private static extractCheckDigit (cpf: string): string {
    return cpf.slice(-2)
  }
}
