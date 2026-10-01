import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/data/products";
import { CatalogImage } from "@/components/products/CatalogImage";

const Cart = () => {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const currency = items[0]?.product.currency ?? "SAR";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-10 md:py-16">
        <div className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Jacadi Paris
          </p>
          <h1 className="font-display text-3xl text-foreground md:text-5xl">
            Your shortlist
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Items are held here for browsing only. This catalogue does not reserve
            products or process orders, payments, or delivery.
          </p>
        </div>

        {items.length === 0 ? (
          <section className="border border-border bg-card px-6 py-12 text-center md:py-16">
            <h2 className="font-display text-2xl text-foreground">Your shortlist is empty</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Explore the imported Jacadi collection and add pieces to compare.
            </p>
            <Button asChild className="mt-6">
              <Link to="/products">Explore the collection</Link>
            </Button>
          </section>
        ) : (
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_340px]">
            <section className="space-y-4" aria-label="Shortlisted products">
              {items.map(({ product, quantity, selectedSize }) => (
                <article
                  key={`${product.id}-${selectedSize ?? "one-size"}`}
                  className="flex gap-4 border-b border-border py-5 sm:gap-6"
                >
                  <div className="h-32 w-28 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-36 sm:w-32">
                    <CatalogImage src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${product.slug}`}
                      className="font-display text-lg text-foreground hover:text-primary"
                    >
                      {product.title}
                    </Link>
                    {selectedSize && (
                      <p className="mt-1 text-sm text-muted-foreground">Size: {selectedSize}</p>
                    )}
                    <p className="mt-2 text-sm text-foreground">
                      {formatMoney(product.price, product.currency)}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center border border-border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          aria-label={`Decrease quantity of ${product.title}`}
                          onClick={() => updateQuantity(product.id, quantity - 1, selectedSize)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="min-w-8 text-center text-sm" aria-live="polite">
                          {quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          aria-label={`Increase quantity of ${product.title}`}
                          onClick={() => updateQuantity(product.id, quantity + 1, selectedSize)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => removeItem(product.id, selectedSize)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="border border-border bg-card p-6">
              <h2 className="font-display text-xl text-foreground">Shortlist summary</h2>
              <div className="mt-6 flex justify-between gap-4 border-t border-border pt-5 text-sm">
                <span>Items subtotal</span>
                <span className="font-medium">{formatMoney(subtotal, currency)}</span>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Prices and availability may change. Check each product on Jacadi.sa
                for current details and ordering options.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/checkout">
                  View Jacadi product links <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full">
                <Link to="/products">Continue browsing</Link>
              </Button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Cart;