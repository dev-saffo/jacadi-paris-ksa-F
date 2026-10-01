import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  outOfStock?: string[];
}

export function SizeSelector({ sizes, selectedSize, onSelect, outOfStock = [] }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-foreground">Size</span>
        <span className="text-xs text-muted-foreground">Select from the listed sizes</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isOutOfStock = outOfStock.includes(size);
          return (
            <button
              key={size}
              onClick={() => !isOutOfStock && onSelect(size)}
              disabled={isOutOfStock}
              className={cn(
                "min-w-[3rem] h-10 px-4 rounded border-2 font-medium text-sm transition-all",
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : isOutOfStock
                  ? "border-border bg-muted text-muted-foreground/50 cursor-not-allowed line-through"
                  : "border-border hover:border-primary hover:bg-primary/5"
              )}
              aria-label={`Size ${size}${isOutOfStock ? ' - Out of stock' : ''}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
