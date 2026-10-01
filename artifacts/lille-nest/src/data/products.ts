import catalogJson from "./jacadi-catalog.json";
import type { Category, JacadiCatalog, Product, SourcePage } from "@/types/product";

const catalog = catalogJson as JacadiCatalog;

export const products: Product[] = catalog.products;
const categoryStats = new Map<
  string,
  { productCount: number; image?: string }
>();

for (const product of products) {
  for (const slug of new Set(product.categories)) {
    const stats = categoryStats.get(slug) ?? { productCount: 0 };
    stats.productCount += 1;
    if (stats.image === undefined && product.images.length > 0) {
      stats.image = product.images[0];
    }
    categoryStats.set(slug, stats);
  }
}

export const categories: Category[] = catalog.categories
  .map((category) => ({
    ...category,
    productCount: categoryStats.get(category.slug)?.productCount ?? 0,
    image: categoryStats.get(category.slug)?.image,
  }))
  .filter((category) => category.productCount > 0)
  .sort((a, b) => b.productCount - a.productCount);

export const sourcePages: SourcePage[] = [
  catalog.home,
  ...catalog.pages.filter((page) => page.slug !== catalog.home.slug),
];

export const isProductOutOfStock = (product: Product): boolean =>
  product.availability?.toLowerCase() === "outofstock";

export const getProductsByCategory = (categorySlug: string): Product[] =>
  products.filter((product) => product.categories.includes(categorySlug));

export const getFeaturedProducts = (): Product[] =>
  products.slice(0, 8);