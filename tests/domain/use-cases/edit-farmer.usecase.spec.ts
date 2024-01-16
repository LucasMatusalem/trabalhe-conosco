import { type FarmerDTO } from '@/domain/contracts/dtos/farmer.dto'
import { type LoadFarmer, type SaveFarmer } from '@/domain/contracts/repos/farmer.repository.contract'
import { Farmer } from '@/domain/entities/farmer.entity'
import { NotFoundError } from '@/domain/errors/not-found.error'
import { EditFarmerUseCase } from '@/domain/use-cases/edit-farmer.usecase'
import { anyFarmer } from '@/tests/mocks/farmer.mock'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/farmer.entity')
const mockUpdate = jest.fn()
const mockValidate = jest.fn()

describe('EditFarmerUseCase', () => {
  let sut: EditFarmerUseCase
  let farmerRepository: MockProxy<LoadFarmer & SaveFarmer>
  let farmer: Omit<FarmerDTO, 'id'>
  let id: string

  beforeEach(() => {
    id = 'any_id'
    farmer = {
      ...anyFarmer
    }
    farmerRepository = mock()
    farmerRepository.load.mockResolvedValue({
      id,
      ...farmer
    })
    sut = new EditFarmerUseCase(farmerRepository)
  })

  it('should throw NotFoundError if farmer does not exists', async () => {
    farmerRepository.load.mockResolvedValueOnce(undefined)

    const promise = sut.execute({
      id,
      data: {
        ...farmer
      }
    })

    await expect(promise).rejects.toThrow(new NotFoundError())
  })

  it('should rethrow if new Farmer throws', async () => {
    const error = new Error('farmer_error')
    jest.mocked(Farmer).mockImplementationOnce(jest.fn(() => { throw error }))

    const promise = sut.execute({
      id,
      data: {
        ...farmer
      }
    })

    await expect(promise).rejects.toThrow(error)
  })

  it('should call update function if data is provided', async () => {
    jest.mocked(Farmer).mockImplementationOnce(jest.fn().mockImplementation(() => {
      return {
        validate: mockValidate,
        update: mockUpdate
      }
    }))
    await sut.execute({
      id,
      data: {
        ...farmer
      }
    })

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(farmerRepository.load).toHaveBeenCalledTimes(1)
    expect(farmerRepository.save).toHaveBeenCalledTimes(1)
  })
})
