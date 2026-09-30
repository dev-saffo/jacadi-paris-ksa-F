import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { ProductCard } from '@/components/products/ProductCard';
import { products, categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Grid3X3, List, ChevronDown, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Update selected category when URL parameter changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.categories.includes(selectedCategory));
    }

    if (filterParam === 'sale') {
      result = result.filter(p => p.originalPrice);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, filterParam, sortBy]);

  const getPageTitle = () => {
    if (filterParam === 'sale') return 'Sale';
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      return cat ? cat.name : 'Products';
    }
    return 'All Products';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        {/* Page header */}
        <div className="bg-background border-b border-border py-8">
          <div className="container">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {getPageTitle()}
              </h1>
              <div className="bg-primary text-primary-foreground border-2 border-primary-foreground/20 rounded px-4 py-2 font-bold text-lg">
                {filteredProducts.length}
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              variant={selectedCategory === null ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="h-auto py-3 px-4"
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(cat.slug)}
                className="flex items-center justify-between gap-4 h-auto py-3 px-4 min-w-[200px]"
              >
                <div className="flex items-center gap-2">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-semibold">{cat.name}</span>
                </div>
                <span className="bg-primary text-primary-foreground border-2 border-primary-foreground/20 rounded px-3 py-1 text-xs font-bold">
                  {cat.productCount}
                </span>
              </Button>
            ))}
          </div>

          {/* Sort & view controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {sortBy === 'default' && 'Recommended'}
                  {sortBy === 'price-low' && 'Price: Low to High'}
                  {sortBy === 'price-high' && 'Price: High to Low'}
                </span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", sortDropdownOpen && "rotate-180")} />
              </Button>
              
              {/* Dropdown Menu */}
              {sortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded shadow-lg z-20 overflow-hidden">
                    {[
                      { value: 'default', label: 'Recommended' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors",
                          sortBy === option.value
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? 'soft' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className="h-9 w-9"
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'soft' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className="h-9 w-9"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded blur-2xl" />
                  <div className="relative flex items-center justify-center w-24 h-24 rounded bg-muted">
                    <SearchX className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                No products found
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We couldn't find any products matching your filters. Try adjusting your search criteria.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory(null);
                }}
                variant="default"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-6",
                viewMode === 'grid'
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Products;
