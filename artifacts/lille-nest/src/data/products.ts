import catalogJson from "./jacadi-catalog.json";
import { Category, JacadiCatalog, Product, SourcePage } from "@/types/product";

const catalog = catalogJson as JacadiCatalog;

export const products: Product[] = catalog.products;
export const categories: Category[] = catalog.categories
  .map((category) => {
    const categoryProducts = products.filter((product) =>
      product.categories.includes(category.slug),
    );

    return {
      ...category,
      productCount: categoryProducts.length,
      image: categoryProducts.find((product) => product.images.length > 0)?.images[0],
    };
  })
  .filter((category) => category.productCount > 0)
  .sort((a, b) => b.productCount - a.productCount);

export const sourcePages: SourcePage[] = [
  catalog.home,
  ...catalog.pages.filter((page) => page.slug !== catalog.home.slug),
];

export const formatMoney = (amount: number, currency: string): string =>
  new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export const isProductOutOfStock = (product: Product): boolean =>
  product.availability?.toLowerCase() === "outofstock";

export const getProductsByCategory = (categorySlug: string): Product[] =>
  products.filter((product) => product.categories.includes(categorySlug));

export const getFeaturedProducts = (): Product[] =>
  products.slice(0, 8);