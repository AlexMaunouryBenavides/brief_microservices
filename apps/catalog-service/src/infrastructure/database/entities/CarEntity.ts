import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OptionEntity } from './OptionEntity';

@Entity('cars')
export class CarEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column('int')
  year!: number;

  @Column('int')
  rangeKm!: number;

  @Column('int')
  powerKw!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice!: number;

  @Column({ nullable: true, type: 'varchar' })
  imageUrl!: string | null;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @OneToMany(() => OptionEntity, (option) => option.car, { cascade: true, eager: true })
  options!: OptionEntity[];
}
