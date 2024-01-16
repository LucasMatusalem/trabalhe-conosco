import './config/module-alias'
import 'reflect-metadata'
import { app } from '@/main/app'
import { env } from '@/main/config'
import { setupDataSource } from '@/infra/repositories/data-source'
import { type DataSource } from 'typeorm'

export let datasource: DataSource

async function main (): Promise<void> {
  datasource = await setupDataSource()
  app.listen(env.port, () => { console.log(`Server running at ${env.port}`) })
}

main().catch(error => { console.error(error) })
