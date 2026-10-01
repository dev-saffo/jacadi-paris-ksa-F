import { Link } from 'react-router-dom';
import { Category } from '@/types/product';
import { CatalogImage } from '@/components/products/CatalogImage';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/components/products/ProductImage';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className={cn(
        "group relative flex items-center justify-between gap-6 p-6 rounded transition-all duration-300 hover:-translate-y-2 hover:shadow-card overflow-hidden min-h-[120px]",
        category.color,
        className
      )}
    >
      {/* Left: Category Image and Name */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-shrink-0">
          <CatalogImage
            src={category.image}
            alt={category.name}
            className="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20"
            fallbackClassName="rounded-md"
          />
        </div>
        <h3 className="font-display font-normal text-foreground text-xl">
          {category.name}
        </h3>
      </div>
      
      {/* Right: Product Count with border and bg */}
      <div className="flex-shrink-0 bg-primary text-primary-foreground border-2 border-primary-foreground/20 rounded px-4 py-2 font-bold">
        {category.productCount}
      </div>
    </Link>
  );
}
