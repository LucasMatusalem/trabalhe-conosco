import { type FarmerDTO } from '@/domain/contracts/dtos/farmer.dto'
import { type DeleteFarmer, type LoadFarmer } from '@/domain/contracts/repos/farmer.repository.contract'
import { NotFoundError } from '@/domain/errors/not-found.error'
import { DeleteFarmerUseCase } from '@/domain/use-cases/delete-farmer.usecase'
import { anyFarmer } from '@/tests/mocks/farmer.mock'
import { mock, type MockProxy } from 'jest-mock-extended'

describe('DeleteFarmerUseCase', () => {
  let sut: DeleteFarmerUseCase
  let farmerRepository: MockProxy<LoadFarmer & DeleteFarmer>
  let farmer: Required<FarmerDTO>

  beforeAll(() => {
    farmer = {
      id: 'any_id',
      ...anyFarmer
    }
  })

  beforeEach(() => {
    farmerRepository = mock()
    sut = new DeleteFarmerUseCase(farmerRepository)
  })

  it('should execute FarmerRepository.delete if farmer is found', async () => {
    farmerRepository.load.mockResolvedValueOnce(farmer)

    await sut.execute({ id: farmer.id })

    expect(farmerRepository.load).toHaveBeenCalledTimes(1)
    expect(farmerRepository.delete).toHaveBeenCalledTimes(1)
  })

  it('should throw NotFoundError if farmer is not found', async () => {
    farmerRepository.load.mockResolvedValueOnce(undefined)

    const promise = sut.execute({ id: 'not_found_id' })

    expect(farmerRepository.load).toHaveBeenCalledTimes(1)
    await expect(promise).rejects.toThrow(new NotFoundError())
  })
})
