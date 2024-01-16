import { type FarmerDashboard } from '../contracts/repos/farmer.repository.contract'

export class DashboardUseCase {
  constructor (
    private readonly farmerRepository: FarmerDashboard
  ) {}

  async execute (): Promise<DashboardUseCase.Output> {
    const [stateChartRes, landUseRes, cropsChartRes, totalsRes] = await Promise.all([
      this.farmerRepository.stateChart(),
      this.farmerRepository.landUseChart(),
      this.farmerRepository.cropsChart(),
      this.farmerRepository.getTotals()
    ])

    return {
      cropsPieChart: this.makeCropsChart(cropsChartRes),
      landUsePieChart: this.makeLandUseChart(landUseRes),
      statePieChart: this.makeStateChart(stateChartRes),
      totalFarms: totalsRes.totalFarms,
      totalFarmsArea: totalsRes.totalFarmsArea
    }
  }

  private makeStateChart (chartData: FarmerDashboard.stateChartOutput): pieChart {
    return {
      data: chartData.map(
        item => ({
          label: item.state,
          rawTotal: item.stateRawTotal,
          percentTotal: item.percentTotal
        })
      )
    }
  }

  private makeCropsChart (chartData: FarmerDashboard.cropsChartOutput): pieChart {
    return {
      data: chartData.map(
        item => ({
          label: item.label,
          rawTotal: item.labelTotal,
          percentTotal: item.percentTotal
        })
      )
    }
  }

  private makeLandUseChart (chartData: FarmerDashboard.landUseChartOutput): pieChart {
    return {
      data: chartData.map(
        item => ({
          label: item.label,
          rawTotal: item.labelTotal,
          percentTotal: item.percentTotal
        })
      )
    }
  }
}

type pieChart = {
  data: Array<{ label: string, rawTotal: number, percentTotal: number }>
}

export namespace DashboardUseCase {
  export type Output = {
    totalFarms: number
    totalFarmsArea: number
    statePieChart: pieChart
    cropsPieChart: pieChart
    landUsePieChart: pieChart
  }
}
