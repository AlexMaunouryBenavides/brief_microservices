import { OrderList } from '../features/Orders/OrderList';

export default function OrdersPage(): JSX.Element {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
      <OrderList />
    </main>
  );
}
