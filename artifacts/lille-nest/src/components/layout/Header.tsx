import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, User } from 'lucide-react';
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
  const navLinks = [
    { label: 'Shop All', href: '/products' },
    ...categories.slice(0, 3).map((category) => ({
      label: category.name,
      href: `/products?category=${category.slug}`,
    })),
    { label: 'Sale', href: '/products?filter=sale' },
  ];

  const isActiveLink = (href: string) => {
    const currentPath = location.pathname + location.search;
    return currentPath === href || (href !== '/products' && currentPath.startsWith(href));
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container">
        {/* Top bar - Infinite scrolling announcement */}
        <div className="hidden md:block relative overflow-hidden py-2 text-sm text-muted-foreground">
          <div className="flex animate-scroll whitespace-nowrap">
            <span className="inline-block px-4">✨ Free shipping on orders over $50 • Easy 30-day returns</span>
            <span className="inline-block px-4">✨ Free shipping on orders over $50 • Easy 30-day returns</span>
            <span className="inline-block px-4">✨ Free shipping on orders over $50 • Easy 30-day returns</span>
            <span className="inline-block px-4">✨ Free shipping on orders over $50 • Easy 30-day returns</span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center -ml-2 md:ml-0">
            <img 
              src="/images/stitch/lille-nest-logo.png" 
              alt="Lille & Nest" 
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "max-w-44 truncate rounded px-3 py-2 text-sm font-medium transition-colors",
                  isActiveLink(link.href)
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/80 hover:text-primary hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 md:gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild aria-label="Search">
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9" asChild aria-label="Wishlist">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9" asChild aria-label="Account">
              <Link to="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={toggleCart}
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-bounce-in">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-3 text-base font-medium transition-colors rounded",
                  isActiveLink(link.href)
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/80 hover:text-primary hover:bg-muted"
                )}
                onClick={() => setMobileMenuOpen(false)}
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
