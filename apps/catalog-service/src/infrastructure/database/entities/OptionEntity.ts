import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { CarEntity } from './CarEntity';

@Entity('options')
export class OptionEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  carId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @Column('decimal', { precision: 10, scale: 2 })
  additionalPrice!: number;

  @ManyToOne(() => CarEntity, (car) => car.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car!: CarEntity;
}
