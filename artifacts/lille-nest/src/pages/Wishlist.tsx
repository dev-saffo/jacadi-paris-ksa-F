import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { Share2 } from 'lucide-react';

const Wishlist = () => {
  // Mock wishlist - in real app this would come from context/API
  const [wishlistItems] = useState(products.slice(0, 3));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        </div>

        <section className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} saved items
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share List
            </Button>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <span className="jacadi-wordmark mb-4 block text-6xl text-primary">Jacadi</span>
              <h2 className="font-display text-xl font-semibold mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Save items you love for later!
              </p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Wishlist;
