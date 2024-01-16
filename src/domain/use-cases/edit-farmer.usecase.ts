import { type FarmerDTO } from '../contracts/dtos/farmer.dto'
import { type SaveFarmer, type LoadFarmer } from '../contracts/repos/farmer.repository.contract'
import { Farmer } from '../entities/farmer.entity'
import { NotFoundError } from '../errors/not-found.error'

export class EditFarmerUseCase {
  constructor (
    private readonly farmerRepository: LoadFarmer & SaveFarmer
  ) {}

  async execute (data: EditFarmerUseCase.Input): Promise<EditFarmerUseCase.Output> {
    const farmerExists = await this.farmerRepository.load({ id: data.id })
    if (!farmerExists) throw new NotFoundError()
    const farmer = new Farmer(farmerExists)
    farmer.update(data.data)
    await this.farmerRepository.save(farmer.data)
  }
}

export namespace EditFarmerUseCase {
  export type Input = { id: string, data: Partial<FarmerDTO> }
  export type Output = undefined
}
