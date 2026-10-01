import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/products/ProductImage';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function CartSidebar() {
  const { items, isOpen, closeCart, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display font-bold text-lg">Your Cart</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4">🛒</span>
              <h3 className="font-display font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Discover our wonderful collection of toys, clothes, and books!
              </p>
              <Button onClick={closeCart}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-4 p-3 bg-muted rounded animate-fade-in"
                >
                  <div className="h-20 w-20 rounded bg-card overflow-hidden flex-shrink-0">
                    <ProductImage
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-sm truncate">
                      {product.title}
                    </h4>
                    <p className="text-primary font-semibold text-sm mt-1">
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.title} from cart`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display font-bold text-xl">SAR {subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <Button className="w-full" size="lg" asChild>
              <Link to="/checkout">
                Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="ghost" className="w-full mt-2" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
