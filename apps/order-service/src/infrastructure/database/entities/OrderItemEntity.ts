import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './OrderEntity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  order!: OrderEntity;

  @Column('uuid')
  carId!: string;

  @Column('json')
  carSnapshot!: { brand: string; model: string; basePrice: number };

  @Column('json')
  selectedOptions!: { id: string; name: string; additionalPrice: number }[];

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column('int')
  quantity!: number;
}
