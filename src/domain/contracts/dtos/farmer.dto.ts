export type FarmerDTO = {
  id?: string
  name: string
  legalDocumentType: string
  legalDocumentValue: string
  farmName: string
  farmCity: string
  farmState: string
  farmTotalArea: number
  farmArableArea: number
  farmVegetationArea: number
  farmCrops: string[]
}
