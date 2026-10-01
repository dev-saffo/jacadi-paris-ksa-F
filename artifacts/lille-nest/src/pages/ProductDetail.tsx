import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ImageGallery } from '@/components/products/ImageGallery';
import { SizeSelector } from '@/components/products/SizeSelector';
import { QuantitySelector } from '@/components/products/QuantitySelector';
import { ProductInfo, ProductActions } from '@/components/products/ProductInfo';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { isProductOutOfStock, products, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  
  const product = products.find((p) => p.slug === slug);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="jacadi-wordmark mb-4 block text-6xl text-primary">Jacadi</span>
            <h1 className="font-display text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the product you're looking for.
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    );
  }

  const sizes = product.sizes;
  const outOfStock = isProductOutOfStock(product);
  
  const category = categories.find((c) => product.categories.includes(c.slug));

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addItem(product, quantity, selectedSize ?? undefined);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
    ...(category ? [{ label: category.name, href: `/products?category=${category.slug}` }] : []),
    { label: product.title },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Product section */}
        <section className="container py-5 md:py-8">
          <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
            {/* Image gallery */}
            <div>
              <ImageGallery images={product.images} productTitle={product.title} />
            </div>

            {/* Product info */}
            <div className="space-y-6 rounded-[1.25rem] border border-border/80 bg-card p-5 sm:p-8 lg:sticky lg:top-28">
              <ProductInfo product={product} />

              {/* Size selector (for clothing) */}
              {sizes.length > 0 && (
                <SizeSelector
                  sizes={sizes}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                />
              )}

              {/* Quantity selector */}
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
              />

              {/* Add to cart */}
              <Button
                size="xl"
                className="w-full"
                onClick={handleAddToCart}
                disabled={outOfStock}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              <ProductActions />
            </div>
          </div>
        </section>

        {/* Related products */}
        <RelatedProducts currentProduct={product} />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default ProductDetail;
