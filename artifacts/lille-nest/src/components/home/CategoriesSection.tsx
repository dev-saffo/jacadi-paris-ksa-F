import { categories } from '@/data/products';
import { CategoryCard } from '@/components/products/CategoryCard';

export function CategoriesSection() {
  return (
    <section className="py-8 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Explore the collections represented in our product catalog.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
