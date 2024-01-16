import { DataSource } from 'typeorm'
import { DbFarmer } from './entities/db-farmer'

export async function setupDataSource (): Promise<DataSource> {
  const datasource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [DbFarmer],
    port: Number(process.env.DB_PORT)
  })
  await datasource.initialize()
  return datasource
}
