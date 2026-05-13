import { CartView } from '../features/Cart/CartView';

export default function CartPage(): JSX.Element {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon panier</h1>
      <CartView />
    </main>
  );
}
