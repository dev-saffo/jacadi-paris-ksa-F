export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  categories: string[];
  categoryName?: string;
  sizes: string[];
  colors: { name: string; url: string }[];
  availability?: string;
  sourceUrl: string;
  reference?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  color?: string;
  productCount: number;
  sourceUrl: string;
}

export type AgeGroup = "baby" | "toddler" | "kids" | "tweens";

export interface AgeFilter {
  id: AgeGroup;
  label: string;
  range: { min: number; max: number };
}

export interface ContentBlock {
  type: string;
  text: string;
}

export interface SourcePage {
  slug: string;
  title: string;
  description: string;
  sourceUrl: string;
  blocks: ContentBlock[];
  images: string[];
}

export interface JacadiCatalog {
  source: string;
  fetchedAt: string;
  home: SourcePage;
  categories: Category[];
  products: Product[];
  pages: SourcePage[];
}

export type HomeFeaturedProduct = Pick<
  Product,
  "id" | "title" | "slug" | "price" | "currency" | "categoryName"
> & { image?: string };

export type HomeCategorySummary = Pick<Category, "id" | "name" | "slug"> & {
  productCount: number;
  image?: string;
};

export type HomeEditorialPage = Pick<
  SourcePage,
  "slug" | "title" | "description"
> & { image?: string };

export interface HomeCatalogSummary {
  productCount: number;
  homeDescription: string;
  featuredProducts: HomeFeaturedProduct[];
  featuredCategories: HomeCategorySummary[];
  navigationCategories: Pick<Category, "name" | "slug">[];
  footerCategories: Pick<Category, "name" | "slug">[];
  footerPages: Pick<SourcePage, "slug" | "title">[];
  editorialPages: HomeEditorialPage[];
}
