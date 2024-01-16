import { type FarmerDashboard, type DeleteFarmer, type LoadFarmer, type SaveFarmer } from '@/domain/contracts/repos/farmer.repository.contract'
import { datasource } from '@/main/index'
import { DbFarmer } from '@/infra/repositories/entities/db-farmer'

export class FarmerRepository implements LoadFarmer, SaveFarmer, DeleteFarmer, FarmerDashboard {
  async load (input: LoadFarmer.Input): Promise<LoadFarmer.Output> {
    const dbFarmer = datasource.getRepository(DbFarmer)
    const where = input.id
      ? {
          id: input.id
        }
      : {
          legal_document_value: input.legalDocument
        }

    const data = await dbFarmer.findOne({ where })
    return data
      ? {
          id: data.id,
          name: data.name,
          legalDocumentValue: data.legal_document_value,
          legalDocumentType: data.legal_document_type,
          farmName: data.farm_name,
          farmCity: data.farm_city,
          farmState: data.farm_state,
          farmTotalArea: data.farm_total_area,
          farmArableArea: data.farm_arable_area,
          farmVegetationArea: data.farm_vegetation_area,
          farmCrops: data.farm_crops
        }
      : undefined
  }

  async save (data: SaveFarmer.Input): Promise<SaveFarmer.Output> {
    const dbFarmer = datasource.getRepository(DbFarmer)
    const responseDb = await dbFarmer.upsert({
      id: data.id,
      name: data.name,
      legal_document_value: data.legalDocumentValue,
      legal_document_type: data.legalDocumentType,
      farm_name: data.farmName,
      farm_city: data.farmCity,
      farm_state: data.farmState,
      farm_total_area: data.farmTotalArea,
      farm_arable_area: data.farmArableArea,
      farm_vegetation_area: data.farmVegetationArea,
      farm_crops: data.farmCrops
    }, {
      upsertType: 'on-conflict-do-update',
      conflictPaths: {
        id: true
      },
      skipUpdateIfNoValuesChanged: true
    })
    return {
      id: responseDb.identifiers[0].id
    }
  }

  async delete (input: DeleteFarmer.Input): Promise<undefined> {
    const dbFarmer = datasource.getRepository(DbFarmer)
    await dbFarmer.delete(input.id)
  }

  async cropsChart (): Promise<FarmerDashboard.cropsChartOutput> {
    const cropsChartQuery = `
    WITH crops_totals AS (
      SELECT
        crop,
        COUNT(*) AS cropCount
      FROM
        farmers,
        UNNEST("farm_crops") AS crop
      GROUP BY
        crop
    )

    SELECT
      crop_totals.crop AS label,
      crop_totals.cropCount AS "rawTotal",
      ROUND(crop_totals.cropCount * 100.0 / sum(crop_totals.cropCount) OVER (), 2) AS "percentTotal"
    FROM
      crops_totals crop_totals;
    `
    const dbFarmer = datasource.getRepository(DbFarmer)
    const cropsChartRes = await dbFarmer.query(cropsChartQuery)
    return cropsChartRes
  }

  async landUseChart (): Promise<FarmerDashboard.landUseChartOutput> {
    const landUseChartQuery = `
    WITH "land_use_totals" AS (
      SELECT
        SUM("farm_total_area") AS "totalFarmsArea",
        SUM("farm_arable_area") AS "arableArea",
        SUM("farm_vegetation_area") AS "vegetationArea"
      FROM
        "farmers"
    )

    SELECT
      "label",
      "labelTotal",
      ROUND("labelTotal" * 100.0 / "totalFarmsArea", 2) AS "percentTotal",
      "totalFarmsArea"
    FROM (
      SELECT 'arableArea' AS "label", "arableArea" AS "labelTotal", "totalFarmsArea" FROM "land_use_totals"
      UNION ALL
      SELECT 'vegetationArea' AS "label", "vegetationArea" AS "labelTotal", "totalFarmsArea" FROM "land_use_totals"
    ) AS "land_use";
    `
    const dbFarmer = datasource.getRepository(DbFarmer)
    const landUseChartRes = await dbFarmer.query(landUseChartQuery)
    return landUseChartRes
  }

  async stateChart (): Promise<FarmerDashboard.stateChartOutput> {
    const stateChartQuery = `
    WITH state_raw_totals AS (
      SELECT
        farm_state,
        COUNT(*) AS "stateRawTotal"
      FROM
        farmers
      GROUP BY
        farm_state
    )

    SELECT
      state_totals.farm_state AS label,
      state_totals."stateRawTotal",
      ROUND(state_totals."stateRawTotal" * 100.0 / total.total, 2) AS "percentTotal",
      total.total as "rawTotal"
    FROM
      state_raw_totals state_totals
    JOIN
      (
        SELECT COUNT(*) AS total FROM farmers
      ) total
    ON
      true;
    `
    const dbFarmer = datasource.getRepository(DbFarmer)
    const stateChartRes = await dbFarmer.query(stateChartQuery)
    return stateChartRes
  }

  async getTotals (): Promise<FarmerDashboard.totalsOutput> {
    const totalsQuery = `
    SELECT
      COUNT(DISTINCT id) AS "totalFarms",
      SUM(farm_total_area) AS "totalFarmsArea"
    FROM
      farmers;
    `
    const dbFarmer = datasource.getRepository(DbFarmer)
    const dbResponse = await dbFarmer.query(totalsQuery) as {
      totalFarms: number
      totalFarmsArea: number
    }
    return dbResponse
  }
}
