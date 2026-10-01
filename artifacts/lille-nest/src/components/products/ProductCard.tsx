import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CatalogImage } from "@/components/products/CatalogImage";
import { formatMoney, isProductOutOfStock } from "@/data/products";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import type { ImgHTMLAttributes } from "react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  imageLoading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
}

export function ProductCard({
  product,
  viewMode = "grid",
  imageLoading = "lazy",
}: ProductCardProps) {
  const isList = viewMode === "list";
  const isOnSale =
    product.originalPrice != null && product.originalPrice > product.price;
  const productImages = product.images.filter(Boolean);
  const alternateImage = productImages[1];

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
          "relative overflow-hidden bg-secondary/50",
          isList
            ? "aspect-square w-28 flex-none rounded sm:w-40"
            : "aspect-[4/5] w-full",
        )}
      >
        <CatalogImage
          src={productImages[0]}
          alt={product.title}
          loading={imageLoading}
          className={cn(
            "h-full w-full object-contain p-2 transition-all duration-300 sm:p-3",
            alternateImage && "group-hover:opacity-0 group-focus-visible:opacity-0",
          )}
        />
        {alternateImage && (
          <CatalogImage
            src={alternateImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-3"
          />
        )}
        {productImages.length > 1 && (
          <span
            className="absolute bottom-3 left-3 rounded-full border border-white/80 bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground shadow-sm backdrop-blur-sm"
            data-testid={`text-product-image-count-${product.id}`}
          >
            {productImages.length} photos
          </span>
        )}
        {isOnSale && (
          <Badge className="absolute right-3 top-3" variant="sale">
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