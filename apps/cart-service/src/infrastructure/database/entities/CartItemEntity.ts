import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartEntity } from './CartEntity';
import { CarSnapshot } from '../../../domain/value-objects/CarSnapshot';
import { SelectedOptionSnapshot } from '../../../domain/value-objects/SelectedOptionSnapshot';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  carId!: string;

  @Column({ type: 'json' })
  carSnapshot!: CarSnapshot;

  @Column({ type: 'json' })
  selectedOptions!: SelectedOptionSnapshot[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;

  @Column('int')
  quantity!: number;

  @Column('uuid')
  cartUserId!: string;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartUserId' })
  cart!: CartEntity;
}
