import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CatalogImage } from "@/components/products/CatalogImage";
import { formatMoney, isProductOutOfStock } from "@/data/products";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const isList = viewMode === "list";
  const isOnSale =
    product.originalPrice != null && product.originalPrice > product.price;

  return (
    <Link
      to={`/products/${product.slug}`}
      data-testid={`card-product-${product.id}`}
      className={cn(
        "group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isList ? "flex gap-4 p-3 sm:gap-6 sm:p-4" : "flex h-full flex-col",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          isList
            ? "aspect-square w-28 flex-none rounded sm:w-40"
            : "aspect-[4/5] w-full",
        )}
      >
        <CatalogImage
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {isOnSale && (
          <Badge className="absolute left-3 top-3" variant="sale">
            Sale
          </Badge>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", isList ? "py-1" : "p-4")}>
        {product.categoryName && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.categoryName}
          </span>
        )}
        <h3 className="line-clamp-2 font-display text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg">
          {product.title}
        </h3>
        {product.sizes.length > 0 && (
          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
            Sizes: {product.sizes.join(", ")}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-4">
          <span className="font-display font-bold text-foreground">
            {formatMoney(product.price, product.currency)}
          </span>
          {isOnSale && product.originalPrice != null && (
            <span className="text-sm text-muted-foreground line-through">
              {formatMoney(product.originalPrice, product.currency)}
            </span>
          )}
        </div>
        {isProductOutOfStock(product) && (
          <span className="mt-2 text-xs font-medium text-destructive">
            Out of stock
          </span>
        )}
      </div>
    </Link>
  );
}