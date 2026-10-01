import { useState } from 'react';
import { ArrowUpRight, Heart, Share2, Facebook, Twitter, Link as LinkIcon, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/data/format-money';
import { isProductOutOfStock } from '@/data/products';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
  product: Product;
}

const catalogText = (value: string) =>
  new DOMParser()
    .parseFromString(value, "text/html")
    .body.textContent?.replace(/\s+/g, " ")
    .trim() ?? "";

export function ProductInfo({ product }: ProductInfoProps) {
  const isOnSale =
    product.originalPrice != null && product.originalPrice > product.price;
  const discountPercent = isOnSale && product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const outOfStock = isProductOutOfStock(product);

  return (
    <div className="space-y-4">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.categoryName && <Badge variant="secondary">{product.categoryName}</Badge>}
        {discountPercent > 0 && <Badge variant="sale">{discountPercent}% Off</Badge>}
      </div>

      {/* Title */}
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-foreground">
          {formatMoney(product.price, product.currency)}
        </span>
        {isOnSale && product.originalPrice != null && (
          <span className="text-xl text-muted-foreground line-through">
            {formatMoney(product.originalPrice, product.currency)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {catalogText(product.description)}
      </p>

      {/* Stock */}
      {product.availability && (
        <div className="text-sm">
          {outOfStock ? (
            <span className="font-medium text-destructive">Out of stock</span>
          ) : (
            <span className="font-medium text-secondary">In stock</span>
          )}
        </div>
      )}
      <a
        href={product.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        View product on Jacadi.sa <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

export function ProductActions() {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success('Added to wishlist!', {
        description: 'You can view your wishlist anytime.',
      });
    } else {
      toast.info('Removed from wishlist');
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = document.title;

    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        setShowShareTooltip(false);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareTooltip(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={cn(
          "flex items-center gap-2 text-sm transition-colors",
          isWishlisted
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("h-5 w-5", isWishlisted && "fill-primary")} />
        <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
      </button>

      {/* Share Button with Tooltip */}
      <div className="relative">
        <button
          onClick={() => setShowShareTooltip(!showShareTooltip)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          aria-label="Share product"
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>

        {/* Share Tooltip */}
        {showShareTooltip && (
          <>
            {/* Backdrop to close tooltip */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowShareTooltip(false)}
            />
            <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded shadow-lg p-3 z-20 min-w-[200px]">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Share via:</p>
              <div className="space-y-1">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-left"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-left"
                >
                  <Twitter className="h-4 w-4 text-sky-500" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-left"
                >
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-left"
                >
                  <LinkIcon className="h-4 w-4 text-primary" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
