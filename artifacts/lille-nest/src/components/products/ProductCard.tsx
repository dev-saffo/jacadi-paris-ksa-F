import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/products/ProductImage";

interface ProductCardProps {
  product: Product;
  className?: string;
  viewMode?: "grid" | "list";
}


export function ProductCard({
  product,
  className,
  viewMode = "grid",
}: ProductCardProps) {
  const { addItem } = useCart();
  const category = product.categoryName ?? product.categories[0] ?? "Children";
  const productLink = `/products/${product.slug}`;
  const available = !product.availability || product.availability === "InStock";

  const image = (
    <ProductImage
      src={product.images[0]}
      alt={product.title}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );

  const details = (
    <div className="flex min-w-0 flex-1 flex-col p-4">
      <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
        {category}
      </p>
      <Link to={productLink} className="group/title">
        <h3 className="mb-2 line-clamp-2 font-display font-semibold text-foreground transition-colors group-hover/title:text-primary">
          {product.title}
        </h3>
      </Link>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-foreground">
            {product.currency} {product.price.toFixed(2)}
          </span>
          {product.originalPrice != null && (
            <span className="text-sm text-muted-foreground line-through">
              {product.currency} {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => addItem(product)}
          disabled={!available}
          aria-label={`Add ${product.title} to cart`}
          className="gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          {available ? "Add to cart" : "Unavailable"}
        </Button>
      </div>
    </div>
  );

  if (viewMode === "list") {
    return (
      <article
        className={cn(
          "group flex flex-col overflow-hidden rounded bg-card shadow-soft transition-shadow hover:shadow-card sm:flex-row",
          className,
        )}
      >
        <Link
          to={productLink}
          className="relative block aspect-square shrink-0 overflow-hidden bg-muted sm:w-52"
          aria-label={`View ${product.title}`}
        >
          {image}
        </Link>
        {details}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group overflow-hidden rounded bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card",
        className,
      )}
    >
      <Link
        to={productLink}
        className="block aspect-square overflow-hidden bg-muted"
        aria-label={`View ${product.title}`}
      >
        {image}
      </Link>
      {details}
    </article>
  );
}