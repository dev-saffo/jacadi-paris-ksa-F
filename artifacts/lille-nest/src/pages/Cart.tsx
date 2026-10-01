import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, X, Tag, Truck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CatalogImage } from '@/components/products/CatalogImage';
import { formatMoney } from '@/data/products';

const Cart = () => {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const currency = items[0]?.product.currency ?? 'SAR';
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      toast.success('Promo code applied! 10% off your order.');
    } else {
      toast.error('Invalid promo code');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />
        </div>

        <section className="container py-8">
          <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-6xl block mb-4">🛒</span>
              <h2 className="font-display text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Discover our wonderful collection!
              </p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(({ product, quantity, selectedSize }) => (
                  <div
                    key={`${product.id}-${selectedSize ?? 'one-size'}`}
                    className="bg-card rounded p-4 shadow-soft flex gap-4"
                  >
                    <Link to={`/products/${product.slug}`} className="flex-shrink-0">
                      <CatalogImage
                        src={product.images[0]}
                        alt={product.title}
                        className="h-24 w-24 rounded object-cover md:h-32 md:w-32"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          to={`/products/${product.slug}`}
                          className="font-display font-semibold hover:text-primary transition-colors"
                        >
                          {product.title}
                        </Link>
                        <button
                          onClick={() => removeItem(product.id, selectedSize)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      {selectedSize && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Size: {selectedSize}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(product.id, quantity - 1, selectedSize)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(product.id, quantity + 1, selectedSize)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-display text-lg font-bold">
                          {formatMoney(product.price * quantity, product.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded p-6 shadow-soft sticky top-24">
                  <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                  {/* Promo code */}
                  <div className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button variant="outline" onClick={handleApplyPromo}>
                      Apply
                    </Button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatMoney(subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : formatMoney(shipping, currency)}</span>
                    </div>
                    {subtotal < 50 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded p-3">
                        <Truck className="h-4 w-4" />
                        <span>Add {formatMoney(300 - subtotal, currency)} for free shipping!</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-display font-bold text-lg">Total</span>
                      <span className="font-display text-lg font-bold">{formatMoney(total, currency)}</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full mb-3" asChild>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Cart;
