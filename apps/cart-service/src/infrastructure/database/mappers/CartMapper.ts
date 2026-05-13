import { Cart } from '../../../domain/entities/Cart';
import { CartItem } from '../../../domain/entities/CartItem';
import { CartEntity } from '../entities/CartEntity';
import { CartItemEntity } from '../entities/CartItemEntity';

export class CartMapper {
  static itemToDomain(entity: CartItemEntity): CartItem {
    return new CartItem({
      id: entity.id,
      carId: entity.carId,
      carSnapshot: entity.carSnapshot,
      selectedOptions: entity.selectedOptions,
      totalPrice: Number(entity.totalPrice),
      quantity: entity.quantity,
    });
  }

  static toDomain(entity: CartEntity): Cart {
    return new Cart({
      userId: entity.userId,
      items: (entity.items ?? []).map(CartMapper.itemToDomain),
      updatedAt: entity.updatedAt,
    });
  }

  static itemToEntity(item: CartItem, cartUserId: string): CartItemEntity {
    const entity = new CartItemEntity();
    entity.id = item.id;
    entity.carId = item.carId;
    entity.carSnapshot = item.carSnapshot;
    entity.selectedOptions = item.selectedOptions;
    entity.totalPrice = item.totalPrice;
    entity.quantity = item.quantity;
    entity.cartUserId = cartUserId;
    return entity;
  }

  static toEntity(cart: Cart): CartEntity {
    const entity = new CartEntity();
    entity.userId = cart.userId;
    entity.updatedAt = cart.updatedAt;
    entity.items = cart.items.map((item) => CartMapper.itemToEntity(item, cart.userId));
    return entity;
  }
}
