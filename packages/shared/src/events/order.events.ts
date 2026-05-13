export const ORDER_EVENTS = {
  CREATED: 'order.created',
} as const;

export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  totalAmount: number;
}
