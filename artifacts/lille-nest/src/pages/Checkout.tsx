import { Link } from "react-router-dom";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/data/format-money";

const Checkout = () => {
  const { items, subtotal } = useCart();
  const currency = items[0]?.product.currency ?? "SAR";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Jacadi Paris
          </p>
          <h1 className="font-display text-3xl text-foreground md:text-5xl">
            Continue on Jacadi
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            This catalogue preview does not place orders or collect personal or
            payment details. Your shortlist and selected sizes are not transferred
            to Jacadi.sa. Open each product there to check its current information
            and ordering options.
          </p>

          {items.length === 0 ? (
            <section className="mt-10 border border-border bg-card px-6 py-10 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-4 font-display text-2xl text-foreground">
                Your shortlist is empty
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse the collection and add products to your shortlist.
              </p>
              <Button asChild className="mt-6">
                <Link to="/products">Browse products</Link>
              </Button>
            </section>
          ) : (
            <div className="mt-10">
              <div className="divide-y divide-border border-y border-border">
                {items.map(({ product, quantity, selectedSize }) => (
                  <article
                    key={`${product.id}-${selectedSize ?? "one-size"}`}
                    className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h2 className="font-display text-xl text-foreground">
                        {product.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Quantity: {quantity}
                        {selectedSize ? ` · Size: ${selectedSize}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-foreground">
                        {formatMoney(product.price * quantity, product.currency)}
                      </p>
                    </div>
                    {product.sourceUrl ? (
                      <a
                        href={product.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-primary px-4 text-xs font-medium uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        View on Jacadi.sa <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Product link unavailable
                      </span>
                    )}
                  </article>
                ))}
              </div>

              <div className="mt-6 flex justify-between border-b border-border pb-5 text-sm">
                <span>Catalogue subtotal</span>
                <span className="font-medium">{formatMoney(subtotal, currency)}</span>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                This subtotal is for reference only; availability, final pricing,
                delivery, and payment are confirmed by Jacadi.
              </p>
              <Button asChild variant="outline" className="mt-7">
                <Link to="/cart">Back to your shortlist</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Checkout;