export class OrderNotFoundError extends Error {
  constructor(id: string) {
    super(`Order not found: ${id}`);
    this.name = 'OrderNotFoundError';
  }
}

export class CartEmptyError extends Error {
  constructor(userId: string) {
    super(`Cart is empty for user: ${userId}`);
    this.name = 'CartEmptyError';
  }
}

export class UnauthorizedOrderAccessError extends Error {
  constructor() {
    super('Access to this order is not authorized');
    this.name = 'UnauthorizedOrderAccessError';
  }
}
