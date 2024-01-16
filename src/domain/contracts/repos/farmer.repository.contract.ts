import { type FarmerDTO } from '../dtos/farmer.dto'

export interface SaveFarmer {
  save: (input: SaveFarmer.Input) => Promise<SaveFarmer.Output>
}

export namespace SaveFarmer {
  export type Input = Partial<FarmerDTO>
  export type Output = {
    id: string
  }
}

export interface LoadFarmer {
  load: (input: LoadFarmer.Input) => Promise<LoadFarmer.Output>
}

export namespace LoadFarmer {
  export type Input = {
    id?: string
    legalDocument?: string
  }

  export type Output = undefined | Required<FarmerDTO>
}

export interface DeleteFarmer {
  delete: (input: DeleteFarmer.Input) => Promise<DeleteFarmer.Output>
}

export namespace DeleteFarmer {
  export type Input = {
    id: string
  }

  export type Output = undefined
}

export interface FarmerDashboard {
  landUseChart: () => Promise<FarmerDashboard.landUseChartOutput>
  stateChart: () => Promise<FarmerDashboard.stateChartOutput>
  cropsChart: () => Promise<FarmerDashboard.cropsChartOutput>
  getTotals: () => Promise<FarmerDashboard.totalsOutput>
}

export namespace FarmerDashboard {
  export type landUseChartOutput = Array<{
    label: string
    labelTotal: number
    percentTotal: number
    totalFarmsArea: number
  }>
  export type stateChartOutput = Array<{
    state: string
    stateRawTotal: number
    percentTotal: number
    rawTotal: number
  }>
  export type cropsChartOutput = Array<{
    label: string
    labelTotal: number
    percentTotal: number
  }>
  export type totalsOutput = {
    totalFarms: number
    totalFarmsArea: number
  }
}
