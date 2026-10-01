import { Link } from 'react-router-dom';
import { homeData } from '@/data/home-data';

export function Footer() {
  const categoryLinks = homeData.footerCategories.map((category) => ({
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
      .map((slug) => homeData.footerPages.find((page) => page.slug === slug))
      .filter((page): page is (typeof homeData.footerPages)[number] => Boolean(page)),
  }));
  return (
    <footer id="site-footer" className="border-t border-border bg-secondary/55">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 xl:grid-cols-[1.5fr_1fr_1.1fr_1fr_1fr] xl:gap-12">
          <div className="min-w-0 sm:col-span-2 xl:col-span-1">
            <Link to="/" className="mb-5 inline-flex w-fit flex-col items-start leading-none" aria-label="Jacadi Paris home" data-testid="link-footer-home">
              <span className="jacadi-wordmark text-[44px] leading-[.74] text-primary">Jacadi</span>
              <span className="mt-2 text-[8px] tracking-[.44em] text-muted-foreground">PARIS</span>
            </Link>
            <p className="max-w-md text-sm leading-6 text-muted-foreground xl:max-w-[250px]">
              {homeData.homeDescription}
            </p>
          </div>
          <div className="min-w-0">
            <h4 className="mb-4 text-[11px] font-semibold uppercase leading-4 tracking-[.15em] text-foreground">Collections</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="block break-words text-sm leading-5 text-muted-foreground transition-colors hover:text-primary" data-testid="link-footer-all-products">All collections</Link></li>
              <li><Link to="/pages/outlet" className="block break-words text-sm leading-5 text-accent-foreground transition-colors hover:underline" data-testid="link-footer-outlet">Outlet</Link></li>
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="mb-4 text-[11px] font-semibold uppercase leading-4 tracking-[.15em] text-foreground">Categories</h4>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="block break-words text-sm leading-5 text-muted-foreground transition-colors hover:text-primary" data-testid={`link-footer-category-${link.label.toLowerCase().replace(/\W+/g, '-')}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {pageGroups.map((group) => (
            <div key={group.heading} className="min-w-0">
              <h4 className="mb-4 text-[11px] font-semibold uppercase leading-4 tracking-[.15em] text-foreground">{group.heading}</h4>
              <ul className="space-y-3">
                {group.links.map((page) => (
                  <li key={page.slug}>
                    <Link to={`/pages/${page.slug}`} className="block break-words text-sm leading-5 text-muted-foreground transition-colors hover:text-primary" data-testid={`link-footer-page-${page.slug}`}>
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:mt-12 sm:flex-row sm:items-center">
          <p className="text-xs tracking-wide text-muted-foreground">
            © {new Date().getFullYear()} Jacadi Paris
          </p>
          <Link to="/pages/privacy-policy" className="text-xs text-muted-foreground transition-colors hover:text-primary" data-testid="link-footer-privacy">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
