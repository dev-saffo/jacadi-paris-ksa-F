import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const dataDirectory = resolve(scriptDirectory, "../src/data");
const catalog = JSON.parse(
  readFileSync(resolve(dataDirectory, "jacadi-catalog.json"), "utf8"),
);

const categoryStats = new Map();
for (const product of catalog.products) {
  for (const slug of new Set(product.categories ?? [])) {
    const stats = categoryStats.get(slug) ?? { productCount: 0 };
    stats.productCount += 1;
    if (stats.image === undefined && product.images?.length) {
      stats.image = product.images[0];
    }
    categoryStats.set(slug, stats);
  }
}

const rankedCategories = catalog.categories
  .map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    productCount: categoryStats.get(category.slug)?.productCount ?? 0,
    image: categoryStats.get(category.slug)?.image,
  }))
  .filter((category) => category.productCount > 0)
  .sort((a, b) => b.productCount - a.productCount);

const sourcePages = [
  catalog.home,
  ...catalog.pages.filter((page) => page.slug !== catalog.home.slug),
];
const pagesBySlug = new Map(sourcePages.map((page) => [page.slug, page]));
const editorialSlugs = [
  "back-to-school",
  "special-occasions-collection",
  "newborn-gift",
  "the-care-of-fine-materials",
];
const footerPageSlugs = [
  "our-story",
  "sustainable-elegance",
  "jacadi-stores",
  "customer-service",
  "faq",
  "shipping",
  "returns",
];

const summary = {
  productCount: catalog.products.length,
  homeDescription: catalog.home.description,
  featuredProducts: catalog.products.slice(0, 4).map((product) => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    categoryName: product.categoryName,
    image: product.images?.[0],
  })),
  featuredCategories: rankedCategories.slice(0, 4),
  navigationCategories: rankedCategories.slice(0, 2).map(({ name, slug }) => ({
    name,
    slug,
  })),
  footerCategories: rankedCategories.slice(0, 5).map(({ name, slug }) => ({
    name,
    slug,
  })),
  footerPages: footerPageSlugs
    .map((slug) => pagesBySlug.get(slug))
    .filter(Boolean)
    .map(({ slug, title }) => ({ slug, title })),
  editorialPages: editorialSlugs
    .map((slug) => pagesBySlug.get(slug))
    .filter(Boolean)
    .map((page) => ({
      slug: page.slug,
      title: page.title,
      description: page.description,
      image: page.images?.[0],
    })),
};

const outputPath = resolve(dataDirectory, "jacadi-home.json");
const output = `${JSON.stringify(summary)}\n`;
if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== output) {
  writeFileSync(outputPath, output);
}