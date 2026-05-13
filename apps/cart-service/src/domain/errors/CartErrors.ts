export class CartItemNotFoundError extends Error {
  constructor(itemId: string) {
    super(`Cart item not found: ${itemId}`);
    this.name = 'CartItemNotFoundError';
  }
}

export class CatalogServiceError extends Error {
  constructor(message: string) {
    super(`Catalog service error: ${message}`);
    this.name = 'CatalogServiceError';
  }
}
