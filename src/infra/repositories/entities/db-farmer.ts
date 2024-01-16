import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { ColumnNumericTransformer } from '../helpers/column-numeric-transformer'

@Entity({ name: 'farmers' })
export class DbFarmer {
  @PrimaryGeneratedColumn('uuid')
    id!: string

  @Column({ type: 'varchar' })
    name!: string

  @Column({ type: 'varchar' })
    legal_document_value!: string

  @Column({ type: 'varchar' })
    legal_document_type!: string

  @Column({ type: 'varchar' })
    farm_name!: string

  @Column({ type: 'varchar' })
    farm_city!: string

  @Column({ type: 'varchar' })
    farm_state!: string

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
    farm_total_area!: number

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
    farm_arable_area!: number

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
    farm_vegetation_area!: number

  @Column({ type: 'varchar', array: true })
    farm_crops!: string[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at!: Date
}
