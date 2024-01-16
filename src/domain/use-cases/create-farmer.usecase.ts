import { type FarmerDTO } from '../contracts/dtos/farmer.dto'
import { type LoadFarmer, type SaveFarmer } from '../contracts/repos/farmer.repository.contract'
import { Farmer } from '../entities/farmer.entity'
import { AlreadyExistsError } from '../errors/already-exists.error'

export class CreateFarmerUseCase {
  constructor (
    private readonly farmerRepository: LoadFarmer & SaveFarmer
  ) {}

  async execute (data: CreateFarmerUseCase.Input): Promise<CreateFarmerUseCase.Output> {
    const farmer = new Farmer(data)
    const farmerAlreadyExists = await this.farmerRepository.load({ legalDocument: farmer.data.legalDocumentValue })
    if (farmerAlreadyExists) throw new AlreadyExistsError('legalDocument')
    const { id } = await this.farmerRepository.save(farmer.data)
    return {
      id
    }
  }
}

export namespace CreateFarmerUseCase {
  export type Input = Omit<FarmerDTO, 'id'>
  export type Output = {
    id: string
  }
}
