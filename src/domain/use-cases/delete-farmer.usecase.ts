import { type DeleteFarmer, type LoadFarmer } from '../contracts/repos/farmer.repository.contract'
import { NotFoundError } from '../errors/not-found.error'

export class DeleteFarmerUseCase {
  constructor (
    private readonly farmerRepository: LoadFarmer & DeleteFarmer
  ) {}

  async execute (data: DeleteFarmerUseCase.Input): Promise<DeleteFarmerUseCase.Output> {
    const farmerExists = await this.farmerRepository.load({ id: data.id })
    if (!farmerExists) throw new NotFoundError()
    await this.farmerRepository.delete({ id: farmerExists.id })
  }
}

export namespace DeleteFarmerUseCase {
  export type Input = {
    id: string
  }
  export type Output = undefined
}
