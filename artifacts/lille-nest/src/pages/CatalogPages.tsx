import { Link } from "react-router-dom";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { sourcePages } from "@/data/products";
import { CatalogImage } from "@/components/products/CatalogImage";

const CatalogPages = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <header className="border-b border-border bg-secondary/45 py-12 md:py-16">
        <div className="container max-w-5xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Imported content
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground md:text-5xl">
            Catalog Pages
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Browse the editorial and information pages included with the product catalog.
          </p>
        </div>
      </header>

      <section className="container max-w-5xl py-10 md:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sourcePages.map((page) => (
            <Link
              key={page.slug}
              to={`/pages/${page.slug}`}
              className="group rounded-[1.1rem] border border-border/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {page.images[0] && (
                <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-[1.05rem]">
                  <CatalogImage src={page.images[0]} alt="" className="aspect-[1.65] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
              )}
              <h2 className="font-display text-xl font-medium text-foreground group-hover:text-primary">
                {page.title}
              </h2>
              {page.description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{page.description}</p>}
            </Link>
          ))}
        </div>
      </section>
    </main>
    <Footer />
    <CartSidebar />
  </div>
);

export default CatalogPages;