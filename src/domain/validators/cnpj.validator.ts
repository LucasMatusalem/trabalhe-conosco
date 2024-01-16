export default class Cnpj {
  static DIGIT_1_FACTOR = 5
  static DIGIT_2_FACTOR = 6

  static validate (cnpj: string): boolean {
    if (!this.isValidLength(cnpj)) return false
    if (this.allDigitsTheSame(cnpj)) return false
    const digit1 = this.calculateDigit(cnpj, this.DIGIT_1_FACTOR)
    const digit2 = this.calculateDigit(cnpj, this.DIGIT_2_FACTOR)
    const checkDigit = this.extractCheckDigit(cnpj)
    const calculatedCheckDigit = `${digit1}${digit2}`
    return checkDigit === calculatedCheckDigit
  }

  private static isValidLength (cnpj: string): boolean {
    return cnpj.length === 14
  }

  private static allDigitsTheSame (cnpj: string): boolean {
    const [firstDigit] = cnpj
    return [...cnpj].every(digit => digit === firstDigit)
  }

  static calculateDigit (cnpj: string, factor: number): number {
    let total = 0
    let alreadyRestartFactor = false
    for (const digit of cnpj) {
      if (factor === 1 && !alreadyRestartFactor) {
        factor = 9
        alreadyRestartFactor = true
      }
      if (factor > 1) {
        total += parseInt(digit) * factor--
      }
    }
    const rest = total % 11
    return (rest < 2) ? 0 : 11 - rest
  }

  private static extractCheckDigit (cnpj: string): string {
    return cnpj.slice(-2)
  }
}
