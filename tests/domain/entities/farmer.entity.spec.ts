import { type FarmerDTO } from '@/domain/contracts/dtos/farmer.dto'
import { Farmer } from '@/domain/entities/farmer.entity'
import { DuplicatedCropsError } from '@/domain/errors/duplicated-crops.error'
import { InvalidAreaError } from '@/domain/errors/invalid-area.error'
import { InvalidLegalDocumentError } from '@/domain/errors/invalid-legal-document.error'
import Cnpj from '@/domain/validators/cnpj.validator'
import Cpf from '@/domain/validators/cpf.validator'
import { anyFarmer } from '@/tests/mocks/farmer.mock'
jest.mock('@/domain/validators/cpf.validator')
jest.mock('@/domain/validators/cnpj.validator')

describe('Farmer', () => {
  let farmer: FarmerDTO

  beforeEach(() => {
    farmer = {
      ...anyFarmer
    }
    jest.mocked(Cpf).validate.mockReturnValue(true)
    jest.mocked(Cnpj).validate.mockReturnValue(true)
  })
  it('should create farmer with valid cpf', () => {
    farmer.legalDocumentType = 'cpf'

    const sut = new Farmer(farmer)

    expect(sut).toBeDefined()
    expect(Cpf.validate).toHaveBeenCalledTimes(1)
  })

  it('should create farmer with valid cnpj', () => {
    farmer.legalDocumentType = 'cnpj'

    const sut = new Farmer(farmer)

    expect(sut).toBeDefined()
    expect(Cnpj.validate).toHaveBeenCalledTimes(1)
  })

  it('should throw InvalidAreaError if sum of areas is greater than total area', () => {
    let error
    farmer.farmVegetationArea = 1
    farmer.farmArableArea = 2
    farmer.farmTotalArea = 2

    try {
      new Farmer(farmer)
    } catch (thrownError) {
      error = thrownError
    }

    expect(error).toBeInstanceOf(InvalidAreaError)
  })

  it('should throw DuplicatedCropsError if some crop is duplicated', () => {
    let error
    farmer.farmCrops = ['some_crop', 'another_crop', 'some_crop']

    try {
      new Farmer(farmer)
    } catch (thrownError) {
      error = thrownError
    }

    expect(error).toBeInstanceOf(DuplicatedCropsError)
  })

  it('should throw InvalidLegalDocumentError if cpf validator returns false', () => {
    jest.mocked(Cpf).validate.mockReturnValueOnce(false)
    farmer.legalDocumentType = 'cpf'
    let invalidError: unknown

    try {
      new Farmer(farmer)
    } catch (error) {
      invalidError = error
    }

    expect(invalidError).toBeInstanceOf(InvalidLegalDocumentError)
    expect(Cpf.validate).toHaveBeenCalledTimes(1)
  })

  it('should throw InvalidLegalDocumentError if cnpj validator returns false', () => {
    jest.mocked(Cnpj).validate.mockReturnValueOnce(false)
    farmer.legalDocumentType = 'cnpj'
    let invalidError: unknown

    try {
      new Farmer(farmer)
    } catch (error) {
      invalidError = error
    }

    expect(invalidError).toBeInstanceOf(InvalidLegalDocumentError)
    expect(Cnpj.validate).toHaveBeenCalledTimes(1)
  })
})
