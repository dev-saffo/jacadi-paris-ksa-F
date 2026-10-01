import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { categories } from '@/data/products';

export function Header() {
  const { itemCount, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navLinks: { label: string; href: string; sale?: boolean }[] = [
    { label: 'Collections', href: '/products' },
    ...categories.slice(0, 2).map((category) => ({
      label:
        category.slug === 'jumpers-sweatshirts-and-cardigans'
          ? 'Jumpers & cardigans'
          : category.slug === 'bloomers-and-overalls'
            ? 'Bloomers & overalls'
            : category.name,
      href: `/products?category=${category.slug}`,
    })),
    { label: 'Outlet', href: '/pages/outlet', sale: true },
  ];

  const isActiveLink = (href: string) => {
    const currentPath = location.pathname + location.search;
    return currentPath === href || (href === '/products' ? location.pathname === '/products' : currentPath.startsWith(href));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-12">
        <div className="relative flex h-[72px] items-center justify-between md:h-[104px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            data-testid="button-toggle-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/" className="group absolute left-1/2 flex -translate-x-1/2 flex-col items-center leading-none" aria-label="Jacadi Paris home" data-testid="link-brand-home">
            <span className="jacadi-wordmark text-[43px] leading-[.74] text-primary transition-opacity group-hover:opacity-75 md:text-[57px]">Jacadi</span>
            <span className="mt-2 text-[8px] font-medium tracking-[.44em] text-muted-foreground md:text-[9px]">PARIS</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'group flex items-center gap-1 px-3 py-3 text-[11px] font-medium uppercase tracking-[.105em] transition-colors',
                  isActiveLink(link.href)
                    ? 'text-primary'
                    : 'text-foreground/75 hover:text-primary',
                  link.sale && 'text-accent-foreground',
                )}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-0.5 md:gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild aria-label="Search" data-testid="button-search">
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hidden h-9 w-9 sm:flex" asChild aria-label="Wishlist" data-testid="button-wishlist">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={toggleCart}
              aria-label={`Shopping cart with ${itemCount} items`}
              data-testid="button-open-cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        <nav
          className={cn(
            'overflow-hidden transition-[max-height] duration-300 md:hidden',
            mobileMenuOpen ? 'max-h-[420px] pb-4' : 'max-h-0',
          )}
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col border-t border-border pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-3 py-3 text-sm font-medium tracking-wide transition-colors',
                  isActiveLink(link.href)
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-primary',
                  link.sale && 'text-accent-foreground',
                )}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
