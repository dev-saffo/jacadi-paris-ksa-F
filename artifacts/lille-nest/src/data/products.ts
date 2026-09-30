import catalogJson from "./jacadi-catalog.json";
import { AgeFilter, Category, JacadiCatalog, Product } from "@/types/product";

const catalog = catalogJson as JacadiCatalog;

export const products: Product[] = catalog.products;
export const categories: Category[] = catalog.categories.map((category) => ({
  ...category,
  image: products.find((product) => product.categories.includes(category.slug))?.images[0],
}));
export const ageFilters: AgeFilter[] = [];

export const getProductsByCategory = (categorySlug: string): Product[] =>
  products.filter((product) => product.categories.includes(categorySlug));

export const getFeaturedProducts = (): Product[] =>
  products.filter((product) => product.images.length > 0).slice(0, 8);

export const getNewArrivals = (): Product[] => products.slice(0, 8);

export const getBestsellers = (): Product[] =>
  products.filter((product) => Boolean(product.originalPrice));