import type { ImgHTMLAttributes } from "react";

export const product = {
  id: "212014",
  title: "Baby bonnet and mittens set",
  slug: "baby-bonnet-and-mittens-set",
  categoryName: "Accessories",
  price: 99,
  currency: "SAR",
  sizes: ["39", "41", "43"],
  images: [
    "https://www.jacadi.sa/2811872-large_default/baby-bonnet-and-mittens-set.jpg",
    "https://www.jacadi.sa/2811873-medium_default/baby-bonnet-and-mittens-set.jpg",
    "https://www.jacadi.sa/2811876-medium_default/baby-bonnet-and-mittens-set.jpg",
  ],
};

export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string;
};

export function CatalogPhoto({ src, alt, className, ...props }: PhotoProps) {
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}