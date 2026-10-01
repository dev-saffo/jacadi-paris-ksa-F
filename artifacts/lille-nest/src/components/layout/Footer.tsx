import { Link } from 'react-router-dom';
import { categories, sourcePages } from '@/data/products';

export function Footer() {
  const categoryLinks = categories.slice(0, 5).map((category) => ({
    label: category.name,
    href: `/products?category=${encodeURIComponent(category.slug)}`,
  }));
  const pageGroups = [
    {
      heading: 'Jacadi',
      pages: ['our-story', 'sustainable-elegance', 'jacadi-stores'],
    },
    {
      heading: 'Information',
      pages: ['customer-service', 'faq', 'shipping', 'returns'],
    },
  ].map((group) => ({
    ...group,
    links: group.pages
      .map((slug) => sourcePages.find((page) => page.slug === slug))
      .filter((page): page is (typeof sourcePages)[number] => Boolean(page)),
  }));
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-5 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-5 inline-flex flex-col items-center leading-none" aria-label="Jacadi Paris home" data-testid="link-footer-home">
              <span className="jacadi-wordmark text-[46px] leading-[.74] text-primary">Jacadi</span>
              <span className="mt-2 text-[8px] tracking-[.44em] text-muted-foreground">PARIS</span>
            </Link>
            <p className="max-w-[250px] text-sm leading-6 text-muted-foreground">
              {sourcePages.find((page) => page.slug === 'home')?.description}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[.15em] text-foreground">Collections</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-sm text-muted-foreground transition-colors hover:text-primary" data-testid="link-footer-all-products">All collections</Link></li>
              <li><Link to="/pages/outlet" className="text-sm text-accent-foreground transition-colors hover:underline" data-testid="link-footer-outlet">Outlet</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[.15em] text-foreground">Categories</h4>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary" data-testid={`link-footer-category-${link.label.toLowerCase().replace(/\W+/g, '-')}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {pageGroups.map((group) => (
            <div key={group.heading}>
              <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[.15em] text-foreground">{group.heading}</h4>
              <ul className="space-y-3">
                {group.links.map((page) => (
                <li key={page.slug}>
                  <Link to={`/pages/${page.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-primary" data-testid={`link-footer-page-${page.slug}`}>
                    {page.title}
                  </Link>
                </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs tracking-wide text-muted-foreground">
            © {new Date().getFullYear()} Jacadi Paris
          </p>
          <Link to="/pages/privacy-policy" className="text-xs text-muted-foreground transition-colors hover:text-primary" data-testid="link-footer-privacy">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
