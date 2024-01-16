import { randomUUID } from 'crypto'
import { type FarmerDTO } from '../contracts/dtos/farmer.dto'
import { DuplicatedCropsError } from '../errors/duplicated-crops.error'
import { InvalidAreaError } from '../errors/invalid-area.error'
import { InvalidLegalDocumentError } from '../errors/invalid-legal-document.error'
import Cnpj from '../validators/cnpj.validator'
import Cpf from '../validators/cpf.validator'

export class Farmer {
  data: FarmerDTO

  constructor (data: FarmerDTO) {
    this.validate(data)
    this.data = {
      id: randomUUID(),
      ...data
    }
  }

  private validate (data: FarmerDTO): void {
    const sumOfAreas = data.farmArableArea + data.farmVegetationArea
    if (data.farmTotalArea < sumOfAreas) throw new InvalidAreaError()
    const hasDuplicatedCrops = (new Set(data.farmCrops)).size !== data.farmCrops.length
    if (hasDuplicatedCrops) throw new DuplicatedCropsError()
    const documentIsValid = data.legalDocumentType === 'cpf' ? Cpf.validate(data.legalDocumentValue) : Cnpj.validate(data.legalDocumentValue)
    if (!documentIsValid) throw new InvalidLegalDocumentError()
  }

  update (params: Partial<Omit<FarmerDTO, 'id'>>): void {
    this.data = {
      ...this.data,
      ...params
    }
  }
}
