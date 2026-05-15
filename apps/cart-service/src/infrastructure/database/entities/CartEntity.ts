import { Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { CartItemEntity } from './CartItemEntity';

@Entity('carts')
export class CartEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => CartItemEntity, (item) => item.cart, { cascade: true, eager: true, orphanedRowAction: 'delete' })
  items!: CartItemEntity[];
}
