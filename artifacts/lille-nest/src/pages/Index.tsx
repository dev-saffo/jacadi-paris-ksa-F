import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { categories, formatMoney, getFeaturedProducts, products, sourcePages } from '@/data/products';
import type { Category, Product } from '@/types/product';

const homePage = sourcePages.find((page) => page.slug === 'home');
const featuredProducts = getFeaturedProducts();
const featuredCategories = categories.slice(0, 4);
const editorialSlugs = ['back-to-school', 'special-occasions-collection', 'newborn-gift', 'the-care-of-fine-materials'];
const editorialPages = editorialSlugs
  .map((slug) => sourcePages.find((page) => page.slug === slug))
  .filter((page): page is (typeof sourcePages)[number] => Boolean(page));

function ProductTile({ product, index }: { product: Product; index: number }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="catalog-card group block"
      data-testid={`card-product-${product.id}`}
    >
      <div className={`collection-tile relative flex aspect-[.78] items-center justify-center overflow-hidden ${index % 2 ? 'bg-[#edf1f4]' : 'bg-[#f4f5f6]'}`}>
        <span className="absolute left-4 top-4 text-[9px] uppercase tracking-[.18em] text-primary/60">
          Jacadi Paris
        </span>
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/10 bg-background/50 transition-transform duration-500 group-hover:scale-105">
          <span className="jacadi-wordmark text-5xl leading-none text-primary/70">J</span>
        </div>
        <span className="absolute bottom-4 right-4 text-[9px] uppercase tracking-[.14em] text-muted-foreground">
          {product.categoryName || 'The collection'}
        </span>
      </div>
      <div className="pt-4">
        <h3 className="line-clamp-2 min-h-12 font-body text-sm font-medium leading-5 text-foreground transition-colors group-hover:text-primary">
          {product.title}
        </h3>
        <p className="mt-2 text-xs tracking-wide text-muted-foreground">{formatMoney(product.price, product.currency)}</p>
      </div>
    </Link>
  );
}

function CollectionLink({ category, index }: { category: Category; index: number }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.slug)}`}
      className="group relative flex min-h-[178px] flex-col justify-between overflow-hidden border border-border bg-card p-5 transition-colors hover:bg-secondary sm:min-h-[215px] sm:p-7"
      data-testid={`card-category-${category.slug}`}
    >
      <span className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">
        {String(index + 1).padStart(2, '0')} / Collection
      </span>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl text-foreground sm:text-[30px]">{category.name}</h3>
          <p className="mt-2 text-xs tracking-wide text-muted-foreground">
            {category.productCount} pieces
          </p>
        </div>
        <span className="mb-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary transition-transform group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <span className="pointer-events-none absolute -right-3 top-4 font-display text-[112px] leading-none text-primary/[.035]">
        {category.name.slice(0, 1)}
      </span>
    </Link>
  );
}

const Index = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="mx-auto grid min-h-[490px] max-w-[1440px] items-center gap-10 px-5 py-16 sm:px-8 md:min-h-[550px] md:grid-cols-[1.12fr_.88fr] md:px-12 md:py-20">
            <div className="relative z-10 max-w-[690px] animate-fade-in">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-9 bg-accent-foreground/60" />
                <p className="text-[10px] font-medium uppercase tracking-[.24em] text-muted-foreground">Jacadi Paris · Saudi Arabia</p>
              </div>
              <h1 className="max-w-[700px] text-[42px] leading-[1.12] text-primary sm:text-5xl md:text-[62px]">
                Baby, toddler and children clothes, shoes and accessories
              </h1>
              <p className="mt-7 max-w-[510px] text-[15px] leading-7 text-muted-foreground">
                {homePage?.description}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  to="/products"
                  className="inline-flex min-h-12 items-center gap-5 bg-primary px-6 text-[11px] font-medium uppercase tracking-[.14em] text-primary-foreground transition-colors hover:bg-primary/90"
                  data-testid="link-shop-all"
                >
                  Explore collections <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/pages/our-story" className="text-link-underline text-xs font-medium text-primary" data-testid="link-our-story">
                  Discover Jacadi
                </Link>
              </div>
            </div>
            <div className="relative hidden h-[370px] items-center justify-center md:flex">
              <div className="absolute right-[10%] top-1/2 h-[330px] w-[330px] -translate-y-1/2 rounded-full border border-primary/10" />
              <div className="absolute right-[16%] top-1/2 h-[270px] w-[270px] -translate-y-1/2 rounded-full border border-primary/[.07]" />
              <div className="relative flex h-[235px] w-[235px] items-center justify-center rounded-full bg-secondary/75">
                <div className="flex h-[205px] w-[205px] flex-col items-center justify-center rounded-full border border-primary/15">
                  <span className="jacadi-wordmark text-[92px] leading-[.74] text-primary">Jacadi</span>
                  <span className="mt-4 text-[9px] tracking-[.48em] text-muted-foreground">PARIS</span>
                </div>
              </div>
              <span className="absolute bottom-5 left-10 max-w-[145px] text-[10px] uppercase leading-5 tracking-[.18em] text-muted-foreground">
                {products.length} products in the Saudi catalogue
              </span>
              <span className="absolute right-0 top-12 h-2 w-2 rounded-full bg-accent-foreground/60" />
            </div>
          </div>
          <div className="absolute -right-28 -top-32 h-[440px] w-[440px] rounded-full border border-primary/[.045] md:right-[5%]" />
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 md:px-12 md:py-24" aria-labelledby="collections-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 md:mb-10">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[.2em] text-muted-foreground">Explore Jacadi</p>
              <h2 id="collections-heading" className="text-3xl text-primary sm:text-[40px]">The collections</h2>
            </div>
            <Link to="/products" className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[.13em] text-primary" data-testid="link-view-all-collections">
              View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featuredCategories.map((category, index) => (
              <CollectionLink key={category.id} category={category} index={index} />
            ))}
          </div>
        </section>

        <section className="bg-secondary/55 py-16 md:py-24" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 md:px-12">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[.2em] text-muted-foreground">Selected from the catalogue</p>
                <h2 id="featured-heading" className="text-3xl text-primary sm:text-[40px]">A first look</h2>
              </div>
              <p className="max-w-[270px] text-xs leading-5 text-muted-foreground">A selection from the Jacadi collection, available to explore online.</p>
            </div>
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4 sm:gap-x-5">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <ProductTile key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="border border-border bg-background px-6 py-12 text-center">
                <h3 className="text-2xl text-primary">Explore the collection</h3>
                <p className="mt-2 text-sm text-muted-foreground">Browse all imported Jacadi pieces.</p>
                <Link to="/products" className="mt-5 inline-flex items-center gap-2 text-sm text-primary" data-testid="link-empty-products">All products <ArrowRight className="h-4 w-4" /></Link>
              </div>
            )}
            <div className="mt-10 text-center">
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center gap-4 border border-primary px-7 text-[11px] font-medium uppercase tracking-[.14em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                data-testid="link-browse-products"
              >
                Browse all products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 md:px-12 md:py-24" aria-labelledby="editorial-heading">
          <div className="mb-9 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[.2em] text-muted-foreground">From Jacadi</p>
              <h2 id="editorial-heading" className="text-3xl text-primary sm:text-[40px]">Stories & savoir-faire</h2>
            </div>
            <Link to="/pages" className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[.13em] text-primary sm:inline-flex" data-testid="link-all-stories">
              All pages <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {editorialPages.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {editorialPages.map((page, index) => (
                <Link
                  key={page.slug}
                  to={`/pages/${page.slug}`}
                  className="group flex min-h-[174px] items-center justify-between gap-7 border-y border-border py-7 first:border-t md:px-5"
                  data-testid={`card-editorial-${page.slug}`}
                >
                  <div>
                    <p className="mb-4 text-[9px] uppercase tracking-[.19em] text-muted-foreground">Jacadi · {String(index + 1).padStart(2, '0')}</p>
                    <h3 className="max-w-[420px] text-2xl text-primary transition-colors group-hover:text-foreground sm:text-[30px]">{page.title}</h3>
                    {page.description && <p className="mt-3 line-clamp-2 max-w-[490px] text-sm leading-6 text-muted-foreground">{page.description}</p>}
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-transform group-hover:translate-x-1">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border-y border-border py-8">
              <Link to="/pages" className="inline-flex items-center gap-2 text-sm text-primary" data-testid="link-editorial-pages">Discover the Jacadi pages <ArrowRight className="h-4 w-4" /></Link>
            </div>
          )}
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:px-12 md:py-12">
            <div className="flex items-center gap-5">
              <span className="jacadi-wordmark text-5xl leading-none text-primary">J</span>
              <div>
                <p className="text-[10px] uppercase tracking-[.19em] text-muted-foreground">Jacadi Paris</p>
                <p className="mt-2 max-w-[620px] text-sm leading-6 text-foreground/80">{homePage?.description}</p>
              </div>
            </div>
            <Link to="/pages/our-story" className="inline-flex shrink-0 items-center gap-3 text-xs font-medium uppercase tracking-[.13em] text-primary" data-testid="link-read-our-story">
              Our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Index;