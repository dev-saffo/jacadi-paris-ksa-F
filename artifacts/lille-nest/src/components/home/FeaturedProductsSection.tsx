import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturedProductsSection() {
  const products = getFeaturedProducts();

  return (
    <section className="py-8 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-4">
            Featured Picks
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Curated organic essentials and developmental toys for every stage
          </p>
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link to="/products">
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
