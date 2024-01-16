import { type FarmerDTO } from '@/domain/contracts/dtos/farmer.dto'
import { type LoadFarmer, type SaveFarmer } from '@/domain/contracts/repos/farmer.repository.contract'
import { Farmer } from '@/domain/entities/farmer.entity'
import { AlreadyExistsError } from '@/domain/errors/already-exists.error'
import { CreateFarmerUseCase } from '@/domain/use-cases/create-farmer.usecase'
import { anyFarmer } from '@/tests/mocks/farmer.mock'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/farmer.entity')
describe('CreateFarmerUseCase', () => {
  let sut: CreateFarmerUseCase
  let farmerRepository: MockProxy<LoadFarmer & SaveFarmer>
  let farmer: FarmerDTO

  beforeEach(() => {
    farmer = {
      ...anyFarmer
    }
    const farmerStub = jest.fn().mockImplementation(() => ({
      data: farmer
    }))
    jest.mocked(Farmer).mockImplementation(farmerStub)
    farmerRepository = mock()
    sut = new CreateFarmerUseCase(farmerRepository)
  })

  it('should rethrow if new Farmer throws', async () => {
    const error = new Error('farmer_error')
    jest.mocked(Farmer).mockImplementationOnce(() => { throw error })

    const promise = sut.execute(farmer)

    await expect(promise).rejects.toThrow(error)
  })

  it('should throw AlreadyExistError if some farmer exists with same legalDocument', async () => {
    farmerRepository.load.mockResolvedValueOnce({
      ...farmer,
      id: 'any_id'
    })

    const promise = sut.execute(farmer)

    await expect(promise).rejects.toThrow(new AlreadyExistsError('legalDocument'))
  })

  it('should return id from FarmerRepository save', async () => {
    farmerRepository.save.mockResolvedValueOnce({ id: 'any_id' })

    const { id } = await sut.execute(farmer)

    expect(id).toEqual('any_id')
    expect(farmerRepository.load).toHaveBeenCalledTimes(1)
    expect(farmerRepository.save).toHaveBeenCalledTimes(1)
  })
})
