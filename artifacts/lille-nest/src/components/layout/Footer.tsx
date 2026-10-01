import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Lock, ShieldCheck } from 'lucide-react';
import { content } from '@/data/content';
import { categories } from '@/data/products';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Sale', href: '/products?filter=sale' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
  ],
  about: [
    { label: 'Nordic Story', href: '/about' },
    { label: 'GOTS & OEKO-TEX®', href: '/sustainability' },
    { label: 'Gift Cards', href: '/gift-cards' },
    { label: 'Editorial Journal', href: '/blog' },
    { label: 'Catalog Pages', href: '/pages' },
  ],
};

export function Footer() {
  const { footer } = content;
  const categoryLinks = categories.slice(0, 4).map((category) => ({
    label: category.name,
    href: `/products?category=${category.slug}`,
  }));
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/images/stitch/lille-nest-logo.png" 
                alt="Lille & Nest" 
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed font-body">
              {footer.description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-base">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-base">Categories</h4>
            <ul className="space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-base">Care & Help</h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-base">Brand</h4>
            <ul className="space-y-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} <span className="font-semibold text-foreground">{footer.copyright}</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span className="flex items-center gap-1.5 text-secondary font-medium">
              <ShieldCheck className="h-4 w-4" />
              OEKO-TEX® Certified
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              Encrypted Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
